---
type: production-guide
status: active
spoilers: major
---

# Card MCP Usage Guide

This guide documents the presentation layer used by the `lotm` MCP. It governs how to choose card formats and assemble projects; it does not replace the evidence, ontology, or spoiler rules of the vault.

## Standard workflow

1. Read the relevant `02-Wiki/` notes and their direct `01-Sources/` links. Do not write factual cards from memory or from an existing content draft.
2. Call `list_card_library` before creating anything. Reuse the established universe and part when they already exist.
3. Plan the narrative order and choose a card format for the information structure, not for visual novelty alone.
4. Use `save_card_batch` to create the ordered batch. A batch may contain up to 100 cards.
5. For a custom or local image, call `save_card_image` first and place its returned `/api/cards/images/...` path in the relevant image field.
6. Use `update_card` for revisions and `move_cards` for reordering or regrouping. Moving preserves ids; deletion and recreation do not.
7. Call `list_card_library` again to verify content, positions, universe, and part.
8. Use `export_cards_zip` only after the content and order are verified. The export produces 960×1280 PNG cards and a manifest.

## Shared image rules

- Image fields accept only an `http(s)` URL or a public path beginning with `/`.
- Binary data never belongs inside card JSON.
- `backgroundOpacity` ranges from `0` to `100`; the default is `65`.
- A custom background overrides a Pathway-provided background.
- Background art supports the hierarchy. It must not reduce contrast or become the primary source of meaning.

## Card type selection

| Type | Use it for | Required structure | Avoid it when |
| --- | --- | --- | --- |
| `Character` | Collectible-style identity with Pathway and Sequence data | `name`, `pathway`, `sequence`, `power` | The card needs an argument, explanation, or character analysis |
| `Artifact` | Collectible-style artifact with Pathway association | `name`, `pathway`, `sequence`, `grade` | The artifact needs several effects or limitations explained |
| `Cover` | Legacy split-image crossover cover | `title`, `partNumber` | A single full-bleed image can do the job more clearly |
| `Full Image Cover` | Full-bleed project or part cover | `title`; optional `imageUrl` | The first card must also teach the central thesis |
| `Tier` | A ranked Pathway or Sequence with supporting points | `pathway`, `rank`, `points`; optional `sequence` | There is no explicit ranking criterion |
| `Pathway` | Unranked Pathway or Sequence explanation in bullet form | `pathway`, `points`; optional `sequence` | The content is an ontology map or a single does/doesn't distinction |
| `Tier Explanation` | Definition of one tier before its ranked cards | `rank`, short `description` | Explaining a Pathway concept rather than a ranking scale |
| `General Explanation` | Nuance, caveat, bridge, or contextual paragraph | `title`, `description`; optional `pathway` | The information is naturally row-based or needs explicit contrasts |
| `Pathway Explanation` | Intellectual cover and one-sentence thesis for a Pathway part | `pathway`, `title`, `description` | Used repeatedly inside one part or for dense reference data |
| `Breakdown` | One concept with scope and boundary | `title`, `does`, `doesNot`, `edgeText` | Recipes, long lists, timelines, or several unrelated concepts |
| `Map` | Ontology, progression, comparison, reference rows, or structured recap | `title`, 1–8 `entries` | A single emotional or argumentative point needs visual dominance |
| `Tarot Member` | Character analysis with deliberate visual variety | `variant`, `name`, `tarotTitle`, `description`, `detailText` | Recording Sequence statistics or explaining a non-character concept |

## Practical field limits

### Structured explanatory cards

- `Pathway Explanation`: title up to 100 characters; description up to 240. Wrap one key word or phrase in `*asterisks*` to apply the Pathway accent.
- `General Explanation`: title up to 100; description up to 800.
- `Breakdown`: optional kicker up to 40; title up to 60; `does`, `doesNot`, and `edgeText` up to 240 each; `edgeLabel` up to 20.
- `Map`: title up to 100; 1–8 rows; each row has `tags` up to 120 and `value` up to 120; optional footer up to 160.
- `Tier` and `Pathway`: up to 14 points; each point up to 180; optional footer up to 240.

### Tarot Member compositions

- `Portrait`: lead with the portrait and identity. Best for a clean introduction or emotionally recognizable character.
- `Dossier`: present the person as a classified file. Best for secretive, institutional, investigative, or politically complicated characters.
- `Contrast`: divide perception from reality. Best for masks, mistaken reputations, double identities, and internal/external comedy.

