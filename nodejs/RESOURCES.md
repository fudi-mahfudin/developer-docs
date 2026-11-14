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
