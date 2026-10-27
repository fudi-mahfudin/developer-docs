-- Lesson 0023 · Optimasi query: execution plan, SARGable, parameter sniffing, pagination OFFSET vs keyset.
-- Jalankan setelah dotnet/lab/00-setup-product-catalog-lab.sql (dan sesudah lab 0022 selesai, yang menghapus index-nya sendiri).
-- Boleh dijalankan ulang. Jalankan PER BAGIAN (blok sampai GO), dengan actual execution plan menyala
-- (tombol "Explain"/"Actual plan" di Azure Data Studio / VS Code mssql, Ctrl+M di SSMS).
-- Untuk setiap query, bandingkan: operator di plan, Estimated vs Actual Number of Rows, dan logical reads (tab Messages).
-- Angka di komentar adalah perkiraan; yang penting arah perubahannya.

USE ProductCatalogLab;
SET NOCOUNT ON;
GO

-- 0. Kondisi awal ---------------------------------------------------------------------------
-- Bersihkan sisa skrip ini kalau pernah berhenti di tengah jalan.
DROP PROCEDURE IF EXISTS dbo.usp_ProductsByCategory;
DROP PROCEDURE IF EXISTS dbo.usp_ProductsByCategory_Recompile;
DROP INDEX IF EXISTS IX_Product_CategoryId ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CategoryId_Covering ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CreatedAt ON dbo.Product;
-- Bagian 3 mematikan PSP optimization; kembalikan ke default (ON) kalau skrip pernah terhenti sebelum bagian 5.
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SENSITIVE_PLAN_OPTIMIZATION = ON;
GO

-- Database baru di SQL Server 2022 memakai compatibility level 160: syarat PSP optimization (bagian 3).
SELECT name, compatibility_level FROM sys.databases WHERE name = DB_NAME();
SELECT name, value FROM sys.database_scoped_configurations
WHERE name = N'PARAMETER_SENSITIVE_PLAN_OPTIMIZATION';
GO

-- Index untuk bagian 1 dan 3: hanya CategoryId (+ Id otomatis). Sengaja TIDAK covering.
CREATE INDEX IX_Product_CategoryId ON dbo.Product (CategoryId);
GO

-- 1. Execution plan: estimated vs actual ---------------------------------------------------
-- 1a. Estimated plan: query TIDAK dijalankan, hanya plan dari optimizer (tanpa angka runtime).
--     SET SHOWPLAN_XML harus sendirian di batch-nya.
SET SHOWPLAN_XML ON;
GO
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 6;
GO
SET SHOWPLAN_XML OFF;
GO

-- 1b. Actual plan: query dijalankan, plan ikut membawa ActualRows. Klik XML-nya untuk membuka plan grafis.
--     Literal 6: optimizer memakai histogram, perkiraan ±20 baris = aktual 20 -> Index Seek + Key Lookup.
SET STATISTICS IO ON;
SET STATISTICS XML ON;
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = 6;
SET STATISTICS XML OFF;
GO

-- 1c. Perkiraan meleset. Local variable tidak bisa "diintip" saat kompilasi, jadi optimizer memakai
--     rata-rata (density): 100.000 / 6 Category = perkiraan ±16.667 baris, padahal aktualnya 20.
--     Dengan perkiraan sebesar itu, kemungkinan besar plan-nya Clustered Index Scan: reads sebanyak seluruh tabel
--     untuk 20 baris. Selisih besar Estimated vs Actual = tanda pertama saat membaca plan query lambat.
DECLARE @c int = 6;
SET STATISTICS XML ON;
SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = @c;
SET STATISTICS XML OFF;
GO

-- 2. SARGable vs non-SARGable ---------------------------------------------------------------
-- 2a. UQ_Product_Name (dari setup) berisi Name + Id, jadi kedua query ini dijawab dari index itu saja.
-- Fungsi pada kolom: engine harus menghitung LEFT() untuk setiap baris -> Index Scan seluruh index.
SELECT Id, Name FROM dbo.Product WHERE LEFT(Name, 12) = N'Product 0001';

-- Hasil sama (100 baris: Product 000100..000199), tapi LIKE dengan prefix tetap bisa dicari di index -> Index Seek, reads jauh lebih kecil.
SELECT Id, Name FROM dbo.Product WHERE Name LIKE N'Product 0001%';

-- Wildcard di depan tidak punya titik awal di index -> kembali scan (10 baris, tetap membaca seluruh index).
SELECT Id, Name FROM dbo.Product WHERE Name LIKE N'%0001';
GO

-- 2b. Tanggal. Index pada CreatedAt; Id ikut otomatis, jadi SELECT Id, CreatedAt tetap covering.
CREATE INDEX IX_Product_CreatedAt ON dbo.Product (CreatedAt);
GO

