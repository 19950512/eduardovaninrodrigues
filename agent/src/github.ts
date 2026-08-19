/**
 * Integração com o GitHub via Git Data API.
 *
 * Publicar um rascunho = criar UMA branch com um commit atômico que
 * (a) adiciona src/content/artigos/<slug>.ts e (b) insere 2 linhas no
 * index.ts, e então abrir um Pull Request. Aprovar = fazer merge do PR
 * (o CI/Cloudflare faz o deploy). Recusar = fechar o PR e apagar a branch.
 */
import { CONFIG } from "./config";
import { renderArtigoFile, inserirNoIndex } from "./render";
import { randomToken } from "./util";
import type { Env, ArtigoDraft } from "./types";

const API = "https://api.github.com";

function headers(env: Env): HeadersInit {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "EduardoVaninAgente/1.0",
    "Content-Type": "application/json",
  };
}

async function gh<T>(env: Env, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: headers(env),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GitHub ${method} ${path} -> ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

const repoPath = () => `/repos/${CONFIG.repo.owner}/${CONFIG.repo.name}`;

export interface PRCriado {
  prNumber: number;
  prUrl: string;
  branch: string;
}

/** Cria a branch + commit (arquivo do artigo + edição do index) + PR. */
export async function criarRascunhoPR(env: Env, draft: ArtigoDraft): Promise<PRCriado> {
  const base = CONFIG.repo.baseBranch;

  // 1) SHA do topo da base e da árvore correspondente.
  const ref = await gh<{ object: { sha: string } }>(env, "GET", `${repoPath()}/git/ref/heads/${base}`);
  const baseSha = ref.object.sha;
  const baseCommit = await gh<{ tree: { sha: string } }>(env, "GET", `${repoPath()}/git/commits/${baseSha}`);
  const baseTree = baseCommit.tree.sha;

  // 2) index.ts atual -> inserir as 2 linhas.
  const indexAtual = await lerArquivo(env, CONFIG.paths.indexFile, base);
  const novoIndex = inserirNoIndex(indexAtual, draft);
  const artigoPath = `${CONFIG.paths.artigosDir}/${draft.slug}.ts`;
  const artigoConteudo = renderArtigoFile(draft);

  // 3) blobs.
  const blobArtigo = await gh<{ sha: string }>(env, "POST", `${repoPath()}/git/blobs`, {
    content: artigoConteudo,
    encoding: "utf-8",
  });
  const blobIndex = await gh<{ sha: string }>(env, "POST", `${repoPath()}/git/blobs`, {
    content: novoIndex,
    encoding: "utf-8",
  });

  // 4) árvore + commit.
  const tree = await gh<{ sha: string }>(env, "POST", `${repoPath()}/git/trees`, {
    base_tree: baseTree,
    tree: [
      { path: artigoPath, mode: "100644", type: "blob", sha: blobArtigo.sha },
      { path: CONFIG.paths.indexFile, mode: "100644", type: "blob", sha: blobIndex.sha },
    ],
  });
  const commit = await gh<{ sha: string }>(env, "POST", `${repoPath()}/git/commits`, {
    message: `Artigo: ${draft.titulo}\n\nGerado pelo agente de conteúdo para revisão.`,
    tree: tree.sha,
    parents: [baseSha],
  });

  // 5) branch (com sufixo de data; adiciona aleatório se colidir).
  const branch = await criarBranch(env, draft.slug, commit.sha);

  // 6) PR.
  const pr = await gh<{ number: number; html_url: string }>(env, "POST", `${repoPath()}/pulls`, {
    title: `Artigo: ${draft.titulo}`,
    head: branch,
    base,
    body: corpoPR(draft),
  });

  return { prNumber: pr.number, prUrl: pr.html_url, branch };
}

async function criarBranch(env: Env, slug: string, sha: string): Promise<string> {
  const dia = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let nome = `${CONFIG.repo.branchPrefix}${slug}-${dia}`;
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    try {
      await gh(env, "POST", `${repoPath()}/git/refs`, { ref: `refs/heads/${nome}`, sha });
      return nome;
    } catch (e) {
      if (!String((e as Error).message).includes("422")) throw e;
      nome = `${CONFIG.repo.branchPrefix}${slug}-${dia}-${randomToken(2)}`;
    }
  }
  throw new Error("Não foi possível criar a branch (colisão de nome).");
}

/** Merge do PR (aprovação). Usa squash. */
export async function aprovarPR(env: Env, prNumber: number, branch: string): Promise<void> {
  await gh(env, "PUT", `${repoPath()}/pulls/${prNumber}/merge`, {
    merge_method: "squash",
  });
  await apagarBranch(env, branch);
}

/** Fecha o PR e apaga a branch (recusa). */
export async function recusarPR(env: Env, prNumber: number, branch: string): Promise<void> {
  await gh(env, "PATCH", `${repoPath()}/pulls/${prNumber}`, { state: "closed" });
  await apagarBranch(env, branch);
}

async function apagarBranch(env: Env, branch: string): Promise<void> {
  try {
    await gh(env, "DELETE", `${repoPath()}/git/refs/heads/${branch}`);
  } catch (e) {
    console.warn(`Não consegui apagar a branch ${branch}:`, (e as Error).message);
  }
}

async function lerArquivo(env: Env, path: string, ref: string): Promise<string> {
  const data = await gh<{ content: string; encoding: string }>(
    env,
    "GET",
    `${repoPath()}/contents/${path}?ref=${ref}`,
  );
  const b64 = data.content.replace(/\n/g, "");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function corpoPR(draft: ArtigoDraft): string {
  return [
    `**Artigo gerado automaticamente para revisão.**`,
    ``,
    `- **Título:** ${draft.titulo}`,
    `- **Categoria:** ${draft.categoria}`,
    `- **Slug:** \`${draft.slug}\``,
    `- **Data:** ${draft.data}`,
    ``,
    `**Resumo:** ${draft.resumo}`,
    ``,
    `---`,
    `Aprovação/recusa pelo WhatsApp. Ao aprovar, este PR recebe *merge* e o site é publicado automaticamente.`,
  ].join("\n");
}
