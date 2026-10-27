// Run from repo root: node --test
// Track FHIR, modul Penutup: 0028 (tanya-jawab campuran) dan 0029 (STAR health-tech), dipindah dari lama 0006 bagian 3–4.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT } = require("../helpers.js");

const read = f => fs.readFileSync(path.join(ROOT, "fhir", "lessons", f), "utf8");
const qa = read("0028-tanya-jawab-campuran.html");
const star = read("0029-star-health-tech.html");

test("fhir 0028 keeps six mixed interview questions with 6-point checklists and links to the new lessons", () => {
  assert.equal((qa.match(/<details>/g) || []).length, 6);
  assert.equal((qa.match(/Lulus kalau minimal 4 dari 6/g) || []).length, 6);
  assert.match(qa, /class="timer" data-segments="Tanya-jawab:20"/);
  assert.match(qa, /belum terverifikasi \(diakses 2026-10-26\)/);
  [...qa.matchAll(/href="(\d{4}-[\w-]+\.html)"/g)].forEach(m =>
    assert.ok(fs.existsSync(path.join(ROOT, "fhir", "lessons", m[1])), `${m[1]} tidak ada`));
});

test("fhir 0029 reframes STAR from star/draf-star.md without new stories or a one-day framing", () => {
  assert.match(star, /star\/draf-star\.md/);
  ["insiden", "Refactor", "Konflik", "Mempelajari teknologi baru"].forEach(s => assert.ok(star.includes(s), `cerita STAR "${s}" belum dibingkai ulang`));
  ["data sensitif", "Integrasi antar sistem", "Volume besar"].forEach(s =>
    assert.ok(star.toLowerCase().includes(s.toLowerCase()), `sudut health-tech "${s}" belum ada`));
  assert.doesNotMatch(star, /satu hari|hari ini/);
});
