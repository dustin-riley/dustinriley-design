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

/* base element styling (links, code, headings, body) — plain import,
   zero specificity (:where), so any app rule always wins. No @layer,
   nothing to remember: */
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
sizes, body defaults). These are *not* tokens. Every selector is wrapped in
`:where()`, giving it **zero specificity**, so *any* app rule — a bare `a {}`,
a component class, a prose/typography plugin — wins automatically. No `@layer`
(bundlers like Lightning CSS flatten a package-internal `@layer` pulled in via
`@import`); no consumer incantation. Plain `@import`, same in every app. It only
sets the baseline where nothing else applies. Requires tokens to be loaded.

`tailwind.css` — optional Tailwind v4 `@theme` + shadcn HSL bridge (pulls in
core + tokens). Does **not** include `reset.css`.

Out by design: site furniture (nav, footer, hero, content grids). Build those
per project from the tokens. See `DESIGN.md`.

## Maintaining the bridge

`src/tailwind.css` is generated. Never edit it by hand. After changing
`src/tokens.css`, run `npm run generate && npm test`.
