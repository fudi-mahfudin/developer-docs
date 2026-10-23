# 17: Lesson 0016: Reactive Forms, HttpClient, dan HTTP Interceptor

**What to build:** Pengguna bisa membandingkan Reactive Forms dengan template-driven forms, menjelaskan alur HttpClient yang mengembalikan Observable, dan menjelaskan peran HTTP Interceptor (menambahkan header, menangani error secara global).

**Blocked by:** 15, 16

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

- Dibangun di `lessons/0016-forms-http-interceptor.html`; soal di `assets/questions/0016.js` (11 kuis + 1 lisan, topik `ng-forms`, `ng-http`, `ng-interceptor`), test `tests/questions-0016.test.js`; reference `reference/forms-http-interceptor.html`. `/teach` tidak bisa dipanggil lewat Skill tool oleh subagent, jadi SKILL.md dan file workspace dibaca langsung. Kutipan diambil dari markdown `aio/content/guide/` branch 16.2.x dan ditautkan ke v16.angular.io. Link "next" ke 0017 baru hidup setelah lesson 0017 dibangun.
