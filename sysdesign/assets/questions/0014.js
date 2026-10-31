// Soal lesson 0014 (track System Design, modul Caching) · TTL, eviction (LRU/LFU), invalidation, stale data. Format: assets/README.md.
// Sumber: https://redis.io/docs/latest/commands/expire/ · https://redis.io/docs/latest/develop/reference/eviction/ ·
// https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html · https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside ·
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html · https://redis.io/docs/latest/develop/reference/client-side-caching/
QuestionBank.labelTopics({
  "cache-ttl-eviction": "Caching: TTL dan eviction policy (LRU/LFU)",
  "cache-invalidation": "Caching: invalidation dan stale data",
});

QuestionBank.register([
  {
    id: "0014-01", lesson: "0014", topic: "cache-ttl-eviction", type: "mc",
    prompt: "Redis dikonfigurasi <code>maxmemory 2gb</code> dan memori sudah penuh. Nilai <code>maxmemory-policy</code> mana yang membuang key dengan <strong>frekuensi</strong> akses paling rendah, dari semua key?",
    options: {
      a: "<code>noeviction</code>",
      b: "<code>volatile-ttl</code>",
      c: "<code>allkeys-lfu</code>",
      d: "<code>allkeys-lru</code>",
    },
    answer: "c",
    explain: "Dokumentasi Redis: allkeys-lfu membuang key yang paling jarang dipakai (least frequently used); allkeys-lru membuang yang paling lama tidak dipakai (least recently used); volatile-ttl memilih key ber-TTL dengan sisa TTL terpendek; noeviction tidak membuang apa pun dan mengembalikan error saat ada write baru.",
  },
  {
    id: "0014-02", lesson: "0014", topic: "cache-invalidation", type: "mc",
    prompt: "File <code>app.css</code> berubah di setiap rilis dan di-cache oleh CloudFront. Cara apa yang direkomendasikan dokumentasi CloudFront untuk file yang sering diperbarui?",
    options: {
      a: "nama file berversi, misalnya <code>app.3f9a.css</code>",
      b: "invalidation manual di setiap rilis",
      c: "TTL nol, selalu ambil origin",
      d: "matikan cache untuk file statis",
    },
    answer: "a",
    explain: "CloudFront: kalau file sering diperbarui, gunakan terutama file versioning. Nama berversi juga mengalahkan salinan lama di browser dan proxy perusahaan, memudahkan rollback, dan lebih murah karena invalidation dikenai biaya. TTL nol atau mematikan cache membuang manfaat CDN.",
  },
  {
    id: "0014-03", lesson: "0014", topic: "cache-ttl-eviction", type: "mc",
    prompt: "Apa beda <strong>TTL</strong> dan <strong>eviction</strong> di Redis?",
    options: {
      a: "keduanya sama-sama berbasis jumlah memori terpakai",
      b: "TTL dipicu memori, eviction dipicu waktu",
      c: "eviction hanya berlaku untuk key ber-TTL",
      d: "TTL berbasis waktu, eviction dipicu memori",
    },
    answer: "d",
    explain: "EXPIRE memasang timeout: setelah waktunya lewat, key dihapus otomatis. Eviction terjadi ketika data melewati batas maxmemory, dan maxmemory-policy menentukan key mana yang dibuang. Kebijakan allkeys-* boleh membuang key tanpa TTL; hanya volatile-* yang terbatas pada key ber-TTL.",
  },
  {
    id: "0014-04", lesson: "0014", topic: "cache-invalidation", type: "mc",
    prompt: "Dengan cache-aside dan TTL 10 menit, harga produk diubah di database, tetapi kode lupa menghapus key cache. Apa yang dilihat user?",
    options: {
      a: "harga baru, karena Redis memantau database",
      b: "harga lama sampai key cache kedaluwarsa",
      c: "error, karena cache dan database berbeda",
      d: "harga baru, karena TTL langsung direset",
    },
    answer: "b",
    explain: "ElastiCache: kalau data hanya ditulis ke cache saat miss, cache bisa basi karena tidak ikut diperbarui saat database berubah; TTL membatasi seberapa lama basinya. Azure: perubahan di data store tidak terlihat di cache sampai item dimuat ulang. Cache tidak memantau database dengan sendirinya.",
  },
  {
    id: "0014-05", lesson: "0014", topic: "cache-ttl-eviction", type: "mc",
    prompt: "Dokumentasi Azure memperingatkan agar TTL (expiration) tidak dibuat terlalu pendek. Kenapa?",
    options: {
      a: "Redis menolak TTL yang pendek",
      b: "data menjadi basi lebih lama",
      c: "miss terus, database terus dibebani",
      d: "eviction LRU berhenti bekerja sementara",
    },
    answer: "c",
    explain: "Azure: kedaluwarsa yang terlalu cepat membuat aplikasi terus mengambil data dari data store dan mengisinya lagi ke cache; terlalu lama membuat data basi. TTL harus mengikuti pola akses data. Redis menerima TTL dalam detik atau milidetik.",
  },
  {
    id: "0014-oral-1", lesson: "0014", topic: "cache-invalidation", type: "oral",
    prompt: "\"Admin mengubah harga produk, tapi halaman produk masih menampilkan harga lama selama beberapa menit. Jelaskan penyebabnya dan cara Anda memperbaikinya tanpa over-engineering.\" (60 detik)",
    sample: "\"Penyebabnya stale data: cache masih memegang nilai lama sampai TTL habis, karena write tidak menghapus key. Pertama saya tanya requirement: harga boleh basi berapa lama? Kalau beberapa detik saja, perbaikan termurah adalah invalidation saat write: update database dulu, lalu hapus key; TTL tetap dipasang sebagai jaring pengaman kalau delete gagal. Saya cek juga lapisan lain: kalau halaman di-cache CDN atau browser, saya pakai URL berversi atau invalidation CDN. Push invalidation ke local cache di setiap instance, lewat pub/sub atau Redis tracking, baru saya tambahkan kalau angka menuntut, misalnya puluhan instance dengan local cache dan staleness harus di bawah TTL.\"",
    checklist: [
      "Menjelaskan penyebab: cache memegang nilai lama sampai TTL habis (stale data)",
      "Menyebut invalidation saat write: update database dulu, lalu hapus key",
      "Menyebut TTL sebagai jaring pengaman bila delete gagal",
      "Memeriksa lapisan lain (CDN/browser): URL berversi atau invalidation CDN",
      "Menanyakan toleransi staleness dari requirement sebelum memilih mekanisme",
      "Membenarkan push invalidation (pub/sub, tracking) dengan angka, bukan sebagai default",
    ],
  },
]);
