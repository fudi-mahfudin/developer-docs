// Run from repo root: node --test
// Loads dotnet/assets/questions/0009.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0009 registers mc and oral questions for lesson 0009 with labelled topics", () => {
  const bank = loadLesson("0009");
  const qs = bank.select({ lessons: ["0009"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0009-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0009 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0009");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0009 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0009").oral);
});

test("0009 covers the cycle, why-red-first, AAA, and test naming, with a why-red oral", () => {
  const qs = loadLesson("0009").select({ lessons: ["0009"] });
  const topics = new Set(qs.map(q => q.topic));
  ["tdd-siklus", "tdd-red", "tdd-aaa", "tdd-naming"].forEach(t =>
    assert.ok(topics.has(t), `topik ${t} belum ada`));
  ["tdd-siklus", "tdd-red", "tdd-aaa", "tdd-naming"].forEach(t =>
    assert.ok(qs.filter(q => q.topic === t && q.type === "mc").length >= 2, `topik ${t} butuh minimal 2 soal kuis`));
  assert.ok(qs.some(q => q.type === "oral" && /gagal dulu/.test(q.prompt)), "lisan harus menargetkan 'kenapa gagal dulu'");
});
