# System Design Interview Resources

Sumber untuk `<sup class="cite">` harus primer (ADR 0003). Agent lesson menambahkan halaman spesifik (bukan halaman depan) beserta "Use for" saat fakta dipakai, dan memverifikasi URL saat itu.

## Knowledge

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
  Use for: method, status code, caching header, idempotent method.
- [RFC 6455: The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455)
  Use for: handshake dan koneksi WebSocket (0020, chat).
- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585)
  Use for: 429 Too Many Requests (0021, rate limiter).
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
  Buku resmi Google, gratis daring. Use for: SLI/SLO/SLA, error budget, monitoring, cascading failure, load balancing.
- Dokumentasi resmi komponen: [Redis](https://redis.io/docs/latest/), [Apache Kafka](https://kafka.apache.org/documentation/), [RabbitMQ](https://www.rabbitmq.com/docs), [nginx](https://nginx.org/en/docs/), [AWS Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/), [Amazon CloudFront](https://docs.aws.amazon.com/cloudfront/), [PostgreSQL](https://www.postgresql.org/docs/current/), [gRPC](https://grpc.io/docs/)
  Use for: perilaku konkret komponen (eviction policy, consumer group, algoritma load balancing, replication).
- Paper asli (tambahkan tautan resmi saat dipakai): DeCandia et al. 2007 "Dynamo: Amazon's Highly Available Key-value Store"; Karger et al. 1997 "Consistent Hashing and Random Trees"; Gilbert & Lynch 2002 "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services"; Abadi 2012 "Consistency Tradeoffs in Modern Distributed Database System Design" (PACELC); Chang et al. 2006 "Bigtable".
  Use for: consistent hashing, CAP, PACELC, quorum, wide-column store.

### Fondasi

- [Jeff Dean, LADIS 2009 keynote "Designs, Lessons and Advice from Building Large Distributed Systems"](https://www.cs.cornell.edu/projects/ladis2009/talks/dean-keynote-ladis2009.pdf)
  Use for: slide 23 "Designing Efficient Systems" (estimasi tanpa membangun, lesson 0001, 0004), slide 24 "Numbers Everyone Should Know" (angka latency 2009, disk berputar, lesson 0002, 0003, 0004), slide 25–27 "Back of the Envelope Calculations" (lesson 0004).
- [Google SRE Book, bab 4 Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
  Use for: SLI/SLO, latency dan throughput sebagai SLI, percentile vs rata-rata, tail latency (lesson 0001, 0003).
- [Google SRE Book, Availability Table](https://sre.google/sre-book/availability-table/)
  Use for: availability 99%/99,9%/99,99% → jatah downtime per tahun/bulan/hari (lesson 0001).
- [RFC 9110 HTTP Semantics, §3 dan §3.3](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.3)
  Use for: client-server, request/response, HTTP stateless (lesson 0002).
- [RFC 1034 Domain Names: Concepts and Facilities, §2.4 dan §3.6](https://www.rfc-editor.org/rfc/rfc1034.html#section-3.6)
  Use for: resolver, resource record, TTL cache DNS (lesson 0002).
- [RFC 9293 TCP, §3.5](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.5)
  Use for: three-way handshake, satu RTT sebelum data (lesson 0002).
- [RFC 8446 TLS 1.3, §2.3](https://www.rfc-editor.org/rfc/rfc8446.html#section-2.3)
  Use for: handshake penuh TLS 1.3 = "1-RTT handshake" (lesson 0002).
- [RFC 9112 HTTP/1.1, §9.3](https://www.rfc-editor.org/rfc/rfc9112.html#section-9.3)
  Use for: persistent connection, koneksi dipakai ulang (lesson 0002).

### Skalabilitas

### Data

### Caching

### Asinkron

### Reliabilitas & API

### Studi kasus

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
