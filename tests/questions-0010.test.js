// Run from repo root: node --test
// Loads assets/questions/0010.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("./helpers.js");

test("0010 registers mc and oral questions for lesson 0010 with labelled topics", () => {
  const bank = loadLesson("0010");
  const qs = bank.select({ lessons: ["0010"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0010-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0010 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0010");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0010 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0010").oral);
});

test("0010 covers test types, test doubles, WebApplicationFactory, and what to mock, with orals on both targets", () => {
  const qs = loadLesson("0010").select({ lessons: ["0010"] });
  ["test-jenis", "test-double", "test-waf", "test-mock-apa"].forEach(t =>
    assert.ok(qs.filter(q => q.topic === t && q.type === "mc").length >= 2, `topik ${t} butuh minimal 2 soal kuis`));
  const oral = qs.filter(q => q.type === "oral");
  assert.ok(oral.some(q => /integration test/i.test(q.prompt)), "lisan harus menargetkan unit vs integration test");
  assert.ok(oral.some(q => /stub/i.test(q.prompt) && /fake/i.test(q.prompt)), "lisan harus menargetkan mock vs stub vs fake");
});
