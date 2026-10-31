// Soal lesson 0001 (track System Design, modul Fondasi): functional vs non-functional requirement, desain v1.
// Sumber: Jeff Dean LADIS 2009, Google SRE Book (bab 4, Availability Table). Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "dasar-requirement": "Fondasi: functional vs non-functional requirement",
  "dasar-prinsip-sederhana": "Fondasi: desain v1 dan prinsip ukur dulu",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0001-01", lesson: "0001", topic: "dasar-requirement", type: "mc",
    prompt: "Soal: rancang URL shortener. Mana yang termasuk <strong>non-functional</strong> requirement?",
    options: {
      a: "User bisa membuat link pendek dari URL panjang",
      b: "Redirect selesai di bawah 100 ms untuk p99",
      c: "User bisa mengatur tanggal kedaluwarsa untuk link miliknya",
      d: "Sistem mengarahkan setiap link pendek ke URL aslinya",
    },
    answer: "b",
    explain: "Functional menjawab \"sistem melakukan apa\" (membuat link, redirect, kedaluwarsa). Non-functional menjawab \"seberapa baik\" dan sebaiknya berupa angka: latency, availability, skala. Latency adalah SLI utama di kebanyakan layanan (SRE Book bab 4).",
  },
  {
    id: "0001-02", lesson: "0001", topic: "dasar-prinsip-sederhana", type: "mc",
    prompt: "Aplikasi internal untuk 1.000 user. Desain v1 mana yang paling tepat?",
    options: {
      a: "Microservices per fitur, saling terhubung lewat message queue",
      b: "Database dipecah ke beberapa shard sejak hari pertama",
      c: "Cache terdistribusi di depan setiap service yang ada",
      d: "Satu app server dan satu database, lalu ukur",
    },
    answer: "d",
    explain: "Desain v1 adalah desain paling sederhana yang memenuhi angka requirement. Komponen lain ditambah hanya kalau metrik menuntut. Ukur dulu, perbaiki yang termurah, dan pecah arsitektur sebagai jalan terakhir.",
  },
  {
    id: "0001-03", lesson: "0001", topic: "dasar-requirement", type: "mc",
    prompt: "Interviewer setuju availability 99,9%. Berapa kira-kira jatah downtime per bulan?",
    options: {
      a: "Sekitar 43 menit",
      b: "Sekitar 7 jam",
      c: "Sekitar 4 menit",
      d: "Sekitar 9 jam",
    },
    answer: "a",
    explain: "SRE Book, Availability Table: 99,9% = 43,2 menit per bulan (8,76 jam per tahun). 99% = 7,2 jam per bulan; 99,99% = 4,32 menit per bulan. Setiap sembilan tambahan memangkas jatah downtime 10 kali.",
  },
  {
    id: "0001-04", lesson: "0001", topic: "dasar-prinsip-sederhana", type: "mc",
    prompt: "Kenapa desain v1 sebaiknya satu aplikasi (monolith), bukan microservices?",
    options: {
      a: "Monolith selalu lebih cepat untuk setiap jenis beban",
      b: "Microservices tidak bisa dipakai bersama database yang relasional",
      c: "Mengelola banyak service punya biaya yang belum perlu",
      d: "Monolith tidak pernah perlu dipecah walau tim membesar",
    },
    answer: "c",
    explain: "Setiap service tambahan berarti deploy, monitoring, dan panggilan jaringan yang lebih lambat dan bisa gagal. Biaya itu dibayar terpakai atau tidak. Monolith bisa dipecah nanti, kalau angka sudah menuntut.",
  },
  {
    id: "0001-05", lesson: "0001", topic: "dasar-requirement", type: "mc",
    prompt: "Kenapa non-functional requirement sebaiknya ditulis sebagai angka?",
    options: {
      a: "Supaya diagram arsitektur terlihat lebih lengkap dan rapi",
      b: "Angka itu menentukan komponen mana yang benar-benar dibutuhkan",
      c: "Interviewer hanya mau menilai jawaban yang berisi angka",
      d: "Angka menggantikan kebutuhan untuk menulis functional requirement lagi",
    },
    answer: "b",
    explain: "\"Harus cepat\" tidak bisa dipakai memilih desain. \"p99 di bawah 100 ms\" atau \"99,9% availability\" langsung menentukan apakah perlu cache, replica, atau failover. Functional requirement tetap dibutuhkan; keduanya saling melengkapi.",
  },
  {
    id: "0001-oral-1", lesson: "0001", topic: "dasar-prinsip-sederhana", type: "oral",
    prompt: "\"Rancang aplikasi absensi untuk kantor dengan 1.000 karyawan. Apa yang Anda lakukan di dua menit pertama, dan kenapa Anda tidak langsung memilih microservices?\" (60 detik)",
    sample: "Saya mulai dari requirement. Functional: karyawan check-in dan check-out, HR melihat rekap. Non-functional saya minta dalam angka: berapa user aktif, kapan puncaknya (mungkin jam 8 pagi), berapa latency yang bisa diterima, dan availability yang dibutuhkan, misalnya 99,9% berarti boleh down sekitar 43 menit sebulan. Lalu saya hitung kasar: 1.000 karyawan dengan beberapa request per hari itu sangat kecil, jadi desain v1 saya satu app server dan satu database. Microservices menambah biaya mengelola banyak service: deploy, monitoring, dan panggilan jaringan antar-service yang bisa gagal. Kalau nanti metrik menunjukkan bottleneck, saya mulai dari perubahan termurah seperti index atau cache.",
    checklist: [
      "mulai dari requirement sebelum menggambar komponen",
      "minimal dua functional requirement dalam bentuk \"user bisa …\"",
      "non-functional requirement sebagai angka (user, puncak, latency, atau availability)",
      "hitungan kasar yang menunjukkan bebannya kecil",
      "desain v1: satu app server dan satu database",
      "alasan menolak microservices (biaya mengelola banyak service) dan langkah termurah kalau nanti lambat",
    ],
  },
]);
