# 12: Modul Studi kasus: news feed dan chat (0031–0034)

Status: resolved

**Blocked by:** 11

**What to build:** News feed (0031 langkah 1–4, 0032 langkah 5: fan-out on write vs on read, hybrid untuk akun besar) dan chat (0033 langkah 1–4, 0034 langkah 5: WebSocket stateful, presence, ordering, pesan offline), sesuai `../spec.md`. Lesson A ditutup dengan "lanjut di lesson B"; lesson B dibuka dengan ringkasan diagram dari A. Format sama dengan issue 11, termasuk v1 sederhana dulu (mis. fan-out on read saja untuk skala kecil), lalu evolusi yang dibenarkan angka. Perluas `tests/sysdesign/modul-studi-kasus.test.js`.

- [x] 0031 dan 0033 (A): langkah 1–4, v1 sederhana dulu, ditutup "lanjut di lesson B"
- [x] 0032 dan 0034 (B): dibuka dengan ringkasan diagram dari A, langkah 5 dengan evolusi yang dibenarkan angka, latihan lisan
- [x] Bank soal + GLOSSARY + RESOURCES + index
- [x] `tests/sysdesign/modul-studi-kasus.test.js` diperluas

## Comments

- 2026-10-31: Selesai. Lesson 0031–0034 + bank (5–6 mc + 1 oral per lesson; topik `kasus-feed-estimasi`, `kasus-feed-v1`, `kasus-feed-fanout`, `kasus-feed-hybrid`, `kasus-chat-protokol`, `kasus-chat-data`, `kasus-chat-koneksi`, `kasus-chat-ordering`), GLOSSARY/RESOURCES bagian Studi kasus, index 0031–0034 tersedia. Lesson A: h2 "Langkah 1–4", v1 di "Lihat jawaban" (feed: fan-out on read; chat: satu chat server), ditutup "Lanjut di lesson B". Lesson B: h2 "Ringkasan dari lesson A" dengan `svg.diagram` v1, lalu "Langkah 5" (evolusi ke v2, diagram v2 di "Lihat jawaban") dan latihan lisan. Test: `kasus: "A"|"B"` + `pair`, dua test baru untuk struktur A/B, `NAV_AFTER` = `0035-review-studi-kasus.html`. Paper Feeding Frenzy (Silberstein et al., SIGMOD 2010) tidak dikutip karena PDF-nya tidak bisa dibuka untuk verifikasi.
