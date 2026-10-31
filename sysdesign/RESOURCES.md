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

- [RFC 9110 §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#idempotent.methods)
  Use for: method idempotent, retry aman (lesson 0020, 0022).
- [gRPC: Introduction](https://grpc.io/docs/what-is-grpc/introduction/) · [Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/) · [FAQ](https://grpc.io/docs/what-is-grpc/faq/)
  Use for: Protocol Buffers sebagai IDL, empat jenis RPC, HTTP/2, gRPC-Web untuk browser (lesson 0020).
- [RFC 6202 §2 Long Polling](https://www.rfc-editor.org/rfc/rfc6202.html#section-2)
  Use for: long polling dan HTTP streaming (lesson 0020).
- [WHATWG HTML §9.2 Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
  Use for: `text/event-stream`, reconnection time, `Last-Event-ID` (lesson 0020).
- [RFC 6455 §1.1 WebSocket Background](https://www.rfc-editor.org/rfc/rfc6455.html#section-1.1)
  Use for: tujuan WebSocket menggantikan long polling (lesson 0020).
- [PostgreSQL docs: LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
  Use for: offset besar tidak efisien (lesson 0020).
- [AWS API Gateway: Throttle requests](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
  Use for: token bucket, rate = refill, burst = kapasitas (lesson 0021).
- [nginx: ngx_http_limit_req_module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
  Use for: leaky bucket, `burst`, default status 503 / `limit_req_status` (lesson 0021).
- [Redis docs: INCR, pattern rate limiter](https://redis.io/docs/latest/commands/incr/#pattern-rate-limiter)
  Use for: fixed window counter dengan INCR + EXPIRE (lesson 0021).
- [RFC 6585 §4 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585.html#section-4) · [RFC 9110 §10.2.3 Retry-After](https://www.rfc-editor.org/rfc/rfc9110.html#field.retry-after)
  Use for: response rate limiting dan format Retry-After (lesson 0021).
- [gRPC: Deadlines](https://grpc.io/docs/guides/deadlines/)
  Use for: tanpa deadline client menunggu "effectively forever" (lesson 0022).
- [AWS Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
  Use for: timeout dari percentile (p99.9), retry 5 layer × 3 = 243×, backoff, jitter, retry hanya untuk API idempotent (lesson 0022).
- [Google SRE Book ch. 22: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
  Use for: randomized exponential backoff, retry budget 60 per menit (lesson 0022).
- [Azure Architecture Center: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) · [Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)
  Use for: state Closed/Open/Half-Open, connection pool per dependency (lesson 0022).
- [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/) · [Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
  Use for: traces, metrics, logs, baggage; span (lesson 0023).
- [Google SRE Book ch. 6: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
  Use for: four golden signals (lesson 0023, 0025).
- [Google SRE Book ch. 4: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) · [ch. 3: Embracing Risk](https://sre.google/sre-book/embracing-risk/) · [Availability Table](https://sre.google/sre-book/availability-table/)
  Use for: SLI/SLO/SLA, error budget dan rilis ditahan, downtime per jumlah sembilan (lesson 0023).
- [Azure Architecture Center: Microservices architecture style](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices)
  Use for: definisi dan tantangan microservices (lesson 0024, 0025).
- [Azure Architecture Center: Saga pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/saga)
  Use for: transaksi lokal + compensating transaction (lesson 0024).
- [Kubernetes docs: Service, Discovering services](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services)
  Use for: service discovery lewat DNS (lesson 0024).
- [Google SRE Book ch. 9: Simplicity](https://sre.google/sre-book/simplicity/)
  Use for: "boring" sebagai kebajikan, kompleksitas esensial vs aksidental (lesson 0025).
- [PostgreSQL docs: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) · [Indexes intro](https://www.postgresql.org/docs/current/indexes-intro.html) · [Hot Standby](https://www.postgresql.org/docs/current/hot-standby.html)
  Use for: ukur dengan query plan, index vs scan seluruh tabel, read replica read-only (lesson 0025).
- [Azure Architecture Center: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) · [Queue-Based Load Leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling)
  Use for: biaya/risiko anak tangga cache dan queue (lesson 0025).

### Studi kasus

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
