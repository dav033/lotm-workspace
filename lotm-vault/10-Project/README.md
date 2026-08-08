---
tags: [project, meta]
scope: out-of-ontology
updated: 2026-07-31
---

# 10-Project — Archivo de Misterios (juego + canal)

> New session? [[../NAVIGATION|NAVIGATION.md]] (vault root) MUST be read first — confirms this is the right folder for your task before you keep reading.

Esta carpeta es una **arquitectura paralela y deliberadamente separada** de todo lo demás en este vault.

## Por qué existe aparte

El resto del vault (`00-Inbox` a `06-Templates`, `Clippings`) está gobernado por las reglas de [[../AGENTS.md|AGENTS.md]]: solo conocimiento trazable sobre la novela *Lord of the Mysteries*, con modelo epistémico obligatorio (`canon` / `interpretation` / `theory` / `fanon`), evidencia directa por fuente, y un contrato de carpetas estricto.

Nada de lo que vive en `10-Project/` es lore de la novela. Es el registro de un proyecto real: un canal de TikTok de contenido sobre LOTM y un juego web de combinación de conceptos ("Archivo de Misterios") ambientado en ese universo, hecho como fanmade.

**Reglas de `AGENTS.md` que NO aplican aquí:** modelo epistémico, evidencia por fuente, inmutabilidad de fuentes, frontmatter obligatorio de tipo/status/spoilers, folder contract, hard completion gate. Ninguna nota de esta carpeta necesita `status: canon` ni citas — son decisiones de negocio/ingeniería, no afirmaciones sobre el canon de la novela.

**Por qué comparten vault:** el juego y el canal se alimentan directamente del trabajo de lore de `02-Wiki` (nombres, Secuencias, Rutas de Beyonder) y del pipeline de contenido de `03-Content/TikTok Content`, así que tiene sentido que vivan cerca y sean enlazables, aunque las reglas que los gobiernan sean distintas.

## Contenido

- [[Log|Log de decisiones]] — registro cronológico de decisiones de proyecto, sesión por sesión.
- [[IP y Riesgo Legal|IP y Riesgo Legal]] — investigación de derechos, fecha ancla, plan de contingencia.
- [[Arquitectura del Juego|Arquitectura del Juego]] — stack técnico, decisiones de diseño de datos, estado actual del código, **y la regla de diseño del sistema de combinación/Beyonders** (Secuencia 9, Avances, Rituales de avance, Avances ocultos).
- [[Guía de cartas de ritual|Guía de cartas de ritual]] — contrato de contenido, evidencia, variantes, portada y estilo visual para las cartas de ritual de avance.
- [[Guía de pares de cartas|Guía de pares de cartas]] — contrato y uso de las cartas `subject` y `explanation` para justificar asignaciones de personajes y artefactos.
- [[Sesión 2026-08-02 - Fondos automáticos y cartas de ritual|Sesión 2026-08-02 — Fondos automáticos y cartas de ritual]] — decisiones de esta sesión sobre fallback por pathway, fondos de Secuencia, rutas públicas y estado del deploy.
- [[Combinaciones del Juego|Combinaciones del Juego]] — registro de trabajo de las combinaciones Concepto+Concepto → Beyonder de Secuencia 9, grupo por grupo: tabla maestra de estado, conceptos ya usados, detalle y "por qué" de cada camino confirmado.
- [[Efecto mariposa|Efecto mariposa]] — investigación de cadenas causales pequeñas que producen cambios grandes en la historia de LOTM, para convertirlas en contenido.
- [[Estrategia de TikTok y Validación|Estrategia de TikTok y Validación]] — tracción del canal, plan de prueba de valor del juego.
- [[Deliberacion del Consejo - Ronda 9|Deliberación del Consejo — Ronda 9]] — transcripción completa de la sesión donde se replanteó (y revirtió) la decisión de genericar nombres canónicos.
- [[Deliberacion del Consejo - Ronda 10|Deliberación del Consejo — Ronda 10]] — dos preguntas cerradas para el abogado de IP: escala/viralidad y si TikTok es exposición legal separada del fangame.
- [[Deliberacion del Consejo - Ronda 11|Deliberación del Consejo — Ronda 11]] — respuesta completa del abogado sobre escala y TikTok; comparación con la wiki de Fandom; rechazo confirmado al "motor white-label".
- [[Deliberacion del Consejo - Ronda 12|Deliberación del Consejo — Ronda 12]] — auditoría de la regla de combinación/Beyonders: hueco abierto sobre la dirección de "Secuencia 5 para arriba" y otras brechas sin resolver.
- [[Deliberacion del Consejo - Ronda 13|Deliberación del Consejo — Ronda 13]] — misma regla, auditada con el skill `llm-council` (5 asesores + revisión cruzada + síntesis). Veredicto: implementable sin defecto estructural; pendiente confirmar si Avance/Ritual de avance se consumen y si están atados a un camino específico.
- [[Deliberacion del Consejo - Ronda 14|Deliberación del Consejo — Ronda 14]] — cómo debe estructurarse el vault para que una sesión de LLM futura lo navegue sin escanearlo completo. Resultado: [[../NAVIGATION|NAVIGATION.md]] en la raíz del vault.

## Convención mínima (no las reglas de AGENTS.md)

- Cada nota lleva `updated:` con la fecha de la última edición.
- Nuevas decisiones se agregan al final de [[Log]], no se reescribe el historial.
- Si una decisión cambia, se anota el cambio con fecha — no se borra la decisión anterior sin dejar rastro.
- **MUST:** cualquier archivo nuevo creado en `10-Project/` se agrega a la lista de "Contenido" de este mismo README, en la misma edición que crea el archivo — no después, no "cuando haya tiempo". Un archivo sin entrada aquí no existe para efectos de navegación. (Regla añadida 2026-07-31 después de encontrar que las Rondas 10 y 11 llevaban semanas sin listarse.)
