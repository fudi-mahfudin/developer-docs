// Soal lesson 0024 (track Node.js, modul Pipeline request) · Interceptor dan exception filter. Format: assets/README.md.
// Sumber: NestJS docs (Interceptors, Exception filters, Migration guide v11 ke v12).
QuestionBank.labelTopics({
  "pipeline-interceptor": "Pipeline: interceptor, next.handle(), RxJS tap/map/timeout",
  "pipeline-filter": "Pipeline: HttpException, built-in exception, custom exception filter",
});

QuestionBank.register([
  {
    id: "0024-01", lesson: "0024", topic: "pipeline-interceptor", type: "mc",
    prompt: "Sebuah interceptor lupa memanggil <code>next.handle()</code> dan langsung mengembalikan <code>of([])</code>. Apa akibatnya?",
    options: {
      a: "Handler tidak dijalankan; client menerima array kosong dari interceptor",
      b: "Handler tetap dijalankan, lalu hasilnya digabung dengan array kosong",
      c: "Nest melempar error saat start karena interceptor tidak valid",
      d: "Request menggantung sampai timeout karena tidak ada response terkirim",
    },
    answer: "a",
    explain: "next.handle() adalah cara interceptor menjalankan handler. Kalau tidak dipanggil, handler tidak dijalankan sama sekali, dan Observable yang dikembalikan interceptor menjadi response. Pola ini dipakai untuk cache (NestJS docs, Interceptors: Call handler dan Stream overriding).",
  },
  {
    id: "0024-02", lesson: "0024", topic: "pipeline-interceptor", type: "mc",
    prompt: "Anda ingin semua response sukses dibungkus menjadi <code>{ data: ... }</code>. Operator RxJS mana yang dipakai di <code>next.handle().pipe(...)</code>?",
    options: {
      a: "<code>tap(data =&gt; ({ data }))</code>, karena tap mengubah nilai yang lewat",
      b: "<code>timeout(data =&gt; ({ data }))</code>, karena timeout membungkus setiap hasil handler",
      c: "<code>map(data =&gt; ({ data }))</code>, karena map mengganti nilai yang lewat",
      d: "<code>catchError(data =&gt; ({ data }))</code>, karena catchError menerima setiap hasil handler",
    },
    answer: "c",
    explain: "map() mengubah nilai yang dipancarkan Observable; contoh TransformInterceptor di dokumentasi memakai map untuk membungkus hasil di properti data (NestJS docs, Interceptors: Response mapping). tap() hanya untuk efek samping dan tidak mengubah nilai.",
  },
  {
    id: "0024-03", lesson: "0024", topic: "pipeline-filter", type: "mc",
    prompt: "Service melempar <code>new Error('koneksi DB putus')</code> dan tidak ada custom exception filter. Apa yang diterima client?",
    options: {
      a: "400 dengan pesan <code>koneksi DB putus</code> dari Error",
      b: "500 dengan pesan <code>Internal server error</code> bawaan Nest",
      c: "503 karena Nest mendeteksi database sedang tidak tersedia",
      d: "Stack trace lengkap supaya client bisa melakukan debug",
    },
    answer: "b",
    explain: "Exception yang tidak dikenali (bukan HttpException) ditangani exception filter global bawaan dan menjadi { statusCode: 500, message: \"Internal server error\" } (NestJS docs, Exception filters). Pesan asli tidak bocor ke client.",
  },
  {
    id: "0024-04", lesson: "0024", topic: "pipeline-filter", type: "mc",
    prompt: "Anda menulis exception filter yang harus menangkap <strong>semua</strong> exception dan butuh meng-inject logger. Kombinasi mana yang tepat?",
    options: {
      a: "<code>@Catch(HttpException)</code> dan <code>app.useGlobalFilters()</code> di dalam file <code>main.ts</code> aplikasi",
      b: "<code>@Catch(Error)</code> dan <code>@UseFilters()</code> di setiap controller milik aplikasi",
      c: "<code>@Catch()</code> dan <code>app.useGlobalFilters()</code> di dalam file <code>main.ts</code> aplikasi",
      d: "<code>@Catch()</code> tanpa argumen dan provider <code>APP_FILTER</code> di module",
    },
    answer: "d",
    explain: "@Catch() tanpa argumen menangkap setiap exception yang tidak tertangani. Filter yang didaftarkan lewat useGlobalFilters() tidak bisa meng-inject dependency; APP_FILTER mendaftarkannya sebagai provider sehingga DI berjalan (NestJS docs, Exception filters: Binding filters dan Catch everything).",
  },
  {
    id: "0024-oral-1", lesson: "0024", topic: "pipeline-filter", type: "oral",
    prompt: "\"Tim frontend mengeluh bentuk error API kita berbeda-beda, dan sebagian endpoint lambat tanpa batas waktu. Apa yang Anda pasang di NestJS, dan bagaimana kerjanya?\" (60 detik)",
    sample: "\"Untuk bentuk error, saya pasang satu exception filter global lewat APP_FILTER dengan @Catch() tanpa argumen supaya semua exception tertangkap. Filter itu memakai ArgumentsHost untuk mengambil response, membaca status dari HttpException atau memakai 500 untuk error lain, lalu mengirim JSON dengan bentuk yang sama: statusCode, message, path, timestamp. Di service, error yang disengaja saya lempar sebagai built-in exception seperti NotFoundException atau ConflictException, bukan Error biasa. Untuk batas waktu, saya pasang interceptor timeout: next.handle() mengembalikan Observable, saya tambahkan operator timeout lalu catchError yang mengubah TimeoutError menjadi RequestTimeoutException. Interceptor juga tempat logging durasi request dengan tap. Catatannya, timeout hanya berhenti menunggu, pekerjaan handler tidak ikut dibatalkan.\"",
    checklist: [
      "Exception filter global (APP_FILTER atau useGlobalFilters) untuk format error",
      "@Catch() tanpa argumen untuk menangkap semua exception, termasuk non-HTTP (500)",
      "Built-in exception (NotFoundException, ConflictException) untuk error yang disengaja",
      "Interceptor timeout dengan next.handle() + operator RxJS timeout",
      "TimeoutError diubah menjadi RequestTimeoutException",
      "Timeout tidak membatalkan pekerjaan yang sudah berjalan",
    ],
  },
]);
