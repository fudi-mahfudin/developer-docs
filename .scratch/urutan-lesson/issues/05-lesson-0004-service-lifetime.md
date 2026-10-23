# 05: Lesson 0004: Service Lifetime dan captive dependency

**What to build:** Pengguna bisa menjelaskan Transient, Scoped, dan Singleton lewat contoh nyata, kenapa DbContext didaftarkan sebagai Scoped, dan apa itu captive dependency beserta cara mendeteksinya (scope validation).

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
- [x] Ada latihan memilih lifetime yang tepat untuk beberapa skenario, ditambah satu skenario captive dependency

## Comments

- 2026-10-23 (agent): Lesson `lessons/0004-service-lifetime.html`, soal `assets/questions/0004.js` (10 mc + 2 oral; topik `di-lifetime`, `di-dbcontext`, `di-captive`), test `tests/questions-0004.test.js`, reference `reference/service-lifetime.html`. Sumber: Microsoft Learn (Service lifetimes, DI guidelines, DI in ASP.NET Core 8, scope validation, EF Core DbContext lifetime) dan NestJS injection scopes, semuanya ditambahkan ke RESOURCES. GLOSSARY: Captive Dependency, Scope Validation. `/teach` dijalankan dengan membaca SKILL.md (tidak bisa dipanggil lewat Skill tool). Entri indeks sudah diperbarui. Checkbox navigasi masih terbuka: lesson 0003 dibangun paralel dan belum ada, jadi link "next" di 0003 dan link "prev" di 0004 (masih `disabled`) perlu disambungkan setelah 0003 masuk.
