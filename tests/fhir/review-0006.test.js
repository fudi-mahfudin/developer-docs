// Run from repo root: node --test
// Seam FHIR 0006: review campuran menarik soal dari lesson FHIR 0001–0005, satu kuis per topik, dicampur soal lisan.
// Pola: tests/review-0012.test.js. Bank soal 0006 (topik ss-) ikut dimuat untuk kuis bagian 1, tapi tidak masuk pool review.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { draw, seededRandom } = require("../../assets/bank.js");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const SOURCES = ["0001", "0002", "0003", "0004", "0005"];
const html = fs.readFileSync(path.join(ROOT, "fhir", "lessons", "0006-satusehat-dan-review.html"), "utf8");

const reviewAttrs = () => {
  const tags = html.match(/<div class="review"[^>]*>/g) || [];
  assert.equal(tags.length, 1, "halaman 0006 harus punya tepat satu <div class=\"review\">");
  const attr = name => (tags[0].match(new RegExp(`data-${name}="([^"]*)"`)) || [])[1];
  const list = s => (s || "").split(",").map(x => x.trim()).filter(Boolean);
  return { lessons: list(attr("lessons")), topics: list(attr("topics")),
           mc: Number(attr("mc")), oral: Number(attr("oral")) };
};

const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const loadedLessons = scripts.map(s => (s.match(/^\.\.\/assets\/questions\/(\d{4})\.js$/) || [])[1]).filter(Boolean);

test("fhir question files 0001–0006 run together as browser scripts (shared global scope, no name clashes)", () => {
  fhir.runAsBrowserScripts(SOURCES.concat("0006"));
});

test("0006 review sources lessons 0001–0005 and loads question files 0001–0006 between bank.js and review.js", () => {
  assert.deepEqual(reviewAttrs().lessons.sort(), SOURCES);
  const at = src => scripts.indexOf(src);
  assert.ok(at("../../assets/bank.js") >= 0, "bank.js belum dimuat");
  assert.ok(at("../../assets/review.js") >= 0, "review.js belum dimuat");
  assert.deepEqual(loadedLessons, SOURCES.concat("0006"), "muat questions/0001.js–0006.js berurutan");
  loadedLessons.forEach(n => {
    assert.ok(at(`../assets/questions/${n}.js`) > at("../../assets/bank.js"), `questions/${n}.js belum dimuat setelah bank.js`);
    assert.ok(at(`../assets/questions/${n}.js`) < at("../../assets/review.js"), `questions/${n}.js harus sebelum review.js`);
  });
});

test("0006 draws exactly one quiz question from every 0001–0005 topic, mixed with at least five oral questions", () => {
  const { lessons, topics, mc, oral } = reviewAttrs();
  const pool = fhir.loadLesson(...loadedLessons).select({ lessons, topics });
  assert.ok(pool.every(q => SOURCES.includes(q.lesson)), "pool review hanya dari lesson 0001–0005");
  const mcTopics = new Set(pool.filter(q => q.type === "mc").map(q => q.topic));
  assert.equal(mc, mcTopics.size, "data-mc harus sama dengan jumlah topik kuis di pool");
  assert.ok(oral >= 5, "data-oral harus >= 5");
  assert.ok(pool.filter(q => q.type === "oral").length >= oral, "soal lisan di pool kurang dari data-oral");
  for (let seed = 1; seed <= 10; seed++) {
    const got = draw(pool, { mc, oral }, seededRandom(seed));
    const drawn = got.filter(q => q.type === "mc").map(q => q.topic);
    assert.equal(drawn.length, mcTopics.size, `seed ${seed}: jumlah kuis`);
    assert.deepEqual([...new Set(drawn)].sort(), [...mcTopics].sort(), `seed ${seed}: ada topik tanpa soal kuis atau topik ganda`);
    assert.equal(got.filter(q => q.type === "oral").length, oral);
  }
});

test("0006 uses the same pass criterion as the root seams and explains how to report the result", () => {
  assert.match(html, /minimal 4 dari 6 poin checklist/);
  assert.match(html, /laporkan hasilnya ke agent/);
  assert.match(html, /learning record/);
});

test("0006 navigation links back to 0005 and forward to 0007", () => {
  const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav, /href="0005-smart-on-fhir\.html"/);
  assert.match(nav, /href="0007-pdp-data-di-monitoring\.html"/);
});
