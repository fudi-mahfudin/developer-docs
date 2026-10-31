// Soal lesson 0034 (track System Design, modul Studi kasus) · Chat (B): koneksi, presence, ordering. Format: assets/README.md.
// Sumber: https://www.rfc-editor.org/rfc/rfc6455.html#section-5.5.2 · https://nginx.org/en/docs/http/websocket.html ·
// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-execution-service-websocket-limits-table.html ·
// https://redis.io/docs/latest/develop/pubsub/ · https://redis.io/docs/latest/commands/expire/ ·
// https://kafka.apache.org/44/getting-started/introduction/#main-concepts-and-terminology · https://firebase.google.com/docs/cloud-messaging
QuestionBank.labelTopics({
  "kasus-chat-koneksi": "Studi kasus chat: koneksi WebSocket stateful, routing antar chat server, heartbeat, presence",
  "kasus-chat-ordering": "Studi kasus chat: ordering dengan seq per percakapan, gap, pesan offline dan push notification",
});

QuestionBank.register([
  {
    id: "0034-01", lesson: "0034", topic: "kasus-chat-koneksi", type: "mc",
    prompt: "User A terhubung ke chat server 3, user B ke chat server 7. Bagaimana pesan A sampai ke B?",
    options: {
      a: "Load balancer menyalin setiap pesan ke semua chat server",
      b: "Server 3 menunggu B pindah koneksi ke server 3",
      c: "Cari server B di registry, publish ke server 7",
      d: "B melakukan polling ke server 3 setiap dua detik",
    },
    answer: "c",
    explain: "Koneksi WebSocket stateful: B hanya bisa dicapai lewat server yang memegang koneksinya. Session registry (mis. Redis: user_id → server) memberi tahu server mana; server 3 mengirim pesan lewat channel pub/sub milik server 7, yang mendorongnya ke B.",
  },
  {
    id: "0034-02", lesson: "0034", topic: "kasus-chat-koneksi", type: "mc",
    prompt: "Chat server berada di belakang nginx. User yang diam lebih dari satu menit selalu terputus. Apa penyebab dan perbaikannya?",
    options: {
      a: "nginx menutup koneksi diam; kirim heartbeat tiap 30 detik",
      b: "WebSocket memang dibatasi satu menit oleh spesifikasi RFC 6455",
      c: "Database chat terlalu lambat; tambahkan read replica untuk pesan",
      d: "Browser mematikan tab diam; minta user tetap aktif mengetik",
    },
    answer: "a",
    explain: "Dokumentasi nginx: secara default koneksi ditutup kalau server yang di-proxy tidak mengirim data dalam 60 detik (bisa dinaikkan dengan proxy_read_timeout). Heartbeat, misalnya frame Ping WebSocket yang menurut RFC 6455 bisa berfungsi sebagai keepalive, menjaga koneksi tetap hidup.",
  },
  {
    id: "0034-03", lesson: "0034", topic: "kasus-chat-koneksi", type: "mc",
    prompt: "3 juta user online mengirim heartbeat setiap 30 detik. Bagaimana menyimpan presence (online/offline)?",
    options: {
      a: "Kolom is_online di PostgreSQL, hanya diubah saat logout saja",
      b: "Tanya setiap chat server satu per satu saat dibutuhkan",
      c: "Simpan di memori client, lalu kirim ke semua teman",
      d: "Key Redis dengan EXPIRE 60 detik, diperbarui tiap heartbeat",
    },
    answer: "d",
    explain: "3 × 10<sup>6</sup> ÷ 30 detik = ±100.000 penulisan per detik, cocok untuk Redis yang di-shard. Setiap heartbeat memperbarui key dengan TTL; kalau heartbeat berhenti (ponsel mati, sinyal hilang), key terhapus otomatis dan user dianggap offline tanpa perlu event logout.",
  },
  {
    id: "0034-04", lesson: "0034", topic: "kasus-chat-ordering", type: "mc",
    prompt: "Dua anggota grup mengirim pesan hampir bersamaan dari ponsel dengan jam yang berbeda. Bagaimana menentukan urutan yang sama untuk semua anggota?",
    options: {
      a: "Urutkan menurut timestamp dari jam ponsel masing-masing pengirim",
      b: "Server memberi seq naik per percakapan saat menyimpan",
      c: "Urutkan menurut waktu pesan tiba di setiap penerima",
      d: "Biarkan saja setiap anggota melihat urutan yang berbeda-beda",
    },
    answer: "b",
    explain: "Jam client tidak bisa dipercaya dan urutan tiba bisa berbeda per penerima. Satu penulis per percakapan memberi seq naik (mis. counter per conversation_id); urutan hanya perlu benar di dalam satu percakapan, tidak global. Dengan Kafka, key conversation_id memberi jaminan urutan yang sama di dalam satu partition.",
  },
  {
    id: "0034-05", lesson: "0034", topic: "kasus-chat-ordering", type: "mc",
    prompt: "Redis Pub/Sub bersifat at-most-once. Server 7 restart tepat saat pesan seq 5013 di-publish, jadi B tidak menerimanya. Bagaimana B tetap mendapatkannya?",
    options: {
      a: "Pesan tersimpan; B mengambil seq yang hilang dari database",
      b: "Pesan hilang permanen; pengirim harus mengetik ulang pesannya sendiri",
      c: "Redis otomatis mengirim ulang pesan setelah server 7 hidup",
      d: "Load balancer menyimpan salinan pesan sampai B tersambung lagi",
    },
    answer: "a",
    explain: "Redis Pub/Sub: pesan dikirim paling banyak sekali dan hilang kalau subscriber terputus. Karena pesan disimpan sebelum ack, pub/sub hanya jalur cepat. Saat B reconnect, atau melihat lompatan seq (5012 lalu 5014), client mengambil pesan setelah seq terakhirnya dari database.",
  },
  {
    id: "0034-06", lesson: "0034", topic: "kasus-chat-ordering", type: "mc",
    prompt: "B tidak punya koneksi aktif (tidak ada di registry). Apa yang dilakukan server saat pesan untuk B masuk?",
    options: {
      a: "Menolak pesan dan meminta pengirim mencoba lagi nanti saja",
      b: "Menyimpan pesan hanya di memori server sampai B kembali",
      c: "Simpan pesan, kirim push notification lewat FCM atau APNs",
      d: "Membuka koneksi WebSocket baru dari server ke ponsel B",
    },
    answer: "c",
    explain: "Pesan selalu disimpan dulu (sumber kebenaran). Untuk penerima offline, server meminta push notification lewat FCM/APNs; saat B membuka aplikasi, client terhubung dan mengambil pesan setelah seq terakhir per percakapan. Server tidak bisa membuka koneksi ke ponsel sendiri.",
  },
  {
    id: "0034-oral-1", lesson: "0034", topic: "kasus-chat-koneksi", type: "oral",
    prompt: "\"Desain v1 chat Anda satu chat server WebSocket. Bagaimana Anda mengembangkannya untuk 3 juta koneksi bersamaan, dengan presence, urutan pesan, dan pesan offline?\" (90 detik)",
    sample: "\"3 juta koneksi tidak muat di satu server, jadi saya jalankan banyak chat server di belakang load balancer yang mendukung WebSocket. Koneksinya stateful: B hanya bisa dicapai lewat server yang memegang koneksinya, jadi saya simpan session registry user ke server di Redis, dan server pengirim mem-publish pesan ke channel server penerima. Redis Pub/Sub at-most-once, tapi pesan sudah disimpan sebelum ack, jadi yang terlewat diambil ulang lewat seq. Heartbeat 30 detik menjaga koneksi tetap hidup, karena proxy seperti nginx menutup koneksi diam setelah 60 detik; heartbeat yang sama memperbarui key presence di Redis dengan TTL 60 detik, sekitar 100.000 penulisan per detik. Urutan memakai seq naik per percakapan yang diberi server, bukan jam client. Penerima offline mendapat push notification lewat FCM atau APNs, lalu saat terhubung mengirim seq terakhir per percakapan dan mengambil sisanya. Client juga harus siap reconnect dengan jitter, karena deploy atau batas durasi koneksi memutus koneksi.\"",
    checklist: [
      "banyak chat server + load balancer; koneksi stateful dan session registry user → server?",
      "routing antar server lewat pub/sub, dengan trade-off at-most-once yang ditutup oleh pesan tersimpan + seq?",
      "heartbeat (Ping/Pong) karena timeout koneksi diam, dan presence sebagai key dengan TTL?",
      "ordering: seq naik per percakapan dari server, bukan timestamp client; gap seq memicu pengambilan ulang?",
      "pesan offline: simpan dulu, push notification FCM/APNs, sinkron dari seq terakhir saat reconnect?",
      "membenarkan komponen dengan angka (banyak server karena 3 juta koneksi; Redis presence karena ±100.000 heartbeat/detik)?",
    ],
  },
]);
