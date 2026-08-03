---
tags: [project, cards, rituals]
scope: out-of-ontology
updated: 2026-08-02
---

# Guía de cartas de ritual

Guía operativa para la colección `LOTM — Why Sequence 5 Rituals Work` y para
cualquier futura colección de rituales de avance.

## Propósito

Una carta explica por qué un ritual puede preparar al aspirante para la
Secuencia siguiente. No es una receta aislada ni una descripción de poderes:
conecta el acto, la presión de la poción y el principio que el nuevo poder
requiere.
La colección también abre con una slide metodológica que explica el marco y separa canon de interpretación.

## Contrato de contenido

Cada ritual usa una sola carta. Las variantes solo cambian la forma de leer la
misma información.

1. **Ritual function**: qué consigue el acto ritual y cómo orienta la
   asimilación. Debe incluir la condición canónica y, cuando corresponda, la
   función que se está interpretando.
2. **Potion pressure**: peligro, presión o reacción adversa durante la
   asimilación. Si no hay una reacción explícita localizada, decirlo sin
   inventar una.
3. **Sequence rehearsal**: qué poder o principio de la nueva Secuencia ensaya
   el ritual y por qué esa preparación tiene sentido.

El texto visible va en inglés. Debe ser corto, directo y legible en una slide.
No usar la palabra `backlash` en el texto visible. Usar `adverse reaction`,
`pressure`, `danger` o una formulación equivalente según el caso.

## Regla de evidencia

- `Canon`: el ritual, la reacción y el vínculo funcional están explícitos.
- `Mixed`: el ritual o la presión son canónicos, pero la función cosmológica
  se infiere de los poderes de la Secuencia.
- `Theory`: la lectura completa es una hipótesis y debe mostrar su límite en
  `uncertainty`.

Si el backlash/reacción adversa está descrito de forma explícita en la fuente,
la variante visual es `Pressure`. Si no está descrito, elegir entre `Chain`,
`Split`, `Casefile` y `Timeline`; `Pressure` no se usa solo para dramatizar.

## Guía visual

- Fondo casi negro, serif display para títulos y sans-serif clara para cuerpo.
- Acento del pathway en regla, números y etiquetas; la estructura debe seguir
  siendo visible sin depender del color.
- Exportación final: PNG de 960×1280.
- `Chain`: proceso vertical continuo; usa todo el alto libre cuando el texto no
  es denso.
- `Split`: función del ritual y ensayo de la Secuencia arriba; presión abajo.
- `Casefile`: nota de campo con las tres funciones separadas.
- `Pressure`: presión al frente; función y ensayo como notas secundarias.
- `Timeline`: antes, durante y después; la semántica sigue siendo función,
  presión y ensayo aunque la composición sea temporal.
- El modo `dense` compacta contenido largo. El modo `sparse` afina cartas muy
  breves. No fijar alturas por carta ni dejar un bloque corto pegado arriba con
  un vacío accidental abajo.

## Organización de la colección

La colección usa una sola sección principal llamada `Main`. No crear una parte
por pathway ni una parte separada para la portada. La portada ocupa la primera
posición y las cartas de ritual siguen en el orden editorial elegido.

El fondo temático se resuelve por metadata, igual que en las cartas de Tier.
`Ritual Logic`, `Tier` y `Pathway` toman por defecto el fondo público de su
pathway; por ejemplo, **Mysticism Magister** usa el fondo de **White Tower**.
La `General Explanation` de esta colección declara además la Secuencia 5 y
usa `/cartas/sequence-back/sequence-5.png`. La carta no debe guardar la URL a
mano; `backgroundImageUrl` queda reservado para un override excepcional. La
ruta interna del renderizador elimina el prefijo `/cartas` al leer los assets
locales.

La primera carta es una `Full Image Cover` dentro de `Main`:

- Título: **Why Sequence 5 Rituals Work**.
- Imagen: `/covers/sequence-2-c-b.png`, fondo místico azul ya existente en el
  proyecto.
- Tono: una tesis clara, misterio contenido y espacio visual suficiente para
  que el título respire.

La portada introduce el análisis; no repite ninguna carta de pathway. La segunda carta es una `General Explanation` titulada **Why Rituals Matter** y funciona como el gancho de entrada: debe abrir con una pregunta o tensión, explicar por qué importa el ritual y cerrar separando canon de interpretación. Puede tener más desarrollo que una carta de ritual, pero debe dividirse en bloques cortos y no convertirse en un muro de texto. La colección completa son diez cartas dentro de `Main`: una portada, una explicación metodológica y ocho rituales.

## Flujo de actualización

1. Investigar ritual, presión y poderes de la nueva Secuencia.
2. Redactar el contenido en el contrato de tres bloques.
3. Elegir la variante según evidencia, no según qué composición parezca más
   dramática.
4. Guardar o actualizar la carta live.
5. Exportar la colección completa y revisar que siga teniendo una sola sección `Main`, una portada,
   una explicación metodológica y una carta por ritual.
