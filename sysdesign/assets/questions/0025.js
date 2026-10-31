// Soal lesson 0025 (track System Design, modul Reliabilitas & API) · Tangga skala: ukur dulu, perubahan termurah dulu; anti-pattern over-engineering. Format: assets/README.md.
// Sumber: Google SRE Book ch. 6 (four golden signals) dan ch. 9 Simplicity, PostgreSQL docs (Using EXPLAIN, Indexes intro, Hot Standby), Azure Architecture Center (Cache-Aside, Queue-Based Load Leveling, Microservices style).
QuestionBank.labelTopics({
  "rel-tangga-skala": "Reliabilitas & API: tangga skala, urutan dan sinyal kapan naik",
  "rel-over-engineering": "Reliabilitas & API: over-engineering dan cara membenarkan komponen dengan angka",
});

QuestionBank.register([
  {
    id: "0025-01", lesson: "0025", topic: "rel-tangga-skala", type: "mc",
    prompt: "p99 endpoint daftar order naik ke 2 detik. Apa langkah pertama menurut tangga skala?",
    options: {
      a: "Menambah read replica untuk memisahkan beban baca",
      b: "Memasang Redis di depan semua query database",
      c: "Ukur: metrik dan EXPLAIN untuk query lambat",
      d: "Memecah modul order menjadi microservice yang terpisah",
    },
    answer: "c",
    explain: "Anak tangga pertama selalu mengukur: golden signals menunjukkan di mana masalahnya (latency, saturation), dan EXPLAIN memperlihatkan query plan yang dipilih PostgreSQL. Tanpa itu, replica, cache, atau microservice adalah tebakan yang mahal.",
  },
  {
    id: "0025-02", lesson: "0025", topic: "rel-over-engineering", type: "mc",
    prompt: "Kandidat mengusulkan Kafka, sharding, dan 10 microservices untuk aplikasi dengan 1.000 user aktif harian. Kenapa interviewer menilainya lemah?",
    options: {
      a: "Komponen tidak dibenarkan angka; beban di bawah 1 QPS",
      b: "Kafka tidak bisa dipakai bersama dengan microservices sama sekali",
      c: "Sharding hanya didukung oleh database NoSQL, bukan database relasional",
      d: "Sepuluh service terlalu sedikit untuk aplikasi dengan seribu user",
    },
    answer: "a",
    explain: "1.000 DAU × ±10 request per hari = 10⁴ request ÷ 10⁵ detik ≈ 0,1 QPS rata-rata, jauh di bawah kapasitas satu server dan satu database. Setiap komponen tambahan membawa biaya operasional dan kompleksitas (SRE Book: Simplicity) tanpa masalah yang diselesaikannya.",
  },
  {
    id: "0025-03", lesson: "0025", topic: "rel-tangga-skala", type: "mc",
    prompt: "EXPLAIN menunjukkan Seq Scan pada tabel 50 juta baris untuk <code>WHERE customer_id = ?</code>. Anak tangga mana yang tepat?",
    options: {
      a: "Scale vertical: pindah ke mesin database dua kali lebih besar",
      b: "Sharding tabel order berdasarkan customer_id ke empat node database baru",
      c: "Cache seluruh tabel order di Redis dengan TTL satu jam",
      d: "Perbaiki query: tambahkan index pada kolom customer_id, lalu ukur ulang",
    },
    answer: "d",
    explain: "Tanpa index, PostgreSQL harus memindai seluruh tabel baris demi baris untuk mencari yang cocok (PostgreSQL docs: Indexes). Index adalah anak tangga kedua: murah, tanpa komponen baru. Biayanya overhead kecil saat menulis. Mesin dua kali lebih besar tetap memindai 50 juta baris.",
  },
  {
    id: "0025-04", lesson: "0025", topic: "rel-over-engineering", type: "mc",
    prompt: "Kalimat mana yang paling kuat untuk menyampaikan keputusan skala di interview?",
    options: {
      a: "\"Saya pakai microservices supaya sistemnya siap kalau nanti viral.\"",
      b: "\"Cukup satu DB; kalau CPU &gt;70% terus, tambah replica.\"",
      c: "\"Semua komponen populer saya pasang supaya desainnya terlihat lengkap.\"",
      d: "\"Saya selalu memulai dari sharding karena data pasti tumbuh.\"",
    },
    answer: "b",
    explain: "Pola yang dinilai: \"untuk skala ini cukup X; kalau metrik Y melewati Z, langkah berikutnya W.\" Ia menunjukkan Anda tahu solusi yang lebih besar, tapi hanya memakainya saat angka menuntut. Tiga opsi lain menambah komponen tanpa sinyal yang terukur.",
  },
  {
    id: "0025-05", lesson: "0025", topic: "rel-tangga-skala", type: "mc",
    prompt: "CPU database primary 85% terus-menerus, 90% query adalah baca, query sudah di-index, dan cache sudah ada. Anak tangga berikutnya yang paling murah?",
    options: {
      a: "Sharding database berdasarkan kolom user_id",
      b: "Pecah aplikasi menjadi beberapa microservices",
      c: "Scale vertical, lalu read replica",
      d: "Pindah ke database NoSQL baru",
    },
    answer: "c",
    explain: "Setelah index dan cache, urutannya scale vertical (tanpa ubah kode) lalu read replica untuk beban baca: hot standby PostgreSQL bisa melayani query read-only. Sharding baru dibenarkan kalau beban tulis atau ukuran data melewati satu primary, dan pecah service menyelesaikan masalah tim, bukan CPU.",
  },
  {
    id: "0025-oral-1", lesson: "0025", topic: "rel-tangga-skala", type: "oral",
    prompt: "\"Aplikasi kita yang sekarang satu server dan satu database mulai lambat setelah traffic naik sepuluh kali lipat. Jelaskan urutan langkah Anda, dari yang pertama.\" (90 detik)",
    sample: "\"Pertama saya ukur: empat golden signals untuk melihat apakah yang jenuh CPU aplikasi, database, atau koneksi, lalu EXPLAIN untuk query paling lambat. Biasanya perbaikan termurah ada di sana: index yang hilang, query N+1, atau query yang mengambil terlalu banyak kolom. Kalau masalahnya baca berulang ke data yang sama, saya pasang cache-aside dengan TTL dan menerima risiko data agak basi. Kalau database masih jenuh, scale vertical dulu karena tanpa ubah kode, lalu read replica untuk beban baca, dengan risiko replication lag. Pekerjaan lambat seperti kirim email saya pindah ke queue supaya tidak di jalur request. Sharding baru kalau beban tulis atau ukuran data melewati satu primary yang sudah besar, dan pecah service hanya kalau masalahnya tim atau kebutuhan skala yang berbeda. Jadi jawabannya: untuk skala ini cukup index dan cache; kalau CPU database tetap di atas 70% setelah itu, langkah berikutnya replica.\"",
    checklist: [
      "mulai dari mengukur (golden signals, EXPLAIN), bukan menebak",
      "perbaiki query/index sebelum menambah komponen",
      "cache, lalu scale vertical, lalu read replica, dengan risikonya (stale data, replication lag)",
      "queue untuk pekerjaan lambat atau beban yang naik-turun",
      "sharding dan pecah service sebagai anak tangga terakhir dengan sinyalnya",
      "kalimat \"untuk skala ini cukup X; kalau metrik Y melewati Z, langkah berikutnya W\"",
    ],
  },
]);
