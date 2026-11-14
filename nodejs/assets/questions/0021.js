// Soal lesson 0021 (track Node.js, modul Pipeline request) · Urutan pipeline request NestJS. Format: assets/README.md.
// Sumber: NestJS docs (Request lifecycle, Guards, Pipes, Middleware).
QuestionBank.labelTopics({
  "pipeline-urutan": "Pipeline: urutan middleware, guard, interceptor, pipe, filter",
  "pipeline-binding": "Pipeline: binding global, controller, method; APP_* vs useGlobal*",
});

QuestionBank.register([
  {
    id: "0021-01", lesson: "0021", topic: "pipeline-urutan", type: "mc",
    prompt: "Request <code>POST /orders</code> melewati middleware, guard, interceptor, dan pipe sebelum sampai ke handler. Urutan mana yang benar?",
    options: {
      a: "Guard, middleware, pipe, interceptor, lalu handler",
      b: "Middleware, guard, interceptor, pipe, lalu handler",
      c: "Middleware, pipe, guard, interceptor, lalu handler",
      d: "Interceptor, middleware, guard, pipe, lalu handler",
    },
    answer: "b",
    explain: "Request mengalir lewat middleware, lalu guard, lalu interceptor, lalu pipe, dan kembali lewat interceptor setelah handler (NestJS docs, Request lifecycle). Guard dijalankan setelah semua middleware, tetapi sebelum interceptor atau pipe (NestJS docs, Guards).",
  },
  {
    id: "0021-02", lesson: "0021", topic: "pipeline-urutan", type: "mc",
    prompt: "Endpoint admin harus menolak user tanpa role <code>admin</code> sebelum body request divalidasi. Komponen apa yang paling tepat?",
    options: {
      a: "Middleware, karena middleware tahu handler mana yang akan dipanggil",
      b: "Pipe, karena pipe jalan paling awal di dalam pipeline",
      c: "Exception filter, karena filter menangani semua request yang masuk",
      d: "Guard, karena guard jalan sebelum pipe dan tahu handler-nya",
    },
    answer: "d",
    explain: "Guard menentukan apakah request boleh ditangani handler, dan jalan sebelum interceptor dan pipe (NestJS docs, Guards). Middleware tidak tahu handler mana yang akan jalan setelah next(), pipe jalan setelah guard, dan filter hanya bekerja saat ada exception.",
  },
  {
    id: "0021-03", lesson: "0021", topic: "pipeline-binding", type: "mc",
    prompt: "Guard global perlu meng-inject <code>Reflector</code> dan <code>UsersService</code>. Cara mendaftarkannya yang benar?",
    options: {
      a: "Provider <code>{ provide: APP_GUARD, useClass: RolesGuard }</code> di module",
      b: "Panggil <code>app.useGlobalGuards(new RolesGuard())</code> di file <code>main.ts</code> sebelum <code>app.listen()</code> dipanggil",
      c: "Pasang <code>@UseGuards(RolesGuard)</code> di setiap method yang ada di aplikasi",
      d: "Daftarkan guard lewat <code>consumer.apply(RolesGuard)</code> di method <code>configure</code> milik AppModule",
    },
    answer: "a",
    explain: "Guard yang didaftarkan dengan useGlobalGuards() berada di luar module, jadi tidak bisa meng-inject dependency. Token APP_GUARD mendaftarkannya sebagai provider sehingga DI berjalan, dan guard tetap berlaku global (NestJS docs, Guards: Binding guards). consumer.apply() untuk middleware, bukan guard.",
  },
  {
    id: "0021-04", lesson: "0021", topic: "pipeline-binding", type: "mc",
    prompt: "Exception filter dipasang di level global, controller, dan method. Handler melempar <code>NotFoundException</code>. Filter mana yang dicoba lebih dulu?",
    options: {
      a: "Filter global, karena global selalu jalan paling dulu",
      b: "Filter controller, karena controller membungkus semua method miliknya",
      c: "Filter method, karena filter mulai dari level terendah",
      d: "Ketiganya jalan bersamaan, lalu hasilnya digabung jadi satu",
    },
    answer: "c",
    explain: "Filter adalah satu-satunya komponen yang tidak dimulai dari global; filter diselesaikan dari level terendah: method, lalu controller, lalu global (NestJS docs, Request lifecycle: Filters). Guard, interceptor (sebelum), dan pipe justru global → controller → method.",
  },
  {
    id: "0021-oral-1", lesson: "0021", topic: "pipeline-urutan", type: "oral",
    prompt: "\"Jelaskan apa saja yang dilewati satu request di NestJS sebelum dan sesudah method controller. Kalau saya butuh otorisasi role, validasi body, dan format error yang seragam, saya pasang di mana?\" (60 detik)",
    sample: "\"Request masuk ke middleware dulu, lalu guard, lalu bagian 'sebelum' dari interceptor, lalu pipe, baru handler. Hasil handler kembali lewat interceptor dengan urutan terbalik. Kalau ada exception yang tidak ditangkap di mana pun, exception filter yang membentuk response error. Otorisasi role saya taruh di guard, karena guard tahu handler mana yang akan jalan dan jalan sebelum pipe, jadi request yang tidak berhak ditolak sebelum body divalidasi. Validasi body saya taruh di ValidationPipe global. Format error yang seragam saya taruh di exception filter global. Untuk global yang butuh DI, misalnya guard yang meng-inject Reflector, saya daftarkan lewat APP_GUARD di module, bukan useGlobalGuards di main.ts.\"",
    checklist: [
      "Urutan: middleware → guard → interceptor → pipe → handler",
      "Interceptor juga jalan setelah handler (membungkus handler)",
      "Exception filter hanya untuk exception yang tidak ditangkap",
      "Otorisasi di guard, validasi di pipe, format error di filter",
      "Alasan urutan: request ditolak sebelum kerja yang lebih mahal",
      "Beda global lewat useGlobal*() (tanpa DI) dan APP_* (dengan DI)",
    ],
  },
]);
