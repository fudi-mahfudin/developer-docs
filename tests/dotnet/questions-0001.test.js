// Run from repo root: node --test
// Loads the lesson 0001 question file into a fresh bank, as the browser does via <script>.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0001 registers quiz and oral questions tagged with lesson 0001", () => {
  const qs = loadLesson("0001").select({ lessons: ["0001"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10);
  assert.ok(qs.filter(q => q.type === "oral").length >= 1);
  qs.forEach(q => assert.ok(q.id.startsWith("0001-"), q.id));
});

test("0001 quiz options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0001");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc, { allowSameInARow: true });
});

test("0001 oral questions have a sample answer and a 6-point checklist", () => {
  assertOralFormat(lessonQuestions("0001").oral);
});

test("0001 labels every topic it uses", () => {
  const bank = loadLesson("0001");
  const labels = bank.labels();
  bank.select({ lessons: ["0001"] }).forEach(q => assert.ok(labels[q.topic], q.topic));
});
