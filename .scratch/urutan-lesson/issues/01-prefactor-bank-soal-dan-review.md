# 01: Prefactor: bank soal bersama, komponen review campuran, dan halaman indeks lesson

**What to build:** Lesson bisa mendaftarkan soalnya ke satu bank soal bersama, dengan tag topik dan nomor lesson. Lesson review bisa memilih lesson atau topik sumber, lalu menarik dan mengacak soal dari sana. Di akhir review, pengguna mendapat ringkasan topik yang lemah untuk dilaporkan ke agent. Ada juga halaman indeks yang menampilkan ke-18 lesson sesuai urutan di spec, beserta status (tersedia atau segera) dan link-nya.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai dan membaca assets yang sudah ada
- [x] Komponen kuis yang sudah ada tetap jalan tanpa perubahan di halaman yang memakainya
- [x] Format bank soal bersama ditetapkan: setiap soal punya tag topik, nomor lesson, pilihan jawaban, kunci, dan penjelasan
- [x] Komponen review bisa menarik soal secara acak dari beberapa lesson atau topik, dan pertanyaan lisan bisa diselipkan di antara soal kuis
- [x] Di akhir review tampil ringkasan skor per topik, plus daftar topik lemah dalam teks yang mudah disalin ke agent
- [x] Halaman indeks menampilkan 18 lesson dengan judul dan pembagian hari sesuai spec
- [x] Semua komponen bisa dibuka langsung dari file lokal tanpa server, dan tampilannya rapi saat dicetak

## Comments

**Implementer (agent):** Selesai. Skill `/teach` tidak bisa dipanggil lewat model, jadi `SKILL.md`-nya dibaca dan diikuti langsung, bersama MISSION, NOTES, GLOSSARY, assets, dan lesson 0001.

- `assets/bank.js`: global `QuestionBank` (register + validasi format, select per lesson/topik, draw acak yang menyebar ke semua topik dan mencampur soal lisan, skor per topik, teks ringkasan topik lemah). Logic murni, diuji di `tests/bank.test.js` (`node --test` dari root, tanpa npm).
- `assets/questions/NNNN.js`: satu file per lesson (belum ada isinya, setiap lesson membuat file sendiri supaya branch paralel tidak bentrok).
- `assets/bank-quiz.js`: merender soal kuis dari bank ke markup `quiz.js`. `quiz.js` sendiri tidak diubah.
- `assets/review.js`: komponen review campuran (`<div class="review" data-lessons data-topics data-mc data-oral>`), seed bisa diulang lewat `?seed=`, ringkasan per topik + textarea siap salin.
- `index.html` (root): 18 lesson per hari, status diubah dengan mengganti satu baris `<li>` (ada baris kosong di antaranya, dan sudah dicek merge paralel tidak bentrok).
- `assets/README.md`: format bank dan cara memakainya di halaman lesson dan review. Contoh yang bisa dibuka: `assets/examples/review-example.html`.
