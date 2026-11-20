// Run from repo root: node --test
// Pure helpers of the PWA build (scripts/build-pwa.js, ADR 0004). Needs no `npm install`.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { shouldShip, injectPwaTags, listShippable, PWA_TAGS } = require("../../scripts/build-pwa.js");

const ROOT = path.join(__dirname, "..", "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

test("injectPwaTags puts the tags right before </head> and leaves the rest untouched", () => {
  const html = "<html><head><title>x</title></head><body><p>isi</p></body></html>";
  const out = injectPwaTags(html);
  assert.equal(out, `<html><head><title>x</title>${PWA_TAGS}\n</head><body><p>isi</p></body></html>`);
  assert.match(out, /<link rel="manifest" href="\/manifest.webmanifest">/);
  assert.match(out, /<script src="\/assets\/pwa.js" defer><\/script>/);
});

test("injectPwaTags is idempotent and ignores HTML without </head>", () => {
  const once = injectPwaTags("<head></head>");
  assert.equal(injectPwaTags(once), once);
  assert.equal(injectPwaTags("<p>fragmen</p>"), "<p>fragmen</p>");
  assert.equal(injectPwaTags("<HEAD></HEAD>"), `<HEAD>${PWA_TAGS}\n</HEAD>`);
});

test("shouldShip keeps the material and drops working files", () => {
  for (const rel of [
    "index.html", "CNAME", "offline.html", "manifest.webmanifest", "assets/pwa.js", "assets/icons/icon-192.png",
    "fhir/lessons/0013-export-dan-alur-async.html", "nodejs/assets/questions/0001.js", "dotnet/lab/0019-sql-dasar.sql",
    "fhir/GLOSSARY.md", "dotnet/ROADMAP.md", "star/draf-star.md",
  ]) assert.ok(shouldShip(rel), `${rel} harus ikut`);

  for (const rel of [
    "tests/shared/bank.test.js", "docs/adr/0001-struktur-folder-per-track.md", ".scratch/pwa/spec.md",
    "scripts/build-pwa.js", "node_modules/x/index.js", "package.json", "package-lock.json", "_site/index.html",
    ".github/workflows/deploy.yml", ".DS_Store", "sysdesign/.DS_Store", "pdf/x.pdf",
  ]) assert.ok(!shouldShip(rel), `${rel} tidak boleh ikut`);
});

test("no relative link in a shipped page points to a file that is not shipped", () => {
  const shipped = listShippable(ROOT);
  const set = new Set(shipped); // existing repo files missing from here are excluded from the build
  const broken = [];
  for (const page of shipped.filter((f) => f.endsWith(".html"))) {
    for (const [, href] of read(page).matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^([a-z]+:|#|\/\/|\/)/i.test(href)) continue; // external, anchor, or absolute
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(page), href.split(/[?#]/)[0]));
      if (target.startsWith("..")) continue;
      const abs = path.join(ROOT, target);
      if (fs.existsSync(abs) && fs.statSync(abs).isFile() && !set.has(target)) broken.push(`${page} -> ${href}`);
    }
  }
  // Pre-existing: works from file://, already 404 on the old Jekyll site (dotfolders are not served).
  const KNOWN = ["dotnet/index.html -> ../.scratch/urutan-lesson/spec.md"];
  assert.deepEqual(broken.filter((b) => !KNOWN.includes(b)), []);
});

test("manifest has the agreed identity and every icon it names exists", () => {
  const m = JSON.parse(read("manifest.webmanifest"));
  assert.equal(m.name, "Persiapan Interview");
  assert.equal(m.short_name, "Interview");
  assert.equal(m.start_url, "/");
  assert.equal(m.display, "standalone");
  assert.equal(m.theme_color, "#8b1e3f");
  assert.equal(m.background_color, "#fffff8");
  assert.ok(m.icons.some((i) => i.sizes === "192x192"));
  assert.ok(m.icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable"));

  const icons = [...m.icons.map((i) => i.src), "/assets/icons/apple-touch-icon.png"];
  for (const src of icons) assert.ok(fs.existsSync(path.join(ROOT, src)), `ikon ${src} belum ada (npm run icons)`);
});

test("offline page and the register script ship with the site", () => {
  const shipped = new Set(listShippable(ROOT));
  for (const f of ["offline.html", "manifest.webmanifest", "assets/pwa.js", "CNAME"]) assert.ok(shipped.has(f), f);
  assert.match(read("assets/pwa.js"), /location\.protocol === "https:"/);
});
