# 09: Modul Reliabilitas & API (0020–0025)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0020–0025 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-reliabilitas-api.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat. 0021 mengajarkan algoritma rate limiting; desain layanannya ditunda ke 0029. 0024 menjadikan monolith sebagai default. 0025 (tangga skala) merangkai prinsip inti: ukur dulu → perbaiki query/index → cache → scale vertical → read replica → queue → sharding → pecah service, masing-masing dengan biaya, risiko, dan sinyal kapan naik, ditambah anti-pattern over-engineering dan cara mengucapkannya di interview. Latihan `order.js` untuk urutan tangga.

- [x] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [x] `<h2>` "Kapan tidak perlu" di 0020–0024: sinyal/angka yang membenarkan komponen, biaya + risiko, alternatif lebih murah (prinsip inti di spec)
- [x] 0025 tangga skala + `order.js`
- [x] Bank soal per lesson + `labelTopics`
- [x] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [x] `tests/sysdesign/modul-reliabilitas-api.test.js`

## Comments

2026-10-31: Selesai. Lesson 0020–0025 ada di `sysdesign/lessons/`, bank soal di `sysdesign/assets/questions/0020.js`–`0025.js` (5 mc + 1 oral per lesson, 12 topik baru dengan prefix `rel-`, dicatat di `GLOSSARY.md` bagian "Reliabilitas & API"). Sumber per lesson ada di `RESOURCES.md` bagian "Reliabilitas & API". Test `tests/sysdesign/modul-reliabilitas-api.test.js` memeriksa kata kunci per lesson, sitasi, diagram, "Kapan tidak perlu" di 0020–0024, link 0021 → 0029, monolith sebagai default di 0024, `order.js` delapan anak tangga berurutan + pola "untuk skala ini cukup" di 0025, dan nav 0019 → 0026. Semua sitasi dicek ke halaman primer (RFC, grpc.io, WHATWG, PostgreSQL, nginx, Redis, AWS API Gateway/Builders' Library, Google SRE Book, OpenTelemetry, Azure Architecture Center, Kubernetes). "Monolith sebagai default" ditulis sebagai prinsip track tanpa sitasi, karena tidak ada sumber primer yang menyatakannya langsung. Untuk review 0026: modul ini menambah 12 topik mc ke pool.
