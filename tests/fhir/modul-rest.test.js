// Run from repo root: node --test
// Track FHIR, modul REST (lesson 0008–0011, dipecah dari lesson lama 0003 "FHIR REST API"): cakupan topik inti
// bank soal gabungan modul, reference cheat sheet, dan navigasi 0007 → 0008 → … → 0011 → 0012.
// Aturan teach umum ada di track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const fhir = forTrack("fhir");
const MODULE = [
  { num: "0008", file: "fhir/lessons/0008-crud-dan-search.html" },
  { num: "0009", file: "fhir/lessons/0009-include-dan-paging.html" },
  { num: "0010", file: "fhir/lessons/0010-bundle-dan-versioning.html" },
  { num: "0011", file: "fhir/lessons/0011-operationoutcome-dan-capability.html" },
];
const PREV = "0007-meta-contained-extension.html";
const NEXT = "0012-review-fondasi-resource.html";
const REFERENCE = "fhir/reference/rest-search-bundle.html";
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const moduleQuestions = () => {
  const qs = MODULE.flatMap(({ num }) => fhir.lessonQuestions(num).qs);
  return { qs, mc: qs.filter(q => q.type === "mc") };
};

test("modul REST covers CRUD, search, include/chaining, paging, Bundle, versioning, OperationOutcome", () => {
  const { qs, mc } = moduleQuestions();
  const count = topic => mc.filter(q => q.topic === topic).length;
  ["rest-crud", "rest-search", "rest-include", "rest-paging", "rest-bundle", "rest-versioning", "rest-error"].forEach(topic =>
    assert.ok(count(topic) >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  qs.forEach(q => assert.match(q.topic, /^rest-/, `${q.id}: topik harus berprefiks rest-`));
  const text = mc.map(q => q.prompt + Object.values(q.options).join(" ") + q.explain).join(" ");
  ["410", "201", "_include", "_revinclude", ":missing", "ge2010", "next", "search.mode", "If-None-Exist",
    "If-Match", "412", "_history", "OperationOutcome", "422", "/metadata"].forEach(s =>
    assert.ok(text.includes(s), `kuis modul REST belum menyinggung ${s}`));
  ["rest-include", "rest-bundle", "rest-versioning"].forEach(topic =>
    assert.ok(qs.some(q => q.type === "oral" && q.topic === topic), `butuh soal lisan ${topic}`));
});

test("each modul REST lesson has one target and renders every quiz topic of its own bank", () => {
  MODULE.forEach(({ num, file }) => {
    const html = read(file);
    const { mc } = fhir.lessonQuestions(num);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${file}: harus tepat satu <div class="win">`);
    const rendered = [...html.matchAll(new RegExp(`data-bank-lesson="${num}" data-bank-topic="([\\w,-]+)"`, "g"))].flatMap(m => m[1].split(","));
    new Set(mc.map(q => q.topic)).forEach(t => assert.ok(rendered.includes(t), `${file}: kuis topik ${t} belum dirender`));
  });
});

test("modul REST links the REST/search/Bundle reference, and the reference links back", () => {
  MODULE.forEach(({ file }) => assert.match(read(file), /href="\.\.\/reference\/rest-search-bundle\.html"/, `${file}: belum menautkan cheat sheet`));
  assert.ok(fs.existsSync(path.join(ROOT, REFERENCE)), `${REFERENCE} belum ada`);
  const ref = read(REFERENCE);
  assert.match(ref, /href="\.\.\/\.\.\/assets\/style\.css"/);
  assert.match(ref, /href="\.\.\/lessons\/0008-crud-dan-search\.html"/);
});

test("modul REST is concept-only (no lab script blocks)", () => {
  MODULE.forEach(({ file }) => assert.doesNotMatch(read(file), /class="script"|hands-on\.js/, `${file}: modul REST tanpa lab`));
});

test("modul REST navigation runs 0007 → 0008 → 0009 → 0010 → 0011 → 0012 with index entries", () => {
  const index = read("fhir/index.html");
  MODULE.forEach(({ num, file }, i) => {
    const nav = (read(file).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const prev = i === 0 ? PREV : path.basename(MODULE[i - 1].file);
    const next = i === MODULE.length - 1 ? NEXT : path.basename(MODULE[i + 1].file);
    assert.ok(nav.includes(`href="${prev}"`), `${file}: nav belum menautkan ${prev}`);
    assert.ok(nav.includes(`href="${next}"`), `${file}: nav belum menautkan ${next}`);
    assert.ok(index.includes(`<li class="tersedia"><span class="num">${num}</span><a class="title" href="lessons/${path.basename(file)}">`), `indeks belum menautkan ${num}`);
  });
});
