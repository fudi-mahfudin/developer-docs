// Soal lesson 0003 (track System Design, modul Fondasi): latency vs throughput, percentile, orde besaran latency.
// Sumber: Google SRE Book bab 4, Jeff Dean LADIS 2009 ("Numbers Everyone Should Know"). Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "dasar-latency-percentile": "Fondasi: latency vs throughput, percentile",
  "dasar-angka-latency": "Fondasi: orde besaran angka latency",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0003-01", lesson: "0003", topic: "dasar-latency-percentile", type: "mc",
    prompt: "Menambah app server di belakang load balancer paling mungkin memperbaiki apa?",
    options: {
      a: "Latency satu request yang lambat karena query yang buruk",
      b: "Latency user di benua lain yang jauh dari datacenter",
      c: "Throughput total saat banyak request sedang mengantre di server",
      d: "Tail latency yang disebabkan oleh disk seek di database",
    },
    answer: "c",
    explain: "Menambah server menaikkan kapasitas (throughput), seperti menambah lajur tol. Satu request yang lambat karena query buruk, jarak antarbenua, atau akses disk tetap lambat. Pisahkan dulu masalah latency dan throughput, karena obatnya berbeda.",
  },
  {
    id: "0003-02", lesson: "0003", topic: "dasar-angka-latency", type: "mc",
    prompt: "Urutan dari <strong>paling cepat</strong> ke paling lambat (angka Jeff Dean, 2009)?",
    options: {
      a: "Memori, round trip datacenter, disk seek, paket antarbenua",
      b: "Round trip datacenter, memori, paket antarbenua, disk seek",
      c: "Disk seek, memori, round trip datacenter, paket antarbenua",
      d: "Memori, disk seek, paket antarbenua, round trip datacenter",
    },
    answer: "a",
    explain: "Main memory reference 100 ns ≪ round trip di datacenter 500.000 ns (0,5 ms) ≪ disk seek 10 ms ≪ paket California → Belanda → California 150 ms. Yang perlu diingat adalah jarak orde besarannya.",
  },
  {
    id: "0003-03", lesson: "0003", topic: "dasar-latency-percentile", type: "mc",
    prompt: "Kenapa SLO latency sebaiknya ditulis sebagai p99, bukan rata-rata?",
    options: {
      a: "Rata-rata lebih sulit dihitung oleh sistem monitoring mana pun",
      b: "p99 selalu lebih kecil sehingga target lebih mudah tercapai",
      c: "p99 hanya menghitung request yang berhasil, bukan yang gagal",
      d: "Rata-rata menyembunyikan ekor dari request yang jauh lebih lambat",
    },
    answer: "d",
    explain: "SRE Book: \"a simple average can obscure these tail latencies\"; percentile tinggi \"shows you a plausible worst-case value\". Contoh di buku: request tipikal ±50 ms, tapi 5% request 20 kali lebih lambat.",
  },
  {
    id: "0003-04", lesson: "0003", topic: "dasar-angka-latency", type: "mc",
    prompt: "Satu endpoint memanggil database 10 kali <strong>berurutan</strong> di datacenter yang sama. Berapa kira-kira latency jaringannya saja?",
    options: {
      a: "Sekitar 1 mikrodetik",
      b: "Sekitar 5 milidetik",
      c: "Sekitar 150 milidetik",
      d: "Sekitar 1 detik",
    },
    answer: "b",
    explain: "Round trip di dalam datacenter ±0,5 ms (Dean 2009). 10 panggilan berurutan ≈ 10 × 0,5 ms = 5 ms, sebelum waktu kerja database. Itu sebabnya mengurangi jumlah panggilan berurutan sering lebih murah daripada menambah server.",
  },
  {
    id: "0003-05", lesson: "0003", topic: "dasar-latency-percentile", type: "mc",
    prompt: "Satu halaman memanggil 100 service sekaligus; setiap panggilan berpeluang 1% lambat. Berapa peluang halaman terkena minimal satu panggilan lambat?",
    options: {
      a: "Sekitar 1%",
      b: "Sekitar 10%",
      c: "Sekitar 63%",
      d: "Tepat 100%",
    },
    answer: "c",
    explain: "1 − 0,99<sup>100</sup> ≈ 0,63. Ekor yang hanya 1% per panggilan menjadi mayoritas halaman ketika fan-out-nya besar. Karena itu p99 (bahkan p99,9) penting untuk service yang dipanggil banyak service lain.",
  },
  {
    id: "0003-06", lesson: "0003", topic: "dasar-angka-latency", type: "mc",
    prompt: "User di benua lain merasakan latency ±150 ms per round trip. Apa kesimpulan desain yang tepat?",
    options: {
      a: "Mendekatkan konten ke user lebih efektif daripada optimasi kode",
      b: "Menambah CPU server akan menghapus selisih latency antarbenua itu",
      c: "Mengganti database ke NoSQL akan menghapus selisih latency itu",
      d: "Memperbesar memori server akan menghapus selisih latency antarbenua itu",
    },
    answer: "a",
    explain: "Paket California → Belanda → California ±150 ms adalah batas jarak fisik. Kode, CPU, atau database apa pun tidak bisa mengalahkannya. Yang bisa adalah memindahkan konten lebih dekat ke user (CDN, lesson 0007).",
  },
  {
    id: "0003-oral-1", lesson: "0003", topic: "dasar-latency-percentile", type: "oral",
    prompt: "\"Rata-rata latency API kami 80 ms, tapi user tetap mengeluh lambat. Apa yang Anda periksa, dan bagaimana Anda menulis target latency-nya?\" (60 detik)",
    sample: "Rata-rata menyembunyikan ekor. Latency itu distribusi, jadi saya lihat percentile: p50, p95, p99. Bisa saja p50-nya 50 ms tapi 5% request 20 kali lebih lambat; rata-rata tetap terlihat wajar. Kalau satu halaman memanggil banyak service, ekor itu kena hampir semua user: dengan 100 panggilan, peluang minimal satu melewati p99 sekitar 63%. Jadi target saya tulis sebagai percentile, misalnya p99 di bawah 300 ms. Lalu saya cari sumber ekornya dengan orde besaran: panggilan jaringan di datacenter ±0,5 ms, akses disk acak jauh lebih mahal, antarbenua ±150 ms. Saya juga pisahkan apakah masalahnya latency per request atau throughput yang kurang, karena menambah server tidak mempercepat request yang lambat karena query buruk.",
    checklist: [
      "rata-rata menyembunyikan tail latency; latency adalah distribusi",
      "lihat percentile (p50, p95, p99) dan arti p99",
      "target ditulis sebagai percentile, mis. \"p99 < 300 ms\"",
      "fan-out ke banyak service memperbesar dampak ekor (mis. 100 panggilan → ±63%)",
      "orde besaran untuk mencari sumber lambat (memori, jaringan datacenter, disk, antarbenua)",
      "membedakan masalah latency dan throughput (menambah server tidak mempercepat satu request)",
    ],
  },
]);
