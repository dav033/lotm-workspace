# Estado de Fase 6

Estado: en curso, avance autónomo iniciado.

## Hecho

- Tipos, constantes y funciones puras de dominio movidos a `src/shared`.
- Shims históricos eliminados; componentes ya no importan `@/server/domain` ni `@/server/services`.
- Frontera `server-only` aplicada a todos los módulos reales de `src/server`, excepto `actions/*`.
- Payload público resuelto a inglés; i18n del juego retirado del layout, navegación y store.
- Store separado en slices de bandeja, recetas, avisos, facultades, rituales, combinación y fases.
- Árbol admin iniciado con panel de grafo extraído y filtro puro de aristas con prueba.

## Pendiente

- Partir por completo `services/datos.ts` en exportación, validación e importación.
- Partir por completo `domain/diagnostico.ts` en calculadores y orquestación.
- Continuar la descomposición del árbol admin y del store sin alterar contratos públicos.
- Retirar dead weight restante después de completar las extracciones.

## Gates

- `npm test -w @lotm/game`: PASS — 198/198.
- `npm run typecheck -w @lotm/game`: PASS.
- `npm run lint -w @lotm/game`: PASS; queda solo el warning existente de fuentes en `app/layout.tsx`.
- `git diff --check`: PASS.
- `next build`: la compilación generó `.next`, pero el worker final quedó sin terminar durante 3 minutos; proceso detenido. Sin error de código emitido.

No se pidió aprobación intermedia; la fase queda abierta para la siguiente ola.
