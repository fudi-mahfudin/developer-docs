Status: ready-for-agent

# Spec: Lesson 0025 — LINQ untuk live coding

## Problem Statement

Saya (developer TypeScript/Node.js/React) sedang bersiap untuk interview Fullstack Developer .NET 8 + Angular 16 level mid. Format yang diantisipasi mencakup live coding kecil. Saat ini LINQ hanya diajarkan sebagai *konsep* di lesson 0003 (deferred execution, `IEnumerable` vs `IQueryable`), lalu disinggung lewat `Include`/projection/N+1 di 0006 dan keyset pagination di 0023. Operator yang muncul hanya `Where`/`Select`/`OrderBy`/`ToList`/`Any`, dan hanya sebagai contoh.

Belum ada materi maupun latihan untuk *menulis* LINQ: memilih operator, mengelompokkan, menggabungkan, mengambil satu elemen dengan benar. Saya juga belum dilatih mengenali query yang tidak bisa diterjemahkan EF Core ke SQL. Di live coding, soal seperti ini hampir pasti muncul:

- "Kelompokkan Product per Category dan ambil 3 yang termahal."
- "Apa beda `First`, `FirstOrDefault`, dan `Single`?"
- "Cari nama Product yang duplikat."
- "Hitung total nilai stok per Category."

## Solution

Satu lesson baru, **0025 · LINQ untuk live coding**, sebagai suplemen Hari 1. Di `index.html` lesson ini tampil tepat setelah 0003, dengan navigasi 0003 → 0025 → 0004. Nomor lesson yang ada tidak digeser.

- **Materi + kuis ±15 menit.** Operator ditulis berdampingan dengan padanan `array.*` di TS, dengan contoh method syntax. Query syntax ditunjukkan satu kali berdampingan supaya bisa dikenali.
- **Latihan tulis ±15 menit**, terpisah dari materi: 4 soal Product Catalog dengan jawaban tersembunyi, plus lab `dotnet/lab/0025-linq.cs` berisi data Product/Category in-memory. Lab ditempel ke `dotnet new console` lalu dijalankan dengan `dotnet run`.
- **Konsep tambahan** hanya yang langsung berguna saat menulis: multiple enumeration, dan apakah operator bisa diterjemahkan EF Core ke SQL (client evaluation).

## User Stories

1. Sebagai kandidat, saya ingin bisa menulis LINQ untuk soal live coding umum tanpa melihat catatan, supaya tidak tersendat saat diminta memfilter, mengelompokkan, atau menggabungkan data.
2. Sebagai kandidat, saya ingin setiap operator dipetakan ke padanan `array.*` di TS (`filter`→`Where`, `map`→`Select`, `flatMap`→`SelectMany`, `find`→`FirstOrDefault`, `some`→`Any`, `every`→`All`, `includes`→`Contains`, `reduce` untuk agregat → `Sum`/`Count`/`Max`), supaya bisa memakai intuisi yang sudah saya punya.
3. Sebagai kandidat, saya ingin memahami beda `First`, `FirstOrDefault`, `Single`, dan `SingleOrDefault` (kapan melempar exception, apa nilai default-nya), supaya bisa menjawab jebakan interview klasik ini dan memilih yang tepat di kode.
4. Sebagai kandidat, saya ingin bisa memakai `GroupBy` dengan agregat per grup dan menulis top-N per grup, supaya bisa menyelesaikan soal LINQ yang paling sering diminta.
5. Sebagai kandidat, saya ingin bisa memakai `Join`, `Distinct`/`DistinctBy`, `MaxBy`/`MinBy`, dan `ToDictionary`, supaya punya alat untuk soal gabung data, cari duplikat, dan lookup.
6. Sebagai kandidat, saya ingin mengenali multiple enumeration, supaya tidak tanpa sadar menjalankan query atau iterasi yang sama dua kali.
7. Sebagai kandidat, saya ingin tahu operator mana yang bisa diterjemahkan EF Core ke SQL dan mana yang menyebabkan error atau client evaluation, termasuk perbedaan `GroupBy` di EF Core dan di memori, supaya kode LINQ saya di Repository tetap jalan di database.
8. Sebagai kandidat, saya ingin bisa mengenali query syntax (`from p in ... select p`), supaya tidak bingung kalau interviewer memakainya.
9. Sebagai kandidat, saya ingin menjalankan jawaban saya sendiri di lab console dengan data Product Catalog, supaya bisa memeriksa hasilnya, bukan sekadar membandingkan dengan jawaban contoh.
10. Sebagai kandidat, saya ingin soal LINQ ikut muncul di review campuran 0007, 0012, dan mock 0018, supaya penguasaannya teruji lewat retrieval berjarak, bukan hanya kuis tepat setelah membaca.

