# 06: Modul Caching (0013–0015)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0013–0015 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-caching.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat.

- [x] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [x] `<h2>` "Kapan tidak perlu" di setiap lesson: sinyal/angka yang membenarkan komponen, biaya + risiko, alternatif lebih murah (prinsip inti di spec)
- [x] Bank soal per lesson + `labelTopics`
- [x] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [x] `tests/sysdesign/modul-caching.test.js`

## Comments

- 2026-10-31: Selesai. Lesson `sysdesign/lessons/0013-pola-cache.html`, `0014-ttl-eviction-invalidation.html`, `0015-thundering-herd-hot-key.html`; bank `sysdesign/assets/questions/0013–0015.js` (5 mc + 1 oral per lesson); topik `cache-lokasi`, `cache-pola`, `cache-ttl-eviction`, `cache-invalidation`, `cache-stampede`, `cache-hot-key` (6 topik mc untuk `data-mc` review 0019). Sitasi primer: Azure Cache-Aside, ElastiCache strategies, Oracle Coherence, RFC 9111/5861, nginx proxy module, Redis docs (EXPIRE, eviction, SET, redis-cli, client-side caching), CloudFront (hit ratio, invalidation, Origin Shield), DynamoDB write sharding, Vattani et al. PVLDB 2015. Test `tests/sysdesign/modul-caching.test.js`.