-- Non-SARGable: YEAR() dan MONTH() membungkus kolom -> Index Scan seluruh IX_Product_CreatedAt.
SELECT Id, CreatedAt FROM dbo.Product WHERE YEAR(CreatedAt) = 2025 AND MONTH(CreatedAt) = 6;

-- SARGable: kolom dibiarkan polos, rentang half-open [1 Juni, 1 Juli) -> Index Seek, hasil sama (3.323 baris menurut rumus seed).
SELECT Id, CreatedAt FROM dbo.Product WHERE CreatedAt >= '2025-06-01' AND CreatedAt < '2025-07-01';
GO

-- 3. Parameter sniffing dengan data tidak merata -------------------------------------------
-- Category 1 = 90.000 Product, Category 6 = 20 Product (setup). Satu plan tidak cocok untuk keduanya.
CREATE OR ALTER PROCEDURE dbo.usp_ProductsByCategory @CategoryId int
AS
    SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = @CategoryId;
GO

-- SQL Server 2022 (compat 160) punya PSP optimization yang bisa menyimpan beberapa plan per query dan
-- MENYEMBUNYIKAN efek klasik ini. Matikan dulu di level database supaya masalahnya terlihat (dinyalakan lagi di 3d).
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SENSITIVE_PLAN_OPTIMIZATION = OFF;
-- Kosongkan plan cache database INI saja (jangan DBCC FREEPROCCACHE tanpa parameter di server bersama).
ALTER DATABASE SCOPED CONFIGURATION CLEAR PROCEDURE_CACHE;
GO

-- 3a. Nilai kecil lebih dulu: plan untuk 20 baris (Index Seek + Key Lookup) dikompilasi dan DISIMPAN.
EXEC dbo.usp_ProductsByCategory @CategoryId = 6;   -- logical reads: puluhan
-- Nilai besar memakai plan yang sama: 90.000 Key Lookup -> logical reads ratusan ribu, jauh di atas satu scan.
-- Di actual plan, lihat properti operator SELECT: Parameter Compiled Value = 6, Parameter Runtime Value = 1.
EXEC dbo.usp_ProductsByCategory @CategoryId = 1;
GO

-- 3b. Urutan dibalik: plan untuk 90.000 baris (Clustered Index Scan) disimpan, lalu dipakai untuk 20 baris.
ALTER DATABASE SCOPED CONFIGURATION CLEAR PROCEDURE_CACHE;
GO
EXEC dbo.usp_ProductsByCategory @CategoryId = 1;   -- scan: wajar untuk 90% tabel
EXEC dbo.usp_ProductsByCategory @CategoryId = 6;   -- tetap scan seluruh tabel untuk 20 baris
GO

-- 3c. Dua perbaikan.
-- Perbaikan 1: OPTION (RECOMPILE) -> plan baru setiap eksekusi, dibuang setelahnya. Bayarannya CPU kompilasi tiap panggilan.
CREATE OR ALTER PROCEDURE dbo.usp_ProductsByCategory_Recompile @CategoryId int
AS
    SELECT Id, Name, Price FROM dbo.Product WHERE CategoryId = @CategoryId
    OPTION (RECOMPILE);
GO
EXEC dbo.usp_ProductsByCategory_Recompile @CategoryId = 6;   -- Index Seek + Key Lookup
EXEC dbo.usp_ProductsByCategory_Recompile @CategoryId = 1;   -- Clustered Index Scan
GO
-- Alternatif lain (tidak dijalankan): OPTION (OPTIMIZE FOR (@CategoryId = 1)) memakai nilai "khas" yang Anda pilih;
-- OPTION (OPTIMIZE FOR UNKNOWN) memakai rata-rata, sama seperti local variable di 1c.

-- Perbaikan 2 (akar masalah): covering index. Tidak ada Key Lookup, jadi Index Seek bagus untuk 20 MAUPUN 90.000 baris
-- dan plan yang disimpan aman untuk semua nilai.
DROP INDEX IF EXISTS IX_Product_CategoryId ON dbo.Product;
CREATE INDEX IX_Product_CategoryId_Covering ON dbo.Product (CategoryId) INCLUDE (Name, Price);
GO
EXEC sp_recompile N'dbo.usp_ProductsByCategory';
GO
EXEC dbo.usp_ProductsByCategory @CategoryId = 6;   -- Index Seek, beberapa reads
EXEC dbo.usp_ProductsByCategory @CategoryId = 1;   -- Index Seek yang sama, reads sebanding scan, tanpa lookup
GO

