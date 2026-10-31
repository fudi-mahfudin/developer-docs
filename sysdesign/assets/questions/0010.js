// Soal lesson 0010 (track System Design, modul Data) · Sharding dan consistent hashing. Format: assets/README.md.
// Sumber: https://www.postgresql.org/docs/current/ddl-partitioning.html · https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/
// https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf · https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf
QuestionBank.labelTopics({
  "data-partisi": "Data: range vs hash partitioning, shard key, hot partition",
  "data-consistent-hash": "Data: resharding, consistent hashing, virtual node",
});

QuestionBank.register([
  {
    id: "0010-01", lesson: "0010", topic: "data-partisi", type: "mc",
    prompt: "Tabel event di-shard dengan range partitioning berdasarkan <code>created_at</code> (satu shard per bulan). Setelah go-live, satu shard CPU-nya 95% sementara shard lain hampir menganggur. Apa penyebabnya?",
    options: {
      a: "Consistent hashing salah konfigurasi sehingga ring jadi tidak seimbang",
      b: "Read replica tertinggal sehingga semua query kembali ke leader",
      c: "Index B-tree terlalu banyak sehingga setiap INSERT jadi lambat",
      d: "Hot partition: semua write terbaru jatuh ke shard terakhir",
    },
    answer: "d",
    explain: "Range partitioning membagi data per rentang key tanpa tumpang tindih. Kalau key-nya waktu, semua write \"sekarang\" jatuh ke rentang terakhir: hot partition. Pilihan lain: hash partitioning (sebaran rata, tapi query rentang ke semua shard) atau shard key gabungan, mis. <code>(user_id, created_at)</code>. Tidak ada ring di range partitioning.",
  },
  {
    id: "0010-02", lesson: "0010", topic: "data-partisi", type: "mc",
    prompt: "Aplikasi chat: hampir semua query berbentuk \"ambil 50 pesan terakhir di percakapan X\". Shard key mana yang paling masuk akal?",
    options: {
      a: "<code>message_id</code> acak, supaya setiap pesan tersebar ke semua shard",
      b: "<code>conversation_id</code>, supaya satu percakapan cukup dibaca dari satu shard",
      c: "<code>created_at</code> per hari, supaya pesan terbaru di satu shard",
      d: "<code>sender_id</code>, supaya semua pesan seorang pengirim di satu shard",
    },
    answer: "b",
    explain: "Shard key dipilih dari query dominan, supaya query itu tidak perlu bertanya ke banyak shard. Per <code>message_id</code> acak, satu percakapan tersebar ke semua shard; per hari menimbulkan hot partition; per pengirim memecah satu percakapan menjadi beberapa shard (satu per peserta).",
  },
  {
    id: "0010-03", lesson: "0010", topic: "data-consistent-hash", type: "mc",
    prompt: "Cluster cache memakai <code>node = hash(key) mod 4</code>. Anda menambah node kelima. Apa yang terjadi, dan apa alternatifnya?",
    options: {
      a: "Hampir semua key pindah node; consistent hashing hanya memindahkan sebagian",
      b: "Hanya seperlima key pindah node; mod N sudah cukup baik",
      c: "Tidak ada key pindah; node baru hanya menerima key baru",
      d: "Semua key hilang permanen; cluster harus diisi ulang dari backup",
    },
    answer: "a",
    explain: "Karger et al.: dengan hash klasik, \"When the range of the hash function … changed, almost every item would be hashed to a new location. Suddenly, all cached data is useless\". Consistent hashing adalah fungsi yang \"changes minimally as the range of the function changes\": di ring, node baru hanya mengambil key dari tetangganya.",
  },
  {
    id: "0010-04", lesson: "0010", topic: "data-consistent-hash", type: "mc",
    prompt: "Di ring consistent hashing dasar (satu titik per server), satu server mati dan seluruh bebannya pindah ke satu tetangga yang lalu ikut kewalahan. Solusi yang dipakai Dynamo?",
    options: {
      a: "Kembali ke <code>hash mod N</code> supaya beban terbagi otomatis",
      b: "Tambah read replica di depan setiap server pada ring",
      c: "Virtual node: setiap server memegang banyak titik di ring",
      d: "Range partitioning per tanggal supaya beban berpindah setiap hari",
    },
    answer: "c",
    explain: "Dynamo: \"each node gets assigned to multiple points in the ring\" (virtual node). Saat node mati, \"the load handled by this node is evenly dispersed across the remaining available nodes\", node baru menerima beban kira-kira sama dari setiap node lain, dan jumlah virtual node bisa disesuaikan dengan kapasitas server.",
  },
  {
    id: "0010-oral-1", lesson: "0010", topic: "data-consistent-hash", type: "oral",
    prompt: "\"Data Anda tidak lagi muat di satu database. Bagaimana Anda membaginya, dan apa yang terjadi saat Anda menambah node?\" (60 detik)",
    sample: "\"Pertama saya pastikan memang perlu: write atau ukuran data sudah melewati satu server setelah index dan scale vertical; kalau hanya read, replica atau cache cukup. Lalu pilih shard key dari query dominan, misalnya user_id, supaya sebagian besar query cukup ke satu shard. Range partitioning bagus untuk query rentang tapi rawan hot partition, misalnya semua write hari ini ke shard terakhir; hash partitioning menyebar rata tapi query rentang harus ke semua shard. Untuk penempatan saya pakai consistent hashing, bukan hash mod N, karena mod N memindahkan hampir semua key saat N berubah. Di ring, node baru hanya mengambil key dari tetangganya. Dengan virtual node, setiap server punya banyak titik di ring, jadi beban rata dan saat node mati bebannya tersebar ke banyak node. Biayanya: query lintas shard mahal dan shard key sulit diganti.\"",
    checklist: [
      "range vs hash partitioning beserta trade-off-nya (query rentang vs sebaran rata)",
      "shard key dipilih dari query dominan, query lintas shard mahal",
      "hot partition: penyebab dan penanganannya",
      "<code>hash mod N</code> memindahkan hampir semua key saat resharding",
      "consistent hashing (ring, hanya tetangga terdampak) + virtual node untuk sebaran rata",
      "membenarkan sharding dengan angka atau metrik (write/ukuran data melewati satu server setelah tuning)",
    ],
  },
]);
