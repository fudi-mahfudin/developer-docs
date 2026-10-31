// Soal lesson 0016 (track System Design, modul Asinkron) · Message queue vs pub/sub; log (Kafka) vs broker (RabbitMQ). Format: assets/README.md.
// Sumber: Azure Architecture Center (Publisher-Subscriber, Competing Consumers), Apache Kafka 4.4 docs (Introduction, Design),
// RabbitMQ docs (AMQP 0-9-1 concepts), Redis docs (Pub/Sub), PostgreSQL docs (SELECT ... SKIP LOCKED).
QuestionBank.labelTopics({
  "async-queue-pubsub": "Asinkron: kenapa asinkron, message queue vs pub/sub",
  "async-log-broker": "Asinkron: log (Kafka) vs broker (RabbitMQ), consumer group",
});

QuestionBank.register([
  {
    id: "0016-01", lesson: "0016", topic: "async-queue-pubsub", type: "mc",
    prompt: "Endpoint checkout memanggil layanan email secara sinkron, dan layanan email kadang butuh 5 detik. Apa keuntungan utama memindahkan pengiriman email ke message queue?",
    options: {
      a: "Email terkirim lebih cepat karena queue mempercepat SMTP server",
      b: "Checkout tidak menunggu email; email dikirim worker di belakang",
      c: "Email dijamin terkirim tepat satu kali tanpa kode tambahan",
      d: "Database checkout tidak perlu lagi menyimpan data pesanan user",
    },
    answer: "b",
    explain: "Queue memisahkan pengirim dari penerima: pengirim tidak perlu menunggu respons (Azure Architecture Center, Publisher-Subscriber). Email tidak menjadi lebih cepat, hanya tidak lagi menahan checkout. Queue juga tidak otomatis memberi exactly-once; itu topik lesson 0017.",
  },
  {
    id: "0016-02", lesson: "0016", topic: "async-queue-pubsub", type: "mc",
    prompt: "Event <code>OrderPlaced</code> harus diterima layanan email, analitik, dan stok. Masing-masing butuh salinannya sendiri. Model apa yang cocok?",
    options: {
      a: "Satu queue dengan tiga consumer yang saling berebut pesan",
      b: "Panggilan HTTP sinkron berurutan dari checkout ke tiga layanan",
      c: "Satu tabel database yang di-polling setiap detik oleh semua",
      d: "Pub/sub: setiap subscriber menerima salinan setiap pesan yang relevan",
    },
    answer: "d",
    explain: "Pub/sub menyalin setiap pesan ke semua subscriber yang tertarik. Queue dengan banyak consumer adalah competing consumers: setiap pesan diantar ke satu consumer saja, jadi email, analitik, dan stok akan saling merebut pesan (Azure Architecture Center, Publisher-Subscriber dan Competing Consumers).",
  },
  {
    id: "0016-03", lesson: "0016", topic: "async-log-broker", type: "mc",
    prompt: "Topik Kafka <code>orders</code> punya 6 partition. Consumer group <code>billing</code> menjalankan 8 instance. Apa yang terjadi?",
    options: {
      a: "Enam instance aktif membaca; dua instance lainnya menganggur tanpa partition",
      b: "Delapan instance membaca bersama, sehingga setiap pesan diproses delapan kali",
      c: "Kafka otomatis menambah dua partition baru agar semua instance kebagian",
      d: "Pesan dibagi round robin ke delapan instance tanpa memperhatikan partition",
    },
    answer: "a",
    explain: "Setiap partition dibaca oleh tepat satu consumer di dalam satu consumer group pada satu waktu (Kafka 4.4 docs, Design: Consumer Position). Dengan 6 partition, paling banyak 6 instance yang bekerja; jumlah partition adalah batas paralelisme satu group.",
  },
  {
    id: "0016-04", lesson: "0016", topic: "async-log-broker", type: "mc",
    prompt: "Tim analitik baru ingin membaca ulang event pesanan 7 hari terakhir. Sistem mana yang mendukungnya secara bawaan?",
    options: {
      a: "RabbitMQ classic queue, karena pesan tetap disimpan setelah consumer ack",
      b: "Redis Pub/Sub, karena pesan disimpan sampai semua subscriber selesai membaca",
      c: "Kafka, karena event disimpan sesuai retention dan offset bisa dimundurkan",
      d: "Semua queue, karena setiap broker menyimpan pesan selamanya secara bawaan",
    },
    answer: "c",
    explain: "Kafka tidak menghapus event setelah dibaca; event disimpan selama retention per topik, dan consumer bisa memundurkan offset untuk membaca ulang (Kafka 4.4 docs, Introduction dan Design). Broker AMQP menghapus pesan dari queue setelah ack (RabbitMQ docs), dan Redis Pub/Sub bersifat at-most-once: subscriber yang terputus kehilangan pesan (Redis docs).",
  },
  {
    id: "0016-05", lesson: "0016", topic: "async-log-broker", type: "mc",
    prompt: "Kafka menjamin urutan pesan pada level apa?",
    options: {
      a: "Seluruh topik, di semua partition, untuk setiap consumer group sekaligus",
      b: "Per partition; event dengan key sama masuk ke partition sama",
      c: "Tidak ada jaminan urutan sama sekali, bahkan di satu partition",
      d: "Per consumer instance, tergantung urutan instance itu menyala lebih dulu",
    },
    answer: "b",
    explain: "Event dengan key yang sama ditulis ke partition yang sama, dan consumer selalu membaca satu partition dalam urutan tulis yang persis sama (Kafka 4.4 docs, Introduction). Antar-partition tidak ada jaminan urutan, jadi pilih key (mis. order ID) sesuai entitas yang urutannya penting.",
  },
  {
    id: "0016-oral-1", lesson: "0016", topic: "async-queue-pubsub", type: "oral",
    prompt: "\"Kapan Anda memakai message queue, kapan pub/sub? Kapan Kafka dan kapan RabbitMQ? Dan kapan Anda tidak memakai keduanya?\" (60 detik)",
    sample: "\"Asinkron saya pakai kalau pemanggil tidak butuh hasilnya sekarang, misalnya kirim email atau resize gambar, supaya request utama tidak menunggu. Kalau satu pekerjaan cukup dikerjakan satu worker, saya pakai queue dengan competing consumers. Kalau satu event harus diterima beberapa layanan, misalnya OrderPlaced ke email, stok, dan analitik, saya pakai pub/sub supaya masing-masing dapat salinan. Kafka saya pilih kalau butuh log yang bisa dibaca ulang, throughput tinggi, dan urutan per key; paralelismenya dibatasi jumlah partition per consumer group. RabbitMQ saya pilih untuk routing fleksibel lewat exchange dan binding, dengan pesan dihapus setelah ack. Tapi untuk beberapa ratus job per menit, tabel database dengan SELECT FOR UPDATE SKIP LOCKED sering cukup, dan kalau user butuh jawaban sekarang, panggilan sinkron tetap yang paling sederhana.\"",
    checklist: [
      "Alasan asinkron: pemanggil tidak menunggu pekerjaan yang boleh selesai belakangan",
      "Queue = satu pesan ke satu consumer (competing consumers)",
      "Pub/sub = setiap subscriber mendapat salinan pesan",
      "Kafka: log dengan retention, baca ulang lewat offset, urutan per partition/key",
      "RabbitMQ: exchange + binding untuk routing, pesan dihapus setelah ack",
      "Membenarkan komponen dengan angka, atau menyebut alternatif lebih murah (tabel DB, panggilan sinkron)",
    ],
  },
]);
