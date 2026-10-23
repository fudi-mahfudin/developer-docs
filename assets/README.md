# Assets: komponen bersama

Semua komponen jalan langsung dari `file://` (tanpa server, tanpa `import`/`fetch`). Contoh lengkap yang bisa dibuka: `assets/examples/review-example.html`.

| File | Isi |
|---|---|
| `style.css` | Stylesheet bersama untuk lesson, reference, dan indeks (termasuk aturan cetak). |
| `quiz.js` | Kuis pilihan ganda dari markup `.quiz > .q` (skor + tombol Ulangi). Tidak berubah. |
| `bank.js` | Bank soal bersama: global `QuestionBank` (logic murni, diuji di `tests/bank.test.js`). |
| `questions/NNNN.js` | **Satu file per lesson** yang mendaftarkan soal lesson itu ke bank. |
| `bank-quiz.js` | Merender soal kuis dari bank ke markup `quiz.js` di halaman lesson. |
| `review.js` | Review campuran: tarik + acak soal dari beberapa lesson/topik, ringkasan per topik. |
| `order.js` | Latihan "susun urutan" (↑/↓ + Periksa, tandai posisi benar/salah). Logic diuji di `tests/order.test.js`. |

## Format soal (`assets/questions/NNNN.js`)

Setiap lesson membuat file sendiri, bernama nomor lesson-nya (mis. `assets/questions/0004.js`). Jangan mengedit file lesson lain, supaya branch paralel tidak bentrok.

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

Tulis soal sekali di `questions/NNNN.js`, lalu render di lesson (urutan sesuai registrasi):

```html
<div class="quiz" data-bank-lesson="0004"></div>
<div class="quiz" data-bank-lesson="0004" data-bank-topic="di-captive" data-stack></div> <!-- filter topik, opsi vertikal -->

<script src="../assets/bank.js"></script>
<script src="../assets/questions/0004.js"></script>
<script src="../assets/bank-quiz.js"></script>
<script src="../assets/quiz.js"></script>   <!-- harus setelah bank-quiz.js -->
```

Soal `oral` tidak dirender oleh `bank-quiz.js`; latihan lisan di lesson tetap ditulis sebagai `<details>` + checklist seperti 0001, tapi daftarkan juga ke bank supaya bisa ditarik review.

## Latihan susun urutan (`order.js`)

Tulis item dalam urutan **benar**; komponen mengacaknya saat halaman dibuka (tidak pernah langsung benar). Contoh: lesson 0005 (urutan middleware, prioritas konfigurasi).

```html
<div class="order">
  <ol>
    <li><code>app.UseExceptionHandler()</code></li>
    <li><code>app.UseRouting()</code></li>
  </ol>
  <p class="explain">Muncul setelah urutan benar atau setelah "Lihat jawaban".</p>
</div>
<script src="../assets/order.js"></script>
```

Latihan urutan tidak masuk bank soal (bank hanya `mc`/`oral`); ubah materinya menjadi soal `mc` kalau perlu ditarik review.

## Halaman review (0007, 0012, 0018)

```html
<div class="review" data-title="Review 0007" data-lessons="0001,0002,0003,0004,0005,0006"
     data-topics="" data-mc="12" data-oral="3"></div>

<script src="../assets/bank.js"></script>
<script src="../assets/questions/0001.js"></script>
<!-- … satu <script> per lesson sumber (juga lesson asal topik di data-topics) … -->
<script src="../assets/review.js"></script>
```

- `data-lessons`: lesson sumber. `data-topics`: topik tambahan (mis. topik lemah dari review sebelumnya, untuk pengulangan berjarak). Soal diambil kalau lesson **atau** topiknya cocok.
- `data-mc` / `data-oral`: jumlah soal kuis dan lisan. Penarikan menyebar ke semua topik dulu sebelum mengulang topik, lalu kuis dan lisan diacak bersama.
- Seed tampil di halaman. `?seed=123` di URL mengulang set yang sama. Tombol "Acak ulang" membuat set baru.
- Setelah semua soal dijawab, tampil tabel skor per topik dan teks siap salin (`Topik lemah: …`) untuk ditempel ke agent. Topik lemah = ada soal yang salah atau lisan di bawah 2/3 checklist.

## Indeks (`index.html` di root)

Satu baris `<li>` per lesson. Saat lesson selesai, ganti hanya baris lesson itu dari `class="segera"` + `<span class="title">` menjadi `class="tersedia"` + `<a class="title" href="lessons/NNNN-slug.html">`. Biarkan baris kosong di antara `<li>` (supaya merge paralel tidak bentrok).

## Test

```sh
node --test      # dari root repo; menjalankan tests/*.test.js, tanpa npm
```
