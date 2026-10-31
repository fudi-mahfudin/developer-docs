// Run from repo root: node --test
// Track System Design, modul Studi kasus (0027–0034): kerangka 5 langkah, cakupan topik, sitasi, diagram,
// latihan "gambar sendiri dulu, lalu Lihat jawaban", v1 sederhana dulu, checklist "membenarkan komponen dengan angka".
// Aturan teach umum (kata opsi, posisi jawaban, format lisan, kicker, nav ke tetangga) diuji track.test.js.
// Issue 11 membuat 0027–0030; issue 12 menambah 0031–0034 (news feed dan chat, masing-masing A = langkah 1–4, B = langkah 5).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertCitesNumbered } = require("../helpers.js");

const sd = forTrack("sysdesign");
// kasus: true = satu lesson memuat langkah 1–5; "A" = langkah 1–4 lalu "lanjut di lesson B"; "B" = ringkasan diagram dari A lalu langkah 5.
const LESSONS = {
  "0027": { file: "0027-kerangka-5-langkah.html", topics: ["kasus-kerangka-langkah", "kasus-kerangka-waktu"], kasus: false },
  "0028": { file: "0028-kasus-url-shortener.html", topics: ["kasus-url-kode", "kasus-url-redirect"], kasus: true },
  "0029": { file: "0029-kasus-rate-limiter.html", topics: ["kasus-rl-posisi", "kasus-rl-counter"], kasus: true },
  "0030": { file: "0030-kasus-notification.html", topics: ["kasus-notif-queue", "kasus-notif-idempotensi"], kasus: true },
  "0031": { file: "0031-kasus-news-feed-a.html", topics: ["kasus-feed-estimasi", "kasus-feed-v1"], kasus: "A", pair: "0032" },
  "0032": { file: "0032-kasus-news-feed-b.html", topics: ["kasus-feed-fanout", "kasus-feed-hybrid"], kasus: "B", pair: "0031" },
  "0033": { file: "0033-kasus-chat-a.html", topics: ["kasus-chat-protokol", "kasus-chat-data"], kasus: "A", pair: "0034" },
  "0034": { file: "0034-kasus-chat-b.html", topics: ["kasus-chat-koneksi", "kasus-chat-ordering"], kasus: "B", pair: "0033" },
};
const KEYWORDS = {
  "0027": ["functional", "non-functional", "estimasi", "API", "data model", "high-level", "deep dive", "v1", "45 menit", "class=\"order\""],
  "0028": ["base62", "hash", "read-heavy", "cache", "301", "302", "collision"],
  "0029": ["gateway", "middleware", "Redis", "INCR", "race condition", "429", "Retry-After", "token bucket"],
  "0030": ["queue", "channel", "retry", "idempotency", "preferensi", "dead letter queue", "backoff"],
  "0031": ["follow", "read-heavy", "fan-out on read", "index", "cursor", "v1"],
  "0032": ["fan-out on write", "fan-out on read", "hybrid", "akun besar", "LTRIM", "queue", "evolusi"],
  "0033": ["WebSocket", "polling", "long polling", "conversation_id", "partition key", "clustering", "v1"],
  "0034": ["stateful", "presence", "heartbeat", "ordering", "sequence", "offline", "Pub/Sub", "push notification"],
};
const NAV_BEFORE = "0026-review-asinkron-reliabilitas.html";
const NAV_AFTER = "0035-review-studi-kasus.html";
const NUMS = Object.keys(LESSONS);

test("modul Studi kasus: topics, kasus- prefix, >=2 mc per topic, >=1 oral per lesson", () => {
  sd.assertModuleTopics(LESSONS, "kasus-");
});

test("every oral checklist awards 'membenarkan komponen dengan angka'", () => {
  NUMS.forEach(n => sd.lessonQuestions(n).oral.forEach(q =>
    assert.ok(q.checklist.some(c => /membenarkan komponen dengan angka/.test(c)), `${q.id}: checklist tanpa poin angka`)));
});

test("modul Studi kasus covers the spec keywords per lesson", () => {
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    KEYWORDS[n].forEach(k => assert.ok(html.includes(k), `${n} belum membahas ${k}`));
  });
});

