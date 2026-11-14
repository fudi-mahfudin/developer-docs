# Node.js + NestJS — Glossary

Kosakata bersama untuk persiapan interview backend Node.js + NestJS (mid-level). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per modul di bawah.

## Runtime

## Async & error

## I/O & skala

## Modul & tooling

## NestJS inti

Slug topik bank soal modul ini: `nest-kenapa`, `nest-module` (0016) · `nest-di`, `nest-custom-provider` (0017) · `nest-scope`, `nest-dynamic-module` (0018) · `nest-controller`, `nest-lifecycle` (0019).

**Module (`@Module`)**:
Unit penyusun aplikasi Nest dengan empat properti: `imports`, `providers`, `controllers`, `exports`. Provider privat untuk module-nya sampai di-export; module singleton sehingga provider yang di-export dibagi satu instance (lesson 0016).
_Avoid_: package, library (untuk module Nest)

**Feature module**:
Satu module per area bisnis (mis. `UsersModule`) berisi controller dan service-nya; root module hanya meng-import feature module (lesson 0016).

**Global module (`@Global`)**:
Module yang provider-nya bisa di-inject tanpa di-import. Hanya untuk hal yang dipakai di mana-mana (config, database) karena dependency jadi tidak terlihat (lesson 0016).

**Provider**:
Class atau nilai yang dikelola DI container Nest dan bisa di-inject sebagai dependency, biasanya class dengan `@Injectable()` (lesson 0017).
_Avoid_: service (service hanya salah satu jenis provider)

**DI container / IoC container**:
Bagian runtime Nest yang membaca constructor, mencari provider per token, membuatnya, dan menyuntikkannya. IoC (Inversion of Control): framework, bukan kode Anda, yang memegang pembuatan object (lesson 0017).

**Injection token**:
Kunci pencarian provider di container: class, string, `Symbol`, atau enum. Interface tidak bisa jadi token karena hilang saat kompilasi; token non-class di-inject dengan `@Inject(TOKEN)` (lesson 0017).

**Custom provider**:
Pendaftaran provider dengan `provide` + salah satu dari `useClass` (pilih class), `useValue` (nilai jadi, mis. mock), `useFactory` (hasil fungsi, argumen dari `inject`), atau `useExisting` (alias) (lesson 0017).

**`forwardRef`**:
Utilitas untuk memecah circular dependency antar provider atau antar module; dipasang di kedua sisi, dan urutan instansiasinya tidak dapat ditentukan (lesson 0017).

**Scope provider**:
Umur instance provider: `DEFAULT` (singleton, satu untuk seluruh aplikasi), `REQUEST` (baru per request), `TRANSIENT` (baru per pemakai) (lesson 0018).

**Scope bubbling**:
Request scope merambat ke atas: class yang meng-inject provider request-scoped ikut dibuat ulang per request (lesson 0018).

**Dynamic module**:
Module yang dikonfigurasi saat dipakai lewat method static yang mengembalikan `DynamicModule` (object `@Module` + properti `module`). Konvensi: `forRoot` (sekali, dipakai ulang), `forFeature` (menyesuaikan konfigurasi `forRoot` per feature), `register` (khusus pemanggil), plus versi async seperti `forRootAsync` (lesson 0018).

**Controller**:
Class dengan `@Controller('prefix')` yang menerima request HTTP lewat decorator `@Get`, `@Post`, dst., mengambil input dengan `@Param`, `@Query`, `@Body`, lalu memanggil service. Status default 200, POST 201, ubah dengan `@HttpCode` (lesson 0019).

**DTO (Data Transfer Object)**:
Class yang mendeskripsikan bentuk data masuk/keluar, mis. body request. Ditulis sebagai class, bukan interface, supaya metadata-nya ada saat runtime (lesson 0019).

**Lifecycle hooks**:
Method yang dipanggil Nest pada fase aplikasi: `onModuleInit`, `onApplicationBootstrap` (start), `onModuleDestroy`, `beforeApplicationShutdown`, `onApplicationShutdown` (berhenti). Shutdown hook butuh `enableShutdownHooks()` untuk sinyal; NestJS 12 memanggil hook per level hierarki, module terdalam lebih dulu (lesson 0019).

## Pipeline request

## Data & auth

## Testing & produksi
