// Soal lesson 0011 (track Node.js, modul I/O & skala) · Memory leak dan profiling. Format: assets/README.md.
// Sumber: Node.js v24 API docs (cli, v8, events), Node.js Learn (memory, heap snapshot), V8 blog "Trash talk".
QuestionBank.labelTopics({
  "io-memory-leak": "I/O & skala: heap V8 dan sumber memory leak",
  "io-profiling": "I/O & skala: heap snapshot, --inspect, --cpu-prof",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban a c b d c.
QuestionBank.register([
  {
    id: "0011-01", lesson: "0011", topic: "io-memory-leak", type: "mc",
    prompt: "Middleware menyimpan hasil query di <code>const cache = new Map()</code> level modul dengan key berupa URL lengkap, tanpa batas dan tanpa TTL. Memori naik terus selama berhari-hari. Kenapa?",
    options: {
      a: "Map global selalu terjangkau, jadi entrinya tidak pernah di-GC",
      b: "Map otomatis menyalin setiap nilai ke heap old space",
      c: "GC V8 tidak pernah berjalan untuk variabel level modul",
      d: "Key berupa string panjang selalu disimpan di luar heap",
    },
    answer: "a",
    explain: "GC hanya membebaskan objek yang tidak lagi terjangkau dari root. Map di scope modul hidup selama proses hidup, jadi setiap entri yang ditambahkan tetap terjangkau. Dengan key unik per URL (query string berbeda), Map tumbuh tanpa batas. Solusi: batas ukuran (LRU) dan TTL, atau cache di luar proses.",
  },
  {
    id: "0011-02", lesson: "0011", topic: "io-profiling", type: "mc",
    prompt: "Anda ingin mengambil heap snapshot dari proses produksi. Risiko apa yang disebut dokumentasi Node?",
    options: {
      a: "Snapshot hanya bisa diambil kalau proses dijalankan dengan --cpu-prof",
      b: "Snapshot otomatis mengirim data heap ke server milik Chrome",
      c: "Snapshot memblokir event loop dan butuh memori dua kali",
      d: "Snapshot menghapus semua objek yang tidak terjangkau dari heap",
    },
    answer: "c",
    explain: "Dokumentasi v8.writeHeapSnapshot(): membuat snapshot \"requires memory about twice the size of the heap\" dan merupakan \"synchronous operation which blocks the event loop\". Node.js Learn menyarankan hanya mengambilnya dari proses yang boleh crash tanpa mengganggu availability.",
  },
  {
    id: "0011-03", lesson: "0011", topic: "io-memory-leak", type: "mc",
    prompt: "Log produksi menampilkan <code>MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 listeners added</code>. Penyebab paling mungkin?",
    options: {
      a: "Node sudah menolak listener ke-11 sehingga event tidak terkirim",
      b: "Kode menambah listener di setiap request tanpa pernah melepasnya",
      c: "EventEmitter hanya boleh punya sepuluh event berbeda per instance",
      d: "Garbage collector gagal berjalan karena terlalu banyak listener aktif",
    },
    answer: "b",
    explain: "Dokumentasi events: secara default maksimal 10 listener per event sebelum peringatan. Ini bukan batas keras; listener tetap ditambahkan, tapi Node mencetak peringatan \"possible EventEmitter memory leak\". Pola umum: emitter jangka panjang (mis. koneksi DB) diberi .on() di setiap request tanpa removeListener/once.",
  },
  {
    id: "0011-04", lesson: "0011", topic: "io-profiling", type: "mc",
    prompt: "Endpoint lambat karena CPU, bukan karena memori. Alat mana yang paling langsung menunjukkan fungsi mana yang memakan waktu?",
    options: {
      a: "--max-old-space-size untuk memperbesar batas memori heap V8 milik proses",
      b: "Heap snapshot untuk membandingkan jumlah objek di heap V8",
      c: "--heapsnapshot-signal untuk menulis heap saat sinyal OS diterima proses",
      d: "--cpu-prof untuk merekam profil CPU lalu dibuka di DevTools",
    },
    answer: "d",
    explain: "--cpu-prof menjalankan V8 CPU profiler sejak start dan menulis file .cpuprofile saat proses keluar (stabil sejak Node 22.4/20.16). File itu dibuka di tab Performance Chrome DevTools. Heap snapshot dan --heapsnapshot-signal untuk masalah memori; --max-old-space-size hanya mengubah batas heap.",
  },
  {
    id: "0011-05", lesson: "0011", topic: "io-memory-leak", type: "mc",
    prompt: "Apa efek <code>node --max-old-space-size=1536 app.js</code>?",
    options: {
      a: "Membatasi total memori proses termasuk Buffer, 1536 MiB",
      b: "Membuat GC berjalan setiap 1536 milidetik secara tetap",
      c: "Membatasi old space heap V8 sekitar 1536 MiB",
      d: "Memesan 1536 MiB memori langsung saat proses dimulai",
    },
    answer: "c",
    explain: "Dokumentasi CLI: flag ini \"Sets the max memory size of V8's old memory section\" dalam MiB; mendekati batas, V8 makin sering GC. Contoh di dokumentasi: mesin 2 GiB → 1536 supaya ada sisa memori. Buffer berada di luar heap V8 dan tidak dihitung di sini.",
  },
  {
    id: "0011-oral-1", lesson: "0011", topic: "io-profiling", type: "oral",
    prompt: "\"Memori API Node Anda naik terus sampai container di-OOM-kill setiap dua hari. Bagaimana Anda mencari penyebabnya?\" Jelaskan langkahnya dalam 90 detik.",
    sample: "Pertama saya pastikan memang leak: grafik heapUsed yang naik terus walau trafik datar, bukan sekadar heap yang besar. Lalu saya reproduksi di staging. Saya jalankan dengan --inspect yang hanya terbuka di localhost, biarkan aplikasi selesai startup, pakai fitur yang dicurigai, ambil heap snapshot pertama, pakai lagi beberapa saat, ambil snapshot kedua, lalu bandingkan di mode Comparison di Chrome DevTools dan cari delta positif terbesar beserta retainer-nya. Di produksi bisa pakai --heapsnapshot-signal atau --heapsnapshot-near-heap-limit, tapi snapshot memblokir event loop dan butuh memori sekitar dua kali heap, jadi hanya di instance yang boleh mati. Tersangka umum: cache global tanpa batas, listener yang ditambah per request, closure yang menahan objek besar, timer yang tidak di-clear. --max-old-space-size hanya menunda crash, bukan solusi.",
    checklist: [
      "membuktikan leak dengan tren memori (heapUsed naik walau trafik datar)",
      "--inspect (hanya localhost) + Chrome DevTools tab Memory",
      "dua heap snapshot lalu mode Comparison, cari delta dan retainer",
      "risiko snapshot di produksi: blok event loop, butuh ±2x memori heap",
      "menyebut tersangka umum: cache global, listener, closure, timer",
      "--max-old-space-size hanya menunda, bukan memperbaiki leak",
    ],
  },
]);
