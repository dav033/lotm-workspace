---
tags: [project, log]
scope: out-of-ontology
updated: 2026-07-31
---

# Log de decisiones — Archivo de Misterios

Registro cronológico. Ver [[README]] para el porqué de esta carpeta. No es lo mismo que [[Lore Log]] (raíz del vault) — ese es solo para cambios de lore, este es solo para decisiones de proyecto/negocio. Nombres deliberadamente distintos para no confundirlos.

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

## 2026-07-31 — Regla de diseño: sistema de combinación y Beyonders

- El usuario dictó la regla central e inflexible del sistema de creación de Beyonders del juego: Concepto+Concepto solo da Beyonder en Secuencia 9 (sin excepciones); Secuencia 8 a 6 requiere Beyonder anterior + un "Avance"; de Secuencia 5 en adelante (más poderoso) se suma un "Ritual de avance", entidad distinta de "Avance"; un Avance sin su Ritual de avance correspondiente se muestra oculto pero sigue siendo utilizable con normalidad. Persistida en [[Arquitectura del Juego]].
- Se corrió el consejo (Ronda 12) para auditar la regla antes de darla por cerrada. Ver [[Deliberacion del Consejo - Ronda 12]] para la transcripción completa.
- Hallazgo principal: la frase "Secuencia 5 para arriba" es ambigua leída de forma aislada — podría significar número de secuencia ascendente (5,6,7,8,9) o secuencia más poderosa (5,4,3,2,1), que es lo opuesto. Se documentó como N ≤ 5 (más poderoso), consistente con el resto de la regla, pero queda marcado como pendiente de confirmación explícita con el usuario.
- Otros huecos identificados y registrados en [[Arquitectura del Juego]] sin resolver todavía: si la fórmula aplica igual en Secuencia 0, qué pasa en caminos que no llegan hasta ahí, cómo se señaliza al jugador que posee un Avance oculto, y si el Beyonder de la secuencia anterior se consume o se conserva al combinarse.
- Decisión de alcance: solo documentación en esta sesión, cero cambios en `combinar.ts` u otro código — el consejo recomendó explícitamente no implementar hasta confirmar la ambigüedad de "5 para arriba".
- **Confirmación del usuario, mismo día:** "5 para arriba" es N ≤ 5 (5,4,3,2,1,0 — más poderoso), como se había documentado. Además aclaró que el rango no se detiene en Secuencia 1: llega hasta Secuencia 0 inclusive, con la misma fórmula (Beyonder N+1 + Avance + Ritual de avance), sin reglas propias para Secuencia 0. Ambos huecos marcados como resueltos en [[Arquitectura del Juego]]. Quedan sin resolver: caminos que no llegan a Secuencia 0, señalización de Avances ocultos, y si el Beyonder anterior se consume o se conserva.
- **Resolución en vivo, mismo día:** el usuario respondió los tres huecos restantes mientras se corría la Ronda 13 del consejo: todos los caminos sin excepción llegan a Secuencia 0 (no hay caso de camino corto); un Avance oculto no necesita señalización especial, aparece como un ítem más; nada del Beyonder de la secuencia anterior se consume al combinarse. Los cinco huecos originales de la Ronda 12 quedan resueltos.

## 2026-07-31 — Auditoría con el skill `llm-council` (Ronda 13)

