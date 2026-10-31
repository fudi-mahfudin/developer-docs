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

### Asinkron

### Reliabilitas & API

### Studi kasus

### Penutup

## Bacaan (bukan sumber kutipan)

- Martin Kleppmann, *Designing Data-Intensive Applications* (O'Reilly). Bacaan mendalam untuk modul Data dan Asinkron.
- Alex Xu, *System Design Interview – An Insider's Guide*. Contoh format jawaban studi kasus.
