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

### Skalabilitas

### Data

### Caching

### Asinkron

### Reliabilitas & API

### Studi kasus

- [Google SRE Book, bab 4: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
  Use for: non-functional requirement sebagai angka (SLI: availability, latency, throughput) di langkah 1 kerangka (lesson 0027).
- [Google SRE Book, Appendix A: Availability Table](https://sre.google/sre-book/availability-table/)
  Use for: jatah downtime per "sembilan" saat klarifikasi availability (lesson 0027).
- [Google SRE Book, bab 9: Simplicity](https://sre.google/sre-book/simplicity/)
  Use for: menolak accidental complexity, dasar desain v1 sederhana (lesson 0027).
- [PostgreSQL docs: CREATE SEQUENCE](https://www.postgresql.org/docs/current/sql-createsequence.html)
  Use for: sumber ID unik untuk kode base62 (lesson 0028).
- [PostgreSQL docs: Unique Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)
  Use for: menangkap hash collision dan duplikasi idempotency key (lesson 0028, 0030).
- [Redis docs: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
  Use for: `allkeys-lru` untuk cache link populer (lesson 0028).
- [RFC 9110: HTTP Semantics, 301 dan 302](https://www.rfc-editor.org/rfc/rfc9110.html#status.301)
  Use for: 301 heuristically cacheable vs 302 sementara (lesson 0028); `Retry-After` di `#field.retry-after` (lesson 0029).
- [RFC 6585 bagian 4: 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585.html#section-4)
  Use for: respons penolakan rate limiter (lesson 0029).
- [AWS docs: Throttle requests to your REST APIs (API Gateway)](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
  Use for: rate limiting di gateway dengan token bucket, 429 (lesson 0029).
- [nginx docs: ngx_http_limit_req_module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
  Use for: leaky bucket di reverse proxy; default `limit_req_status 503` (lesson 0029).
- [Redis docs: INCR, Pattern: Rate limiter](https://redis.io/docs/latest/commands/incr/#pattern-rate-limiter)
  Use for: counter fixed window dengan `MULTI`/`EXEC`, race condition key bocor (lesson 0029).
- [Redis docs: Scripting with Lua](https://redis.io/docs/latest/develop/programmability/eval-intro/)
  Use for: eksekusi script atomic (lesson 0029).
- [Redis docs: Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
  Use for: replication asinkron secara default, risiko counter hilang saat failover (lesson 0029).
- [Firebase docs: Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
  Use for: push lewat provider platform, batas payload 4096 byte (lesson 0030).
- [Stripe API reference: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
  Use for: idempotency key dari pemanggil (lesson 0030).
- [AWS Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
  Use for: retry dengan exponential backoff + jitter di worker notifikasi (lesson 0030).
- [Amazon SQS docs: Dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
  Use for: `maxReceiveCount` dan DLQ (lesson 0030).
- [Amazon SQS docs: At-least-once delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html)
  Use for: worker harus idempotent (lesson 0030).

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
