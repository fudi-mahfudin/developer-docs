# 07: Lesson 0024: Review campuran database (seam)

**What to build:** Pengguna menjalani review acak berisi soal pilihan ganda dan lisan dari lesson 0019–0023, ditambah topik performa EF Core dari 0006 (N+1, `AsNoTracking`), tanpa materi baru. Hanya hasil review ini yang boleh menghasilkan learning record "sudah dikuasai" untuk topik database.

**Blocked by:** 04, 06

**Status:** ready-for-agent

- [ ] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [ ] Memakai komponen review bersama yang sama dengan 0007/0012; sumber soal lesson 0019–0023 dan topik N+1/`AsNoTracking` dari 0006 lewat atribut topik
- [ ] Hanya retrieval practice yang diacak (interleaving), tanpa materi baru
- [ ] Kriteria lulus per topik sama dengan seam yang ada: soal acak dijawab benar, dan jawaban lisan memenuhi minimal 4 dari 6 poin checklist; halaman menjelaskan cara mencatat hasil ke learning records
- [ ] Test review dibuat mengikuti pola `review-0012.test.js`: sumber lesson 0019–0023, topik 0006 yang disertakan, urutan pemuatan script sebelum `review.js`, dan file soal 0006 + 0019–0023 bisa dimuat bersama sebagai browser script tanpa bentrok nama
- [ ] `order.test.js` mencakup 0024, lesson 0023 menautkan 0024, dan halaman index mencantumkan 0024
- [ ] Reference ulang-sebelum-interview diperbarui dengan ringkasan database
- [ ] RESOURCES dicek lengkap untuk semua sumber yang dipakai 0019–0023
- [ ] `node --test` hijau
- [ ] Seam ini menunggu hasil pengerjaan user: ticket ditandai resolved untuk bagian agent, dengan catatan bahwa learning record "sudah dikuasai" baru ditulis setelah user menjalani review
