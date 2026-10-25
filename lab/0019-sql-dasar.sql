-- Lesson 0019 · SQL dasar: JOIN, WHERE vs HAVING, subquery vs CTE, ROW_NUMBER, constraint, view.
-- Jalankan setelah lab/00-setup-product-catalog-lab.sql. Boleh dijalankan ulang.
-- Jalankan per bagian (blok sampai GO), lalu baca hasilnya sebelum lanjut.

USE ProductCatalogLab;
SET NOCOUNT ON;
GO

-- 1. JOIN ------------------------------------------------------------------------------------
-- Di lab, semua Category punya Product. Tambahkan sementara satu Category kosong supaya beda
-- INNER dan LEFT terlihat. Transaction + ROLLBACK membatalkannya di akhir bagian ini
-- (transaction dibahas di lesson 0021).
BEGIN TRANSACTION;
INSERT INTO dbo.Category (Name) VALUES (N'Mainan');

-- INNER JOIN: hanya pasangan yang cocok. Mainan tidak muncul.
SELECT c.Name, COUNT(*) AS ProductCount
FROM dbo.Category AS c
INNER JOIN dbo.Product AS p ON p.CategoryId = c.Id
GROUP BY c.Name;

-- LEFT JOIN: semua baris tabel kiri. Mainan muncul dengan 0, karena COUNT(p.Id) tidak menghitung NULL.
SELECT c.Name, COUNT(p.Id) AS ProductCount
FROM dbo.Category AS c
LEFT JOIN dbo.Product AS p ON p.CategoryId = c.Id
GROUP BY c.Name;

-- RIGHT JOIN: hasil sama dengan LEFT JOIN di atas, hanya urutan tabel yang dibalik.
SELECT c.Name, COUNT(p.Id) AS ProductCount
FROM dbo.Product AS p
RIGHT JOIN dbo.Category AS c ON p.CategoryId = c.Id
GROUP BY c.Name;

-- Pola anti-join: Category yang belum punya Product.
SELECT c.Name
FROM dbo.Category AS c
LEFT JOIN dbo.Product AS p ON p.CategoryId = c.Id
WHERE p.Id IS NULL;

ROLLBACK TRANSACTION;
GO

-- 2. GROUP BY, WHERE vs HAVING ---------------------------------------------------------------
-- WHERE menyaring baris SEBELUM grouping, HAVING menyaring grup SETELAH agregasi.
-- Koleksi Langka (20 Product) hilang karena HAVING.
SELECT c.Name, COUNT(*) AS InStockCount, AVG(p.Price) AS AvgPrice
FROM dbo.Product AS p
INNER JOIN dbo.Category AS c ON c.Id = p.CategoryId
WHERE p.Stock > 0
GROUP BY c.Name
HAVING COUNT(*) >= 1000
ORDER BY InStockCount DESC;   -- alias SELECT boleh di ORDER BY, tidak boleh di WHERE/GROUP BY
GO

-- 3. Subquery vs CTE -------------------------------------------------------------------------
-- Pertanyaan: berapa Product yang harganya di atas rata-rata Category-nya?
-- a) Correlated subquery: subquery memakai p.CategoryId dari query luar.
SELECT COUNT(*) AS AboveCategoryAvg
FROM dbo.Product AS p
WHERE p.Price > (SELECT AVG(p2.Price) FROM dbo.Product AS p2 WHERE p2.CategoryId = p.CategoryId);

-- b) CTE: langkah "rata-rata per Category" diberi nama, lalu di-JOIN. Hasilnya harus sama.
--    Statement sebelum WITH harus diakhiri titik koma.
WITH CategoryAvg AS (
    SELECT CategoryId, AVG(Price) AS AvgPrice
    FROM dbo.Product
    GROUP BY CategoryId
)
SELECT COUNT(*) AS AboveCategoryAvg
FROM dbo.Product AS p
INNER JOIN CategoryAvg AS a ON a.CategoryId = p.CategoryId
WHERE p.Price > a.AvgPrice;
GO

-- 4. ROW_NUMBER, RANK, DENSE_RANK ------------------------------------------------------------
-- Product termurah per Category: nomor mulai lagi dari 1 di setiap partisi.
WITH Ranked AS (
    SELECT p.CategoryId, p.Name, p.Price,
           ROW_NUMBER() OVER (PARTITION BY p.CategoryId ORDER BY p.Price ASC, p.Id) AS rn
    FROM dbo.Product AS p
)
SELECT CategoryId, Name, Price
FROM Ranked
WHERE rn = 1          -- filter di query luar: WHERE diproses sebelum window function
ORDER BY CategoryId;

-- Beda perilaku saat ada nilai seri (data kecil, harga 300 muncul dua kali).
SELECT Name, Price,
       ROW_NUMBER() OVER (ORDER BY Price DESC) AS RowNumber,   -- 1, 2, 3, 4
       RANK()       OVER (ORDER BY Price DESC) AS RankNo,      -- 1, 2, 2, 4
       DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRankNo  -- 1, 2, 2, 3
FROM (VALUES (N'A', 500), (N'B', 300), (N'C', 300), (N'D', 100)) AS t(Name, Price);
GO

-- 5. Constraint ------------------------------------------------------------------------------
-- Setiap INSERT di bawah SENGAJA gagal. Jalankan satu per satu dan baca pesan error-nya.
-- UNIQUE (UQ_Product_Name): nama sudah dipakai. Error 2627.
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
VALUES (N'Product 000001', 10, 1, 1, SYSDATETIME());
GO
-- CHECK (CK_Product_Price): Price harus > 0. Error 547.
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
VALUES (N'Harga Nol', 0, 1, 1, SYSDATETIME());
GO
-- CHECK (CK_Product_Stock): Stock harus >= 0. Error 547.
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
VALUES (N'Stok Minus', 10, -1, 1, SYSDATETIME());
GO
-- FOREIGN KEY (FK_Product_Category): Category 999 tidak ada. Error 547.
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
VALUES (N'Tanpa Category', 10, 1, 999, SYSDATETIME());
GO

-- 6. View ------------------------------------------------------------------------------------
-- View = query bernama (tabel virtual). Data tetap di tabel Product dan Category.
CREATE OR ALTER VIEW dbo.vProductWithCategory
AS
SELECT p.Id, p.Name, p.Price, p.Stock, c.Name AS CategoryName
FROM dbo.Product AS p
INNER JOIN dbo.Category AS c ON c.Id = p.CategoryId;
GO

-- ORDER BY ditulis di query yang memakai view, bukan di definisi view.
SELECT TOP (5) Name, Price, CategoryName
FROM dbo.vProductWithCategory
WHERE CategoryName = N'Buku'
ORDER BY Price DESC;
GO
