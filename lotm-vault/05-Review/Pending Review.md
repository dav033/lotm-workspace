---
type: review-index
status: active
last-audited: 2026-07-29
spoilers: major
---

# Pending Review

## Summary

- 471 unique notes match at least one review condition.
- 471 knowledge notes use `status: interpretation` and remain discoverable through the query below.
- 0 knowledge notes use `status: canon`.
- 0 current notes use invalid epistemic workflow statuses.
- 0 current Pathway Hubs use `sequence-map-status: pending`.
- The current filesystem has 220 notes with `type: sequence`: 22 complete 10-note maps.

## Interpretation Queue

```query
path:"02-Wiki" [status:interpretation]
```

## Incomplete Pathway Progressions

```query
path:"02-Wiki/Pathways/Standard-Pathways" [type:pathway] [sequence-map-status:pending]
```

## Sequence Evidence Queue

All 220 Sequence notes remain interpretations. Their ability and Advancement inventories rely partly on unofficial/medium Fandom pages and require direct official/high verification before any canon promotion.

The Sequence format audit normalized all 220 titles, section names and order, Pathway frontmatter links, list indentation, H3 category labels, Authority mappings, and Sequence 9 navigation. The 33 previously missing mapping sections in Chained, Moon, Red Priest, and lower Justiciar notes use conservative `medium-secondary` mappings or state that no Authority is named; they require direct official/high verification.

Potion/Advancement evidence is now present in all 220 Sequence notes. The 160 newly integrated sections across 16 Pathways come from independently located Fandom Advancement pages captured through search indexing; direct page fetches returned HTTP 402 or timed out. The data remains `medium-secondary`, not canon.

```query
path:"02-Wiki/Pathways/Standard-Pathways" [type:sequence] [status:interpretation]
```

## Tracked Remaining Uncertainty

