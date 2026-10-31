# 11: Modul Studi kasus: kerangka dan kasus kecil (0027–0030)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0027 (kerangka 5 langkah, latihan `order.js`), 0028 URL shortener, 0029 rate limiter, 0030 notification system, sesuai tabel di `../spec.md`. Langkah 4 kerangka selalu dimulai dari desain v1 paling sederhana yang memenuhi angka langkah 2. Setiap komponen tambahan di langkah 5 harus dibenarkan dengan angka/bottleneck (prinsip inti di spec). Setiap studi kasus mengikuti kerangka 5 langkah secara eksplisit (heading per langkah), memuat estimasi angka, diagram high-level `svg.diagram`, dan latihan "gambar diagram sendiri dulu, lalu buka jawaban" dengan tombol "Lihat jawaban" yang sudah ada. Bank soal, istilah, sumber, dan `tests/sysdesign/modul-studi-kasus.test.js` (dibuat di sini, diperluas di issue 12).

- [x] 0027 kerangka + order
- [x] 0028, 0029, 0030 per kerangka, dengan estimasi, diagram, dan latihan diagram
- [x] v1 sederhana dulu, lalu evolusi yang dibenarkan angka; checklist oral memuat "membenarkan komponen dengan angka"
- [x] Bank soal + GLOSSARY + RESOURCES
- [x] `tests/sysdesign/modul-studi-kasus.test.js`

## Comments

- 2026-10-31: Selesai. Lesson 0027–0030 + bank (4–5 mc + 1 oral per lesson, topik `kasus-kerangka-*`, `kasus-url-*`, `kasus-rl-*`, `kasus-notif-*`), GLOSSARY/RESOURCES bagian Studi kasus, index 0027–0030 tersedia, `tests/sysdesign/modul-studi-kasus.test.js` (issue 12 menambah 0031–0034 ke `LESSONS`, `KEYWORDS`, dan mengganti `NAV_AFTER`). Setiap studi kasus: h2 "Langkah 1–5", estimasi QPS, v1 di `<details><summary>Lihat jawaban</summary>` dengan `svg.diagram`, v2 di langkah 5. Alokasi 5/5/7/13/15 menit disebut sebagai konvensi track, bukan sumber resmi.
