Status: ready-for-agent

# Spec: Track Node.js + NestJS untuk interview backend (lesson ±20 menit, self-paced)

Hasil grilling 2026-11-14. Konvensi umum ada di `docs/adr/0003-konvensi-materi-baru.md`. Spec ini hanya mencatat hal yang khusus untuk track Node.js.

## Problem Statement

Repo sudah punya track dotnet, FHIR, dan system design. Belum ada track yang membahas Node.js dan NestJS secara terstruktur, padahal backend Node/NestJS adalah stack yang paling dekat dengan pengalaman pemilik repo. Interview backend Node mid-level biasanya menanyakan internals runtime (event loop, streams, async) dan cara kerja framework (DI, pipeline request NestJS), lalu meminta live coding kecil.

## Solution

Track baru `nodejs/`: 36 lesson ±20 menit dalam 9 modul tematik ditambah 4 review tertunda. Track ini self-paced dan berisi **konsep + latihan menulis kode di kertas**, tanpa lab atau proyek yang dijalankan. Urutannya dari runtime Node, ke async dan I/O, ke modul dan tooling, lalu NestJS (inti, pipeline request, data dan auth, testing dan produksi), dan diakhiri mock interview.

## Keputusan

- **Tujuan:** lolos interview backend Node.js + NestJS mid-level, yaitu menjawab pertanyaan konsep dan mengerjakan live coding kecil. Interview menjadi tujuan di MISSION, tetapi tanpa tanggal.
- **Satu track** bernama `nodejs/`. Node runtime dibahas dulu, NestJS dibangun di atasnya. Track bisa dibaca mandiri tanpa rujukan ke track dotnet, FHIR, atau sysdesign.
- **Level awal:** pembaca diasumsikan sudah pernah membuat API Express sederhana dan memakai TypeScript. Sintaks JS, `npm install`, Express hello world, dan Promise dasar **tidak** diajarkan. Track mulai dari "kenapa Node bekerja seperti ini".
- **Tanpa lab.** Contoh kode pendek untuk dibaca (sebaiknya ≤ 20 baris per blok). Live coding dilatih lewat soal `oral` bertipe **"tulis kode"**: prompt meminta kode (mis. "tulis guard yang mengecek role"), `sample` berisi jawaban kode, dan `checklist` berisi poin penilaian. Setiap modul NestJS (0016 ke atas, kecuali review) memuat minimal satu soal oral "tulis kode".
- **Versi:** Node.js 24 LTS dan NestJS major stabil terbaru. Versi NestJS diverifikasi di dokumentasi resmi saat prefactor, lalu dicatat di MISSION. Fitur yang butuh versi tertentu diberi label versi di tempat fitur itu disebut (mis. "Node ≥ 22.12"). Agent lesson memverifikasi perilaku yang bergantung versi di dokumentasi Node v24, bukan dari ingatan.
- **ORM:** Prisma menjadi contoh utama, dengan pola `PrismaService` (extends `PrismaClient`, di-inject sebagai provider, connect di `onModuleInit`). TypeORM hanya muncul sebagai bagian perbandingan singkat di 0026 (`@Entity`, `Repository`, `@InjectRepository`, bedanya dengan Prisma), supaya tidak blank kalau codebase atau interviewer memakainya.
- **Testing di materi:** Jest sebagai contoh utama (bawaan Nest CLI), ditambah satu kalimat bahwa Vitest juga bisa. Test repo di `tests/nodejs/` tetap memakai `node --test` seperti track lain.
- **Topik lanjutan:** BullMQ (`@nestjs/bullmq`) mendapat satu lesson (0034). GraphQL, `@nestjs/microservices` (TCP/Redis/Kafka transport), WebSocket gateway, dan CQRS module **di luar cakupan**. Semuanya cukup disebut di `RESOURCES.md` sebagai bacaan lanjutan.
- **Irisan dengan system design:** caching, rate limiting, queue, dan idempotency dibahas dari sisi **cara melakukannya di Node/NestJS** (`CacheModule`, `@nestjs/throttler`, BullMQ). Konsepnya dijelaskan singkat 1–2 kalimat di tempat, tidak diulang penuh dan tidak dirujuk ke track sysdesign.
- **Latihan urutan** (`order.js`) dipakai untuk dua hal yang klasik di interview:
  - **Tebak urutan output** event loop (0003): kode berisi `console.log`, `setTimeout`, `setImmediate`, `process.nextTick`, `Promise.then`; pembaca menyusun urutan baris output.
  - **Urutan pipeline request NestJS** (0021): middleware → guard → interceptor (sebelum) → pipe → handler → interceptor (sesudah) → exception filter.
