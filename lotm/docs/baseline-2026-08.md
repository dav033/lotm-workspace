# Baseline — 2026-08

Captured on 2026-08-01 before refactor code moves, on branch `refactor/m2-split`.

## P0.1 command baseline

Commands run from `lotm/`:

| Command | Result | Baseline |
|---|---|---|
| `npm run lint` | PASS | ESLint completed without findings. |
| `npx tsc --noEmit` | FAIL (pre-existing) | 3 errors: missing `nameEn`/English fields in the element and ritual admin forms; Prisma transaction client mismatch in `src/server/domain/combinar.ts:709`. |
| `npm run test` | FAIL (pre-existing) | 264 tests, 260 pass, 4 fail, 56 suites. Failing areas: `PanelHabilidades — marcador Savant`, `PanelRituales` (2 subtests), and `aplicación de avances con ritual`; one failure reports `Advancement rituals are not yet available.` |
| `npm run build` | FAIL (pre-existing) | Production bundle compiled; Next type validation stopped on missing `nameEn`, `descriptionEn`, `revealTitleEn`, and `revealTextEn` in `src/app/admin/(panel)/elementos/[id]/page.tsx:59`. |

No baseline failure was fixed in this phase.

## P0.2–P0.3 visual safety net

Added `test-visual/` with 15 deterministic fixtures covering every current card family, including both pathway-wide and sequence-specific tiers, background/no-background explanations, general/pathway-bound explanations, local artwork, and the Tarot Member contrast layout.

- `npm run visual:record` — PASS; 15 PNGs recorded under ignored `data/card-goldens/`.
- `npm run visual:check` — PASS; all 15 fixtures reproduced at `0.000%` pixel difference, below the `0.5%` threshold.

Goldens use only repository-local assets. No visual change was intended.

## P0.4 MCP surface

The stdio server was launched against a temporary SQLite database. Smoke calls succeeded for `save_card_batch`, `list_card_library`, and `export_cards_zip`; export returned one card and a ZIP artifact. The seven registered tool names and their input schemas are frozen in [`mcp-surface-2026-08.json`](./mcp-surface-2026-08.json).

Registered tools:

`save_card_batch`, `list_card_library`, `update_card`, `save_card_image`, `move_cards`, `delete_cards`, `export_cards_zip`.

## Harness dependencies

Added `pixelmatch`, `pngjs`, and `@types/pngjs` as development dependencies. Existing application dependencies and versions were not upgraded.
