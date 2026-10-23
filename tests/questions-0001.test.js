// Run from repo root: node --test
// Loads the lesson 0001 question file into a fresh bank, as the browser does via <script>.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { createBank } = require("../assets/bank.js");

function loadLesson(file) {
  const bank = createBank();
  globalThis.QuestionBank = bank;
  const full = path.join(__dirname, "..", "assets", "questions", file);
  delete require.cache[require.resolve(full)];
  require(full);
  delete globalThis.QuestionBank;
  return bank;
}

const words = html => html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;

test("0001 registers quiz and oral questions tagged with lesson 0001", () => {
  const qs = loadLesson("0001.js").select({ lessons: ["0001"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10);
  assert.ok(qs.filter(q => q.type === "oral").length >= 1);
  qs.forEach(q => assert.ok(q.id.startsWith("0001-"), q.id));
});

test("0001 quiz options have equal word counts and answer positions vary", () => {
  const mcs = loadLesson("0001.js").select({ lessons: ["0001"] }).filter(q => q.type === "mc");
  mcs.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id}: word counts ${counts}`);
  });
  const positions = mcs.map(q => Object.keys(q.options).indexOf(q.answer));
  assert.equal(new Set(positions).size, 4, `answer positions used: ${[...new Set(positions)]}`);
});

test("0001 oral questions have a sample answer and a 6-point checklist", () => {
  const orals = loadLesson("0001.js").select({ lessons: ["0001"] }).filter(q => q.type === "oral");
  orals.forEach(q => {
    assert.equal(q.checklist.length, 6, q.id);
    assert.ok(q.sample, q.id);
  });
});

test("0001 labels every topic it uses", () => {
  const bank = loadLesson("0001.js");
  const labels = bank.labels();
  bank.select({ lessons: ["0001"] }).forEach(q => assert.ok(labels[q.topic], q.topic));
});
