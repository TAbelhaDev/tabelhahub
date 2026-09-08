# Syndication do tabelhahub para redes sociais

Plano para publicar o conteúdo de `content/news/` (o "blog" do hub) nas redes
sociais, com cross-post automático e engajamento manual concentrado num canal.

## Objetivo

Comunidade/engajamento: levar o conteúdo do hub para redes onde o público dev
(especialmente pt-BR) está, com o mínimo de esforço manual - automação faz o
cross-post, e a interação (responder gente) fica num único canal ativo.

## Decisões já tomadas

- **Handle da marca**: `tabelhadev` em todas as redes
  (`@tabelhadev.bsky.social`, `dev.to/tabelhadev`, `@tabelhadev@<instância>`).
- **dev.to**: cross-post do **artigo completo** (body_markdown integral), com
  `canonical_url` apontando pro hub pra preservar SEO.
- **Domínio**: lançar com o `workers.dev` atual
  (`https://tabelhahub.tabelhadev.workers.dev`), sem custom domain por ora.
- **Backfill**: sindicar os 3 posts existentes assim que o pipeline ficar
  pronto - **após revisão dos textos** (bloqueado até o autor liberar).

## Arquitetura

Fonte única: `content/news/*.md` (frontmatter `title`/`date`/`summary`/`tags`).
Um script lê os posts e publica em cada destino; um workflow do GitHub roda no
push de conteúdo novo.

### `scripts/syndicate.mjs`

Segue o estilo do `scripts/aggregate.mjs` (Node, sem dependências externas).
Fluxo:

1. Lê todos os `content/news/*.md` + o estado commitado `scripts/syndicated.json`
   (mapa `slug → { devtoId, bskyUri, ts }`).
2. Para cada post **não sindicado**, publica:
   - **dev.to** - `POST https://dev.to/api/articles` com header `api-key` e body
     `{ article: { title, body_markdown, published: true, canonical_url, description, tags } }`.
     Tags vêm do frontmatter (máx. 4).
   - **Bluesky** - `POST https://bsky.social/xrpc/com.atproto.server.createSession`
     (`identifier` + **app password**) → `accessJwt` + `did` →
     `POST /xrpc/com.atproto.repo.createRecord` com
     `{ repo, collection: "app.bsky.feed.post", record: { text, createdAt } }`,
     onde `text = "<title>\n\n<summary>\n<link>"`.
3. Escreve os IDs retornados no `scripts/syndicated.json`.

### `.github/workflows/syndicate.yml`

- Trigger: `on: push` com `paths: ['content/news/**']`.
- Passos: `bun install` → `bun run syndicate` → commitar `syndicated.json`
  atualizado (mesmo padrão de commit do bot do `deploy.yml`).
- Segredos (GitHub secrets do repo): `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD`,
  `DEVTO_API_KEY`.

### Mastodon

Sem código: **brid.gy fed**. Seguir `@bsky.brid.gy` na conta Mastodon espelha
os posts do Bluesky automaticamente. Alternativa (só se quiser texto separado):
API direta `POST /api/v1/statuses` com token.

## Rede ativa (engajamento humano)

- **Bluesky** é o canal onde responder as pessoas - o script só posta; a
  interação fica num lugar só.
- **Reddit**: distribuição manual pontual (r/brdev, r/sveltejs, r/selfhosted)
  quando o post encaixar - sem perfil ativo nem automação.
- **Não priorizar**: X/Twitter (barulho, engajamento dev caindo), LinkedIn
  (público errado), vídeo (custo alto).

## Contas a criar (manual)

| Rede     | Handle                    | Credencial                                               |
| -------- | ------------------------- | -------------------------------------------------------- |
| Bluesky  | `@tabelhadev.bsky.social` | App password (Settings → App passwords)                  |
| dev.to   | `dev.to/tabelhadev`       | API key (Settings → Extensions → DEV Community API Keys) |
| Mastodon | `@tabelhadev@<instância>` | brid.gy fed (sem token)                                  |

## Fases

1. Criar contas + gerar credenciais + adicionar GitHub secrets.
2. Implementar `syndicate.mjs` + `syndicate.yml` + script npm
   (`"syndicate": "node scripts/syndicate.mjs"`).
3. Testar com um post de teste, validar os destinos.
4. Backfill dos 3 posts existentes - **bloqueado até o autor revisar os textos**.
5. Conectar brid.gy fed no Mastodon (manual).

## Posts existentes (backfill pendente de revisão)

- `2026-08-12-bem-vindo-ao-hub.md` - "Bem-vindo ao tabelhahub"
- `2026-08-12-por-que-auto-custo.md` - "Por que 'auto custo'"
- `2026-08-12-a-estetica-do-codigo-fonte.md` - "A estética 'lendo o código-fonte de alguém'"
