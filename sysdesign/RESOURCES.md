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
