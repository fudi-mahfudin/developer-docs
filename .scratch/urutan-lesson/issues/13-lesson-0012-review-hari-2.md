# 13: Lesson 0012: Review campuran Hari 2 (seam)

**What to build:** Di awal Hari 3, pengguna mengerjakan review yang mengacak soal dari lesson 0008–0011, ditambah topik Hari 1 yang tercatat lemah di review 0007. Hasilnya menentukan learning record berikutnya.

**Blocked by:** 08, 09, 10, 11, 12

**Status:** ready-for-agent

- [x] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, dan learning records
- [ ] Soal mencakup topik lemah dari hasil review 0007 yang tercatat di NOTES
- [x] Kriteria lulus sama seperti review 0007
- [ ] Learning record ditulis hanya untuk topik yang terbukti dikuasai, dan topik yang masih lemah dicatat untuk mock interview 0018
- [x] Link navigasi dan halaman indeks diperbarui

## Comments

- `/teach` tidak bisa dipanggil lewat Skill tool oleh subagent; `SKILL.md` + format-nya dibaca dan diikuti, begitu juga MISSION, NOTES, learning-records, GLOSSARY, dan `assets/`.
- `lessons/0012-review-hari-2.html` meniru 0007: `review.js` dengan `data-lessons="0008,…,0011"`, topik Hari 1 lewat `data-topics`, `data-mc` = satu kuis per topik (18 Hari 2 + topik Hari 1), `data-oral="6"`. Kriteria lulus sama dengan 0007. Test baru `tests/review-0012.test.js`.
- Checkbox "topik lemah 0007" **belum dicentang**: user belum mengerjakan 0007, jadi `data-topics` memakai default satu topik jebakan per lesson Hari 1 (`layer,csharp-value-ref,csharp-async,di-captive,mw-order,ef-n-plus-1`, `data-mc="24"`). Komentar di halaman dan NOTES menjelaskan cara agent menggantinya setelah hasil 0007 ada.
- Checkbox learning record **belum dicentang**: butuh hasil 0012 dari user. NOTES berisi langkah untuk agent (termasuk baris "Topik lemah 0012" untuk 0018).
