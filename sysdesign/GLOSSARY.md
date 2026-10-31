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

Slug topik bank soal modul ini: `skala-vertical-horizontal`, `skala-stateless` (0005), `skala-lb-layer`, `skala-lb-algoritma` (0006), `skala-reverse-proxy`, `skala-cdn` (0007).

**Vertical scaling**:
Menambah kapasitas satu mesin (CPU, RAM, disk lebih besar); disebut juga scale up. Tanpa perubahan kode, tapi dibatasi ukuran mesin terbesar dan sering butuh downtime (lesson 0005).
_Avoid_: upgrade server (tanpa konteks)

**Horizontal scaling**:
Menambah atau mengurangi jumlah instance di belakang load balancer; disebut juga scale out/scale in. Mensyaratkan service yang stateless (lesson 0005).
_Avoid_: clustering (terlalu umum)

**Stateless service**:
Service yang tidak menyimpan data per user di memorinya di antara dua request, sehingga instance mana pun bisa melayani request mana pun. State dipindah ke session store, database, atau token di client (lesson 0005).
_Avoid_: tanpa state (state tetap ada, hanya dipindah)

**Session store**:
Penyimpanan bersama untuk session user (mis. Redis, satu key per session ID dengan TTL), supaya semua instance bisa membaca session yang sama (lesson 0005).
_Avoid_: cache (session tidak boleh hilang semudah cache)

**Load balancer**:
Komponen yang membagi request ke beberapa instance dan mengeluarkan instance yang tidak sehat dari rotasi. Salah satu jenis reverse proxy (lesson 0006).
_Avoid_: LB (tulis lengkap di jawaban)

**L4 / L7 load balancer**:
L4 bekerja di layer transport OSI (IP, port, koneksi TCP); L7 di layer aplikasi (path, header, cookie HTTP) dan bisa melakukan routing per path serta TLS termination (lesson 0006).
_Avoid_: network vs application (nama produk AWS, bukan konsep)

**Round robin / least connections / hash**:
Algoritma load balancing: bergiliran; ke server dengan koneksi aktif paling sedikit; ke server yang ditentukan hash sebuah key (IP, user ID). Consistent hashing membuat hanya sedikit key pindah saat server ditambah (lesson 0006, detail di 0010).
_Avoid_: random (algoritma lain)

**Health check**:
Pemeriksaan berkala (aktif) atau dari request asli (pasif) untuk menentukan instance mana yang sehat. Instance yang gagal beberapa kali berturut-turut tidak lagi menerima request (lesson 0006).
_Avoid_: ping (health check sebaiknya memeriksa aplikasi, bukan hanya mesin)

**Sticky session**:
Load balancer mengikat session user ke satu instance (lewat cookie atau hash IP); disebut juga session affinity. Membatasi scale out dan kehilangan session saat instance mati (lesson 0006).
_Avoid_: session persistence (nama lain di nginx; pakai satu istilah)

**Connection draining**:
Saat instance dikeluarkan (deploy, scale in), load balancer berhenti mengirim request baru tapi menunggu request yang sedang berjalan selesai; di ELB disebut deregistration delay, default 300 detik (lesson 0006).
_Avoid_: graceful shutdown (itu sisi aplikasi)

**Reverse proxy**:
Perantara yang tampil sebagai server asli bagi client lalu meneruskan request ke server di belakangnya; tempat TLS termination, cache respons, kompresi, dan load balancing (lesson 0007).
_Avoid_: proxy (forward proxy ada di sisi client)

**API gateway**:
Reverse proxy yang menjadi pintu masuk tunggal ke banyak service, dengan routing L7 dan urusan lintas service (auth, rate limiting). Belum perlu untuk satu monolith (lesson 0007).
_Avoid_: load balancer (peran berbeda)

**CDN**:
Content delivery network: jaringan server edge yang menyimpan salinan konten (biasanya statis) dekat user, untuk memperkecil latency dan beban origin. Termasuk shared cache (lesson 0007).
_Avoid_: hosting (CDN tetap butuh origin)

**Edge / origin**:
Edge (POP) adalah server CDN yang dekat dengan user; origin adalah server atau storage Anda yang menyimpan versi asli konten (lesson 0007).
_Avoid_: node (terlalu umum)

**Push vs pull CDN**:
Pull: edge mengambil dari origin saat cache miss pertama (default). Push: Anda mengunggah konten ke storage CDN lebih dulu; cocok untuk file besar yang jarang berubah (lesson 0007).
_Avoid_: prefetch (konsep caching lain)

**Cache hit / cache miss**:
Hit: respons dilayani dari cache. Miss: cache tidak punya salinan sehingga request diteruskan ke origin. Cache hit ratio = proporsi request yang hit (lesson 0007).
_Avoid_: —

