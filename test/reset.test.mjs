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
