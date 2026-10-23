# 05: Lesson 0004: Service Lifetime dan captive dependency

**What to build:** Pengguna bisa menjelaskan Transient, Scoped, dan Singleton lewat contoh nyata, kenapa DbContext didaftarkan sebagai Scoped, dan apa itu captive dependency beserta cara mendeteksinya (scope validation).

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [ ] Materi diambil dari sumber terpercaya di RESOURCES (tambahkan sumber baru ke RESOURCES bila perlu), dan setiap klaim penting diberi kutipan
- [ ] Lesson bisa diselesaikan dalam 10–15 menit dan punya satu target berupa pertanyaan interview yang bisa dijawab
- [ ] Ada kuis dengan feedback langsung: setiap pilihan jawaban punya jumlah kata yang sama, dan posisi jawaban benar bervariasi
- [ ] Ada latihan lisan (jawab dengan suara keras) dengan jawaban contoh dan checklist 6 poin
- [ ] Soal kuis didaftarkan ke bank soal bersama dengan tag topik dan nomor lesson, supaya bisa dipakai di review campuran
- [ ] Reference doc yang bisa dicetak dibuat atau diperbarui dan di-link dari lesson
- [ ] Istilah konsisten dengan GLOSSARY, dan setiap konsep diberi padanan Node/Express/React
- [ ] Ada satu sumber resmi utama yang direkomendasikan, plus pengingat untuk bertanya ke agent
- [ ] Link navigasi dari lesson sebelumnya dan entri di halaman indeks lesson sudah diperbarui
- [ ] Memakai stylesheet dan komponen bersama; kode yang bisa dipakai ulang ditaruh di assets, bukan ditulis langsung di lesson
- [ ] Ada latihan memilih lifetime yang tepat untuk beberapa skenario, ditambah satu skenario captive dependency
