// Soal lesson 0030 (track System Design, modul Studi kasus) · Notification system. Format: assets/README.md.
// Sumber: https://firebase.google.com/docs/cloud-messaging · https://docs.stripe.com/api/idempotent_requests ·
// https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ ·
// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html ·
// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html
QuestionBank.labelTopics({
  "kasus-notif-queue": "Studi kasus notification: queue per channel, retry + backoff, dead letter queue",
  "kasus-notif-idempotensi": "Studi kasus notification: idempotency, at-least-once, preferensi user",
});

QuestionBank.register([
  {
    id: "0030-01", lesson: "0030", topic: "kasus-notif-queue", type: "mc",
    prompt: "Di v1, semua channel memakai satu queue. Saat kampanye, provider SMS melambat dan pesan SMS terus di-retry. Apa dampaknya, dan apa perbaikannya?",
    options: {
      a: "Push ikut tertahan; pisahkan queue dan worker per channel",
      b: "Tidak ada dampak; queue otomatis memprioritaskan pesan push baru",
      c: "Email hilang; ganti queue dengan panggilan sinkron ke provider",
      d: "SMS terkirim ganda; hapus retry supaya provider tidak kewalahan",
    },
    answer: "a",
    explain: "Pesan SMS yang menumpuk ikut menahan push dan email di queue yang sama. Queue + worker per channel membuat setiap channel diskalakan dan dibatasi sesuai kuota provider-nya sendiri, sehingga gangguan satu provider tidak merembet.",
  },
  {
    id: "0030-02", lesson: "0030", topic: "kasus-notif-queue", type: "mc",
    prompt: "Pengiriman ke provider gagal sementara (timeout). Strategi retry mana yang tepat?",
    options: {
      a: "Retry segera tanpa jeda sampai pengiriman akhirnya berhasil",
      b: "Jangan retry; tandai gagal dan beri tahu user",
      c: "Exponential backoff dengan jitter, lalu DLQ setelah batas",
      d: "Retry setiap tepat satu detik untuk semua worker",
    },
    answer: "c",
    explain: "Backoff memberi provider waktu pulih; jitter menyebar retry supaya ribuan worker tidak menyerang bersamaan (AWS Builders' Library). Setelah maxReceiveCount tercapai, pesan dipindah ke dead letter queue untuk diperiksa.",
  },
  {
    id: "0030-03", lesson: "0030", topic: "kasus-notif-idempotensi", type: "mc",
    prompt: "Amazon SQS standard queue memberi at-least-once delivery. Apa konsekuensinya untuk worker notifikasi?",
    options: {
      a: "Pesan dijamin hanya sampai satu kali ke worker",
      b: "Urutan pesan selalu sama dengan urutan saat dikirim",
      c: "Worker tidak perlu menyimpan status pengiriman sama sekali",
      d: "Pesan bisa datang dua kali; worker harus idempotent",
    },
    answer: "d",
    explain: "SQS menyatakan salinan pesan bisa diterima lagi dan meminta aplikasi dirancang idempotent. Worker mengecek status delivery (notification_id + channel) sebelum mengirim dan melewati yang sudah sent.",
  },
  {
    id: "0030-04", lesson: "0030", topic: "kasus-notif-idempotensi", type: "mc",
    prompt: "Order service me-retry <code>POST /v1/notifications</code> setelah timeout. Bagaimana mencegah user menerima dua notifikasi \"pesanan dikirim\"?",
    options: {
      a: "Naikkan timeout order service supaya retry tidak pernah terjadi",
      b: "Pakai idempotency key dari pemanggil, disimpan dengan unique constraint",
      c: "Kirim notifikasi lewat dua channel supaya salah satunya sampai",
      d: "Hapus queue dan kirim langsung dari order service saja",
    },
    answer: "b",
    explain: "Pemanggil mengirim kunci yang sama di setiap retry (mis. order-8812-shipped); server mengenali retry lewat kunci itu, pola yang sama dengan idempotent requests di API Stripe. Constraint UNIQUE menolak baris kedua.",
  },
  {
    id: "0030-05", lesson: "0030", topic: "kasus-notif-idempotensi", type: "mc",
    prompt: "User mematikan SMS di preferensinya. Di mana preferensi itu sebaiknya dicek?",
    options: {
      a: "Sebelum enqueue, supaya pesan yang dilarang tidak masuk queue",
      b: "Di provider SMS, karena provider tahu nomor yang aktif",
      c: "Di aplikasi mobile, setelah notifikasi sampai ke perangkat user",
      d: "Tidak perlu dicek, karena semua user setuju saat mendaftar",
    },
    answer: "a",
    explain: "Notification service mengecek preferensi sebelum enqueue, jadi pesan yang dilarang tidak memakan kuota provider dan tidak pernah terkirim. Kalau pembacaan preferensi menjadi bottleneck di puncak, cache preferensi (jarang berubah).",
  },
  {
    id: "0030-oral-1", lesson: "0030", topic: "kasus-notif-queue", type: "oral",
    prompt: "\"Rancang notification system untuk push, SMS, dan email: 10 juta notifikasi per hari, kampanye sampai 5 juta user dalam 10 menit.\" (90 detik)",
    sample: "\"Rata-ratanya sekitar 100 notifikasi per detik, tapi kampanye membuat puncak sekitar 8.300 per detik, dan provider SMS mungkin hanya menerima sekitar 100 per detik. Karena itu queue sudah dibenarkan di v1: notification service mengecek idempotency key dan preferensi user, menyimpan baris notifikasi, memasukkan pesan ke queue, dan langsung membalas 202; worker memanggil FCM/APNs, provider SMS, dan email. Di v2 saya pisahkan queue dan worker per channel, karena provider SMS yang lambat tidak boleh menahan push. Kegagalan sementara di-retry dengan exponential backoff dan jitter; setelah beberapa kali gagal, pesan masuk dead letter queue. Queue-nya at-least-once, jadi worker harus idempotent: cek status delivery per notifikasi dan channel sebelum mengirim. Trade-off-nya: crash setelah kirim sebelum mencatat bisa menyebabkan dobel, dan untuk notifikasi itu lebih baik daripada hilang.\"",
    checklist: [
      "estimasi: ±100/detik rata-rata, puncak kampanye ±8.300/detik, kuota provider?",
      "queue antara notification service dan worker, dengan respons 202 asinkron?",
      "queue per channel supaya satu provider yang lambat tidak menahan channel lain?",
      "retry dengan exponential backoff + jitter, lalu dead letter queue?",
      "idempotency key dari pemanggil dan worker idempotent karena at-least-once; preferensi dicek sebelum enqueue?",
      "membenarkan komponen dengan angka (queue karena puncak 80× dan kuota provider; queue per channel karena gangguan satu provider)?",
    ],
  },
]);
