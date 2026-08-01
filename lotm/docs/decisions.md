# Architecture Decisions

## ADR-000 — Execute the LOTM workspace refactor

- **Status:** Accepted
- **Date:** 2026-08-01
- **Decision:** Split the fused Next.js application into npm workspaces: `apps/game`, `apps/card-studio`, and `tools/obsidian-bridge`.
- **Rationale:** The repository contains two products with different runtimes, data stores, deployment needs, and AI-facing contracts. The split creates explicit ownership while preserving public URLs, MCP contracts, PostgreSQL history, and the vault.
- **Reference:** [`REFACTOR_PLAN.md`](../../REFACTOR_PLAN.md)

## ADR-001 — Keep admin authentication disabled

- **Status:** Accepted by owner
- **Date:** 2026-08-01
- **Decision:** Leave authentication disabled. `src/server/adminAuth.ts` currently returns `true` from `haySesionAdmin()`; the HMAC-cookie mechanism remains below it but is bypassed.
- **Rationale:** Deployment is trusted, local-use, and single-user. This is an accepted risk, not an unfinished refactor task.
- **Constraint:** Do not re-enable authentication or add authentication to `/api/cards/**` without explicit owner approval.

## ADR-002 — PostgreSQL for game, SQLite for cards

- **Status:** Accepted
- **Date:** 2026-08-01
- **Decision:** Archivo de Misterios uses PostgreSQL through Prisma and the PostgreSQL adapter, with Supabase as the production provider. Card Studio keeps `data/cards.db` in SQLite.
- **Rationale:** The game already has live PostgreSQL data and migration history. Card Studio needs a small local, file-backed content store shared by the editor, renderer, and MCP process. These stores have different ownership and lifecycle; combining them would increase coupling.
- **Constraint:** Never delete or rewrite PostgreSQL data or migration history. Preserve `CARDS_DB_PATH` and the `data/` volume semantics.

## ADR-003 — Gradual English naming policy

- **Status:** Accepted
- **Date:** 2026-08-01
- **Decision:** New code, symbols, comments, commit messages, and engineering docs use English. Existing Spanish game identifiers remain unless a scheduled rewrite substantially changes that module. Card Studio is fully migrated to English during its planned modernization.
- **Constraint:** Never rename public routes, database columns, environment variables, MCP tool names, or export-format fields.
