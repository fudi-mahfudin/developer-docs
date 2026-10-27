// Run from repo root: node --test
// Track FHIR lesson 0007 (PDP dan data di monitoring): cakupan topik inti di bank soal fhir/assets/questions/0007.js,
// isi lesson, dan cheat sheet. Aturan teach umum (label, jumlah kata opsi, format lisan, navigasi) dicek di track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSON = path.join(ROOT, "fhir", "lessons", "0007-pdp-data-di-monitoring.html");
const REFERENCE = path.join(ROOT, "fhir", "reference", "pdp-monitoring.html");

test("fhir 0007 topics all use the pdp- prefix", () => {
  const { qs } = fhir.lessonQuestions("0007");
  qs.forEach(q => assert.match(q.topic, /^pdp-/, `${q.id}: topik ${q.topic}`));
});

test("fhir 0007 covers law, field taxonomy, traps, channels, techniques and audit", () => {
  const { qs, mc } = fhir.lessonQuestions("0007");
  ["pdp-hukum", "pdp-field", "pdp-jebakan", "pdp-saluran", "pdp-teknik", "pdp-audit"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["pdp-field", "pdp-audit"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan untuk ${topic}`));
  const text = qs.map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {})].join(" ")).join(" ");
  ["Pasal 4", "Pasal 46", "3×24", "Permenkes 24/2022", "NIK", "nomor IHS", "diagnostics", "text.div",
   "HMAC", "allowlist", "AuditEvent", "url.query", "redact", "client_secret"]
    .forEach(s => assert.ok(text.includes(s), `bank soal 0007 belum menyebut ${s}`));
});

test("fhir 0007 lesson uses only Indonesian law, cites primary sources and flags unverified claims", () => {
  const html = fs.readFileSync(LESSON, "utf8");
  assert.match(html, /<div class="win">/);
  ["peraturan.bpk.go.id/Download/224884", "peraturan.bpk.go.id/Download/314883", "peraturan.bpk.go.id/Download/301563",
   "hl7.org/fhir/R4/security.html", "hl7.org/fhir/R4/auditevent.html", "opentelemetry.io/docs/security/handling-sensitive-data"]
    .forEach(u => assert.ok(html.includes(u), `lesson belum mengutip ${u}`));
  assert.ok((html.match(/<sup class="cite">/g) || []).length >= 15, "klaim penting harus dikutip");
  assert.doesNotMatch(html, /HIPAA/, "hanya hukum Indonesia");
  assert.match(html, /Belum terverifikasi/);
  assert.match(html, /Tafsiran, bukan bunyi pasal/);
  assert.equal((html.match(/<details>/g) || []).length, 3, "tiga latihan lisan");
  assert.doesNotMatch(html, /hands-on\.js|class="sql-exercise"|class="script"/, "track FHIR tanpa lab");
  assert.match(html, /href="\.\.\/reference\/pdp-monitoring\.html"/);
});

test("fhir 0007 cheat sheet exists and links back to the lesson", () => {
  const html = fs.readFileSync(REFERENCE, "utf8");
  assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
  assert.match(html, /href="\.\.\/lessons\/0007-pdp-data-di-monitoring\.html"/);
  assert.doesNotMatch(html, /HIPAA/);
});
