import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../src/reset.css", import.meta.url)),
  "utf8"
);

// reset.css ships opinionated base element styling at ZERO specificity
// (every selector wrapped in :where()), so any app rule wins with no
// cascade-layer plumbing. It must NOT use @layer (bundlers flatten a
// package-internal @layer on @import) and must NOT @import tokens
// (consumers load tokens.css/core.css/tailwind.css themselves).

const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");

test("reset.css uses NO @layer (would be flattened on @import)", () => {
  assert.ok(
    !/@layer/.test(cssNoComments),
    "reset.css must not declare @layer"
  );
});

test("reset.css does NOT @import tokens (consumer loads tokens)", () => {
  assert.ok(
    !/@import/.test(cssNoComments),
    "reset.css must be self-contained plain rules — no @import"
  );
});

test("every element rule is wrapped in :where() for zero specificity", () => {
  // No bare element/class selector blocks — they must be :where(...).
  // Strip comments first.
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const bareElement =
    /(^|\})\s*(html|body|h[1-6]|a|code|pre|kbd|samp)\s*[,{]/m;
  assert.ok(
    !bareElement.test(noComments),
    "found a bare (non-:where) element selector — must be :where()"
  );
  assert.ok(/:where\(\s*a\s*\)/.test(css), "a must be :where(a)");
  assert.ok(/:where\(\s*body\s*\)/.test(css), "body must be :where(body)");
  assert.ok(
    /:where\(\s*h1\s*,\s*h2/.test(css),
    "headings must be :where(h1, h2, …)"
  );
});

test("reset.css carries the base element declarations", () => {
  assert.ok(/text-decoration:\s*underline/.test(css), "missing link underline");
  assert.ok(/background:\s*var\(--ds-bg\)/.test(css), "missing body bg");
  assert.ok(
    /:where\(code\)[^}]*border:\s*1px solid var\(--ds-border\)/.test(css),
    "missing boxed inline code"
  );
  assert.ok(/::selection\s*\{/.test(css), "missing ::selection");
});

test("reset.css does NOT redeclare design tokens", () => {
  assert.ok(
    !/:root\s*\{[^}]*--ds-/.test(css),
    "reset.css must not declare --ds-* tokens; those live in tokens.css"
  );
});
