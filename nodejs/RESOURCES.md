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

### I/O & skala

### Modul & tooling

### NestJS inti

### Pipeline request

### Data & auth

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
