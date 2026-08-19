# Agente de conteúdo — Eduardo Vanin Rodrigues

Agente que, a cada 3 dias, lê notícias jurídicas criminais das fontes
configuradas, gera um artigo informativo **na voz do advogado e com travas
de publicidade da OAB**, abre um **Pull Request** no repositório do site e
notifica o Dr. Eduardo no **WhatsApp** com botões **Aprovar / Recusar**.
Ao aprovar, o PR recebe *merge* e o site publica automaticamente (deploy do
Cloudflare). Recusar fecha o PR. Sem banco de dados e sem servidor: todo o
estado vive no Cloudflare Workers KV, e o conteúdo publicado vira código no
próprio repositório.

```
cron (diário)                    WhatsApp do advogado
     │                                   ▲   │ toca botão
     ▼                                   │   ▼
┌──────────────────────────────────────────────────────────┐
│  Cloudflare Worker (este projeto)                          │
│                                                            │
│  scheduled():                     fetch() /webhook:        │
│   1. coleta notícias (RSS/HTML)    - valida assinatura     │
│   2. gera artigo (Claude + OAB)    - Aprovar → merge PR    │
│   3. abre PR no GitHub             - Recusar → fecha PR    │
│   4. envia template WhatsApp       - confirma no WhatsApp  │
└──────────────────────────────────────────────────────────┘
     │                                   │
     ▼                                   ▼
  GitHub (PR)  ───── merge ─────►  Cloudflare deploy → site no ar
```

## O que muda no site (já aplicado neste repositório)

O conteúdo de artigos foi separado em **1 arquivo por post** para que o agente
publique com segurança:

- `src/content/artigos/types.ts` — o tipo `Artigo`.
- `src/content/artigos/<slug>.ts` — um arquivo por artigo.
- `src/content/artigos/index.ts` — agrega os artigos; contém as **âncoras**
  `AGENT-IMPORTS` e `AGENT-REGISTRO` onde o agente insere 2 linhas.
- `src/content/artigos.ts` — passou a ser só a **API pública** (re-exporta
  `artigos`, `getArtigoBySlug`, `getArtigosRelacionados`, tipo `Artigo`), então
  nenhum outro import do site mudou.
- `public/images/artigos/default-cover.jpg` — capa padrão (neutra, na marca)
  usada nos artigos gerados, já que não há foto nova por post.
- `tsconfig.json` / `eslint.config.mjs` — passam a **ignorar `agent/`** (é um
  projeto separado, com tipos do Cloudflare).

Publicar um artigo = um commit que cria `src/content/artigos/<slug>.ts` e
insere 2 linhas no `index.ts`. Simples de revisar no diff do PR.

---

## Setup

Pré-requisitos: Node 18+, conta Cloudflare (Workers), app no Meta for
Developers com o produto WhatsApp, e um token do GitHub.

### 1. Instalar e criar o KV

```bash
cd agent
npm install
npx wrangler login
npx wrangler kv namespace create AGENTE_KV
```

Copie o `id` retornado para o campo `id` em `wrangler.toml`.

### 2. Segredos

Defina cada segredo (produção):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put WHATSAPP_TOKEN
npx wrangler secret put WHATSAPP_PHONE_ID
npx wrangler secret put WHATSAPP_DESTINO        # 5554997007379
npx wrangler secret put WHATSAPP_VERIFY_TOKEN   # uma string à sua escolha
npx wrangler secret put META_APP_SECRET
npx wrangler secret put APPROVAL_SECRET         # openssl rand -hex 32
# opcionais:
npx wrangler secret put ANTHROPIC_MODEL         # id de modelo atual
npx wrangler secret put WHATSAPP_TEMPLATE       # default: novo_artigo
npx wrangler secret put WHATSAPP_TEMPLATE_LANG  # default: pt_BR
```

Para rodar localmente, copie `.dev.vars.example` para `.dev.vars` e preencha.

### 3. Token do GitHub

Crie um **fine-grained personal access token** com acesso **apenas ao repo
`19950512/eduardovaninrodrigues`** e as permissões:

- **Contents: Read and write** (criar branch, blobs, commit)
- **Pull requests: Read and write** (abrir, fechar e dar merge)

> Dica: se preferir não usar seu token pessoal, crie um token de um usuário
> "máquina" ou um GitHub App. O importante são os dois escopos acima.

### 4. Anthropic (Claude)

Gere uma API key em console.anthropic.com e ajuste `ANTHROPIC_MODEL` para o id
de modelo atual disponível na sua conta (os ids mudam ao longo do tempo; o
default no código é `claude-sonnet-4-5`).

### 5. WhatsApp Cloud API (oficial)

No **Meta for Developers**: crie/use um app, adicione o produto **WhatsApp**,
associe um número (o do escritório) e anote:

- **Phone Number ID** → `WHATSAPP_PHONE_ID`
- **Token permanente** (crie um *System User* no Business Manager com acesso ao
  app e gere um token que não expira) → `WHATSAPP_TOKEN`
- **App Secret** (Configurações do app → Básico) → `META_APP_SECRET`

#### Template do WhatsApp (precisa ser aprovado antes de usar)

Em **WhatsApp Manager → Modelos de mensagem**, crie um template:

- **Nome:** `novo_artigo`  (categoria **Utility**, idioma **Português (BR)**)
- **Corpo** (3 variáveis):

  ```
  📝 Novo artigo para revisão

  *{{1}}*

  {{2}}

  Prévia/PR: {{3}}
  ```

- **Botões → Resposta rápida** (dois):
  - Botão 1: texto **Aprovar**
  - Botão 2: texto **Recusar**

O agente preenche `{{1}}`=título, `{{2}}`=resumo, `{{3}}`=URL do PR, e injeta o
*payload* de cada botão (`APROVAR:<token>` / `RECUSAR:<token>`) no envio.

> Enquanto o template não é aprovado pela Meta, você pode testar respondendo
> qualquer mensagem do advogado para abrir a janela de 24h — mas o fluxo
> agendado depende do template aprovado.

### 6. Deploy

```bash
npx wrangler deploy
```

Anote a URL do Worker (algo como
`https://eduardo-vanin-agente.<seu-subdominio>.workers.dev`).

