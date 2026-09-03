---
tags: [project, card-studio]
updated: 2026-09-02
---

# Pathway List Card

## Decisión

`Pathway List` es la variante itemizable de `Pathway Explanation`. Existe para
cuando el contenido no es un párrafo único, sino varias observaciones cortas
con ritmo de carrusel.

La carta anterior no cambia. Esta variante añade una lista semántica real, con
un título más compacto y separación vertical amplia entre observaciones.

## Contrato de contenido

- `type`: `Pathway List`.
- `pathway`: uno de los 22 pathways canónicos.
- `title`: encabezado breve; admite resaltado entre asteriscos como la carta
  anterior.
- `items`: entre 1 y 8 textos, uno por entrada, de hasta 180 caracteres cada
  uno.
- `backgroundImageUrl`: opcional; si falta, hereda el arte del pathway.
- `backgroundOpacity`: de 0 a 100.
- `fontSizes`: escala tipográfica general opcional.

En el editor se escribe un item por línea. La carta añade la numeración y no
guarda prefijos manuales dentro del texto.

## Tratamiento visual

- Exportación final: PNG de 960×1280.
- Título compacto, de menor presencia que el texto de los items.
- Cada item vive en su propio `li`, con índice `01`, `02`, etc., regla superior
  y espacio respirable entre entradas.
- El color y el fondo siguen siendo los del pathway elegido.
- Arrastrar una imagen al lienzo o cargarla desde el panel reemplaza el fondo
  solo de esa carta.

## Compatibilidad

El nuevo tipo está registrado en el esquema, editor, render estático, exportador
PNG, MCP y migración de `cards.db` (versión 16). `Pathway Explanation` sigue
disponible y no se convierte automáticamente.
