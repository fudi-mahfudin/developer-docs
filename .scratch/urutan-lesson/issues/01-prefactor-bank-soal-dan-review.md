# 01: Prefactor: bank soal bersama, komponen review campuran, dan halaman indeks lesson

**What to build:** Lesson bisa mendaftarkan soalnya ke satu bank soal bersama, dengan tag topik dan nomor lesson. Lesson review bisa memilih lesson atau topik sumber, lalu menarik dan mengacak soal dari sana. Di akhir review, pengguna mendapat ringkasan topik yang lemah untuk dilaporkan ke agent. Ada juga halaman indeks yang menampilkan ke-18 lesson sesuai urutan di spec, beserta status (tersedia atau segera) dan link-nya.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Agent memanggil skill `/teach` sebelum mulai dan membaca assets yang sudah ada
- [ ] Komponen kuis yang sudah ada tetap jalan tanpa perubahan di halaman yang memakainya
- [ ] Format bank soal bersama ditetapkan: setiap soal punya tag topik, nomor lesson, pilihan jawaban, kunci, dan penjelasan
- [ ] Komponen review bisa menarik soal secara acak dari beberapa lesson atau topik, dan pertanyaan lisan bisa diselipkan di antara soal kuis
- [ ] Di akhir review tampil ringkasan skor per topik, plus daftar topik lemah dalam teks yang mudah disalin ke agent
- [ ] Halaman indeks menampilkan 18 lesson dengan judul dan pembagian hari sesuai spec
- [ ] Semua komponen bisa dibuka langsung dari file lokal tanpa server, dan tampilannya rapi saat dicetak
