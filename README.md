# @dustinriley/design

Warm mid-century-modern design system: tokens, base resets, and a curated set of
reusable CSS primitives. Framework-neutral, with an optional Tailwind v4 +
shadcn bridge.

## Install

```bash
npm i @dustinriley/design
```

## Use

```css
/* any project */
@import "@dustinriley/design/tokens.css";
@import "@dustinriley/design/core.css";

/* Tailwind v4 + shadcn projects instead just need: */
@import "@dustinriley/design/tailwind.css"; /* pulls in core + tokens */
```

## What's in / out

In: `--ds-*` tokens, base element resets, focus ring, and generic primitives
(`.ds-btn*`, `.ds-container`, `.ds-panel`, typographic helpers, `.kbd`, …).

Out by design: site furniture (nav, footer, hero, content grids). Build those
per project from the tokens. See `DESIGN.md`.

## Maintaining the bridge

`src/tailwind.css` is generated. Never edit it by hand. After changing
`src/tokens.css`, run `npm run generate && npm test`.
