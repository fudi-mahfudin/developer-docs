Status: ready-for-agent

# Spec: Track system design dari nol (lesson ±20 menit, self-paced)

Hasil grilling 2026-10-31. Konvensi umum di `docs/adr/0003-konvensi-materi-baru.md`; spec ini hanya mencatat hal khusus track system design.

## Problem Statement

Repo punya track dotnet dan FHIR, tapi system design belum dibahas. `dotnet/MISSION.md` bahkan menaruh "System design berat, microservices, CQRS penuh" di out of scope. Interview mid-level sering punya satu ronde system design (lisan/whiteboard ±45 menit), dan belum ada materi untuk itu.

## Solution

Track baru `sysdesign/`: 36 lesson ±20 menit dalam 8 modul tematik plus 4 review tertunda, self-paced, **konsep saja** (tanpa lab). Konsep dibangun dari nol, lalu modul Studi kasus melatih soal interview klasik dengan kerangka 5 langkah.

## Keputusan

- **Prinsip inti: ukur dulu, mulai dari yang termurah, arsitektur baru adalah jalan terakhir.** Tujuannya supaya kandidat tidak terlihat over-engineer (mis. memilih microservices untuk 1.000 user). Prinsip ini punya lesson sendiri (0025, tangga skala) dan diterapkan di seluruh track:
  - 0001 memperkenalkannya sebagai cara berpikir yang dinilai interviewer. 0004 menunjukkan contoh angka: 1.000 user aktif harian ≈ di bawah 1 QPS rata-rata, satu server + satu database sudah cukup.
  - Setiap lesson komponen (0005–0011, 0013–0018, 0020–0024) punya `<h2>` **"Kapan tidak perlu"**: sinyal (angka/metrik) yang membenarkan komponen itu, biaya dan risiko yang ditambahkannya, dan alternatif yang lebih murah.
  - 0025 merangkai urutannya: ukur (metrik, profiling, query plan) → perbaiki kode/query/index → cache → scale vertical → read replica → asinkron/queue → sharding → pecah service. Setiap anak tangga punya biaya, risiko, dan sinyal kapan naik. Termasuk cara mengucapkannya di interview: "untuk skala ini cukup X; kalau metrik Y melewati Z, langkah berikutnya W".
  - Kerangka 5 langkah (0027): langkah 4 selalu dimulai dari **desain v1 paling sederhana** yang memenuhi angka langkah 2. Langkah 5 hanya menambah komponen yang dibenarkan dengan angka atau bottleneck yang disebut.
  - Studi kasus (0028–0034) menunjukkan v1 sederhana dulu, lalu evolusinya, bukan langsung desain akhir.
  - Checklist soal lisan dan mock 0036 memberi poin untuk "membenarkan komponen dengan angka" dan penalti untuk komponen tanpa alasan.
- **Tujuan:** konsep dari nol, lalu latihan soal interview. **Level mid-level**: topik senior hanya disebut sekilas ("tahu namanya dan kapan dipakai").
- **Mandiri:** tanpa rujukan ke track dotnet/FHIR. Istilah di luar system design (OAuth, JWT, TLS, dan sejenisnya) dijelaskan 1–2 kalimat di tempat.
- **Kerangka menjawab 5 langkah**, dipakai konsisten di semua studi kasus: (1) klarifikasi requirement (functional + non-functional) → (2) estimasi → (3) API + data model → (4) high-level design → (5) deep dive, bottleneck, trade-off. Diajarkan di 0027 dan dilatih dengan `order.js`.
- **Estimasi** cukup satu lesson (0004), lalu diulang di setiap studi kasus.
- **Studi kasus:** URL shortener, rate limiter, notification system (masing-masing 1 lesson), news feed dan chat (masing-masing 2 lesson: A = langkah 1–4, B = langkah 5 + latihan lisan).
- **Diagram:** setiap lesson konsep punya minimal satu diagram. Diagram bercabang memakai inline SVG + kelas `.diagram` (ADR 0003). Lesson studi kasus memuat latihan "gambar diagram sendiri dulu, lalu buka jawaban" dengan `<details>` + `<summary>Lihat jawaban</summary>` (CSS reveal yang sudah ada di `style.css`), tanpa komponen baru.
- **Latihan per lesson:** ≥ 4 mc + ≥ 1 oral (ADR 0003), dan `order.js` bila ada urutan yang perlu dihafal (perjalanan request di 0002, kerangka 5 langkah di 0027).
- **Pengecualian durasi:** 0036 mock interview ±45 menit, opsional, memakai `timer.js` dengan 5 segmen sesuai kerangka (`Requirement:5,Estimasi:5,API+data:7,High-level:13,Deep dive:15`).
- **Sumber primer** untuk `.cite`: dokumentasi resmi (Redis, Kafka, RabbitMQ, nginx, AWS ELB/CloudFront, PostgreSQL, gRPC), paper asli (Dynamo 2007, Karger et al. 1997 consistent hashing, Gilbert & Lynch 2002 CAP, Abadi 2012 PACELC, Bigtable 2006), RFC (HTTP RFC 9110, WebSocket RFC 6455, HTTP 429 RFC 6585), dan Google SRE Book (gratis, resmi dari Google) untuk SLI/SLO. Buku DDIA dan Alex Xu hanya di `RESOURCES.md`.

