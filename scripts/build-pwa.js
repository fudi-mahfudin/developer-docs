// Build the deployable PWA into _site/ (ADR 0004). Run: npm run build
// 1. Copy the site without working files (tests, docs, scratch, tooling).
// 2. Inject the PWA tags into every HTML <head>. Source HTML stays untouched, so file:// is unchanged.
// 3. Bundle scripts/sw-src.js and inject the Workbox precache manifest into _site/sw.js.
// The pure helpers are exported for tests/shared/build-pwa.test.js; build dependencies are
// required lazily so the tests run without `npm install`.
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "_site");

// Top-level folders and files that never ship.
const EXCLUDED_TOP = new Set([
  "tests", "docs", "scripts", "node_modules", "pdf", "_site",
  "package.json", "package-lock.json",
]);

// relPath uses "/" separators, relative to the repo root.
function shouldShip(relPath) {
  const parts = relPath.split("/");
  if (parts.some((p) => p.startsWith("."))) return false; // .git, .scratch, .claude, .github, .DS_Store
  return !EXCLUDED_TOP.has(parts[0]);
}

const PWA_MARKER = 'rel="manifest"';
const PWA_TAGS = [
  '<link rel="manifest" href="/manifest.webmanifest">',
  '<meta name="theme-color" content="#8b1e3f">',
  '<link rel="icon" type="image/png" href="/assets/icons/icon-192.png">',
  '<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">',
  '<script src="/assets/pwa.js" defer></script>',
].join("\n");

// Insert the PWA tags right before </head>. Idempotent; HTML without </head> is returned as is.
function injectPwaTags(html) {
  if (html.includes(PWA_MARKER)) return html;
  const i = html.search(/<\/head>/i);
  if (i === -1) return html;
  return `${html.slice(0, i)}${PWA_TAGS}\n${html.slice(i)}`;
}

// Every shippable file, as "/"-separated paths relative to `root`.
function listShippable(root = ROOT) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      const rel = path.relative(root, abs).split(path.sep).join("/");
      if (!shouldShip(rel)) continue;
      if (entry.isDirectory()) walk(abs);
      else if (entry.isFile()) out.push(rel);
    }
  };
  walk(root);
  return out.sort();
}

// Files Workbox precaches from _site/ (everything shipped except the worker itself and CNAME).
const PRECACHE_GLOBS = ["**/*.{html,js,css,svg,png,webmanifest,md,sql,cs}"];
const PRECACHE_IGNORES = ["sw.js", "CNAME"];

function copySite() {
  fs.rmSync(OUT, { recursive: true, force: true });
  const files = listShippable();
  for (const rel of files) {
    const src = path.join(ROOT, rel);
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (rel.endsWith(".html")) fs.writeFileSync(dest, injectPwaTags(fs.readFileSync(src, "utf8")));
    else fs.copyFileSync(src, dest);
  }
  return files.length;
}

async function buildServiceWorker() {
  const esbuild = require("esbuild");
  const { injectManifest } = require("workbox-build");
  const swDest = path.join(OUT, "sw.js");
  await esbuild.build({
    entryPoints: [path.join(__dirname, "sw-src.js")],
    bundle: true,
    minify: true,
    format: "iife",
    outfile: swDest,
    define: { "process.env.NODE_ENV": '"production"' },
  });
  return injectManifest({
    swSrc: swDest,
    swDest,
    globDirectory: OUT,
    globPatterns: PRECACHE_GLOBS,
    globIgnores: PRECACHE_IGNORES,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  });
}

async function build() {
  const copied = copySite();
  const { count, size, warnings } = await buildServiceWorker();
  for (const w of warnings) console.warn(`workbox: ${w}`);
  console.log(`_site/: ${copied} file disalin, ${count} file di-precache (${(size / 1024 / 1024).toFixed(1)} MB)`);
}

if (require.main === module) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { shouldShip, injectPwaTags, listShippable, PWA_TAGS, PRECACHE_GLOBS, PRECACHE_IGNORES };
