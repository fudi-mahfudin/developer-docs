# 08: Lesson 0007: Review campuran Hari 1 (seam)

**What to build:** Di awal Hari 2, pengguna mengerjakan review yang mengacak soal kuis dan pertanyaan lisan dari lesson 0001–0006, tanpa materi baru. Hasilnya menentukan topik mana yang dicatat sebagai sudah dikuasai di learning record.

**Blocked by:** 02, 03, 04, 05, 06, 07

**Status:** ready-for-human

- [x] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, dan learning records
- [x] Memakai komponen review dari tiket 01, dengan soal yang diacak dan bercampur antar-topik
- [x] Kriteria lulus per topik sesuai spec: soal acak dijawab benar dan minimal 4 dari 6 poin checklist lisan terpenuhi
- [ ] Setelah pengguna melaporkan hasilnya, learning record ditulis hanya untuk topik yang terbukti dikuasai
- [ ] Topik yang lemah dicatat di NOTES supaya masuk ke review 0012
- [x] Link navigasi dan halaman indeks diperbarui

## Comments

- `/teach` tidak bisa dipanggil lewat Skill tool oleh subagent; `SKILL.md` + format-nya dibaca dan diikuti, begitu juga MISSION, NOTES, learning-records, GLOSSARY, dan `assets/`.
- `lessons/0007-review-hari-1.html` memakai `review.js` dengan `data-lessons="0001,…,0006"`, `data-mc="22"` (satu soal kuis per topik Hari 1) dan `data-oral="6"`, diacak bersama. Kriteria lulus (kuis benar + lisan ≥ 4/6) dijelaskan di halaman dan dihitung oleh `bank.js`.
- Test baru `tests/review-0007.test.js`: keenam file soal dimuat bersama tanpa id duplikat, juga sebagai script browser dalam satu scope global; halaman mencakup 0001–0006, setiap topik kuis tertarik di setiap seed; navigasi 0006 ↔ 0007 ↔ 0008.
- Dua checkbox (learning record, topik lemah ke NOTES) **belum dicentang**: keduanya butuh hasil dari user, yang belum mengerjakan review. Halaman meminta user menyalin ringkasan dan menempelkannya ke agent; NOTES berisi langkah yang harus dilakukan agent saat hasil itu datang.
