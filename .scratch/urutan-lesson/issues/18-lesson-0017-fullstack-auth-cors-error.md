# 18: Lesson 0017: Topik fullstack — JWT, authn vs authz, CORS, error handling

**What to build:** Pengguna bisa menceritakan alur login dari ujung ke ujung: Angular mengirim kredensial, API menerbitkan JWT, interceptor menambahkan header, API memeriksa authentication dan authorization, lalu error dikembalikan sebagai ProblemDetails. Pengguna juga bisa menjelaskan CORS dan trade-off menyimpan JWT di localStorage vs httpOnly cookie.

**Blocked by:** 06, 17

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
- [x] Ada latihan lisan "jelaskan alur login aplikasi Anda" yang mencakup frontend dan backend

## Comments

- Dibangun `lessons/0017-fullstack-auth-cors-error.html`, soal `assets/questions/0017.js` (12 mc di 5 topik `fs-*`, 2 oral termasuk "jelaskan alur login aplikasi Anda"), test `tests/questions-0017.test.js`, reference `reference/auth-cors-error.html`. Latihan susun alur login memakai `assets/order.js`. RESOURCES/GLOSSARY/NOTES ditambah (append). `/teach` tidak bisa dipanggil lewat Skill tool; SKILL.md dibaca dan diikuti manual. Kutipan dari Microsoft Learn (.NET 8), RFC 7519/9457, OWASP, Angular 16.2.x markdown. Waktu 10–15 menit belum diuji dengan user sungguhan (2 latihan lisan bisa membuatnya mendekati 15+ menit).
