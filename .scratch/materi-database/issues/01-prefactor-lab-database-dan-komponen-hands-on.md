# 01: Prefactor: lab database `ProductCatalogLab` + komponen hands-on bersama

**What to build:** Sebelum lesson database mana pun dibuat, pengguna bisa menyiapkan (dan me-reset) database lab `ProductCatalogLab` di container `sql2022` dengan satu skrip, lalu melihat ±100k Product siap dipakai. Lesson 0019–0024 nanti cukup memakai komponen blok skrip (tombol copy) dan jawaban tersembunyi dari assets, serta helper test yang memastikan skrip di HTML tidak menyimpang dari file `.sql`. ROADMAP, MISSION, dan GLOSSARY sudah punya tempat untuk materi database.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Skrip setup membuat `ProductCatalogLab` bila belum ada, lalu membuat ulang tabel Category dan Product dengan constraint sesuai Entity: PK, FK Product→Category, UNIQUE nama Product, CHECK Price > 0, CHECK Stock ≥ 0
- [ ] Seed beberapa Category dan ±100k Product secara set-based dengan T-SQL murni (tanpa loop baris per baris), selesai dalam hitungan detik di `sql2022`
- [ ] Distribusi data sengaja tidak merata (satu Category jauh lebih besar dari yang lain) untuk demo parameter sniffing di 0023; catatan di skrip menjelaskan kenapa ini tidak boleh diubah
- [ ] Setup hanya membuat clustered index dari primary key, tanpa non-clustered index (supaya 0022 bisa membandingkan sebelum dan sesudah index)
- [ ] Skrip dijalankan dua kali berturut-turut di `sql2022` tanpa error, jumlah baris dan constraint dicek dan hasilnya dicatat di Comments (atau dicatat "belum diverifikasi di SQL Server" kalau container tidak tersedia)
- [ ] Komponen bersama di assets: blok skrip dengan tombol copy, dan jawaban latihan yang tersembunyi di balik tombol "lihat jawaban"; contoh pemakaiannya ditambahkan ke `assets/examples` dan dicatat di README assets
- [ ] Helper test bersama yang memeriksa bahwa skrip yang ditampilkan di lesson HTML identik dengan file `.sql`-nya, diuji dengan contoh di `assets/examples`
- [ ] ROADMAP mendapat blok "Hari 4 (setengah hari): Database" dengan langkah menjalankan setup lab (`sqlcmd` / Azure Data Studio / VS Code mssql) dan urutan lesson 0019–0024
- [ ] MISSION mendapat kriteria sukses database (clustered vs non-clustered index, membaca execution plan sederhana, SP dengan `TRY/CATCH` + transaction, isolation level dan deadlock, query top-N-per-grup) dan batasan waktu diperluas dengan setengah hari
- [ ] GLOSSARY mendapat judul bagian "Database (SQL Server)" (isinya diisi oleh ticket lesson)
- [ ] `node --test` tetap hijau
