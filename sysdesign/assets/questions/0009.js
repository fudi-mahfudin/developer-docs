// Soal lesson 0009 (track System Design, modul Data) · Index dan replication: leader-follower, replication lag. Format: assets/README.md.
// Sumber: https://www.postgresql.org/docs/current/indexes-intro.html · https://www.postgresql.org/docs/current/indexes-types.html
// https://www.postgresql.org/docs/current/using-explain.html · https://www.postgresql.org/docs/current/hot-standby.html
// https://www.postgresql.org/docs/current/warm-standby.html
QuestionBank.labelTopics({
  "data-index": "Data: index B-tree dan EXPLAIN sebelum menambah server",
  "data-replikasi": "Data: leader-follower, sync vs async, replication lag, read replica",
});

QuestionBank.register([
  {
    id: "0009-01", lesson: "0009", topic: "data-index", type: "mc",
    prompt: "Endpoint daftar order lambat. <code>EXPLAIN ANALYZE</code> untuk <code>SELECT … FROM orders WHERE customer_id = 42 ORDER BY created_at</code> menunjukkan <code>Seq Scan on orders</code> di tabel 20 juta baris. Langkah pertama yang paling murah?",
    options: {
      a: "Tambah read replica supaya query terbagi ke dua server",
      b: "Pindahkan tabel orders ke document store yang lebih cepat",
      c: "Buat index B-tree pada <code>(customer_id, created_at)</code> lalu ukur ulang",
      d: "Shard tabel orders berdasarkan <code>customer_id</code> ke empat node baru",
    },
    answer: "c",
    explain: "Seq Scan berarti database harus \"scan the entire … table, row by row\". Index B-tree menangani equality dan range/sort (\"equality and range queries on data that can be sorted\"), jadi index komposit pada kolom filter lalu kolom urutan biasanya menghilangkan Seq Scan. Replica, NoSQL, dan sharding menambah server dan kompleksitas untuk masalah yang selesai dengan satu <code>CREATE INDEX</code>.",
  },
  {
    id: "0009-02", lesson: "0009", topic: "data-index", type: "mc",
    prompt: "Seorang rekan mengusulkan \"index saja semua kolom supaya semua query cepat\" pada tabel yang banyak di-INSERT. Apa keberatan yang tepat menurut dokumentasi PostgreSQL?",
    options: {
      a: "Setiap index menambah overhead pada setiap operasi INSERT/UPDATE/DELETE",
      b: "PostgreSQL membatasi satu index B-tree untuk setiap tabel",
      c: "Index hanya dipakai kalau query memakai <code>LIKE '%…%'</code>",
      d: "Index harus di-rebuild manual setiap kali tabelnya berubah",
    },
    answer: "a",
    explain: "Database meng-update index otomatis saat tabel berubah (\"the system will update the index when the table is modified\"), dan itu \"adds overhead to data manipulation operations\". Jadi index dibuat untuk query yang sering dan penting, bukan untuk semua kolom. Tidak ada batas satu index per tabel, dan index tidak perlu di-rebuild manual.",
  },
  {
    id: "0009-03", lesson: "0009", topic: "data-replikasi", type: "mc",
    prompt: "User mengganti foto profil, halaman reload, dan foto lama masih tampil. Write ke leader, read dari read replica dengan streaming replication default PostgreSQL. Penjelasan dan perbaikan yang paling tepat?",
    options: {
      a: "Cache browser rusak; minta user menghapus cache browser mereka",
      b: "Index rusak di leader; jalankan <code>REINDEX</code> setiap selesai update",
      c: "Replica kehilangan data; ganti replica dengan server baru sekarang",
      d: "Replication lag asinkron; baca data sendiri dari leader sesaat",
    },
    answer: "d",
    explain: "\"Streaming replication is asynchronous by default\", sehingga ada \"small delay between committing a transaction in the primary and the changes becoming visible in the standby.\" Itu replication lag. Perbaikan yang umum: setelah user menulis, baca data miliknya dari leader untuk beberapa saat (read-your-writes), replica untuk sisanya.",
  },
  {
    id: "0009-04", lesson: "0009", topic: "data-replikasi", type: "mc",
    prompt: "Tim pembayaran tidak boleh kehilangan transaksi yang sudah di-commit walau leader crash. Apa pilihan replication-nya, dan apa biayanya?",
    options: {
      a: "Asynchronous; biayanya replica tidak bisa dipakai untuk membaca",
      b: "Synchronous; setiap commit menunggu standby, latency write naik",
      c: "Asynchronous; biayanya leader harus restart setiap beberapa jam",
      d: "Synchronous; biayanya replica hanya bisa menerima query write",
    },
    answer: "b",
    explain: "Async default bisa kehilangan data: \"If the primary server crashes then some transactions that were committed may not have been replicated to the standby server\". Synchronous replication membuat \"each commit of a write transaction\" menunggu konfirmasi WAL di disk primary dan standby, dan pemakaian yang tidak hati-hati \"will reduce performance … because of increased response times\". Hot standby tetap read-only.",
  },
  {
    id: "0009-oral-1", lesson: "0009", topic: "data-replikasi", type: "oral",
    prompt: "\"Database Anda kewalahan oleh query baca. Apa yang Anda lakukan, berurutan, dan apa trade-off-nya?\" (60 detik)",
    sample: "\"Pertama ukur: lihat query paling lambat dan paling sering, jalankan EXPLAIN ANALYZE. Kalau ada Seq Scan di tabel besar, tambah index B-tree di kolom filter atau sort; itu sering cukup, dan harganya hanya write sedikit lebih lambat. Kalau sudah ber-index, sudah scale vertical, dan CPU database masih jenuh oleh read, saya tambah read replica: write tetap ke leader, read ke follower. Replikasinya asinkron, default PostgreSQL, supaya write tidak menunggu; konsekuensinya replication lag dan kemungkinan kehilangan transaksi terakhir kalau leader crash. Synchronous menghindari itu tapi menambah latency setiap commit. Untuk lag, data milik user sendiri sesaat setelah ia menulis dibaca dari leader (read-your-writes), dan replica yang lag-nya terlalu besar dikeluarkan dari pool.\"",
    checklist: [
      "ukur dulu (EXPLAIN / query paling lambat) sebelum menambah komponen",
      "index B-tree di kolom filter/sort, dengan biaya write lebih lambat",
      "leader-follower: write ke leader, read ke read replica",
      "async vs sync: async = latency rendah tapi lag dan risiko kehilangan data; sync = aman tapi write lebih lambat",
      "penanganan replication lag (baca dari leader setelah write, pantau lag)",
      "membenarkan replica dengan angka atau metrik (mis. CPU database jenuh oleh read setelah index)",
    ],
  },
]);
