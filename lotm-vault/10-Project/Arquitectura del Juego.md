---
tags: [project, engineering, game]
scope: out-of-ontology
updated: 2026-08-04
---

# Arquitectura del Juego — Archivo de Misterios

Ver [[README]]: nota de ingeniería/producto, no lore de la novela.

## Qué es

Juego web de combinar **conceptos abstractos** (no ingredientes/objetos físicos) estilo Little Alchemy clásico, ambientado en el universo de LOTM, fanmade y declarado como no oficial. Nombre de producto propio: **"Archivo de Misterios"** — no se llama "juego de LOTM" en ningún lugar de la interfaz.

En vivo en: `https://lotm.marosconstruction.com/`
Repositorio local: `C:\Users\davidt\lotm-game`

## Stack técnico

- Next.js 15 + React 19
- Prisma 7 + PostgreSQL (Supabase en producción)
- Zustand (estado de cliente), Zod (validación de dominio), Framer Motion (animación)
- Despliegue: Docker + `docker-compose.production.yml`, con volumen persistente `lotm_data` compartido entre el contenedor principal y `cards-mcp`

Arquitectura en capas: `src/server/domain` (reglas puras: combinar, rituales, fases, logros — todas con pruebas), `src/server/services` / `src/server/actions` (orquestación), `src/app/api` (rutas REST), `src/components/game` (UI de juego), `src/components/admin` (panel CRUD).

Al momento de la auditoría (2026-07-30): 279 archivos en `src`, 45 con pruebas unitarias, 24 migraciones de Prisma. Panel admin completo: elementos, recetas, rituales, caminos, secuencias, logros, fases de progresión, simulador de progresión, editor de árbol de conexiones.

## Decisión de arquitectura: nombres desacoplados de la lógica

El schema de Prisma es genérico: `Element`, `Pathway`, `Sequence`, `Recipe`, `Ritual`, `Advance`, `Achievement` — ningún nombre de LOTM hardcodeado en el modelo de datos ni en la lógica de dominio. Los nombres reales de LOTM (personajes, Secuencias, Rutas de Beyonder) existen únicamente como **datos** cargados vía el panel admin.

**Por qué importa:** no es un escudo legal (ver [[IP y Riesgo Legal]]) pero sí una ventaja operativa real — permite reemplazar todos los nombres por genéricos en horas, no semanas, si algún día hace falta reaccionar a un aviso de retiro.

## Sistema de contenido para TikTok (separado del juego)

`apps/card-studio` + MCP `lotm-card-studio`: genera imágenes PNG 960×1280 (formato TikTok) organizadas por universo/parte. El contrato MCP queda congelado en siete herramientas: `save_card_batch`, `list_card_library`, `update_card`, `save_card_image`, `move_cards`, `delete_cards` y `export_cards_zip`. Este sistema **sí** usa nombres/branding explícito de LOTM — es marketing de contenido, no el juego en sí, y es una decisión consciente separada.

