# 09: Modul Reliabilitas & API (0020–0025)

Status: ready-for-agent

**Blocked by:** 01

**What to build:** Lesson 0020–0025 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-reliabilitas-api.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat. 0021 mengajarkan algoritma rate limiting; desain layanannya ditunda ke 0029. 0024 menjadikan monolith sebagai default. 0025 (tangga skala) merangkai prinsip inti: ukur dulu → perbaiki query/index → cache → scale vertical → read replica → queue → sharding → pecah service, masing-masing dengan biaya, risiko, dan sinyal kapan naik, ditambah anti-pattern over-engineering dan cara mengucapkannya di interview. Latihan `order.js` untuk urutan tangga.

- [ ] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [ ] `<h2>` "Kapan tidak perlu" di 0020–0024: sinyal/angka yang membenarkan komponen, biaya + risiko, alternatif lebih murah (prinsip inti di spec)
- [ ] 0025 tangga skala + `order.js`
- [ ] Bank soal per lesson + `labelTopics`
- [ ] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [ ] `tests/sysdesign/modul-reliabilitas-api.test.js`

## Comments
