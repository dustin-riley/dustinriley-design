import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../src/reset.css", import.meta.url)),
  "utf8"
);

// reset.css is the OPT-IN base element layer. Consumers that have no base
// styles of their own (e.g. scorigami) import it; consumers that already
// own their element styling (e.g. dustinriley.com's design-system.css)
// do NOT. It must be self-contained (pull in tokens) and carry the
// element resets that previously (wrongly) lived in tokens.css.

test("reset.css pulls in tokens so it is self-contained", () => {
  assert.ok(
    /@import\s+["']\.\/tokens\.css["']/.test(css),
    "reset.css must @import ./tokens.css"
  );
});

test("reset.css wraps its element resets in @layer base (cascade-safe)", () => {
  // Must be layered so consumer @layer components / prose always win and
  // it can never override component styling — uniform, footgun-free.
  assert.ok(/@layer\s+base\s*\{/.test(css), "reset.css must use @layer base");
  // The element rules must be INSIDE the layer block, not before it.
  const layerIdx = css.search(/@layer\s+base\s*\{/);
  const bodyIdx = css.search(/\bbody\s*\{/);
  assert.ok(
    layerIdx !== -1 && bodyIdx > layerIdx,
    "element resets must be inside the @layer base block"
  );
});

test("reset.css carries the base element resets", () => {
  assert.ok(/\bbody\s*\{/.test(css), "missing body reset");
  assert.ok(/(^|\})\s*a\s*\{/.test(css), "missing a reset");
  assert.ok(/text-decoration:\s*underline/.test(css), "missing link underline");
  assert.ok(/\bcode\s*\{/.test(css), "missing code reset");
  assert.ok(/h1\s*,\s*h2/.test(css), "missing heading resets");
  assert.ok(/::selection/.test(css), "missing ::selection");
});

test("reset.css does NOT redeclare design tokens (those live in tokens.css)", () => {
  assert.ok(
    !/:root\s*\{[^}]*--ds-bg\s*:/.test(css),
    "reset.css must not redeclare --ds-* tokens; it imports tokens.css"
  );
});
