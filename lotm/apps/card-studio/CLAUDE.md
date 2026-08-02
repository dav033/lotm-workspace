# Card Studio

Card Studio is the server-backed LOTM card editor and renderer.

## Architecture

Keep the dependency direction strict:

`app → editor → cards-ui → domain`

The app and MCP entrypoints may call `server`; `server` may call `cards-ui` and
`domain`; `server` must never import `editor`. `domain` stays client-safe and
must not import from the other layers.

`cards-ui/cardProps.ts` is the single state-to-component mapper. The editor,
live view, and static renderer should consume that mapper instead of creating
parallel card-family conditionals.

## Invariants

- MCP tool names, schemas, and export manifest v3 remain compatible.
- The editor session is server-authoritative with optimistic local edits,
  debounced saves, revision polling, and reconciliation of pending writes.
- Do not redesign the polling/concurrency semantics without first reading the
  session debugging notes in `.planning/debug/resolved/`.
- Card visuals use the ordered `cards-ui/styleFiles.ts` manifest. Next pages and
  the PNG renderer must consume the same order.
- Final card PNGs are 960×1280: near-black background, serif display title with
  gold underline, and clear sans-serif body text.

## Verification

From the workspace root:

```text
npm run lint -w @lotm/card-studio
npm run typecheck -w @lotm/card-studio
npm run test -w @lotm/card-studio
npm run visual:check -w @lotm/card-studio
```

Run `visual:check` after any cards-ui or renderer change. Never regenerate
goldens just to hide a diff; investigate the changed pixels first.
