// Run from repo root: node --test
// Track System Design, modul Fondasi (0001–0004): cakupan topik, sitasi, diagram, prinsip inti, latihan urutan dan hitung.
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0001": { file: "0001-apa-itu-system-design.html", topics: ["dasar-requirement", "dasar-prinsip-sederhana"] },
  "0002": { file: "0002-perjalanan-request.html", topics: ["dasar-perjalanan-request", "dasar-http-stateless"] },
  "0003": { file: "0003-latency-dan-throughput.html", topics: ["dasar-latency-percentile", "dasar-angka-latency"] },
  "0004": { file: "0004-estimasi-back-of-envelope.html", topics: ["dasar-estimasi-qps", "dasar-estimasi-storage"] },
};
const NUMS = Object.keys(LESSONS);

test("modul Fondasi: topics, prefix, >=2 mc per topic, orals", () => {
  sd.assertModuleTopics(LESSONS, "dasar-");
});

test("modul Fondasi covers the spec keywords", () => {
  const html = NUMS.map(sd.readLesson).join("\n");
  ["functional", "non-functional", "DNS", "TCP", "TLS", "HTTP", "latency", "throughput", "p50", "p99",
    "QPS", "storage", "bandwidth", "10⁵"]
    .forEach(k => assert.ok(html.includes(k), `belum membahas ${k}`));
});

test("modul Fondasi: each lesson has one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Fondasi · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
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
  const intro = sd.readLesson("0001");
  ["ukur dulu", "termurah", "jalan terakhir"].forEach(k => assert.ok(intro.includes(k), `0001 belum menyebut "${k}"`));
  const est = sd.readLesson("0004");
  assert.match(est, /1\.000 (user|DAU)/, "0004 butuh contoh 1.000 user");
  assert.match(est, /satu server \+ satu database/, "0004 butuh kesimpulan satu server + satu database");
});

test("0002 has a request-path order exercise; 0004 hides calculation answers behind a button", () => {
  const req = sd.readLesson("0002");
  assert.match(req, /<div class="order">/);
  assert.match(req, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  const est = sd.readLesson("0004");
  assert.ok((est.match(/<summary>Lihat jawaban<\/summary>/g) || []).length >= 3, "0004 butuh >= 3 soal hitung dengan kunci");
});

test("modul Fondasi nav: index → 0001 → 0002 → 0003 → 0004 → 0005", () => {
  const files = ["../index.html", ...NUMS.map(n => LESSONS[n].file), "0005-vertical-horizontal-stateless.html"];
  NUMS.forEach((n, i) => {
    const nav = (sd.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});
