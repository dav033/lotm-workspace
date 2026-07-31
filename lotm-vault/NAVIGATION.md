---
type: navigation
status: active
updated: 2026-07-31
---

# READ FIRST — every session, before opening any other file

Directive, not description. MUST / MUST NOT are hard requirements. No filler.

## 1. Scope fork — resolve before touching any file

- Task = game code, engineering, business, TikTok, `10-Project/` → go to `10-Project/README.md`. `AGENTS.md` MUST NOT apply. Stop here.
- Task = novel canon, characters, Sequences, Pathways, Authorities, any `02-Wiki/` content → read `AGENTS.md` in full before writing or editing anything. Binding.
- Unclear → task names a proper noun from the novel = lore. Task names game/engine/business/channel = project.

## 2. Access rule

- MUST NOT enumerate or scan the vault. 550+ notes.
- Known path (this file, `AGENTS.md`, `10-Project/README.md`, any `04-Indexes/*`) → fetch by exact path. Confirmed working: the plugin behind the MCP bridge exposes exact-path read (`GET /vault/{path}`) — same mechanism `vault_write_binary` uses to write, per `obsidian-bridge.ts`.
- Unknown item (character, concept, term) → one `search_notes` query, exact term. Not a crawl.
- No hit → `04-Indexes/Index.md` (lore) or `10-Project/README.md` (project). Curated indexes, not blind search.
- **Unconfirmed:** whether `search_notes` generic/semantic query (not exact term) can surface this file. Exact-path fetch is confirmed; semantic discoverability is not tested. Update this line once verified.

## 3. Write rule — creating or editing a note

- Lore zone (`00-Inbox` through `06-Templates`): `AGENTS.md` governs the entire write path — mandatory frontmatter, epistemic status, direct sourcing, linking/graph integrity, and the ingestion workflow (steps 1-12). Ingestion workflow step 10 already requires updating `04-Indexes/*` and audited counts in the SAME change that adds the note. MUST NOT skip that step. Hard completion gate MUST pass before calling anything closed.
- Project zone (`10-Project/`): `10-Project/README.md` governs. MUST add every new file to that README's "Contenido" list in the same edit that creates the file — no exceptions, no deferring it. MUST append to `10-Project/Log.md` (not `Lore Log.md`) for the decision behind it, chronologically, without rewriting prior entries.
- Either zone: a new note with no index/registry entry pointing to it MUST NOT be treated as done. The vault's index is the only thing that lets a future session skip a full scan — an unindexed note defeats that, permanently, until someone finds it by accident.

## 4. Two logs — MUST NOT conflate

- `Lore Log.md` (root) = lore changes only. Governed by `AGENTS.md`.
- `10-Project/Log.md` = project/business decisions only. Governed by `10-Project/README.md`.
- Renamed 2026-07-31 from a `log.md`/`Log.md` collision. MUST NOT recreate that collision.

---
Audit trail: `10-Project/Deliberacion del Consejo - Ronda 14.md`.
