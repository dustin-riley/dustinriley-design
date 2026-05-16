import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { hexToHslTriplet, extractDsHex } from "../scripts/generate-bridge.mjs";

const url = (p) => fileURLToPath(new URL(p, import.meta.url));
const tokens = readFileSync(url("../src/tokens.css"), "utf8");
const bridge = readFileSync(url("../src/tailwind.css"), "utf8");

const MAP = {
  "--background": "--ds-bg",
  "--foreground": "--ds-text",
  "--primary": "--ds-primary",
  "--primary-foreground": "--ds-on-primary",
  "--border": "--ds-border",
  "--ring": "--ds-primary",
  "--destructive": "--ds-error"
};

test("hexToHslTriplet converts known values", () => {
  assert.equal(hexToHslTriplet("#ffffff"), "0 0% 100%");
});

test("every mapped shadcn var equals its --ds-* source in HSL", () => {
  const dsHex = extractDsHex(tokens);
  for (const [shadcnVar, dsVar] of Object.entries(MAP)) {
    const expected = hexToHslTriplet(dsHex[dsVar]);
    const re = new RegExp(`${shadcnVar}\\s*:\\s*([^;]+);`);
    const m = bridge.match(re);
    assert.ok(m, `bridge missing ${shadcnVar}`);
    assert.equal(
      m[1].trim(), expected,
      `${shadcnVar} (${m[1].trim()}) != HSL of ${dsVar} ${dsHex[dsVar]} (${expected})`
    );
  }
});

test("tailwind.css remaps radii onto the three allowed values", () => {
  assert.ok(/--radius-lg:\s*16px/.test(bridge));
  assert.ok(/--radius-md:\s*8px/.test(bridge));
});