**Nama file berversi**:
Menyertakan versi atau hash isi di nama file (mis. `app.3f9a.js`) supaya file baru punya URL baru dan TTL CDN bisa panjang tanpa invalidation (lesson 0007).
_Avoid_: cache busting dengan query string acak

## Data

Slug topik bank soal modul ini: `data-model-db`, `data-acid-base` (0008) · `data-index`, `data-replikasi` (0009) · `data-partisi`, `data-consistent-hash` (0010) · `data-cap-pacelc`, `data-konsistensi` (0011).

**ACID**:
Atomicity, Consistency, Isolation, Durability: jaminan transaksi database relasional; banyak langkah menjadi satu operasi all-or-nothing (lesson 0008).
_Avoid_: "transaksional" tanpa menyebut jaminannya

**BASE**:
Basically Available, Soft state, Eventually consistent: sikap mengutamakan ketersediaan dan menerima replika yang sempat berbeda (lesson 0008).
_Avoid_: "NoSQL = tanpa konsistensi"

**Key-value store / document store / wide-column store / graph database**:
Keluarga NoSQL, dipilih dari pola akses: get/put per key, objek bersarang utuh, scan rentang row key pada volume besar, traversal relasi (lesson 0008).
_Avoid_: "NoSQL" sebagai satu jenis database

**B-tree index**:
Index default PostgreSQL; pohon terurut untuk query equality dan range (`=`, `<`, `BETWEEN`). Mempercepat read, menambah overhead write (lesson 0009).
_Avoid_: "index semua kolom"

**Leader-follower replication**:
Semua write ke satu leader; leader mengirim log perubahan ke follower. PostgreSQL menyebutnya primary-standby (lesson 0009).
_Avoid_: master-slave

**Synchronous vs asynchronous replication**:
Sync: commit menunggu konfirmasi standby (aman, write lebih lambat). Async (default PostgreSQL): commit tidak menunggu (cepat, bisa lag dan kehilangan transaksi terakhir saat leader crash) (lesson 0009).

**Replication lag**:
Jeda sebelum perubahan di leader terlihat di follower (lesson 0009).
_Avoid_: delay replikasi

**Read replica**:
Follower yang melayani query baca (hot standby di PostgreSQL, read-only). Menolong beban read, tidak menolong write (lesson 0009).

**Partitioning / sharding**:
Membagi tabel menjadi bagian; sharding = bagian-bagian itu di server berbeda. Range (per rentang key) atau hash (per hash key) (lesson 0010).
_Avoid_: "sharding" untuk partitioning di satu server

**Shard key**:
Kolom yang menentukan baris masuk ke shard mana; dipilih dari query dominan. Hampir mustahil diganti nanti (lesson 0010).
_Avoid_: partition key (boleh, tapi konsisten dalam satu jawaban)

**Hot partition**:
Shard yang menerima beban jauh di atas shard lain, mis. range per tanggal atau satu key selebriti (lesson 0010).
_Avoid_: hot key (itu untuk satu key di cache, modul Caching)

**Resharding**:
Memindahkan data saat jumlah shard berubah. Dengan `hash mod N` hampir semua key pindah (lesson 0010).

**Consistent hashing**:
Node dan key di-hash ke ring; key milik node berikutnya searah jarum jam, sehingga node datang/pergi hanya memengaruhi tetangga (Karger et al. 1997; Dynamo) (lesson 0010).

**Virtual node**:
Satu server memegang banyak titik di ring supaya beban rata dan beban node yang mati tersebar ke banyak node (lesson 0010).
_Avoid_: vnode tanpa penjelasan

**CAP**:
Saat network partition, sistem yang direplikasi memilih consistency (CP, menolak request) atau availability (AP, menjawab data lama) (Gilbert & Lynch 2002) (lesson 0011).
_Avoid_: "pilih 2 dari 3" bebas, "CA" untuk sistem terdistribusi

**PACELC**:
Perluasan CAP: saat Partition pilih A atau C; Else (normal) pilih Latency atau Consistency. Contoh: Dynamo/Cassandra PA/EL, BigTable/HBase PC/EC (Abadi 2012) (lesson 0011).

**Strong consistency / eventual consistency**:
Strong: setiap read melihat write terakhir. Eventual: replika boleh sempat berbeda, akhirnya sama (lesson 0011).

**Read-your-writes**:
Jaminan user selalu melihat tulisannya sendiri, walau user lain mungkin melihat data lama (lesson 0009, 0011).

**Quorum (N, R, W)**:
Data disalin ke N node; read butuh R node, write butuh W node; R + W > N membuat set baca dan tulis beririsan. Umum: (3, 2, 2) (Dynamo) (lesson 0011).
_Avoid_: "quorum = strong consistency penuh"

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