test("each lesson: one win, module kicker, cite numbering, diagram, quiz per topic, oral blocks, no lab", () => {
  NUMS.forEach(n => {
    const html = sd.readLesson(n);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${n}: satu win`);
    assert.match(html, new RegExp(`<div class="kicker">Lesson ${n} · System Design · Modul Studi kasus · ±\\d+ menit</div>`));
    assertCitesNumbered(html, n);
    assert.match(html, /<svg class="diagram"|<div class="flow">/, `${n}: butuh diagram`);
    LESSONS[n].topics.forEach(t => assert.match(html, new RegExp(`data-bank-lesson="${n}" data-bank-topic="[^"]*${t}`), `${n}: kuis ${t}`));
    const blocks = (html.match(/Lulus (jika|kalau) minimal 4 dari 6\./g) || []).length;
    assert.equal(blocks, sd.lessonQuestions(n).oral.length, `${n}: blok lisan statis = soal lisan bank`);
    assert.match(html, /membenarkan komponen dengan angka/, `${n}: checklist statis memuat poin angka`);
    assert.doesNotMatch(html, /hands-on\.js|class="script"|sql-exercise/, "tanpa lab");
    assert.equal((html.match(/<marker id="panah"/g) || []).length <= 1, true, `${n}: marker panah hanya sekali`);
  });
});

test("0027 teaches the 5-step frame with an order exercise and starts step 4 from v1", () => {
  const html = sd.readLesson("0027");
  assert.match(html, /<div class="order">\s*<ol>(\s*<li>[\s\S]*?<\/li>){5}\s*<\/ol>/, "order 5 langkah");
  assert.ok(html.includes('<script src="../../assets/order.js"></script>'), "memuat order.js");
  const order = html.match(/<div class="order">\s*<ol>([\s\S]*?)<\/ol>/)[1];
  const items = [...order.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
  ["requirement", "Estimasi", "API", "High-level", "Deep dive"].forEach((k, i) =>
    assert.ok(items[i] && items[i].includes(k), `langkah ${i + 1} harus memuat ${k}`));
  assert.match(items[3], /v1/, "langkah 4 dimulai dari v1");
});

test("each case study: heading per langkah 1–5, v1 before evolution, numbers, draw-first reveal with svg", () => {
  NUMS.filter(n => LESSONS[n].kasus === true).forEach(n => {
    const html = sd.readLesson(n);
    const steps = [1, 2, 3, 4, 5].map(i => {
      const m = html.match(new RegExp(`<h2>[^<]*Langkah ${i}\\b[^<]*</h2>`));
      assert.ok(m, `${n}: butuh h2 Langkah ${i}`);
      return m.index;
    });
    assert.deepEqual(steps, [...steps].sort((a, b) => a - b), `${n}: langkah berurutan`);
    const step4 = html.slice(steps[3], steps[4]);
    const step5 = html.slice(steps[4]);
    assert.match(step4, /v1/, `${n}: langkah 4 memulai dari desain v1`);
    assert.match(step5, /v2|evolusi/, `${n}: langkah 5 menunjukkan evolusi`);
    assert.match(html.slice(steps[1], steps[2]), /QPS/, `${n}: estimasi memuat QPS`);
    const reveal = html.match(/<details>\s*<summary>Lihat jawaban<\/summary>([\s\S]*?)<\/details>/g) || [];
    assert.ok(reveal.some(d => d.includes('<svg class="diagram"')), `${n}: Lihat jawaban berisi svg.diagram`);
    assert.match(html, /[Gg]ambar[^<]*sendiri/, `${n}: instruksi gambar sendiri dulu`);
  });
});

const reveals = html => html.match(/<details>\s*<summary>Lihat jawaban<\/summary>([\s\S]*?)<\/details>/g) || [];
const stepAt = (html, i) => { const m = html.match(new RegExp(`<h2>[^<]*Langkah ${i}\\b[^<]*</h2>`)); return m ? m.index : -1; };

test("case study A (0031, 0033): langkah 1–4 only, v1 with numbers, draw-first reveal, closes with 'lanjut di lesson B'", () => {
  NUMS.filter(n => LESSONS[n].kasus === "A").forEach(n => {
    const html = sd.readLesson(n);
    const steps = [1, 2, 3, 4].map(i => stepAt(html, i));
    steps.forEach((s, i) => assert.ok(s >= 0, `${n}: butuh h2 Langkah ${i + 1}`));
    assert.deepEqual(steps, [...steps].sort((a, b) => a - b), `${n}: langkah berurutan`);
    assert.equal(stepAt(html, 5), -1, `${n}: langkah 5 ada di lesson B`);
    assert.match(html.slice(steps[1], steps[2]), /QPS/, `${n}: estimasi memuat QPS`);
    assert.match(html.slice(steps[3]), /v1/, `${n}: langkah 4 memulai dari desain v1`);
    assert.ok(reveals(html).some(d => d.includes('<svg class="diagram"')), `${n}: Lihat jawaban berisi svg.diagram`);
    assert.match(html, /[Gg]ambar[^<]*sendiri/, `${n}: instruksi gambar sendiri dulu`);
    const b = LESSONS[LESSONS[n].pair].file;
    assert.match(html, new RegExp(`[Ll]anjut di <a href="${b}">lesson ${LESSONS[n].pair}</a>`), `${n}: ditutup dengan "lanjut di lesson ${LESSONS[n].pair}"`);
  });
});

test("case study B (0032, 0034): opens with a diagram summary of A, then langkah 5 with v2, draw-first reveal", () => {
  NUMS.filter(n => LESSONS[n].kasus === "B").forEach(n => {
    const html = sd.readLesson(n);
    [1, 2, 3, 4].forEach(i => assert.equal(stepAt(html, i), -1, `${n}: langkah ${i} ada di lesson A`));
    const step5 = stepAt(html, 5);
    assert.ok(step5 >= 0, `${n}: butuh h2 Langkah 5`);
    const intro = html.slice(0, step5);
    const a = LESSONS[n].pair;
    assert.match(intro, new RegExp(`<h2>[^<]*Ringkasan[^<]*</h2>`), `${n}: butuh h2 Ringkasan sebelum langkah 5`);
    assert.ok(intro.includes(`href="${LESSONS[a].file}"`), `${n}: ringkasan menautkan lesson ${a}`);
    assert.match(intro, /<svg class="diagram"/, `${n}: ringkasan memuat diagram v1 dari ${a}`);
    const deep = html.slice(step5);
    assert.match(deep, /v2/, `${n}: langkah 5 menunjukkan v2`);
    assert.match(deep, /evolusi/, `${n}: langkah 5 menunjukkan evolusi`);
    assert.ok(reveals(deep).some(d => d.includes('<svg class="diagram"')), `${n}: Lihat jawaban v2 berisi svg.diagram`);
    assert.match(deep, /[Gg]ambar[^<]*sendiri/, `${n}: instruksi gambar sendiri dulu`);
  });
});

test("modul Studi kasus nav: 0026 → 0027 → … → 0034 → 0035", () => {
  const files = [NAV_BEFORE, ...NUMS.map(n => LESSONS[n].file), NAV_AFTER];
  NUMS.forEach((n, i) => {
    const nav = (sd.readLesson(n).match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [files[i], files[i + 2]]);
  });
});

test("index lists 0027–0034 as tersedia and glossary records the new topic slugs", () => {
  const index = fs.readFileSync(path.join(ROOT, "sysdesign", "index.html"), "utf8");
  NUMS.forEach(n => assert.match(index, new RegExp(`<li class="tersedia"><span class="num">${n}</span><a class="title" href="lessons/${LESSONS[n].file}">`)));
  const glossary = fs.readFileSync(path.join(ROOT, "sysdesign", "GLOSSARY.md"), "utf8");
  const section = glossary.split("## Studi kasus")[1].split(/\n## /)[0];
  NUMS.flatMap(n => LESSONS[n].topics).forEach(t => assert.ok(section.includes(t), `slug ${t} belum di GLOSSARY Studi kasus`));
});
