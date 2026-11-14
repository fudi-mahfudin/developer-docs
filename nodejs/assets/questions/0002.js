// Soal lesson 0002 (track Node.js, modul Runtime): fase event loop, setTimeout vs setImmediate.
// Sumber: Node.js Learn "The Node.js Event Loop", libuv Design overview, Node.js v24 API Timers. Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "runtime-fase-loop": "Runtime: fase event loop",
  "runtime-timeout-vs-immediate": "Runtime: setTimeout vs setImmediate",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0002-01", lesson: "0002", topic: "runtime-fase-loop", type: "mc",
    prompt: "Di fase event loop mana callback <code>setImmediate()</code> dijalankan?",
    options: {
      a: "timers",
      b: "poll",
      c: "idle/prepare",
      d: "check",
    },
    answer: "d",
    explain: "Node.js Learn: fase check menjalankan callback setImmediate(). Fase ini tepat setelah poll, jadi setImmediate berarti \"jalankan begitu poll selesai\".",
  },
  {
    id: "0002-02", lesson: "0002", topic: "runtime-timeout-vs-immediate", type: "mc",
    prompt: "Di <strong>main module</strong>, <code>setTimeout(a, 0)</code> lalu <code>setImmediate(b)</code>. Mana yang jalan duluan?",
    options: {
      a: "Tidak deterministik, bergantung performa proses saat itu",
      b: "Selalu <code>a</code>, karena ia dijadwalkan lebih dulu",
      c: "Selalu <code>b</code>, karena check mendahului fase timers",
      d: "Keduanya berjalan bersamaan di dua thread berbeda",
    },
    answer: "a",
    explain: "Node.js Learn: dari main module, urutannya \"bound by the performance of the process\". Delay 0 menjadi 1 ms; kalau 1 ms sudah lewat saat loop masuk timers, a duluan, kalau belum, b duluan.",
  },
  {
    id: "0002-03", lesson: "0002", topic: "runtime-fase-loop", type: "mc",
    prompt: "Server Node sedang sepi: tidak ada timer jatuh tempo dan tidak ada <code>setImmediate</code>. Di fase mana proses menunggu koneksi baru?",
    options: {
      a: "timers",
      b: "check",
      c: "poll",
      d: "idle/prepare",
    },
    answer: "c",
    explain: "Node.js Learn: fase poll mengambil event I/O baru dan \"node will block here when appropriate\". libuv menyebut langkah ini \"block for I/O\".",
  },
  {
    id: "0002-04", lesson: "0002", topic: "runtime-timeout-vs-immediate", type: "mc",
    prompt: "Di dalam callback <code>fs.readFile</code>, <code>setTimeout(a, 0)</code> lalu <code>setImmediate(b)</code>. Mana yang jalan duluan?",
    options: {
      a: "Tidak deterministik, sama seperti di main module",
      b: "Selalu <code>b</code>, karena check tepat setelah poll",
      c: "Selalu <code>a</code>, karena delay nol berarti segera",
      d: "Selalu <code>a</code>, karena timer selalu lebih diprioritaskan",
    },
    answer: "b",
    explain: "Callback I/O berjalan di poll. Fase berikutnya adalah check, jadi setImmediate selalu jalan sebelum timer apa pun (Node.js Learn, \"setImmediate() vs setTimeout()\"). Timer baru jalan di fase timers putaran berikutnya.",
  },
  {
    id: "0002-oral-1", lesson: "0002", topic: "runtime-fase-loop", type: "oral",
    prompt: "\"Jelaskan fase event loop Node. Mana yang jalan duluan, <code>setTimeout(fn, 0)</code> atau <code>setImmediate(fn)</code>?\" (90 detik)",
    sample: "Satu putaran event loop punya fase berurutan: timers untuk setTimeout dan setInterval, pending callbacks untuk callback I/O yang ditunda, idle/prepare yang internal, poll untuk mengambil event I/O baru dan menjalankan callback-nya, di sini juga Node menunggu kalau tidak ada kerjaan, lalu check untuk setImmediate, dan close callbacks untuk event close. Soal mana yang duluan: bergantung konteks. Di main module urutannya tidak deterministik, karena delay 0 sebenarnya 1 ms dan bergantung apakah 1 ms itu sudah lewat saat loop masuk fase timers. Tapi kalau keduanya dipanggil di dalam callback I/O, setImmediate selalu duluan, karena callback I/O berjalan di poll dan fase sesudahnya adalah check, sedangkan timers baru di putaran berikutnya.",
    checklist: [
      "urutan fase: timers → pending callbacks → poll → check → close callbacks",
      "setTimeout/setInterval di timers, setImmediate di check",
      "callback I/O di poll, dan Node menunggu di poll kalau tidak ada pekerjaan",
      "di main module urutan setTimeout 0 vs setImmediate tidak deterministik",
      "alasannya: delay 0 menjadi 1 ms, bergantung apakah sudah lewat saat masuk timers",
      "di dalam callback I/O, setImmediate selalu duluan karena check tepat setelah poll",
    ],
  },
]);
