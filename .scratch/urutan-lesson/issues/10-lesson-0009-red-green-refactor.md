# 10: Lesson 0009: Red-Green-Refactor

**What to build:** Pengguna bisa menjelaskan dan mendemokan siklus Red-Green-Refactor pada satu aturan bisnis Product, pola Arrange-Act-Assert, dan konvensi penamaan test. Pengguna juga bisa menjelaskan kenapa test harus terlihat gagal dulu.

**Blocked by:** 09

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya di RESOURCES (tambahkan sumber baru ke RESOURCES bila perlu), dan setiap klaim penting diberi kutipan
- [x] Lesson bisa diselesaikan dalam 10–15 menit dan punya satu target berupa pertanyaan interview yang bisa dijawab
- [x] Ada kuis dengan feedback langsung: setiap pilihan jawaban punya jumlah kata yang sama, dan posisi jawaban benar bervariasi
- [x] Ada latihan lisan (jawab dengan suara keras) dengan jawaban contoh dan checklist 6 poin
- [x] Soal kuis didaftarkan ke bank soal bersama dengan tag topik dan nomor lesson, supaya bisa dipakai di review campuran
- [x] Reference doc yang bisa dicetak dibuat atau diperbarui dan di-link dari lesson
- [x] Istilah konsisten dengan GLOSSARY, dan setiap konsep diberi padanan Node/Express/React
- [x] Ada satu sumber resmi utama yang direkomendasikan, plus pengingat untuk bertanya ke agent
- [x] Link navigasi dari lesson sebelumnya dan entri di halaman indeks lesson sudah diperbarui
- [x] Memakai stylesheet dan komponen bersama; kode yang bisa dipakai ulang ditaruh di assets, bukan ditulis langsung di lesson
- [x] Ada latihan mengurutkan langkah-langkah satu siklus TDD dengan feedback langsung

## Comments

- Lesson `lessons/0009-red-green-refactor.html` (±13 menit), target: "Jelaskan red-green-refactor. Kenapa test harus terlihat gagal dulu?". Soal di `assets/questions/0009.js` (13 kuis, 2 lisan; topik `tdd-siklus`, `tdd-red`, `tdd-aaa`, `tdd-naming`), diuji di `tests/questions-0009.test.js`. Reference `reference/red-green-refactor.html`.
- Komponen baru `assets/order.js` (latihan mengurutkan, logic diuji di `tests/order.test.js`), didokumentasikan di `assets/README.md`.
- Sumber: Microsoft Learn (unit testing best practices, tutorial xUnit), Kent Beck "Canon TDD", Martin Fowler (TDD, Self Testing Code), Jest `test.each`; ditambahkan ke RESOURCES. GLOSSARY: Arrange-Act-Assert, Test List.
- Agent belum mengecek di browser sungguhan (headless Chrome diblokir sandbox); `order.js` dan render kuis perlu dicoba sekali di browser. Link "next" ke `0010-jenis-test.html` baru hidup setelah ticket 0010 selesai.
