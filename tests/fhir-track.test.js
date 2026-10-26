// Run from repo root: node --test
// Track FHIR (fhir/): aturan teach untuk setiap bank soal fhir/assets/questions/NNNN.js, dan
// setiap lesson yang "tersedia" di fhir/index.html ada, memuat komponen bersama dari ../../assets/,
// memuat bank soalnya sendiri, dan bernavigasi ke lesson sebelum/sesudahnya.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("./helpers.js");

const fhir = forTrack("fhir");
const read = f => fs.readFileSync(path.join(ROOT, "fhir", f), "utf8");
const questionNums = fs.readdirSync(path.join(ROOT, "fhir", "assets", "questions"))
  .filter(f => /^\d{4}\.js$/.test(f)).map(f => f.slice(0, 4)).sort();
const index = read("index.html");
const lessons = [...index.matchAll(/<li class="tersedia[^"]*"><span class="num">(\d{4})<\/span><a class="title" href="(lessons\/[\w-]+\.html)">/g)]
  .map(m => ({ num: m[1], href: m[2] }));

test("fhir index lists six lessons with 0006 as the seam", () => {
  const nums = [...index.matchAll(/<span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
  assert.deepEqual(nums, ["0001", "0002", "0003", "0004", "0005", "0006"]);
  assert.match(index, /<li class="[a-z]+ seam"><span class="num">0006<\/span>/);
});

test("all fhir question files run together as browser scripts", () => {
  fhir.runAsBrowserScripts(questionNums);
});

questionNums.forEach(num => {
  test(`fhir ${num}: questions follow the teach rules`, () => {
    const { bank, qs, mc, oral } = fhir.lessonQuestions(num);
    if (num !== "0006") assert.ok(mc.length >= 8, "butuh >= 8 soal kuis");
    qs.forEach(q => {
      assert.match(q.id, new RegExp(`^${num}-`));
      assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
    });
    assertEqualOptionWords(mc);
    if (mc.length) assertAnswerPositionsVary(mc);
    assertOralFormat(oral);
  });
});

lessons.forEach(({ num, href }) => {
  test(`fhir ${num}: lesson page exists, loads shared assets and links its neighbours`, () => {
    const html = read(href);
    assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    scripts.filter(s => !s.startsWith("../assets/questions/")).forEach(s =>
      assert.match(s, /^\.\.\/\.\.\/assets\/[\w-]+\.js$/, `${s}: komponen bersama harus dari ../../assets/`));
    scripts.filter(s => s.startsWith("../assets/questions/")).forEach(s =>
      assert.ok(fs.existsSync(path.join(ROOT, "fhir", "lessons", s)), `${s} tidak ada`));
    if (questionNums.includes(num)) assert.ok(scripts.includes(`../assets/questions/${num}.js`), `lesson belum memuat bank soal ${num}`);
    const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const prev = String(Number(num) - 1).padStart(4, "0");
    const next = String(Number(num) + 1).padStart(4, "0");
    if (num !== "0001") assert.match(nav, new RegExp(`href="${prev}-[\\w-]+\\.html"`), `nav belum menautkan ${prev}`);
    if (num !== "0006") assert.match(nav, new RegExp(`href="${next}-[\\w-]+\\.html"`), `nav belum menautkan ${next}`);
  });
});
