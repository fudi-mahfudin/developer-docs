// Soal lesson 0024 (track System Design, modul Reliabilitas & API) · Monolith, modular monolith, microservices; distributed transaction dan saga; service discovery. Format: assets/README.md.
// Sumber: Azure Architecture Center (Microservices architecture style, Saga pattern), Kubernetes docs (Service: discovering services).
QuestionBank.labelTopics({
  "rel-monolith-microservices": "Reliabilitas & API: monolith, modular monolith, microservices, service discovery",
  "rel-distributed-transaction": "Reliabilitas & API: distributed transaction dan saga",
});

QuestionBank.register([
  {
    id: "0024-01", lesson: "0024", topic: "rel-monolith-microservices", type: "mc",
    prompt: "Startup dengan 4 engineer dan 2.000 user aktif harian akan membangun produk baru. Arsitektur awal yang paling masuk akal?",
    options: {
      a: "Delapan microservices dengan database terpisah untuk setiap service",
      b: "Modular monolith dengan satu database, batas modul jelas",
      c: "Satu serverless function terpisah untuk setiap endpoint API",
      d: "Event sourcing penuh dengan Kafka sebagai sumber kebenaran",
    },
    answer: "b",
    explain: "2.000 DAU jauh di bawah kapasitas satu server (lesson 0004), dan 4 engineer adalah satu tim. Microservices menambah service discovery, konsistensi data lintas service, latency jaringan, dan kebutuhan skill (Azure Architecture Center) tanpa masalah yang perlu diselesaikan. Modular monolith menjaga batas modul supaya pemecahan nanti tetap mungkin.",
  },
  {
    id: "0024-02", lesson: "0024", topic: "rel-distributed-transaction", type: "mc",
    prompt: "Order service dan payment service punya database masing-masing. Pembayaran gagal setelah order dibuat. Bagaimana pola saga menanganinya?",
    options: {
      a: "Satu transaksi ACID mengunci kedua database sekaligus",
      b: "Order dibiarkan sampai admin memeriksanya secara manual",
      c: "Payment service menulis langsung ke tabel order",
      d: "Compensating transaction membatalkan order yang sudah dibuat",
    },
    answer: "d",
    explain: "Azure Saga pattern: saga adalah urutan transaksi lokal, satu per service. Kalau satu langkah gagal, saga menjalankan compensating transaction yang membalik langkah yang sudah selesai, di sini membatalkan order. Menulis ke tabel service lain merusak kepemilikan data.",
  },
  {
    id: "0024-03", lesson: "0024", topic: "rel-monolith-microservices", type: "mc",
    prompt: "Mana yang disebut Azure Architecture Center sebagai tantangan <strong>microservices</strong>?",
    options: {
      a: "Satu deployment besar membuat setiap rilis menjadi lambat",
      b: "Satu database bersama membuat perubahan skema jadi berisiko",
      c: "Service discovery, konsistensi data, dan latency antar service",
      d: "Kode tidak bisa dibagi menjadi modul yang jelas",
    },
    answer: "c",
    explain: "Azure menyebut sistem microservices lebih kompleks secara keseluruhan (service discovery, konsistensi data, manajemen transaksi, komunikasi antar service), dan rantai panggilan A → B → C menambah latency. Opsi a dan b adalah masalah monolith yang ingin diselesaikan microservices.",
  },
  {
    id: "0024-04", lesson: "0024", topic: "rel-distributed-transaction", type: "mc",
    prompt: "Kenapa transaksi ACID biasa tidak bisa langsung dipakai lintas microservices?",
    options: {
      a: "Setiap service memiliki database sendiri yang dikelola terpisah",
      b: "ACID hanya tersedia di database NoSQL modern saja",
      c: "Microservices dilarang memakai database relasional jenis apa pun",
      d: "HTTP tidak mendukung request yang membawa body JSON",
    },
    answer: "a",
    explain: "Di microservices setiap service bertanggung jawab atas persistensi datanya sendiri (Azure). Azure Saga pattern: jaminan ACID tradisional tidak langsung berlaku untuk beberapa data store yang dikelola terpisah, sehingga koordinasinya memakai saga (transaksi lokal + compensating transaction).",
  },
  {
    id: "0024-05", lesson: "0024", topic: "rel-monolith-microservices", type: "mc",
    prompt: "Dalam satu cluster Kubernetes, bagaimana service A menemukan alamat instance service B yang terus berganti?",
    options: {
      a: "IP setiap pod B ditulis tangan di konfigurasi A",
      b: "Lewat nama DNS Service B yang dikelola oleh cluster",
      c: "A bertanya ke database milik B tentang alamat terbarunya",
      d: "B mengirim email berisi IP barunya setiap kali restart",
    },
    answer: "b",
    explain: "Kubernetes docs: client di dalam cluster menemukan Service lewat environment variable atau DNS; server DNS cluster-aware seperti CoreDNS memantau Service baru dan membuat record DNS untuk masing-masing. Inilah service discovery: nama yang stabil di depan instance yang berganti.",
  },
  {
    id: "0024-oral-1", lesson: "0024", topic: "rel-monolith-microservices", type: "oral",
    prompt: "\"Tim kita 6 engineer dengan 5.000 user aktif harian, dan CTO ingin pindah ke microservices. Apa saran Anda?\" (60 detik)",
    sample: "\"Untuk skala ini saya sarankan tetap monolith, tapi dirapikan menjadi modular monolith: satu deployable, satu database, modul dengan batas jelas dan tabel milik masing-masing. 5.000 DAU itu jauh di bawah satu QPS rata-rata, jadi satu server dan satu database cukup, dan 6 engineer adalah satu tim. Microservices menambah biaya nyata: service discovery, latency jaringan antar service, tracing, deploy pipeline per service, dan yang paling berat, transaksi lintas database yang harus diganti saga dengan compensating transaction. Sinyal untuk memecah satu modul: beberapa tim saling menunggu saat deploy, atau satu modul punya kebutuhan skala yang sangat berbeda, misalnya pemrosesan gambar yang butuh CPU sepuluh kali lipat. Kalau sinyal itu muncul, saya pecah satu modul itu dulu, bukan semuanya.\"",
    checklist: [
      "monolith (modular) sebagai default untuk skala dan tim ini",
      "angka: DAU kecil, satu server + satu database cukup, satu tim",
      "biaya microservices: discovery, latency jaringan, operasional",
      "distributed transaction: saga dengan compensating transaction",
      "sinyal memecah: tim saling menunggu deploy atau kebutuhan skala berbeda",
      "memecah satu modul yang terbukti perlu, bukan semuanya sekaligus",
    ],
  },
]);
