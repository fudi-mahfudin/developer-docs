# 02: Modul Fondasi (0001–0004)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0001–0004 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-fondasi.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat. 0002 memuat latihan `order.js` perjalanan request. 0004 memuat soal hitung dengan kunci jawaban di balik tombol. 0001 memperkenalkan prinsip inti (ukur dulu, mulai dari yang termurah, arsitektur baru jalan terakhir) dan 0004 memuat contoh 1.000 user → satu server + satu database cukup.

- [x] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [x] Prinsip inti di 0001 dan contoh angka di 0004
- [x] Bank soal per lesson + `labelTopics`
- [x] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [x] `tests/sysdesign/modul-fondasi.test.js`

## Comments

- 2026-10-31: Selesai. Lesson 0001–0004 + bank (topik `dasar-requirement`, `dasar-prinsip-sederhana`, `dasar-perjalanan-request`, `dasar-http-stateless`, `dasar-latency-percentile`, `dasar-angka-latency`, `dasar-estimasi-qps`, `dasar-estimasi-storage`) dan `tests/sysdesign/modul-fondasi.test.js`. Kutipan Fowler "MonolithFirst" di 0001 dihapus (bukan primer); prinsip inti ditulis sebagai prinsip track. Tautan RFC memakai `.html` supaya anchor tidak hilang. Angka "Numbers Everyone Should Know" dicek langsung di PDF Dean (slide 24). 0001–0004 ditandai tersedia di index.
