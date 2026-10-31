# System Design — Glossary

Kosakata bersama untuk persiapan ronde system design (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Prinsip dan kerangka

**Tangga skala**:
Urutan perubahan saat sistem mulai kewalahan, dari yang termurah dan paling kecil risikonya ke yang termahal: ukur → perbaiki kode/query/index → cache → scale vertical → read replica → asinkron/queue → sharding → pecah service. Naik satu anak tangga hanya kalau angka menuntut (lesson 0025).
_Avoid_: scaling roadmap, "langsung microservices"

**Over-engineering**:
Menambah komponen atau arsitektur yang belum dibenarkan angka requirement (mis. microservices + Kafka untuk 1.000 user). Di interview dinilai sebagai kelemahan, bukan kelebihan.
_Avoid_: future-proofing (sebagai pembenaran)

**Kerangka 5 langkah**:
Urutan menjawab soal desain: (1) klarifikasi requirement → (2) estimasi → (3) API + data model → (4) high-level design, mulai dari v1 paling sederhana → (5) deep dive, bottleneck, trade-off (lesson 0027).
_Avoid_: template, framework (tanpa konteks)

**Desain v1**:
Desain paling sederhana yang memenuhi angka requirement di langkah 2. Titik awal setiap studi kasus sebelum komponen apa pun ditambahkan.
_Avoid_: MVP (konteks produk, bukan arsitektur)

## Fondasi

## Skalabilitas

## Data

## Caching

## Asinkron

## Reliabilitas & API

Slug topik bank soal 0020–0025 (prefix `rel-`): `rel-gaya-api`, `rel-pagination` (0020) · `rel-ratelimit-algoritma`, `rel-ratelimit-http` (0021) · `rel-timeout-retry`, `rel-circuit-breaker` (0022) · `rel-observability`, `rel-slo` (0023) · `rel-monolith-microservices`, `rel-distributed-transaction` (0024) · `rel-tangga-skala`, `rel-over-engineering` (0025).

**REST**:
Gaya API yang memodelkan data sebagai resource (`/orders/42`) dan memakai method HTTP sesuai maknanya. Default untuk API publik (lesson 0020).
_Avoid_: "API JSON" (format, bukan gaya)

**gRPC**:
Framework RPC dengan kontrak Protocol Buffers di atas HTTP/2, mendukung streaming. Cocok untuk service-to-service internal; browser butuh gRPC-Web (lesson 0020).

**Long polling**:
Client mengirim request yang ditahan server sampai ada data, lalu langsung bertanya lagi. Cadangan kalau SSE/WebSocket tidak bisa dipakai (lesson 0020).

**SSE (Server-Sent Events)**:
Satu response HTTP `text/event-stream` yang terus mengalirkan event dari server ke client; browser menyambung ulang sendiri. Satu arah (lesson 0020).

**WebSocket**:
Koneksi dua arah di atas TCP yang dibuka lewat handshake HTTP. Untuk chat dan game; membuat server stateful (lesson 0020).

**Cursor pagination**:
Halaman berikutnya dilanjutkan dari item terakhir (`WHERE id < :last_id`), dikirim sebagai token opaque. Stabil saat data baru masuk dan memakai index (lesson 0020).
_Avoid_: keyset (boleh, tapi pakai satu istilah konsisten)

**Offset pagination**:
`LIMIT n OFFSET m`. Bisa lompat ke halaman N, tapi baris yang dilewati tetap dihitung server sehingga halaman dalam melambat (lesson 0020).

**Token bucket**:
Algoritma rate limiting: token diisi ulang dengan laju tetap sampai kapasitas; setiap request mengambil satu token. Kapasitas = burst, refill = rata-rata (lesson 0021).

**Leaky bucket**:
Algoritma rate limiting yang memasukkan request ke antrean dan mengurasnya dengan laju tetap, sehingga keluaran rata (nginx `limit_req`) (lesson 0021).

**Fixed window counter**:
Satu counter per user per jendela waktu yang kedaluwarsa sendiri. Sederhana, tapi bisa meloloskan 2× limit di batas jendela (lesson 0021).

**Sliding window**:
Rate limiting yang menghitung request dalam jendela bergeser: versi log menyimpan timestamp, versi counter menimbang counter jendela sebelumnya (lesson 0021).

**429 Too Many Requests**:
Status code untuk request yang ditolak rate limiter (RFC 6585), boleh disertai `Retry-After` berisi detik atau tanggal (lesson 0021).
_Avoid_: 503 untuk rate limit (default nginx, ubah dengan `limit_req_status`)

**Timeout / deadline**:
Batas waktu menunggu dependency. Deadline = titik waktu absolut yang bisa diteruskan antar service (gRPC). Diturunkan dari percentile latency dependency (lesson 0022).

**Exponential backoff + jitter**:
Jeda antar retry yang dilipatgandakan setiap percobaan dan diberi batas atas, ditambah keacakan supaya client tidak mengulang serentak (lesson 0022).

**Retry budget**:
Batas jumlah retry per proses per waktu (misalnya 60 per menit); kalau habis, request langsung gagal. Mencegah retry berlapis yang saling mengalikan (lesson 0022).

**Circuit breaker**:
Proxy di depan panggilan dependency dengan state Closed (normal), Open (gagal cepat), dan Half-Open (uji kecil sebelum kembali normal) (lesson 0022).

**Bulkhead**:
Mengisolasi sumber daya per dependency (misalnya connection pool sendiri) supaya kegagalan satu dependency tidak menghabiskan sumber daya yang lain (lesson 0022).

**Metrics / logs / traces**:
Tiga signal observability: angka teragregasi untuk alert, catatan event per request, dan jalur request lintas service yang tersusun dari span (lesson 0023).

**Span**:
Satu unit kerja dalam trace, dengan nama, waktu mulai dan selesai, dan span induk (lesson 0023).

**Four golden signals**:
Latency, traffic, errors, saturation: empat metrik yang selalu diukur untuk sistem yang menghadap user (SRE Book) (lesson 0023).

**SLI**:
Service level indicator: ukuran kuantitatif tingkat layanan, misalnya persentase request sukses atau p99 latency (lesson 0023).

**SLO**:
Service level objective: target untuk sebuah SLI dalam periode tertentu, misalnya 99,9% sukses per 30 hari (lesson 0023).

**SLA**:
Service level agreement: kontrak dengan user yang punya konsekuensi (misalnya refund) kalau SLO meleset (lesson 0023).
_Avoid_: SLA untuk target internal (itu SLO)

**Error budget**:
1 − SLO dalam satu periode (99,9% per 30 hari ≈ 43,2 menit). Budget tersisa: rilis jalan; habis: rilis ditahan, fokus ke keandalan (lesson 0023).

**Modular monolith**:
Satu deployable dan satu database, tapi modul berbatas tegas dengan tabel sendiri dan interface publik. Default yang disarankan track ini (lesson 0024).

**Microservices**:
Kumpulan service kecil yang di-deploy sendiri dan memegang datanya sendiri. Menyelesaikan masalah tim dan skala per bagian, dengan biaya operasional dan jaringan (lesson 0024).

**Distributed transaction**:
Operasi yang mengubah data di beberapa database milik service berbeda; ACID satu database tidak lagi berlaku (lesson 0024).

**Saga**:
Urutan transaksi lokal per service; kalau satu langkah gagal, compensating transaction membalik langkah yang sudah selesai (lesson 0024).
_Avoid_: rollback (tidak ada rollback lintas service; yang ada kompensasi)

**Service discovery**:
Mekanisme nama stabil di depan instance yang berganti, misalnya DNS Service di Kubernetes (lesson 0024).

## Studi kasus

## Penutup
