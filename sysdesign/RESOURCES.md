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

- [Azure Architecture Center: Autoscaling](https://learn.microsoft.com/en-us/azure/architecture/best-practices/auto-scaling)
  Use for: definisi vertical vs horizontal scaling, vertical sering butuh downtime (lesson 0005).
- [Azure Architecture Center: Design to scale out](https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/scale-out)
  Use for: "any instance can handle any request", hindari stickiness, temukan bottleneck dulu, design for scale in (lesson 0005, 0006).
- [Redis docs: Redis session store](https://redis.io/docs/latest/develop/use-cases/session-store/)
  Use for: session di memori server vs database vs Redis, sticky routing = hot spot + tanpa failover, TTL per session (lesson 0005).
- [RFC 7519: JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519.html)
  Use for: penjelasan singkat JWT sebagai token session di client (lesson 0005).
- [AWS: What is a Network Load Balancer?](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html) · [AWS: What is an Application Load Balancer?](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
  Use for: L4 vs L7 (layer OSI), routing berdasarkan isi trafik (lesson 0006).
- [AWS: How Elastic Load Balancing works](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html)
  Use for: flow hash NLB, round robin default ALB, X-Forwarded-For (lesson 0006).
- [AWS: Create an HTTPS listener for your Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html)
  Use for: TLS termination di L7 vs TCP passthrough di L4 (lesson 0006).
- [AWS: Edit target group attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html)
  Use for: round robin vs least outstanding requests, deregistration delay 300 detik, sticky sessions berbasis cookie (lesson 0006).
- [AWS: Health checks for Application Load Balancer target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
  Use for: interval default 30 detik, threshold 2/5, fail open (lesson 0006).
- [nginx: Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html) · [nginx: ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
  Use for: round robin default, least_conn, ip_hash, weight, health check pasif (max_fails), `hash … consistent` (ketama) (lesson 0006).
- [Google SRE Book, bab 20: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)
  Use for: round robin bisa timpang hingga 2x CPU, least-loaded round robin, lame duck (lesson 0006).
- [Google SRE Book, bab 19: Load Balancing at the Frontend](https://sre.google/sre-book/load-balancing-frontend/)
  Use for: DNS load balancing sebagai alternatif sederhana dan keterbatasannya (lesson 0006).
- [RFC 9110 §3.7: Intermediaries](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.7)
  Use for: definisi reverse proxy (gateway) (lesson 0007).
- [RFC 9111 §1: shared and private caches](https://www.rfc-editor.org/rfc/rfc9111.html#shared.and.private.caches)
  Use for: CDN sebagai shared cache, browser sebagai private cache (lesson 0007).
- [nginx: ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
  Use for: proxy_pass, proxy_cache (lesson 0007).
- [Azure Architecture Center: API gateways](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway) · [Gateway Offloading pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-offloading)
  Use for: definisi API gateway, biaya hop/bottleneck/SPOF, kapan pola tidak cocok (lesson 0007).
- [Azure Architecture Center: CDN guidance](https://learn.microsoft.com/en-us/azure/architecture/best-practices/cdn)
  Use for: definisi CDN, edge, konten statis, tantangan versioning (lesson 0007).
- [Amazon CloudFront: How CloudFront delivers content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html) · [Expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) · [Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
  Use for: alur cache hit/miss di edge (pull), default TTL 24 jam, invalidation vs nama file berversi (lesson 0007).
- [KeyCDN Support: Push Zone](https://www.keycdn.com/support/zones/push-zone)
  Use for: push CDN; disarankan untuk file > 10 MB, wajib > 100 MB (lesson 0007).

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

### Reliabilitas & API

### Studi kasus

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
