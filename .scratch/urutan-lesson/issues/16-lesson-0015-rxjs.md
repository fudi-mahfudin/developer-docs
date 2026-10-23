# 16: Lesson 0015: RxJS untuk interview

**What to build:** Pengguna bisa menjelaskan Observable vs Promise, Subject/BehaviorSubject, operator inti (map, switchMap vs mergeMap, catchError, debounceTime), dan cara mencegah memory leak (async pipe, takeUntil).

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
- [x] Ada latihan memilih operator yang tepat untuk beberapa skenario (misalnya search box, request paralel)

## Comments

- Lesson `lessons/0015-rxjs.html`, soal `assets/questions/0015.js` (13 mc + 1 oral, topik `rx-observable`, `rx-subject`, `rx-operator`, `rx-unsubscribe`), test `tests/questions-0015.test.js`, reference `reference/rxjs.html`. Latihan memilih operator = Latihan 2 (6 skenario: search box, debounce, dashboard paralel/`forkJoin`, tombol Simpan/`exhaustMap`, hapus massal/`mergeMap`, error/`catchError`).
- `assets/bank-quiz.js`: `data-bank-topic` kini menerima daftar dipisah koma (kompatibel ke belakang), dipakai untuk memisahkan kuis konsep dari latihan operator.
- `/teach` tidak bisa dipanggil lewat Skill tool di subagent; SKILL.md dibaca dan diikuti manual. Kutipan diambil dari markdown/JSDoc sumber (angular/angular `16.2.x`, ReactiveX/rxjs `7.x`).
