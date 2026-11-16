// Run from repo root: node --test
// Track fullstack: isi lesson (spec .scratch/materi-fullstack/spec.md, "Urutan lesson" dan "Testing").
// Aturan umum (kicker, nav, tanpa elemen interaktif, blok kode <= 20 baris) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

// Prisma: sintaks Prisma 7 dipakai; docs default prisma.io sudah menampilkan Prisma 8 RC,
// jadi sitasi Prisma harus menunjuk halaman versi 7 (atau panduan upgrade ke v7).
const assertPrismaCitesV7 = (html, label) => {
  [...html.matchAll(/href="(https:\/\/www\.prisma\.io\/docs\/[^"]+)"/g)].forEach(m =>
    assert.match(m[1], /\/docs\/orm\/v7\/|\/upgrades\/to-v7$/, `${label}: sitasi Prisma harus ke docs v7 (${m[1]})`));
};

const fs_ = forTrack("fullstack");

// ---------------------------------------------------------------------------
// 0006–0007: peran sole developer dan IT di luar development (ticket 03)
// ---------------------------------------------------------------------------
const PERAN = {
  "0006": {
    file: "0006-sole-developer-aplikasi-internal.html",
    keywords: [/requirement/i, /MVP/, /testing/i, /deploy/i, /backup/i, /monitoring/i, /preventive maintenance/i,
      /SOP/, /maintenance record/i, /dokumentasi/i, /inventaris aset/i],
  },
  "0007": {
    file: "0007-peran-it-di-luar-development.html",
    keywords: [/subnet/i, /DHCP/, /DNS/, /gateway/i, /\bping\b/, /tracert/, /nslookup/, /printer/i, /3-2-1/,
      /hak akses/i, /resolusi/i, /kompresi/i, /aspect ratio/i, /portofolio/i, /troubleshooting/i],
  },
};

test("fullstack 0006–0007 are listed as tersedia in the index", () => {
  fs_.assertListedAsTersedia(PERAN);
});

Object.entries(PERAN).forEach(([num, { keywords }]) => {
  test(`fullstack ${num}: covers the spec topics, cites primary sources, and shows a diagram or code`, () => {
    const html = fs_.readLesson(num);
    keywords.forEach(re => assert.match(html, re, `${num}: belum membahas ${re}`));
    assertCitesNumbered(html, num);
    assert.match(html, /class="flow"|<svg class="diagram"|<pre><code>/, `${num}: butuh diagram atau blok kode`);
  });
});

test("fullstack 0006: sole-dev flow in order, filled SOP and maintenance record", () => {
  const html = fs_.readLesson("0006");
  const flow = (html.match(/<div class="flow">([\s\S]*?)<\/div>/) || [])[1] || "";
  [/[Rr]equirement/, /MVP/, /[Ss]tack/, /[Tt]esting/, /[Dd]eploy/, /[Bb]ackup/, /[Mm]onitoring/, /[Dd]okumentasi/]
    .reduce((from, re) => {
      const at = flow.slice(from).search(re);
      assert.ok(at >= 0, `alur .flow: ${re} tidak ada atau tidak berurutan`);
      return from + at;
    }, 0);
  assert.match(html, /<h3[^>]*>[^<]*SOP/, "butuh contoh SOP terisi");
  assert.match(html, /<h3[^>]*>[^<]*[Mm]aintenance record/, "butuh contoh maintenance record terisi");
});

test("fullstack 0006: one full STAR story with numbers in the Result", () => {
  const html = fs_.readLesson("0006");
  const stars = [...html.matchAll(/<div class="note" id="star">([\s\S]*?)<\/div>/g)];
  assert.equal(stars.length, 1, "butuh tepat satu cerita STAR");
  const star = stars[0][1];
  ["Situation", "Task", "Action", "Result"].reduce((from, k) => {
    const at = star.indexOf(`<strong>${k}`, from);
    assert.ok(at >= 0, `STAR: ${k} tidak ada atau tidak berurutan`);
    return at;
  }, 0);
  assert.match(star.split("<strong>Result")[1], /\d/, "Result STAR harus memuat angka");
});

