// Run from repo root: node --test
// Track System Design, modul Skalabilitas (0005–0007): cakupan topik, sitasi, diagram, "Kapan tidak perlu".
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0005": { file: "0005-vertical-horizontal-stateless.html", topics: ["skala-vertical-horizontal", "skala-stateless"] },
  "0006": { file: "0006-load-balancer.html", topics: ["skala-lb-layer", "skala-lb-algoritma"] },
  "0007": { file: "0007-reverse-proxy-dan-cdn.html", topics: ["skala-reverse-proxy", "skala-cdn"] },
};
const NUMS = Object.keys(LESSONS);

test("modul Skalabilitas: topics, prefix, >=2 mc per topic, orals", () => {
  sd.assertModuleTopics(LESSONS, "skala-");
});

test("modul Skalabilitas covers the spec keywords per lesson", () => {
  const KEYWORDS = {
    "0005": ["vertical", "horizontal", "stateless", "session"],
    "0006": ["L4", "L7", "round robin", "least connections", "hash", "health check", "sticky session"],
    "0007": ["reverse proxy", "API gateway", "CDN", "push", "pull", "edge"],
  };
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    KEYWORDS[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("each lesson: one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, Kapan tidak perlu", () => {
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Skalabilitas · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.match(html, /<h2>[^<]*Kapan tidak perlu[^<]*<\/h2>/, `${n}: butuh h2 Kapan tidak perlu`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
});

test("modul Skalabilitas nav: 0004 → 0005 → 0006 → 0007 → 0008", () => {
  const files = ["0004-estimasi-back-of-envelope.html", ...NUMS.map(n => LESSONS[n].file), "0008-sql-vs-nosql.html"];
  NUMS.forEach((n, i) => {
    const nav = (sd.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});

test("modul Skalabilitas lessons are listed as tersedia in the index", () => {
  const index = fs.readFileSync(path.join(ROOT, "sysdesign", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index, new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});
