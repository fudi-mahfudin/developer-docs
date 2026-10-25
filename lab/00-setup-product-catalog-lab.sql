-- Setup / reset database lab ProductCatalogLab (lesson 0019-0024).
-- Aman dijalankan ulang: database dibuat bila belum ada, sisa objek lab dihapus, tabel dibuat ulang,
-- data di-seed ulang.
-- Jalankan di container sql2022 (lihat ROADMAP Hari 4), misalnya:
--   sqlcmd -S localhost,1433 -U sa -P 'Dev_Passw0rd!' -C -i lab/00-setup-product-catalog-lab.sql
-- Terpisah dari database ProductCatalog milik EF Core di mini project.

SET NOCOUNT ON;
USE master;
GO

IF DB_ID(N'ProductCatalogLab') IS NULL
    CREATE DATABASE ProductCatalogLab;
GO

USE ProductCatalogLab;
GO

-- Sisa objek lab 0019-0023 (view, SP, function, termasuk yang dibuat di latihan) supaya reset
-- benar-benar kembali ke kondisi awal. Index ikut terhapus bersama tabelnya.
DROP VIEW IF EXISTS dbo.vProductWithCategory;                  -- lab 0019
DROP PROCEDURE IF EXISTS dbo.usp_GetProductsByCategory;        -- lab 0020
DROP PROCEDURE IF EXISTS dbo.usp_UpdatePrice;                  -- lab 0020
DROP PROCEDURE IF EXISTS dbo.usp_AdjustStock;                  -- latihan 0020
DROP FUNCTION IF EXISTS dbo.fn_PriceWithTax;                   -- lab 0020
DROP FUNCTION IF EXISTS dbo.fn_ProductsByCategory;             -- lab 0020
DROP FUNCTION IF EXISTS dbo.fn_ResetStock;                     -- lab 0020 (sengaja gagal dibuat, jaga-jaga)
DROP FUNCTION IF EXISTS dbo.fn_LowStockProducts;               -- latihan 0020
DROP PROCEDURE IF EXISTS dbo.usp_TransferStock;                -- contoh 0021
DROP PROCEDURE IF EXISTS dbo.usp_ProductsByCategory;           -- lab 0023
DROP PROCEDURE IF EXISTS dbo.usp_ProductsByCategory_Recompile; -- lab 0023
GO

-- Product dulu karena punya FK ke Category.
DROP TABLE IF EXISTS dbo.Product;
DROP TABLE IF EXISTS dbo.Category;
GO

-- Aturan sama dengan Entity di GLOSSARY: nama Product unik, Price > 0, Stock >= 0,
-- satu Product satu Category.
-- Index: HANYA clustered index dari PRIMARY KEY. Constraint UNIQUE pada nama Product juga membuat index
-- (non-clustered) karena begitulah SQL Server menegakkan UNIQUE; selain itu jangan menambah
-- non-clustered index di sini. Lesson 0022 membandingkan query sebelum dan sesudah index dibuat.
CREATE TABLE dbo.Category (
    Id   int           NOT NULL IDENTITY(1, 1),
    Name nvarchar(100) NOT NULL,
    CONSTRAINT PK_Category PRIMARY KEY CLUSTERED (Id)
);

-- CreatedAt tidak ada di Entity mini project; kolom tambahan khusus lab untuk demo
-- SARGable dan keyset pagination di lesson 0023.
CREATE TABLE dbo.Product (
    Id         int            NOT NULL IDENTITY(1, 1),
    Name       nvarchar(200)  NOT NULL,
    Price      decimal(18, 2) NOT NULL,
    Stock      int            NOT NULL,
    CategoryId int            NOT NULL,
    CreatedAt  datetime2(0)   NOT NULL,
    CONSTRAINT PK_Product PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryId) REFERENCES dbo.Category (Id),
    CONSTRAINT UQ_Product_Name UNIQUE (Name),
    CONSTRAINT CK_Product_Price CHECK (Price > 0),
    CONSTRAINT CK_Product_Stock CHECK (Stock >= 0)
);
GO

