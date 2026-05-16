# @dustin-riley/design

Warm mid-century-modern design system: tokens, base resets, and a curated set of
reusable CSS primitives. Framework-neutral, with an optional Tailwind v4 +
shadcn bridge.

## Install

```bash
npm i @dustin-riley/design
```

## Use

```css
/* any project */
@import "@dustin-riley/design/tokens.css";
@import "@dustin-riley/design/core.css";

/* Tailwind v4 + shadcn projects also need: */
@import "@dustin-riley/design/tailwind.css"; /* pulls in core + tokens */
```

That's the whole contract. No separate reset, no `@layer`, nothing per-app.

## What's in / out

`tokens.css` — `--ds-*` custom properties + the focus ring. Pure tokens, no
element styling.

`core.css` — generic primitives (`.ds-btn*`, `.ds-container`, `.ds-panel`,
typographic helpers, `.kbd`, …) **plus minimal base element styling** (body
defaults, heading font/size, mono code, `::selection`). Imports `tokens.css`.
Base rules are wrapped in `:where()` (zero specificity) so any app/component/
Preflight rule wins.

**Links are not underlined by default.** Per `DESIGN.md`, links are color-only;
the system never sets a global link `text-decoration`. Underline is an
intentional, component-scoped decision (e.g. article body) made by the app.

`tailwind.css` — optional Tailwind v4 `@theme` + shadcn HSL bridge (pulls in
core + tokens). Does **not** include `reset.css`.

Out by design: site furniture (nav, footer, hero, content grids). Build those
per project from the tokens. See `DESIGN.md`.

## Maintaining the bridge

`src/tailwind.css` is generated. Never edit it by hand. After changing
`src/tokens.css`, run `npm run generate && npm test`.
