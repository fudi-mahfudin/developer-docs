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

- [PostgreSQL: Transactions (tutorial)](https://www.postgresql.org/docs/current/tutorial-transactions.html) · [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
  Use for: transaksi all-or-nothing (ACID), Read Committed default (lesson 0008).
- [PostgreSQL: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
  Use for: jsonb + GIN index sebagai alternatif murah document store (lesson 0008).
- [MongoDB: Documents](https://www.mongodb.com/docs/manual/core/document/)
  Use for: document store, BSON, batas dokumen 16 MiB (lesson 0008).
- [Neo4j: What is a graph database](https://neo4j.com/docs/getting-started/graph-database/)
  Use for: model graph (node, relationship, property) (lesson 0008).
- [DeCandia et al. 2007, Dynamo (SOSP)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
  Use for: key-value store, ACID vs availability, consistent hashing ring, virtual node, quorum (N, R, W) = (3, 2, 2), sloppy quorum, vector clock, read-your-writes (lesson 0008, 0010, 0011).
- [Chang et al. 2006, Bigtable (OSDI)](https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/)
  Use for: wide-column (sorted map per row key), range partitioning menjadi tablet 100–200 MB (lesson 0008, 0010).
- [PostgreSQL: Indexes, Introduction](https://www.postgresql.org/docs/current/indexes-intro.html) · [Index Types](https://www.postgresql.org/docs/current/indexes-types.html) · [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
  Use for: Seq Scan vs index, B-tree default (equality + range), overhead write, EXPLAIN ANALYZE (lesson 0009).
- [PostgreSQL: Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html#STREAMING-REPLICATION) · [Hot Standby](https://www.postgresql.org/docs/current/hot-standby.html)
  Use for: streaming replication async default, synchronous replication dan biayanya, pg_stat_replication, read replica read-only (lesson 0009).
- [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
  Use for: range/list/hash partitioning, patokan "tabel melebihi RAM server" (lesson 0010).
- [Karger et al. 1997, Consistent Hashing and Random Trees (STOC)](https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf)
  Use for: kenapa hash mod N gagal saat jumlah node berubah, definisi consistent hashing (lesson 0010).
- [Gilbert & Lynch 2002, Brewer's Conjecture (SIGACT News)](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer6.pdf)
  Use for: bukti formal CAP (lesson 0011). PDF hasil scan, teks tidak bisa di-grep.
- [Abadi 2012, Consistency Tradeoffs in Modern Distributed Database System Design (IEEE Computer)](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf)
  Use for: CAP hanya saat partition, PACELC, kelas PA/EL vs PC/EC, batas R + W > N (lesson 0011).

### Caching

### Asinkron

### Reliabilitas & API

### Studi kasus

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
