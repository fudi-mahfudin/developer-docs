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

### Modul & tooling

### NestJS inti

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

### Testing & produksi

## Bacaan lanjutan (di luar cakupan)

Topik ini sengaja tidak diajarkan di track (MISSION, Out of scope). Baca kalau codebase atau interviewer memakainya.

- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start): resolver, code-first vs schema-first.
- [NestJS microservices](https://docs.nestjs.com/microservices/basics): `@nestjs/microservices`, transport TCP/Redis/Kafka, message vs event pattern.
- [NestJS WebSocket gateways](https://docs.nestjs.com/websockets/gateways): `@WebSocketGateway`, adapter Socket.IO/ws.
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs): command, query, event bus.

## Bacaan (bukan sumber `.cite`)

Buku, kursus, dan blog yang relevan ditambahkan di sini oleh agent lesson bila dipakai sebagai bacaan pendamping.
