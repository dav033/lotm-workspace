# LOTM Workspace

This directory is the npm-workspaces monorepo for Archivo de Misterios and
Card Studio. The two apps deploy separately and keep their data stores
separate: the game uses PostgreSQL; Card Studio uses SQLite under `data/`.

## Layout

| Path | Owns |
| --- | --- |
| `apps/game` | `/`, `/coleccion`, `/logros`, `/admin/**`, and game `/api/**` |
| `apps/card-studio` | `/cartas`, `/cartas/vivo`, `/api/cards/**`, MCP, PNG/ZIP/video export |
| `tools/obsidian-bridge` | Local bridge for the Obsidian vault |
| `data/` | Persistent Card Studio database, images, and exports; never commit it |

The public paths stay unchanged. In production, a reverse proxy routes
`/cartas*` and `/api/cards*` to `card-studio:3000`, `/mcp` to
`cards-mcp:3101`, and all other paths to `lotm:3000`.

## Local setup

```bash
npm install
Copy-Item .env.example .env # PowerShell
# cp .env.example .env     # macOS/Linux
```

Use a reachable PostgreSQL connection in `DATABASE_URL`. Use `DIRECT_URL` for
Prisma migrations. Card Studio variables start with `CARDS_`; their defaults
keep `data/` at this workspace root.

Apply game migrations with:

```bash
npm run db:migrate
```

Install Chromium once for Card Studio rendering:

```bash
npm run cards:browser
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev:game` | Game development server on port 3000 |
| `npm run dev:cards` | Card Studio development server on port 3002 |
| `npm run build` | Build every workspace |
| `npm run lint` | Lint every workspace |
| `npm run typecheck` | Type-check every workspace |
| `npm run test` | Run every workspace test suite |
| `npm run db:migrate` | Create/apply a development PostgreSQL migration |
| `npm run db:deploy` | Apply PostgreSQL migrations in production |
| `npm run mcp:stdio` | Run the local Card Studio MCP server |
| `npm run mcp:http` | Run Card Studio MCP over Streamable HTTP |
| `npm run obsidian:bridge` | Run the local vault bridge |

Run a command for one app with npm's workspace selector:

```bash
npm run build -w @lotm/game
npm run test -w @lotm/card-studio
```

## Production deployment

`main` auto-deploys on the VPS through the systemd timer. The timer pulls
fast-forward changes, validates the checkout, rebuilds the compose services,
and restarts them. Never push a non-deployable state to `main`.

Build from this directory:

```bash
docker build -f Dockerfile.game .
docker build -f Dockerfile.card-studio .
docker compose -f docker-compose.production.yml config
```

Compose services:

- `lotm`: game image, internal port 3000, PostgreSQL-backed.
- `card-studio`: Card Studio web image, internal port 3000, shared `/app/data`.
- `cards-mcp`: same Card Studio image, MCP on internal port 3101, shared
  `/app/data`.

Required first-deploy order:

1. Build and deploy both images while the current proxy still serves the old
   app.
2. Verify `lotm:3000` and `card-studio:3000` health and routes internally.
3. Switch proxy rules for `/cartas*` and `/api/cards*` to `card-studio:3000`.
4. Keep `/mcp` routed without prefix removal to `cards-mcp:3101`.
5. Verify game routes, Card Studio routes, MCP Bearer auth, and downloads.

The two Card Studio services share `lotm_data:/app/data`; the game service does
not mount it. Back up game content with Supabase/PostgreSQL tooling or
`pg_dump`. Back up Card Studio by copying `data/` or its volume. Never delete
`data/` during deployment.

The admin authentication bypass is intentional for the trusted single-user
deployment. Do not enable or extend authentication as part of this refactor.

## Contract and visual invariants

- Public URLs and environment variable names are frozen.
- MCP server name, tool names, schemas, `/mcp`, `/downloads/:filename`, and
  manifest v3 remain compatible.
- Card PNG output stays 960×1280 with near-black background, serif display
  title, gold underline, and clear sans-serif body text.
- `lotm-vault/` is content, not application source. Read
  `lotm-vault/NAVIGATION.md` first and never bulk-read the vault.

See the repository-level `REFACTOR_PLAN.md` for phase gates and deviations.
