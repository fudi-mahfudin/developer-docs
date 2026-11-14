// Soal lesson 0016 (track Node.js, modul NestJS inti) · Kenapa NestJS; @Module dan feature module. Format: assets/README.md.
// Sumber: docs.nestjs.com (First steps, Modules, Custom providers).
QuestionBank.labelTopics({
  "nest-kenapa": "NestJS inti: kenapa NestJS (struktur, DI, platform)",
  "nest-module": "NestJS inti: @Module, export/import, feature dan global module",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban b d a c b.
QuestionBank.register([
  {
    id: "0016-01", lesson: "0016", topic: "nest-kenapa", type: "mc",
    prompt: "Apa hubungan NestJS dengan Express?",
    options: {
      a: "Nest menggantikan Express dengan server HTTP buatannya sendiri sepenuhnya",
      b: "Nest berjalan di atas Express secara default; Fastify opsional",
      c: "Nest hanya bisa dipakai bersama Fastify, tidak dengan Express",
      d: "Nest adalah plugin Express yang dipasang lewat app.use saja",
    },
    answer: "b",
    explain: "docs.nestjs.com (First steps): \"Nest is designed to be platform-agnostic\"; paket @nestjs/platform-express dipakai secara default, Fastify tersedia sebagai platform alternatif (NestJS 12 juga menambahkan @nestjs/platform-node).",
  },
  {
    id: "0016-02", lesson: "0016", topic: "nest-module", type: "mc",
    prompt: "<code>OrdersService</code> meng-inject <code>UsersService</code>, dan Nest gagal start: \"Nest can't resolve dependencies of the OrdersService\". <code>OrdersModule</code> sudah meng-import <code>UsersModule</code>. Apa yang paling mungkin terlupa?",
    options: {
      a: "UsersService belum diberi decorator @Global di class-nya",
      b: "UsersController belum didaftarkan di controllers milik OrdersModule",
      c: "AppModule belum mendaftarkan UsersService di daftar providers",
      d: "UsersModule belum mencantumkan UsersService di daftar exports",
    },
    answer: "d",
    explain: "docs.nestjs.com (Modules): exports adalah \"the subset of providers that this module provides and that should be available to other modules importing it\". Provider privat untuk module-nya sampai di-export; meng-import module saja tidak cukup.",
  },
  {
    id: "0016-03", lesson: "0016", topic: "nest-kenapa", type: "mc",
    prompt: "Manfaat utama dependency injection di Nest dibanding membuat dependency dengan <code>new</code> di dalam class?",
    options: {
      a: "Dependency mudah diganti mock saat test tanpa mengubah class",
      b: "Request HTTP selalu diproses lebih cepat oleh event loop",
      c: "Semua class otomatis menjadi request-scoped dan aman dari race",
      d: "TypeScript tidak perlu lagi dikompilasi sebelum aplikasi Node dijalankan",
    },
    answer: "a",
    explain: "docs.nestjs.com (Custom providers): instansiasi dependency diserahkan ke IoC container. Karena class hanya menyatakan kebutuhannya di constructor, test bisa menyuntikkan mock (useValue) di tempat implementasi asli.",
  },
  {
    id: "0016-04", lesson: "0016", topic: "nest-module", type: "mc",
    prompt: "<code>UsersService</code> didaftarkan di <code>providers</code> milik <code>UsersModule</code> <em>dan</em> di <code>providers</code> milik <code>OrdersModule</code>. Apa akibatnya?",
    options: {
      a: "Nest menolak start karena provider terdaftar dua kali",
      b: "Kedua module otomatis berbagi tepat satu instance UsersService",
      c: "Ada dua instance UsersService yang saling terpisah sepenuhnya",
      d: "UsersService otomatis berubah menjadi provider yang bersifat request-scoped",
    },
    answer: "c",
    explain: "docs.nestjs.com (Modules): mendaftarkan service di providers setiap module membuat instance terpisah; untuk berbagi satu instance, daftarkan di satu module, export, lalu import module itu. State di dalam service (cache, counter) jadi tidak konsisten kalau terduplikasi.",
  },
  {
    id: "0016-05", lesson: "0016", topic: "nest-module", type: "mc",
    prompt: "Kapan <code>@Global()</code> masuk akal?",
    options: {
      a: "Untuk setiap feature module supaya imports tidak perlu ditulis",
      b: "Untuk provider yang dipakai hampir di mana-mana, seperti config",
      c: "Untuk controller yang harus menerima request dari semua route",
      d: "Untuk module yang hanya dipakai oleh satu module lain",
    },
    answer: "b",
    explain: "docs.nestjs.com (Modules): global module untuk provider yang dibutuhkan di mana-mana, didaftarkan sekali oleh root module; \"Making everything global is not a recommended design practice\" karena dependency tidak lagi terlihat di imports.",
  },
  {
    id: "0016-oral-1", lesson: "0016", topic: "nest-kenapa", type: "oral",
    prompt: "\"Kenapa tim Anda memilih NestJS dan bukan Express saja? Lalu jelaskan bagaimana module di Nest berbagi service.\" (60 detik)",
    sample: "Express hanya memberi routing dan middleware; struktur dan cara service saling memanggil diserahkan ke tim. Nest menambahkan struktur seragam (module, controller, provider), dependency injection lewat IoC container sehingga dependency mudah diganti mock saat test, dan pipeline request yang jelas: guard, pipe, interceptor, filter. Di bawahnya tetap Express secara default, atau Fastify kalau butuh performa, tanpa mengubah controller. Biayanya boilerplate dan kurva belajar. Setiap module mendeklarasikan providers, controllers, imports, dan exports. Provider privat untuk module-nya; supaya module lain bisa memakai UsersService, UsersModule harus meng-export-nya dan module pemakai meng-import UsersModule. Module singleton, jadi semua pemakai mendapat instance yang sama. @Global hanya untuk hal seperti config atau database, karena dependency jadi tidak terlihat.",
    checklist: [
      "struktur seragam (module, controller, provider) sebagai alasan utama",
      "dependency injection / IoC container dan manfaatnya untuk test",
      "Nest berjalan di atas Express (default) atau Fastify, bukan menggantikannya",
      "empat properti @Module: imports, providers, controllers, exports",
      "provider harus di-export dan module-nya di-import supaya bisa di-inject di module lain",
      "@Global hanya untuk sedikit hal (config, database), bukan default",
    ],
  },
]);
