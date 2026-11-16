// Run from repo root: node --test
// Track fullstack: isi lesson (spec .scratch/materi-fullstack/spec.md, "Urutan lesson" dan "Testing").
// Aturan umum (kicker, nav, tepat satu .win, tanpa elemen interaktif, blok kode <= 20 baris) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

const track = forTrack("fullstack");

const LESSON_FILES = {
  "0001": "0001-fondasi-web-dan-nextjs.html",
  "0002": "0002-express-dan-rest-api.html",
  "0003": "0003-sql-desain-skema-dan-query.html",
  "0004": "0004-sql-index-transaksi-performa.html",
  "0005": "0005-crud-end-to-end.html",
  "0006": "0006-sole-developer-aplikasi-internal.html",
  "0007": "0007-peran-it-di-luar-development.html",
  "0008": "0008-coding-angka-dan-string.html",
  "0009": "0009-coding-array-dan-pencarian.html",
  "0010": "0010-simulasi-interview.html",
};
const TEKNIS = ["0001", "0002", "0003", "0004", "0005"];
const SKEMA = ["aset", "kategori", "karyawan", "peminjaman"];

// Prisma: sintaks Prisma 7 dipakai; docs default prisma.io sudah menampilkan Prisma 8 RC,
// jadi sitasi Prisma harus menunjuk halaman versi 7 (atau panduan upgrade ke v7).
const assertPrismaCitesV7 = (html, label) => {
  [...html.matchAll(/href="(https:\/\/www\.prisma\.io\/docs\/[^"]+)"/g)].forEach(m =>
    assert.match(m[1], /\/docs\/orm\/v7\/|\/upgrades\/to-v7$/, `${label}: sitasi Prisma harus ke docs v7 (${m[1]})`));
};
// Isi <pre><code> pertama yang memuat `marker` (mis. nama file di komentar baris pertama).
const codeBlock = (html, marker) =>
  [...html.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)].map(m => m[1]).find(c => c.includes(marker)) || "";
// Semua kotak "Beda di MySQL" di satu halaman, digabung.
const mysqlBoxes = html => [...html.matchAll(/<div class="note"><strong>Beda di MySQL[\s\S]*?<\/div>/g)].map(m => m[0]).join("\n");
// Isi bagian <h2> yang judulnya diawali `heading`, sampai <h2> berikutnya.
const h2Section = (html, heading) => (html.split(new RegExp(`<h2>${heading}[^<]*</h2>`))[1] || "").split("<h2>")[0];

test("fullstack 0001–0010 are listed as tersedia in the index", () => {
  track.assertListedAsTersedia(Object.fromEntries(Object.entries(LESSON_FILES).map(([n, file]) => [n, { file }])));
});

