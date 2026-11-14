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
