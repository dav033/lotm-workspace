# AGENTS.md — convenciones del proyecto LOTM

Código vive en `lotm/`: `lotm/apps/game`, `lotm/apps/card-studio` y
`lotm/tools/obsidian-bridge`. Ejecuta scripts desde `lotm/`, salvo que una
instrucción indique otra ruta. Producción usa `lotm/Dockerfile.game`,
`lotm/Dockerfile.card-studio` y `lotm/docker-compose.production.yml`.

## Modo caveman (activo siempre)

Usa el skill `caveman` en intensidad **full** para TODA respuesta en este
proyecto. No lo anuncies ni lo nombres. Excepciones automáticas: warnings
de seguridad, confirmaciones de acciones irreversibles, o cuando la
compresión cree ambigüedad técnica. En esos casos, escribe normal y
retoma caveman después.

## Orden de trabajo (regla dura)

Cuando una tarea implique cambiar el diseño y luego generar contenido, se
ejecuta **en serie, nunca en paralelo**:

1. `lotm-design` aplica y confirma el cambio de diseño/plantilla primero.
2. Solo después, `lotm-content` genera el contenido usando ese diseño ya
   aplicado como base.

Nunca dispares `lotm-design` y `lotm-content` a la vez para la misma tarea.

## Convenciones editoriales

- **"Domain"** es un término editorial propio de este proyecto, **no
  canónico** de la obra original: agrupa poderes que operan a través del
  mismo campo funcional. No lo trates como terminología oficial al citar
  o verificar contra la obra fuente.
- El texto final que va en las slides se escribe en **inglés**.
- La planeación, notas internas e instrucciones de trabajo se escriben en
  **español**.

## Convenciones visuales

- Fondo casi negro.
- Título en fuente serif display, con subrayado dorado.
- Cuerpo de texto en sans-serif clara.
- Exportación final en PNG a **960×1280**.

## Contexto fijo (prompt caching)

La guía de estilo y el glosario del proyecto deben inyectarse siempre al
inicio del contexto, **en el mismo orden exacto** en cada sesión nueva, para
que el prompt caching los reconozca como prefijo estable y no se cobren a
precio completo en cada llamada. No reordenes ni antepongas otro contenido
delante de ellos.

## Lectura del vault (lotm-vault)

Nunca leas `lotm-vault/` completo. Empieza siempre por `lotm-vault/NAVIGATION.md`
— enruta entre trabajo de lore (`AGENTS.md` del vault, estricto) y trabajo de
proyecto (`10-Project/README.md`, reglas ligeras), y explica cuándo usar la
herramienta de búsqueda del MCP de Obsidian (`search_notes`) frente a pedir un
archivo conocido por ruta exacta. Esta instrucción vivía antes solo aquí; ahora
también está duplicada dentro del propio vault para que cualquier sesión que
abra `lotm-vault/` directamente (sin pasar por este repo) la vea igual.
