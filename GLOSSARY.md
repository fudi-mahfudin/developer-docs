# Interview Prep — .NET + Angular untuk Developer Node/React

Kosakata bersama untuk persiapan interview dan mini project Product Catalog. Setiap istilah diberi padanannya di dunia Node/React supaya bisa dijawab dengan bahasa yang benar saat interview.

## Domain Mini Project (Product Catalog)

**Product**:
Barang yang dijual, punya nama unik, harga lebih dari nol, dan stok yang tidak boleh negatif.
_Avoid_: Item, barang, SKU

**Category**:
Kelompok tempat setiap Product berada (satu Product, satu Category).
_Avoid_: Tag, group, kategori produk

**Stock**:
Jumlah unit Product yang tersedia saat ini.
_Avoid_: Quantity, inventory, qty

## Backend (.NET / ASP.NET Core)

**Controller**:
Kelas di lapisan HTTP yang menerima request dan mengembalikan response, tanpa logika bisnis.
Padanan Node: route handler / controller Express atau NestJS.
_Avoid_: Handler, route

**Entity**:
Kelas di `Models/` yang dipetakan ke tabel database oleh EF Core.
Padanan Node: model Prisma/Mongoose/TypeORM.
_Avoid_: Model (ambigu dengan view model), table class

**DTO**:
Bentuk data yang masuk/keluar lewat API, terpisah dari Entity.
Padanan Node: schema Zod / Joi / class-validator untuk body dan response.
_Avoid_: Payload, body object

**Service**:
Kelas yang memegang aturan bisnis dan mengatur alur satu use case.
Padanan Node: folder `services/`.
_Avoid_: Manager, helper, logic

**Repository**:
Abstraksi akses data untuk satu Entity, berada di atas DbContext.
Padanan Node: data-access layer di atas Prisma client.
_Avoid_: DAO, data service

**DbContext**:
Sesi EF Core ke database yang melacak perubahan Entity dan menyimpannya sekaligus.
Padanan Node: instance Prisma client / TypeORM DataSource.
_Avoid_: Connection, database object

**Migration**:
Perubahan skema database yang tercatat dan diturunkan dari Entity (code-first).
Padanan Node: `prisma migrate` / migration Knex.
_Avoid_: Schema update, DB script

**Middleware**:
Komponen di pipeline request yang dijalankan berurutan sebelum dan sesudah endpoint.
Padanan Node: Express middleware `(req, res, next)`.
_Avoid_: Interceptor (itu istilah Angular), filter (konsep ASP.NET yang lain)

**Service Lifetime**:
Masa hidup instance di DI container: Transient, Scoped (per request), atau Singleton.
Padanan Node: tidak ada bawaannya; mirip scope provider di NestJS.
_Avoid_: Instance mode

**Options Pattern**:
Cara membaca konfigurasi `appsettings.json` ke kelas bertipe lewat `IOptions<T>`.
Padanan Node: `process.env` + modul `config/` yang divalidasi.
_Avoid_: Env config, settings object

**Composition root**:
Satu tempat di awal aplikasi (`Program.cs`) yang menghubungkan setiap interface ke implementasinya di DI container.
Padanan Node: `app.js` yang membuat semua instance, atau `providers` di module NestJS.
_Avoid_: Startup wiring, bootstrap, DI config

## Testing

**Red-Green-Refactor**:
Siklus TDD: tulis test yang gagal, buat lulus dengan kode minimal, lalu rapikan dengan test tetap hijau.
_Avoid_: Test-first saja (tidak menyebut tahap refactor)

**Unit Test**:
Test untuk satu kelas (biasanya Service) dengan dependensi I/O di-mock.
Padanan Node: test Jest dengan `jest.fn()` / `jest.mock()`.
_Avoid_: Small test

**Integration Test**:
Test yang menjalankan API sungguhan lewat `WebApplicationFactory` dengan database SQLite in-memory.
Padanan Node: Supertest + database test.
_Avoid_: E2E test (itu dari browser sampai ke DB)

**Mock**:
Pengganti dependensi yang bisa diverifikasi apakah dipanggil (Moq / `jasmine.createSpyObj`).
Padanan Node: `jest.fn()`.
_Avoid_: Fake, stub (berbeda: stub hanya mengembalikan nilai, fake punya implementasi ringan)

## Frontend (Angular 16)

**NgModule**:
Wadah Angular yang mendeklarasikan component dan mengatur import serta provider; default di v16.
Padanan React: tidak ada.
_Avoid_: Module (ambigu dengan ES module)

