// Run from repo root: node --test
// Track FHIR lesson 0005 (SMART on FHIR): cakupan topik inti di bank soal fhir/assets/questions/0005.js
// dan isi lesson. Aturan teach umum (label, jumlah kata opsi, format lisan, navigasi) dicek di fhir-track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSON = path.join(ROOT, "fhir", "lessons", "0005-smart-on-fhir.html");

test("fhir 0005 topics all use the smart- prefix", () => {
  const { qs } = fhir.lessonQuestions("0005");
  qs.forEach(q => assert.match(q.topic, /^smart-/, `${q.id}: topik ${q.topic}`));
});

test("fhir 0005 covers PKCE, scopes, launch, discovery, backend services, fhirclient, CodeableConcept, security", () => {
  const { qs, mc } = fhir.lessonQuestions("0005");
  ["smart-pkce", "smart-scopes", "smart-launch", "smart-backend", "smart-fhirclient", "smart-security"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["smart-discovery", "smart-codeable"].forEach(topic =>
    assert.ok(mc.some(q => q.topic === topic), `butuh soal kuis untuk ${topic}`));
  ["smart-launch", "smart-backend"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan untuk ${topic}`));
  const text = qs.map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {})].join(" ")).join(" ");
  ["code_verifier", "S256", ".rs", ".read", "launch/patient", "openid", "fhirUser", "offline_access",
   ".well-known/smart-configuration", "client_credentials", "client_assertion", "system/", "authorize()", "ready()", "userSelected"]
    .forEach(s => assert.ok(text.includes(s), `bank soal 0005 belum menyebut ${s}`));
});

test("fhir 0005 lesson is concept-only, cites SMART v2.2.0, RFC 7636 and fhirclient, and has a launch-order exercise", () => {
  const html = fs.readFileSync(LESSON, "utf8");
  assert.match(html, /<div class="win">/);
  assert.match(html, /v2\.2\.0/);
  ["hl7.org/fhir/smart-app-launch/app-launch.html", "hl7.org/fhir/smart-app-launch/scopes-and-launch-context.html",
   "hl7.org/fhir/smart-app-launch/backend-services.html", "hl7.org/fhir/smart-app-launch/conformance.html",
   "rfc-editor.org/rfc/rfc7636", "docs.smarthealthit.org/client-js"].forEach(u =>
    assert.ok(html.includes(u), `lesson belum mengutip ${u}`));
  assert.ok((html.match(/<sup class="cite">/g) || []).length >= 15, "klaim penting harus dikutip");
  assert.match(html, /<div class="order">/);
  assert.match(html, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  assert.equal((html.match(/<details>/g) || []).length, 3, "tiga latihan lisan");
  assert.doesNotMatch(html, /hands-on\.js|class="sql-exercise"|class="script"/, "track FHIR tanpa lab");
  assert.match(html, /href="\.\.\/\.\.\/dotnet\/lessons\/0017-fullstack-auth-cors-error\.html"/);
});
