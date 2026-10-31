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

## Reliabilitas & API

## Studi kasus

## Penutup
