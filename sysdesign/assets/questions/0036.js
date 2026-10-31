// Soal lesson 0036 (track System Design, Penutup) · Mock interview: typeahead/autocomplete. Format: assets/README.md.
// Sumber: https://www.postgresql.org/docs/current/indexes-opclass.html · https://www.postgresql.org/docs/current/using-explain.html ·
// https://www.rfc-editor.org/rfc/rfc9111.html#cache-response-directive.max-age · https://redis.io/docs/latest/develop/data-types/sorted-sets/ ·
// https://sre.google/sre-book/simplicity/
QuestionBank.labelTopics({
  "mock-typeahead-v1": "Mock typeahead: requirement, estimasi, API, dan desain v1",
  "mock-typeahead-skala": "Mock typeahead: bottleneck prefix pendek, top-k per prefix, cache",
});

QuestionBank.register([
  {
    id: "0036-01", lesson: "0036", topic: "mock-typeahead-v1", type: "mc",
    prompt: "Typeahead untuk 10 juta DAU, 10 pencarian per user per hari, dan ±4 request saran per pencarian setelah debounce. Berapa QPS rata-rata dan puncaknya (puncak 2× rata-rata)?",
    options: {
      a: "±400 QPS rata-rata, puncak ±800 QPS",
      b: "±4.000 QPS rata-rata, puncak ±8.000 QPS",
      c: "±40.000 QPS rata-rata, puncak ±80.000 QPS",
      d: "±40 QPS rata-rata, puncak ±80 QPS",
    },
    answer: "b",
    explain: "10<sup>7</sup> × 10 × 4 = 4 × 10<sup>8</sup> request per hari. Dibagi 10<sup>5</sup> detik per hari = 4.000 QPS rata-rata, puncak ±8.000 QPS. Tanpa debounce (satu request per huruf) angkanya bisa dua sampai tiga kali lipat.",
  },
  {
    id: "0036-02", lesson: "0036", topic: "mock-typeahead-v1", type: "mc",
    prompt: "Desain v1 typeahead memakai satu PostgreSQL dengan tabel <code>term_counts(term, count)</code>. Query dan index mana yang paling sederhana dan masih masuk akal?",
    options: {
      a: "Full scan tabel term setiap ketikan tanpa index",
      b: "Cluster Elasticsearch terpisah sejak hari pertama, tanpa pengukuran",
      c: "Sharding tabel term per huruf pertama sejak awal",
      d: "<code>LIKE 'ind%'</code> dengan B-tree <code>text_pattern_ops</code>, lalu <code>LIMIT 10</code>",
    },
    answer: "d",
    explain: "Dokumentasi PostgreSQL: operator class <code>text_pattern_ops</code> membandingkan karakter demi karakter sehingga cocok untuk query pola seperti <code>LIKE</code> kalau database tidak memakai locale \"C\". Satu index cukup untuk v1; search engine terpisah dan sharding belum dibenarkan angka mana pun.",
  },
  {
    id: "0036-03", lesson: "0036", topic: "mock-typeahead-v1", type: "mc",
    prompt: "Requirement menyebut urutan popularitas saran boleh telat ±1 jam. Apa akibatnya untuk desain v1?",
    options: {
      a: "Hitungan populer cukup dihitung ulang oleh batch job per jam",
      b: "Setiap ketikan harus menulis counter ke database secara sinkron langsung",
      c: "Butuh Kafka dan stream processing real-time untuk semua pencarian user",
      d: "Saran harus selalu dibaca dari primary dengan strong consistency penuh",
    },
    answer: "a",
    explain: "Toleransi 1 jam berarti eventual consistency sudah diizinkan. Batch job yang membaca log pencarian setiap jam adalah jalur paling murah; stream processing real-time adalah komponen tanpa alasan (over-engineering) untuk requirement ini.",
  },
  {
    id: "0036-04", lesson: "0036", topic: "mock-typeahead-skala", type: "mc",
    prompt: "Setelah diukur dengan <code>EXPLAIN ANALYZE</code>, p99 v1 melewati 100 ms hanya untuk prefix pendek seperti \"a\". Apa penyebab paling mungkin dan perbaikan termurahnya?",
    options: {
      a: "Jaringan antarbenua terlalu lambat; pindahkan seluruh database ke region lain",
      b: "App server kurang; tambah sepuluh instance di belakang load balancer",
      c: "Prefix pendek cocok jutaan baris; precompute tabel top-10 per prefix",
      d: "Index rusak; ganti PostgreSQL dengan database NoSQL graph yang cepat",
    },
    answer: "c",
    explain: "Index menemukan baris yang cocok, tapi <code>ORDER BY count</code> tetap harus menimbang semua baris yang diawali \"a\". Batch job yang sama bisa menulis tabel <code>prefix_topk(prefix, suggestions)</code>, sehingga baca menjadi satu lookup primary key. Ini trie yang \"diratakan\" ke tabel.",
  },
  {
    id: "0036-05", lesson: "0036", topic: "mock-typeahead-skala", type: "mc",
    prompt: "Saran untuk satu prefix hanya berubah setiap jam. Cara termurah apa untuk mengurangi 8.000 QPS yang sampai ke server?",
    options: {
      a: "Sharding tabel prefix ke delapan database per huruf",
      b: "<code>Cache-Control: max-age=3600</code> supaya browser dan CDN menyimpan respons",
      c: "Pecah layanan saran menjadi tiga microservices yang terpisah",
      d: "Ganti HTTP dengan WebSocket persistent untuk setiap user",
    },
    answer: "b",
    explain: "RFC 9111: <code>max-age</code> menandai respons basi setelah umurnya melewati jumlah detik yang disebut. Prefix pendek sangat populer, jadi respons yang sama dipakai berulang kali dari cache browser atau CDN tanpa komponen baru. Sharding untuk ±6 GB data belum perlu.",
  },
  {
    id: "0036-oral-1", lesson: "0036", topic: "mock-typeahead-v1", type: "oral",
    prompt: "\"Rancang sistem typeahead (autocomplete) untuk kotak pencarian dengan 10 juta DAU. Anda punya 45 menit.\" (mock penuh, 45 menit)",
    sample: "\"Saya klarifikasi dulu: saran 10 teratas yang diawali prefix, diurutkan popularitas; 10 juta DAU, 10 pencarian per hari; p99 di bawah 100 ms karena user sedang mengetik; popularitas boleh telat satu jam. Estimasinya: dengan debounce sekitar 4 request per pencarian, jadi 4 × 10⁸ per hari, sekitar 4.000 QPS rata-rata dan 8.000 puncak; data saran sekitar 6 GB. API-nya GET /suggest?q=. v1 sederhana dulu: satu app server dan PostgreSQL, tabel term_counts dengan index text_pattern_ops, query LIKE prefix ORDER BY count LIMIT 10, dan batch job per jam yang menghitung ulang dari log. Setelah saya ukur, prefix pendek akan lambat karena cocok dengan jutaan baris, jadi batch job yang sama menulis tabel prefix_topk sehingga baca menjadi satu lookup primary key. Karena saran hanya berubah tiap jam, saya pasang Cache-Control max-age=3600 supaya browser dan CDN menyerap prefix populer. Server kedua di belakang load balancer untuk availability. Sharding belum perlu karena 6 GB muat di satu node; Kafka real-time juga tidak, karena requirement mengizinkan telat satu jam.\"",
    checklist: [
      "requirement dalam angka: DAU, p99 < 100 ms, popularitas boleh telat ±1 jam?",
      "estimasi: ±4.000 QPS rata-rata, puncak ±8.000, data saran ±6 GB?",
      "API GET /suggest?q= dan data model term_counts lalu prefix_topk?",
      "v1 sederhana dulu: satu app server + PostgreSQL dengan index prefix, satu request ditelusuri?",
      "bottleneck prefix pendek diukur dulu, lalu top-k per prefix dan Cache-Control?",
      "setiap komponen dibenarkan dengan angka (cache untuk 8.000 QPS, sharding belum perlu untuk 6 GB)?",
    ],
  },
]);
