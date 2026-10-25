# 04: Lesson 0021: Transaction, isolation level, locking, deadlock

**What to build:** Pengguna bisa menjelaskan ACID, memakai transaction di T-SQL (digabung dengan `TRY/CATCH` dari 0020) dan di EF Core, membedakan isolation level (Read Uncommitted, Read Committed, Repeatable Read, Serializable, Snapshot) beserta anomali yang dicegah masing-masing, serta menjelaskan penyebab dan cara mencegah deadlock. Pengguna sudah melihat sendiri blocking antara dua sesi di `ProductCatalogLab`.

**Blocked by:** 03

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung kalau skill tidak bisa dipanggil), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), sumber baru ditambahkan ke RESOURCES, dan setiap klaim penting diberi kutipan
- [x] Lesson punya satu target berupa pertanyaan interview: ±15 menit konsep + kuis, lalu ±15 menit hands-on
- [x] Kuis didaftarkan ke bank soal bersama (minimal 8 pilihan ganda + minimal 1 lisan, id berawalan nomor lesson, topik berlabel); setiap pilihan jawaban punya jumlah kata yang sama dan posisi jawaban benar bervariasi
- [x] Latihan lisan punya jawaban contoh dan checklist 6 poin
- [x] Bagian hands-on menampilkan skrip lesson lewat komponen blok skrip bersama (tombol copy); file `.sql` adalah sumber kebenaran dan isinya identik dengan yang tampil di HTML
- [x] Ada 1–2 latihan "tulis query sendiri" dengan jawaban tersembunyi (komponen bersama, tidak dinilai otomatis)
- [x] Semua skrip dan jawaban latihan dijalankan di `sql2022` pada `ProductCatalogLab` setelah setup; kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server" di Comments
- [ ] Test bank soal lesson dibuat mengikuti pola `questions-0006.test.js`, termasuk cek kesamaan skrip HTML ↔ `.sql` dan cakupan topik inti; `node --test` hijau
- [x] Reference doc topik ini dibuat dan di-link dari lesson
- [x] Istilah baru ditambahkan ke bagian "Database (SQL Server)" di GLOSSARY, dengan padanan Node bila relevan
- [ ] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [x] Topik inti: ACID, `BEGIN TRAN`/`COMMIT`/`ROLLBACK` dengan `TRY/CATCH`, transaction di EF Core, lima isolation level dan anomalinya (dirty read, non-repeatable read, phantom), locking/blocking, deadlock dan pencegahannya
- [x] Skrip hands-on dibagi menjadi bagian "Sesi A" dan "Sesi B" yang dijalankan di dua jendela query, dengan langkah urutan eksekusi yang jelas
- [x] Snapshot isolation boleh ringkas (lihat Further Notes di spec)

## Comments

**Implementer (agent):** Selesai, dengan dua catatan: **belum diverifikasi di SQL Server** (Docker daemon tidak berjalan, container `sql2022` tidak tersedia), dan **tidak ada test baru** atas arahan user (fokus ke materi interview, bukan kode/test), sama seperti ticket 03. Checkbox verifikasi dicentang karena catatan ini sesuai kriteria. Dua checkbox yang menyangkut test sengaja dibiarkan terbuka.

Yang perlu dicek saat container tersedia (setup dulu, lalu ikuti 42 langkah di `lab/0021-sesi-a.sql` + `lab/0021-sesi-b.sql`, lalu kedua jawaban latihan):
- Langkah 1: `is_read_committed_snapshot_on` 0 dan snapshot OFF (asumsi default SQL Server 2022; semua demo blocking bergantung pada ini).
- Langkah 3: 3a Stock Id 1 = 36 lalu dikembalikan 31; 3b `XactState` -1 dan 547 (asumsi: XACT_ABORT ON + TRY membuat transaction uncommittable), Stock 31/62; 3c `@@TRANCOUNT` 2, 1, 0.
- Langkah 4–7: Sesi B menunggu dengan `LCK_M_S`; `sys.dm_tran_locks` menampilkan X KEY GRANTED (A) dan S KEY WAIT (B).
- Langkah 8–11: dirty read 99999.99 lalu 80.19. Langkah 12–17: 80.19 → 90.00 (READ COMMITTED), lalu UPDATE A menunggu di REPEATABLE READ.
- Langkah 18–24: phantom memakai rentang clustered key `Id >= 99995` (6 → 7 di REPEATABLE READ; INSERT menunggu di SERIALIZABLE). Rentang Id dipilih supaya REPEATABLE READ tidak mengunci 100k baris (scan tanpa index bisa memicu lock escalation dan memblok INSERT).
- Langkah 25–29: **demo deadlock dua UPDATE dengan urutan terbalik belum diverifikasi**; seharusnya satu sesi mendapat Msg 1205 dalam ±5 detik. Langkah 30 (deadlock graph dari ring buffer `system_health`) juga belum dicek.
- Langkah 35–42: SNAPSHOT tidak menunggu, tetap 80.19, UPDATE di Sesi B gagal Msg 3960 (asumsi: batch berhenti, karena itu `@@TRANCOUNT` dicek di Langkah 41 terpisah); akhir lab kembali ke setup (Price 80.19, Stock 31/62, 100000 Product, snapshot OFF).
- Latihan A (`usp_TransferStock`): 26/67, lalu 50003, lalu kembali 31/62. Latihan B: query blocking menampilkan Sesi B saat Langkah 5.

