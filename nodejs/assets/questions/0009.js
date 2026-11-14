// Soal lesson 0009 (track Node.js, modul I/O & skala) · Backpressure, highWaterMark, dan Buffer. Format: assets/README.md.
// Sumber: Node.js v24 API docs (stream, buffer), Node.js Learn "Backpressuring in Streams".
QuestionBank.labelTopics({
  "io-backpressure": "I/O & skala: backpressure, highWaterMark, write() dan 'drain'",
  "io-buffer": "I/O & skala: Buffer dan encoding",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban c a d b a.
QuestionBank.register([
  {
    id: "0009-01", lesson: "0009", topic: "io-backpressure", type: "mc",
    prompt: "Loop memanggil <code>ws.write(chunk)</code> jutaan kali tanpa melihat nilai kembaliannya, ke tujuan yang lambat. Apa akibatnya?",
    options: {
      a: "Node otomatis menjeda loop sampai tujuan siap menerima",
      b: "write() langsung melempar error begitu buffer melewati highWaterMark",
      c: "Data menumpuk di memori dan proses bisa kehabisan",
      d: "Data berlebih dibuang diam-diam oleh stream tujuan itu",
    },
    answer: "c",
    explain: "highWaterMark adalah \"a threshold, not a limit\": write() hanya mengembalikan false sebagai sinyal, tidak menolak data. Kalau sinyal diabaikan, data terus ditampung di memori. Node.js Learn mengukur memori ±1,52 GB tanpa backpressure vs ±88 MB dengan backpressure.",
  },
  {
    id: "0009-02", lesson: "0009", topic: "io-buffer", type: "mc",
    prompt: "<code>'é'.length</code> bernilai 1. Berapa <code>Buffer.byteLength('é')</code> dengan encoding default?",
    options: {
      a: "2, karena UTF-8 memakai dua byte untuk é",
      b: "1, karena satu karakter selalu sama satu byte",
      c: "4, karena setiap karakter JavaScript disimpan sebagai UTF-32",
      d: "0, karena karakter non-ASCII dibuang oleh encoding default",
    },
    answer: "a",
    explain: "Encoding default Buffer adalah UTF-8. Buffer.byteLength menghitung byte, berbeda dengan String.prototype.length yang menghitung code unit UTF-16. é (U+00E9) butuh 2 byte di UTF-8. Ini penting untuk header Content-Length.",
  },
  {
    id: "0009-03", lesson: "0009", topic: "io-backpressure", type: "mc",
    prompt: "<code>ws.write(chunk)</code> mengembalikan <code>false</code>. Apa yang seharusnya dilakukan kode penulis?",
    options: {
      a: "Menulis ulang chunk yang sama karena tadi gagal",
      b: "Menutup stream dengan end() karena buffer sudah penuh",
      c: "Menaikkan highWaterMark lalu langsung lanjut menulis chunk berikutnya",
      d: "Berhenti menulis dan lanjut setelah event 'drain' muncul",
    },
    answer: "d",
    explain: "Node v24: kalau write() mengembalikan false, \"further attempts to write data to the stream should stop until the 'drain' event is emitted\". Chunk yang tadi tetap diterima (tidak gagal), jadi jangan ditulis ulang.",
  },
  {
    id: "0009-04", lesson: "0009", topic: "io-backpressure", type: "mc",
    prompt: "Di Node 24 (Linux), berapa default <code>highWaterMark</code> untuk stream byte biasa, dan untuk stream <code>objectMode</code>?",
    options: {
      a: "16 KiB untuk byte, 1 objek untuk objectMode",
      b: "64 KiB untuk byte, 16 objek untuk objectMode",
      c: "1 MiB untuk byte, 64 objek untuk objectMode",
      d: "Tanpa batas untuk byte, tanpa batas untuk objectMode",
    },
    answer: "b",
    explain: "stream.getDefaultHighWaterMark(): 65536 (64 KiB) untuk byte stream di non-Windows (16 KiB di Windows), 16 untuk objectMode. Default byte dinaikkan di Node v22.0.0; sebelumnya 16 KiB.",
  },
  {
    id: "0009-05", lesson: "0009", topic: "io-buffer", type: "mc",
    prompt: "Stream file UTF-8 dibaca sebagai Buffer, lalu setiap chunk diubah dengan <code>chunk.toString()</code>. Kadang muncul karakter rusak (�). Kenapa?",
    options: {
      a: "Karakter multi-byte terpotong di batas antara dua chunk",
      b: "toString() memakai encoding latin1 sebagai default, bukan UTF-8",
      c: "Buffer tidak bisa menyimpan karakter non-ASCII sama sekali",
      d: "File UTF-8 harus selalu dibaca dengan fs.readFileSync saja",
    },
    answer: "a",
    explain: "Batas chunk dihitung dalam byte, jadi karakter UTF-8 2–4 byte bisa terbelah. Dokumentasi readable.setEncoding(): stream \"will properly handle multi-byte characters\" yang kalau tidak akan salah didekode saat diambil sebagai Buffer. Solusi: readable.setEncoding('utf8') atau StringDecoder.",
  },
  {
    id: "0009-oral-1", lesson: "0009", topic: "io-backpressure", type: "oral",
    prompt: "\"Apa itu backpressure di stream Node, dan apa yang terjadi kalau diabaikan?\" Jelaskan dalam 60 detik, termasuk cara menanganinya kalau Anda menulis ke Writable secara manual.",
    sample: "Backpressure adalah sinyal dari tujuan yang lebih lambat bahwa sumber harus berhenti dulu. Setiap stream punya buffer internal dengan ambang highWaterMark, default 64 KiB sejak Node 22. Begitu buffer Writable mencapai ambang itu, write() mengembalikan false. Penulis harus berhenti dan menunggu event 'drain'. Kalau diabaikan, data tetap ditampung di memori karena highWaterMark hanya ambang, bukan batas; contoh di dokumentasi Node memakai ±1,5 GB memori tanpa backpressure vs ±88 MB dengan backpressure, dan GC bekerja lebih keras. Cara paling mudah: pakai stream.pipeline, yang menangani backpressure dan error otomatis. Kalau menulis manual, cek nilai write() dan await once(ws, 'drain').",
    checklist: [
      "backpressure = tujuan lebih lambat memberi sinyal ke sumber untuk berhenti",
      "highWaterMark sebagai ambang buffer internal (bukan batas keras)",
      "write() mengembalikan false saat buffer mencapai highWaterMark",
      "berhenti menulis dan lanjut setelah event 'drain'",
      "akibat diabaikan: memori membengkak, GC berat, bisa crash",
      "pipeline/pipe menangani backpressure otomatis",
    ],
  },
]);
