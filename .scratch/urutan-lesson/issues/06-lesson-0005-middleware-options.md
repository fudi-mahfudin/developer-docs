# 06: Lesson 0005: Middleware pipeline dan Options Pattern

**What to build:** Pengguna bisa menjelaskan request lifecycle melalui middleware pipeline, kenapa urutannya penting (exception handler, CORS, authentication, authorization, endpoint), cara memakai scoped service di middleware, serta konfigurasi berlapis (appsettings, environment, User Secrets) dengan Options Pattern.

**Blocked by:** 05

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
- [x] Ada latihan menyusun urutan middleware dengan feedback langsung

## Comments

- Lesson `lessons/0005-middleware-options.html` dibangun (skill `/teach` dibaca dari SKILL.md karena tidak bisa dipanggil lewat Skill tool). Soal di `assets/questions/0005.js` (15 kuis + 2 lisan, topik `mw-pipeline`, `mw-order`, `mw-scoped`, `config-layers`, `options-pattern`), test `tests/questions-0005.test.js`.
- Komponen baru `assets/order.js` (latihan susun urutan, logic diuji di `tests/order.test.js`), dipakai untuk urutan middleware dan prioritas konfigurasi. README assets diperbarui.
- Reference `reference/middleware-dan-options.html`. RESOURCES (+5 sumber), GLOSSARY (Short-circuit, User Secrets), NOTES ditambah. Nav 0004 → 0005 → 0006 dan indeks diperbarui.
- Semua kutipan diambil dari Microsoft Learn versi aspnetcore-8.0 dan dokumentasi Express.
