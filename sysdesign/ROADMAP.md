# Roadmap — Ronde system design (mid-level)

**Profil:** developer yang belum pernah belajar system design secara terstruktur
**Format interview yang diantisipasi:** satu soal desain terbuka, lisan/whiteboard ±45 menit
**Alokasi:** self-paced, tanpa deadline. 36 lesson ±20 menit, **tanpa implementasi**: baca, diagram, kuis, latihan menjawab lisan (ADR 0003)
**Prinsip inti:** ukur dulu, mulai dari perubahan termurah dan paling kecil risikonya; arsitektur baru adalah jalan terakhir
**Istilah:** [GLOSSARY.md](./GLOSSARY.md) · **Indeks lesson:** [index.html](./index.html)

| Modul | Lesson | Fokus |
|---|---|---|
| Fondasi | 0001–0004 | Apa itu system design, requirement, perjalanan request, latency vs throughput, estimasi back-of-envelope |
| Skalabilitas | 0005–0007 | Vertical vs horizontal, stateless, load balancer, reverse proxy, CDN |
| Data | 0008–0011 | SQL vs NoSQL, index, replication, sharding, consistent hashing, CAP/PACELC |
| **Review 1** | 0012 | Fondasi + Skalabilitas (tertunda satu modul) |
| Caching | 0013–0015 | Pola cache, TTL/eviction/invalidation, thundering herd, hot key |
| Asinkron | 0016–0018 | Queue vs pub/sub, delivery semantics, idempotency, event-driven, back-pressure |
| **Review 2** | 0019 | Data + Caching |
| Reliabilitas & API | 0020–0025 | Gaya API, rate limiting, timeout/retry/circuit breaker, observability + SLO, monolith vs microservices, **tangga skala** |
| **Review 3** | 0026 | Asinkron + Reliabilitas & API |
| Studi kasus | 0027–0034 | Kerangka 5 langkah, URL shortener, rate limiter, notification, news feed (2), chat (2) |
| **Review 4** | 0035 | Studi kasus + topik lemah Review 1–3 |
| Penutup | 0036 | Mock interview 45 menit (**opsional, pengecualian durasi**) |

Menjelang interview: baca ulang tiga reference di `reference/` (angka dan estimasi, kerangka 5 langkah, trade-off komponen), lalu ulangi mock 0036 dengan soal lain.
