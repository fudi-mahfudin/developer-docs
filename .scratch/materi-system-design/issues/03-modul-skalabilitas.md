# 03: Modul Skalabilitas (0005–0007)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0005–0007 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-skalabilitas.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat.

- [x] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [x] `<h2>` "Kapan tidak perlu" di setiap lesson: sinyal/angka yang membenarkan komponen, biaya + risiko, alternatif lebih murah (prinsip inti di spec)
- [x] Bank soal per lesson + `labelTopics`
- [x] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [x] `tests/sysdesign/modul-skalabilitas.test.js`

## Comments

- 2026-10-31: Selesai. Lesson 0005–0007 di `sysdesign/lessons/`, bank `sysdesign/assets/questions/0005.js`–`0007.js` (5/6/5 mc + 1 oral masing-masing). Slug: `skala-vertical-horizontal`, `skala-stateless` (0005), `skala-lb-layer`, `skala-lb-algoritma` (0006), `skala-reverse-proxy`, `skala-cdn` (0007), jadi modul ini menyumbang 6 topik mc ke `data-mc` review 0012. Istilah di `GLOSSARY.md` "## Skalabilitas", sumber di `RESOURCES.md` "### Skalabilitas". Test `tests/sysdesign/modul-skalabilitas.test.js`: kata kunci per lesson, sitasi bernomor, diagram, kuis per topik, blok lisan, "Kapan tidak perlu", sitasi primer saja, nav 0004→0008, status tersedia di indeks. Catatan sumber: push CDN dikutip dari dokumentasi vendor KeyCDN (Push Zone) karena CloudFront hanya pull; angka "5–20 ms" untuk session di database adalah klaim dokumentasi Redis dan ditandai demikian di lesson.
