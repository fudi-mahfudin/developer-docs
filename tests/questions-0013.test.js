// Loads assets/questions/0013.js into a fresh bank and checks the quiz rules from the teach skill.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("./helpers.js");

test("0013 registers mc and oral questions for its three Angular topics", () => {
  const bank = loadLesson("0013");
  const qs = bank.select({ lessons: ["0013"] });
  const mcs = qs.filter(q => q.type === "mc");
  assert.ok(mcs.length >= 8, "at least 8 quiz questions");
  assert.equal(qs.filter(q => q.type === "oral").length, 1);
  const topics = new Set(qs.map(q => q.topic));
  assert.deepEqual([...topics].sort(), ["ng-binding", "ng-lifecycle", "ng-module"]);
  topics.forEach(t => assert.ok(bank.labels()[t], `label for ${t}`));
  qs.forEach(q => assert.match(q.id, /^0013-/));
});

test("0013 quiz options have equal word counts and the answer position varies", () => {
  const { mc } = lessonQuestions("0013");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc, { allowSameInARow: true });
});

test("0013 oral question has a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0013").oral);
});

test("0013 never teaches Angular 17 control flow as a correct answer", () => {
  const qs = loadLesson("0013").select({ lessons: ["0013"] });
  const taught = qs.map(q => (q.type === "mc" ? q.options[q.answer] : q.sample)).join(" ");
  assert.doesNotMatch(taught, /@(if|for|switch)\b/);
});
