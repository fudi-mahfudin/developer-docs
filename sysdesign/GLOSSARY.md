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

Slug topik bank soal modul ini: `dasar-requirement`, `dasar-prinsip-sederhana` (0001), `dasar-perjalanan-request`, `dasar-http-stateless` (0002), `dasar-latency-percentile`, `dasar-angka-latency` (0003), `dasar-estimasi-qps`, `dasar-estimasi-storage` (0004).

**Functional requirement**:
Apa yang dilakukan sistem, ditulis sebagai kalimat kerja "user bisa …" (lesson 0001).
_Avoid_: fitur (tanpa konteks)

**Non-functional requirement**:
Seberapa baik sistem harus bekerja, ditulis sebagai angka: latency, availability, jumlah user, ukuran data. Angka inilah yang memilih komponen (lesson 0001).
_Avoid_: kualitas, "harus cepat"

**SLI**:
Service level indicator: ukuran kuantitatif suatu aspek layanan, mis. latency p99 atau persentase request sukses. Target untuk SLI disebut SLO (lesson 0001, 0003).
_Avoid_: KPI

**Availability**:
Persentase waktu layanan bisa dipakai. Setiap "sembilan" tambahan memangkas jatah downtime 10 kali: 99,9% ≈ 43 menit per bulan (lesson 0001).
_Avoid_: uptime (boleh, asal angkanya disebut)

**Stateless**:
Setiap request bisa dipahami sendiri tanpa bergantung pada request sebelumnya, sehingga request boleh dilayani server mana pun (lesson 0002).
_Avoid_: tanpa database (stateless bukan berarti tanpa data)

**RTT**:
Round-trip time: waktu satu paket pergi dan balasannya kembali. Request HTTPS pertama butuh beberapa RTT (DNS, TCP, TLS) sebelum server mulai bekerja (lesson 0002).
_Avoid_: ping (alat, bukan ukuran)

**Latency**:
Waktu yang dibutuhkan untuk mengembalikan response atas satu request, biasanya dalam ms (lesson 0003).
_Avoid_: kecepatan (ambigu dengan throughput)

**Throughput**:
Jumlah request yang bisa dilayani per satuan waktu, biasanya request per detik. Menambah server menaikkan throughput, tidak mempercepat satu request (lesson 0003).
_Avoid_: kecepatan, bandwidth (bandwidth = byte per detik)

**Percentile (p50, p99)**:
p*n* adalah nilai yang tidak dilampaui oleh n% request. p50 = median; p99 menunjukkan ekor lambat yang disembunyikan rata-rata (lesson 0003).
_Avoid_: rata-rata (sebagai target latency)

**Tail latency**:
Latency request paling lambat (p99, p99,9). Makin penting saat satu halaman memanggil banyak service (lesson 0003).
_Avoid_: outlier (yang boleh diabaikan)

**Back-of-envelope**:
Hitungan kasar orde besaran untuk memutuskan apakah komponen dibutuhkan, dengan asumsi diucapkan ke interviewer (lesson 0004).
_Avoid_: perhitungan kapasitas presisi

**DAU**:
Daily active users: jumlah user yang memakai sistem minimal sekali sehari, bukan jumlah akun terdaftar. Titik awal estimasi (lesson 0004).
_Avoid_: total user, MAU (kecuali soal memakainya)

**QPS**:
Queries per second, request per detik. Rata-rata = DAU × request per user per hari / 10⁵ (1 hari ≈ 10⁵ detik); puncak = rata-rata × faktor puncak (lesson 0004).
_Avoid_: RPS (sinonim, pilih satu dan konsisten), TPS

**Bandwidth**:
Volume data per detik = QPS × ukuran per request/response. Jaringan diukur dalam bit (Mbps), storage dalam byte; 1 byte = 8 bit (lesson 0004).
_Avoid_: throughput (throughput = request per detik)

## Skalabilitas

## Data

## Caching

Slug topik bank soal modul ini: `cache-lokasi`, `cache-pola` (0013), `cache-ttl-eviction`, `cache-invalidation` (0014), `cache-stampede`, `cache-hot-key` (0015).

**Cache hit ratio**:
Porsi request yang dilayani dari cache tanpa ke sumber (origin/database). Angka utama untuk membenarkan cache (lesson 0013).
_Avoid_: hit rate (boleh, tapi pilih satu)

**Cache-aside**:
Pola default: aplikasi membaca cache; saat miss, aplikasi membaca database lalu mengisi cache. Saat write, update database dulu lalu hapus key (lesson 0013).
_Avoid_: lazy loading (nama ElastiCache untuk hal yang sama; pakai cache-aside)

**Read-through**:
Aplikasi hanya bicara ke cache; saat miss, cache sendiri yang memanggil loader ke database (lesson 0013).
_Avoid_: cache-aside (beda siapa yang membaca database)

**Write-through**:
Write ditulis ke cache dan database dalam satu operasi; selesai setelah database tersimpan. Cache tidak basi setelah write, tapi setiap write dua trip (lesson 0013).

**Write-behind**:
Write ditulis ke cache, lalu ke database secara asinkron setelah jeda. Cepat, tapi data bisa hilang bila cache mati sebelum flush (lesson 0013).
_Avoid_: write-back (sinonim; pakai write-behind)

**TTL**:
Time to live: umur maksimum satu entri cache; setelah lewat, entri dianggap tidak ada (Redis `EXPIRE`, HTTP `max-age`). Dipicu waktu (lesson 0014).

**Eviction**:
Membuang entri saat cache mencapai batas memori, dipilih oleh policy seperti LRU atau LFU (Redis `maxmemory-policy`). Dipicu memori, bukan waktu (lesson 0014).
_Avoid_: expiration (itu TTL)

**LRU / LFU**:
Least recently used (buang yang paling lama tidak diakses) / least frequently used (buang yang paling jarang diakses). `allkeys-lru` adalah default yang disarankan Redis (lesson 0014).

**Invalidation**:
Menghapus atau menandai salinan di cache karena sumbernya berubah, supaya request berikutnya mengambil nilai baru (lesson 0014).
_Avoid_: eviction (itu karena memori penuh)

**Stale data**:
Salinan di cache yang sudah berbeda dari sumbernya; dibatasi TTL dan dihilangkan dengan invalidation (lesson 0014).
_Avoid_: data korup

**Cache stampede**:
Key populer kedaluwarsa, banyak request miss bersamaan dan semuanya menghitung ulang ke database. Disebut juga thundering herd atau dog-piling (lesson 0015).
_Avoid_: cache miss biasa

**Request coalescing**:
Menggabungkan banyak miss untuk key yang sama menjadi satu request ke origin (RFC 9111: "collapse requests"; nginx `proxy_cache_lock`) (lesson 0015).
_Avoid_: batching (menggabungkan key berbeda)

**Hot key**:
Satu key yang menerima traffic jauh di atas key lain sehingga membebani satu node cache; diatasi dengan local cache atau salinan ber-suffix (lesson 0015).
_Avoid_: hot partition (istilah untuk partisi database, lesson 0010)

**Cache berlapis**:
Beberapa cache bertumpuk dari terdekat ke terjauh (local → Redis → database; CDN edge → regional edge → Origin Shield → origin). Setiap lapisan menyaring miss, tapi menambah tempat data basi (lesson 0015).
_Avoid_: multi-tier (boleh dalam bahasa Inggris)

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
