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

/* Tailwind v4 + shadcn projects instead just need: */
@import "@dustin-riley/design/tailwind.css"; /* pulls in core + tokens */

/* ONLY if your project has no base element styling of its own —
   import it into a layer weaker than your components so specific
   rules still win: */
@layer base { @import "@dustin-riley/design/reset.css"; }
```

## What's in / out

`tokens.css` — `--ds-*` custom properties + the focus ring. Pure tokens, no
element styling; safe to import anywhere/unlayered.

`core.css` — generic primitives (`.ds-btn*`, `.ds-container`, `.ds-panel`,
typographic helpers, `.kbd`, …). Imports `tokens.css`.

`reset.css` — **opt-in** opinionated base element resets (link underline, boxed
inline code, heading sizes, body defaults). These are *not* tokens — they are
project-level base opinions. Import only if you have no base layer of your own,
and import it **into a cascade layer weaker than your components**; importing it
unlayered makes it override your component rules. Projects that already style
their own raw `a`/`code`/headings (e.g. via a prose/typography plugin) must NOT
import it.

`tailwind.css` — optional Tailwind v4 `@theme` + shadcn HSL bridge (pulls in
core + tokens). Does **not** include `reset.css`.

Out by design: site furniture (nav, footer, hero, content grids). Build those
per project from the tokens. See `DESIGN.md`.

## Maintaining the bridge

`src/tailwind.css` is generated. Never edit it by hand. After changing
`src/tokens.css`, run `npm run generate && npm test`.