- **Diagram:** setiap lesson konsep memuat minimal satu diagram (`.flow` untuk alur linear, `svg.diagram` untuk alur bercabang) **atau** minimal satu blok kode `<pre><code>`. Lesson NestJS (0016–0034) wajib punya minimal satu blok kode.
- **Latihan per lesson:** ≥ 4 mc + ≥ 1 oral (ADR 0003).
- **Pengecualian durasi:** 0036 mock interview ±45 menit, opsional. Memakai `timer.js` dengan tiga segmen `Konsep Node:15,Konsep NestJS:15,Live coding:15`.
- **Sumber primer** untuk `.cite`:
  - Dokumentasi Node.js v24 (`nodejs.org/docs/latest-v24.x/api/`) dan panduan resmi Node.js Learn (event loop, blocking vs non-blocking, backpressure, dan topik sejenis).
  - Dokumentasi libuv (`docs.libuv.org`), spesifikasi ECMAScript (TC39, untuk job queue/microtask), dan dokumentasi V8 (`v8.dev`).
  - `docs.nestjs.com`, dokumentasi Prisma, `typeorm.io`, `jestjs.io`, repo resmi supertest, `docs.bullmq.io`, `docs.npmjs.com`, `semver.org`, dan dokumentasi TypeScript.
  - RFC 7519 (JWT), RFC 9110 (HTTP semantics, 401 vs 403), RFC 6585 (429), dan OWASP Password Storage Cheat Sheet (hashing password).
  - Buku, kursus, dan blog hanya dicantumkan di `RESOURCES.md`.

## Urutan lesson

