---
name: dustinriley-design
description: Use when building or modifying any UI in a project that consumes @dustinriley/design — enforces the warm mid-century-modern token system, the three-radii/three-shadow rules, sentence-case voice, and the curated .ds-* primitive vocabulary.
---

# dustinriley design system

Apply this whenever you add or change UI in a project importing `@dustinriley/design`.

## Non-negotiables
- One primary (burnt orange `#B8541C`), accents ochre + teal. Never invent colors.
- Three radii only: 8 / 16 / 999px. Three warm-tinted shadows only: sm / md / lg.
- Sentence case everywhere. First person. No emoji. Lucide icons or unicode arrows.
- Color is never the only state signal. Motion resolves under 300ms.
- For text-as-link in burnt orange use `--ds-link`, never `--ds-primary` (WCAG AA).
- Never hard-code a hex/px value — reference a `--ds-*` token.

## How to consume
- Always: `@import "@dustinriley/design/tokens.css"; @import "@dustinriley/design/core.css";`
- Tailwind v4 + shadcn projects additionally: `@import "@dustinriley/design/tailwind.css";`

## Vocabulary (prefer extending these over inventing parallels)
Buttons `.ds-btn` + `.ds-btn-primary|secondary|ghost`; layout `.ds-container`,
`.ds-section`; type `.ds-display`, `.ds-lede`, `.ds-caption`, `.ds-mono-note`,
`.grid-label`, `.h1`–`.h6`; chrome bits `.ds-page-header`, `.ds-back-link`;
surfaces `.ds-panel`, `.kbd`.

Site-specific furniture (nav, footer, hero, grids) is NOT in the package by
design — build it per project from these primitives and tokens.

See the full rationale in `@dustinriley/design/DESIGN.md`.
