// Run from repo root: node --test
// Track System Design, modul Caching (0013–0015): cakupan topik, sitasi, diagram, "Kapan tidak perlu".
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0013": { file: "0013-pola-cache.html", topics: ["cache-lokasi", "cache-pola"], component: true },
  "0014": { file: "0014-ttl-eviction-invalidation.html", topics: ["cache-ttl-eviction", "cache-invalidation"], component: true },
  "0015": { file: "0015-thundering-herd-hot-key.html", topics: ["cache-stampede", "cache-hot-key"], component: true },
};
const NUMS = Object.keys(LESSONS);
const read = n => fs.readFileSync(path.join(ROOT, "sysdesign", "lessons", LESSONS[n].file), "utf8");

test("modul Caching: topics, prefix, >=2 mc per topic, orals on the interview-heavy topics", () => {
  NUMS.forEach(n => sd.lessonQuestions(n).qs.forEach(q => {
    assert.match(q.topic, /^cache-/);
    assert.ok(LESSONS[n].topics.includes(q.topic), `${q.id}: topik ${q.topic} bukan milik ${n}`);
  }));
  const mc = NUMS.flatMap(n => sd.lessonQuestions(n).mc);
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(mc.filter(q => q.topic === t).length >= 2, t));
  const oral = NUMS.flatMap(n => sd.lessonQuestions(n).oral);
  ["cache-pola", "cache-invalidation", "cache-stampede"].forEach(t =>
    assert.ok(oral.some(q => q.topic === t), `butuh soal lisan untuk ${t}`));
});

test("modul Caching covers the spec keywords", () => {
  const html = NUMS.map(read).join("\n");
  ["cache-aside", "read-through", "write-through", "write-behind", "TTL", "LRU", "LFU", "invalidation", "stale",
    "cache stampede", "thundering herd", "request coalescing", "hot key", "cache berlapis"]
    .forEach(k => assert.ok(html.includes(k), `belum membahas ${k}`));
});

test("modul Caching banks justify components with numbers in oral checklists", () => {
  NUMS.forEach(n => sd.lessonQuestions(n).oral.forEach(q =>
    assert.ok(q.checklist.some(c => /angka/.test(c)), `${q.id}: checklist butuh poin membenarkan dengan angka`)));
});

test("each lesson: one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, Kapan tidak perlu", () => {
  NUMS.forEach(n => {
    const html = read(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Caching · ±\\d+ menit</div>`));
    const cites = [...html.matchAll(/<sup class="cite"><a [^>]*>\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
    const listed = [...html.matchAll(/<a href="[^"]+">\[(\d+)\] /g)].map(m => Number(m[1]));
    assert.ok(cites.length >= 1, `${n}: butuh >= 1 .cite`);
    assert.deepEqual(listed, listed.map((_, i) => i + 1), `${n}: daftar Sumber harus [1]..[n] berurutan`);
    assert.deepEqual([...new Set(cites)].sort((a, b) => a - b), listed, `${n}: sitasi = daftar Sumber`);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`)));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    if (LESSONS[n].component) assert.match(html, /<h2>[^<]*Kapan tidak perlu[^<]*<\/h2>/, `${n}: butuh h2 Kapan tidak perlu`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
    assert.equal((html.match(/<marker id="panah"/g) || []).length <= 1, true, `${n}: marker panah hanya sekali`);
  });
});

test("modul Caching nav: 0012 → 0013 → 0014 → 0015 → 0016", () => {
  const files = ["0012-review-fondasi-skalabilitas.html", ...NUMS.map(n => LESSONS[n].file), "0016-queue-dan-pubsub.html"];
  NUMS.forEach((n, i) => {
    const nav = (read(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});

test("modul Caching lessons are listed as tersedia in the index", () => {
  const index = fs.readFileSync(path.join(ROOT, "sysdesign", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});

test("modul Caching glossary and resources sections are filled", () => {
  const section = (file, head) => {
    const txt = fs.readFileSync(path.join(ROOT, "sysdesign", file), "utf8");
    return (txt.split(head)[1] || "").split(/\n#{2,3} /)[0];
  };
  const glossary = section("GLOSSARY.md", "\n## Caching\n");
  ["Cache-aside", "Write-behind", "TTL", "Invalidation", "Cache stampede", "Hot key"].forEach(t =>
    assert.match(glossary, new RegExp(`\\*\\*${t}[^*]*\\*\\*:`), `GLOSSARY Caching belum punya ${t}`));
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(glossary.includes(t), `slug ${t} belum dicatat di GLOSSARY`));
  const resources = section("RESOURCES.md", "\n### Caching\n");
  NUMS.forEach(n => assert.ok(resources.includes(`lesson ${n}`), `RESOURCES Caching belum menyebut lesson ${n}`));
});
