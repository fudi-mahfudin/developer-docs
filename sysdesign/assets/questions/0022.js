// Soal lesson 0022 (track System Design, modul Reliabilitas & API) · Timeout, retry + backoff + jitter, circuit breaker, bulkhead. Format: assets/README.md.
// Sumber: gRPC guide Deadlines, AWS Builders' Library "Timeouts, retries, and backoff with jitter", RFC 9110 §9.2.2, Google SRE Book ch. 22, Azure Architecture Center (Circuit Breaker, Bulkhead).
QuestionBank.labelTopics({
  "rel-timeout-retry": "Reliabilitas & API: timeout, retry, exponential backoff + jitter",
  "rel-circuit-breaker": "Reliabilitas & API: circuit breaker dan bulkhead",
});

QuestionBank.register([
  {
    id: "0022-01", lesson: "0022", topic: "rel-timeout-retry", type: "mc",
    prompt: "Client gRPC memanggil service tanpa mengatur deadline. Apa yang terjadi kalau server macet, menurut dokumentasi gRPC?",
    options: {
      a: "Client bisa menunggu response nyaris selamanya",
      b: "gRPC membatalkan panggilan setelah lima detik",
      c: "Server mengirim 429 lalu menutup koneksinya",
      d: "Load balancer memindahkan panggilan ke replica",
    },
    answer: "a",
    explain: "Panduan Deadlines gRPC: secara default gRPC tidak memasang deadline, jadi client bisa menunggu response \"effectively forever\". Karena itu selalu pasang deadline yang realistis. Hal yang sama berlaku untuk HTTP client dan driver database: cek default timeout-nya.",
  },
  {
    id: "0022-02", lesson: "0022", topic: "rel-circuit-breaker", type: "mc",
    prompt: "Circuit breaker sedang <em>Open</em> dan timer-nya habis. Apa yang terjadi berikutnya, menurut pola Azure?",
    options: {
      a: "Semua request langsung dibuka kembali ke service",
      b: "Breaker tetap Open sampai operator me-reset manual",
      c: "Half-Open: sebagian kecil request dicoba sebagai uji",
      d: "Request diarahkan ke cache sebagai jawaban permanen",
    },
    answer: "c",
    explain: "Azure Circuit Breaker pattern: saat timer habis, breaker pindah ke Half-Open dan hanya sejumlah kecil request diizinkan lewat. Kalau berhasil, kembali ke Closed dan counter di-reset; kalau ada yang gagal, kembali ke Open. Half-Open mencegah service yang baru pulih langsung dibanjiri request.",
  },
  {
    id: "0022-03", lesson: "0022", topic: "rel-timeout-retry", type: "mc",
    prompt: "Lima layer service saling memanggil, setiap layer mencoba 3 kali, dan database mulai gagal. Berapa kali lipat beban ke database, menurut AWS?",
    options: {
      a: "Tiga kali lipat",
      b: "243 kali lipat",
      c: "Lima belas kali",
      d: "Lima kali lipat",
    },
    answer: "b",
    explain: "AWS Builders' Library: retry di setiap layer saling mengalikan, 3 × 3 × 3 × 3 × 3 = 3⁵ = 243. Karena itu retry dipasang di satu layer saja, dibatasi jumlahnya (SRE Book: retry budget per proses), dan memakai backoff.",
  },
  {
    id: "0022-04", lesson: "0022", topic: "rel-circuit-breaker", type: "mc",
    prompt: "Panggilan ke service rekomendasi yang lambat menghabiskan semua koneksi, sehingga checkout ikut macet. Pola mana yang langsung mencegah ini?",
    options: {
      a: "Retry tanpa batas sampai rekomendasi akhirnya pulih",
      b: "Cache response checkout di CDN selama sejam",
      c: "Menaikkan timeout rekomendasi menjadi enam puluh detik",
      d: "Bulkhead: pool koneksi terpisah untuk setiap dependency",
    },
    answer: "d",
    explain: "Azure Bulkhead pattern: beri setiap dependency connection pool sendiri, sehingga dependency yang gagal hanya menghabiskan pool miliknya, dan panggilan ke service lain tetap jalan. Namanya dari sekat lambung kapal: hanya satu ruang yang kebanjiran. Retry tanpa batas dan timeout panjang justru memperparah.",
  },
  {
    id: "0022-05", lesson: "0022", topic: "rel-timeout-retry", type: "mc",
    prompt: "Mana operasi yang <strong>tidak</strong> aman di-retry otomatis tanpa idempotency key?",
    options: {
      a: "<code>POST /payments</code> yang menagih kartu kredit user",
      b: "<code>GET /orders/42</code> untuk membaca detail satu order",
      c: "<code>PUT /users/7/email</code> yang mengganti alamat email user",
      d: "<code>DELETE /carts/9</code> yang menghapus keranjang belanja user",
    },
    answer: "a",
    explain: "RFC 9110 §9.2.2: PUT, DELETE, dan method aman seperti GET idempotent; POST tidak. AWS: timeout tidak berarti efek samping belum terjadi, jadi API dengan efek samping tidak aman di-retry kecuali idempotent. Mengulang POST /payments bisa menagih dua kali.",
  },
  {
    id: "0022-oral-1", lesson: "0022", topic: "rel-timeout-retry", type: "oral",
    prompt: "\"Service checkout memanggil payment gateway yang kadang lambat atau gagal. Bagaimana Anda membuat panggilan itu tahan gangguan tanpa memperparah masalah?\" (60 detik)",
    sample: "\"Pertama timeout: tanpa timeout thread menunggu selamanya. Saya ambil dari latency payment gateway, misalnya sedikit di atas p99.9-nya. Kedua retry, tapi hanya untuk error sementara dan hanya karena request membawa idempotency key, karena POST pembayaran tidak idempotent dan timeout tidak berarti tagihan gagal. Retry pakai exponential backoff dengan jitter, misalnya 100, 200, 400 milidetik yang diacak, supaya client tidak mengulang serentak, dan dibatasi tiga kali di satu layer saja, karena retry di lima layer bisa melipatgandakan beban 243 kali. Ketiga circuit breaker: kalau error rate melewati ambang, breaker Open dan checkout langsung gagal cepat atau menawarkan 'coba lagi nanti', lalu Half-Open untuk uji. Terakhir bulkhead: pool koneksi terpisah untuk payment supaya endpoint lain tidak ikut macet. Timeout dan retry terbatas itu murah dan wajib; breaker dan bulkhead saya tambah kalau dependency ini terbukti bisa menyeret seluruh service.\"",
    checklist: [
      "timeout berdasarkan latency dependency (misalnya p99/p99.9)",
      "retry hanya untuk operasi idempotent atau dengan idempotency key",
      "exponential backoff dengan jitter supaya retry tidak serentak",
      "batas retry di satu layer, karena retry berlapis saling mengalikan",
      "circuit breaker: Closed, Open, Half-Open untuk gagal cepat",
      "bulkhead atau pool terpisah, ditambahkan karena ada risiko yang terukur",
    ],
  },
]);
