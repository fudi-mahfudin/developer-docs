# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

## I/O & skala

Slug topik bank soal modul ini: `io-stream-jenis`, `io-stream-pipeline` (0008), `io-backpressure`, `io-buffer` (0009), `io-worker-threads`, `io-cluster-proses` (0010), `io-memory-leak`, `io-profiling` (0011).

**Stream**:
Aliran data yang diproses per potongan (chunk), bukan sekaligus di memori. Empat jenis: Readable (sumber), Writable (tujuan), Duplex (baca dan tulis, dua sisi independen, mis. socket TCP), Transform (Duplex yang output-nya dihitung dari input, mis. gzip) (lesson 0008).
_Avoid_: pipe (sebagai nama jenis)

**stream.pipeline**:
Fungsi untuk merangkai stream yang meneruskan error dari stream mana pun ke satu callback/Promise dan menghancurkan semua stream saat gagal. Versi Promise di `node:stream/promises`. Pengganti aman untuk `.pipe()` berantai (lesson 0008).
_Avoid_: pump (library lama)

**Backpressure**:
Sinyal dari tujuan yang lebih lambat agar sumber berhenti dulu: `write()` mengembalikan `false`, penulis menunggu event `'drain'`. Diabaikan → data menumpuk di memori (lesson 0009).
_Avoid_: throttling, rate limit

**highWaterMark**:
Ambang buffer internal stream: byte untuk stream biasa, jumlah objek untuk `objectMode`. Default 64 KiB (Node ≥ 22, non-Windows) dan 16 objek. Ambang, bukan batas keras (lesson 0009).
_Avoid_: buffer size limit

**Buffer**:
Urutan byte berukuran tetap, subclass `Uint8Array`; chunk dari stream byte. Encoding default UTF-8; `Buffer.byteLength` menghitung byte, bukan karakter (lesson 0009).
_Avoid_: string (untuk data biner)

**Worker thread**:
Thread JavaScript tambahan di proses yang sama (`node:worker_threads`) untuk pekerjaan CPU-bound; bisa berbagi memori lewat `SharedArrayBuffer`. Tidak membantu I/O. Sebaiknya dipakai lewat pool (lesson 0010).
_Avoid_: libuv thread pool (itu untuk fs/crypto/zlib bawaan)

**Cluster**:
Beberapa proses Node (`node:cluster`) yang berbagi satu port server; primary membagi koneksi secara round-robin (default kecuali Windows). Memori tidak terbagi antar worker. Di Kubernetes biasanya diganti replika container (lesson 0010).
_Avoid_: multi-thread

**Child process**:
Proses lain yang dijalankan dari Node (`node:child_process`): `spawn`, `exec` (lewat shell), `execFile`, `fork` (proses Node dengan IPC) (lesson 0010).
_Avoid_: worker (untuk proses eksternal)

**Memory leak**:
Objek yang tidak dipakai lagi tapi masih terjangkau dari root, sehingga GC tidak bisa membebaskannya. Sumber umum: cache global tanpa batas, listener yang tidak dilepas, closure/timer yang menahan objek besar (lesson 0011).
_Avoid_: heap besar (belum tentu leak)

**Old space**:
Bagian heap V8 untuk objek berumur panjang yang bertahan dari beberapa GC minor. Batasnya diatur `--max-old-space-size` (MiB) (lesson 0011).
_Avoid_: total memori proses (Buffer ada di luar heap)

**Heap snapshot**:
Foto semua objek di heap V8 beserta retainer-nya. Dua snapshot dibandingkan (mode Comparison di DevTools) untuk menemukan leak. Memblokir event loop dan butuh ±2x memori heap (lesson 0011).
_Avoid_: heap dump (boleh, tapi sebut snapshot)

**CPU profile**:
Rekaman fungsi mana yang memakai waktu CPU, dari `--cpu-prof` (stabil sejak Node 22.4) atau tab Performance DevTools lewat `--inspect` (lesson 0011).
_Avoid_: heap snapshot (untuk masalah CPU)

## Modul & tooling

## NestJS inti

## Pipeline request

## Data & auth

## Testing & produksi
