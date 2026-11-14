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

## Bacaan lanjutan (di luar cakupan)

Topik ini sengaja tidak diajarkan di track (MISSION, Out of scope). Baca kalau codebase atau interviewer memakainya.

- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start): resolver, code-first vs schema-first.
- [NestJS microservices](https://docs.nestjs.com/microservices/basics): `@nestjs/microservices`, transport TCP/Redis/Kafka, message vs event pattern.
- [NestJS WebSocket gateways](https://docs.nestjs.com/websockets/gateways): `@WebSocketGateway`, adapter Socket.IO/ws.
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs): command, query, event bus.

## Bacaan (bukan sumber `.cite`)

Buku, kursus, dan blog yang relevan ditambahkan di sini oleh agent lesson bila dipakai sebagai bacaan pendamping.
