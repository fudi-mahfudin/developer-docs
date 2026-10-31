// Run from repo root: node --test
// Track System Design, modul Fondasi (0001–0004): cakupan topik, sitasi, diagram, prinsip inti, latihan urutan dan hitung.
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0001": { file: "0001-apa-itu-system-design.html", topics: ["dasar-requirement", "dasar-prinsip-sederhana"] },
  "0002": { file: "0002-perjalanan-request.html", topics: ["dasar-perjalanan-request", "dasar-http-stateless"] },
  "0003": { file: "0003-latency-dan-throughput.html", topics: ["dasar-latency-percentile", "dasar-angka-latency"] },
  "0004": { file: "0004-estimasi-back-of-envelope.html", topics: ["dasar-estimasi-qps", "dasar-estimasi-storage"] },
};
const NUMS = Object.keys(LESSONS);
const read = n => fs.readFileSync(path.join(ROOT, "sysdesign", "lessons", LESSONS[n].file), "utf8");

test("modul Fondasi: topics, prefix, >=2 mc per topic, orals", () => {
  NUMS.forEach(n => sd.lessonQuestions(n).qs.forEach(q => {
    assert.match(q.topic, /^dasar-/, `${q.id}: topik harus berprefiks dasar-`);
    assert.ok(LESSONS[n].topics.includes(q.topic), `${q.id}: topik ${q.topic} bukan milik ${n}`);
  }));
  const mc = NUMS.flatMap(n => sd.lessonQuestions(n).mc);
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t =>
    assert.ok(mc.filter(q => q.topic === t).length >= 2, `butuh >= 2 soal kuis untuk ${t}`));
  NUMS.forEach(n => assert.ok(sd.lessonQuestions(n).oral.length >= 1, `${n}: butuh soal lisan`));
});

test("modul Fondasi covers the spec keywords", () => {
  const html = NUMS.map(read).join("\n");
  ["functional", "non-functional", "DNS", "TCP", "TLS", "HTTP", "latency", "throughput", "p50", "p99",
    "QPS", "storage", "bandwidth", "10⁵"]
    .forEach(k => assert.ok(html.includes(k), `belum membahas ${k}`));
});

test("modul Fondasi: each lesson has one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = read(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Fondasi · ±\\d+ menit</div>`));
    const cites = [...html.matchAll(/<sup class="cite"><a [^>]*>\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
    const listed = [...html.matchAll(/<a href="[^"]+">\[(\d+)\] /g)].map(m => Number(m[1]));
    assert.ok(cites.length >= 1, `${n}: butuh >= 1 .cite`);
    assert.deepEqual(listed, listed.map((_, i) => i + 1), `${n}: daftar sumber harus [1]..[n]`);
    assert.deepEqual([...new Set(cites)].sort((a, b) => a - b), listed, `${n}: daftar sumber = sumber yang dikutip`);
    assert.doesNotMatch(html, /rfc-editor\.org\/rfc\/rfc\d+(#|")/, `${n}: tautan RFC harus memakai .html`);
    assert.doesNotMatch(html, /martinfowler\.com/, `${n}: Fowler bukan sumber primer`);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    LESSONS[n].topics.forEach(t =>
      assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t} belum dirender`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
});

test("0001 introduces the core principle; 0004 shows 1.000 users fit one server + one database", () => {
  const intro = read("0001");
  ["ukur dulu", "termurah", "jalan terakhir"].forEach(k => assert.ok(intro.includes(k), `0001 belum menyebut "${k}"`));
  const est = read("0004");
  assert.match(est, /1\.000 (user|DAU)/, "0004 butuh contoh 1.000 user");
  assert.match(est, /satu server \+ satu database/, "0004 butuh kesimpulan satu server + satu database");
});

test("0002 has a request-path order exercise; 0004 hides calculation answers behind a button", () => {
  const req = read("0002");
  assert.match(req, /<div class="order">/);
  assert.match(req, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  const est = read("0004");
  assert.ok((est.match(/<summary>Lihat jawaban<\/summary>/g) || []).length >= 3, "0004 butuh >= 3 soal hitung dengan kunci");
});

test("modul Fondasi nav: index → 0001 → 0002 → 0003 → 0004 → 0005", () => {
  const files = ["../index.html", ...NUMS.map(n => LESSONS[n].file), "0005-vertical-horizontal-stateless.html"];
  NUMS.forEach((n, i) => {
    const nav = (read(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});
