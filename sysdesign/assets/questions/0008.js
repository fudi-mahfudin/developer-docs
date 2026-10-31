// Soal lesson 0008 (track System Design, modul Data) · SQL vs NoSQL: kapan memilih yang mana. Format: assets/README.md.
// Sumber: https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf · https://www.mongodb.com/docs/manual/core/document/
// https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/ · https://neo4j.com/docs/getting-started/graph-database/
// https://www.postgresql.org/docs/current/tutorial-transactions.html · https://www.postgresql.org/docs/current/datatype-json.html
QuestionBank.labelTopics({
  "data-model-db": "Data: keluarga database (relasional, key-value, document, wide-column, graph)",
  "data-acid-base": "Data: ACID vs BASE, kapan butuh transaksi",
});

QuestionBank.register([
  {
    id: "0008-01", lesson: "0008", topic: "data-model-db", type: "mc",
    prompt: "Sebuah layanan menyimpan event klik (user, waktu, halaman) dengan volume write sangat besar, dan query utamanya \"semua event user X dalam rentang waktu tertentu\". Keluarga database mana yang paling cocok dengan pola akses ini?",
    options: {
      a: "Graph database, karena semua event saling berhubungan",
      b: "Wide-column store, row key terurut per user-waktu",
      c: "Document store, satu dokumen untuk semua event",
      d: "Key-value store, satu key untuk setiap klik",
    },
    answer: "b",
    explain: "Bigtable (wide-column) adalah \"sparse, distributed, persistent multi-dimensional sorted map\" yang menyimpan data \"in lexicographic order by row key\", sehingga scan rentang row key (mis. <code>user#waktu</code>) efisien. Key-value hanya cepat untuk get per key, bukan rentang; satu dokumen raksasa menabrak batas 16 MiB MongoDB; graph untuk traversal relasi.",
  },
  {
    id: "0008-02", lesson: "0008", topic: "data-model-db", type: "mc",
    prompt: "Fitur \"orang yang mungkin Anda kenal\" butuh query teman dari teman dari teman, tiga lapis relasi. Model data mana yang dibuat untuk pola query ini?",
    options: {
      a: "Key-value: simpan daftar teman per user",
      b: "Wide-column: satu kolom untuk setiap teman",
      c: "Document: semua teman bersarang dalam profil",
      d: "Graph: node user, relationship berteman, traversal",
    },
    answer: "d",
    explain: "Neo4j \"stores data as nodes, relationships, and properties instead of in tables or documents\", dan traversal berlapis adalah kekuatannya. Di model lain, setiap lapis relasi berarti satu putaran lookup atau JOIN tambahan. (Untuk skala kecil, JOIN rekursif di database relasional sering masih cukup.)",
  },
  {
    id: "0008-03", lesson: "0008", topic: "data-acid-base", type: "mc",
    prompt: "Transfer saldo: debit rekening A dan kredit rekening B. Server mati di antara dua langkah itu. Jaminan apa yang mencegah saldo A berkurang tanpa B bertambah?",
    options: {
      a: "Atomicity: transaksi all-or-nothing, langkah yang setengah jadi dibatalkan",
      b: "Eventual consistency: replika akhirnya sama setelah beberapa detik",
      c: "Read replica: salinan database lain menyimpan langkah pertama",
      d: "Sharding: rekening A dan B di node berbeda",
    },
    answer: "a",
    explain: "Dokumentasi PostgreSQL: transaksi \"bundles multiple steps into a single, all-or-nothing operation\"; kalau gagal di tengah, \"none of the steps affect the database at all.\" Itu huruf A di ACID. Eventual consistency (BASE) justru tidak menjamin ini, dan sharding membuat transaksi lintas node lebih sulit, bukan lebih mudah.",
  },
  {
    id: "0008-04", lesson: "0008", topic: "data-acid-base", type: "mc",
    prompt: "Paper Dynamo (Amazon, 2007) memilih melepas sebagian jaminan ACID untuk shopping cart. Apa alasan yang ditulis di paper itu?",
    options: {
      a: "Data store ber-ACID terlalu mahal lisensinya untuk Amazon",
      b: "Shopping cart tidak pernah perlu dibaca oleh user",
      c: "Data store ber-ACID cenderung kurang available menurut pengalaman",
      d: "Transaksi ACID tidak mungkin berjalan di atas SSD",
    },
    answer: "c",
    explain: "\"Experience at Amazon has shown that data stores that provide ACID guarantees tend to have poor availability.\" Karena itu Dynamo \"does not provide any isolation guarantees and permits only single key updates\" dan dirancang \"eventually consistent\": keranjang harus selalu bisa ditulis, boleh sempat berbeda antar replika. Itu sikap BASE.",
  },
  {
    id: "0008-oral-1", lesson: "0008", topic: "data-model-db", type: "oral",
    prompt: "\"Untuk sistem e-commerce kecil (order, pembayaran, katalog produk), Anda memilih SQL atau NoSQL? Jelaskan alasannya dan kapan Anda akan berubah pikiran.\" (60 detik)",
    sample: "\"Saya mulai dari pola akses. Order dan pembayaran butuh transaksi all-or-nothing: kurangi stok, buat order, catat pembayaran harus berhasil semua atau tidak sama sekali. Itu ACID, jadi database relasional seperti PostgreSQL. Katalog punya atribut berbeda per kategori, tapi itu cukup dengan kolom jsonb yang bisa di-index, tanpa database kedua. NoSQL baru masuk kalau ada pola akses khusus yang terukur: misalnya event clickstream yang write-nya melewati kapasitas satu node setelah tuning, cocok ke wide-column; atau session dan cart yang hanya diakses per key, cocok ke key-value. Trade-off-nya: NoSQL melepas JOIN dan transaksi multi-key, dan banyak yang eventual consistent, jadi integritas pindah ke aplikasi. Untuk skala kecil satu PostgreSQL sudah cukup.\"",
    checklist: [
      "memilih dari pola akses (query dominan), bukan dari nama produk",
      "order/pembayaran butuh transaksi ACID (all-or-nothing)",
      "relasional sebagai default, atribut fleksibel cukup dengan jsonb",
      "minimal satu keluarga NoSQL yang tepat beserta pola aksesnya (key-value, document, wide-column, graph)",
      "biaya NoSQL: tanpa JOIN/transaksi multi-key, eventual consistency, operasional database kedua",
      "membenarkan perubahan dengan angka atau metrik (mis. write melewati kapasitas satu node setelah tuning)",
    ],
  },
]);
