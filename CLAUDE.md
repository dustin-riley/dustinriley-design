# CLAUDE.md

Guidance for agents working **on this package** (`@dustin-riley/design`).
Consumer-facing docs are `README.md`, `DESIGN.md`, and the bundled
`skill/dustinriley-design/SKILL.md` — those ship in the npm tarball; this file
does not (not in `package.json` `files`).

## What this is

A framework-neutral CSS design system published to public npm as
`@dustin-riley/design`. Consumer contract (every app, nothing per-app):

```css
@import "@dustin-riley/design/tokens.css";
@import "@dustin-riley/design/core.css";
@import "@dustin-riley/design/tailwind.css"; /* only Tailwind v4 + shadcn apps */
```

Real consumers to keep working: **dustinriley.com** (Astro) and **scorigami**
(Next + Tailwind v4 + shadcn). The full design rationale and the complete
root-cause history of past mistakes live in
`dustinriley.com/docs/superpowers/{specs,plans}/2026-05-16-design-system-package*`
(spec has 5 addenda — read them before changing cascade/layout behavior).

## Layout

| File | Role |
|---|---|
| `src/tokens.css` | **Only** `:root` `--ds-*` custom properties + `:focus-visible`. No element styling. Source of truth for token values. |
| `src/core.css` | Curated reusable primitives (`.ds-*`) **plus** minimal `:where()` base element styling (body/headings/code/`::selection`). `@import`s tokens.css. |
| `src/tailwind.head.css` | Hand-written head of the bridge: Tailwind `@theme` (radius/colour/font) + the shadcn `*{border-color}` base rule. |
| `src/tailwind.css` | **GENERATED. Never hand-edit.** Built from `tokens.css` + `tailwind.head.css` by `scripts/generate-bridge.mjs`. |
| `scripts/generate-bridge.mjs` | Derives the shadcn HSL `:root` block from the `--ds-*` hexes. Exports `MAP`, `extractDsHex`, `hexToHslTriplet`. |
| `test/*.test.mjs` | `node --test`. The invariants below are enforced here. |

## Non-negotiable invariants (each cost real regressions — do not relax)

1. **The system ships NO global `<a>` rule — no `color`, no
   `text-decoration`, ever.** `<a>` is both chrome (nav/brand/footer) and
   content; any global value is wrong somewhere, and a package rule is
   *unlayered* in the consumer build so it beats their `@layer components`
   regardless of specificity (`:where()` does not save you — it zeroes
   specificity, not layer origin). Link colour/underline is a consumer
   component/prose decision. Enforced by `test/core.test.mjs`.
2. **`src/tailwind.css` is generated.** Change `src/tokens.css` (or
   `tailwind.head.css`), then `npm run generate && npm test`. Never edit
   `tailwind.css` by hand; the drift test will fail and a hand edit will be
   overwritten.
3. **`tokens.css` stays pure** — only `:root` vars + `:focus-visible`. No
   `body`/`a`/`code`/heading rules. Opinionated element styling lives in
   `core.css`, wrapped in `:where()` (zero specificity), with **no `@layer`**
   (Lightning CSS flattens a package-internal `@layer` pulled in via
   `@import`, making it unexpectedly unlayered/strongest).
4. **Curation: system vs site.** Generic primitives belong in `core.css`;
   site furniture (nav, footer, hero, content grids, chart bits) stays in the
   consuming app. Don't add app-specific selectors here.
5. **Bridge covers the full shadcn `MAP`.** `test/bridge.test.mjs` round-trips
   every mapped var back to its `--ds-*` source — keep it that way.

## Verification discipline (THE lesson from the saga)

Never conclude "fixed" because a rule/selector *exists* in the source or built
CSS. CSS cascade outcome is decided by **origin/layer first, then
specificity**. To verify a cascade claim, parse the *resolved `@layer`
containment of the competing rules in the built CSS* of an actual consumer
(or use computed styles / a browser). "The rule is there" ≠ "the rule wins."
Five fixes failed in a row by skipping this.

## Common changes

- **Add/change a token:** edit `src/tokens.css` → `npm run generate` →
  `npm test` → bump version → publish.
- **Add a primitive:** add the `.ds-*` class to `src/core.css` (verbatim
  style, token-driven); update `MUST_INCLUDE` in `test/core.test.mjs`; keep it
  generic (no app furniture).
- **Touch base element styling:** keep it in `core.css`, `:where()`-wrapped,
  no `@layer`, and never reintroduce a global `a` rule (invariant 1).

## Release

```bash
npm test                 # must be green
npm version <patch|minor|major>   # or hand-bump package.json
npm publish --access public --otp=<code>   # scope @dustin-riley; 2FA required
git push && git push --tags
```

`@dustin-riley` is an npm **org** owned by user `dustin-riley` (the username
has a hyphen; the scope does not — they differ, this is correct). Publishing
requires a fresh 2FA OTP. After publishing, bump the consumers' dependency and
re-verify their builds per the discipline above.
