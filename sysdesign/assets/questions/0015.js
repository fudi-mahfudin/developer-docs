// Soal lesson 0015 (track System Design, modul Caching) · Cache stampede, request coalescing, hot key, cache berlapis. Format: assets/README.md.
// Sumber: https://www.vldb.org/pvldb/vol8/p886-vattani.pdf · https://www.rfc-editor.org/rfc/rfc9111.html · https://www.rfc-editor.org/rfc/rfc5861.html ·
// https://nginx.org/en/docs/http/ngx_http_proxy_module.html · https://redis.io/docs/latest/develop/reference/client-side-caching/ ·
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-sharding.html · https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html
QuestionBank.labelTopics({
  "cache-stampede": "Caching: cache stampede (thundering herd) dan request coalescing",
  "cache-hot-key": "Caching: hot key dan cache berlapis",
});

QuestionBank.register([
  {
    id: "0015-01", lesson: "0015", topic: "cache-stampede", type: "mc",
    prompt: "Key <code>homepage:feed</code> dibaca 5.000 kali per detik dan butuh 2 detik untuk dihitung ulang dari database. Saat TTL-nya habis, apa yang terjadi tanpa proteksi apa pun?",
    options: {
      a: "banyak request miss, semua menghitung ulang",
      b: "Redis otomatis memperpanjang TTL key populer",
      c: "hanya satu request yang ke database",
      d: "request ditolak sampai key terisi lagi",
    },
    answer: "a",
    explain: "Inilah cache stampede (disebut juga dog-piling): item populer kedaluwarsa, banyak request melihat miss dan meregenerasi item yang sama pada saat bersamaan (Vattani et al., VLDB 2015). Selama 2 detik hitung ulang, ribuan request bisa ikut menghantam database. Cache tidak memperpanjang TTL sendiri.",
  },
  {
    id: "0015-02", lesson: "0015", topic: "cache-hot-key", type: "mc",
    prompt: "Satu key (mis. profil seorang selebritas) menerima jauh lebih banyak traffic daripada key lain dan membebani satu node Redis. Mitigasi mana yang paling umum?",
    options: {
      a: "tambah node, karena key tersebar otomatis",
      b: "turunkan TTL key itu jadi sedetik",
      c: "local cache aplikasi atau salinan key",
      d: "pindahkan key itu ke database relasional",
    },
    answer: "c",
    explain: "Satu key selalu tinggal di satu node, jadi menambah node tidak memecah beban key itu. Simpan salinannya di local cache aplikasi (Redis client-side caching: sebagian kecil data sering diakses berulang, memori lokal jauh lebih cepat), atau tulis beberapa salinan dengan suffix (key#1..key#N) lalu baca salah satunya secara acak, mirip write sharding dengan suffix acak di DynamoDB.",
  },
  {
    id: "0015-03", lesson: "0015", topic: "cache-stampede", type: "mc",
    prompt: "Direktif nginx <code>proxy_cache_lock on</code> mengatasi stampede dengan cara ...",
    options: {
      a: "menolak semua request saat cache kosong",
      b: "hanya satu request mengisi elemen cache",
      c: "memperpanjang TTL setiap kali key dibaca",
      d: "menyalin cache ke semua worker nginx",
    },
    answer: "b",
    explain: "nginx: saat aktif, hanya satu request pada satu waktu yang boleh mengisi elemen cache baru; request lain untuk elemen yang sama menunggu respons muncul di cache atau lock dilepas (sampai proxy_cache_lock_timeout). Ini request coalescing, yang oleh RFC 9111 disebut \"collapse requests\".",
  },
  {
    id: "0015-04", lesson: "0015", topic: "cache-hot-key", type: "mc",
    prompt: "Cache berlapis: CloudFront Origin Shield ditempatkan di antara regional edge cache dan origin. Apa manfaat utamanya menurut dokumentasi AWS?",
    options: {
      a: "mengenkripsi respons sebelum dikirim ke user",
      b: "menghapus kebutuhan TTL di semua edge",
      c: "membuat origin bisa menerima write langsung",
      d: "miss digabung, origin menerima lebih sedikit",
    },
    answer: "d",
    explain: "CloudFront: request untuk konten yang belum ada di cache Origin Shield digabung dengan request lain untuk objek yang sama, sehingga bisa hanya satu request yang sampai ke origin. Hasilnya cache hit ratio naik dan beban origin turun saat lonjakan traffic.",
  },
  {
    id: "0015-05", lesson: "0015", topic: "cache-stampede", type: "mc",
    prompt: "Header <code>Cache-Control: max-age=600, stale-while-revalidate=30</code> berarti ...",
    options: {
      a: "segar 600 detik, boleh basi 30 detik sambil revalidasi",
      b: "segar 30 detik, lalu revalidasi tiap 600 detik sekali",
      c: "segar 630 detik, setelah itu cache wajib menolak request",
      d: "segar 600 detik, lalu 30 detik cache dimatikan total",
    },
    answer: "a",
    explain: "RFC 5861: respons segar selama 600 detik, lalu boleh terus disajikan basi sampai 30 detik tambahan sementara validasi asinkron dicoba, tanpa memblokir request. User tidak menunggu hitung ulang, dan hanya revalidasi di belakang yang menyentuh origin.",
  },
  {
    id: "0015-oral-1", lesson: "0015", topic: "cache-stampede", type: "oral",
    prompt: "\"Halaman utama Anda di-cache dengan TTL 60 detik. Setiap kali TTL habis, CPU database melonjak ke 100% selama beberapa detik. Apa yang terjadi, dan bagaimana Anda memperbaikinya?\" (60 detik)",
    sample: "\"Ini cache stampede atau thundering herd: key populer kedaluwarsa, ribuan request miss bersamaan dan semuanya menghitung ulang ke database. Angkanya: kalau key dibaca 5.000 kali per detik dan hitung ulang 2 detik, ribuan query datang serentak. Perbaikan pertama adalah request coalescing: hanya satu request yang mengisi ulang, misalnya dengan lock SET NX EX di Redis atau proxy_cache_lock di nginx, sementara yang lain menunggu atau memakai nilai lama. Lebih baik lagi serve stale while revalidate, jadi user tetap dapat nilai lama sambil satu proses me-refresh di belakang. Saya tambahkan jitter pada TTL atau early expiration probabilistik supaya key tidak kedaluwarsa bersamaan. Lock wajib punya TTL, karena kalau pemegangnya crash, tidak ada yang mengisi ulang. Di QPS rendah semua ini tidak perlu.\"",
    checklist: [
      "Menamai masalahnya: cache stampede/thundering herd, banyak miss bersamaan untuk key yang sama",
      "Request coalescing atau lock: hanya satu request yang mengisi ulang",
      "Serve stale while revalidate atau refresh di background supaya user tidak menunggu",
      "Jitter pada TTL atau early expiration probabilistik supaya tidak kedaluwarsa serentak",
      "Risiko lock: pemegang lock gagal, jadi lock butuh TTL (mis. SET NX EX)",
      "Membenarkan dengan angka: QPS key × waktu hitung ulang; di QPS rendah proteksi tidak perlu",
    ],
  },
]);
