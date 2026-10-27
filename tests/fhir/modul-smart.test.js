// Run from repo root: node --test
// Track FHIR modul SMART (lesson 0017–0020, dipecah dari lesson lama 0005): cakupan topik inti di bank soal
// fhir/assets/questions/0017–0020.js dan isi lesson, digabung per modul. Aturan teach umum (label, jumlah kata opsi,
// format lisan, navigasi tetangga) dicek di track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const MODULE = [
  ["0017", "0017-smart-peta-dan-launch.html"],
  ["0018", "0018-pkce.html"],
  ["0019", "0019-scopes-dan-backend-services.html"],
  ["0020", "0020-fhirclient-dan-keamanan-token.html"],
];
const NUMS = MODULE.map(([n]) => n);
const read = file => fs.readFileSync(path.join(ROOT, "fhir", "lessons", file), "utf8");
const pages = MODULE.map(([num, file]) => ({ num, file, html: read(file) }));
const allHtml = pages.map(p => p.html).join("\n");
const moduleQuestions = () => {
  const bank = fhir.loadLesson(...NUMS);
  const qs = bank.select({ lessons: NUMS });
  return { qs, mc: qs.filter(q => q.type === "mc") };
};

test("fhir modul SMART topics all use the smart- prefix, and each question sits in its own lesson's bank", () => {
  NUMS.forEach(num => {
    const { qs } = fhir.lessonQuestions(num);
    assert.ok(qs.length > 0, `bank ${num} kosong`);
    qs.forEach(q => {
      assert.match(q.topic, /^smart-/, `${q.id}: topik ${q.topic}`);
      assert.equal(q.lesson, num, `${q.id}: field lesson`);
    });
  });
});

test("fhir modul SMART covers PKCE, scopes, launch, discovery, backend services, fhirclient, CodeableConcept, security", () => {
  const { qs, mc } = moduleQuestions();
  ["smart-pkce", "smart-scopes", "smart-launch", "smart-backend", "smart-fhirclient", "smart-security"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["smart-discovery", "smart-codeable"].forEach(topic =>
    assert.ok(mc.some(q => q.topic === topic), `butuh soal kuis untuk ${topic}`));
  ["smart-launch", "smart-backend"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan untuk ${topic}`));
  const text = qs.map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {})].join(" ")).join(" ");
  ["code_verifier", "S256", ".rs", ".read", "launch/patient", "openid", "fhirUser", "offline_access",
   ".well-known/smart-configuration", "client_credentials", "client_assertion", "system/", "authorize()", "ready()", "userSelected"]
    .forEach(s => assert.ok(text.includes(s), `bank soal modul SMART belum menyebut ${s}`));
});

test("fhir modul SMART lessons are concept-only, cite SMART v2.2.0, RFC 7636 and fhirclient, and have a launch-order exercise", () => {
  assert.match(allHtml, /v2\.2\.0/);
  ["hl7.org/fhir/smart-app-launch/app-launch.html", "hl7.org/fhir/smart-app-launch/scopes-and-launch-context.html",
   "hl7.org/fhir/smart-app-launch/backend-services.html", "hl7.org/fhir/smart-app-launch/conformance.html",
   "rfc-editor.org/rfc/rfc7636", "docs.smarthealthit.org/client-js"].forEach(u =>
    assert.ok(allHtml.includes(u), `modul belum mengutip ${u}`));
  assert.ok((allHtml.match(/<sup class="cite">/g) || []).length >= 15, "klaim penting harus dikutip");
  const order = pages.find(p => p.num === "0018").html;
  assert.match(order, /<div class="order">/);
  assert.match(order, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  assert.equal((allHtml.match(/<details>/g) || []).length, 4, "empat latihan lisan (tiga lama + PKCE)");
  ["smart-launch", "smart-pkce", "smart-backend", "smart-security"].forEach((topic, i) =>
    assert.ok(fhir.loadLesson(NUMS[i]).select({ lessons: [NUMS[i]] }).some(q => q.type === "oral" && q.topic === topic), `${NUMS[i]}: soal lisan ${topic}`));
  assert.doesNotMatch(allHtml, /hands-on\.js|class="sql-exercise"|class="script"/, "track FHIR tanpa lab");
  assert.match(allHtml, /href="\.\.\/\.\.\/dotnet\/lessons\/0017-fullstack-auth-cors-error\.html"/);
  assert.ok(fs.existsSync(path.join(ROOT, "dotnet", "lessons", "0017-fullstack-auth-cors-error.html")), "tautan ke track .NET rusak");
});

pages.forEach(({ num, file, html }) => {
  test(`fhir ${num}: one win target, own bank, renumbered citations with matching sources`, () => {
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, "tepat satu <div class=\"win\">");
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${num} · FHIR · Modul SMART · ±\\d+ menit</div>`));
    const banks = [...html.matchAll(/data-bank-lesson="(\d{4})"/g)].map(m => m[1]);
    assert.ok(banks.length >= 1 && banks.every(b => b === num), `${file}: kuis harus memakai bank ${num}`);
    const cites = [...html.matchAll(/<sup class="cite"><a href="([^"]+)">\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[2]));
    const used = [...new Set(cites)].sort((a, b) => a - b);
    assert.deepEqual(used, used.map((_, i) => i + 1), `${file}: sitasi harus dinomori 1..n`);
    const sources = (html.match(/<p class="note sources">([\s\S]*?)<\/p>/) || [])[1] || "";
    const listed = [...sources.matchAll(/>\[(\d+)\]/g)].map(m => Number(m[1]));
    assert.deepEqual(listed, used, `${file}: daftar Sumber harus sama dengan sitasi yang dipakai`);
  });
});

test("fhir modul SMART nav runs 0016 → 0017 → … → 0020 → 0021, and Bacaan lanjutan sits in the last lesson", () => {
  const files = ["0016-decimal-di-javascript.html", ...MODULE.map(([, f]) => f), "0021-review-rest-bulk.html"];
  pages.forEach(({ html }, i) => {
    const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(hrefs, [files[i], files[i + 2]]);
  });
  pages.forEach(({ num, html }) =>
    assert.equal(/Bacaan lanjutan \(opsional, tidak dihitung dalam durasi\)/.test(html), num === "0020", `${num}: bacaan lanjutan`));
  assert.doesNotMatch(allHtml, /Bacaan utama|1 hari|malam sebelum interview|\b\d{2}\.\d{2}–\d{2}\.\d{2}\b/);
});
