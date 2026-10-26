// Run from repo root: node --test
// Track FHIR lesson 0006 bagian 1 (SATUSEHAT, validasi, mapping data legacy): cakupan topik inti di bank soal
// fhir/assets/questions/0006.js dan isi lesson. Aturan teach umum (label, jumlah kata opsi, format lisan,
// navigasi) dicek di fhir-track.test.js; review campuran dicek di fhir-review-0006.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("./helpers.js");

const fhir = forTrack("fhir");
const LESSON = path.join(ROOT, "fhir", "lessons", "0006-satusehat-dan-review.html");
const TOPICS = ["ss-platform", "ss-auth", "ss-prasyarat", "ss-identifier", "ss-validasi", "ss-terminologi", "ss-mapping"];

test("fhir 0006 topics all use the ss- prefix", () => {
  const { qs } = fhir.lessonQuestions("0006");
  qs.forEach(q => assert.match(q.topic, /^ss-/, `${q.id}: topik ${q.topic}`));
});

test("fhir 0006 covers SATUSEHAT, auth, prerequisites, identifiers, validation, terminology and mapping", () => {
  const { qs, mc, oral } = fhir.lessonQuestions("0006");
  assert.ok(mc.length >= 6, "butuh >= 6 soal kuis");
  assert.ok(oral.length >= 2, "butuh >= 2 soal lisan");
  TOPICS.forEach(topic => assert.ok(mc.some(q => q.topic === topic), `butuh soal kuis untuk ${topic}`));
  ["ss-validasi", "ss-mapping"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["ss-platform", "ss-mapping"].forEach(topic =>
    assert.ok(oral.some(q => q.topic === topic), `butuh soal lisan untuk ${topic}`));
  const text = qs.map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {}), ...(q.checklist || [])].join(" ")).join(" ");
  ["client_credentials", "client_secret", "fhir-r4", "Master Patient Index", "https://fhir.kemkes.go.id/id/nik",
   "sys-ids.kemkes.go.id/encounter", "$validate", "OperationOutcome", "ConceptMap", "equivalence", "ICD-10", "LOINC", "KFA", "UTC"]
    .forEach(s => assert.ok(text.includes(s), `bank soal 0006 belum menyebut ${s}`));
});

test("fhir 0006 lesson cites SATUSEHAT docs and FHIR R4 validation/profiling/ConceptMap, and flags unverified claims", () => {
  const html = fs.readFileSync(LESSON, "utf8");
  assert.match(html, /<div class="win">/);
  ["satusehat.kemkes.go.id/platform/docs/id/", "simplifier.net/guide/SATUSEHAT-FHIR-R4-Implementation-Guide",
   "hl7.org/fhir/R4/validation.html", "hl7.org/fhir/R4/profiling.html", "hl7.org/fhir/R4/conceptmap.html",
   "hl7.org/fhir/R4/resource-operation-validate.html"].forEach(u =>
    assert.ok(html.includes(u), `lesson belum mengutip ${u}`));
  assert.ok((html.match(/<sup class="cite">/g) || []).length >= 20, "klaim penting harus dikutip");
  assert.match(html, /belum terverifikasi \(diakses 2026-10-26\)/);
  TOPICS.forEach(t => assert.ok(html.includes(t), `lesson belum merender kuis topik ${t}`));
  assert.doesNotMatch(html, /hands-on\.js|class="sql-exercise"|class="script"/, "track FHIR tanpa lab");
});

test("fhir 0006 has the four parts in order, and reframes STAR from star/draf-star.md without new stories", () => {
  const html = fs.readFileSync(LESSON, "utf8");
  const at = id => html.indexOf(`id="${id}"`);
  [1, 2, 3, 4].forEach(n => assert.ok(at(`bagian-${n}`) > 0, `bagian ${n} belum ada`));
  assert.ok(at("bagian-1") < at("bagian-2") && at("bagian-2") < at("bagian-3") && at("bagian-3") < at("bagian-4"), "urutan bagian salah");
  const part3 = html.slice(at("bagian-3"), at("bagian-4"));
  assert.ok((part3.match(/<details>/g) || []).length >= 5, "bank tanya-jawab butuh >= 5 soal lisan");
  assert.ok((part3.match(/Lulus kalau minimal 4 dari 6/g) || []).length >= 5, "setiap soal tanya-jawab butuh checklist 6 poin");
  const part4 = html.slice(at("bagian-4"));
  assert.match(part4, /star\/draf-star\.md/);
  ["insiden", "Refactor", "Konflik", "Mempelajari teknologi baru"].forEach(s => assert.ok(part4.includes(s), `cerita STAR "${s}" belum dibingkai ulang`));
  ["data sensitif", "Integrasi antar sistem", "Volume besar"].forEach(s =>
    assert.ok(part4.toLowerCase().includes(s.toLowerCase()), `sudut health-tech "${s}" belum ada`));
});