-- 3d. Nyalakan lagi PSP optimization dan ulangi skenario 3a (index non-covering).
DROP INDEX IF EXISTS IX_Product_CategoryId_Covering ON dbo.Product;
CREATE INDEX IX_Product_CategoryId ON dbo.Product (CategoryId);
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SENSITIVE_PLAN_OPTIMIZATION = ON;
ALTER DATABASE SCOPED CONFIGURATION CLEAR PROCEDURE_CACHE;
GO
-- Kalau PSP memilih predikat ini, nilai 6 dan 1 mendapat plan (query variant) berbeda dan reads untuk 1 kembali wajar.
-- Tidak dijamin terjadi untuk setiap query; bandingkan reads-nya dengan 3a.
EXEC dbo.usp_ProductsByCategory @CategoryId = 6;
EXEC dbo.usp_ProductsByCategory @CategoryId = 1;
GO
-- Query Store aktif default di database baru SQL Server 2022; variant PSP tercatat di sini (kosong = PSP tidak dipakai).
SELECT query_variant_query_id, parent_query_id, dispatcher_plan_id
FROM sys.query_store_query_variant;
GO

-- 4. Pagination: OFFSET/FETCH vs keyset -----------------------------------------------------
-- 4a. Urut Id. Halaman ke-4.501 (20 per halaman): OFFSET harus membaca dan membuang 90.000 baris dulu.
SELECT Id, Name, Price FROM dbo.Product
ORDER BY Id
OFFSET 90000 ROWS FETCH NEXT 20 ROWS ONLY;     -- logical reads: ratusan (hampir seluruh tabel)

-- Keyset: aplikasi mengingat Id terakhir halaman sebelumnya, lalu Index Seek langsung ke sana.
DECLARE @lastId int = 90000;
SELECT TOP (20) Id, Name, Price FROM dbo.Product
WHERE Id > @lastId
ORDER BY Id;                                   -- logical reads: hitungan jari, hasil sama persis
GO

-- 4b. Urutan yang lebih realistis: Product terbaru dulu (CreatedAt DESC), Id sebagai pemecah seri supaya urutan unik.
-- IX_Product_CreatedAt (dari bagian 2) secara efektif berisi (CreatedAt, Id), cocok dengan urutan ini.
SELECT Id, Name, CreatedAt FROM dbo.Product
ORDER BY CreatedAt DESC, Id DESC
OFFSET 90000 ROWS FETCH NEXT 20 ROWS ONLY;     -- scan + sort, atau 90.000 lookup: mahal
GO

-- Nilai kunci baris terakhir halaman sebelumnya. Di aplikasi nilainya datang dari halaman yang baru ditampilkan;
-- di sini diambil dengan OFFSET supaya hasilnya bisa dibandingkan, jadi STATISTICS IO dimatikan sebentar.
SET STATISTICS IO OFF;
DECLARE @lastCreatedAt datetime2(0), @lastId int;
SELECT @lastCreatedAt = CreatedAt, @lastId = Id FROM dbo.Product
ORDER BY CreatedAt DESC, Id DESC
OFFSET 89999 ROWS FETCH NEXT 1 ROWS ONLY;
SET STATISTICS IO ON;

-- Keyset dua kunci. T-SQL tidak punya (CreatedAt, Id) < (@a, @b), jadi ditulis dengan OR.
-- Syarat pertama (CreatedAt <= ...) memberi rentang seek; sisanya membuang baris seri yang sudah tampil.
-- Hasilnya harus sama dengan query OFFSET di atas, dengan Index Seek + 20 Key Lookup saja.
SELECT TOP (20) Id, Name, CreatedAt FROM dbo.Product
WHERE CreatedAt <= @lastCreatedAt
  AND (CreatedAt < @lastCreatedAt OR Id < @lastId)
ORDER BY CreatedAt DESC, Id DESC;
GO

SET STATISTICS IO OFF;
GO

-- 5. Kembalikan lab ke kondisi setup --------------------------------------------------------
DROP PROCEDURE IF EXISTS dbo.usp_ProductsByCategory;
DROP PROCEDURE IF EXISTS dbo.usp_ProductsByCategory_Recompile;
DROP INDEX IF EXISTS IX_Product_CategoryId ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CategoryId_Covering ON dbo.Product;
DROP INDEX IF EXISTS IX_Product_CreatedAt ON dbo.Product;
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SENSITIVE_PLAN_OPTIMIZATION = ON;
GO

-- Harus kembali hanya PK_Product dan UQ_Product_Name, dan PSP optimization = 1 (ON).
SELECT i.name, i.type_desc
FROM sys.indexes AS i
WHERE i.object_id = OBJECT_ID(N'dbo.Product') AND i.index_id > 0
ORDER BY i.index_id;
SELECT name, value FROM sys.database_scoped_configurations
WHERE name = N'PARAMETER_SENSITIVE_PLAN_OPTIMIZATION';
GO