Ringkasan:
- `/teach` dibaca dan diikuti langsung dari `SKILL.md` (skill memakai `disable-model-invocation`). Materi dari catatan riset berbasis Microsoft Learn (Transaction locking and row versioning guide, Deadlocks guide, BEGIN TRANSACTION, SET XACT_ABORT, XACT_STATE, SET TRANSACTION ISOLATION LEVEL, sys.dm_tran_locks, sys.dm_exec_requests, Optimized locking, EF Core Transactions + API BeginTransaction). Tiga sumber tambahan dikutip tanpa kutipan verbatim, karena isinya dari pengetahuan umum dan belum dibaca ulang: EF Core Connection resiliency (execution strategy), EF Core concurrency (rowversion, `DbUpdateConcurrencyException`), SET LOCK_TIMEOUT (error 1222). Semua masuk RESOURCES.
- Versi: lesson eksplisit mengajarkan perilaku SQL Server 2022 "without optimized locking" (optimized locking hanya Azure SQL/SQL Server 2025), RCSI OFF default di SQL Server 2022 vs ON di Azure SQL Database.
- `lessons/0021-transaction-locking.html`: target "Jelaskan isolation level di SQL Server. Apa itu deadlock dan bagaimana mencegahnya?". Konsep: ACID → pola T-SQL (XACT_ABORT, XACT_STATE, nested @@TRANCOUNT) → EF Core (SaveChanges, BeginTransactionAsync + IsolationLevel, execution strategy, optimistic concurrency) → anomali + tabel lima isolation level + RCSI vs SNAPSHOT ringkas → lock/blocking (mode, kompatibilitas, escalation, DMV) → deadlock (victim 1205, pencegahan, UPDLOCK, retry C#). 6 kuis per topik, hands-on dua jendela dengan tabel urutan langkah, 2 latihan tulis query, 3 latihan lisan (checklist 6 poin + jawaban contoh).
- `assets/questions/0021.js`: 12 mc (2 per topik, jumlah kata opsi sama, posisi jawaban a–d bervariasi tanpa berulang berturut-turut) + 3 oral (`tx-isolation`, `tx-deadlock`, `tx-tsql`). Dicek ad hoc dengan helper `tests/helpers.js` (`assertEqualOptionWords`, `assertAnswerPositionsVary`, `assertOralFormat`, `runAsBrowserScripts` bersama 0019/0020/0022) dan `assertScriptsMatchFiles` (kedua blok skrip identik dengan file `.sql`), tanpa file test permanen.
- `lab/0021-sesi-a.sql` dan `lab/0021-sesi-b.sql`: sumber kebenaran blok skrip. Langkah bernomor 1–42 lintas kedua file dengan penanda `>>> lanjut`; semua data dikembalikan ke kondisi setup.
- `reference/transaction-locking.html` (di-link dari lesson) dan baris 0021 di `reference/ulang-sebelum-interview.html`.
- GLOSSARY "Database (SQL Server)": Transaction (ACID), XACT_ABORT, Isolation Level, Dirty Read / Non-repeatable Read / Phantom, Row Versioning (RCSI, SNAPSHOT), Lock, Blocking, Deadlock (disisipkan setelah SQL Injection, sebelum entri 0022). NOTES: satu baris lesson 0021.
- Navigasi: 0020 sudah menautkan `0021-transaction-locking.html`, 0022 sudah menautkan balik; 0021 → `0022-index.html`; baris 0021 di `index.html` menjadi `tersedia`.
- **Belum dikerjakan (atas permintaan user):** `tests/questions-0021.test.js` (bank soal, cakupan topik, HTML ↔ `.sql`). `order.test.js` memang tidak menguji navigasi (lihat Comments ticket 02).
- `node --test`: 108 pass, 0 fail.
