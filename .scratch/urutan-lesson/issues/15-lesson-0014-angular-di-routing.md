# 15: Lesson 0014: Angular Service, DI, dan routing

**What to build:** Pengguna bisa menjelaskan Angular Service dan DI hierarkis dibandingkan React Context, serta routing, lazy loading, dan guard untuk melindungi halaman.

**Blocked by:** 14

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

## Comments

- Dibangun mengikuti instruksi `/teach` (SKILL.md dibaca langsung karena skill tidak bisa dipanggil via Skill tool). Lesson: `lessons/0014-angular-di-routing.html`; soal: `assets/questions/0014.js` (10 kuis + 1 lisan, topik `ng-di`, `ng-routing`, `ng-guard`); test: `tests/questions-0014.test.js`; reference: `reference/angular-di-routing.html`.
- Kutipan Angular diambil dari markdown `aio/content/guide/` branch `16.2.x` (dan JSDoc `packages/router/src/models.ts` untuk status deprecated class guard), ditautkan ke v16.angular.io. Padanan React dari react.dev. Dua sumber baru ditambahkan di RESOURCES.
- GLOSSARY tidak diubah: istilah yang dipakai sudah ada (Angular Service, NgModule); istilah baru (guard, lazy loading) belum ditambahkan karena aturan glossary hanya menambah istilah yang sudah terbukti dipahami user.
- Link "next" ke `0015-rxjs.html` mengikuti slug issue 16; perlu dicek saat 0015 di-merge.