- A pedido del usuario, se corrió la Ronda 12 otra vez con el skill real `llm-council` (5 asesores independientes en paralelo + revisión cruzada anónima con 5 revisores + síntesis del presidente) en vez del formato manual usado en rondas anteriores. Transcripción completa en [[Deliberacion del Consejo - Ronda 13]].
- **Veredicto:** la regla es implementable tal como está, sin defecto estructural. El consejo no encontró razón para rechazarla o rediseñarla.
- **Hallazgo nuevo, no reportado en la Ronda 12:** la confirmación de "nada se consume" solo cubre al Beyonder de la secuencia anterior — sigue sin resolver si el **Avance** y el **Ritual de avance** en sí mismos se consumen al usarse. El código actual de `combinar.ts` ya decrementa `owned.quantity` del Avance, es decir, ya asume que sí se consume — posible discrepancia con la intención real de diseño. El consejo lo marca como la pregunta a resolver primero, antes de tocar código o contenido.
- **Segundo hallazgo nuevo:** la regla no declara que un Avance/Ritual esté atado a un camino específico — sin esa restricción, nada impide combinar piezas de caminos distintos de la misma Secuencia.
- **Tercer hallazgo:** si el Beyonder persiste, falta decidir si el juego necesita un concepto de "rango actual" además de la colección acumulada, y qué ve el jugador cuando una combinación falla — ninguno de los dos está diseñado todavía.
- **Recomendación separada (no un hueco de la regla):** el problema de vocabulario detectado en testing previo ("Secuencia," "Misticismo," y ahora "Avance"/"Ritual de avance") se resuelve mejor con una capa de traducción/glosario de cara al jugador, no rediseñando la mecánica.
- Detalle completo, incluyendo las cinco respuestas de los asesores y las cinco revisiones cruzadas, en [[Deliberacion del Consejo - Ronda 13]]. Resumen y huecos actualizados en [[Arquitectura del Juego]].
- **Confirmación del usuario, mismo día, en respuesta a la pregunta que el consejo marcó como prioritaria:** nada se consume — ni el Beyonder anterior, ni el Avance, ni el Ritual de avance. Los tres persisten. Esto deja el código actual de `combinar.ts` (que sí decrementa `owned.quantity` del Avance) en contradicción directa con la regla de diseño confirmada — pendiente de corrección, no solo de documentación.

## 2026-07-31 — Principio de contenido: elementos reutilizables, no callejones de un solo uso

- El usuario fijó una regla de autoría: al diseñar recetas, evitar por defecto crear elementos/conceptos "muy intermedios" que solo sirven como escalón de una combinación específica. Cada elemento nuevo debería poder reutilizarse como ingrediente de otras combinaciones distintas siempre que sea razonable. Documentado en [[Arquitectura del Juego]].

## 2026-07-31 — Estructura del vault para sesiones de LLM futuras (Ronda 14)

- El usuario pidió resolver cómo una sesión de LLM futura (con o sin acceso al sistema de archivos) va a interactuar con este vault sin tener que escanearlo completo. Se corrió la Ronda 14 del consejo sobre esta pregunta específica de estructura. Transcripción completa en [[Deliberacion del Consejo - Ronda 14]].
- **Convergencia perfecta en la revisión cruzada:** los 5 revisores, sin excepción, rechazaron construir infraestructura extra (manifest.json, API consultable, router genérico) antes de arreglar lo básico — la vault ya tiene 462 de 471 notas de wiki "pendientes de revisión" sin resolver, prueba de que la documentación sola no se sostiene sin verificación mecánica.
- **Construido en esta sesión:** `NAVIGATION.md` en la raíz del vault — punto de entrada único que enruta entre trabajo de lore (`AGENTS.md` aplica completo) y trabajo de proyecto (`10-Project/README.md` aplica, `AGENTS.md` no), explica cuándo pedir un archivo por ruta exacta vs. cuándo usar `search_notes`, y duplica dentro del vault la instrucción que antes solo vivía en el repo hermano del juego.
- Enlazado desde el encabezado de `AGENTS.md` y de este `README`. La instrucción del repo `lotm-workspace/AGENTS.md` (juego) se corrigió para apuntar a `NAVIGATION.md` en vez de repetir la regla de forma independiente.
- **Corrección adicional, hallazgo independiente de dos asesores:** `log.md` (raíz, cambios de lore) y `10-Project/Log.md` (decisiones de proyecto) eran casi idénticos de nombre — riesgo real de escribir en el equivocado. Renombrado `log.md` → `Lore Log.md`.
- **Pendiente sin resolver:** no se pudo confirmar en vivo si la herramienta `search_notes` del MCP de Obsidian encuentra `NAVIGATION.md` por búsqueda semántica genérica — se confirmó (revisando el código de `obsidian-bridge.ts`) que el plugin subyacente sí soporta lectura por ruta exacta, lo cual cubre el caso de "pedir el archivo por su nombre conocido", pero no se probó el caso de búsqueda semántica abierta. Anotado como advertencia dentro de `NAVIGATION.md` para que se resuelva la próxima vez que haya una sesión con el MCP conectado.

**Corrección menor, mismo día:** el "~36 caminos" usado como contexto en la [[Deliberacion del Consejo - Ronda 13|Ronda 13]] venía de un conteo directo a la base de datos en vivo (durante la investigación del bug de `isStarter` de esa misma sesión), no de la cifra real de diseño del juego. El usuario confirmó que por el momento son **22 caminos**. No se reescribió la transcripción de la Ronda 13 (queda como registro histórico de lo que se discutió con la cifra que se tenía en ese momento) — solo queda esta nota como corrección.

