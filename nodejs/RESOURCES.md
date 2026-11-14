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
