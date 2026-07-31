---
tags: [project, log]
scope: out-of-ontology
updated: 2026-07-30
---

# Log de decisiones — Archivo de Misterios

Registro cronológico. Ver [[README]] para el porqué de esta carpeta. No sigue el formato de `log.md` raíz (ese es solo para cambios de lore).

## 2026-07-30 — Origen del proyecto y primeras rondas del consejo

- Idea inicial: cuenta de TikTok con videos explicativos de LOTM para ganar seguidores, más un juego de combinación de elementos tipo Little Alchemy ambientado en el mismo universo.
- Se corrió un proceso de "consejo" (5 asesores con ángulos distintos + revisión cruzada anónima + síntesis) varias veces a lo largo del día conforme surgía información nueva. Ver [[IP y Riesgo Legal]] y [[Estrategia de TikTok y Validación]] para el detalle por tema.
- Decisión de fondo, sostenida en todas las rondas: no monetizar todavía, y usar el TikTok como instrumento para validar si vale la pena construir el juego — no como proyecto aparte.

## 2026-07-30 — Investigación legal real

- Se investigó en internet la estructura real de derechos de LOTM y el estado del MMORPG oficial. Resultado completo en [[IP y Riesgo Legal]].
- Hallazgo clave: el MMORPG oficial licenciado (SPARK NEXA / Tencent) lanza el **21 de agosto de 2026** — fecha ancla para revisar todo el riesgo.
- No se encontró ningún pleito o cese-y-desista documentado contra fan-works de LOTM. Existe al menos un fan-game de nicho (itch.io, "Lord of Mystery" de David Fang) operando sin acción legal aparente — evidencia débil pero real.

## 2026-07-30 — Auditoría del código del juego

- El juego ("Archivo de Misterios") ya estaba construido y en vivo en `https://lotm.marosconstruction.com/` antes de esta sesión: Next.js + Prisma/Postgres, ~279 archivos en `src`, 45 con pruebas, 24 migraciones, panel admin completo.
- Hallazgo importante: la arquitectura ya estaba desacoplada (nombres de LOTM solo como datos, nunca hardcodeados en lógica/schema) y el producto ya tenía nombre propio ("Archivo de Misterios") sin mencionar LOTM en la interfaz — resolviendo, sin que se pidiera explícitamente así, la mitigación híbrida que el consejo llevaba rondas sugiriendo.
- El sistema de feedback visual del drag-and-drop (shake al fallar, partículas y brillo al acertar, modales de tutorial/logro/fase) ya estaba implementado y era más maduro de lo que una captura de pantalla estática podía mostrar. No se necesitó "arreglar" lo que ya funcionaba.
- Detalle completo en [[Arquitectura del Juego]].

## 2026-07-30 — Dirección visual de los íconos

- Decisión: ilustración única por concepto (no íconos genéricos de Lucide, no solo un marco decorativo) — la opción de mayor esfuerzo, elegida a propósito pese a la recomendación inicial de posponerla.
- Método de producción: generación por IA reutilizando el pipeline de cartas ya existente del proyecto (`src/cards` + `src/builder` + MCP `lotm-card-studio`), no un sistema nuevo separado.
- Implementado en esta sesión: soporte de `imageUrl` en el componente de ícono del juego (con fallback al ícono genérico si no hay ilustración), botón de subida de archivo en el panel admin, script de importación masiva por lote, y especificación de estilo para generar las ilustraciones de forma consistente. Detalle en [[Arquitectura del Juego]].
- Generación real de las ~343 ilustraciones queda pendiente — requiere una herramienta de generación de imágenes que esta sesión de Claude no tiene disponible.

## 2026-07-30 — Almacenamiento de archivos

- Pregunta: ¿usar AWS/S3 para las imágenes? Respuesta: no. El despliegue ya usa Docker con un volumen persistente (`lotm_data`) compartido entre el contenedor principal y `cards-mcp`. El mecanismo existente (`storeCardImage`, guarda en disco y solo la ruta en la base) ya es durable en este despliegue. AWS solo se justificaría si el proyecto migra a hosting serverless o escala a múltiples réplicas — ninguno de los dos es el caso ahora.

## 2026-07-30 — Primeras respuestas reales: abogado y testers

- **Se ejecutaron por fin las dos acciones pendientes desde hacía siete sesiones.**
- **Abogado de IP real consultado:** dijo que el proyecto es legalmente delicado porque (a) se planea usar nombres canónicos exactos de la novela y (b) es una IP activa (donghua oficial + MMORPG licenciado de Tencent en camino).
- **10 personas ajenas a LOTM probaron el juego:** inicio calificado como "decente", pero se perdieron específicamente al llegar a los conceptos de "Secuencia" y "Misticismo". Sigue sin haber criterio numérico de éxito definido — pendiente de nuevo.
- **Hallazgo clave de la ronda 8 del consejo:** el problema legal (nombres canónicos) y el problema de usabilidad (testers atascados) señalan exactamente los mismos dos términos. La lectura de "es la misma fricción vista dos veces" se consideró más defendible que tratarlos como problemas independientes, aunque no es prueba definitiva — es "casi tautológico" que lo más canónico sea también lo menos familiar para un extraño.
- **Costo nuevo detectado:** "Secuencia" y "Misticismo" son también las palabras que los fans de LOTM buscan en TikTok/Google para encontrar este tipo de contenido — genericarlas podría resolver el riesgo legal y la confusión, pero corta el gancho de descubrimiento orgánico. Nadie lo había calculado antes de esta ronda.
- **Otro matiz:** renombrar términos no blinda legalmente si la estructura general del sistema (progresión por niveles, jerarquía de rutas) sigue siendo reconocible como copia — el riesgo puede vivir en el "total look and feel", no solo en los nombres propios.
- **Siguiente paso acordado:** bifurcar el juego reemplazando solo "Secuencia" y "Misticismo" por equivalentes genéricos, volver a probar con un grupo nuevo de extraños (con número de éxito definido esta vez), y enviarle al abogado por escrito los reemplazos concretos preguntando si el problema es solo vocabulario o la estructura misma. También preguntarle por precedentes reales y por la opción de pedir una licencia directa en vez de solo evadir riesgo.

## 2026-07-30 — Esta carpeta de Obsidian

- Se creó `10-Project/` como arquitectura paralela dentro de este mismo vault para que las decisiones de negocio/ingeniería del juego y el canal persistan junto al trabajo de lore, sin violar las reglas estrictas de `AGENTS.md` (que solo gobiernan conocimiento canónico de la novela). Ver [[README]].