## 2026-07-31 — Primer contenido real: Lord of Mysteries Group, Secuencia 9

- Empezó la autoría de contenido real del juego, camino por camino, grupo por grupo — arrancando con Lord of Mysteries Group (Fool/Seer, Door/Apprentice, Error/Marauder), basado en los poderes ya investigados en `02-Wiki`, no inventados.
- Proceso costoso pero instructivo: el primer intento para Seer (Ojo + Destino) fue rechazado por el usuario por no coincidir con los poderes reales; el segundo (Espíritu + Presagio) y tercero (Mente + Espíritu) también, por seguir siendo abstracciones en vez de leer los poderes literales de la fuente. La combinación final (Adivinación + Percepción) salió de nombrar los poderes explícitos con sus propias palabras, no de inventar un tema. Lección para las próximas rondas de grupos: no abstraer, citar.
- Resultado final: Seer = Adivinación + Percepción, Apprentice = Apertura + Puerta, Marauder = Moneda + Percepción (Percepción reutilizada a propósito entre Seer y Marauder). Documentado en [[Arquitectura del Juego]].
- **Sembrado directo en producción** (la base había sido vaciada por completo el mismo día, a pedido del usuario — este es literalmente el contenido inicial de la reconstrucción): 1 categoría (Lord of Mysteries), 3 caminos, 8 elementos (5 conceptos + 3 Beyonder), 3 secuencias, 3 recetas. Script de un solo uso vía el mismo mecanismo SSH/Prisma usado en sesiones anteriores; no quedó guardado en el repo, solo su resultado en la base.
- Siguiente grupo a definir: God Almighty Group.

## 2026-07-31 — Segundo grupo: God Almighty, Secuencia 9

- Visionary/Spectator, Tyrant/Sailor, White Tower/Reader, Sun/Bard, Hanged Man/Secrets Suppliant. Mismas correcciones de rigor que en la ronda anterior: "Gesto" rechazado por demasiado específico (un solo uso), "Agua+Escama" rechazado por sonar a monstruo marino en vez de marinero — se resolvió con Mar+Equilibrio, usando Balance como el poder que sí distingue a un Sailor. "Valor" rechazado por cubrir solo uno de varios efectos del Canto de Bard — reemplazado por Potencia (cubre todos los efectos de refuerzo a la vez).
- Resultado final: Spectator = Análisis + Visión, Sailor = Mar + Equilibrio, Reader = Libro + Conocimiento, Bard = Canción + Potencia, Secrets Suppliant = Percepción + Secreto (Percepción reutilizada por tercera vez). Documentado en [[Arquitectura del Juego]].
- Sembrado en producción junto con Lord of Mysteries: 1 categoría nueva (God Almighty), 5 caminos, 9 elementos concepto nuevos + reutilización de Percepción existente, 5 elementos Beyonder, 5 secuencias, 5 recetas.
- Siguiente grupo: Eternal Darkness Group.

## 2026-07-31 — Formato dedicado de seguimiento: `Combinaciones del Juego`

- El usuario pidió un formato en el vault para seguir las combinaciones del juego a medida que se definen — hasta ahora vivían como prosa dentro de `Arquitectura del Juego`, que ya empezaba a quedar larga y difícil de escanear.
- Creado [[Combinaciones del Juego]]: tabla maestra con estado por camino (sembrado / propuesto sin confirmar / sin empezar), lista de conceptos ya usados por slug (para reutilizar a propósito, no reinventar), la metodología resumida para no releerla cada vez, y el detalle "por qué" por grupo.
- Se movió el contenido de Lord of Mysteries y God Almighty desde `Arquitectura del Juego` hacia este archivo nuevo; `Arquitectura del Juego` queda con la regla de diseño general y un puntero.
- Registrado en el índice de este README, cumpliendo la regla de escritura fijada en la Ronda 14 ([[NAVIGATION|NAVIGATION.md]]).
- Eternal Darkness Group ya está en la tabla como "propuesto, sin confirmar" (Darkness/Sleepless = Noche+Oscuridad, Death/Corpse Collector = Cadáver+No-muerto, Twilight Giant/Warrior = Fuerza+Combate) — pendiente de que el usuario lo confirme o corrija antes de sembrarlo.

## 2026-07-31 — Tercer grupo confirmado y sembrado: Eternal Darkness

