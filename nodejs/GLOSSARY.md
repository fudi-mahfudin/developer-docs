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

Slug topik bank soal modul ini: `io-stream-jenis`, `io-stream-pipeline` (0008), `io-backpressure`, `io-buffer` (0009), `io-worker-threads`, `io-cluster-proses` (0010), `io-memory-leak`, `io-profiling` (0011).

**Stream**:
Aliran data yang diproses per potongan (chunk), bukan sekaligus di memori. Empat jenis: Readable (sumber), Writable (tujuan), Duplex (baca dan tulis, dua sisi independen, mis. socket TCP), Transform (Duplex yang output-nya dihitung dari input, mis. gzip) (lesson 0008).
_Avoid_: pipe (sebagai nama jenis)

**stream.pipeline**:
Fungsi untuk merangkai stream yang meneruskan error dari stream mana pun ke satu callback/Promise dan menghancurkan semua stream saat gagal. Versi Promise di `node:stream/promises`. Pengganti aman untuk `.pipe()` berantai (lesson 0008).
_Avoid_: pump (library lama)

**Backpressure**:
Sinyal dari tujuan yang lebih lambat agar sumber berhenti dulu: `write()` mengembalikan `false`, penulis menunggu event `'drain'`. Diabaikan → data menumpuk di memori (lesson 0009).
_Avoid_: throttling, rate limit

**highWaterMark**:
Ambang buffer internal stream: byte untuk stream biasa, jumlah objek untuk `objectMode`. Default 64 KiB (Node ≥ 22, non-Windows) dan 16 objek. Ambang, bukan batas keras (lesson 0009).
_Avoid_: buffer size limit

**Buffer**:
Urutan byte berukuran tetap, subclass `Uint8Array`; chunk dari stream byte. Encoding default UTF-8; `Buffer.byteLength` menghitung byte, bukan karakter (lesson 0009).
_Avoid_: string (untuk data biner)

**Worker thread**:
Thread JavaScript tambahan di proses yang sama (`node:worker_threads`) untuk pekerjaan CPU-bound; bisa berbagi memori lewat `SharedArrayBuffer`. Tidak membantu I/O. Sebaiknya dipakai lewat pool (lesson 0010).
_Avoid_: libuv thread pool (itu untuk fs/crypto/zlib bawaan)

**Cluster**:
Beberapa proses Node (`node:cluster`) yang berbagi satu port server; primary membagi koneksi secara round-robin (default kecuali Windows). Memori tidak terbagi antar worker. Di Kubernetes biasanya diganti replika container (lesson 0010).
_Avoid_: multi-thread

**Child process**:
Proses lain yang dijalankan dari Node (`node:child_process`): `spawn`, `exec` (lewat shell), `execFile`, `fork` (proses Node dengan IPC) (lesson 0010).
_Avoid_: worker (untuk proses eksternal)

**Memory leak**:
Objek yang tidak dipakai lagi tapi masih terjangkau dari root, sehingga GC tidak bisa membebaskannya. Sumber umum: cache global tanpa batas, listener yang tidak dilepas, closure/timer yang menahan objek besar (lesson 0011).
_Avoid_: heap besar (belum tentu leak)

**Old space**:
Bagian heap V8 untuk objek berumur panjang yang bertahan dari beberapa GC minor. Batasnya diatur `--max-old-space-size` (MiB) (lesson 0011).
_Avoid_: total memori proses (Buffer ada di luar heap)

**Heap snapshot**:
Foto semua objek di heap V8 beserta retainer-nya. Dua snapshot dibandingkan (mode Comparison di DevTools) untuk menemukan leak. Memblokir event loop dan butuh ±2x memori heap (lesson 0011).
_Avoid_: heap dump (boleh, tapi sebut snapshot)

**CPU profile**:
Rekaman fungsi mana yang memakai waktu CPU, dari `--cpu-prof` (stabil sejak Node 22.4) atau tab Performance DevTools lewat `--inspect` (lesson 0011).
_Avoid_: heap snapshot (untuk masalah CPU)

