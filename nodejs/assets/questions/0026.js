// Soal lesson 0026 (track Node.js, modul Data & auth) · Transaksi, migrasi, dan perbandingan TypeORM. Format: assets/README.md.
// Sumber: https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions
// https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production · https://docs.nestjs.com/data/typeorm
QuestionBank.labelTopics({
  "data-transaksi": "Data & auth: $transaction array vs interactive",
  "data-migrasi": "Data & auth: prisma migrate dev vs deploy",
  "data-typeorm": "Data & auth: TypeORM (@Entity, Repository, @InjectRepository)",
});

QuestionBank.register([
  {
    id: "0026-01", lesson: "0026", topic: "data-transaksi", type: "mc",
    prompt: "Transfer saldo: cek saldo pengirim, tolak kalau kurang, baru kredit penerima. Kenapa bentuk array <code>$transaction([...])</code> tidak cocok?",
    options: {
      a: "Bentuk array tidak menjamin rollback saat gagal",
      b: "Bentuk array selalu berjalan paralel tanpa urutan",
      c: "Hasil satu query tidak bisa dipakai berikutnya",
      d: "Bentuk array hanya mendukung query baca saja",
    },
    answer: "c",
    explain: "Bentuk array menjalankan query sesuai urutan dan me-rollback semuanya kalau satu gagal, tetapi tidak bisa meneruskan hasil (mis. saldo atau ID) ke query berikutnya. Untuk logika \"cek dulu, lalu putuskan\", pakai interactive transaction <code>$transaction(async (tx) =&gt; ...)</code>.",
  },
  {
    id: "0026-02", lesson: "0026", topic: "data-transaksi", type: "mc",
    prompt: "Di dalam <code>$transaction(async (tx) =&gt; { ... })</code>, developer menulis <code>this.prisma.order.create(...)</code> alih-alih <code>tx.order.create(...)</code>, lalu langkah berikutnya melempar error. Apa yang terjadi pada order itu?",
    options: {
      a: "Order ditulis di luar transaksi, tidak ikut rollback",
      b: "Prisma otomatis memindahkan query itu ke dalam tx",
      c: "Query ditolak karena PrismaService sedang terkunci oleh transaksi",
      d: "Tidak ada bedanya, keduanya memakai koneksi yang sama",
    },
    answer: "a",
    explain: "Hanya query lewat <code>tx</code> yang menjadi bagian transaksi. <code>this.prisma</code> berjalan di luar transaksi, sehingga order tetap tersimpan walaupun langkah lain di-rollback: persis inkonsistensi yang ingin dicegah.",
  },
  {
    id: "0026-03", lesson: "0026", topic: "data-migrasi", type: "mc",
    prompt: "Pipeline CI/CD menerapkan migrasi ke database produksi. Perintah Prisma mana yang tepat?",
    options: {
      a: "prisma migrate dev, karena membuat migrasi baru",
      b: "prisma db push, karena paling cepat sinkron",
      c: "prisma migrate reset, agar database selalu bersih",
      d: "prisma migrate deploy, hanya menerapkan migrasi pending",
    },
    answer: "d",
    explain: "<code>prisma migrate deploy</code> menerapkan migrasi yang pending, tidak me-reset database, dan tidak memakai shadow database. Dokumentasi Prisma menyarankan menjalankannya dari pipeline CI/CD. <code>migrate dev</code> dan <code>migrate reset</code> untuk development.",
  },
  {
    id: "0026-04", lesson: "0026", topic: "data-migrasi", type: "mc",
    prompt: "Kenapa <code>prisma migrate dev</code> tidak boleh diarahkan ke database produksi?",
    options: {
      a: "Karena migrate dev tidak bisa membaca schema.prisma",
      b: "Bisa menawarkan reset database saat mendeteksi drift",
      c: "Karena migrate dev hanya mendukung database SQLite",
      d: "Karena migrate dev tidak membuat file migrasi",
    },
    answer: "b",
    explain: "<code>migrate dev</code> memutar ulang history di shadow database untuk mendeteksi drift, dan pada drift atau konflik history ia meminta reset database. Di development itu wajar; di produksi artinya kehilangan data. Ia juga yang membuat file migrasi baru, jadi opsi d terbalik.",
  },
  {
    id: "0026-05", lesson: "0026", topic: "data-typeorm", type: "mc",
    prompt: "Di codebase NestJS yang memakai TypeORM, bagaimana <code>UsersService</code> biasanya mendapat akses ke data user?",
    options: {
      a: "<code>@InjectRepository(User)</code> memberi <code>Repository&lt;User&gt;</code> lewat constructor",
      b: "Inject PrismaService lalu panggil findMany()",
      c: "DataSource baru dibuat per method",
      d: "Method statis User.find() tanpa injeksi",
    },
    answer: "a",
    explain: "Module mendaftarkan entity lewat <code>TypeOrmModule.forFeature([User])</code>, lalu service menerima <code>@InjectRepository(User) private usersRepository: Repository&lt;User&gt;</code>. Setara dengan meng-inject <code>PrismaService</code> di Prisma.",
  },
  {
    id: "0026-06", lesson: "0026", topic: "data-typeorm", type: "mc",
    prompt: "Apa risiko mengaktifkan <code>synchronize: true</code> di konfigurasi TypeORM pada produksi?",
    options: {
      a: "Aplikasi start lebih lambat, tidak ada risiko lain",
      b: "File migrasi di repository git ikut terhapus otomatis",
      c: "Schema disamakan otomatis saat start, data bisa hilang",
      d: "Repository tidak bisa lagi di-inject ke dalam service",
    },
    answer: "c",
    explain: "<code>synchronize</code> menyamakan schema database dengan entity setiap aplikasi start. Dokumentasi Nest: \"Don't use synchronize: true in production; otherwise, you can lose production data.\" Di produksi, perubahan schema lewat migrasi.",
  },
  {
    id: "0026-oral-1", lesson: "0026", topic: "data-transaksi", type: "oral",
    prompt: "Tulis kode (di kertas, 5 menit): <code>OrdersService.checkout(userId, productId)</code> dengan Prisma: kurangi stok produk satu, tolak kalau stok habis, lalu buat order. Keduanya harus berhasil bersama atau batal bersama.",
    sample: "<pre><code>checkout(userId: number, productId: number) {\n  return this.prisma.$transaction(async (tx) =&gt; {\n    const product = await tx.product.update({\n      where: { id: productId }, data: { stock: { decrement: 1 } },\n    });\n    if (product.stock &lt; 0) throw new ConflictException('Stok habis');\n    return tx.order.create({ data: { userId, productId } });\n  });\n}</code></pre><p>Interactive transaction karena langkah kedua bergantung pada hasil cek stok; error di dalam fungsi membuat Prisma me-rollback decrement.</p>",
    checklist: [
      "memakai $transaction(async (tx) => ...) (interactive), bukan dua query terpisah",
      "semua query lewat tx, bukan this.prisma",
      "mengecek stok dan melempar error kalau habis",
      "menyebut bahwa error di dalam fungsi membuat transaksi di-rollback",
      "menjelaskan kenapa bukan bentuk array (hasil cek dipakai untuk memutuskan langkah berikutnya)",
      "menjaga transaksi singkat (tanpa panggilan jaringan di dalamnya)",
    ],
  },
]);
