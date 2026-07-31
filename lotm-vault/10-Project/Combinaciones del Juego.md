---
tags: [project, game, content]
scope: out-of-ontology
updated: 2026-07-31
---

# Combinaciones del Juego — Secuencia 9 por camino

Registro de trabajo de todas las combinaciones Concepto + Concepto → Beyonder de Secuencia 9, camino por camino, grupo por grupo. Ver [[Arquitectura del Juego]] para la regla de diseño completa (por qué Secuencia 9 es el único punto de entrada por combinación directa, Avances, Rituales de avance, Avances ocultos).

## Metodología (no releer cada vez, aplicar)

- Nombrar los conceptos con las palabras que la propia fuente (`02-Wiki`) usa para los poderes explícitos de cada Sequence 9 — **no** etiquetas temáticas abstraídas. El primer intento con Seer falló tres veces seguidas por abstraer (Ojo+Destino, Espíritu+Presagio, Mente+Espíritu) antes de llegar a Adivinación+Percepción, que sale directo de los poderes nombrados.
- Ni muy abstracto (aplica a cualquier personaje, no distingue nada) ni muy específico (sirve para un solo uso y no se puede reutilizar en otra combinación). Ejemplos rechazados por muy específico: "Gesto" (Visionary), "Valor" (Bard), "Escama" (Sailor, además sonaba a monstruo marino en vez de marinero).
- Un concepto **se reutiliza a propósito** entre caminos distintos cuando el poder real coincide (ver [[Arquitectura del Juego]], principio de contenido: evitar elementos intermedios de un solo uso). No es error, es la regla.
- Poderes de apoyo genéricos y compartidos entre varios caminos del mismo grupo (Ritualistic Magic, Physical Enhancement, etc.) quedan fuera de la combinación — no distinguen a ese Sequence 9 en particular.
- **Un concepto nunca nombra una categoría de criatura/monstruo** (ej. "No-muerto", "Bestia", "Espectro" como tipo). Objeto/habilidad + tipo-de-criatura lee como receta para invocar o crear ese monstruo, no como los ingredientes de un Beyonder humano — error real detectado en Corpse Collector (Cadáver+No-muerto, corregido a Cadáver+Conocimiento) y ya antes con Sailor (Agua+Escama sonaba a monstruo marino). Un concepto válido es habilidad, objeto, lugar/contexto, o estado abstracto — nunca un ser.
- **Los dos conceptos deben cubrir dos poderes distintos, no el mismo poder dicho dos veces.** Error real en Sleepless (Noche + Oscuridad — ambos son básicamente "es de noche", ninguno agrega algo que el otro no dijera). Corregido a Noche + Fuerza, usando lo que la fuente nombra explícitamente que se fortalece ("physical strength, intuition, and mental capabilities"). Antes de proponer, verificar que cada concepto de la pareja apunte a un poder/efecto distinto.
- **Si una combinación se siente floja o poco representativa, sospechar primero de la fuente, no solo de la elección de palabras.** Algunas notas de `02-Wiki/.../Sequences/9 - *.md` son mucho más escuetas que otras (Assassin y Hunter en Calamity of Destruction solo listaban 2-3 poderes genéricos, contra 4-5 específicos en otros grupos). Antes de forzar un concepto sobre una nota corta, revisar si existe un dossier más completo en `01-Sources` (ej. `Calamity of Destruction - Research Dossier`, con tabla "Powers by Sequence" mucho más rica) — puede tener la lista de poderes real que la nota de Secuencia todavía no volcó.
- No se define en esta etapa: cómo se obtienen los Conceptos (sus propias recetas) ni si son elementos iniciales. Eso viene después.

## Conceptos ya usados (para reutilizar, no reinventar)

| Concepto | Slug | Usado en |
|---|---|---|
| Adivinación | `adivinacion` | Seer |
| Percepción | `percepcion` | Seer, Marauder, Secrets Suppliant |
| Apertura | `apertura` | Apprentice |
| Puerta | `puerta` | Apprentice |
| Moneda | `moneda` | Marauder |
| Análisis | `analisis` | Spectator |
| Visión | `vision` | Spectator |
| Mar | `mar` | Sailor |
| Equilibrio | `equilibrio` | Sailor |
| Libro | `libro` | Reader |
| Conocimiento | `conocimiento` | Reader, Corpse Collector |
| Canción | `cancion` | Bard |
| Potencia | `potencia` | Bard |
| Secreto | `secreto` | Secrets Suppliant |
| Noche | `noche` | Sleepless |
| Oscuridad | `oscuridad` | — (creado, sin usar — disponible para otro grupo) |
| Cadáver | `cadaver` | Corpse Collector |
| Fuerza | `fuerza` | Warrior, Sleepless |
| Muerte | `muerte` | Assassin |
| Trabajo | `trabajo` | Assassin |
| Terreno | `terreno` | Hunter |
| Rastro | `rastro` | Hunter |
| Combate | `combate` | Warrior |

