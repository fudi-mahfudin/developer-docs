-- Lesson 0021 · Transaction, isolation level, locking, deadlock · SESI A
-- Pasangan file ini: dotnet/lab/0021-sesi-b.sql. Buka KEDUA file di dua jendela query (dua koneksi
-- terpisah ke localhost,1433) setelah dotnet/lab/00-setup-product-catalog-lab.sql dijalankan.
--
-- JANGAN jalankan seluruh file sekaligus. Jalankan satu langkah saja (blok selection
-- antara dua penanda "Langkah"), lalu ikuti penanda ">>> lanjut" ke jendela berikutnya.
-- Langkah bernomor urut di kedua file: Langkah 1 (A), Langkah 2 (B), Langkah 3 (A), dst.
-- Langkah yang "menunggu" (ikon query berputar) memang disengaja: itulah blocking.
--
-- Data yang dipakai (dari setup): Product Id 1 = Price 80.19, Stock 31; Product Id 2 = Price 159.38,
-- Stock 62. Semua langkah mengembalikan data ke nilai ini.

-- ============ Bagian 0 · Persiapan ============================================================

-- Langkah 1 (Sesi A) -----------------------------------------------------------------------
USE ProductCatalogLab;
SELECT @@SPID AS SesiA;                        -- catat angkanya: session id jendela ini

-- Default SQL Server 2022: READ COMMITTED berbasis lock (RCSI OFF), SNAPSHOT tidak diizinkan.
-- Harus 0 dan OFF. Kalau is_read_committed_snapshot_on = 1, demo blocking di Bagian 2 tidak terjadi.
SELECT name, is_read_committed_snapshot_on, snapshot_isolation_state_desc
FROM sys.databases
WHERE name = N'ProductCatalogLab';
-- >>> lanjut: Sesi B, Langkah 2

-- ============ Bagian 1 · Atomicity, XACT_ABORT, TRY/CATCH (Sesi A saja) ======================

-- Langkah 3 (Sesi A) -----------------------------------------------------------------------
-- 3a) JEBAKAN: XACT_ABORT OFF (default) tanpa TRY/CATCH. Error 547 hanya membatalkan
--     STATEMENT yang gagal; batch lanjut, COMMIT tetap jalan, UPDATE pertama tersimpan.
SET XACT_ABORT OFF;
BEGIN TRANSACTION;
    UPDATE dbo.Product SET Stock = Stock + 5 WHERE Id = 1;   -- berhasil
    UPDATE dbo.Product SET Stock = -1 WHERE Id = 2;          -- gagal: CK_Product_Stock (547)
COMMIT TRANSACTION;
SELECT Id, Stock FROM dbo.Product WHERE Id IN (1, 2);        -- Id 1 = 36: setengah transaction tersimpan
UPDATE dbo.Product SET Stock = 31 WHERE Id = 1;              -- kembalikan

-- 3b) POLA BENAR: XACT_ABORT ON + TRY/CATCH. Error apa pun membatalkan SELURUH transaction.
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
        UPDATE dbo.Product SET Stock = Stock + 5 WHERE Id = 1;
        UPDATE dbo.Product SET Stock = -1 WHERE Id = 2;
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    -- XACT_STATE: 1 = masih bisa di-commit, -1 = uncommittable (hanya boleh ROLLBACK), 0 = tidak ada.
    SELECT XACT_STATE() AS XactState, ERROR_NUMBER() AS ErrorNumber;   -- -1 dan 547
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    -- Di Stored Procedure, akhiri CATCH dengan THROW; (lesson 0020). Di sini tidak, supaya demo lanjut.
END CATCH;
SELECT Id, Stock FROM dbo.Product WHERE Id IN (1, 2);        -- 31 dan 62: tidak ada yang berubah
SET XACT_ABORT OFF;

-- 3c) Nested transaction bukan transaction sungguhan: COMMIT dalam hanya mengurangi @@TRANCOUNT.
BEGIN TRANSACTION;
    BEGIN TRANSACTION;
        SELECT @@TRANCOUNT AS TranCount;                     -- 2
        UPDATE dbo.Product SET Stock = 999 WHERE Id = 1;
    COMMIT TRANSACTION;                                      -- tidak menyimpan apa pun
    SELECT @@TRANCOUNT AS TranCount;                         -- 1
