# 14: Penutup: mock interview (0036) dan tiga reference

Status: resolved

**Blocked by:** 12

**What to build:** Lesson 0036 mock interview dengan soal yang belum dibahas (mis. typeahead/autocomplete), `timer.js` dengan `data-segments="Requirement:5,Estimasi:5,API+data:7,High-level:13,Deep dive:15"`, ditandai **opsional, ±45 menit, pengecualian durasi** (ADR 0003), jawaban contoh per langkah di balik tombol. Checklist penilaian mock memuat poin "v1 sederhana dulu" dan "setiap komponen dibenarkan dengan angka", serta penalti untuk komponen tanpa alasan (over-engineering). Bank soal tetap ≥ 4 mc + ≥ 1 oral. Tiga cheat sheet di `sysdesign/reference/` (`angka-dan-estimasi.html`, `kerangka-5-langkah.html`, `trade-off-komponen.html`), ditautkan dari index dan ROADMAP.

- [x] 0036 + bank soal
- [x] Tiga reference
- [x] Tautan di index/ROADMAP; seluruh `tests/` lulus

## Comments

2026-10-31: 0036 (`0036-mock-interview.html`, typeahead/autocomplete, timer 5 segmen, jawaban contoh per langkah di `<details>`, penilaian dengan penalti over-engineering) + bank `0036.js` (5 mc, 1 oral, topik `mock-typeahead-v1`, `mock-typeahead-skala`). Tiga cheat sheet di `sysdesign/reference/` merangkum 0003/0004, 0027, dan bagian "Kapan tidak perlu" 0005–0024 menurut urutan tangga skala 0025. Ditautkan dari index dan ROADMAP. Test: `tests/sysdesign/modul-penutup.test.js`.
