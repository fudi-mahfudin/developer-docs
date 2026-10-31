# 07: Modul Asinkron (0016–0018)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0016–0018 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-asinkron.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat.

- [x] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [x] `<h2>` "Kapan tidak perlu" di setiap lesson: sinyal/angka yang membenarkan komponen, biaya + risiko, alternatif lebih murah (prinsip inti di spec)
- [x] Bank soal per lesson + `labelTopics`
- [x] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [x] `tests/sysdesign/modul-asinkron.test.js`

## Comments

- 2026-10-31: Selesai. Lesson 0016–0018 di `sysdesign/lessons/`, bank `sysdesign/assets/questions/0016.js`–`0018.js` (masing-masing 5 mc + 1 oral). Slug: `async-queue-pubsub`, `async-log-broker` (0016), `async-delivery`, `async-idempotency` (0017), `async-event-outbox`, `async-backpressure` (0018), dicatat di `GLOSSARY.md` bagian Asinkron bersama istilahnya. Sumber di `RESOURCES.md` bagian Asinkron. Test `tests/sysdesign/modul-asinkron.test.js` (topik/prefix, kata kunci spec per lesson, slug di glossary, win/kicker/cite/diagram/quiz/lisan/"Kapan tidak perlu", index tersedia, nav 0015→0019). Cite dari Kafka 4.4 docs, RabbitMQ docs, Amazon SQS docs, Stripe API Reference, Azure Architecture Center, AWS Prescriptive Guidance, AWS Builders' Library, Redis docs, PostgreSQL docs; semua URL dicek HTTP 200 hari ini. Outbox di-cite dari AWS Prescriptive Guidance, bukan microservices.io. Review 0026 nanti: pool modul ini punya 6 topik mc `async-`.
