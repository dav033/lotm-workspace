# LOTM workspace — agent map

Engineering guide for agents working in this repository. Content and editorial
conventions live in [`AGENTS.md`](./AGENTS.md); read both.

## What lives where

| Path | Contents |
| --- | --- |
| `lotm/` | npm-workspaces root. **Run every script from here**, not from the repo root. |
| `lotm/apps/game` | `@lotm/game` — Archivo de Misterios. Owns `/`, `/coleccion`, `/logros`, `/admin/**` and the game `/api/**`. PostgreSQL via Prisma. |
| `lotm/apps/card-studio` | `@lotm/card-studio` — Card Studio. Owns `/cartas`, `/cartas/vivo`, `/api/cards/**`, the MCP servers and PNG/ZIP/video export. SQLite under `data/`. |
| `lotm/tools/obsidian-bridge` | `@lotm/obsidian-bridge` — MCP bridge to the vault. Imports nothing from the apps. |
| `lotm/data/` | Card Studio database, images and exports. Persistent, never committed, **never deleted**. |
| `lotm-vault/` | Obsidian lore vault. Not code. |
| `REFACTOR_PLAN.md` | The architecture refactor: phases, gates and the deviations log. Progress lives in its §10. |

The two apps **must not import from each other**. Their only link is a URL
(`NEXT_PUBLIC_CARDS_URL`). Do not create `packages/` for shared code.

## Deploy model — read before touching `main`

**Pushing `main` auto-deploys to a live VPS.** A systemd timer runs
`autodeploy.sh` every two minutes: `pull --ff-only`, rebuild, restart. Never
merge a non-deployable state. Merge only at the milestone gates defined in
`REFACTOR_PLAN.md` §5.0, and coordinate the deployment split with the owner.

Production runs three services from `lotm/docker-compose.production.yml`:
`lotm` (game), `card-studio` (studio web) and `cards-mcp` (studio image running
the HTTP MCP server on 3101). A reverse proxy routes `/cartas*` and
`/api/cards*` to the studio, `/mcp` to `cards-mcp`, everything else to the game.

## Frozen invariants

These are not negotiable without asking the owner first.

- **Authentication is disabled on purpose.** `haySesionAdmin()` returns `true`,
  so `/admin/**`, every mutating Server Action and `/api/cards/**` are open. The
  deployment is considered trusted. Do not enable it, do not add auth, do not
  "helpfully" harden it. See `lotm/docs/decisions.md` ADR-001.
- **The game runs with every feature open, and the owner's admin is never
  limited.** `resolveFeatureState()` returns `true` for every key: no
  progression phase, unlock threshold or role hides anything. Do not reintroduce
  gating, and do not add a new capability behind a flag or a phase. The
  `FeatureGate` rows and their editor stay as configuration that nothing reads
  today. See ADR-006.
- **The MCP contract is frozen**: server name `lotm-card-studio`, the seven tool
  names and their schemas, the `/mcp` endpoint and its Bearer behaviour,
  `/downloads/:filename`, and the ZIP layout `universo/NN-seccion/` with
  `manifest.json` v3. External clients depend on it.
- **Public URLs are frozen.** Both apps must keep serving exactly the paths they
  serve today.
- **PostgreSQL data is sacred**: no destructive migrations, no schema renames.
  `apps/game/prisma/migrations-postgresql/` must stay valid for `migrate deploy`.
- **`cards.db` and the `data/` layout are frozen**: `CARDS_DB_PATH`,
  `CARDS_IMAGE_DIR` and `CARDS_EXPORT_DIR` keep their semantics.
- **Rendered PNGs are pixel-frozen.** `npm run visual:check -w @lotm/card-studio`
  is the arbiter. Never regenerate goldens to make a red check pass.
- **No dependency upgrades** and no Node or Next version bumps.
- Env var names are frozen; new ones may be added, none removed silently.

## Running things

All from `lotm/`:

| Command | Does |
| --- | --- |
| `npm run dev:game` | Game on :3000 |
| `npm run dev:cards` | Card Studio on :3002 |
| `npm run build` / `test` / `lint` / `typecheck` | Across every workspace |
| `npm run test -w @lotm/game` | One workspace only (same for the others) |
| `npm run visual:check -w @lotm/card-studio` | PNG golden comparison — run after any cards-ui or renderer change |
| `npm run db:migrate` / `db:deploy` / `db:studio` | Prisma, game only |
| `npm run mcp:stdio` / `mcp:http` | Card Studio MCP servers |
| `npm run obsidian:bridge` | Vault bridge |

Each app reads its **own** `.env`, so `apps/game/.env` and
`apps/card-studio/.env` are separate files. A workspace-root `lotm/.env` is not
picked up by Next. The game build fails without `DATABASE_URL` even though no
route connects at build time.

## Language policy

Player-facing game UI is English. The admin panel and the game's domain
identifiers are Spanish. Card Studio code is English. New code is written in
English; existing Spanish modules are renamed only when they are being
substantially rewritten anyway. Never rename routes, DB columns, env vars, MCP
tool names or export-format fields. Engineering docs are written in English.

## Vault access

Never bulk-read `lotm-vault/`. Start at `lotm-vault/NAVIGATION.md`, which routes
between lore work and project work and explains when to use the Obsidian MCP
search instead of reading files by path.

## Per-app guides

- [`lotm/apps/game/CLAUDE.md`](./lotm/apps/game/CLAUDE.md)
- [`lotm/apps/card-studio/CLAUDE.md`](./lotm/apps/card-studio/CLAUDE.md)
