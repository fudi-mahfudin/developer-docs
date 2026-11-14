// Soal lesson 0010 (track Node.js, modul I/O & skala) · worker_threads vs cluster vs child_process. Format: assets/README.md.
// Sumber: Node.js v24 API docs (worker_threads, cluster, child_process).
QuestionBank.labelTopics({
  "io-worker-threads": "I/O & skala: worker_threads untuk pekerjaan CPU-bound",
  "io-cluster-proses": "I/O & skala: cluster, child_process, dan replika container",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban d b c a d.
QuestionBank.register([
  {
    id: "0010-01", lesson: "0010", topic: "io-worker-threads", type: "mc",
    prompt: "Endpoint membuat thumbnail gambar dengan library JavaScript murni, butuh 400 ms CPU per request. Request lain ikut lambat. Pilihan paling tepat?",
    options: {
      a: "Bungkus prosesnya dengan async/await supaya tidak lagi memblokir",
      b: "Naikkan UV_THREADPOOL_SIZE supaya kode JavaScript bisa jalan paralel",
      c: "Ganti semua fs sync menjadi async di endpoint",
      d: "Jalankan prosesnya di worker_threads, idealnya lewat pool worker",
    },
    answer: "d",
    explain: "Dokumentasi worker_threads: worker \"are useful for performing CPU-intensive JavaScript operations\". async/await tidak memindahkan kerja CPU dari thread utama. UV_THREADPOOL_SIZE hanya untuk operasi libuv (fs, crypto, zlib), bukan JavaScript Anda. Dokumentasi juga menyarankan pool karena membuat worker per tugas mahal.",
  },
  {
    id: "0010-02", lesson: "0010", topic: "io-cluster-proses", type: "mc",
    prompt: "API Node berjalan dengan <code>cluster</code> (8 worker) dan menyimpan session login di objek JavaScript biasa. User sering logout sendiri. Kenapa?",
    options: {
      a: "cluster menghapus memori worker setiap kali request selesai",
      b: "Setiap worker proses terpisah, session tidak terbagi bersama",
      c: "cluster hanya mendukung satu koneksi aktif per worker",
      d: "Objek JavaScript otomatis dibagi antar worker tapi terlambat",
    },
    answer: "b",
    explain: "Worker cluster adalah proses terpisah. Dokumentasi cluster: Node tidak menyediakan routing logic, jadi aplikasi jangan terlalu bergantung pada \"in-memory data objects for things like sessions and login\". Simpan session di luar proses (mis. Redis) atau pakai token.",
  },
  {
    id: "0010-03", lesson: "0010", topic: "io-worker-threads", type: "mc",
    prompt: "Apa yang <strong>bisa</strong> dilakukan <code>worker_threads</code> tetapi tidak bisa dilakukan <code>cluster</code> atau <code>child_process</code>?",
    options: {
      a: "Menjalankan JavaScript benar-benar paralel di beberapa core CPU",
      b: "Berbagi port HTTP yang sama antara banyak instance",
      c: "Berbagi memori lewat SharedArrayBuffer atau mentransfer sebuah ArrayBuffer",
      d: "Menjalankan program eksternal seperti ffmpeg atau git langsung",
    },
    answer: "c",
    explain: "Dokumentasi worker_threads: \"Unlike child_process or cluster, worker_threads can share memory\" lewat transfer ArrayBuffer atau SharedArrayBuffer. Ketiganya bisa memakai banyak core. Berbagi port adalah fitur cluster; menjalankan program lain adalah child_process.",
  },
  {
    id: "0010-04", lesson: "0010", topic: "io-cluster-proses", type: "mc",
    prompt: "Service perlu menjalankan <code>ffmpeg</code> untuk konversi video. Modul mana yang tepat, dan apa yang harus dihindari?",
    options: {
      a: "child_process.spawn berargumen array, hindari shell dengan input user",
      b: "worker_threads karena ffmpeg adalah library JavaScript yang berat",
      c: "cluster.fork karena setiap worker cluster bisa menjalankan ffmpeg",
      d: "child_process.exec dengan string gabungan dari input user langsung",
    },
    answer: "a",
    explain: "child_process menjalankan program lain. spawn/execFile tanpa shell menerima argumen sebagai array. Dokumentasi exec: \"Never pass unsanitized user input to this function\" karena dijalankan lewat shell, sehingga rawan command injection.",
  },
  {
    id: "0010-05", lesson: "0010", topic: "io-cluster-proses", type: "mc",
    prompt: "API Node di-deploy di Kubernetes. Kenapa tim memilih 4 replika container berproses tunggal, bukan 1 container dengan <code>cluster</code> 4 worker?",
    options: {
      a: "cluster tidak bisa berjalan di dalam container Linux",
      b: "Replika container otomatis berbagi memori di antara semuanya",
      c: "cluster selalu lebih lambat karena round-robin di primary",
      d: "Orkestrator sudah membagi beban, restart, dan scaling container",
    },
    answer: "d",
    explain: "Dokumentasi cluster: Node \"does not automatically manage the number of workers\"; aplikasi yang harus mengelolanya. Di Kubernetes, load balancing, health check, restart, dan autoscaling sudah dikerjakan per container. Satu proses per container lebih sederhana dan metrik per pod lebih jelas. cluster tetap berguna di VM tanpa orkestrator.",
  },
  {
    id: "0010-oral-1", lesson: "0010", topic: "io-worker-threads", type: "oral",
    prompt: "\"Kapan Anda memakai worker_threads, cluster, atau child_process?\" Jelaskan dalam 60 detik dengan satu contoh kasus untuk masing-masing.",
    sample: "Ketiganya untuk hal berbeda. worker_threads untuk pekerjaan CPU-bound di JavaScript, misalnya resize gambar atau parsing besar, supaya event loop tidak terblokir; worker satu proses dengan memori bisa dibagi lewat SharedArrayBuffer, dan saya pakai pool karena membuat worker mahal. Untuk I/O biasa worker tidak membantu karena I/O Node sudah asinkron. cluster menjalankan beberapa proses Node yang berbagi satu port, untuk memakai semua core di satu mesin; state seperti session harus di luar proses. Di Kubernetes saya lebih memilih beberapa replika container berproses tunggal karena orkestrator sudah menangani load balancing dan restart. child_process untuk menjalankan program lain seperti ffmpeg, dengan spawn dan argumen array, bukan exec dengan input user.",
    checklist: [
      "worker_threads untuk CPU-bound JavaScript, tidak membantu I/O",
      "worker berbagi memori (SharedArrayBuffer/transfer), sebaiknya lewat pool",
      "cluster = beberapa proses berbagi port untuk memakai semua core",
      "state (session) tidak terbagi antar proses cluster",
      "di container/Kubernetes lebih suka replika ketimbang cluster",
      "child_process untuk program eksternal, hindari exec dengan input user",
    ],
  },
]);
