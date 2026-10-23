// Loads assets/questions/0013.js into a fresh bank and checks the quiz rules from the teach skill.
const test = require("node:test");
const assert = require("node:assert/strict");
const bankApi = require("../assets/bank.js");

function loadLesson() {
  const path = require.resolve("../assets/questions/0013.js");
  delete require.cache[path];
  globalThis.QuestionBank = bankApi.createBank();
  require(path);
  return globalThis.QuestionBank;
}

const words = html => html.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;

test("0013 registers mc and oral questions for its three Angular topics", () => {
  const bank = loadLesson();
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
  const mcs = loadLesson().select({ lessons: ["0013"] }).filter(q => q.type === "mc");
  mcs.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id} option word counts: ${counts}`);
  });
  const answers = new Set(mcs.map(q => q.answer));
  assert.equal(answers.size, 4, "correct answer appears in every position a-d");
});

test("0013 oral question has a 6-point checklist and a sample answer", () => {
  const [oral] = loadLesson().select({ lessons: ["0013"] }).filter(q => q.type === "oral");
  assert.equal(oral.checklist.length, 6);
  assert.ok(oral.sample);
});

test("0013 never teaches Angular 17 control flow as a correct answer", () => {
  const qs = loadLesson().select({ lessons: ["0013"] });
  const taught = qs.map(q => (q.type === "mc" ? q.options[q.answer] : q.sample)).join(" ");
  assert.doesNotMatch(taught, /@(if|for|switch)\b/);
});
