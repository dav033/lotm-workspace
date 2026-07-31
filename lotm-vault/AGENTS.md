# Maintenance Rules - LOTM Wiki

This vault stores traceable knowledge about *Lord of the Mysteries*. These rules are mandatory.

## Normative language

- `MUST` and `MUST NOT` are hard requirements.
- `SHOULD` is a requirement unless a written exception exists in [[Pending Review]].
- A change that violates a `MUST` rule is incomplete and MUST NOT be logged as closed.
- Existing violations do not permit new violations. A touched note MUST leave the change compliant.

## Folder contract

- `00-Inbox/`: unclassified material only. Nothing here establishes canon.
- `01-Sources/`: processed source notes. Source bodies are immutable after ingestion.
- `02-Wiki/`: published knowledge notes only. Drafts and unresolved placeholders are forbidden.
- `03-Content/`: content drafts derived from `02-Wiki/`; never an evidence source.
- `04-Indexes/`: navigation and audited counts. Indexes MUST reflect the current vault.
- `05-Review/`: explicit debt, uncertainty, conflicts, deprecated nodes, and blocked work.
- `06-Templates/`: scaffolds only. Template placeholders are forbidden outside this folder.

## Status model

### Knowledge notes

Every factual or analytical note in `02-Wiki/` MUST use exactly one epistemic `status`:

- `canon`: directly supported by at least one linked `official/high` source note.
- `interpretation`: supported synthesis that is not established by an `official/high` source note.
- `theory`: speculative conclusion with incomplete evidence.
- `fanon`: community-created material that is not canon.

`active`, `partial`, `pending`, `draft`, and `deprecated` are forbidden as epistemic statuses on knowledge notes. Use an optional `workflow-status` instead:

- `draft`
- `active`
- `partial`
- `review-required`
- `complete`
- `deprecated`

### Infrastructure and source notes

- Indexes, frameworks, registries, and review indexes MAY use `status: active` or `status: deprecated`.
- Source notes MAY use `status: pending`, `status: active`, or `status: deprecated`.
- Deprecated nodes in `05-Review/` MUST use `status: deprecated` and link their replacement.
- Templates MAY contain `REQUIRED` placeholders. No other folder may contain `REQUIRED`, `to-define`, or an empty mandatory value.

## Evidence model

- Every relevant claim MUST have a direct `source` or `sources` link to `01-Sources/`.
- A transitive link through another wiki note, map, index, Sefirah, or Great Old One does not count as evidence.
- `status: canon` requires `source-confidence: explicit-canon` and at least one direct source with `provenance: official` and `reliability: high`.
- If no direct `official/high` source exists, the note MUST NOT use `canon`, `explicit-canon`, `confirmed`, `canonical`, or equivalent certainty language.
- Unofficial sources MUST NOT establish canon, even when their bodies cite official material. Their official citations are verification targets until separate official source notes are created.
- Conflicting official sources MUST be preserved, compared, and recorded in `05-Review/`; do not silently choose one.

Allowed `source-confidence` values:

- `explicit-canon`: direct official/high evidence.
- `strong-inference`: repeated official evidence supports the conclusion, but does not state it directly.
- `probable-interpretation`: plausible synthesis with incomplete direct support.
- `medium-secondary`: supported only by unofficial or medium-reliability material.
- `speculation`: hypothesis retained for review.

Required status mapping:

| Source confidence | Allowed epistemic status |
| --- | --- |
| `explicit-canon` | `canon` |
| `strong-inference` | `interpretation` |
| `probable-interpretation` | `interpretation` |
| `medium-secondary` | `interpretation` |
| `speculation` | `theory` |

## Mandatory frontmatter

Every knowledge note in `02-Wiki/` MUST include:

- `type`
- `status`
- `spoilers`
- `source` or `sources`
- `source-confidence`

Additional required fields by type:

- Pathway Group: `great-old-one`, `sefirah`, and `pathways` using Pathway Hubs.
- Pathway: `group`, `great-old-one`, `sefirah`, `sequence-9`, and `sequence-map-status`.
- Sequence: `pathway` using a Pathway Hub, `group`, and numeric `sequence`.
- Authority: `authority-level`, `pathway` or `pathways` using Pathway Hubs, and `great-old-one` when known.
- Symbolism: its owner through `pathway`, `group`, `great-old-one`, or `owner`, as applicable.
- Sefirah and Great Old One: `pathway-group` and `pathways` using Pathway Hubs.
- Map: the mapped `group`, `pathway`, or `great-old-one`, as applicable.

