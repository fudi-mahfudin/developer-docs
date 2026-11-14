# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

Slug topik bank soal modul ini: `runtime-anatomi`, `runtime-io-vs-cpu` (0001), `runtime-fase-loop`, `runtime-timeout-vs-immediate` (0002), `runtime-nexttick-microtask`, `runtime-starvation` (0003), `runtime-thread-pool`, `runtime-blocking` (0004).

**V8**:
Engine JavaScript dan WebAssembly buatan Google (ditulis dalam C++) yang menjalankan kode JS di Node. Hanya tahu JS (objek, heap, GC), tidak tahu file atau socket (lesson 0001).
_Avoid_: "Node" (untuk engine-nya)

**libuv**:
Library C lintas platform yang menyediakan event loop dan thread pool untuk Node (lesson 0001).

**Binding C++**:
Kode C++ di dalam Node yang menghubungkan API JavaScript (`fs`, `net`, `crypto`) ke libuv dan sistem operasi (lesson 0001).

**I/O-bound / CPU-bound**:
I/O-bound: waktu habis untuk menunggu (database, HTTP, disk); cocok di thread utama Node. CPU-bound: waktu habis untuk menghitung; harus dipindah dari thread utama (lesson 0001).

**Event loop**:
Putaran fase di libuv yang menjalankan callback: timers → pending callbacks → idle/prepare → poll → check → close callbacks (lesson 0002).
_Avoid_: "antrean callback" (event loop bukan satu antrean)

**Fase poll**:
Fase yang mengambil event I/O baru dan menjalankan callback I/O; Node menunggu di sini saat tidak ada pekerjaan (lesson 0002).

**Fase check**:
Fase tepat setelah poll, tempat callback `setImmediate()` berjalan (lesson 0002).

**Next tick queue**:
Antrean `process.nextTick`, dikosongkan seluruhnya setelah operasi JS saat ini selesai, sebelum loop lanjut. Di CommonJS berjalan sebelum microtask (lesson 0003).

**Microtask queue**:
Antrean handler Promise (`then`/`catch`/`finally`) dan `queueMicrotask`; di Node dikosongkan tepat setelah next tick queue. Di spesifikasi ECMAScript disebut *job* (lesson 0003).
_Avoid_: macrotask (bukan istilah Node; sebut fase event loop-nya)

**Starvation**:
Kondisi fase lain (terutama poll/I/O) tidak pernah mendapat giliran karena nextTick atau microtask terus menjadwalkan dirinya sendiri (lesson 0003).

**Thread pool (libuv)**:
Kumpulan thread (default 4, `UV_THREADPOOL_SIZE`, maks 1024) untuk API tanpa versi asinkron di OS: `fs`, `dns.lookup`, crypto asinkron, `zlib` (lesson 0004).
_Avoid_: worker threads (itu `worker_threads`, lesson 0010)

**Memblokir event loop**:
Satu callback berjalan begitu lama sehingga callback lain, termasuk request lain, tidak bisa jalan. Penyebab: sync API, `JSON.parse` besar, regex ReDoS, hitungan CPU (lesson 0004).

**ReDoS**:
Regular expression Denial of Service: input khusus membuat regex rentan (mis. quantifier bersarang) butuh waktu eksponensial di thread JS (lesson 0004).

**Event loop delay**:
Selisih antara kapan callback seharusnya jalan dan kapan benar-benar jalan; diukur dengan `perf_hooks.monitorEventLoopDelay()` dalam nanodetik (lesson 0004).

## Async & error

Slug topik bank soal modul ini: `async-kombinator`, `async-concurrency` (0005), `async-unhandled`, `async-error-design` (0006), `async-eventemitter`, `async-abort` (0007).

**Promise.all**:
Menunggu semua Promise fulfilled dan mengembalikan array hasil sesuai urutan input; reject begitu satu Promise reject (fail-fast). Promise lain tetap berjalan (lesson 0005).
_Avoid_: "menjalankan paralel di thread lain"

**Promise.allSettled**:
Menunggu semua Promise selesai, apa pun hasilnya, dan mengembalikan `{status, value}` / `{status, reason}` per Promise; tidak pernah reject (lesson 0005).

**Promise.any**:
Resolve dengan Promise pertama yang fulfilled; kalau semua reject, reject dengan `AggregateError` berisi `errors` (lesson 0005).
_Avoid_: Promise.race (yang ikut reject kalau yang pertama selesai gagal)

**Concurrency limit**:
Batas jumlah pekerjaan async yang berjalan bersamaan (mis. 5 query sekaligus), dengan worker pool atau batch, supaya connection pool dan memori tidak kebanjiran (lesson 0005).
_Avoid_: rate limit (batas per satuan waktu, bukan jumlah bersamaan)

**Unhandled rejection**:
Promise yang reject tanpa handler `catch`/`await`. Sejak Node 15 default `--unhandled-rejections=throw`: tanpa listener `unhandledRejection`, ia menjadi uncaught exception dan proses keluar dengan code 1 (lesson 0006).