test("fullstack 0007: troubleshooting flow and honest example answers", () => {
  const html = fs_.readLesson("0007");
  assert.match(html, /class="flow"|<svg class="diagram"/, "0007: butuh alur troubleshooting");
  assert.match(html, /[Cc]ontoh jawaban/, "0007: butuh contoh jawaban");
});

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
  fs_.assertListedAsTersedia(TEKNIS);
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
    const html = fs_.readLesson(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("teknis 0001–0005: one win, cite numbering, diagram or code, Prisma cites at v7", () => {
  TEKNIS_NUMS.forEach(n => {
    const html = fs_.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    assertPrismaCitesV7(html, n);
  });
});

test("teknis: version-dependent behaviour is labelled with the version", () => {
  assert.match(fs_.readLesson("0001"), /Next\.js ≥ 16/, "0001: caching diberi label Next.js ≥ 16");
  assert.match(fs_.readLesson("0002"), /Express 5/, "0002: async error diberi label Express 5");
  assert.match(fs_.readLesson("0004"), /MySQL ≥ 8/, "0004: fitur MySQL diberi label versi");
});

test("teknis: 0003 defines the inventaris aset schema and 0004/0005 reuse it", () => {
  const ddl = fs_.readLesson("0003");
  SKEMA.forEach(t => assert.match(ddl, new RegExp(`CREATE TABLE ${t} \\(`), `0003: belum mendefinisikan tabel ${t}`));
  ["0004", "0005"].forEach(n => {
    const html = fs_.readLesson(n);
    ["aset", "peminjaman"].forEach(t => assert.match(html, new RegExp(`\\b${t}\\b`), `${n}: belum memakai tabel ${t}`));
  });
});

test("teknis: 0003 and 0004 end with interview Q&A and written query answers", () => {
  ["0003", "0004"].forEach(n => {
    const html = fs_.readLesson(n);
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
  const html = fs_.readLesson("0004");
  assert.match(html, /<div class="note"><strong>Beda di MySQL/);
  ["AUTO_INCREMENT", "ON DUPLICATE KEY UPDATE", "REPEATABLE READ"].forEach(k => assert.ok(html.includes(k), `0004: Beda di MySQL belum menyebut ${k}`));
});

test("teknis: 0005 walks schema → migration → API → UI → test with code and a 3-minute spoken answer", () => {
  const html = fs_.readLesson("0005");
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
  const html = fs_.read("reference/pertanyaan-sql.html");
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

// ===== Lesson 0008–0010 + reference/soal-coding-tambahan.html (ticket 04) =====

// Format soal coding (spec "Soal coding"): satu <h2>Soal N: ...</h2> per soal, berisi tujuh <h3> berurutan.
// Pseudocode (jawaban utama) dan implementasi JS langsung tampil di <pre><code>.
const LANGKAH = ["Soal", "Pertanyaan klarifikasi", "Ide", "Pseudocode", "Implementasi JavaScript", "Kompleksitas", "Edge case"];
const soalSections = html => [...html.matchAll(/<h2>Soal \d+: ([^<]*)<\/h2>([\s\S]*?)(?=<h2>|<p class="note sources">)/g)]
  .map(m => ({ title: m[1], body: m[2] }));
const step = (body, name) => (body.split(`<h3>${name}</h3>`)[1] || "").split("<h3>")[0];

function assertCodingFormat(html, label) {
  const soal = soalSections(html);
  soal.forEach(({ title, body }) => {
    LANGKAH.reduce((from, name) => {
      const at = body.indexOf(`<h3>${name}</h3>`, from);
      assert.ok(at >= 0, `${label} "${title}": langkah ${name} tidak ada atau tidak berurutan`);
      return at;
    }, 0);
    assert.match(step(body, "Pseudocode"), /<pre><code>/, `${label} "${title}": pseudocode tampil`);
    assert.match(step(body, "Implementasi JavaScript"), /<pre><code>(?:(?!<\/code>)[\s\S])*\bfunction \w+\(/, `${label} "${title}": implementasi JS tampil`);
    assert.match(step(body, "Kompleksitas"), /O\(/, `${label} "${title}": kompleksitas Big-O`);
    assert.ok((step(body, "Edge case").match(/<li>/g) || []).length >= 2, `${label} "${title}": >= 2 edge case`);
  });
  return soal;
}

const CODING = {
  "0008": { file: "0008-coding-angka-dan-string.html", soal: [/[Pp]alindrome integer/, /[Rr]everse integer/, /[Aa]nagram/, /[Vv]alid parentheses/] },
};

test("coding lessons are listed as tersedia in the index", () => {
  fs_.assertListedAsTersedia(CODING);
});

Object.entries(CODING).forEach(([num, { soal: expected }]) => {
  test(`fullstack ${num}: every soal follows the 7-step format with pseudocode and JS shown`, () => {
    const html = fs_.readLesson(num);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${num}: harus tepat satu target`);
    assertCitesNumbered(html, num);
    const soal = assertCodingFormat(html, num);
    assert.equal(soal.length, expected.length, `${num}: jumlah soal`);
    expected.forEach((re, i) => assert.match(soal[i].title, re, `${num}: soal ${i + 1} harus ${re}`));
  });
});

test("fullstack 0008: palindrome integer without strings, half reversal, and its edge cases", () => {
  const [pal, rev] = soalSections(fs_.readLesson("0008"));
  const impl = step(pal.body, "Implementasi JavaScript");
  assert.doesNotMatch(impl, /String\(|toString|\.split\(|`/, "palindrome: implementasi tanpa konversi ke string");
  assert.match(pal.body, /separuh/, "palindrome: teknik membalik separuh angka");
  const edge = step(pal.body, "Edge case");
  [/negatif/, /berakhiran 0/, /overflow/i].forEach(re => assert.match(edge, re, `palindrome edge case ${re}`));
  assert.match(rev.body, /overflow/i);
  assert.match(rev.body, /2<sup>31<\/sup>|2147483647/, "reverse integer: batas 32-bit");
});
