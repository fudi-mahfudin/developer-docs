// Run from repo root: node --test
// Track FHIR, Modul Fondasi (lesson 0001–0003, dipecah dari lama 0001): cakupan topik inti atas gabungan
// file modul. Aturan teach, label, dan navigasi umum sudah diperiksa tests/fhir/track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSONS = {
  "0001": { file: "0001-v2-ke-fhir-rest-json.html", topics: ["dasar-v2-vs-fhir", "dasar-rest-json"] },
  "0002": { file: "0002-resource-dan-versi.html", topics: ["dasar-resource", "dasar-versi"] },
  "0003": { file: "0003-profile-extension-ig.html", topics: ["dasar-profil"] },
};
const NUMS = Object.keys(LESSONS);
const TOPICS = NUMS.flatMap(n => LESSONS[n].topics);
const read = n => fs.readFileSync(path.join(ROOT, "fhir", "lessons", LESSONS[n].file), "utf8");

test("modul Fondasi covers v2 vs FHIR, REST+JSON, Resource, R4/R5 maturity, Profile/Extension/IG", () => {
  const all = NUMS.flatMap(n => fhir.lessonQuestions(n).qs);
  const mc = all.filter(q => q.type === "mc");
  all.forEach(q => assert.match(q.topic, /^dasar-/, `${q.id}: topik harus berprefiks dasar-`));
  NUMS.forEach(n => fhir.lessonQuestions(n).qs.forEach(q =>
    assert.ok(LESSONS[n].topics.includes(q.topic), `${q.id}: topik ${q.topic} bukan milik lesson ${n}`)));
  TOPICS.forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  assert.ok(all.filter(q => q.type === "oral").length >= 2, "butuh >= 2 soal lisan");
  assert.ok(all.some(q => q.type === "oral" && q.topic === "dasar-v2-vs-fhir"), "butuh soal lisan 'apa itu FHIR vs HL7 v2'");
  assert.ok(all.some(q => q.type === "oral" && q.topic === "dasar-profil"), "butuh soal lisan Profile/Extension/IG");
});

test("modul Fondasi lessons each have one target and a quiz per own topic, no lab, citations overall", () => {
  const htmls = NUMS.map(read);
  NUMS.forEach((n, i) => {
    const html = htmls[i];
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    LESSONS[n].topics.forEach(topic =>
      assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="${topic}"`), `${n}: kuis ${topic} belum dirender`));
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: track FHIR tanpa lab`);
  });
  const all = htmls.join("\n");
  ["modifierExtension", "StructureDefinition", "Implementation Guide", "Normative", "FMM", "R5", "HAPI", "Medplum"].forEach(s =>
    assert.ok(all.includes(s), `modul belum membahas ${s}`));
  assert.ok((all.match(/<sup class="cite">/g) || []).length >= 20, "klaim penting harus dikutip");
});

test("modul Fondasi navigates index → 0001 → 0002 → 0003 → 0004", () => {
  const nav = n => (read(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav("0001"), /href="\.\.\/index\.html"/);
  assert.match(nav("0001"), /href="0002-resource-dan-versi\.html"/);
  assert.match(nav("0002"), /href="0001-v2-ke-fhir-rest-json\.html"/);
  assert.match(nav("0002"), /href="0003-profile-extension-ig\.html"/);
  assert.match(nav("0003"), /href="0002-resource-dan-versi\.html"/);
  assert.match(nav("0003"), /href="0004-kerangka-json-dan-identifier\.html"/);
});
