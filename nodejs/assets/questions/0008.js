// Soal lesson 0008 (track Node.js, modul I/O & skala) · Streams: Readable, Writable, Duplex, Transform, pipeline. Format: assets/README.md.
// Sumber: Node.js v24 API docs (stream, fs), Node.js Learn "How to use streams".
QuestionBank.labelTopics({
  "io-stream-jenis": "I/O & skala: empat jenis stream, stream vs readFile",
  "io-stream-pipeline": "I/O & skala: stream.pipeline dan async iterator",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban b d a c b.
QuestionBank.register([
  {
    id: "0008-01", lesson: "0008", topic: "io-stream-jenis", type: "mc",
    prompt: "<code>zlib.createGzip()</code> menerima data mentah lalu mengeluarkan data terkompresi. Termasuk jenis stream apa?",
    options: {
      a: "Readable, karena data hanya bisa dibaca",
      b: "Transform, karena output dihitung dari input",
      c: "Writable, karena data hanya bisa ditulis",
      d: "Duplex, karena kedua sisi tidak berhubungan",
    },
    answer: "b",
    explain: "Dokumentasi stream Node v24: Transform adalah Duplex yang \"can modify or transform the data as it is written and read\", contohnya zlib.createDeflate(). Duplex biasa (mis. net.Socket) juga bisa dibaca dan ditulis, tapi kedua sisinya independen.",
  },
  {
    id: "0008-02", lesson: "0008", topic: "io-stream-pipeline", type: "mc",
    prompt: "Kenapa <code>stream.pipeline()</code> lebih aman daripada merangkai <code>.pipe()</code> untuk menyalin file lewat gzip?",
    options: {
      a: "pipeline lebih cepat karena memakai thread pool sendiri",
      b: "pipeline membaca seluruh file ke memori lebih dulu",
      c: "pipeline otomatis menaikkan highWaterMark stream menjadi satu megabyte",
      d: "pipeline meneruskan error dan menghancurkan semua stream terkait",
    },
    answer: "d",
    explain: "Node v24: stream.pipeline() memanggil stream.destroy(err) pada semua stream saat error dan memberi satu callback/Promise. Dengan .pipe(), kalau Readable error, Writable tujuan \"is not closed automatically\" sehingga harus ditutup manual supaya tidak bocor.",
  },
  {
    id: "0008-03", lesson: "0008", topic: "io-stream-jenis", type: "mc",
    prompt: "Endpoint mengunduh file log 3 GB ke client. Kenapa <code>fs.createReadStream()</code> lebih tepat daripada <code>fs.readFile()</code>?",
    options: {
      a: "Memori hanya menampung potongan kecil, bukan seluruh file",
      b: "readFile tidak bisa membaca file biner sama sekali",
      c: "createReadStream membaca file secara sinkron jadi lebih cepat",
      d: "readFile selalu memblokir event loop sampai selesai membaca",
    },
    answer: "a",
    explain: "fs.readFile \"reads the entire contents of a file\" ke memori, jadi 3 GB file = ±3 GB Buffer per request. createReadStream membaca potongan sebesar highWaterMark (default 64 KiB) dan mengirimkannya bertahap. readFile sendiri asinkron, tidak memblokir event loop.",
  },
  {
    id: "0008-04", lesson: "0008", topic: "io-stream-pipeline", type: "mc",
    prompt: "Di dalam <code>for await (const chunk of readable)</code>, kode memanggil <code>break</code> setelah chunk pertama. Apa yang terjadi pada stream?",
    options: {
      a: "Stream tetap terbuka dan chunk berikutnya menunggu di buffer",
      b: "Stream dijeda dan bisa dilanjutkan dengan for await lagi",
      c: "Stream dihancurkan karena loop for await berhenti lewat break",
      d: "Stream melempar error karena chunk lain belum selesai dibaca",
    },
    answer: "c",
    explain: "Dokumentasi readable[Symbol.asyncIterator](): \"If the loop terminates with a break, return, or a throw, the stream will be destroyed.\" Jadi iterasi stream mengonsumsi stream sepenuhnya; jangan berharap bisa melanjutkannya.",
  },
  {
    id: "0008-05", lesson: "0008", topic: "io-stream-jenis", type: "mc",
    prompt: "Socket TCP (<code>net.Socket</code>) bisa dibaca dan ditulis. Jenis stream apa, dan kenapa bukan Transform?",
    options: {
      a: "Readable, karena data selalu datang dari jaringan saja",
      b: "Duplex, karena data masuk dan keluar saling independen",
      c: "Transform, karena data ditulis berubah jadi data dibaca",
      d: "Writable, karena client hanya mengirim data ke server",
    },
    answer: "b",
    explain: "Node v24 memberi net.Socket sebagai contoh Duplex: dua buffer terpisah untuk sisi baca dan tulis. Data yang Anda tulis ke socket dikirim ke peer; data yang Anda baca datang dari peer. Transform berarti output dihitung dari input, seperti gzip.",
  },
  {
    id: "0008-oral-1", lesson: "0008", topic: "io-stream-pipeline", type: "oral",
    prompt: "Tulis kode: fungsi <code>gzipFile(src, dest)</code> yang mengompres file besar ke <code>dest</code> memakai stream, aman terhadap error, dan bisa di-<code>await</code>. Lalu jelaskan dalam 60 detik kenapa tidak memakai <code>readFile</code> dan <code>.pipe()</code>.",
    sample: "<pre><code>const { pipeline } = require('node:stream/promises');\nconst fs = require('node:fs');\nconst zlib = require('node:zlib');\n\nasync function gzipFile(src, dest) {\n  await pipeline(\n    fs.createReadStream(src),\n    zlib.createGzip(),\n    fs.createWriteStream(dest),\n  );\n}</code></pre><p>readFile memuat seluruh file ke memori; untuk file besar dan banyak request, memori habis. Stream membaca per potongan (64 KiB default). pipeline dari <code>stream/promises</code> mengembalikan Promise, meneruskan error dari stream mana pun, dan menghancurkan semua stream kalau gagal, sedangkan .pipe() tidak menutup tujuan saat sumber error.</p>",
    checklist: [
      "memakai fs.createReadStream dan fs.createWriteStream, bukan readFile/writeFile",
      "zlib.createGzip() sebagai Transform di tengah",
      "pipeline dari node:stream/promises (atau versi callback dengan penanganan error)",
      "await pipeline sehingga error bisa ditangkap pemanggil",
      "menyebut readFile memuat seluruh file ke memori",
      "menyebut .pipe() tidak meneruskan error/tidak menutup stream tujuan",
    ],
  },
]);
