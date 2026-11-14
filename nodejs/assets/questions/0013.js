// Soal lesson 0013 (track Node.js, modul Paket & tooling) · CommonJS vs ESM. Format: assets/README.md.
// Sumber: Node.js v24 docs (Modules: CommonJS modules, ECMAScript modules, Packages "Determining module system").
QuestionBank.labelTopics({
  "tooling-format-modul": "Paket & tooling: CommonJS vs ESM, field type, .mjs/.cjs",
  "tooling-interop-esm": "Paket & tooling: interop CJS/ESM, require(esm), top-level await",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban b d a c b.
QuestionBank.register([
  {
    id: "0013-01", lesson: "0013", topic: "tooling-format-modul", type: "mc",
    prompt: "File <code>src/app.js</code> berisi <code>import</code>. <code>package.json</code> terdekat berisi <code>\"type\": \"module\"</code>. Bagaimana Node 24 memperlakukan file ini?",
    options: {
      a: "Sebagai CommonJS, karena ekstensinya hanya .js biasa saja",
      b: "Sebagai ES module, karena field type bernilai module",
      c: "Sebagai CommonJS dulu, lalu error di baris import",
      d: "Tergantung isi tsconfig.json yang ada di folder proyek",
    },
    answer: "b",
    explain: "Node docs (Packages, Determining module system): file .js diperlakukan sebagai ES module kalau package.json terdekat berisi \"type\": \"module\", dan sebagai CommonJS kalau \"type\": \"commonjs\". .mjs selalu ESM, .cjs selalu CommonJS. Node tidak membaca tsconfig.json.",
  },
  {
    id: "0013-02", lesson: "0013", topic: "tooling-interop-esm", type: "mc",
    prompt: "Kode CommonJS memanggil <code>require('./config.mjs')</code>, dan <code>config.mjs</code> memakai <code>await</code> di top level. Apa yang terjadi di Node 24?",
    options: {
      a: "Berhasil, require menunggu await selesai lalu mengembalikan modul",
      b: "Berhasil, tetapi nilai export berupa Promise yang pending",
      c: "Error ERR_REQUIRE_ESM karena require tidak bisa memuat ESM",
      d: "Error ERR_REQUIRE_ASYNC_MODULE, jadi muat modul itu dengan import()",
    },
    answer: "d",
    explain: "Node docs (Loading ECMAScript modules using require()): require(esm) hanya mendukung ES module yang sepenuhnya sinkron. Kalau modul atau graph-nya memakai top-level await, Node melempar ERR_REQUIRE_ASYNC_MODULE dan menyarankan import().",
  },
  {
    id: "0013-03", lesson: "0013", topic: "tooling-format-modul", type: "mc",
    prompt: "Di file ES module, baris <code>import { hitung } from './util'</code> gagal ditemukan, padahal <code>util.js</code> ada. Kenapa?",
    options: {
      a: "ESM wajib menulis ekstensi file lengkap, yaitu './util.js'",
      b: "ESM tidak bisa mengimpor file dari folder sama",
      c: "Named import hanya bisa dipakai untuk paket npm",
      d: "File util.js harus diganti namanya menjadi util.cjs dulu",
    },
    answer: "a",
    explain: "Node docs (ECMAScript modules, Mandatory file extensions): ekstensi file wajib ditulis untuk specifier relatif atau absolut di import, termasuk index direktori ('./startup/index.js'). require() di CommonJS masih boleh tanpa ekstensi.",
  },
  {
    id: "0013-04", lesson: "0013", topic: "tooling-interop-esm", type: "mc",
    prompt: "ES module menulis <code>import lib from './legacy.cjs'</code>, dan <code>legacy.cjs</code> berisi <code>module.exports = { a: 1 }</code>. Apa isi <code>lib</code>?",
    options: {
      a: "undefined, karena file CommonJS tidak punya default export",
      b: "Namespace object yang hanya berisi properti default saja",
      c: "Objek module.exports milik legacy.cjs, persis seperti yang diekspor",
      d: "Error, karena ESM tidak boleh mengimpor file CommonJS",
    },
    answer: "c",
    explain: "Node docs (ECMAScript modules, Interoperability with CommonJS): saat mengimpor CommonJS, objek module.exports diberikan sebagai default export. Named export kadang tersedia lewat analisis statis, tapi default import selalu andal.",
  },
  {
    id: "0013-05", lesson: "0013", topic: "tooling-format-modul", type: "mc",
    prompt: "Kode lama di ES module memakai <code>__dirname</code> dan error <em>__dirname is not defined</em>. Pengganti yang disediakan Node 24?",
    options: {
      a: "process.cwd(), karena nilainya selalu sama dengan folder file",
      b: "import.meta.dirname, yang menunjuk folder tempat file modul ini",
      c: "require.main.path, yang tetap tersedia di dalam ES module",
      d: "module.path, karena objek module juga ada di ESM",
    },
    answer: "b",
    explain: "Node docs (ECMAScript modules, No __filename or __dirname): variabel CommonJS ini tidak tersedia di ES module; gunakan import.meta.filename dan import.meta.dirname. require.main dan module juga tidak ada di ESM. process.cwd() adalah folder tempat proses dijalankan, bukan folder file.",
  },
  {
    id: "0013-oral-1", lesson: "0013", topic: "tooling-interop-esm", type: "oral",
    prompt: "\"Apa beda CommonJS dan ES module di Node, dan bagaimana keduanya bisa saling memuat?\" (60 detik)",
    sample: "CommonJS memakai require dan module.exports, dimuat sinkron; ES module memakai import/export, standar JavaScript, dan mendukung top-level await. Node menentukan formatnya dari ekstensi dan field type: .mjs selalu ESM, .cjs selalu CommonJS, .js mengikuti \"type\" di package.json terdekat. Di ESM, ekstensi file wajib ditulis di import relatif, dan __dirname diganti import.meta.dirname. Dari ESM, import file CommonJS memberi module.exports sebagai default export. Dari CommonJS, dulu hanya bisa pakai import() yang asinkron; sejak Node 22.12 require(esm) aktif tanpa flag dan di Node 24 sudah stabil, asal modulnya tidak memakai top-level await. Kalau memakai, Node melempar ERR_REQUIRE_ASYNC_MODULE dan saya pakai import(). Untuk paket baru saya tulis \"type\" secara eksplisit.",
    checklist: [
      "require/module.exports vs import/export, CommonJS dimuat sinkron",
      "format ditentukan .mjs/.cjs dan field \"type\" di package.json terdekat",
      "ESM wajib ekstensi di import relatif, tanpa __dirname (pakai import.meta.dirname)",
      "import CommonJS dari ESM: module.exports menjadi default export",
      "require(esm) jalan tanpa flag sejak Node 22.12, kecuali modul dengan top-level await",
      "import() sebagai jalan dari CommonJS ke ESM asinkron",
    ],
  },
]);