## Modul & tooling

Slug topik bank soal modul ini: `tooling-format-modul`, `tooling-interop-esm` (0013), `tooling-semver-lockfile`, `tooling-field-package` (0014), `tooling-typescript-node`, `tooling-env-config` (0015).

**CommonJS (CJS)**:
Sistem modul asli Node: `require()` dan `module.exports`, dimuat sinkron. File `.cjs` selalu CommonJS (lesson 0013).
_Avoid_: "modul Node lama" (tanpa konteks)

**ES module (ESM)**:
Sistem modul standar JavaScript: `import`/`export`, ekstensi wajib di import relatif, mendukung top-level await. File `.mjs` selalu ESM (lesson 0013).
_Avoid_: ES6 module

**Field `"type"`**:
Field `package.json` yang menentukan format file `.js` di paket itu: `"module"` = ESM, `"commonjs"` = CommonJS. Sebaiknya selalu ditulis eksplisit (lesson 0013).

**require(esm)**:
Memuat ES module dengan `require()` dari CommonJS. Tanpa flag sejak Node 22.12, stabil sejak 24.15; gagal dengan `ERR_REQUIRE_ASYNC_MODULE` kalau modul memakai top-level await (lesson 0013).

**Top-level await**:
`await` langsung di badan modul ESM, di luar fungsi `async` (lesson 0013).

**Semver range (`^`, `~`)**:
`^1.2.3` = `>=1.2.3 <2.0.0` (minor dan patch boleh naik), `~1.2.3` = `>=1.2.3 <1.3.0` (patch saja). Untuk 0.x caret lebih ketat: `^0.2.3` = `<0.3.0` (lesson 0014).
_Avoid_: "versi terbaru" (range bukan berarti terbaru)

**Lockfile (`package-lock.json`)**:
Catatan pohon dependency persis yang terpasang, supaya setiap install identik. Di-commit (lesson 0014).

**npm ci**:
Install untuk CI: wajib lockfile, gagal kalau lockfile tidak cocok dengan `package.json`, menghapus `node_modules` lama, tidak menulis lockfile (lesson 0014).
_Avoid_: "npm install versi CI" (tanpa menyebut bedanya)

**peerDependencies**:
Paket host (mis. framework) yang harus disediakan aplikasi pemakai, biasanya untuk plugin; dipasang default sejak npm v7 (lesson 0014).

**Field `"exports"`**:
Entry point paket yang bisa banyak dan bersyarat (`import`/`require`); path lain tertutup (`ERR_PACKAGE_PATH_NOT_EXPORTED`). Mengalahkan `"main"` (lesson 0014).

**Type stripping**:
Node menjalankan `.ts` langsung dengan mengganti anotasi tipe menjadi spasi, tanpa type-check dan tanpa membaca `tsconfig.json`. Aktif default sejak Node 23.6, stabil sejak 24.12. Tidak mendukung enum, parameter properties, dan decorator tanpa transformasi (lesson 0015).
_Avoid_: "Node mendukung TypeScript penuh"

**`module: nodenext`**:
Opsi `tsconfig` yang meniru aturan modul Node: format per file dari ekstensi dan field `"type"`, import relatif ESM ditulis dengan ekstensi `.js` (lesson 0015).

**`--env-file`**:
Flag Node untuk memuat file `.env` ke `process.env` (Node ≥ 20.6, stabil sejak 24.10). Variabel yang sudah ada di environment menang (lesson 0015).
_Avoid_: dotenv (sebagai satu-satunya cara)

**Fail fast (config)**:
Memvalidasi config saat aplikasi start dan berhenti kalau tidak valid, bukan gagal di tengah request (lesson 0015).

## NestJS inti

