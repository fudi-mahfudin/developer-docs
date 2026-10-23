// Loads assets/questions/0015.js into a fresh bank and checks the quiz rules from the teach skill.
const test = require("node:test");
const assert = require("node:assert/strict");
const bankApi = require("../assets/bank.js");

function loadLesson() {
  const path = require.resolve("../assets/questions/0015.js");
  delete require.cache[path];
  globalThis.QuestionBank = bankApi.createBank();
  require(path);
  return globalThis.QuestionBank;
}

const words = html => html.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;

test("0015 registers mc and oral questions for its four RxJS topics", () => {
  const bank = loadLesson();
  const qs = bank.select({ lessons: ["0015"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8, "at least 8 quiz questions");
  assert.equal(qs.filter(q => q.type === "oral").length, 1);
  const topics = new Set(qs.map(q => q.topic));
  assert.deepEqual([...topics].sort(), ["rx-observable", "rx-operator", "rx-subject", "rx-unsubscribe"]);
  topics.forEach(t => assert.ok(bank.labels()[t], `label for ${t}`));
  qs.forEach(q => assert.match(q.id, /^0015-/));
});

test("0015 quiz options have equal word counts and the answer position varies", () => {
  const mcs = loadLesson().select({ lessons: ["0015"] }).filter(q => q.type === "mc");
  mcs.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id} option word counts: ${counts}`);
  });
  assert.equal(new Set(mcs.map(q => q.answer)).size, 4, "correct answer appears in every position a-d");
});

test("0015 has an operator-choice drill whose correct answers span several operators", () => {
  const drill = loadLesson().select({ lessons: ["0015"], topics: ["rx-operator"] })
    .filter(q => q.type === "mc" && q.lesson === "0015" && q.topic === "rx-operator");
  assert.ok(drill.length >= 4, "at least 4 operator scenarios");
  const chosen = new Set(drill.map(q => q.options[q.answer].replace(/<[^>]+>/g, "")));
  ["switchMap", "forkJoin"].forEach(op =>
    assert.ok([...chosen].some(c => c.includes(op)), `a scenario whose answer is ${op}`));
});

test("0015 oral question has a 6-point checklist and a sample answer", () => {
  const [oral] = loadLesson().select({ lessons: ["0015"] }).filter(q => q.type === "oral");
  assert.equal(oral.checklist.length, 6);
  assert.ok(oral.sample);
});
