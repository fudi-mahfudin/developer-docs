// Soal lesson 0018 (track System Design, modul Asinkron) · Event-driven, outbox pattern, back-pressure, load leveling. Format: assets/README.md.
// Sumber: Azure Architecture Center (Event-driven architecture style, Queue-Based Load Leveling), AWS Prescriptive Guidance (Transactional outbox),
// AWS Builders' Library (Avoiding insurmountable queue backlogs), RabbitMQ docs (Consumer Acknowledgements: prefetch).
QuestionBank.labelTopics({
  "async-event-outbox": "Asinkron: event-driven dan outbox pattern",
  "async-backpressure": "Asinkron: back-pressure dan load leveling",
});

QuestionBank.register([
  {
    id: "0018-01", lesson: "0018", topic: "async-event-outbox", type: "mc",
    prompt: "Service menyimpan pesanan ke database, lalu publish event ke broker. Broker down tepat setelah commit database. Apa masalahnya?",
    options: {
      a: "Tidak ada masalah, karena broker akan menebak event yang hilang",
      b: "Database otomatis melakukan rollback karena broker gagal menerima event itu",
      c: "Event terkirim dua kali karena database mengirim ulang secara otomatis",
      d: "Dual write: pesanan tersimpan, event hilang, layanan lain tidak tahu",
    },
    answer: "d",
    explain: "Menulis ke dua sistem berbeda (database dan broker) dalam satu operasi disebut dual write. Kalau salah satunya gagal, keduanya tidak konsisten: pesanan ada, tapi layanan lain tidak pernah menerima event-nya (AWS Prescriptive Guidance, Transactional outbox pattern).",
  },
  {
    id: "0018-02", lesson: "0018", topic: "async-event-outbox", type: "mc",
    prompt: "Inti transactional outbox pattern adalah...",
    options: {
      a: "Publish event ke broker dulu, baru tulis ke database setelahnya",
      b: "Simpan data dan baris event outbox dalam satu transaksi database",
      c: "Pakai two-phase commit antara database dan broker untuk setiap event",
      d: "Kirim event langsung dari browser user agar server tidak terbebani",
    },
    answer: "b",
    explain: "Tabel bisnis dan tabel outbox di-update dalam transaksi yang sama; kalau salah satu gagal, semuanya rollback. Proses terpisah membaca baris outbox yang sudah commit dan mengirimnya ke broker. Karena proses itu bisa mengirim duplikat, consumer harus idempotent (AWS Prescriptive Guidance, Transactional outbox pattern).",
  },
  {
    id: "0018-03", lesson: "0018", topic: "async-backpressure", type: "mc",
    prompt: "Producer mengirim 1.000 pesan/detik, consumer hanya sanggup 200 pesan/detik, terus-menerus selama satu jam. Apa yang terjadi pada queue?",
    options: {
      a: "Queue meratakan beban, jadi tidak ada masalah selama berapa pun",
      b: "Broker otomatis mempercepat consumer sampai sanggup seribu pesan per detik",
      c: "Backlog tumbuh sekitar 800 pesan per detik; perlu back-pressure upstream",
      d: "Pesan lama otomatis dihapus broker sehingga backlog selalu tetap nol",
    },
    answer: "c",
    explain: "Queue hanya meratakan lonjakan sesaat. Kalau rata-rata kedatangan melebihi kapasitas, backlog tumbuh 800 pesan/detik, sekitar 2,9 juta pesan dalam satu jam, dan latency ikut naik. Obatnya: tambah consumer dalam batas aman, atau kirim back-pressure ke producer (AWS Builders' Library, Avoiding insurmountable queue backlogs).",
  },
  {
    id: "0018-04", lesson: "0018", topic: "async-backpressure", type: "mc",
    prompt: "Metrik mana yang disarankan AWS Builders' Library untuk mendeteksi backlog <strong>lebih awal</strong> daripada jumlah pesan di DLQ?",
    options: {
      a: "Umur pesan tertua di queue (seberapa jauh consumer tertinggal)",
      b: "Jumlah CPU core di mesin broker yang sedang aktif",
      c: "Ukuran rata-rata payload pesan yang dikirim producer per menit",
      d: "Jumlah topik atau queue yang dibuat sejak sistem berjalan",
    },
    answer: "a",
    explain: "Alarm DLQ tetap berguna, tapi datang terlambat. Amazon lebih fokus mengukur umur pesan di queue: setiap pesan diberi timestamp, dan saat diambil dari queue dicatat seberapa jauh sistem tertinggal (AWS Builders' Library, Avoiding insurmountable queue backlogs).",
  },
  {
    id: "0018-05", lesson: "0018", topic: "async-backpressure", type: "mc",
    prompt: "Kapan queue-based load leveling <strong>tidak</strong> cocok?",
    options: {
      a: "Beban datang dalam lonjakan sesaat yang bisa membuat database tumbang",
      b: "Pekerjaan seperti kirim email atau resize gambar boleh selesai belakangan",
      c: "Producer dan consumer perlu diskalakan secara terpisah sesuai bebannya masing-masing",
      d: "Pemanggil butuh respons sinkron dengan latency rendah untuk melanjutkan proses",
    },
    answer: "d",
    explain: "Load leveling memakai queue sebagai buffer untuk meratakan lonjakan beban. Azure Architecture Center menyebut pola ini mungkin tidak cocok kalau pemanggil membutuhkan respons sinkron dengan latency rendah (Queue-Based Load Leveling pattern).",
  },
  {
    id: "0018-oral-1", lesson: "0018", topic: "async-event-outbox", type: "oral",
    prompt: "\"Saat pesanan dibuat, layanan email, stok, dan analitik harus tahu. Bagaimana Anda memastikan event tidak hilang, dan apa yang terjadi kalau consumer tertinggal?\" (60 detik)",
    sample: "\"Saya publish event OrderPlaced lewat pub/sub, jadi checkout tidak perlu tahu siapa saja yang mendengarkan. Supaya tidak ada dual write, pesanan dan baris outbox ditulis dalam satu transaksi database; relay terpisah membaca outbox yang sudah commit dan publish ke broker. Relay bisa mengirim duplikat, jadi setiap consumer idempotent berdasarkan event ID. Kalau consumer tertinggal, queue meratakan lonjakan, tapi kalau rata-rata kedatangan melebihi kapasitas, backlog tumbuh terus. Saya pantau umur pesan tertua, bukan hanya DLQ, lalu tambah consumer dalam batas yang sanggup ditanggung database, atau kirim back-pressure ke producer, misalnya throttle atau 429. Kalau hanya satu layanan yang perlu tahu dan volumenya kecil, panggilan langsung atau job di tabel database lebih sederhana.\"",
    checklist: [
      "Event-driven/pub/sub: producer tidak tahu siapa consumer-nya",
      "Menyebut masalah dual write antara database dan broker",
      "Outbox: data + baris outbox dalam satu transaksi, relay publish setelah commit",
      "Consumer idempotent karena relay bisa mengirim duplikat",
      "Back-pressure/load leveling: pantau umur pesan atau backlog, tambah consumer atau throttle producer",
      "Membenarkan komponen dengan angka, atau menyebut alternatif lebih murah",
    ],
  },
]);
