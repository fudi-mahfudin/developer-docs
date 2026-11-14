// Soal lesson 0015 (track Node.js, modul Paket & tooling) · TypeScript di Node, env var, dan config per environment. Format: assets/README.md.
// Sumber: Node.js v24 docs (Modules: TypeScript, CLI --env-file, process.env, process.loadEnvFile), TypeScript Modules Reference, NestJS docs (SWC recipe).
QuestionBank.labelTopics({
  "tooling-typescript-node": "Paket & tooling: TypeScript di Node, tsc vs type stripping, module nodenext",
  "tooling-env-config": "Paket & tooling: env var, --env-file, config per environment",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban a c b d c.
QuestionBank.register([
  {
    id: "0015-01", lesson: "0015", topic: "tooling-typescript-node", type: "mc",
    prompt: "Di Node 24, <code>node service.ts</code> berisi <code>enum Role { Admin, User }</code>. Apa yang terjadi tanpa flag tambahan?",
    options: {
      a: "Error, karena enum butuh transformasi kode, bukan sekadar stripping",
      b: "Berjalan normal, karena Node membaca tsconfig.json lalu langsung mengompilasinya",
      c: "Berjalan normal, karena enum dihapus seperti anotasi tipe lainnya",
      d: "Node memeriksa tipe dulu, lalu menjalankannya kalau tidak error",
    },
    answer: "a",
    explain: "Node docs (Modules: TypeScript): type stripping hanya mengganti sintaks tipe dengan spasi. Fitur yang butuh pembuatan kode JavaScript, seperti enum, namespace dengan kode runtime, dan parameter properties, error kecuali memakai --experimental-transform-types. Node tidak membaca tsconfig.json dan tidak memeriksa tipe.",
  },
  {
    id: "0015-02", lesson: "0015", topic: "tooling-env-config", type: "mc",
    prompt: "Shell sudah berisi <code>PORT=8080</code>, lalu Anda menjalankan <code>node --env-file=.env app.js</code> dengan <code>.env</code> berisi <code>PORT=3000</code>. Nilai <code>process.env.PORT</code>?",
    options: {
      a: "\"3000\", karena isi file .env selalu menimpa environment",
      b: "3000 sebagai number, karena --env-file mengonversi angka otomatis",
      c: "\"8080\", karena variabel dari environment shell lebih diutamakan",
      d: "undefined, karena nilai yang bentrok akan dihapus dua-duanya",
    },
    answer: "c",
    explain: "Node docs (CLI, --env-file): kalau variabel yang sama ada di environment dan di file, nilai dari environment yang dipakai. Nilai process.env selalu string. --env-file tersedia sejak Node 20.6 dan tidak lagi experimental sejak 24.10.",
  },
  {
    id: "0015-03", lesson: "0015", topic: "tooling-typescript-node", type: "mc",
    prompt: "Kenapa aplikasi NestJS tetap butuh langkah build (<code>tsc</code> atau SWC) dan tidak cukup dijalankan dengan type stripping Node?",
    options: {
      a: "Type stripping hanya jalan untuk file di dalam node_modules",
      b: "Node tidak mendukung decorator, jadi parser error saat membacanya",
      c: "Type stripping hanya tersedia di Node 18 ke bawah",
      d: "NestJS melarang file berekstensi .ts dijalankan langsung oleh Node",
    },
    answer: "b",
    explain: "Node docs (Modules: TypeScript): decorator masih proposal TC39 Stage 3, tidak ditransformasi, dan menghasilkan parser error. NestJS bergantung pada decorator (@Module, @Injectable, @Controller), jadi kodenya dikompilasi dulu dengan tsc atau SWC (nest build). Node juga menolak type stripping untuk file di node_modules.",
  },
  {
    id: "0015-04", lesson: "0015", topic: "tooling-env-config", type: "mc",
    prompt: "Kode memakai <code>if (process.env.FEATURE_X)</code>, dan env berisi <code>FEATURE_X=false</code>. Fitur tetap aktif. Kenapa?",
    options: {
      a: "Node membaca semua variabel env sebagai true secara default",
      b: "Variabel env baru terbaca setelah Node di-restart dua kali",
      c: "Nama variabel env harus diawali NODE_ supaya bisa terbaca",
      d: "Nilai env selalu string, dan string \"false\" bernilai truthy",
    },
    answer: "d",
    explain: "Node docs (process.env): process.env berisi string; bahkan assignment non-string dikonversi menjadi string (perilaku deprecated). String tidak kosong seperti \"false\" bernilai truthy. Parse dan validasi env sekali di satu modul config, mis. FEATURE_X === \"true\".",
  },
  {
    id: "0015-05", lesson: "0015", topic: "tooling-typescript-node", type: "mc",
    prompt: "tsconfig memakai <code>\"module\": \"nodenext\"</code>, dan <code>package.json</code> berisi <code>\"type\": \"module\"</code>. Import relatif mana yang benar di <code>src/app.ts</code>?",
    options: {
      a: "import { db } from './db'",
      b: "import { db } from './db.ts.map'",
      c: "import { db } from './db.js'",
      d: "import { db } from 'db/index'",
    },
    answer: "c",
    explain: "TypeScript Modules Reference: dengan module nodenext, file .ts menjadi ESM kalau package.json terdekat berisi \"type\": \"module\", dan import relatif di ESM wajib berekstensi, sama seperti di Node. Tulis './db.js'; TypeScript memetakannya ke db.ts saat type-check.",
  },
  {
    id: "0015-oral-1", lesson: "0015", topic: "tooling-env-config", type: "oral",
    prompt: "Tulis kode: modul <code>config.ts</code> yang membaca <code>PORT</code> (default 3000) dan <code>DATABASE_URL</code> (wajib) dari env, mengubah PORT menjadi number, dan menghentikan aplikasi saat start kalau config tidak valid. Jelaskan juga cara memuat file <code>.env</code> di Node 24. (tulis di kertas, 3 menit)",
    sample: "<pre><code>// config.ts\nfunction required(name: string): string {\n  const v = process.env[name];\n  if (!v) throw new Error(`Env ${name} wajib diisi`);\n  return v;\n}\nconst port = Number(process.env.PORT ?? 3000);\nif (!Number.isInteger(port)) throw new Error('PORT harus angka');\n\nexport const config = Object.freeze({\n  port,\n  databaseUrl: required('DATABASE_URL'),\n  isProd: process.env.NODE_ENV === 'production',\n});</code></pre><p>Modul ini dimuat sekali saat start; kalau throw, aplikasi gagal start (fail fast), bukan error di tengah request. File .env dimuat dengan <code>node --env-file=.env dist/main.js</code> (Node ≥ 20.6, stabil sejak 24.10); variabel yang sudah ada di environment menang. Di produksi nilai datang dari environment server, bukan file .env yang di-commit.</p>",
    checklist: [
      "membaca dari process.env di satu modul config, bukan tersebar di kode",
      "PORT diubah ke number dan divalidasi (nilai env selalu string)",
      "DATABASE_URL wajib: throw kalau kosong",
      "validasi terjadi saat start (fail fast), bukan saat request",
      "menyebut --env-file (atau process.loadEnvFile) untuk memuat .env",
      "environment mengalahkan file .env; secret produksi tidak di-commit",
    ],
  },
]);
