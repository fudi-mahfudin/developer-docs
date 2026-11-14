// Run from repo root: node --test
// Track Node.js, modul Runtime (0001–0004): cakupan topik, sitasi, diagram/kode, latihan tebak urutan output.
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const nj = forTrack("nodejs");
const LESSONS = {
  "0001": { file: "0001-anatomi-node.html", topics: ["runtime-anatomi", "runtime-io-vs-cpu"] },
  "0002": { file: "0002-fase-event-loop.html", topics: ["runtime-fase-loop", "runtime-timeout-vs-immediate"] },
  "0003": { file: "0003-microtask-dan-nexttick.html", topics: ["runtime-nexttick-microtask", "runtime-starvation"] },
  "0004": { file: "0004-thread-pool-dan-blocking.html", topics: ["runtime-thread-pool", "runtime-blocking"] },
};
const NUMS = Object.keys(LESSONS);

test("modul Runtime: topics, prefix, >=2 mc per topic, orals", () => {
  nj.assertModuleTopics(LESSONS, "runtime-");
});

test("modul Runtime covers the spec keywords", () => {
  const per = {
    "0001": ["V8", "libuv", "binding", "single-threaded", "I/O-bound", "CPU-bound"],
    "0002": ["timers", "pending callbacks", "poll", "check", "close callbacks", "setTimeout", "setImmediate", "tidak deterministik"],
    "0003": ["process.nextTick", "Promise.then", "queueMicrotask", "microtask", "starvation", "ESM", "CommonJS"],
    "0004": ["thread pool", "UV_THREADPOOL_SIZE", "dns.lookup", "crypto", "zlib", "JSON.parse", "regex", "monitorEventLoopDelay"],
  };
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    per[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("modul Runtime: new topic slugs are recorded in the glossary", () => {
  const glossary = fs.readFileSync(path.join(ROOT, "nodejs", "GLOSSARY.md"), "utf8");
  const section = (glossary.match(/## Runtime\n([\s\S]*?)\n## /) || [])[1] || "";
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(section.includes(t), `slug ${t} belum di GLOSSARY ## Runtime`));
});

test("modul Runtime: each lesson has one win, module kicker, cite numbering, diagram or code, quiz per topic, oral blocks", () => {
  NUMS.forEach(n => {
    const html = nj.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: harus tepat satu target`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · Node\\.js · Modul Runtime · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">|<pre><code>/, `${n}: butuh diagram atau blok kode`);
    LESSONS[n].topics.forEach(t =>
      assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t} belum dirender`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, nj.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, `${n}: tanpa lab`);
  });
});

test("modul Runtime: version-dependent behaviour is labelled with the Node version", () => {
  // 0003: urutan nextTick vs microtask berbeda di CommonJS dan ESM; 0004: monitorEventLoopDelay.
  ["0003", "0004"].forEach(n => assert.match(nj.readLesson(n), /Node 24/, `${n}: beri label versi`));
});

// Latihan tebak urutan output: <pre><code>kode</code></pre> langsung diikuti <div class="order"><ol>baris output</ol>.
const decode = s => s.replace(/<[^>]+>/g, "")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const outputExercises = html => [...html.matchAll(/<pre><code>((?:(?!<pre>)[\s\S])*?)<\/code><\/pre>\s*<div class="order">\s*<ol>([\s\S]*?)<\/ol>/g)]
  .map(m => ({ code: decode(m[1]), lines: [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(l => decode(l[1]).trim()) }));

test("0003 has >= 2 output-order exercises with order.js", () => {
  const html = nj.readLesson("0003");
  assert.match(html, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  assert.ok(outputExercises(html).length >= 2, "0003 butuh >= 2 latihan tebak urutan output");
});

test("0003 output-order answers match what Node actually prints (CommonJS)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nodejs-0003-"));
  try {
    outputExercises(nj.readLesson("0003")).forEach(({ code, lines }, i) => {
      const file = path.join(dir, `ex${i + 1}.cjs`);
      fs.writeFileSync(file, code);
      const run = spawnSync(process.execPath, [file], { cwd: dir, encoding: "utf8", timeout: 10000 });
      assert.equal(run.status, 0, run.stderr);
      assert.deepEqual(lines, run.stdout.trim().split("\n"), `latihan ${i + 1}: kunci urutan beda dengan output Node`);
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("modul Runtime: index marks 0001–0004 tersedia with the right files", () => {
  const index = fs.readFileSync(path.join(ROOT, "nodejs", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index,
    new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
});

test("modul Runtime nav: index → 0001 → 0002 → 0003 → 0004 → 0005", () => {
  const files = ["../index.html", ...NUMS.map(n => LESSONS[n].file), "0005-kombinator-promise.html"];
  NUMS.forEach((n, i) => {
    const nav = (nj.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});