- El usuario aprobó la propuesta de Eternal Darkness Group sin correcciones. Sembrado en producción: 1 categoría, 3 caminos, 6 elementos concepto nuevos, 3 elementos Beyonder, 3 secuencias, 3 recetas.
- Resultado: Sleepless = Noche + Oscuridad, Corpse Collector = Cadáver + No-muerto, Warrior = Fuerza + Combate. Estado actualizado a ✅ en [[Combinaciones del Juego]].
- Siguiente grupo: Calamity of Destruction.

## 2026-07-31 — Error real detectado post-siembra: Corpse Collector

- El usuario notó que **Cadáver + No-muerto = Corpse Collector** era un error de categoría, no solo de gusto: "No-muerto" nombra un tipo de criatura/monstruo, no una habilidad o concepto abstracto. Objeto + tipo-de-criatura lee como receta para reanimar un cadáver (un monstruo), no como los ingredientes de un Beyonder humano — el mismo error de fondo que ya se había corregido con Agua+Escama para Sailor (sonaba a monstruo marino), pero sin generalizar la lección a "ningún concepto debe nombrar una categoría de criatura/monstruo".
- **Regla nueva para las próximas rondas:** un concepto de combinación debe ser una habilidad, un objeto, un lugar/contexto, o un estado abstracto — nunca el nombre de un tipo de criatura o monstruo. Revisar esto explícitamente antes de proponer cada combinación, no solo después de que se detecte.
- Corregido en producción: `RecipeIngredient` de `no-muerto` reemplazado por `conocimiento` (reutilizado de Reader) en la receta de Corpse Collector, `inputKey` recalculado, y el elemento `no-muerto` eliminado por quedar sin uso. Documentado en [[Combinaciones del Juego]].
- Resultado final del grupo: Corpse Collector = **Cadáver + Conocimiento**.

## 2026-07-31 — Segundo error real detectado: Sleepless

- El usuario también rechazó Noche + Oscuridad para Sleepless: los dos conceptos decían básicamente lo mismo (noche ≈ oscuridad) en vez de cubrir dos poderes distintos de la fuente.
- Corregido a **Noche + Fuerza** — Fuerza sale directo de la fuente ("physical strength, intuition, and mental capabilities" se fortalecen de noche), reutilizado de Warrior.
- Regla nueva agregada a la metodología de [[Combinaciones del Juego]]: los dos conceptos de una pareja deben cubrir dos poderes distintos, nunca el mismo poder repetido con otra palabra.
- `Oscuridad` queda creado en el sistema pero sin usar — disponible para otro grupo en vez de borrarlo, a diferencia de `no-muerto` (que sí se borró por ser un error de categoría, no solo una elección subóptima).
- Grupo Eternal Darkness queda cerrado con las tres correcciones aplicadas: Sleepless = Noche+Fuerza, Corpse Collector = Cadáver+Conocimiento, Warrior = Fuerza+Combate (Fuerza reutilizado por segunda vez).
- Siguiente grupo: Calamity of Destruction.

**Reescritura de `NAVIGATION.md`, mismo día:** a pedido del usuario, reescrito en inglés (antes en español) con formato estricto MUST/MUST NOT calcado del propio `AGENTS.md`, y recortado a lo mínimo operativo — se eliminó toda prosa explicativa que no cambia lo que un agente debe hacer, para minimizar consumo de tokens en cada sesión que lo lea. El contenido/las reglas no cambiaron, solo el idioma y la densidad.

**Regla de escritura ("self-feeding index"), mismo día:** el usuario pidió reglas explícitas para que los agentes que escriban en el vault actualicen los índices al crear contenido nuevo, en vez de dejarlo desincronizado. Se agregó `## 3. Write rule` a `NAVIGATION.md`: para lore, apunta al paso 10 del flujo de ingestión de `AGENTS.md` (ya exige actualizar `04-Indexes/*` en el mismo cambio — regla preexistente, solo referenciada); para `10-Project/`, se agregó una regla nueva (no existía antes) exigiendo agregar cualquier archivo nuevo a la lista "Contenido" del README en la misma edición. **Prueba de que la regla hacía falta:** al revisar el índice para escribir esto, se encontró que las Rondas 10 y 11 del consejo llevaban desde su creación sin aparecer en la lista de "Contenido" — corregido en el mismo cambio.

## 2026-07-31 — Cuarto grupo: Calamity of Destruction (proceso largo, hallazgo de fondo)

