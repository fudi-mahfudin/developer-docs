// Run from repo root: node --test
// Track Node.js, Penutup: mock interview 0036 (opsional, ±45 menit, pengecualian durasi, timer 3 segmen, tiga babak:
// konsep Node, konsep NestJS, live coding di kertas; jawaban contoh dan checklist penilaian per babak) dan dua cheat sheet
// di nodejs/reference/ yang merangkum lesson yang sudah ada, ditautkan dari index dan ROADMAP.
// Aturan umum (bank ≥ 4 mc + ≥ 1 oral, kata opsi, kicker, nav ke tetangga, sumber primer) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const read = nj.read;
const MOCK = "lessons/0036-mock-interview.html";
const TOPICS = ["mock-konsep-node", "mock-konsep-nestjs", "mock-live-coding"];
const REFS = ["urutan-event-loop.html", "pipeline-request-nestjs.html"];

test("0036 bank: mock- topics, >=2 mc per topic, one oral per babak, live coding oral is a 'tulis kode' question", () => {
  nj.assertModuleTopics({ "0036": { topics: TOPICS } }, "mock-");
  const { oral } = nj.lessonQuestions("0036");
  TOPICS.forEach(t => assert.ok(oral.some(q => q.topic === t), `butuh soal lisan untuk ${t}`));
  const code = oral.find(q => q.topic === "mock-live-coding");
  assert.match(code.sample, /<pre><code>/, "live coding: jawaban contoh berupa kode");
  ["class-validator", "@IsString", "ValidationPipe", "RolesGuard", "Reflector", "PrismaService", "Test.createTestingModule", "jest.fn", "expect("].forEach(k =>
    assert.ok(code.sample.includes(k), `live coding: contoh jawaban belum memuat ${k}`));
});

