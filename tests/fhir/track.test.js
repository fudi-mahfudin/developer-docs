// Run from repo root: node --test
// Track FHIR (fhir/): aturan teach untuk setiap bank soal fhir/assets/questions/NNNN.js, dan
// setiap lesson yang "tersedia" di fhir/index.html ada, memuat komponen bersama dari ../../assets/,
// memuat bank soalnya sendiri, dan bernavigasi ke lesson sebelum/sesudahnya. Lesson ±20 menit, self-paced (ADR 0002).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

const fhir = forTrack("fhir");
const read = f => fs.readFileSync(path.join(ROOT, "fhir", f), "utf8");
const questionNums = fs.readdirSync(path.join(ROOT, "fhir", "assets", "questions"))
  .filter(f => /^\d{4}\.js$/.test(f)).map(f => f.slice(0, 4)).sort();
const index = read("index.html");
const lessons = [...index.matchAll(/<li class="tersedia[^"]*"><span class="num">(\d{4})<\/span><a class="title" href="(lessons\/[\w-]+\.html)">/g)]
  .map(m => ({ num: m[1], href: m[2] }));
const nums = [...index.matchAll(/<span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
const LAST = nums[nums.length - 1];
const SEAMS = ["0012", "0021", "0027"];

test("fhir index lists lessons 0001–0029 in order, with the three delayed reviews as seams", () => {
  assert.deepEqual(nums, Array.from({ length: 29 }, (_, i) => String(i + 1).padStart(4, "0")));
  const seams = [...index.matchAll(/<li class="[a-z]+ seam"><span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
  assert.deepEqual(seams, SEAMS);
});

test("fhir track has no one-day deadline or clock slots left", () => {
  ["index.html", "MISSION.md", "ROADMAP.md"].forEach(f =>
    assert.doesNotMatch(read(f), /1 hari|6–8 jam|malam sebelum interview|\b\d{2}\.\d{2}–\d{2}\.\d{2}\b/, `${f} masih menyebut deadline`));
  lessons.forEach(({ href }) => {
    const kicker = (read(href).match(/<div class="kicker">([^<]*)</) || [])[1] || "";
    assert.match(kicker, /^Lesson \d{4} · FHIR · /, `${href}: format kicker`);
    assert.doesNotMatch(kicker, /\d{2}\.\d{2}–\d{2}\.\d{2}|malam/, `${href}: kicker masih memakai jam`);
  });
});

test("all fhir question files run together as browser scripts", () => {
  fhir.runAsBrowserScripts(questionNums);
});

questionNums.forEach(num => {
  test(`fhir ${num}: questions follow the teach rules`, () => {
    const { bank, qs, mc, oral } = fhir.lessonQuestions(num);
    assert.ok(mc.length >= 4, "butuh >= 4 soal kuis");
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
    if (num !== LAST) assert.match(nav, new RegExp(`href="${next}-[\\w-]+\\.html"`), `nav belum menautkan ${next}`);
  });
});
