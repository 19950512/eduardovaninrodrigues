/** Estado do agente em Workers KV. Sem banco, sem servidor. */
import type { Env, Pendente } from "./types";

const K_LAST_RUN = "lastRunAt";
const K_SEEN_PREFIX = "seen:"; // seen:<hashUrl> => "1"
const K_PENDING_PREFIX = "pending:"; // pending:<token> => Pendente
const K_LAST_SLUGS = "lastSlugs"; // slugs publicados recentemente (para "relacionados")

export async function getLastRun(env: Env): Promise<Date | null> {
  const v = await env.AGENTE_KV.get(K_LAST_RUN);
  return v ? new Date(v) : null;
}

export async function setLastRun(env: Env, when: Date): Promise<void> {
  await env.AGENTE_KV.put(K_LAST_RUN, when.toISOString());
}

/** true se a notícia já foi vista antes (dedup). Marca como vista se ainda não. */
export async function jaVista(env: Env, url: string): Promise<boolean> {
  const key = K_SEEN_PREFIX + (await shortHash(url));
  const existe = await env.AGENTE_KV.get(key);
  if (existe) return true;
  // expira em 60 dias — histórico de dedup não precisa ser eterno
  await env.AGENTE_KV.put(key, "1", { expirationTtl: 60 * 24 * 3600 });
  return false;
}

export async function salvarPendente(env: Env, p: Pendente): Promise<void> {
  // pendências expiram em 30 dias caso o advogado nunca responda
  await env.AGENTE_KV.put(K_PENDING_PREFIX + p.token, JSON.stringify(p), {
    expirationTtl: 30 * 24 * 3600,
  });
}

export async function lerPendente(env: Env, token: string): Promise<Pendente | null> {
  const v = await env.AGENTE_KV.get(K_PENDING_PREFIX + token);
  return v ? (JSON.parse(v) as Pendente) : null;
}

export async function removerPendente(env: Env, token: string): Promise<void> {
  await env.AGENTE_KV.delete(K_PENDING_PREFIX + token);
}

export async function getLastSlugs(env: Env): Promise<string[]> {
  const v = await env.AGENTE_KV.get(K_LAST_SLUGS);
  return v ? (JSON.parse(v) as string[]) : [];
}

export async function pushLastSlug(env: Env, slug: string): Promise<void> {
  const atuais = await getLastSlugs(env);
  const novo = [slug, ...atuais.filter((s) => s !== slug)].slice(0, 6);
  await env.AGENTE_KV.put(K_LAST_SLUGS, JSON.stringify(novo));
}

async function shortHash(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}
