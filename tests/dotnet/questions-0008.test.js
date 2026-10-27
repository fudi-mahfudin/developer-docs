// Run from repo root: node --test
// Loads dotnet/assets/questions/0008.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0008 registers mc and oral questions for lesson 0008 with labelled topics", () => {
  const bank = loadLesson("0008");
  const qs = bank.select({ lessons: ["0008"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0008-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0008 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0008");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0008 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0008").oral);
});

test("0008 covers all five SOLID principles plus a violation-spotting drill and an SRP/DIP oral", () => {
  const qs = loadLesson("0008").select({ lessons: ["0008"] });
  const topics = new Set(qs.map(q => q.topic));
  ["solid-srp", "solid-ocp", "solid-lsp", "solid-isp", "solid-dip", "solid-violation"].forEach(t =>
    assert.ok(topics.has(t), `topik ${t} belum ada`));
  assert.ok(qs.filter(q => q.topic === "solid-violation" && q.type === "mc").length >= 5,
    "latihan mengenali pelanggaran butuh minimal 5 potongan kode");
  assert.ok(qs.some(q => q.type === "oral" && /SRP|DIP/.test(q.prompt)), "lisan harus menargetkan SRP/DIP");
});
