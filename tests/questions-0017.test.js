// Loads assets/questions/0017.js into a fresh bank and checks the quiz rules from the teach skill.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("./helpers.js");
const TOPICS = ["fs-authn-authz", "fs-cors", "fs-jwt", "fs-problem-details", "fs-token-storage"];

test("0017 registers mc and oral questions for JWT, authn/authz, CORS, ProblemDetails, and token storage topics", () => {
  const bank = loadLesson("0017");
  const qs = bank.select({ lessons: ["0017"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10, "at least 10 quiz questions");
  assert.equal(qs.filter(q => q.type === "oral").length, 2, "login-flow oral + CORS/storage oral");
  const topics = new Set(qs.map(q => q.topic));
  assert.deepEqual([...topics].sort(), TOPICS);
  topics.forEach(t => assert.ok(bank.labels()[t], `label for ${t}`));
  qs.forEach(q => assert.match(q.id, /^0017-/));
});

test("0017 every topic has at least two quiz questions", () => {
  const mcs = loadLesson("0017").select({ lessons: ["0017"] }).filter(q => q.type === "mc");
  TOPICS.forEach(t =>
    assert.ok(mcs.filter(q => q.topic === t).length >= 2, `${t} has >= 2 questions`));
});

test("0017 quiz options have equal word counts and the answer position varies", () => {
  const { mc } = lessonQuestions("0017");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0017 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0017").oral);
});

test("0017 has a 'jelaskan alur login aplikasi Anda' oral covering frontend and backend", () => {
  const orals = loadLesson("0017").select({ lessons: ["0017"] }).filter(q => q.type === "oral");
  const login = orals.find(q => /alur login/i.test(q.prompt));
  assert.ok(login, "login-flow oral exists");
  const text = login.checklist.join(" ");
  assert.match(text, /interceptor/i, "frontend: interceptor");
  assert.match(text, /UseAuthentication|\[Authorize\]/, "backend: authn/authz");
});
