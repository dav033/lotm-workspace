# Archivo de Misterios (`@lotm/game`)

The discovery game and its admin panel. Read the workspace map in
[`../../../CLAUDE.md`](../../../CLAUDE.md) first — it holds the frozen
invariants and the auto-deploy warning.

## Layers

`shared/` → `server/domain` → `server/services` → `server/actions` → `app/`,
with `components/` on the client side.

- **`shared/`** — everything both sides may import: public data types, constants
  and pure logic. Client-safe by definition: no node builtins, no Prisma, no env
  access. When a client component needs a type or constant that lives on the
  server, the answer is always "move it to `shared/`", never "import from
  `server/`".
- **`server/domain`** — game rules over a `Db` Prisma-transaction type.
- **`server/services`** — admin use cases.
- **`server/actions`** — Server Actions. The one part of `server/` client code
  may legitimately import, because it has to in order to invoke them.
- **`app/`** — routes. Public URLs are frozen.

### Allowed imports

| From ↓ may import → | shared | server/domain | server/services | server/actions | server/db, adminAuth, perfil | components |
| --- | --- | --- | --- | --- | --- | --- |
| `shared/` | yes | no | no | no | no | no |
| `server/domain` | yes | yes | no | no | Db type only | no |
| `server/services` | yes | yes | yes | no | yes | no |
| `server/actions` | yes | yes | yes | yes | yes | no |
| `app/api`, server pages | yes | yes | yes | yes | yes | yes |
| `components/**` (client) | yes | no | no | actions only | no | yes |

The boundary is enforced by the build, not by convention: **every module under
`server/` except `actions/*` starts with `import 'server-only'`.** Any client
import of one becomes a build error. Keep that line when you add a server
module, and never delete it to "fix" a build — the error is telling you the code
belongs in `shared/`.

## Conventions

Domain identifiers and the admin UI are Spanish; player-facing UI text is
English. There is no runtime i18n any more: `server/domain/publicos.ts` resolves
English at the source (`nameEn?.trim() || name`) and public payloads no longer
carry the bilingual fields. The database keeps both languages, and the admin
panel keeps editing both.

New code is English. Existing Spanish modules get renamed only when they are
being substantially rewritten anyway — never in a rename-only commit, and never
for routes, DB columns, env vars or export-format fields.

## Database

PostgreSQL (Supabase) through `@prisma/adapter-pg`. `src/server/db.ts` requires
`DATABASE_URL`, so even a build needs one set, although every route is
force-dynamic and never connects at build time.

Migrations live in `prisma/migrations-postgresql/` — that history must stay
valid for `prisma migrate deploy`. Do not modify the schema or write migrations
unless the task actually calls for it, and never anything destructive. There is
no seed system and no local SQLite file; `npm run db:seed` does not exist.

## Verifying

From the workspace root (`lotm/`):

```text
npm run lint -w @lotm/game
npm run typecheck -w @lotm/game
npm run test -w @lotm/game
npm run build -w @lotm/game
```

Always run the suite through the npm script, never `npx tsx --test` directly.
The script loads `test/server-only-loader.mjs`, which neutralises the
`server-only` import; without it every test that reaches a server module dies
with "This module cannot be imported from a Client Component module" and it
looks like a real failure.

Boundary checks worth running after touching `server/` or `components/`:
`server-only` present in every non-action server module, and zero imports of
`@/server/domain` or `@/server/services` from `components/**`.

There are no automated UI tests. The admin panel is verified by hand; the
checklist lives in `REFACTOR_PLAN.md` under P6.5 — tree renders per phase,
filters, element selection, recipe create/edit from a node, phase rule editor
saves, feature-gate toggles, and nothing new in the browser console.

## Open decomposition work

`components/game/store.ts`, `components/admin/arbol/MapaFases.tsx` and
`components/admin/arbol/ExploradorArbol.tsx` are still oversized. Pure helpers
have been extracted into `components/game/store/` and
`components/admin/arbol/`; the remaining split is tracked as P6.4 and P6.5.
Whatever you extract, `useJuegoStore`'s selector signatures must not change.
