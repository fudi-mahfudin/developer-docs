# Assets: komponen bersama

Semua komponen jalan langsung dari `file://` (tanpa server, tanpa `import`/`fetch`). Contoh lengkap yang bisa dibuka: `assets/examples/review-example.html`.

**PWA (ADR 0004):** situs yang dideploy adalah PWA (offline + installable). Tag PWA disuntik saat build ke artefak `_site/`, jadi **jangan** menulis `<link rel="manifest">` atau `pwa.js` di HTML. Lesson baru otomatis ikut di-precache. Coba SW/offline/install dengan `npm run preview`. Jangan menautkan file yang tidak dideploy (`tests/`, `docs/`, `.scratch/`, `scripts/`); `tests/shared/build-pwa.test.js` memeriksanya.

| File | Isi |
|---|---|
| `style.css` | Stylesheet bersama untuk lesson, reference, dan indeks (termasuk aturan cetak). |
| `quiz.js` | Kuis pilihan ganda dari markup `.quiz > .q` (skor + tombol Ulangi). Tidak berubah. |
| `bank.js` | Bank soal bersama: global `QuestionBank` (logic murni, diuji di `tests/shared/bank.test.js`). |
| `<track>/assets/questions/NNNN.js` | **Satu file per lesson** yang mendaftarkan soal lesson itu ke bank. Ada di folder track (`dotnet/`, `fhir/`, `sysdesign/`, `nodejs/`), bukan di sini. |
| `bank-quiz.js` | Merender soal kuis dari bank ke markup `quiz.js` di halaman lesson. |
| `review.js` | Review campuran: tarik + acak soal dari beberapa lesson/topik, ringkasan per topik. |
| `order.js` | Latihan "susun urutan" (↑/↓ + Periksa, tandai posisi benar/salah). Logic diuji di `tests/shared/order.test.js`. |
| `hands-on.js` | Komponen hands-on lesson database (0019+): blok skrip `.sql` dengan tombol copy, dan latihan tulis query dengan jawaban di balik tombol "Lihat jawaban". Contoh: `assets/examples/hands-on-example.html`. |
| `timer.js` | Timer bersegmen untuk latihan dibatasi waktu: `<div class="timer" data-segments="Konsep:20,Live coding:25,STAR:15">`. Mulai/Jeda/Reset, segmen berganti otomatis, tersembunyi saat dicetak. Logic diuji di `tests/shared/timer.test.js`. Contoh: lesson 0018. |
| `pwa.js` | Registrasi service worker. Hanya disuntik ke situs yang dideploy (bukan ditulis di HTML), dan tidak melakukan apa-apa di `file://`. |
| `icon.svg`, `icons/` | Sumber ikon aplikasi dan PNG hasil `npm run icons` (di-commit). |
| `svg.diagram` (CSS di `style.css`) | Diagram arsitektur bercabang sebagai inline SVG (ADR 0003): `<svg class="diagram" viewBox=… role="img" aria-label=…>` berisi `<defs><marker id="panah">`, node `<g class="node service|store|cache|queue|client"><rect/><text/></g>`, dan garis `<path class="edge">` (`edge async` = putus-putus). Bungkus dengan `<figure class="diagram-fig">` + `figcaption` bila perlu. Alur linear tetap memakai `.flow`. Contoh: `assets/examples/diagram-example.html`. |

## Format soal (`<track>/assets/questions/NNNN.js`)

Setiap lesson membuat file sendiri, bernama nomor lesson-nya (mis. `dotnet/assets/questions/0004.js`). Jangan mengedit file lesson lain, supaya branch paralel tidak bentrok.

```js
QuestionBank.labelTopics({ "di-lifetime": "Service Lifetime" }); // slug topik -> label tampilan

QuestionBank.register([
  {
    id: "0004-01",            // unik global: awali dengan nomor lesson
    lesson: "0004",           // nomor lesson, string 4 digit
    topic: "di-lifetime",     // slug topik; dasar skor per topik di review
    type: "mc",               // "mc" (kuis) atau "oral" (lisan)
    prompt: "Pertanyaan (boleh HTML, mis. <code>)",
    options: { a: "…", b: "…", c: "…", d: "…" },   // jumlah kata tiap opsi sama
    answer: "c",              // kunci di options; variasikan posisinya antar soal
    explain: "Penjelasan setelah menjawab",
  },
  {
    id: "0004-oral-1", lesson: "0004", topic: "di-lifetime", type: "oral",
    prompt: "Jelaskan captive dependency dalam 60 detik.",
    sample: "Jawaban contoh (opsional, HTML)",
    checklist: ["poin 1", "poin 2", "poin 3", "poin 4", "poin 5", "poin 6"], // lulus jika >= 2/3 (4 dari 6)
  },
]);
```

`register` melempar error kalau field wajib hilang, `answer` tidak ada di `options`, soal lisan tanpa `checklist`, atau `id` duplikat. Periksa console browser.

## Halaman lesson: kuis dari bank

Tulis soal sekali di `<track>/assets/questions/NNNN.js`, lalu render di lesson (urutan sesuai registrasi):

```html
<div class="quiz" data-bank-lesson="0004"></div>
<div class="quiz" data-bank-lesson="0004" data-bank-topic="di-captive" data-stack></div> <!-- filter topik, opsi vertikal -->
<div class="quiz" data-bank-lesson="0015" data-bank-topic="rx-subject,rx-unsubscribe"></div> <!-- beberapa topik, dipisah koma -->

<script src="../../assets/bank.js"></script>
<script src="../assets/questions/0004.js"></script>
<script src="../../assets/bank-quiz.js"></script>
<script src="../../assets/quiz.js"></script>   <!-- harus setelah bank-quiz.js -->
```

