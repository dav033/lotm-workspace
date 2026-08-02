# Archivo de Misterios

Game workspace for the LOTM discovery game. It serves the game and admin
routes; Card Studio is a separate workspace and service.

## Stack and boundaries

- Next.js App Router, React, TypeScript, Tailwind CSS 4.
- PostgreSQL through Prisma 7 and `@prisma/adapter-pg`.
- `src/shared/` contains client-safe constants and types.
- `src/server/` contains database-backed domain and service code.
- `src/app/` contains pages and game API handlers.
- `src/components/` contains game and admin UI.

Game identifiers and admin UI remain Spanish. New engineering code and docs
are English. Public routes, Prisma models, columns, and environment variable
names are frozen.

## Setup

From the workspace root (`lotm/`):

```bash
npm install
Copy-Item .env.example .env # PowerShell
# cp .env.example .env     # macOS/Linux
npm run db:migrate -w @lotm/game
npm run dev:game
```

Configure `DATABASE_URL` for runtime queries and `DIRECT_URL` for Prisma CLI
migrations. The game has no local SQLite database and no seed script. Content
is managed through the admin panel and import/export tools.

## Commands

```bash
npm run lint -w @lotm/game
npm run typecheck -w @lotm/game
npm run test -w @lotm/game
npm run build -w @lotm/game
npm run start -w @lotm/game
```

Production runs `prisma migrate deploy` before `next start`. PostgreSQL data is
sacred: do not rewrite the schema or add destructive migrations in this
refactor. Back up with Supabase backups or `pg_dump`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Discovery game |
| `/coleccion` | Collection and progress |
| `/logros` | Achievements |
| `/admin/**` | Content and progression administration |
| `/api/**` | Game API handlers |

The navigation link for Card Studio uses `NEXT_PUBLIC_CARDS_URL`; local setup
defaults it to `http://localhost:3002/cartas`, while production routing keeps
the public `/cartas` path.

## Admin checklist

Open `/admin` against a reachable PostgreSQL database and verify:

1. Elements and recipes load.
2. A recipe can be created and tested.
3. Phase tree filters and selection panels render.
4. Phase rule editor opens, saves, and recalculates.
5. Feature-gate toggles and import/export remain usable.

Admin authentication is intentionally disabled for the trusted single-user
deployment. Do not re-enable or extend it without explicit owner direction.