| # | File | Modul | Isi | ±menit |
|---|---|---|---|---|
| 0001 | `0001-anatomi-node.html` | Runtime | V8 + libuv + binding C++, JS single-threaded vs I/O asinkron, kenapa Node cocok untuk I/O-bound dan bukan CPU-bound | 20 |
| 0002 | `0002-fase-event-loop.html` | Runtime | Fase event loop (timers, pending callbacks, poll, check, close callbacks), `setTimeout` vs `setImmediate`, kapan urutannya tidak deterministik | 20 |
| 0003 | `0003-microtask-dan-nexttick.html` | Runtime | Antrean `process.nextTick` vs microtask Promise, `queueMicrotask`, starvation; latihan tebak urutan output (`order.js`) | 20 |
| 0004 | `0004-thread-pool-dan-blocking.html` | Runtime | libuv thread pool (fs, `dns.lookup`, crypto, zlib), `UV_THREADPOOL_SIZE`, hal yang memblokir event loop (sync API, `JSON.parse` besar, regex), mengukur event loop delay | 20 |
| 0005 | `0005-kombinator-promise.html` | Async & error | `Promise.all`/`allSettled`/`race`/`any`, `await` berurutan vs paralel, `await` di dalam loop, membatasi concurrency | 20 |
| 0006 | `0006-error-handling-async.html` | Async & error | try/catch di async, unhandled rejection (perilaku default sejak Node 15), `uncaughtException`, event `'error'` di EventEmitter, `Error.cause`, operational vs programmer error | 20 |
| 0007 | `0007-eventemitter-dan-abort.html` | Async & error | EventEmitter (listener, `once`, peringatan leak), `AbortController`/`AbortSignal.timeout`, membatalkan `fetch` dan pekerjaan async | 20 |
| 0008 | `0008-streams.html` | I/O & skala | Readable/Writable/Duplex/Transform, `stream.pipeline`, stream vs `readFile` untuk file besar, async iterator di stream | 20 |
| 0009 | `0009-backpressure-dan-buffer.html` | I/O & skala | `highWaterMark`, `write()` mengembalikan `false` + event `'drain'`, Buffer dan encoding, kenapa `pipe` tanpa error handling berbahaya | 20 |
| 0010 | `0010-worker-cluster-child-process.html` | I/O & skala | `worker_threads` vs `cluster` vs `child_process`, pekerjaan CPU-bound, cluster vs banyak replika container | 20 |
| 0011 | `0011-memory-leak-dan-profiling.html` | I/O & skala | Heap V8, `--max-old-space-size`, sumber leak umum (cache global, closure, listener), heap snapshot, `--inspect`, `--cpu-prof` | 20 |
| 0012 | `0012-review-runtime-async.html` | Review 1 | pool 0001–0007 | 20 |
| 0013 | `0013-commonjs-vs-esm.html` | Paket & tooling | `require` vs `import`, field `type`, `.mjs`/`.cjs`, interop, `require(esm)` (beri label versi), top-level await | 20 |
| 0014 | `0014-package-json-dan-dependency.html` | Paket & tooling | Field `exports`/`main`, semver `^` vs `~`, lockfile, `npm ci`, dependencies vs devDependencies vs peerDependencies | 20 |
| 0015 | `0015-typescript-dan-config.html` | Paket & tooling | TypeScript di Node (build dengan `tsc` vs type stripping native, beri label versi), `module: nodenext`, env var, `--env-file`, config per environment | 20 |
| 0016 | `0016-nestjs-dan-module.html` | NestJS inti | Kenapa NestJS (struktur, DI, platform Express/Fastify), `@Module` (imports, providers, controllers, exports), feature module, global module | 20 |
| 0017 | `0017-provider-dan-dependency-injection.html` | NestJS inti | Provider, DI container, injection token, `useClass`/`useValue`/`useFactory`/`useExisting`, circular dependency + `forwardRef` | 20 |
| 0018 | `0018-scope-dan-dynamic-module.html` | NestJS inti | Scope DEFAULT/REQUEST/TRANSIENT, scope yang merambat ke atas (bubbling) dan biayanya, dynamic module `forRoot`/`forFeature`/`register` | 20 |
| 0019 | `0019-controller-dan-lifecycle.html` | NestJS inti | Controller, decorator routing, `@Param`/`@Query`/`@Body`, status code, lifecycle hooks (`onModuleInit` sampai `onApplicationShutdown`) | 20 |
| 0020 | `0020-review-io-tooling.html` | Review 2 | pool 0008–0011, 0013–0015 | 20 |
| 0021 | `0021-urutan-pipeline-request.html` | Pipeline request | Middleware → guard → interceptor → pipe → handler → interceptor → exception filter; binding global/controller/method; latihan susun urutan (`order.js`) | 20 |
| 0022 | `0022-pipe-dan-validation.html` | Pipeline request | Built-in pipe (`ParseIntPipe` dll.), `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`), DTO dengan class-validator/class-transformer; latihan tulis DTO | 20 |
| 0023 | `0023-guard-dan-middleware.html` | Pipeline request | `CanActivate`, `ExecutionContext`, `Reflector` + custom decorator, kenapa guard dan bukan middleware untuk otorisasi; latihan tulis guard | 20 |
| 0024 | `0024-interceptor-dan-exception-filter.html` | Pipeline request | Interceptor (logging, transform response, timeout; RxJS seperlunya), `HttpException` dan built-in exception, custom exception filter, format error yang konsisten | 20 |
| 0025 | `0025-prisma-dan-prismaservice.html` | Data & auth | `schema.prisma`, Prisma Client, `PrismaService` sebagai provider, `select`/`include`, masalah N+1 | 20 |
| 0026 | `0026-transaksi-migrasi-typeorm.html` | Data & auth | `$transaction` (array vs interactive), `prisma migrate dev` vs `deploy`, bagian perbandingan TypeORM (`@Entity`, `Repository`, `@InjectRepository`) | 20 |
| 0027 | `0027-autentikasi-jwt-passport.html` | Data & auth | Hashing password (bcrypt/argon2), JWT (RFC 7519) access vs refresh token, `@nestjs/jwt`, strategi Passport (local, jwt), `AuthGuard` | 20 |
| 0028 | `0028-otorisasi-role.html` | Data & auth | RBAC dengan `@Roles` + `RolesGuard` + `Reflector`, guard global + `@Public`, cek kepemilikan resource, 401 vs 403; latihan tulis RolesGuard | 20 |
| 0029 | `0029-review-nestjs-pipeline.html` | Review 3 | pool 0016–0019, 0021–0024 | 20 |
| 0030 | `0030-unit-test-nestjs.html` | Testing & produksi | Jest, `Test.createTestingModule`, `overrideProvider`, mock `PrismaService` dengan `jest.fn`; latihan tulis unit test service | 20 |
| 0031 | `0031-e2e-test.html` | Testing & produksi | E2E dengan supertest, `app.init()`, database untuk test, unit vs integration vs e2e | 20 |
| 0032 | `0032-config-dan-logging.html` | Testing & produksi | `@nestjs/config` + validasi env, `Logger` bawaan, structured logging (pino singkat), correlation id | 20 |
| 0033 | `0033-shutdown-health-throttle-cache.html` | Testing & produksi | Graceful shutdown (SIGTERM, `enableShutdownHooks`), health check `@nestjs/terminus`, `@nestjs/throttler`, `CacheModule` singkat | 20 |
| 0034 | `0034-background-job-bullmq.html` | Testing & produksi | Kenapa job dipindah ke luar request, `@nestjs/bullmq` (producer, processor), retry + backoff, idempotency singkat | 20 |
| 0035 | `0035-review-data-testing.html` | Review 4 | pool 0025–0028, 0030–0034 + topik lemah Review 1–3 (`data-topics`) | 25 |
| 0036 | `0036-mock-interview.html` | Penutup | Mock interview tiga babak, `timer.js` 3 segmen; **opsional, ±45 menit, pengecualian durasi** | 45 |

