// Soal lesson 0031 (track Node.js, modul Testing & produksi) · E2E test dengan supertest, database untuk test, jenis test. Format: assets/README.md.
// Sumber: docs.nestjs.com/fundamentals/testing (end-to-end testing), README supertest (github.com/ladjs/supertest), Prisma docs integration testing.
QuestionBank.labelTopics({
  "prod-e2e": "Testing & produksi: e2e test dengan supertest dan app.init()",
  "prod-jenis-test": "Testing & produksi: unit vs integration vs e2e, database untuk test",
});

QuestionBank.register([
  {
    id: "0031-01", lesson: "0031", topic: "prod-e2e", type: "mc",
    prompt: "Di e2e test, setelah <code>compile()</code>, langkah apa yang dibutuhkan sebelum <code>request(app.getHttpServer())</code>?",
    options: {
      a: "Memanggil app.listen(3000) supaya supertest bisa menemukan port aplikasi itu",
      b: "Tidak ada; TestingModule hasil compile() sudah punya HTTP server",
      c: "Menjalankan main.ts di proses terpisah lalu menunggu sampai siap",
      d: "moduleRef.createNestApplication() lalu await app.init() untuk menyiapkan seluruh aplikasi itu",
    },
    answer: "d",
    explain: "compile() saja tidak membuat HTTP adapter. createNestApplication() membuat aplikasi, app.init() menjalankan inisialisasi (module, lifecycle hook, route), lalu supertest menerima app.getHttpServer(). listen() tidak perlu: kalau server belum listen, supertest mengikatnya ke port ephemeral sendiri.",
  },
  {
    id: "0031-02", lesson: "0031", topic: "prod-jenis-test", type: "mc",
    prompt: "Bug: query Prisma memakai nama kolom yang salah, sehingga gagal di database. Test mana yang bisa menangkapnya?",
    options: {
      a: "Unit test service dengan PrismaService yang di-mock jest.fn",
      b: "Integration atau e2e test terhadap database test sungguhan",
      c: "Unit test controller dengan service yang di-mock seluruhnya",
      d: "Snapshot test terhadap DTO yang dikirim oleh client",
    },
    answer: "b",
    explain: "Mock hanya mengembalikan apa yang Anda atur, jadi query yang salah tetap lulus di unit test. Hanya test yang benar-benar mengirim query ke database (integration atau e2e dengan database test) yang membuktikan query itu valid.",
  },
  {
    id: "0031-03", lesson: "0031", topic: "prod-e2e", type: "mc",
    prompt: "<code>main.ts</code> memanggil <code>app.useGlobalPipes(new ValidationPipe())</code>. Di e2e test, body yang tidak valid malah diterima 201. Kenapa?",
    options: {
      a: "Konfigurasi di main.ts tidak dijalankan test; daftarkan pipe global itu juga",
      b: "ValidationPipe memang tidak pernah bekerja jika aplikasi dijalankan oleh library supertest",
      c: "Supertest selalu mengirim body sebagai teks biasa, bukan sebagai objek JSON",
      d: "E2E test selalu melewati semua pipe supaya proses test lebih cepat",
    },
    answer: "a",
    explain: "E2E test membuat aplikasi dari TestingModule, bukan dari main.ts. Apa pun yang dipasang di bootstrap (global pipe, prefix, filter) harus dipasang juga di test, atau dipindah ke module lewat provider APP_PIPE supaya ikut terbawa.",
  },
  {
    id: "0031-04", lesson: "0031", topic: "prod-jenis-test", type: "mc",
    prompt: "Di mana e2e test dijalankan terhadap database, menurut panduan integration testing Prisma?",
    options: {
      a: "Database production, supaya datanya paling mirip dengan kenyataan",
      b: "Database development milik developer yang sedang aktif bekerja",
      c: "Database khusus test, Postgres di Docker, datanya dibersihkan",
      d: "Tidak ada database; semua query diganti mock jest.fn",
    },
    answer: "c",
    explain: "Panduan Prisma menjalankan integration test terhadap database di lingkungan test tersendiri (Postgres lewat Docker Compose), terpisah dari production dan development. Data diisi sebelum test dan dihapus sesudahnya (deleteMany atau TRUNCATE) supaya test tidak saling bergantung.",
  },
  {
    id: "0031-05", lesson: "0031", topic: "prod-e2e", type: "mc",
    prompt: "Kenapa e2e test memanggil <code>await app.close()</code> di <code>afterAll</code>?",
    options: {
      a: "Supaya hasil test tersimpan ke file laporan di folder coverage",
      b: "Karena supertest menolak request kedua tanpa close di antara keduanya",
      c: "Supaya ValidationPipe di-reset ulang sebelum test berikutnya nanti mulai berjalan",
      d: "Menutup koneksi dan menjalankan shutdown hook, supaya Jest bisa selesai",
    },
    answer: "d",
    explain: "app.close() memicu onModuleDestroy dan hook shutdown lain, misalnya PrismaService memutus koneksi database. Tanpa itu, handle yang masih terbuka membuat proses test menggantung atau Jest memperingatkan open handles.",
  },
  {
    id: "0031-oral-1", lesson: "0031", topic: "prod-jenis-test", type: "oral",
    prompt: "\"Bagaimana Anda membagi test di aplikasi NestJS: apa yang diuji unit test, integration test, dan e2e test, dan bagaimana menangani database?\" (60 detik)",
    sample: "\"Unit test menguji satu class, biasanya service, dengan dependency di-mock lewat Test.createTestingModule dan useValue. Cepat dan banyak, tapi tidak membuktikan query benar. Integration test memasang beberapa bagian sungguhan, misalnya service dengan PrismaService ke database test. E2E test menyalakan aplikasi utuh dengan createNestApplication dan app.init, lalu mengirim request HTTP lewat supertest ke app.getHttpServer, dan memeriksa status serta body. Database-nya database khusus test, misalnya Postgres di Docker, dengan migrasi dijalankan dulu dan data dibersihkan antar suite supaya test tidak saling bergantung. Global pipe dan konfigurasi dari main.ts dipasang ulang di test, dan app.close di afterAll. Porsinya: banyak unit test, sedikit e2e untuk alur kritis.\"",
    checklist: [
      "unit test: satu class, dependency di-mock, cepat, tidak membuktikan query",
      "integration test: beberapa komponen sungguhan, misalnya ke database test",
      "e2e: createNestApplication + app.init(), request via supertest ke getHttpServer()",
      "database khusus test (bukan production/dev), migrasi dulu, data dibersihkan",
      "konfigurasi main.ts (global pipe) dipasang ulang di test, app.close() di afterAll",
      "porsi: banyak unit, sedikit e2e untuk alur kritis",
    ],
  },
]);