Every source note in `01-Sources/` MUST include:

- `type`
- `status`
- `provenance`: only `official` or `unofficial`
- `reliability`: only `high`, `medium`, or `low`
- `origin`
- `url`
- `access-date`
- `chapter` or an equally precise location
- `spoilers`

Missing metadata blocks ingestion. Never guess a value to satisfy the schema.

## Source immutability

- After ingestion, a source body MUST NOT be rewritten, deleted, translated over, shortened, or summarized in place.
- Frontmatter metadata MAY be added or corrected without altering the supplied body.
- A correction to source content MUST be a separate source note linked to the original.
- A source MUST NOT be upgraded to `official/high` without verifying the original publisher and exact URL.
- Generic home-page URLs are insufficient when a chapter, announcement, handbook page, or author post URL is available.

## Linking and graph integrity

- Internal links MUST use `[[Wiki Links]]`; internal Markdown paths are forbidden.
- Every basename MUST be unique across the vault. Qualify homonyms before creating the second note.
- Broken, unresolved, ambiguous, and accidental self-links are forbidden.
- Every `02-Wiki/` note MUST have at least one incoming link from a hub, map, index, or related note.
- A Pathway MUST always link to its `* Pathway` Hub.
- Every Pathway Hub in `02-Wiki/` MUST use the filename and note title `<Pathway Name> Pathway (disambiguation)`; all links to a Pathway Hub MUST use that disambiguated name.
- A Sequence 9 note such as `[[Seer]]`, `[[Reader]]`, or `[[Assassin]]` MUST NOT stand in for a Pathway.
- Fields named `pathway` or `pathways` MUST link only to Pathway Hubs.
- Sequence links are allowed only when referring to that actual Sequence, such as a Sequence list, power source, or progression map.
- Group Hubs MUST link their Sefirah, Great Old One, Pathway Hubs, and knowledge maps.
- Pathway Hubs MUST link their Group Hub, Sefirah, Great Old One, existing Sequences, and available maps.
- Sequence notes MUST link their Pathway Hub and Group Hub.
- Great Old One and Sefirah notes MUST link the same Group Hub and Pathway Hubs.
- Deprecated nodes MUST NOT receive new links.

## Ontology boundaries

- One note represents one entity, concept, event, Authority, Symbolism, Power, or state.
- Symbolism, Authority, domain, Power, application, and visual representation MUST remain separate node types.
- A Power, visual motif, spell effect, or operational domain MUST NOT be promoted to an Authority without evidence.
- A Pathway MUST NOT inherit every Symbolism or Authority of its Great Old One.
- Sefirah borrowing MUST be modeled as conditional access, never native Pathway ownership.
- Shared names across Pathways MUST be qualified when the underlying Authorities are distinct.
- Cross-group states such as [[Fourth Pillar]] MUST remain outside a single Great Old One hierarchy.

## Writing rules

- State facts, interpretations, and uncertainty separately.
- Use precise scope. Do not replace `partial`, `conditional`, or `pathway-specific` with unrestricted language.
- Do not write `confirmed`, `explicit`, `canonical`, or `proven` unless the note qualifies for `status: canon`.
- Do not fill gaps from memory, model knowledge, analogy, naming similarity, or thematic resemblance.
- Quotations MUST be short, attributed, and traceable to a source location.
- Translation differences MUST preserve the original term when they affect classification.
- Every unresolved claim MUST use explicit uncertainty language and appear in [[Pending Review]].

## Spoiler control

- Every knowledge and source note MUST have a non-empty `spoilers` value.
- `REQUIRED`, `to-define`, and blank spoiler values are forbidden outside `06-Templates/`.
- Later revelations MUST NOT be merged into a lower-spoiler note without raising its spoiler level.
- Content drafts MUST state their spoiler level before the first substantive paragraph.

## Ingestion workflow

1. Place unclassified material in `00-Inbox/`.
2. Verify origin, provenance, reliability, URL, access date, and precise location.
3. Create the source note from the source template.
4. Preserve the supplied source body unchanged.
5. Extract claims into existing notes before creating new nodes.
6. Search the entire vault for duplicate names and equivalent concepts.
7. Create or update `02-Wiki/` notes with complete metadata and direct source links.
8. Add all required graph links.
9. Record every uncertainty, conflict, incomplete map, or missing Sequence in [[Pending Review]].
10. Update affected indexes and audited counts.
11. Add one concise entry to `log.md` describing evidence, structural changes, and remaining debt.
12. Run the hard completion gate.

