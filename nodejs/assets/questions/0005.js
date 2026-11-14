// Soal lesson 0005 (track Node.js, modul Async & error) · Kombinator Promise; await berurutan vs paralel. Format: assets/README.md.
// Sumber: Node.js Learn (Discover Promises in Node.js), ECMAScript Language Specification (Promise.all/allSettled/race/any).
QuestionBank.labelTopics({
  "async-kombinator": "Async: Promise.all/allSettled/race/any, await berurutan vs paralel",
  "async-concurrency": "Async: await di dalam loop dan membatasi concurrency",
});

QuestionBank.register([
  {
    id: "0005-01", lesson: "0005", topic: "async-kombinator", type: "mc",
    prompt: "Tiga panggilan independen masing-masing ±300 ms ditulis sebagai tiga <code>await</code> berurutan. Apa efek menggantinya dengan <code>await Promise.all([...])</code>?",
    options: {
      a: "Tidak berubah, karena JavaScript hanya punya satu thread",
      b: "Total turun ke ±300 ms; ketiganya menunggu bersamaan",
      c: "Total naik, karena Promise.all menambah overhead thread baru",
      d: "Ketiganya dijalankan di tiga thread JavaScript yang berbeda",
    },
    answer: "b",
    explain: "Berurutan: waktu total = jumlah ketiganya. Dengan Promise.all, ketiga Promise sudah dimulai sebelum ditunggu, jadi waktu tunggu I/O tumpang-tindih dan total ≈ yang paling lama. JavaScript tetap satu thread; yang paralel adalah penantian I/O.",
  },
  {
    id: "0005-02", lesson: "0005", topic: "async-kombinator", type: "mc",
    prompt: "Anda mengirim notifikasi ke 50 user. Sebagian boleh gagal, tetapi Anda perlu tahu siapa saja yang gagal. Kombinator mana yang tepat?",
    options: {
      a: "<code>Promise.all</code>, karena hasilnya urut sesuai input",
      b: "<code>Promise.race</code>, karena selalu selesai paling cepat",
      c: "<code>Promise.any</code>, karena mengabaikan semua yang gagal",
      d: "<code>Promise.allSettled</code>, karena melaporkan status setiap Promise",
    },
    answer: "d",
    explain: "allSettled menunggu semua Promise selesai dan tidak short-circuit saat ada yang gagal; hasilnya array objek {status, value} atau {status, reason} (Node.js Learn, Discover Promises). Promise.all reject begitu satu gagal, jadi Anda kehilangan gambaran lengkapnya.",
  },
  {
    id: "0005-03", lesson: "0005", topic: "async-kombinator", type: "mc",
    prompt: "<code>Promise.all([a(), b(), c()])</code> reject karena <code>b()</code> gagal setelah 10 ms. Apa yang terjadi pada <code>a()</code> dan <code>c()</code>?",
    options: {
      a: "Keduanya tetap berjalan sampai selesai, tanpa pembatalan otomatis",
      b: "Keduanya otomatis dibatalkan oleh Promise.all saat b gagal",
      c: "Keduanya diulang dari awal setelah b berhasil diulang",
      d: "Keduanya menjadi unhandled rejection dan proses langsung berhenti",
    },
    answer: "a",
    explain: "Promise tidak punya mekanisme pembatalan. Node.js Learn: \"even if rejection occurs, the Promises continue to execute.\" Untuk benar-benar menghentikan pekerjaan, teruskan AbortSignal ke setiap pekerjaan (lesson 0007).",
  },
  {
    id: "0005-04", lesson: "0005", topic: "async-concurrency", type: "mc",
    prompt: "Kode <code>ids.forEach(async id =&gt; { await save(id); }); console.log(\"selesai\");</code>. Apa masalahnya?",
    options: {
      a: "Tidak ada masalah; forEach menunggu callback async selesai",
      b: "save dijalankan berurutan, jadi lambat tetapi tetap benar",
      c: "forEach mengabaikan Promise, jadi \"selesai\" tercetak terlalu awal",
      d: "Syntax error, karena await dilarang di dalam forEach",
    },
    answer: "c",
    explain: "forEach memanggil callback dan membuang nilai kembaliannya, termasuk Promise. Akibatnya fungsi luar tidak menunggu, dan reject dari save tidak tertangkap di sini sehingga menjadi unhandled rejection. Pakai for...of + await (berurutan) atau Promise.all(ids.map(...)).",
  },
  {
    id: "0005-05", lesson: "0005", topic: "async-concurrency", type: "mc",
    prompt: "Anda harus memproses 10.000 ID, satu query database per ID. Pendekatan mana yang paling aman?",
    options: {
      a: "<code>Promise.all(ids.map(query))</code> agar semua query selesai secepat mungkin",
      b: "Batasi concurrency, misalnya 5 query berjalan bersamaan",
      c: "<code>ids.forEach(async ...)</code> agar tidak perlu menunggu apa pun",
      d: "Promise.race berulang sampai semua ID selesai diproses",
    },
    answer: "b",
    explain: "Memulai 10.000 query sekaligus memenuhi connection pool dan memori; Node.js Learn mengingatkan Promise.all untuk Promise dalam jumlah besar \"can strain the system's memory\". Batasi jumlah yang berjalan bersamaan (worker pool, p-limit) atau proses per batch.",
  },
  {
    id: "0005-06", lesson: "0005", topic: "async-kombinator", type: "mc",
    prompt: "Anda memanggil tiga mirror yang sama dan ingin hasil pertama yang <em>berhasil</em>. Kalau ketiganya gagal, apa yang diterima <code>Promise.any</code>?",
    options: {
      a: "Error dari mirror yang pertama gagal",
      b: "Array kosong tanpa error apa pun",
      c: "Nilai <code>undefined</code> dari mirror yang terakhir",
      d: "<code>AggregateError</code> berisi semua alasan kegagalan mirror",
    },
    answer: "d",
    explain: "Promise.any resolve dengan Promise pertama yang fulfilled. Kalau semuanya reject, ia reject dengan AggregateError yang properti errors-nya berisi alasan setiap kegagalan (ECMAScript spec, Promise.any). Promise.race berbeda: ia ikut reject kalau yang pertama selesai adalah kegagalan.",
  },
  {
    id: "0005-oral-1", lesson: "0005", topic: "async-concurrency", type: "oral",
    prompt: "\"Tulis fungsi <code>mapLimit(items, limit, fn)</code> yang menjalankan <code>fn</code> untuk setiap item dengan paling banyak <code>limit</code> pekerjaan berjalan bersamaan, dan mengembalikan hasil sesuai urutan input.\" (5 menit)",
    sample: "<pre><code>async function mapLimit(items, limit, fn) {\n  const results = new Array(items.length);\n  let next = 0;\n  async function worker() {\n    while (next &lt; items.length) {\n      const i = next++;\n      results[i] = await fn(items[i], i);\n    }\n  }\n  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));\n  return results;\n}</code></pre>\"Saya membuat <code>limit</code> worker. Masing-masing mengambil indeks berikutnya, menunggu <code>fn</code>, lalu mengambil lagi sampai habis. <code>next++</code> aman karena JavaScript satu thread. Hasil disimpan per indeks supaya urutannya sama dengan input. Kalau satu <code>fn</code> reject, <code>Promise.all</code> reject, tapi worker lain tetap jalan; kalau perlu semua hasil, saya simpan error per item seperti <code>allSettled</code>.\"",
    checklist: [
      "Paling banyak limit pekerjaan berjalan bersamaan (worker atau antrean), bukan semuanya sekaligus",
      "Setiap worker mengambil item berikutnya sampai habis, bukan batch kaku yang menunggu item paling lambat",
      "Hasil disimpan per indeks sehingga urutan sama dengan input",
      "Menunggu semua worker selesai (mis. Promise.all atas worker) sebelum mengembalikan hasil",
      "Menjelaskan kenapa next++ aman: JavaScript berjalan di satu thread",
      "Menyebut perilaku saat ada yang gagal (fail-fast seperti all atau dikumpulkan seperti allSettled)",
    ],
  },
]);