**Standalone Component**:
Component yang mengimpor dependensinya sendiri tanpa NgModule.
Padanan React: function component biasa.
_Avoid_: Module-less component

**Angular Service**:
Kelas `@Injectable` yang berbagi state/logika dan disuntikkan lewat DI.
Padanan React: Context + custom hook, atau store (Zustand/Redux).
_Avoid_: Provider (itu konfigurasinya, bukan kelasnya)

**Lifecycle Hook**:
Method seperti `ngOnInit`, `ngOnChanges`, dan `ngOnDestroy` yang dipanggil Angular pada fase tertentu dari sebuah component.
Padanan React: `useEffect` (mount, deps, cleanup).
_Avoid_: Effect

**Observable**:
Aliran nilai (RxJS) yang lazy dan bisa dibatalkan; dipakai HttpClient dan form.
Padanan React: Promise + `useState`, tapi bisa berisi banyak nilai.
_Avoid_: Stream, promise

**HTTP Interceptor**:
Kelas yang memproses setiap request/response HttpClient, misalnya untuk menambah JWT atau menangani 401.
Padanan React: interceptor Axios.
_Avoid_: Middleware (itu istilah backend)

**Signal**:
Nilai reaktif (`signal`, `computed`); masih developer preview di Angular 16.
Padanan React: `useState` / `useMemo`.
_Avoid_: State, store

**Data Binding**:
Penghubung template dan class component: interpolation `{{ }}`, property binding `[ ]`, event binding `( )`, dan two-way binding `[( )]`.
Padanan React: `{x}`, `prop={x}`, `onClick={f}`, serta pasangan `value` + `onChange`.
_Avoid_: Data flow, wiring

**Structural Directive**:
Directive yang menambah atau menghapus elemen DOM, ditulis dengan awalan `*` (`*ngIf`, `*ngFor`) di Angular 16.
Padanan React: `{cond && ...}` dan `array.map(...)` di JSX.
_Avoid_: Control flow (itu sintaks `@if`/`@for` Angular 17)

## Fondasi C#

