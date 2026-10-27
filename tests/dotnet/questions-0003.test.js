// Run from repo root: node --test
// Loads dotnet/assets/questions/0003.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0003 registers mc and oral questions for lesson 0003 with labelled topics", () => {
  const bank = loadLesson("0003");
  const qs = bank.select({ lessons: ["0003"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0003-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0003 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0003");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0003 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0003").oral);
});
