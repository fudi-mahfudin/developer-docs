# Mission: Lolos ronde system design di interview developer mid-level

## Why
Interview developer mid-level sering punya satu ronde system design: lisan atau whiteboard ±45 menit, dengan soal seperti "rancang URL shortener". Target: bisa merancang sistem sederhana sampai menengah dengan trade-off yang masuk akal, **tanpa over-engineering**. Interviewer menilai alasan di balik setiap komponen, bukan banyaknya komponen.

## Success looks like
- Bisa membenarkan setiap komponen dalam desain dengan angka, dan menjelaskan urutan tangga skala (ukur → perubahan termurah → arsitektur baru) tanpa over-engineering
- Bisa menjalankan kerangka 5 langkah untuk soal yang belum pernah dilihat dalam 45 menit
- Bisa menghitung QPS, storage, dan bandwidth kasar dalam < 3 menit
- Bisa menjelaskan trade-off setiap komponen inti (load balancer, cache, replication, sharding, queue) dalam < 1 menit per komponen
- Bisa menjelaskan CAP/PACELC dan memilih consistency model untuk kasus tertentu
- Bisa merancang kelima studi kasus (URL shortener, rate limiter, notification, news feed, chat) dari ingatan, lengkap dengan diagram

## Constraints
- Self-paced, tanpa deadline; lesson ±20 menit per modul tematik (ADR 0003)
- Fokus **konsep untuk interview**, tanpa implementasi: tidak ada lab, tidak ada server yang dijalankan
- Track mandiri: tidak merujuk track lain; istilah di luar system design dijelaskan singkat di tempat
- Bahasa Indonesia, istilah teknis tetap bahasa Inggris

## Out of scope
- Consensus (Raft/Paxos) secara mendalam, multi-region active-active, geospatial, video streaming
- Implementasi atau lab (Docker, Redis, nginx yang dijalankan)
- Cerita STAR / pertanyaan behavioral