## Urutan lesson

| # | File | Modul | Isi | ±menit |
|---|---|---|---|---|
| 0001 | `0001-apa-itu-system-design.html` | Fondasi | Apa itu system design, ronde interview-nya, functional vs non-functional requirement | 20 |
| 0002 | `0002-perjalanan-request.html` | Fondasi | Client-server, DNS, TCP/TLS singkat, HTTP request/response; latihan susun urutan | 20 |
| 0003 | `0003-latency-dan-throughput.html` | Fondasi | Latency vs throughput, percentile (p50/p99), angka latency yang perlu dihafal | 20 |
| 0004 | `0004-estimasi-back-of-envelope.html` | Fondasi | QPS, storage, bandwidth; 1 hari ≈ 10⁵ detik; pangkat 2/10; latihan hitung | 20 |
| 0005 | `0005-vertical-horizontal-stateless.html` | Skalabilitas | Vertical vs horizontal scaling, stateless service, session di luar server | 20 |
| 0006 | `0006-load-balancer.html` | Skalabilitas | L4 vs L7, algoritma (round robin, least connections, hash), health check, sticky session | 20 |
| 0007 | `0007-reverse-proxy-dan-cdn.html` | Skalabilitas | Reverse proxy, API gateway singkat, CDN (push vs pull, cache di edge) | 20 |
| 0008 | `0008-sql-vs-nosql.html` | Data | Relasional vs key-value/document/wide-column/graph, ACID vs BASE, kapan memilih | 20 |
| 0009 | `0009-index-dan-replication.html` | Data | Index singkat (B-tree), leader-follower, sync vs async, replication lag, read replica | 20 |
| 0010 | `0010-sharding-dan-consistent-hashing.html` | Data | Partitioning (range/hash), hot partition, resharding, consistent hashing + virtual node | 20 |
| 0011 | `0011-cap-pacelc-consistency.html` | Data | CAP, PACELC, strong vs eventual, read-your-writes, quorum singkat | 20 |
| 0012 | `0012-review-fondasi-skalabilitas.html` | Review 1 | pool 0001–0007 | 20 |
| 0013 | `0013-pola-cache.html` | Caching | Di mana cache berada, cache-aside, read-through, write-through, write-behind | 20 |
| 0014 | `0014-ttl-eviction-invalidation.html` | Caching | TTL, LRU/LFU, invalidation, stale data | 20 |
| 0015 | `0015-thundering-herd-hot-key.html` | Caching | Cache stampede, request coalescing, hot key, cache berlapis | 20 |
| 0016 | `0016-queue-dan-pubsub.html` | Asinkron | Kenapa asinkron, message queue vs pub/sub, consumer group, log (Kafka) vs broker (RabbitMQ) | 20 |
| 0017 | `0017-delivery-semantics-idempotency.html` | Asinkron | At-most/at-least/exactly-once, idempotency key, dead letter queue, ordering | 20 |
| 0018 | `0018-event-driven-backpressure.html` | Asinkron | Event-driven, outbox pattern singkat, back-pressure, load leveling | 20 |
| 0019 | `0019-review-data-caching.html` | Review 2 | pool 0008–0011, 0013–0015 | 20 |
| 0020 | `0020-gaya-api.html` | Reliabilitas & API | REST, gRPC, WebSocket, long polling, SSE; pagination; kapan memakai yang mana | 20 |
| 0021 | `0021-algoritma-rate-limiting.html` | Reliabilitas & API | Token bucket, leaky bucket, fixed/sliding window, HTTP 429 + `Retry-After` | 20 |
| 0022 | `0022-timeout-retry-circuit-breaker.html` | Reliabilitas & API | Timeout, retry + exponential backoff + jitter, circuit breaker, bulkhead | 20 |
| 0023 | `0023-observability-slo.html` | Reliabilitas & API | Metrics/logs/traces, SLI/SLO/SLA, error budget | 20 |
| 0024 | `0024-monolith-vs-microservices.html` | Reliabilitas & API | Trade-off monolith, modular monolith, microservices (biaya operasional, distributed transaction); monolith sebagai default; service discovery singkat | 20 |
| 0025 | `0025-tangga-skala.html` | Reliabilitas & API | Ukur dulu, lalu perubahan termurah dan paling kecil risikonya; tangga skala dari index/query sampai pecah service; anti-pattern over-engineering (microservices untuk 1.000 user); cara mengucapkannya di interview | 20 |
| 0026 | `0026-review-asinkron-reliabilitas.html` | Review 3 | pool 0016–0018, 0020–0025 | 20 |
| 0027 | `0027-kerangka-5-langkah.html` | Studi kasus | Kerangka 5 langkah, pertanyaan klarifikasi standar, manajemen waktu 45 menit; latihan susun urutan | 20 |
| 0028 | `0028-kasus-url-shortener.html` | Studi kasus | URL shortener: base62 vs hash, read-heavy, cache, redirect 301 vs 302 | 20 |
| 0029 | `0029-kasus-rate-limiter.html` | Studi kasus | Rate limiter terdistribusi: posisi (gateway/middleware), counter di Redis, race condition | 20 |
| 0030 | `0030-kasus-notification.html` | Studi kasus | Notification system: queue per channel, retry, idempotency, preferensi user | 20 |
| 0031 | `0031-kasus-news-feed-a.html` | Studi kasus | News feed langkah 1–4 | 20 |
| 0032 | `0032-kasus-news-feed-b.html` | Studi kasus | News feed langkah 5: fan-out on write vs on read, hybrid untuk akun besar | 20 |
| 0033 | `0033-kasus-chat-a.html` | Studi kasus | Chat langkah 1–4 | 20 |
| 0034 | `0034-kasus-chat-b.html` | Studi kasus | Chat langkah 5: koneksi WebSocket stateful, presence, ordering, pesan offline | 20 |
| 0035 | `0035-review-studi-kasus.html` | Review 4 | pool 0027–0034 + topik lemah Review 1–3 (`data-topics`) | 25 |
| 0036 | `0036-mock-interview.html` | Penutup | Mock interview soal baru (mis. typeahead/autocomplete), `timer.js` 5 segmen; **opsional, ±45 menit, pengecualian durasi** | 45 |

