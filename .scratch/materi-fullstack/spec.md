Status: resolved

# Spec: Track fullstack ringkas untuk interview Fullstack/IT internal (10 lesson, branch `on-bsm`)

Hasil grilling 2026-11-16. Konvensi umum ada di `docs/adr/0003-konvensi-materi-baru.md`. Spec ini mencatat hal yang khusus untuk track ini, termasuk penyimpangan dari ADR 0003.

## Problem Statement

Saya bersiap untuk interview satu posisi spesifik: developer web fullstack yang juga menjadi orang IT di kantor. JD-nya meminta: membangun dan merawat aplikasi web dan sistem internal (front-end, back-end, integrasi database, API), troubleshooting/testing/deployment/maintenance, bekerja dengan tim operasional dan administrasi untuk menerjemahkan kebutuhan bisnis, menyiapkan dokumentasi teknis, prosedur sistem, dan maintenance record, memonitor performa dan melakukan preventive maintenance. Ditambah tugas non-dev: perawatan hardware/jaringan/perangkat user dan multimedia dasar. Syarat teknisnya: HTML, CSS, JavaScript, konsep front-end modern, back-end, REST API, server-side logic, database relasional (MySQL/PostgreSQL), dan desain database dasar.

Repo sudah punya track Node.js/NestJS yang mendalam, tapi belum ada materi ringkas yang menjawab pertanyaan khas posisi ini: "jelaskan langkah membuat fitur CRUD dari frontend sampai backend", "bagaimana kamu bekerja sebagai sole developer aplikasi internal", pertanyaan SQL tersering, dan soal coding (misalnya palindrome integer tanpa konversi ke string).

## Solution

Track baru `fullstack/` berisi **10 lesson padat** (±20–30 menit) dengan stack Next.js App Router + Express + PostgreSQL (Prisma), ditambah 2 halaman reference. Track ini **baca-saja**: tidak ada kuis, input, atau isian. Semua contoh jawaban (query, kode, pseudocode, cerita STAR, jawaban lisan) langsung ditampilkan. Tanpa lab. Satu contoh berjalan dipakai di seluruh track: **aplikasi internal "Inventaris aset kantor"** (aset, kategori, karyawan, peminjaman).

**Track ini hanya hidup di branch `on-bsm` dan tidak pernah di-merge ke `main`.**

## Keputusan

- **Target:** JD di atas, level mid. Interview menjadi tujuan di MISSION, tanpa tanggal.
- **Fokus software development.** Tugas non-dev (IT support/jaringan dan multimedia) digabung dalam **satu** lesson ringkas (0007), di level "bisa menjawab di interview".
- **Stack:**
  - Frontend: Next.js App Router (Server/Client Component, Server Actions, Route Handlers) yang memanggil **API Express terpisah**. Pages Router hanya disebut sebagai perbandingan singkat. Lesson menjawab pertanyaan "kenapa tidak langsung ke DB dari Server Actions?".
  - Backend: Express 5, validasi Zod, layering route → service → Prisma.
  - Database: **PostgreSQL** sebagai dialek utama, dengan kotak **"Beda di MySQL"** setiap kali sintaks atau perilakunya berbeda (mis. `GENERATED`/`SERIAL` vs `AUTO_INCREMENT`, `ON CONFLICT` vs `ON DUPLICATE KEY UPDATE`, dukungan window function/CTE di MySQL ≥ 8). Soal SQL ditulis dalam raw SQL, kode aplikasi memakai Prisma.
  - Versi stabil Next.js, Express, Prisma, dan PostgreSQL **diverifikasi di dokumentasi resmi saat prefactor**, lalu dicatat di MISSION. Fitur yang bergantung versi diberi label versi di tempat disebut.
- **Topik pendukung diselipkan, bukan dibuat lesson terpisah:** auth (session vs JWT, cookie httpOnly), keamanan web (CORS, CSRF, XSS, SQL injection), dan RBAC sederhana masuk di 0005. Testing, deploy, backup, dan monitoring masuk di 0006.
- **Baca-saja:** tidak ada bank soal, kuis mc/oral, review, `timer.js`, atau elemen yang meminta input. Jawaban tidak disembunyikan di `<details>`. Tidak ada `learning-records/`, `assets/questions/`, atau `NOTES.md`. `star/draf-star.md` tidak disentuh.
- **Sole developer (0006):** kerangka langkah + jawaban contoh. Requirement dari user non-teknis → scoping MVP → stack yang bisa dirawat sendiri → testing → deploy → backup → monitoring dan preventive maintenance → dokumentasi teknis, SOP sistem, dan maintenance record (dengan contoh dokumen yang sudah terisi). Lesson ini memuat **satu contoh cerita STAR lengkap** (S/T/A/R, ada angka di Result) dengan skenario aplikasi inventaris aset, ditulis langsung di lesson.
- **Soal coding (0008, 0009, dan reference):** setiap soal mengikuti urutan:
  1. pernyataan soal
  2. pertanyaan klarifikasi untuk interviewer
  3. ide/pendekatan
  4. **pseudocode** (jawaban utama)
  5. implementasi JavaScript (langsung tampil)
  6. kompleksitas waktu/ruang
  7. edge case (mis. palindrome integer: angka negatif, angka berakhiran 0, overflow; teknik membalik separuh angka)
  
  Tingkatnya easy–medium. DP dan graph tidak dibahas, cukup disebut di RESOURCES.
