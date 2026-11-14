# Prior knowledge: sudah pernah membuat API Express dan memakai TypeScript

Spec track (2026-11-14) mengasumsikan pembaca sudah pernah membuat API Express sederhana dan memakai TypeScript; backend Node/NestJS adalah stack yang paling dekat dengan pengalaman sehari-hari. Internals runtime (event loop, libuv, streams) dan cara kerja NestJS (DI, pipeline request) belum dipelajari secara terstruktur dan belum diukur.

**Implications:** jangan mengajarkan sintaks JS/TS, `npm install`, Express hello world, atau Promise dasar. Mulai dari "kenapa Node bekerja seperti ini", dan jelaskan fitur NestJS dari masalah yang diselesaikannya dibanding Express polos.
