// Loads assets/questions/0014.js into a fresh bank and checks the quiz rules from the teach skill.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("./helpers.js");

test("0014 registers mc and oral questions for DI, routing, and guard topics", () => {
  const bank = loadLesson("0014");
  const qs = bank.select({ lessons: ["0014"] });
  const mcs = qs.filter(q => q.type === "mc");
  assert.ok(mcs.length >= 8, "at least 8 quiz questions");
  assert.equal(qs.filter(q => q.type === "oral").length, 1);
  const topics = new Set(qs.map(q => q.topic));
  assert.deepEqual([...topics].sort(), ["ng-di", "ng-guard", "ng-routing"]);
  topics.forEach(t => assert.ok(bank.labels()[t], `label for ${t}`));
  qs.forEach(q => assert.match(q.id, /^0014-/));
});

test("0014 quiz options have equal word counts and the answer position varies", () => {
  const { mc } = lessonQuestions("0014");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0014 oral question has a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0014").oral);
});

test("0014 teaches v16 functional guards, not Angular 17 syntax or deprecated class guards", () => {
  const qs = loadLesson("0014").select({ lessons: ["0014"] });
  const taught = qs.map(q => (q.type === "mc" ? q.options[q.answer] : q.sample)).join(" ");
  assert.doesNotMatch(taught, /@(if|for|switch)\b/);
  assert.doesNotMatch(taught, /implements\s+CanActivate\b/);
});
