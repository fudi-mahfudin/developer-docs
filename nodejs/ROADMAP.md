# Roadmap — Interview backend Node.js + NestJS (mid-level)

**Profil:** developer yang pernah membuat API Express sederhana dan memakai TypeScript, tetapi belum mempelajari internals Node dan NestJS secara terstruktur
**Format interview yang diantisipasi:** pertanyaan konsep lisan + live coding kecil
**Alokasi:** self-paced, tanpa deadline. 36 lesson ±20 menit, **tanpa lab**: baca, diagram, contoh kode pendek, kuis, latihan lisan dan "tulis kode" di kertas (ADR 0003)
**Versi:** Node.js 24 LTS, NestJS 12
**Istilah:** [GLOSSARY.md](./GLOSSARY.md) · **Indeks lesson:** [index.html](./index.html)

| Modul | Lesson | Fokus |
|---|---|---|
| Runtime | 0001–0004 | V8 + libuv, fase event loop, `nextTick` vs microtask (tebak urutan output), thread pool, hal yang memblokir event loop |
| Async & error | 0005–0007 | Kombinator Promise, concurrency, error handling async, EventEmitter, `AbortController` |
| I/O & skala | 0008–0011 | Streams, backpressure, Buffer, worker threads vs cluster vs child process, memory leak dan profiling |
| **Review 1** | 0012 | Runtime + Async & error (tertunda satu modul) |
| Modul & tooling | 0013–0015 | CommonJS vs ESM, `package.json` dan semver, TypeScript di Node, env var dan config |
| NestJS inti | 0016–0019 | `@Module`, provider dan DI, scope dan dynamic module, controller dan lifecycle hooks |
| **Review 2** | 0020 | I/O & skala + Modul & tooling |
| Pipeline request | 0021–0024 | Urutan pipeline (susun urutan), pipe dan `ValidationPipe`, guard vs middleware, interceptor dan exception filter |
| Data & auth | 0025–0028 | Prisma dan `PrismaService`, transaksi dan migrasi (+ TypeORM singkat), JWT + Passport, RBAC |
| **Review 3** | 0029 | NestJS inti + Pipeline request |
| Testing & produksi | 0030–0034 | Unit test (Jest), e2e (supertest), config dan logging, shutdown/health/throttle/cache, BullMQ |
| **Review 4** | 0035 | Data & auth + Testing & produksi + topik lemah Review 1–3 |
| Penutup | 0036 | Mock interview tiga babak ±45 menit (**opsional, pengecualian durasi**) |

Menjelang interview: baca ulang dua reference di `reference/` (urutan event loop, pipeline request NestJS), lalu ulangi mock 0036.
