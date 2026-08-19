# Site institucional — Eduardo Vanin Rodrigues | Advocacia Criminal

Site institucional em Next.js (App Router) + TypeScript + Tailwind CSS, construído a partir do spec fornecido.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

Para gerar o build de produção:

```bash
npm run build
npm run start
```

## Pendências antes de publicar em produção

Este projeto está funcionalmente completo (todas as páginas, tema claro/escuro, SEO técnico, galeria, artigos, formulário de contato), mas alguns dados e conteúdos **são placeholders propositais** e precisam ser substituídos antes do lançamento:

### 1. Dados de contato — `src/lib/config.ts`
Todos os campos marcados com `[PENDENTE]` precisam ser preenchidos com dados reais:
- Telefone e WhatsApp (número em formato E.164)
- E-mail profissional
- Endereço completo do escritório (e, se desejado, `googleMapsEmbedUrl` para exibir o mapa em `/contato`)
- Redes sociais oficiais (Instagram, LinkedIn, Facebook — deixe em branco `""` a rede que não existir, que ela some automaticamente do Header/Footer)
- Confirmar `site.url` com o domínio definitivo antes do deploy (usado em canonical, sitemap, Open Graph e JSON-LD)

Nome completo, título profissional, OAB/RS 133.074 e formação acadêmica **já foram confirmados via pesquisa pública** (site e blog oficiais do advogado) e estão preenchidos.

### 2. Fotografias
- 4 das 6 fotos recebidas estão em uso (`public/images/people` e `public/images/gallery`).
- 2 fotos foram **deliberadamente excluídas** por precaução ética/legal — estão preservadas em `public/images/source/` para revisão:
  - Uma mostra um abraço com um policial identificável ao fundo (pode ser lida como alusão a resultado de caso, o que a publicidade da OAB restringe, além de expor terceiro sem consentimento visível).
  - Outra tem, em segundo plano, um slide com dados legíveis de um "Termo de Interrogatório" (possível exposição de dado de processo).
- Se o cliente autorizar o uso (com ou sem recorte/borrão da parte sensível), é só adicionar aos arrays em `src/content/galeria.ts`.
- Mais fotos podem ser adicionadas livremente aos mesmos diretórios e ao arquivo de conteúdo da galeria.

### 3. Conteúdo textual
- `src/app/sobre/page.tsx` e `src/components/sections/sobre-preview.tsx`: biografia com informações confirmadas publicamente (formação, OAB). Um parágrafo está marcado como texto em revisão — recomenda-se substituir por uma biografia mais detalhada fornecida pelo cliente.
- `src/content/artigos.ts`: 3 artigos de exemplo, com conteúdo genérico e informativo (sem promessas de resultado). Substituir/expandir pelo conteúdo real que o cliente desejar publicar.
- `src/content/areas-atuacao.ts`: texto de cada área de atuação é genérico e técnico — revisar conforme a prática real do escritório.

### 4. Formulário de contato — `src/app/contato/actions.ts`
O formulário já valida, sanitiza e tem proteção anti-spam (honeypot + rate limit básico em memória), mas **ainda não envia e-mail de fato** — há um `TODO` explícito no arquivo. Antes de publicar, integrar a um provedor real (ex.: Resend, SendGrid, SMTP corporativo).

### 5. Domínio e deploy
- Ajustar `siteConfig.site.url` para o domínio definitivo.
- Fazer deploy na Vercel (projeto já está pronto para isso: `next build` roda limpo).
- Após o deploy, testar `/sitemap.xml`, `/robots.txt` e o preview de Open Graph (imagem gerada dinamicamente em `src/app/opengraph-image.tsx`).

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · React 19 · Tailwind CSS v4 · next-themes (dark/light) · next/font/local (fontes auto-hospedadas, sem dependência de rede) · Zod (validação do formulário) · lucide-react (ícones).

## Estrutura

```
src/
├── app/               # Rotas (App Router), sitemap.ts, robots.ts, opengraph-image.tsx
├── components/
│   ├── layout/         # Header, Footer
│   ├── sections/        # Seções da home e de outras páginas
│   ├── ui/              # Botões, toggle de tema, breadcrumbs, ícones sociais
│   ├── gallery/         # Grid + lightbox da galeria
│   ├── articles/        # Card de artigo
│   └── seo/             # Componente JsonLd
├── content/            # Áreas de atuação, artigos, galeria (fonte de conteúdo)
├── lib/
│   ├── config.ts        # Dados globais do escritório (fonte única de verdade)
│   ├── seo/             # Helper de metadata por página
│   └── structured-data/ # Builders de JSON-LD (Attorney, Breadcrumb, Article)
└── fonts/              # Fontes variáveis auto-hospedadas (Fraunces, Inter)
```
