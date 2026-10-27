// Run from repo root: node --test
// Track FHIR, lesson 0003 (FHIR REST API): cakupan topik inti bank soal, reference cheat sheet,
// dan navigasi 0002 → 0003 → 0004 + entri indeks. Aturan teach umum ada di fhir-track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const LESSON = "fhir/lessons/0003-fhir-rest-api.html";
const REFERENCE = "fhir/reference/rest-search-bundle.html";
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");

test("fhir 0003 covers CRUD, search, include/chaining, paging, Bundle, versioning, OperationOutcome", () => {
  const { qs, mc } = fhir.lessonQuestions("0003");
  const count = topic => mc.filter(q => q.topic === topic).length;
  ["rest-crud", "rest-search", "rest-include", "rest-paging", "rest-bundle", "rest-versioning", "rest-error"].forEach(topic =>
    assert.ok(count(topic) >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  qs.forEach(q => assert.match(q.topic, /^rest-/, `${q.id}: topik harus berprefiks rest-`));
  const text = mc.map(q => q.prompt + Object.values(q.options).join(" ") + q.explain).join(" ");
  ["410", "201", "_include", "_revinclude", ":missing", "ge2010", "next", "search.mode", "If-None-Exist",
    "If-Match", "412", "_history", "OperationOutcome", "422", "/metadata"].forEach(s =>
    assert.ok(text.includes(s), `kuis 0003 belum menyinggung ${s}`));
  ["rest-include", "rest-bundle", "rest-versioning"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan ${topic}`));
});

test("fhir 0003 lesson renders every quiz topic and links the REST/search/Bundle reference", () => {
  const html = read(LESSON);
  const { mc } = fhir.lessonQuestions("0003");
  const rendered = [...html.matchAll(/data-bank-lesson="0003" data-bank-topic="([\w,-]+)"/g)].flatMap(m => m[1].split(","));
  new Set(mc.map(q => q.topic)).forEach(t => assert.ok(rendered.includes(t), `kuis topik ${t} belum dirender di lesson`));
  assert.match(html, /<div class="win">/);
  assert.match(html, /href="\.\.\/reference\/rest-search-bundle\.html"/);
  assert.ok(fs.existsSync(path.join(ROOT, REFERENCE)), `${REFERENCE} belum ada`);
  assert.match(read(REFERENCE), /href="\.\.\/\.\.\/assets\/style\.css"/);
  assert.match(read(REFERENCE), /href="\.\.\/lessons\/0003-fhir-rest-api\.html"/);
});

test("fhir 0003 navigation runs 0002 → 0003 → 0004 with an index entry", () => {
  const nav = (read(LESSON).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav, /href="0002-anatomi-resource-json\.html"/);
  assert.match(nav, /href="0004-json-massal-bulk-data\.html"/);
  assert.match(read("fhir/index.html"), /<li class="tersedia"><span class="num">0003<\/span><a class="title" href="lessons\/0003-fhir-rest-api\.html">/);
});
