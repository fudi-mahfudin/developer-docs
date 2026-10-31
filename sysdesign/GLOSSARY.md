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

## Asinkron

## Reliabilitas & API

## Studi kasus

## Penutup
