// Run from repo root: node --test
// Track System Design, modul Reliabilitas & API (0020–0025): cakupan topik, sitasi, diagram, "Kapan tidak perlu",
// monolith sebagai default (0024), dan tangga skala dengan latihan susun urutan (0025).
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const sd = forTrack("sysdesign");
const LESSONS = {
  "0020": { file: "0020-gaya-api.html", topics: ["rel-gaya-api", "rel-pagination"], component: true },
  "0021": { file: "0021-algoritma-rate-limiting.html", topics: ["rel-ratelimit-algoritma", "rel-ratelimit-http"], component: true },
  "0022": { file: "0022-timeout-retry-circuit-breaker.html", topics: ["rel-timeout-retry", "rel-circuit-breaker"], component: true },
  "0023": { file: "0023-observability-slo.html", topics: ["rel-observability", "rel-slo"], component: true },
  "0024": { file: "0024-monolith-vs-microservices.html", topics: ["rel-monolith-microservices", "rel-distributed-transaction"], component: true },
  "0025": { file: "0025-tangga-skala.html", topics: ["rel-tangga-skala", "rel-over-engineering"], component: false },
};
const NUMS = Object.keys(LESSONS);
const read = n => fs.readFileSync(path.join(ROOT, "sysdesign", "lessons", LESSONS[n].file), "utf8");
const text = html => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

test("modul Reliabilitas & API: topics, prefix, >=2 mc per topic, orals", () => {
  NUMS.forEach(n => sd.lessonQuestions(n).qs.forEach(q => {
    assert.match(q.topic, /^rel-/);
    assert.ok(LESSONS[n].topics.includes(q.topic), `${q.id}: topik ${q.topic} bukan milik ${n}`);
  }));
  const mc = NUMS.flatMap(n => sd.lessonQuestions(n).mc);
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(mc.filter(q => q.topic === t).length >= 2, t));
});

test("modul Reliabilitas & API covers the spec keywords", () => {
  const keywords = {
    "0020": ["REST", "gRPC", "WebSocket", "long polling", "SSE", "pagination", "cursor", "offset"],
    "0021": ["token bucket", "leaky bucket", "fixed window", "sliding window", "429", "Retry-After"],
    "0022": ["timeout", "exponential backoff", "jitter", "circuit breaker", "bulkhead", "idempoten"],
    "0023": ["metrics", "logs", "traces", "SLI", "SLO", "SLA", "error budget"],
    "0024": ["monolith", "modular monolith", "microservices", "distributed transaction", "service discovery", "saga"],
    "0025": ["ukur", "query", "index", "cache", "scale vertical", "read replica", "queue", "sharding", "pecah service", "over-engineering", "1.000 user"],
  };
  NUMS.forEach(n => {
    const t = text(read(n)).toLowerCase();
    keywords[n].forEach(k => assert.ok(t.includes(k.toLowerCase()), `${n} belum membahas ${k}`));
  });
});

test("each lesson: one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, Kapan tidak perlu", () => {
  NUMS.forEach(n => {
    const html = read(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Reliabilitas &amp; API · ±\\d+ menit</div>`));
    const cites = [...html.matchAll(/<sup class="cite"><a [^>]*>\[(\d+)\]<\/a><\/sup>/g)].map(m => Number(m[1]));
    const listed = [...html.matchAll(/<a href="[^"]+">\[(\d+)\] /g)].map(m => Number(m[1]));
    assert.ok(cites.length >= 1, `${n}: butuh >= 1 .cite`);
    assert.deepEqual(listed, listed.map((_, i) => i + 1), `${n}: daftar sumber berurutan`);
    assert.deepEqual([...new Set(cites)].sort((a, b) => a - b), listed, `${n}: sumber = yang dikutip`);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    if (LESSONS[n].component) assert.match(html, /<h2>[^<]*Kapan tidak perlu[^<]*<\/h2>/, `${n}: butuh h2 Kapan tidak perlu`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
    assert.equal((html.match(/id="panah"/g) || []).length <= 1, true, `${n}: marker panah hanya sekali`);
  });
});

test("0021 teaches the algorithms and defers the distributed service design to 0029", () => {
  assert.match(read("0021"), /href="0029-kasus-rate-limiter\.html"/);
});

test("0024 makes the monolith the default", () => {
  assert.match(text(read("0024")), /monolith (sebagai|adalah) (pilihan )?default/i);
});

test("0025 tangga skala: order exercise lists the eight rungs in order, loads order.js", () => {
  const html = read("0025");
  assert.match(html, /<script src="\.\.\/\.\.\/assets\/order\.js"><\/script>/);
  const ol = (html.match(/<div class="order">\s*<ol>([\s\S]*?)<\/ol>/) || [])[1] || "";
  const items = [...ol.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => text(m[1]).toLowerCase());
  const rungs = ["ukur", "index", "cache", "vertical", "read replica", "queue", "sharding", "pecah service"];
  assert.equal(items.length, rungs.length, "delapan anak tangga");
  rungs.forEach((r, i) => assert.ok(items[i].includes(r), `anak tangga ${i + 1} harus memuat "${r}": ${items[i]}`));
  const t = text(html);
  ["biaya", "risiko", "sinyal"].forEach(k => assert.ok(t.toLowerCase().includes(k), `0025 belum membahas ${k}`));
  assert.match(t, /untuk skala ini cukup/i, "0025: cara mengucapkannya di interview");
});

test("modul Reliabilitas & API nav: 0019 → 0020 → … → 0025 → 0026", () => {
  const files = ["0019-review-data-caching.html", ...NUMS.map(n => LESSONS[n].file), "0026-review-asinkron-reliabilitas.html"];
  NUMS.forEach((n, i) => {
    const nav = (read(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]], `${n}: nav`);
  });
});
