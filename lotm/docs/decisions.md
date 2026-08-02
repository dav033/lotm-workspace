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

## ADR-004 — Split oversized modules behind an unchanged public API

- **Status:** Accepted
- **Date:** 2026-08-02
- **Decision:** When a module grows past comfortable reading size, split it into a directory of focused files plus an `index.ts` that re-exports the **exact** previous public surface. Consumers keep their import paths, so the split stays a pure structural change and the existing tests remain the proof.
- **Applied to:** `server/domain/diagnostico` (types, pure calculators, orchestration, derived inspections) and `server/services/datos` (nominal export, backup export, import validation, import execution, shared error).
- **Rationale:** The alternative — updating every importer — turns a mechanical refactor into a wide diff and makes regressions hard to attribute.
- **Note:** The plan prescribed a shared `mappers.ts` for `datos`. Only the nominal export path uses those two helpers, so they stayed with it rather than creating a module with a single consumer.

## ADR-006 — The game runs with every feature open

- **Status:** Accepted by owner
- **Date:** 2026-08-02
- **Decision:** `resolveFeatureState()` returns `true` for every key in `FEATURE_DEFINITIONS`. No feature is hidden behind a progression phase, an unlock threshold or a role, and the admin panel is never feature-restricted. New features are added open; they do not get a flag or a phase.
- **Rationale:** The owner is the only operator and uses the archive as an authoring and review tool. Being throttled by the same progression curve the players see gets in the way, and the gating existed for players, not for them.
- **Accepted consequence:** Authentication is disabled (ADR-001), so nothing can distinguish the owner from a visitor. Opening the features therefore opens them for **everyone** who reaches the public site, not just the admin panel. The owner was shown this and chose it.
- **What was kept:** `resolveFeatureState` still receives the gate rows and the current phase, so restoring the staged behaviour is a one-function edit. The `FeatureGate` table, the phase-map editor that writes it, and the export and import formats are all unchanged — the configuration survives, nothing reads it to decide.
- **Tests:** `shared/featureGates.test.ts` pins every feature open even with an absurd threshold or missing configuration. Two tests that previously asserted a locked ritual (`rituales.test.ts`, `combinarRitual.test.ts`) now assert the opposite, so silently reintroducing the gate turns them red.

## ADR-005 — CI verifies; signed webhook deploys

- **Status:** Accepted
- **Date:** 2026-08-02
- **Decision:** GitHub Actions runs lint, typecheck, test and build per workspace on pushes and PRs to `main`. A signed GitHub push webhook independently triggers the VPS systemd deploy service. No polling timer remains active.
- **Excluded from CI:** the PNG visual golden harness. Font rasterisation and antialiasing differ per machine, so the pixel comparison stays a local gate. Chromium is therefore not installed in CI, which no unit test needs.
- **Consequence:** A green CI run does **not** prove the rendered cards are unchanged. Run `npm run visual:check -w @lotm/card-studio` locally after touching `cards-ui` or the renderer.
