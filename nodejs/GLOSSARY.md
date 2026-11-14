# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

Slug topik bank soal modul ini: `async-kombinator`, `async-concurrency` (0005), `async-unhandled`, `async-error-design` (0006), `async-eventemitter`, `async-abort` (0007).

**Promise.all**:
Menunggu semua Promise fulfilled dan mengembalikan array hasil sesuai urutan input; reject begitu satu Promise reject (fail-fast). Promise lain tetap berjalan (lesson 0005).
_Avoid_: "menjalankan paralel di thread lain"

**Promise.allSettled**:
Menunggu semua Promise selesai, apa pun hasilnya, dan mengembalikan `{status, value}` / `{status, reason}` per Promise; tidak pernah reject (lesson 0005).

**Promise.any**:
Resolve dengan Promise pertama yang fulfilled; kalau semua reject, reject dengan `AggregateError` berisi `errors` (lesson 0005).
_Avoid_: Promise.race (yang ikut reject kalau yang pertama selesai gagal)

**Concurrency limit**:
Batas jumlah pekerjaan async yang berjalan bersamaan (mis. 5 query sekaligus), dengan worker pool atau batch, supaya connection pool dan memori tidak kebanjiran (lesson 0005).
_Avoid_: rate limit (batas per satuan waktu, bukan jumlah bersamaan)

**Unhandled rejection**:
Promise yang reject tanpa handler `catch`/`await`. Sejak Node 15 default `--unhandled-rejections=throw`: tanpa listener `unhandledRejection`, ia menjadi uncaught exception dan proses keluar dengan code 1 (lesson 0006).

**uncaughtException**:
Event `process` untuk error yang lolos dari semua handler. Hanya untuk log dan cleanup sinkron lalu exit; tidak aman melanjutkan (lesson 0006).
_Avoid_: "handler global supaya server tidak pernah mati"

**Error.cause**:
Opsi `new Error(msg, { cause })` (ECMAScript 2022, Node ≥ 16.9) untuk membungkus error tingkat rendah tanpa kehilangan error aslinya (lesson 0006).

**Operational error**:
Kegagalan yang wajar terjadi saat runtime (timeout, koneksi putus, input tidak valid) dan ditangani: retry, 4xx/503, fallback (lesson 0006).

**Programmer error**:
Bug di kode (method pada `undefined`, lupa `await`). Tidak "ditangani" di runtime: log, crash, restart, perbaiki kodenya (lesson 0006).

**EventEmitter**:
Kelas dasar `node:events` untuk API berbasis event (stream, socket, server). `emit()` memanggil listener secara sinkron sesuai urutan pendaftaran; event `'error'` tanpa listener mematikan proses (lesson 0006, 0007).

**MaxListenersExceededWarning**:
Peringatan saat satu event punya lebih dari 10 listener (default). Bukan batas keras; biasanya tanda listener yang tidak dilepas (leak) (lesson 0007).
_Avoid_: menaikkan `setMaxListeners` untuk membungkam peringatan

**AbortController**:
Objek milik pemanggil untuk membatalkan pekerjaan async; `abort(reason)` memicu `controller.signal` (lesson 0007).

**AbortSignal**:
Sinyal pembatalan yang diteruskan ke `fetch` dan API Node (`{ signal }`). `AbortSignal.timeout(ms)` (Node ≥ 17.3) abort dengan `TimeoutError`; `AbortSignal.any` (Node ≥ 20.3) menggabungkan beberapa signal (lesson 0007).

## I/O & skala

## Modul & tooling

## NestJS inti

## Pipeline request

## Data & auth

## Testing & produksi
