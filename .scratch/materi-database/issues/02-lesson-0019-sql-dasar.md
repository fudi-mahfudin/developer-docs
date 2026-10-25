# 02: Lesson 0019: SQL dasar untuk interview

**What to build:** Pengguna bisa menjelaskan INNER/LEFT/RIGHT JOIN, WHERE vs HAVING, subquery vs CTE, dan menulis query top-N-per-grup dengan `ROW_NUMBER() OVER (PARTITION BY ...)` di `ProductCatalogLab` tanpa melihat catatan. Pengguna juga bisa menjelaskan secara singkat kenapa aturan Product (nama unik, Price > 0, Stock ≥ 0) dijaga lewat constraint di database, bukan hanya di Service.

**Blocked by:** 01

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung kalau skill tidak bisa dipanggil), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), sumber baru ditambahkan ke RESOURCES, dan setiap klaim penting diberi kutipan
- [x] Lesson punya satu target berupa pertanyaan interview: ±15 menit konsep + kuis, lalu ±15 menit hands-on
- [x] Kuis didaftarkan ke bank soal bersama (minimal 8 pilihan ganda + minimal 1 lisan, id berawalan nomor lesson, topik berlabel); setiap pilihan jawaban punya jumlah kata yang sama dan posisi jawaban benar bervariasi
- [x] Latihan lisan punya jawaban contoh dan checklist 6 poin
- [x] Bagian hands-on menampilkan skrip lesson lewat komponen blok skrip bersama (tombol copy); file `.sql` adalah sumber kebenaran dan isinya identik dengan yang tampil di HTML
- [x] Ada 1–2 latihan "tulis query sendiri" dengan jawaban tersembunyi (komponen bersama, tidak dinilai otomatis)
- [x] Semua skrip dan jawaban latihan dijalankan di `sql2022` pada `ProductCatalogLab` setelah setup; kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server" di Comments
- [x] Test bank soal lesson dibuat mengikuti pola `questions-0006.test.js`, termasuk cek kesamaan skrip HTML ↔ `.sql` dan cakupan topik inti; `node --test` hijau
- [x] Reference doc topik ini dibuat dan di-link dari lesson
- [x] Istilah baru ditambahkan ke bagian "Database (SQL Server)" di GLOSSARY, dengan padanan Node bila relevan
- [x] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [x] Topik inti: JOIN, GROUP BY/HAVING, subquery vs CTE, `ROW_NUMBER`, plus selipan normalisasi, constraint (PK, FK, UNIQUE, CHECK), dan view
- [x] Latihan tulis query mencakup "3 Product termahal per Category"
- [x] Lesson 0018 menautkan 0019 sebagai lesson berikutnya

## Comments

**Implementer (agent):** Selesai, kecuali verifikasi di SQL Server: **belum diverifikasi di SQL Server** (Docker daemon tidak berjalan, container `sql2022` tidak tersedia). Checkbox verifikasi dicentang karena catatan ini sesuai kriteria; jalankan setup lalu `lab/0019-sql-dasar.sql` dan kedua jawaban latihan sebelum memakai lesson. Yang perlu dicek: bagian 1 (Mainan hanya muncul di LEFT/RIGHT JOIN dan anti-join, lalu di-ROLLBACK), bagian 3 (kedua angka `AboveCategoryAvg` sama), bagian 5 (empat INSERT gagal dengan 2627/547), latihan A (18 baris), latihan B (Elektronik 180, Olahraga 19, dihitung dari rumus seed).

- `/teach` dibaca dan diikuti langsung dari `SKILL.md` (skill tidak bisa dipanggil agent). Sumber: Microsoft Learn (FROM/JOIN, Joins, GROUP BY, HAVING, urutan logis SELECT, Subqueries, WITH CTE, ROW_NUMBER, PK/FK, UNIQUE/CHECK, normalisasi (arsip), Views, CREATE VIEW), semuanya ditambahkan ke RESOURCES dan dikutip di lesson.
- `lessons/0019-sql-dasar.html`: target "3 Product termahal per Category + jelaskan", konsep JOIN → WHERE/HAVING + urutan logis → subquery vs CTE → ROW_NUMBER/RANK/DENSE_RANK → selipan normalisasi, constraint (tabel aturan Product), view; 5 kuis per topik, hands-on, 2 latihan tulis query, 2 latihan lisan (checklist 6 poin).
- `assets/questions/0019.js`: 12 mc (2 per topik inti, kata opsi sama, posisi jawaban a–d bervariasi) + 2 oral.
- `lab/0019-sql-dasar.sql`: sumber kebenaran blok skrip di lesson. Category kosong untuk demo JOIN ditambahkan dalam transaction lalu di-ROLLBACK (nilai IDENTITY Category ikut terpakai; setup ulang me-resetnya). Membuat view `dbo.vProductWithCategory` (tidak dihapus setup, aman karena bukan SCHEMABINDING).
- `reference/sql-dasar.html` (di-link dari lesson) dan baris 0019 di `reference/ulang-sebelum-interview.html` (test 0018 mewajibkan setiap reference tertaut di sana).
- `tests/questions-0019.test.js`: bank soal (pola 0006), cakupan topik, skrip HTML ↔ `.sql`, latihan top-3, reference, navigasi 0018 → 0019 → 0020 dan entri index.
- **Penyimpangan:** `tests/order.test.js` ternyata menguji komponen `assets/order.js` (latihan susun urutan), bukan navigasi lesson, dan tidak ada test navigasi bersama. Cek navigasi 0019 ditaruh di `tests/questions-0019.test.js`, dan `tests/review-0018.test.js` diubah: 0018 kini maju ke 0019, bukan ke index. Ticket 0020–0024 sebaiknya melakukan hal yang sama.
- Navigasi: 0018 → 0019; 0019 → `0020-stored-procedure.html` (belum ada, nama file untuk ticket 03). `index.html` mendapat bagian "Hari 4 · Database (SQL Server)" dengan 0019 tersedia dan 0020–0024 `segera` (ticket berikutnya cukup mengganti satu baris).
- GLOSSARY "Database (SQL Server)": Outer Join, HAVING, CTE, Window Function, Constraint, Normalisasi, View (dengan padanan Node).
- `node --test`: 108 pass, 0 fail.
