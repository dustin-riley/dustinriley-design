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

test("tokens.css ships base element resets and focus ring", () => {
  assert.ok(/:focus-visible/.test(css), "missing :focus-visible rule");
  assert.ok(/\bbody\s*{/.test(css), "missing body reset");
  assert.ok(/h1\s*,\s*h2/.test(css), "missing heading resets");
});
