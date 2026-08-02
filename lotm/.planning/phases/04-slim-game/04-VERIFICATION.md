---
phase: 04-slim-game
verified: 2026-08-01T18:36:13-05:00
status: passed
score: 6/6 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 4/6
  gaps_closed:
    - "Eliminar carpetas vacías lotm/mcp y lotm/public."
    - "Hacer pasar gates workspace del bridge."
    - "Probar rutas runtime contra PostgreSQL accesible."
  gaps_remaining: []
  regressions: []
---

# Fase 4: Slim the game into `apps/game`

**Fuente de requisitos:** `REFACTOR_PLAN.md`, fase 4, P4.1–P4.8 y gate de línea 390.

**Commit auditado:** `dc7ff1f` (`refactor(game): move game into apps/game`).

## Objetivo

Separar el juego en `apps/game`, retirar restos del app antiguo, conservar solo PostgreSQL y dejar rutas, assets, scripts y configuración operables.

## Verdades observables

| # | Verdad | Estado | Evidencia |
|---|---|---|---|
| 1 | Código de juego vive en `apps/game`; antiguos archivos trackeados fueron retirados | ✓ VERIFICADO | `git ls-files` no muestra `lotm/src`, `lotm/mcp`, `lotm/public` ni `lotm/prisma`; carpetas vacías también eliminadas. |
| 2 | Prisma de juego usa solo PostgreSQL | ✓ VERIFICADO | `apps/game/prisma/schema.prisma`, `prisma.config.ts` y `migrations-postgresql/`; no hay `prisma/migrations/` SQLite. |
| 3 | Juego no depende de assets ni DB de Card Studio | ✓ VERIFICADO | Búsqueda P4.4 sin referencias a `pathway-icons`, `pathway-back`, `covers/` o `cover-default` bajo `apps/game/src`. |
| 4 | Navegación y entorno separan Card Studio | ✓ VERIFICADO | `NavPrincipal` usa `NEXT_PUBLIC_CARDS_URL`; `apps/game/.env.example` lo documenta. |
| 5 | Apps compilan, testean y hacen typecheck | ✓ VERIFICADO | `npm run build -ws`, `npm run test -ws` y `npm run typecheck -ws` PASS; 266 tests PASS (69 Card Studio + 197 game). Lint PASS con 1 warning de fuentes Next. |
| 6 | Rutas runtime del juego pasan con DB disponible | ✓ VERIFICADO | PostgreSQL temporal aislado, migraciones aplicadas; `/`, `/coleccion` y `/admin` respondieron 200. |

**Puntuación:** 6/6 verdades verificadas.

## Artefactos requeridos

| Artefacto | Estado | Detalle |
|---|---|---|
| `lotm/apps/game/package.json` | ✓ | Scripts de game y dependencias correctas. |
| `lotm/apps/game/next.config.ts` | ✓ | Conserva `distDir`; no conserva `serverExternalPackages`. |
| `lotm/apps/game/tsconfig.json` | ✓ | Extiende `tsconfig.base.json` y mantiene alias `@/*`. |
| `lotm/apps/game/.env.example` | ✓ | Incluye DB, Supabase, auth, pool y URL de Card Studio. |
| `lotm/apps/game/prisma/` | ✓ | Schema y migraciones PostgreSQL solamente. |
| `lotm/apps/game/src/` | ✓ | Juego, admin, API, servidor, shared e i18n presentes. |
| `lotm/tools/obsidian-bridge/package.json` | ✓ | Declara build, test y typecheck para gates workspace. |
| `lotm/tools/obsidian-bridge/tsconfig.json` | ✓ | Typecheck aislado del bridge. |
| `lotm/mcp`, `lotm/public` | ✓ | Carpetas vacías eliminadas. |

## Enlaces críticos

| Desde | Hacia | Estado | Evidencia |
|---|---|---|---|
| `NavPrincipal` | Card Studio | ✓ | `process.env.NEXT_PUBLIC_CARDS_URL ?? '/cartas'`. |
| `prisma.config.ts` | migraciones | ✓ | Ruta `prisma/migrations-postgresql`. |
| scripts raíz | apps | ✓ | `npm run build`, `test`, `typecheck` con `--if-present`. |
| páginas runtime | PostgreSQL | ✓ | Rutas probadas contra PostgreSQL temporal accesible y migrado. |

## Gate

- `npm run build`: PASS con `DATABASE_URL` presente.
- `npm run test`: PASS, 266/266.
- `npm run typecheck`: PASS en ambas apps.
- `npm run lint`: PASS; 1 warning no bloqueante en `apps/game/src/app/layout.tsx`.
- `npm run build -ws`: PASS.
- `npm run test -ws`: PASS, 0 tests en bridge y suites de ambas apps verdes.
- `npm run typecheck -ws`: PASS.
- Rutas `/`, `/coleccion`, `/admin`: PASS, 200/200/200 contra PostgreSQL temporal.

## Antipatrones

No aparecen placeholders o stubs nuevos introducidos por `dc7ff1f`; el commit es movimiento estructural y pasa `git diff --check`. Hay un `TODO` intencional preexistente en `apps/game/src/server/domain/habilidades.ts`, fuera del alcance de esta fase.

## Veredicto

**PASSED. Fase 4 cerrada.** Separación estructural, gates workspace, tests, typecheck, builds y runtime verificados. PostgreSQL temporal usado solo para prueba y eliminado después.

_Verificado: 2026-08-01_
_Verificador: gsd-verifier_
