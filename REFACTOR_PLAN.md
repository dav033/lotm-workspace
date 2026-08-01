# LOTM Workspace — Architecture Refactor Plan

**Version:** 1.0 · **Date:** 2026-08-01 · **Status:** APPROVED, not started
**Audience:** an AI coding agent executing this plan end-to-end, phase by phase.
**Language policy for this document:** English (per owner request). Chat with the owner may be in Spanish.

---

## How to use this document (executor protocol)

1. Read this entire file before touching anything.
2. Execute phases **strictly in order** unless a phase is marked `[parallel-ok]`.
3. Work on a branch per milestone (see §5.0 Branch & deploy gates). **Pushing `main` auto-deploys to a live VPS** (systemd timer runs `autodeploy.sh` every 2 min: `pull --ff-only` → rebuild → restart). Never merge a non-deployable state into `main`.
4. After every phase, run the **acceptance gate** commands listed for it. A phase is done only when its gate passes.
5. One logical step per commit. Message format: `refactor(scope): imperative summary`. Never mix a file **move** and a file **edit** in the same commit (moves must stay diff-reviewable as pure renames).
6. If reality diverges from this plan (a file was renamed, a step is impossible as written), do the closest correct thing, then **update this file**: fix the step and append a dated entry to §11 Deviations log.
7. Tick checkboxes in §10 as you complete steps. This file is the single source of truth for progress.
8. Hard rules in §3 (invariants) and §9 (do-NOT list) override everything else, including your own judgment about "improvements" not listed here.

---

## 0. Executive summary

This repository (`lotm project/`, git root, remote `github.com/dav033/lotm-workspace`) contains **two products fused into one Next.js app** plus **one content vault**:

1. **"Archivo de Misterios"** — a web game (Little Alchemy-style combination/discovery game themed on *Lord of the Mysteries*). Next.js App Router + Prisma 7 + **PostgreSQL (Supabase)**. Live, with real player data (~45 profiles, 270 elements, 241 recipes).
2. **Card Studio** — a TikTok card generator: a legacy untyped React editor (`src/builder`, JSX), a card domain + SQLite repository (`src/cards`), Playwright PNG rendering, ffmpeg video export, and an **MCP server** (stdio + Streamable HTTP) that is **live in production** (`https://lotm.marosconstruction.com/mcp`) and consumed from claude.ai and ChatGPT.
3. **`lotm-vault/`** — an Obsidian lore/content vault (629 files) used by content agents via MCP. Not code. Stays in the repo.

They share one `package.json`, one `src/`, one Next app, one Docker image. The plan splits them into an **npm-workspaces monorepo** (`apps/game`, `apps/card-studio`, `tools/obsidian-bridge`), modernizes the card studio to TypeScript with real module boundaries, cleans the game's client/server boundary, deletes dead code and committed junk, aligns documentation with reality, adds minimal CI and a visual-regression safety net for card PNGs, and produces per-package AI agent documentation.

Approx. current source volume (excluding `node_modules/`, `src/generated/`): **~39.5k lines**. Game ≈ 29k, card studio ≈ 8.7k, the rest is config/docs.

---

## 1. Current state analysis (verified 2026-08-01)

### 1.1 Workspace map

```
lotm project/                  ← git root (remote: dav033/lotm-workspace)
├── AGENTS.md                  ← opencode agent conventions (caveman mode, lotm-design/lotm-content serial rule)
├── AIUUDA                     ← stale session notes (junk, committed)
├── README.md                  ← literally the string "# lotm-workspace" with quotes (junk)
├── opencode.json              ← remote MCP (prod cards MCP) + obsidian mcpvault (absolute path) + agent models
├── lotm/                      ← THE APP (everything below is one npm package "archivo-de-misterios")
│   ├── package.json           ← single package: next+prisma+pg+zustand+framer-motion AND better-sqlite3+playwright+ffmpeg-static+jszip+html2canvas+MCP SDK
│   ├── next.config.ts         ← serverExternalPackages: better-sqlite3, ffmpeg-static (card concerns in game config)
│   ├── prisma/                ← schema (postgresql) + migrations/ (SQLite, dead) + migrations-postgresql/ (live)
│   ├── prisma.config.ts       ← migrations path → migrations-postgresql, DIRECT_URL for CLI
│   ├── mcp/                   ← cards-stdio.ts, cards-http.ts, obsidian-bridge.ts (tsx entrypoints, run from source in prod)
│   ├── public/                ← cover-default.jpg, covers/ (+ a committed Windows .lnk!), pathway-back/ (typo'd filenames), pathway-icons/  — ALL card-studio assets
│   ├── src/
│   │   ├── app/               ← game pages (/, /coleccion, /logros, /admin/**) + card pages (/cartas, /cartas/vivo) + api (game + /api/cards/**)
│   │   ├── builder/           ← legacy JSX card editor (App.jsx 940 ln, Panel.jsx ~890 ln, styles.css 810 ln, useCardSession.js 488 ln)
│   │   ├── cards/             ← card domain/infra TS (schema 752 ln, repository 702 ln, render 404 ln, mcp 257 ln, video, export, images)
│   │   ├── components/game/   ← game client UI (store.ts 37 KB zustand)
│   │   ├── components/admin/  ← admin UI, 10.6k lines, incl. arbol/MapaFases.tsx (117 KB, largest file in repo)
│   │   ├── server/            ← domain/ (6.5k ln) services/ (4k ln) actions/ (1.4k ln) db.ts (pg) cardsDb.ts (→ cards!)
│   │   ├── shared/            ← client-safe pure logic (inputKey, phaseRules, featureGates…) — pattern applied inconsistently
│   │   ├── i18n/              ← half-dead es/en toggle (see 1.6)
│   │   └── generated/prisma/  ← generated client (gitignored)
│   ├── graphify-out/          ← 2.8 MB of knowledge-graph artifacts, COMMITTED (junk in git)
│   ├── !owned.includes(ritual.id) ← 0-byte accidental shell-redirect file, COMMITTED
│   ├── translate_*.py         ← 4 one-shot string-replace scripts, untracked (junk on disk)
│   ├── .planning/             ← debug logs convention (1 resolved file) — keep the convention
│   ├── .agents/skills/        ← opencode skill (find-skills) — keep
│   ├── Dockerfile             ← ships src/ wholesale into runtime image; CMD migrate deploy + next start
│   └── docker-compose.production.yml ← services: lotm (web) + cards-mcp (same image, `npm run cards:mcp:http`), external network stack_web
└── lotm-vault/                ← Obsidian vault, 629 files. NAVIGATION.md is the entry point. DO NOT bulk-read or restructure.
```

Git history: only 4 commits (history was squashed when imported). Nothing valuable to preserve in history archaeology.

### 1.2 The two products, precisely

