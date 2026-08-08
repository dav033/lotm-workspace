---
tags: [project, engineering, cards]
scope: out-of-ontology
updated: 2026-08-08
---

# Guía de pares de cartas

## Para qué sirve

Una asignación de personaje o artefacto puede necesitar algo más que la carta principal. El par de cartas separa el sujeto de la razón que lo respalda:

- `Character` o `Artifact` es la carta `subject`. Contiene el nombre, pathway, sequence y los datos propios del personaje o artefacto.
- `General Explanation` es la carta `explanation`. Guarda la evidencia, el mecanismo y los límites que explican la asignación.

La segunda carta no debe quedarse en una opinión. Debe dejar claro qué dato sostiene la lectura y qué parte sigue siendo interpretación.

## Cómo se usa en Card Studio

1. Abre una carta `Character` o `Artifact`.
2. Elige el pathway y la sequence concreta. Completa nombre, poder o grado y cualquier modificador necesario.
3. Pulsa `Create linked explanation` en el bloque `Assignment rationale`.
4. Card Studio conserva la carta original, le asigna un `pairId` y la marca como `subject`.
5. El editor crea una `General Explanation` justo después, con el mismo pathway, sequence y `backgroundOpacity`, y la abre para editarla.
6. Escribe un título y una explicación en inglés. Incluye el dato que justifica la asignación, cómo conecta con el pathway y qué límite tiene la lectura.

Si el par ya existe, el bloque muestra `Open linked explanation`. Desde la carta de explicación aparece `Open subject card`. Los botones solo cambian de carta; no crean duplicados.

## Cómo se guarda

Las dos cartas comparten un UUID en `pairId`. Cada una conserva su contenido normal y añade su rol:

```json
{
  "pairId": "same-uuid-in-both-cards",
  "pairRole": "subject"
}
```

La explicación usa el mismo `pairId` con `pairRole: "explanation"`. El vínculo vive dentro de `data_json`, así que no necesita una migración de SQLite. Si se borra una carta, la otra no se borra de forma automática; hay que retirar ambas si la asignación deja de ser útil.

## Cómo se usa desde MCP

Para crear un par nuevo en una sola operación, usa `save_card_pair`:

- `universe` y `part` indican dónde guardar las cartas.
- `subject` acepta una carta `Character` o `Artifact` completa.
- `explanation` acepta el contenido de la `General Explanation`, sin escribir manualmente `pairId` ni `pairRole`.

El servidor crea las dos cartas en orden, genera el UUID compartido y devuelve los roles en el resumen de cada carta. Para una carta que ya existe, el editor usa el enlace de Card Studio y conserva su ID.

## Regla editorial

La carta principal responde "a quién o a qué asignamos este lugar". La carta enlazada responde "por qué, según la evidencia disponible, esta asignación tiene sentido". Si no hay contenido suficiente para explicar el vínculo, se debe dejar la explicación pendiente en vez de rellenarla con una afirmación sin respaldo.