- **SQL:** 0003 dan 0004 ditutup dengan blok "Pertanyaan interview" (tanya-jawab singkat) dan 1–2 contoh "tulis query" berbasis skema inventaris aset, dengan query jawaban dan penjelasannya langsung tampil.
- **Track mandiri:** tidak merujuk track `dotnet/`, `fhir/`, `sysdesign/`, atau `nodejs/`. Istilah di luar topik dijelaskan 1–2 kalimat di tempat.
- **Sumber primer** untuk `.cite`: dokumentasi Next.js, React, MDN (HTML/CSS/JS/HTTP/CORS), Express, Prisma, Zod, PostgreSQL, MySQL; RFC 9110 (HTTP semantics, status code), RFC 6265 (cookie), RFC 7519 (JWT); OWASP Cheat Sheet Series (XSS, CSRF, SQL injection, password storage). Buku, kursus, LeetCode, dan blog hanya dicantumkan di `RESOURCES.md`.

## Penyimpangan dari ADR 0003 (dicatat juga di MISSION)

1. **Baca-saja: tanpa bank soal per lesson, tanpa review, tanpa modul tematik.** Penguasaan tidak dilacak (tanpa learning record/`data-topics`). 0010 diganti simulasi interview berbentuk tanya-jawab yang langsung dibaca.
2. **Durasi lesson boleh sampai ±30 menit** karena materinya padat. Durasi ditulis di kicker setiap lesson dan di ROADMAP.
3. **Tidak membuat ADR baru**, karena track ini hanya ada di branch `on-bsm`.

## Urutan lesson

| # | File | Isi | ±menit |
|---|---|---|---|
| 0001 | `0001-fondasi-web-dan-nextjs.html` | Semantic HTML + a11y dasar, box model, Flex vs Grid, responsive, event bubbling/delegation, closure/scope, `async/await` + `fetch` singkat; Next.js App Router: Server vs Client Component, data fetching dan caching, Server Actions vs memanggil API Express | 30 |
| 0002 | `0002-express-dan-rest-api.html` | Desain resource REST + status code (RFC 9110), routing dan middleware Express 5, error handling terpusat (async error di Express 5), validasi Zod, layering route → service → Prisma | 25 |
| 0003 | `0003-sql-desain-skema-dan-query.html` | Skema inventaris aset, normalisasi (1NF–3NF), PK/FK/UNIQUE/CHECK, relasi 1-N dan N-N; JOIN (inner/left), GROUP BY/HAVING, subquery vs CTE, window function (`ROW_NUMBER`, top-N per kategori); blok pertanyaan interview + tulis query | 30 |
| 0004 | `0004-sql-index-transaksi-performa.html` | Index (B-tree, composite dan urutan kolom, kapan index merugikan), `EXPLAIN`/`EXPLAIN ANALYZE`, transaksi + ACID + isolation level, N+1 (dan cara Prisma menghindarinya), pagination OFFSET vs keyset; kotak "Beda di MySQL"; blok pertanyaan interview + tulis query | 30 |
| 0005 | `0005-crud-end-to-end.html` | Walkthrough fitur "Aset" langkah demi langkah: skema Prisma → migrasi → endpoint Express (list dengan pagination/search/filter, detail, create, update, delete/soft delete) → halaman Next.js (list, form, edit, hapus) → loading/error state → test; disisipi auth (session vs JWT, cookie httpOnly), CORS, CSRF, XSS, SQL injection, dan RBAC sederhana di titik yang relevan | 30 |
| 0006 | `0006-sole-developer-aplikasi-internal.html` | Langkah sole developer (lihat Keputusan); contoh SOP dan maintenance record yang sudah terisi; contoh cerita STAR lengkap | 25 |
| 0007 | `0007-peran-it-di-luar-development.html` | IT support dan jaringan dasar (IP/subnet, DHCP, DNS, gateway, `ping`/`tracert`/`nslookup`, alur troubleshooting "tidak bisa internet/printer", backup 3-2-1, akun dan hak akses); multimedia (tools, workflow singkat, istilah resolusi/format/kompresi/aspect ratio, cara menjawab jujur + portofolio) | 20 |
| 0008 | `0008-coding-angka-dan-string.html` | Palindrome integer tanpa konversi string, reverse integer (dengan overflow), anagram, valid parentheses | 30 |
| 0009 | `0009-coding-array-dan-pencarian.html` | Two sum (hash map), two pointers (mis. pair pada array terurut atau hapus duplikat), sliding window (substring terpanjang tanpa karakter berulang), binary search | 30 |
| 0010 | `0010-simulasi-interview.html` | Simulasi interview tiga babak (Fundamental & SQL, CRUD & sole dev, Live coding): daftar pertanyaan yang mungkin muncul dari JD, masing-masing dengan contoh jawaban lisan siap baca (±3–6 kalimat) atau pseudocode, merujuk lesson terkait | 30 |