## MISSION (`sysdesign/MISSION.md`)

**Mission:** Lolos ronde system design di interview developer mid-level.

**Success looks like:**
- Bisa membenarkan setiap komponen dalam desain dengan angka, dan menjelaskan urutan tangga skala (ukur → perubahan termurah → arsitektur baru) tanpa over-engineering
- Bisa menjalankan kerangka 5 langkah untuk soal yang belum pernah dilihat dalam 45 menit
- Bisa menghitung QPS, storage, dan bandwidth kasar dalam < 3 menit
- Bisa menjelaskan trade-off setiap komponen inti (load balancer, cache, replication, sharding, queue) dalam < 1 menit per komponen
- Bisa menjelaskan CAP/PACELC dan memilih consistency model untuk kasus tertentu
- Bisa merancang kelima studi kasus dari ingatan, lengkap dengan diagram

**Constraints:** self-paced, lesson ±20 menit (ADR 0003), konsep saja tanpa lab, Bahasa Indonesia dengan istilah teknis bahasa Inggris.

**Out of scope:** consensus (Raft/Paxos) secara mendalam, multi-region active-active, geospatial, video streaming, implementasi/lab, cerita STAR/behavioral.

## Reference (`sysdesign/reference/`)

Cheat sheet untuk dibaca ulang menjelang interview:
1. `angka-dan-estimasi.html`: angka latency, satuan, rumus QPS/storage/bandwidth.
2. `kerangka-5-langkah.html`: kerangka, pertanyaan klarifikasi standar, alokasi waktu.
3. `trade-off-komponen.html`: per komponen, kapan dipakai, kapan tidak, dan alternatifnya, diurutkan sesuai tangga skala.

## Format lesson

Mengikuti format lesson FHIR (lihat `fhir/lessons/0013-bulk-export-alur.html`):
- Kicker: `Lesson NNNN · System Design · Modul <nama> · ±N menit`.
- Satu `<div class="win">` per lesson.
- Sitasi `<sup class="cite">` dinomori per lesson, dengan daftar "Sumber" di akhir.
- `<nav class="lesson-nav">` ke lesson sebelum/sesudah (0001 dan 0036 juga ke `../index.html`).
- Script: `../../assets/bank.js`, `../assets/questions/NNNN.js`, lalu komponen yang dipakai.
- Review: `review.js`, `data-mc` = jumlah topik kuis di pool, `data-oral="3"`, aturan lulus sama dengan FHIR.

## Testing

- `tests/sysdesign/track.test.js`: daftar lesson diturunkan dari `sysdesign/index.html`, setiap lesson punya bank dengan ≥ 4 mc dan ≥ 1 oral, setiap `lesson` dan prefix `id` cocok dengan nomor file, review = 0012, 0019, 0026, 0035.
- `tests/sysdesign/modul-<slug>.test.js` per modul: kata kunci cakupan (tabel di atas) dan minimal satu `.cite` per lesson konsep, ditambah minimal satu `svg.diagram` atau `.flow`, dan `<h2>` "Kapan tidak perlu" di setiap lesson komponen (daftar di bagian Keputusan).
- `tests/sysdesign/review.test.js`: pool dan `data-mc` setiap review.
- Loader: `forTrack("sysdesign")` di `tests/helpers.js`.

## Out of scope

Lab/implementasi, komponen JS baru (kecuali CSS `.diagram`), perubahan track dotnet dan FHIR, rujukan silang ke track lain.
