# Roadmap — Interview Fullstack Web Developer untuk aplikasi internal (mid-level)

**Profil:** developer web yang melamar posisi fullstack sekaligus orang IT di kantor, dan perlu jawaban ringkas untuk pertanyaan khas posisi itu
**Format interview yang diantisipasi:** pertanyaan konsep lisan, pertanyaan SQL, cerita pengalaman (sole developer, STAR), dan live coding easy–medium
**Alokasi:** self-paced, tanpa deadline. 10 lesson baca-saja ±20–30 menit + 2 reference, **tanpa kuis dan lab** (penyimpangan dari ADR 0003, lihat [MISSION](./MISSION.md))
**Versi:** Next.js 16, Express 5, Prisma ORM 7, PostgreSQL 18 (dengan catatan MySQL 8.4/9.7)
**Contoh berjalan:** aplikasi internal "Inventaris aset kantor" (aset, kategori, karyawan, peminjaman)
**Istilah:** [GLOSSARY.md](./GLOSSARY.md) · **Indeks lesson:** [index.html](./index.html)

| # | Lesson | Fokus | Durasi |
|---|---|---|---|
| 0001 | Fondasi web dan Next.js | Semantic HTML + a11y dasar, box model, Flex vs Grid, responsive, event delegation, closure, `async/await` + `fetch`; App Router: Server vs Client Component, data fetching dan caching, Server Actions vs memanggil API Express | ±30 menit |
| 0002 | Express dan REST API | Desain resource REST + status code (RFC 9110), routing dan middleware Express 5, error handling terpusat, validasi Zod, layering route → service → Prisma | ±25 menit |
| 0003 | SQL: desain skema dan query | Skema inventaris aset, normalisasi 1NF–3NF, constraint, relasi 1-N dan N-N; JOIN, GROUP BY/HAVING, subquery vs CTE, window function; pertanyaan interview + tulis query | ±30 menit |
| 0004 | SQL: index, transaksi, performa | Index B-tree dan composite, `EXPLAIN ANALYZE`, transaksi + ACID + isolation level, N+1, pagination OFFSET vs keyset; "Beda di MySQL"; pertanyaan interview + tulis query | ±30 menit |
| 0005 | CRUD end-to-end | Fitur "Aset": skema Prisma → migrasi → endpoint Express → halaman Next.js → loading/error state → test; auth, CORS, CSRF, XSS, SQL injection, RBAC sederhana | ±30 menit |
| 0006 | Sole developer aplikasi internal | Requirement → MVP → stack → testing → deploy → backup → monitoring → dokumentasi, SOP, maintenance record; contoh STAR lengkap | ±25 menit |
| 0007 | Peran IT di luar development | IP/subnet, DHCP, DNS, gateway, `ping`/`tracert`/`nslookup`, troubleshooting, backup 3-2-1, akun dan hak akses; multimedia dasar | ±20 menit |
| 0008 | Coding: angka dan string | Palindrome integer tanpa string, reverse integer (overflow), anagram, valid parentheses | ±30 menit |
| 0009 | Coding: array dan pencarian | Two sum, two pointers, sliding window, binary search | ±30 menit |
| 0010 | Simulasi interview | Tiga babak (Fundamental & SQL, CRUD & sole dev, Live coding) dengan contoh jawaban siap baca | ±30 menit |

| Reference | Isi | Durasi |
|---|---|---|
| [Pertanyaan SQL](reference/pertanyaan-sql.html) | ±30 pertanyaan SQL tersering dengan jawaban satu paragraf dan catatan "Beda di MySQL" | ±20 menit baca |
| [Soal coding tambahan](reference/soal-coding-tambahan.html) | ±8 soal ekstra dengan format yang sama dengan 0008–0009 | ±30 menit baca |

Format setiap soal coding: pernyataan soal → pertanyaan klarifikasi → ide → pseudocode → implementasi JavaScript → kompleksitas → edge case.

Menjelang interview: baca ulang dua reference, lalu ulangi simulasi 0010 dengan menjawab keras-keras sebelum membaca contoh jawabannya.
