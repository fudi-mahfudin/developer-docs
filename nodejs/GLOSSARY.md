# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

Slug topik bank soal modul ini: `runtime-anatomi`, `runtime-io-vs-cpu` (0001), `runtime-fase-loop`, `runtime-timeout-vs-immediate` (0002), `runtime-nexttick-microtask`, `runtime-starvation` (0003), `runtime-thread-pool`, `runtime-blocking` (0004).

**V8**:
Engine JavaScript dan WebAssembly buatan Google (ditulis dalam C++) yang menjalankan kode JS di Node. Hanya tahu JS (objek, heap, GC), tidak tahu file atau socket (lesson 0001).
_Avoid_: "Node" (untuk engine-nya)

**libuv**:
Library C lintas platform yang menyediakan event loop dan thread pool untuk Node (lesson 0001).

**Binding C++**:
Kode C++ di dalam Node yang menghubungkan API JavaScript (`fs`, `net`, `crypto`) ke libuv dan sistem operasi (lesson 0001).

**I/O-bound / CPU-bound**:
I/O-bound: waktu habis untuk menunggu (database, HTTP, disk); cocok di thread utama Node. CPU-bound: waktu habis untuk menghitung; harus dipindah dari thread utama (lesson 0001).

**Event loop**:
Putaran fase di libuv yang menjalankan callback: timers → pending callbacks → idle/prepare → poll → check → close callbacks (lesson 0002).
_Avoid_: "antrean callback" (event loop bukan satu antrean)

**Fase poll**:
Fase yang mengambil event I/O baru dan menjalankan callback I/O; Node menunggu di sini saat tidak ada pekerjaan (lesson 0002).

**Fase check**:
Fase tepat setelah poll, tempat callback `setImmediate()` berjalan (lesson 0002).

**Next tick queue**:
Antrean `process.nextTick`, dikosongkan seluruhnya setelah operasi JS saat ini selesai, sebelum loop lanjut. Di CommonJS berjalan sebelum microtask (lesson 0003).

**Microtask queue**:
Antrean handler Promise (`then`/`catch`/`finally`) dan `queueMicrotask`; di Node dikosongkan tepat setelah next tick queue. Di spesifikasi ECMAScript disebut *job* (lesson 0003).
_Avoid_: macrotask (bukan istilah Node; sebut fase event loop-nya)

**Starvation**:
Kondisi fase lain (terutama poll/I/O) tidak pernah mendapat giliran karena nextTick atau microtask terus menjadwalkan dirinya sendiri (lesson 0003).

**Thread pool (libuv)**:
Kumpulan thread (default 4, `UV_THREADPOOL_SIZE`, maks 1024) untuk API tanpa versi asinkron di OS: `fs`, `dns.lookup`, crypto asinkron, `zlib` (lesson 0004).
_Avoid_: worker threads (itu `worker_threads`, lesson 0010)

**Memblokir event loop**:
Satu callback berjalan begitu lama sehingga callback lain, termasuk request lain, tidak bisa jalan. Penyebab: sync API, `JSON.parse` besar, regex ReDoS, hitungan CPU (lesson 0004).

**ReDoS**:
Regular expression Denial of Service: input khusus membuat regex rentan (mis. quantifier bersarang) butuh waktu eksponensial di thread JS (lesson 0004).

**Event loop delay**:
Selisih antara kapan callback seharusnya jalan dan kapan benar-benar jalan; diukur dengan `perf_hooks.monitorEventLoopDelay()` dalam nanodetik (lesson 0004).

## Async & error

## I/O & skala

## Modul & tooling

## NestJS inti

## Pipeline request

## Data & auth

## Testing & produksi
