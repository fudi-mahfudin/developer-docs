// Soal lesson 0004 (track System Design, modul Fondasi): estimasi back-of-envelope, QPS, storage, bandwidth.
// Sumber: Jeff Dean LADIS 2009 (slide "Designing Efficient Systems", "Numbers Everyone Should Know", "Back of the Envelope Calculations"). Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "dasar-estimasi-qps": "Fondasi: estimasi QPS dari DAU",
  "dasar-estimasi-storage": "Fondasi: estimasi storage dan bandwidth",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0004-01", lesson: "0004", topic: "dasar-estimasi-qps", type: "mc",
    prompt: "Untuk estimasi cepat, satu hari dibulatkan menjadi berapa detik?",
    options: {
      a: "Sekitar 10³ detik",
      b: "Sekitar 10⁴ detik",
      c: "Sekitar 10⁵ detik",
      d: "Sekitar 10⁶ detik",
    },
    answer: "c",
    explain: "24 × 3.600 = 86.400 detik, dibulatkan ke 10⁵. Pembulatan ke atas ini membuat QPS sedikit lebih kecil dari angka persis (±15%), dan itu tidak masalah: estimasi mencari orde besaran, bukan angka tepat.",
  },
  {
    id: "0004-02", lesson: "0004", topic: "dasar-estimasi-storage", type: "mc",
    prompt: "2<sup>30</sup> byte kira-kira sama dengan berapa?",
    options: {
      a: "Satu gigabyte, sekitar 10⁹ byte",
      b: "Satu megabyte, sekitar 10⁶ byte",
      c: "Satu terabyte, sekitar 10¹² byte",
      d: "Satu kilobyte, sekitar 10³ byte",
    },
    answer: "a",
    explain: "2¹⁰ = 1.024 ≈ 10³ (KB). Setiap tambahan 10 pada pangkat dua menambah tiga nol: 2²⁰ ≈ 10⁶ (MB), 2³⁰ ≈ 10⁹ (GB), 2⁴⁰ ≈ 10¹² (TB).",
  },
  {
    id: "0004-03", lesson: "0004", topic: "dasar-estimasi-qps", type: "mc",
    prompt: "1.000 DAU, masing-masing mengirim 20 request per hari. Berapa QPS rata-ratanya?",
    options: {
      a: "Sekitar 2.000 QPS",
      b: "Sekitar 200 QPS",
      c: "Sekitar 20 QPS",
      d: "Sekitar 0,2 QPS",
    },
    answer: "d",
    explain: "1.000 × 20 = 20.000 request per hari. 20.000 / 10⁵ detik = 0,2 QPS. Bahkan kalau puncaknya lima kali rata-rata, hasilnya masih sekitar 1 QPS.",
  },
  {
    id: "0004-04", lesson: "0004", topic: "dasar-estimasi-storage", type: "mc",
    prompt: "1 juta user masing-masing menyimpan 1 post per hari, setiap post 1 KB. Berapa storage per tahun?",
    options: {
      a: "Sekitar 365 MB per tahun",
      b: "Sekitar 365 GB per tahun",
      c: "Sekitar 365 TB per tahun",
      d: "Sekitar 365 KB per tahun",
    },
    answer: "b",
    explain: "10⁶ post × 1 KB = 10⁶ KB = 1 GB per hari. Dikali 365 hari ≈ 365 GB per tahun, belum termasuk index dan replika.",
  },
  {
    id: "0004-05", lesson: "0004", topic: "dasar-estimasi-qps", type: "mc",
    prompt: "Hasil estimasi: puncak sekitar 1 QPS, data 1 GB per tahun. Desain v1 mana yang paling tepat?",
    options: {
      a: "Satu app server dan satu database",
      b: "Load balancer, sepuluh server, dan cache",
      c: "Database di-sharding ke empat node terpisah",
      d: "Microservices per fitur dengan message queue",
    },
    answer: "a",
    explain: "Satu request yang memanggil database beberapa kali di datacenter (±0,5 ms per round trip, Jeff Dean) selesai dalam beberapa milidetik. Satu server yang melayani satu request sekaligus pun sudah mampu sekitar 100 request per detik, jauh di atas 1 QPS. Komponen lain belum dibenarkan angka.",
  },
  {
    id: "0004-06", lesson: "0004", topic: "dasar-estimasi-storage", type: "mc",
    prompt: "1.000 QPS baca, setiap response berukuran 100 KB. Berapa kira-kira bandwidth keluarnya?",
    options: {
      a: "Sekitar 100 KB/s",
      b: "Sekitar 1 MB/s",
      c: "Sekitar 100 MB/s",
      d: "Sekitar 100 GB/s",
    },
    answer: "c",
    explain: "Bandwidth = QPS × ukuran response = 1.000 × 100 KB = 10⁵ KB/s = 100 MB/s. Jaringan diukur dalam bit: 100 MB/s × 8 = 800 Mbps, mendekati kapasitas satu link 1 Gbps.",
  },
  {
    id: "0004-oral-1", lesson: "0004", topic: "dasar-estimasi-qps", type: "oral",
    prompt: "\"Rancang aplikasi pemesanan ruang rapat untuk kantor dengan 1.000 karyawan. Lakukan estimasi kasar, lalu sebutkan desain v1 Anda.\" (90 detik)",
    sample: "Asumsi saya: 1.000 karyawan semuanya aktif, masing-masing sekitar 10 request per hari untuk melihat jadwal, memesan, dan membatalkan. 10.000 dibagi 10⁵ detik per hari ≈ 0,1 QPS rata-rata. Puncaknya pagi hari: kalau 30% request datang dalam satu jam, itu 3.000 / 3.600 ≈ 1 QPS. Storage: sekitar 1.000 pemesanan per hari × 1 KB ≈ 1 MB per hari, ±365 MB per tahun. Satu server yang melayani satu request sekaligus pun mampu sekitar 100 request per detik. Jadi desain v1: satu app server dan satu database, plus backup. Kalau nanti dipakai seluruh grup perusahaan dan puncak naik ke ratusan QPS, atau p99 melewati target, saya ukur dulu dan mulai dari perubahan termurah seperti index atau cache.",
    checklist: [
      "asumsi eksplisit: jumlah DAU dan request per user per hari",
      "QPS rata-rata = total request per hari / 10⁵ detik",
      "QPS puncak dari asumsi jam sibuk, bukan hanya rata-rata",
      "storage = jumlah record × ukuran × masa simpan",
      "kesimpulan satu app server + satu database, dibenarkan dengan angka",
      "sinyal kapan desain berubah (QPS puncak atau p99) dan langkah termurah berikutnya",
    ],
  },
]);
