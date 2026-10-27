// Run from repo root: node --test
// Track FHIR modul PDP (lesson 0024–0026, dipecah dari lama 0007 "PDP dan data di monitoring"): cakupan topik inti
// di gabungan bank soal fhir/assets/questions/0024–0026.js, isi lesson, dan cheat sheet. Aturan teach umum
// (label, jumlah kata opsi, format lisan, navigasi dasar) dicek di track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const NUMS = ["0024", "0025", "0026"];
const FILES = {
  "0024": "0024-pdp-hukum-dan-tiga-warna.html",
  "0025": "0025-pdp-jebakan-dan-saluran.html",
  "0026": "0026-pdp-hmac-dan-audit.html",
};
const lesson = num => fs.readFileSync(path.join(ROOT, "fhir", "lessons", FILES[num]), "utf8");
const REFERENCE = path.join(ROOT, "fhir", "reference", "pdp-monitoring.html");
const allQuestions = () => fhir.loadLesson(...NUMS).select({ lessons: NUMS });
const allHtml = () => NUMS.map(lesson).join("\n");

test("fhir modul PDP: topics all use the pdp- prefix", () => {
  allQuestions().forEach(q => assert.match(q.topic, /^pdp-/, `${q.id}: topik ${q.topic}`));
});

test("fhir modul PDP: each quiz topic lives in exactly one bank of the module", () => {
  const where = {};
  NUMS.forEach(num => fhir.lessonQuestions(num).mc.forEach(q => (where[q.topic] ||= new Set()).add(num)));
  Object.entries(where).forEach(([topic, set]) => assert.equal(set.size, 1, `${topic} tersebar di ${[...set]}`));
});

test("fhir modul PDP: every oral in a bank is on that lesson's page, and vice versa", () => {
  NUMS.forEach(num => {
    const html = lesson(num);
    const { oral } = fhir.lessonQuestions(num);
    assert.equal((html.match(/<details>/g) || []).length, oral.length, `${num}: jumlah blok lisan = soal lisan bank`);
    oral.forEach(q => assert.ok(html.includes(`<blockquote>${q.prompt}</blockquote>`), `${q.id} tidak ada di halaman ${num}`));
  });
  // Jawaban 90 detik penutup modul tetap bertopik pdp-field, tapi tinggal di bank dan halaman 0026.
  const closing = fhir.lessonQuestions("0026").oral.find(q => q.topic === "pdp-field");
  assert.ok(closing && /90 detik/.test(closing.prompt), "jawaban 90 detik penutup modul ada di 0026");
});

test("fhir modul PDP covers law, field taxonomy, traps, channels, techniques and audit", () => {
  const qs = allQuestions();
  const mc = qs.filter(q => q.type === "mc");
  ["pdp-hukum", "pdp-field", "pdp-jebakan", "pdp-saluran", "pdp-teknik", "pdp-audit"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["pdp-field", "pdp-audit"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan untuk ${topic}`));
  const text = qs.map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {})].join(" ")).join(" ");
  ["Pasal 4", "Pasal 46", "3×24", "Permenkes 24/2022", "NIK", "nomor IHS", "diagnostics", "text.div",
   "HMAC", "allowlist", "AuditEvent", "url.query", "redact", "client_secret"]
    .forEach(s => assert.ok(text.includes(s), `bank soal modul PDP belum menyebut ${s}`));
});

test("fhir modul PDP lessons use only Indonesian law, cite primary sources and flag unverified claims", () => {
  const html = allHtml();
  ["peraturan.bpk.go.id/Download/224884", "peraturan.bpk.go.id/Download/314883", "peraturan.bpk.go.id/Download/301563",
   "hl7.org/fhir/R4/security.html", "hl7.org/fhir/R4/auditevent.html", "opentelemetry.io/docs/security/handling-sensitive-data"]
    .forEach(u => assert.ok(html.includes(u), `modul belum mengutip ${u}`));
  assert.ok((html.match(/<sup class="cite">/g) || []).length >= 15, "klaim penting harus dikutip");
  assert.doesNotMatch(html, /HIPAA/, "hanya hukum Indonesia");
  assert.match(html, /Belum terverifikasi/);
  assert.match(html, /Tafsiran, bukan bunyi pasal/);
  assert.equal((html.match(/<details>/g) || []).length, 4, "empat latihan lisan (tiga lama + dasar hukum di 0024)");
  assert.doesNotMatch(html, /hands-on\.js|class="sql-exercise"|class="script"/, "track FHIR tanpa lab");
  assert.match(html, /href="\.\.\/reference\/pdp-monitoring\.html"/);
});

NUMS.forEach(num => {
  test(`fhir ${num}: one win, module kicker, own citations and no interview-eve framing`, () => {
    const html = lesson(num);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, "tepat satu target");
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${num} · FHIR · Modul PDP · ±\\d+ menit</div>`));
    assert.doesNotMatch(html, /malam sebelum interview|setelah seam/i);
    assert.doesNotMatch(html, /0007-pdp-data-di-monitoring|0006-satusehat-dan-review/, "rujukan ke file lama");
    const cited = [...html.matchAll(/<sup class="cite"><a href="[^"]+">\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
    const listed = [...html.matchAll(/<p class="note sources">[\s\S]*?<\/p>/g)].join("")
      .match(/\[(\d+)\]/g).map(s => Number(s.slice(1, -1)));
    assert.deepEqual(listed, [...new Set(cited)].sort((a, b) => a - b), "daftar Sumber = sitasi yang dipakai");
    assert.deepEqual(listed, listed.map((_, i) => i + 1), "sitasi dinomori ulang mulai [1]");
  });
});

test("fhir modul PDP: navigation runs 0023 → 0024 → 0025 → 0026 → 0027", () => {
  const nav = num => (lesson(num).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav("0024"), /href="0023-satusehat-validasi-dan-mapping\.html"/);
  assert.match(nav("0024"), /href="0025-pdp-jebakan-dan-saluran\.html"/);
  assert.match(nav("0025"), /href="0024-pdp-hukum-dan-tiga-warna\.html"/);
  assert.match(nav("0025"), /href="0026-pdp-hmac-dan-audit\.html"/);
  assert.match(nav("0026"), /href="0025-pdp-jebakan-dan-saluran\.html"/);
  assert.match(nav("0026"), /href="0027-review-smart-satusehat-pdp\.html"/);
});

test("fhir modul PDP: further reading is optional and sits in the last lesson", () => {
  assert.match(lesson("0026"), /Bacaan lanjutan \(opsional, tidak dihitung dalam durasi\)/);
  ["0024", "0025"].forEach(num => assert.doesNotMatch(lesson(num), /Bacaan (utama|lanjutan)/));
});

test("fhir modul PDP cheat sheet exists and links back to the new lessons", () => {
  const html = fs.readFileSync(REFERENCE, "utf8");
  assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
  NUMS.forEach(num => assert.match(html, new RegExp(`href="\\.\\./lessons/${FILES[num].replace(/\./g, "\\.")}"`)));
  assert.doesNotMatch(html, /0007-pdp-data-di-monitoring/);
  assert.doesNotMatch(html, /HIPAA/);
});
