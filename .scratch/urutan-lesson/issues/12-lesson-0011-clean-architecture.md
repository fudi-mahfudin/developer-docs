# 12: Lesson 0011: Clean Architecture dan debat Repository

**What to build:** Pengguna bisa menggambar dan menjelaskan Clean Architecture (dependency rule, posisi interface dan implementasinya), membandingkannya dengan layered, dan memberi argumen pro, kontra, serta "kapan tidak perlu" untuk Repository di atas EF Core.

**Blocked by:** 07, 09

**Status:** ready-for-agent

- [x] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya di RESOURCES (tambahkan sumber baru ke RESOURCES bila perlu), dan setiap klaim penting diberi kutipan
- [x] Lesson bisa diselesaikan dalam 10–15 menit dan punya satu target berupa pertanyaan interview yang bisa dijawab
- [x] Ada kuis dengan feedback langsung: setiap pilihan jawaban punya jumlah kata yang sama, dan posisi jawaban benar bervariasi
- [x] Ada latihan lisan (jawab dengan suara keras) dengan jawaban contoh dan checklist 6 poin
- [x] Soal kuis didaftarkan ke bank soal bersama dengan tag topik dan nomor lesson, supaya bisa dipakai di review campuran
- [x] Reference doc yang bisa dicetak dibuat atau diperbarui dan di-link dari lesson
- [x] Istilah konsisten dengan GLOSSARY, dan setiap konsep diberi padanan Node/Express/React
- [x] Ada satu sumber resmi utama yang direkomendasikan, plus pengingat untuk bertanya ke agent
- [ ] Link navigasi dari lesson sebelumnya dan entri di halaman indeks lesson sudah diperbarui
- [x] Memakai stylesheet dan komponen bersama; kode yang bisa dipakai ulang ditaruh di assets, bukan ditulis langsung di lesson

## Comments

- Dibangun: `lessons/0011-clean-architecture.html`, `assets/questions/0011.js` (12 kuis + 2 lisan; topik `ca-dependency-rule`, `ca-placement`, `ca-vs-layered`, `repo-ef-core`), `tests/questions-0011.test.js`, `reference/clean-architecture.html`. Index, RESOURCES, GLOSSARY (5 istilah), NOTES diperbarui.
- `/teach` tidak bisa dipanggil lewat Skill tool di subagent; SKILL.md dan file format-nya dibaca dan diikuti langsung.
- Kutipan diambil langsung dari Microsoft Learn (Common web application architectures, persistence layer design), EF Core docs (testing strategy, DbContext API), dan artikel Clean Architecture Robert C. Martin.
- Checkbox navigasi belum dicentang: lesson ini sudah me-link ke `0010-jenis-test.html` dan `0012-review-hari-2.html`, tapi link maju dari 0010 ke 0011 harus ditambahkan saat 0010 dibangun.