## Implementation Decisions

- **Wajib memakai skill `/teach`** sebelum membangun lesson (aturan di `dotnet/NOTES.md`). Kutipan diambil dari sumber resmi (Microsoft Learn: LINQ, Standard Query Operators, EF Core Complex Query Operators / Client vs. Server Evaluation), bukan dari ingatan model. Versi target .NET 8 / EF Core 8.
- **Nomor dan posisi:** lesson `dotnet/lessons/0025-linq.html`, ditampilkan di index setelah 0003. Nav 0003 diubah ke 0025, nav 0025 menunjuk 0003 dan 0004. 0003 menjadi prasyarat dan tidak dibahas ulang.
- **Cakupan operator:**
  - Inti: `Where`, `Select`, `SelectMany`, `OrderBy`/`OrderByDescending`/`ThenBy`, `Skip`/`Take`
  - Satu elemen: `First`, `FirstOrDefault`, `Single`, `SingleOrDefault`
  - Boolean/agregat: `Any`, `All`, `Contains`, `Count`, `Sum`, `Average`, `Max`/`Min`, `MaxBy`/`MinBy`
  - Grup dan gabung: `GroupBy` (+ agregat per grup, top-N per grup), `Join`, `Distinct`/`DistinctBy`, `ToDictionary`
  - Jebakan: multiple enumeration, operator yang tidak bisa diterjemahkan EF Core, `GroupBy` di EF Core vs di memori
- **Sintaks:** method syntax. Query syntax hanya satu contoh berdampingan.
- **Bank soal** `dotnet/assets/questions/0025.js`, 5 topik:
  - `linq-operator`: Where/Select/SelectMany/OrderBy
  - `linq-single`: First vs Single vs …OrDefault
  - `linq-groupby`: GroupBy, Join, top-N per grup
  - `linq-ef-translate`: client evaluation, apa yang bisa jadi SQL
  - `linq-multiple-enum`

  Isinya ±10 mc (termasuk "apa output kode ini" dan "berapa query SQL yang dikirim") + 2 oral dengan checklist 6 poin dan jawaban contoh: (1) "Tulis top-3 Product termahal per Category dengan LINQ lalu jelaskan", (2) "First vs Single vs FirstOrDefault, kapan memakai masing-masing". Format mengikuti `assets/README.md`.