## Registro maestro

| Grupo | Camino | Beyonder Seq. 9 | Combinación | Estado |
|---|---|---|---|---|
| Lord of Mysteries | Fool | Seer | Adivinación + Percepción | ✅ Sembrado |
| Lord of Mysteries | Door | Apprentice | Apertura + Puerta | ✅ Sembrado |
| Lord of Mysteries | Error | Marauder | Moneda + Percepción | ✅ Sembrado |
| God Almighty | Visionary | Spectator | Análisis + Visión | ✅ Sembrado |
| God Almighty | Tyrant | Sailor | Mar + Equilibrio | ✅ Sembrado |
| God Almighty | White Tower | Reader | Libro + Conocimiento | ✅ Sembrado |
| God Almighty | Sun | Bard | Canción + Potencia | ✅ Sembrado |
| God Almighty | Hanged Man | Secrets Suppliant | Percepción + Secreto | ✅ Sembrado |
| Eternal Darkness | Darkness | Sleepless | Noche + Fuerza | ✅ Sembrado |
| Eternal Darkness | Death | Corpse Collector | Cadáver + Conocimiento | ✅ Sembrado |
| Eternal Darkness | Twilight Giant | Warrior | Fuerza + Combate | ✅ Sembrado |
| Calamity of Destruction | Demoness | Assassin | Muerte + Trabajo | ✅ Sembrado |
| Calamity of Destruction | Red Priest | Hunter | Terreno + Rastro | ✅ Sembrado |
| Demon of Knowledge | — | — | — | ⬜ Sin empezar |
| Key of Light | — | — | — | ⬜ Sin empezar |
| Father of Devils | — | — | — | ⬜ Sin empezar |
| Goddess of Origin | — | — | — | ⬜ Sin empezar |
| The Anarchy | — | — | — | ⬜ Sin empezar |

## Detalle por grupo

### Lord of Mysteries Group ([[02-Wiki/Pathways/Standard-Pathways/01-Lord-of-Mysteries/Lord of Mysteries Group|fuente]])

| Camino | Beyonder Seq. 9 | Concepto + Concepto | Por qué |
|---|---|---|---|
| Fool | Seer | **Adivinación** + **Percepción** | Adivinación cubre Divination Arts (adivinación por sueños, astrología, numerología, scrying) y Danger Intuition (intuir peligro sin identificarlo, una forma de adivinación). Percepción cubre Spirit Vision (percibir fantasmas, almas, auras — explícitamente NO visión física ordinaria). |
| Door | Apprentice | **Apertura** + **Puerta** | Apertura es el verbo que unifica Door Opening, Lock Opening y Localized Opening. Puerta es el objeto/símbolo sobre el que actúa — la fuente lo nombra literalmente como el concepto rector del camino. |
| Error | Marauder | **Moneda** + **Percepción** | Moneda representa lo que Superior Observation detecta (objetos valiosos en 10 metros, incluyendo un objetivo oculto por lo que carga). Percepción reutilizado a propósito. |

Fuera de la combinación: Ritualistic Magic, Agile Hands, Physical Enhancement, Short-Weapon Proficiency.

### God Almighty Group ([[02-Wiki/Pathways/Standard-Pathways/02-God-Almighty/God Almighty Group|fuente]])