- El usuario rechazó las primeras dos propuestas para Assassin y Hunter (Sombra+Sentido, Fuerza+Sentido) por "poco representativas de la secuencia" — no un error puntual como los anteriores, sino una señal de que algo más de fondo andaba mal.
- Al preguntar "cómo que la fuente es floja", se comparó la riqueza de poderes: Assassin y Hunter solo traían 2-3 poderes genéricos en su nota individual de Secuencia 9, contra 4-5 poderes específicos en los grupos ya hechos (Seer, Marauder, etc.).
- **Hallazgo real:** existe `01-Sources/Calamity of Destruction - Research Dossier`, con una tabla "Powers by Sequence" mucho más completa que la nota corta de `02-Wiki` — Assassin ahí trae infiltración, eliminación rápida, armas, venenos, puntos ciegos; Hunter trae trampas, explosivos, memorización de terreno, emboscadas. Ninguno de esos detalles estaba volcado a la nota individual de Secuencia 9 todavía.
- Iteración larga sobre Assassin: Sombra+Veneno (rechazada, "horrorosamente horrible") → Sombra+Agilidad (anclada en la lista dura "Poderes nuevos" del dossier) → el usuario terminó decidiendo por su cuenta **Muerte + Trabajo**, priorizando la lectura de "la muerte como oficio" sobre las lecturas literales de poderes.
- Iteración sobre Hunter: Rastro+Trampa → Terreno+Presa (anclada en la síntesis del propio dossier: "prepare terrain and identify prey") → usuario pidió más variantes (Trampa+Presa, Terreno+Rastro, Emboscada+Presa) → decisión final **Terreno + Rastro**.
- **Regla nueva para la metodología:** si una combinación se siente floja, sospechar primero de que la fuente (nota corta de Secuencia 9) esté incompleta, y revisar si hay un dossier de investigación más rico en `01-Sources` antes de seguir forzando palabras sobre poco material.
- Sembrado en producción: 1 categoría, 2 caminos, 4 elementos concepto, 2 beyonders, 2 secuencias, 2 recetas. Documentado en [[Combinaciones del Juego]].
- Siguiente grupo: Demon of Knowledge.

## 2026-08-02 — Regla de composición para cartas de ritual

- Cada `Ritual Logic` conserva una sola carta por ritual. La variante cambia la representación visual de la misma información; nunca crea cartas duplicadas ni divide el contenido en varias cartas.
- Si el backlash del ritual está descrito de forma explícita en el canon, la carta usa `Pressure`.
- Si el backlash no está descrito de forma explícita, la carta recibe al azar una variante entre `Chain`, `Split`, `Casefile` y `Timeline`; `Pressure` queda reservado para backlash canónico.
- Esta asignación es una regla editorial/visual del proyecto, no terminología canónica de LOTM.
- Aplicación inicial: God Almighty Group, con el contenido pendiente de aprobación antes de crear o actualizar cartas live.

## 2026-08-02 — Criterio operativo de backlash para `Ritual Logic`

- `Backlash` significa la reacción adversa de la poción/característica durante la asimilación: daño, deformación, pérdida de conciencia, fragmentación del alma o riesgo de perder el control.
- No se debe llamar backlash a una manifestación visual del avance, a una transformación exitosa ni al efecto estabilizador del ritual. Esos datos van separados dentro de la explicación de la carta.
- Aplicación en God Almighty, Secuencia 5: `Pressure` para Dreamwalker y Ocean Songster; `Pressure` para Shepherd con confianza media por la propiedad canónica de desgarro del alma; `Timeline` aleatoria para Priest of Light y `Chain` aleatoria para Mysticism Magister al no haber backlash adverso explícito localizado.
- Se añadieron las cinco cartas a `LOTM — Why Sequence 5 Rituals Work`, una parte por camino. El orden global de las ocho partes existentes se aleatorizó sin duplicar ni dividir cartas.

## 2026-08-02 — Compresión editorial de cartas de ritual

- El texto visible de `Ritual Logic` debe ser breve: una frase para la condición, una para la presión/supervivencia y una para la preparación conceptual.
- No escribir `Backlash:` dentro del cuerpo de la carta. La composición visual ya comunica la presión; el texto debe describir directamente el peligro o indicar que no hay backlash explícito.
- Se aplicó la compresión a las ocho cartas live de `LOTM — Why Sequence 5 Rituals Work` y se regeneró el export.

## 2026-08-02 — Tono del bloque conceptual en cartas de ritual

