// Soal lesson 0013 (track System Design, modul Caching) · Di mana cache berada; cache-aside, read-through, write-through, write-behind. Format: assets/README.md.
// Sumber: https://www.rfc-editor.org/rfc/rfc9111.html · https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-hit-ratio.html ·
// https://redis.io/docs/latest/develop/reference/client-side-caching/ · https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside ·
// https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html · https://docs.oracle.com/en/middleware/standalone/coherence/14.1.1.0/develop-applications/caching-data-sources.html
QuestionBank.labelTopics({
  "cache-lokasi": "Caching: di mana cache berada (browser, CDN, proxy, local, distributed)",
  "cache-pola": "Caching: pola cache-aside, read-through, write-through, write-behind",
});

QuestionBank.register([
  {
    id: "0013-01", lesson: "0013", topic: "cache-lokasi", type: "mc",
    prompt: "Tim Anda menambahkan header <code>Cache-Control: max-age=3600</code> pada respons gambar produk. Lapisan cache mana yang langsung bisa memakainya tanpa komponen baru?",
    options: {
      a: "hanya Redis di belakang aplikasi",
      b: "browser dan CDN di jalur",
      c: "buffer pool milik database PostgreSQL",
      d: "local cache di proses aplikasi",
    },
    answer: "b",
    explain: "Header Cache-Control adalah HTTP caching (RFC 9111): dipakai oleh private cache (browser) dan shared cache (CDN, reverse proxy) di jalur request. Dokumentasi CloudFront menyarankan origin menambah max-age untuk menaikkan cache hit ratio. Redis dan local cache hanya dipakai kalau kode aplikasi memanggilnya.",
  },
  {
    id: "0013-02", lesson: "0013", topic: "cache-pola", type: "mc",
    prompt: "Pada pola <strong>cache-aside</strong>, siapa yang membaca database saat terjadi cache miss, lalu mengisi cache?",
    options: {
      a: "cache itu sendiri lewat loader",
      b: "database yang mendorong data otomatis",
      c: "load balancer di depan aplikasi",
      d: "kode aplikasi yang memanggil cache",
    },
    answer: "d",
    explain: "Azure Architecture Center: aplikasi mencoba membaca cache; kalau miss, aplikasi mengambil item dari data store, menambahkannya ke cache, lalu mengembalikannya. Kalau cache sendiri yang memanggil loader ke database, itu read-through (Oracle Coherence: cache mendelegasikan ke CacheStore).",
  },
  {
    id: "0013-03", lesson: "0013", topic: "cache-lokasi", type: "mc",
    prompt: "Lima instance aplikasi masing-masing punya local cache in-process untuk data profil user. Risiko utama dibanding satu distributed cache bersama adalah ...",
    options: {
      a: "salinan antar-instance cepat tidak konsisten",
      b: "latency baca jauh lebih lambat",
      c: "database tidak bisa lagi diindeks",
      d: "header HTTP tidak lagi dihormati",
    },
    answer: "a",
    explain: "Azure: local cache bersifat private, jadi tiap instance bisa menyimpan salinan sendiri yang cepat menjadi tidak konsisten; pertimbangkan shared/distributed cache. Latency justru lebih kecil: dokumentasi Redis client-side caching menyebut akses memori lokal lebih cepat beberapa orde besaran dibanding layanan lewat jaringan.",
  },
  {
    id: "0013-04", lesson: "0013", topic: "cache-pola", type: "mc",
    prompt: "Pola mana yang membuat write terasa cepat karena cache menulis ke database secara asinkron belakangan, dengan risiko data hilang bila node cache mati sebelum antrean ditulis?",
    options: {
      a: "cache-aside dengan delete saat write",
      b: "read-through dengan loader di cache",
      c: "write-behind dengan antrean tulis tertunda",
      d: "write-through dengan dua penulisan sinkron",
    },
    answer: "c",
    explain: "Oracle Coherence: pada write-behind, entri yang berubah ditulis ke data source secara asinkron setelah jeda; selama antrean belum ditulis, cache praktis menjadi system of record. Write-through justru menunggu sampai data tersimpan di data source sebelum put selesai.",
  },
  {
    id: "0013-05", lesson: "0013", topic: "cache-pola", type: "mc",
    prompt: "Saat mengubah data dengan pola cache-aside, urutan mana yang dianjurkan dokumentasi Azure supaya cache tidak terisi ulang dengan data lama?",
    options: {
      a: "hapus cache dulu, lalu update database",
      b: "update database dulu, lalu hapus cache",
      c: "update cache dulu, lalu update database",
      d: "update database saja, biarkan TTL bekerja",
    },
    answer: "b",
    explain: "Azure: update data store sebelum menghapus item dari cache. Kalau cache dihapus dulu, ada jendela waktu ketika client lain miss, membaca nilai lama dari database, dan menaruhnya kembali ke cache. Mengandalkan TTL saja berarti data lama tetap tersaji sampai kedaluwarsa.",
  },
  {
    id: "0013-oral-1", lesson: "0013", topic: "cache-pola", type: "oral",
    prompt: "\"Katalog produk Anda read-heavy dan database mulai lambat. Pola cache apa yang Anda pakai, bagaimana alur baca dan tulisnya, dan kapan Anda tidak memakai cache sama sekali?\" (60 detik)",
    sample: "\"Pertama saya ukur: kalau p99 lambat karena query tanpa index, saya perbaiki query dulu, itu lebih murah. Kalau rasio baca:tulis tinggi, misalnya 100:1, dan data yang sama dibaca berulang, saya pakai cache-aside di Redis bersama: baca cache, kalau miss baca database lalu isi cache dengan TTL. Saat write, update database dulu lalu hapus key-nya. Write-through membuat cache selalu segar tapi setiap write jadi dua trip; write-behind cepat tapi bisa kehilangan data kalau cache mati sebelum flush, jadi tidak untuk katalog berharga. Gambar produk cukup diberi header Cache-Control supaya browser dan CDN yang menyimpannya.\"",
    checklist: [
      "Menyebut cache-aside: baca cache, miss → baca database → isi cache",
      "Menyebut urutan write: update database dulu, lalu hapus key cache",
      "Membandingkan dengan write-through (selalu segar, dua trip) atau write-behind (cepat, risiko data hilang)",
      "Menyebut TTL sebagai pengaman terhadap stale data",
      "Memilih lokasi: header HTTP/CDN untuk konten publik, cache bersama untuk data dinamis",
      "Membenarkan cache dengan angka (rasio baca:tulis, hit ratio, p99) setelah query/index diperiksa",
    ],
  },
]);
