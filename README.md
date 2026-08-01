# LOTM Workspace

This repository contains two products and one content vault.

## Products

- **Archivo de Misterios** — a Little Alchemy-style Lord of the Mysteries discovery game. Its current application lives in [`lotm/`](./lotm/); the refactor moves it to `lotm/apps/game/`.
- **Card Studio** — the TikTok card editor, renderer, ZIP/video exporter, and MCP server. It is currently hosted by the same Next.js app under `/cartas`; the refactor moves it to `lotm/apps/card-studio/`.
- **LOTM vault** — the Obsidian lore and project vault in [`lotm-vault/`](./lotm-vault/). Start with [`NAVIGATION.md`](./lotm-vault/NAVIGATION.md); never bulk-read the vault.

The migration plan is [`REFACTOR_PLAN.md`](./REFACTOR_PLAN.md). Current app documentation remains in [`lotm/README.md`](./lotm/README.md) until the split creates per-app READMEs.

## Development

```bash
cd lotm
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run test
npm run build
```

The game uses PostgreSQL through Prisma. Card Studio uses a separate SQLite database under `data/cards.db`; this separation is intentional.

## Deployment

Production is live and auto-deploys from `main`: a systemd timer pulls fast-forward changes, builds, and restarts the services. Do not merge a non-deployable milestone into `main`. The refactor later splits game and Card Studio images and requires reverse-proxy routing for `/cartas*` and `/api/cards*`; see the plan before deploying that milestone.

Back up game data through Supabase/PostgreSQL tooling. Back up Card Studio state by copying the `data/` volume.

## Security decision

Admin authentication is intentionally disabled by owner decision for the trusted, single-user deployment. The bypass is documented and must not be re-enabled or extended as part of this refactor without explicit owner approval.
