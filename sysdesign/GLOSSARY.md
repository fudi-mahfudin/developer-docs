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

## Caching

## Asinkron

## Reliabilitas & API

## Studi kasus

## Penutup
