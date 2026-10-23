// Run from repo root: node --test
// Loads assets/questions/0011.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("./helpers.js");

test("0011 registers mc and oral questions for lesson 0011 with labelled topics", () => {
  const bank = loadLesson("0011");
  const qs = bank.select({ lessons: ["0011"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0011-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0011 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0011");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0011 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0011").oral);
});

test("0011 covers dependency rule, interface placement, layered comparison, and the Repository debate", () => {
  const qs = loadLesson("0011").select({ lessons: ["0011"] });
  const topics = new Set(qs.map(q => q.topic));
  ["ca-dependency-rule", "ca-placement", "ca-vs-layered", "repo-ef-core"].forEach(t =>
    assert.ok(topics.has(t), `topik ${t} belum ada`));
  assert.ok(qs.filter(q => q.topic === "repo-ef-core" && q.type === "mc").length >= 3,
    "debat Repository butuh minimal 3 soal kuis (pro, kontra, kapan tidak perlu)");
  const oral = qs.filter(q => q.type === "oral");
  assert.ok(oral.some(q => /Clean Architecture/.test(q.prompt)), "lisan harus menargetkan Clean Architecture");
  assert.ok(oral.some(q => /Repository/.test(q.prompt)), "lisan harus menargetkan debat Repository");
});
