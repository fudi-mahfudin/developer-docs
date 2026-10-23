// Loads assets/questions/0016.js into a fresh bank and checks the quiz rules from the teach skill.
const test = require("node:test");
const assert = require("node:assert/strict");
const bankApi = require("../assets/bank.js");

function loadLesson() {
  const path = require.resolve("../assets/questions/0016.js");
  delete require.cache[path];
  globalThis.QuestionBank = bankApi.createBank();
  require(path);
  return globalThis.QuestionBank;
}

const words = html => html.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;
const TOPICS = ["ng-forms", "ng-http", "ng-interceptor"];

test("0016 registers mc and oral questions for forms, HttpClient, and interceptor topics", () => {
  const bank = loadLesson();
  const qs = bank.select({ lessons: ["0016"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8, "at least 8 quiz questions");
  assert.equal(qs.filter(q => q.type === "oral").length, 1);
  const topics = new Set(qs.map(q => q.topic));
  assert.deepEqual([...topics].sort(), TOPICS);
  topics.forEach(t => assert.ok(bank.labels()[t], `label for ${t}`));
  qs.forEach(q => assert.match(q.id, /^0016-/));
});

test("0016 every topic has at least two quiz questions", () => {
  const mcs = loadLesson().select({ lessons: ["0016"] }).filter(q => q.type === "mc");
  TOPICS.forEach(t =>
    assert.ok(mcs.filter(q => q.topic === t).length >= 2, `${t} has >= 2 questions`));
});

test("0016 quiz options have equal word counts and the answer position varies", () => {
  const mcs = loadLesson().select({ lessons: ["0016"] }).filter(q => q.type === "mc");
  mcs.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id} option word counts: ${counts}`);
  });
  assert.equal(new Set(mcs.map(q => q.answer)).size, 4, "correct answer appears in every position a-d");
});

test("0016 oral question has a 6-point checklist and a sample answer", () => {
  const [oral] = loadLesson().select({ lessons: ["0016"] }).filter(q => q.type === "oral");
  assert.equal(oral.checklist.length, 6);
  assert.ok(oral.sample);
});
