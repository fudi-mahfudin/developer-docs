// Soal lesson 0020 (track System Design, modul Reliabilitas & API) · Gaya API dan pagination. Format: assets/README.md.
// Sumber: RFC 9110 §9.2.2, grpc.io (introduction, core concepts, FAQ), RFC 6202, WHATWG HTML §9.2 (SSE), RFC 6455, PostgreSQL docs 7.6 (LIMIT/OFFSET).
QuestionBank.labelTopics({
  "rel-gaya-api": "Reliabilitas & API: REST, gRPC, WebSocket, long polling, SSE",
  "rel-pagination": "Reliabilitas & API: pagination offset vs cursor",
});

QuestionBank.register([
  {
    id: "0020-01", lesson: "0020", topic: "rel-gaya-api", type: "mc",
    prompt: "Dashboard harus menampilkan harga terbaru yang dikirim server; client tidak perlu mengirim apa pun balik. Pilihan paling sederhana?",
    options: {
      a: "WebSocket dua arah dengan protokol pesan buatan sendiri",
      b: "SSE lewat HTTP biasa dengan reconnect otomatis browser",
      c: "gRPC bidirectional streaming dengan klien gRPC-Web di browser",
      d: "Short polling setiap seratus milidetik dari semua browser",
    },
    answer: "b",
    explain: "Aliran satu arah server → client adalah kasus SSE: response HTTP biasa bertipe text/event-stream, dan EventSource di browser menyambung ulang sendiri setelah reconnection time (WHATWG HTML §9.2). WebSocket dan gRPC-Web menambah biaya untuk arah client → server yang tidak dibutuhkan.",
  },
  {
    id: "0020-02", lesson: "0020", topic: "rel-pagination", type: "mc",
    prompt: "Endpoint <code>GET /orders?offset=200000&amp;limit=20</code> makin lambat di halaman dalam. Kenapa, menurut dokumentasi PostgreSQL?",
    options: {
      a: "Index B-tree tidak bisa dipakai untuk kolom bertipe tanggal",
      b: "LIMIT memaksa database mengunci seluruh tabel selama query berjalan",
      c: "Response JSON yang besar membuat jaringan menjadi bottleneck utama",
      d: "Baris yang dilewati OFFSET tetap dihitung server sebelum dibuang",
    },
    answer: "d",
    explain: "PostgreSQL docs §7.6: \"The rows skipped by an OFFSET clause still have to be computed inside the server; therefore a large OFFSET might be inefficient.\" Offset 200.000 berarti 200.020 baris diproses untuk 20 baris yang dikirim.",
  },
  {
    id: "0020-03", lesson: "0020", topic: "rel-gaya-api", type: "mc",
    prompt: "Dua service internal saling memanggil ribuan kali per detik dan ingin kontrak yang ketat. Pilihan yang biasanya cocok?",
    options: {
      a: "gRPC dengan kontrak Protocol Buffers di atas HTTP/2",
      b: "SSE karena koneksinya satu arah dari server saja",
      c: "Long polling supaya setiap panggilan menunggu sampai siap",
      d: "WebSocket karena browser user perlu menerima push langsung",
    },
    answer: "a",
    explain: "gRPC memakai Protocol Buffers sebagai IDL (kontrak) sekaligus format pesan, dan berjalan di atas HTTP/2 (grpc.io: introduction, FAQ). Untuk panggilan service-to-service yang sering, kontrak yang di-generate dan format biner adalah keuntungannya. Browser butuh gRPC-Web, tapi di sini tidak ada browser.",
  },
  {
    id: "0020-04", lesson: "0020", topic: "rel-pagination", type: "mc",
    prompt: "Feed diurutkan terbaru dulu dan item baru masuk setiap detik. Kenapa cursor (<code>WHERE id &lt; :last_id</code>) lebih tepat dari offset?",
    options: {
      a: "Cursor membuat user bisa lompat langsung ke halaman mana pun",
      b: "Cursor tidak membutuhkan index apa pun pada kolom pengurutan data",
      c: "Halaman tidak bergeser saat item baru masuk, dan memakai index",
      d: "Cursor menyimpan seluruh hasil query di memori server untuk user",
    },
    answer: "c",
    explain: "Dengan offset, item baru di atas menggeser semua halaman sehingga user melihat duplikat. Cursor melanjutkan dari id terakhir, jadi stabil, dan WHERE id < :last_id ORDER BY id bisa langsung memakai index tanpa menghitung baris yang dilewati. Kekurangannya justru tidak bisa lompat ke halaman N.",
  },
  {
    id: "0020-05", lesson: "0020", topic: "rel-gaya-api", type: "mc",
    prompt: "Notifikasi baru untuk 1.000 user cukup terlihat dalam 30 detik. Apa langkah v1 paling murah?",
    options: {
      a: "Cluster WebSocket dengan sticky session di load balancer",
      b: "Polling REST tiap 30 detik, ±33 request/detik total",
      c: "Kafka plus gRPC streaming ke setiap aplikasi user",
      d: "Service push terpisah dengan database presence yang baru",
    },
    answer: "b",
    explain: "1.000 user ÷ 30 detik ≈ 33 request per detik, beban kecil untuk satu server. Koneksi persistent (WebSocket, streaming) baru dibenarkan kalau latency yang diminta di bawah beberapa detik atau polling mulai mendominasi beban.",
  },
  {
    id: "0020-oral-1", lesson: "0020", topic: "rel-gaya-api", type: "oral",
    prompt: "\"Kita membangun fitur chat dan halaman daftar order untuk aplikasi web. Gaya API apa yang Anda pakai untuk masing-masing, dan kenapa?\" (60 detik)",
    sample: "\"Untuk daftar order saya pakai REST: request-response biasa, method HTTP yang jelas, GET bisa di-cache, dan pagination pakai cursor supaya halaman tidak bergeser dan query tetap memakai index. Chat butuh dua arah dengan latency rendah, jadi WebSocket: satu koneksi untuk kirim dan terima. Kalau hanya perlu push satu arah, misalnya status pengiriman, SSE lebih sederhana karena HTTP biasa dan browser reconnect sendiri. gRPC saya simpan untuk komunikasi antar service internal, karena browser butuh gRPC-Web. Biayanya: WebSocket itu koneksi stateful, jadi load balancer dan deploy harus menangani koneksi panjang. Kalau user masih sedikit dan latency beberapa detik dapat diterima, polling REST cukup sebagai v1.\"",
    checklist: [
      "REST untuk request-response biasa seperti daftar order",
      "WebSocket untuk komunikasi dua arah latency rendah seperti chat",
      "SSE sebagai alternatif lebih sederhana untuk push satu arah",
      "gRPC cocok untuk service internal, browser butuh gRPC-Web",
      "pagination cursor (bukan offset besar) untuk daftar yang panjang",
      "biaya koneksi stateful dan polling sebagai v1 kalau angka mengizinkan",
    ],
  },
]);
