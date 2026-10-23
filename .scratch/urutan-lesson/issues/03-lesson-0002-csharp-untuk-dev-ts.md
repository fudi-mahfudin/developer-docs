# 03: Lesson 0002: C# untuk developer TypeScript

**What to build:** Pengguna bisa menjelaskan class vs record vs struct, value type vs reference type, nullable reference types, dan interface vs abstract class, beserta padanannya di TypeScript. Pengguna juga bisa menjelaskan kenapa DTO cocok ditulis sebagai record.

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
- [x] Link navigasi dari lesson sebelumnya dan entri di halaman indeks lesson sudah diperbarui
- [x] Memakai stylesheet dan komponen bersama; kode yang bisa dipakai ulang ditaruh di assets, bukan ditulis langsung di lesson

## Comments

- Dibangun: `lessons/0002-csharp-untuk-dev-ts.html` (target: "Apa beda class, record, dan struct, dan kenapa DTO ditulis sebagai record?"), `assets/questions/0002.js` (10 soal mc + 3 soal lisan, 4 topik: `csharp-value-ref`, `csharp-record`, `csharp-nullable`, `csharp-interface-abstract`), `reference/csharp-untuk-ts.html`, `tests/questions-0002.test.js` (memuat file soal ke bank dan memeriksa jumlah kata opsi yang sama, variasi posisi jawaban, checklist lisan 6 poin). Semua klaim C# dikutip dari Microsoft Learn; sumber baru ditambahkan ke RESOURCES, istilah baru (Value Type, Reference Type, Record, Nullable Reference Types, Abstract Class) ditambahkan ke GLOSSARY bagian "Fondasi C#". Baris 0002 di `index.html` sudah `tersedia`.
- `/teach` tidak bisa dipanggil lewat Skill tool dari subagent; `SKILL.md` dan file `*-FORMAT.md`-nya dibaca dan diikuti secara manual.
- Belum: link "→ 0002" di nav lesson 0001 belum diubah, karena 0001 sedang dibangun ulang di branch paralel (tiket 0001 sudah mencakup navigasi ke 0002). Lesson 0002 sudah menautkan balik ke `0001-layer-dan-alur-request.html`. Nav "0003 →" masih disabled sampai 0003 ada.
- Tidak ada learning record baru: materi baru dipaparkan, belum ada bukti penguasaan (itu tugas review 0007).
