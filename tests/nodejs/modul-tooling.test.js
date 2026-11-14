// Run from repo root: node --test
// Track Node.js, modul Paket & tooling (0013–0015): cakupan topik, sitasi, diagram/kode, label versi, nav.
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, sumber primer) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0013": { file: "0013-commonjs-vs-esm.html", topics: ["tooling-format-modul", "tooling-interop-esm"] },
  "0014": { file: "0014-package-json-dan-dependency.html", topics: ["tooling-semver-lockfile", "tooling-field-package"] },
  "0015": { file: "0015-typescript-dan-config.html", topics: ["tooling-typescript-node", "tooling-env-config"] },
};
const NUMS = Object.keys(LESSONS);
const NODE_DOCS = /href="https:\/\/nodejs\.org\/docs\/latest-v24\.x\/api\//;

test("modul Paket & tooling: topics, prefix, >=2 mc per topic, orals", () => {
  nj.assertModuleTopics(LESSONS, "tooling-");
});

test("modul Paket & tooling covers the spec keywords per lesson", () => {
  const keywords = {
    "0013": ["require(", "import ", '"type"', ".mjs", ".cjs", "require(esm)", "top-level await", "ERR_REQUIRE_ASYNC_MODULE",
      "module.exports", "import()"],
    "0014": ['"exports"', '"main"', "^", "~", "package-lock.json", "npm ci", "dependencies", "devDependencies",
      "peerDependencies", "ERR_PACKAGE_PATH_NOT_EXPORTED"],
    "0015": ["tsc", "type stripping", "nodenext", "--env-file", "process.env", "decorator", "enum", ".env"],
  };
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    keywords[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("modul Paket & tooling: one win, module kicker, cite numbering, Node v24 docs, diagram or code, quizzes, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul Paket &amp; tooling · ±20 menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    LESSONS[n].topics.forEach(t =>
      assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t} belum dirender`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
  ["0013", "0015"].forEach(n => assert.match(nj.readLesson(n), NODE_DOCS, `${n}: sitasi ke dokumentasi Node v24`));
  assert.match(nj.readLesson("0014"), /href="https:\/\/docs\.npmjs\.com\//, "0014: sitasi ke docs.npmjs.com");
});

test("version-dependent behaviour carries a version label", () => {
  assert.match(nj.readLesson("0013"), /require\(esm\)[\s\S]*Node ≥ 22\.12/, "0013: label versi require(esm)");
  const ts = nj.readLesson("0015");
  assert.match(ts, /Node ≥ 23\.6/, "0015: label versi type stripping aktif default");
  assert.match(ts, /Node 24\.12/, "0015: label versi type stripping stabil");
  assert.match(ts, /Node ≥ 20\.6/, "0015: label versi --env-file");
});

test("0014 shows caret vs tilde ranges with concrete bounds", () => {
  const pkg = nj.readLesson("0014");
  ["&lt;2.0.0", "&lt;1.3.0", "&lt;0.3.0"].forEach(b => assert.ok(pkg.includes(b), `0014 belum menunjukkan batas ${b}`));
});

test("modul Paket & tooling nav: 0012 → 0013 → 0014 → 0015 → 0016", () => {
  const files = ["0012-review-runtime-async.html", ...NUMS.map(n => LESSONS[n].file), "0016-nestjs-dan-module.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});
