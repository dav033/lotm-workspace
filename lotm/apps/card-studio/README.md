# LOTM Card Studio

Server-backed editor and renderer for 960×1280 LOTM cards. It owns the
`/cartas`, `/cartas/vivo`, `/api/cards/**`, and MCP surfaces.

## Architecture

Dependency direction is strict:

`app → editor → cards-ui → domain`

MCP entrypoints call `server → cards-ui/domain`. The server never imports the
editor. `cards-ui/cardProps.ts` is the single CardContent-to-component-props
mapper used by the editor preview, live view, and Playwright renderer.

Card visuals consume the ordered `cards-ui/styleFiles.ts` manifest. The Next
pages and disk renderer must use the same manifest order.

## Local setup

From `lotm/`:

```bash
npm install
Copy-Item .env.example .env # PowerShell
# cp .env.example .env     # macOS/Linux
npm run cards:browser
npm run dev:cards
```

The editor runs on port 3002. Its SQLite database, uploaded images, and ZIP
exports default to `lotm/data/` and can be redirected with `CARDS_DB_PATH`,
`CARDS_IMAGE_DIR`, and `CARDS_EXPORT_DIR`.

## Session model

`cards.db` is the sole source of truth. The editor applies optimistic local
changes, saves them with debounce, polls the server revision every second,
and reconciles confirmed and pending writes. The live view and MCP observe the
same database. Do not change polling or concurrency semantics without reading
`.planning/debug/resolved/mcp-card-sync-inconsistency.md` first.

## MCP

The frozen server name is `lotm-card-studio`. Tools:

| Tool | Purpose |
| --- | --- |
| `save_card_batch` | Create/reuse a universe and section, then add cards |
| `list_card_library` | List cards grouped by universe and section |
| `update_card` | Replace one card's content without moving it |
| `move_cards` | Move cards to another section |
| `save_card_image` | Store an image and return its path |
| `delete_cards` | Delete cards permanently |
| `export_cards_zip` | Render PNGs and create the ZIP |

Local stdio:

```bash
npm run mcp:stdio
```

Streamable HTTP:

```bash
npm run mcp:http
```

Production exposes `POST /mcp` on port 3101. If the host is not local,
`CARDS_MCP_TOKEN` is mandatory; clients send `Authorization: Bearer <token>`.
The `/downloads/:filename` contract and ZIP layout remain frozen:
`universo/NN-seccion/` plus `manifest.json` v3.

## Export and verification

The editor download endpoint and MCP export use the same server renderer.
Video export uses the same card components and Playwright assets. Run all
checks from `lotm/`:

```bash
npm run lint -w @lotm/card-studio
npm run typecheck -w @lotm/card-studio
npm run test -w @lotm/card-studio
npm run visual:check -w @lotm/card-studio
npm run build -w @lotm/card-studio
```

Run `visual:check` after any change to `cards-ui` or renderer code. Never
regenerate goldens to hide an unexpected diff; investigate it first.

Final PNGs must remain 960×1280 with near-black background, serif display
title, gold underline, and clear sans-serif body text.
