// Soal lesson 0015 (track FHIR, modul Bulk Data) · Streaming baris per baris, batching, backpressure dan pipeline. Format: assets/README.md.
// Dipecah dari bank lama 0004 (lihat .scratch/restruktur-fhir/); slug topik tidak berubah.
// Fakta Bulk Data dari Bulk Data Access IG v2.0.0 (STU 2): https://hl7.org/fhir/uv/bulkdata/STU2/export.html
QuestionBank.labelTopics({
  "bulk-stream": "Streaming NDJSON dan JSON besar di Node",
  "bulk-backpressure": "Backpressure dan pipeline",
});

QuestionBank.register([
  {
    id: "0015-01", lesson: "0015", topic: "bulk-stream", type: "mc",
    prompt: "Cara paling sederhana, sesuai contoh resmi dokumentasi Node, untuk membaca file NDJSON baris per baris?",
    options: {
      a: "<code>readFileSync</code> lalu split newline pada seluruh isi file",
      b: "<code>readline.createInterface</code> di atas <code>createReadStream</code> lalu loop for await",
      c: "<code>JSON.parse</code> dengan reviver yang dipanggil untuk setiap baris",
      d: "<code>fetch</code> lalu <code>response.json()</code> untuk setiap file di manifest",
    },
    answer: "b",
    explain: "Dokumentasi readline, \"Read file stream line-by-line\": <code>createInterface({ input: createReadStream(file), crlfDelay: Infinity })</code> lalu <code>for await (const line of rl)</code>. <code>crlfDelay: Infinity</code> membuat CR LF dihitung satu pemisah baris. Catatan dokumentasi: \"Errors in the input stream are not forwarded\" ke loop itu. <code>response.json()</code> mem-parse seluruh body sekaligus.",
  },
  {
    id: "0015-02", lesson: "0015", topic: "bulk-stream", type: "mc",
    prompt: "File besarnya bukan NDJSON, melainkan satu Bundle <code>searchset</code> 2 GB dengan array <code>entry</code> raksasa. Alat apa yang cocok di Node?",
    options: {
      a: "<code>readline</code>, karena setiap entry selalu satu baris teks",
      b: "<code>JSON.parse</code> biasa, karena Bundle hanya satu dokumen saja",
      c: "<code>stream-json</code> dengan pick entry lalu streamArray per elemen",
      d: "<code>Buffer.concat</code> semua chunk lalu parse sekali di akhir",
    },
    answer: "c",
    explain: "README <code>stream-json</code>: \"Point it at a document far larger than available memory and it streams straight through\". Pola resminya <code>parser()</code> → <code>pick({filter: 'entry'})</code> → <code>streamArray()</code> yang memancarkan satu elemen array sekaligus. JSON biasa boleh berisi newline di mana saja, jadi membaca per baris tidak menjamin satu baris satu entry.",
  },
  {
    id: "0015-03", lesson: "0015", topic: "bulk-backpressure", type: "mc",
    prompt: "Saat menulis hasil transformasi, <code>writable.write(chunk)</code> mengembalikan <code>false</code>. Apa artinya, dan apa yang harus dilakukan?",
    options: {
      a: "Chunk ditolak; kirim ulang chunk yang sama segera",
      b: "Stream sudah ditutup; buat writable baru lalu lanjut",
      c: "Terjadi error; tangkap lewat try/catch di sekitar write",
      d: "Buffer penuh; berhenti menulis sampai event drain muncul",
    },
    answer: "d",
    explain: "Dokumentasi stream: <code>false</code> berarti buffer internal sudah mencapai <code>highWaterMark</code>; \"Once write() returns false, do not write more chunks until the 'drain' event is emitted.\" Chunk itu tetap di-buffer, bukan ditolak. Kalau diabaikan, \"Node.js will buffer all written chunks until maximum memory usage occurs\". Inilah backpressure.",
  },
  {
    id: "0015-04", lesson: "0015", topic: "bulk-backpressure", type: "mc",
    prompt: "Kenapa <code>pipeline</code> dari <code>node:stream/promises</code> lebih disarankan daripada merangkai <code>.pipe()</code> secara manual?",
    options: {
      a: "<code>pipeline</code> meneruskan error dan membersihkan semua stream otomatis",
      b: "<code>pipeline</code> memuat seluruh file ke memori lebih dulu",
      c: "<code>pipeline</code> menjalankan setiap stream di worker thread terpisah",
      d: "<code>pipeline</code> mematikan backpressure supaya throughput selalu lebih tinggi",
    },
    answer: "a",
    explain: "<code>pipeline</code> adalah \"A module method to pipe between streams and generators forwarding errors and properly cleaning up\", dan versi promise-nya bisa di-<code>await</code>. Dengan <code>.pipe()</code>, \"if the Readable stream emits an error during processing, the Writable destination is not closed automatically\", jadi Anda harus menutup setiap stream sendiri. Backpressure tetap berlaku di keduanya.",
  },
  {
    id: "0015-oral-1", lesson: "0015", topic: "bulk-backpressure", type: "oral",
    prompt: "\"File Observation NDJSON 5 GB hasil <code>$export</code>. Bagaimana Anda memprosesnya di Node dan menyimpannya ke database tanpa kehabisan memori?\" (90 detik)",
    sample: "\"Saya tidak akan <code>readFile</code> lalu <code>JSON.parse</code>: seluruh file harus jadi satu string, padahal panjang string di V8 dibatasi, parse-nya memblok event loop, dan NDJSON memang bukan satu dokumen JSON. Karena NDJSON satu baris satu resource, saya baca sebagai stream: <code>createReadStream</code>, pecah per baris dengan <code>readline</code> atau async generator, lalu <code>JSON.parse</code> per baris. Saya kumpulkan per batch, misalnya 1.000 resource, lalu <code>await</code> insert batch itu sebelum membaca lagi. Karena konsumen menarik data, stream berhenti membaca saat buffer mencapai <code>highWaterMark</code>; itulah backpressure, jadi memori tetap kecil walau database lebih lambat dari disk. Semua dirangkai dengan <code>pipeline</code> dari <code>stream/promises</code>, supaya error di tahap mana pun menghentikan dan membersihkan semua stream. Kalau datanya JSON biasa yang besar, misalnya Bundle, saya pakai <code>stream-json</code>. Dan saya hati-hati dengan decimal: <code>JSON.parse</code> mengubah 2.00 jadi 2.\"",
    checklist: [
      "menolak <code>readFile</code> + <code>JSON.parse</code> seluruh file: batas panjang string/heap dan event loop terblok",
      "NDJSON = satu baris satu resource: stream (<code>createReadStream</code>) lalu <code>JSON.parse</code> per baris",
      "batching insert ke database dan <code>await</code> sebelum membaca lagi",
      "menjelaskan backpressure: <code>highWaterMark</code>, <code>write()</code> false / <code>drain</code>, konsumen lambat menahan produsen",
      "<code>pipeline</code> dari <code>stream/promises</code> untuk propagasi error dan cleanup",
      "menyebut <code>stream-json</code> untuk JSON besar non-NDJSON atau jebakan presisi <code>decimal</code>",
    ],
  },
]);
