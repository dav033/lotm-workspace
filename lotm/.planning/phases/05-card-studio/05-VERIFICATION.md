---
phase: 05-card-studio
verified: 2026-08-01T22:45:00-05:00
status: gaps_found
score: 7/8 must-haves verified
---

# Fase 5: modernización profunda de Card Studio

**Fuente de requisitos:** REFACTOR_PLAN.md, P5.1–P5.8 y gate M3.

## Veredicto

**GAP RESIDUAL. La arquitectura y los gates automatizados de fase 5 están corregidos; M3 queda pendiente únicamente de una sesión manual completa del editor.**

## Verdades observables

| # | Verdad | Estado | Evidencia |
|---|---|---|---|
| 1 | Dominio extraído y aislado | VERIFICADO | src/domain/ separado; cards-ui y editor no importan entre sí; todos los imports zod/v4 fueron normalizados a zod. |
| 2 | cards-ui typed y con mapper único, sin depender de editor | VERIFICADO | cardProps.ts es el mapper único; el drag/drop vive en cards-ui/useBackgroundDrop.ts; no quedan imports cards-ui → editor. |
| 3 | CSS modular con manifest compartido | VERIFICADO | styles/base.css quedó reducido a base común; hay hojas por familia; STYLE_FILES mantiene el orden y el renderer lo consume; Next carga styles/index.css con el mismo orden. |
| 4 | Server/render/MCP separados y contrato estable | VERIFICADO | server/render/{assets,html,renderer}, server/, mcp/createServer.ts; smoke stdio real pasa; el ZIP mantiene manifest.version === 3; docs/mcp-surface-2026-08.json no cambia. |
| 5 | Editor descompuesto dentro de límites | VERIFICADO | EditorApp.tsx quedó en 8 líneas; Panel.tsx en 57; cada familia de Panel/ queda por debajo de 250 líneas; la lógica vive en useEditorController.ts y EditorWorkspace.tsx. |
| 6 | Exportación unificada y dependencias cliente retiradas | VERIFICADO CON DESVIACIÓN | El cliente usa /api/cards/export y ya no usa html2canvas; jszip queda solo en el exportador servidor porque también lo requiere el contrato ZIP/MCP. La desviación está registrada en REFACTOR_PLAN.md. |
| 7 | TypeScript/assets limpios | VERIFICADO | allowJs: false; no quedan .js/.jsx en src; los fondos y nombres corregidos pasan las pruebas existentes. |
| 8 | Gate M3 completo | PARCIAL | Card Studio: lint PASS, typecheck PASS, 69/69 tests PASS, build PASS, 15/15 goldens PASS. Workspace: lint/typecheck/tests PASS; MCP smoke PASS. Falta evidencia de la sesión manual crear/editar/mover/borrar/reordenar, imagen, video y descarga por sección. |

## Gaps residuales

1. Ejecutar y registrar la sesión manual completa del editor para cerrar M3.
   La app local respondió 200 en /cartas; la automatización no continuó porque Playwright no tiene Chromium instalado en el entorno y no se descargó ningún binario.
2. jszip permanece como dependencia de servidor de forma intencional; no bloquea el flujo cliente y queda documentado como desviación.

## Comandos de verificación

- npm run lint -w @lotm/card-studio — PASS.
- npm run typecheck -w @lotm/card-studio — PASS.
- npm run test -w @lotm/card-studio — 69/69 PASS.
- npm run visual:check -w @lotm/card-studio — 15/15 PASS.
- npm run build -w @lotm/card-studio — PASS.
- npm run typecheck, npm run lint, npm test — PASS en workspace.
- npm exec --workspace @lotm/card-studio -- tsx test/visual/mcp-baseline.ts — PASS.

_Verificado: 2026-08-01_
_Verificador: Codex_