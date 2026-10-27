// Run from repo root: node --test
// Seam 0007: review campuran Hari 1 menarik soal dari lesson 0001–0006.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { draw, seededRandom } = require("../../assets/bank.js");
const { ROOT, loadLesson, runAsBrowserScripts } = require("../helpers.js");

const DAY1 = ["0001", "0002", "0003", "0004", "0005", "0006"];
const html = fs.readFileSync(path.join(ROOT, "dotnet", "lessons", "0007-review-hari-1.html"), "utf8");

const reviewAttrs = () => {
  const tag = html.match(/<div class="review"[^>]*>/);
  assert.ok(tag, "halaman 0007 harus punya <div class=\"review\">");
  const attr = name => (tag[0].match(new RegExp(`data-${name}="([^"]*)"`)) || [])[1];
  return { lessons: (attr("lessons") || "").split(",").map(s => s.trim()).filter(Boolean),
           mc: Number(attr("mc")), oral: Number(attr("oral")) };
};

test("all Day 1 question files load into one bank without id collisions", () => {
  assert.doesNotThrow(() => loadLesson(...DAY1));
});

test("Day 1 question files run together as browser scripts (shared global scope, no name clashes)", () => {
  const pageBank = runAsBrowserScripts(DAY1);
  const lessons = new Set(pageBank.select({ lessons: DAY1 }).map(q => q.lesson));
  assert.deepEqual([...lessons].sort(), DAY1);
});

test("0007 review covers lessons 0001–0006 and loads each question file before review.js", () => {
  assert.deepEqual(reviewAttrs().lessons.sort(), DAY1);
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const at = src => scripts.indexOf(src);
  assert.ok(at("../../assets/bank.js") >= 0, "bank.js belum dimuat");
  DAY1.forEach(n => {
    assert.ok(at(`../assets/questions/${n}.js`) > at("../../assets/bank.js"), `questions/${n}.js belum dimuat setelah bank.js`);
    assert.ok(at(`../assets/questions/${n}.js`) < at("../../assets/review.js"), `questions/${n}.js harus sebelum review.js`);
  });
});

test("0007 draws one quiz question from every Day 1 topic and mixes in oral questions", () => {
  const { lessons, mc, oral } = reviewAttrs();
  const pool = loadLesson(...DAY1).select({ lessons });
  const mcTopics = new Set(pool.filter(q => q.type === "mc").map(q => q.topic));
  assert.ok(oral >= 1, "review harus memuat soal lisan");
  for (let seed = 1; seed <= 10; seed++) {
    const got = draw(pool, { mc, oral }, seededRandom(seed));
    const drawnTopics = new Set(got.filter(q => q.type === "mc").map(q => q.topic));
    assert.deepEqual([...drawnTopics].sort(), [...mcTopics].sort(), `seed ${seed}: ada topik tanpa soal kuis`);
    assert.equal(got.filter(q => q.type === "oral").length, oral);
    assert.ok(new Set(got.map(q => q.lesson)).size === DAY1.length, `seed ${seed}: tidak semua lesson terwakili`);
  }
});

test("0007 navigation links back to 0006 and forward to 0008", () => {
  assert.match(html, /href="0006-ef-core-dan-star\.html"/);
  assert.match(html, /href="0008-solid\.html"/);
});
