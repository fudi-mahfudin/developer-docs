// Soal lesson 0014 (track Node.js, modul Paket & tooling) · package.json, semver, lockfile, dan jenis dependency. Format: assets/README.md.
// Sumber: npm Docs (package.json, package-lock.json, npm ci, config save-prefix, about semantic versioning), node-semver README, semver.org, Node.js v24 docs (Packages).
QuestionBank.labelTopics({
  "tooling-semver-lockfile": "Paket & tooling: range semver ^ vs ~, lockfile, npm ci",
  "tooling-field-package": "Paket & tooling: field exports/main, jenis dependency",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban c a d b a.
QuestionBank.register([
  {
    id: "0014-01", lesson: "0014", topic: "tooling-semver-lockfile", type: "mc",
    prompt: "<code>package.json</code> berisi <code>\"express\": \"^4.18.2\"</code>. Versi mana yang <strong>tidak</strong> boleh dipasang oleh range ini?",
    options: {
      a: "4.18.3",
      b: "4.21.0",
      c: "5.0.0",
      d: "4.19.1",
    },
    answer: "c",
    explain: "node-semver: caret mengizinkan perubahan yang tidak mengubah elemen bukan-nol paling kiri. ^4.18.2 berarti >=4.18.2 <5.0.0-0, jadi minor dan patch baru boleh, major 5 tidak.",
  },
  {
    id: "0014-02", lesson: "0014", topic: "tooling-field-package", type: "mc",
    prompt: "Anda menulis library plugin untuk NestJS. Aplikasi pemakai sudah memasang <code>@nestjs/core</code> sendiri. Di field mana <code>@nestjs/core</code> sebaiknya dicantumkan?",
    options: {
      a: "peerDependencies, supaya memakai salinan milik aplikasi pemakai itu",
      b: "dependencies, supaya selalu terpasang salinan milik plugin sendiri",
      c: "devDependencies, karena hanya dibutuhkan saat plugin sedang diuji",
      d: "bundleDependencies, supaya ikut dikemas bersama tarball plugin itu",
    },
    answer: "a",
    explain: "npm docs (package.json): peerDependencies menyatakan kompatibilitas paket dengan paket host, mis. plugin dengan framework-nya. Sejak npm v7 peerDependencies dipasang secara default. Mencantumkannya di dependencies bisa menghasilkan dua salinan framework.",
  },
  {
    id: "0014-03", lesson: "0014", topic: "tooling-semver-lockfile", type: "mc",
    prompt: "Di pipeline CI, apa beda <code>npm ci</code> dengan <code>npm install</code>?",
    options: {
      a: "npm ci memperbarui lockfile ke versi terbaru dalam range",
      b: "npm ci melewati devDependencies supaya proses install lebih cepat",
      c: "npm ci memasang paket tanpa membaca package.json sama sekali",
      d: "npm ci wajib lockfile, gagal kalau beda, tidak menulisnya",
    },
    answer: "d",
    explain: "npm docs (npm ci): proyek wajib punya package-lock.json; kalau lockfile tidak cocok dengan package.json, npm ci keluar dengan error; node_modules lama dihapus dulu; dan npm ci tidak pernah menulis package.json atau lockfile.",
  },
  {
    id: "0014-04", lesson: "0014", topic: "tooling-field-package", type: "mc",
    prompt: "Paket Anda menambahkan field <code>\"exports\": { \".\": \"./lib/index.js\" }</code>. Pemakai lama menulis <code>require('pkg/lib/util.js')</code>. Apa yang terjadi?",
    options: {
      a: "Tetap jalan, karena exports hanya berlaku untuk import ESM",
      b: "Error ERR_PACKAGE_PATH_NOT_EXPORTED, karena path itu tidak ikut diekspor paket",
      c: "Tetap jalan, karena field main menunjuk ke folder lib",
      d: "Node memberi peringatan deprecation tetapi file tetap dimuat juga",
    },
    answer: "b",
    explain: "Node docs (Packages, Package entry points): \"exports\" mencegah entry point lain selain yang didefinisikan, termasuk lewat require. Path yang tidak diekspor melempar ERR_PACKAGE_PATH_NOT_EXPORTED. Karena itu menambah \"exports\" ke paket lama bisa menjadi breaking change. Kalau \"exports\" dan \"main\" ada, \"exports\" yang dipakai.",
  },
  {
    id: "0014-05", lesson: "0014", topic: "tooling-semver-lockfile", type: "mc",
    prompt: "Kenapa <code>package-lock.json</code> sebaiknya di-commit ke repository?",
    options: {
      a: "Supaya semua orang dan CI memasang pohon dependency persis sama",
      b: "Supaya npm bisa memeriksa kerentanan keamanan tanpa akses ke internet",
      c: "Supaya range ^ dan ~ di package.json tidak perlu ditulis",
      d: "Supaya ukuran folder node_modules menjadi lebih kecil di setiap mesin",
    },
    answer: "a",
    explain: "npm docs (package-lock.json): lockfile mendeskripsikan pohon persis yang dihasilkan, sehingga install berikutnya menghasilkan pohon identik terlepas dari update dependency di antaranya; rekan tim, deployment, dan CI dijamin memasang dependency yang persis sama.",
  },
  {
    id: "0014-oral-1", lesson: "0014", topic: "tooling-semver-lockfile", type: "oral",
    prompt: "\"Di package.json ada ^ dan ~. Apa artinya, kenapa build di CI bisa berbeda dengan laptop, dan bagaimana mencegahnya?\" (60 detik)",
    sample: "Versi mengikuti semver MAJOR.MINOR.PATCH: major untuk breaking change, minor untuk fitur yang kompatibel, patch untuk bug fix. Caret ^1.2.3 artinya >=1.2.3 <2.0.0, jadi minor dan patch baru boleh; tilde ~1.2.3 artinya >=1.2.3 <1.3.0, hanya patch. Untuk versi 0.x caret lebih ketat: ^0.2.3 berarti <0.3.0. npm install menyimpan dengan prefix ^ secara default. Karena range, dua kali install di waktu berbeda bisa memasang versi berbeda. Itulah gunanya package-lock.json: mencatat pohon persis yang terpasang, jadi harus di-commit. Di CI saya pakai npm ci: wajib ada lockfile, gagal kalau lockfile tidak cocok dengan package.json, menghapus node_modules lama, dan tidak menulis lockfile. Dependency yang hanya untuk test dan build saya taruh di devDependencies.",
    checklist: [
      "semver MAJOR.MINOR.PATCH dan arti masing-masing",
      "^ mengizinkan minor dan patch (batas major berikutnya); ~ hanya patch",
      "range membuat dua install bisa memasang versi berbeda",
      "package-lock.json mencatat pohon persis dan di-commit",
      "npm ci di CI: wajib lockfile, gagal kalau tidak cocok, tidak menulis lockfile",
      "menyebut kasus 0.x atau prefix default ^ dari npm install",
    ],
  },
]);
