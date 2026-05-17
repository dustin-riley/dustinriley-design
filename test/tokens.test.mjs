import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../src/tokens.css", import.meta.url)),
  "utf8"
);

const REQUIRED_TOKENS = [
  "--ds-bg", "--ds-surface", "--ds-surface-sunken", "--ds-border",
  "--ds-text", "--ds-text-muted",
  "--ds-primary", "--ds-primary-hover", "--ds-primary-pressed",
  "--ds-link", "--ds-link-hover",
  "--ds-accent-ochre", "--ds-accent-teal", "--ds-accent-plum",
  "--ds-success", "--ds-warning", "--ds-error", "--ds-on-primary",
  "--ds-font-display", "--ds-font-body", "--ds-font-mono",
  "--ds-radius-sm", "--ds-radius-md", "--ds-radius-pill",
  "--ds-border-width",
  "--ds-shadow-sm", "--ds-shadow-md", "--ds-shadow-lg",
  "--ds-ease-standard"
];

test("tokens.css declares every required --ds-* token", () => {
  for (const token of REQUIRED_TOKENS) {
    assert.ok(
      new RegExp(`${token}\\s*:`).test(css),
      `missing token ${token}`
    );
  }
});

test("tokens.css ships the focus ring", () => {
  assert.ok(/:focus-visible/.test(css), "missing :focus-visible rule");
});

test("tokens.css is pure tokens — NO opinionated element resets", () => {
  // Element resets are project-opinionated (link decoration, code boxing,
  // heading sizing) and conflict across consumers. They must live in the
  // opt-in reset.css, never unlayered in tokens.css. See the
  // 2026-05-16 design-system-package spec addendum.
  assert.ok(!/\bbody\s*\{/.test(css), "tokens.css must not reset body");
  assert.ok(!/(^|\})\s*a\s*\{/.test(css), "tokens.css must not style a");
  assert.ok(!/\bcode\s*[,{]/.test(css), "tokens.css must not style code");
  assert.ok(
    !/h1\s*,\s*h2/.test(css),
    "tokens.css must not carry heading element resets"
  );
  assert.ok(!/::selection/.test(css), "tokens.css must not style ::selection");
});
