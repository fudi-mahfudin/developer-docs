// Run from repo root: node --test
// Track FHIR modul SATUSEHAT (lesson 0022–0023, dipecah dari lama 0006 bagian 1): cakupan topik inti di bank soal
// fhir/assets/questions/0022.js + 0023.js dan isi kedua lesson. Aturan teach umum (label, jumlah kata opsi,
// format lisan, navigasi) dicek di track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSONS = {
  "0022": "0022-satusehat-platform-dan-identitas.html",
  "0023": "0023-satusehat-validasi-dan-mapping.html",
};
const NUMS = Object.keys(LESSONS);
const read = num => fs.readFileSync(path.join(ROOT, "fhir", "lessons", LESSONS[num]), "utf8");
const TOPICS = {
  "0022": ["ss-platform", "ss-auth", "ss-prasyarat", "ss-identifier"],
  "0023": ["ss-validasi", "ss-terminologi", "ss-mapping"],
};
const ALL_TOPICS = Object.values(TOPICS).flat();
const questions = () => {
  const bank = fhir.loadLesson(...NUMS);
  const qs = bank.select({ lessons: NUMS });
  return { qs, mc: qs.filter(q => q.type === "mc"), oral: qs.filter(q => q.type === "oral") };
};

test("modul SATUSEHAT topics all use the ss- prefix and stay in their lesson", () => {
  const { qs } = questions();
  qs.forEach(q => {
    assert.match(q.topic, /^ss-/, `${q.id}: topik ${q.topic}`);
    assert.ok(TOPICS[q.lesson].includes(q.topic), `${q.id}: topik ${q.topic} bukan milik lesson ${q.lesson}`);
  });
});

test("modul SATUSEHAT covers SATUSEHAT, auth, prerequisites, identifiers, validation, terminology and mapping", () => {
  const { qs, mc, oral } = questions();
  assert.ok(mc.length >= 6, "butuh >= 6 soal kuis");
  assert.ok(oral.length >= 2, "butuh >= 2 soal lisan");
  ALL_TOPICS.forEach(topic => assert.ok(mc.some(q => q.topic === topic), `butuh soal kuis untuk ${topic}`));
  ["ss-validasi", "ss-mapping"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["ss-platform", "ss-mapping"].forEach(topic =>
    assert.ok(oral.some(q => q.topic === topic), `butuh soal lisan untuk ${topic}`));
  const text = qs.map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {}), ...(q.checklist || [])].join(" ")).join(" ");
  ["client_credentials", "client_secret", "fhir-r4", "Master Patient Index", "https://fhir.kemkes.go.id/id/nik",
   "sys-ids.kemkes.go.id/encounter", "$validate", "OperationOutcome", "ConceptMap", "equivalence", "ICD-10", "LOINC", "KFA", "UTC"]
    .forEach(s => assert.ok(text.includes(s), `bank soal modul SATUSEHAT belum menyebut ${s}`));
});

test("modul SATUSEHAT lessons cite SATUSEHAT docs and FHIR R4 validation/profiling/ConceptMap, and flag unverified claims", () => {
  const all = NUMS.map(read).join("\n");
  ["satusehat.kemkes.go.id/platform/docs/id/", "simplifier.net/guide/SATUSEHAT-FHIR-R4-Implementation-Guide",
   "hl7.org/fhir/R4/validation.html", "hl7.org/fhir/R4/profiling.html", "hl7.org/fhir/R4/conceptmap.html",
   "hl7.org/fhir/R4/resource-operation-validate.html"].forEach(u =>
    assert.ok(all.includes(u), `modul belum mengutip ${u}`));
  assert.ok((all.match(/<sup class="cite">/g) || []).length >= 20, "klaim penting harus dikutip");
  NUMS.forEach(num => {
    const html = read(num);
    assert.match(html, /belum terverifikasi \(diakses 2026-10-26\)/, `${num}: penanda klaim belum terverifikasi`);
    TOPICS[num].forEach(t => assert.ok(html.includes(t), `${num}: lesson belum merender kuis topik ${t}`));
    assert.doesNotMatch(html, /hands-on\.js|class="sql-exercise"|class="script"/, `${num}: track FHIR tanpa lab`);
  });
});

test("modul SATUSEHAT: citations are numbered 1..n per lesson and every source listed is cited", () => {
  NUMS.forEach(num => {
    const html = read(num);
    const cited = [...html.matchAll(/<sup class="cite"><a href="([^"]+)">\[(\d+)\]<\/a><\/sup>/g)].map(m => [m[1], Number(m[2])]);
    const listed = [...html.matchAll(/<a href="([^"]+)">\[(\d+)\] [^<]+<\/a>/g)].map(m => [m[1], Number(m[2])]);
    assert.deepEqual(listed.map(([, n]) => n), listed.map((_, i) => i + 1), `${num}: daftar Sumber tidak urut 1..n`);
    const byUrl = new Map(listed);
    cited.forEach(([u, n]) => assert.equal(byUrl.get(u), n, `${num}: sitasi [${n}] ${u} tidak cocok dengan daftar Sumber`));
    listed.forEach(([u]) => assert.ok(cited.some(([c]) => c === u), `${num}: ${u} ada di Sumber tapi tidak dikutip`));
  });
});

test("modul SATUSEHAT: one narrow win per lesson, kicker, nav, and oral practice follows its topic", () => {
  NUMS.forEach(num => {
    const html = read(num);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${num}: butuh tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${num} · FHIR · Modul SATUSEHAT · ±\\d+ menit</div>`));
    assert.doesNotMatch(html, /1 hari|malam|seam|\b\d{2}\.\d{2}–\d{2}\.\d{2}\b/, `${num}: sisa jadwal lama`);
  });
  const nav = num => (read(num).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav("0022"), /href="0021-review-rest-bulk\.html"/);
  assert.match(nav("0022"), /href="0023-satusehat-validasi-dan-mapping\.html"/);
  assert.match(nav("0023"), /href="0022-satusehat-platform-dan-identitas\.html"/);
  assert.match(nav("0023"), /href="0024-pdp-hukum-dan-tiga-warna\.html"/);
  assert.match(read("0022"), /Pernah dengar SATUSEHAT\? Bagaimana sistem kami terhubung ke sana\?" \(60–90 detik\)<\/blockquote>/);
  ["SIMRS lama dengan tabel", "valid terhadap profile"].forEach(s => {
    assert.ok(read("0023").includes(s), `0023 belum memuat latihan lisan "${s}"`);
    assert.ok(!read("0022").includes(`<blockquote>"${s}`), `latihan lisan "${s}" salah lesson`);
  });
  assert.match(read("0023"), /Bacaan lanjutan \(opsional, tidak dihitung dalam durasi\)/);
});
