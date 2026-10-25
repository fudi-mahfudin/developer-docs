-- Lesson 0022 · Index: clustered vs non-clustered, key lookup, covering (INCLUDE), composite, biaya index.
-- Jalankan setelah lab/00-setup-product-catalog-lab.sql. Boleh dijalankan ulang.
-- Jalankan per bagian (blok sampai GO). Nyalakan "Include Actual Execution Plan"
-- (Ctrl+M di SSMS, tombol "Explain"/"Actual plan" di Azure Data Studio / VS Code mssql),
-- lalu bandingkan dua hal untuk setiap query: operator di plan dan "logical reads" di tab Messages.
-- Angka di komentar adalah perkiraan; yang penting arah perubahannya.

USE ProductCatalogLab;
SET NOCOUNT ON;
GO

-- 0. Kondisi awal ---------------------------------------------------------------------------
-- Hapus sisa index lesson ini kalau skrip pernah dijalankan setengah jalan.
DROP INDEX IF EXISTS IX_Product_CategoryId ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CategoryId_Covering ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CategoryId_Price ON dbo.Product;
GO

-- Harus hanya dua: PK_Product (CLUSTERED, dari PRIMARY KEY) dan UQ_Product_Name (NONCLUSTERED, dari UNIQUE).
-- Perhatikan: FK_Product_Category TIDAK membuat index pada CategoryId.
SELECT i.name, i.type_desc, i.is_unique, i.is_primary_key
FROM sys.indexes AS i
WHERE i.object_id = OBJECT_ID(N'dbo.Product') AND i.index_id > 0
ORDER BY i.index_id;
GO

SET STATISTICS IO, TIME ON;
GO

-- 1. SEBELUM index --------------------------------------------------------------------------
-- Category 6 = 20 Product, Category 2 = ±2.500 Product, dari 100.000.
-- Plan: Clustered Index Scan. Logical reads = hampir semua page tabel (ratusan), walau hasilnya 20 baris.
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 6;
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 2;
GO

-- 2. Non-clustered index biasa: Index Seek + Key Lookup -------------------------------------
-- Index ini hanya berisi CategoryId (+ Id, clustered key yang otomatis ikut sebagai penunjuk).
CREATE INDEX IX_Product_CategoryId ON dbo.Product (CategoryId);
GO

-- Category 6: Index Seek + Nested Loops + Key Lookup. Name dan Price tidak ada di index,
-- jadi diambil dari clustered index untuk SETIAP baris. Logical reads turun jauh (puluhan).
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 6;

-- Category 2: kemungkinan besar tetap Clustered Index Scan. ±2.500 key lookup (masing-masing
-- beberapa page) lebih mahal daripada membaca seluruh tabel sekali. Index ada, tapi tidak dipakai.
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 2;

-- Hanya kolom yang ada di index (CategoryId, Id): Index Seek saja, tanpa Key Lookup, juga untuk Category 2.
SELECT Id FROM dbo.Product WHERE CategoryId = 2;
GO

-- 3. Covering index dengan INCLUDE ----------------------------------------------------------
-- Kolom predikat di key, kolom yang hanya diambil di INCLUDE (disimpan di leaf, tidak diurutkan).
-- Id tidak perlu ditulis: clustered key otomatis ada di setiap non-clustered index.
DROP INDEX IF EXISTS IX_Product_CategoryId ON dbo.Product;
CREATE INDEX IX_Product_CategoryId_Covering ON dbo.Product (CategoryId) INCLUDE (Name, Price);
GO

-- Keduanya sekarang Index Seek saja, tanpa Key Lookup. Category 2 akhirnya memakai index,
-- dengan logical reads jauh di bawah scan di bagian 1.
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 6;
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 2;

-- Masih covering, tapi hasilnya belum urut menurut Price: perhatikan operator Sort (atau Top N Sort) di plan.
SELECT TOP (10) Name, Price FROM dbo.Product WHERE CategoryId = 2 ORDER BY Price DESC;
GO

-- 4. Composite index dan urutan kolom -------------------------------------------------------
-- CategoryId di depan (equality), Price kedua supaya baris di dalam satu Category sudah urut harga.
DROP INDEX IF EXISTS IX_Product_CategoryId_Covering ON dbo.Product;
CREATE INDEX IX_Product_CategoryId_Price ON dbo.Product (CategoryId, Price DESC) INCLUDE (Name);
GO

-- Index Seek + Top, TANPA Sort: engine membaca 10 entri pertama Category 2 dan berhenti.
SELECT TOP (10) Name, Price FROM dbo.Product WHERE CategoryId = 2 ORDER BY Price DESC;

-- Kolom pertama + rentang di kolom kedua: tetap Index Seek.
SELECT Name, Price FROM dbo.Product WHERE CategoryId = 2 AND Price >= 4900;

-- Hanya kolom kedua: TIDAK bisa seek (leftmost prefix). Plan menjadi scan
-- (Index Scan atas index ini, atau Clustered Index Scan), logical reads naik lagi.
SELECT Name, Price FROM dbo.Product WHERE Price >= 4900;
GO

SET STATISTICS IO, TIME OFF;
GO

-- 5. Biaya index ----------------------------------------------------------------------------
-- Storage: setiap index adalah salinan kolomnya sendiri. Bandingkan page index buatan dengan PK_Product.
SELECT i.name, i.type_desc, ps.used_page_count, ps.row_count
FROM sys.dm_db_partition_stats AS ps
JOIN sys.indexes AS i ON i.object_id = ps.object_id AND i.index_id = ps.index_id
WHERE ps.object_id = OBJECT_ID(N'dbo.Product')
ORDER BY i.index_id;

-- Biaya tulis: UPDATE Price harus mengubah clustered index DAN IX_Product_CategoryId_Price.
-- Dibungkus transaction + ROLLBACK supaya data lab tidak berubah (transaction: lesson 0021).
BEGIN TRANSACTION;
UPDATE dbo.Product SET Price = Price + 1 WHERE CategoryId = 2;
ROLLBACK TRANSACTION;

-- Pemakaian index sejak server terakhir start: seek/scan/lookup (dibaca) vs user_updates (ditulis).
-- Index dengan user_updates tinggi tapi seek/scan nol hanya menambah biaya: kandidat dihapus.
SELECT i.name, us.user_seeks, us.user_scans, us.user_lookups, us.user_updates
FROM sys.indexes AS i
LEFT JOIN sys.dm_db_index_usage_stats AS us
    ON us.object_id = i.object_id AND us.index_id = i.index_id AND us.database_id = DB_ID()
WHERE i.object_id = OBJECT_ID(N'dbo.Product') AND i.index_id > 0
ORDER BY i.index_id;
GO

-- 6. Kembalikan lab ke kondisi setup --------------------------------------------------------
DROP INDEX IF EXISTS IX_Product_CategoryId ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CategoryId_Covering ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CategoryId_Price ON dbo.Product;
GO

-- Harus kembali hanya PK_Product dan UQ_Product_Name.
SELECT i.name, i.type_desc
FROM sys.indexes AS i
WHERE i.object_id = OBJECT_ID(N'dbo.Product') AND i.index_id > 0
ORDER BY i.index_id;
GO
