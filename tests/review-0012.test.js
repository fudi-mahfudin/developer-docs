// Run from repo root: node --test
// Seam 0012: review campuran Hari 2 menarik soal dari lesson 0008–0011,
// ditambah topik Hari 1 di data-topics (topik lemah review 0007, atau daftar default sebelum hasil 0007 ada).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createBank, draw, seededRandom } = require("../assets/bank.js");

const ROOT = path.join(__dirname, "..");
const DAY1 = ["0001", "0002", "0003", "0004", "0005", "0006"];
const DAY2 = ["0008", "0009", "0010", "0011"];
const html = fs.readFileSync(path.join(ROOT, "lessons", "0012-review-hari-2.html"), "utf8");

// Load question files into one shared bank, as the browser does with several <script> tags.
function loadTogether(nums) {
  const bank = createBank();
  globalThis.QuestionBank = bank;
  try {
    nums.forEach(n => {
      const full = path.join(ROOT, "assets", "questions", `${n}.js`);
      delete require.cache[require.resolve(full)];
      require(full);
    });
  } finally {
    delete globalThis.QuestionBank;
  }
  return bank;
}

const reviewAttrs = () => {
  const tag = html.match(/<div class="review"[^>]*>/);
  assert.ok(tag, "halaman 0012 harus punya <div class=\"review\">");
  const attr = name => (tag[0].match(new RegExp(`data-${name}="([^"]*)"`)) || [])[1];
  const list = s => (s || "").split(",").map(x => x.trim()).filter(Boolean);
  return { lessons: list(attr("lessons")), topics: list(attr("topics")),
           mc: Number(attr("mc")), oral: Number(attr("oral")) };
};

const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const loadedLessons = scripts.map(s => (s.match(/questions\/(\d{4})\.js$/) || [])[1]).filter(Boolean);

test("Day 1 and Day 2 question files run together as browser scripts (shared global scope, no name clashes)", () => {
  const vm = require("node:vm");
  const ctx = vm.createContext({});
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(path.join(ROOT, "assets", "bank.js"), "utf8"), ctx);
  DAY1.concat(DAY2).forEach(n => {
    const file = path.join(ROOT, "assets", "questions", `${n}.js`);
    assert.doesNotThrow(() => vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file }), `questions/${n}.js`);
  });
});

test("0012 review sources lessons 0008–0011 and loads each question file before review.js", () => {
  assert.deepEqual(reviewAttrs().lessons.sort(), DAY2);
  const at = src => scripts.indexOf(src);
  assert.ok(at("../assets/bank.js") >= 0, "bank.js belum dimuat");
  loadedLessons.forEach(n => {
    assert.ok(at(`../assets/questions/${n}.js`) > at("../assets/bank.js"), `questions/${n}.js belum dimuat setelah bank.js`);
    assert.ok(at(`../assets/questions/${n}.js`) < at("../assets/review.js"), `questions/${n}.js harus sebelum review.js`);
  });
  DAY2.forEach(n => assert.ok(loadedLessons.includes(n), `questions/${n}.js belum dimuat`));
});

test("every Day 1 topic in data-topics exists, has a quiz question, and its question file is loaded", () => {
  const { topics } = reviewAttrs();
  assert.ok(topics.length >= 1, "data-topics harus berisi topik Hari 1 (topik lemah 0007 atau daftar default)");
  const day1 = loadTogether(DAY1).select({ lessons: DAY1 });
  topics.forEach(t => {
    const qs = day1.filter(q => q.topic === t);
    assert.ok(qs.length, `topik "${t}" bukan topik Hari 1`);
    assert.ok(qs.some(q => q.type === "mc"), `topik "${t}" tidak punya soal kuis`);
    assert.ok(loadedLessons.includes(qs[0].lesson), `topik "${t}" butuh <script> questions/${qs[0].lesson}.js`);
  });
});

test("0012 draws one quiz question from every Day 2 topic and every listed Day 1 topic, mixed with oral questions", () => {
  const { lessons, topics, mc, oral } = reviewAttrs();
  const pool = loadTogether(loadedLessons).select({ lessons, topics });
  const mcTopics = new Set(pool.filter(q => q.type === "mc").map(q => q.topic));
  assert.ok(oral >= 1, "review harus memuat soal lisan");
  assert.equal(mc, mcTopics.size, "data-mc harus sama dengan jumlah topik kuis (Hari 2 + data-topics)");
  for (let seed = 1; seed <= 10; seed++) {
    const got = draw(pool, { mc, oral }, seededRandom(seed));
    const drawnTopics = new Set(got.filter(q => q.type === "mc").map(q => q.topic));
    assert.deepEqual([...drawnTopics].sort(), [...mcTopics].sort(), `seed ${seed}: ada topik tanpa soal kuis`);
    topics.forEach(t => assert.ok(drawnTopics.has(t), `seed ${seed}: topik Hari 1 "${t}" tidak tertarik`));
    assert.equal(got.filter(q => q.type === "oral").length, oral);
  }
});

test("0012 uses the same pass criterion as 0007 (quiz right and oral at least 4 of 6)", () => {
  assert.match(html, /minimal 4 dari 6 poin checklist/);
});

test("0012 navigation links back to 0011 and forward to 0013", () => {
  assert.match(html, /href="0011-clean-architecture\.html"/);
  assert.match(html, /href="0013-angular-dasar\.html"/);
});
