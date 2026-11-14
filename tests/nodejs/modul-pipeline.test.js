// Run from repo root: node --test
// Track Node.js, modul Pipeline request (0021–0024): cakupan topik, sitasi, blok kode, latihan urutan pipeline,
// dan soal oral "tulis kode" (DTO di 0022, guard di 0023).
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0021": { file: "0021-urutan-pipeline-request.html", topics: ["pipeline-urutan", "pipeline-binding"] },
  "0022": { file: "0022-pipe-dan-validation.html", topics: ["pipeline-pipe", "pipeline-validation"] },
  "0023": { file: "0023-guard-dan-middleware.html", topics: ["pipeline-guard", "pipeline-middleware"] },
  "0024": { file: "0024-interceptor-dan-exception-filter.html", topics: ["pipeline-interceptor", "pipeline-filter"] },
};
const NUMS = Object.keys(LESSONS);
const writeCode = q => /<pre|<code/.test(q.sample || "");

test("modul Pipeline request: topics, prefix, >=2 mc per topic, orals", () => {
  nj.assertModuleTopics(LESSONS, "pipeline-");
});

test("modul Pipeline request covers the spec keywords", () => {
  const per = {
    "0021": ["middleware", "guard", "interceptor", "pipe", "exception filter", "global", "controller", "method", "APP_GUARD", "useGlobalPipes"],
    "0022": ["ParseIntPipe", "ValidationPipe", "whitelist", "forbidNonWhitelisted", "transform", "class-validator", "class-transformer", "DTO"],
    "0023": ["CanActivate", "ExecutionContext", "Reflector", "createDecorator", "ForbiddenException", "NestMiddleware", "otorisasi"],
    "0024": ["NestInterceptor", "CallHandler", "RxJS", "timeout", "HttpException", "NotFoundException", "@Catch", "ArgumentsHost"],
  };
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("modul Pipeline request: new topic slugs are recorded in the glossary", () => {
  const glossary = fs.readFileSync(path.join(ROOT, "nodejs", "GLOSSARY.md"), "utf8");
  const section = (glossary.match(/## Pipeline request\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(section.includes(t), `slug ${t} belum di GLOSSARY ## Pipeline request`));
});

test("each lesson: one win, module kicker, cite numbering, code block, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul Pipeline request · ±20 menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<pre><code>/, `${n}: lesson NestJS wajib punya blok kode`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`)));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
  });
});

test("0021: order.js exercise lists the request pipeline in the documented order", () => {
  const html = nj.readLesson("0021");
  assert.match(html, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  const block = (html.match(/<div class="order">\s*<ol>([\s\S]*?)<\/ol>/) || [])[1] || "";
  const items = [...block.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].replace(/<[^>]+>/g, "").toLowerCase());
  const expected = ["middleware", "guard", "interceptor", "pipe", "handler", "interceptor", "exception filter"];
  assert.equal(items.length, expected.length, `butuh ${expected.length} langkah, ada ${items.length}`);
  expected.forEach((k, i) => assert.ok(items[i].includes(k), `langkah ${i + 1} harus ${k}, tertulis "${items[i]}"`));
  assert.ok(items[2].includes("sebelum") && items[5].includes("sesudah"), "interceptor sebelum dan sesudah handler");
});

test("write-code orals: DTO + validation in 0022 and a guard in 0023", () => {
  const dto = nj.lessonQuestions("0022").oral.filter(writeCode);
  assert.ok(dto.length >= 1, "0022 butuh soal oral tulis kode");
  assert.ok(dto.some(q => /class-validator|@Is[A-Z]/.test(q.sample) && /ValidationPipe/.test(q.sample)), "0022: sample memuat DTO + ValidationPipe");
  const guard = nj.lessonQuestions("0023").oral.filter(writeCode);
  assert.ok(guard.length >= 1, "0023 butuh soal oral tulis kode");
  assert.ok(guard.some(q => /CanActivate/.test(q.sample) && /canActivate\(/.test(q.sample)), "0023: sample memuat guard");
});

test("0022: StandardSchemaValidationPipe is mentioned with a NestJS 12 version label", () => {
  const html = nj.readLesson("0022");
  assert.match(html, /StandardSchemaValidationPipe[^.]*NestJS ≥ 12|NestJS ≥ 12[^.]*StandardSchemaValidationPipe/, "0022: beri label versi untuk Standard Schema");
});

test("modul Pipeline request: index marks 0021–0024 tersedia with the right files", () => {
  const index = fs.readFileSync(path.join(ROOT, "nodejs", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});

test("modul Pipeline request nav: 0020 → 0021 → 0022 → 0023 → 0024 → 0025", () => {
  const files = ["0020-review-io-tooling.html", ...NUMS.map(n => LESSONS[n].file), "0025-prisma-dan-prismaservice.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});