- Las frases de `Concept rehearsal` no deben sonar a etiquetas o apuntes telegráficos.
- Mantenerlas breves, pero escribir una idea completa y natural: sujeto, tensión y vínculo con el poder de la Secuencia.
- Se reescribió el bloque conceptual de las ocho cartas live con ese criterio y se regeneró el export.

## 2026-08-02 — Espaciado adaptativo para cartas de ritual

- La composición debe medir la carga total del contenido visible y no reservar siempre la misma altura para bloques cortos.
- Cuando una variante no-`Pressure` tiene poco texto, usa el espacio vertical libre para repartir mejor sus pasos y paneles; el contenido denso conserva su compactación.
- `Pressure` mantiene su baseline visual congelado para no alterar composiciones ya aprobadas; no se deben regenerar goldens para ocultar una regresión.

## 2026-08-02 — Función del ritual visible en contenido y UI

- Toda carta de ritual debe separar tres ideas sin ambigüedad: `Ritual function` explica qué consigue el acto y cómo orienta la asimilación; `Potion pressure` explica el peligro o la presión de la poción; `Sequence rehearsal` explica qué poder o principio de la nueva Secuencia se ensaya.
- Las variantes pueden cambiar la composición, pero deben conservar esa misma lectura: no volver a etiquetas vagas como `Setup`, `Condition` o `Concept rehearsal` cuando ocultan la función.
- El contenido live de las ocho cartas de Secuencia 5 se reescribió con esa separación. Se evita la palabra `backlash` en el texto visible; se habla de reacción adversa, presión o peligro según corresponda.

## 2026-08-02 — Chain usa el alto libre cuando el contenido no es denso

- El modo `Chain` no debe depender de que el texto sea extremadamente corto para crecer: mientras no esté en modo `dense`, reparte sus pasos por el alto disponible y deja el veredicto/footer debajo.
- El modo `dense` conserva su compactación; `sparse` sigue afinando el espaciado para cartas especialmente breves.

## 2026-08-02 — Portada y guía de la colección de rituales

- Se creó la portada `Full Image Cover` **Why Sequence 5 Rituals Work** en la parte `Cover` de la colección live, usando `/covers/sequence-2-c-b.png`, un fondo místico azul ya existente en Card Studio.
- Se creó [[Guía de cartas de ritual]] y se añadió al índice del proyecto. La guía fija el contrato `Ritual function` / `Potion pressure` / `Sequence rehearsal`, la regla de evidencia, las cinco variantes y el estilo de portada.

## 2026-08-02 — Una sola sección principal para los rituales

- Se eliminaron las divisiones visibles por pathway: las nueve cartas de la colección live ahora viven juntas en `Main`.
- `Main` abre con la portada y continúa con los ocho rituales de Secuencia 5. La guía queda actualizada para impedir nuevas partes separadas.

## 2026-08-02 — Slide metodológica de la colección

- Se añadió **Why Rituals Matter** como `General Explanation` en `Main`, justo después de la portada.
- La slide explica la función del ritual, sus utilidades durante la asimilación y la diferencia entre hechos canónicos, interpretaciones y teorías. La colección pasa a tener diez cartas: portada, método y ocho rituales.

## 2026-08-02 — Hook de entrada para la explicación

- Se reescribió **Why Rituals Matter** para abrir con una pregunta, explicar la utilidad del ritual en bloques cortos y dejar clara la frontera entre canon, interpretación y teoría.
- La slide puede tener más desarrollo que una carta de ritual, pero mantiene párrafos breves para no funcionar como un muro de texto al inicio.

## 2026-08-02 — Fondo automático por Secuencia

- El fondo de la slide metodológica ya no se guarda manualmente en la carta: `General Explanation` declara la Secuencia y Card Studio resuelve su imagen por defecto.
- Se añadió el asset público `/cartas/sequence-back/sequence-5.png` y la URL manual queda documentada solo como override excepcional.

## 2026-08-02 — Ruta pública del fondo de Secuencia 5

- La imagen automática se sirve bajo `/cartas/sequence-back/sequence-5.png`, que funciona igual en la vista viva y en producción; el renderizador de PNG la resuelve desde `public/`.

## 2026-08-02 — Ritual Logic hereda el fondo del pathway

- Las cartas `Ritual Logic` conservan la misma regla que las cartas de Tier: el fondo por defecto viene del pathway declarado. `Mysticism Magister` usa por tanto `White Tower` sin guardar una URL en la carta.
- Se corrigieron las rutas públicas de fondos e iconos del pathway bajo `/cartas` para que esa herencia también funcione en la vista viva de producción.