## MISSION (`fullstack/MISSION.md`)

**Mission:** Lolos interview Fullstack Web Developer untuk aplikasi internal (dengan peran IT pendukung) sesuai JD di spec.

**Success looks like:**
- Bisa menjelaskan langkah membuat fitur CRUD dari halaman Next.js sampai tabel PostgreSQL dalam ±3 menit, termasuk validasi, error handling, dan keamanan
- Bisa menjawab ±30 pertanyaan SQL tersering dan menulis query JOIN/GROUP BY/window function di kertas
- Bisa menceritakan alur kerja sole developer, dari requirement sampai maintenance record, dengan contoh cerita STAR
- Bisa menyelesaikan soal coding easy–medium dengan pseudocode, termasuk kompleksitas dan edge case (mis. palindrome integer tanpa string)
- Bisa menjawab pertanyaan dasar IT support/jaringan dan multimedia dengan jujur dan konkret

**Constraints:** self-paced tanpa deadline, 10 lesson baca-saja ±20–30 menit (penyimpangan dari ADR 0003 dicatat), tanpa kuis atau lab, versi terverifikasi, Bahasa Indonesia dengan istilah teknis bahasa Inggris, hanya di branch `on-bsm`.

**Out of scope:** dasar sintaks JS pemula, Pages Router secara mendalam, GraphQL, microservices, Docker/Kubernetes secara mendalam, DP/graph, hands-on hardware/jaringan, tutorial tools multimedia, proyek yang dijalankan.

## Reference (`fullstack/reference/`)

1. `pertanyaan-sql.html`: ±30 pertanyaan SQL tersering dengan jawaban satu paragraf, contoh memakai skema inventaris aset, dan catatan "Beda di MySQL" bila relevan.
2. `soal-coding-tambahan.html`: ±8 soal coding ekstra dengan format yang sama (mis. FizzBuzz, digit sum/angka Armstrong, cek bilangan prima, merge dua array terurut, karakter pertama yang tidak berulang, rotate array, max subarray/Kadane, valid anagram dengan hitungan karakter).

## Format lesson

Mengikuti format lesson `nodejs/` (lihat `nodejs/lessons/0001-*.html`):
- Kicker: `Lesson NNNN · Fullstack · ±N menit`.
- Satu `<div class="win">` per lesson, sitasi `<sup class="cite">` dinomori per lesson dengan daftar "Sumber" di akhir, dan `<nav class="lesson-nav">` (0001 dan 0010 juga ke `../index.html`).
- Tanpa `<script>` komponen interaktif (`bank.js`, `review.js`, `timer.js`, `order.js`, dan sejenisnya).
- Diagram: `.flow` untuk alur linear (mis. alur CRUD 0005, alur sole dev 0006), `svg.diagram` untuk alur bercabang.
- Blok kode pendek (sebaiknya ≤ 20 baris per blok).

## Testing

- `tests/fullstack/track.test.js` (port dari `tests/nodejs/track.test.js`):
  - daftar lesson diturunkan dari `fullstack/index.html`
  - tidak ada elemen interaktif: tidak memuat `bank.js`, `review.js`, `timer.js`, `order.js`, atau `assets/questions/`, serta tidak ada `<input>`, `<textarea>`, atau `<details>`
  - kicker `Lesson NNNN · Fullstack · `
  - tidak ada tautan ke `dotnet/`, `fhir/`, `sysdesign/`, `nodejs/`, atau `star/`
  - tidak ada deadline
- `tests/fullstack/lessons.test.js`:
  - kata kunci cakupan per lesson (tabel di atas)
  - minimal satu `.cite` per lesson konten (0001–0009)
  - minimal satu diagram atau `<pre><code>` per lesson konten
  - 0003/0004 memuat blok "Pertanyaan interview" dan contoh query jawaban
  - 0004 memuat "Beda di MySQL"
  - 0008/0009 memuat pseudocode dan implementasi JS per soal, dan 0008 memuat palindrome integer
  - 0006 memuat contoh STAR (Situation/Task/Action/Result)
  - 0010 memuat tiga babak simulasi
- Loader: `forTrack("fullstack")` di `tests/helpers.js`. `tests/shared` harus tetap hijau.

## Out of scope

Lab atau proyek yang dijalankan, kuis atau elemen interaktif apa pun, perubahan `star/`, perubahan track lain, rujukan silang ke track lain, merge ke `main`, dan topik di daftar out of scope MISSION.