- [[Lord of Mysteries Group Counters]]: counter-relations from a Fandom source remain secondary and situation-dependent pending official/high verification.
- [[God Almighty Group Counters]]: counter-relations from a Fandom source remain secondary and situation-dependent pending official/high verification.
- [[Calamity of Destruction Group Counters]]: counter-relations from a Fandom source remain secondary and situation-dependent pending official/high verification.
- [[Eternal Darkness Group Counters]]: counter-relations from a Fandom source remain secondary and conditional on scale, contact, state, clues, occasion, or circumstances pending official/high verification.
- [[Demon of Knowledge Group Counters]]: counter-relations from a Fandom source remain secondary and conditional on dimension, persistence, backup count, state, clues, and circumstances pending official/high verification.
- [[The Anarchy Group Counters]]: counter-relations from a Fandom source remain secondary and conditional on dimension, authority interaction, and contractual scope pending official/high verification.
- [[Shared and Partial Authorities]]: shared and partial classifications remain secondary synthesis; the probable Order relation requires direct official/high verification.
- [[Symbolism to Authority Derivations]]: 85 mappings remain secondary or inferential; 30 Authorities remain deliberately unmapped pending better evidence and official author-post ingestion.
- [[Fool Pathway (disambiguation)]]: Sequence 9-0 Traits and ability details remain secondary where supported only by the Fandom inventory; Authority mappings retain their separately stated confidence.
- [[Lord of Mysteries Wiki - Error Pathway Advancement]], [[Lord of Mysteries Wiki - Door Pathway]], and [[Lord of Mysteries Wiki - Door Pathway Advancement]]: URLs were not independently fetched in the ingesting session (the fetch tool returned HTTP 402) and are inferred from the confirmed sibling `Door_Pathway/Advancement` and `<Name>_Pathway` link patterns evidenced elsewhere in the supplied dump. Direct verification is still required before treating these as fully confirmed medium-reliability sources.
- Potion/Advancement data added to all 10 Error and all 10 Door Sequence notes (Marauder–Error, Apprentice–Door) is sourced only from the unofficial Fandom Advancement pages above; no separate official Cuttlefish potion-formula post has been cross-checked for most Sequences, so `source-confidence: strong-inference` on these notes currently rests partly on unverified-URL sources pending the item above.
- [[Lord of Mysteries Wiki - Visionary Pathway Advancement]] and [[Lord of Mysteries Wiki - Sun Pathway Advancement]]: same unverified-`/Advancement`-URL gap as the Error/Door Advancement sources above; the `/Abilities` URLs for both are directly evidenced in the supplied dump (Potion Formula ingredient links), but the `/Advancement` suffix is pattern-inferred and not independently fetched.
- [[Lord of Mysteries Wiki - Fool Pathway Advancement]], [[Lord of Mysteries Wiki - Tyrant Pathway Advancement]], [[Lord of Mysteries Wiki - White Tower Pathway Advancement]], [[Lord of Mysteries Wiki - Hanged Man Pathway Advancement]], [[Lord of Mysteries Wiki - Darkness Pathway Advancement]], [[Lord of Mysteries Wiki - Death Pathway Advancement]], [[Lord of Mysteries Wiki - Twilight Giant Pathway Advancement]], [[Lord of Mysteries Wiki - Demoness Pathway Advancement]], [[Lord of Mysteries Wiki - Red Priest Pathway Advancement]], [[Lord of Mysteries Wiki - Hermit Pathway Advancement]], [[Lord of Mysteries Wiki - Paragon Pathway Advancement]], [[Lord of Mysteries Wiki - Wheel of Fortune Pathway Advancement]], [[Lord of Mysteries Wiki - Abyss Pathway Advancement]], [[Lord of Mysteries Wiki - Mother Pathway Advancement]], [[Lord of Mysteries Wiki - Black Emperor Pathway Advancement]], and [[Lord of Mysteries Wiki - Justiciar Pathway Advancement]]: all ten Sequence sections were located through web-indexed Fandom results and integrated, but direct page access was blocked. Their embedded novel and author-post citations remain verification targets until separate official/high source notes are ingested.
- [[Web Research - Advancement Original Source Candidates - 2026-07-29]]: exact original WeChat URL candidates were located for 15 of these 16 Pathways. Wheel of Fortune has two posts and conflicting archived dates; Fool has no dedicated formula post in the indexed author archive and requires chapter-by-chapter verification. Direct `mp.weixin.qq.com` inspection was rejected by browser security policy, so none of these candidates qualifies as a separately verified `official/high` source yet.
- [[Visionary Pathway (disambiguation)|Visionary Pathway]] and [[Sun Pathway (disambiguation)|Sun Pathway]]: brought from `sequence-map-status: pending` (Sequence 9 stub only) to `complete` (all 10 Sequences) this session using only Fandom sources at `medium-secondary` confidence; no official Cuttlefish WeChat post was separately ingested for either Pathway because its exact URL was not supplied or fetchable, so both Pathways remain fully at `interpretation` status with no `strong-inference` upgrade path yet available. Their Authority notes (e.g. [[Discernment (Visionary)]], [[Holiness (Sun)]]) were pre-existing stubs sourced from the aggregate [[Lord of Mysteries Wiki - God Almighty Symbols, Authorities and Abilities]] page; the new per-Sequence mappings added this session have not been cross-checked against that aggregate page for consistency.
- [[Lord of Mysteries Wiki - Abyss Pathway Abilities]], [[Lord of Mysteries Wiki - Black Emperor Pathway Abilities]], [[Lord of Mysteries Wiki - Darkness Pathway Abilities]], [[Lord of Mysteries Wiki - Death Pathway Abilities]], [[Lord of Mysteries Wiki - Demoness Pathway Abilities]], [[Lord of Mysteries Wiki - Hanged Man Pathway Abilities]], [[Lord of Mysteries Wiki - Hermit Pathway Abilities]], [[Lord of Mysteries Wiki - Justiciar Pathway Abilities]], [[Lord of Mysteries Wiki - Mother Pathway Abilities]], [[Lord of Mysteries Wiki - Paragon Pathway Abilities]], [[Lord of Mysteries Wiki - Red Priest Pathway Abilities]], [[Lord of Mysteries Wiki - Twilight Giant Pathway Abilities]], [[Lord of Mysteries Wiki - Tyrant Pathway Abilities]], [[Lord of Mysteries Wiki - Wheel of Fortune Pathway Abilities]], and [[Lord of Mysteries Wiki - White Tower Pathway Abilities]] are unofficial/medium inventories; their embedded official citations remain verification targets rather than direct official evidence.
- [[Lord of Mysteries Wiki - Demoness Pathway Abilities]] omits the Sequence 6 heading. The extracted [[6 - Pleasure|Pleasure]] boundary follows the supplied body between Witch and Affliction, but the source anomaly remains preserved for review.
- [[4 - Cataclysmic Interrer|Cataclysmic Interrer]] preserves the Sequence name supplied by the Tyrant clipping; the unusual spelling requires verification against an official/high source before correction.
- [[0 - Chained|Chained]]: the supplied Advancement capture leaves the first Sequence 0 main ingredient blank. It is retained as a source anomaly and is not inferred in the knowledge note.
- [[Degeneration (Abyss)]], [[Filth (Abyss)]], [[Corruption (Abyss)]], [[Desire (Abyss)]], [[Curses (Abyss)]], [[Deviants (Abyss)]], [[Binding (Chained)]], [[Curses (Chained)]], [[Deviants (Chained)]], and [[Objects (Chained)]]: first 10-Authority research batch now distinguishes indexed novel manifestations, archived author-supplement scope, and Reddit interpretation. Exact chapter text and original Chained WeChat URL were not independently inspected, so all ten remain `interpretation` / `medium-secondary`; [[Reddit - Father of Devils Authority Discussions]] is explicitly non-canonical.
- [[Degeneration (Hanged Man)]]: homonym audit correction now distinguishes internal self-corruption from the environment-producing [[Degeneration (Abyss)]], adds Sequence 4-0 manifestations, and records limitations. Exact chapter text and the original Secrets Suppliant author post were not independently inspected, so the note remains `interpretation` / `medium-secondary`; [[Reddit - Hanged Man Degeneration Discussions]] is non-canonical.
- Authority research batch 2 audited exactly ten targets: [[Fooling]], [[Grafting and Reassembly]], [[Miracles (Fool)]], [[Transformation (Fool)]], [[History (Fool)]], [[Fate (Fool)]], [[Anchor of Destiny (Fool)]], [[Error (Authority)]], [[Deceit (Error)]], and [[Time (Error)]]. Nine now use direct exact-URL `official/high` Cuttlefish evidence and qualify as `canon` / `explicit-canon`. [[Fate (Fool)]] remains `interpretation` / `probable-interpretation` because evidence establishes only a restricted jurisdiction. The former `Change (Fool)` node was deprecated: the author names Transformation as the Authority under Change symbolism. Web and Reddit notes remain cross-checks only.
- [[Autocrat (Black Emperor)]], [[Distortion (Black Emperor)]], [[Disorder (Black Emperor)]], [[Order (Justiciar)]], [[Rules (Justiciar)]], [[Laws (Justiciar)]], [[Principles (Justiciar)]], [[Judgement (Justiciar)]], [[Balance (Justiciar)]], and [[Disorder (Justiciar)]]: second 10-Authority research batch now separates Autocrat from Disorder, distinguishes the two Pathways' Disorder shares, preserves the Rules/Laws/Principles translation boundary, and records indexed novel manifestations and limits. Exact chapter text and original author-post URLs were not independently inspected, so all ten remain `interpretation` / `medium-secondary`; [[Reddit - The Anarchy Authority Discussions]] is explicitly non-canonical.
- [[0 - Moon|Moon]]: the supplied Advancement capture leaves the first Sequence 0 main ingredient blank. It is retained as a source anomaly and is not inferred in the knowledge note.

