// Run from repo root: node --test
// Lesson 0019 (SQL dasar): bank soal, skrip hands-on yang identik dengan dotnet/lab/0019-*.sql,
// dan navigasi 0018 → 0019 → 0020 + entri indeks.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, loadLesson, lessonQuestions, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat, scriptBlocks, assertScriptsMatchFiles } = require("../helpers.js");

const LESSON = "dotnet/lessons/0019-sql-dasar.html";
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");

test("0019 registers mc and oral questions for lesson 0019 with labelled topics", () => {
  const bank = loadLesson("0019");
  const qs = bank.select({ lessons: ["0019"] });
  assert.ok(qs.filter(q => q.type === "mc").length >= 8);
  assert.ok(qs.some(q => q.type === "oral"));
  qs.forEach(q => {
    assert.match(q.id, /^0019-/);
    assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
  });
});

test("0019 mc options have equal word counts and answer positions vary", () => {
  const { mc } = lessonQuestions("0019");
  assertEqualOptionWords(mc);
  assertAnswerPositionsVary(mc);
});

test("0019 oral questions have a 6-point checklist and a sample answer", () => {
  assertOralFormat(lessonQuestions("0019").oral);
});

test("0019 covers JOIN, WHERE vs HAVING, subquery vs CTE, ROW_NUMBER, constraint, normalisasi/view", () => {
  const { qs, mc } = lessonQuestions("0019");
  ["sql-join", "sql-group-having", "sql-subquery-cte", "sql-row-number", "sql-constraint"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  assert.ok(mc.some(q => q.topic === "sql-normalisasi-view"), "butuh soal kuis normalisasi/view");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "sql-row-number"), "butuh soal lisan top-N per grup");
  assert.ok(qs.some(q => q.type === "oral" && q.topic === "sql-constraint"), "butuh soal lisan constraint di database");
});

test("0019 hands-on shows dotnet/lab/0019-*.sql exactly, with a top-3-per-Category exercise", () => {
  assertScriptsMatchFiles(LESSON, { min: 1 });
  scriptBlocks(LESSON).forEach(b => assert.match(b.file, /^dotnet\/lab\/0019-[\w-]+\.sql$/));
  const sql = scriptBlocks(LESSON).map(b => b.text).join("\n");
  ["LEFT JOIN", "HAVING", "WITH ", "ROW_NUMBER() OVER (PARTITION BY", "CREATE OR ALTER VIEW"].forEach(s =>
    assert.ok(sql.includes(s), `skrip lab 0019 belum memuat ${s}`));
  const html = read(LESSON);
  const exercises = html.match(/<div class="sql-exercise">/g) || [];
  assert.ok(exercises.length >= 1 && exercises.length <= 2, "butuh 1–2 latihan tulis query");
  assert.match(html, /3 Product termahal per Category/);
  assert.match(html, /<script src="\.\.\/\.\.\/assets\/hands-on\.js"><\/script>/);
});

test("0019 links its reference doc, and navigation runs 0018 → 0019 → 0020 with an index entry", () => {
  const html = read(LESSON);
  assert.match(html, /href="\.\.\/reference\/sql-dasar\.html"/);
  assert.ok(fs.existsSync(path.join(ROOT, "dotnet/reference/sql-dasar.html")), "reference/sql-dasar.html belum ada");
  const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav, /href="0018-star-mock-interview\.html"/);
  assert.match(nav, /href="0020-[\w-]+\.html"/);
  const nav18 = (read("dotnet/lessons/0018-star-mock-interview.html").match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.match(nav18, /href="0019-sql-dasar\.html"/);
  assert.match(read("dotnet/index.html"), /<li class="tersedia"><span class="num">0019<\/span><a class="title" href="lessons\/0019-sql-dasar\.html">/);
});
