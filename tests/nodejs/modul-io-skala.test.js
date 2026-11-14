// Run from repo root: node --test
// Track Node.js, modul I/O & skala (0008–0011): cakupan topik, sitasi, diagram/kode, label versi, glossary, resources.
// Aturan umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga, sumber primer) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0008": { file: "0008-streams.html", topics: ["io-stream-jenis", "io-stream-pipeline"] },
  "0009": { file: "0009-backpressure-dan-buffer.html", topics: ["io-backpressure", "io-buffer"] },
  "0010": { file: "0010-worker-cluster-child-process.html", topics: ["io-worker-threads", "io-cluster-proses"] },
  "0011": { file: "0011-memory-leak-dan-profiling.html", topics: ["io-memory-leak", "io-profiling"] },
};
const NUMS = Object.keys(LESSONS);

test("modul I/O & skala: topics, io- prefix, >=2 mc per topic, >=1 oral per lesson", () => {
  nj.assertModuleTopics(LESSONS, "io-");
});

test("modul I/O & skala covers the spec keywords per lesson", () => {
  const KEYWORDS = {
    "0008": ["Readable", "Writable", "Duplex", "Transform", "stream.pipeline", "readFile", "for await"],
    "0009": ["highWaterMark", "write()", "'drain'", "Buffer", "encoding", "pipe"],
    "0010": ["worker_threads", "cluster", "child_process", "CPU-bound", "replika", "container"],
    "0011": ["heap", "--max-old-space-size", "closure", "listener", "heap snapshot", "--inspect", "--cpu-prof"],
  };
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    KEYWORDS[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("version-dependent facts carry a Node version label", () => {
  assert.match(nj.readLesson("0009"), /Node ≥ 22/, "0009: default highWaterMark 64 KiB berubah di v22");
  assert.match(nj.readLesson("0011"), /Node ≥ 22\.4/, "0011: --cpu-prof stabil sejak v22.4");
});

test("each lesson: one win, module kicker, cite numbering, diagram or code, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul I/O &amp; skala · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`)));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
  });
});

test("modul I/O & skala nav: 0007 → 0008 → 0009 → 0010 → 0011 → 0012", () => {
  const files = ["0007-eventemitter-dan-abort.html", ...NUMS.map(n => LESSONS[n].file), "0012-review-runtime-async.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});

test("modul I/O & skala lessons are listed as tersedia in the index", () => {
  const index = fs.readFileSync(path.join(ROOT, "nodejs", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});

test("modul I/O & skala glossary and resources sections are filled", () => {
  const section = (file, head) => {
    const txt = fs.readFileSync(path.join(ROOT, "nodejs", file), "utf8");
    return (txt.split(head)[1] || "").split(/\n#{2,3} /)[0];
  };
  const glossary = section("GLOSSARY.md", "\n## I/O & skala\n");
  ["Stream", "stream.pipeline", "Backpressure", "highWaterMark", "Buffer", "Worker thread", "Cluster", "Heap snapshot", "Memory leak"]
    .forEach(t => assert.match(glossary, new RegExp(`\\*\\*${t}[^*]*\\*\\*:`), `GLOSSARY I/O & skala belum punya ${t}`));
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(glossary.includes(t), `slug ${t} belum dicatat di GLOSSARY`));
  const resources = section("RESOURCES.md", "\n### I/O & skala\n");
  NUMS.forEach(n => assert.ok(resources.includes(`lesson ${n}`), `RESOURCES I/O & skala belum menyebut lesson ${n}`));
});
