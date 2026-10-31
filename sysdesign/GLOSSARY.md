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

## Asinkron

## Reliabilitas & API

## Studi kasus

## Penutup
