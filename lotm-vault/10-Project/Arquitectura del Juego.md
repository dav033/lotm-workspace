---
tags: [project, engineering, game]
scope: out-of-ontology
updated: 2026-07-30
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

`src/cards` + `src/builder` + MCP `lotm-card-studio` (`mcp/cards-stdio.ts`, `mcp/cards-http.ts`): genera imágenes PNG 960×1280 (formato TikTok) organizadas por universo/parte, con 6 herramientas MCP (`save_card_batch`, `list_card_library`, `move_cards`, `update_card`, `save_card_image`, `delete_cards`, `export_cards_zip`). Este sistema **sí** usa nombres/branding explícito de LOTM — es marketing de contenido, no el juego en sí, y es una decisión consciente separada.

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

## Pendientes de ingeniería conocidos

- Generar y curar las ilustraciones de elementos (ver arriba).
- Definir si se implementa el plan de contingencia de rebranding (nombres genéricos de reemplazo listos) mencionado en [[IP y Riesgo Legal]].
- Correr la prueba de valor de usuario (ver [[Estrategia de TikTok y Validación]]) antes de invertir más en pulido visual adicional.
