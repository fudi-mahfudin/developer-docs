// Soal lesson 0019 (track Node.js, modul NestJS inti) · Controller, routing, dan lifecycle hooks. Format: assets/README.md.
// Sumber: docs.nestjs.com (Controllers, Lifecycle events, Migration guide v11 ke v12).
QuestionBank.labelTopics({
  "nest-controller": "NestJS inti: controller, decorator routing dan parameter, status code",
  "nest-lifecycle": "NestJS inti: lifecycle hooks dan enableShutdownHooks",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban a c b d a.
QuestionBank.register([
  {
    id: "0019-01", lesson: "0019", topic: "nest-controller", type: "mc",
    prompt: "Handler <code>@Post()</code> mengembalikan object user baru tanpa decorator lain. Status code apa yang diterima client?",
    options: {
      a: "201, karena POST default-nya 201 di Nest",
      b: "200, karena handler default-nya 200 di Nest",
      c: "204, karena tidak ada @HttpCode yang ditulis",
      d: "202, karena pembuatan resource dianggap belum selesai",
    },
    answer: "a",
    explain: "docs.nestjs.com (Controllers): \"The response's status code is 200 by default, except for POST requests, which use 201.\" Ubah dengan @HttpCode(...) di level handler.",
  },
  {
    id: "0019-02", lesson: "0019", topic: "nest-lifecycle", type: "mc",
    prompt: "Aplikasi berjalan di container. Saat container dihentikan (SIGTERM), <code>onModuleDestroy()</code> di <code>PrismaService</code> tidak pernah dipanggil. Penyebab paling mungkin?",
    options: {
      a: "PrismaService belum diberi decorator @Global di dalam module-nya",
      b: "onModuleDestroy hanya dipanggil kalau aplikasi crash, bukan berhenti",
      c: "main.ts belum memanggil app.enableShutdownHooks() saat bootstrap aplikasi berjalan",
      d: "Hook shutdown hanya berjalan di Fastify, bukan Express",
    },
    answer: "c",
    explain: "docs.nestjs.com (Lifecycle events): shutdown hook listener \"are disabled by default\"; untuk shutdown yang dipicu sinyal seperti SIGTERM, enableShutdownHooks() harus dipanggil saat bootstrap.",
  },
  {
    id: "0019-03", lesson: "0019", topic: "nest-controller", type: "mc",
    prompt: "<code>@Get(':id') findOne(@Param('id') id: number)</code>. Request <code>GET /users/42</code>. Apa tipe <code>id</code> saat runtime?",
    options: {
      a: "number, karena anotasi tipe TypeScript otomatis mengonversi nilainya langsung",
      b: "string, karena param selalu string tanpa pipe seperti ParseIntPipe",
      c: "undefined, karena param harus diambil lewat @Query bukan @Param",
      d: "NaN, karena Nest gagal mengonversi string ke number otomatis",
    },
    answer: "b",
    explain: "docs.nestjs.com (Controllers): nilai query dan param datang sebagai string, dan anotasi tipe number saja tidak mengonversinya. Pakai ParseIntPipe: @Param('id', ParseIntPipe).",
  },
  {
    id: "0019-04", lesson: "0019", topic: "nest-lifecycle", type: "mc",
    prompt: "Urutan hook saat aplikasi dihentikan dengan <code>enableShutdownHooks()</code> aktif?",
    options: {
      a: "onApplicationShutdown, lalu beforeApplicationShutdown, lalu onModuleDestroy",
      b: "beforeApplicationShutdown, lalu onModuleDestroy, lalu onApplicationShutdown",
      c: "onModuleDestroy, lalu onApplicationShutdown, lalu beforeApplicationShutdown",
      d: "onModuleDestroy, lalu beforeApplicationShutdown, lalu onApplicationShutdown",
    },
    answer: "d",
    explain: "docs.nestjs.com (Lifecycle events): onModuleDestroy setelah sinyal diterima; beforeApplicationShutdown setelah semua onModuleDestroy selesai; onApplicationShutdown setelah koneksi ditutup, langkah terakhir app.close().",
  },
  {
    id: "0019-05", lesson: "0019", topic: "nest-controller", type: "mc",
    prompt: "Handler memakai <code>@Res() res: Response</code> hanya untuk memasang cookie, lalu <code>return user</code>. Request menggantung tanpa respons. Kenapa?",
    options: {
      a: "@Res membuat mode library-specific; pakai passthrough: true supaya return dikirim",
      b: "Cookie hanya bisa dipasang di middleware Express, tidak di handler",
      c: "Return value harus dibungkus Observable kalau @Res dipakai di handler",
      d: "@Res hanya didukung di platform Fastify dan diabaikan adapter Express",
    },
    answer: "a",
    explain: "docs.nestjs.com (Controllers): dengan @Res() Nest masuk library-specific mode dan Anda \"become responsible for managing the response\". @Res({ passthrough: true }) mempertahankan penanganan return value oleh Nest.",
  },
  {
    id: "0019-06", lesson: "0019", topic: "nest-lifecycle", type: "mc",
    prompt: "NestJS 12. <code>AppModule</code> meng-import <code>UsersModule</code>, yang meng-import <code>PrismaModule</code>. Module mana yang <code>onModuleInit()</code>-nya dipanggil lebih dulu?",
    options: {
      a: "AppModule, karena root module selalu diinisialisasi paling awal",
      b: "PrismaModule, karena module paling dalam diproses lebih dulu",
      c: "UsersModule, karena feature module selalu didahulukan oleh Nest",
      d: "Acak, karena Nest memanggil semua hook secara paralel",
    },
    answer: "b",
    explain: "docs.nestjs.com (Lifecycle events; Migration guide v12): hook dipanggil per level hierarki; module yang di-import paling dalam (dan global) lebih dulu, root terakhir, dan hook setiap module di-await sebelum lanjut. Shutdown berurutan terbalik.",
  },
  {
    id: "0019-oral-1", lesson: "0019", topic: "nest-lifecycle", type: "oral",
    prompt: "\"Service Anda membuka koneksi database dan koneksi Redis. Di mana Anda membuka dan menutupnya, dan apa yang harus dipastikan supaya koneksi ditutup rapi saat container dihentikan?\" (60 detik)",
    sample: "Saya buka di onModuleInit, async, karena Nest menunggu Promise-nya sebelum lanjut; jadi aplikasi baru menerima request setelah koneksi siap. onApplicationBootstrap juga bisa, dipanggil setelah semua module siap tapi sebelum listen. Saya tutup di onModuleDestroy, atau onApplicationShutdown untuk hal yang harus terakhir. Urutan shutdown-nya onModuleDestroy, beforeApplicationShutdown, lalu onApplicationShutdown setelah koneksi HTTP ditutup. Yang sering lupa: shutdown hook mati secara default, jadi di main.ts harus ada app.enableShutdownHooks(), kalau tidak SIGTERM dari orchestrator tidak memicu hook apa pun. Di NestJS 12 hook dipanggil per level hierarki: module terdalam lebih dulu saat init, dan terbalik saat shutdown. Dan hook ini tidak jalan untuk provider request-scoped.",
    checklist: [
      "connect di onModuleInit (atau onApplicationBootstrap) dan bahwa hook async di-await",
      "disconnect di onModuleDestroy atau onApplicationShutdown",
      "urutan shutdown: onModuleDestroy, beforeApplicationShutdown, onApplicationShutdown",
      "enableShutdownHooks() wajib supaya SIGTERM memicu hook",
      "urutan antar module: terdalam dulu saat init, terbalik saat shutdown (NestJS 12)",
      "hook tidak dipanggil untuk class request-scoped",
    ],
  },
  {
    id: "0019-oral-2", lesson: "0019", topic: "nest-controller", type: "oral",
    prompt: "Tulis kode: <code>ProductsController</code> dengan prefix <code>products</code>: <code>GET /products?page=</code> (page angka, default 1), <code>GET /products/:id</code>, <code>POST /products</code> dengan body <code>CreateProductDto</code>, dan <code>DELETE /products/:id</code> yang mengembalikan 204. Semua memanggil <code>ProductsService</code>. (5 menit, di kertas)",
    sample: "<pre><code>@Controller('products')\nexport class ProductsController {\n  constructor(private readonly products: ProductsService) {}\n\n  @Get()\n  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {\n    return this.products.findAll(page);\n  }\n\n  @Get(':id')\n  findOne(@Param('id', ParseIntPipe) id: number) { return this.products.findOne(id); }\n\n  @Post()\n  create(@Body() dto: CreateProductDto) { return this.products.create(dto); }\n\n  @Delete(':id')\n  @HttpCode(204)\n  remove(@Param('id', ParseIntPipe) id: number) { return this.products.remove(id); }\n}</code></pre>",
    checklist: [
      "memakai @Controller('products') dan meng-inject service lewat constructor",
      "memakai decorator HTTP yang benar dengan path ':id'",
      "mengubah param/query ke angka dengan ParseIntPipe (bukan anotasi tipe saja)",
      "memberi default untuk page (mis. DefaultValuePipe)",
      "memakai @Body() dengan DTO berupa class",
      "memberi @HttpCode(204) di DELETE dan membiarkan POST di 201 default",
    ],
  },
]);
