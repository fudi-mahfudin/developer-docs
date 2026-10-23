# 11: Lesson 0010: Jenis test dan test double

**What to build:** Pengguna bisa membedakan Unit Test, Integration Test, dan E2E (testing pyramid), membedakan Mock, stub, dan fake, serta menjelaskan WebApplicationFactory secara konsep dan apa yang sebaiknya di-mock atau tidak.

**Blocked by:** 10

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
- [x] Link navigasi dari lesson sebelumnya dan entri di halaman indeks lesson sudah diperbarui
- [x] Memakai stylesheet dan komponen bersama; kode yang bisa dipakai ulang ditaruh di assets, bukan ditulis langsung di lesson

## Comments

- Dibangun `lessons/0010-jenis-test.html` (target: jenis test + mock/stub/fake, dua latihan lisan 60 detik dengan checklist 6 poin), soal `assets/questions/0010.js` (12 kuis + 2 lisan, topik `test-jenis`, `test-double`, `test-waf`, `test-mock-apa`), test `tests/questions-0010.test.js`, reference `reference/jenis-test.html`. Sumber: Microsoft Learn integration tests (.NET 8), unit testing best practices, EF Core testing strategy, Fowler TestDouble / Mocks Aren't Stubs, Practical Test Pyramid, Moq Quickstart. `/teach` dijalankan dengan membaca SKILL.md-nya (subagent tidak bisa memanggilnya lewat Skill tool). Tidak ada latihan `order.js` (file itu sedang di-merge). Link ke 0011 sudah dipasang; lesson 0011 dibangun paralel.