La carta `Map` acepta `textStyles` opcionales por rol (`title`, `label`, `value`, `footer`). Cada rol puede definir `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `color` y `textTransform`; tanto `save_card_batch` como `update_card` pueden escribirlos. El editor ofrece el mismo control reutilizable y lo aplica al preview y al PNG exportado.

La vista del Card Studio conserva en el navegador local el proyecto activo, los proyectos abiertos y la carta seleccionada para que una recarga no pierda el contexto de trabajo. El contenido de las cartas sigue persistiendo en la base SQLite y las imágenes mediante el almacenamiento de archivos documentado abajo.

Almacenamiento de imágenes: `storeCardImage()` en `src/cards/images.ts` — guarda bytes en disco (`CARDS_IMAGE_DIR`, por defecto `data/card-images`), solo la ruta viaja a la base de datos (nunca binarios/base64 en la DB). Servido vía `/api/cards/images/[file]`. Este mismo mecanismo es durable en producción gracias al volumen Docker `lotm_data` — no se necesita AWS/S3 (ver decisión abajo).

## Feedback visual del juego (ya implementado, más maduro de lo esperado)

Auditado en detalle el 2026-07-30 tras una captura de pantalla que sugería "diseño inacabado" — la captura estática y un fetch de HTML crudo no pueden mostrar animaciones ni estados de Zustand. En el código real ya existía:

- **Fallo al combinar:** el círculo hace `anim-shake` y se ilumina en rojo vino, con mensaje temático ("La combinación no responde.").
- **Éxito:** glow dorado, explosión de partículas (`<Particulas>`), mensajes escalonados de carga ("Trazando la fórmula…" → "Consultando el archivo…"), insignia "¡Nuevo descubrimiento!" / "¡Nuevo avance!".
- Sistema completo de modales: `ModalTutorialAvance` (tutorial al primer avance), `ModalLogro`, `ModalAvanceFase`, `ModalRiesgoRitual`.

**Conclusión de esa auditoría:** no hizo falta "arreglar" el feedback del drag-and-drop — ya funcionaba. Se recomendó probarlo en vivo para confirmar, en vez de invertir tiempo de desarrollo en algo ya resuelto.

## Ilustraciones de elementos (en progreso, 2026-07-30)

**Decisión:** reemplazar los íconos genéricos de Lucide (línea simple, "sin recursos de franquicia" por diseño) por una ilustración única por concepto, generada por IA reutilizando el pipeline de cartas existente — no un sistema nuevo separado.

**Implementado en esta sesión:**
- `IconoElemento.tsx` acepta `imageUrl` opcional: si existe, muestra la ilustración; si no, cae al ícono Lucide de siempre (sin romper nada).
- Conectado en los 4 lugares donde el jugador ve elementos: `PanelDescubiertos` (Archivo Personal), `BandejaPreparacion` (lienzo), `MesaCombinacion` (receptáculos y tarjetas de resultado).
- El campo `Element.imageUrl` ya existía en el schema de Prisma y en el payload público (`publicos.ts`) desde antes — solo faltaba consumirlo en la UI del juego.
- Botón de subida de archivo agregado al panel admin (`FormularioElemento.tsx`), reutilizando el endpoint existente `/api/cards/images` (el mismo que usa el editor de cartas).
- Script de importación masiva: `scripts/importarIlustracionesElementos.ts` — toma una carpeta con imágenes nombradas por slug y actualiza todos los elementos coincidentes de un jalón. Se puede correr varias veces según vayan estando listas las imágenes.
- Especificación de estilo para generación consistente: `.planning/especificacion-ilustraciones-elementos.md` en el repo del juego (prompt base, formato de archivo, flujo de incorporación).

**Pendiente:** generar las ~343 ilustraciones reales — requiere una herramienta de generación de imágenes que no estaba disponible en la sesión donde se hizo este trabajo. El sistema está listo para recibirlas en cuanto existan.

## Decisión: almacenamiento de archivos (no AWS)

El despliegue ya usa Docker con volumen persistente (`lotm_data`), compartido entre `lotm` y `cards-mcp`. El mecanismo de disco local + ruta en base de datos ya es durable ahí — no es el almacenamiento efímero típico de un serverless. Migrar a S3/R2/Supabase Storage solo se justificaría si el proyecto pasa a hosting serverless o escala a múltiples réplicas del contenedor — ninguno de los dos es el caso actual.

## Reglas de diseño: sistema de combinación y Beyonders

Especificación de diseño, no sugerencia. Fijada 2026-07-31, revisada por el consejo en [[Deliberacion del Consejo - Ronda 12|Ronda 12]]. Los dos huecos que la Ronda 12 marcó como más urgentes (dirección de "Secuencia 5 para arriba" y alcance de Secuencia 0) quedaron confirmados por el usuario el mismo día — ver huecos abiertos al final de esta sección para lo que sigue sin resolver.

### Secuencia 9 — único punto de entrada por combinación directa

Concepto + Concepto → Beyonder es válido **únicamente** cuando el resultado es un Beyonder de Secuencia 9. Ninguna otra combinación de dos elementos produce un Beyonder directamente. Sin excepciones.

### Secuencia 8 a 6 — Beyonder anterior + Avance

Fórmula: **Beyonder de Secuencia N+1 del camino** + **Avance** = **Beyonder de Secuencia N**, para N = 8, 7, 6.

El "Avance" es el vehículo declarado para ese salto — representa/sustituye la combinación Concepto+Concepto que en teoría daría ese Beyonder, pero es una entidad de juego distinta de un elemento normal (ya modelada en Prisma como `Advance`, separada de `Element`).

### Secuencia 5 y más poderosas — se suma un Ritual de avance

A partir de Secuencia 5 (inclusive) y hacia las secuencias más poderosas (números menores: 5, 4, 3, 2, 1, **0**), la fórmula anterior no basta. Confirmado con el usuario 2026-07-31: el rango completo es 5 a 0, no se detiene en 1 — Secuencia 0 sigue la misma fórmula, no tiene reglas propias distintas.

Fórmula: **Beyonder de Secuencia N+1** + **Avance** + **Ritual de avance** = **Beyonder de Secuencia N**, para N ≤ 5 (incluye N = 0).

**"Ritual de avance" no es lo mismo que "Avance."** Son dos entidades distintas (ya modeladas por separado en Prisma: `Ritual` con `advanceId` apuntando a su `Advance`) y ambas deben poseerse/completarse para que la combinación resuelva en este rango.

### Avances ocultos

Cuando el jugador descubre un Avance pero **no** ha completado el Ritual de avance correspondiente, ese Avance se muestra **oculto** (sin revelar su nombre/identidad real) — ya reflejado en la UI actual ("avances enmascarados no pueden analizarse", `PanelDescubiertos`).

Un Avance oculto **sigue siendo utilizable con normalidad** en combinaciones — "oculto" afecta solo la presentación, no la funcionalidad.

Desvelar un Avance oculto por otra vía más adelante es intención declarada, no alcance actual. No implementar todavía.

### Principio de contenido: evitar elementos intermedios de un solo uso

Regla de autoría, fijada 2026-07-31. Al diseñar recetas, **no acostumbrar a crear elementos/conceptos "muy intermedios"** — es decir, elementos que existen únicamente como escalón de una sola combinación específica y no sirven de ingrediente para nada más.

Cada elemento/concepto nuevo que se autora debería, en la medida de lo posible, **poder reutilizarse como ingrediente en la combinación de otros elementos distintos** — no ser un callejón de un solo uso dentro del árbol de recetas. Un elemento con alto "fan-out" (usado en varias recetas) enriquece el espacio de combinaciones que el jugador puede explorar; un elemento de un solo uso solo alarga la cadena sin agregar profundidad real de descubrimiento.

No es una regla absoluta de "cero elementos de un solo uso" (algunos resultados finales, como un Beyonder, son legítimamente terminales) — es un principio a aplicar por defecto al autorar el catálogo, especialmente para Conceptos intermedios que no son en sí mismos un resultado final de camino.

### Huecos abiertos

Todos resueltos por el usuario 2026-07-31 (los dos primeros antes de la Ronda 12, los tres siguientes en vivo mientras se corría el consejo — ver [[Deliberacion del Consejo - Ronda 12|Ronda 12]] para el debate completo):

- ~~Ambigüedad de "5 para arriba"~~ — confirmado: N ≤ 5, secuencias más poderosas (5,4,3,2,1,0), no número de secuencia ascendente.
- ~~Secuencia 0~~ — confirmado: dentro del alcance, misma fórmula que el resto del rango 5-0, sin reglas propias distintas.
- ~~Caminos que no llegan a Secuencia 0~~ — confirmado: **todos los caminos, sin excepción, llegan a Secuencia 0.** No existe el caso de camino corto dentro de este juego (aunque en el canon de la novela sí hay caminos que no llegan tan lejos, esta regla de diseño es una decisión propia del juego, no una copia literal del canon).
- ~~Señalización de Avances ocultos~~ — confirmado: **no hace falta mecanismo especial.** Un Avance oculto se muestra simplemente como un elemento más descubierto en el inventario del jugador, con el nombre/identidad enmascarados — igual que cualquier otro elemento, sin tratamiento distinto.
- ~~Persistencia del Beyonder N+1~~ — confirmado: **el Beyonder de Secuencia N+1 no se consume.** Se conserva después de fabricar el de Secuencia N; no se resta ni se gasta.

Auditado por el consejo vía el skill `llm-council` — ver [[Deliberacion del Consejo - Ronda 13|Ronda 13]] para la transcripción completa. Veredicto: la regla es implementable tal como está, sin defecto estructural, pero quedan preguntas nuevas antes de autorar contenido:

- ~~Consumo de Avance/Ritual~~ — confirmado por el usuario 2026-07-31: **nada se consume**, ni el Beyonder anterior, ni el Avance, ni el Ritual de avance. Los tres persisten después de combinarse. **Esto contradice el código actual:** `combinar.ts` decrementa `owned.quantity` del Avance al resolver la combinación — hay que corregir ese código antes de construir contenido nuevo sobre él, no es solo un hueco de documentación.
- **Sin confirmar — alcance por camino:** nada en la regla dice explícitamente que un Avance/Ritual de Secuencia N está atado a un camino específico. Sin esa restricción declarada, no hay nada que impida combinar un Avance de Secuencia 8 de un camino con un Beyonder de Secuencia 8 de otro camino — hallazgo del consejo (lente Executor/Outsider), no reportado antes.
- **Sin resolver — modelo de "rango actual":** si el Beyonder de secuencia anterior persiste (confirmado), un jugador que completa un camino hasta Secuencia 0 termina poseyendo simultáneamente los Beyonder de las 10 secuencias de ese camino. Falta decidir si eso es la intención (vitrina de trofeos acumulados) o si además hace falta un concepto de "rango actual/más alto alcanzado" para mostrar en pantalla — el consejo lo marca como decisión de modelo de datos, no de UI.
- **Sin resolver — camino de fallo:** ninguna versión de la regla describe qué ve el jugador cuando combina elementos que no producen nada. Relevante porque el testing previo con 10 personas ajenas a LOTM ya mostró dificultad con el vocabulario del juego.
- **Recomendación separada del consejo, no un hueco de la regla en sí:** el problema de vocabulario ("Secuencia," "Misticismo," y ahora "Avance"/"Ritual de avance") se trata mejor como capa de presentación independiente (traducción/glosario de cara al jugador) que como razón para rediseñar la mecánica — la mecánica en sí se considera sólida.

## Contenido: combinaciones de Secuencia 9 por camino

Movido a [[Combinaciones del Juego]] — registro dedicado, con tabla maestra de estado (sembrado/pendiente/sin empezar), lista de conceptos ya usados para reutilizar, y el detalle grupo por grupo. La regla de diseño (Secuencia 9 único punto de entrada, Avances, Rituales de avance, Avances ocultos) sigue arriba en esta misma nota.

## Pendientes de ingeniería conocidos

- Generar y curar las ilustraciones de elementos (ver arriba).
- Definir si se implementa el plan de contingencia de rebranding (nombres genéricos de reemplazo listos) mencionado en [[IP y Riesgo Legal]].
- Correr la prueba de valor de usuario (ver [[Estrategia de TikTok y Validación]]) antes de invertir más en pulido visual adicional.
