# 08: Lesson 0007: Review campuran Hari 1 (seam)

**What to build:** Di awal Hari 2, pengguna mengerjakan review yang mengacak soal kuis dan pertanyaan lisan dari lesson 0001–0006, tanpa materi baru. Hasilnya menentukan topik mana yang dicatat sebagai sudah dikuasai di learning record.

**Blocked by:** 02, 03, 04, 05, 06, 07

**Status:** ready-for-agent

- [ ] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, dan learning records
- [ ] Memakai komponen review dari tiket 01, dengan soal yang diacak dan bercampur antar-topik
- [ ] Kriteria lulus per topik sesuai spec: soal acak dijawab benar dan minimal 4 dari 6 poin checklist lisan terpenuhi
- [ ] Setelah pengguna melaporkan hasilnya, learning record ditulis hanya untuk topik yang terbukti dikuasai
- [ ] Topik yang lemah dicatat di NOTES supaya masuk ke review 0012
- [ ] Link navigasi dan halaman indeks diperbarui
