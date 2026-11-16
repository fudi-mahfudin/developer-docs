# Mission: Lolos interview Fullstack Web Developer untuk aplikasi internal (dengan peran IT pendukung)

## Why
Posisi yang dituju: developer web fullstack yang juga menjadi orang IT di kantor. JD-nya meminta membangun dan merawat aplikasi web dan sistem internal (front-end, back-end, integrasi database, API), troubleshooting/testing/deployment/maintenance, menerjemahkan kebutuhan tim operasional dan administrasi, menyiapkan dokumentasi teknis, prosedur sistem, dan maintenance record, serta memonitor performa dan melakukan preventive maintenance. Ditambah tugas non-dev: perawatan hardware/jaringan/perangkat user dan multimedia dasar. Syarat teknisnya: HTML, CSS, JavaScript, front-end modern, back-end, REST API, server-side logic, database relasional (MySQL/PostgreSQL), dan desain database dasar.

Track ini menjawab pertanyaan khas posisi itu secara ringkas: "jelaskan langkah membuat fitur CRUD dari frontend sampai backend", "bagaimana kamu bekerja sebagai sole developer aplikasi internal", pertanyaan SQL tersering, dan soal coding (mis. palindrome integer tanpa konversi ke string). Contoh berjalan di seluruh track: aplikasi internal **"Inventaris aset kantor"** (aset, kategori, karyawan, peminjaman).

## Success looks like
- Bisa menjelaskan langkah membuat fitur CRUD dari halaman Next.js sampai tabel PostgreSQL dalam ±3 menit, termasuk validasi, error handling, dan keamanan
- Bisa menjawab ±30 pertanyaan SQL tersering dan menulis query JOIN/GROUP BY/window function di kertas
- Bisa menceritakan alur kerja sole developer, dari requirement sampai maintenance record, dengan contoh cerita STAR
- Bisa menyelesaikan soal coding easy–medium dengan pseudocode, termasuk kompleksitas dan edge case (mis. palindrome integer tanpa string)
- Bisa menjawab pertanyaan dasar IT support/jaringan dan multimedia dengan jujur dan konkret

## Constraints
- Self-paced, tanpa deadline; 10 lesson baca-saja ±20–30 menit (lihat penyimpangan di bawah)
- Tanpa kuis, lab, atau proyek yang dijalankan; semua contoh jawaban langsung tampil
- Stack: Next.js App Router yang memanggil API Express terpisah; Express + Zod dengan layering route → service → Prisma; PostgreSQL sebagai dialek utama dengan kotak "Beda di MySQL"
- Versi (diverifikasi 2026-11-16 di dokumentasi dan halaman rilis resmi): Next.js 16 (16.4, React 19.3; nextjs.org/blog/next-16-4), Express 5 (5.3; expressjs.com, npm `express`), Prisma ORM 7 (7.10; Prisma 8 masih release candidate menurut prisma.io/docs/orm/release-status, jadi contoh memakai sintaks Prisma 7), PostgreSQL 18 (18.7; postgresql.org/support/versioning), MySQL 8.4 LTS dan 9.7 LTS (dev.mysql.com/doc/refman/9.7/en/mysql-releases.html), Zod 4, Node.js 24 LTS
- Fitur yang bergantung versi diberi label versi di tempat disebut (mis. "Next.js ≥ 16", "Express 5", "MySQL ≥ 8.0")
- Track mandiri: tidak merujuk track lain; istilah di luar topik dijelaskan 1–2 kalimat di tempat
- Bahasa Indonesia, istilah teknis tetap bahasa Inggris
- Hanya hidup di branch `on-bsm`, tidak di-merge ke `main`

## Penyimpangan dari ADR 0003
1. **Baca-saja:** tanpa bank soal per lesson, tanpa review, tanpa modul tematik. Penguasaan tidak dilacak (tanpa learning record atau `data-topics`). Lesson 0010 diganti simulasi interview berbentuk tanya-jawab yang langsung dibaca.
2. **Durasi lesson boleh sampai ±30 menit** karena materinya padat. Durasi ditulis di kicker setiap lesson dan di ROADMAP.
3. **Tidak membuat ADR baru**, karena track ini hanya ada di branch `on-bsm`.

## Out of scope
- Dasar sintaks JS pemula
- Pages Router secara mendalam (hanya perbandingan singkat)
- GraphQL, microservices, Docker/Kubernetes secara mendalam
- DP dan graph (cukup di RESOURCES sebagai bacaan lanjutan)
- Hands-on hardware/jaringan dan tutorial tools multimedia
- Proyek atau lab yang dijalankan