**uncaughtException**:
Event `process` untuk error yang lolos dari semua handler. Hanya untuk log dan cleanup sinkron lalu exit; tidak aman melanjutkan (lesson 0006).
_Avoid_: "handler global supaya server tidak pernah mati"

**Error.cause**:
Opsi `new Error(msg, { cause })` (ECMAScript 2022, Node ≥ 16.9) untuk membungkus error tingkat rendah tanpa kehilangan error aslinya (lesson 0006).

**Operational error**:
Kegagalan yang wajar terjadi saat runtime (timeout, koneksi putus, input tidak valid) dan ditangani: retry, 4xx/503, fallback (lesson 0006).

**Programmer error**:
Bug di kode (method pada `undefined`, lupa `await`). Tidak "ditangani" di runtime: log, crash, restart, perbaiki kodenya (lesson 0006).

**EventEmitter**:
Kelas dasar `node:events` untuk API berbasis event (stream, socket, server). `emit()` memanggil listener secara sinkron sesuai urutan pendaftaran; event `'error'` tanpa listener mematikan proses (lesson 0006, 0007).

**MaxListenersExceededWarning**:
Peringatan saat satu event punya lebih dari 10 listener (default). Bukan batas keras; biasanya tanda listener yang tidak dilepas (leak) (lesson 0007).
_Avoid_: menaikkan `setMaxListeners` untuk membungkam peringatan

**AbortController**:
Objek milik pemanggil untuk membatalkan pekerjaan async; `abort(reason)` memicu `controller.signal` (lesson 0007).

**AbortSignal**:
Sinyal pembatalan yang diteruskan ke `fetch` dan API Node (`{ signal }`). `AbortSignal.timeout(ms)` (Node ≥ 17.3) abort dengan `TimeoutError`; `AbortSignal.any` (Node ≥ 20.3) menggabungkan beberapa signal (lesson 0007).

## I/O & skala

## Modul & tooling

## NestJS inti

## Pipeline request

Slug topik bank soal modul ini: `pipeline-urutan`, `pipeline-binding` (0021), `pipeline-pipe`, `pipeline-validation` (0022), `pipeline-middleware`, `pipeline-guard` (0023), `pipeline-interceptor`, `pipeline-filter` (0024).

**Pipeline request**:
Urutan komponen yang dilewati satu request di NestJS: middleware → guard → interceptor (sebelum) → pipe → handler → interceptor (sesudah); exception filter menangani exception yang lolos (lesson 0021).
_Avoid_: middleware chain (untuk seluruh pipeline)

**Binding level**:
Tempat komponen dipasang: global, controller, method (pipe juga per parameter). Global lewat `useGlobal*()` tanpa DI, atau lewat token `APP_GUARD`/`APP_PIPE`/`APP_INTERCEPTOR`/`APP_FILTER` dengan DI (lesson 0021).

**Pipe**:
Class `PipeTransform` yang mengubah atau memvalidasi argumen handler sebelum handler dipanggil, mis. `ParseIntPipe`. Exception dari pipe membuat handler tidak dijalankan (lesson 0022).

**DTO**:
Data transfer object: class yang menggambarkan bentuk body request, diberi decorator class-validator dan divalidasi `ValidationPipe`. Harus class, bukan interface (lesson 0022).
_Avoid_: model, entity (untuk bentuk body)

**ValidationPipe**:
Pipe bawaan yang memvalidasi DTO dengan class-validator. Opsi utama: `whitelist` (buang properti asing), `forbidNonWhitelisted` (tolak properti asing), `transform` (jadikan instance DTO, konversi primitif) (lesson 0022).

**Guard**:
Class `CanActivate` yang memutuskan apakah request boleh ditangani handler. `false` → `ForbiddenException` (403). Tempat autentikasi dan otorisasi (lesson 0023).

**ExecutionContext**:
Argumen guard dan interceptor, turunan `ArgumentsHost`, yang memberi akses ke request (`switchToHttp()`), handler (`getHandler()`), dan class controller (`getClass()`) (lesson 0023).

**Reflector**:
Provider untuk membaca metadata yang ditempel decorator ke handler atau class; `Reflector.createDecorator()` membuat decorator bertipe, mis. `@Roles` (lesson 0023).

**Middleware (Nest)**:
Fungsi atau class `NestMiddleware` gaya Express `(req, res, next)`, dipasang di `configure(consumer)` atau `app.use()`. Context-blind: tidak tahu handler yang akan dipanggil (lesson 0023).

**Interceptor**:
Class `NestInterceptor` yang membungkus handler lewat `next.handle()` (Observable RxJS): logging durasi, bentuk response (`map`), timeout, cache (lesson 0024).

**Exception filter**:
Class `ExceptionFilter` dengan `@Catch()` yang mengubah exception yang lolos menjadi response. Diselesaikan dari level terendah (method → controller → global) (lesson 0024).

**HttpException**:
Exception bawaan Nest yang membawa status HTTP; turunannya antara lain `NotFoundException`, `ConflictException`, `ForbiddenException`. Exception lain menjadi 500 `Internal server error` (lesson 0024).

## Data & auth

## Testing & produksi
