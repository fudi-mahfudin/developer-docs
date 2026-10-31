// Run from repo root: node --test
// Track System Design, Penutup: mock interview 0036 (opsional, ±45 menit, pengecualian durasi, timer 5 segmen,
// jawaban contoh per langkah di balik tombol, checklist penilaian dengan penalti over-engineering) dan tiga cheat sheet
// di sysdesign/reference/ yang merangkum lesson yang sudah ada, ditautkan dari index dan ROADMAP.
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const sd = forTrack("sysdesign");
const read = f => fs.readFileSync(path.join(ROOT, "sysdesign", f), "utf8");
const MOCK = "lessons/0036-mock-interview.html";
const TOPICS = ["mock-typeahead-v1", "mock-typeahead-skala"];
const REFS = {
  "angka-dan-estimasi.html": {
    backlinks: ["0003-latency-dan-throughput.html", "0004-estimasi-back-of-envelope.html"],
    facts: ["100 ns", "0,5 ms", "10 ms", "150 ms", "86.400", "10⁵", "2¹⁰", "8 bit", "QPS", "storage", "bandwidth", "faktor puncak", "0,2 QPS"],
  },
  "kerangka-5-langkah.html": {
    backlinks: ["0027-kerangka-5-langkah.html"],
    facts: ["5 + 5 + 7 + 13 + 15", "45 menit", "DAU", "baca:tulis", "p99", "43,2 menit", "eventual", "v1", "Untuk skala ini cukup X"],
  },
  "trade-off-komponen.html": {
    backlinks: ["0025-tangga-skala.html"],
    facts: ["Kapan dipakai", "Kapan tidak", "Alternatif", "replication lag", "SKIP LOCKED", "modular monolith", "jsonb", "allkeys-lru", "limit_req", "Cache-Control"],
  },
};