## Hard Completion Gate Audit

- The web Advancement pass added 16 unofficial/medium source notes and sourced Potion sections to the remaining 160 Sequence notes; 220 of 220 Sequence notes now contain Potion data.
- Authority batch 2 changed all ten expected targets, promoted nine notes only where exact-URL `official/high` author evidence directly supports the Authority, retained one partial Fate jurisdiction, and deprecated the incorrectly modeled `Change (Fool)` node in favor of [[Transformation (Fool)]].
- The current clipping integration added 21 source notes and 168 numbered Sequence notes, completed 17 Pathway maps, and numbered all 22 Standard Pathway folders. All 21 supplied source bodies were verified unchanged after ingestion.
- The managed vault audit found zero duplicate basenames, unresolved or ambiguous links, accidental self-links, orphaned `02-Wiki` notes, missing mandatory fields, invalid statuses, and template placeholders outside `06-Templates/`.
- The source bodies for [[Lord of Mysteries Wiki - Door Pathway Abilities]] and [[Lord of Mysteries Wiki - Error Pathway Abilities]] were restored to their pre-ingestion content; no source-body immutability debt remains from that repair.

## Counting Rule

Total counts unique `02-Wiki` notes matching at least one condition: `status: interpretation`, a substantive note using a non-epistemic status, `sequence-map-status: pending`, or explicit unresolved/review wording. Overlaps count once.
