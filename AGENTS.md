# tabelhahub - contexto essencial

Site/hub central da TAbelhaDev (landing + news + changelog agregado). Repo **aberto**,
AGPL-3.0. Este app segue as regras dos apps web da TAbelhaDev em
repo e o CONTRIBUTING (política de linguagem) também valem.

## O que é cada parte

- **Home** (`(marketing)/+page.svelte`): hero + grid de projetos + filosofia + teaser de
  news. Projetos e changelog vêm de dados commitados (`src/lib/projects.json` /
  `src/lib/changelog.json`), gerados por `scripts/aggregate.mjs`.
- **News** (`(marketing)/news/`): posts em `content/news/<slug>.md` com frontmatter
  (title, date, summary, tags, featured). Pipeline: `front-matter` + `marked`, renderizado
  server-side via `src/lib/server/news.ts` (`import.meta.glob` - não há filesystem no
  Worker, o conteúdo entra no bundle).
- **Changelog** (`(marketing)/changelog/`): timeline das releases, agregada dos
  `CHANGELOG.md`/GitHub Releases dos repos públicos do org.

## Stack

- SvelteKit 2 + Svelte 5 (runes) + TypeScript, **adapter-cloudflare** (Workers). Config
  separada: `svelte.config.js` (adapter) + `vite.config.ts` (tailwind + sveltekit).
- Sem banco, sem auth, sem PWA.

## Dados (agregação)

`bun run aggregate` roda `scripts/aggregate.mjs` (usa o `gh` CLI) e reescreve os dois
JSONs commitados. O build **não** roda a agregação - o deploy roda antes. Cobertura:

## Comandos

`bun dev`, `bun run check`, `bun run lint`, `bun run format`, `bun run aggregate`,
`bun run build`, `bun run deploy`.

Antes de abrir PR: `bun run check && bun run lint && bun run build`.
