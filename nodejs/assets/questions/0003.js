// Soal lesson 0003 (track Node.js, modul Runtime): process.nextTick vs microtask (Promise, queueMicrotask), starvation.
// Sumber: Node.js v24 API process (nextTick, queueMicrotask vs nextTick), Node.js Learn "The Node.js Event Loop", ECMAScript Jobs. Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "runtime-nexttick-microtask": "Runtime: process.nextTick vs microtask",
  "runtime-starvation": "Runtime: starvation oleh nextTick dan microtask",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0003-01", lesson: "0003", topic: "runtime-nexttick-microtask", type: "mc",
    prompt: "Modul CommonJS: <code>Promise.resolve().then(p)</code>, lalu <code>process.nextTick(t)</code>, lalu <code>setTimeout(s, 0)</code>. Urutan jalannya?",
    options: {
      a: "<code>p</code>, <code>t</code>, <code>s</code>",
      b: "<code>s</code>, <code>t</code>, <code>p</code>",
      c: "<code>t</code>, <code>p</code>, <code>s</code>",
      d: "<code>p</code>, <code>s</code>, <code>t</code>",
    },
    answer: "c",
    explain: "Node.js v24 API process: setiap kali next tick queue habis, microtask queue langsung dikosongkan sesudahnya, jadi t lalu p. Timer s baru jalan di fase timers.",
  },
  {
    id: "0003-02", lesson: "0003", topic: "runtime-starvation", type: "mc",
    prompt: "Callback <code>process.nextTick</code> terus menjadwalkan <code>process.nextTick</code> lagi tanpa henti. Apa akibatnya?",
    options: {
      a: "Loop tidak pernah sampai ke fase poll, I/O kelaparan",
      b: "Node otomatis memindahkan sisanya ke dalam fase check berikutnya",
      c: "V8 melempar error stack overflow setelah beberapa ribu panggilan",
      d: "Timer tetap berjalan tepat waktu karena punya thread sendiri",
    },
    answer: "a",
    explain: "Node.js Learn: rekursi process.nextTick bisa \"starve\" I/O karena mencegah event loop mencapai fase poll. Bukan stack overflow: setiap callback berjalan setelah stack kosong, dari antrean.",
  },
  {
    id: "0003-03", lesson: "0003", topic: "runtime-nexttick-microtask", type: "mc",
    prompt: "Di <strong>top-level modul ESM</strong> (Node 24), <code>process.nextTick(t)</code> lalu <code>queueMicrotask(q)</code>. Mana yang jalan duluan?",
    options: {
      a: "Selalu <code>t</code>, sama persis seperti di CommonJS",
      b: "Tidak deterministik, bergantung performa proses saat itu",
      c: "Keduanya berjalan bersamaan di thread yang berbeda",
      d: "<code>q</code>, karena ESM berjalan di microtask queue",
    },
    answer: "d",
    explain: "Node.js v24 API process: modul ESM diproses sebagai bagian dari microtask queue, jadi callback queueMicrotask() selalu jalan sebelum process.nextTick(). Di CommonJS kebalikannya.",
  },
  {
    id: "0003-04", lesson: "0003", topic: "runtime-starvation", type: "mc",
    prompt: "Anda ingin memecah pekerjaan panjang menjadi potongan, dan memberi giliran ke I/O di antara potongan. Jadwalkan potongan berikutnya dengan apa?",
    options: {
      a: "<code>process.nextTick</code>",
      b: "<code>setImmediate</code>",
      c: "<code>queueMicrotask</code>",
      d: "<code>Promise.resolve().then</code>",
    },
    answer: "b",
    explain: "setImmediate berjalan di fase check, setelah poll, jadi I/O sempat diproses. nextTick dan microtask dikosongkan sampai habis sebelum loop lanjut, jadi tidak memberi giliran ke I/O.",
  },
  {
    id: "0003-oral-1", lesson: "0003", topic: "runtime-nexttick-microtask", type: "oral",
    prompt: "\"Apa beda <code>process.nextTick</code>, <code>Promise.then</code>, dan <code>setTimeout(fn, 0)</code>? Kapan masing-masing berjalan?\" (90 detik)",
    sample: "Ketiganya menunda fungsi, tapi ke antrean yang berbeda. process.nextTick masuk next tick queue, yang dikosongkan seluruhnya begitu operasi JavaScript yang sedang berjalan selesai, sebelum event loop lanjut. Promise.then dan queueMicrotask masuk microtask queue, yang di Node dikosongkan tepat setelah next tick queue. setTimeout 0 adalah timer: baru jalan saat loop masuk fase timers, minimal 1 ms kemudian. Jadi di CommonJS urutannya sinkron, nextTick, Promise, lalu timer. Pengecualiannya di top-level ESM, Promise jalan sebelum nextTick karena modul ESM sendiri sudah berjalan di dalam microtask queue. Risikonya: karena antrean itu dikosongkan sampai habis, nextTick atau microtask rekursif bisa membuat I/O starvation. Untuk kode biasa queueMicrotask lebih disarankan, dan kalau mau memberi giliran ke I/O, pakai setImmediate.",
    checklist: [
      "nextTick queue dikosongkan setelah operasi JS saat ini, sebelum loop lanjut",
      "Promise.then dan queueMicrotask masuk microtask queue, dikosongkan setelah nextTick queue",
      "setTimeout 0 berjalan di fase timers, minimal 1 ms, setelah kedua antrean",
      "urutan CommonJS: sinkron → nextTick → Promise → timer",
      "pengecualian ESM: di top-level, Promise/queueMicrotask jalan sebelum nextTick",
      "nextTick atau microtask rekursif menyebabkan starvation; setImmediate memberi giliran ke I/O",
    ],
  },
]);
