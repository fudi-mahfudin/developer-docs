# 09: Lesson 0008: Prinsip SOLID

**What to build:** Pengguna bisa memberi contoh kelima prinsip SOLID dari Product Catalog. SRP dan DIP dibahas paling dalam, supaya pengguna punya jawaban kuat untuk "prinsip mana yang paling sering Anda terapkan".

**Blocked by:** 02

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
- [x] Ada latihan mengenali pelanggaran: potongan kode yang harus dicocokkan dengan prinsip SOLID yang dilanggarnya

## Comments

- Lesson `lessons/0008-solid.html`, soal `assets/questions/0008.js` (14 mc + 2 lisan; topik `solid-srp`, `solid-dip`, `solid-ocp`, `solid-lsp`, `solid-isp`, `solid-violation`, `solid-lima`), test `tests/questions-0008.test.js`, reference `reference/solid.html`.
- Latihan mengenali pelanggaran = topik `solid-violation`: 6 potongan kode, opsi tetap SRP/OCP/LSP/ISP/DIP.
- `/teach` tidak bisa dipanggil lewat Skill tool; SKILL.md dibaca dan diikuti manual.
- Link "← 0007" mengarah ke `lessons/0007-review-hari-1.html` (slug ditebak dari nama ticket 08); sesuaikan bila ticket 08 memakai slug lain. Link 0009 masih `segera`.
- GLOSSARY tidak diubah: istilah SRP/DIP dkk. baru ditambahkan setelah terbukti dipahami (review 0012).
