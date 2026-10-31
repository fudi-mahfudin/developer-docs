// Run from repo root: node --test
// Track system design (sysdesign/): aturan ADR 0003 untuk setiap bank soal sysdesign/assets/questions/NNNN.js,
// dan setiap lesson yang "tersedia" di sysdesign/index.html ada, memuat komponen bersama dari ../../assets/,
// memuat bank soalnya sendiri, bernavigasi ke lesson sebelum/sesudahnya, dan tidak merujuk track lain.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

const TRACK = "sysdesign";
const sd = forTrack(TRACK);
const read = f => fs.readFileSync(path.join(ROOT, TRACK, f), "utf8");
const questionNums = fs.readdirSync(path.join(ROOT, TRACK, "assets", "questions"))
  .filter(f => /^\d{4}\.js$/.test(f)).map(f => f.slice(0, 4)).sort();
const index = read("index.html");
const lessons = [...index.matchAll(/<li class="tersedia[^"]*"><span class="num">(\d{4})<\/span><a class="title" href="(lessons\/[\w-]+\.html)">/g)]
  .map(m => ({ num: m[1], href: m[2] }));
const nums = [...index.matchAll(/<span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
const LAST = nums[nums.length - 1];
const SEAMS = ["0012", "0019", "0026", "0035"];
const MOCK = "0036";

test("sysdesign index lists lessons 0001–0036 in order, with the four delayed reviews as seams", () => {
  assert.deepEqual(nums, Array.from({ length: 36 }, (_, i) => String(i + 1).padStart(4, "0")));
  const seams = [...index.matchAll(/<li class="[a-z]+ seam"><span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
  assert.deepEqual(seams, SEAMS);
});

test("sysdesign track is self-paced: no deadline or clock slots", () => {
  ["index.html", "MISSION.md", "ROADMAP.md"].forEach(f =>
    assert.doesNotMatch(read(f), /\b\d hari\b|malam sebelum interview|\b\d{2}\.\d{2}–\d{2}\.\d{2}\b/, `${f} menyebut deadline`));
});

test("sysdesign is linked from the root index and the glossary map", () => {
  assert.match(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), /href="sysdesign\/index\.html"/);
  assert.match(fs.readFileSync(path.join(ROOT, "GLOSSARY-MAP.md"), "utf8"), /sysdesign\/GLOSSARY\.md/);
});

test("all sysdesign question files run together as browser scripts", () => {
  sd.runAsBrowserScripts(questionNums);
});

questionNums.forEach(num => {
  test(`sysdesign ${num}: questions follow the ADR 0003 rules`, () => {
    const { bank, qs, mc, oral } = sd.lessonQuestions(num);
    assert.ok(mc.length >= 4, "butuh >= 4 soal kuis");
    assert.ok(oral.length >= 1, "butuh >= 1 soal lisan");
    qs.forEach(q => {
      assert.match(q.id, new RegExp(`^${num}-`));
      assert.equal(q.lesson, num);
      assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
    });
    assertEqualOptionWords(mc);
    assertAnswerPositionsVary(mc);
    assertOralFormat(oral);
  });
});

lessons.forEach(({ num, href }) => {
  test(`sysdesign ${num}: lesson page exists, loads shared assets, links its neighbours, stays self-contained`, () => {
    const html = read(href);
    assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
    const kicker = (html.match(/<div class="kicker">([^<]*)</) || [])[1] || "";
    assert.match(kicker, /^Lesson \d{4} · System Design · /, `${href}: format kicker`);
    if (num === MOCK) assert.match(kicker, /opsional/, `${href}: mock harus ditandai opsional`);
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    scripts.filter(s => !s.startsWith("../assets/questions/")).forEach(s =>
      assert.match(s, /^\.\.\/\.\.\/assets\/[\w-]+\.js$/, `${s}: komponen bersama harus dari ../../assets/`));
    scripts.filter(s => s.startsWith("../assets/questions/")).forEach(s =>
      assert.ok(fs.existsSync(path.join(ROOT, TRACK, "lessons", s)), `${s} tidak ada`));
    assert.ok(scripts.includes(`../assets/questions/${num}.js`), `lesson belum memuat bank soal ${num}`);
    assert.doesNotMatch(html, /href="[^"]*\.\.\/(dotnet|fhir)\//, `${href}: track mandiri, jangan menautkan track lain`);
    const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const prev = String(Number(num) - 1).padStart(4, "0");
    const next = String(Number(num) + 1).padStart(4, "0");
    if (num !== "0001") assert.match(nav, new RegExp(`href="${prev}-[\\w-]+\\.html"`), `nav belum menautkan ${prev}`);
    if (num !== LAST) assert.match(nav, new RegExp(`href="${next}-[\\w-]+\\.html"`), `nav belum menautkan ${next}`);
  });
});
