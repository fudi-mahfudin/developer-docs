// Run from repo root: node --test
// Loads dotnet/assets/questions/0006.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0006 registers mc and oral questions for lesson 0006 with labelled topics", () => {
  const bank = loadLesson("0006");
  const qs = bank.select({ lessons: ["0006"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0006-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0006 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0006");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0006 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0006").oral);
});

test("0006 covers change tracking, Migration, N+1, and AsNoTracking (mc and oral)", () => {
  const qs = loadLesson("0006").select({ lessons: ["0006"] });
  const mc = qs.filter(q => q.type === "mc");
  ["ef-tracking", "ef-migration", "ef-n-plus-1", "ef-no-tracking"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "ef-n-plus-1"), "butuh soal lisan N+1");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "ef-tracking"), "butuh soal lisan change tracking");
});
