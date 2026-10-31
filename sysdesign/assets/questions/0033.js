// Soal lesson 0033 (track System Design, modul Studi kasus) · Chat (A): langkah 1–4. Format: assets/README.md.
// Sumber: https://www.rfc-editor.org/rfc/rfc6455.html · https://www.rfc-editor.org/rfc/rfc6202.html ·
// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html ·
// https://cassandra.apache.org/doc/latest/cassandra/developing/data-modeling/intro.html
QuestionBank.labelTopics({
  "kasus-chat-protokol": "Studi kasus chat: polling vs long polling vs WebSocket, estimasi koneksi bersamaan",
  "kasus-chat-data": "Studi kasus chat: data model pesan, partition key conversation_id, sequence, estimasi storage",
});

QuestionBank.register([
  {
    id: "0033-01", lesson: "0033", topic: "kasus-chat-protokol", type: "mc",
    prompt: "3 juta client online melakukan polling <code>GET /messages</code> setiap 2 detik, padahal pesan nyata hanya ±12.000 per detik pada puncak. Berapa beban polling-nya?",
    options: {
      a: "±12.000 request per detik, sama dengan jumlah pesan",
      b: "±6.000 request per detik, karena separuh client diam",
      c: "±3 juta request per detik, satu per client",
      d: "±1,5 juta request per detik, hampir semuanya kosong",
    },
    answer: "d",
    explain: "3 × 10<sup>6</sup> ÷ 2 detik = 1,5 juta request per detik, dan lebih dari 99% tidak membawa pesan. Setiap request juga membawa header HTTP lengkap. Angka ini membenarkan koneksi persisten (WebSocket) di langkah 3.",
  },
  {
    id: "0033-02", lesson: "0033", topic: "kasus-chat-protokol", type: "mc",
    prompt: "Kenapa chat memakai WebSocket, bukan polling HTTP biasa?",
    options: {
      a: "Koneksi dua arah; server mendorong pesan kapan saja",
      b: "WebSocket otomatis menyimpan riwayat pesan di sisi server",
      c: "WebSocket menjamin pesan sampai walau client sedang offline",
      d: "Polling dilarang oleh browser modern sejak HTTP/2 dirilis",
    },
    answer: "a",
    explain: "RFC 6455 dibuat untuk aplikasi yang butuh komunikasi dua arah tanpa membuka banyak koneksi HTTP; dengan polling, setiap pesan membawa header HTTP dan server butuh koneksi terpisah. Riwayat dan pesan offline tetap tanggung jawab aplikasi.",
  },
  {
    id: "0033-03", lesson: "0033", topic: "kasus-chat-protokol", type: "mc",
    prompt: "Bagaimana koneksi WebSocket dibuka?",
    options: {
      a: "Lewat koneksi UDP baru di port khusus WebSocket",
      b: "Client mengirim email konfirmasi, lalu server segera membalasnya",
      c: "Request HTTP Upgrade, lalu dibalas <code>101 Switching Protocols</code>",
      d: "Server membuka koneksi ke client setiap ada pesan",
    },
    answer: "c",
    explain: "Opening handshake WebSocket (RFC 6455) adalah request HTTP dengan header Upgrade; server menjawab HTTP/1.1 101 Switching Protocols, lalu koneksi TCP yang sama dipakai untuk frame WebSocket dua arah.",
  },
  {
    id: "0033-04", lesson: "0033", topic: "kasus-chat-data", type: "mc",
    prompt: "Query paling sering adalah \"50 pesan terakhir di percakapan X\". Primary key mana yang cocok untuk tabel <code>messages</code>?",
    options: {
      a: "Partition key sender_id, supaya pesan per pengirim berkumpul",
      b: "Partition key conversation_id, clustering key seq secara menurun",
      c: "Partition key created_at, supaya pesan terurut menurut waktu",
      d: "Partition key message_id acak, supaya data tersebar merata",
    },
    answer: "b",
    explain: "Di Cassandra, field pertama primary key menjadi partition key dan sisanya clustering key yang mengurutkan data di dalam partition. Satu percakapan = satu partition, terurut menurut seq, sehingga 50 pesan terakhir dibaca berurutan dari satu tempat.",
  },
  {
    id: "0033-05", lesson: "0033", topic: "kasus-chat-data", type: "mc",
    prompt: "±4 × 10<sup>8</sup> pesan per hari, ±200 byte per pesan, disimpan selamanya. Berapa pertumbuhan storage-nya?",
    options: {
      a: "±80 MB per hari, cukup di satu laptop",
      b: "±800 GB per hari, ±290 PB per tahun",
      c: "±8 GB per hari, ±3 TB per tahun",
      d: "±80 GB per hari, ±29 TB per tahun",
    },
    answer: "d",
    explain: "4 × 10<sup>8</sup> × 200 byte = 8 × 10<sup>10</sup> byte ≈ 80 GB per hari; × 365 ≈ 29 TB per tahun, belum termasuk replikasi. Angka ini yang nantinya membenarkan penyimpanan yang di-partisi menurut conversation_id.",
  },
  {
    id: "0033-oral-1", lesson: "0033", topic: "kasus-chat-protokol", type: "oral",
    prompt: "\"Rancang aplikasi chat untuk percakapan 1:1 dan grup kecil, 10 juta DAU. Mulai dari requirement sampai desain v1.\" (90 detik)",
    sample: "\"Scope-nya pesan teks 1:1 dan grup sampai 100 orang, status online, pesan untuk user offline disampaikan saat ia kembali, riwayat tersimpan di semua perangkat; enkripsi end-to-end dan media di luar scope. 10 juta DAU, 40 pesan per user per hari: sekitar 4.000 pesan per detik, puncak 12.000. Kalau 30% online di puncak, itu 3 juta koneksi bersamaan. Polling setiap 2 detik berarti 1,5 juta request per detik yang hampir semuanya kosong, jadi saya pakai WebSocket untuk kirim dan terima, dan REST untuk riwayat dengan cursor seq. Tabel messages di-partisi menurut conversation_id dengan clustering seq; storage sekitar 80 GB per hari, 29 TB per tahun. Desain v1: satu chat server WebSocket yang memberi seq, menyimpan pesan, lalu mendorongnya ke penerima yang terhubung; penerima yang offline mengambil pesan setelah seq terakhirnya saat reconnect. Batas v1 adalah jumlah koneksi per server; 3 juta koneksi itulah deep dive-nya.\"",
    checklist: [
      "requirement: 1:1 + grup kecil, presence, pesan offline, riwayat multi-device; yang di luar scope disebut?",
      "estimasi: ±4.000 pesan/detik (puncak ±12.000) dan ±3 juta koneksi bersamaan?",
      "protokol: WebSocket untuk kirim/terima, dengan alasan biaya polling (±1,5 juta request/detik kosong)?",
      "data model: messages dengan partition key conversation_id dan clustering seq; storage ±80 GB/hari?",
      "v1: satu chat server WebSocket + database, penerima offline mengambil pesan setelah seq terakhir?",
      "membenarkan komponen dengan angka (WebSocket karena biaya polling; batas v1 karena 3 juta koneksi)?",
    ],
  },
]);