const citesOk = (html, label) => {
  const cites = [...html.matchAll(/<sup class="cite"><a [^>]*>\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
  const listed = [...html.matchAll(/<a href="[^"]+">\[(\d+)\] /g)].map(m => Number(m[1]));
  assert.ok(cites.length >= 1, `${label}: butuh >= 1 .cite`);
  assert.deepEqual(listed, listed.map((_, i) => i + 1), `${label}: Sumber bernomor urut`);
  assert.deepEqual([...new Set(cites)].sort((a, b) => a - b), listed, `${label}: sitasi = daftar Sumber`);
};

test("0036 bank: mock- topics, >=2 mc per topic, oral checklist rewards v1 first and numbers", () => {
  const { qs, mc, oral } = sd.lessonQuestions("0036");
  qs.forEach(q => assert.ok(TOPICS.includes(q.topic), `${q.id}: topik ${q.topic} bukan milik 0036`));
  TOPICS.forEach(t => assert.ok(mc.filter(q => q.topic === t).length >= 2, t));
  assert.ok(oral.length >= 1);
  oral.forEach(q => {
    assert.ok(q.checklist.some(c => /v1 sederhana dulu/.test(c)), `${q.id}: checklist tanpa "v1 sederhana dulu"`);
    assert.ok(q.checklist.some(c => /setiap komponen dibenarkan dengan angka/.test(c)), `${q.id}: checklist tanpa poin angka`);
  });
});

test("0036 is an optional 45-minute mock on a new problem with a 5-segment timer", () => {
  const html = read(MOCK);
  assert.match(html, /<div class="kicker">Lesson 0036 · System Design · Penutup · ±45 menit · opsional, pengecualian durasi<\/div>/);
  assert.ok(html.includes('<div class="timer" data-segments="Requirement:5,Estimasi:5,API+data:7,High-level:13,Deep dive:15"></div>'), "timer 5 segmen");
  assert.ok(html.includes('<script src="../../assets/timer.js"></script>'), "memuat timer.js");
  assert.match(html, /typeahead/i);
  assert.match(html, /autocomplete/i);
  ["0028", "0029", "0030", "0031", "0033"].forEach(n => {
    const f = fs.readdirSync(path.join(ROOT, "sysdesign", "lessons")).find(x => x.startsWith(n));
    assert.doesNotMatch(read(`lessons/${f}`), /typeahead|autocomplete/i, `${n} sudah membahas soal mock`);
  });
  assert.equal((html.match(/<div class="win">/g) || []).length, 1);
  citesOk(html, "0036");
  assert.match(html, /<svg class="diagram"|<div class="flow">/, "butuh diagram");
  assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
});

test("0036 hides a sample answer per step behind a button, in order", () => {
  const html = read(MOCK);
  const steps = [1, 2, 3, 4, 5].map(i => {
    const m = html.match(new RegExp(`<h2>[^<]*Langkah ${i}\\b[^<]*</h2>`));
    assert.ok(m, `butuh h2 Langkah ${i}`);
    return m.index;
  });
  assert.deepEqual(steps, [...steps].sort((a, b) => a - b), "langkah berurutan");
  steps.forEach((s, i) => {
    const part = html.slice(s, steps[i + 1] || html.length);
    assert.match(part, new RegExp(`<details>\\s*<summary>Lihat jawaban contoh langkah ${i + 1}</summary>`), `jawaban contoh langkah ${i + 1}`);
  });
  assert.match(html.slice(steps[3], steps[4]), /v1/, "langkah 4 memulai dari v1");
  assert.match(html.slice(steps[4]), /v2|evolusi/, "langkah 5 menunjukkan evolusi");
});

test("0036 scoring checklist: v1 first, numbers per component, penalty for unjustified components, oral blocks = bank", () => {
  const html = read(MOCK);
  const scoring = (html.match(/<h2>[^<]*Penilaian[^<]*<\/h2>([\s\S]*?)<\/section>/) || [])[1] || "";
  assert.ok(scoring, "butuh bagian Penilaian");
  assert.match(scoring, /v1 sederhana dulu/);
  assert.match(scoring, /setiap komponen dibenarkan dengan angka/);
  assert.match(scoring, /[Pp]enalti[^<]*komponen[^<]*tanpa alasan/);
  assert.match(scoring, /over-engineering/);
  const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
  assert.equal(blocks, sd.lessonQuestions("0036").oral.length, "blok lisan statis = soal lisan bank");
  TOPICS.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="0036" data-bank-topic="[^"]*${t}`), `kuis ${t}`));
});

test("0036 nav: 0035 back, index last", () => {
  const nav = (read(MOCK).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  assert.equal(hrefs[0], "0035-review-studi-kasus.html");
  assert.equal(hrefs[hrefs.length - 1], "../index.html");
});

Object.entries(REFS).forEach(([file, { backlinks, facts }]) => {
  test(`reference ${file}: shared style, links back to its lessons, summarises their facts, cites`, () => {
    const html = read(`reference/${file}`);
    assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
    assert.match(html, /<body class="reference">/);
    assert.match(html, /<div class="kicker">Reference · System Design · /);
    backlinks.forEach(l => assert.ok(html.includes(`href="../lessons/${l}"`), `${file}: belum menautkan ${l}`));
    facts.forEach(k => assert.ok(html.includes(k), `${file}: belum memuat ${k}`));
    backlinks.concat([...html.matchAll(/href="\.\.\/lessons\/([\w-]+\.html)"/g)].map(m => m[1])).forEach(l =>
      assert.ok(fs.existsSync(path.join(ROOT, "sysdesign", "lessons", l)), `${l} tidak ada`));
    assert.doesNotMatch(html, /href="[^"]*\.\.\/(dotnet|fhir)\//, "track mandiri");
    citesOk(html, file);
  });
});

test("trade-off reference lists components in scale-ladder order", () => {
  const html = read("reference/trade-off-komponen.html");
  const order = ["Index", "Cache", "Scale vertical", "Read replica", "Queue", "Sharding", "Microservices"]
    .map(k => { const i = html.indexOf(`<th>${k}`); assert.ok(i >= 0, `baris ${k}`); return i; });
  assert.deepEqual(order, [...order].sort((a, b) => a - b), "urutan tangga skala");
});

test("index and ROADMAP link 0036 and the three references; glossary records the mock slugs", () => {
  const index = read("index.html");
  assert.match(index, /<li class="tersedia"><span class="num">0036<\/span><a class="title" href="lessons\/0036-mock-interview\.html">/);
  const roadmap = read("ROADMAP.md");
  Object.keys(REFS).forEach(f => {
    assert.ok(index.includes(`href="reference/${f}"`), `index belum menautkan ${f}`);
    assert.ok(roadmap.includes(`(reference/${f})`), `ROADMAP belum menautkan ${f}`);
  });
  const section = read("GLOSSARY.md").split("## Penutup")[1].split(/\n## /)[0];
  TOPICS.forEach(t => assert.ok(section.includes(t), `slug ${t} belum di GLOSSARY Penutup`));
});