// ---------------------------------------------------------------------------
// 0001–0005: teknis (aturan bersama)
// ---------------------------------------------------------------------------

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
  TEKNIS.forEach(n => {
    const html = track.readLesson(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("teknis 0001–0005: cite numbering, diagram or code, Prisma cites at v7", () => {
  TEKNIS.forEach(n => {
    const html = track.readLesson(n);
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    assertPrismaCitesV7(html, n);
  });
});

test("teknis: version-dependent behaviour is labelled with the version", () => {
  assert.match(track.readLesson("0001"), /Next\.js ≥ 16/, "0001: caching diberi label Next.js ≥ 16");
  assert.match(track.readLesson("0002"), /Express 5/, "0002: async error diberi label Express 5");
  assert.match(track.readLesson("0004"), /MySQL ≥ 8/, "0004: fitur MySQL diberi label versi");
});

test("teknis: 0003 defines the inventaris aset schema and 0004/0005 reuse it", () => {
  const ddl = track.readLesson("0003");
  SKEMA.forEach(t => assert.match(ddl, new RegExp(`CREATE TABLE ${t} \\(`), `0003: belum mendefinisikan tabel ${t}`));
  ["0004", "0005"].forEach(n => {
    const html = track.readLesson(n);
    ["aset", "peminjaman"].forEach(t => assert.match(html, new RegExp(`\\b${t}\\b`), `${n}: belum memakai tabel ${t}`));
  });
});

test("teknis: 0003 and 0004 end with interview Q&A and written query answers", () => {
  ["0003", "0004"].forEach(n => {
    const html = track.readLesson(n);
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

// ---------------------------------------------------------------------------
// 0002: Express dan REST API
// ---------------------------------------------------------------------------

test("fullstack 0002: asetCreateSchema covers every required column of the Prisma model", () => {
  const schema = codeBlock(track.readLesson("0002"), "asetCreateSchema = z.object(");
  ["kode", "nama", "kategoriId", "harga", "status"].forEach(f => assert.match(schema, new RegExp(`\\b${f}:`), `asetCreateSchema: ${f}`));
  assert.match(schema, /tanggalBeli: z\.coerce\.date\(\)/, "asetCreateSchema: tanggalBeli wajib (kolom NOT NULL di Prisma)");
});

test("fullstack 0002: the status-code table matches the code (negative price → 400)", () => {
  const html = track.readLesson("0002");
  const row = (html.match(/<tr><td>(\d{3})[^<]*<\/td><td>[^<]*harga negatif/) || [])[1];
  assert.equal(row, "400", "0002: tabel status code harus memetakan harga negatif ke 400 seperti kode validate()");
  assert.match(html, /422/, "0002: tetap menyebut bahwa sebagian tim memakai 422");
});

// ---------------------------------------------------------------------------
// 0003: SQL, desain skema, dan query
// ---------------------------------------------------------------------------

test("fullstack 0003: Beda di MySQL covers every PostgreSQL-only construct used", () => {
  const box = mysqlBoxes(track.readLesson("0003"));
  assert.ok(box, "0003: butuh kotak Beda di MySQL");
  ["AUTO_INCREMENT", "TIMESTAMP", "DATETIME", "DATEDIFF", "DISTINCT ON", "ROW_NUMBER", "NULL", "UNIQUE", "FOREIGN KEY"]
    .forEach(k => assert.ok(box.includes(k), `0003: Beda di MySQL belum menyebut ${k}`));
});

test("fullstack 0003: the LEFT JOIN trap uses a filter that really drops NULL rows", () => {
  const join = h2Section(track.readLesson("0003"), "3\\. JOIN");
  assert.doesNotMatch(join, /WHERE p\.tanggal_kembali IS NULL/, "IS NULL di WHERE tidak membuang baris NULL hasil LEFT JOIN");
  assert.match(join, /WHERE p\.tanggal_pinjam &gt;=/, "contoh jebakan: filter >= pada tabel kanan di WHERE");
});

// ---------------------------------------------------------------------------
// 0004: index, transaksi, performa
// ---------------------------------------------------------------------------

test("fullstack 0004: Beda di MySQL box", () => {
  const box = mysqlBoxes(track.readLesson("0004"));
  ["AUTO_INCREMENT", "ON DUPLICATE KEY UPDATE", "REPEATABLE READ"].forEach(k => assert.ok(box.includes(k), `0004: Beda di MySQL belum menyebut ${k}`));
});

// ---------------------------------------------------------------------------
// 0005: CRUD end-to-end
// ---------------------------------------------------------------------------

test("fullstack 0005: walks schema → migration → API → UI → test with code and a 3-minute spoken answer", () => {
  const html = track.readLesson("0005");
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

test("fullstack 0005: the API helper sends no session cookie when logged out", () => {
  const api = codeBlock(track.readLesson("0005"), "// lib/api.js");
  assert.ok(api, "0005: blok lib/api.js");
  assert.doesNotMatch(api, /Cookie: `sid=\$\{sid\}`, \.\.\.init\.headers/, "lib/api.js: jangan kirim sid=undefined");
  assert.match(api, /sid &amp;&amp;|sid \?|if \(sid\)/, "lib/api.js: Cookie hanya dikirim bila sid ada");
});

test("fullstack 0005: the Server Action checks the session and validates input before calling the API", () => {
  const action = codeBlock(track.readLesson("0005"), "// app/aset/actions.js");
  assert.match(action, /'use server'/);
  const at = re => action.search(re);
  [/redirect\('\/login'\)/, /\.safeParse\(/, /api\('\/aset'/].reduce((from, re) => {
    assert.ok(at(re) > from, `simpanAset: ${re} tidak ada atau tidak berurutan (session → Zod → API)`);
    return at(re);
  }, -1);
});

test("fullstack 0005: error.js retry is labelled with its Next.js version and mentions reset", () => {
  const html = track.readLesson("0005");
  assert.match(codeBlock(html, "// app/aset/error.js"), /retry/);
  assert.match(html, /<code>retry<\/code>[^.]*Next\.js 16\.3/, "0005: retry diberi label Next.js 16.3");
  assert.match(html, /<code>reset<\/code>/, "0005: sebut reset untuk versi lama");
});

test("fullstack 0005: example request bodies include tanggalBeli", () => {
  const html = track.readLesson("0005");
  [...html.matchAll(/\.send\(\{([^}]*)\}\)/g)].forEach(m => assert.match(m[1], /tanggalBeli/, `0005: body test tanpa tanggalBeli: ${m[1]}`));
});

// ---------------------------------------------------------------------------
// 0006–0007: sole developer dan IT di luar development
// ---------------------------------------------------------------------------

const PERAN = {
  "0006": [/requirement/i, /MVP/, /testing/i, /deploy/i, /backup/i, /monitoring/i, /preventive maintenance/i,
    /SOP/, /maintenance record/i, /dokumentasi/i, /inventaris aset/i],
  "0007": [/subnet/i, /DHCP/, /DNS/, /gateway/i, /\bping\b/, /tracert/, /nslookup/, /printer/i, /3-2-1/,
    /hak akses/i, /resolusi/i, /kompresi/i, /aspect ratio/i, /portofolio/i, /troubleshooting/i],
};

Object.entries(PERAN).forEach(([num, keywords]) => {
  test(`fullstack ${num}: covers the spec topics, cites primary sources, and shows a diagram or code`, () => {
    const html = track.readLesson(num);
    keywords.forEach(re => assert.match(html, re, `${num}: belum membahas ${re}`));
    assertCitesNumbered(html, num);
    assert.match(html, /class="flow"|<svg class="diagram"|<pre><code>/, `${num}: butuh diagram atau blok kode`);
  });
});

test("fullstack 0006: sole-dev flow in order, filled SOP and maintenance record", () => {
  const html = track.readLesson("0006");
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

test("fullstack 0006: maintenance record only names columns of the 0003 schema", () => {
  const html = track.readLesson("0006");
  const columns = [...track.readLesson("0003").matchAll(/^\s+([a-z_]+)\s+(?:INT|TEXT|NUMERIC|DATE|TIMESTAMPTZ)\b/gm)].map(m => m[1]);
  [...html.matchAll(/<code>aset\(([^)]*)\)<\/code>/g)].forEach(m => m[1].split(/,\s*/).forEach(c =>
    assert.ok(columns.includes(c), `0006: index aset(${m[1]}) memakai kolom ${c} yang tidak ada di skema 0003`)));
});

test("fullstack 0006: one full STAR story with numbers in the Result", () => {
  const html = track.readLesson("0006");
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
  const html = track.readLesson("0007");
  assert.match(html, /class="flow"|<svg class="diagram"/, "0007: butuh alur troubleshooting");
  assert.match(html, /[Cc]ontoh jawaban/, "0007: butuh contoh jawaban");
});

// ---------------------------------------------------------------------------
// 0008–0009: coding (format tujuh langkah)
// ---------------------------------------------------------------------------

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
  "0008": [/[Pp]alindrome integer/, /[Rr]everse integer/, /[Aa]nagram/, /[Vv]alid parentheses/],
  "0009": [/[Tt]wo sum/, /[Tt]wo pointers/, /[Ss]liding window/, /[Bb]inary search/],
};

Object.entries(CODING).forEach(([num, expected]) => {
  test(`fullstack ${num}: every soal follows the 7-step format with pseudocode and JS shown`, () => {
    const html = track.readLesson(num);
    assertCitesNumbered(html, num);
    const soal = assertCodingFormat(html, num);
    assert.equal(soal.length, expected.length, `${num}: jumlah soal`);
    expected.forEach((re, i) => assert.match(soal[i].title, re, `${num}: soal ${i + 1} harus ${re}`));
  });
});

test("fullstack 0008: palindrome integer without strings, half reversal, and its edge cases", () => {
  const [pal, rev] = soalSections(track.readLesson("0008"));
  const impl = step(pal.body, "Implementasi JavaScript");
  assert.doesNotMatch(impl, /String\(|toString|\.split\(|`/, "palindrome: implementasi tanpa konversi ke string");
  assert.match(pal.body, /separuh/, "palindrome: teknik membalik separuh angka");
  const edge = step(pal.body, "Edge case");
  [/negatif/, /berakhiran 0/, /overflow/i].forEach(re => assert.match(edge, re, `palindrome edge case ${re}`));
  assert.match(rev.body, /overflow/i);
  assert.match(rev.body, /2<sup>31<\/sup>|2147483647/, "reverse integer: batas 32-bit");
});

test("fullstack 0009: each pattern names its data structure or invariant", () => {
  const [twoSum, pointers, window, search] = soalSections(track.readLesson("0009"));
  assert.match(step(twoSum.body, "Ide"), /hash map/i, "two sum: hash map");
  assert.match(pointers.body, /terurut/, "two pointers: array terurut");
  assert.match(pointers.body, /duplikat/, "two pointers: hapus duplikat sebagai variasi");
  assert.match(window.body, /substring terpanjang/i, "sliding window: substring terpanjang tanpa karakter berulang");
  assert.match(step(search.body, "Edge case"), /overflow/i, "binary search: overflow saat menghitung mid");
});

// ---------------------------------------------------------------------------
// 0010: simulasi interview
// ---------------------------------------------------------------------------

test("fullstack 0010: three interview rounds of JD-based questions with visible answers linked to lessons", () => {
  const html = track.readLesson("0010");
  const BABAK = [/Babak 1: Fundamental &amp; SQL/, /Babak 2: CRUD &amp; sole dev/, /Babak 3: Live coding/];
  const heads = [...html.matchAll(/<h2>([^<]*)<\/h2>/g)].map(m => m[1]).filter(h => h.startsWith("Babak"));
  assert.equal(heads.length, 3, "0010: tepat tiga babak");
  BABAK.forEach((re, i) => assert.match(heads[i], re, `0010: babak ${i + 1}`));
  heads.forEach(h => {
    const body = (html.split(`<h2>${h}</h2>`)[1] || "").split("<h2>")[0];
    const dts = [...body.matchAll(/<dt>([\s\S]*?)<\/dt>/g)].map(m => m[1]);
    const dds = [...body.matchAll(/<dd>([\s\S]*?)<\/dd>/g)].map(m => m[1]);
    assert.ok(dts.length >= 4, `${h}: butuh >= 4 pertanyaan`);
    assert.equal(dts.length, dds.length, `${h}: setiap pertanyaan punya jawaban`);
    dts.forEach(q => assert.match(q, /JD:/, `${h}: pertanyaan harus menyebut asal JD: ${q}`));
    dds.forEach((a, i) => assert.match(a, /href="000\d-[\w-]+\.html"/, `${h}: jawaban ${i + 1} belum menautkan lesson terkait`));
  });
  const live = (html.split(`<h2>${heads[2]}</h2>`)[1] || "").split("<h2>")[0];
  assert.match(live, /<pre><code>fungsi /, "Babak 3: jawaban berupa pseudocode");
  for (let n = 1; n <= 9; n++) {
    const num = String(n).padStart(4, "0");
    assert.match(html, new RegExp(`href="${num}-[\\w-]+\\.html"`), `0010 belum menautkan lesson ${num}`);
  }
  ["../reference/pertanyaan-sql.html", "../reference/soal-coding-tambahan.html", "../index.html"]
    .forEach(link => assert.ok(html.includes(`href="${link}"`), `0010 belum menautkan ${link}`));
});

// ---------------------------------------------------------------------------
// Reference
// ---------------------------------------------------------------------------

test("reference pertanyaan-sql: ±30 questions with visible answers on the inventaris aset schema", () => {
  const html = track.read("reference/pertanyaan-sql.html");
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

test("reference soal-coding-tambahan: ±8 extra soal in the same 7-step format", () => {
  const html = track.read("reference/soal-coding-tambahan.html");
  assert.match(html, /<div class="kicker">Reference · Fullstack · /);
  const soal = assertCodingFormat(html, "reference/soal-coding-tambahan");
  assert.ok(soal.length >= 7 && soal.length <= 10, `reference: ±8 soal, ada ${soal.length}`);
  const titles = soal.map(s => s.title).join(" | ");
  [/FizzBuzz/, /Armstrong/, /prima/, /[Mm]erge dua array terurut/, /tidak berulang/, /[Rr]otate array/, /Kadane/, /[Aa]nagram/]
    .forEach(re => assert.match(titles, re, `reference: belum ada soal ${re}`));
  ["href=\"../index.html\"", "href=\"../lessons/0008-coding-angka-dan-string.html\"", "href=\"../lessons/0009-coding-array-dan-pencarian.html\""]
    .forEach(link => assert.ok(html.includes(link), `reference: belum menautkan ${link}`));
  assertCitesNumbered(html, "reference/soal-coding-tambahan");
});
