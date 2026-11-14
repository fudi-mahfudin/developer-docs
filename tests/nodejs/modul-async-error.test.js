// Run from repo root: node --test
// Track Node.js, modul Async & error (0005–0007): cakupan topik, sitasi, diagram/kode, label versi, glossary, resources.
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0005": { file: "0005-kombinator-promise.html", topics: ["async-kombinator", "async-concurrency"] },
  "0006": { file: "0006-error-handling-async.html", topics: ["async-unhandled", "async-error-design"] },
  "0007": { file: "0007-eventemitter-dan-abort.html", topics: ["async-eventemitter", "async-abort"] },
};
const NUMS = Object.keys(LESSONS);

test("modul Async & error: topics, prefix, >=2 mc per topic, orals", () => {
  nj.assertModuleTopics(LESSONS, "async-");
});

test("modul Async & error covers the spec keywords", () => {
  const per = {
    "0005": ["Promise.all", "Promise.allSettled", "Promise.race", "Promise.any", "AggregateError", "berurutan", "paralel", "di dalam loop", "concurrency"],
    "0006": ["try/catch", "unhandled rejection", "unhandledRejection", "--unhandled-rejections", "Node 15", "uncaughtException", "'error'", "cause", "operational error", "programmer error"],
    "0007": ["EventEmitter", "once", "MaxListenersExceededWarning", "AbortController", "AbortSignal.timeout", "fetch", "AbortError", "signal"],
  };
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("each lesson: one win, module kicker, cite numbering, diagram or code, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul Async &amp; error · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`)));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
  });
});

test("modul Async & error labels version-dependent behaviour with a Node version", () => {
  assert.match(nj.readLesson("0006"), /Node ≥ 15/, "0006: perilaku unhandled rejection butuh label versi");
  assert.match(nj.readLesson("0007"), /Node ≥ \d+/, "0007: AbortSignal.timeout / fetch butuh label versi");
});

test("modul Async & error: index marks 0005–0007 tersedia with the right files", () => {
  nj.assertListedAsTersedia(LESSONS);
});

test("modul Async & error nav: 0004 → 0005 → 0006 → 0007 → 0008", () => {
  const files = ["0004-thread-pool-dan-blocking.html", ...NUMS.map(n => LESSONS[n].file), "0008-streams.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});

test("modul Async & error glossary and resources sections are filled", () => {
  const glossary = nj.section("GLOSSARY.md", "## Async & error");
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(glossary.includes(t), `slug ${t} belum dicatat di GLOSSARY`));
  ["Promise.allSettled", "Unhandled rejection", "Operational error", "AbortSignal"].forEach(t =>
    assert.ok(glossary.includes(`**${t}`), `GLOSSARY Async & error belum punya ${t}`));
  const resources = nj.section("RESOURCES.md", "### Async & error");
  NUMS.forEach(n => assert.ok(resources.includes(`lesson ${n}`), `RESOURCES Async & error belum menyebut lesson ${n}`));
});
