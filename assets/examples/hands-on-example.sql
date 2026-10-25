-- Contoh file skrip. File asli: lab/NNNN-*.sql (satu atau lebih per lesson). Lihat assets/README.md.
USE ProductCatalogLab;
SET STATISTICS IO, TIME ON;

SELECT TOP (10) Id, Name, Price
FROM dbo.Product
WHERE Price > 100 AND Name <> N'Contoh & Co'
ORDER BY Price DESC;
