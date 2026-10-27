// Run from repo root: node --test
// Track FHIR: tiga review tertunda (ADR 0002). Setiap review menarik tepat satu kuis per topik dari modul yang diuji,
// dicampur 3 soal lisan. Review 0027 memuat semua bank supaya topik lemah Review 1–2 bisa dipilih lewat data-topics.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { draw, seededRandom } = require("../../assets/bank.js");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i).padStart(4, "0"));
const lessonFile = num => fs.readdirSync(path.join(ROOT, "fhir", "lessons")).find(f => f.startsWith(`${num}-`));

const REVIEWS = [
  { num: "0012", sources: range(1, 7), prefixes: ["dasar-", "res-"] },
  { num: "0021", sources: [...range(8, 11), ...range(13, 16)], prefixes: ["rest-", "bulk-"] },
  { num: "0027", sources: [...range(17, 20), ...range(22, 26)], prefixes: ["smart-", "ss-", "pdp-"], allBanks: true },
];

REVIEWS.forEach(({ num, sources, prefixes, allBanks }) => {
  const file = lessonFile(num);
  const html = file ? fs.readFileSync(path.join(ROOT, "fhir", "lessons", file), "utf8") : "";
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const loaded = scripts.map(s => (s.match(/^\.\.\/assets\/questions\/(\d{4})\.js$/) || [])[1]).filter(Boolean);
  const attrs = () => {
    const tags = html.match(/<div class="review"[^>]*>/g) || [];
    assert.equal(tags.length, 1, `${num} harus punya tepat satu <div class="review">`);
    const attr = name => (tags[0].match(new RegExp(`data-${name}="([^"]*)"`)) || [])[1];
    const list = s => (s || "").split(",").map(x => x.trim()).filter(Boolean);
    return { lessons: list(attr("lessons")), topics: list(attr("topics")), mc: Number(attr("mc")), oral: Number(attr("oral")) };
  };

  test(`fhir review ${num} sources the right modules and loads their banks between bank.js and review.js`, () => {
    assert.ok(file, `lesson ${num} belum ada`);
    assert.deepEqual(attrs().lessons, sources);
    const expected = allBanks ? fs.readdirSync(path.join(ROOT, "fhir", "assets", "questions")).map(f => f.slice(0, 4)).sort() : sources;
    assert.deepEqual(loaded, expected);
    const at = src => scripts.indexOf(src);
    loaded.forEach(n => {
      assert.ok(at(`../assets/questions/${n}.js`) > at("../../assets/bank.js"));
      assert.ok(at(`../assets/questions/${n}.js`) < at("../../assets/review.js"));
    });
  });

  test(`fhir review ${num} draws exactly one quiz per topic plus three oral questions`, () => {
    const { lessons, topics, mc, oral } = attrs();
    const pool = fhir.loadLesson(...loaded).select({ lessons, topics });
    pool.forEach(q => assert.ok(topics.includes(q.topic) || prefixes.some(p => q.topic.startsWith(p)), `${q.id}: topik ${q.topic} di luar modul`));
    const mcTopics = new Set(pool.filter(q => q.type === "mc").map(q => q.topic));
    assert.equal(mc, mcTopics.size, "data-mc harus sama dengan jumlah topik kuis di pool");
    assert.equal(oral, 3);
    assert.ok(pool.filter(q => q.type === "oral").length >= oral, "soal lisan di pool kurang dari data-oral");
    for (let seed = 1; seed <= 10; seed++) {
      const got = draw(pool, { mc, oral }, seededRandom(seed));
      const drawn = got.filter(q => q.type === "mc").map(q => q.topic);
      assert.deepEqual([...new Set(drawn)].sort(), [...mcTopics].sort(), `seed ${seed}: ada topik tanpa kuis atau topik ganda`);
      assert.equal(drawn.length, mcTopics.size);
    }
  });

  test(`fhir review ${num} states the per-topic pass rule and how to report the result`, () => {
    assert.match(html, /minimal 2\/3 poin checklist/);
    assert.match(html, /laporkan hasilnya ke agent/);
    assert.match(html, /learning record/);
    assert.match(html, new RegExp(`Topik lemah FHIR ${num}`));
  });
});
