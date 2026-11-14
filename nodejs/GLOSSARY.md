# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

## I/O & skala

## Modul & tooling

## NestJS inti

## Pipeline request

## Data & auth

Slug topik bank soal modul ini: `data-prisma-service`, `data-query-n1` (0025) · `data-transaksi`, `data-migrasi`, `data-typeorm` (0026) · `data-hash-password`, `data-jwt-passport` (0027) · `data-rbac`, `data-401-403` (0028).

**PrismaService**:
Provider `@Injectable()` yang `extends PrismaClient`, connect di `onModuleInit` dan disconnect di `onModuleDestroy`; di-inject ke service seperti provider lain (lesson 0025).
_Avoid_: `new PrismaClient()` di setiap service

**N+1**:
Loop atas hasil query yang menjalankan satu query tambahan per hasil. Perbaikan di Prisma: `include`, filter `in`, atau `relationLoadStrategy: "join"` (lesson 0025).
_Avoid_: "ORM lambat" tanpa melihat jumlah query

**Interactive transaction**:
`$transaction(async (tx) => ...)` (Prisma ORM 7): baca, cek, lalu tulis dalam satu transaksi; error di dalam fungsi membuat rollback. Bentuk array tidak bisa meneruskan hasil antar-query (lesson 0026).
_Avoid_: memanggil `this.prisma` di dalam callback transaksi

**migrate dev / migrate deploy**:
`prisma migrate dev` membuat dan menerapkan migrasi di development (shadow database, bisa menawarkan reset); `prisma migrate deploy` hanya menerapkan migrasi pending di CI/CD dan produksi (lesson 0026).
_Avoid_: `migrate dev` atau `synchronize: true` (TypeORM) ke database produksi

**Hashing password**:
Fungsi satu arah yang sengaja lambat (Argon2id pilihan pertama OWASP, bcrypt untuk sistem lama) dengan salt otomatis (lesson 0027).
_Avoid_: "enkripsi password", SHA-256 untuk password

**Access token / refresh token**:
Access token (biasanya JWT) dikirim tiap request dan berumur pendek; refresh token berumur panjang, disimpan server-side agar bisa dicabut, dipakai untuk mendapatkan access token baru (lesson 0027).
_Avoid_: menaruh data rahasia di payload JWT

**RBAC**:
Role-based access control: izin ditempel ke role. Di Nest: decorator `@Roles` + `RolesGuard` yang membaca metadata lewat `Reflector` (lesson 0028).
_Avoid_: mengecek role di setiap handler secara manual

**401 vs 403**:
401: kredensial autentikasi valid tidak ada (siapa Anda?). 403: klien dikenal tapi tidak berhak. 404 boleh dipakai untuk menyembunyikan resource terlarang (RFC 9110, lesson 0028).
_Avoid_: 401 untuk "role tidak cukup"

## Testing & produksi
