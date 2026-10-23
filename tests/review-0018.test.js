// Run from repo root: node --test
// Seam 0018: mock interview final yang dibatasi waktu.
// Bagian konsep = topik lemah 0007/0012 (porsi lebih) + acak dari semua lesson 0001–0017,
// lalu live coding sesuai ROADMAP, 2 cerita STAR, dan jawaban "kenapa pindah stack".
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createBank, draw, seededRandom } = require("../assets/bank.js");
const { parseSegments } = require("../assets/timer.js");

const ROOT = path.join(__dirname, "..");
const CONCEPT = ["0001", "0002", "0003", "0004", "0005", "0006", "0008", "0009", "0010", "0011",
                 "0013", "0014", "0015", "0016", "0017"];
const REVIEWED = CONCEPT.filter(n => n <= "0011"); // lessons covered by reviews 0007 and 0012
const STAR = ["star-insiden", "star-refactor", "star-konflik", "star-belajar"];
const html = fs.readFileSync(path.join(ROOT, "lessons", "0018-star-mock-interview.html"), "utf8");

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

const list = s => (s || "").split(",").map(x => x.trim()).filter(Boolean);
function block(part) {
  const tags = [...html.matchAll(/<div class="review"[^>]*>/g)].map(m => m[0]).filter(t => t.includes(`data-part="${part}"`));
  assert.equal(tags.length, 1, `halaman 0018 harus punya tepat satu <div class="review" data-part="${part}">`);
  const attr = name => (tags[0].match(new RegExp(`data-${name}="([^"]*)"`)) || [])[1];
  return { lessons: list(attr("lessons")), topics: list(attr("topics")), mc: Number(attr("mc") || 0), oral: Number(attr("oral") || 0) };
}

const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const loadedLessons = scripts.map(s => (s.match(/questions\/(\d{4})\.js$/) || [])[1]).filter(Boolean);
const bank = () => loadTogether(loadedLessons);

test("all question files 0001–0018 run together as browser scripts", () => {
  const vm = require("node:vm");
  const ctx = vm.createContext({});
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(path.join(ROOT, "assets", "bank.js"), "utf8"), ctx);
  CONCEPT.concat("0018").forEach(n => {
    const file = path.join(ROOT, "assets", "questions", `${n}.js`);
    assert.doesNotThrow(() => vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file }), `questions/${n}.js`);
  });
});

test("0018 loads every question file 0001–0017 plus 0018 after bank.js and before review.js", () => {
  const at = src => scripts.indexOf(src);
  CONCEPT.concat("0018").forEach(n => {
    assert.ok(at(`../assets/questions/${n}.js`) > at("../assets/bank.js"), `questions/${n}.js belum dimuat setelah bank.js`);
    assert.ok(at(`../assets/questions/${n}.js`) < at("../assets/review.js"), `questions/${n}.js harus sebelum review.js`);
  });
});

test("the random concept part draws from every lesson 0001–0017, quiz and oral mixed", () => {
  const { lessons, topics, mc, oral } = block("acak");
  assert.deepEqual([...lessons].sort(), CONCEPT);
  assert.deepEqual(topics, []);
  assert.ok(mc >= 8 && oral >= 1, "bagian acak butuh cukup soal kuis dan minimal satu lisan");
  const pool = bank().select({ lessons, topics });
  for (let seed = 1; seed <= 10; seed++) {
    const got = draw(pool, { mc, oral }, seededRandom(seed));
    assert.equal(got.filter(q => q.type === "mc").length, mc);
    assert.equal(got.filter(q => q.type === "oral").length, oral);
    assert.ok(got.every(q => CONCEPT.includes(q.lesson)), `seed ${seed}: soal di luar lesson konsep`);
  }
});

test("weak topics from 0007/0012 get their own part: one quiz each, all from reviewed lessons", () => {
  const { lessons, topics, mc, oral } = block("lemah");
  assert.deepEqual(lessons, [], "bagian topik lemah hanya memakai data-topics");
  assert.ok(topics.length >= 1, "data-topics harus berisi topik lemah (atau daftar default)");
  const reviewed = loadTogether(REVIEWED).select({ lessons: REVIEWED });
  topics.forEach(t => {
    const qs = reviewed.filter(q => q.topic === t);
    assert.ok(qs.some(q => q.type === "mc"), `topik "${t}" bukan topik kuis dari lesson 0001–0011`);
  });
  assert.equal(mc, topics.length, "data-mc harus sama dengan jumlah topik lemah");
  const pool = bank().select({ lessons, topics });
  for (let seed = 1; seed <= 10; seed++) {
    const got = draw(pool, { mc, oral }, seededRandom(seed));
    const drawn = got.filter(q => q.type === "mc").map(q => q.topic).sort();
    assert.deepEqual(drawn, [...topics].sort(), `seed ${seed}: setiap topik lemah harus dapat satu soal kuis`);
  }
});

test("live coding part is one oral self-assessment of the ROADMAP exercise", () => {
  const { lessons, topics, mc, oral } = block("live");
  const got = draw(bank().select({ lessons, topics }), { mc, oral }, seededRandom(1));
  assert.equal(got.length, 1);
  assert.equal(got[0].topic, "mock-live-coding");
  assert.match(got[0].prompt, /categoryId/);
  assert.ok(got[0].checklist.length >= 6);
});

test("STAR part draws 2 different stories out of the 4 ROADMAP themes", () => {
  const { lessons, topics, mc, oral } = block("star");
  assert.deepEqual([...topics].sort(), [...STAR].sort());
  assert.equal(oral, 2);
  const pool = bank().select({ lessons, topics });
  STAR.forEach(t => assert.ok(pool.some(q => q.topic === t && q.type === "oral"), `cerita STAR "${t}" belum ada di bank`));
  for (let seed = 1; seed <= 10; seed++) {
    const got = draw(pool, { mc, oral }, seededRandom(seed));
    assert.equal(new Set(got.map(q => q.topic)).size, 2, `seed ${seed}: harus 2 cerita berbeda`);
  }
});

test("'kenapa pindah ke .NET/Angular' is always asked", () => {
  const { lessons, topics, mc, oral } = block("pindah");
  const got = draw(bank().select({ lessons, topics }), { mc, oral }, seededRandom(1));
  assert.deepEqual(got.map(q => q.topic), ["star-pindah-stack"]);
});

test("the mock is timed like ROADMAP: 20 min concepts, 25 min live coding, 15 min STAR", () => {
  const tag = html.match(/<div class="timer" data-segments="([^"]+)"/);
  assert.ok(tag, "halaman 0018 harus punya <div class=\"timer\">");
  assert.deepEqual(parseSegments(tag[1]).map(s => s.ms / 60000), [20, 25, 15]);
  assert.ok(scripts.includes("../assets/timer.js"));
});

test("0018 uses the seam pass criterion and links a printable 'ulang sebelum interview' list", () => {
  assert.match(html, /minimal 4 dari 6 poin checklist/);
  assert.match(html, /href="\.\.\/reference\/ulang-sebelum-interview\.html"/);
  const ref = fs.readFileSync(path.join(ROOT, "reference", "ulang-sebelum-interview.html"), "utf8");
  fs.readdirSync(path.join(ROOT, "reference")).filter(f => f !== "ulang-sebelum-interview.html").forEach(f =>
    assert.ok(ref.includes(`href="${f}"`), `daftar ulang belum menautkan reference/${f}`));
});

test("0018 navigation links back to 0017 and forward to the index", () => {
  assert.match(html, /href="0017-fullstack-auth-cors-error\.html"/);
  assert.match(html, /href="\.\.\/index\.html"/);
});