Slug topik bank soal modul ini: `nest-kenapa`, `nest-module` (0016) · `nest-di`, `nest-custom-provider` (0017) · `nest-scope`, `nest-dynamic-module` (0018) · `nest-controller`, `nest-lifecycle` (0019).

**Module (`@Module`)**:
Unit penyusun aplikasi Nest dengan empat properti: `imports`, `providers`, `controllers`, `exports`. Provider privat untuk module-nya sampai di-export; module singleton sehingga provider yang di-export dibagi satu instance (lesson 0016).
_Avoid_: package, library (untuk module Nest)

**Feature module**:
Satu module per area bisnis (mis. `UsersModule`) berisi controller dan service-nya; root module hanya meng-import feature module (lesson 0016).

**Global module (`@Global`)**:
Module yang provider-nya bisa di-inject tanpa di-import. Hanya untuk hal yang dipakai di mana-mana (config, database) karena dependency jadi tidak terlihat (lesson 0016).

**Provider**:
Class atau nilai yang dikelola DI container Nest dan bisa di-inject sebagai dependency, biasanya class dengan `@Injectable()` (lesson 0017).
_Avoid_: service (service hanya salah satu jenis provider)

**DI container / IoC container**:
Bagian runtime Nest yang membaca constructor, mencari provider per token, membuatnya, dan menyuntikkannya. IoC (Inversion of Control): framework, bukan kode Anda, yang memegang pembuatan object (lesson 0017).

**Injection token**:
Kunci pencarian provider di container: class, string, `Symbol`, atau enum. Interface tidak bisa jadi token karena hilang saat kompilasi; token non-class di-inject dengan `@Inject(TOKEN)` (lesson 0017).

**Custom provider**:
Pendaftaran provider dengan `provide` + salah satu dari `useClass` (pilih class), `useValue` (nilai jadi, mis. mock), `useFactory` (hasil fungsi, argumen dari `inject`), atau `useExisting` (alias) (lesson 0017).

**`forwardRef`**:
Utilitas untuk memecah circular dependency antar provider atau antar module; dipasang di kedua sisi, dan urutan instansiasinya tidak dapat ditentukan (lesson 0017).

**Scope provider**:
Umur instance provider: `DEFAULT` (singleton, satu untuk seluruh aplikasi), `REQUEST` (baru per request), `TRANSIENT` (baru per pemakai) (lesson 0018).

**Scope bubbling**:
Request scope merambat ke atas: class yang meng-inject provider request-scoped ikut dibuat ulang per request (lesson 0018).

**Dynamic module**:
Module yang dikonfigurasi saat dipakai lewat method static yang mengembalikan `DynamicModule` (object `@Module` + properti `module`). Konvensi: `forRoot` (sekali, dipakai ulang), `forFeature` (menyesuaikan konfigurasi `forRoot` per feature), `register` (khusus pemanggil), plus versi async seperti `forRootAsync` (lesson 0018).

**Controller**:
Class dengan `@Controller('prefix')` yang menerima request HTTP lewat decorator `@Get`, `@Post`, dst., mengambil input dengan `@Param`, `@Query`, `@Body`, lalu memanggil service. Status default 200, POST 201, ubah dengan `@HttpCode` (lesson 0019).

**DTO (Data Transfer Object)**:
Class yang mendeskripsikan bentuk data masuk/keluar, mis. body request. Ditulis sebagai class, bukan interface, supaya metadata-nya ada saat runtime (lesson 0019).

**Lifecycle hooks**:
Method yang dipanggil Nest pada fase aplikasi: `onModuleInit`, `onApplicationBootstrap` (start), `onModuleDestroy`, `beforeApplicationShutdown`, `onApplicationShutdown` (berhenti). Shutdown hook butuh `enableShutdownHooks()` untuk sinyal; NestJS 12 memanggil hook per level hierarki, module terdalam lebih dulu (lesson 0019).

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

