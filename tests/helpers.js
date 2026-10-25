// Shared helpers for the question-bank tests. Not a test file: Node 24's default
// `node --test` globs only match names like *.test.js, test-*.js or files under test/.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createBank } = require("../assets/bank.js");

const ROOT = path.join(__dirname, "..");

// Load assets/questions/NNNN.js files into one fresh bank, as the browser does with <script> tags.
// loadLesson("0004") for one lesson, loadLesson(...DAY1) for a review.
function loadLesson(...nums) {
  const bank = createBank();
  globalThis.QuestionBank = bank;
  try {
    nums.forEach(n => {
      const full = path.join(ROOT, "assets", "questions", `${n}.js`);
      delete require.cache[require.resolve(full)];
      require(full);
    });
  } finally {
    delete globalThis.QuestionBank;
  }
  return bank;
}

// Run bank.js and the question files as plain browser scripts in one shared global scope
// (catches top-level name clashes that require() would hide). Returns the page's QuestionBank.
function runAsBrowserScripts(nums) {
  const ctx = vm.createContext({});
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(path.join(ROOT, "assets", "bank.js"), "utf8"), ctx);
  nums.forEach(n => {
    const file = path.join(ROOT, "assets", "questions", `${n}.js`);
    assert.doesNotThrow(() => vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file }), `questions/${n}.js`);
  });
  return ctx.QuestionBank;
}

// Questions of one lesson, split by type.
function lessonQuestions(num) {
  const bank = loadLesson(num);
  const qs = bank.select({ lessons: [num] });
  return { bank, qs, mc: qs.filter(q => q.type === "mc"), oral: qs.filter(q => q.type === "oral") };
}

// Word count of an option: a tag is a word break, but punctuation left alone after a
// closing tag ("</code>,") is not a word. `**` inside <code> still counts.
const words = html => html.replace(/<[^>]+>/g, " ").trim().split(/\s+/)
  .filter(t => !/^[,.;:!?)]+$/.test(t)).length;

// Teach rule: all options of a quiz question have the same number of words.
function assertEqualOptionWords(mcs) {
  mcs.forEach(q => {
    const counts = Object.values(q.options).map(words);
    assert.equal(new Set(counts).size, 1, `${q.id}: jumlah kata opsi berbeda (${counts})`);
  });
}

// Teach rule: the correct answer is spread over positions. Option keys run a, b, c, ...
// in order (so key = position), every available position is used as an answer, and
// unless `allowSameInARow` the same position never repeats on consecutive questions.
function assertAnswerPositionsVary(mcs, { allowSameInARow = false } = {}) {
  mcs.forEach(q => {
    const keys = Object.keys(q.options).join("");
    assert.equal(keys, "abcdefgh".slice(0, keys.length), `${q.id}: kunci opsi harus urut a, b, c, ...`);
  });
  const positions = mcs.map(q => Object.keys(q.options).indexOf(q.answer));
  const available = Math.max(4, ...mcs.map(q => Object.keys(q.options).length));
  const used = [...new Set(positions)].sort();
  assert.deepEqual(used, [...Array(available).keys()], `posisi jawaban benar yang dipakai: ${used}`);
  if (allowSameInARow) return;
  positions.slice(1).forEach((p, i) => assert.notEqual(p, positions[i], `posisi sama berturut-turut di ${mcs[i + 1].id}`));
}

// Teach rule: every oral question has a 6-point checklist and a sample answer.
function assertOralFormat(orals) {
  assert.ok(orals.length >= 1, "minimal satu soal lisan");
  orals.forEach(q => {
    assert.equal(q.checklist.length, 6, `${q.id}: checklist harus 6 poin`);
    assert.ok(q.sample, `${q.id}: belum ada contoh jawaban`);
  });
}

// Hands-on script blocks (assets/hands-on.js): <pre class="script" data-file="lab/x.sql"><code>…</code></pre>.
// Returns [{ file, text }] for one HTML page (path relative to ROOT, or absolute), with
// tags removed and HTML entities decoded, i.e. the text the copy button puts on the clipboard.
function scriptBlocks(htmlFile) {
  const html = fs.readFileSync(path.resolve(ROOT, htmlFile), "utf8");
  const re = /<pre\b(?=[^>]*\bclass="[^"]*\bscript\b)[^>]*\bdata-file="([^"]+)"[^>]*>([\s\S]*?)<\/pre>/g;
  const decode = s => s.replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  return [...html.matchAll(re)].map(m => ({ file: m[1], text: decode(m[2]) }));
}

// The .sql file is the source of truth: every script block in the page must show its file
// (data-file, relative to ROOT) exactly, ignoring only a trailing newline. `min` = expected blocks.
function assertScriptsMatchFiles(htmlFile, { min = 1 } = {}) {
  const blocks = scriptBlocks(htmlFile);
  assert.ok(blocks.length >= min, `${htmlFile}: butuh >= ${min} blok script, ada ${blocks.length}`);
  blocks.forEach(b => {
    const sql = fs.readFileSync(path.join(ROOT, b.file), "utf8");
    assert.equal(b.text.replace(/\n$/, ""), sql.replace(/\n$/, ""), `${htmlFile}: blok script berbeda dari ${b.file}`);
  });
}

module.exports = { ROOT, loadLesson, runAsBrowserScripts, lessonQuestions, words, assertEqualOptionWords, assertAnswerPositionsVary, assertOralFormat, scriptBlocks, assertScriptsMatchFiles };
