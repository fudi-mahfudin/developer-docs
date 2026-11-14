// Soal lesson 0025 (track Node.js, modul Data & auth) · Prisma dan PrismaService. Format: assets/README.md.
// Sumber: https://docs.nestjs.com/recipes/prisma · https://www.prisma.io/docs/orm/v7/prisma-client/queries/select-fields
// https://www.prisma.io/docs/orm/v7/prisma-client/queries/advanced/query-optimization-performance
QuestionBank.labelTopics({
  "data-prisma-service": "Data & auth: schema.prisma, Prisma Client, pola PrismaService",
  "data-query-n1": "Data & auth: select vs include, masalah N+1",
});

QuestionBank.register([
  {
    id: "0025-01", lesson: "0025", topic: "data-prisma-service", type: "mc",
    prompt: "Kenapa client Prisma di NestJS dibungkus sebagai <code>PrismaService</code> (provider yang <code>extends PrismaClient</code>), bukan <code>new PrismaClient()</code> di setiap service?",
    options: {
      a: "Agar query berjalan di worker thread",
      b: "Satu instance singleton, bisa diganti mock",
      c: "Agar schema.prisma tidak perlu di-generate lagi",
      d: "Karena PrismaClient tidak bisa diimpor langsung",
    },
    answer: "b",
    explain: "Sebagai provider default, <code>PrismaService</code> singleton: seluruh aplikasi berbagi satu client dan satu pool koneksi. Karena di-inject lewat constructor, test bisa menggantinya dengan mock. <code>new PrismaClient()</code> per service membuka pool sendiri-sendiri dan tidak bisa diganti lewat DI.",
  },
  {
    id: "0025-02", lesson: "0025", topic: "data-prisma-service", type: "mc",
    prompt: "Pada pola <code>PrismaService</code> di dokumentasi NestJS, di mana <code>$connect()</code> dipanggil?",
    options: {
      a: "Di setiap method service sebelum query",
      b: "Di constructor controller yang memakai service",
      c: "Di main.ts tepat sebelum NestFactory.create() dipanggil",
      d: "Di lifecycle hook onModuleInit milik PrismaService",
    },
    answer: "d",
    explain: "Dokumentasi NestJS: <code>async onModuleInit() { await this.$connect(); }</code>, dan pasangannya <code>onModuleDestroy()</code> memanggil <code>$disconnect()</code>. Supaya hook destroy juga jalan saat <code>SIGTERM</code>, aktifkan <code>app.enableShutdownHooks()</code>.",
  },
  {
    id: "0025-03", lesson: "0025", topic: "data-query-n1", type: "mc",
    prompt: "Ada 100 user. Kode: <code>const users = await prisma.user.findMany();</code> lalu <code>for</code> setiap user memanggil <code>prisma.post.findMany({ where: { authorId: u.id } })</code>. Berapa query ke database?",
    options: {
      a: "101 query: satu daftar, seratus per user",
      b: "2 query: Prisma menggabungkan loop secara otomatis",
      c: "1 query: findMany selalu memakai JOIN otomatis",
      d: "100 query: daftar user tidak dihitung terpisah",
    },
    answer: "a",
    explain: "Itulah N+1: 1 query untuk daftar, lalu satu query tambahan per hasil. Prisma tidak menggabungkan loop <code>findMany</code> (dataloader-nya hanya mem-batch <code>findUnique</code>). Perbaikannya <code>include: { posts: true }</code> (dua query) atau filter <code>in</code>.",
  },
  {
    id: "0025-04", lesson: "0025", topic: "data-query-n1", type: "mc",
    prompt: "<code>GET /users</code> saat ini mengembalikan semua kolom user, termasuk <code>passwordHash</code>. Opsi query Prisma mana yang membuat hanya id, email, dan nama yang diambil?",
    options: {
      a: "include untuk relasi, kolom skalar tetap lengkap",
      b: "Hapus kolom passwordHash dari hasil di controller",
      c: "select dengan id, email, dan name saja",
      d: "queryRaw dengan SQL manual untuk semua kolom",
    },
    answer: "c",
    explain: "Tanpa opsi, Prisma mengembalikan semua kolom skalar. <code>select</code> membatasi hasil ke field yang disebut, jadi kolom sensitif tidak pernah keluar dari database. <code>include</code> justru menambah relasi tanpa menyaring kolom skalar; menghapus di controller mudah terlupa di endpoint lain.",
  },
  {
    id: "0025-oral-1", lesson: "0025", topic: "data-prisma-service", type: "oral",
    prompt: "Tulis kode (di kertas, 5 menit): <code>PrismaService</code> untuk NestJS, lalu <code>PostsService.listWithAuthor()</code> yang mengembalikan semua post beserta nama penulisnya tanpa query N+1 dan tanpa membocorkan kolom lain milik user.",
    sample: "<pre><code>@Injectable()\nexport class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {\n  constructor() {\n    super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });\n  }\n  async onModuleInit() { await this.$connect(); }\n  async onModuleDestroy() { await this.$disconnect(); }\n}\n\n@Injectable()\nexport class PostsService {\n  constructor(private readonly prisma: PrismaService) {}\n\n  listWithAuthor() {\n    return this.prisma.post.findMany({\n      select: { id: true, title: true, author: { select: { name: true } } },\n    });\n  }\n}</code></pre>",
    checklist: [
      "PrismaService extends PrismaClient dengan @Injectable()",
      "$connect() di onModuleInit (idealnya $disconnect() di onModuleDestroy)",
      "PrismaService di-inject lewat constructor service, bukan new PrismaClient()",
      "relasi author diambil dalam satu panggilan (include atau nested select), bukan loop per post",
      "field user dibatasi dengan select sehingga kolom lain (mis. hash password) tidak ikut",
      "PrismaService didaftarkan dan di-exports dari sebuah module",
    ],
  },
]);