INSERT INTO dbo.Category (Name)
VALUES (N'Elektronik'), (N'Buku'), (N'Pakaian'), (N'Dapur'), (N'Olahraga'), (N'Koleksi Langka');
GO

-- Seed 100.000 Product secara set-based: satu INSERT ... SELECT dari deret angka 1..100000
-- (CTE cross join), tanpa loop baris per baris, supaya cepat walau container berjalan lewat
-- emulasi amd64 di Apple Silicon.
--
-- DISTRIBUSI SENGAJA TIDAK MERATA. JANGAN DIUBAH MENJADI MERATA.
--   Elektronik (Id 1)      : 90.000 Product (90%)
--   Buku..Olahraga (Id 2-5):  2.495 Product masing-masing
--   Koleksi Langka (Id 6)  :     20 Product
-- Lesson 0023 memakai ketimpangan ini untuk demo parameter sniffing: plan yang disimpan
-- untuk CategoryId = 6 (sedikit baris) buruk untuk CategoryId = 1 (banyak baris), dan sebaliknya.
WITH
    d(n) AS (SELECT n FROM (VALUES (0), (1), (2), (3), (4), (5), (6), (7), (8), (9)) AS v(n)),
    nums(n) AS (
        SELECT a.n + 10 * b.n + 100 * c.n + 1000 * e.n + 10000 * f.n + 1
        FROM d AS a CROSS JOIN d AS b CROSS JOIN d AS c CROSS JOIN d AS e CROSS JOIN d AS f
    )
INSERT INTO dbo.Product (Name, Price, Stock, CategoryId, CreatedAt)
SELECT
    CONCAT(N'Product ', RIGHT(CONCAT(N'00000', n), 6)),
    CAST(1 + (n * 7919) % 500000 / 100.0 AS decimal(18, 2)),   -- 1.00 .. 5000.99, selalu > 0
    (n * 31) % 500,                                           -- 0 .. 499, selalu >= 0
    CASE
        WHEN n <= 90000 THEN 1
        WHEN n <= 99980 THEN 2 + (n - 90001) % 4
        ELSE 6
    END,
    DATEADD(MINUTE, -(n * 13) % 1051200, CAST('2026-01-01' AS datetime2(0)))  -- 0..730 hari (2 tahun) SEBELUM 2026-01-01
FROM nums
ORDER BY n;
GO

-- Ringkasan: harus 6 Category, 100000 Product, dan distribusi seperti di atas.
SELECT
    (SELECT COUNT(*) FROM dbo.Category) AS CategoryCount,
    (SELECT COUNT(*) FROM dbo.Product)  AS ProductCount;

SELECT c.Id, c.Name, COUNT(p.Id) AS ProductCount
FROM dbo.Category AS c
LEFT JOIN dbo.Product AS p ON p.CategoryId = c.Id
GROUP BY c.Id, c.Name
ORDER BY c.Id;

-- Constraint dan index yang aktif: PK_Category, PK_Product (CLUSTERED), UQ_Product_Name
-- (NONCLUSTERED, dari UNIQUE), FK_Product_Category, CK_Product_Price, CK_Product_Stock.
SELECT OBJECT_NAME(parent_object_id) AS TableName, name, type_desc
FROM sys.objects
WHERE type IN ('PK', 'UQ', 'F', 'C') AND OBJECT_NAME(parent_object_id) IN (N'Category', N'Product')
ORDER BY TableName, name;

SELECT OBJECT_NAME(object_id) AS TableName, name, type_desc
FROM sys.indexes
WHERE object_id IN (OBJECT_ID(N'dbo.Category'), OBJECT_ID(N'dbo.Product')) AND index_id > 0
ORDER BY TableName, index_id;
GO