Slug topik bank soal 0020–0025 (prefix `rel-`): `rel-gaya-api`, `rel-pagination` (0020) · `rel-ratelimit-algoritma`, `rel-ratelimit-http` (0021) · `rel-timeout-retry`, `rel-circuit-breaker` (0022) · `rel-observability`, `rel-slo` (0023) · `rel-monolith-microservices`, `rel-distributed-transaction` (0024) · `rel-tangga-skala`, `rel-over-engineering` (0025).

**REST**:
Gaya API yang memodelkan data sebagai resource (`/orders/42`) dan memakai method HTTP sesuai maknanya. Default untuk API publik (lesson 0020).
_Avoid_: "API JSON" (format, bukan gaya)

**gRPC**:
Framework RPC dengan kontrak Protocol Buffers di atas HTTP/2, mendukung streaming. Cocok untuk service-to-service internal; browser butuh gRPC-Web (lesson 0020).

**Long polling**:
Client mengirim request yang ditahan server sampai ada data, lalu langsung bertanya lagi. Cadangan kalau SSE/WebSocket tidak bisa dipakai (lesson 0020).

**SSE (Server-Sent Events)**:
Satu response HTTP `text/event-stream` yang terus mengalirkan event dari server ke client; browser menyambung ulang sendiri. Satu arah (lesson 0020).

**WebSocket**:
Koneksi dua arah di atas TCP yang dibuka lewat handshake HTTP. Untuk chat dan game; membuat server stateful (lesson 0020).

**Cursor pagination**:
Halaman berikutnya dilanjutkan dari item terakhir (`WHERE id < :last_id`), dikirim sebagai token opaque. Stabil saat data baru masuk dan memakai index (lesson 0020).
_Avoid_: keyset (boleh, tapi pakai satu istilah konsisten)

**Offset pagination**:
`LIMIT n OFFSET m`. Bisa lompat ke halaman N, tapi baris yang dilewati tetap dihitung server sehingga halaman dalam melambat (lesson 0020).

**Token bucket**:
Algoritma rate limiting: token diisi ulang dengan laju tetap sampai kapasitas; setiap request mengambil satu token. Kapasitas = burst, refill = rata-rata (lesson 0021).

**Leaky bucket**:
Algoritma rate limiting yang memasukkan request ke antrean dan mengurasnya dengan laju tetap, sehingga keluaran rata (nginx `limit_req`) (lesson 0021).

**Fixed window counter**:
Satu counter per user per jendela waktu yang kedaluwarsa sendiri. Sederhana, tapi bisa meloloskan 2× limit di batas jendela (lesson 0021).

**Sliding window**:
Rate limiting yang menghitung request dalam jendela bergeser: versi log menyimpan timestamp, versi counter menimbang counter jendela sebelumnya (lesson 0021).

**429 Too Many Requests**:
Status code untuk request yang ditolak rate limiter (RFC 6585), boleh disertai `Retry-After` berisi detik atau tanggal (lesson 0021).
_Avoid_: 503 untuk rate limit (default nginx, ubah dengan `limit_req_status`)

**Timeout / deadline**:
Batas waktu menunggu dependency. Deadline = titik waktu absolut yang bisa diteruskan antar service (gRPC). Diturunkan dari percentile latency dependency (lesson 0022).

**Exponential backoff + jitter**:
Jeda antar retry yang dilipatgandakan setiap percobaan dan diberi batas atas, ditambah keacakan supaya client tidak mengulang serentak (lesson 0022).

**Retry budget**:
Batas jumlah retry per proses per waktu (misalnya 60 per menit); kalau habis, request langsung gagal. Mencegah retry berlapis yang saling mengalikan (lesson 0022).

**Circuit breaker**:
Proxy di depan panggilan dependency dengan state Closed (normal), Open (gagal cepat), dan Half-Open (uji kecil sebelum kembali normal) (lesson 0022).

**Bulkhead**:
Mengisolasi sumber daya per dependency (misalnya connection pool sendiri) supaya kegagalan satu dependency tidak menghabiskan sumber daya yang lain (lesson 0022).

**Metrics / logs / traces**:
Tiga signal observability: angka teragregasi untuk alert, catatan event per request, dan jalur request lintas service yang tersusun dari span (lesson 0023).

**Span**:
Satu unit kerja dalam trace, dengan nama, waktu mulai dan selesai, dan span induk (lesson 0023).

**Four golden signals**:
Latency, traffic, errors, saturation: empat metrik yang selalu diukur untuk sistem yang menghadap user (SRE Book) (lesson 0023).

**SLI**:
Service level indicator: ukuran kuantitatif tingkat layanan, misalnya persentase request sukses atau p99 latency (lesson 0023).

**SLO**:
Service level objective: target untuk sebuah SLI dalam periode tertentu, misalnya 99,9% sukses per 30 hari (lesson 0023).

**SLA**:
Service level agreement: kontrak dengan user yang punya konsekuensi (misalnya refund) kalau SLO meleset (lesson 0023).
_Avoid_: SLA untuk target internal (itu SLO)

