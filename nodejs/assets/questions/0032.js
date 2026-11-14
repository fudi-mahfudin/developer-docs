// Soal lesson 0032 (track Node.js, modul Testing & produksi) · @nestjs/config + validasi env, Logger bawaan, structured logging, correlation id. Format: assets/README.md.
// Sumber: docs.nestjs.com/techniques/configuration, docs.nestjs.com/techniques/logger, docs.nestjs.com/migration-guide (NestJS 12), Node.js v24 API async_context (AsyncLocalStorage).
QuestionBank.labelTopics({
  "prod-config": "Testing & produksi: @nestjs/config dan validasi env",
  "prod-logging": "Testing & produksi: Logger, structured logging, correlation id",
});

QuestionBank.register([
  {
    id: "0032-01", lesson: "0032", topic: "prod-config", type: "mc",
    prompt: "<code>ConfigModule.forRoot({ validationSchema })</code> dipasang, dan <code>DATABASE_URL</code> wajib tapi tidak di-set. Apa yang terjadi?",
    options: {
      a: "Aplikasi gagal bootstrap dengan error validasi saat start",
      b: "Aplikasi tetap jalan; ConfigService.get mengembalikan sebuah string kosong",
      c: "Aplikasi jalan sampai query pertama gagal terhubung database",
      d: "Nilainya diambil otomatis dari .env.example di root proyek",
    },
    answer: "a",
    explain: "Validasi env berjalan saat bootstrap: kalau variabel wajib tidak ada, validasi melempar exception dan aplikasi tidak start. Itulah tujuannya, gagal cepat saat deploy, bukan saat request pertama menyentuh database.",
  },
  {
    id: "0032-02", lesson: "0032", topic: "prod-logging", type: "mc",
    prompt: "Kenapa log produksi sebaiknya <em>structured</em> (JSON), bukan kalimat bebas?",
    options: {
      a: "JSON membuat ukuran log jauh lebih kecil daripada teks biasa",
      b: "Field seperti level, context, dan requestId bisa difilter oleh mesin",
      c: "Node.js menolak menulis teks biasa ke stdout di mode production",
      d: "Logger bawaan NestJS tidak bisa menulis log dalam bentuk teks",
    },
    answer: "b",
    explain: "Structured logging menulis setiap entri sebagai objek dengan field tetap, sehingga sistem log (Loki, Elasticsearch, CloudWatch) bisa mencari \"semua error dengan requestId=abc\" tanpa regex. ConsoleLogger NestJS punya mode json: true; library seperti Pino menulis JSON secara default.",
  },
  {
    id: "0032-03", lesson: "0032", topic: "prod-config", type: "mc",
    prompt: "<code>PORT=8080</code> di-set di environment proses, dan <code>.env</code> berisi <code>PORT=3000</code>. Nilai mana yang dibaca <code>ConfigService</code> secara default?",
    options: {
      a: "3000, karena file .env selalu menang atas environment",
      b: "Keduanya digabung menjadi array berisi dua nilai port",
      c: "Error saat bootstrap karena ada nilai yang bertabrakan",
      d: "8080, karena variabel environment runtime selalu lebih diutamakan",
    },
    answer: "d",
    explain: "Dokumentasi @nestjs/config: secara default variabel environment runtime didahulukan atas file .env. Set option override: true kalau .env yang harus menang. Ini cocok dengan cara deploy: platform menyuntikkan env, .env hanya untuk lokal.",
  },
  {
    id: "0032-04", lesson: "0032", topic: "prod-logging", type: "mc",
    prompt: "Bagaimana setiap baris log selama satu request bisa membawa <em>correlation id</em> yang sama tanpa meneruskannya sebagai parameter ke semua fungsi?",
    options: {
      a: "Simpan id di variabel global yang ditimpa tiap request",
      b: "Jadikan semua service REQUEST-scoped lalu suntikkan id-nya ke constructor",
      c: "Middleware menyimpan id di AsyncLocalStorage; logger membacanya dari store",
      d: "Cetak id di awal request lalu cocokkan berdasarkan waktu",
    },
    answer: "c",
    explain: "AsyncLocalStorage (node:async_hooks) menyimpan data yang ikut sepanjang rantai async satu request. Middleware membaca header X-Request-Id (atau membuat UUID), menjalankan sisa request di dalam als.run(), dan logger mengambil id dari store. Variabel global bocor antar request yang berjalan bersamaan; REQUEST scope mahal karena merambat ke seluruh rantai dependency.",
  },
  {
    id: "0032-05", lesson: "0032", topic: "prod-config", type: "mc",
    prompt: "Label versi NestJS 12: apa yang berubah pada <code>validationSchema</code> di <code>@nestjs/config</code>?",
    options: {
      a: "Menerima Standard Schema seperti Zod; Joi butuh v18",
      b: "validationSchema dihapus dan diganti decorator di setiap field",
      c: "Hanya Joi yang didukung, dan Zod ditolak sepenuhnya",
      d: "Validasi env dipindah ke ValidationPipe pada setiap request",
    },
    answer: "a",
    explain: "Migration guide NestJS 12: @nestjs/config pindah dari validasi khusus Joi ke Standard Schema, sehingga Zod, Valibot, atau ArkType bisa dipakai di validationSchema. Joi tetap jalan asalkan v18 ke atas; opsi khusus library dipindah ke validationOptions.libraryOptions.",
  },
  {
    id: "0032-06", lesson: "0032", topic: "prod-logging", type: "mc",
    prompt: "Di NestJS 12, <code>this.logger.log('Order dibuat', { orderId: 42 })</code> dengan <code>ConsoleLogger</code> bawaan menghasilkan apa?",
    options: {
      a: "Dua baris log: pesan teks, objek sebagai context",
      b: "Error, karena Logger hanya menerima argumen string saja",
      c: "Objek diabaikan diam-diam dan hanya pesan yang ditulis",
      d: "Satu entri log; objek dilampirkan sebagai structured params",
    },
    answer: "d",
    explain: "Sejak NestJS 12, objek biasa yang dikirim setelah pesan diperlakukan sebagai structured params dan dilampirkan ke entri log yang sama (di mode JSON di bawah key params). Perilaku lama bisa dikembalikan dengan structuredParams: false.",
  },
  {
    id: "0032-oral-1", lesson: "0032", topic: "prod-logging", type: "oral",
    prompt: "\"Aplikasi NestJS Anda akan jalan di staging dan production. Bagaimana Anda mengelola konfigurasinya, dan bagaimana log-nya supaya satu request bisa ditelusuri?\" (60 detik)",
    sample: "\"Konfigurasi dari environment variable, dibaca lewat @nestjs/config: ConfigModule.forRoot dengan isGlobal dan validationSchema, misalnya skema Zod. Kalau variabel wajib seperti DATABASE_URL tidak ada atau salah format, aplikasi gagal saat bootstrap, bukan saat request pertama. Env runtime menang atas .env, jadi .env hanya untuk lokal, dan secret tidak di-commit. Di kode saya pakai ConfigService.getOrThrow, bukan process.env tersebar. Untuk log, setiap class punya new Logger(NamaClass.name), di production keluarannya JSON, lewat ConsoleLogger json: true atau Pino. Setiap request diberi correlation id: middleware mengambil header X-Request-Id atau membuat UUID, menyimpannya di AsyncLocalStorage, dan logger menambahkannya ke setiap entri, lalu id itu juga dikirim balik di response header. Dengan begitu satu request bisa difilter dari ribuan baris log.\"",
    checklist: [
      "ConfigModule.forRoot dengan validationSchema (mis. Zod), isGlobal",
      "gagal cepat saat bootstrap kalau env wajib hilang atau salah",
      "env runtime menang atas .env; secret tidak di-commit; ConfigService bukan process.env tersebar",
      "Logger per class dengan context (new Logger(X.name))",
      "structured logging JSON di production (ConsoleLogger json atau Pino)",
      "correlation id dari header/UUID, disimpan di AsyncLocalStorage, ikut di setiap log",
    ],
  },
]);
