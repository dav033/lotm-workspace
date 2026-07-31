---
tags: [project, council, log]
scope: out-of-ontology
updated: 2026-07-31
---

# Deliberación del Consejo — Ronda 14

Corrida con el skill `llm-council`. Tema distinto a las rondas anteriores: no la regla de Beyonders, sino la estructura del vault mismo — ver [[NAVIGATION]] (el resultado directo de esta ronda).

## Pregunta planteada

¿Cómo debe documentarse/estructurarse este vault de Obsidian para que cualquier sesión de LLM futura — con acceso directo al sistema de archivos, o solo remota vía el MCP de Obsidian (`search_notes`) — pueda encontrar lo que necesita sin escanear el vault completo? Contexto entregado: inventario completo del vault (00-Inbox a 06-Templates gobernados por `AGENTS.md` estricto de ~250 líneas; 471 notas de wiki; `05-Review/Pending Review.md` con 462 de 471 notas pendientes; `10-Project/` como área separada con reglas ligeras propias; un puente MCP real que expone `search_notes` y lectura/escritura por ruta exacta; y el hallazgo de que la única instrucción existente de "no escanees todo, usa search_notes" vivía en un repo hermano del juego, no dentro del vault).

## Respuestas de los asesores

**A — The Contrarian:** La compuerta ya está rota — no agregar una segunda que también se rompa. 462 de 471 notas "pendientes de revisión" es evidencia de que la prosa MUST/MUST NOT no sobrevive el uso real; cualquier estructura nueva decaerá igual sin algo mecánico que la revise. Cuestionó si `search_notes` siquiera soporta traer un archivo conocido por ruta, o es solo búsqueda semántica/difusa — sin probarlo, todo el plan para sesiones MCP-only es una suposición. Señaló la colisión `log.md` / `10-Project/Log.md` como riesgo real de escritura cruzada.

**B — The First Principles Thinker:** Reformuló el problema: no es falta de documentación, es documentación a la altitud equivocada para el patrón de acceso. 250 líneas de reglas y 11 índices no ayudan a una sesión que solo puede llamar `search_notes` una vez. El entregable real es una capa de enrutamiento — no una descripción, un árbol de decisión leído en cinco segundos que bifurca "lore" vs "proyecto" antes de tocar cualquier archivo. Advirtió que el consejo se distraería discutiendo detalles de esquema — resistir eso.

**C — The Expansionist:** Vio la oportunidad más grande que documentación: un punto de entrada bien construido escala con costo de onboarding marginal cero. Propuso ir más allá del hueco inmediato — un `manifest.json`/API consultable sobre los índices (ya que sus conteos deben coincidir exactamente con el filesystem, es metadata estructurada casi gratis), y un router genérico reutilizable a medida que `10-Project/` crezca.

**D — The Outsider:** Encontró, leyendo en frío, que hay dos archivos llamados `Log.md` con propósitos distintos (colisión real, coincide con A) y que nada dentro del vault declara que `AGENTS.md` deja de aplicar en `10-Project/` — esa excepción vive en un README que un agente no tiene razón de abrir antes de ya estar aplicando etiquetas epistémicas a una nota de negocio. La instrucción más importante de todas (no escanear, usar `search_notes`) vive en un repo hermano que el vault no conoce — debe duplicarse textualmente dentro del vault.

**E — The Executor:** Entregó el artefacto concreto: un solo archivo raíz (`NAVIGATION.md`) que toda sesión nueva lee primero. Contenido en orden: qué es el vault en dos líneas; tabla de enrutamiento lore-vs-proyecto; la instrucción de `search_notes` copiada dentro del vault; regla de "archivo conocido → leer directo, cualquier otra cosa → buscar primero". Explícitamente rechazó construir un segundo `AGENTS.md`, reestructurar carpetas, o agregar metadata YAML que nadie mantendría.

## Revisión cruzada (5, una por cada lente)

Convergencia fuerte y poco común: **los cinco revisores, sin excepción, señalaron a C como el mayor punto ciego** — proponer más maquinaria (manifest.json, router genérico) sobre una base que ya demostró no poder sostener ni una sola regla (462/471 sin revisar) fue leído unánimemente como sobre-construcción antes de arreglar lo roto. Tres de cinco revisores eligieron a **E** como la respuesta más fuerte (el único artefacto concreto, mínimo, con alcance explícitamente acotado); los otros dos eligieron a **A** (el único que cuestiona la premisa en vez de solo proponer una solución).

**Lo que las cinco revisiones señalaron, sin excepción, que faltó en las cinco respuestas iniciales:** nadie verificó si `search_notes` puede recuperar un archivo raíz conocido por nombre, o si es búsqueda semántica/difusa únicamente sobre contenido de notas de wiki (que son el 90%+ del corpus). Toda la propuesta de "un archivo NAVIGATION.md arregla esto para sesiones MCP-only" depende de una capacidad que nadie confirmó. Tampoco nadie propuso qué evita que el archivo nuevo se convierta en el próximo "462 de 471 sin revisar" — ninguna verificación mecánica, solo prosa nueva.

## Síntesis del presidente del consejo

**Donde coincide:** un solo archivo raíz que enruta entre lore y proyecto, con la instrucción de búsqueda duplicada dentro del vault, es la solución correcta — los cinco asesores llegaron a esencialmente la misma recomendación de forma independiente, sin haberse visto entre sí. El consenso de los revisores contra C fue el más limpio de cualquier ronda hasta ahora: 5 de 5, sin disidencia ni siquiera del propio lente Expansionist esta vez.

**Donde choca:** A y E no compiten realmente — son capas distintas. A audita la premisa (¿el mecanismo subyacente funciona como se asume?), E entrega el artefacto. El error sería construir E sin antes confirmar lo que A puso en duda.

**Hallazgo verificado tras la ronda (no parte de las respuestas originales):** se inspeccionó el código fuente del puente MCP real (`obsidian-bridge.ts`). El plugin subyacente (`obsidian-local-rest-api`) expone lectura/escritura por **ruta exacta** vía `/vault/{path}` — confirmado porque `vault_write_binary` ya lo usa para escribir binarios por ruta. Esto reduce significativamente, aunque no elimina del todo, la duda de A: una sesión MCP-only casi con certeza puede pedir `NAVIGATION.md` por ruta exacta en vez de depender de que la búsqueda semántica lo encuentre. Queda como advertencia sin confirmar en vivo, anotada en el propio `NAVIGATION.md`.

**La recomendación:** construir el archivo único que propuso E, con el contenido que detalló, más la instrucción explícita de A/D de pedirlo por ruta exacta cuando sea posible en vez de solo buscarlo. No construir nada de lo que propuso C todavía — ni manifest.json, ni router genérico, ni API consultable. Corregir también la colisión `log.md`/`10-Project/Log.md` señalada independientemente por A y D — barata, real, sin excusa para no arreglarla en la misma sesión.

**Lo primero que hay que hacer:** ejecutado en esta misma sesión — `NAVIGATION.md` creado en la raíz del vault, enlazado desde el encabezado de `AGENTS.md` y de `10-Project/README.md`, la instrucción del repo hermano del juego corregida para apuntar a él, y `log.md` renombrado a `Lore Log.md` para eliminar la colisión de nombres. Pendiente real, no resuelto todavía: confirmar en una sesión con el MCP de Obsidian conectado si `search_notes` puede además encontrar `NAVIGATION.md` por búsqueda semántica genérica (p. ej. buscando "reglas" o "por dónde empiezo"), no solo por ruta exacta.