## Review queue

- Every `interpretation` and `theory` note MUST be discoverable from [[Pending Review]].
- Every `workflow-status: partial` or `workflow-status: review-required` note MUST be listed or matched by an explicit query there.
- Every `sequence-map-status: pending` Pathway MUST appear in the incomplete Pathway queue.
- Any note containing `pending`, `unconfirmed`, `unresolved`, `uncertain`, `speculation`, or equivalent wording MUST be represented in the review queue.
- Review totals MUST count unique notes, not findings, links, or overlapping conditions.
- A resolved item MUST be removed or reclassified in the same change that resolves it.

## Authority research batch audit

Before reporting an Authority research batch as delivered:

1. Record the complete expected list using qualified note basenames, not display labels.
2. Search the Authority folder for every unqualified label and enumerate all homonyms, including Pathway variants outside the intended group.
3. Compare the expected list against the actual working-tree diff. Every expected note MUST have a content change or a written no-change reason.
4. Every researched note MUST contain Meaning, Expression in the Novels, Limits, Community Cross-check, and Sources sections unless a documented ontology reason requires another heading.
5. Verify direct source links, epistemic status, confidence, Pending Review coverage, source counts, indexes, and log entry.
6. Report expected, changed, deliberately excluded, and failed counts separately. A display-name match MUST NOT count as verification of a qualified note.

## Sequence note format

- Sequence filenames MUST use `N - Name.md`, and the H1 MUST use `# Sequence N - Name`. A documented translation alias MAY follow the primary name in parentheses.
- Use `## Explicit Powers`, never `## Extracted Ability Data`.
- `Explicit Powers` is a structural inventory label, not an epistemic claim; the certainty-language prohibition still applies to prose inside the section.
- Use `## Potion` for potion appearance, ingredients, and advancement ritual; do not use `## Advancement Data`.
- Optional sections follow this order when present: Description, Traits, Symbolism, Authorities, Explicit Powers, Strengthened Abilities, Mythical Creature Form, Authority → Power Mapping, Potion, Neighbouring Pathways, Notes, Sources.
- `## Sources` MUST be the final H2 section. Sequence 9 notes SHOULD contain Neighbouring Pathways. Other Sequences MUST NOT contain that navigation section.
- Bold labels inside an H2 section MAY identify individual Powers. Category labels such as New Abilities, Authorities, Strengthened Abilities, or Translation Note SHOULD use H3 headings.
- Raw HTML and tab-indented list nesting are forbidden in Sequence knowledge notes. Use Markdown and four-space indentation.
- Pathway frontmatter links SHOULD use the direct disambiguated Pathway Hub target without a display alias.
- Missing Advancement or Authority mapping evidence MUST be recorded in [[Pending Review]] and MUST NOT be filled from naming similarity or memory.

## Hard completion gate

A change or audit MUST NOT be described as `closed`, `complete`, `fixed`, or `clean` unless all checks below pass:

- Zero duplicate basenames.
- Zero broken or unresolved links.
- Zero ambiguous links.
- Zero accidental self-links.
- Zero orphan notes in `02-Wiki/`.
- Zero missing mandatory fields.
- Zero invalid enum values or template placeholders outside `06-Templates/`.
- Zero knowledge notes using workflow states as epistemic `status` values.
- Zero `canon` or `explicit-canon` claims without direct `official/high` evidence.
- Zero Sequence 9 links used as Pathway links.
- Zero untracked uncertainty or pending integration wording.
- Index counts equal the current filesystem counts.
- [[Pending Review]] totals equal its stated counting rule.
- All touched source bodies remain byte-for-byte unchanged.

If any check fails:

1. Keep the task open.
2. Record the exact violation in [[Pending Review]].
3. Report the task as partial, never closed.
4. Do not hide the failure by weakening a rule, deleting evidence, or changing counts manually.

## Content creation

- Content MUST use `02-Wiki/` as its factual base, never external memory alone.
- Content MUST preserve the source note's epistemic status and spoiler level.
- Interpretations and theories MUST be labeled in the published text.
- Drafts belong in `03-Content/` and MUST NOT be cited as sources.

## Forbidden actions

- Inventing facts, citations, chapter numbers, URLs, or metadata.
- Promoting a note to canon for convenience.
- Treating an index or another wiki note as evidence.
- Recreating a duplicate instead of updating the existing node.
- Deleting uncertainty instead of resolving it.
- Editing a source body to make it agree with the wiki.
- Closing an audit while known violations remain.
