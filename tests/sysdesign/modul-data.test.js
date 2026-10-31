// Run from repo root: node --test
// Track System Design, modul Data (0008–0011): cakupan topik, sitasi primer, diagram, "Kapan tidak perlu".
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0008": { file: "0008-sql-vs-nosql.html", topics: ["data-model-db", "data-acid-base"],
    keywords: ["relasional", "key-value", "document", "wide-column", "graph", "ACID", "BASE"] },
  "0009": { file: "0009-index-dan-replication.html", topics: ["data-index", "data-replikasi"],
    keywords: ["B-tree", "leader", "follower", "synchronous", "asynchronous", "replication lag", "read replica"] },
  "0010": { file: "0010-sharding-dan-consistent-hashing.html", topics: ["data-partisi", "data-consistent-hash"],
    keywords: ["partitioning", "range", "hash", "hot partition", "resharding", "consistent hashing", "virtual node"] },
  "0011": { file: "0011-cap-pacelc-consistency.html", topics: ["data-cap-pacelc", "data-konsistensi"],
    keywords: ["CAP", "PACELC", "strong consistency", "eventual consistency", "read-your-writes", "quorum"] },
};
const NUMS = Object.keys(LESSONS);

test("modul Data: own topics with data- prefix, >= 2 mc per topic, >= 1 oral per lesson", () => {
  sd.assertModuleTopics(LESSONS, "data-");
});

test("modul Data topic slugs are recorded in the glossary", () => {
  const glossary = fs.readFileSync(path.join(ROOT, "sysdesign", "GLOSSARY.md"), "utf8");
  const data = (glossary.match(/## Data\n([\s\S]*?)\n## /) || [])[1] || "";
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(data.includes(`\`${t}\``), `GLOSSARY ## Data belum mencatat ${t}`));
});

test("each modul Data lesson covers the spec keywords", () => {
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    LESSONS[n].keywords.forEach(k => assert.ok(html.includes(k), `${n}: belum membahas ${k}`));
  });
});

test("each modul Data lesson: one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, Kapan tidak perlu", () => {
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Data · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    assert.ok((html.match(/<marker id="panah"/g) || []).length <= 1, `${n}: marker panah hanya sekali per halaman`);
    LESSONS[n].topics.forEach(t =>
      assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: belum ada kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.match(html, /<h2>[^<]*Kapan tidak perlu[^<]*<\/h2>/, `${n}: butuh h2 Kapan tidak perlu`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
});

test("modul Data nav: 0007 → 0008 → 0009 → 0010 → 0011 → 0012", () => {
  const files = ["0007-reverse-proxy-dan-cdn.html", ...NUMS.map(n => LESSONS[n].file), "0012-review-fondasi-skalabilitas.html"];
  NUMS.forEach((n, i) => {
    const nav = (sd.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});

test("modul Data lessons are listed as tersedia in the sysdesign index", () => {
  const index = fs.readFileSync(path.join(ROOT, "sysdesign", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`), `${n}: belum tersedia di index`));
});
