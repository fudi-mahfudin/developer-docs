// Soal lesson 0028 (track System Design, modul Studi kasus) · URL shortener. Format: assets/README.md.
// Sumber: https://www.rfc-editor.org/rfc/rfc9110.html#status.301 · https://www.rfc-editor.org/rfc/rfc9110.html#status.302 ·
// https://www.postgresql.org/docs/current/sql-createsequence.html · https://www.postgresql.org/docs/current/ddl-constraints.html · https://redis.io/docs/latest/develop/reference/eviction/
QuestionBank.labelTopics({
  "kasus-url-kode": "Studi kasus URL shortener: base62 vs hash, panjang kode, collision",
  "kasus-url-redirect": "Studi kasus URL shortener: jalur baca, cache, redirect 301 vs 302",
});

QuestionBank.register([
  {
    id: "0028-01", lesson: "0028", topic: "kasus-url-kode", type: "mc",
    prompt: "Kode 7 karakter base62 punya berapa kemungkinan, dan cukupkah untuk ±1,8 × 10<sup>9</sup> URL dalam 5 tahun?",
    options: {
      a: "Sekitar 1 juta kombinasi, jadi jauh dari cukup",
      b: "Sekitar 1 miliar kombinasi, jadi masih belum cukup",
      c: "Sekitar 3,5 triliun kombinasi, jadi lebih dari cukup",
      d: "Sekitar 62 ribu kombinasi, jadi perlu kode panjang",
    },
    answer: "c",
    explain: "62<sup>7</sup> ≈ 3,5 × 10<sup>12</sup>, sekitar 2.000 kali jumlah URL 5 tahun. Bahkan 6 karakter (62<sup>6</sup> ≈ 5,7 × 10<sup>10</sup>) masih cukup.",
  },
  {
    id: "0028-02", lesson: "0028", topic: "kasus-url-kode", type: "mc",
    prompt: "Kode dibuat dari 7 karakter pertama hash URL. Konsekuensi apa yang wajib ditangani?",
    options: {
      a: "Collision: cek unique constraint lalu ulangi dengan salt",
      b: "Kode berurutan sehingga mudah ditebak oleh orang lain",
      c: "Butuh satu counter pusat yang menjadi titik kegagalan",
      d: "Redirect harus memakai 302 karena hash tidak stabil",
    },
    answer: "a",
    explain: "Hash yang dipotong pasti bentrok di skala miliaran (perkiraan birthday ±4,6 × 10<sup>5</sup> pasangan). Unique constraint di PostgreSQL menolak insert yang bentrok, lalu kode dihitung ulang dengan salt. Kode berurutan dan counter pusat adalah kelemahan pendekatan counter, bukan hash.",
  },
  {
    id: "0028-03", lesson: "0028", topic: "kasus-url-redirect", type: "mc",
    prompt: "Tim produk ingin menghitung setiap klik dan bisa mengubah tujuan link. Status redirect mana yang tepat?",
    options: {
      a: "301, karena browser menyimpan redirect dan mengurangi beban",
      b: "200, karena halaman tujuan langsung dikirim oleh server",
      c: "404, karena kode pendek tidak pernah disimpan permanen",
      d: "302, karena client tetap memakai URL pendek berikutnya",
    },
    answer: "d",
    explain: "RFC 9110: untuk 302 \"the client ought to continue to use the target URI for future requests\", jadi setiap klik sampai ke server dan bisa dihitung. 301 \"is heuristically cacheable\", sehingga browser bisa melewati server dan analytics hilang.",
  },
  {
    id: "0028-04", lesson: "0028", topic: "kasus-url-redirect", type: "mc",
    prompt: "Estimasi: 3.000 QPS baca di puncak, dan sebagian kecil link melayani mayoritas klik. Apa langkah pertama yang dibenarkan?",
    options: {
      a: "Shard database sekarang juga memakai consistent hashing ring",
      b: "Ukur p99 database, lalu tambah cache-aside bila perlu",
      c: "Pecah service redirect dan service pembuat menjadi microservices",
      d: "Ganti PostgreSQL dengan Kafka supaya baca lebih cepat",
    },
    answer: "b",
    explain: "Ukur dulu, lalu perubahan termurah. Akses yang condong ke sebagian kecil link cocok untuk cache dengan allkeys-lru (saran Redis untuk pola ini). Sharding belum perlu untuk ±1 TB dan 30 QPS tulis; microservices dan Kafka tidak menyelesaikan bottleneck baca.",
  },
  {
    id: "0028-oral-1", lesson: "0028", topic: "kasus-url-redirect", type: "oral",
    prompt: "\"Rancang URL shortener untuk 1 juta URL baru per hari. Mulai dari v1, lalu jelaskan evolusinya.\" (90 detik)",
    sample: "\"Dengan rasio baca:tulis 100:1, tulisnya sekitar 10 QPS dan baca 1.000 QPS, puncak sekitar 3.000; dalam 5 tahun ada 1,8 miliar URL, sekitar 1 TB. Tujuh karakter base62 memberi 3,5 triliun kombinasi, jadi cukup. Kodenya saya buat dari sequence database lalu di-encode base62, jadi tidak ada collision; kalau pakai hash, saya harus menangkap collision dengan unique constraint dan mengulang dengan salt. v1-nya satu app server dan satu PostgreSQL dengan kode sebagai primary key. Untuk availability 99,9% saya tambah server kedua di belakang load balancer. Setelah mengukur p99 baca di puncak, saya tambah cache-aside di Redis untuk link populer, sekitar 5 GB. Redirect saya pakai 302 supaya setiap klik terhitung; 301 mengurangi beban karena browser menyimpannya, tapi analytics hilang. Sharding belum perlu karena 1 TB dan 30 QPS tulis masih muat di satu node.\"",
    checklist: [
      "estimasi: ±10 QPS tulis, ±1.000 QPS baca (puncak ±3.000), ±1 TB dalam 5 tahun?",
      "kode base62 dari sequence, atau hash dengan penanganan collision, dan 7 karakter cukup?",
      "v1: app server dan satu database dengan kode sebagai primary key?",
      "301 (cacheable, beban turun) vs 302 (setiap klik terhitung, link bisa diubah)?",
      "cache-aside untuk link populer setelah mengukur p99 atau beban database?",
      "membenarkan komponen dengan angka (LB untuk availability, cache untuk QPS baca, sharding belum perlu)?",
    ],
  },
]);
