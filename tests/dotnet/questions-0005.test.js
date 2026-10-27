// Run from repo root: node --test
// Loads dotnet/assets/questions/0005.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

test("0005 registers mc and oral questions for lesson 0005 with labelled topics", () => {
  const bank = loadLesson("0005");
  const qs = bank.select({ lessons: ["0005"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 10);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0005-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0005 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0005");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0005 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0005").oral);
});

test("0005 covers pipeline, order, scoped-in-middleware, layered config and Options Pattern", () => {
  const qs = loadLesson("0005").select({ lessons: ["0005"] });
  const mc = qs.filter(q => q.type === "mc");
  ["mw-pipeline", "mw-order", "mw-scoped", "config-layers", "options-pattern"].forEach(t =>
    assert.ok(mc.some(q => q.topic === t), `butuh soal kuis untuk topik ${t}`));
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "mw-order"), "butuh soal lisan request lifecycle / urutan middleware");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "config-layers"), "butuh soal lisan konfigurasi dan secret");
});