**Error budget**:
1 − SLO dalam satu periode (99,9% per 30 hari ≈ 43,2 menit). Budget tersisa: rilis jalan; habis: rilis ditahan, fokus ke keandalan (lesson 0023).

**Modular monolith**:
Satu deployable dan satu database, tapi modul berbatas tegas dengan tabel sendiri dan interface publik. Default yang disarankan track ini (lesson 0024).

**Microservices**:
Kumpulan service kecil yang di-deploy sendiri dan memegang datanya sendiri. Menyelesaikan masalah tim dan skala per bagian, dengan biaya operasional dan jaringan (lesson 0024).

**Distributed transaction**:
Operasi yang mengubah data di beberapa database milik service berbeda; ACID satu database tidak lagi berlaku (lesson 0024).

**Saga**:
Urutan transaksi lokal per service; kalau satu langkah gagal, compensating transaction membalik langkah yang sudah selesai (lesson 0024).
_Avoid_: rollback (tidak ada rollback lintas service; yang ada kompensasi)

**Service discovery**:
Mekanisme nama stabil di depan instance yang berganti, misalnya DNS Service di Kubernetes (lesson 0024).

## Studi kasus

**Slug topik 0027–0030**:
`kasus-kerangka-langkah`, `kasus-kerangka-waktu` (0027); `kasus-url-kode`, `kasus-url-redirect` (0028); `kasus-rl-posisi`, `kasus-rl-counter` (0029); `kasus-notif-queue`, `kasus-notif-idempotensi` (0030). Semua soal modul ini memakai prefix `kasus-`.

**Pertanyaan klarifikasi standar**:
Daftar pendek yang ditanyakan di langkah 1: fitur inti, siapa user, DAU, rasio baca:tulis, target p99, availability, consistency, lama penyimpanan data (lesson 0027).
_Avoid_: requirement gathering (proses produk yang panjang)

**Base62**:
Penulisan angka dengan 62 simbol `0-9a-zA-Z`; 7 karakter memberi 62⁷ ≈ 3,5 × 10¹² kode. Dipakai untuk mengubah ID dari sequence menjadi kode pendek (lesson 0028).
_Avoid_: base64 (punya `+` dan `/` yang tidak aman di URL)

**Hash collision**:
Dua input berbeda menghasilkan kode yang sama setelah hash dipotong. Di skala miliaran pasti terjadi (perkiraan birthday n²/2N), jadi ditangkap dengan unique constraint lalu diulang dengan salt (lesson 0028).
_Avoid_: "hash selalu unik"

**Read-heavy**:
Sistem yang jauh lebih banyak dibaca daripada ditulis (mis. 100:1). Deep dive-nya berfokus pada jalur baca: index, cache, read replica (lesson 0028).
_Avoid_: high-traffic (tidak menyebut arah beban)

**Heuristically cacheable**:
Status HTTP yang boleh disimpan cache tanpa header kedaluwarsa eksplisit menurut RFC 9110/9111, misalnya 301. 302 tidak, sehingga setiap klik sampai ke server (lesson 0028).
_Avoid_: "cacheable by default" (nama lama)

**Check-then-act**:
Race condition saat nilai dibaca, diputuskan, lalu ditulis dalam langkah terpisah, sehingga dua proses bisa lolos bersamaan. Pada rate limiter: `GET` lalu `INCR`. Perbaikan: operasi atomic seperti `INCR` lalu bandingkan hasilnya, atau Lua script (lesson 0029).
_Avoid_: bug timing

**Lua script (Redis)**:
Script yang dijalankan Redis secara atomic dengan `EVAL`; tidak ada perintah lain yang menyisip di tengah. Dipakai untuk menggabungkan `INCR` + `EXPIRE` atau token bucket dalam satu round trip (lesson 0029).
_Avoid_: stored procedure

**Fail-open**:
Kalau komponen pelindung (mis. rate limiter) gagal, request tetap diloloskan dan kegagalannya dicatat. Kebalikannya fail-closed: request ditolak. Pilihan bergantung pada requirement (lesson 0029).
_Avoid_: "abaikan error"

**Queue per channel**:
Satu queue + worker terpisah untuk setiap channel (push, SMS, email), supaya provider yang lambat tidak menahan channel lain dan setiap channel bisa diskalakan sesuai kuota provider-nya (lesson 0030).
_Avoid_: satu queue besar untuk semua

**Provider eksternal**:
Layanan pihak ketiga yang benar-benar mengirim notifikasi: APNs (Apple) dan FCM untuk push, gateway SMS, layanan email. Lambat atau gagal di luar kendali Anda, jadi dipanggil dari worker dengan retry (lesson 0030).
_Avoid_: vendor (terlalu umum)

## Penutup