Soal `oral` tidak dirender oleh `bank-quiz.js`; latihan lisan di lesson tetap ditulis sebagai `<details>` + checklist seperti 0001, tapi daftarkan juga ke bank supaya bisa ditarik review.

## Latihan susun urutan (`order.js`)

Tulis item dalam urutan **benar**; komponen mengacaknya saat halaman dibuka (tidak pernah langsung benar). Contoh: lesson 0005 (urutan middleware, prioritas konfigurasi), lesson 0009 (satu siklus TDD).

```html
<div class="order">
  <ol>
    <li><code>app.UseExceptionHandler()</code></li>
    <li><code>app.UseRouting()</code></li>
  </ol>
  <p class="explain">Muncul setelah urutan benar atau setelah "Lihat jawaban".</p>
</div>
<script src="../../assets/order.js"></script>
```

Latihan urutan tidak masuk bank soal (bank hanya `mc`/`oral`); ubah materinya menjadi soal `mc` kalau perlu ditarik review.

## Hands-on database (`hands-on.js`, lesson 0019+)

Skrip lab ada di `dotnet/lab/`: `dotnet/lab/00-setup-product-catalog-lab.sql` (setup/reset `ProductCatalogLab`) dan `dotnet/lab/NNNN-*.sql` per lesson. **File `.sql` adalah sumber kebenaran**: lesson menampilkan isinya sama persis (HTML-escaped: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`). `data-file` ditulis relatif ke root repo.

```html
<pre class="script" data-file="dotnet/lab/0019-sql-dasar.sql"><code>SELECT …</code></pre>

<div class="sql-exercise">
  <p class="prompt">Tulis query untuk 3 Product termahal per Category.</p>
  <details class="answer"><summary>Lihat jawaban</summary>
    <pre><code>WITH ranked AS (…) SELECT …</code></pre>
  </details>
</div>

<script src="../../assets/hands-on.js"></script>
```

Latihan tulis query tidak dinilai otomatis dan tidak masuk bank soal. Test lesson memeriksa blok skrip lewat `assertScriptsMatchFiles("dotnet/lessons/0019-….html", { min: 1 })` dari `tests/helpers.js` (contoh: `tests/shared/hands-on.test.js`).

## Halaman review (0007, 0012, 0018)

```html
<div class="review" data-title="Review 0007" data-lessons="0001,0002,0003,0004,0005,0006"
     data-topics="" data-mc="12" data-oral="3"></div>

<script src="../../assets/bank.js"></script>
<script src="../assets/questions/0001.js"></script>
<!-- … satu <script> per lesson sumber (juga lesson asal topik di data-topics) … -->
<script src="../../assets/review.js"></script>
```

- `data-lessons`: lesson sumber. `data-topics`: topik tambahan (mis. topik lemah dari review sebelumnya, untuk pengulangan berjarak). Soal diambil kalau lesson **atau** topiknya cocok.
- `data-mc` / `data-oral`: jumlah soal kuis dan lisan. Penarikan menyebar ke semua topik dulu sebelum mengulang topik, lalu kuis dan lisan diacak bersama.
- Seed tampil di halaman. `?seed=123` di URL mengulang set yang sama. Tombol "Acak ulang" membuat set baru.
- Setelah semua soal dijawab, tampil tabel skor per topik dan teks siap salin (`Topik lemah: …`) untuk ditempel ke agent. Status per topik (`QuestionBank.STATUS`): **Lemah** = ada soal yang salah atau lisan di bawah 2/3 checklist; **Lulus** = semua kuis topik itu benar **dan** ada soal lisan yang lulus; **Kuis lulus, lisan belum diuji** = kuis benar tapi tidak ada soal lisan topik itu yang ditarik (bukan bukti lulus, ditulis di baris tersendiri di teks salin).

## Indeks (`<track>/index.html`)

Satu baris `<li>` per lesson. Saat lesson selesai, ganti hanya baris lesson itu dari `class="segera"` + `<span class="title">` menjadi `class="tersedia"` + `<a class="title" href="lessons/NNNN-slug.html">`. Biarkan baris kosong di antara `<li>` (supaya merge paralel tidak bentrok).

## Test

```sh
node --test                          # dari root repo; menjalankan semua *.test.js di tests/{shared,dotnet,fhir,sysdesign,nodejs}/, tanpa npm
node --test "tests/nodejs/*.test.js"  # satu track saja: pakai glob, bukan folder (node --test tests/nodejs/ memperlakukan folder sebagai file dan gagal)
```

Test bank soal per lesson (`tests/<track>/questions-NNNN.test.js`) dan review (`tests/<track>/review-NNNN.test.js`) memakai `tests/helpers.js`: `loadLesson("0004")` / `loadLesson(...DAY1)` memuat file soal track .NET ke bank baru (`forTrack("fhir")` untuk track lain), `runAsBrowserScripts([...])` menjalankannya seperti `<script>` di satu global scope, aturan teach (`assertEqualOptionWords`, `assertAnswerPositionsVary`, `assertOralFormat`, `assertCitesNumbered(html, label)`), untuk test modul `readLesson(num)` (halaman lesson dari nomornya), `assertModuleTopics(lessons, prefix)` (topik milik lesson, berprefiks modul, >= 2 kuis per topik, >= 1 lisan per lesson), serta di `forTrack(track)` saja `read(file)` (file track), `section(file, "## Judul")` (isi satu bagian GLOSSARY/RESOURCES) dan `assertListedAsTersedia(lessons)` (lesson `{ NNNN: { file } }` tercantum `tersedia` di index track), dan untuk lesson database `scriptBlocks(html)` / `assertScriptsMatchFiles(html, { min })` (blok skrip identik dengan file `.sql`-nya). `helpers.js` tidak cocok dengan pola nama test default `node --test`, jadi tidak dijalankan sebagai test.
