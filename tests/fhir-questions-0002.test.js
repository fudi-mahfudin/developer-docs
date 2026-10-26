// Run from repo root: node --test
// Lesson FHIR 0002 (anatomi resource JSON): cakupan topik inti bank soal, kuis per bagian di lesson,
// dan reference anatomi-resource.html. Aturan teach umum dan navigasi diperiksa di fhir-track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("./helpers.js");

const fhir = forTrack("fhir");
const read = f => fs.readFileSync(path.join(ROOT, "fhir", f), "utf8");
const LESSON = "lessons/0002-anatomi-resource-json.html";

test("fhir 0002 covers id vs Identifier, Reference, CodeableConcept/Coding, terminologi and value[x]", () => {
  const { qs, mc } = fhir.lessonQuestions("0002");
  ["res-identifier", "res-reference", "res-codeable", "res-terminologi", "res-choice", "res-json", "res-meta", "res-baca"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["res-contained", "res-extension"].forEach(topic =>
    assert.ok(mc.some(q => q.topic === topic), `butuh soal kuis untuk ${topic}`));
  qs.forEach(q => assert.match(q.topic, /^res-/, `${q.id}: topik harus berprefiks res-`));
  ["res-codeable", "res-identifier", "res-extension"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan ${topic}`));
  const terms = mc.filter(q => q.topic === "res-terminologi").map(q => JSON.stringify(q)).join(" ");
  ["LOINC", "SNOMED CT", "ICD-10", "http://loinc.org"].forEach(s => assert.ok(terms.includes(s), `soal terminologi belum menyebut ${s}`));
});

test("fhir 0002 lesson reads Patient, Encounter and Observation JSON and quizzes every topic", () => {
  const html = read(LESSON);
  ["Patient", "Encounter", "Observation", "Condition"].forEach(t =>
    assert.match(html, new RegExp(`"resourceType": "${t}"`), `lesson belum menampilkan JSON ${t}`));
  ["valueQuantity", "\"contained\"", "\"#p1\"", "_birthDate", "\"versionId\"", "\"profile\"", "http://snomed.info/sct", "http://hl7.org/fhir/sid/icd-10"].forEach(s =>
    assert.ok(html.includes(s), `lesson belum memuat ${s}`));
  const { qs } = fhir.lessonQuestions("0002");
  const quizTopics = [...html.matchAll(/data-bank-lesson="0002" data-bank-topic="([^"]+)"/g)].flatMap(m => m[1].split(","));
  [...new Set(qs.map(q => q.topic))].forEach(topic =>
    assert.ok(quizTopics.includes(topic), `lesson belum punya kuis untuk ${topic}`));
  assert.match(html, /<div class="win">/);
  assert.ok((html.match(/<sup class="cite">/g) || []).length >= 20, "butuh banyak kutipan sumber primer");
  assert.equal((html.match(/<pre class="script"/g) || []).length, 0, "track FHIR tanpa lab");
});

test("fhir 0002 links reference/anatomi-resource.html, which uses the shared stylesheet", () => {
  assert.match(read(LESSON), /href="\.\.\/reference\/anatomi-resource\.html"/);
  const ref = read("reference/anatomi-resource.html");
  assert.match(ref, /href="\.\.\/\.\.\/assets\/style\.css"/);
  assert.match(ref, /href="\.\.\/lessons\/0002-anatomi-resource-json\.html"/);
  assert.match(read("index.html"), /<li class="tersedia"><span class="num">0002<\/span><a class="title" href="lessons\/0002-anatomi-resource-json\.html">/);
});
