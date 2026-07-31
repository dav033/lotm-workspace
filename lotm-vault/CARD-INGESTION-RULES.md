# Card Ingestion Rules — Clippings to LOTM Card Library

Governs how content from `Clippings/` is turned into cards via the `lotm` MCP server (`save_card_batch`, `move_cards`, `update_card`). Does not override `AGENTS.md`, which governs `02-Wiki/` knowledge notes; this file only governs the card library, a separate SQLite-backed presentation layer.

## Scope check before starting

1. Read the full source clipping in `Clippings/` before writing any card — never card from memory.
2. Identify exactly which section of the source the user asked for (e.g. "Advancement" vs "Abilities" of the same Pathway are separate clippings and separate ingestion passes).
3. Run `list_card_library` first to check whether the universe/part already exists and to match established naming conventions before inventing new ones.
4. If the universe, part, card-type mapping, or image handling is ambiguous, ask before starting. Once an ingestion batch begins, do not stop partway — finish every entry in the source section in one pass.

## Universe and part naming

- Each Pathway gets its own dedicated universe: `Lord of Mysteries — <Pathway> Pathway` (matches the existing `Lord of Mysteries — Error Pathway` precedent). The bare `Lord of Mysteries` universe is reserved for Door-era general content; do not add unrelated Pathways to it.
- Parts are named `<Pathway> — <Theme>` (e.g. `Justiciar — Advancement`). Use one part per source clipping unless the user asks for a thematic split.
- Card order within a part MUST follow the source document's order top to bottom (for Sequence content: 9 → 0, matching the source's own Sequence numbering).

## Card type selection

- **Map**: default choice for structured reference data per Sequence/entry (potion formulas, ability lists, stat-like breakdowns) — title + up to 8 labeled rows (`tags` + `value`).
- **Breakdown**: only for genuine concept/Authority explanations that fit a does / doesn't / edge shape. Do not force recipe or list data into this shape.
- **Pathway Explanation**: short one-line thesis cards, used sparingly, not per-Sequence.
- Never invent a card type outside the schema to fit content; instead condense the content to fit an existing type.

## Titles and numbering

- When content is Sequence-based, the card title MUST state the Sequence number explicitly: `Sequence <N>: <Name>`, numbered consistently from 9 down to 0 (or per the source's own range).

## Field-length discipline

- `Map.entries[].value` and similar constrained fields (80–240 chars depending on field) MUST be condensed, not truncated mid-word or left overflowing. Preserve every distinct fact (ingredient, quantity, condition) but tighten wording (drop filler words, use shorthand like `ml`, `g`, `+`) until it fits.
- Never silently drop a fact to make it fit — condense wording first; only omit a sub-detail if the source itself marks it "no data".
- Skip empty/"no data" sections from the source entirely rather than adding a placeholder row.

## Images

- Use the source clipping's own image URLs (e.g. `static.wikia.nocookie.net`) directly as `imageUrl` / `backgroundImageUrl`. No need to download and re-host via `save_card_image` unless the user supplies a custom/local image.

## Reorganizing later

- To split or regroup cards that already exist, use `move_cards` (preserves ids and content). Never delete and recreate cards to reorganize them.
