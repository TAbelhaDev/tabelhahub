# Checklist de execução - syndication do tabelhahub

Implementação técnica já feita (docs/social-syndication.md, scripts/syndicate.mjs,
workflow syndicate.yml). Falta a parte manual e os passos de ativação.

## 1. Contas (manual)

- [ ] Criar Bluesky `@tabelhadev.bsky.social`
- [ ] Criar dev.to `dev.to/tabelhadev`
- [ ] Criar Mastodon `@tabelhadev@<instância>` (definir qual instância)

## 2. Credenciais

- [ ] Bluesky: gerar **app password** (Settings → App passwords) - não usar a senha da conta
- [ ] dev.to: gerar **API key** (Settings → Extensions → DEV Community API Keys)

## 3. Secrets no GitHub (repo TAbelhaDev/tabelhahub → Settings → Secrets → Actions)

- [ ] `DEVTO_API_KEY`
- [ ] `BLUESKY_HANDLE` (ex.: `tabelhadev.bsky.social`)
- [ ] `BLUESKY_APP_PASSWORD`

## 4. Commitar a implementação

- [ ] Commitar `docs/`, `scripts/syndicate.mjs`, `.github/workflows/syndicate.yml`, `package.json` e dar push pra `main`

## 5. Testar (post de teste)

- [ ] Criar um post de teste em `content/news/` e ver o workflow `syndicate` rodar
- [ ] Conferir que saiu no dev.to (artigo completo) e no Bluesky (título + summary + link)
- [ ] Conferir que o `scripts/syndicated.json` foi commitado (idempotência)

## 6. Backfill dos 3 posts existentes (bloqueado até revisar os textos)

- [ ] Revisar `2026-08-12-bem-vindo-ao-hub.md`
- [ ] Revisar `2026-08-12-por-que-auto-custo.md`
- [ ] Revisar `2026-08-12-a-estetica-do-codigo-fonte.md`
- [ ] Após revisão: rodar `bun run syndicate` (ou `workflow_dispatch`) pra sindicar os 3

## 7. Mastodon (bridge, sem código)

- [ ] Na conta Mastodon, seguir `@bsky.brid.gy` pra espelhar os posts do Bluesky

## 8. Pós-lançamento

- [ ] Definir cadência de resposta no Bluesky (canal ativo de engajamento)
- [ ] Reddit: distribuição manual pontual (r/brdev, r/sveltejs, r/selfhosted) quando um post encaixar
