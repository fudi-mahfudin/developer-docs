// Run from repo root: node --test
// Track fullstack (fullstack/): track baca-saja (spec .scratch/materi-fullstack/spec.md). Daftar lesson diturunkan
// dari fullstack/index.html; setiap lesson yang tersedia ada, memakai kicker "Lesson NNNN · Fullstack · ",
// punya tepat satu target (.win), tanpa elemen interaktif, bernavigasi ke lesson sebelum/sesudahnya, dan tidak merujuk track lain.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack } = require("../helpers.js");

const TRACK = "fullstack";
const track = forTrack(TRACK);
const read = track.read;
const exists = (...p) => fs.existsSync(path.join(ROOT, TRACK, ...p));
const index = read("index.html");
const nums = [...index.matchAll(/<span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
const lessons = [...index.matchAll(/<li class="tersedia"><span class="num">(\d{4})<\/span><a class="title" href="(lessons\/[\w-]+\.html)">/g)]
  .map(m => ({ num: m[1], href: m[2] }));
const LAST = nums[nums.length - 1];
const REFERENCES = ["pertanyaan-sql", "soal-coding-tambahan"];
const references = fs.readdirSync(path.join(ROOT, TRACK, "reference")).filter(f => f.endsWith(".html")).map(f => `reference/${f}`);
const pages = [...lessons.map(l => l.href), ...references];

test("fullstack index lists lessons 0001–0010 in order and the two references", () => {
  assert.deepEqual(nums, Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(4, "0")));
  assert.equal([...index.matchAll(/<span class="num">Ref<\/span>/g)].length, REFERENCES.length, "index harus mendaftar 2 reference");
  references.forEach(r => assert.match(index, new RegExp(`<li class="tersedia"><span class="num">Ref</span><a class="title" href="${r}">`), `index belum menautkan ${r}`));
});

test("fullstack is read-only: no question bank, learning records, or NOTES", () => {
  ["NOTES.md", "learning-records", path.join("assets", "questions")].forEach(p =>
    assert.ok(!exists(p), `${TRACK}/${p} tidak boleh ada di track baca-saja`));
  assert.ok(exists("lessons") && exists("reference"), "folder lessons/ dan reference/ harus ada");
});

// Tidak ada kuis, input, atau jawaban tersembunyi: semua contoh jawaban langsung tampil.
const INTERACTIVE = [/\b(bank|review|timer|order)\.js\b/, /assets\/questions\//, /<input\b/, /<textarea\b/, /<details\b/];
["index.html", ...pages].forEach(page => {
  test(`fullstack ${page}: no interactive elements`, () => {
    const html = read(page);
    INTERACTIVE.forEach(re => assert.doesNotMatch(html, re, `${page}: elemen interaktif ${re}`));
  });
});

test("fullstack track is self-paced: no deadline or clock slots", () => {
  ["index.html", "MISSION.md", "ROADMAP.md"].forEach(f =>
    assert.doesNotMatch(read(f), /\b\d hari\b|malam sebelum interview|\b\d{2}\.\d{2}–\d{2}\.\d{2}\b|deadline:/i, `${f} menyebut deadline`));
});

test("fullstack does not link other tracks or star/", () => {
  ["index.html", "MISSION.md", "ROADMAP.md", "RESOURCES.md", "GLOSSARY.md", ...pages].forEach(f =>
    assert.doesNotMatch(read(f), /href="[^"]*\b(dotnet|fhir|sysdesign|nodejs|star)\/|\]\([^)]*\b(dotnet|fhir|sysdesign|nodejs|star)\//, `${f}: track mandiri`));
});

test("fullstack MISSION records verified versions and the ADR 0003 deviations", () => {
  const mission = read("MISSION.md");
  const constraints = (mission.match(/## Constraints\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  [/Next\.js 1\d/, /Express 5/, /Prisma (ORM )?\d/, /PostgreSQL 1\d/, /diverifikasi \d{4}-\d{2}-\d{2}/].forEach(re =>
    assert.match(constraints, re, `Constraints belum mencatat ${re}`));
  const deviations = (mission.match(/## Penyimpangan dari ADR 0003\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  [/[Bb]aca-saja/, /30 menit/, /ADR baru/].forEach(re => assert.match(deviations, re));
});

test("fullstack ROADMAP lists the 10 lessons and 2 references with a duration each", () => {
  const roadmap = read("ROADMAP.md");
  nums.forEach(n => assert.match(roadmap, new RegExp(`\\| ${n} \\|[^\\n]*±\\d+ menit`), `ROADMAP: ${n} tanpa durasi`));
  REFERENCES.forEach(r => assert.match(roadmap, new RegExp(`reference/${r}\\.html`)));
});

test("fullstack RESOURCES lists out-of-scope topics as further reading", () => {
  const extra = (read("RESOURCES.md").match(/## Bacaan lanjutan \(di luar cakupan\)\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  [/LeetCode/, /NeetCode/, /DP|dynamic programming/i, /graph/i, /Docker/].forEach(re => assert.match(extra, re));
});

test("fullstack is linked from the root index, the glossary map, and CLAUDE.md", () => {
  assert.match(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), /href="fullstack\/index\.html"/);
  assert.match(fs.readFileSync(path.join(ROOT, "GLOSSARY-MAP.md"), "utf8"), /fullstack\/GLOSSARY\.md/);
  const claude = fs.readFileSync(path.join(ROOT, "CLAUDE.md"), "utf8");
  assert.match(claude, /fullstack\/GLOSSARY\.md/);
  assert.match(claude, /tests\/\{shared,dotnet,fhir,sysdesign,nodejs,fullstack\}\//);
});

lessons.forEach(({ num, href }) => {
  test(`fullstack ${num}: lesson page exists, uses the kicker, links its neighbours, has one win`, () => {
    const html = read(href);
    assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
    const kicker = (html.match(/<div class="kicker">([^<]*)</) || [])[1] || "";
    assert.match(kicker, /^Lesson \d{4} · Fullstack · ±\d+ menit/, `${href}: format kicker`);
    assert.ok(kicker.startsWith(`Lesson ${num} `), `${href}: nomor di kicker`);
    assert.doesNotMatch(html, /<script\b/, `${href}: track baca-saja tanpa <script>`);
    assert.equal((html.match(/<div class="win">/g) || []).length, 1, `${href}: harus tepat satu target (.win)`);
    const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const prev = String(Number(num) - 1).padStart(4, "0");
    const next = String(Number(num) + 1).padStart(4, "0");
    if (num !== "0001") assert.match(nav, new RegExp(`href="${prev}-[\\w-]+\\.html"`), `nav belum menautkan ${prev}`);
    if (num !== LAST) assert.match(nav, new RegExp(`href="${next}-[\\w-]+\\.html"`), `nav belum menautkan ${next}`);
    if (num === "0001" || num === LAST) assert.match(nav, /href="\.\.\/index\.html"/, `nav ${num} harus menautkan indeks`);
  });
});

// Sitasi hanya ke sumber primer. MDN termasuk sumber primer di track ini (spec), beda dengan track lain.
const NOT_PRIMARY = /medium\.com|dev\.to|stackoverflow\.com|freecodecamp\.org|geeksforgeeks\.org|w3schools\.com|udemy\.com|youtube\.com|leetcode\.com|neetcode\.io/;
pages.forEach(page => {
  test(`fullstack ${page}: cites point at primary sources only`, () => {
    const html = read(page);
    const urls = [...html.matchAll(/<sup class="cite"><a href="([^"]+)"/g), ...html.matchAll(/<a href="([^"]+)">\[\d+\] /g)].map(m => m[1]);
    urls.forEach(u => assert.doesNotMatch(u, NOT_PRIMARY, `${page}: ${u} bukan sumber primer`));
  });
});

test("fullstack lessons keep every code block at 20 lines or fewer", () => {
  lessons.forEach(({ href }) => {
    const html = read(href);
    [...html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g)].forEach(m => {
      const lines = m[1].replace(/\n$/, "").split("\n").length;
      const at = html.slice(0, m.index).split("\n").length;
      assert.ok(lines <= 20, `${href}:${at}: blok kode ${lines} baris`);
    });
  });
});
