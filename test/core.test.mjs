import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../src/core.css", import.meta.url)),
  "utf8"
);

const MUST_INCLUDE = [
  ".ds-btn", ".ds-btn-primary", ".ds-btn-secondary", ".ds-btn-ghost",
  ".ds-container", ".ds-section", ".ds-display", ".ds-lede",
  ".ds-caption", ".ds-mono-note", ".grid-label", ".ds-page-header",
  ".ds-back-link", ".ds-panel", ".kbd"
];

const MUST_EXCLUDE = [
  ".hero", ".experiment-grid", ".experiment-card", ".writing-list",
  ".writing-item", ".site-nav", ".site-footer", ".ds-article",
  ".ds-pager", ".ds-related", ".ds-search-input", ".ds-chip-cloud",
  ".blob-1", ".blob-2"
];

test("core.css imports tokens.css", () => {
  assert.ok(/@import\s+["']\.\/tokens\.css["']/.test(css));
});

test("core.css contains every audited-in primitive", () => {
  for (const sel of MUST_INCLUDE) {
    assert.ok(css.includes(sel), `core.css must define ${sel}`);
  }
});

test("core.css contains no excluded site furniture", () => {
  for (const sel of MUST_EXCLUDE) {
    assert.ok(!css.includes(sel), `core.css must NOT contain ${sel}`);
  }
});
