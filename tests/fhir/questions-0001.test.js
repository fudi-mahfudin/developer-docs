// Run from repo root: node --test
// Track FHIR, lesson 0001 (Fondasi FHIR): cakupan topik inti. Aturan teach, label, dan navigasi
// umum sudah diperiksa tests/fhir-track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSON = path.join(ROOT, "fhir", "lessons", "0001-fondasi-fhir.html");
const TOPICS = ["dasar-v2-vs-fhir", "dasar-rest-json", "dasar-resource", "dasar-versi", "dasar-profil"];

test("fhir 0001 covers v2 vs FHIR, REST+JSON, Resource, R4/R5 maturity, Profile/Extension/IG", () => {
  const { qs, mc } = fhir.lessonQuestions("0001");
  qs.forEach(q => assert.match(q.topic, /^dasar-/, `${q.id}: topik harus berprefiks dasar-`));
  TOPICS.forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  assert.ok(qs.filter(q => q.type === "oral").length >= 2, "butuh >= 2 soal lisan");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "dasar-v2-vs-fhir"), "butuh soal lisan 'apa itu FHIR vs HL7 v2'");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "dasar-profil"), "butuh soal lisan Profile/Extension/IG");
});

test("fhir 0001 lesson has one interview target, a quiz per topic, no lab, citations, and links back to the index", () => {
  const html = fs.readFileSync(LESSON, "utf8");
  assert.equal((html.match(/<div class="win">/g) || []).length, 1);
  TOPICS.forEach(topic =>
    assert.match(html, new RegExp(`data-bank-lesson="0001" data-bank-topic="${topic}"`), `kuis ${topic} belum dirender`));
  assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "track FHIR tanpa lab");
  ["modifierExtension", "StructureDefinition", "Implementation Guide", "Normative", "FMM", "R5", "HAPI", "Medplum"].forEach(s =>
    assert.ok(html.includes(s), `lesson belum membahas ${s}`));
  assert.ok((html.match(/<sup class="cite">/g) || []).length >= 20, "klaim penting harus dikutip");
  const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav, /href="\.\.\/index\.html"/);
  assert.match(nav, /href="0002-anatomi-resource-json\.html"/);
});
