// Run from repo root: node --test
// Track System Design, modul Asinkron (0016–0018): cakupan topik, sitasi, diagram, "Kapan tidak perlu".
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0016": { file: "0016-queue-dan-pubsub.html", topics: ["async-queue-pubsub", "async-log-broker"], component: true },
  "0017": { file: "0017-delivery-semantics-idempotency.html", topics: ["async-delivery", "async-idempotency"], component: true },
  "0018": { file: "0018-event-driven-backpressure.html", topics: ["async-event-outbox", "async-backpressure"], component: true },
};
const NUMS = Object.keys(LESSONS);
const read = n => fs.readFileSync(path.join(ROOT, "sysdesign", "lessons", LESSONS[n].file), "utf8");

test("modul Asinkron: topics, prefix, >=2 mc per topic, orals", () => {
  NUMS.forEach(n => sd.lessonQuestions(n).qs.forEach(q => {
    assert.match(q.topic, /^async-/);
    assert.ok(LESSONS[n].topics.includes(q.topic), `${q.id}: topik ${q.topic} bukan milik ${n}`);
  }));
  const mc = NUMS.flatMap(n => sd.lessonQuestions(n).mc);
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(mc.filter(q => q.topic === t).length >= 2, t));
});

test("modul Asinkron covers the spec keywords", () => {
  const per = {
    "0016": ["message queue", "pub/sub", "consumer group", "Kafka", "RabbitMQ", "log", "broker"],
    "0017": ["at-most-once", "at-least-once", "exactly-once", "idempotency key", "dead letter queue", "ordering"],
    "0018": ["event-driven", "outbox", "back-pressure", "load leveling"],
  };
  NUMS.forEach(n => {
    const html = read(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("modul Asinkron: new topic slugs are recorded in the glossary", () => {
  const glossary = fs.readFileSync(path.join(ROOT, "sysdesign", "GLOSSARY.md"), "utf8");
  const section = (glossary.match(/## Asinkron\n([\s\S]*?)\n## /) || [])[1] || "";
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(section.includes(t), `slug ${t} belum di GLOSSARY ## Asinkron`));
});

test("each lesson: one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, Kapan tidak perlu", () => {
  NUMS.forEach(n => {
    const html = read(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Asinkron · ±\\d+ menit</div>`));
    const cites = [...html.matchAll(/<sup class="cite"><a [^>]*>\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
    const listed = [...html.matchAll(/<a href="[^"]+">\[(\d+)\] /g)].map(m => Number(m[1]));
    assert.ok(cites.length >= 1, `${n}: butuh >= 1 .cite`);
    assert.deepEqual(listed, listed.map((_, i) => i + 1));
    assert.deepEqual([...new Set(cites)].sort((a, b) => a - b), listed);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`)));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    if (LESSONS[n].component) assert.match(html, /<h2>[^<]*Kapan tidak perlu[^<]*<\/h2>/, `${n}: butuh h2 Kapan tidak perlu`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
  });
});

test("modul Asinkron: index marks 0016–0018 tersedia with the right files", () => {
  const index = fs.readFileSync(path.join(ROOT, "sysdesign", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});

test("modul Asinkron nav: 0015 → 0016 → 0017 → 0018 → 0019", () => {
  const files = ["0015-thundering-herd-hot-key.html", ...NUMS.map(n => LESSONS[n].file), "0019-review-data-caching.html"];
  NUMS.forEach((n, i) => {
    const nav = (read(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});
