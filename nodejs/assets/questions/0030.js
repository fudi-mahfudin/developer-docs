// Soal lesson 0030 (track Node.js, modul Testing & produksi) · Unit test NestJS dengan Jest, mock PrismaService. Format: assets/README.md.
// Sumber: docs.nestjs.com/fundamentals/testing, docs.nestjs.com/migration-guide (NestJS 12), jestjs.io/docs/mock-function-api, Prisma docs unit testing.
QuestionBank.labelTopics({
  "prod-unit-test": "Testing & produksi: Test.createTestingModule dan overrideProvider",
  "prod-mock": "Testing & produksi: jest.fn dan mock PrismaService",
});

QuestionBank.register([
  {
    id: "0030-01", lesson: "0030", topic: "prod-unit-test", type: "mc",
    prompt: "Apa yang dikembalikan <code>Test.createTestingModule({...}).compile()</code>, dan bagaimana memakainya?",
    options: {
      a: "Sebuah HTTP server yang langsung listen di port acak",
      b: "Objek konfigurasi biasa yang belum punya provider apa pun",
      c: "Promise berisi TestingModule; di-await, lalu ambil provider dengan get()",
      d: "Instance service final yang sudah di-mock oleh Jest otomatis",
    },
    answer: "c",
    explain: "createTestingModule menerima metadata yang sama dengan @Module() dan mengembalikan TestingModuleBuilder. compile() asinkron dan menghasilkan TestingModule, jadi harus di-await. Provider statis diambil dengan moduleRef.get(); provider REQUEST/TRANSIENT dengan resolve(). compile() saja tidak membuat HTTP adapter.",
  },
  {
    id: "0030-02", lesson: "0030", topic: "prod-mock", type: "mc",
    prompt: "Method service memanggil <code>await this.prisma.user.findUnique(...)</code>. Bagaimana mock-nya dibuat supaya await menghasilkan <code>null</code>?",
    options: {
      a: "<code>findUnique: jest.fn().mockResolvedValue(null)</code>",
      b: "<code>findUnique: jest.fn().mockReturnValue(undefined)</code>",
      c: "<code>findUnique: jest.fn().mockRejectedValue(null)</code>",
      d: "<code>findUnique: jest.spyOn(PrismaClient).mockClear()</code>",
    },
    answer: "a",
    explain: "mockResolvedValue(value) adalah singkatan dari mockImplementation(() => Promise.resolve(value)), cocok untuk method async seperti query Prisma. mockRejectedValue membuat Promise yang reject (untuk menguji jalur error); mockReturnValue mengembalikan nilai biasa, bukan Promise.",
  },
  {
    id: "0030-03", lesson: "0030", topic: "prod-unit-test", type: "mc",
    prompt: "Test meng-import <code>UsersModule</code> utuh, tapi <code>PrismaService</code> di dalamnya harus diganti mock. API mana yang dipakai?",
    options: {
      a: "Menghapus PrismaService dari UsersModule selama test berjalan",
      b: "Menambah PrismaService kedua di providers dengan alias",
      c: "Mengambil moduleRef.get(PrismaService) lalu mengganti semua property-nya setelahnya",
      d: "Memanggil builder <code>.overrideProvider(PrismaService).useValue(mock)</code> tepat sebelum compile() dipanggil",
    },
    answer: "d",
    explain: "overrideProvider(token) lalu useValue/useClass/useFactory mengganti provider di module yang di-import, tanpa menyentuh kode produksi. Kalau test hanya mendaftarkan providers sendiri, cukup { provide: PrismaService, useValue: mock } langsung di array providers.",
  },
  {
    id: "0030-04", lesson: "0030", topic: "prod-mock", type: "mc",
    prompt: "Beda <code>mockClear()</code> dan <code>mockReset()</code> pada mock Jest?",
    options: {
      a: "mockClear menghapus implementasi; mockReset hanya menghapus catatan panggilan saja",
      b: "mockClear menghapus catatan panggilan; mockReset juga menghapus implementasi mock",
      c: "Keduanya sama persis, hanya nama lama dan nama baru",
      d: "mockClear mengembalikan method asli; mockReset hanya untuk spyOn saja",
    },
    answer: "b",
    explain: "mockClear() mengosongkan mock.calls, mock.instances, mock.contexts, dan mock.results, tapi implementasinya tetap. mockReset() melakukan itu ditambah mengganti implementasi dengan fungsi kosong yang mengembalikan undefined. mockRestore() (hanya untuk jest.spyOn) mengembalikan implementasi asli.",
  },
  {
    id: "0030-05", lesson: "0030", topic: "prod-unit-test", type: "mc",
    prompt: "Proyek NestJS 12 Anda CommonJS dengan Jest. Test gagal memuat paket <code>@nestjs/*</code>. Apa penyebab yang paling mungkin?",
    options: {
      a: "Paket inti NestJS 12 ESM-only; Jest butuh Node ≥ 24.9",
      b: "NestJS 12 melarang Jest dan hanya mendukung test runner bawaan",
      c: "Test.createTestingModule dihapus di NestJS 12 dan diganti sebuah decorator baru",
      d: "Jest tidak bisa menjalankan file TypeScript sama sekali di NestJS",
    },
    answer: "a",
    explain: "Migration guide NestJS 12: paket inti dikirim sebagai ESM, dan Jest baru bisa memuat paket ESM-only itu di Node versi baru, jadi test dijalankan di Node ≥ 24.9 (atau pindah ke Vitest). @nestjs/testing tetap agnostik terhadap test runner.",
  },
  {
    id: "0030-oral-1", lesson: "0030", topic: "prod-mock", type: "oral",
    prompt: "Tulis kode: unit test Jest untuk <code>UsersService.findOne(id)</code> yang memanggil <code>this.prisma.user.findUnique({ where: { id } })</code> dan melempar <code>NotFoundException</code> kalau hasilnya <code>null</code>. <code>PrismaService</code> harus di-mock. Tulis di kertas, tanpa IDE. (5 menit)",
    sample: "<pre><code>describe('UsersService', () =&gt; {\n  let service: UsersService;\n  const prisma = { user: { findUnique: jest.fn() } };\n\n  beforeEach(async () =&gt; {\n    const moduleRef = await Test.createTestingModule({\n      providers: [UsersService, { provide: PrismaService, useValue: prisma }],\n    }).compile();\n    service = moduleRef.get(UsersService);\n    jest.clearAllMocks();\n  });\n\n  it('mengembalikan user kalau ada', async () =&gt; {\n    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.c' });\n    await expect(service.findOne(1)).resolves.toEqual({ id: 1, email: 'a@b.c' });\n    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });\n  });\n\n  it('melempar NotFoundException kalau tidak ada', async () =&gt; {\n    prisma.user.findUnique.mockResolvedValue(null);\n    await expect(service.findOne(2)).rejects.toThrow(NotFoundException);\n  });\n});</code></pre>",
    checklist: [
      "Test.createTestingModule dengan UsersService di providers, lalu await compile()",
      "PrismaService diganti { provide: PrismaService, useValue: mock } atau overrideProvider",
      "mock hanya berisi method yang dipakai: user.findUnique = jest.fn()",
      "mockResolvedValue untuk hasil async (data dan null)",
      "dua kasus: ditemukan, dan null → rejects.toThrow(NotFoundException)",
      "memeriksa argumen dengan toHaveBeenCalledWith dan mereset mock antar test",
    ],
  },
]);
