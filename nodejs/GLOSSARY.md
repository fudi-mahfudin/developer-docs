# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

## I/O & skala

## Modul & tooling

Slug topik bank soal modul ini: `tooling-format-modul`, `tooling-interop-esm` (0013), `tooling-semver-lockfile`, `tooling-field-package` (0014), `tooling-typescript-node`, `tooling-env-config` (0015).

**CommonJS (CJS)**:
Sistem modul asli Node: `require()` dan `module.exports`, dimuat sinkron. File `.cjs` selalu CommonJS (lesson 0013).
_Avoid_: "modul Node lama" (tanpa konteks)

**ES module (ESM)**:
Sistem modul standar JavaScript: `import`/`export`, ekstensi wajib di import relatif, mendukung top-level await. File `.mjs` selalu ESM (lesson 0013).
_Avoid_: ES6 module

**Field `"type"`**:
Field `package.json` yang menentukan format file `.js` di paket itu: `"module"` = ESM, `"commonjs"` = CommonJS. Sebaiknya selalu ditulis eksplisit (lesson 0013).

**require(esm)**:
Memuat ES module dengan `require()` dari CommonJS. Tanpa flag sejak Node 22.12, stabil sejak 24.15; gagal dengan `ERR_REQUIRE_ASYNC_MODULE` kalau modul memakai top-level await (lesson 0013).

**Top-level await**:
`await` langsung di badan modul ESM, di luar fungsi `async` (lesson 0013).

**Semver range (`^`, `~`)**:
`^1.2.3` = `>=1.2.3 <2.0.0` (minor dan patch boleh naik), `~1.2.3` = `>=1.2.3 <1.3.0` (patch saja). Untuk 0.x caret lebih ketat: `^0.2.3` = `<0.3.0` (lesson 0014).
_Avoid_: "versi terbaru" (range bukan berarti terbaru)

**Lockfile (`package-lock.json`)**:
Catatan pohon dependency persis yang terpasang, supaya setiap install identik. Di-commit (lesson 0014).

**npm ci**:
Install untuk CI: wajib lockfile, gagal kalau lockfile tidak cocok dengan `package.json`, menghapus `node_modules` lama, tidak menulis lockfile (lesson 0014).
_Avoid_: "npm install versi CI" (tanpa menyebut bedanya)

**peerDependencies**:
Paket host (mis. framework) yang harus disediakan aplikasi pemakai, biasanya untuk plugin; dipasang default sejak npm v7 (lesson 0014).

**Field `"exports"`**:
Entry point paket yang bisa banyak dan bersyarat (`import`/`require`); path lain tertutup (`ERR_PACKAGE_PATH_NOT_EXPORTED`). Mengalahkan `"main"` (lesson 0014).

**Type stripping**:
Node menjalankan `.ts` langsung dengan mengganti anotasi tipe menjadi spasi, tanpa type-check dan tanpa membaca `tsconfig.json`. Aktif default sejak Node 23.6, stabil sejak 24.12. Tidak mendukung enum, parameter properties, dan decorator tanpa transformasi (lesson 0015).
_Avoid_: "Node mendukung TypeScript penuh"

**`module: nodenext`**:
Opsi `tsconfig` yang meniru aturan modul Node: format per file dari ekstensi dan field `"type"`, import relatif ESM ditulis dengan ekstensi `.js` (lesson 0015).

**`--env-file`**:
Flag Node untuk memuat file `.env` ke `process.env` (Node ≥ 20.6, stabil sejak 24.10). Variabel yang sudah ada di environment menang (lesson 0015).
_Avoid_: dotenv (sebagai satu-satunya cara)

**Fail fast (config)**:
Memvalidasi config saat aplikasi start dan berhenti kalau tidak valid, bukan gagal di tengah request (lesson 0015).

## NestJS inti

## Pipeline request

## Data & auth

## Testing & produksi
