---
tags: [project, legal, risk]
scope: out-of-ontology
updated: 2026-07-30
---

# IP y Riesgo Legal — Archivo de Misterios

Ver [[README]]: esta nota no sigue el modelo epistémico de `AGENTS.md`. Es un registro de riesgo de negocio, no una afirmación sobre el canon de la novela.

## Estructura real de derechos (investigado 2026-07-30)

- **China Literature Ltd. (Tencent / Qidian)** — dueño de los derechos originales en chino; publicó la versión impresa china en 2020.
- **Webnovel** (rama inglesa de Qidian) — traducción oficial online en inglés.
- **Yen Press** — derechos de impresión en inglés (primer volumen físico, julio 2025).
- **SPARK NEXA** — desarrollador/publisher del MMORPG oficial licenciado.

## Fecha ancla: 21 de agosto de 2026

El MMORPG oficial (Unreal Engine 5, SPARK NEXA) lanza en China (PC/Android/iOS) ese día; lanzamiento global (inglés/japonés/coreano) más adelante en 2026. Es un juego de **acción en tercera persona en tiempo real** (combate, clases tank/DPS/support, PvP) — producto de forma radicalmente distinta a un juego web de combinación de conceptos.

**Matiz importante:** el propio sistema de progresión del MMORPG usa una submecánica de "preparar pociones de secuencia combinando fórmulas e ingredientes" — hay cierto solapamiento conceptual con el juego, aunque envuelto en un producto de combate totalmente distinto. La mecánica de Archivo de Misterios es "combinar **conceptos** abstractos" (estilo Little Alchemy clásico), no "combinar ingredientes para craftear pociones" — esto reduce el solapamiento real, aunque las mecánicas de combinación en general no suelen ser objeto de propiedad intelectual protegible de todas formas.

**Por qué importa la fecha:** antes del 21 de agosto no hay producto oficial de juego que "proteger" comercialmente en este espacio. Después, sí lo hay, con un titular de derechos activo (Tencent/SPARK NEXA) con presupuesto de marketing vigilando el mismo espacio de búsqueda.

## Evidencia sobre tolerancia a fan-works

- **No se encontró ningún pleito ni cese-y-desista documentado** contra ningún fan-work de LOTM. Ausencia notable, pero no es prueba definitiva de tolerancia.
- **Postura histórica de Qidian/China Literature hacia fan-translators:** de reconocimiento y búsqueda de cooperación (ofrecieron convertir traductores de fans en socios formales), no de persecución legal agresiva. Evidencia indirecta (sobre traducciones, no juegos).
- **Fan-game existente confirmado:** "Lord of Mystery" de David Fang en itch.io — juego de cartas lovecraftiano "inspirado en" LOTM (tarot, ocultismo, Beyonders), con página de compra activa. No se confirmó si usa nombres exactos de personajes. Es la evidencia más concreta de que fan-games de LOTM operan y monetizan sin acción legal aparente — pero es un solo punto de datos, de baja visibilidad, no prueba nada a la escala que busca este proyecto.

## Distinción de riesgo que se estableció

- **Riesgo legal formal** (demanda del titular de derechos) — lento, caro, poco común.
- **Riesgo de plataforma/takedown** (DMCA o reporte de ToS en TikTok, itch.io, o el procesador de pago) — barato, rápido, y la vía real por la que la mayoría de fan-games desaparecen. "No hay pleitos documentados" no dice nada sobre este segundo riesgo, que es el que de verdad aplica a un proyecto de este tamaño.
- Patrón histórico observado en otros fan-games de IP asiática (AM2R, Pokémon Uranium): la tolerancia suele desplomarse **justo cuando lanza el producto oficial licenciado** — no antes. Refuerza la relevancia del 21 de agosto.

## Procesadores de pago (investigado 2026-07-30)

