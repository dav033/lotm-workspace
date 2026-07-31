---
tags: [project, marketing, validation]
scope: out-of-ontology
updated: 2026-07-30
---

# Estrategia de TikTok y Validación — Archivo de Misterios

Ver [[README]]: nota de negocio/producto, no lore de la novela.

## Estado del canal (a la fecha de la primera medición, semana 1)

- 1 semana de trabajo serio en el canal.
- 492 seguidores, ~20,000 me gusta acumulados.
- Vistas por video entre 2,000 (peor) y 38,000 (mejor).
- No se había mencionado el juego en el canal todavía a esa fecha.

**Lectura del consejo sobre estos números:** ritmo fuerte — ya cerca del umbral que se había puesto (500-1,000 seguidores) pero originalmente pensado para 4-6 semanas, no 1. Aun así, la dispersión de vistas (2K vs 38K) es típica de un pico viral puntual, no necesariamente de tracción sostenida — la pregunta operativa correcta es si se repite en la semana 3 y la 5, no el conteo acumulado. La tracción del canal valida que hay apetito por **consumir lore**, no que haya apetito por **instalar/jugar un juego** — son mercados con fricciones distintas, y esa segunda pregunta seguía sin probarse.

## Por qué "pulir vs. validar" resultó ser un falso dilema

Cuando el juego ya estaba parcialmente jugable y en vivo, surgió la pregunta de si pulir visualmente antes o después de probar con usuarios. Conclusión del consejo: alguien ajeno a LOTM no distingue "el juego es aburrido" de "el juego se ve roto" — si se prueba con público neutral un build que se siente inacabado, se mide "rebotaron porque parece roto", no "el loop no engancha". Por eso el orden importa:

1. Arreglar **solo** lo que sea una falla funcional real (no estética) — ej. feedback claro de éxito/fallo en el drag-and-drop. (Auditado 2026-07-30: esto ya estaba implementado, ver [[Arquitectura del Juego]].)
2. Definir el criterio de éxito/fracaso de la prueba **antes** de reclutar a nadie.
3. Recién entonces, salir a buscar testers reales.
4. Solo si el corte vertical pasa la prueba, invertir en pulido visual adicional (íconos, animaciones extra) y en usarlo como contenido de marketing.

## Resultado de la primera prueba de valor (2026-07-30)

Se probó el juego con 10 personas ajenas a LOTM (primera ejecución real de esto, tras varias sesiones pidiéndolo). Resultado cualitativo: **el inicio fue calificado como "decente"**, pero los testers **se perdieron específicamente al llegar a los conceptos de "Secuencia" y "Misticismo"** — los términos más técnicos/específicos del lore de LOTM dentro del árbol de combinaciones.

No se ejecutó con el criterio numérico de éxito predefinido (sigue pendiente). Aun así, es la primera señal real de usuarios, y coincide de forma notable con el veredicto legal del mismo día (ver [[IP y Riesgo Legal]]): el abogado señaló esos mismos términos como el riesgo concreto por ser nombres canónicos exactos. El consejo (ronda 8) leyó esto como la misma fricción vista desde dos ángulos — sugestivo, no concluyente — y recomendó bifurcar el juego con esos dos términos genéricos y volver a probar, esta vez con número de éxito escrito antes de reclutar a nadie.

**Costo a considerar antes de genericar:** "Secuencia" y "Misticismo" son también palabras que los fans de LOTM buscan para encontrar contenido como este — genericarlas podría cortar el gancho de descubrimiento orgánico que alimenta al canal.

## Lo que sigue pendiente de definir (no resuelto todavía)

Señalado con fuerza en varias revisiones cruzadas del consejo, sin que se haya cerrado en ninguna sesión:

1. **Criterio numérico de éxito/fracaso de la prueba de valor.** Ejemplo de formato a definir: "de 8-10 personas ajenas a LOTM, al menos X completan 5 combinaciones sin ayuda y Y% dicen que volverían a jugar." Debe escribirse **antes** de correr la prueba, no después de ver resultados.
2. **Plan real de reclutamiento de testers ajenos a LOTM.** El único canal disponible ahora mismo (los seguidores de TikTok) es exactamente lo contrario de lo que hace falta — son fandom, no neutrales. Opciones sugeridas: amigos/familia que no conozcan LOTM, comunidades de juegos casuales/indie (no de LOTM), Discords ajenos al fandom.

## Por qué NO conviene todavía usar el pulido visual como contenido viral

Se propuso en una ronda del consejo invertir en animar el círculo de invocación específicamente para generar clips de TikTok ("miren lo que descubrí"). Señalado como el mayor punto ciego en 5 de 5 revisiones cruzadas de esa ronda: usar la audiencia caliente de TikTok (que sí conoce LOTM) para amplificar un producto que todavía no se sabe si engancha a quien no lo conoce es invertir la causalidad. Si el loop no retiene, el clip viral solo acelera el rebote y quema la audiencia en algo no validado. Recomendación: amplificar **después** de validar, no antes.

## Conexión con la fecha ancla del 21 de agosto de 2026

Ver [[IP y Riesgo Legal]] para el detalle legal. Desde el ángulo de marketing: el lanzamiento del MMORPG oficial va a generar una ola de búsquedas y contenido sobre LOTM — potencialmente buen viento de cola si el juego ya está validado y presentable para esa fecha, pero también el momento de mayor vigilancia de marca por parte del titular de derechos. Doble filo reconocido, no resuelto a favor de un solo lado.
