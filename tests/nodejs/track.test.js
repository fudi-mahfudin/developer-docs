// Run from repo root: node --test
// Track Node.js + NestJS (nodejs/): aturan ADR 0003 untuk setiap bank soal nodejs/assets/questions/NNNN.js,
// dan setiap lesson yang "tersedia" di nodejs/index.html ada, memuat komponen bersama dari ../../assets/,
// memuat bank soalnya sendiri, bernavigasi ke lesson sebelum/sesudahnya, dan tidak merujuk track lain.
// Lesson yang masih "segera" di index belum dicek.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, forTrack, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat } = require("../helpers.js");

const TRACK = "nodejs";
const nj = forTrack(TRACK);
const read = f => fs.readFileSync(path.join(ROOT, TRACK, f), "utf8");
const listDir = (...p) => {
  const dir = path.join(ROOT, TRACK, ...p);
  return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
};
const questionNums = listDir("assets", "questions").filter(f => /^\d{4}\.js$/.test(f)).map(f => f.slice(0, 4)).sort();
const index = read("index.html");
const lessons = [...index.matchAll(/<li class="tersedia[^"]*"><span class="num">(\d{4})<\/span><a class="title" href="(lessons\/[\w-]+\.html)">/g)]
  .map(m => ({ num: m[1], href: m[2] }));
const nums = [...index.matchAll(/<span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
const LAST = nums[nums.length - 1];
const SEAMS = ["0012", "0020", "0029", "0035"];
const MOCK = "0036";

test("nodejs index lists lessons 0001–0036 in order, with the four delayed reviews as seams", () => {
  assert.deepEqual(nums, Array.from({ length: 36 }, (_, i) => String(i + 1).padStart(4, "0")));
  const seams = [...index.matchAll(/<li class="[a-z]+ seam"><span class="num">(\d{4})<\/span>/g)].map(m => m[1]);
  assert.deepEqual(seams, SEAMS);
});

test("nodejs index marks the 0036 mock interview as optional, ±45 menit", () => {
  const li = (index.match(/<li [^>]*><span class="num">0036<\/span>.*<\/li>/) || [])[0] || "";
  assert.match(li, /opsional/);
  assert.match(li, /±45 menit/);
});

test("nodejs track is self-paced: no deadline or clock slots", () => {
  ["index.html", "MISSION.md", "ROADMAP.md"].forEach(f =>
    assert.doesNotMatch(read(f), /\b\d hari\b|malam sebelum interview|\b\d{2}\.\d{2}–\d{2}\.\d{2}\b/, `${f} menyebut deadline`));
});

test("nodejs MISSION records the verified NestJS major version and Node 24 LTS in Constraints", () => {
  const constraints = (read("MISSION.md").match(/## Constraints\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  assert.match(constraints, /Node(\.js)? 24 LTS/);
  assert.match(constraints, /NestJS (v)?\d{2}\b/, "versi major NestJS belum dicatat");
});

test("nodejs RESOURCES lists out-of-scope topics as further reading", () => {
  const extra = (read("RESOURCES.md").match(/## Bacaan lanjutan \(di luar cakupan\)\n([\s\S]*?)(\n## |$)/) || [])[1] || "";
  [/GraphQL/, /microservices/, /WebSocket/, /CQRS/].forEach(re => assert.match(extra, re));
});

test("nodejs is linked from the root index, the glossary map, and CLAUDE.md", () => {
  assert.match(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), /href="nodejs\/index\.html"/);
  assert.match(fs.readFileSync(path.join(ROOT, "GLOSSARY-MAP.md"), "utf8"), /nodejs\/GLOSSARY\.md/);
  const claude = fs.readFileSync(path.join(ROOT, "CLAUDE.md"), "utf8");
  assert.match(claude, /nodejs\/GLOSSARY\.md/);
  assert.match(claude, /tests\/\{shared,dotnet,fhir,sysdesign,nodejs\}\//);
});

test("all nodejs question files run together as browser scripts", () => {
  nj.runAsBrowserScripts(questionNums);
});

questionNums.forEach(num => {
  test(`nodejs ${num}: questions follow the ADR 0003 rules`, () => {
    const { bank, qs, mc, oral } = nj.lessonQuestions(num);
    assert.ok(mc.length >= 4, "butuh >= 4 soal kuis");
    assert.ok(oral.length >= 1, "butuh >= 1 soal lisan");
    qs.forEach(q => {
      assert.match(q.id, new RegExp(`^${num}-`));
      assert.equal(q.lesson, num);
      assert.ok(bank.labels()[q.topic], `topik ${q.topic} belum diberi label`);
    });
    assertEqualOptionWords(mc);
    assertAnswerPositionsVary(mc);
    assertOralFormat(oral);
  });
});

lessons.forEach(({ num, href }) => {
  test(`nodejs ${num}: lesson page exists, loads shared assets, links its neighbours, stays self-contained`, () => {
    const html = read(href);
    assert.match(html, /href="\.\.\/\.\.\/assets\/style\.css"/);
    const kicker = (html.match(/<div class="kicker">([^<]*)</) || [])[1] || "";
    assert.match(kicker, /^Lesson \d{4} · Node\.js · /, `${href}: format kicker`);
    assert.ok(kicker.startsWith(`Lesson ${num} `), `${href}: nomor di kicker`);
    if (num === MOCK) assert.match(kicker, /opsional/, `${href}: mock harus ditandai opsional`);
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    scripts.filter(s => !s.startsWith("../assets/questions/")).forEach(s =>
      assert.match(s, /^\.\.\/\.\.\/assets\/[\w-]+\.js$/, `${s}: komponen bersama harus dari ../../assets/`));
    scripts.filter(s => s.startsWith("../assets/questions/")).forEach(s =>
      assert.ok(fs.existsSync(path.join(ROOT, TRACK, "lessons", s)), `${s} tidak ada`));
    if (questionNums.includes(num)) assert.ok(scripts.includes(`../assets/questions/${num}.js`), `lesson belum memuat bank soal ${num}`);
    assert.doesNotMatch(html, /href="[^"]*\.\.\/(dotnet|fhir|sysdesign)\//, `${href}: track mandiri, jangan menautkan track lain`);
    const nav = (html.match(/<nav class="lesson-nav">([\s\S]*?)<\/nav>/) || [])[1] || "";
    const prev = String(Number(num) - 1).padStart(4, "0");
    const next = String(Number(num) + 1).padStart(4, "0");
    if (num !== "0001") assert.match(nav, new RegExp(`href="${prev}-[\\w-]+\\.html"`), `nav belum menautkan ${prev}`);
    if (num !== LAST) assert.match(nav, new RegExp(`href="${next}-[\\w-]+\\.html"`), `nav belum menautkan ${next}`);
    if (num === "0001" || num === LAST) assert.match(nav, /href="\.\.\/index\.html"/, `nav ${num} harus menautkan indeks`);
  });
});

// Sitasi hanya ke sumber primer (dokumentasi resmi, RFC, spesifikasi), bukan blog, kursus, atau buku pihak ketiga.
const NOT_PRIMARY = /medium\.com|dev\.to|stackoverflow\.com|freecodecamp\.org|geeksforgeeks\.org|w3schools\.com|udemy\.com|youtube\.com|developer\.mozilla\.org/;
const references = listDir("reference").filter(f => f.endsWith(".html")).map(f => `reference/${f}`);
[...lessons.map(l => l.href), ...references].forEach(page => {
  test(`nodejs ${page}: cites and Sumber list point at primary sources only`, () => {
    const html = read(page);
    const urls = [...html.matchAll(/<sup class="cite"><a href="([^"]+)"/g), ...html.matchAll(/<a href="([^"]+)">\[\d+\] /g)].map(m => m[1]);
    urls.forEach(u => assert.doesNotMatch(u, NOT_PRIMARY, `${page}: ${u} bukan sumber primer`));
  });
});