**Game (Archivo de Misterios)** — routes `/`, `/coleccion`, `/logros`, `/admin/**`, `/api/{estado,combine,fases,habilidades,logros,perfil,recetas-pendientes,rituales,admin}/**`. Server layering (README's claim, mostly true): `server/domain` (game rules, takes a `Db` Prisma-transaction type), `server/services` (admin use cases), `server/actions` (Server Actions), `app/api` (player routes, cookie-scoped profile). DB: PostgreSQL via `@prisma/adapter-pg` (`src/server/db.ts` **requires** `DATABASE_URL`, comments say Supabase pooled). Player UI text: English (hardcoded during a translation pass). Admin UI: Spanish. Identifiers: Spanish.

**Card Studio** — routes `/cartas` (editor), `/cartas/vivo` (live view), `/api/cards/**` (14 route files). `cards.db` (SQLite via better-sqlite3) is the single source of truth; editor mirrors it by polling `/api/cards/revision` every 1 s. MCP servers (stdio for local agents, HTTP :3101 with Bearer token for prod) expose `save_card_batch`, `list_card_library`, `update_card`, `move_cards`, `save_card_image`, `delete_cards`, `export_cards_zip`. PNG export: Playwright Chromium renders the **same JSX components** as the editor at 960×1280; video export via ffmpeg-static. Identifiers: English (mostly), comments Spanish.

### 1.3 Coupling inventory (exact, verified edges)

Cross-product edges (game ↔ studio):

| # | Edge | Location |
|---|------|----------|
| C1 | Game server folder owns the cards DB singleton | `src/server/cardsDb.ts:1` → `@/cards/repository` |
| C2 | Game app hosts the editor page | `src/app/cartas/page.tsx:4,8` → `@/builder/styles.css`, `@/builder/App.jsx` (dynamic, ssr:false) |
| C3 | Game app hosts the live view | `src/app/cartas/vivo/page.tsx:5-6` → `@/builder/LiveCardPreview.jsx`, `@/cards/schema` |
| C4 | Game app hosts all card APIs | 14 files under `src/app/api/cards/**` → `@/cards/*`, `@/server/cardsDb` |
| C5 | Game nav links the editor | `src/components/NavPrincipal.tsx:12` (`/cartas` entry) |
| C6 | Game Next config carries studio-only concerns | `next.config.ts:9` `serverExternalPackages: ['better-sqlite3','ffmpeg-static']` |
| C7 | One Docker image runs both, ships `src/` wholesale | `Dockerfile:35` (`COPY src ./src`) — required because of C8 and tsx-run MCP |
| C8 | Server renderer reads editor CSS from disk at runtime | `src/cards/render.tsx:68` `fs.readFile(root/src/builder/styles.css)`, anchored on `CARDS_PROJECT_ROOT \|\| process.cwd()` |

Internal studio tangle (builder ↔ cards is **bidirectional**):

| # | Edge | Location |
|---|------|----------|
| S1 | cards → builder (data) | `src/cards/schema.ts:6-7` → `../builder/data/pathways.js`, `../builder/mapEntries` |
| S2 | cards → builder (11 UI components + data) | `src/cards/render.tsx:6-26` |
| S3 | builder → cards | `src/builder/App.jsx:27` (`slugify`), `src/builder/useCardSession.js:4` (`to/fromBuilderCardState`) |
| S4 | Three parallel card-state mappings that must agree | editor preview in `App.jsx`, `LiveCardPreview.jsx`, and `render.tsx` each map card content → component props |
| S5 | Two independent PNG export paths that must agree | client `html2canvas`+`jszip` in `App.jsx` (per-section download) vs server Playwright in `cards/render.tsx` (MCP zip, video) |

Game client/server boundary violations (client bundles import from `@/server/**`, including **runtime values**, not just types):

| # | Client file | Imports from server |
|---|-------------|---------------------|
| G1 | `src/components/game/store.ts:4-19` | `@/server/domain/tipos` (types), `@/server/domain/ritualKnowledge` (types), `@/server/domain/habilidades` (**runtime**: `ABILITY_DEFINITIONS`, `facultadesDesdeSlugs`, `desbloqueosNuevos`) |
| G2 | `src/components/admin/ExploradorElementos.tsx:8` | `@/server/domain/diagnostico` (**runtime**: `DIFICULTAD_LABELS`) — pulls a 37 KB server module toward the client bundle |
| G3 | `src/components/game/PanelDescubiertos.tsx`, `PanelHabilidades.tsx`, `tipos.ts`, `CreadorRapido.tsx`, `FormularioElemento.tsx`, `ExploradorElementos.tsx` | `@/server/domain/tipos` (**runtime**: `ELEMENT_TYPES`, `etiquetaTipo`) |
| G4 | `src/components/admin/ui.tsx`, all Formulario\* | `@/server/actions/tipos` (`EstadoAccion`, `ESTADO_INICIAL`) |
| G5 | `src/server/services/datos.ts:12` | imports `DIFICULTAD_LABELS` from domain — fine itself, but shows labels live server-side while admin UI needs them client-side |

The `src/shared/` folder exists **exactly** to solve G1–G4 (see `shared/inputKey.ts` header comment + `server/domain/inputKey.ts` re-export shim) but was applied to only 3 modules. Nothing enforces the boundary today: adding one `Db` call to `habilidades.ts` would break the client build unpredictably.

### 1.4 Oversized files (decomposition targets)

| File | Size | Content |
|------|------|---------|
| `src/components/admin/arbol/MapaFases.tsx` | 117 KB (~2.5k ln) | phase-tree admin: graph view, filters, selection, recipe editor triggers, phase rule dialogs — many embedded components |
| `src/server/services/datos.ts` | 56 KB | import/export: nominal export v2/v4, backup v3, import validate+execute, merge/replace |
| `src/components/admin/ArbolConexiones.tsx` | 52 KB | connection-graph rendering (layout + SVG + legend) |
| `src/builder/App.jsx` | 39 KB | editor shell: state, seeds, autosave, image tray, zip/video export, project tabs |
| `src/builder/components/Panel.jsx` | 38 KB | one giant form for 12 card types |
| `src/components/game/store.ts` | 37 KB | single zustand store: combine, tray, rituals, abilities, phases, notices |
| `src/server/domain/diagnostico.ts` | 37 KB | reachability/difficulty diagnostics (mostly pure) |
| `src/components/admin/arbol/ExploradorArbol.tsx` | 34 KB | tree explorer |
| `src/builder/styles.css` | 57 KB | all editor + card styles in one file (also read from disk by the server renderer, C8) |

### 1.5 Hygiene problems

**Committed junk:** `lotm/graphify-out/` (19 files, ~2.8 MB: graph.json 1.5 MB + graph.html 1.2 MB), `lotm/!owned.includes(ritual.id)` (0-byte accident), `AIUUDA` (session notes), root `README.md` (quoted placeholder string), `lotm/public/covers/Documents - Acceso directo.lnk` (Windows shortcut).
**On-disk junk (untracked):** `lotm/translate_{juego,mesa,panel,store}.py`, `lotm/dist/` (stale pre-Next Vite build), `lotm/prisma/dev.db` (0 bytes), stale `.next-build/`.
**Asset filename typos** in `public/pathway-back/`: `balckemperor.jpg`, `darkeness.jpg`, `juticiar.jpg`, `parawon.jpg`, `viionary.jpg` (referenced with the same typos from `src/builder/data/pathwayBackgrounds.js`).
**Doc drift (README.md in lotm/):** claims SQLite + `@prisma/adapter-better-sqlite3` for the game (§Stack, §2, §10, §Arquitectura) while `db.ts` requires PostgreSQL/pg; documents `npm run db:seed` which **does not exist** in package.json (seed system was removed; `prisma/seed-content/` no longer exists on disk); Docker section claims the container seeds; backup section still says "copy data/game.db".
**i18n inconsistency:** `app/layout.tsx:19` defaults to `'es'` when no cookie; `i18n/content.ts:20` (`browserLanguage()`) defaults to `'en'`. The es/en toggle only localizes DB content now — UI chrome was hardcoded English — so `es` yields a broken mixed UI. `text()` helper survives in exactly one component (NavPrincipal).
**Zod import inconsistency:** `src/cards/schema.ts` and `api/cards/route.ts` import `'zod/v4'`; game code imports `'zod'` (same v4 package).
**Duplicated config:** `opencode.json` at root (remote prod MCP) + `lotm/opencode.json` (local stdio MCP); `.mcp.json` (Claude Code, local stdio).
**`.planning/debug/resolved/mcp-card-sync-inconsistency.md`** references `src/builder/remoteSync.ts` which no longer exists (superseded by `useCardSession.js`) — fine as history, no action.

### 1.6 Security posture — **documented owner decision, do not "fix"**

`src/server/adminAuth.ts:61-64`: `haySesionAdmin()` returns `true` unconditionally ("Autenticación desactivada: uso exclusivamente local, un solo usuario."). The full HMAC-cookie mechanism exists below it, bypassed. Consequently the entire `/admin` panel and every mutation Server Action is open, and `/api/cards/**` routes have no auth either (the MCP HTTP endpoint on :3101 does keep its Bearer token).

**Owner decision (2026-08-01): leave auth disabled on purpose.** The deployment is considered trusted. This plan documents the risk (Phase 9 writes it into `docs/decisions.md` and the agent docs) and changes **nothing** about auth. Any future agent reading this: do not re-enable auth, do not add auth to `/api/cards`, do not "helpfully" harden this. Ask the owner first.

---

## 2. Binding decisions (owner-approved 2026-08-01)

| # | Topic | Decision |
|---|-------|----------|
| D1 | Structure | **npm-workspaces monorepo**: `apps/game` + `apps/card-studio` (+ `tools/obsidian-bridge`). `packages/` only if a real shared need appears (none identified — do not create speculatively). |
| D2 | Card studio | **Modernize deeply**: full TypeScript migration of `src/builder`, decompose App.jsx/Panel.jsx/styles.css, unify editor state with `cards/schema` types, single card-props mapping. |
| D3 | Code language | **Gradual English migration**: all new code English; existing modules renamed to English only when substantially rewritten anyway (the builder modernization qualifies; the game domain keeps Spanish until touched). Never rename-only commits. Public URLs and DB column names are never renamed. |
| D4 | Security | **Auth stays disabled**, documented as an accepted risk (§1.6). No auth work in this plan. |
| D5 | Game DB | **Purge SQLite traces from the game**: delete `prisma/migrations/` (SQLite), local `dev.db`/`game.db`; rewrite README/.env.example/Dockerfile for Postgres. `cards.db` (studio) STAYS SQLite — that is correct design. |
| D6 | Scope | All four extra workstreams: repo sanitation, AI-facing docs, minimal CI, visual-regression net for PNG export. |
| D7 | i18n | **English-only game UI**: remove LanguageProvider/toggle/client-side localization; serve `nameEn` with fallback to `name` resolved server-side. Spanish fields stay in DB as canonical/admin-edited data. Admin panel remains Spanish. |
| D8 | Vault & root | `lotm-vault/` stays in this repo untouched; workspace root gets formalized (real README, updated AGENTS.md, junk deleted). |

Decisions made by this plan (defaults; owner may override): new/rewritten engineering docs are written in **English**; test runner stays **`node:test` via tsx**; package manager stays **npm**; no dependency upgrades beyond what the split mechanically requires.

---

## 3. Hard constraints & invariants (never break)

1. **Production is live and auto-deploys from `main`.** Merge only deployable milestones (§5.0). If Docker cannot be built/tested locally, stop and ask the owner before merging M2.
2. **MCP contract is frozen**: server name `lotm-card-studio`, the 7 tool names and their input/output schemas, the `/mcp` endpoint + Bearer behavior, `/downloads/:filename`, ZIP layout `universo/NN-seccion/` + `manifest.json` v3. External clients (claude.ai, ChatGPT) depend on it.
3. **Public URLs are frozen**: `/`, `/coleccion`, `/logros`, `/admin/**`, `/cartas`, `/cartas/vivo`, `/api/cards/**`, game `/api/**`. The split must preserve these paths exactly (reverse proxy maps prefixes to services; apps must serve the same paths they serve today).
4. **PostgreSQL data is sacred**: no destructive migrations, no schema renames, no data rewrites. `prisma/migrations-postgresql/` history must remain valid for `prisma migrate deploy`.
5. **`cards.db` / `data/` layout is frozen**: `CARDS_DB_PATH`, `CARDS_IMAGE_DIR`, `CARDS_EXPORT_DIR` semantics unchanged; the deployed volume `lotm_data:/app/data` keeps working.
6. **Rendered PNG output is pixel-frozen** (within the visual-regression threshold) across the entire modernization. The goldens harness (Phase 0) is the arbiter.
7. **No behavior changes** except the ones explicitly ordered here (i18n removal D7, client-export unification §5.5-E). Refactor ≠ redesign.
8. **No dependency upgrades** (Next 15, React 19, Prisma 7.8, zod 4 stay). New devDependencies are allowed only where a phase lists them.
9. **`lotm-vault/` content is untouched** — only the root-level workspace docs referencing it may change. Never bulk-read the vault (its own NAVIGATION.md forbids it).
10. **Env var names are frozen** (`DATABASE_URL`, `DIRECT_URL`, `ADMIN_*`, `CARDS_*`, `OBSIDIAN_*`). New vars may be added (`NEXT_PUBLIC_CARDS_URL`), none removed without a deprecation note in README.
11. Tests currently passing must keep passing at every gate (baseline count recorded in Phase 0).

---

## 4. Target architecture

### 4.1 Workspace layout (end state)

```
lotm project/                          # git root
├── README.md                          # real workspace overview (EN)
├── AGENTS.md                          # updated conventions (kept: caveman rule, design→content serial rule)
├── CLAUDE.md                          # root agent map (Phase 9)
├── opencode.json                      # unchanged remote MCPs; paths reviewed
├── lotm/                              # npm workspaces root
│   ├── package.json                   # private, "workspaces": ["apps/*", "tools/*"], orchestration scripts only
│   ├── package-lock.json
│   ├── tsconfig.base.json             # shared strict compiler options
│   ├── .gitignore                     # updated (adds graphify-out/, keeps data/, .env, generated)
│   ├── docs/decisions.md              # ADRs incl. auth-disabled (D4), db choice, split rationale
│   ├── .planning/                     # kept as-is (debug-log convention)
│   ├── apps/
│   │   ├── game/                      # "Archivo de Misterios" — @lotm/game
│   │   │   ├── package.json           # next, react, prisma+pg adapter, zod, zustand, framer-motion, lucide-react, server-only
│   │   │   ├── next.config.ts         # NO serverExternalPackages needed
│   │   │   ├── prisma/                # schema.prisma + migrations-postgresql/ ONLY
│   │   │   ├── prisma.config.ts
│   │   │   ├── public/                # game-only assets (audit in P4.4 — likely empty)
│   │   │   ├── src/
│   │   │   │   ├── app/               # game pages + game api ONLY (no cartas, no api/cards)
│   │   │   │   ├── components/{game,admin}/
│   │   │   │   ├── server/{domain,services,actions}/ + db.ts adminAuth.ts perfil.ts schemas.ts apiError.ts
│   │   │   │   └── shared/            # ALL client-safe types/constants/pure logic (§4.2 rule)
│   │   │   ├── eslint.config.mjs
│   │   │   ├── tsconfig.json
│   │   │   └── CLAUDE.md / AGENTS.md  # game agent guide (Phase 9)
│   │   └── card-studio/               # @lotm/card-studio
│   │       ├── package.json           # next, react, better-sqlite3, playwright, ffmpeg-static, jszip*, MCP SDK, zod
│   │       ├── next.config.ts         # serverExternalPackages: better-sqlite3, ffmpeg-static; port 3002 in dev
│   │       ├── public/                # cover-default.jpg, covers/, pathway-back/, pathway-icons/
│   │       ├── mcp/                   # cards-stdio.ts, cards-http.ts (thin entrypoints)
│   │       ├── src/
│   │       │   ├── app/               # layout (fonts!), cartas/, cartas/vivo/, api/cards/**  — same URLs as today
│   │       │   ├── domain/            # pathways.ts (canonical data, moved from builder), schema/, builderState.ts, slug.ts, mapEntries.ts
│   │       │   ├── cards-ui/          # typed presentational card components + styles/ + cardProps.ts (single mapper)
│   │       │   ├── editor/            # EditorApp.tsx, Panel/, Filmstrip, ImageTray, ProjectTabs, hooks/, session/
│   │       │   ├── server/            # repository.ts, images.ts, export.ts, video.ts, render/, cardsDb.ts (singleton), openBrowser.ts
│   │       │   └── mcp/               # createCardsMcpServer (from src/cards/mcp.ts)
│   │       ├── test/visual/           # golden harness (Phase 0)
│   │       ├── eslint.config.mjs
│   │       ├── tsconfig.json          # allowJs:true only until Phase 5 completes
│   │       └── CLAUDE.md / AGENTS.md
│   ├── tools/
│   │   └── obsidian-bridge/           # package.json + obsidian-bridge.ts (vault tooling, not cards)
│   ├── Dockerfile.game
│   ├── Dockerfile.card-studio
│   └── docker-compose.production.yml  # services: lotm (game), card-studio (web), cards-mcp (same studio image)
└── lotm-vault/                        # untouched
```

### 4.2 Boundary rules (the allowed-import matrix)

**Between workspaces:** `apps/game` and `apps/card-studio` must not import from each other. Ever. The only links are URLs (`NEXT_PUBLIC_CARDS_URL` for the nav link) . `tools/obsidian-bridge` imports nothing from apps. No `packages/` until two workspaces genuinely need the same code (YAGNI — currently zero shared source after the split).

**Inside `apps/game`:**

| From ↓ may import → | shared | server/domain | server/services | server/actions | server/db,adminAuth,perfil | components | app |
|---|---|---|---|---|---|---|---|
| `shared/` | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| `server/domain` | ✔ | ✔ | ✖ | ✖ | db type only | ✖ | ✖ |
| `server/services` | ✔ | ✔ | ✔ | ✖ | ✔ | ✖ | ✖ |
| `server/actions` | ✔ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ |
| `app/api` + server pages | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `components/**` (client) | ✔ | ✖ (types via shared) | ✖ | ✔ (calling actions only) | ✖ | ✔ | ✖ |

Enforcement (Phase 6): every module under `server/` (except `actions/*`, which client code legitimately imports to invoke) gets `import 'server-only'` as its first import. That makes any future client-side import a **build error** — the strongest, zero-config guarantee. Types/constants needed by both sides live in `shared/` (client-safe: no node builtins, no Prisma, no env access).

**Inside `apps/card-studio`:** dependency direction is strictly `app → editor → cards-ui → domain` and `app/mcp entrypoints → server → cards-ui/domain`. `domain/` imports nothing from the other layers (this kills cycles S1/S3). `cards-ui/` is pure presentational (no fetch, no fs, no repository). `server/` never imports `editor/`.

### 4.3 Runtime topology

Dev: `npm run dev -w @lotm/game` → :3000 · `npm run dev -w @lotm/card-studio` → :3002 · game nav "Cards" link uses `NEXT_PUBLIC_CARDS_URL` (dev default `http://localhost:3002/cartas`, prod default `/cartas`). `CARDS_LIVE_VIEW_URL` default becomes `http://localhost:3002/cartas/vivo`.

Prod (compose): `lotm` (game image) · `card-studio` (studio web, :3000 internal) · `cards-mcp` (studio image, `npm run mcp:http`, :3101) — all on `stack_web`. Reverse proxy (operator step, documented in README): route `/cartas*` and `/api/cards*` to `card-studio`, `/mcp` to `cards-mcp:3101` (unchanged), everything else to `lotm`. Because both apps serve the exact same paths as today, **no client or bookmark breaks**.

### 4.4 Language & naming conventions (D3, precise policy)

- New files, symbols, comments, commit messages, engineering docs: **English**.
- `apps/card-studio` after Phase 5: fully English (it is rewritten, so it qualifies).
- `apps/game`: Spanish identifiers stay. A module may be renamed to English only when ≥50% of it is being rewritten for a scheduled reason. Renames update **all** references in the same PR; no re-export shims left behind at the end of that PR.
- Never rename: public route segments (`/admin/recetas`, `/coleccion`…), DB models/columns, env vars, MCP tool names, JSON import/export format fields (v2/v3/v4 backups must keep round-tripping).
- File naming: components `PascalCase.tsx`, modules `camelCase.ts`, dirs `kebab-case`. Max target sizes (new/rewritten code): component file ≤ 400 lines, module ≤ 500 lines, function ≤ 60 lines. Existing files above the cap are only split when a phase orders it.
- Comments explain *why*, not *what*. No commented-out code survives a phase.

### 4.5 Testing strategy

- Runner stays `node:test` via `tsx --test`, colocated `*.test.ts`.
- Per-app scripts: `test`, `lint`, `typecheck` (`tsc --noEmit`), `build`. Root orchestrates: `npm run test -ws --if-present` etc.
- Baseline count captured in Phase 0 (expect ≈219+ passing). Every gate re-runs the full suite of both apps.
- New pure modules extracted during decomposition get their own tests **moved with them** (tests exist already for much of the pure logic — keep them green, relocate imports).
- Visual harness (Phase 0) is a local gate for Phases 3/5 (fonts/AA make PNGs machine-dependent; CI runs everything except pixel comparisons).

---

## 5. Execution phases

### 5.0 Branch & deploy gates

| Milestone | Contains | Mergeable when |
|---|---|---|
| M1 | Phase 1 (sanitation) | gates pass; deploy-safe (no structural change) |
| M2 | Phases 0, 2, 3, 4, 7 **together** | both apps build; Docker images build; compose config validated. This is the atomic split+deploy change. If local Docker validation is impossible, **pause and ask the owner** to schedule a supervised deploy. |
| M3 | Phase 5 (studio modernization) | visual goldens pass; suite green |
| M4 | Phase 6 (game cleanup) | suite green; manual admin-tree checklist done |
| M5 | Phases 8, 9 (CI, docs) | CI green on GitHub |

Work each milestone on `refactor/mN-short-name`, PR into `main`, merge only at gate. Between M2's phases, commit freely on the branch.

---

### Phase 0 — Baseline & visual safety net `[before any code moves]`

**Goal:** freeze today's behavior as verifiable artifacts.

Steps:

- **P0.1** Record baseline: run `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` in `lotm/`. Save outputs (pass/fail, test count) into `lotm/docs/baseline-2026-08.md`. If anything already fails, record it as pre-existing — do not fix yet, do not let it silently become "expected".
- **P0.2** Build the golden harness at `lotm/test-visual/` (moves into `apps/card-studio/test/visual/` in Phase 3):
  - Fixture set: one deterministic card per type — `Character`, `Artifact`, `Cover`, `Full Image Cover`, `Tier` (pathway + sequence variants), `Pathway`, `Tier Explanation` (with & without background), `General Explanation` (general + pathway-bound), `Pathway Explanation`, `Breakdown`, `Map`, `Tarot Member` — using only repo-local images (`/cover-default.jpg`, pathway assets) and fixed text. Store fixtures as JSON (`CardContent[]`).
  - Script `render-goldens.ts`: boots `CardPngRenderer`, renders every fixture to `data/card-goldens/<slug>.png` (gitignored — machine-local goldens).
  - Script `compare-goldens.ts`: re-renders and compares vs `data/card-goldens/` using `pixelmatch` + `pngjs` (add as devDependencies). Threshold: fail if > 0.5% of pixels differ (tune once against a double-run of the same code — the double-run must pass with ~0%).
  - npm scripts: `visual:record`, `visual:check`.
- **P0.3** Run `visual:record` once. Run `visual:check` immediately to prove determinism.
- **P0.4** Baseline the MCP surface: run the stdio server, call `list_card_library` and `export_cards_zip` against a scratch `CARDS_DB_PATH`, save tool list JSON (names + schemas) into `docs/baseline-2026-08.md`.

**Gate:** `visual:check` passes on unmodified code; baseline doc committed.

---

### Phase 1 — Repo sanitation `[parallel-ok with Phase 0]` → **M1**

- **P1.1** `git rm -r lotm/graphify-out` and add `graphify-out/` to `lotm/.gitignore` (keep the local folder if the owner uses it — just untrack).
- **P1.2** `git rm "lotm/!owned.includes(ritual.id)"`.
- **P1.3** `git rm "lotm/public/covers/Documents - Acceso directo.lnk"`.
- **P1.4** Delete `AIUUDA` (its only durable info — DB stats, translation file list — is superseded by this plan and git history).
- **P1.5** Delete untracked junk on disk: `lotm/translate_*.py`, `lotm/dist/`, `lotm/prisma/dev.db`.
- **P1.6** Replace root `README.md` placeholder with a real workspace overview (EN): what the two apps + vault are, links to each app README, deploy summary, the auth-disabled notice.
- **P1.7** Fix `lotm/README.md` **factual lies only** (full rewrite happens in Phase 7): remove `db:seed` instructions, correct the SQLite→PostgreSQL statements, mark `/cartas` section as "moving to apps/card-studio (see REFACTOR_PLAN.md)".
- **P1.8** Add `docs/decisions.md` with ADR-000 (this refactor, link to plan), ADR-001 (auth intentionally disabled — text from §1.6), ADR-002 (game on Supabase Postgres; cards on SQLite by design), ADR-003 (gradual-English naming policy).

**Gate:** `git status` clean of the removed items; `npm run build` still passes (nothing referenced the junk); M1 merge.

---

### Phase 2 — Workspace scaffolding (no file moves yet)

- **P2.1** Create `lotm/package.json` workspaces root: `{ "name": "lotm-workspace", "private": true, "workspaces": ["apps/*", "tools/*"] }` — but **first** move the existing package content: the current `lotm/package.json` becomes `apps/game/package.json` in Phase 4; to keep every intermediate commit installable, do the scaffold in this order:
  1. Create empty `apps/`, `tools/` dirs.
  2. Add `tsconfig.base.json` (copy current compilerOptions minus Next-specific `plugins`/`paths`; keep `strict`, ES2022, bundler resolution).
  3. Root scripts (final shape): `dev:game`, `dev:cards`, `build`, `test`, `lint`, `typecheck` → `npm run <x> -ws --if-present`; `db:migrate|deploy|studio` → `-w @lotm/game`; `mcp:stdio|mcp:http|cards:browser` → `-w @lotm/card-studio`; `obsidian:bridge` → `-w @lotm/obsidian-bridge`.
- **P2.2** Scaffold `apps/card-studio/package.json` (`@lotm/card-studio`, deps: next, react, react-dom, better-sqlite3, playwright, ffmpeg-static, jszip, html2canvas *(removed later in P5.5-E)*, @modelcontextprotocol/sdk, zod, lucide-react *(check usage; builder uses plain markup — drop if unused)*; devDeps: typescript, tsx, @types/*, eslint stack, tailwind stack only if `/cartas` pages use it — they don't; globals come from `builder/styles.css` — so no tailwind here, pixelmatch, pngjs).
- **P2.3** Scaffold `apps/game/package.json` (`@lotm/game`, deps: next, react, react-dom, @prisma/client, @prisma/adapter-pg, pg, zod, zustand, framer-motion, lucide-react, server-only; devDeps: prisma, typescript, tsx, @types/*, eslint stack, tailwind v4 postcss stack, dotenv).
- **P2.4** Scaffold `tools/obsidian-bridge/package.json` (`@lotm/obsidian-bridge`, deps: @modelcontextprotocol/sdk; devDeps: tsx, typescript, @types/node, @types/express).
- **P2.5** Per-app `tsconfig.json` extending `../../tsconfig.base.json` with each app's `paths: {"@/*": ["./src/*"]}`, Next plugin, includes. Card-studio keeps `allowJs: true` (until P5 gate). Per-app `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` (game only), `next-env.d.ts` regenerated by Next.
- **P2.6** Run `npm install` at `lotm/` to produce the single workspace lockfile. Note: Dockerfile pins `npm@11.6.2` — regenerate the lock with that npm version to avoid the documented `npm ci` EUSAGE mismatch.

**Gate:** `npm install` clean; `npm ls --workspaces` resolves; nothing built yet (apps still empty shells is acceptable mid-M2-branch).

---

### Phase 3 — Extract card-studio (moves only, minimal edits)

Rule: `git mv` everything first, then fix imports/config in separate commits. No logic rewrites here — that is Phase 5.

- **P3.1** Moves (old → new):

| From (lotm/) | To (lotm/apps/card-studio/) |
|---|---|
| `src/builder/**` | `src/builder/**` *(temporary home; restructured in P5)* |
| `src/cards/**` | `src/cards/**` *(temporary; becomes domain/server/mcp in P5)* |
| `src/app/cartas/**` | `src/app/cartas/**` |
| `src/app/api/cards/**` | `src/app/api/cards/**` |
| `src/server/cardsDb.ts` | `src/server/cardsDb.ts` |
| `src/server/apiError.ts` | **copy** (both apps use the 10-line helper; a copy beats a shared package — YAGNI) |
| `mcp/cards-stdio.ts`, `mcp/cards-http.ts` | `mcp/` |
| `public/cover-default.jpg`, `public/covers/**`, `public/pathway-back/**`, `public/pathway-icons/**` | `public/…` |
| `test-visual/**` (from P0.2) | `test/visual/**` |

- **P3.2** Create `apps/card-studio/src/app/layout.tsx`: minimal root layout with the Google-Fonts `<link>` set the builder needs (Cinzel, Space Grotesk, Playfair Display, Archivo, JetBrains Mono — same list `render.tsx:46-48` uses; today they piggyback on the game layout's font links, `app/layout.tsx:26-29`). No NavPrincipal, no LanguageProvider. Title: "LOTM Card Studio".
- **P3.3** Fix imports mechanically (`@/builder/...`, `@/cards/...` paths still work via the app-local `@/*` alias). Fix `render.tsx` project-root resolution: replace `process.env.CARDS_PROJECT_ROOT || process.cwd()` anchoring with a path derived from `import.meta.url` (module-relative `../../` to the app root), keeping `CARDS_PROJECT_ROOT` as an override for the Docker layout. Verify `styles.css` read and `public/` asset resolution against the new app root.
- **P3.4** Repository/env: `CardRepository` resolves `CARDS_DB_PATH` default `./data/cards.db` relative to cwd — in dev the cwd is now `apps/card-studio/`. Decide root-anchored resolution: default becomes `<workspace-root>/data/cards.db` (resolve upward from the app dir), so the existing dev database and the Docker volume keep working without env changes. Same for `CARDS_EXPORT_DIR`, `CARDS_IMAGE_DIR` defaults.
- **P3.5** Update `lotm/.mcp.json` and `lotm/opencode.json` stdio command to `node --import tsx apps/card-studio/mcp/cards-stdio.ts` (cwd stays `lotm/`). Root `opencode.json` (remote URL) unchanged.
- **P3.6** `.env` handling: create `apps/card-studio/.env.example` with the `CARDS_*` variables (copy relevant half of current `.env.example` incl. comments). MCP entrypoints keep `process.loadEnvFile()` — make them load the workspace-root `.env` (try app dir, then walk up) so one dev `.env` keeps serving both apps.
- **P3.7** Move studio-only tests with their sources; adjust `test` script glob: `tsx --test "src/**/*.test.ts" "test/**/*.test.ts"`.

**Gate:** `npm run build -w @lotm/card-studio` passes; `npm run test -w @lotm/card-studio` green; `npm run mcp:stdio` boots and `list_card_library` answers; `visual:check` passes against P0 goldens; `/cartas` and `/cartas/vivo` render in `npm run dev:cards`.

---

### Phase 4 — Slim the game into `apps/game`

- **P4.1** `git mv` the remainder: `src/app` (minus moved cartas/api-cards), `src/components`, `src/server` (minus cardsDb), `src/shared`, `src/i18n`, `prisma/` (schema + `migrations-postgresql/` only), `prisma.config.ts`, `src/app/globals.css`, into `apps/game/`. The old `lotm/src`, `lotm/mcp`, `lotm/public` must end up **empty and deleted**.
- **P4.2** Delete `prisma/migrations/` (SQLite, dead per D5) — `git rm -r`. `migration_lock.toml` of the postgres folder stays.
- **P4.3** `next.config.ts` for game: drop `serverExternalPackages` (C6 gone), keep `distDir` env override.
- **P4.4** Asset audit: grep game `src/` for `pathway-icons|pathway-back|covers/|cover-default` — expected: zero hits (all card assets moved). If a game usage appears, copy (not share) that asset into `apps/game/public/`.
- **P4.5** NavPrincipal `/cartas` link → `process.env.NEXT_PUBLIC_CARDS_URL ?? '/cartas'`; add the var to `apps/game/.env.example` with dev value `http://localhost:3002/cartas`.
- **P4.6** Create `apps/game/.env.example` (DATABASE_URL, DIRECT_URL, DATABASE_POOL_MAX, TEST_DATABASE_URL, SUPABASE_*, ADMIN_PASSWORD, ADMIN_SESSION_SECRET, NEXT_PUBLIC_CARDS_URL) — carrying over the existing pooling/session-pooler comments.
- **P4.7** Root `lotm/` residue check: only `package.json`, lockfile, `tsconfig.base.json`, `.gitignore`, `docs/`, `.planning/`, `.agents/`, `apps/`, `tools/`, Docker files, compose, `.env(.example)` pointers, `skills-lock.json`, `README.md` remain. `git mv mcp/obsidian-bridge.ts tools/obsidian-bridge/`.
- **P4.8** Game test script: `tsx --test "src/**/*.test.ts"` (the old `prisma/**/*.test.ts` glob matches nothing — seed tests were deleted with the seed system; drop the glob).

**Gate:** `npm run build -ws` both green; `npm run test -ws` green (count ≥ baseline); `npm run dev:game` serves `/`, `/coleccion`, `/admin` against a reachable `DATABASE_URL`; `typecheck` green in both.

---

### Phase 7 — Deployment & docs alignment *(executed inside M2, numbered 7 for reading order)*

- **P7.1** `Dockerfile.game`: build `apps/game` only (`npm ci --workspace @lotm/game --include-workspace-root`, `prisma generate`, `next build`); runtime copies `.next`, `public`, `prisma`, `prisma.config.ts`, `node_modules` (pruned), **not `src/`**; CMD `npx prisma migrate deploy && npm run start -w @lotm/game`. No openssl-for-sqlite leftovers; keep openssl (pg TLS).
- **P7.2** `Dockerfile.card-studio`: build `apps/card-studio`; runtime **keeps `apps/card-studio/src/`** (render reads `styles.css`/`cards-ui/styles` from disk; MCP entrypoints run via tsx) + `playwright install --with-deps chromium` layer; expose 3000 (web) — the same image runs `npm run mcp:http -w @lotm/card-studio` (:3101) for the `cards-mcp` service. Set `CARDS_PROJECT_ROOT=/app/apps/card-studio`.
- **P7.3** `docker-compose.production.yml`: `lotm` → `Dockerfile.game`; new `card-studio` service (studio image, web); `cards-mcp` service name/port/volume **unchanged**, now from the studio image. All three on `stack_web`, `env_file: .env`, shared `lotm_data:/app/data` for the two studio services.
- **P7.4** README rewrite, split three ways (all EN): `lotm/README.md` (workspace: layout, root scripts, deploy/autodeploy, reverse-proxy prefix table from §4.3, backup: "game = Supabase/pg_dump; cards = copy data/"), `apps/game/README.md` (setup, env, migrate, admin guide — port the still-true Spanish sections §6-§9 translated), `apps/card-studio/README.md` (editor, session model, MCP tools table, HTTP/ChatGPT registration, export formats, video export, visual harness usage).
- **P7.5** Write the operator note (in workspace README): exact reverse-proxy rules required before first deploy of M2, and the order (deploy images → switch proxy for `/cartas*`+`/api/cards*` → verify `/mcp` untouched).
- **P7.6** Update root `AGENTS.md` paths (`lotm/apps/...`), keep the caveman + serial workflow rules and vault-navigation pointer intact.

**Gate (closes M2):** `docker build -f Dockerfile.game .` and `docker build -f Dockerfile.card-studio .` succeed locally; `docker compose -f docker-compose.production.yml config` validates; a local `docker run` of each image boots (game needs a DATABASE_URL — use a scratch/branch DB or document owner-supervised verification). **If Docker is unavailable locally, stop and coordinate the M2 merge with the owner (constraint §3.1).**

---

### Phase 5 — Card-studio deep modernization → **M3**

Order matters: domain first, then cards-ui, then render, then editor. Run `visual:check` after **every** sub-phase.

- **P5.1 Domain extraction.** Create `src/domain/`: move `builder/data/pathways.js` → `domain/pathways.ts` (typed: `Pathway`, `TierRank`, `PowerLevel` types; keep exported names/values identical), `pathwayIcons.js`/`pathwayBackgrounds.js` → typed modules; `builder/mapEntries.ts`, `sequencePips.ts`, `tierText.ts`, `titleFit.ts` (+tests) → `domain/`; split `cards/schema.ts` (752 ln) → `domain/schema/` (`base.ts`, one file per card family, `builderState.ts` for `to/fromBuilderCardState`, `filters.ts`, `index.ts` re-exporting the **exact current public names**); `slugify` → `domain/slug.ts`. Fix S1/S3: after this, `domain` imports nothing from builder/editor. Normalize `'zod/v4'` → `'zod'`.
- **P5.2 cards-ui.** Move the 11 card components (`builder/components/{Card,CoverCard,FullImageCoverCard,TierCard,PathwayCard,TierExplanationCard,GeneralExplanationCard,PathwayExplanationCard,BreakdownCard,MapCard,TarotMemberCard}.jsx`) → `src/cards-ui/*.tsx` with typed props. Split `builder/styles.css` (810 ln) into `cards-ui/styles/` (base + per-card files) with an explicit ordered manifest `styleFiles.ts` consumed by BOTH the Next pages (CSS imports) and the renderer (disk read + concat) — order identical, verified by the goldens. Build the **single mapper** `cards-ui/cardProps.ts`: `CardContent → props` (replaces the three parallel mappings, S4). `LiveCardPreview` becomes a thin `cards-ui/CardView.tsx` used by live view AND editor preview.
- **P5.3 Server layer.** `cards/repository.ts` → `server/repository.ts` (+ its temp-file test), `images.ts`, `export.ts`, `video.ts`, `openBrowser.ts` → `server/`; `render.tsx` → `server/render/` split: `assets.ts` (css/fonts/icon resolution), `html.ts` (static markup via cardProps), `renderer.ts` (Playwright lifecycle). `cards/mcp.ts` → `src/mcp/createServer.ts`. Entry `mcp/*.ts` files only re-wire imports. MCP tool schemas/names byte-identical (§3.2).
- **P5.4 Editor rewrite (TS).** `builder/App.jsx` (940 ln) → `editor/` decomposition: `EditorApp.tsx` (shell ≤300 ln), `state/` (editor store — plain reducer or zustand, typed by `BuilderCardState`), `hooks/` (`useProjects`, `useImages`, `useVideoExport`, `useZipExport`), `cardSeeds.ts`, `session/useCardSession.ts` (typed port of the 488-ln hook; polling/reconciliation logic is subtle and battle-tested — port mechanically, keep its tests/behavior, do not "improve" concurrency semantics), `components/` (`Panel/` split per card-type field groups ≤250 ln each, `Filmstrip.tsx`, `ImageTray.tsx`, `ProjectTabs.tsx`, `SectionField.tsx`). Delete `builder/storage.js` IndexedDB migration **only after** confirming with the owner that no device still holds pre-server cards (default: keep a no-op tombstone that clears the old DB, one release, then delete).
- **P5.5-E Export unification (approved direction, small decision gate).** Replace the client `html2canvas`+`jszip` per-section download with a server-rendered path: new `GET /api/cards/export?part=` endpoint calling the same `exportCardsToZip` (streams the ZIP; no MCP involvement). Editor download buttons hit that endpoint. Then remove `html2canvas` + `jszip` from studio deps (S5 resolved — one render path, WYSIWYG = export guaranteed). *Gate:* confirm with the owner only if they rely on downloads while the dev server is off (they cannot — the editor is server-backed anyway).
- **P5.6** Rename typo'd assets (`balckemperor.jpg`→`black-emperor.jpg`, `darkeness`→`darkness`, `juticiar`→`justiciar`, `parawon`→`paragon`, `viionary`→`visionary`) and update `domain/pathwayBackgrounds.ts` in the same commit; `visual:check` must stay green.
- **P5.7** Flip `allowJs: false` in studio tsconfig; delete the now-empty `src/builder/`, `src/cards/`; `typecheck` green with zero `.js/.jsx` left.
- **P5.8** Studio `CLAUDE.md`/`AGENTS.md` first draft (final polish P9).

**Gate (M3):** `visual:check` green vs P0 goldens (the whole point); suite green; `npm run build` green; MCP smoke test (`save_card_batch` → `export_cards_zip` → unzip, inspect manifest v3 shape unchanged); manual editor session: create/edit/move/delete/reorder cards, upload image, video export, per-section download.

---

### Phase 6 — Game internal cleanup → **M4**

- **P6.1 Boundary fix (G1–G4).** Move to `shared/` (client-safe): from `server/domain/tipos.ts` → the public data types + `ELEMENT_TYPES`/`etiquetaTipo` (`shared/tipos.ts` or grow existing files); from `habilidades.ts` → `ABILITY_DEFINITIONS`, `ABILITY_KEYS`, `PlayerAbilities`, `PotentialTier`, `facultadesDesdeSlugs`, `desbloqueosNuevos` → `shared/habilidades.ts` (server file keeps Db-touching logic, re-exports nothing — update all imports); `ritualKnowledge.ts` public types → `shared/ritualKnowledge.ts` (server keeps `RITUAL_KNOWLEDGE_ELEMENT_SLUG` consumers importing from shared); `DiagDifficulty` + `DIFICULTAD_LABELS` → `shared/dificultad.ts` (merge with `components/admin/dificultad.ts`); `server/actions/tipos.ts` (`EstadoAccion`, `ESTADO_INICIAL`) → `shared/actionState.ts`. Remove the legacy shims `server/domain/inputKey.ts` and any other re-export files by updating importers to `@/shared/*` directly.
- **P6.2 Enforce.** Add `import 'server-only'` to every module in `server/` except `actions/*` (db.ts, adminAuth.ts, perfil.ts, cardsDb-less now, schemas.ts, every `domain/*` with Db access, every `services/*`). Add dep `server-only`. Build proves the boundary.
- **P6.3 i18n removal (D7).** Server-side: `server/domain/publicos.ts` mappers resolve English at the source (`name = nameEn?.trim() || name`, same for description/reveal/optionLabel/ingredient names — replicating `localizedElement`/`localizedRitualState` logic exactly, including the "sequence labels keep canonical name" rule at `i18n/content.ts:13`), and stop emitting `nameEn`/`descriptionEn` in public payloads. Client-side: delete `src/i18n/` entirely; `layout.tsx` drops cookie read + LanguageProvider, `<html lang="en">`; `NavPrincipal` loses `useLanguage`/toggle, labels collapse to the English string; `store.ts` drops `browserLanguage/localized*` calls. Delete the `am-language` cookie write path. DB schema untouched (admin keeps editing both languages; `nameEn` remains the game-facing text).
- **P6.4 store.ts decomposition.** Split into `components/game/store/` slices (combine/tray/rituals/abilities/phases/notices) composed into the same `useJuegoStore` API — selectors used by components must not change signatures. Keep existing store tests green; add slice-level tests only where extraction creates pure functions.
- **P6.5 Admin tree decomposition.** `MapaFases.tsx` → `components/admin/arbol/mapa/` (container ≤400 ln + `GrafoDeFase`, panels, dialogs, `hooks/`); `ArbolConexiones.tsx` → extract pure layout into `arbol/layoutConexiones.ts` (+unit test with a small fixture graph) + SVG components; `ExploradorArbol.tsx` similarly. **Manual checklist** (no automated UI tests exist): tree renders per phase; filters; element selection panel; recipe create/edit from node; phase rule editor opens/saves; feature-gate toggles; nothing new in browser console.
- **P6.6 services/datos.ts split.** → `services/datos/` (`exportNominal.ts` v2/v4, `exportBackup.ts` v3, `importValidate.ts`, `importExecute.ts`, shared `mappers.ts`, `index.ts` preserving the current public API). Round-trip test: export v3 → import (merge & replace modes) on a scratch schema equals original (a `TEST_DATABASE_URL` harness exists per `.env.example` — use it).
- **P6.7 diagnostico.ts split** (pure calculators vs orchestration) — keep exported API stable; its tests already cover the math.
- **P6.8** Delete remaining dead weight found by `knip` or manual grep (run `npx knip` in game app; treat output as candidates, verify each).

**Gate (M4):** suite green; build green; `server-only` present in every server module (grep-verified); zero imports from `@/server/domain|services` inside `components/**` (grep gate, excluding `actions`); P6.5 manual checklist done; export/import round-trip test green.

---

### Phase 8 — Minimal CI `[parallel-ok with Phase 9]` → part of **M5**

- **P8.1** `.github/workflows/ci.yml`: on push/PR to `main`; Node 22; `npm ci`; matrix over `@lotm/game`, `@lotm/card-studio` running `lint`, `typecheck`, `test`, `build`. Game build needs `prisma generate` (script `prebuild` or explicit step) and dummy `DATABASE_URL` (build is `force-dynamic`, never connects — set `postgresql://ci:ci@localhost:5432/ci`).
- **P8.2** Studio job installs Chromium only if any test requires it (repository/schema/mcp tests don't; visual harness is explicitly **not** run in CI — document in workflow comments).
- **P8.3** Badge in workspace README. No deploy automation changes (the VPS timer stays the deploy mechanism).

**Gate:** first green run on GitHub Actions.

---

### Phase 9 — AI-facing documentation → closes **M5**

- **P9.1** Root `lotm project/CLAUDE.md`: workspace map, "which app owns what", the frozen invariants (§3 digest), auth-disabled notice, vault access rule (point to `lotm-vault/NAVIGATION.md`, never bulk-read), language policy, how to run everything (table of root scripts), deploy model (autodeploy-on-main warning!).
- **P9.2** `apps/game/CLAUDE.md`: layer map with the import matrix (§4.2), where shared/ vs server/ code goes, Spanish-domain convention + gradual-English rule, DB rules (Postgres, never destructive, `migrations-postgresql`), test/verify commands, admin-panel manual-test checklist location.
- **P9.3** `apps/card-studio/CLAUDE.md`: architecture (`domain → cards-ui → editor/server`), the MCP contract freeze, session/polling model summary, visual-goldens workflow (**record before refactor, check after every change to cards-ui/render**), env vars, "renderer and pages must consume styles via styleFiles.ts" rule.
- **P9.4** Mirror each CLAUDE.md as AGENTS.md (opencode reads that name) — identical content via a one-line include note, not divergent copies.
- **P9.5** Update `docs/decisions.md` with any deviations accumulated in §11; final pass on the three READMEs for stale statements (grep for `game.db`, `db:seed`, `better-sqlite3` in game docs, `src/builder` paths).
- **P9.6** Delete `lotm/AGENTS.md`-level stale references (old `mcp/cards-stdio.ts` path in configs was fixed in P3.5 — re-verify).

**Gate:** a fresh agent session pointed at the repo can answer "where do I add a new card type?" and "how do I run the game tests?" from the docs alone (self-review against the docs); M5 merge.

---

## 6. File-by-file migration map (summary)

Everything under `lotm/` moves to exactly one of these destinations. `[P#]` = phase that moves it.

| Current | Destination | Phase |
|---|---|---|
| `src/builder/**` | `apps/card-studio/src/{domain,cards-ui,editor}/**` (via temporary `src/builder`) | P3 → P5 |
| `src/cards/**` | `apps/card-studio/src/{domain,server,mcp}/**` (via temporary `src/cards`) | P3 → P5 |
| `src/app/cartas/**`, `src/app/api/cards/**` | `apps/card-studio/src/app/...` (same URLs) | P3 |
| `src/server/cardsDb.ts` | `apps/card-studio/src/server/cardsDb.ts` | P3 |
| `mcp/cards-*.ts` | `apps/card-studio/mcp/` | P3 |
| `mcp/obsidian-bridge.ts` | `tools/obsidian-bridge/` | P4 |
| `public/{cover-default.jpg,covers,pathway-back,pathway-icons}` | `apps/card-studio/public/` | P3 |
| `src/app/**` (game pages+api), `src/components/**`, `src/server/**`, `src/shared/**` | `apps/game/src/...` | P4 |
| `src/i18n/**` | `apps/game/src/i18n` → **deleted** | P4 → P6.3 |
| `prisma/schema.prisma`, `prisma/migrations-postgresql/**`, `prisma.config.ts` | `apps/game/prisma...` | P4 |
| `prisma/migrations/**` (SQLite) | **deleted** | P4.2 |
| `package.json` | split → root workspaces + `apps/*/package.json` | P2–P4 |
| `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json` | per-app versions + `tsconfig.base.json` | P2 |
| `Dockerfile`, `docker-compose.production.yml` | `Dockerfile.game`, `Dockerfile.card-studio`, updated compose | P7 |
| `.mcp.json`, `opencode.json` (lotm) | updated stdio paths, stay at `lotm/` | P3.5 |
| `graphify-out/`, `!owned...`, `.lnk`, `AIUUDA`, `translate_*.py`, `dist/`, `dev.db` | **deleted** (graphify-out untracked, kept on disk) | P1 |
| `.planning/`, `.agents/`, `skills-lock.json` | stay at `lotm/` root | — |
| `README.md` (lotm) | rewritten + split into per-app READMEs | P1.7, P7.4 |

## 7. Code-reduction ledger (expected deletions)

| Item | Approx. saving | Phase |
|---|---|---|
| Committed junk (graphify-out, stray files, .lnk, AIUUDA) | ~2.8 MB in git, 25+ files | P1 |
| SQLite migration folder + stale seed/README sections | 24 files | P4.2, P7.4 |
| i18n machinery (LanguageProvider, content.ts, toggle, cookie plumbing, per-call localization in store) + `nameEn` plumbed through public payloads | ~250 lines + simpler payload types | P6.3 |
| Triple card-props mapping → single `cardProps.ts` (App preview, LiveCardPreview, render duplicates) | ~300–400 lines | P5.2 |
| Client export path (html2canvas + jszip + zip code in App.jsx) → server endpoint reuse | ~200 lines + 2 dependencies | P5.5-E |
| IndexedDB legacy migration (`storage.js` + App effect) | ~120 lines (after tombstone release) | P5.4 |
| Re-export shims (`server/domain/inputKey.ts` etc.) | small, removes indirection | P6.1 |
| Game deps dropped from studio & vice versa (playwright/ffmpeg/sqlite out of game image; prisma/pg/zustand/framer out of studio) | game Docker image shrinks drastically; installs faster everywhere | P2–P7 |
| `zod/v4` specifier normalization, `tsconfig` include of `.next-ui-review` (stale), unused deps found by knip (candidates: `base64-arraybuffer`? verify) | misc | P5.1, P6.8 |

## 8. Deferred items & open questions (defaults chosen; owner may override)

1. **Next `output: 'standalone'`** for the game image (smaller runtime). Deferred — do only after M2 is stable. Studio cannot use it easily (runtime disk reads of styles + tsx MCP).
2. **Admin panel language** stays Spanish (UI + identifiers). Revisit only under D3's rewrite rule.
3. **`schema.ts` splitting granularity** — P5.1 prescribes per-family files; executor may keep it single-file if splitting creates >30% boilerplate (record in §11).
4. **Editor session concurrency semantics** are intentionally NOT redesigned (P5.4). A `.planning/debug/resolved/mcp-card-sync-inconsistency.md` documents why the reconciliation is shaped the way it is — read it before touching `useCardSession`.
5. **Auth** — revisit only on explicit owner request (D4).
6. **pnpm/turborepo** — explicitly rejected for now; npm workspaces suffice at this scale.
7. **Playwright-based E2E for the game** — out of scope; manual checklists instead (P6.5).

## 9. Do-NOT list (for the executing agent)

- Do NOT enable or extend authentication anywhere (D4/§1.6) — not even "just a TODO fix".
- Do NOT upgrade dependencies, Node version, or Next major/minor.
- Do NOT rename Spanish game identifiers outside D3's rewrite rule; NEVER rename routes, DB columns, env vars, MCP tools, export-format fields.
- Do NOT touch `lotm-vault/` contents; do not bulk-read it.
- Do NOT modify Prisma schema or write migrations (nothing in this plan needs one).
- Do NOT run destructive git commands (`push --force` to main, history rewrites) — the squashed history stays as-is.
- Do NOT merge to `main` outside milestone gates (autodeploy!).
- Do NOT regenerate goldens to "make the check pass" — a red `visual:check` means investigate the diff; regenerate only for an intended, reviewed visual change, and say so in the commit message.
- Do NOT create `packages/` or any shared library until two workspaces need identical code AND copying it twice has actually hurt.
- Do NOT delete `data/` contents anywhere, ever.

## 10. Progress checklist

- [x] P0.1 baseline recorded · [x] P0.2 harness built · [x] P0.3 goldens deterministic · [x] P0.4 MCP surface baselined
- [x] P1.1–P1.5 junk removed · [x] P1.6 root README · [x] P1.7 README lies fixed · [x] P1.8 decisions.md · [ ] **M1 merged**
- [x] P2.1–P2.6 workspaces scaffolded, lockfile regenerated
- [x] P3.1 moves · [x] P3.2 studio layout+fonts · [x] P3.3 render root fix · [x] P3.4 data-dir anchoring · [x] P3.5 MCP configs · [x] P3.6 env split · [x] P3.7 tests moved · [x] studio gate green
- [ ] P4.1–P4.8 game slimmed · [ ] game gate green
- [ ] P7.1–P7.6 Docker/compose/README/AGENTS updated · [ ] **M2 merged (coordinated deploy)**
- [ ] P5.1 domain · [ ] P5.2 cards-ui + styles manifest + single mapper · [ ] P5.3 server/render/mcp · [ ] P5.4 editor TS rewrite · [ ] P5.5-E export unification · [ ] P5.6 asset typos · [ ] P5.7 allowJs off, builder/cards dirs gone · [ ] P5.8 studio agent docs · [ ] **M3 merged**
- [ ] P6.1 shared/ moves · [ ] P6.2 server-only enforced · [ ] P6.3 i18n removed · [ ] P6.4 store slices · [ ] P6.5 admin tree split + manual checklist · [ ] P6.6 datos split + round-trip test · [ ] P6.7 diagnostico split · [ ] P6.8 dead code sweep · [ ] **M4 merged**
- [ ] P8.1–P8.3 CI green · [ ] P9.1–P9.6 agent docs complete · [ ] **M5 merged**

## 11. Deviations log

*(executor appends dated entries here when reality forces a change to the plan)*

- **2026-08-01 — P1.1:** Used `git rm --cached` for `lotm/graphify-out/` so tracked artifacts leave Git while the local directory remains available, matching the step's “keep the local folder” requirement.
- **2026-08-01 — P1 gate:** Repaired pre-existing bilingual admin editor type mappings, stale English UI test assertions, and a Prisma transaction-client type mismatch exposed by the gate. This keeps Phase 1 deploy-safe without changing its sanitation scope.