## MISSION (`nodejs/MISSION.md`)

**Mission:** Lolos interview backend developer Node.js + NestJS mid-level.

**Success looks like:**
- Bisa menjelaskan fase event loop serta beda `nextTick`, microtask, dan macrotask, lalu menebak urutan output potongan kode async dengan benar
- Bisa menjelaskan kapan event loop terblokir, peran libuv thread pool, dan memilih antara worker threads, cluster, atau child process
- Bisa menjelaskan streams dan backpressure, dan kapan memakainya dibanding membaca seluruh data ke memori
- Bisa menjelaskan DI container NestJS, scope provider, dan dynamic module dalam < 1 menit per topik
- Bisa menyebut urutan pipeline request NestJS dan memilih middleware, guard, interceptor, pipe, atau filter untuk kebutuhan tertentu
- Bisa menulis di kertas, tanpa IDE: DTO + validation, guard berbasis role, service dengan Prisma, dan unit test-nya

**Constraints:** self-paced, lesson ±20 menit (ADR 0003), konsep + latihan menulis kode di kertas tanpa lab, Node 24 LTS + NestJS major terbaru, Bahasa Indonesia dengan istilah teknis bahasa Inggris.

**Out of scope:** dasar JS/TS dan Express pemula, GraphQL, `@nestjs/microservices`, WebSocket gateway, CQRS module, deployment/infra (Docker, Kubernetes), proyek yang dijalankan, cerita STAR/behavioral.

## Reference (`nodejs/reference/`)

Cheat sheet untuk dibaca ulang menjelang interview:
1. `urutan-event-loop.html`: fase event loop, prioritas `nextTick` → microtask → fase berikutnya, dan 3–5 soal tebak urutan output dengan jawaban di `<details>`.
2. `pipeline-request-nestjs.html`: urutan eksekusi pipeline, ditambah tabel "kebutuhan → pakai yang mana" (otorisasi → guard, validasi → pipe, bentuk response → interceptor, format error → filter, dan seterusnya).

## Format lesson

Mengikuti format lesson sysdesign (lihat `sysdesign/lessons/0006-load-balancer.html`):
- Kicker: `Lesson NNNN · Node.js · Modul <nama> · ±N menit`.
- Satu `<div class="win">` per lesson.
- Sitasi `<sup class="cite">` dinomori per lesson, dengan daftar "Sumber" di akhir.
- `<nav class="lesson-nav">` ke lesson sebelum dan sesudah (0001 dan 0036 juga ke `../index.html`).
- Script: `../../assets/bank.js`, `../assets/questions/NNNN.js`, lalu komponen yang dipakai.
- Review: `review.js`, `data-mc` = jumlah topik kuis di pool, `data-oral="3"`, aturan lulus sama dengan sysdesign/FHIR.
- Slug topik diberi prefix per modul: `runtime-`, `async-`, `io-`, `tooling-`, `nest-`, `pipeline-`, `data-`, `prod-`, `mock-`.

## Testing

- `tests/nodejs/track.test.js` (port dari `tests/sysdesign/track.test.js`): daftar lesson diturunkan dari `nodejs/index.html`; setiap lesson punya bank dengan ≥ 4 mc dan ≥ 1 oral; setiap `lesson` dan prefix `id` cocok dengan nomor file; review = 0012, 0020, 0029, 0035; 0036 bertanda opsional; kicker `Lesson NNNN · Node.js · `; tidak ada tautan ke `dotnet/`, `fhir/`, atau `sysdesign/`; tidak ada deadline.
- `tests/nodejs/modul-<slug>.test.js` per modul berisi:
  - kata kunci cakupan (tabel di atas)
  - minimal satu `.cite` per lesson konsep
  - minimal satu diagram atau `<pre><code>` per lesson konsep, dan `<pre><code>` wajib di 0016–0034
  - satu soal oral "tulis kode" per modul NestJS (soal oral yang `sample`-nya memuat `<pre>` atau `<code>`)
  - `order.js` di 0003 dan 0021
- `tests/nodejs/review.test.js`: pool dan `data-mc` setiap review.
- Loader: `forTrack("nodejs")` di `tests/helpers.js`.

## Out of scope

Lab atau proyek yang dijalankan, komponen JS baru, perubahan track dotnet/FHIR/sysdesign, rujukan silang ke track lain, dan topik yang ada di daftar out of scope MISSION.
