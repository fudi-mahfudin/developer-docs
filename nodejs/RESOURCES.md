# Node.js + NestJS Interview Resources

Sumber untuk `<sup class="cite">` harus primer (ADR 0003): dokumentasi resmi, RFC, spesifikasi. Agent lesson menambahkan halaman spesifik (bukan halaman depan) beserta "Use for" ke subbagian modulnya saat fakta dipakai, dan memverifikasi URL saat itu. Buku, kursus, dan blog hanya dicantumkan di bagian "Bacaan" di bawah, tidak untuk `.cite`.

## Knowledge

### Node.js runtime

- [Dokumentasi API Node.js v24](https://nodejs.org/docs/latest-v24.x/api/)
  Use for: perilaku API yang bergantung versi (process, timers, events, stream, buffer, worker_threads, cluster, child_process, modules, `--env-file`, type stripping). Verifikasi di sini, bukan dari ingatan.
- [Node.js Learn](https://nodejs.org/en/learn)
  Use for: panduan resmi event loop, `process.nextTick`, blocking vs non-blocking, jangan memblokir event loop, backpressure di stream.
- [Dokumentasi libuv](https://docs.libuv.org/en/v1.x/)
  Use for: desain event loop, fase loop, thread pool dan `UV_THREADPOOL_SIZE`.
- [ECMAScript Language Specification (TC39)](https://tc39.es/ecma262/)
  Use for: job queue / microtask, semantik Promise.
- [V8](https://v8.dev/)
  Use for: heap, garbage collection, JIT.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  Use for: `module: nodenext`, `tsconfig`, kompilasi dengan `tsc`.
- [npm Docs](https://docs.npmjs.com/) dan [Semantic Versioning 2.0.0](https://semver.org/)
  Use for: field `package.json`, lockfile, `npm ci`, jenis dependency, range `^` vs `~`.

### NestJS dan ekosistem

- [Dokumentasi NestJS](https://docs.nestjs.com/)
  Use for: module, provider, DI, scope, dynamic module, controller, lifecycle hooks, middleware, guard, interceptor, pipe, exception filter, testing, config, logger, terminus, throttler, cache, BullMQ. Versi major (12) diverifikasi di [migration guide](https://docs.nestjs.com/migration-guide).
- [Dokumentasi Prisma](https://www.prisma.io/docs)
  Use for: `schema.prisma`, Prisma Client, `select`/`include`, `$transaction`, `prisma migrate dev` vs `deploy`.
- [TypeORM](https://typeorm.io/)
  Use for: perbandingan singkat di 0026 (`@Entity`, `Repository`).
- [Jest](https://jestjs.io/docs/getting-started)
  Use for: `jest.fn`, mock, struktur test.
- [supertest (repo resmi)](https://github.com/ladjs/supertest)
  Use for: e2e test HTTP.
- [BullMQ](https://docs.bullmq.io/)
  Use for: queue, worker, retry dan backoff.

### Standar dan keamanan

- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
  Use for: struktur JWT dan claim (0027).
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
  Use for: status code, 401 vs 403 (0028).
- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585)
  Use for: 429 Too Many Requests (0033).
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
  Use for: hashing password dengan argon2/bcrypt (0027).

### Runtime

- [Node.js Learn: Introduction to Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
  Use for: V8 di luar browser, satu proses tanpa thread per request, ribuan koneksi bersamaan (lesson 0001).
- [Node.js Learn: Overview of Blocking vs Non-Blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking)
  Use for: definisi blocking, eksekusi JS single-threaded, contoh 50 ms request dengan 45 ms I/O (lesson 0001).
- [V8 (v8.dev)](https://v8.dev/)
  Use for: V8 adalah engine JS/WebAssembly open source buatan Google, ditulis dalam C++ (lesson 0001).
- [libuv: Design overview](https://docs.libuv.org/en/v1.x/design.html)
  Use for: libuv ditulis untuk Node, I/O jaringan lewat epoll/kqueue/IOCP, I/O file lewat thread pool, langkah satu putaran loop (lesson 0001, 0002).
- [Node.js Learn: The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
  Use for: fase event loop, setTimeout vs setImmediate (main module vs callback I/O), process.nextTick dan starvation (lesson 0002, 0003).
- [Node.js v24 API: Timers, setTimeout()](https://nodejs.org/docs/latest-v24.x/api/timers.html#settimeoutcallback-delay-args)
  Use for: delay < 1 menjadi 1, tidak ada jaminan waktu persis maupun urutan (lesson 0002).
- [Node.js v24 API: process.nextTick() dan "When to use queueMicrotask() vs. process.nextTick()"](https://nodejs.org/docs/latest-v24.x/api/process.html#when-to-use-queuemicrotask-vs-processnexttick)
  Use for: next tick queue vs microtask queue, urutan CommonJS vs ESM, rekomendasi queueMicrotask (lesson 0003).
- [ECMAScript: Jobs and Host Operations to Enqueue Jobs](https://tc39.es/ecma262/#sec-jobs)
  Use for: Promise job dijalankan saat execution context stack kosong (lesson 0003).
- [Node.js v24 API: CLI, UV_THREADPOOL_SIZE](https://nodejs.org/docs/latest-v24.x/api/cli.html#uv_threadpool_sizesize)
  Use for: API yang memakai thread pool, default 4, set sebelum proses mulai (lesson 0004).
- [libuv: Thread pool work scheduling](https://docs.libuv.org/en/v1.x/threadpool.html)
  Use for: ukuran default 4, maksimum absolut 1024 (lesson 0004).
- [Node.js v24 API: DNS, Implementation considerations](https://nodejs.org/docs/latest-v24.x/api/dns.html#implementation-considerations)
  Use for: dns.lookup memakai getaddrinfo di thread pool, dns.resolve tidak (lesson 0004).
- [Node.js Learn: Don't Block the Event Loop (or the Worker Pool)](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
  Use for: sync API yang dihindari di server, JSON DOS (parse 50 MB ±1,3 detik), ReDoS (lesson 0004).
- [Node.js v24 API: perf_hooks.monitorEventLoopDelay()](https://nodejs.org/docs/latest-v24.x/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
  Use for: histogram event loop delay (nanodetik, resolution default 10 ms, samplePerIteration sejak v24.19.0) (lesson 0004).

### Async & error

- [Node.js Learn: Discover Promises in Node.js](https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs#advanced-promise-methods)
  Use for: `Promise.all`/`allSettled`/`race`/`any`, Promise lain tetap berjalan setelah `all` reject, `Promise.all` besar membebani memori (lesson 0005).
- [ECMAScript Language Specification: Promise.all](https://tc39.es/ecma262/#sec-promise.all) dan [Promise.any](https://tc39.es/ecma262/#sec-promise.any)
  Use for: semantik kombinator, `AggregateError` (lesson 0005).
- [Node.js v24 docs: CLI `--unhandled-rejections`](https://nodejs.org/docs/latest-v24.x/api/cli.html#--unhandled-rejectionsmode)
  Use for: mode `throw`/`strict`/`warn`/`warn-with-error-code`/`none`, default `throw` sejak v15.0.0 (lesson 0006).
- [Node.js v24 docs: Process, `unhandledRejection` dan `uncaughtException`](https://nodejs.org/docs/latest-v24.x/api/process.html#warning-using-uncaughtexception-correctly)
  Use for: kapan event dipancarkan, exit code 1, "not safe to resume normal operation" (lesson 0006).
- [Node.js v24 docs: Errors](https://nodejs.org/docs/latest-v24.x/api/errors.html#error-propagation-and-interception)
  Use for: try/catch tidak menangkap error callback/event, `error.cause` (v16.9.0), `AbortError` di API Node (lesson 0006, 0007).
- [ECMAScript Language Specification: InstallErrorCause](https://tc39.es/ecma262/#sec-installerrorcause)
  Use for: opsi `cause` di konstruktor `Error` (lesson 0006).
- [Node.js v24 docs: Events](https://nodejs.org/docs/latest-v24.x/api/events.html#error-events)
  Use for: event `'error'` tanpa listener, listener sinkron, `once`/`events.once`, `defaultMaxListeners` dan `MaxListenersExceededWarning` (lesson 0006, 0007).
- [Node.js v24 docs: Globals, AbortController/AbortSignal/fetch](https://nodejs.org/docs/latest-v24.x/api/globals.html#class-abortcontroller)
  Use for: `abort(reason)`, `AbortSignal.timeout` (v17.3.0), `AbortSignal.any` (v20.3.0), `fetch` tidak eksperimental sejak v21.0.0 (lesson 0007).
- [WHATWG DOM Standard: AbortSignal](https://dom.spec.whatwg.org/#interface-abortsignal)
  Use for: `AbortError` vs `TimeoutError` sebagai reason (lesson 0007).
- [Node.js v24 docs: Timers, Cancelling timers](https://nodejs.org/docs/latest-v24.x/api/timers.html#cancelling-timers)
  Use for: `timers/promises` dengan `{ signal }`, reject `AbortError` (lesson 0007).

### I/O & skala

- [Node.js v24: Stream](https://nodejs.org/docs/latest-v24.x/api/stream.html)
  Use for: lesson 0008 dan lesson 0009. Empat jenis stream, `stream.pipeline` (menghancurkan semua stream saat error), caveat `.pipe()`, async iterator, buffering dan `highWaterMark` (default 64 KiB sejak v22.0.0), `write()`/`'drain'`, `setEncoding`.
- [Node.js v24: File system](https://nodejs.org/docs/latest-v24.x/api/fs.html)
  Use for: lesson 0008. `fs.readFile` membaca seluruh isi file, `fs.createReadStream` dengan `highWaterMark` 64 KiB.
- [Node.js v24: Buffer](https://nodejs.org/docs/latest-v24.x/api/buffer.html)
  Use for: lesson 0009. Buffer, encoding, `Buffer.byteLength`.
- [Node.js Learn: Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
  Use for: lesson 0009. Angka memori dengan vs tanpa backpressure, aturan `write()`/`'drain'`.
- [Node.js v24: Worker threads](https://nodejs.org/docs/latest-v24.x/api/worker_threads.html), [Cluster](https://nodejs.org/docs/latest-v24.x/api/cluster.html), [Child process](https://nodejs.org/docs/latest-v24.x/api/child_process.html)
  Use for: lesson 0010. Worker untuk CPU-bound dan memori bersama, cluster round-robin dan state per proses, `spawn`/`exec`/`fork` dan peringatan input user di `exec`.
- [Node.js v24: CLI](https://nodejs.org/docs/latest-v24.x/api/cli.html), [v8](https://nodejs.org/docs/latest-v24.x/api/v8.html), [process.memoryUsage()](https://nodejs.org/docs/latest-v24.x/api/process.html#processmemoryusage), [events.defaultMaxListeners](https://nodejs.org/docs/latest-v24.x/api/events.html#eventsdefaultmaxlisteners)
  Use for: lesson 0011. `--max-old-space-size`, `--inspect`, `--cpu-prof` (stabil v22.4.0), `--heapsnapshot-signal`, `--heapsnapshot-near-heap-limit`, biaya `v8.writeHeapSnapshot`, batas 10 listener.
- [Node.js Learn: Using Heap Snapshot](https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot), [Understanding and Tuning Memory](https://nodejs.org/en/learn/diagnostics/memory/understanding-and-tuning-memory), [Profiling](https://nodejs.org/en/learn/getting-started/profiling)
  Use for: lesson 0011. Langkah membandingkan dua snapshot, new space vs old space, `--prof`.
- [V8 blog: Trash talk](https://v8.dev/blog/trash-talk)
  Use for: lesson 0011. Generational GC, Scavenger vs Mark-Compact.

### Paket & tooling

- [Node.js v24: Modules: CommonJS modules](https://nodejs.org/docs/latest-v24.x/api/modules.html)
  Use for: `require(esm)` beserta riwayat versinya (tanpa flag 22.12, stabil 24.15) dan `ERR_REQUIRE_ASYNC_MODULE` (lesson 0013).
- [Node.js v24: Modules: ECMAScript modules](https://nodejs.org/docs/latest-v24.x/api/esm.html)
  Use for: ekstensi wajib, interop import CommonJS (default export = `module.exports`), `import.meta.dirname`, top-level await (lesson 0013).
- [Node.js v24: Modules: Packages](https://nodejs.org/docs/latest-v24.x/api/packages.html)
  Use for: menentukan format modul (`.mjs`/`.cjs`/`"type"`, syntax detection), `"exports"` vs `"main"`, conditional exports, `ERR_PACKAGE_PATH_NOT_EXPORTED` (lesson 0013, 0014).
- [Semantic Versioning 2.0.0](https://semver.org/) dan [node-semver](https://github.com/npm/node-semver)
  Use for: arti MAJOR/MINOR/PATCH, batas persis range `^` dan `~` termasuk 0.x (lesson 0014).
- [npm Docs: package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json), [package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), [config](https://docs.npmjs.com/cli/v11/using-npm/config)
  Use for: jenis dependency (peer dipasang default sejak npm v7), tujuan lockfile, perilaku `npm ci` dan `--omit=dev`, `save-prefix` default `^` (lesson 0014).
- [Node.js v24: Modules: TypeScript](https://nodejs.org/docs/latest-v24.x/api/typescript.html)
  Use for: type stripping (default 23.6, stabil 24.12), fitur yang tidak didukung (enum, parameter properties, decorator), tsconfig tidak dibaca (lesson 0015).
- [TypeScript Handbook: Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
  Use for: `module: nodenext`, deteksi format per file, import berekstensi `.js` (lesson 0015).
- [Node.js v24: CLI `--env-file`](https://nodejs.org/docs/latest-v24.x/api/cli.html#--env-filefile) dan [process.env](https://nodejs.org/docs/latest-v24.x/api/process.html#processenv)
  Use for: memuat `.env` (20.6, stabil 24.10), prioritas environment, nilai env selalu string, `process.loadEnvFile()` (lesson 0015).
- [NestJS: SWC](https://docs.nestjs.com/recipes/swc)
  Use for: builder SWC vs `tsc` default, SWC tanpa type-check (lesson 0015).

### NestJS inti

- [NestJS docs: First steps](https://docs.nestjs.com/first-steps)
  Use for: platform-agnostic, Express default, Fastify, `@nestjs/platform-node` (NestJS 12) (0016).
- [NestJS docs: Modules](https://docs.nestjs.com/modules)
  Use for: empat properti `@Module`, shared module, re-export, `@Global` (0016, 0018).
- [NestJS docs: Providers](https://docs.nestjs.com/providers)
  Use for: definisi provider, `@Injectable`, constructor injection, singleton default (0017).
- [NestJS docs: Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)
  Use for: IoC container, injection token, `useClass`/`useValue`/`useFactory`/`useExisting`, export custom provider (0016, 0017).
- [NestJS docs: Circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency)
  Use for: `forwardRef` di provider dan module, urutan instansiasi tidak tentu (0017).
- [NestJS docs: Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
  Use for: DEFAULT/REQUEST/TRANSIENT, scope hierarchy (bubbling), ~5% latency, durable providers (0018).
- [NestJS docs: Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules)
  Use for: konvensi `forRoot`/`forFeature`/`register`, `forRootAsync`, `ConfigurableModuleBuilder` (0018).
- [NestJS docs: Controllers](https://docs.nestjs.com/controllers)
  Use for: decorator routing, `@Param`/`@Query`/`@Body`, status default 200/201, `@HttpCode`, `@Res` + passthrough, DTO sebagai class (0019).
- [NestJS docs: Lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)
  Use for: lima lifecycle hook, `enableShutdownHooks()`, urutan antar module, hook tidak jalan di request scope (0018, 0019).
- [NestJS docs: Migration guide](https://docs.nestjs.com/migration-guide)
  Use for: perubahan NestJS 12 (urutan lifecycle hook per level hierarki, route didaftarkan sesuai urutan deklarasi) (0019).

### Pipeline request

- [NestJS docs: Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
  Use for: urutan middleware → guard → interceptor → pipe → handler → interceptor → filter, urutan per level binding (0021). Diverifikasi 2026-11-14.
- [NestJS docs: Pipes](https://docs.nestjs.com/pipes)
  Use for: daftar pipe bawaan, `ParseIntPipe` dan `errorHttpStatusCode`, exceptions zone, `APP_PIPE` (0021, 0022).
- [NestJS docs: Validation](https://docs.nestjs.com/techniques/validation)
  Use for: `ValidationPipe`, `whitelist`, `forbidNonWhitelisted`, `transform`, kenapa DTO harus class (0022).
- [NestJS docs: Middleware](https://docs.nestjs.com/middleware)
  Use for: `NestMiddleware`, `configure(consumer)`, `forRoutes`/`exclude`, functional dan global middleware (0021, 0023).
- [NestJS docs: Guards](https://docs.nestjs.com/guards)
  Use for: `CanActivate`, `ExecutionContext`, `Reflector.createDecorator`, `ForbiddenException` default, `APP_GUARD` (0021, 0023).
- [NestJS docs: Interceptors](https://docs.nestjs.com/interceptors)
  Use for: `NestInterceptor`, `CallHandler`, `tap`/`map`/`timeout` (0024).
- [NestJS docs: Exception filters](https://docs.nestjs.com/exception-filters)
  Use for: respons 500 default, built-in HTTP exception, `@Catch()`, `ArgumentsHost`, `APP_FILTER` (0024).
- [NestJS docs: Migration guide v11 ke v12](https://docs.nestjs.com/migration-guide)
  Use for: `StandardSchemaValidationPipe` dan opsi `schema`, `errorCode` di `HttpException` (label NestJS ≥ 12, 0022, 0024).

### Data & auth

- [NestJS: Prisma](https://docs.nestjs.com/recipes/prisma)
  Use for: pola `PrismaService` (extends `PrismaClient`, `$connect` di `onModuleInit`), Prisma ORM 7 + driver adapter (lesson 0025).
- [Prisma ORM 7: Select fields](https://www.prisma.io/docs/orm/v7/prisma-client/queries/select-fields) · [Relation queries](https://www.prisma.io/docs/orm/v7/prisma-client/queries/relation-queries) · [Query optimization](https://www.prisma.io/docs/orm/v7/prisma-client/queries/advanced/query-optimization-performance) · [PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
  Use for: `select` vs `include`, N+1, `relationLoadStrategy`, `@prisma/adapter-pg` (lesson 0025).
- [Prisma ORM 7: Transactions](https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions) · [Development and production](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production)
  Use for: `$transaction` array vs interactive, default `maxWait` 2000 ms / `timeout` 5000 ms, `migrate dev` vs `migrate deploy` (lesson 0026).
- [Prisma (terbaru, ORM 8): Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)
  Use for: catatan versi, `$transaction` diganti `db.transaction` di Prisma ORM 8 (lesson 0025, 0026).
- [NestJS: TypeORM](https://docs.nestjs.com/data/typeorm)
  Use for: `TypeOrmModule.forFeature`, `@InjectRepository`, peringatan `synchronize: true` (lesson 0026).
- [NestJS: Passport (auth)](https://docs.nestjs.com/recipes/passport)
  Use for: strategi local dan jwt, `AuthGuard`, `@nestjs/jwt`, guard global + `@Public` (lesson 0027, 0028).
- [NestJS: Authentication](https://docs.nestjs.com/security/authentication)
  Use for: catatan versi NestJS 12, paket `@nestjs/authentication` (lesson 0027).
- [RFC 6749 §1.5: Refresh Token](https://www.rfc-editor.org/rfc/rfc6749#section-1.5)
  Use for: definisi refresh token (lesson 0027).
- [NestJS: Guards](https://docs.nestjs.com/guards) · [Execution context](https://docs.nestjs.com/fundamentals/execution-context)
  Use for: `false` → 403 "Forbidden resource", `APP_GUARD`, `Reflector.createDecorator`, `getAllAndOverride` vs `getAllAndMerge` (lesson 0028).
- RFC 7519, RFC 9110 (§15.5.2, §15.5.4), dan OWASP Password Storage Cheat Sheet: lihat "Standar dan keamanan" di atas (lesson 0027, 0028).

### Testing & produksi

- [NestJS: Testing](https://docs.nestjs.com/fundamentals/testing)
  Use for: `Test.createTestingModule`, `overrideProvider`, `get` vs `resolve`, e2e dengan `createNestApplication` + `app.init()` + supertest (0030, 0031).
- [NestJS: Migration guide v11 → v12](https://docs.nestjs.com/migration-guide)
  Use for: label versi NestJS 12: Vitest default untuk proyek ESM, Jest butuh Node ≥ 24.9; Standard Schema di `@nestjs/config`; structured params `ConsoleLogger`; API indicator Terminus lama dihapus; drain request saat shutdown (0030, 0032, 0033).
- [Jest: Mock Functions API](https://jestjs.io/docs/mock-function-api)
  Use for: `jest.fn`, `mockResolvedValue`, `mockRejectedValue`, `mockClear` vs `mockReset` (0030).
- [Prisma: Unit testing](https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing) dan [Integration testing](https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing)
  Use for: mock Prisma Client (`mockDeep`), database test di Docker, membersihkan data antar suite (0030, 0031).
- [supertest (README)](https://github.com/ladjs/supertest)
  Use for: `request(server)` mengikat port ephemeral, `.expect()`, Promise/async (0031).
- [NestJS: Configuration](https://docs.nestjs.com/techniques/configuration)
  Use for: `ConfigModule.forRoot`, `validationSchema`, env runtime vs `.env`, `getOrThrow` (0032).
- [NestJS: Logger](https://docs.nestjs.com/techniques/logger)
  Use for: `new Logger(X.name)`, level, `ConsoleLogger({ json: true })`, `useLogger`, `bufferLogs` (0032).
- [Node.js v24: AsyncLocalStorage](https://nodejs.org/docs/latest-v24.x/api/async_context.html#class-asynclocalstorage)
  Use for: correlation id per request tanpa meneruskan parameter (0032).
- [Node.js v24: process, Signal events](https://nodejs.org/docs/latest-v24.x/api/process.html#signal-events)
  Use for: handler default SIGTERM/SIGINT, SIGKILL tidak bisa ditangkap (0033).
- [NestJS: Lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)
  Use for: `enableShutdownHooks`, urutan hook shutdown (0033).
- [NestJS: Health checks (Terminus)](https://docs.nestjs.com/recipes/terminus)
  Use for: `HealthCheckService`, indicator, bentuk respons, `gracefulShutdownTimeoutMs` (0033).
- [NestJS: Rate limiting](https://docs.nestjs.com/security/rate-limiting) dan [throttler.exception.ts](https://github.com/nestjs/throttler/blob/master/src/throttler.exception.ts)
  Use for: `ThrottlerModule` (ttl ms), `ThrottlerGuard`, `@Throttle`/`@SkipThrottle`, proxy, storage; exception 429 (0033).
- [NestJS: Caching](https://docs.nestjs.com/techniques/caching)
  Use for: `CacheModule`, `CACHE_MANAGER`, ttl ms, `CacheInterceptor` hanya GET (0033).
- [NestJS: Queues](https://docs.nestjs.com/techniques/queues)
  Use for: `@nestjs/bullmq`, `BullModule.forRoot`/`registerQueue`, `@InjectQueue`, `@Processor` + `WorkerHost` (0034).
- [BullMQ: Retrying failing jobs](https://docs.bullmq.io/guide/retrying-failing-jobs) dan [Job IDs](https://docs.bullmq.io/guide/jobs/job-ids)
  Use for: `attempts`, backoff fixed/exponential, jitter; `jobId` untuk mencegah job ganda (0034).

## Bacaan lanjutan (di luar cakupan)

Topik ini sengaja tidak diajarkan di track (MISSION, Out of scope). Baca kalau codebase atau interviewer memakainya.

- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start): resolver, code-first vs schema-first.
- [NestJS microservices](https://docs.nestjs.com/microservices/basics): `@nestjs/microservices`, transport TCP/Redis/Kafka, message vs event pattern.
- [NestJS WebSocket gateways](https://docs.nestjs.com/websockets/gateways): `@WebSocketGateway`, adapter Socket.IO/ws.
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs): command, query, event bus.

## Bacaan (bukan sumber `.cite`)

Buku, kursus, dan blog yang relevan ditambahkan di sini oleh agent lesson bila dipakai sebagai bacaan pendamping.
