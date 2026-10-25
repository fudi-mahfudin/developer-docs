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
Test untuk satu kelas (biasanya Service) dengan dependensi I/O diganti test double.
Padanan Node: test Jest dengan `jest.fn()` / `jest.mock()`.
_Avoid_: Small test

**Integration Test**:
Test yang menjalankan API sungguhan lewat `WebApplicationFactory` dengan database SQLite in-memory.
Padanan Node: Supertest + database test.
_Avoid_: E2E test (itu dari browser sampai ke DB)

**Mock**:
Jenis test double yang diverifikasi apakah dipanggil (`Verify` di Moq / `jasmine.createSpyObj`); bukan sebutan umum untuk semua test double.
Padanan Node: `jest.fn()`.
_Avoid_: Fake, stub (berbeda: stub hanya mengembalikan nilai, fake punya implementasi ringan)

**Arrange-Act-Assert**:
Pola menyusun satu test: siapkan objek dan test double (Arrange), panggil satu method yang diuji (Act), periksa hasilnya (Assert).
Padanan Node: susunan yang sama di dalam `it()` Jest; Red-Green-Refactor di Node = `jest --watch` merah, hijau, rapikan.
_Avoid_: Given-When-Then (setara, tapi istilah BDD)

**Test List**:
Daftar skenario perilaku yang ingin dicakup, diambil satu per satu dalam siklus Red-Green-Refactor.
Padanan Node: daftar `test.todo()` di Jest.
_Avoid_: Test plan, test suite

**Test Double**:
Istilah umum untuk objek pengganti objek produksi saat test; jenisnya dummy, stub, spy, mock, dan fake.
Padanan Node: semua yang dibuat dengan `jest.fn()` / `jest.mock()` atau implementasi palsu buatan sendiri.
_Avoid_: Mock (sebagai istilah umum; mock hanya salah satu jenisnya)

**Stub**:
Test double yang memberi jawaban siap (`Setup(...).Returns(...)` di Moq) dan tidak di-assert.
Padanan Node: `jest.fn().mockReturnValue(...)`.
_Avoid_: Mock (kalau tidak diverifikasi)

**Fake**:
Test double dengan implementasi kerja yang mengambil jalan pintas, mis. SQLite in-memory pengganti SQL Server. Catatan: dokumen .NET kadang memakai "fake" sebagai istilah umum.
Padanan Node: repository berbasis array, SQLite `:memory:`.
_Avoid_: Stub, mock

**Testing Pyramid**:
Pedoman komposisi test: banyak Unit Test, lebih sedikit Integration Test, sedikit sekali E2E Test; makin tinggi levelnya, makin sedikit jumlahnya.
Padanan Node: sama (Jest banyak, Supertest sedikit, Playwright/Cypress paling sedikit).
_Avoid_: Test ratio, coverage target

**E2E Test**:
Test dari UI (browser Angular) sampai database lewat aplikasi yang berjalan utuh; paling lambat dan paling rapuh.
Padanan Node: Playwright / Cypress.
_Avoid_: Integration test (berbeda: tanpa browser)

**WebApplicationFactory**:
Class `WebApplicationFactory<Program>` dari `Microsoft.AspNetCore.Mvc.Testing` yang menjalankan aplikasi ASP.NET Core di TestServer in-memory untuk Integration Test, dengan `CreateClient()` dan titik untuk mengganti service.
Padanan Node: Supertest `request(app)`.
_Avoid_: Test host (itu bagian di dalamnya), test server saja

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

## Pipeline dan konfigurasi

**Short-circuit**:
Middleware yang tidak memanggil `next`, sehingga sisa pipeline (termasuk endpoint) tidak dijalankan; middleware itu disebut terminal middleware.
Padanan Node: mengirim `res.status(401).send()` tanpa memanggil `next()` di Express.
_Avoid_: Early return, abort

**User Secrets**:
Penyimpanan secret untuk development (`dotnet user-secrets`) di profil user, di luar folder project dan tidak ikut source control; tidak terenkripsi dan hanya dibaca di environment Development.
Padanan Node: file `.env` yang masuk `.gitignore`.
_Avoid_: Secret store, vault (itu untuk production, mis. Azure Key Vault)

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

