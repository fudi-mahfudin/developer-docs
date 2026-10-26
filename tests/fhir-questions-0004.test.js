// Run from repo root: node --test
// Track FHIR, lesson 0004 (JSON massal): cakupan topik inti bank soal fhir/assets/questions/0004.js.
// Aturan teach umum (jumlah kata opsi, posisi jawaban, format lisan, navigasi) sudah diuji fhir-track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("./helpers.js");

const fhir = forTrack("fhir");
const LESSON = path.join(ROOT, "fhir", "lessons", "0004-json-massal-bulk-data.html");

test("fhir 0004 covers $export, polling, manifest/NDJSON, JSON.parse limits, streaming, backpressure and decimal", () => {
  const { qs, mc } = fhir.lessonQuestions("0004");
  ["bulk-export", "bulk-polling", "bulk-manifest", "bulk-jsonparse", "bulk-stream", "bulk-backpressure", "bulk-decimal"].forEach(topic =>
    assert.ok(mc.filter(q => q.topic === topic).length >= 2, `butuh >= 2 soal kuis untuk ${topic}`));
  qs.forEach(q => assert.match(q.topic, /^bulk-/, `${q.id}: topik harus berprefiks bulk-`));
  const oral = qs.filter(q => q.type === "oral");
  assert.ok(oral.length >= 2, "butuh >= 2 soal lisan");
  assert.ok(oral.some(q => q.topic === "bulk-polling"), "butuh soal lisan alur $export");
  assert.ok(oral.some(q => q.topic === "bulk-backpressure"), "butuh soal lisan memproses NDJSON besar di Node");
});

test("fhir 0004 questions mention the key Bulk Data and Node terms", () => {
  const text = fhir.lessonQuestions("0004").qs
    .map(q => [q.prompt, q.explain, q.sample, ...Object.values(q.options || {}), ...(q.checklist || [])].join(" ")).join(" ");
  ["Prefer: respond-async", "202", "Content-Location", "Retry-After", "429", "transactionTime", "_since", "_type",
    "NDJSON", "highWaterMark", "drain", "pipeline", "readline", "stream-json", "2.00"].forEach(term =>
    assert.ok(text.includes(term), `bank soal 0004 belum menyebut ${term}`));
});

test("fhir 0004 lesson cites the Bulk Data IG STU2 and has an $export order exercise", () => {
  const html = fs.readFileSync(LESSON, "utf8");
  assert.match(html, /href="https:\/\/hl7\.org\/fhir\/uv\/bulkdata\/STU2\/export\.html/);
  assert.match(html, /v2\.0\.0/);
  assert.match(html, /<div class="order">/);
  assert.ok(!/class="(script|sql-exercise)"/.test(html), "track FHIR tanpa hands-on/lab");
});
