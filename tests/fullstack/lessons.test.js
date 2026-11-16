// Run from repo root: node --test
// Isi lesson track fullstack (spec .scratch/materi-fullstack/spec.md, bagian Testing).
const test = require("node:test");
const assert = require("node:assert/strict");
const { forTrack, assertCitesNumbered } = require("../helpers.js");

const fs_ = forTrack("fullstack");

// ---------------------------------------------------------------------------
// 0006–0007: peran sole developer dan IT di luar development (ticket 03)
// ---------------------------------------------------------------------------
const PERAN = {
  "0006": {
    file: "0006-sole-developer-aplikasi-internal.html",
    keywords: [/requirement/i, /MVP/, /testing/i, /deploy/i, /backup/i, /monitoring/i, /preventive maintenance/i,
      /SOP/, /maintenance record/i, /dokumentasi/i, /inventaris aset/i],
  },
  "0007": {
    file: "0007-peran-it-di-luar-development.html",
    keywords: [/subnet/i, /DHCP/, /DNS/, /gateway/i, /\bping\b/, /tracert/, /nslookup/, /printer/i, /3-2-1/,
      /hak akses/i, /resolusi/i, /kompresi/i, /aspect ratio/i, /portofolio/i, /troubleshooting/i],
  },
};

test("fullstack 0006–0007 are listed as tersedia in the index", () => {
  fs_.assertListedAsTersedia(PERAN);
});

Object.entries(PERAN).forEach(([num, { keywords }]) => {
  test(`fullstack ${num}: covers the spec topics, cites primary sources, and shows a diagram or code`, () => {
    const html = fs_.readLesson(num);
    keywords.forEach(re => assert.match(html, re, `${num}: belum membahas ${re}`));
    assertCitesNumbered(html, num);
    assert.match(html, /class="flow"|<svg class="diagram"|<pre><code>/, `${num}: butuh diagram atau blok kode`);
  });
});

test("fullstack 0006: sole-dev flow in order, filled SOP and maintenance record", () => {
  const html = fs_.readLesson("0006");
  const flow = (html.match(/<div class="flow">([\s\S]*?)<\/div>/) || [])[1] || "";
  [/[Rr]equirement/, /MVP/, /[Ss]tack/, /[Tt]esting/, /[Dd]eploy/, /[Bb]ackup/, /[Mm]onitoring/, /[Dd]okumentasi/]
    .reduce((from, re) => {
      const at = flow.slice(from).search(re);
      assert.ok(at >= 0, `alur .flow: ${re} tidak ada atau tidak berurutan`);
      return from + at;
    }, 0);
  assert.match(html, /<h3[^>]*>[^<]*SOP/, "butuh contoh SOP terisi");
  assert.match(html, /<h3[^>]*>[^<]*[Mm]aintenance record/, "butuh contoh maintenance record terisi");
});

test("fullstack 0006: one full STAR story with numbers in the Result", () => {
  const html = fs_.readLesson("0006");
  const stars = [...html.matchAll(/<div class="note" id="star">([\s\S]*?)<\/div>/g)];
  assert.equal(stars.length, 1, "butuh tepat satu cerita STAR");
  const star = stars[0][1];
  ["Situation", "Task", "Action", "Result"].reduce((from, k) => {
    const at = star.indexOf(`<strong>${k}`, from);
    assert.ok(at >= 0, `STAR: ${k} tidak ada atau tidak berurutan`);
    return at;
  }, 0);
  assert.match(star.split("<strong>Result")[1], /\d/, "Result STAR harus memuat angka");
});

test("fullstack 0007: troubleshooting flow and honest example answers", () => {
  const html = fs_.readLesson("0007");
  assert.match(html, /class="flow"|<svg class="diagram"/, "0007: butuh alur troubleshooting");
  assert.match(html, /[Cc]ontoh jawaban/, "0007: butuh contoh jawaban");
});
