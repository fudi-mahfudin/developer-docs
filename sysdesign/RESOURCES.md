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

- [Azure Architecture Center: Cache-Aside pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
  Use for: alur cache-aside, urutan update database lalu hapus cache, konsistensi, local vs shared cache, kapan pola ini tidak cocok (lesson 0013, 0014, 0015).
- [Amazon ElastiCache: Caching strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html)
  Use for: lazy loading (miss = 3 trip), write-through (dua trip per write, cache churn), menambah TTL (lesson 0013, 0014).
- [Oracle Coherence 14.1.1: Caching Data Sources](https://docs.oracle.com/en/middleware/standalone/coherence/14.1.1.0/develop-applications/caching-data-sources.html)
  Use for: definisi read-through, write-through, write-behind (write-coalescing, cache sebagai system of record), refresh-ahead (lesson 0013).
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
  Use for: private vs shared cache, freshness (`max-age`), invalidation setelah unsafe method, "collapse requests" (lesson 0013, 0014, 0015).
- [Amazon CloudFront: Increase the cache hit ratio](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-hit-ratio.html)
  Use for: definisi cache hit ratio, `Cache-Control max-age` dari origin (lesson 0013).
- [nginx: Module ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
  Use for: `proxy_cache`, `proxy_cache_lock`, `proxy_cache_use_stale updating`, `proxy_cache_background_update` (lesson 0013, 0015).
- [Redis docs: Client-side caching reference](https://redis.io/docs/latest/develop/reference/client-side-caching/)
  Use for: local cache vs jaringan, tracking + pesan `INVALIDATE`, TTL maksimum di local cache (lesson 0013, 0014, 0015).
- [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
  Use for: alternatif lebih murah sebelum cache, yaitu membaca query plan (lesson 0013).
- [Redis docs: EXPIRE](https://redis.io/docs/latest/commands/expire/)
  Use for: TTL, expiry pasif dan aktif (lesson 0014).
- [Redis docs: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
  Use for: `maxmemory`, `maxmemory-policy` (noeviction, allkeys-lru, allkeys-lfu, volatile-*), LRU/LFU aproksimasi (lesson 0014).
- [Amazon CloudFront: Invalidate files to remove content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
  Use for: versioned file names vs invalidation, biaya invalidation (lesson 0014).
- [Vattani, Chierichetti, Lowenstein 2015, "Optimal Probabilistic Cache Stampede Prevention", PVLDB 8(8)](https://www.vldb.org/pvldb/vol8/p886-vattani.pdf)
  Paper asli. Use for: definisi cache stampede, kelemahan locking, probabilistic early expiration (XFetch) (lesson 0015).
- [RFC 5861: HTTP Cache-Control Extensions for Stale Content](https://www.rfc-editor.org/rfc/rfc5861.html)
  Use for: `stale-while-revalidate`, `stale-if-error` (lesson 0015).
- [Redis docs: SET](https://redis.io/docs/latest/commands/set/)
  Use for: `SET … NX EX` sebagai lock sederhana dengan TTL (lesson 0015).
- [Redis docs: redis-cli](https://redis.io/docs/latest/develop/tools/cli/)
  Use for: `--hotkeys` (butuh policy LFU) untuk mendeteksi hot key (lesson 0015).
- [Amazon DynamoDB: Using write sharding to distribute workloads evenly](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-sharding.html)
  Use for: suffix acak untuk menyebar key panas (lesson 0015).
- [Amazon CloudFront: Use Origin Shield](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html)
  Use for: cache berlapis, regional edge cache, request ke origin yang digabung (lesson 0015).

### Asinkron

- [Apache Kafka 4.4 docs: Introduction](https://kafka.apache.org/44/getting-started/introduction/#main-concepts-and-terminology)
  Use for: topic, partition, key → partition yang sama, urutan per partition, event tidak dihapus setelah dibaca (lesson 0016, 0017).
- [Apache Kafka 4.4 docs: Design](https://kafka.apache.org/44/design/design/#message-delivery-semantics)
  Use for: consumer group + offset (`#consumer-position`), at-most/at-least/exactly-once, default at-least-once, idempotent producer (lesson 0016, 0017).
- [RabbitMQ: AMQP 0-9-1 Model Explained](https://www.rabbitmq.com/tutorials/amqp-concepts)
  Use for: exchange, binding, fanout/direct, pesan dihapus setelah ack (lesson 0016).
- [RabbitMQ: Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms)
  Use for: automatic requeueing, requeue/redelivery loop, prefetch sebagai batas in-flight (lesson 0017, 0018).
- [RabbitMQ: Dead Letter Exchanges](https://www.rabbitmq.com/docs/dlx)
  Use for: empat kondisi dead-lettering, `delivery-limit` (lesson 0017).
- [Redis docs: Pub/Sub](https://redis.io/docs/latest/develop/pubsub/)
  Use for: Redis Pub/Sub at-most-once (lesson 0016).
- [PostgreSQL docs: SELECT, locking clause](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE)
  Use for: `SKIP LOCKED` untuk tabel mirip queue, alternatif murah sebelum broker (lesson 0016).
- [Azure Architecture Center: Publisher-Subscriber pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber)
  Use for: alasan asinkron (sender tidak blocking), salinan per subscriber, urutan tidak dijamin (lesson 0016).
- [Azure Architecture Center: Competing Consumers pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/competing-consumers)
  Use for: setiap pesan ke satu consumer, idempotent, poison message (lesson 0016).
- [Amazon SQS: At-least-once delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html)
  Use for: standard queue bisa mengantar duplikat, desain idempotent (lesson 0017).
- [Amazon SQS: Using dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
  Use for: `maxReceiveCount`, DLQ untuk debugging, DLQ merusak urutan FIFO (lesson 0017).
- [Amazon SQS: Exactly-once processing (FIFO)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html)
  Use for: deduplication interval 5 menit di FIFO queue (lesson 0017).
- [Stripe API Reference: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
  Use for: idempotency key, UUID v4, maks 255 karakter, respons tersimpan termasuk 500, key dibuang setelah ≥ 24 jam (lesson 0017).
- [Azure Architecture Center: Event-driven architecture style](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven)
  Use for: producer/consumer/channel, decoupling, eventual consistency, observability (lesson 0018).
- [AWS Prescriptive Guidance: Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
  Use for: dual write, outbox dalam satu transaksi, duplikat dan urutan, CDC (lesson 0018).
- [Azure Architecture Center: Queue-Based Load Leveling pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling)
  Use for: queue sebagai buffer, tidak cocok untuk respons sinkron latency rendah, autoscaling memindahkan overload (lesson 0018).
- [AWS Builders' Library: Avoiding insurmountable queue backlogs](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/)
  Use for: perilaku bimodal, umur pesan sebagai metrik, back-pressure ke producer, TTL/sidelining (lesson 0018).

### Reliabilitas & API

### Studi kasus

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
