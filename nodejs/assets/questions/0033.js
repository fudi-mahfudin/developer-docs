// Soal lesson 0033 (track Node.js, modul Testing & produksi) · Graceful shutdown, health check, throttler, CacheModule. Format: assets/README.md.
// Sumber: Node.js v24 API process (signal events), docs.nestjs.com/fundamentals/lifecycle-events, docs.nestjs.com/migration-guide (NestJS 12),
// docs.nestjs.com/recipes/terminus, docs.nestjs.com/security/rate-limiting, nestjs/throttler throttler.exception.ts, RFC 6585 §4, docs.nestjs.com/techniques/caching.
QuestionBank.labelTopics({
  "prod-shutdown-health": "Testing & produksi: graceful shutdown dan health check",
  "prod-throttle-cache": "Testing & produksi: @nestjs/throttler dan CacheModule",
});

QuestionBank.register([
  {
    id: "0033-01", lesson: "0033", topic: "prod-shutdown-health", type: "mc",
    prompt: "Container NestJS menerima SIGTERM. <code>onModuleDestroy</code> di <code>PrismaService</code> tidak pernah dipanggil. Apa yang terlupa?",
    options: {
      a: "Menambahkan process.exit(0) di akhir file main.ts",
      b: "Memanggil app.enableShutdownHooks() sebelum app.listen() di main.ts",
      c: "Menjadikan PrismaService provider REQUEST-scoped di module",
      d: "Mengganti SIGTERM dengan SIGKILL di container",
    },
    answer: "b",
    explain: "Listener sinyal shutdown dimatikan secara default karena memakan resource. Tanpa app.enableShutdownHooks(), Nest tidak bereaksi terhadap SIGTERM dan hook onModuleDestroy, beforeApplicationShutdown, onApplicationShutdown hanya jalan kalau Anda memanggil app.close() sendiri. SIGKILL tidak bisa ditangkap sama sekali.",
  },
  {
    id: "0033-02", lesson: "0033", topic: "prod-throttle-cache", type: "mc",
    prompt: "<code>ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] })</code> dengan <code>ThrottlerGuard</code> global. Apa artinya, dan apa response saat limit terlewati?",
    options: {
      a: "10 request per 60 detik; kelebihannya dijawab 429",
      b: "60000 request per 10 detik; kelebihannya dijawab 503",
      c: "10 request per 60000 detik; kelebihannya diantrekan dulu",
      d: "10 koneksi paralel per server; kelebihannya dijawab 403",
    },
    answer: "a",
    explain: "Sejak @nestjs/throttler v5, ttl dalam milidetik dan limit adalah jumlah request maksimum dalam ttl itu, dilacak per client (default per IP). Saat terlewati, ThrottlerGuard melempar ThrottlerException, turunan HttpException dengan status 429 Too Many Requests (RFC 6585).",
  },
  {
    id: "0033-03", lesson: "0033", topic: "prod-shutdown-health", type: "mc",
    prompt: "Urutan hook saat <code>app.close()</code> (atau SIGTERM dengan shutdown hooks aktif)?",
    options: {
      a: "onApplicationShutdown → onModuleDestroy → beforeApplicationShutdown",
      b: "beforeApplicationShutdown → onApplicationShutdown → onModuleDestroy",
      c: "onModuleDestroy → onApplicationShutdown → beforeApplicationShutdown",
      d: "onModuleDestroy → beforeApplicationShutdown → onApplicationShutdown",
    },
    answer: "d",
    explain: "Dokumentasi lifecycle events: onModuleDestroy dulu, lalu beforeApplicationShutdown setelah semua onModuleDestroy selesai, lalu koneksi ditutup, dan onApplicationShutdown(signal) terakhir. Nest menunggu Promise yang dikembalikan setiap hook.",
  },
  {
    id: "0033-04", lesson: "0033", topic: "prod-throttle-cache", type: "mc",
    prompt: "Aplikasi jalan di 4 instance di belakang load balancer, throttler memakai storage default. Limit 10/menit per IP. Apa masalahnya?",
    options: {
      a: "Throttler menolak berjalan jika ada lebih dari satu instance",
      b: "Semua instance otomatis berbagi counter lewat event loop Node",
      c: "Counter di memori tiap instance; client bisa lolos 40/menit",
      d: "Load balancer selalu mengganti IP client sehingga limit diabaikan",
    },
    answer: "c",
    explain: "Storage default @nestjs/throttler ada di memori proses, jadi setiap instance menghitung sendiri. Untuk limit yang konsisten di banyak instance, pakai storage bersama seperti Redis. Di belakang proxy juga perlu trust proxy supaya IP yang dihitung adalah IP client, bukan IP proxy.",
  },
  {
    id: "0033-05", lesson: "0033", topic: "prod-throttle-cache", type: "mc",
    prompt: "<code>CacheModule.register({ ttl: 5000 })</code> dari <code>@nestjs/cache-manager</code>. Berapa lama entri disimpan, dan endpoint mana yang di-cache <code>CacheInterceptor</code> secara default?",
    options: {
      a: "5000 detik; semua method HTTP termasuk POST",
      b: "5 detik; hanya endpoint GET yang di-cache",
      c: "5000 menit; hanya endpoint yang memakai @Res()",
      d: "Selamanya; hanya endpoint yang ditandai dengan @Public()",
    },
    answer: "b",
    explain: "ttl di cache-manager dalam milidetik, jadi 5000 = 5 detik; tanpa ttl, entri tidak kedaluwarsa. CacheInterceptor hanya meng-cache GET secara default, dan route yang meng-inject @Res() tidak bisa memakainya.",
  },
  {
    id: "0033-06", lesson: "0033", topic: "prod-shutdown-health", type: "mc",
    prompt: "Label versi NestJS 12: bagaimana custom health indicator <code>@nestjs/terminus</code> ditulis?",
    options: {
      a: "Extend class HealthIndicator dan lempar HealthCheckError saat cek gagal",
      b: "Tulis controller biasa yang selalu mengembalikan status 200 OK",
      c: "Inject HealthIndicatorService, lalu panggil check(key) dan up() atau down()",
      d: "Pasang ThrottlerGuard di endpoint health supaya tidak kelebihan beban",
    },
    answer: "c",
    explain: "Migration guide NestJS 12: API health indicator lama (deprecated di v11) dihapus. Indicator tidak lagi melapor dengan melempar error; inject HealthIndicatorService, panggil check(key), lalu kembalikan up()/down(), atau pakai attempt() yang menandai down kalau operasinya melempar.",
  },
  {
    id: "0033-oral-1", lesson: "0033", topic: "prod-shutdown-health", type: "oral",
    prompt: "\"Saat deploy, orchestrator mengirim SIGTERM ke container NestJS Anda. Apa yang harus terjadi supaya tidak ada request atau koneksi yang terputus kasar, dan bagaimana orchestrator tahu aplikasi sehat?\" (60 detik)",
    sample: "\"Di main.ts saya panggil app.enableShutdownHooks(), karena secara default Nest tidak mendengarkan sinyal. Saat SIGTERM datang, Nest menjalankan onModuleDestroy, lalu beforeApplicationShutdown, menutup server HTTP, lalu onApplicationShutdown dengan nama sinyalnya. Di hook itu saya menutup koneksi: PrismaService memanggil $disconnect, worker queue berhenti mengambil job baru. Di NestJS 12 adapter Express juga menunggu request yang sedang jalan selesai. Kalau proses tidak berhenti dalam grace period, orchestrator mengirim SIGKILL yang tidak bisa ditangkap, jadi hook harus cepat. Untuk kesehatan, saya pasang endpoint /health dengan @nestjs/terminus: HealthCheckService.check berisi indicator database dan memori. Kalau ada yang down, responsnya 503 dan orchestrator berhenti mengirim traffic. Terminus juga punya gracefulShutdownTimeoutMs untuk memberi jeda sebelum shutdown.\"",
    checklist: [
      "app.enableShutdownHooks() karena listener sinyal mati secara default",
      "urutan onModuleDestroy → beforeApplicationShutdown → onApplicationShutdown(signal)",
      "menutup koneksi di hook (Prisma $disconnect, worker berhenti ambil job)",
      "SIGKILL setelah grace period tidak bisa ditangkap, jadi shutdown harus cepat",
      "endpoint /health dengan @nestjs/terminus: HealthCheckService + indicator",
      "unhealthy → 503 sehingga orchestrator berhenti mengirim traffic",
    ],
  },
]);