| Camino | Beyonder Seq. 9 | Concepto + Concepto | Por qué |
|---|---|---|---|
| Visionary | Spectator | **Análisis** + **Visión** | Enhanced Mental Attributes es capacidad inferencial/analítica (Análisis). Enhanced Vision y Body Language Analysis dependen de agudeza visual aplicada a leer personas (Visión). |
| Tyrant | Sailor | **Mar** + **Equilibrio** | Aquatic Affinity da el contexto marítimo (Mar, no Agua — evita sonar a monstruo acuático genérico). Balance es un poder nombrado aparte y explícito, lo que distingue a un Sailor de una criatura marina cualquiera. |
| White Tower | Reader | **Libro** + **Conocimiento** | Reading es la habilidad que da nombre al Beyonder (Libro). Knowledge Addiction es deseo de Conocimiento — la Autoridad futura del camino es "Omniscience". |
| Sun | Bard | **Canción** + **Potencia** | Singing es el poder que define al Bard (Canción). Sus efectos son todos de refuerzo — Potencia los cubre a todos en vez de fijarse en uno solo. |
| Hanged Man | Secrets Suppliant | **Percepción** + **Secreto** | High Spirituality/Spiritual Perception detecta existencias misteriosas y auras (Percepción). Knowledge (Mysticism) son nombres secretos y siniestros que distorsionan la mente (Secreto). |

Fuera de la combinación: Ritualistic Magic, Physical Enhancement.

### Eternal Darkness Group ([[02-Wiki/Pathways/Standard-Pathways/03-Eternal-Darkness/Eternal Darkness Group|fuente]])

| Camino | Beyonder Seq. 9 | Concepto + Concepto | Por qué |
|---|---|---|---|
| Darkness | Sleepless | **Noche** + **Fuerza** | Nocturnality: se vuelve más fuerte cuanto más entrada la noche (Noche). La propia fuente nombra qué se fortalece: "physical strength, intuition, and mental capabilities" (Fuerza, reutilizado de Warrior). Se descartó Oscuridad por redundante con Noche — ambos decían casi lo mismo en vez de cubrir dos poderes distintos. |
| Death | Corpse Collector | **Cadáver** + **Conocimiento** | El nombre del Beyonder y la resistencia a frío/descomposición/corrosión de auras cadavéricas (Cadáver). Knowledge (Undead) es su única habilidad realmente distintiva — Conocimiento, no "No-muerto": ese primer intento nombraba una categoría de criatura, no la habilidad. Objeto+criatura suena a receta de monstruo reanimado, no a Beyonder humano (mismo error que Agua+Escama con Sailor). Conocimiento reutilizado de Reader. Spirit Vision/Spirituality quedó fuera por ser versión débil y genérica, compartida con Sleepless. |
| Twilight Giant | Warrior | **Fuerza** + **Combate** | Physical Enhancement (Fuerza) y Combat Mastery — dominio de toda arma, armadura y arte marcial (Combate) — son los únicos dos poderes de este Sequence 9. |

### Calamity of Destruction Group ([[02-Wiki/Pathways/Standard-Pathways/04-Calamity-of-Destruction/Calamity of Destruction Group|fuente]])

Grupo donde la nota individual de Secuencia 9 (`02-Wiki/.../Sequences/9 - *.md`) resultó demasiado escueta para dar combinaciones representativas — hubo que ir a la fuente más rica, [[01-Sources/Calamity of Destruction - Research Dossier|Calamity of Destruction - Research Dossier]], que trae una tabla "Powers by Sequence" con mucho más detalle que la nota individual. **Lección: si una combinación se siente floja, revisar si existe un dossier de investigación más completo en `01-Sources` antes de forzar algo con la nota corta.**

| Camino | Beyonder Seq. 9 | Concepto + Concepto | Por qué |
|---|---|---|---|
| Demoness | Assassin | **Muerte** + **Trabajo** | El dossier resume el core power de Assassin como "intervención letal oculta" — de humano entrenado a "depredador sobrenatural de corto alcance". Decisión final del usuario, priorizando el ángulo de "la muerte como oficio/contrato" sobre lecturas más literales de la lista de poderes (Sombra+Agilidad, Sombra+Veneno, ambas descartadas antes de esta). |
| Red Priest | Hunter | **Terreno** + **Rastro** | El propio dossier resume a Hunter en su tabla de evolución interna con dos verbos: "prepare terrain and identify prey". Terreno cubre terrain memorization/spatial positioning/preparación del campo; Rastro cubre tracking/danger intuition — literal de esa síntesis, no de la nota corta. |

## Sembrado en el sistema real

Cada grupo confirmado se siembra en producción (Supabase, vía script de un solo uso sobre el mecanismo SSH/Prisma ya establecido) el mismo día que se confirma en este archivo: 1 Category por grupo, N Pathways, elementos Concepto (nuevos o reutilizados por slug), elementos Beyonder, Sequences (número 9), Recipes con sus RecipeIngredient/RecipeOutput. Los scripts no quedan guardados en ningún repo — son de un solo uso, el resultado vive en la base de datos y en este archivo.
