// Soal lesson 0006 (track System Design, modul Skalabilitas) · Load balancer: L4 vs L7, algoritma, health check, sticky session. Format: assets/README.md.
// Sumber: AWS ELB docs (NLB, ALB, how ELB works, HTTPS listener, target group attributes, health checks), nginx load balancing + upstream module, Google SRE Book bab 19–20, Azure "Design to scale out".
QuestionBank.labelTopics({
  "skala-lb-layer": "Skalabilitas: load balancer L4 vs L7",
  "skala-lb-algoritma": "Skalabilitas: algoritma load balancing, health check, sticky session",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban c a d b c a.
QuestionBank.register([
  {
    id: "0006-01", lesson: "0006", topic: "skala-lb-layer", type: "mc",
    prompt: "Request <code>/api/*</code> harus ke service API dan <code>/images/*</code> ke service gambar. Load balancer jenis apa yang dibutuhkan?",
    options: {
      a: "L4, karena ia membaca port tujuan setiap koneksi",
      b: "L4, karena ia memakai flow hash per koneksi",
      c: "L7, karena ia membaca path di request HTTP",
      d: "L7, karena ia lebih cepat dari L4 selalu",
    },
    answer: "c",
    explain: "AWS: Application Load Balancer bekerja di layer 7 OSI dan merutekan request ke target group berbeda berdasarkan isi trafik aplikasi (path, host, header). L4 hanya melihat IP, port, dan koneksi TCP, jadi tidak tahu path.",
  },
  {
    id: "0006-02", lesson: "0006", topic: "skala-lb-algoritma", type: "mc",
    prompt: "Sebagian request berupa upload file yang butuh 30 detik, sisanya selesai dalam 50 ms. Algoritma mana yang paling cocok?",
    options: {
      a: "Least connections, karena memperhitungkan request yang masih berjalan",
      b: "Round robin, karena membagi jumlah request sama rata",
      c: "Hash IP, karena user selalu ke server sama",
      d: "Random, karena rata-rata beban akhirnya akan seimbang juga",
    },
    answer: "a",
    explain: "nginx: least-connected mengatur beban \"more fairly in a situation when some of the requests take longer to complete\". ALB menyebutnya least outstanding requests. Round robin membagi jumlah request, bukan beban, sehingga satu server bisa menumpuk upload panjang.",
  },
  {
    id: "0006-03", lesson: "0006", topic: "skala-lb-layer", type: "mc",
    prompt: "Kebijakan keamanan menuntut trafik tetap terenkripsi TLS sampai ke app server, tanpa didekripsi di tengah. Pilihan yang disarankan dokumentasi AWS?",
    options: {
      a: "Load balancer L7 dengan TLS termination di listener HTTPS",
      b: "Load balancer L7 dengan sticky session berbasis cookie aplikasi",
      c: "DNS dengan beberapa record A tanpa memakai load balancer",
      d: "Load balancer L4 dengan listener TCP di port 443",
    },
    answer: "d",
    explain: "AWS (Create an HTTPS listener): ALB memakai sertifikat untuk men-terminate dan mendekripsi koneksi. Kalau trafik harus diteruskan terenkripsi tanpa didekripsi load balancer, pakai Network Load Balancer (L4) dengan listener TCP di port 443.",
  },
  {
    id: "0006-04", lesson: "0006", topic: "skala-lb-algoritma", type: "mc",
    prompt: "ALB dengan health check default. Satu target mulai gagal menjawab <code>/health</code>. Apa yang terjadi?",
    options: {
      a: "Target langsung dikeluarkan setelah satu kegagalan yang pertama",
      b: "Setelah 2 kegagalan berturut-turut, target berhenti menerima request",
      c: "Target tetap menerima request sampai operator mematikannya manual",
      d: "Semua target lain ikut dikeluarkan supaya beban seimbang",
    },
    answer: "b",
    explain: "AWS ALB: health check dikirim tiap 30 detik (default); UnhealthyThresholdCount default 2, HealthyThresholdCount default 5. Load balancer hanya merutekan ke target yang sehat. Kalau semua target gagal, ALB fail open dan mengirim ke semua.",
  },
  {
    id: "0006-05", lesson: "0006", topic: "skala-lb-algoritma", type: "mc",
    prompt: "Kenapa <strong>sticky session</strong> sebaiknya dihindari di desain baru?",
    options: {
      a: "Load balancer L7 sama sekali tidak bisa mendukung cookie",
      b: "Health check tidak bisa berjalan kalau sticky session aktif",
      c: "Membatasi scale out dan session hilang saat server mati",
      d: "Round robin otomatis mati dan diganti hash IP client",
    },
    answer: "c",
    explain: "Azure: \"Stickiness limits the application's ability to scale out\"; trafik user yang sangat aktif tidak bisa dibagi. Session di memori server juga hilang kalau server mati. Lebih baik buat server stateless dan simpan session di luar (lesson 0005).",
  },
  {
    id: "0006-06", lesson: "0006", topic: "skala-lb-algoritma", type: "mc",
    prompt: "Setiap app server menyimpan cache lokal per user, jadi user yang sama sebaiknya ke server yang sama. Kenapa memakai <code>hash … consistent</code> dan bukan hash biasa?",
    options: {
      a: "Saat server ditambah, hanya sedikit key yang pindah server",
      b: "Hash konsisten membagi beban lebih rata dari round robin",
      c: "Hash biasa tidak bisa memakai user ID sebagai key",
      d: "Hash konsisten tidak butuh health check untuk tiap server",
    },
    answer: "a",
    explain: "nginx upstream module: dengan hash biasa, menambah atau menghapus server \"may result in remapping most of the keys\". Dengan parameter consistent (ketama), \"only a few keys will be remapped\", sehingga cache hit ratio tetap tinggi. Detailnya di lesson 0010.",
  },
  {
    id: "0006-oral-1", lesson: "0006", topic: "skala-lb-algoritma", type: "oral",
    prompt: "\"Anda menaruh load balancer di depan tiga app server. Jelaskan pilihan Anda: layer, algoritma, dan apa yang terjadi kalau satu server mati.\" (60 detik)",
    sample: "Load balancer ini dibenarkan karena satu server tidak cukup di jam sibuk dan target availability kita 99,9%, jadi deploy tidak boleh berarti downtime. Saya pilih L7 karena ini API HTTP: bisa routing per path dan melakukan TLS termination. L4 saya pakai kalau protokolnya bukan HTTP atau throughput-nya sangat tinggi. Algoritmanya round robin kalau request seragam; kalau ada request yang lama seperti upload, least connections. Hash saya pakai hanya kalau key yang sama harus ke server yang sama, misalnya cache per server, dan sebaiknya consistent hashing. Load balancer mengirim health check berkala; server yang gagal beberapa kali berturut-turut keluar dari rotasi, dan saat deploy saya pakai connection draining. Saya tidak pakai sticky session karena server-nya stateless dan session ada di Redis.",
    checklist: [
      "L4 atau L7, beserta alasannya (HTTP, routing per path, TLS termination)",
      "algoritma yang dipilih dan kapan memakai yang lain (round robin vs least connections)",
      "hash atau consistent hashing hanya kalau key yang sama harus ke server yang sama",
      "health check yang mengeluarkan server gagal dari rotasi",
      "menghindari sticky session karena server stateless (session di luar server)",
      "membenarkan load balancer dengan angka (beban, jumlah instance, target availability)",
    ],
  },
]);
