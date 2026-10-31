# 04: Modul Data (0008–0011)

Status: resolved

**Blocked by:** 01

**What to build:** Lesson 0008–0011 sesuai tabel di `../spec.md`: HTML di `sysdesign/lessons/`, bank soal `sysdesign/assets/questions/NNNN.js` (≥ 4 mc, ≥ 1 oral, slug topik baru dicatat di `GLOSSARY.md`), dan test `tests/sysdesign/modul-data.test.js`. Fakta angka/perilaku diberi `.cite` ke sumber primer (spec, bagian Keputusan). Istilah di luar system design dijelaskan 1–2 kalimat di tempat.

- [x] Lesson HTML ±20 menit, satu `win`, minimal satu diagram (`.flow` atau `svg.diagram`)
- [x] `<h2>` "Kapan tidak perlu" di setiap lesson: sinyal/angka yang membenarkan komponen, biaya + risiko, alternatif lebih murah (prinsip inti di spec)
- [x] Bank soal per lesson + `labelTopics`
- [x] Istilah baru di `GLOSSARY.md`, sumber di `RESOURCES.md`
- [x] `tests/sysdesign/modul-data.test.js`

## Comments

- 2026-10-31: selesai. Topik (prefix `data-`): `data-model-db`, `data-acid-base` (0008), `data-index`, `data-replikasi` (0009), `data-partisi`, `data-consistent-hash` (0010), `data-cap-pacelc`, `data-konsistensi` (0011); 8 topik mc untuk pool Review 2 (0019). Setiap lesson 4 mc + 1 oral. Sitasi: PostgreSQL docs (transaksi, isolation, jsonb, index, EXPLAIN, streaming/synchronous replication, hot standby, partitioning), MongoDB docs, Neo4j docs, dan paper Dynamo, Bigtable, Karger 1997, Gilbert & Lynch 2002, Abadi 2012; kutipan dicek terhadap teks halaman/PDF. Pengecualian: PDF Gilbert & Lynch berupa scan (teks tidak bisa diekstrak), jadi teorema CAP diparafrasekan tanpa kutipan langsung. Artikel BASE (Pritchett, ACM Queue) 403 dan tidak dikutip; BASE dijelaskan lewat Dynamo. `modul-data.test.js` juga mengecek slug tercatat di GLOSSARY `## Data`, hanya satu `<marker id="panah">` per halaman, tidak ada sumber non-primer, dan status tersedia di index.
