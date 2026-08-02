---
phase: 06-game-cleanup
type: execute
autonomous: true
source: REFACTOR_PLAN.md#phase-6-game-internal-cleanup
---

# Fase 6 — Limpieza interna del juego

Objetivo: dejar frontera client/server explícita, publicar solo inglés al cliente,
reducir módulos monolíticos y conservar API pública, estado de Zustand y flujo
del árbol administrativo.

## Ola 1 — Frontera de módulos

- Mover tipos, constantes y funciones puras de `server/domain` a `shared`.
- Actualizar importadores y eliminar shims históricos.
- Añadir `server-only` a cada módulo real bajo `src/server`, excluyendo
  `actions/*`.
- Verificar con `typecheck`, tests y grep de frontera.

## Ola 2 — Inglés canónico y cliente

- Resolver nombres/descripciones/etiquetas en inglés en `server/domain/publicos`.
- Retirar campos bilingües de payloads públicos.
- Eliminar `src/i18n`, provider, cookie y toggle de idioma.
- Actualizar store y páginas para consumir payloads ya resueltos.

## Ola 3 — Descomposición

- Separar acciones/helpers de `components/game/store.ts` en slices sin cambiar
  selectores ni firmas de `useJuegoStore`.
- Extraer piezas del árbol admin a `components/admin/arbol/mapa/` y layout puro
  de `ArbolConexiones`/`ExploradorArbol` a módulos testeables.
- Separar `services/datos.ts` por exportación, validación e importación.
- Separar calculadores puros de orquestación en `domain/diagnostico.ts`.

## Ola 4 — Verificación

- Ejecutar lint, typecheck, suite completa y build del workspace.
- Verificar import matrix: componentes no importan `@/server/domain` ni
  `@/server/services`; `server-only` existe en todo `src/server` salvo actions.
- Registrar resumen y brechas reales. No pedir aprobación intermedia.
