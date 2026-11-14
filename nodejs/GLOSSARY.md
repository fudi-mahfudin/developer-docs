# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

## I/O & skala

## Modul & tooling

## NestJS inti

## Pipeline request

## Data & auth

## Testing & produksi

Slug topik bank soal 0030–0034 (prefix `prod-`): `prod-unit-test`, `prod-mock` (0030) · `prod-e2e`, `prod-jenis-test` (0031) · `prod-config`, `prod-logging` (0032) · `prod-shutdown-health`, `prod-throttle-cache` (0033) · `prod-bullmq`, `prod-retry-idempotency` (0034).

**Testing module**:
DI container kecil untuk test, dibuat dengan `Test.createTestingModule({...})` lalu `await compile()`; provider diambil dengan `get()` (atau `resolve()` untuk scope REQUEST/TRANSIENT). Provider bisa diganti dengan `{ provide, useValue }` atau `.overrideProvider(token).useValue(mock)` (lesson 0030).
_Avoid_: test bed, harness

**Mock function**:
Fungsi palsu dari `jest.fn()` yang mencatat panggilan dan argumennya; hasilnya diatur dengan `mockResolvedValue` / `mockRejectedValue` / `mockReturnValue` (lesson 0030).
_Avoid_: stub, fake (tanpa konteks)

**E2E test**:
Test yang menyalakan aplikasi utuh (`createNestApplication()` + `app.init()`) dan mengirim request HTTP lewat supertest ke `app.getHttpServer()`; ditutup dengan `app.close()` (lesson 0031).
_Avoid_: functional test, acceptance test

**Database test**:
Database khusus untuk integration/e2e test (mis. Postgres di Docker), terpisah dari production dan development, dengan data dibersihkan antar suite (lesson 0031).
_Avoid_: staging DB

**Validasi env**:
`ConfigModule.forRoot({ validationSchema })` memeriksa environment variable saat bootstrap dan menggagalkan start kalau ada yang wajib hilang. NestJS 12 menerima Standard Schema (Zod, Valibot, ArkType; Joi ≥ 18) (lesson 0032).
_Avoid_: config check

**Structured logging**:
Setiap entri log ditulis sebagai objek dengan field tetap (biasanya JSON satu baris) supaya bisa difilter mesin; `ConsoleLogger({ json: true })` atau Pino (lesson 0032).
_Avoid_: log teks bebas

**Correlation id**:
Id unik per request (header `X-Request-Id` atau UUID baru) yang ditempel di setiap baris log request itu; di Node disimpan lewat `AsyncLocalStorage` (lesson 0032).
_Avoid_: trace id (konsep tracing yang lebih luas), session id

**Graceful shutdown**:
Saat menerima SIGTERM, aplikasi berhenti menerima pekerjaan baru, menyelesaikan yang sedang berjalan, dan menutup koneksi sebelum keluar. Di NestJS butuh `app.enableShutdownHooks()`; hook: `onModuleDestroy` → `beforeApplicationShutdown` → `onApplicationShutdown(signal)` (lesson 0033).
_Avoid_: soft restart

**Health check**:
Endpoint yang dipanggil orchestrator/load balancer untuk memutuskan apakah instance boleh menerima traffic; di NestJS dengan `@nestjs/terminus` (`HealthCheckService`, indicator), unhealthy → 503 (lesson 0033).
_Avoid_: ping (tanpa konteks)

**Throttling**:
Rate limiting di NestJS dengan `@nestjs/throttler`: `{ ttl (ms), limit }` per client, `ThrottlerGuard` global, 429 saat terlewati; storage default per proses (lesson 0033).
_Avoid_: debounce

**Background job**:
Pekerjaan yang dipindah dari siklus request ke queue dan dikerjakan worker; di NestJS dengan `@nestjs/bullmq` (`@InjectQueue` + `queue.add`, `@Processor` + `WorkerHost.process`) (lesson 0034).
_Avoid_: cron job (itu terjadwal, bukan dipicu request)

**Idempotent (job)**:
Handler yang bila dijalankan dua kali berefek sama dengan sekali, wajib karena retry bisa mengulang job; dibantu penanda di database atau `jobId` unik (lesson 0034).
_Avoid_: exactly-once
