# 04: Lesson 0003: async/Task dan LINQ

**What to build:** Pengguna bisa menjelaskan Task dan async/await dibandingkan Promise, kenapa `.Result` dan `async void` berbahaya, serta perbedaan IEnumerable vs IQueryable dan deferred execution. Pengguna juga bisa menyebut kapan sebuah query benar-benar dieksekusi.

**Blocked by:** 03

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

- Lesson `lessons/0003-async-task-dan-linq.html`, soal `assets/questions/0003.js` (10 mc + 3 oral; topik `csharp-async`, `linq-deferred`, `linq-queryable`), test `tests/questions-0003.test.js`, reference `reference/async-dan-linq.html`. Target interview: "kenapa `await ...Where(...).ToListAsync()`, bukan `.ToList()`/`.Result`?".
- `/teach` tidak bisa dipanggil lewat Skill tool oleh subagent; aturannya diikuti dengan membaca `SKILL.md` secara langsung.
- Klaim dikutip dari Microsoft Learn (async, TAP, async return types, ASP.NET Core best practices, LINQ, EF Core how-query-works/client-eval/async, IQueryable, expression trees) dan MDN Promise; semuanya ditambahkan ke RESOURCES. GLOSSARY ditambah Task, Deferred Execution, IQueryable.
