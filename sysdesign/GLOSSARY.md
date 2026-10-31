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

## Reliabilitas & API

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