## Forms (Angular 16)

**Reactive Forms**:
Pendekatan form Angular (`ReactiveFormsModule`) di mana form model (`FormGroup`/`FormControl`) dibuat eksplisit di class component, alur datanya sinkron, dan validatornya berupa fungsi.
Padanan React: controlled input dengan state, atau React Hook Form.
_Avoid_: Model-driven form, dynamic form (itu pola lain di atas Reactive Forms)

**Template-driven Forms**:
Pendekatan form Angular (`FormsModule`) di mana form model dibuat implisit oleh directive `ngModel` di template, dengan two-way binding dan alur data asinkron.
Padanan React: tidak ada padanan langsung; paling dekat input dengan `value` + `onChange` di JSX.
_Avoid_: HTML form, simple form

## Auth dan error handling (lesson 0017)

**JWT**:
Token ringkas `header.payload.signature` (tiap bagian base64url) berisi claims seperti `sub`, role, dan `exp`; ditandatangani sehingga tidak bisa diubah, tapi isinya bisa dibaca siapa saja. Dikirim di header `Authorization: Bearer …`.
Padanan Node: token dari `jsonwebtoken.sign()`, divalidasi passport-jwt / express-jwt.
_Avoid_: Session token (session disimpan di server), encrypted token (JWS tidak dienkripsi)

**Authentication**:
Proses menentukan identitas user (di .NET: `UseAuthentication` mengisi `HttpContext.User`); gagal = 401.
Padanan Node: passport mengisi `req.user`.
_Avoid_: Login (itu salah satu langkahnya saja), auth (ambigu)

**Authorization**:
Proses menentukan apakah user yang sudah dikenal boleh mengakses resource (`[Authorize]`, role, policy); gagal = 403.
Padanan Node: middleware pengecek role sesudah passport.
_Avoid_: Auth (ambigu), permission check

**CORS**:
Mekanisme server untuk melonggarkan same-origin policy browser lewat header `Access-Control-*`, termasuk menjawab preflight `OPTIONS`; bukan fitur keamanan.
Padanan Node: package `cors` di Express.
_Avoid_: CORS error sebagai "error API" (yang memblokir adalah browser)

**ProblemDetails**:
Format standar (RFC 9457, dulu 7807) untuk body error HTTP API dengan field `type`, `title`, `status`, `detail`, `instance`; di .NET 8 dihasilkan lewat `AddProblemDetails` dan `IExceptionHandler`.
Padanan Node: format JSON error yang Anda tentukan sendiri di error middleware Express.
_Avoid_: Error object, error DTO

## Arsitektur

**Clean Architecture**:
Arsitektur yang menaruh aturan bisnis (Application Core) di pusat, dengan Infrastructure dan UI di luar yang bergantung ke dalam; nama lainnya Hexagonal, Ports-and-Adapters, Onion.
Padanan Node: hexagonal / ports and adapters di NestJS, dengan Prisma sebagai adapter.
_Avoid_: Onion layer, layered (layered tradisional arahnya UI → BLL → DAL)

**Dependency Rule**:
Aturan Clean Architecture bahwa dependency source code hanya boleh mengarah ke dalam; lingkaran dalam tidak tahu apa pun tentang lingkaran luar. Diwujudkan lewat DIP.
Padanan Node: folder `domain/` yang tidak pernah meng-`import` Prisma atau Express.
_Avoid_: Layer rule, call direction (alur runtime tetap boleh keluar)

**Application Core**:
Project pusat Clean Architecture berisi Entity, interface (mis. `IProductRepository`), domain service, dan DTO; tidak mereferensikan project lain.
Padanan Node: folder `domain/` + `services/` tanpa dependency ke framework.
_Avoid_: Domain layer saja, core library

**Infrastructure**:
Project Clean Architecture berisi detail teknis yang mengimplementasikan interface dari Application Core: `DbContext`, Migration, implementasi Repository, pengirim email.
Padanan Node: adapter Prisma, Nodemailer, klien HTTP.
_Avoid_: DAL, data layer (itu istilah N-Layer)