Slug topik bank soal 0030–0034 (prefix `prod-`): `prod-unit-test`, `prod-mock` (0030) · `prod-e2e`, `prod-jenis-test` (0031) · `prod-config`, `prod-logging` (0032) · `prod-shutdown-health`, `prod-throttle-cache` (0033) · `prod-bullmq`, `prod-retry-idempotency` (0034).

**Testing module**:
DI container kecil untuk test, dibuat dengan `Test.createTestingModule({...})` lalu `await compile()`; provider diambil dengan `get()` (atau `resolve()` untuk scope REQUEST/TRANSIENT). Provider bisa diganti dengan `{ provide, useValue }` atau `.overrideProvider(token).useValue(mock)` (lesson 0030).
_Avoid_: test bed, harness

**Mock function**:
Fungsi palsu dari `jest.fn()` yang mencatat panggilan dan argumennya; hasilnya diatur dengan `mockResolvedValue` / `mockRejectedValue` / `mockReturnValue` (lesson 0030).
_Avoid_: stub, fake (tanpa konteks)

**E2E test**:
Test yang menyalakan aplikasi utuh (`createNestApplication()` + `app.init()`) dan mengirim request HTTP lewat supertest ke `app.getHttpServer()`; ditutup dengan `app.close()` (lesson 0031).
_Avoid_: functional test, acceptance test

**Database test**:
Database khusus untuk integration/e2e test (mis. Postgres di Docker), terpisah dari production dan development, dengan data dibersihkan antar suite (lesson 0031).
_Avoid_: staging DB

**Validasi env**:
`ConfigModule.forRoot({ validationSchema })` memeriksa environment variable saat bootstrap dan menggagalkan start kalau ada yang wajib hilang. NestJS 12 menerima Standard Schema (Zod, Valibot, ArkType; Joi ≥ 18) (lesson 0032).
_Avoid_: config check

**Structured logging**:
Setiap entri log ditulis sebagai objek dengan field tetap (biasanya JSON satu baris) supaya bisa difilter mesin; `ConsoleLogger({ json: true })` atau Pino (lesson 0032).
_Avoid_: log teks bebas

**Correlation id**:
Id unik per request (header `X-Request-Id` atau UUID baru) yang ditempel di setiap baris log request itu; di Node disimpan lewat `AsyncLocalStorage` (lesson 0032).
_Avoid_: trace id (konsep tracing yang lebih luas), session id

**Graceful shutdown**:
Saat menerima SIGTERM, aplikasi berhenti menerima pekerjaan baru, menyelesaikan yang sedang berjalan, dan menutup koneksi sebelum keluar. Di NestJS butuh `app.enableShutdownHooks()`; hook: `onModuleDestroy` → `beforeApplicationShutdown` → `onApplicationShutdown(signal)` (lesson 0033).
_Avoid_: soft restart

**Health check**:
Endpoint yang dipanggil orchestrator/load balancer untuk memutuskan apakah instance boleh menerima traffic; di NestJS dengan `@nestjs/terminus` (`HealthCheckService`, indicator), unhealthy → 503 (lesson 0033).
_Avoid_: ping (tanpa konteks)

**Throttling**:
Rate limiting di NestJS dengan `@nestjs/throttler`: `{ ttl (ms), limit }` per client, `ThrottlerGuard` global, 429 saat terlewati; storage default per proses (lesson 0033).
_Avoid_: debounce

**Background job**:
Pekerjaan yang dipindah dari siklus request ke queue dan dikerjakan worker; di NestJS dengan `@nestjs/bullmq` (`@InjectQueue` + `queue.add`, `@Processor` + `WorkerHost.process`) (lesson 0034).
_Avoid_: cron job (itu terjadwal, bukan dipicu request)

**Idempotent (job)**:
Handler yang bila dijalankan dua kali berefek sama dengan sekali, wajib karena retry bisa mengulang job; dibantu penanda di database atau `jobId` unik (lesson 0034).
_Avoid_: exactly-once
