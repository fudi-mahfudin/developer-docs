// Run from repo root: node --test
// Track Node.js, modul Testing & produksi (0030–0034): cakupan topik, sitasi, blok kode, label versi NestJS 12,
// Jest sebagai contoh utama (Vitest disebut), soal oral "tulis kode" unit test service dengan PrismaService di-mock (0030),
// dan slug topik di GLOSSARY. Aturan umum (bank ≥ 4 mc + ≥ 1 oral, kicker, nav, sumber primer) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0030": { file: "0030-unit-test-nestjs.html", topics: ["prod-unit-test", "prod-mock"] },
  "0031": { file: "0031-e2e-test.html", topics: ["prod-e2e", "prod-jenis-test"] },
  "0032": { file: "0032-config-dan-logging.html", topics: ["prod-config", "prod-logging"] },
  "0033": { file: "0033-shutdown-health-throttle-cache.html", topics: ["prod-shutdown-health", "prod-throttle-cache"] },
  "0034": { file: "0034-background-job-bullmq.html", topics: ["prod-bullmq", "prod-retry-idempotency"] },
};
const NUMS = Object.keys(LESSONS);
const text = html => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ");
const read = f => fs.readFileSync(path.join(ROOT, "nodejs", f), "utf8");

test("modul Testing & produksi: topics, prefix prod-, >=2 mc per topic, orals", () => {
  nj.assertModuleTopics(LESSONS, "prod-");
});

test("modul Testing & produksi covers the spec keywords", () => {
  const keywords = {
    "0030": ["Jest", "Vitest", "Test.createTestingModule", "overrideProvider", "useValue", "jest.fn", "mockResolvedValue", "PrismaService", "toHaveBeenCalledWith"],
    "0031": ["supertest", "app.init()", "app.close()", "getHttpServer", "createNestApplication", "database", "unit", "integration", "e2e"],
    "0032": ["@nestjs/config", "ConfigModule.forRoot", "validationSchema", "ConfigService", "Logger", "structured logging", "pino", "correlation id", "AsyncLocalStorage"],
    "0033": ["SIGTERM", "enableShutdownHooks", "onApplicationShutdown", "@nestjs/terminus", "HealthCheckService", "@nestjs/throttler", "ThrottlerGuard", "429", "CacheModule", "CACHE_MANAGER"],
    "0034": ["@nestjs/bullmq", "BullModule", "@InjectQueue", "@Processor", "WorkerHost", "attempts", "backoff", "exponential", "idempoten", "jobId", "Redis"],
  };
  NUMS.forEach(n => {
    const t = text(nj.readLesson(n)).toLowerCase();
    keywords[n].forEach(k => assert.ok(t.includes(k.toLowerCase()), `${n} belum membahas ${k}`));
  });
});

test("each lesson: one win, module kicker, numbered cites, code block, quiz per topic, static oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul Testing &amp; produksi · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<pre><code>/, `${n}: lesson NestJS wajib punya blok kode`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
  });
});

test("version-dependent behaviour carries a NestJS 12 label where it is taught", () => {
  ["0030", "0032", "0033"].forEach(n => assert.match(text(nj.readLesson(n)), /NestJS 12/, `${n}: butuh label versi NestJS 12`));
});

test("0030 names Jest as the main example and mentions Vitest exactly once as an alternative", () => {
  const t = text(nj.readLesson("0030"));
  assert.equal((t.match(/Vitest/g) || []).length, 1, "Vitest disebut sekali");
});

test("0030 has an oral 'tulis kode' question: unit test a service with PrismaService mocked", () => {
  const { oral } = nj.lessonQuestions("0030");
  const code = oral.filter(q => /<pre>|<code>/.test(q.sample));
  assert.ok(code.length >= 1, "butuh soal oral tulis kode");
  const q = code.find(q => /PrismaService/.test(q.prompt));
  assert.ok(q, "prompt tulis kode harus menyebut PrismaService");
  ["Test.createTestingModule", "PrismaService", "useValue", "jest.fn", "mockResolvedValue", "expect("].forEach(k =>
    assert.ok(q.sample.includes(k), `contoh jawaban belum memuat ${k}`));
});

test("index lists 0030–0034 as available with their spec file names", () => {
  const index = read("index.html");
  NUMS.forEach(n => assert.match(index, new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`), `index: ${n} belum tersedia`));
});

test("GLOSSARY Testing & produksi records the module's topic slugs; RESOURCES lists the module's sources", () => {
  const section = read("GLOSSARY.md").split("## Testing & produksi")[1] || "";
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(section.includes(`\`${t}\``), `slug ${t} belum di GLOSSARY Testing & produksi`));
  const res = (read("RESOURCES.md").split("### Testing & produksi")[1] || "").split(/\n## /)[0];
  [/fundamentals\/testing/, /techniques\/configuration/, /recipes\/terminus/, /security\/rate-limiting/, /techniques\/queues/].forEach(re =>
    assert.match(res, re, `RESOURCES Testing & produksi belum mencatat ${re}`));
});