**Unit of Work**:
Pola yang mengumpulkan semua insert/update/delete satu aksi lalu menyimpannya dalam satu transaksi; di EF Core diwujudkan oleh `DbContext` dan dijalankan saat `SaveChanges`.
Padanan Node: `prisma.$transaction([...])`, atau unit of work di MikroORM.
_Avoid_: Transaction (lebih sempit), batch save

## Database (SQL Server)

<!-- Diisi oleh ticket lesson 0019–0024 (spec .scratch/materi-database). -->

**Outer Join**:
JOIN yang tetap mengembalikan baris tanpa pasangan dari satu sisi, dengan kolom sisi lain diisi NULL: `LEFT JOIN` (semua baris kiri), `RIGHT JOIN` (semua baris kanan), `FULL JOIN` (keduanya). Kebalikannya `INNER JOIN`, yang hanya mengembalikan pasangan cocok (lesson 0019).
Padanan Node: sama persis di SQL `pg`/knex (`.leftJoin`); di Prisma, relasi opsional dari `include`.
_Avoid_: Join luar, optional join

**HAVING**:
Klausa yang menyaring grup setelah `GROUP BY` dan agregasi; `WHERE` menyaring baris sebelum grouping (lesson 0019).
Padanan Node: `having` di `prisma.groupBy`, `.having()`/`.havingRaw()` di knex.
_Avoid_: Filter agregat (bukan istilah T-SQL)

**CTE (Common Table Expression)**:
Result set sementara bernama yang ditulis dengan `WITH nama AS (...)` dan hanya berlaku dalam satu statement. Untuk keterbacaan dan query rekursif, bukan cache: hasilnya tidak di-materialize (lesson 0019).
Padanan Node: sama di SQL `pg`/knex (`.with()`); mirip memberi nama variabel pada langkah perantara.
_Avoid_: Temp table (itu objek lain), WITH table

**Window Function**:
Fungsi yang menghitung nilai per baris di atas sekelompok baris lewat `OVER (PARTITION BY ... ORDER BY ...)` tanpa menggabungkan barisnya, mis. `ROW_NUMBER`, `RANK`, `DENSE_RANK`. Dihitung di tahap SELECT, jadi difilter di query luar (CTE). Dasar soal top-N per grup (lesson 0019).
Padanan Node: tidak ada API Prisma; ditulis sebagai raw SQL (`$queryRaw`, `pg`).
_Avoid_: Analytic function (istilah Oracle), ranking query

**Constraint**:
Aturan yang ditegakkan Database Engine untuk setiap INSERT/UPDATE dari klien mana pun: PRIMARY KEY (identitas baris, default menjadi clustered index), FOREIGN KEY (relasi harus ada, tidak otomatis ber-index), UNIQUE (nilai unik, dijaga index non-clustered), CHECK (domain nilai, mis. Price > 0). Aturan Product dijaga di Service **dan** di constraint (lesson 0019).
Padanan Node: `@id`, `@unique`, `@relation` di schema Prisma menjadi constraint yang sama; Zod/class-validator hanya validasi di aplikasi.
_Avoid_: Validasi database (terlalu kabur), rule

**Normalisasi**:
Menata tabel untuk menghilangkan redundansi dan dependensi yang tidak konsisten, mis. nama Category disimpan sekali di tabel Category dan Product menyimpan `CategoryId`. Bentuk ke-3 (3NF) cukup untuk kebanyakan aplikasi; denormalisasi menukar redundansi dengan JOIN yang lebih sedikit (lesson 0019).
_Avoid_: Normalization form (cukup sebut 1NF/2NF/3NF)

**View**:
Tabel virtual yang isinya didefinisikan oleh query; datanya tetap di tabel asal kecuali indexed view. Dipakai untuk menyederhanakan query dan membatasi akses. ORDER BY di definisinya tidak menjamin urutan (lesson 0019).
Padanan Node: mirip fungsi query yang dipakai ulang, tapi definisinya tinggal di database.
_Avoid_: Virtual table (pakai "view"), materialized view (itu indexed view di SQL Server)

