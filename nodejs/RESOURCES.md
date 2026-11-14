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
