// Run from repo root: node --test
// Loads assets/questions/0011.js into a fresh bank and checks the lesson's quiz rules.
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

test("0011 registers mc and oral questions for lesson 0011 with labelled topics", () => {
  const bank = loadLesson("0011.js");
  const qs = bank.select({ lessons: ["0011"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0011-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0011 mc options have equal word counts and answer positions vary", () => {
  const mc = loadLesson("0011.js").select({ lessons: ["0011"] }).filter(q => q.type === "mc");
  mc.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id}: jumlah kata opsi berbeda (${counts})`);
  });
  const positions = mc.map(q => Object.keys(q.options).indexOf(q.answer));
  assert.ok(new Set(positions).size >= 4, "posisi jawaban benar harus bervariasi");
  positions.slice(1).forEach((p, i) => assert.notEqual(p, positions[i], `posisi sama berturut-turut di ${mc[i + 1].id}`));
});

test("0011 oral questions have a 6-point checklist and a sample answer", () => {
  const oral = loadLesson("0011.js").select({ lessons: ["0011"] }).filter(q => q.type === "oral");
  oral.forEach(q => {
    assert.equal(q.checklist.length, 6, q.id);
    assert.ok(q.sample, q.id);
  });
});

test("0011 covers dependency rule, interface placement, layered comparison, and the Repository debate", () => {
  const qs = loadLesson("0011.js").select({ lessons: ["0011"] });
  const topics = new Set(qs.map(q => q.topic));
  ["ca-dependency-rule", "ca-placement", "ca-vs-layered", "repo-ef-core"].forEach(t =>
    assert.ok(topics.has(t), `topik ${t} belum ada`));
  assert.ok(qs.filter(q => q.topic === "repo-ef-core" && q.type === "mc").length >= 3,
    "debat Repository butuh minimal 3 soal kuis (pro, kontra, kapan tidak perlu)");
  const oral = qs.filter(q => q.type === "oral");
  assert.ok(oral.some(q => /Clean Architecture/.test(q.prompt)), "lisan harus menargetkan Clean Architecture");
  assert.ok(oral.some(q => /Repository/.test(q.prompt)), "lisan harus menargetkan debat Repository");
});