### 7. Webhook do WhatsApp

No app do Meta → **WhatsApp → Configuração da API → Webhook**:

- **Callback URL:** `https://.../webhook`
- **Verify token:** o mesmo valor de `WHATSAPP_VERIFY_TOKEN`
- Após verificar, **assine o campo `messages`**.

O Worker responde ao GET de verificação e valida a assinatura
`X-Hub-Signature-256` de cada POST com o `META_APP_SECRET`.

---

## Cadência

- O cron roda **diariamente** (`0 12 * * *` = 09:00 BRT).
- A cadência real (**a cada `CONFIG.cadenciaDias` dias**, default 3) é
  controlada no código via KV. Assim, se um dia não houver notícia nova ou o
  modelo decidir pular, o agente tenta de novo no dia seguinte sem "furar" o
  intervalo de 3 dias entre propostas.

Ajuste `cadenciaDias`, `maxNoticias`, `janelaHoras` e as `FONTES` em
`src/config.ts`.

## Fontes de notícia

Configuradas em `src/config.ts` (as 4 confirmadas): Conjur (Criminal, via RSS
`/feed/` com fallback HTML), Migalhas Quentes, IBCCRIM Contraponto Criminal e
Criminal Player (agregador). Cada fonte HTML usa uma regex `match` para separar
links de artigo do resto da página. Para adicionar/remover fontes, edite a
lista `FONTES`.

## Guardrails da OAB

O `src/oab.ts` traz o *system prompt* com as travas do Provimento 205/2021 e do
Código de Ética: o artigo aborda o **tema jurídico** que a notícia levanta (de
forma geral e atemporal), **nunca** relata o caso concreto, não cita nomes,
não promete resultado, não faz captação nem sensacionalismo, e sempre encerra
com o parágrafo informativo padrão. **A aprovação humana do advogado continua
sendo a checagem final** — o prompt reduz o risco, não o elimina.

## Testar

```bash
npm run typecheck                 # checagem de tipos
npm run dev                       # roda local (usa .dev.vars)
npm run cron:test                 # habilita disparo manual do scheduled
# com o dev rodando, dispare o cron:
curl "http://localhost:8787/__scheduled?cron=0+12+*+*+*"
npm run tail                      # logs em produção
```

Para testar só a decisão sem esperar o WhatsApp, use os **links assinados de
fallback** (gere a assinatura com `APPROVAL_SECRET`):
`/aprovar?token=<t>&sig=<hmacSHA256(APPROVAL_SECRET, "APROVAR:<t>")>`.

## Estrutura

```
agent/
├── wrangler.toml         # config do Worker: cron + binding KV
├── src/
│   ├── index.ts          # entrypoint: scheduled() + fetch() (webhook)
│   ├── config.ts         # FONTES + parâmetros (cadência, repo, caminhos)
│   ├── news.ts           # coleta RSS + scraping HTML (HTMLRewriter)
│   ├── generate.ts       # chamada à API do Claude
│   ├── oab.ts            # system prompt: voz + travas OAB
│   ├── github.ts         # Git Data API: branch/commit/PR, merge, close
│   ├── whatsapp.ts       # Cloud API: template c/ botões, webhook, assinatura
│   ├── render.ts         # rascunho → arquivo .ts + inserção no index.ts
│   ├── store.ts          # estado em KV (cadência, dedup, pendentes)
│   ├── util.ts           # slug, datas, HMAC, etc.
│   └── types.ts          # Env (bindings/segredos) e tipos
└── .dev.vars.example
```