- **Latihan tulis:** 4 soal (top-3 Product termahal per Category; Category yang tidak punya Product dengan stok habis; nama Product duplikat; total nilai stok `Price × Stock` per Category). Markup mengikuti pola latihan tulis di 0019 (prompt + `<details>` jawaban), tidak dinilai otomatis.
- **Lab** `dotnet/lab/0025-linq.cs`: satu file `Program.cs` mandiri (top-level statements, .NET 8) berisi `record Category`, `record Product`, dan data in-memory yang sengaja memuat kasus uji: nama duplikat, Category tanpa Product, Stock 0. Lesson menampilkan isi file ini dengan tombol copy dan langkah `dotnet new console` → tempel → `dotnet run`. File lab adalah sumber kebenaran; kalau salah satunya diubah, yang lain ikut diubah.
- **Review 0007:** tambah `0025` ke `data-lessons`, `data-mc` 22 → 27, muat `questions/0025.js` sebelum `review.js`. Perbarui konstanta `DAY1` di `tests/dotnet/review-0007.test.js`.
- **Review 0012:** default `data-topics` ditambah `linq-single`, `data-mc` 24 → 25, muat `questions/0025.js`.
- **Mock 0018:** `0025` masuk `data-lessons` blok `acak` dan daftar topik yang boleh dipakai blok `lemah`. Muat `questions/0025.js`. Sesuaikan `CONCEPT`/`REVIEWED` di `tests/dotnet/review-0018.test.js`. `0018.js` tidak diedit, karena soal lisan LINQ di `0025.js` otomatis bisa ditarik.
- **Reference** `dotnet/reference/linq.html`: tabel cetak `array.*` TS → LINQ, tabel First/Single, dan daftar jebakan. Format mengikuti reference yang ada. Ditautkan dari `reference/ulang-sebelum-interview.html` dan dari lesson.
- **GLOSSARY:** istilah baru Multiple Enumeration dan Client Evaluation. Pakai istilah yang sudah ada (Deferred Execution, IQueryable, Projection) secara konsisten.
- **MISSION:** kriteria sukses baru: "Bisa menulis LINQ untuk soal live coding umum (filter, grup, top-N, join, cari duplikat) dan tahu mana yang diterjemahkan EF Core ke SQL".
- **ROADMAP:** baris LINQ di Hari 1 Sesi 1 yang merujuk lesson 0025.
- **RESOURCES:** sumber resmi yang dikutip lesson.
- **NOTES:** satu baris catatan lesson 0025 dengan format yang sama seperti lesson lain (file soal, topik, reference, istilah GLOSSARY baru, perubahan pada 0007/0012/0018).
- **Alur kerja:** dikerjakan di branch `lesson-linq-0025`, lalu di-merge ke `main` setelah user review.

## Testing Decisions

- **Yang diuji adalah perilaku yang terlihat:** kemampuan menulis dan menjelaskan LINQ tanpa melihat catatan. Kuis di lesson hanya feedback cepat. Bukti penguasaan topik LINQ datang dari review 0007 (dan 0012/0018) dengan kriteria yang sama seperti seam lain: kuis benar dan lisan ≥ 4/6.
- **Tidak ada `tests/dotnet/questions-0025.test.js`**, mengikuti arahan user untuk 0020–0023. Bank soal divalidasi oleh `QuestionBank.register` dan dicek ad hoc dengan `tests/helpers.js` (tidak ada bentrok nama/ID, satu kuis per topik untuk beberapa seed).
- **Test review yang sudah ada disesuaikan, bukan ditambah:** `review-0007.test.js` dan `review-0018.test.js` (plus `review-0012.test.js` bila memeriksa `data-mc`/topik). `node --test` harus hijau.
- **Lab tidak diuji otomatis.** Kalau .NET 8 SDK tersedia, agent menjalankan lab beserta keempat jawaban latihan dan memastikan outputnya sesuai. Kalau tidak tersedia, catat "lab belum diverifikasi" di NOTES, jangan dianggap lulus.

## Out of Scope

- `Aggregate`, `Zip`, `GroupJoin`/left join, `ToLookup`, PLINQ, menulis extension method sendiri dengan `yield`.
- Query syntax di luar satu contoh pengenalan.
- Expression tree secara mendalam (cukup rujukan ke 0003).
- Mengubah atau menggeser nomor lesson 0001–0024.
- Membuat project .NET permanen di repo atau mengubah mini project Product Catalog.
- Mengedit `assets/questions/0018.js`.

## Further Notes

- Total ±30 menit. Kalau waktunya kurang, latihan tulis ke-3 dan ke-4 boleh dikerjakan di sesi mengulang.
- Contoh dan latihan memakai Entity Product Catalog (Product, Category, Price, Stock) supaya konsisten dengan lesson lain dan lab SQL 0019 (top-N per grup bisa dibandingkan dengan versi `ROW_NUMBER`).
- Hasil review 0007/0012/0018 belum ada. Kalau nanti ada baris "Topik lemah …" yang memuat topik `linq-*`, perlakukan sama seperti topik Hari 1 lainnya.
