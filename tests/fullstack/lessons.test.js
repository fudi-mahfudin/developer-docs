// Run from repo root: node --test
// Track fullstack: isi lesson (spec .scratch/materi-fullstack/spec.md, "Urutan lesson" dan "Testing").
// Aturan umum (kicker, nav, tanpa elemen interaktif, blok kode <= 20 baris) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

const fsk = forTrack("fullstack");

// Prisma: sintaks Prisma 7 dipakai; docs default prisma.io sudah menampilkan Prisma 8 RC,
// jadi sitasi Prisma harus menunjuk halaman versi 7 (atau panduan upgrade ke v7).
const assertPrismaCitesV7 = (html, label) => {
  [...html.matchAll(/href="(https:\/\/www\.prisma\.io\/docs\/[^"]+)"/g)].forEach(m =>
    assert.match(m[1], /\/docs\/orm\/v7\/|\/upgrades\/to-v7$/, `${label}: sitasi Prisma harus ke docs v7 (${m[1]})`));
};

// ===== Lesson 0001–0005 (teknis) + reference/pertanyaan-sql.html (ticket 02) =====

const TEKNIS = {
  "0001": { file: "0001-fondasi-web-dan-nextjs.html" },
  "0002": { file: "0002-express-dan-rest-api.html" },
  "0003": { file: "0003-sql-desain-skema-dan-query.html" },
  "0004": { file: "0004-sql-index-transaksi-performa.html" },
  "0005": { file: "0005-crud-end-to-end.html" },
};
const TEKNIS_NUMS = Object.keys(TEKNIS);
const SKEMA = ["aset", "kategori", "karyawan", "peminjaman"];

test("teknis 0001–0005 are listed as tersedia in the index", () => {
  fsk.assertListedAsTersedia(TEKNIS);
});

