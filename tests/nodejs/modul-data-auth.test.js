// Run from repo root: node --test
// Track Node.js, modul Data & auth (0025–0028): cakupan topik, sitasi primer, blok kode, soal "tulis kode",
// Prisma sebagai contoh utama (TypeORM hanya di 0026), dan sumber wajib (OWASP, RFC 7519, RFC 9110).
// Aturan umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0025": { file: "0025-prisma-dan-prismaservice.html", topics: ["data-prisma-service", "data-query-n1"],
    keywords: ["schema.prisma", "Prisma Client", "PrismaService", "PrismaClient", "onModuleInit", "$connect", "select", "include", "N+1"],
    cites: [/docs\.nestjs\.com\/(recipes|data)\/prisma/, /prisma\.io\/docs\//] },
  "0026": { file: "0026-transaksi-migrasi-typeorm.html", topics: ["data-transaksi", "data-migrasi", "data-typeorm"],
    keywords: ["$transaction", "interactive", "prisma migrate dev", "prisma migrate deploy", "TypeORM", "@Entity", "Repository", "@InjectRepository"],
    cites: [/prisma\.io\/docs\/.*transactions/, /prisma\.io\/docs\/.*prisma-migrate/, /docs\.nestjs\.com\/(techniques\/database|data\/typeorm)/] },
  "0027": { file: "0027-autentikasi-jwt-passport.html", topics: ["data-hash-password", "data-jwt-passport"],
    keywords: ["bcrypt", "argon2", "JWT", "access token", "refresh token", "@nestjs/jwt", "Passport", "local", "AuthGuard"],
    cites: [/cheatsheetseries\.owasp\.org\/cheatsheets\/Password_Storage_Cheat_Sheet\.html/, /rfc-editor\.org\/rfc\/rfc7519/] },
  "0028": { file: "0028-otorisasi-role.html", topics: ["data-rbac", "data-401-403"],
    keywords: ["RBAC", "@Roles", "RolesGuard", "Reflector", "APP_GUARD", "@Public", "kepemilikan", "401", "403"],
    cites: [/rfc-editor\.org\/rfc\/rfc9110/, /docs\.nestjs\.com\//] },
};
const NUMS = Object.keys(LESSONS);
const MODULE = "Data &amp; auth";

test("modul Data & auth: own topics with data- prefix, >= 2 mc per topic, >= 1 oral per lesson", () => {
  nj.assertModuleTopics(LESSONS, "data-");
});

test("modul Data & auth topic slugs are recorded in the glossary", () => {
  const glossary = fs.readFileSync(path.join(ROOT, "nodejs", "GLOSSARY.md"), "utf8");
  const section = (glossary.match(/## Data & auth\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(section.includes(`\`${t}\``), `GLOSSARY ## Data & auth belum mencatat ${t}`));
});

test("modul Data & auth sources are listed in RESOURCES under Data & auth", () => {
  const resources = fs.readFileSync(path.join(ROOT, "nodejs", "RESOURCES.md"), "utf8");
  const section = (resources.match(/### Data & auth\n([\s\S]*?)(\n### |\n## |$)/) || [])[1] || "";
  assert.match(section, /\]\(https:\/\//, "RESOURCES ### Data & auth masih kosong");
});

test("each modul Data & auth lesson covers the spec keywords", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    LESSONS[n].keywords.forEach(k => assert.ok(html.includes(k), `${n}: belum membahas ${k}`));
  });
});

test("each modul Data & auth lesson cites its required primary sources", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    const cited = [...html.matchAll(/<sup class="cite"><a href="([^"]+)"/g)].map(m => m[1]);
    LESSONS[n].cites.forEach(re => assert.ok(cited.some(u => re.test(u)), `${n}: belum ada .cite ke ${re}`));
  });
});

test("each modul Data & auth lesson: one win, module kicker, cite numbering, code block, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul ${MODULE} · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<pre><code>/, `${n}: lesson NestJS wajib punya blok <pre><code>`);
    LESSONS[n].topics.forEach(t =>
      assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: belum ada kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
});

test("Prisma is the main ORM: Prisma version labelled, TypeORM only in 0026", () => {
  ["0025", "0026"].forEach(n => assert.match(nj.readLesson(n), /Prisma ORM 7/, `${n}: beri label versi Prisma ORM`));
  ["0025", "0027", "0028"].forEach(n =>
    assert.doesNotMatch(nj.readLesson(n), /TypeORM|@InjectRepository/, `${n}: TypeORM hanya di 0026`));
});

test("modul Data & auth has a 'tulis kode' oral question for RolesGuard + @Roles (0028)", () => {
  const { oral } = nj.lessonQuestions("0028");
  const code = oral.filter(q => /<pre|<code/.test(q.sample));
  assert.ok(code.some(q => /RolesGuard/.test(q.prompt + q.sample) && /@Roles/.test(q.sample) && /Reflector/.test(q.sample)),
    "0028: butuh soal oral tulis kode RolesGuard + @Roles");
});

test("modul Data & auth nav: 0024 → 0025 → 0026 → 0027 → 0028 → 0029", () => {
  const files = ["0024-interceptor-dan-exception-filter.html", ...NUMS.map(n => LESSONS[n].file), "0029-review-nestjs-pipeline.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});

test("modul Data & auth lessons are listed as tersedia in the nodejs index", () => {
  const index = fs.readFileSync(path.join(ROOT, "nodejs", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`), `${n}: belum tersedia di index`));
});