// Soal tebak urutan output: <pre><code>kode</code></pre> lalu <details> yang memuat <ol> kunci urutan.
const decode = s => s.replace(/<[^>]+>/g, "")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const outputQuestions = html => [...html.matchAll(/<pre><code>((?:(?!<pre>)[\s\S])*?)<\/code><\/pre>\s*<details>\s*<summary>[^<]*<\/summary>\s*<ol>([\s\S]*?)<\/ol>/g)]
  .map(m => ({ code: decode(m[1]), lines: [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(l => decode(l[1]).trim()) }));
const assertOutputsMatchNode = (html, label) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nodejs-penutup-"));
  try {
    outputQuestions(html).forEach(({ code, lines }, i) => {
      const file = path.join(dir, `q${i + 1}.cjs`);
      fs.writeFileSync(file, code);
      const run = spawnSync(process.execPath, [file], { cwd: dir, encoding: "utf8", timeout: 10000 });
      assert.equal(run.status, 0, run.stderr);
      assert.deepEqual(lines, run.stdout.trim().split("\n"), `${label} soal ${i + 1}: kunci urutan beda dengan output Node`);
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};
const BABAK = ["Konsep Node", "Konsep NestJS", "Live coding"];
const babakParts = html => {
  const starts = BABAK.map((b, i) => {
    const m = html.match(new RegExp(`<h2>Babak ${i + 1} · ${b}[^<]*</h2>`));
    assert.ok(m, `butuh h2 Babak ${i + 1} · ${b}`);
    return m.index;
  });
  assert.deepEqual(starts, [...starts].sort((a, b) => a - b), "babak berurutan");
  const end = html.indexOf("<h2>Setelah mock");
  assert.ok(end > starts[2], "butuh h2 Setelah mock setelah babak 3");
  return starts.map((s, i) => html.slice(s, starts[i + 1] || end));
};

test("0036 is an optional 45-minute mock with a 3-segment timer, one win, cites, no lab", () => {
  const html = read(MOCK);
  assert.match(html, /<div class="kicker">Lesson 0036 · Node\.js · Penutup · ±45 menit · opsional, pengecualian durasi<\/div>/);
  assert.ok(html.includes('<div class="timer" data-segments="Konsep Node:15,Konsep NestJS:15,Live coding:15"></div>'), "timer 3 segmen");
  assert.ok(html.includes('<script src="../../assets/timer.js"></script>'), "memuat timer.js");
  assert.equal((html.match(/<div class="win">/g) || []).length, 1);
  assertCitesNumbered(html, "0036");
  assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
});

test("0036 has three babak, each with a sample answer in <details> and a self-scoring checklist", () => {
  const parts = babakParts(read(MOCK));
  parts.forEach((part, i) => {
    assert.match(part, new RegExp(`<details>\\s*<summary>Lihat jawaban contoh babak ${i + 1}</summary>`), `babak ${i + 1}: jawaban contoh`);
    assert.match(part, /<strong>Checklist:<\/strong>/, `babak ${i + 1}: checklist`);
    assert.equal((part.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length, 1, `babak ${i + 1}: satu blok lisan`);
  });
  const t = parts.map(p => decode(p).toLowerCase());
  ["event loop", "backpressure", "drain", "nexttick"].forEach(k => assert.ok(t[0].includes(k), `babak 1 belum membahas ${k}`));
  ["scope", "dependency injection", "middleware", "guard", "pipe", "interceptor", "executioncontext"].forEach(k => assert.ok(t[1].includes(k), `babak 2 belum membahas ${k}`));
  ["dto", "validationpipe", "rolesguard", "prismaservice", "test.createtestingmodule", "jest.fn"].forEach(k => assert.ok(t[2].includes(k), `babak 3 belum membahas ${k}`));
  assert.match(parts[2], /<pre><code>/, "babak 3: jawaban contoh berupa kode");
  assert.equal(nj.lessonQuestions("0036").oral.length, 3, "blok lisan statis = soal lisan bank");
});

test("0036 babak 1 has an output-order question whose key matches what Node 24 prints", () => {
  const [babak1] = babakParts(read(MOCK));
  assert.equal(outputQuestions(babak1).length, 1, "babak 1: satu soal tebak urutan output");
  assertOutputsMatchNode(babak1, "0036");
});

test("0036 quizzes every mock topic and links both cheat sheets; nav: 0035 back, index last", () => {
  const html = read(MOCK);
  TOPICS.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="0036" data-bank-topic="[^"]*${t}`), `kuis ${t}`));
  REFS.forEach(f => assert.ok(html.includes(`href="../reference/${f}"`), `0036 belum menautkan ${f}`));
  const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
  assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), ["0035-review-data-testing.html", "../index.html"]);
});

const REF_SPEC = {
  "urutan-event-loop.html": {
    backlinks: ["0002-fase-event-loop.html", "0003-microtask-dan-nexttick.html"],
    facts: ["timers", "pending callbacks", "poll", "check", "close callbacks", "process.nextTick", "microtask", "queueMicrotask", "setImmediate", "ESM", "tidak deterministik"],
  },
  "pipeline-request-nestjs.html": {
    backlinks: ["0021-urutan-pipeline-request.html", "0022-pipe-dan-validation.html", "0023-guard-dan-middleware.html", "0024-interceptor-dan-exception-filter.html"],
    facts: ["Kebutuhan", "Pakai", "APP_GUARD", "useGlobalGuards", "ExecutionContext", "ForbiddenException", "403", "ValidationPipe", "whitelist", "first-in, last-out", "correlation id"],
  },
};

Object.entries(REF_SPEC).forEach(([file, { backlinks, facts }]) => {
  test(`reference ${file}: shared style, links back to its lessons, summarises their facts, cites`, () => {
    const html = read(`reference/${file}`);
    assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
    assert.match(html, /<body class="reference">/);
    assert.match(html, /<div class="kicker">Reference · Node\.js · /);
    backlinks.forEach(l => assert.ok(html.includes(`href="../lessons/${l}"`), `${file}: belum menautkan ${l}`));
    facts.forEach(k => assert.ok(html.includes(k), `${file}: belum memuat ${k}`));
    [...html.matchAll(/href="\.\.\/lessons\/([\w-]+\.html)"/g)].map(m => m[1]).forEach(l =>
      assert.ok(fs.existsSync(path.join(ROOT, "nodejs", "lessons", l)), `${l} tidak ada`));
    assert.doesNotMatch(html, /href="[^"]*\.\.\/(dotnet|fhir|sysdesign)\//, "track mandiri");
    assertCitesNumbered(html, file);
  });
});

test("event loop reference: phases in order, then 3–5 output-order questions whose hidden keys match Node 24", () => {
  const html = read("reference/urutan-event-loop.html");
  const phases = ["timers", "pending callbacks", "idle, prepare", "poll", "check", "close callbacks"]
    .map(p => { const i = html.indexOf(`<span class="box">${p}</span>`); assert.ok(i >= 0, `fase ${p}`); return i; });
  assert.deepEqual(phases, [...phases].sort((a, b) => a - b), "urutan fase");
  const qs = outputQuestions(html);
  assert.ok(qs.length >= 3 && qs.length <= 5, `butuh 3–5 soal tebak urutan, ada ${qs.length}`);
  assertOutputsMatchNode(html, "urutan-event-loop");
});

test("pipeline reference: execution order flow and a 'kebutuhan → pakai yang mana' table", () => {
  const html = read("reference/pipeline-request-nestjs.html");
  const flow = ["Middleware", "Guard", "Interceptor (sebelum)", "Pipe", "Handler", "Interceptor (sesudah)", "Exception filter"]
    .map(b => { const i = html.indexOf(`<span class="box">${b}</span>`); assert.ok(i >= 0, `kotak ${b}`); return i; });
  assert.deepEqual(flow, [...flow].sort((a, b) => a - b), "urutan pipeline");
  const rows = [...html.matchAll(/<tr><td>([^<]+)<\/td><td>([^<]+)<\/td>/g)].map(m => [m[1].toLowerCase(), m[2]]);
  [["otorisasi", "Guard"], ["autentikasi", "Guard"], ["validasi", "Pipe"], ["bentuk response", "Interceptor"], ["format error", "Exception filter"], ["correlation id", "Middleware"]]
    .forEach(([need, pick]) => assert.ok(rows.some(([n, p]) => n.includes(need) && p === pick), `baris ${need} → ${pick}`));
});

test("index and ROADMAP link 0036 and both references; glossary records the mock slugs", () => {
  const index = read("index.html");
  nj.assertListedAsTersedia({ "0036": { file: "0036-mock-interview.html" } });
  const roadmap = read("ROADMAP.md");
  REFS.forEach(f => {
    assert.ok(index.includes(`href="reference/${f}"`), `index belum menautkan ${f}`);
    assert.ok(roadmap.includes(`(reference/${f})`), `ROADMAP belum menautkan ${f}`);
  });
  const section = nj.section("GLOSSARY.md", "## Penutup");
  TOPICS.forEach(t => assert.ok(section.includes(t), `slug ${t} belum di GLOSSARY Penutup`));
});
