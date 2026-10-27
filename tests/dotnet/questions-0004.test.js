// Run from repo root: node --test
// Loads dotnet/assets/questions/0004.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0004 registers mc and oral questions for lesson 0004 with labelled topics", () => {
  const bank = loadLesson("0004");
  const qs = bank.select({ lessons: ["0004"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0004-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0004 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0004");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0004 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0004").oral);
});

test("0004 covers lifetime-choice scenarios plus captive dependency (mc and oral)", () => {
  const qs = loadLesson("0004").select({ lessons: ["0004"] });
  const mc = qs.filter(q => q.type === "mc");
  assert.ok(mc.filter(q => q.topic === "di-lifetime").length >= 4, "butuh >= 4 skenario memilih lifetime");
  assert.ok(mc.some(q => q.topic === "di-captive"), "butuh skenario captive dependency");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "di-captive"), "butuh soal lisan captive dependency");
});