**Stored Procedure (SP)**:
Kumpulan statement T-SQL bernama yang disimpan di database dan dijalankan dengan `EXEC`. Menerima parameter input (boleh ber-default), mengembalikan result set, parameter `OUTPUT`, dan status `RETURN` (int). Boleh mengubah data dan memakai transaction serta `TRY/CATCH`. Diberi awalan `usp_`, bukan `sp_` (lesson 0020).
Padanan Node: fungsi query yang tinggal di database; di Node dipanggil lewat `pg`/`mssql` (`request.execute('usp_X')`), jarang dipakai di proyek Prisma.
_Avoid_: Stored function, SPROC (cukup "SP"), prosedur

**OUTPUT Parameter**:
Parameter SP yang nilainya dikirim balik ke pemanggil. Kata `OUTPUT` wajib ditulis di definisi **dan** di `EXEC`; kalau lupa di `EXEC`, tidak error tapi nilainya tidak kembali. Dari Dapper dibaca lewat `DynamicParameters` dengan `ParameterDirection.Output` (lesson 0020).
_Avoid_: Return value (itu `RETURN`, hanya int status), out parameter (istilah C#)

**THROW**:
Statement T-SQL untuk melempar error (nomor ≥ 50000, severity 16) atau, tanpa parameter di dalam CATCH, melempar ulang error yang ditangkap. Pengganti `RAISERROR` untuk kode baru. Error yang ditangkap CATCH tidak sampai ke aplikasi kecuali di-`THROW;` ulang (lesson 0020).
Padanan Node: `throw new Error(...)` dan `catch (e) { ...; throw e; }`.
_Avoid_: RAISERROR (lama), PRINT (bukan error)

**User-defined Function (UDF)**:
Function buatan sendiri di T-SQL yang dipakai di dalam query: **scalar function** mengembalikan satu nilai (ekspresi di SELECT/WHERE), **table-valued function (TVF)** mengembalikan tabel (di FROM, bisa di-JOIN; versi inline berisi satu SELECT). Tidak boleh mengubah data dan tidak mendukung `TRY/CATCH`. Beda utama dengan SP: function dipakai di query, SP di-`EXEC` (lesson 0020).
_Avoid_: Stored function, method

**Dapper**:
Micro-ORM: extension method di `DbConnection` (`Query<T>`, `Execute`) yang menjalankan SQL tulisan sendiri dan memetakan hasilnya ke objek, tanpa change tracking. Memanggil SP dengan `commandType: CommandType.StoredProcedure` (lesson 0020).
Padanan Node: `pg`/`mssql` atau knex `raw` dengan mapping manual.
_Avoid_: ORM penuh (itu EF Core)

**Raw SQL (EF Core)**:
Menjalankan SQL sendiri lewat EF Core: `FromSql` (query yang mengembalikan entity, hanya di `DbSet`), `ExecuteSql` (perintah tanpa result set, mengembalikan jumlah baris), `SqlQuery<T>` (scalar/DTO). Versi `FormattableString` aman karena nilai interpolasi menjadi `DbParameter`; versi `...Raw` dengan string interpolation rentan SQL injection (lesson 0020).
Padanan Node: Prisma `$queryRaw`/`$executeRaw` (tagged template, aman) vs `$queryRawUnsafe` (rawan).
_Avoid_: Native query, plain SQL

**SQL Injection**:
Serangan dengan menyisipkan kode ke string yang kemudian di-parse dan dijalankan Database Engine, mis. input `x' OR 1 = 1 --`. Dicegah dengan parameter, karena input diperlakukan sebagai nilai literal; SP pun rentan kalau menggabungkan string ke dynamic SQL (pakai `sp_executesql` dengan parameter) (lesson 0020).
Padanan Node: sama; parameterized query `pg` (`$1`) vs template string ke `query()`.
_Avoid_: SQLi (singkatan boleh setelah disebut lengkap)

**Transaction (ACID)**:
Unit kerja yang berhasil atau gagal utuh, dengan empat jaminan: Atomicity (semua atau tidak sama sekali), Consistency (aturan/constraint tetap terpenuhi), Isolation (transaction bersamaan tidak saling mengganggu), Durability (yang di-commit bertahan walau crash). Default T-SQL autocommit: tiap statement satu transaction; beberapa statement dibungkus `BEGIN TRANSACTION` … `COMMIT`/`ROLLBACK`. Di EF Core, satu `SaveChanges` sudah satu transaction; beberapa SaveChanges memakai `Database.BeginTransactionAsync()` (lesson 0021).
Padanan Node: `prisma.$transaction(...)`, atau `BEGIN`/`COMMIT` lewat `pg`.
_Avoid_: Batch (batch adalah kumpulan statement yang dikirim sekaligus, bukan transaction)

**XACT_ABORT**:
Opsi sesi T-SQL; bila `ON`, error run-time apa pun me-rollback seluruh transaction. Default `OFF`: hanya statement yang gagal yang di-rollback, sehingga COMMIT bisa menyimpan setengah transaction. Dipasangkan dengan `TRY/CATCH`, `XACT_STATE()` (1 aktif, -1 uncommittable, 0 tidak ada), dan `THROW;` (lesson 0021).
_Avoid_: Auto rollback (bukan nama fiturnya)

**Isolation Level**:
Tingkat perlindungan transaction dari perubahan transaction lain saat membaca: READ UNCOMMITTED, READ COMMITTED (default SQL Server), REPEATABLE READ, SERIALIZABLE, dan SNAPSHOT. Makin tinggi, makin sedikit anomali (dirty read, non-repeatable read, phantom) tapi makin banyak blocking. Tidak mengubah X lock untuk menulis (lesson 0021).
Padanan Node: opsi `isolationLevel` di `prisma.$transaction`, atau `SET TRANSACTION ISOLATION LEVEL` lewat `pg`.
_Avoid_: Transaction level, lock level

**Dirty Read / Non-repeatable Read / Phantom**:
Tiga anomali konkurensi. Dirty read: membaca data yang belum di-commit (dicegah READ COMMITTED). Non-repeatable read: baris yang sama dibaca dua kali dengan nilai berbeda (dicegah REPEATABLE READ). Phantom: query yang sama mengembalikan himpunan baris berbeda karena INSERT/DELETE (dicegah SERIALIZABLE atau SNAPSHOT). Lost update adalah anomali keempat: update terakhir menimpa update lain yang berbasis nilai lama (lesson 0021).
_Avoid_: Phantom read dan phantom dipakai bergantian, keduanya boleh; jangan sebut dirty read untuk data yang sudah di-commit

**Row Versioning (RCSI, SNAPSHOT)**:
Pembaca membaca versi baris terakhir yang di-commit dari version store (tempdb) tanpa shared lock, sehingga pembaca tidak memblok penulis. RCSI (`READ_COMMITTED_SNAPSHOT ON`) berlaku per statement dan transparan bagi aplikasi; SNAPSHOT (`ALLOW_SNAPSHOT_ISOLATION ON` + `SET TRANSACTION ISOLATION LEVEL SNAPSHOT`) berlaku per transaction dan mendeteksi update conflict (Msg 3960). Keduanya OFF default di SQL Server 2022, RCSI ON di Azure SQL Database (lesson 0021).
Padanan Node: mirip MVCC PostgreSQL, yang di sana selalu aktif.
_Avoid_: NOLOCK (itu READ UNCOMMITTED, membaca data belum di-commit)

**Lock**:
Mekanisme Database Engine untuk menyinkronkan akses ke data yang sama. Mode utama: Shared (S) untuk membaca, Update (U) untuk mencari baris yang akan diubah, Exclusive (X) untuk mengubah dan ditahan sampai transaction selesai, Intent (IS/IX) di level page/tabel. Granularitas KEY/RID, PAGE, OBJECT; escalation ke tabel bila satu statement mengambil ≥ 5.000 lock. Hint `UPDLOCK` mengambil U lock sejak membaca (lesson 0021).
Padanan Node: `SELECT ... FOR UPDATE` di PostgreSQL ≈ `WITH (UPDLOCK)`.
_Avoid_: Mutex/`lock` C# (hanya dalam satu proses aplikasi)

**Blocking**:
Satu sesi menunggu lock yang dipegang sesi lain; selesai sendiri begitu lock dilepas (COMMIT/ROLLBACK). Tanpa `SET LOCK_TIMEOUT`, engine menunggu tanpa batas. Dilihat lewat `sys.dm_exec_requests.blocking_session_id` dan `sys.dm_tran_locks` (lesson 0021).
_Avoid_: Deadlock (blocking bukan siklus), hang

**Deadlock**:
Dua atau lebih transaction saling menunggu lock yang dipegang yang lain (siklus), mis. A pegang Product 1 minta Product 2, B sebaliknya. Deadlock monitor (default tiap 5 detik) memilih victim, me-rollback transaction-nya, dan mengirim error 1205. Dicegah dengan urutan akses sama, transaction pendek, isolation level serendah yang cukup, RCSI, atau `UPDLOCK`; aplikasi tetap harus retry 1205 (lesson 0021).
Padanan Node: konsep sama di PostgreSQL (error `40P01`); di JS mirip dua `await` yang saling menunggu promise satu sama lain.
_Avoid_: Blocking lama, timeout (itu hal lain)

**Clustered Index**:
Index yang menentukan urutan penyimpanan baris data itu sendiri: leaf level-nya adalah data pages tabel, jadi hanya ada satu per tabel. PRIMARY KEY secara default menjadi clustered index; key idealnya sempit, unik, dan selalu naik (`int IDENTITY`). Tabel tanpa clustered index disebut heap (lesson 0022).
Padanan Node: di MySQL InnoDB primary key berperan sama; PostgreSQL tidak punya clustered index yang dijaga terus (`CLUSTER` hanya mengurutkan sekali).
_Avoid_: Primary index, "index utama"

**Non-clustered Index**:
Struktur B+ tree terpisah dari data yang berisi key index plus row locator (clustered key, atau RID untuk heap), dan opsional kolom `INCLUDE`. Boleh banyak per tabel. Kolom yang tidak ada di dalamnya diambil lewat Key Lookup (lesson 0022).
Padanan Node: index biasa dari `@@index([...])` di Prisma atau `CREATE INDEX` di PostgreSQL.
_Avoid_: Secondary index (istilah MySQL), index sekunder

**Composite Index**:
Index dengan lebih dari satu kolom key, diurutkan per kolom pertama lalu kolom berikutnya. Hanya bisa di-seek bila kolom terdepan ikut difilter (leftmost prefix); aturan praktis: kolom equality dulu, lalu range/ORDER BY, kolom yang hanya diambil di `INCLUDE` (lesson 0022).
Padanan Node: `@@index([categoryId, price])` di Prisma; aturan urutan kolomnya sama di PostgreSQL.
_Avoid_: Compound index, multi-column index (boleh dipahami, tapi pakai "composite index")

**Covering Index**:
Non-clustered index yang memuat semua kolom yang dibutuhkan query (kolom predikat di key, kolom yang hanya diambil di `INCLUDE`), sehingga query dijawab dari index saja tanpa Key Lookup (lesson 0022).
Padanan Node: `CREATE INDEX ... INCLUDE (...)` di PostgreSQL 11+ (index-only scan).
_Avoid_: Index lengkap, full index

**Key Lookup**:
Operator execution plan yang mengambil kolom yang tidak ada di non-clustered index dari clustered index, sekali per baris, selalu bersama Nested Loops. Untuk banyak baris optimizer lebih memilih Clustered Index Scan; obatnya covering index (lesson 0022).
Padanan Node: mirip heap fetch setelah index scan di `EXPLAIN` PostgreSQL.
_Avoid_: Bookmark lookup (nama umum, masih dipakai dokumentasi), RID Lookup (itu versi heap)

**Selektivitas**:
Seberapa sedikit baris yang cocok dengan sebuah nilai atau predikat. Kolom dengan sedikit nilai berbeda (mis. 90% Product di satu Category) berselektivitas rendah, dan index padanya sering tidak membantu karena scan tetap lebih murah (lesson 0022).
_Avoid_: Kardinalitas (terkait, tapi itu jumlah nilai atau baris, bukan rasio)

**Logical Reads**:
Jumlah page 8 KiB yang dibaca dari buffer cache untuk satu query, ditampilkan oleh `SET STATISTICS IO ON`. Dipakai untuk membandingkan query sebelum dan sesudah index karena stabil, tidak seperti waktu eksekusi (lesson 0022).
Padanan Node: `shared hit` / `read` pada `EXPLAIN (ANALYZE, BUFFERS)` di PostgreSQL.
_Avoid_: Disk reads (itu physical reads)
