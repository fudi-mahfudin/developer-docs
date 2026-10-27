// Run from repo root: node --test
// Track FHIR, modul Bulk Data (lesson 0013–0016, dipecah dari lama 0004): cakupan topik inti bank soal
// fhir/assets/questions/0013–0016.js dan halaman lesson-nya, digabung per modul.
// Aturan teach umum (jumlah kata opsi, posisi jawaban, format lisan, navigasi ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSONS = {
  "0013": "0013-export-dan-alur-async.html",
  "0014": "0014-manifest-ndjson-dan-json-parse.html",
  "0015": "0015-streaming-dan-backpressure.html",
  "0016": "0016-decimal-di-javascript.html",
};
const NUMS = Object.keys(LESSONS);
const read = num => fs.readFileSync(path.join(ROOT, "fhir", "lessons", LESSONS[num]), "utf8");
const moduleQuestions = () => fhir.loadLesson(...NUMS).select({ lessons: NUMS });

test("modul Bulk Data covers $export, polling, manifest/NDJSON, JSON.parse limits, streaming, backpressure and decimal", () => {
  const qs = moduleQuestions();
  const mc = qs.filter(q => q.type === "mc");
  ["bulk-export", "bulk-polling", "bulk-manifest", "bulk-jsonparse", "bulk-stream", "bulk-backpressure", "bulk-decimal"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  qs.forEach(q => assert.match(q.topic, /^bulk-/, `${q.id}: topik harus berprefiks bulk-`));
  const oral = qs.filter(q => q.type === "oral");
  assert.ok(oral.length >= 2, "butuh >= 2 soal lisan");
  assert.ok(oral.some(q => q.topic === "bulk-polling"), "butuh soal lisan alur $export");
  assert.ok(oral.some(q => q.topic === "bulk-backpressure"), "butuh soal lisan memproses NDJSON besar di Node");
});

test("modul Bulk Data questions mention the key Bulk Data and Node terms", () => {
  const text = moduleQuestions()
    .map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {}), ...(q.checklist || [])].join(" ")).join(" ");
  ["Prefer: respond-async", "202", "Content-Location", "Retry-After", "429", "transactionTime", "_since", "_type",
    "NDJSON", "highWaterMark", "drain", "pipeline", "readline", "stream-json", "2.00"].forEach(term =>
    assert.ok(text.includes(term), `bank soal modul Bulk Data belum menyebut ${term}`));
});

test("each bulk bank holds only its own lesson's questions, with topics labelled in that file", () => {
  NUMS.forEach(num => {
    const { bank, qs } = fhir.lessonQuestions(num);
    assert.ok(qs.length > 0, `${num}: bank kosong`);
    qs.forEach(q => {
      assert.equal(q.lesson, num);
      assert.ok(bank.labels()[q.topic], `${num}: topik ${q.topic} belum diberi label di file ini`);
    });
  });
});

test("modul Bulk Data lessons cite the Bulk Data IG STU2 and have an $export order exercise", () => {
  const html = NUMS.map(read).join("\n");
  assert.match(html, /href="https:\/\/hl7\.org\/fhir\/uv\/bulkdata\/STU2\/export\.html/);
  assert.match(html, /v2\.0\.0/);
  assert.match(html, /<div class="order">/);
  assert.ok(!/class="(script|sql-exercise)"/.test(html), "track FHIR tanpa hands-on/lab");
  assert.match(read("0013"), /<div class="order">/, "latihan susun urutan $export ikut bagian alur asinkron (0013)");
});

test("each bulk lesson has one win, the module kicker, renumbered citations and its own quiz bank", () => {
  NUMS.forEach(num => {
    const html = read(num);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${num}: harus tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${num} · FHIR · Modul Bulk Data · ±\\d+ menit</div>`));
    const cites = [...html.matchAll(/<sup class="cite"><a [^>]*>\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
    const listed = [...html.matchAll(/<a href="[^"]+">\[(\d+)\] /g)].map(m => Number(m[1]));
    assert.deepEqual(listed, listed.map((_, i) => i + 1), `${num}: daftar Sumber harus [1]..[n]`);
    assert.deepEqual([...new Set(cites)].sort((a, b) => a - b), listed, `${num}: Sumber harus persis yang disitasi`);
    const banks = [...html.matchAll(/data-bank-lesson="(\d{4})"/g)].map(m => m[1]);
    assert.ok(banks.length > 0 && banks.every(b => b === num), `${num}: kuis harus memakai data-bank-lesson="${num}"`);
  });
});

test("each bulk lesson shows one static oral block per oral question in its bank", () => {
  NUMS.forEach(num => {
    const { oral } = fhir.lessonQuestions(num);
    const blocks = (read(num).match(/<p class="note">Lulus jika minimal 4 dari 6\.<\/p>/g) || []).length;
    assert.ok(oral.length >= 1, `${num}: butuh >= 1 soal lisan`);
    assert.equal(blocks, oral.length, `${num}: blok lisan statis harus sama dengan soal lisan bank`);
  });
});

test("bulk lessons link to each other in order and to the neighbouring modules", () => {
  const files = ["0012-review-fondasi-resource.html", ...Object.values(LESSONS), "0017-smart-peta-dan-launch.html"];
  NUMS.forEach((num, i) => {
    const nav = (read(num).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(hrefs, [files[i], files[i + 2]], `${num}: nav sebelum/sesudah`);
  });
});
