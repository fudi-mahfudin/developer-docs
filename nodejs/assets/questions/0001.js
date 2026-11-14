// Soal lesson 0001 (track Node.js, modul Runtime): anatomi Node (V8, binding C++, libuv), I/O-bound vs CPU-bound.
// Sumber: Node.js Learn (Introduction, Blocking vs Non-Blocking), v8.dev, libuv Design overview. Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "runtime-anatomi": "Runtime: V8, binding C++, dan libuv",
  "runtime-io-vs-cpu": "Runtime: I/O-bound vs CPU-bound",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0001-01", lesson: "0001", topic: "runtime-anatomi", type: "mc",
    prompt: "Komponen Node mana yang menyediakan <strong>event loop</strong> dan <strong>thread pool</strong>?",
    options: {
      a: "V8, engine yang menjalankan JavaScript",
      b: "libuv, library untuk I/O asinkron",
      c: "npm, pengelola paket bawaan Node",
      d: "Express, framework HTTP paling populer",
    },
    answer: "b",
    explain: "libuv adalah library lintas platform yang awalnya ditulis untuk Node, dirancang di sekitar I/O asinkron berbasis event (libuv Design overview). Isinya event loop dan thread pool. V8 hanya menjalankan JavaScript.",
  },
  {
    id: "0001-02", lesson: "0001", topic: "runtime-io-vs-cpu", type: "mc",
    prompt: "Request butuh 50 ms; 45 ms di antaranya menunggu database secara asinkron. Apa yang dilakukan thread JavaScript selama 45 ms itu?",
    options: {
      a: "Ikut menunggu sampai jawaban database tiba",
      b: "Membuat thread baru untuk request berikutnya",
      c: "Mengirim ulang query supaya lebih cepat",
      d: "Menjalankan callback dari request yang lain",
    },
    answer: "d",
    explain: "Node.js Learn (Blocking vs Non-Blocking): operasi non-blocking membebaskan 45 ms itu untuk melayani request lain. Node tidak membuat thread baru per request; satu thread JS bergantian menjalankan callback.",
  },
  {
    id: "0001-03", lesson: "0001", topic: "runtime-anatomi", type: "mc",
    prompt: "Di Node, I/O <strong>jaringan</strong> (socket, HTTP) ditunggu oleh siapa?",
    options: {
      a: "Mekanisme polling OS seperti epoll atau kqueue",
      b: "Thread JavaScript yang berhenti di setiap <code>await</code>",
      c: "Satu thread baru yang dibuat per koneksi",
      d: "Garbage collector V8 yang memantau semua socket",
    },
    answer: "a",
    explain: "libuv Design overview: socket dipantau dengan mekanisme terbaik di platform itu (epoll di Linux, kqueue di macOS, IOCP di Windows), dari satu thread milik loop. Thread pool dipakai untuk I/O file, bukan jaringan.",
  },
  {
    id: "0001-04", lesson: "0001", topic: "runtime-io-vs-cpu", type: "mc",
    prompt: "Endpoint baru me-resize gambar 20 MB langsung di handler. Apa akibatnya pada server Node?",
    options: {
      a: "Hanya request resize itu yang lambat, lainnya normal",
      b: "Node otomatis memindahkannya ke dalam thread pool libuv",
      c: "Semua request lain ikut menunggu sampai hitungan selesai",
      d: "V8 memecah hitungan ke beberapa core secara otomatis",
    },
    answer: "c",
    explain: "Resize gambar adalah pekerjaan CPU-bound. Eksekusi JavaScript single-threaded, jadi selama hitungan berjalan tidak ada callback lain yang bisa jalan. Pindahkan ke worker_threads atau proses lain (lesson 0010).",
  },
  {
    id: "0001-oral-1", lesson: "0001", topic: "runtime-anatomi", type: "oral",
    prompt: "\"Node itu single-threaded. Bagaimana ia bisa melayani ribuan request bersamaan, dan kapan Node bukan pilihan yang baik?\" (90 detik)",
    sample: "Yang single-threaded adalah eksekusi JavaScript-nya. Node terdiri dari V8 yang menjalankan JS, libuv yang menyediakan event loop dan thread pool, dan binding C++ yang menghubungkan API seperti fs atau net ke libuv. Saat handler menunggu database, thread JS tidak ikut menunggu. I/O jaringan dipantau OS lewat epoll, kqueue, atau IOCP, dan I/O file dikerjakan thread pool libuv. Begitu hasilnya siap, callback dijadwalkan ke event loop. Jadi kalau 45 dari 50 ms request adalah menunggu database, waktu itu dipakai untuk request lain. Itu sebabnya Node cocok untuk API yang I/O-bound. Kebalikannya, pekerjaan CPU-bound seperti encode video atau hashing berat menahan satu-satunya thread JS, jadi semua request lain ikut menunggu. Pekerjaan seperti itu dipindah ke worker thread atau proses terpisah.",
    checklist: [
      "yang single-threaded adalah eksekusi JavaScript, bukan seluruh proses",
      "V8 menjalankan JavaScript, libuv menyediakan event loop dan thread pool",
      "binding C++ menghubungkan API Node ke libuv dan sistem operasi",
      "I/O jaringan dipantau OS (epoll/kqueue/IOCP), I/O file lewat thread pool",
      "waktu menunggu I/O dipakai melayani request lain, jadi cocok untuk I/O-bound",
      "CPU-bound memblokir semua request, dan solusinya worker thread atau proses lain",
    ],
  },
]);