test("teknis 0001–0005 cover the spec keywords", () => {
  const per = {
    "0001": ["semantic", "&lt;label", "alt", "box model", "box-sizing", "Flexbox", "Grid", "media query", "bubbling", "delegation",
      "closure", "async/await", "fetch", "Server Component", "Client Component", "'use client'", "'use cache'", "Server Action", "Pages Router", "Express"],
    "0002": ["resource", "RFC 9110", "201", "204", "400", "401", "403", "404", "409", "422", "middleware", "Express 5",
      "(err, req, res, next)", "Zod", "safeParse", "route", "service", "Prisma"],
    "0003": ["1NF", "2NF", "3NF", "PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK", "1-N", "N-N", "INNER JOIN", "LEFT JOIN",
      "GROUP BY", "HAVING", "subquery", "CTE", "WITH", "ROW_NUMBER", "PARTITION BY"],
    "0004": ["B-tree", "composite", "EXPLAIN", "EXPLAIN ANALYZE", "ACID", "isolation level", "READ COMMITTED", "REPEATABLE READ",
      "N+1", "include", "OFFSET", "keyset", "cursor", "$transaction"],
    "0005": ["schema.prisma", "migrate", "pagination", "search", "filter", "soft delete", "deletedAt", "loading", "error",
      "session", "JWT", "httpOnly", "CORS", "CSRF", "XSS", "SQL injection", "RBAC", "supertest"],
  };
  TEKNIS_NUMS.forEach(n => {
    const html = fsk.readLesson(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("teknis 0001–0005: one win, cite numbering, diagram or code, Prisma cites at v7", () => {
  TEKNIS_NUMS.forEach(n => {
    const html = fsk.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    assertPrismaCitesV7(html, n);
  });
});

test("teknis: version-dependent behaviour is labelled with the version", () => {
  assert.match(fsk.readLesson("0001"), /Next\.js ≥ 16/, "0001: caching diberi label Next.js ≥ 16");
  assert.match(fsk.readLesson("0002"), /Express 5/, "0002: async error diberi label Express 5");
  assert.match(fsk.readLesson("0004"), /MySQL ≥ 8/, "0004: fitur MySQL diberi label versi");
});

test("teknis: 0003 defines the inventaris aset schema and 0004/0005 reuse it", () => {
  const ddl = fsk.readLesson("0003");
  SKEMA.forEach(t => assert.match(ddl, new RegExp(`CREATE TABLE ${t} \\(`), `0003: belum mendefinisikan tabel ${t}`));
  ["0004", "0005"].forEach(n => {
    const html = fsk.readLesson(n);
    ["aset", "peminjaman"].forEach(t => assert.match(html, new RegExp(`\\b${t}\\b`), `${n}: belum memakai tabel ${t}`));
  });
});

test("teknis: 0003 and 0004 end with interview Q&A and written query answers", () => {
  ["0003", "0004"].forEach(n => {
    const html = fsk.readLesson(n);
    assert.match(html, /<h2>[^<]*Pertanyaan interview[^<]*<\/h2>/, `${n}: blok Pertanyaan interview`);
    const qa = (html.split(/<h2>[^<]*Pertanyaan interview[^<]*<\/h2>/)[1] || "").split("<h2>")[0];
    assert.ok((qa.match(/<dt>/g) || []).length >= 4, `${n}: butuh >= 4 tanya-jawab (<dt>/<dd>)`);
    assert.equal((qa.match(/<dt>/g) || []).length, (qa.match(/<dd>/g) || []).length, `${n}: setiap pertanyaan punya jawaban`);
    const tulis = (html.split(/<h2>[^<]*Tulis query[^<]*<\/h2>/)[1] || "").split("<h2>")[0];
    assert.ok(tulis, `${n}: blok Tulis query`);
    assert.ok((tulis.match(/<pre><code>SELECT|<pre><code>WITH/g) || []).length >= 1, `${n}: query jawaban tampil`);
    assert.match(tulis, /Penjelasan/, `${n}: query jawaban dijelaskan`);
  });
});

test("teknis: 0004 has a Beda di MySQL box", () => {
  const html = fsk.readLesson("0004");
  assert.match(html, /<div class="note"><strong>Beda di MySQL/);
  ["AUTO_INCREMENT", "ON DUPLICATE KEY UPDATE", "REPEATABLE READ"].forEach(k => assert.ok(html.includes(k), `0004: Beda di MySQL belum menyebut ${k}`));
});

test("teknis: 0005 walks schema → migration → API → UI → test with code and a 3-minute spoken answer", () => {
  const html = fsk.readLesson("0005");
  const flow = (html.match(/<div class="flow">([\s\S]*?)<\/div>/) || [])[1] || "";
  ["Skema", "Migrasi", "API", "UI", "Test"].forEach(k => assert.match(flow, new RegExp(k), `0005: .flow belum memuat ${k}`));
  const steps = [/model Aset \{/, /prisma migrate dev/, /Router\.get\(/, /'use server'|"use server"/, /request\(app\)/];
  steps.forEach(re => assert.match(html, re, `0005: potongan kode ${re}`));
  assert.match(html, /<h2>[^<]*Contoh jawaban lisan[^<]*<\/h2>/);
  const lisan = (html.split(/<h2>[^<]*Contoh jawaban lisan[^<]*<\/h2>/)[1] || "").split("<nav")[0];
  assert.match(lisan, /jelaskan langkah membuat fitur CRUD/i);
  const words = lisan.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  assert.ok(words >= 300, `0005: jawaban lisan ±3 menit butuh >= 300 kata, ada ${words}`);
});

test("reference pertanyaan-sql: ±30 questions with visible answers on the inventaris aset schema", () => {
  const html = fsk.read("reference/pertanyaan-sql.html");
  assert.match(html, /<div class="kicker">Reference · Fullstack · /);
  const qs = (html.match(/<dt>/g) || []).length;
  assert.ok(qs >= 28 && qs <= 35, `reference: ±30 pertanyaan, ada ${qs}`);
  assert.equal(qs, (html.match(/<dd>/g) || []).length, "reference: setiap pertanyaan punya jawaban");
  SKEMA.forEach(t => assert.match(html, new RegExp(`\\b${t}\\b`), `reference: belum memakai tabel ${t}`));
  assert.match(html, /Beda di MySQL/);
  assert.match(html, /href="\.\.\/index\.html"/);
  assertCitesNumbered(html, "reference/pertanyaan-sql");
  assertPrismaCitesV7(html, "reference/pertanyaan-sql");
});

// ===== akhir bagian ticket 02 =====
