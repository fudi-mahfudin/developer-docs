// Soal lesson 0022 (track Node.js, modul Pipeline request) · Pipe dan ValidationPipe; latihan tulis DTO. Format: assets/README.md.
// Sumber: NestJS docs (Pipes, Validation, Migration guide v11 ke v12).
QuestionBank.labelTopics({
  "pipeline-pipe": "Pipeline: pipe bawaan (ParseIntPipe dll.), transformasi vs validasi",
  "pipeline-validation": "Pipeline: ValidationPipe, DTO, whitelist/forbidNonWhitelisted/transform",
});

QuestionBank.register([
  {
    id: "0022-01", lesson: "0022", topic: "pipeline-pipe", type: "mc",
    prompt: "Handler <code>findOne(@Param('id', ParseIntPipe) id: number)</code> dipanggil dengan <code>GET /orders/abc</code>. Apa yang terjadi?",
    options: {
      a: "Handler tetap dipanggil dengan <code>id</code> bernilai <code>NaN</code> tanpa error",
      b: "Handler dipanggil dengan <code>id</code> berisi string <code>'abc'</code> apa adanya",
      c: "Pipe melempar exception, client menerima 400, handler tidak dipanggil",
      d: "Nest mengembalikan 404 karena route dengan id tidak ada",
    },
    answer: "c",
    explain: "Pipe berjalan di dalam exceptions zone: kalau pipe melempar exception, handler tidak dijalankan. ParseIntPipe dengan input non-numerik menghasilkan 400 dengan pesan \"Validation failed (numeric string is expected)\" (NestJS docs, Pipes).",
  },
  {
    id: "0022-02", lesson: "0022", topic: "pipeline-pipe", type: "mc",
    prompt: "Anda ingin <code>ParseIntPipe</code> mengembalikan status 406, bukan 400, saat input bukan angka. Bagaimana caranya?",
    options: {
      a: "Berikan instance <code>new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })</code> saat memasang pipe",
      b: "Tulis ulang <code>ParseIntPipe</code> dari nol karena opsinya tidak bisa diubah",
      c: "Ubah status di file <code>main.ts</code> lewat <code>app.setGlobalPrefix('406')</code> sebelum <code>listen</code> dipanggil",
      d: "Tangkap error dengan <code>try/catch</code> di dalam handler lalu ubah status",
    },
    answer: "a",
    explain: "Pipe bawaan bisa dikonfigurasi dengan memberikan instance, bukan class; errorHttpStatusCode mengganti status error (NestJS docs, Pipes: Binding pipes). try/catch di handler tidak berguna karena handler tidak pernah dipanggil saat pipe gagal.",
  },
  {
    id: "0022-03", lesson: "0022", topic: "pipeline-validation", type: "mc",
    prompt: "<code>ValidationPipe({ whitelist: true })</code> aktif. Client mengirim body berisi field <code>isAdmin: true</code> yang tidak ada di DTO. Apa hasilnya?",
    options: {
      a: "Request ditolak 400 karena properti isAdmin tidak boleh ada",
      b: "Field <code>isAdmin</code> diteruskan ke handler apa adanya karena valid",
      c: "Request ditolak 403 karena client mencoba mengubah role dirinya",
      d: "Field <code>isAdmin</code> dibuang diam-diam; handler hanya menerima field DTO",
    },
    answer: "d",
    explain: "whitelist membuang properti yang tidak punya decorator validasi. Untuk menolak dengan error, tambahkan forbidNonWhitelisted: true (NestJS docs, Validation: Stripping properties).",
  },
  {
    id: "0022-04", lesson: "0022", topic: "pipeline-validation", type: "mc",
    prompt: "Seorang developer menulis DTO sebagai <code>interface CreateUserDto</code> dengan decorator class-validator di tempat lain. <code>ValidationPipe</code> tidak memvalidasi apa pun. Kenapa?",
    options: {
      a: "ValidationPipe hanya memvalidasi query string, bukan body dari request",
      b: "Interface hilang saat kompilasi, jadi tidak ada metadata tipe",
      c: "Interface harus didaftarkan dulu sebagai provider di dalam module",
      d: "class-validator hanya bekerja kalau opsi <code>transform</code> dimatikan sama sekali",
    },
    answer: "b",
    explain: "TypeScript tidak memancarkan metadata untuk generic atau interface, jadi ValidationPipe tidak bisa mengetahui tipe parameter. DTO harus berupa class (NestJS docs, Validation).",
  },
  {
    id: "0022-oral-1", lesson: "0022", topic: "pipeline-validation", type: "oral",
    prompt: "Tulis kode (5 menit, di kertas): DTO <code>CreateProductDto</code> untuk <code>POST /products</code>: <code>name</code> string wajib maksimal 100 karakter, <code>price</code> angka positif, <code>tags</code> array string opsional. Pasang validasi supaya field asing ditolak dan <code>id</code> di <code>GET /products/:id</code> diterima sebagai number.",
    sample: "<pre><code>import { IsString, IsNotEmpty, MaxLength, IsNumber, IsPositive, IsOptional, IsArray } from 'class-validator';\n\nexport class CreateProductDto {\n  @IsString() @IsNotEmpty() @MaxLength(100)\n  name: string;\n\n  @IsNumber() @IsPositive()\n  price: number;\n\n  @IsOptional() @IsArray() @IsString({ each: true })\n  tags?: string[];\n}\n\n// main.ts\napp.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));\n\n// products.controller.ts\n@Post() create(@Body() dto: CreateProductDto) { return this.products.create(dto); }\n@Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.products.findOne(id); }</code></pre>",
    checklist: [
      "DTO ditulis sebagai class, bukan interface",
      "Decorator class-validator yang sesuai per field (@IsString, @MaxLength, @IsPositive)",
      "Field opsional dengan @IsOptional() dan isi array divalidasi dengan { each: true }",
      "ValidationPipe dipasang (global atau di route)",
      "whitelist + forbidNonWhitelisted agar field asing ditolak",
      "id diubah ke number dengan ParseIntPipe atau transform: true",
    ],
  },
]);
