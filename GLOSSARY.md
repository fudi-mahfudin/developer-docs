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
