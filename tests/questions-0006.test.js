// Run from repo root: node --test
// Loads assets/questions/0006.js into a fresh bank and checks the lesson's quiz rules.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { createBank } = require("../assets/bank.js");

function loadLesson(file) {
  const bank = createBank();
  globalThis.QuestionBank = bank;
  const full = path.join(__dirname, "..", "assets", "questions", file);
  delete require.cache[require.resolve(full)];
  require(full);
  delete globalThis.QuestionBank;
  return bank;
}

const words = html => html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;

test("0006 registers mc and oral questions for lesson 0006 with labelled topics", () => {
  const bank = loadLesson("0006.js");
  const qs = bank.select({ lessons: ["0006"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0006-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0006 mc options have equal word counts and answer positions vary", () => {
  const mc = loadLesson("0006.js").select({ lessons: ["0006"] }).filter(q => q.type === "mc");
  mc.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id}: jumlah kata opsi berbeda (${counts})`);
  });
  const positions = mc.map(q => Object.keys(q.options).indexOf(q.answer));
  assert.ok(new Set(positions).size >= 4, "posisi jawaban benar harus bervariasi");
  positions.slice(1).forEach((p, i) => assert.notEqual(p, positions[i], `posisi sama berturut-turut di ${mc[i + 1].id}`));
});

test("0006 oral questions have a 6-point checklist and a sample answer", () => {
  const oral = loadLesson("0006.js").select({ lessons: ["0006"] }).filter(q => q.type === "oral");
  oral.forEach(q => {
    assert.equal(q.checklist.length, 6, q.id);
    assert.ok(q.sample, q.id);
  });
});

test("0006 covers change tracking, Migration, N+1, and AsNoTracking (mc and oral)", () => {
  const qs = loadLesson("0006.js").select({ lessons: ["0006"] });
  const mc = qs.filter(q => q.type === "mc");
  ["ef-tracking", "ef-migration", "ef-n-plus-1", "ef-no-tracking"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "ef-n-plus-1"), "butuh soal lisan N+1");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "ef-tracking"), "butuh soal lisan change tracking");
});
