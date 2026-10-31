// Soal lesson 0005 (track System Design, modul Skalabilitas) · Vertical vs horizontal scaling; stateless service. Format: assets/README.md.
// Sumber: Azure Architecture Center (Autoscaling; Design to scale out), Redis docs (session store), RFC 7519 (JWT).
QuestionBank.labelTopics({
  "skala-vertical-horizontal": "Skalabilitas: vertical vs horizontal scaling",
  "skala-stateless": "Skalabilitas: stateless service dan session",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban b d a c b.
QuestionBank.register([
  {
    id: "0005-01", lesson: "0005", topic: "skala-vertical-horizontal", type: "mc",
    prompt: "Apa beda <strong>vertical</strong> dan <strong>horizontal</strong> scaling?",
    options: {
      a: "Vertical menambah jumlah server, horizontal memperbesar satu server",
      b: "Vertical memperbesar satu server, horizontal menambah jumlah server",
      c: "Vertical untuk database saja, horizontal untuk app server",
      d: "Vertical memakai cloud, horizontal memakai server milik sendiri",
    },
    answer: "b",
    explain: "Azure Architecture Center (Autoscaling): vertical scaling (scale up) mengubah kapasitas satu resource, mis. pindah ke VM lebih besar; horizontal scaling (scale out) menambah atau mengurangi jumlah instance. Keduanya bisa dipakai untuk app server maupun database.",
  },
  {
    id: "0005-02", lesson: "0005", topic: "skala-stateless", type: "mc",
    prompt: "Tiga app server di belakang load balancer. User login di server 1, lalu request berikutnya ke server 2 dan user dianggap belum login. Penyebab paling mungkin?",
    options: {
      a: "Load balancer memakai algoritma round robin yang salah",
      b: "Database tidak punya index pada kolom tabel user",
      c: "Server 2 memakai versi kode yang lebih baru",
      d: "Session login disimpan di memori server 1 saja",
    },
    answer: "d",
    explain: "Azure (Design to scale out) menyebut menyimpan session state di memori sebagai penyebab stickiness; aturannya \"Make sure that any instance can handle any request.\" Pindahkan session ke shared store atau token di client supaya server stateless.",
  },
  {
    id: "0005-03", lesson: "0005", topic: "skala-vertical-horizontal", type: "mc",
    prompt: "Database sudah jenuh di 100% CPU. Tim mengusulkan menambah tiga app server. Apa tanggapan terbaik?",
    options: {
      a: "Tidak menolong; bottleneck di database, tangani itu dulu",
      b: "Menolong; lebih banyak server selalu menambah throughput sistem",
      c: "Menolong; load balancer akan membagi beban database juga",
      d: "Tidak menolong; app server harus di-scale up dulu",
    },
    answer: "a",
    explain: "Azure: \"if your backend database is the bottleneck, it won't help to add more web servers. Identify and resolve the bottlenecks in the system first.\" Bagian stateful paling sering menjadi bottleneck.",
  },
  {
    id: "0005-04", lesson: "0005", topic: "skala-stateless", type: "mc",
    prompt: "Menurut dokumentasi Redis, apa masalah menyimpan session di memori app server dengan <strong>sticky session</strong>?",
    options: {
      a: "Session menjadi tidak aman karena tidak dienkripsi sama sekali",
      b: "Request menjadi lebih lambat karena setiap request menunggu database",
      c: "Menciptakan hot spot dan menghalangi failover saat server mati",
      d: "Load balancer tidak bisa lagi memeriksa kesehatan server itu",
    },
    answer: "c",
    explain: "Redis docs (Redis session store): menyimpan session di app server individual \"requires sticky routing, which creates hot spots and precludes failover\". Server mati berarti session user di server itu hilang.",
  },
  {
    id: "0005-05", lesson: "0005", topic: "skala-vertical-horizontal", type: "mc",
    prompt: "Apa kelemahan utama <strong>vertical</strong> scaling dibanding horizontal scaling?",
    options: {
      a: "Kode aplikasi harus diubah dulu supaya menjadi stateless",
      b: "Ada batas ukuran mesin dan sering butuh downtime",
      c: "Selalu butuh load balancer dan session store tambahan",
      d: "Throughput selalu turun saat mesin diganti lebih besar",
    },
    answer: "b",
    explain: "Vertical scaling tidak butuh perubahan kode, tapi dibatasi mesin terbesar yang ada, dan Azure mencatat bahwa ia sering membuat sistem tidak tersedia sementara selama redeploy. Satu mesin juga tetap single point of failure.",
  },
  {
    id: "0005-oral-1", lesson: "0005", topic: "skala-stateless", type: "oral",
    prompt: "\"Aplikasi Anda berjalan di satu server dan CPU-nya penuh di jam sibuk. Apa yang Anda lakukan, dan apa yang harus diubah di aplikasi kalau ingin menambah server?\" (60 detik)",
    sample: "Pertama saya ukur: apakah yang jenuh benar-benar app server, atau database? Kalau database, menambah app server tidak menolong. Kalau app server, saya cek dulu query atau kode yang lambat, lalu langkah termurah adalah scale up ke mesin lebih besar, tanpa ubah kode, walau ada batas ukuran dan biasanya ada downtime sebentar. Kalau beban terus naik atau saya butuh availability karena satu server berarti single point of failure, saya scale out: beberapa instance di belakang load balancer. Syaratnya server harus stateless, jadi session tidak boleh di memori server. Saya pindahkan ke shared store seperti Redis dengan TTL, atau ke token yang ditandatangani di client. Sticky session saya hindari karena menciptakan hot spot dan menghalangi failover.",
    checklist: [
      "mengukur dulu di mana bottleneck-nya (app server atau database)",
      "scale up sebagai langkah termurah, beserta batasnya (ukuran mesin, downtime)",
      "scale out: beberapa instance di belakang load balancer",
      "syarat stateless: instance mana pun bisa melayani request mana pun",
      "session dipindah ke shared store (Redis + TTL) atau token di client",
      "membenarkan scale out dengan angka atau metrik (CPU, p99, target availability)",
    ],
  },
]);
