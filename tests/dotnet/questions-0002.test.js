// Run from repo root: node --test
// Loads dotnet/assets/questions/0002.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0002 registers mc and oral questions for lesson 0002 with labelled topics", () => {
  const bank = loadLesson("0002");
  const qs = bank.select({ lessons: ["0002"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0002-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0002 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0002");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0002 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0002").oral);
});
