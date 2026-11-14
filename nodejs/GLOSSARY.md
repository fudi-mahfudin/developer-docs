# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

## I/O & skala

## Modul & tooling

## NestJS inti

## Pipeline request

Slug topik bank soal modul ini: `pipeline-urutan`, `pipeline-binding` (0021), `pipeline-pipe`, `pipeline-validation` (0022), `pipeline-middleware`, `pipeline-guard` (0023), `pipeline-interceptor`, `pipeline-filter` (0024).

**Pipeline request**:
Urutan komponen yang dilewati satu request di NestJS: middleware → guard → interceptor (sebelum) → pipe → handler → interceptor (sesudah); exception filter menangani exception yang lolos (lesson 0021).
_Avoid_: middleware chain (untuk seluruh pipeline)

**Binding level**:
Tempat komponen dipasang: global, controller, method (pipe juga per parameter). Global lewat `useGlobal*()` tanpa DI, atau lewat token `APP_GUARD`/`APP_PIPE`/`APP_INTERCEPTOR`/`APP_FILTER` dengan DI (lesson 0021).

**Pipe**:
Class `PipeTransform` yang mengubah atau memvalidasi argumen handler sebelum handler dipanggil, mis. `ParseIntPipe`. Exception dari pipe membuat handler tidak dijalankan (lesson 0022).

**DTO**:
Data transfer object: class yang menggambarkan bentuk body request, diberi decorator class-validator dan divalidasi `ValidationPipe`. Harus class, bukan interface (lesson 0022).
_Avoid_: model, entity (untuk bentuk body)

**ValidationPipe**:
Pipe bawaan yang memvalidasi DTO dengan class-validator. Opsi utama: `whitelist` (buang properti asing), `forbidNonWhitelisted` (tolak properti asing), `transform` (jadikan instance DTO, konversi primitif) (lesson 0022).

**Guard**:
Class `CanActivate` yang memutuskan apakah request boleh ditangani handler. `false` → `ForbiddenException` (403). Tempat autentikasi dan otorisasi (lesson 0023).

**ExecutionContext**:
Argumen guard dan interceptor, turunan `ArgumentsHost`, yang memberi akses ke request (`switchToHttp()`), handler (`getHandler()`), dan class controller (`getClass()`) (lesson 0023).

**Reflector**:
Provider untuk membaca metadata yang ditempel decorator ke handler atau class; `Reflector.createDecorator()` membuat decorator bertipe, mis. `@Roles` (lesson 0023).

**Middleware (Nest)**:
Fungsi atau class `NestMiddleware` gaya Express `(req, res, next)`, dipasang di `configure(consumer)` atau `app.use()`. Context-blind: tidak tahu handler yang akan dipanggil (lesson 0023).

**Interceptor**:
Class `NestInterceptor` yang membungkus handler lewat `next.handle()` (Observable RxJS): logging durasi, bentuk response (`map`), timeout, cache (lesson 0024).

**Exception filter**:
Class `ExceptionFilter` dengan `@Catch()` yang mengubah exception yang lolos menjadi response. Diselesaikan dari level terendah (method → controller → global) (lesson 0024).

**HttpException**:
Exception bawaan Nest yang membawa status HTTP; turunannya antara lain `NotFoundException`, `ConflictException`, `ForbiddenException`. Exception lain menjadi 500 `Internal server error` (lesson 0024).

## Data & auth

## Testing & produksi
