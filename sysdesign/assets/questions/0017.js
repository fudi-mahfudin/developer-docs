// Soal lesson 0017 (track System Design, modul Asinkron) · Delivery semantics, idempotency key, dead letter queue, ordering. Format: assets/README.md.
// Sumber: Apache Kafka 4.4 docs (Design: Message Delivery Semantics), RabbitMQ docs (Consumer Acknowledgements, Dead Letter Exchanges),
// Amazon SQS Developer Guide (at-least-once, dead-letter queues, FIFO exactly-once processing), Stripe API Reference (Idempotent requests).
QuestionBank.labelTopics({
  "async-delivery": "Asinkron: at-most/at-least/exactly-once, DLQ, ordering",
  "async-idempotency": "Asinkron: idempotency key dan consumer idempotent",
});

QuestionBank.register([
  {
    id: "0017-01", lesson: "0017", topic: "async-delivery", type: "mc",
    prompt: "Consumer menyimpan offset dulu, lalu memproses pesan, lalu crash sebelum pemrosesan selesai. Semantik apa yang dihasilkan urutan ini?",
    options: {
      a: "At-least-once: pesan itu diproses ulang oleh consumer pengganti",
      b: "Exactly-once: Kafka otomatis membatalkan offset yang sudah tersimpan",
      c: "At-most-once: pesan yang belum selesai diproses bisa hilang",
      d: "Tidak berpengaruh, karena broker menyimpan status setiap pesan",
    },
    answer: "c",
    explain: "Simpan posisi dulu, proses belakangan: consumer pengganti mulai dari posisi tersimpan, jadi pesan yang belum selesai terlewat. Kafka docs menyebutnya at-most-once. Urutan sebaliknya (proses dulu, simpan posisi belakangan) menghasilkan at-least-once (Kafka 4.4 docs, Design: Message Delivery Semantics).",
  },
  {
    id: "0017-02", lesson: "0017", topic: "async-idempotency", type: "mc",
    prompt: "Worker pembayaran menerima pesan <code>ChargeCard</code> yang sama dua kali (queue at-least-once). Cara paling murah mencegah kartu ditagih dua kali?",
    options: {
      a: "Simpan ID pesan yang sudah diproses; lewati kalau ID sudah ada",
      b: "Ganti ke broker yang menjanjikan exactly-once untuk semua sistem tujuan eksternal",
      c: "Matikan retry di semua producer supaya pesan tidak pernah terkirim ulang",
      d: "Tambah worker sebanyak mungkin agar duplikat selesai sebelum pesan aslinya tiba",
    },
    answer: "a",
    explain: "Queue at-least-once bisa mengantar pesan yang sama lagi, jadi consumer harus idempotent (Amazon SQS docs). Catat ID yang sudah diproses, idealnya dalam transaksi yang sama dengan efeknya. Exactly-once ke sistem eksternal butuh kerja sama sistem itu (Kafka docs), dan mematikan retry berarti menerima pesan hilang.",
  },
  {
    id: "0017-03", lesson: "0017", topic: "async-delivery", type: "mc",
    prompt: "Satu pesan dengan format rusak selalu membuat consumer gagal. Tanpa penanganan khusus, apa yang terjadi, dan apa obatnya?",
    options: {
      a: "Pesan otomatis dihapus broker; tidak perlu penanganan apa pun",
      b: "Broker berhenti total; obatnya restart broker setiap kali terjadi",
      c: "Pesan pindah ke partition lain; obatnya menambah jumlah partition",
      d: "Redelivery berulang tanpa akhir; obatnya batas retry lalu DLQ",
    },
    answer: "d",
    explain: "Kalau consumer terus me-requeue pesan yang tidak bisa diproses, terjadi loop requeue/redelivery (RabbitMQ docs, Consumer Acknowledgements). Batasi jumlah percobaan (SQS: maxReceiveCount; RabbitMQ quorum queue: delivery-limit), lalu pindahkan pesan ke dead letter queue untuk diselidiki.",
  },
  {
    id: "0017-04", lesson: "0017", topic: "async-idempotency", type: "mc",
    prompt: "Client memanggil <code>POST /payments</code>, koneksi timeout, lalu client mengulang request. Bagaimana server tahu ini request yang sama?",
    options: {
      a: "Server membandingkan alamat IP client dengan request lima menit terakhir",
      b: "Client mengirim header <code>Idempotency-Key</code> yang sama; server mengembalikan hasil tersimpan",
      c: "Server mengubah POST menjadi GET, karena GET selalu aman diulang",
      d: "Load balancer menahan request kedua sampai request pertama benar-benar selesai",
    },
    answer: "b",
    explain: "Client membuat idempotency key unik (mis. UUID v4) dan mengirimnya lagi saat retry. Stripe menyimpan status code dan body request pertama untuk key itu, lalu mengembalikan respons tersimpan untuk retry dengan key yang sama, termasuk error 500 (Stripe API Reference, Idempotent requests).",
  },
  {
    id: "0017-05", lesson: "0017", topic: "async-delivery", type: "mc",
    prompt: "Pesan untuk akun yang sama harus diproses berurutan (debit dulu, lalu kredit). Desain mana yang menjaga ordering per akun?",
    options: {
      a: "Satu queue dengan banyak competing consumer tanpa key apa pun",
      b: "Pub/sub biasa, karena broker selalu menjaga urutan untuk semua subscriber",
      c: "Kafka dengan account ID sebagai key: satu akun, satu partition",
      d: "Tambah lebih banyak consumer agar pesan selesai sebelum urutannya tertukar",
    },
    answer: "c",
    explain: "Kafka menulis event dengan key sama ke partition yang sama dan menjamin urutan di dalam partition (Kafka 4.4 docs, Introduction). Competing consumers dan pub/sub umumnya tidak menjamin urutan (Azure Architecture Center). Alternatif: SQS FIFO dengan message group per akun.",
  },
  {
    id: "0017-oral-1", lesson: "0017", topic: "async-idempotency", type: "oral",
    prompt: "\"Queue Anda at-least-once. Bagaimana Anda memastikan pembayaran tidak terjadi dua kali, dan apa yang Anda lakukan dengan pesan yang terus gagal?\" (60 detik)",
    sample: "\"At-least-once berarti pesan tidak hilang tapi bisa datang dua kali, misalnya kalau consumer crash setelah memproses tapi sebelum ack atau commit offset. Exactly-once end-to-end ke sistem eksternal tidak saya andalkan dari broker, jadi consumer saya buat idempotent. Setiap pesan membawa ID unik; dari sisi API, client mengirim Idempotency-Key, misalnya UUID. Consumer mencatat ID yang sudah diproses di tabel dengan unique constraint, dalam transaksi yang sama dengan efek pembayarannya, jadi duplikat dilewati dan mengembalikan hasil lama. Pesan yang terus gagal saya batasi, misalnya lima percobaan dengan backoff, lalu dipindah ke dead letter queue dan diberi alarm, supaya tidak memblokir pesan lain. Kalau volumenya kecil dan semua dalam satu database, cukup transaksi biasa tanpa queue sama sekali.\"",
    checklist: [
      "At-least-once: pesan bisa duplikat, dengan contoh penyebabnya (crash sebelum ack/commit offset)",
      "Tidak mengandalkan exactly-once dari broker untuk sistem eksternal",
      "Idempotency key / ID pesan unik, dicatat bersama efeknya (unique constraint atau transaksi)",
      "Duplikat mengembalikan hasil tersimpan, bukan menagih lagi",
      "Batas retry lalu dead letter queue, dengan monitoring/alarm",
      "Membenarkan komponen dengan angka, atau menyebut kapan cukup transaksi database biasa",
    ],
  },
]);
