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

// Base element styling now ships in core.css (no separate reset.css,
// no consumer @layer). Wrapped in :where() for zero specificity.
test("core.css ships minimal base element styling via :where()", () => {
  assert.ok(/:where\(\s*body\s*\)/.test(css), "missing :where(body)");
  assert.ok(/:where\(\s*h1\s*,\s*h2/.test(css), "missing :where(h1, h2, …)");
  assert.ok(/:where\(\s*a\s*\)/.test(css), "missing :where(a)");
  assert.ok(/:where\(code\)/.test(css), "missing :where(code)");
  assert.ok(/::selection\s*\{/.test(css), "missing ::selection");
});

// THE invariant from the underline saga: the system must NEVER ship a
// global link underline. Underline is a component-scoped app decision.
test("core.css has NO global link text-decoration", () => {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(
    !/text-decoration\s*:\s*underline/.test(noComments),
    "core.css must not set text-decoration:underline anywhere"
  );
  const whereA = noComments.match(/:where\(\s*a\s*\)\s*\{[^}]*\}/);
  assert.ok(whereA, ":where(a) rule should exist");
  assert.ok(
    !/text-decoration/.test(whereA[0]),
    ":where(a) must not set text-decoration at all (let Preflight stand)"
  );
});
