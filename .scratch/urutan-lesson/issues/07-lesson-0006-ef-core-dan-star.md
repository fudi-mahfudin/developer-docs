# 07: Lesson 0006: Konsep EF Core dan tugas STAR malam Hari 1

**What to build:** Pengguna bisa menjelaskan DbContext, change tracking, Migration (code-first), masalah N+1 beserta solusinya, dan kapan memakai AsNoTracking. Di akhir lesson, pengguna mendapat tugas malam: menulis draf 4 cerita STAR.

**Blocked by:** 04, 05

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
- [x] Tugas STAR berisi 4 tema cerita sesuai ROADMAP, ditambah format S-T-A-R
- [x] Tempat menyimpan draf STAR ditentukan, supaya lesson 0018 bisa memakainya

## Comments

- Dibangun `lessons/0006-ef-core-dan-star.html` (target: "Endpoint EF Core lambat: N+1, solusinya, kapan AsNoTracking?"), soal `assets/questions/0006.js` (10 mc + 3 oral; topik `ef-tracking`, `ef-migration`, `ef-n-plus-1`, `ef-no-tracking`), test `tests/questions-0006.test.js`, reference `reference/ef-core.html`. Kutipan dari Microsoft Learn EF Core (change tracking, efficient querying, tracking, related data, migrations) + Prisma untuk padanan N+1.
- Skill `/teach` tidak bisa dipanggil lewat Skill tool oleh subagent; SKILL.md dibaca dan diikuti langsung.
- Draf STAR disimpan di `star/draf-star.md` (template 4 tema + bonus "kenapa pindah stack"); lesson 0018 membaca file ini.
- Nav: lesson ini menautkan ke `0005-middleware-options.html` (dibangun paralel). Link "berikutnya" dari 0005 ke 0006 menjadi tanggung jawab ticket 0005; link ke 0007 masih "segera".