**Value Type**:
Tipe yang variabelnya menyimpan datanya langsung, sehingga assignment menyalin data (`struct`, `enum`, `int`, `decimal`).
Padanan TS: `number` / `boolean`.
_Avoid_: Primitive (di C# `string` justru reference type)

**Reference Type**:
Tipe yang variabelnya menyimpan referensi ke objek di heap, sehingga assignment berbagi objek yang sama (`class`, array, `string`).
Padanan TS: object dan array.
_Avoid_: Pointer type

**Record**:
Modifier di atas `class` atau `struct` yang membuat compiler menyediakan value equality, `ToString`, dan `with`; bentuk default untuk DTO, bukan untuk Entity.
Padanan TS: `Readonly<type>` + spread, tapi dibandingkan berdasarkan isi.
_Avoid_: Data class, POCO (POCO bisa berarti class apa saja)

**Nullable Reference Types**:
Fitur compile-time C# di mana reference type non-nullable secara default dan `string?` menandai yang boleh null.
Padanan TS: `strictNullChecks` + `string | null`.
_Avoid_: Nullable type (itu `int?`, value type yang boleh null)

**Abstract Class**:
Base class yang tidak bisa di-instantiate dan boleh berisi field, constructor, serta method jadi di samping member abstract.
Padanan TS: `abstract class` (sama).
_Avoid_: Base interface

**Task**:
Objek yang mewakili operasi asinkron yang sedang berjalan (`Task`, atau `Task<T>` bila menghasilkan nilai); ditunggu dengan `await`, bukan `.Result`.
Padanan TS: `Promise<T>`.
_Avoid_: Thread, job, future

**Deferred Execution**:
Sifat LINQ di mana membuat query tidak menjalankannya; query baru dieksekusi saat hasilnya dikonsumsi (`foreach`, `ToList`, `Count`, `First`, atau versi async-nya).
Padanan Node: query builder Knex/Prisma yang baru mengirim SQL saat di-`await`.
_Avoid_: Lazy loading (itu fitur EF Core lain untuk navigation property)

**IQueryable**:
Query LINQ yang disimpan sebagai expression tree sehingga provider (EF Core) bisa menerjemahkannya ke SQL; berbeda dengan `IEnumerable` yang dijalankan di memori.
Padanan Node: `prisma.product.findMany({ where })` vs `array.filter(...)`.
_Avoid_: Query object, IEnumerable (berbeda: filternya jalan di memori)

## Dependency Injection

**Captive Dependency**:
Kesalahan konfigurasi lifetime di mana service berumur panjang (mis. Singleton) memegang dependensi berumur lebih pendek (mis. DbContext yang Scoped), sehingga dependensi itu ikut hidup selamanya.
Padanan Node: tidak ada bawaannya; di NestJS request scope justru merambat ke konsumennya secara otomatis.
_Avoid_: Scope leak, lifetime mismatch

**Scope Validation**:
Pemeriksaan DI container (default aktif di Development, diatur lewat `ValidateScopes`) yang melempar exception bila service Scoped di-inject ke Singleton atau di-resolve dari root provider.
Padanan Node: tidak ada.
_Avoid_: DI check, lifetime validation

## EF Core

**Change Tracker**:
Bagian DbContext yang mencatat state setiap Entity (`Added`, `Unchanged`, `Modified`, `Deleted`, `Detached`) dan snapshot nilai aslinya, sehingga `SaveChanges` tahu SQL apa yang harus dikirim.
Padanan Node: tidak ada di Prisma (update selalu eksplisit); mirip unit of work di TypeORM/MikroORM.
_Avoid_: Dirty checking, state manager

**N+1 Problem**:
Satu query untuk daftar induk, lalu satu query tambahan per baris untuk relasinya; biasanya dari lazy loading atau query di dalam loop. Diatasi dengan eager loading (`Include`) atau projection `Select`.
Padanan Node: `await` query Prisma di dalam loop, diatasi dengan `include`.
_Avoid_: Select N+1, query loop

**Eager Loading**:
Memuat relasi sebagai bagian dari query awal lewat `Include`.
Padanan Node: `include` di Prisma, `relations` di TypeORM.
_Avoid_: Join loading, preload

**No-Tracking Query**:
Query dengan `AsNoTracking()` yang hasilnya tidak masuk change tracker; untuk skenario read-only, lebih cepat, dan perubahannya tidak disimpan oleh `SaveChanges`.
Padanan Node: hasil query Prisma biasa (objek polos).
_Avoid_: Read-only query (bukan istilah EF Core), detached query
## RxJS (Angular 16)

**Subject**:
Observable yang sekaligus Observer: bisa di-`subscribe` dan diberi nilai lewat `next()`, lalu meneruskannya ke banyak subscriber.
Padanan Node: `EventEmitter`.
_Avoid_: Event bus, channel

**BehaviorSubject**:
Subject yang wajib punya nilai awal, menyimpan nilai terakhir, dan langsung mengirimkannya ke subscriber baru; bentuk default state bersama di Angular Service.
Padanan React: state di Context Provider / store Zustand.
_Avoid_: Store (kecuali memang NgRx), state subject

**Operator**:
Fungsi RxJS yang dirangkai di dalam `pipe()` untuk mengubah aliran Observable (`map`, `switchMap`, `catchError`, `debounceTime`).
Padanan Node: method array (`map`, `filter`) atau `.then()` berantai, tapi untuk banyak nilai.
_Avoid_: Pipe (itu istilah template Angular, mis. `async` pipe)

**Async Pipe**:
Pipe template `| async` yang subscribe ke Observable, menampilkan nilai terakhirnya, dan unsubscribe otomatis saat component dihancurkan.
Padanan React: `useEffect` + `useState` + cleanup yang ditulis otomatis.
_Avoid_: Auto-subscribe

**Arrange-Act-Assert**:
Pola menyusun satu test: siapkan objek dan mock (Arrange), panggil satu method yang diuji (Act), periksa hasilnya (Assert).
Padanan Node: susunan yang sama di dalam `it()` Jest; Red-Green-Refactor di Node = `jest --watch` merah, hijau, rapikan.
_Avoid_: Given-When-Then (setara, tapi istilah BDD)

**Test List**:
Daftar skenario perilaku yang ingin dicakup, diambil satu per satu dalam siklus Red-Green-Refactor.
Padanan Node: daftar `test.todo()` di Jest.
_Avoid_: Test plan, test suite
## Forms (Angular 16)

**Reactive Forms**:
Pendekatan form Angular (`ReactiveFormsModule`) di mana form model (`FormGroup`/`FormControl`) dibuat eksplisit di class component, alur datanya sinkron, dan validatornya berupa fungsi.
Padanan React: controlled input dengan state, atau React Hook Form.
_Avoid_: Model-driven form, dynamic form (itu pola lain di atas Reactive Forms)

**Template-driven Forms**:
Pendekatan form Angular (`FormsModule`) di mana form model dibuat implisit oleh directive `ngModel` di template, dengan two-way binding dan alur data asinkron.
Padanan React: tidak ada padanan langsung; paling dekat input dengan `value` + `onChange` di JSX.
_Avoid_: HTML form, simple form
