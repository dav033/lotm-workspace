---
tags: [project, meta]
scope: out-of-ontology
updated: 2026-07-30
---

# 10-Project — Archivo de Misterios (juego + canal)

Esta carpeta es una **arquitectura paralela y deliberadamente separada** de todo lo demás en este vault.

## Por qué existe aparte

El resto del vault (`00-Inbox` a `06-Templates`, `Clippings`) está gobernado por las reglas de [[../AGENTS.md|AGENTS.md]]: solo conocimiento trazable sobre la novela *Lord of the Mysteries*, con modelo epistémico obligatorio (`canon` / `interpretation` / `theory` / `fanon`), evidencia directa por fuente, y un contrato de carpetas estricto.

Nada de lo que vive en `10-Project/` es lore de la novela. Es el registro de un proyecto real: un canal de TikTok de contenido sobre LOTM y un juego web de combinación de conceptos ("Archivo de Misterios") ambientado en ese universo, hecho como fanmade.

**Reglas de `AGENTS.md` que NO aplican aquí:** modelo epistémico, evidencia por fuente, inmutabilidad de fuentes, frontmatter obligatorio de tipo/status/spoilers, folder contract, hard completion gate. Ninguna nota de esta carpeta necesita `status: canon` ni citas — son decisiones de negocio/ingeniería, no afirmaciones sobre el canon de la novela.

**Por qué comparten vault:** el juego y el canal se alimentan directamente del trabajo de lore de `02-Wiki` (nombres, Secuencias, Rutas de Beyonder) y del pipeline de contenido de `03-Content/TikTok Content`, así que tiene sentido que vivan cerca y sean enlazables, aunque las reglas que los gobiernan sean distintas.

## Contenido

- [[Log|Log de decisiones]] — registro cronológico de decisiones de proyecto, sesión por sesión.
- [[IP y Riesgo Legal|IP y Riesgo Legal]] — investigación de derechos, fecha ancla, plan de contingencia.
- [[Arquitectura del Juego|Arquitectura del Juego]] — stack técnico, decisiones de diseño de datos, estado actual del código.
- [[Estrategia de TikTok y Validación|Estrategia de TikTok y Validación]] — tracción del canal, plan de prueba de valor del juego.
- [[Deliberacion del Consejo - Ronda 9|Deliberación del Consejo — Ronda 9]] — transcripción completa de la sesión donde se replanteó (y revirtió) la decisión de genericar nombres canónicos.

## Convención mínima (no las reglas de AGENTS.md)

- Cada nota lleva `updated:` con la fecha de la última edición.
- Nuevas decisiones se agregan al final de [[Log]], no se reescribe el historial.
- Si una decisión cambia, se anota el cambio con fecha — no se borra la decisión anterior sin dejar rastro.
