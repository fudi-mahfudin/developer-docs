# 14: Penutup: mock interview (0036) dan dua reference

Status: ready-for-agent

**Blocked by:** 12

**What to build:** Lesson 0036 mock interview, ditandai **opsional, ±45 menit, pengecualian durasi** (ADR 0003). Memakai `timer.js` dengan `data-segments="Konsep Node:15,Konsep NestJS:15,Live coding:15"`. Tiga babak:
1. **Konsep Node:** event loop, streams/backpressure, ditambah satu soal tebak urutan output.
2. **Konsep NestJS:** DI dan scope, pipeline request, "kenapa guard dan bukan middleware".
3. **Live coding di kertas:** endpoint CRUD dengan DTO + validation, guard berbasis role, service dengan Prisma, dan satu unit test sederhana.

Setiap babak punya jawaban contoh di `<details>` dan checklist penilaian mandiri. Bank soal tetap ≥ 4 mc + ≥ 1 oral.

Buat dua cheat sheet di `nodejs/reference/` (`urutan-event-loop.html`, `pipeline-request-nestjs.html`) sesuai spec, lalu tautkan dari index dan ROADMAP.

- [ ] 0036 + bank soal
- [ ] Dua reference
- [ ] Tautan di index dan ROADMAP; seluruh `tests/` lulus
