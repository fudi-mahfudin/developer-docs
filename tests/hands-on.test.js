// Run from repo root: node --test
// Checks the shared hands-on helper: script blocks shown in an HTML page must be identical
// to the .sql file they name (the .sql file is the source of truth).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { ROOT, scriptBlocks, assertScriptsMatchFiles } = require("./helpers.js");

const EXAMPLE = "assets/examples/hands-on-example.html";
const EXAMPLE_SQL = "assets/examples/hands-on-example.sql";

test("scriptBlocks reads each script block's file and unescaped text", () => {
  const blocks = scriptBlocks(EXAMPLE);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].file, EXAMPLE_SQL);
  assert.match(blocks[0].text, /WHERE Price > 100 AND Name <> N'Contoh & Co'/);
});

test("the example page shows its .sql file exactly", () => {
  assertScriptsMatchFiles(EXAMPLE);
});

test("assertScriptsMatchFiles fails when the page drifts from the .sql file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hands-on-"));
  const page = path.join(dir, "drift.html");
  const html = fs.readFileSync(path.join(ROOT, EXAMPLE), "utf8").replace("Price &gt; 100", "Price &gt; 200");
  fs.writeFileSync(page, html);
  assert.throws(() => assertScriptsMatchFiles(page), /hands-on-example\.sql/);
});

test("assertScriptsMatchFiles fails when a page has fewer script blocks than expected", () => {
  assert.throws(() => assertScriptsMatchFiles(EXAMPLE, { min: 2 }), /script/);
});