ROLLBACK TRANSACTION;                                        -- membatalkan SEMUANYA, termasuk yang "di-commit"
SELECT @@TRANCOUNT AS TranCount, Stock FROM dbo.Product WHERE Id = 1;   -- 0 dan 31
-- >>> lanjut: Langkah 4 (masih Sesi A)

-- ============ Bagian 2 · Blocking dan cara melihatnya ========================================

-- Langkah 4 (Sesi A) -----------------------------------------------------------------------
-- Ambil exclusive (X) lock pada baris Id 1 dan JANGAN commit.
BEGIN TRANSACTION;
UPDATE dbo.Product SET Price = 99999.99 WHERE Id = 1;
SELECT @@TRANCOUNT AS TranCount;                             -- 1: transaction masih terbuka
-- >>> lanjut: Sesi B, Langkah 5

-- Langkah 6 (Sesi A) -----------------------------------------------------------------------
-- Sesi B sedang menunggu. Siapa yang mem-block siapa?
SELECT session_id, status, blocking_session_id, wait_type, wait_time, wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id <> 0;        -- session Sesi B, diblok oleh Sesi A, wait_type LCK_M_S

-- Lock apa saja yang dipegang dan diminta di database ini?
SELECT request_session_id, resource_type, request_mode, request_status, resource_description
FROM sys.dm_tran_locks
WHERE resource_database_id = DB_ID(N'ProductCatalogLab')
  AND resource_type <> 'DATABASE'
ORDER BY request_session_id, resource_type;
-- Sesi A: X pada KEY (GRANTED), IX pada PAGE dan OBJECT (intent lock).
-- Sesi B: S pada KEY yang sama (WAIT), IS pada PAGE dan OBJECT.

-- Langkah 7 (Sesi A) -----------------------------------------------------------------------
ROLLBACK TRANSACTION;          -- lock dilepas, SELECT di Sesi B langsung selesai: 80.19
-- >>> lanjut: Langkah 8 (masih Sesi A)

-- ============ Bagian 3 · Dirty read (READ UNCOMMITTED) =======================================

-- Langkah 8 (Sesi A) -----------------------------------------------------------------------
BEGIN TRANSACTION;
UPDATE dbo.Product SET Price = 99999.99 WHERE Id = 1;        -- belum di-commit
-- >>> lanjut: Sesi B, Langkah 9

-- Langkah 10 (Sesi A) ----------------------------------------------------------------------
ROLLBACK TRANSACTION;          -- 99999.99 yang dibaca Sesi B tidak pernah ada secara resmi
-- >>> lanjut: Sesi B, Langkah 11

-- ============ Bagian 4 · Non-repeatable read (READ COMMITTED vs REPEATABLE READ) =============

-- Langkah 13 (Sesi A) ----------------------------------------------------------------------
UPDATE dbo.Product SET Price = 90.00 WHERE Id = 1;           -- autocommit; tidak menunggu
-- >>> lanjut: Sesi B, Langkah 14

-- Langkah 16 (Sesi A) ----------------------------------------------------------------------
-- Sesi B (REPEATABLE READ) memegang S lock sampai transaction-nya selesai: UPDATE ini MENUNGGU.
UPDATE dbo.Product SET Price = 80.19 WHERE Id = 1;           -- selesai setelah Sesi B COMMIT (Langkah 17)
SELECT Id, Price FROM dbo.Product WHERE Id = 1;              -- 80.19
-- >>> lanjut: Sesi B, Langkah 17

-- ============ Bagian 5 · Phantom (REPEATABLE READ vs SERIALIZABLE) ===========================

-- Langkah 19 (Sesi A) ----------------------------------------------------------------------
-- Id baru (IDENTITY) > 100000, jadi masuk ke rentang "Id >= 99995" yang sedang dibaca Sesi B.
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
VALUES (N'Phantom 0021 RR', 10.00, 1, 6, SYSDATETIME());     -- langsung berhasil
-- >>> lanjut: Sesi B, Langkah 20

-- Langkah 22 (Sesi A) ----------------------------------------------------------------------
-- Sesi B (SERIALIZABLE) memegang key-range lock atas rentang itu: INSERT ini MENUNGGU.
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
VALUES (N'Phantom 0021 SER', 10.00, 1, 6, SYSDATETIME());    -- selesai setelah Sesi B COMMIT (Langkah 23)
-- >>> lanjut: Sesi B, Langkah 23

-- Langkah 24 (Sesi A) ----------------------------------------------------------------------
DELETE FROM dbo.Product WHERE Name LIKE N'Phantom 0021%';    -- bersihkan
SELECT COUNT(*) AS ProductCount FROM dbo.Product;            -- 100000
-- >>> lanjut: Langkah 25 (masih Sesi A)

