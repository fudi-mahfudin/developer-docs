// Run from repo root: node --test
// Modul Resource FHIR (lesson 0004–0007, dipecah dari lesson lama 0002 "Anatomi resource JSON"): cakupan topik inti
// bank soal, kuis per topik di lesson, target dan sitasi per lesson, urutan navigasi di dalam modul, dan reference
// anatomi-resource.html. Aturan teach umum dan navigasi antar-lesson diperiksa di track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const read = f => fs.readFileSync(path.join(ROOT, "fhir", f), "utf8");
const LESSONS = {
  "0004": "lessons/0004-kerangka-json-dan-identifier.html",
  "0005": "lessons/0005-reference-dan-codeableconcept.html",
  "0006": "lessons/0006-terminologi-dan-value-x.html",
  "0007": "lessons/0007-meta-contained-extension.html",
};
const NUMS = Object.keys(LESSONS);
const html = Object.fromEntries(NUMS.map(n => [n, read(LESSONS[n])]));
const allHtml = Object.values(html).join("\n");
const bank = fhir.loadLesson(...NUMS);
const qs = bank.select({ lessons: NUMS });
const mc = qs.filter(q => q.type === "mc");

test("modul resource covers id vs Identifier, Reference, CodeableConcept/Coding, terminologi and value[x]", () => {
  ["res-identifier", "res-reference", "res-codeable", "res-terminologi", "res-choice", "res-json", "res-meta", "res-baca"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  ["res-contained", "res-extension"].forEach(topic =>
    assert.ok(mc.some(q => q.topic === topic), `butuh soal kuis untuk ${topic}`));
  qs.forEach(q => assert.match(q.topic, /^res-/, `${q.id}: topik harus berprefiks res-`));
  ["res-codeable", "res-identifier", "res-extension", "res-terminologi"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan ${topic}`));
  const terms = mc.filter(q => q.topic === "res-terminologi").map(q => JSON.stringify(q)).join(" ");
  ["LOINC", "SNOMED CT", "ICD-10", "http://loinc.org"].forEach(s => assert.ok(terms.includes(s), `soal terminologi belum menyebut ${s}`));
});

test("modul resource: each topic lives in exactly one lesson bank, and each question in its own lesson", () => {
  const owner = {};
  qs.forEach(q => {
    assert.match(q.id, new RegExp(`^${q.lesson}-`), `${q.id}: id harus berawalan nomor lesson`);
    assert.ok(!owner[q.topic] || owner[q.topic] === q.lesson, `topik ${q.topic} tersebar di ${owner[q.topic]} dan ${q.lesson}`);
    owner[q.topic] = q.lesson;
  });
});

test("modul resource lessons read Patient, Encounter, Observation and Condition JSON and quiz every topic in its lesson", () => {
  ["Patient", "Encounter", "Observation", "Condition"].forEach(t =>
    assert.match(allHtml, new RegExp(`"resourceType": "${t}"`), `modul belum menampilkan JSON ${t}`));
  ["valueQuantity", "\"contained\"", "\"#p1\"", "_birthDate", "\"versionId\"", "\"profile\"", "http://snomed.info/sct", "http://hl7.org/fhir/sid/icd-10"].forEach(s =>
    assert.ok(allHtml.includes(s), `modul belum memuat ${s}`));
  NUMS.forEach(n => {
    const page = html[n];
    const lessonQs = bank.select({ lessons: [n] });
    const quizTopics = [...page.matchAll(new RegExp(`data-bank-lesson="${n}" data-bank-topic="([^"]+)"`, "g"))].flatMap(m => m[1].split(","));
    [...new Set(lessonQs.map(q => q.topic))].forEach(topic =>
      assert.ok(quizTopics.includes(topic), `${n}: lesson belum punya kuis untuk ${topic}`));
    assert.doesNotMatch(page, /data-bank-lesson="(?!\d{4}")|data-bank-lesson="0002"/, `${n}: kuis masih menunjuk bank lama`);
    assert.equal((page.match(/<div class="win">/g) || []).length, 1, `${n}: butuh tepat satu target (win)`);
    assert.equal((page.match(/<pre class="script"/g) || []).length, 0, `${n}: track FHIR tanpa lab`);
  });
});

test("modul resource cites primary sources, numbered per lesson with a matching source list", () => {
  let total = 0;
  NUMS.forEach(n => {
    const page = html[n];
    const cites = [...page.matchAll(/<sup class="cite"><a href="([^"]+)">\[(\d+)\]<\/a><\/sup>/g)].map(m => ({ url: m[1], n: +m[2] }));
    total += cites.length;
    const listed = Object.fromEntries([...(page.match(/<p class="note sources">([\s\S]*?)<\/p>/) || ["", ""])[1]
      .matchAll(/<a href="([^"]+)">\[(\d+)\]/g)].map(m => [+m[2], m[1]]));
    const used = [...new Set(cites.map(c => c.n))].sort((a, b) => a - b);
    assert.deepEqual(used, Array.from({ length: used.length }, (_, i) => i + 1), `${n}: sitasi harus bernomor 1..k`);
    assert.deepEqual(Object.keys(listed).map(Number), used, `${n}: daftar Sumber harus tepat memuat sitasi yang dipakai`);
    cites.forEach(c => assert.equal(c.url, listed[c.n], `${n}: sitasi [${c.n}] tidak cocok dengan daftar Sumber`));
  });
  assert.ok(total >= 20, "butuh banyak kutipan sumber primer di modul");
});

test("modul resource lessons link their neighbours in order", () => {
  const files = ["0003-profile-extension-ig.html", ...NUMS.map(n => path.basename(LESSONS[n])), "0008-crud-dan-search.html"];
  NUMS.forEach((n, i) => {
    const nav = (html[n].match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const links = [...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(links, [files[i], files[i + 2]], `${n}: nav sebelum/sesudah`);
    assert.match(html[n], new RegExp(`<div class="kicker">Lesson ${n} · FHIR · Modul Resource · ±\\d+ menit</div>`), `${n}: kicker`);
  });
  assert.match(html["0007"], /Bacaan lanjutan \(opsional, tidak dihitung dalam durasi\)/, "bacaan lanjutan di lesson terakhir modul");
});

test("modul resource links reference/anatomi-resource.html, which links back and uses the shared stylesheet", () => {
  assert.match(allHtml, /href="\.\.\/reference\/anatomi-resource\.html"/);
  const ref = read("reference/anatomi-resource.html");
  assert.match(ref, /href="\.\.\/\.\.\/assets\/style\.css"/);
  assert.match(ref, /href="\.\.\/lessons\/0004-kerangka-json-dan-identifier\.html"/);
  assert.doesNotMatch(ref, /0002-anatomi-resource-json\.html/);
  const index = read("index.html");
  NUMS.forEach(n => assert.match(index, new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="${LESSONS[n]}">`)));
});
