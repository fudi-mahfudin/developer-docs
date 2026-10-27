-- Lesson 0020 · Stored Procedure: parameter, default, OUTPUT, RETURN, TRY/CATCH + THROW,
-- SP vs function, dan kenapa parameter mencegah SQL injection.
-- Jalankan setelah dotnet/lab/00-setup-product-catalog-lab.sql. Boleh dijalankan ulang (CREATE OR ALTER).
-- Jalankan per bagian (blok sampai GO), lalu baca hasilnya sebelum lanjut.

USE ProductCatalogLab;
SET NOCOUNT ON;
GO

-- 1. Parameter input, default, OUTPUT, dan RETURN --------------------------------------------
-- Nama memakai awalan usp_, bukan sp_ (sp_ dipakai system procedure).
CREATE OR ALTER PROCEDURE dbo.usp_GetProductsByCategory
    @CategoryId int,
    @MinPrice   decimal(18, 2) = 0,        -- default: pemanggil boleh tidak mengisinya
    @TotalCount int = NULL OUTPUT          -- OUTPUT: nilainya dikirim balik ke pemanggil
AS
BEGIN
    SET NOCOUNT ON;                        -- tidak mengirim pesan "(n rows affected)"

    IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE Id = @CategoryId)
    BEGIN
        SET @TotalCount = 0;
        RETURN 1;                          -- status code: Category tidak ada
    END;

    -- Result set: 5 Product termahal (semua kolom Entity Product, supaya bisa dipetakan EF Core).
    SELECT TOP (5) p.Id, p.Name, p.Price, p.Stock, p.CategoryId
    FROM dbo.Product AS p
    WHERE p.CategoryId = @CategoryId AND p.Price >= @MinPrice
    ORDER BY p.Price DESC, p.Id;

    SELECT @TotalCount = COUNT(*)
    FROM dbo.Product AS p
    WHERE p.CategoryId = @CategoryId AND p.Price >= @MinPrice;

    RETURN 0;                              -- status code: sukses
END;
GO

DECLARE @total int, @status int;

-- a) @MinPrice tidak diisi, jadi memakai default 0. Koleksi Langka (Id 6) punya 20 Product.
EXEC @status = dbo.usp_GetProductsByCategory @CategoryId = 6, @TotalCount = @total OUTPUT;
SELECT @status AS ReturnStatus, @total AS TotalCount;           -- 0 dan 20

-- b) Semua parameter diisi dengan nama (named parameter).
EXEC @status = dbo.usp_GetProductsByCategory @CategoryId = 2, @MinPrice = 4500, @TotalCount = @total OUTPUT;
SELECT @status AS ReturnStatus, @total AS TotalCount;

-- c) Lupa menulis OUTPUT di pemanggil: tidak error, tapi nilainya TIDAK kembali.
SET @total = NULL;
EXEC dbo.usp_GetProductsByCategory @CategoryId = 6, @TotalCount = @total;
SELECT @total AS TotalCountTanpaOutput;                         -- NULL

-- d) Category tidak ada: RETURN 1.
EXEC @status = dbo.usp_GetProductsByCategory @CategoryId = 999, @TotalCount = @total OUTPUT;
SELECT @status AS ReturnStatus, @total AS TotalCount;           -- 1 dan 0
GO

-- 2. TRY/CATCH + THROW -----------------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.usp_UpdatePrice
    @ProductId int,
    @NewPrice  decimal(18, 2)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;                     -- error apa pun membuat transaction di-rollback

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM dbo.Product WHERE Id = @ProductId)
            THROW 50001, N'Product tidak ditemukan.', 1;   -- error buatan sendiri: nomor >= 50000

        -- CK_Product_Price menolak Price <= 0 dengan error 547.
        UPDATE dbo.Product SET Price = @NewPrice WHERE Id = @ProductId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;                             -- lempar ulang error asli; tanpa ini pemanggil tidak tahu ada error
    END CATCH
END;
GO

