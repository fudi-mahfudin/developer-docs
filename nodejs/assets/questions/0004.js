// Soal lesson 0004 (track Node.js, modul Runtime): libuv thread pool, hal yang memblokir event loop, event loop delay.
// Sumber: Node.js v24 API (CLI UV_THREADPOOL_SIZE, DNS, perf_hooks), libuv Thread pool, Node.js Learn "Don't Block the Event Loop". Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "runtime-thread-pool": "Runtime: libuv thread pool dan UV_THREADPOOL_SIZE",
  "runtime-blocking": "Runtime: memblokir event loop dan event loop delay",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0004-01", lesson: "0004", topic: "runtime-thread-pool", type: "mc",
    prompt: "Operasi mana yang <strong>tidak</strong> memakai thread pool libuv?",
    options: {
      a: "<code>fs.readFile</code>",
      b: "<code>dns.lookup</code>",
      c: "<code>crypto.pbkdf2</code>",
      d: "<code>socket.write</code>",
    },
    answer: "d",
    explain: "Node.js v24 CLI (UV_THREADPOOL_SIZE): thread pool dipakai fs, crypto asinkron (pbkdf2, scrypt, randomBytes, ...), dns.lookup, dan zlib. I/O socket (mis. socket.write) dipantau OS lewat epoll/kqueue/IOCP (libuv Design overview), bukan thread pool.",
  },
  {
    id: "0004-02", lesson: "0004", topic: "runtime-blocking", type: "mc",
    prompt: "Handler menerima body JSON 50 MB lalu memanggil <code>JSON.parse</code>. Apa akibatnya bagi request lain?",
    options: {
      a: "Mereka ikut menunggu, karena parse berjalan di thread JavaScript",
      b: "Tidak ada, karena parse otomatis berjalan di thread pool",
      c: "Tidak ada, karena V8 selalu mem-parse JSON secara paralel",
      d: "Mereka ditolak dengan status 503 oleh Node secara otomatis",
    },
    answer: "a",
    explain: "Node.js Learn (Don't Block the Event Loop): JSON.parse dan JSON.stringify O(n) dan berjalan di event loop; contoh resminya parse string 50 MB butuh ±1,3 detik. Selama itu tidak ada callback lain yang jalan.",
  },
  {
    id: "0004-03", lesson: "0004", topic: "runtime-thread-pool", type: "mc",
    prompt: "Ukuran default thread pool libuv adalah 4. Cara yang <strong>dijamin</strong> bekerja untuk menaikkannya?",
    options: {
      a: "Set <code>process.env.UV_THREADPOOL_SIZE</code> di baris paling pertama file <code>main.js</code>",
      b: "Panggil <code>require('node:os').setThreads(8)</code> saat aplikasi Node baru mulai berjalan",
      c: "Jalankan <code>UV_THREADPOOL_SIZE=8 node main.js</code> dari shell atau container",
      d: "Tambahkan flag <code>--max-old-space-size=8</code> saat menjalankan aplikasi Node tersebut",
    },
    answer: "c",
    explain: "Node.js v24 CLI: set dari dalam proses lewat process.env \"is not guaranteed to work\" karena pool sudah dibuat saat runtime diinisialisasi. Set environment variable sebelum proses mulai. Maksimum absolut 1024 (libuv). --max-old-space-size mengatur heap V8, bukan thread pool.",
  },
  {
    id: "0004-04", lesson: "0004", topic: "runtime-blocking", type: "mc",
    prompt: "Cara mengukur apakah event loop sering terblokir di produksi?",
    options: {
      a: "Pantau jumlah thread proses Node lewat perintah <code>top</code>",
      b: "Pantau nilai persentil p99 dari <code>perf_hooks.monitorEventLoopDelay()</code> secara berkala",
      c: "Hitung jumlah callback <code>setImmediate</code> yang dijadwalkan per detik",
      d: "Pantau ukuran heap V8 lewat <code>process.memoryUsage()</code> setiap menit",
    },
    answer: "b",
    explain: "Node.js v24 perf_hooks: monitorEventLoopDelay() membuat histogram event loop delay (dalam nanodetik) dengan percentile, mean, max. p99 yang naik menandakan ada callback yang memblokir. Ukuran heap mengukur memori, bukan blocking.",
  },
  {
    id: "0004-oral-1", lesson: "0004", topic: "runtime-blocking", type: "oral",
    prompt: "\"API Node Anda tiba-tiba lambat untuk <em>semua</em> endpoint, padahal database sehat. Apa saja kemungkinan penyebabnya di sisi Node, dan bagaimana Anda membuktikannya?\" (2 menit)",
    sample: "Kalau semua endpoint ikut lambat, curiga pertama event loop terblokir, karena JavaScript berjalan di satu thread. Penyebab umumnya: sync API di handler seperti readFileSync atau pbkdf2Sync, JSON.parse atau stringify payload yang sangat besar, regex rentan ReDoS pada input user, atau hitungan CPU berat. Kemungkinan kedua thread pool libuv penuh. Ukurannya default 4, dan dipakai fs, dns.lookup, crypto asinkron seperti pbkdf2, dan zlib. Kalau hashing password memenuhi pool, baca file dan dns.lookup ikut antre. Untuk membuktikan, saya ukur event loop delay dengan monitorEventLoopDelay dari perf_hooks dan lihat p99-nya. Kalau tinggi, profiling CPU untuk menemukan fungsinya. Perbaikannya: ganti ke API asinkron, batasi ukuran body, perbaiki regex, pindahkan hitungan ke worker thread, atau naikkan UV_THREADPOOL_SIZE lewat environment sebelum proses mulai.",
    checklist: [
      "semua endpoint lambat menandakan event loop terblokir (satu thread JS)",
      "minimal dua penyebab blocking: sync API, JSON.parse besar, regex ReDoS, hitungan CPU",
      "thread pool libuv default 4, dipakai fs, dns.lookup, crypto, zlib",
      "pool penuh membuat API lain yang tidak berhubungan ikut antre",
      "mengukur dengan monitorEventLoopDelay (p99/max), lalu profiling CPU",
      "perbaikan: API asinkron, worker thread, atau UV_THREADPOOL_SIZE sebelum proses mulai",
    ],
  },
]);
