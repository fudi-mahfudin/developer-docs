# 14: Lesson 0013: Angular dasar untuk developer React

**What to build:** Pengguna bisa menjelaskan NgModule (dan sekilas standalone component), struktur component, data binding, structural directive versi v16, serta Lifecycle Hook, beserta padanannya di React.

**Blocked by:** 01

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
- [x] Semua contoh memakai sintaks Angular 16 (tanpa control flow v17)

## Comments

- Dibangun: `lessons/0013-angular-dasar.html` (±14 menit, target: jelaskan component Angular 16 dari sudut React), `assets/questions/0013.js` (9 soal kuis di topik `ng-module`, `ng-binding`, `ng-lifecycle`, diselang-seling, jawaban di posisi a–d, plus 1 soal lisan dengan checklist 6 poin), `reference/angular-dasar.html`, dan `tests/questions-0013.test.js` (jumlah kata opsi sama, posisi jawaban bervariasi, tidak ada sintaks v17 sebagai jawaban benar). Entri indeks 0013 sudah `tersedia`.
- Kutipan diambil dari markdown sumber dokumentasi v16 (repo angular/angular, branch `16.2.x`), karena v16.angular.io adalah SPA. Link di lesson tetap mengarah ke halaman v16.angular.io.
- Tambahan append-only: dua sumber di RESOURCES, istilah `Data Binding` dan `Structural Directive` di GLOSSARY, satu catatan di NOTES.
- Masih terbuka: lesson 0012 belum ada di branch ini, jadi link "berikutnya" dari 0012 ke 0013 belum dibuat. Nav 0013 menebak nama file `0012-review-hari-2.html` dan `0014-angular-di-routing.html` (diambil dari nama file issue); sesuaikan saat merge kalau slug-nya berbeda.
