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

/* base element styling (links, code, headings, body) — uniform,
   safe for every app; it's internally @layer base so your
   components/prose always win: */
@import "@dustin-riley/design/reset.css";

/* Tailwind v4 + shadcn projects also need: */
@import "@dustin-riley/design/tailwind.css"; /* pulls in core + tokens */
```

Every app imports the same set — no per-app reasoning.

## What's in / out

`tokens.css` — `--ds-*` custom properties + the focus ring. Pure tokens, no
element styling; safe to import anywhere/unlayered.

`core.css` — generic primitives (`.ds-btn*`, `.ds-container`, `.ds-panel`,
typographic helpers, `.kbd`, …). Imports `tokens.css`.

`reset.css` — base element styling (link underline, boxed inline code, heading
sizes, body defaults). These are *not* tokens, but they're shipped wrapped in
`@layer base` so they are **cascade-safe to import the same way in every app**:
your `@layer components`/`utilities`, a prose/typography plugin, and unlayered
app CSS all win over it automatically. It only sets the baseline where nothing
else applies. No per-app judgment, no `@layer` wrapper to remember.

`tailwind.css` — optional Tailwind v4 `@theme` + shadcn HSL bridge (pulls in
core + tokens). Does **not** include `reset.css`.

Out by design: site furniture (nav, footer, hero, content grids). Build those
per project from the tokens. See `DESIGN.md`.

## Maintaining the bridge

`src/tailwind.css` is generated. Never edit it by hand. After changing
`src/tokens.css`, run `npm run generate && npm test`.
