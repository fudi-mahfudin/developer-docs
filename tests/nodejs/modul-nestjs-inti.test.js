// Run from repo root: node --test
// Track Node.js, modul NestJS inti (0016–0019): cakupan topik, sitasi, blok kode wajib, soal oral "tulis kode".
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0016": { file: "0016-nestjs-dan-module.html", topics: ["nest-kenapa", "nest-module"] },
  "0017": { file: "0017-provider-dan-dependency-injection.html", topics: ["nest-di", "nest-custom-provider"] },
  "0018": { file: "0018-scope-dan-dynamic-module.html", topics: ["nest-scope", "nest-dynamic-module"] },
  "0019": { file: "0019-controller-dan-lifecycle.html", topics: ["nest-controller", "nest-lifecycle"] },
};
const NUMS = Object.keys(LESSONS);

test("modul NestJS inti: topics, prefix, >=2 mc per topic, orals", () => {
  nj.assertModuleTopics(LESSONS, "nest-");
});

test("modul NestJS inti covers the spec keywords per lesson", () => {
  const KEYWORDS = {
    "0016": ["@Module", "imports", "providers", "controllers", "exports", "feature module", "@Global", "Express", "Fastify"],
    "0017": ["provider", "injection token", "@Inject", "useClass", "useValue", "useFactory", "useExisting", "circular dependency", "forwardRef"],
    "0018": ["DEFAULT", "REQUEST", "TRANSIENT", "bubbling", "forRoot", "forFeature", "register", "forRootAsync"],
    "0019": ["@Controller", "@Get", "@Post", "@Param", "@Query", "@Body", "@HttpCode", "201", "onModuleInit", "onApplicationBootstrap", "onModuleDestroy", "beforeApplicationShutdown", "onApplicationShutdown", "enableShutdownHooks"],
  };
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    KEYWORDS[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("each lesson: one win, module kicker, cite numbering, code block, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: tepat satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul NestJS inti · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<pre><code>/, `${n}: lesson NestJS wajib punya blok kode`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
});

test("each version-dependent NestJS 12 claim carries a version label", () => {
  // Urutan lifecycle hook berubah di Nest 12 (migration guide); lesson 0019 wajib memberi label versi.
  assert.match(nj.readLesson("0019"), /NestJS 12/, "0019: label versi untuk urutan lifecycle hook");
});

test("modul NestJS inti has at least one 'tulis kode' oral (sample contains code)", () => {
  const codeOrals = NUMS.flatMap(n => nj.lessonQuestions(n).oral).filter(q => /<pre>|<code>/.test(q.sample));
  assert.ok(codeOrals.length >= 1, "butuh >= 1 soal oral tulis kode");
  codeOrals.forEach(q => assert.match(q.prompt, /[Tt]ulis/, `${q.id}: prompt harus meminta menulis kode`));
});

test("modul NestJS inti nav: 0015 → 0016 → 0017 → 0018 → 0019 → 0020", () => {
  const files = ["0015-typescript-dan-config.html", ...NUMS.map(n => LESSONS[n].file), "0020-review-io-tooling.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});

test("modul NestJS inti lessons are listed as tersedia in the index", () => {
  const index = fs.readFileSync(path.join(ROOT, "nodejs", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index, new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});

test("modul NestJS inti topic slugs are recorded in GLOSSARY.md", () => {
  const glossary = fs.readFileSync(path.join(ROOT, "nodejs", "GLOSSARY.md"), "utf8");
  Object.values(LESSONS).flatMap(l => l.topics).forEach(t => assert.ok(glossary.includes(t), `GLOSSARY belum mencatat ${t}`));
});
