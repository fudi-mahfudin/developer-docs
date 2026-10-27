-- Lesson 0021 · Transaction, isolation level, locking, deadlock · SESI B
-- Pasangan file ini: dotnet/lab/0021-sesi-a.sql. Mulai dari Langkah 1 di Sesi A.
-- JANGAN jalankan seluruh file sekaligus: jalankan satu langkah, lalu ikuti penanda ">>> lanjut".
-- SET TRANSACTION ISOLATION LEVEL berlaku untuk seluruh sesi sampai diganti, jadi setiap
-- bagian menyetel ulang isolation level-nya sendiri.

-- ============ Bagian 0 · Persiapan ============================================================

-- Langkah 2 (Sesi B) -----------------------------------------------------------------------
USE ProductCatalogLab;
SELECT @@SPID AS SesiB;                        -- session id jendela ini, berbeda dari Sesi A
-- >>> lanjut: Sesi A, Langkah 3

-- ============ Bagian 2 · Blocking ============================================================

-- Langkah 5 (Sesi B) -----------------------------------------------------------------------
-- READ COMMITTED berbasis lock butuh shared (S) lock untuk membaca; baris Id 1 dipegang X lock
-- oleh Sesi A, jadi query ini MENUNGGU. Tanpa LOCK_TIMEOUT, ia menunggu selamanya.
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT Id, Name, Price FROM dbo.Product WHERE Id = 1;        -- berputar... lalu 80.19 setelah Langkah 7
-- >>> lanjut: Sesi A, Langkah 6 (biarkan query ini tetap menunggu)

-- ============ Bagian 3 · Dirty read ==========================================================

-- Langkah 9 (Sesi B) -----------------------------------------------------------------------
-- READ UNCOMMITTED tidak meminta S lock (sama dengan hint WITH (NOLOCK)): tidak menunggu,
-- tapi membaca data yang belum di-commit.
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 99999.99, langsung
-- >>> lanjut: Sesi A, Langkah 10

-- Langkah 11 (Sesi B) ----------------------------------------------------------------------
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 80.19: yang tadi adalah dirty read
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- >>> lanjut: Langkah 12 (masih Sesi B)

-- ============ Bagian 4 · Non-repeatable read =================================================

-- Langkah 12 (Sesi B) ----------------------------------------------------------------------
-- READ COMMITTED: S lock dilepas begitu baris selesai dibaca, bukan di akhir transaction.
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 80.19
-- >>> lanjut: Sesi A, Langkah 13

-- Langkah 14 (Sesi B) ----------------------------------------------------------------------
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 90.00: transaction yang SAMA, hasil beda
COMMIT TRANSACTION;
-- >>> lanjut: Langkah 15 (masih Sesi B)

-- Langkah 15 (Sesi B) ----------------------------------------------------------------------
-- REPEATABLE READ: S lock ditahan sampai akhir transaction.
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 90.00
-- >>> lanjut: Sesi A, Langkah 16

-- Langkah 17 (Sesi B) ----------------------------------------------------------------------
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- tetap 90.00: UPDATE Sesi A masih menunggu
COMMIT TRANSACTION;            -- S lock dilepas; UPDATE di Sesi A langsung selesai (80.19)
-- >>> lanjut: Langkah 18 (masih Sesi B)

-- ============ Bagian 5 · Phantom =============================================================

-- Langkah 18 (Sesi B) ----------------------------------------------------------------------
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT COUNT(*) AS Jumlah FROM dbo.Product WHERE Id >= 99995;   -- 6 (Id 99995..100000)
-- >>> lanjut: Sesi A, Langkah 19

-- Langkah 20 (Sesi B) ----------------------------------------------------------------------
SELECT COUNT(*) AS Jumlah FROM dbo.Product WHERE Id >= 99995;   -- 7: baris baru muncul = phantom
COMMIT TRANSACTION;
-- >>> lanjut: Langkah 21 (masih Sesi B)

-- Langkah 21 (Sesi B) ----------------------------------------------------------------------
-- SERIALIZABLE: range lock atas rentang WHERE, jadi tidak ada baris baru yang bisa masuk.
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT COUNT(*) AS Jumlah FROM dbo.Product WHERE Id >= 99995;   -- 7
-- >>> lanjut: Sesi A, Langkah 22

-- Langkah 23 (Sesi B) ----------------------------------------------------------------------
SELECT COUNT(*) AS Jumlah FROM dbo.Product WHERE Id >= 99995;   -- tetap 7: INSERT Sesi A masih menunggu
COMMIT TRANSACTION;            -- range lock dilepas; INSERT di Sesi A langsung selesai
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- >>> lanjut: Sesi A, Langkah 24

-- ============ Bagian 6 · Deadlock ============================================================

-- Langkah 26 (Sesi B) ----------------------------------------------------------------------
BEGIN TRANSACTION;
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 2;       -- B memegang X lock baris 2
-- >>> lanjut: Sesi A, Langkah 27

-- Langkah 28 (Sesi B) ----------------------------------------------------------------------
-- B meminta baris 1 (milik A), A meminta baris 2 (milik B): siklus. Deadlock monitor
-- (default memeriksa tiap 5 detik) memilih satu victim: Msg 1205, transaction-nya di-rollback.
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 1;
-- >>> lanjut: Langkah 29 di KEDUA jendela

-- Langkah 29 (Sesi A DAN Sesi B) -----------------------------------------------------------
IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
SELECT @@TRANCOUNT AS TranCount, Id, Stock FROM dbo.Product WHERE Id IN (1, 2);   -- 0; 31 dan 62
-- >>> lanjut: Sesi A, Langkah 30 atau 31

-- Langkah 32 (Sesi B) ----------------------------------------------------------------------
-- Urutan sama dengan Sesi A: Id 1 dulu. Ini hanya BLOCKING (menunggu A selesai), bukan deadlock.
BEGIN TRANSACTION;
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 1;       -- menunggu sampai Sesi A ROLLBACK
-- >>> lanjut: Sesi A, Langkah 33

-- Langkah 34 (Sesi B) ----------------------------------------------------------------------
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 2;
ROLLBACK TRANSACTION;
SELECT Id, Stock FROM dbo.Product WHERE Id IN (1, 2);        -- 31 dan 62
-- >>> lanjut: Sesi A, Langkah 35 (opsional) atau selesai

-- ============ Bagian 7 · SNAPSHOT isolation (ringkas, opsional) ==============================

-- Langkah 36 (Sesi B) ----------------------------------------------------------------------
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
BEGIN TRANSACTION;
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 80.19 (snapshot diambil di sini)
-- >>> lanjut: Sesi A, Langkah 37

-- Langkah 38 (Sesi B) ----------------------------------------------------------------------
-- Baris Id 1 sedang dipegang X lock oleh Sesi A, tapi SNAPSHOT membaca versi lama dari
-- version store (tempdb): tidak menunggu.
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 80.19, langsung
-- >>> lanjut: Sesi A, Langkah 39

-- Langkah 40 (Sesi B) ----------------------------------------------------------------------
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- tetap 80.19 walau Sesi A sudah commit 70.00
-- Mengubah baris yang sudah diubah transaction lain setelah snapshot diambil:
-- Msg 3960 (update conflict), transaction ini dibatalkan.
UPDATE dbo.Product SET Price = Price + 1 WHERE Id = 1;
-- >>> lanjut: Langkah 41 (masih Sesi B)

-- Langkah 41 (Sesi B) ----------------------------------------------------------------------
SELECT @@TRANCOUNT AS TranCount;                             -- 0: sudah di-rollback engine
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- >>> lanjut: Sesi A, Langkah 42
