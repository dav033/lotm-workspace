---
tags: [project, card-studio, rituals]
updated: 2026-08-02
---

# Sesión 2026-08-02 — Fondos automáticos y cartas de ritual

## Decisión visual principal

Las cartas no deben guardar manualmente la imagen que les sirve de fondo. El
fondo por defecto se resuelve a partir de la metadata que la carta ya declara.
Una imagen propia solo existe como override excepcional.

La regla queda separada por tipo de carta:

- `Ritual Logic`, `Tier` y `Pathway`: usan por defecto el fondo de su pathway.
- `General Explanation`: si declara una Secuencia temática, usa el fondo de
  esa Secuencia; si no, puede heredar el fondo de su pathway.

El ejemplo que motivó la corrección fue **Mysticism Magister**: aunque alcanza
la Secuencia 5, pertenece al pathway **White Tower**, así que su fondo por
defecto debe ser el de White Tower, igual que una carta de Tier. No debe usar
un fondo de Secuencia ni una URL escrita a mano.

## Qué había fallado

La lógica de fallback para `Ritual Logic` ya existía en el mapper de Card
Studio, pero las rutas públicas de los fondos e iconos apuntaban a la raíz del
dominio. En producción esa raíz la atendía el juego y devolvía `404`, por eso
la carta aparecía con el fondo casi negro aunque el contenido sí conociera el
pathway.

## Implementación acordada

- Card Studio mantiene un mapa central de fondos de Secuencia para las cartas
  que realmente necesitan un tema de Secuencia.
- Los fondos e iconos de pathway se sirven bajo `/cartas`, con rewrites hacia
  los archivos de `public/`.
- El renderizador de PNG elimina el prefijo `/cartas` al resolver el archivo
  local, por lo que la vista viva y la exportación usan la misma fuente.
- El panel puede aceptar una imagen propia, pero la interfaz la presenta como
  reemplazo manual, no como parte normal del contenido.
- La tarjeta live **Why Rituals Matter** declara `sequence: 5` y no guarda
  `backgroundImageUrl`.

## Contrato editorial que se conserva

El texto visible de las cartas se escribe en inglés y debe ser breve. Cada
`Ritual Logic` mantiene tres ideas: `Ritual function`, `Potion pressure` y
`Sequence rehearsal`. Las cinco variantes cambian la composición de la misma
información; no crean copias de una carta.

La presión de la poción debe describirse como reacción adversa, peligro o
presión. La palabra `backlash` no se usa en el texto visible. Cuando el peligro
está registrado, se usa la composición `Pressure`; cuando no hay una reacción
explícita, la carta debe decirlo sin inventar una.

## Estado al cierre

- Colección: `LOTM — Why Sequence 5 Rituals Work`.
- Organización: una sola sección `Main`, con portada, explicación y ocho
  cartas de ritual.
- El vault, el código y las reglas de despliegue se mantienen en el mismo
  repositorio: `dav033/lotm-workspace`, rama `main`.
- Commits de esta corrección: `b0db535`, `8b27c3b` y `217b1b5`.
- Verificación local: 88 tests pasan; typecheck, lint y build pasan.
- Verificación de producción: `/cartas` y el asset de White Tower responden
  `200`; el deploy se ejecuta automáticamente al hacer push a `main`.

## Pendientes naturales

Cada nuevo pathway o Secuencia que necesite una imagen temática debe añadirse
al mapa central y a `public/`, no a una tarjeta individual. Si se cambia la
regla de fallback, actualizar esta nota, la guía de cartas y el `Log` en el
mismo cambio.