-- ============ Bagian 6 · Deadlock, lalu pencegahannya ========================================

-- Langkah 25 (Sesi A) ----------------------------------------------------------------------
BEGIN TRANSACTION;
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 1;       -- A memegang X lock baris 1
-- >>> lanjut: Sesi B, Langkah 26

-- Langkah 27 (Sesi A) ----------------------------------------------------------------------
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 2;       -- MENUNGGU baris 2 milik Sesi B
-- >>> lanjut: Sesi B, Langkah 28 (jangan tunggu langkah ini selesai)

-- Langkah 29 (Sesi A DAN Sesi B) -----------------------------------------------------------
-- Satu sesi mendapat Msg 1205 (deadlock victim, transaction-nya sudah di-rollback engine);
-- UPDATE di sesi lain selesai. Jalankan blok ini di KEDUA jendela.
IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
SELECT @@TRANCOUNT AS TranCount, Id, Stock FROM dbo.Product WHERE Id IN (1, 2);   -- 0; 31 dan 62

-- Langkah 30 (Sesi A, opsional) ------------------------------------------------------------
-- Deadlock graph dicatat otomatis oleh extended event session bawaan system_health.
-- Klik kolom XML untuk melihat proses, resource, dan siapa victim-nya.
SELECT x.ev.value('@timestamp', 'datetime2') AS EventTime, x.ev.query('.') AS DeadlockReport
FROM (
    SELECT CAST(st.target_data AS xml) AS TargetData
    FROM sys.dm_xe_session_targets AS st
    INNER JOIN sys.dm_xe_sessions AS s ON s.address = st.event_session_address
    WHERE s.name = N'system_health' AND st.target_name = N'ring_buffer'
) AS t
CROSS APPLY t.TargetData.nodes('RingBufferTarget/event[@name="xml_deadlock_report"]') AS x(ev)
ORDER BY EventTime DESC;

-- Langkah 31 (Sesi A) ----------------------------------------------------------------------
-- PENCEGAHAN: kedua sesi mengakses baris dalam URUTAN YANG SAMA (Id 1 dulu, lalu Id 2).
BEGIN TRANSACTION;
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 1;
-- >>> lanjut: Sesi B, Langkah 32

-- Langkah 33 (Sesi A) ----------------------------------------------------------------------
UPDATE dbo.Product SET Stock = Stock - 1 WHERE Id = 2;       -- tidak menunggu: baris 2 bebas
ROLLBACK TRANSACTION;          -- lock dilepas; Sesi B (yang hanya blocking, bukan deadlock) lanjut
-- >>> lanjut: Sesi B, Langkah 34

-- ============ Bagian 7 · SNAPSHOT isolation (ringkas, opsional) ==============================

-- Langkah 35 (Sesi A) ----------------------------------------------------------------------
-- Pastikan kedua sesi tidak punya transaction terbuka dulu.
ALTER DATABASE ProductCatalogLab SET ALLOW_SNAPSHOT_ISOLATION ON;
SELECT snapshot_isolation_state_desc FROM sys.databases WHERE name = N'ProductCatalogLab';   -- ON
-- >>> lanjut: Sesi B, Langkah 36

-- Langkah 37 (Sesi A) ----------------------------------------------------------------------
BEGIN TRANSACTION;
UPDATE dbo.Product SET Price = 70.00 WHERE Id = 1;           -- X lock, belum commit
-- >>> lanjut: Sesi B, Langkah 38

-- Langkah 39 (Sesi A) ----------------------------------------------------------------------
COMMIT TRANSACTION;            -- Price kini 70.00
-- >>> lanjut: Sesi B, Langkah 40

-- Langkah 42 (Sesi A) ----------------------------------------------------------------------
-- Kembalikan lab ke kondisi setup.
UPDATE dbo.Product SET Price = 80.19 WHERE Id = 1;
ALTER DATABASE ProductCatalogLab SET ALLOW_SNAPSHOT_ISOLATION OFF;
SELECT name, is_read_committed_snapshot_on, snapshot_isolation_state_desc
FROM sys.databases
WHERE name = N'ProductCatalogLab';                           -- 0 dan OFF
SELECT Id, Price, Stock FROM dbo.Product WHERE Id IN (1, 2);  -- 80.19/31 dan 159.38/62
-- Selesai.