-- a) Berhasil. Dibungkus transaction luar lalu di-ROLLBACK supaya data lab tidak berubah
--    (nested transaction dibahas di lesson 0021).
BEGIN TRANSACTION;
EXEC dbo.usp_UpdatePrice @ProductId = 1, @NewPrice = 123.45;
SELECT Id, Name, Price FROM dbo.Product WHERE Id = 1;           -- 123.45
ROLLBACK TRANSACTION;
SELECT Id, Name, Price FROM dbo.Product WHERE Id = 1;           -- kembali 80.19
GO

-- b) Product tidak ada: THROW 50001 di dalam SP, ditangkap CATCH di SP, dilempar ulang ke sini.
BEGIN TRY
    EXEC dbo.usp_UpdatePrice @ProductId = 999999, @NewPrice = 10;
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_SEVERITY() AS Severity,
           ERROR_PROCEDURE() AS InProcedure, ERROR_MESSAGE() AS Message;   -- 50001, 16
END CATCH;
GO

-- c) Price 0: CHECK constraint gagal (547), transaction di-rollback, error asli sampai ke pemanggil.
BEGIN TRY
    EXEC dbo.usp_UpdatePrice @ProductId = 1, @NewPrice = 0;
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_SEVERITY() AS Severity,
           ERROR_PROCEDURE() AS InProcedure, ERROR_MESSAGE() AS Message;   -- 547
END CATCH;
SELECT @@TRANCOUNT AS OpenTransactions;                         -- 0: tidak ada transaction menggantung
GO

-- 3. SP vs function --------------------------------------------------------------------------
-- Scalar function: mengembalikan satu nilai, dipakai sebagai ekspresi di SELECT atau WHERE.
CREATE OR ALTER FUNCTION dbo.fn_PriceWithTax (@Price decimal(18, 2))
RETURNS decimal(18, 2)
AS
BEGIN
    RETURN ROUND(@Price * 1.11, 2);        -- PPN 11%
END;
GO

-- Inline table-valued function: satu SELECT, dipakai di FROM seperti tabel (bisa di-JOIN).
CREATE OR ALTER FUNCTION dbo.fn_ProductsByCategory (@CategoryId int)
RETURNS TABLE
AS
RETURN
    SELECT p.Id, p.Name, p.Price, p.Stock, p.CategoryId
    FROM dbo.Product AS p
    WHERE p.CategoryId = @CategoryId;
GO

SELECT TOP (3) f.Name, f.Price, dbo.fn_PriceWithTax(f.Price) AS PriceWithTax, c.Name AS CategoryName
FROM dbo.fn_ProductsByCategory(6) AS f
INNER JOIN dbo.Category AS c ON c.Id = f.CategoryId
ORDER BY f.Price DESC;

-- SP tidak bisa dipakai di FROM atau di dalam SELECT; SP hanya dijalankan dengan EXEC.
-- Baris berikut error bila di-uncomment:
-- SELECT * FROM dbo.usp_GetProductsByCategory(6);
GO

-- Function tidak boleh mengubah data. CREATE ini SENGAJA gagal
-- (error 443: UPDATE adalah operator dengan efek samping, tidak boleh di dalam function).
CREATE OR ALTER FUNCTION dbo.fn_ResetStock (@ProductId int)
RETURNS int
AS
BEGIN
    UPDATE dbo.Product SET Stock = 0 WHERE Id = @ProductId;
    RETURN 0;
END;
GO

-- 4. Kenapa parameter mencegah SQL injection -------------------------------------------------
-- Input jahat dari "form pencarian".
DECLARE @input nvarchar(200) = N'x'' OR 1 = 1 --';

-- BERBAHAYA: input digabung ke teks SQL. Sama seperti FromSqlRaw dengan string interpolation.
DECLARE @bad nvarchar(max) = N'SELECT COUNT(*) AS Ditemukan FROM dbo.Product WHERE Name = N''' + @input + N'''';
PRINT @bad;                                -- OR 1 = 1 kini bagian dari query
EXEC (@bad);                               -- 100000: semua baris lolos

-- AMAN: input dikirim sebagai parameter dan diperlakukan sebagai nilai literal, bukan kode.
EXEC sys.sp_executesql
    N'SELECT COUNT(*) AS Ditemukan FROM dbo.Product WHERE Name = @Name',
    N'@Name nvarchar(200)',
    @Name = @input;                        -- 0: tidak ada Product bernama "x' OR 1 = 1 --"
GO