- **Patreon** prohíbe explícitamente monetizar contenido de IP no autorizada — caso real documentado de un fan-game con su cuenta de Patreon cerrada por esto exacto. Contradice la idea de que "Patreon es más seguro que IAP": no lo es, solo aplica la misma regla en otro punto.
- **Stripe** y **PayPal** tienen la misma prohibición explícita en sus políticas de uso aceptable, con procesos de reporte de infracción de IP para que el titular de derechos reclame.
- **Ko-fi / Buy Me a Coffee** procesan por debajo vía Stripe/PayPal — heredan la misma restricción.
- **Liberapay / Open Collective** son estructuralmente distintos (sin fines de lucro / transparencia financiera total) y se prestan a un encuadre de "financiar el proyecto" en vez de "comprar un producto" — reduce la superficie visible de lo que parece transacción comercial de mercancía con nombres protegidos, aunque la prohibición contractual de fondo sea similar.
- **Conclusión:** ningún procesador de pago da un escudo legal real — todos prohíben lo mismo en sus términos. La diferencia está en cuánta superficie expones y si alguien reporta.

## Mitigación ya implementada (no solo recomendada)

Ver [[Arquitectura del Juego]] para el detalle técnico. Resumen: arquitectura de datos desacoplada (nombres de LOTM solo como datos en Postgres, nunca en el modelo/lógica) + nombre de producto propio ("Archivo de Misterios") ya en uso en toda la interfaz. Esto no es un escudo legal (un cese-y-desista audita lo que el usuario final ve, no el schema de la base de datos) — es una ventaja operativa: permite reemplazar nombres rápido si hace falta reaccionar a un aviso de retiro.

## Veredicto real del abogado (2026-07-30)

Consultado un abogado de IP real (por fin, tras siete sesiones de consejo pidiéndolo). Veredicto: **el proyecto es legalmente delicado** por dos razones concretas:

1. Se planea usar **nombres canónicos exactos** de la novela (personajes, Secuencias, Rutas de Beyonder reales), no genéricos.
2. Es una **IP activa**, no dormida — donghua oficial licenciado + MMORPG de Tencent en camino (21 de agosto de 2026).

**Hallazgo que conecta esto con la prueba de usuarios:** los mismos dos términos que el abogado señala como el riesgo concreto ("Secuencia", conceptos de "Misticismo") son exactamente donde los 10 testers ajenos a LOTM se perdieron durante la prueba de valor. Ver [[Estrategia de TikTok y Validación]] para el detalle de esa prueba. El consejo (ronda 8, revisión cruzada 5/5) concluyó que es más defendible leer esto como **la misma fricción vista desde dos ángulos** (dependencia de vocabulario canónico) que como dos problemas independientes — aunque no es prueba definitiva, porque es casi tautológico que lo más canónico sea también lo menos familiar para un extraño.

**Costo nuevo identificado:** genericar "Secuencia"/"Misticismo" resolvería el riesgo legal y la confusión de usuarios, pero esos mismos términos son el gancho de descubrimiento orgánico (lo que buscan los fans de LOTM en TikTok/Google). Nadie había cuantificado ese costo antes.

**Matiz de alcance:** renombrar términos no blinda si la estructura general del sistema (progresión por niveles, jerarquía de rutas, combinar poderes) sigue siendo reconocible como copia — el riesgo puede estar en el "total look and feel", no solo en los nombres propios. Esto todavía no se le preguntó al abogado explícitamente.

## Replanteamiento (2026-07-30, ronda 9): NO genericar los nombres — con reservas

El usuario rechazó la recomendación de genericar "Secuencia"/"Misticismo", argumentando que perdería el gancho con la fanbase de LOTM y el apoyo del público de TikTok. El consejo revisó la decisión y llegó a una postura distinta a la de la ronda 8, con razones propias:

- **Los dos hallazgos (riesgo legal + confusión de testers) son problemas independientes**, no la misma causa: el riesgo legal viene de activos protegidos (nombres propios, facciones, tramas específicas), no de que "Secuencia"/"Misticismo" sean difíciles de entender. Renombrar esas dos palabras no reduce el riesgo legal si el resto del juego sigue siendo reconocible como LOTM. La confusión de los testers se resuelve con tutorial/glosario, no borrando términos.
- Por eso, **mantener los nombres canónicos no impide resolver ninguno de los dos problemas reales** por separado.
- **Rechazado explícitamente:** la idea de crecer rápido/grande antes del 21 de agosto para "ser políticamente costoso de tocar" — invierte la lógica real (más visibilidad = más riesgo de detección, no menos).

**Advertencia que el propio consejo se hizo a sí mismo (unánime, 5/5 en la revisión cruzada):** este giro de 180° llegó justo después de la objeción fuerte del usuario. El razonamiento se sostiene por mérito propio, pero ningún asesor se preguntó "¿estamos razonando o cediendo a lo que el usuario quiere oír?" antes de llegar ahí. Vale la pena tenerlo presente como sesgo posible, no solo como veredicto final.

**Dos huecos de información sin resolver:**
- Nadie tiene la cita textual del abogado — todo el análisis trabaja sobre la paráfrasis "delicado", no sobre lo que dijo exactamente.
- Nadie verificó si es cierto que cambiar esas dos palabras "pierde todo el gancho" — es una afirmación razonable pero no medida (¿cuánto del interés en el canal depende del vocabulario exacto de LOTM vs. de los personajes/trama/arte del contenido?).

## Ronda 10 (2026-07-30): cita textual del abogado obtenida

El usuario consiguió la **cita textual completa** del abogado (cerraba el hueco 1 de la Ronda 9). Confirma "legalmente delicado" y da un semáforo de riesgo por tier de monetización (gratis=ok; propina general a página de developer sin marca ni metas de LOTM=riesgo medio; donaciones en la web=medio-alto; publicidad=alto; Patreon del fangame=muy alto). Introduce una recomendación explícita nueva: **separación técnica engine/content** (motor de progresión/combinación separado del paquete de contenido LOTM, para poder retirar el paquete y conservar el programa ante una reclamación) — más específico que la "arquitectura desacoplada" ya implementada.

El consejo (Ronda 10, ver [[Deliberacion del Consejo - Ronda 10]]) confirmó la decisión de Ronda 9 como **piso mínimo, no estrategia completa**, con 4/5 asesores marcando como punto ciego grave la lectura del Expansionista de tratar esto como oportunidad de crecimiento ("motor white-label") en vez de mitigación defensiva — señalado como el mismo patrón de sycophancy que el consejo ya se había auto-advertido en Ronda 9.

**Puntos ciegos nuevos, encontrados solo en la revisión cruzada:**
- El riesgo legal del **canal de TikTok** (clips/arte/música de LOTM usados para crecer audiencia) es una superficie separada e independiente del fangame — un strike de copyright de plataforma podría matar el canal sin tocar el juego. Nunca se le preguntó esto al abogado.
- La asociación entre los ~492 seguidores y la marca LOTM ya es **histórica, pública e indexada** — reestructurar el código o abrir una página de propinas limpia no borra los videos pasados.
- El **hueco 2 de Ronda 9 sigue sin resolverse**: nadie verificó si renombrar "pierde el gancho" con TikTok — es pregunta de producto/audiencia, no legal, y el abogado no la puede contestar.
- Vía de monetización no explorada: monetizar el **canal de TikTok directamente** (Creator Fund, marcas, colaboraciones) en vez del juego evita por completo el semáforo del abogado, porque el ingreso dependería de audiencia propia, no de un derivado de LOTM.

## Ronda 11 (2026-07-30): el abogado contesta las dos preguntas cerradas

El usuario volvió con una respuesta del abogado que contesta directamente las dos preguntas pendientes de Ronda 10:

1. **Escala/viralidad:** "La infracción potencial no comienza cuando alcanzas cierto número de usuarios. Existe desde que el contenido se hace público." La escala solo cambia la probabilidad de detección, no la existencia del riesgo. **Esto invalida la premisa implícita de rondas anteriores** ("somos pequeños, hay margen de maniobra") — no había zona segura por tamaño, nunca la hubo.
2. **TikTok como exposición separada:** confirmado — puede recibir reclamación contra un video, perfil, nombre de cuenta o el enlace al juego. Se mitiga usando contenido 100% original (devlogs técnicos, gameplay propio), pero es una condición a cumplir **de aquí en adelante**, no un hecho ya verificado sobre el contenido que ya está publicado.

El consejo (Ronda 11, ver [[Deliberacion del Consejo - Ronda 11]]) confirmó el rechazo al "motor white-label" del Expansionista (4-contra-1 de Ronda 10 reforzado — el abogado reafirmó que engine/content es defensivo). Pero identificó un problema de proceso serio: **en once rondas nadie ha visto el texto literal del abogado más allá de lo que el usuario transcribe** — el consejo trabaja sobre resúmenes reportados, no sobre el documento original.

**Puntos ciegos nuevos de Ronda 11:**
- Nadie evaluó la **exposición acumulada del pasado**: si el riesgo existió desde el día uno, ¿qué pasa con los ~500 seguidores y el contenido ya publicado, no solo con publicaciones futuras?
- Nadie preguntó si **ya hay dinero de por medio** (donaciones, monetización de plataforma) — cambia el cálculo de riesgo comercial vs. no comercial.
- La retractación del Expansionista sobre el motor white-label es parcial: propone la misma estrategia con otro nombre (LOTM como imán de atención para marca personal).

## Acciones pendientes (actualizado, Ronda 11)

1. ~~Consultar a un abogado de propiedad intelectual/entretenimiento real~~ — **hecho, 2026-07-30**.
2. ~~Volver al abogado con cita textual~~ — **hecho, 2026-07-30**. Ver Ronda 10.
3. ~~Enviar las dos preguntas cerradas (escala/viralidad, TikTok separado)~~ — **hecho, 2026-07-30**. Ver Ronda 11.
4. **Verificar el estado real de la cuenta de TikTok hoy** (nombre, bio, contenido publicado) antes de cualquier acción de limpieza — el consejo señaló que se estaba a punto de prescribir "auditar y limpiar" sin haber mirado primero qué hay ahí.
5. **Construir la separación técnica engine/content** — condición explícita del abogado, no opcional. Antes del 21 de agosto.
6. **Configurar la propina general** (página de developer, sin marca de LOTM, sin recompensas ni metas) — re-auditar cuando la audiencia escale.
7. **NO genericar los nombres todavía** — arreglar confusión de testers con tutorial/glosario, no renombrando.
8. **Verificar con datos** cuánto del interés depende del vocabulario exacto de LOTM — sigue sin medirse (hueco original de Ronda 9, todavía abierto tras tres rondas).
9. **Rechazado explícitamente (Ronda 10 y 11):** tratar engine/content como base de un "motor white-label". El Expansionista se retractó en Ronda 11, pero con matices — vigilar que no reaparezca disfrazado de "marca personal alrededor de LOTM".
10. **Nuevo (Ronda 11):** evaluar si hay exposición legal acumulada por el contenido y la audiencia ya existentes, no solo por publicaciones futuras.
11. **Nuevo (Ronda 11):** confirmar si el proyecto ya genera algún ingreso (donaciones, monetización de plataforma) — cambia el análisis de riesgo.
12. Preguntarle al abogado por precedentes reales y viabilidad de licencia directa — sigue pendiente.
13. Monitorear el fan-game de itch.io como canario y escribir el plan de contingencia — sigue pendiente.
14. Revisar toda la decisión el 21 de agosto de 2026 con los datos que existan para entonces.