Shared limits: name up to 80; Tarot title up to 40; description up to 360; secondary label up to 36; secondary text up to 280; footer up to 180. An optional `pathway` supplies the accent and fallback art.

## Narrative functions

Every format should perform one narrative job. In comedy-first projects, the format may impersonate an everyday object: a Reddit thread, safety notice, bug report, job brochure, product review, or terms-and-conditions page.

| Narrative job | Preferred type |
| --- | --- |
| Stop the scroll | `Full Image Cover` or one `Pathway Explanation` |
| State the funny but defensible thesis | `Pathway Explanation` |
| Fake a Reddit thread or customer reviews | `Map` with OP/reply/note/verdict rows |
| Present benefits, hazards, or patch notes | `Map` |
| Explain a feature and its fine print | `Breakdown` |
| Deliver a Community Note, warning, or legal notice | `General Explanation` |
| Show increasingly alarming promotions across Sequences | `Map` |
| Explain why a ranking exists | `Tier Explanation` |
| Deliver the ranked judgment | `Tier` |
| Describe a character | `Tarot Member` |
| End with a verdict or callback | `Map` or short `General Explanation` |

## Comedy compositions

These compositions use the existing schema; they are not additional card types.

| Fictional format | Recommended sequence | Best use |
| --- | --- | --- |
| Reddit argument | `Pathway Explanation` → `Map` → `General Explanation` | Hot take, replies, correction, verdict |
| Bug report | `General Explanation` → `Breakdown` → `Map` | Trigger, exploit, affected system, failed fix |
| Career brochure | `Pathway Explanation` → `Map` → `Breakdown` | Benefits, promotion ladder, hidden fees |
| Terms and conditions | `Breakdown` → `General Explanation` | Scope, resistance, ownership, conditional access |
| Safety training | `General Explanation` → `Map` → `Breakdown` | Methods, incident examples, failure modes |
| One-star reviews | `Map` → `General Explanation` | Consequences, counters, final judgment |

Give each part one dominant fictional format. Do not reuse the same card order for every installment merely because it exported cleanly once.

## Writing rules for cards

- Use English for published cards unless a project explicitly establishes another language.
- Make the Pathway itself generate the joke. Do not bolt a generic meme onto an encyclopedia paragraph.
- A card should move through comic premise → real mechanic → consequence → fine print.
- The punchline must depend on the factual mechanism; otherwise it is replaceable filler.
- State what an effect does, what it does not establish, and which condition limits it, but phrase the correction like a Community Note, warning label, review, or hostile disclaimer when the format allows it.
- Use one recurring gag per part and escalate it with the lore. Do not repeat an identical reaction line.
- Prefer one strong idea per card. If the title requires “and” more than once, the material probably needs another card.
- Use precise scope: `partial`, `conditional`, `Pathway-level`, `group-level`, or `Sequence-specific` when the source requires it.
- Do not use `canon`, `confirmed`, or equivalent certainty when the underlying wiki note is an interpretation or theory.
- Do not invent quotes, scenes, character behavior, or Power scope to make a joke land.

## MCP project organization

- Universe: one durable subject or series.
- Part: one publishable carousel or one coherent installment.
- Card position: the actual viewing order.
- Part descriptions should state the educational question, spoiler scope, and distinctions the cards must preserve.

For Pathway projects, use `Lord of Mysteries — <Pathway> Pathway` and name each part `<Pathway> — <Theme>`. The detailed narrative template is in [[Pathway Explainer Framework]].

## Extending the card schema

Adding a type requires coordinated changes. A partial implementation may save successfully but fail in the editor or exporter.

1. Define and add the strict schema to the discriminated union.
2. Add the builder-state fields and both conversion directions.
3. Create the visual component and its fixed 480×640 styling.
4. Add the type to the editor selector and its editing controls.
5. Add live-preview and interactive-preview branches.
6. Add the static export renderer and image resolution.
7. Add the type to repository migration allowlists.
8. Update the MCP tool description.
9. Test validation, round-trip conversion, all visual variants, and static export.
10. Restart the MCP process so the exposed input schema includes the new discriminator.

## Verification checklist

- The card exists in the intended universe and part.
- Its position matches the narrative plan.
- Every required field survives a list/read round trip.
- Long text is condensed rather than silently truncated.
- The image is a reference, never inline binary data.
- The selected format matches the information structure.
- A boundary card appears wherever readers could confuse a Power with an Authority or a Pathway expression with group-level ownership.
- The exported PNG remains legible at phone size.
