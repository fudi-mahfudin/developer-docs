# 01: Prefactor: lab database `ProductCatalogLab` + komponen hands-on bersama

**What to build:** Sebelum lesson database mana pun dibuat, pengguna bisa menyiapkan (dan me-reset) database lab `ProductCatalogLab` di container `sql2022` dengan satu skrip, lalu melihat ±100k Product siap dipakai. Lesson 0019–0024 nanti cukup memakai komponen blok skrip (tombol copy) dan jawaban tersembunyi dari assets, serta helper test yang memastikan skrip di HTML tidak menyimpang dari file `.sql`. ROADMAP, MISSION, dan GLOSSARY sudah punya tempat untuk materi database.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Skrip setup membuat `ProductCatalogLab` bila belum ada, lalu membuat ulang tabel Category dan Product dengan constraint sesuai Entity: PK, FK Product→Category, UNIQUE nama Product, CHECK Price > 0, CHECK Stock ≥ 0
- [x] Seed beberapa Category dan ±100k Product secara set-based dengan T-SQL murni (tanpa loop baris per baris), selesai dalam hitungan detik di `sql2022`
- [x] Distribusi data sengaja tidak merata (satu Category jauh lebih besar dari yang lain) untuk demo parameter sniffing di 0023; catatan di skrip menjelaskan kenapa ini tidak boleh diubah
- [x] Setup hanya membuat clustered index dari primary key, tanpa non-clustered index (supaya 0022 bisa membandingkan sebelum dan sesudah index)
- [x] Skrip dijalankan dua kali berturut-turut di `sql2022` tanpa error, jumlah baris dan constraint dicek dan hasilnya dicatat di Comments (atau dicatat "belum diverifikasi di SQL Server" kalau container tidak tersedia)
- [x] Komponen bersama di assets: blok skrip dengan tombol copy, dan jawaban latihan yang tersembunyi di balik tombol "lihat jawaban"; contoh pemakaiannya ditambahkan ke `assets/examples` dan dicatat di README assets
- [x] Helper test bersama yang memeriksa bahwa skrip yang ditampilkan di lesson HTML identik dengan file `.sql`-nya, diuji dengan contoh di `assets/examples`
- [x] ROADMAP mendapat blok "Hari 4 (setengah hari): Database" dengan langkah menjalankan setup lab (`sqlcmd` / Azure Data Studio / VS Code mssql) dan urutan lesson 0019–0024
- [x] MISSION mendapat kriteria sukses database (clustered vs non-clustered index, membaca execution plan sederhana, SP dengan `TRY/CATCH` + transaction, isolation level dan deadlock, query top-N-per-grup) dan batasan waktu diperluas dengan setengah hari
- [x] GLOSSARY mendapat judul bagian "Database (SQL Server)" (isinya diisi oleh ticket lesson)
- [x] `node --test` tetap hijau

## Comments

**Implementer (agent):** Selesai, kecuali verifikasi di SQL Server: **belum diverifikasi di SQL Server** (Docker daemon tidak berjalan saat ticket dikerjakan, jadi container `sql2022` tidak tersedia). Checkbox "dijalankan dua kali" dicentang karena hasilnya dicatat di sini sesuai kriteria; jalankan setup dua kali sebelum 0019 dan pastikan ringkasan di akhir skrip menunjukkan 6 Category, 100000 Product, Elektronik = 90000.

- `lab/00-setup-product-catalog-lab.sql`: buat `ProductCatalogLab` bila belum ada, `DROP TABLE IF EXISTS` lalu buat ulang Category dan Product (PK clustered, FK Product→Category, `UQ_Product_Name`, `CK_Product_Price` Price > 0, `CK_Product_Stock` Stock >= 0). Seed 6 Category + 100.000 Product dengan satu `INSERT ... SELECT` dari CTE deret angka (tanpa loop). Distribusi: Elektronik 90.000, empat Category 2.495, Koleksi Langka 20 (catatan "jangan diubah" untuk 0023). Tanpa non-clustered index kecuali yang otomatis dibuat oleh UNIQUE nama Product (dicatat di skrip). Kolom tambahan khusus lab `CreatedAt` untuk demo SARGable/keyset di 0023. Akhir skrip menampilkan jumlah baris, distribusi, constraint, dan index.
- `assets/hands-on.js`: `<pre class="script" data-file="lab/…sql">` mendapat label file + tombol Copy (Clipboard API, fallback `execCommand`); `.sql-exercise` + `<details class="answer"><summary>Lihat jawaban</summary>` untuk jawaban tersembunyi.
- `assets/examples/hands-on-example.html` + `assets/examples/hands-on-example.sql`: contoh pemakaian; dicatat di `assets/README.md`.
- `tests/helpers.js`: `scriptBlocks(html)` dan `assertScriptsMatchFiles(html, { min })`; diuji di `tests/hands-on.test.js` (cocok, menyimpang, jumlah blok kurang).
- `ROADMAP.md` (blok "Hari 4 (setengah hari): Database"), `MISSION.md` (kriteria sukses database + setengah hari), `GLOSSARY.md` (judul "Database (SQL Server)").
- `node --test`: 102 pass, 0 fail.
