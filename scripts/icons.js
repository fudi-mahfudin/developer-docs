// Generate the PWA icons from assets/icon.svg into assets/icons/ (ADR 0004). Run: npm run icons
// The output is committed; CI does not regenerate it.
const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "assets", "icon.svg");
const OUT = path.join(ROOT, "assets", "icons");

// icon.svg is full-bleed with its glyph inside the maskable safe zone, so one source serves all.
const TARGETS = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, size] of TARGETS) {
    await sharp(SRC, { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(OUT, name));
    console.log(`assets/icons/${name} (${size}px)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
