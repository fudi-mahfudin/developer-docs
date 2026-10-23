# 19: Lesson 0018: STAR dan mock interview final (seam)

**What to build:** Pengguna memoles 4 cerita STAR yang sudah dicicil sejak malam Hari 1, menyiapkan jawaban "kenapa pindah ke .NET/Angular", lalu mengerjakan mock interview yang dibatasi waktu dengan semua topik diacak. Hasilnya dicatat sebagai bukti penguasaan, beserta daftar topik yang perlu diulang sebelum interview.

**Blocked by:** 13, 14, 15, 16, 17, 18

**Status:** ready-for-agent

- [x] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, learning records, dan draf STAR
- [x] Mock interview dibatasi waktu, dengan bagian konsep yang diacak dari 0001–0017, bagian live coding sesuai ROADMAP, dan 2 cerita STAR
- [x] Topik yang lemah dari review 0007 dan 0012 diberi porsi lebih
- [ ] Learning record ditulis hanya untuk topik yang terbukti dikuasai
- [x] Ada daftar akhir "ulang sebelum interview" yang bisa dicetak
- [x] Link navigasi dan halaman indeks diperbarui

## Comments

- Dibangun: `lessons/0018-star-mock-interview.html` (persiapan poles STAR + mock 60 menit), komponen `assets/timer.js` (+ `tests/timer.test.js`), soal lisan live coding/STAR di `assets/questions/0018.js`, daftar cetak `reference/ulang-sebelum-interview.html`, test seam `tests/review-0018.test.js`. Indeks dan NOTES diperbarui. `/teach` tidak bisa dipanggil lewat Skill tool, jadi SKILL.md dibaca dan diikuti langsung.
- Topik lemah: 0007/0012 belum dikerjakan user, jadi blok 1a memakai default delapan jebakan (pendekatan yang sama dengan 0012); cara menukarnya ada di komentar halaman dan NOTES.
- Belum dicentang: "Learning record ditulis hanya untuk topik yang terbukti dikuasai". Butuh hasil mock asli dari user; aturannya sudah dicatat di NOTES. `star/draf-star.md` juga masih kosong, jadi user harus mengisinya sebelum memoles.
