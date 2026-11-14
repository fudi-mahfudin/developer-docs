# Mission: Lolos interview backend developer Node.js + NestJS mid-level

## Why
Interview backend Node mid-level biasanya menanyakan internals runtime (event loop, streams, async) dan cara kerja framework (DI, pipeline request NestJS), lalu meminta live coding kecil. Pengalaman membuat API Express dan memakai TypeScript sudah ada; yang belum ada adalah penjelasan terstruktur tentang **kenapa** Node dan NestJS bekerja seperti itu, ditambah kebiasaan menulis kode tanpa IDE.

## Success looks like
- Bisa menjelaskan fase event loop serta beda `nextTick`, microtask, dan macrotask, lalu menebak urutan output potongan kode async dengan benar
- Bisa menjelaskan kapan event loop terblokir, peran libuv thread pool, dan memilih antara worker threads, cluster, atau child process
- Bisa menjelaskan streams dan backpressure, dan kapan memakainya dibanding membaca seluruh data ke memori
- Bisa menjelaskan DI container NestJS, scope provider, dan dynamic module dalam < 1 menit per topik
- Bisa menyebut urutan pipeline request NestJS dan memilih middleware, guard, interceptor, pipe, atau filter untuk kebutuhan tertentu
- Bisa menulis di kertas, tanpa IDE: DTO + validation, guard berbasis role, service dengan Prisma, dan unit test-nya

## Constraints
- Self-paced, tanpa deadline; lesson ±20 menit per modul tematik (ADR 0003)
- Konsep + latihan menulis kode di kertas, tanpa lab atau proyek yang dijalankan
- Versi: Node.js 24 LTS dan NestJS 12 (major stabil terbaru; diverifikasi 2026-11-14 di docs.nestjs.com/migration-guide, "migrating from NestJS version 11 to version 12", dan npm `@nestjs/core` 12.5.0). Catatan Nest 12: paket inti dikirim sebagai ESM (aplikasi CommonJS memakainya lewat `require(esm)`), Jest butuh Node ≥ 24.9 untuk memuat paket ESM-only, dan urutan lifecycle hook mengikuti level hierarki komponen.
- Fitur yang butuh versi tertentu diberi label versi di tempat disebut (mis. "Node ≥ 22.12")
- Track mandiri: tidak merujuk track lain; konsep di luar Node/NestJS dijelaskan singkat di tempat
- Bahasa Indonesia, istilah teknis tetap bahasa Inggris

## Out of scope
- Dasar JS/TS dan Express pemula (sintaks, `npm install`, hello world, Promise dasar)
- GraphQL, `@nestjs/microservices`, WebSocket gateway, CQRS module (cukup di RESOURCES sebagai bacaan lanjutan)
- Deployment dan infra (Docker, Kubernetes)
- Proyek atau lab yang dijalankan
- Cerita STAR / pertanyaan behavioral
