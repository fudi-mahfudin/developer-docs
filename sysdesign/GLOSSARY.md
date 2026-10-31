# System Design — Glossary

Kosakata bersama untuk persiapan ronde system design (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Prinsip dan kerangka

**Tangga skala**:
Urutan perubahan saat sistem mulai kewalahan, dari yang termurah dan paling kecil risikonya ke yang termahal: ukur → perbaiki kode/query/index → cache → scale vertical → read replica → asinkron/queue → sharding → pecah service. Naik satu anak tangga hanya kalau angka menuntut (lesson 0025).
_Avoid_: scaling roadmap, "langsung microservices"

**Over-engineering**:
Menambah komponen atau arsitektur yang belum dibenarkan angka requirement (mis. microservices + Kafka untuk 1.000 user). Di interview dinilai sebagai kelemahan, bukan kelebihan.
_Avoid_: future-proofing (sebagai pembenaran)

**Kerangka 5 langkah**:
Urutan menjawab soal desain: (1) klarifikasi requirement → (2) estimasi → (3) API + data model → (4) high-level design, mulai dari v1 paling sederhana → (5) deep dive, bottleneck, trade-off (lesson 0027).
_Avoid_: template, framework (tanpa konteks)

**Desain v1**:
Desain paling sederhana yang memenuhi angka requirement di langkah 2. Titik awal setiap studi kasus sebelum komponen apa pun ditambahkan.
_Avoid_: MVP (konteks produk, bukan arsitektur)

## Fondasi

## Skalabilitas

## Data

## Caching

## Asinkron

Slug topik bank soal modul ini: `async-queue-pubsub`, `async-log-broker` (0016), `async-delivery`, `async-idempotency` (0017), `async-event-outbox`, `async-backpressure` (0018).

**Message queue**:
Antrean point-to-point: producer menaruh pesan, dan setiap pesan diambil oleh satu consumer saja. Beberapa consumer pada satu queue disebut competing consumers (lesson 0016).
_Avoid_: queue (untuk pub/sub)

**Pub/sub**:
Publish-subscribe: setiap subscriber yang tertarik mendapat salinan setiap pesan. Publisher tidak tahu siapa subscriber-nya (lesson 0016).
_Avoid_: broadcast queue

**Consumer group**:
Di Kafka, sekumpulan consumer yang berbagi kerja: setiap partition dibaca oleh tepat satu consumer di dalam group. Jumlah partition membatasi paralelisme satu group; group yang berbeda masing-masing membaca semua event (lesson 0016).
_Avoid_: consumer pool

**Offset**:
Posisi consumer di satu partition Kafka, berupa satu angka. Bisa dimundurkan untuk membaca ulang (lesson 0016, 0017).
_Avoid_: cursor, pointer

**Log vs broker**:
Log (Kafka) menyimpan event sesuai retention dan bisa dibaca ulang; broker AMQP (RabbitMQ) merutekan pesan lewat exchange dan binding ke queue, lalu menghapusnya setelah ack (lesson 0016).
_Avoid_: "Kafka = queue biasa"

**Delivery semantics**:
Jaminan pengantaran pesan: at-most-once (bisa hilang, tidak pernah diulang), at-least-once (tidak hilang, bisa diulang), exactly-once (diproses tepat sekali). Default realistis: at-least-once + consumer idempotent (lesson 0017).
_Avoid_: guaranteed delivery (tanpa menyebut yang mana)

**Idempotency key**:
Key unik dari client (mis. UUID v4) yang dikirim ulang saat retry, supaya server mengenali request yang sama dan mengembalikan hasil tersimpan, bukan mengulang efeknya (lesson 0017).
_Avoid_: request ID (kalau tidak dipakai untuk deduplikasi)

**Consumer idempotent**:
Consumer yang aman menerima pesan yang sama berkali-kali, biasanya dengan mencatat ID pesan yang sudah diproses dalam transaksi yang sama dengan efeknya (lesson 0017).
_Avoid_: "broker exactly-once" (sebagai pengganti)

**Dead letter queue (DLQ)**:
Queue tujuan untuk pesan yang gagal diproses setelah batas percobaan (SQS `maxReceiveCount`, RabbitMQ `delivery-limit`), untuk diselidiki dan dikirim ulang. Butuh alarm (lesson 0017).
_Avoid_: tempat sampah pesan

**Ordering per key**:
Urutan yang dijamin hanya untuk pesan dengan key sama (mis. satu partition Kafka per account ID, atau message group SQS FIFO), bukan urutan global (lesson 0017).
_Avoid_: global ordering (kecuali benar-benar dibutuhkan)

**Event-driven**:
Arsitektur di mana producer mengumumkan event (fakta, bentuk lampau: `OrderPlaced`) ke channel, dan consumer yang tertarik bereaksi. Producer tidak tahu consumer-nya; datanya eventually consistent (lesson 0018).
_Avoid_: event (untuk command seperti `SendEmail`)

**Dual write**:
Menulis ke dua sistem berbeda (mis. database dan broker) dalam satu operasi tanpa transaksi bersama; kegagalan di tengah membuat keduanya tidak konsisten (lesson 0018).
_Avoid_: "publish setelah commit" (sebagai solusi)

**Transactional outbox**:
Data bisnis dan baris event ditulis ke tabel outbox dalam satu transaksi database; relay terpisah (polling atau CDC) mem-publish baris yang sudah commit. Consumer tetap harus idempotent (lesson 0018).
_Avoid_: outbox tanpa transaksi

**Load leveling**:
Memakai queue sebagai buffer untuk meratakan lonjakan sesaat, supaya downstream bekerja dengan kecepatan aman. Tidak menolong kalau rata-rata beban melebihi kapasitas (lesson 0018).
_Avoid_: "queue menambah kapasitas"

**Back-pressure**:
Sinyal dari consumer yang kewalahan ke hulu supaya producer melambat: batas in-flight (prefetch), throttle, atau penolakan (429). Dipicu metrik seperti umur pesan tertua di queue (lesson 0018).
_Avoid_: backpressure tanpa metrik pemicu

## Reliabilitas & API

## Studi kasus

## Penutup
