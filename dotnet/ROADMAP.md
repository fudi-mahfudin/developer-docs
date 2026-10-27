# Roadmap 3 Hari — Interview Fullstack Developer .NET + Angular (Mid-Level)

**Profil:** TypeScript / Node.js / React → .NET 8 + Angular 16
**Format interview yang diantisipasi:** tanya-jawab konsep + live coding kecil
**Alokasi:** 6–8 jam/hari, ±60% praktik, ±40% teori & latihan menjawab
**Benang merah:** satu mini project **Product Catalog** (ASP.NET Core Web API + SQL Server + Angular 16) yang dibangun bertahap.
**Istilah:** lihat [GLOSSARY.md](./GLOSSARY.md) untuk pemetaan Node/React → .NET/Angular.

| Hari | Fokus | Hasil akhir |
|---|---|---|
| 0 (1 jam) | Setup environment | `dotnet`, SQL Server (Docker), Node 18, Angular CLI 16 siap |
| 1 | C# + ASP.NET Core + directory structure + EF Core | CRUD Product API berlapis (Controller → Service → Repository → DbContext) |
| 2 | SOLID + TDD (red-green-refactor) + Clean Architecture (lisan) | Unit test service (xUnit + Moq), 1 integration test, refactor SOLID |
| 3 | Angular 16 + JWT/interceptor + error handling + STAR | Frontend Product list/form, auth sederhana, siap mock interview |
| 4 (setengah hari) | SQL Server: SQL dasar, Stored Procedure, transaction, index, optimasi query | Lab `ProductCatalogLab` (±100k Product), bisa menjawab pertanyaan database interview |

---

## Hari 0 — Setup (±1 jam)

> Mac Apple Silicon (arm64). Jalankan sendiri perintah di bawah.

### 1. .NET 8 SDK
- Paling aman: installer resmi **macOS Arm64** dari https://dotnet.microsoft.com/download/dotnet/8.0
- Alternatif Homebrew: `brew install dotnet@8` (keg-only → tambahkan ke PATH sesuai instruksi `brew info dotnet@8`)
- Cek: `dotnet --list-sdks` → harus ada `8.0.x`
- Tool EF Core: `dotnet tool install --global dotnet-ef --version 8.*`

### 2. SQL Server via Docker
1. Docker Desktop → Settings → General → aktifkan **"Use Rosetta for x86_64/amd64 emulation on Apple Silicon"**.
2. Jalankan:
   ```bash
   docker run --platform linux/amd64 \
     -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Dev_Passw0rd!" \
     -p 1433:1433 --name sql2022 -d \
     mcr.microsoft.com/mssql/server:2022-latest
   ```
3. Cek: `docker logs sql2022 | grep "ready for client connections"`
4. Connection string yang dipakai nanti:
   `Server=localhost,1433;Database=ProductCatalog;User Id=sa;Password=Dev_Passw0rd!;TrustServerCertificate=True`

### 3. Node 18 untuk Angular 16
Angular 16 hanya mendukung Node `^16.14 || ^18.10` — Node 24 Anda tetap default sistem.
```bash
brew install fnm            # atau nvm
fnm install 18
# di folder frontend nanti:
echo "18" > .nvmrc && fnm use
npm i -g @angular/cli@16     # atau pakai npx @angular/cli@16 tanpa global install
```

### 4. Editor
- **VS Code + C# Dev Kit** (gratis, familiar) atau **JetBrains Rider** (lebih kuat untuk refactor C#).
- Tambahan VS Code: *Angular Language Service*.

---

## Hari 1 — C#, ASP.NET Core, Directory Structure, EF Core

### Sesi 1 (2 jam) — C# untuk developer TypeScript

| TypeScript | C# | Catatan interview |
|---|---|---|
| `interface User { name: string }` | `public interface IUser { string Name { get; } }` | Interface di C# = kontrak perilaku, nyata saat runtime (bukan cuma type-check) |
| `type`/object literal | `class`, `record`, `struct` | `record` = immutable + value equality → cocok untuk DTO |
| `string \| null` | `string?` (nullable reference types) | Aktif default di template .NET 8 |
| `Promise<T>` / `async` | `Task<T>` / `async` | Jangan `.Result`/`.Wait()` → deadlock; pakai `await` sampai atas |
| `arr.filter().map()` | LINQ: `list.Where().Select()` | LINQ ke `IQueryable` diterjemahkan jadi SQL oleh EF Core |
| `arr.find()` | `FirstOrDefault()` | |
| generics `<T>` | generics `<T>` + constraint `where T : class` | |
| `export`/module | `namespace` + access modifier (`public`, `internal`, `private`) | |
| `throw new Error()` | `throw new InvalidOperationException()` | Exception bertipe; tangkap yang spesifik |
| decorator `@Get()` (NestJS) | attribute `[HttpGet]` | |

Latihan cepat (console app `dotnet new console`): buat `record ProductDto`, list produk, filter dengan LINQ, method `async Task<int>`.

**Topik wajib bisa dijelaskan:**
- Value type vs reference type (`struct` vs `class`), boxing singkat.
- `IEnumerable<T>` vs `IQueryable<T>` (in-memory vs diterjemahkan ke SQL).
- `abstract class` vs `interface`.
- `async/await` & `Task`, kenapa tidak boleh `async void` (kecuali event handler).

### Sesi 2 (2 jam) — Fundamental ASP.NET Core

- **Program.cs** = composition root: register service (DI) lalu susun **middleware pipeline**.
- **Middleware pipeline** ≈ Express middleware; urutan penting: `UseExceptionHandler` → `UseHttpsRedirection` → `UseCors` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.
- **Dependency Injection bawaan** — 3 lifetime (PASTI ditanya):
  - `AddTransient` — instance baru tiap kali di-resolve.
  - `AddScoped` — satu instance per HTTP request (DbContext, service, repository).
  - `AddSingleton` — satu instance seumur aplikasi (cache, config).
  - Jebakan: **captive dependency** — singleton yang meng-inject scoped service.
- **Routing & model binding:** `[Route("api/[controller]")]`, `[FromBody]`, `[FromRoute]`, `[FromQuery]`.
- **`[ApiController]`** → validasi model otomatis (400 + ProblemDetails), binding inference.
- **Return type:** `ActionResult<T>`, `Ok()`, `CreatedAtAction()`, `NotFound()`, `NoContent()`.
- **Configuration:** `appsettings.json` + `appsettings.Development.json` + environment variables + User Secrets; **Options pattern** `IOptions<T>`.

### Sesi 3 (3 jam) — Directory Structure + EF Core: bangun CRUD

```bash
mkdir ProductCatalog && cd ProductCatalog
dotnet new sln -n ProductCatalog
dotnet new webapi -n ProductCatalog.Api --use-controllers
dotnet sln add ProductCatalog.Api
cd ProductCatalog.Api
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.*
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.*
```

**Struktur folder (layered, satu project):**
```
ProductCatalog.Api/
├── Controllers/        # HTTP layer: terima request, panggil service, kembalikan response. TANPA logika bisnis.
│   └── ProductsController.cs
├── Models/             # Entity domain yang dipetakan ke tabel (Product, Category)
│   ├── Product.cs
│   └── Category.cs
├── DTOs/               # Bentuk data masuk/keluar API — jangan expose entity langsung
│   ├── CreateProductRequest.cs
│   └── ProductResponse.cs
├── Services/           # Logika bisnis & aturan (harga > 0, stok tidak negatif, dll.)
│   ├── IProductService.cs
│   └── ProductService.cs
├── Repositories/       # Akses data (abstraksi di atas DbContext)
│   ├── IProductRepository.cs
│   └── ProductRepository.cs
├── Data/               # DbContext, konfigurasi entity, migrations
│   └── AppDbContext.cs
├── Config/             # Kelas Options (JwtSettings), extension method registrasi DI
│   └── ServiceCollectionExtensions.cs
├── Middleware/         # (Hari 3) GlobalExceptionHandler
├── Exceptions/         # Exception domain: NotFoundException, ValidationException
├── appsettings.json
└── Program.cs
```

**Alur request:** `HTTP → Controller → Service → Repository → DbContext → SQL Server`, lalu balik sebagai DTO.

**Padanan Node/Express:** `routes/+controllers/` → `Controllers/`; `services/` → `Services/`; `models/` (Prisma/Mongoose) → `Models/` + `Data/AppDbContext`; `config/` + `.env` → `appsettings.json` + `Config/` + Options pattern.

**Contoh inti:**
```csharp
// Models/Product.cs
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}

// Data/AppDbContext.cs
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
        b.Entity<Product>().Property(p => p.Name).HasMaxLength(200).IsRequired();
    }
}

// DTOs
public record CreateProductRequest(string Name, decimal Price, int Stock, int CategoryId);
public record ProductResponse(int Id, string Name, decimal Price, int Stock, int CategoryId);

// Repositories/IProductRepository.cs
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id);
    Task<IReadOnlyList<Product>> GetAllAsync();
    Task<bool> ExistsByNameAsync(string name);
    Task AddAsync(Product product);
    Task SaveChangesAsync();
}

// Controllers/ProductsController.cs
[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductService service) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetById(int id)
    {
        var product = await service.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(CreateProductRequest request)
    {
        var created = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}

// Config/ServiceCollectionExtensions.cs
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddProductCatalog(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(o => o.UseSqlServer(config.GetConnectionString("Default")));
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductService, ProductService>();
        return services;
    }
}
```

`appsettings.Development.json`:
```json
{ "ConnectionStrings": { "Default": "Server=localhost,1433;Database=ProductCatalog;User Id=sa;Password=Dev_Passw0rd!;TrustServerCertificate=True" } }
```

Migrations:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Tambahkan CORS untuk Angular dev server (`http://localhost:4200`) sekarang agar Hari 3 lancar.

**Checklist akhir Hari 1:**
- [ ] `GET/POST/PUT/DELETE /api/products` jalan via Swagger
- [ ] Data tersimpan di SQL Server (Docker)
- [ ] Bisa menggambar alur Controller → Service → Repository → DbContext tanpa melihat catatan

### Sesi 4 (1 jam) — Latihan menjawab
1. Jelaskan request lifecycle di ASP.NET Core.
2. Bedanya Transient, Scoped, Singleton? Kenapa DbContext Scoped?
3. Kenapa pakai DTO, bukan entity langsung? (over-posting, coupling skema DB ke kontrak API, circular reference)
4. Apa itu migration di EF Core? Code-first vs database-first?
5. Apa itu N+1 problem dan cara mengatasinya? (`Include()`, projection `Select()`)
6. `AsNoTracking()` dipakai kapan?
7. Tracking/change tracker & `SaveChangesAsync` — kapan query benar-benar dieksekusi? (deferred execution)

---

## Hari 2 — SOLID, TDD (Red-Green-Refactor), Clean Architecture

### Sesi 1 (2 jam) — Prinsip SOLID dengan contoh C#

| Prinsip | Inti | Contoh di Product Catalog | Pelanggaran yang sering |
|---|---|---|---|
| **S** — Single Responsibility | Satu class, satu alasan untuk berubah | Controller hanya HTTP; Service aturan bisnis; Repository akses data | Controller yang query DB + validasi + kirim email |
| **O** — Open/Closed | Terbuka untuk ekstensi, tertutup untuk modifikasi | `IDiscountStrategy` (Regular, Member, Seasonal) — tambah strategi baru tanpa ubah `PriceCalculator` | `switch (customerType)` yang terus bertambah |
| **L** — Liskov Substitution | Subtype harus bisa menggantikan base type tanpa merusak perilaku | Semua implementasi `IProductRepository` (SQL Server, in-memory) berperilaku sama terhadap kontrak | Subclass yang melempar `NotImplementedException` |
| **I** — Interface Segregation | Klien tidak dipaksa bergantung pada method yang tidak dipakai | Pisah `IProductReader` dan `IProductWriter` bila ada konsumen read-only | "God interface" dengan 20 method |
| **D** — Dependency Inversion | Modul level tinggi bergantung pada abstraksi, bukan detail | `ProductService` bergantung pada `IProductRepository`, bukan `AppDbContext`; diinjeksi via DI container | `new ProductRepository()` di dalam service |

Contoh OCP:
```csharp
public interface IDiscountStrategy { decimal Apply(decimal price); }
public class NoDiscount : IDiscountStrategy { public decimal Apply(decimal p) => p; }
public class MemberDiscount : IDiscountStrategy { public decimal Apply(decimal p) => p * 0.9m; }

public class PriceCalculator(IDiscountStrategy strategy)
{
    public decimal Final(decimal price) => strategy.Apply(price);
}
```

**Siapkan jawaban:** "SOLID mana yang paling sering Anda terapkan?" → jawab **SRP & DIP**, karena keduanya yang membuat kode bisa di-unit-test (contoh: service dengan repository yang di-mock).

### Sesi 2 (3 jam) — TDD Red-Green-Refactor di `ProductService`

**Siklus:**
1. 🔴 **Red** — tulis satu test kecil untuk perilaku yang belum ada; jalankan → **gagal** (dan gagal karena alasan yang benar).
2. 🟢 **Green** — tulis kode **paling sederhana** agar test lulus. Boleh "jelek".
3. 🔵 **Refactor** — rapikan (hapus duplikasi, perbaiki nama, ekstrak method) dengan semua test tetap hijau.
4. Ulangi — satu perilaku per siklus, langkah kecil.

Setup:
```bash
cd ProductCatalog
dotnet new xunit -n ProductCatalog.Tests
dotnet sln add ProductCatalog.Tests
cd ProductCatalog.Tests
dotnet add reference ../ProductCatalog.Api
dotnet add package Moq
dotnet add package Microsoft.AspNetCore.Mvc.Testing --version 8.*
dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.*
```

**Daftar perilaku yang di-TDD satu per satu:**
1. Create produk valid → dikembalikan dengan data yang benar & repository `AddAsync` dipanggil sekali.
2. Harga ≤ 0 → lempar `ValidationException`.
3. Stok negatif → lempar `ValidationException`.
4. Nama duplikat → lempar `ValidationException`.
5. `GetByIdAsync` id tidak ada → return `null` (atau `NotFoundException` — putuskan & konsisten).
6. `DecreaseStockAsync(id, qty)` melebihi stok → exception; berhasil → stok berkurang.

**Contoh siklus #2 (harga ≤ 0):**
```csharp
// 🔴 RED — test ditulis dulu, ProductService belum memvalidasi harga
public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _repo = new();
    private readonly ProductService _sut;

    public ProductServiceTests() => _sut = new ProductService(_repo.Object);

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    public async Task CreateAsync_PriceNotPositive_ThrowsValidationException(decimal price)
    {
        var request = new CreateProductRequest("Keyboard", price, 5, 1);

        await Assert.ThrowsAsync<ValidationException>(() => _sut.CreateAsync(request));
        _repo.Verify(r => r.AddAsync(It.IsAny<Product>()), Times.Never);
    }
}
```
```csharp
// 🟢 GREEN — kode minimal
public async Task<ProductResponse> CreateAsync(CreateProductRequest request)
{
    if (request.Price <= 0) throw new ValidationException("Price must be greater than 0.");
    // ... kode create dari siklus #1
}
```
```csharp
// 🔵 REFACTOR — setelah siklus #3 & #4 ada beberapa if, ekstrak validasi
private async Task ValidateAsync(CreateProductRequest r)
{
    if (r.Price <= 0) throw new ValidationException("Price must be greater than 0.");
    if (r.Stock < 0) throw new ValidationException("Stock cannot be negative.");
    if (await _repo.ExistsByNameAsync(r.Name)) throw new ValidationException("Product name already exists.");
}
```

**Konvensi:** nama test `Method_Scenario_ExpectedResult`, pola **Arrange–Act–Assert**, `[Fact]` untuk satu kasus, `[Theory]` + `[InlineData]` untuk beberapa input. Jalankan: `dotnet test` (atau `dotnet watch test`).

> Catatan: `ValidationException` di sini adalah exception buatan sendiri di `Exceptions/`, bukan `System.ComponentModel.DataAnnotations.ValidationException`.

### Sesi 3 (1 jam) — Integration test dengan `WebApplicationFactory` + SQLite in-memory

Tambahkan di akhir `Program.cs`: `public partial class Program { }` agar bisa diakses project test.

```csharp
public class ApiFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        _connection.Open();
        builder.ConfigureServices(services =>
        {
            var descriptor = services.Single(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            services.Remove(descriptor);
            services.AddDbContext<AppDbContext>(o => o.UseSqlite(_connection));

            using var scope = services.BuildServiceProvider().CreateScope();
            scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        _connection.Dispose();
    }
}

public class ProductsApiTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    [Fact]
    public async Task Post_InvalidPrice_Returns400()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/products",
            new CreateProductRequest("Mouse", 0, 1, 1));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
```
(Test ini baru hijau setelah global exception handler Hari 3 memetakan `ValidationException` → 400 — bagus sebagai test 🔴 yang "menunggu".)

**Kenapa SQLite in-memory, bukan SQL Server asli?** Cepat & tanpa container. Trade-off: perbedaan dialek SQL. Di production, praktik lebih tepat adalah **Testcontainers** dengan SQL Server asli — sebutkan ini saat interview.

### Sesi 4 (1 jam) — Clean Architecture (cukup lisan + gambar)

```
        ┌──────────────────────────┐
        │      API (Controllers)   │  ──┐
        ├──────────────────────────┤    │ bergantung ke dalam
        │ Infrastructure (EF Core, │  ──┤
        │  email, file, external)  │    │
        ├──────────────────────────┤    │
        │ Application (use case,   │  ◄─┘
        │  interface repo, DTO)    │
        ├──────────────────────────┤
        │ Domain (entity, aturan)  │  ← tidak bergantung pada apa pun
        └──────────────────────────┘
```
- Aturan dependensi: **selalu mengarah ke dalam**. Domain tidak tahu EF Core.
- Interface repository di Application, implementasinya di Infrastructure → ini **DIP** dalam skala arsitektur.
- **Trade-off:** lebih banyak project & boilerplate; cocok untuk domain kompleks/umur panjang. Untuk CRUD kecil, layered satu project sudah cukup (itulah pilihan di mini project ini).
- Kenal nama: **CQRS** + MediatR (pisah command/query) — cukup tahu konsepnya.

### Latihan menjawab Hari 2
1. Jelaskan red-green-refactor. Kenapa harus melihat test gagal dulu?
2. Unit test vs integration test vs end-to-end test? (testing pyramid)
3. Mock vs stub vs fake?
4. Apa yang Anda mock dan apa yang tidak? (mock batas I/O — repository/HTTP; jangan mock entity/value object)
5. **Repository di atas EF Core — perlu atau tidak?**
   - *Pro:* mudah di-mock untuk unit test service, menyembunyikan detail query, contoh nyata DIP.
   - *Kontra:* `DbContext` sudah merupakan Unit of Work + `DbSet` sudah repository; repository generik sering jadi abstraksi bocor (`IQueryable` keluar) dan menambah boilerplate.
   - *Kapan tidak perlu:* aplikasi CRUD kecil, atau tim memilih integration test dengan DB nyata/SQLite daripada mocking.
6. Berikan contoh pelanggaran SOLID yang pernah Anda perbaiki (siapkan cerita dari project Node/React).

---

## Hari 3 — Angular 16, JWT + Interceptor, Error Handling, STAR

### Sesi 1 (4 jam) — Angular 16 untuk developer React

Setup (di folder `ProductCatalog/`):
```bash
fnm use 18
npx @angular/cli@16 new product-catalog-web --routing --style=scss
cd product-catalog-web && echo "18" > .nvmrc
ng serve   # http://localhost:4200
```

**Konsep & padanan React:**

| Angular 16 | React | Catatan |
|---|---|---|
| `@NgModule` (declarations, imports, providers) | — | Default di v16. Standalone components (`standalone: true`) sudah stabil — tahu cara kerjanya |
| Component (`.ts` + `.html` + `.scss`) | Function component | Class + decorator `@Component` |
| `{{ value }}`, `[prop]`, `(event)`, `[(ngModel)]` | `{value}`, props, `onClick`, controlled input | Two-way binding = property + event |
| `*ngIf`, `*ngFor` (+ `trackBy`) | `&&` / ternary, `.map()` + `key` | `@if`/`@for` baru ada di v17 |
| `@Input()` / `@Output()` + `EventEmitter` | props / callback props | |
| Service + `@Injectable({ providedIn: 'root' })` | Context / custom hook / store | DI hierarkis Angular |
| `ngOnInit`, `ngOnChanges`, `ngOnDestroy` | `useEffect` (mount/deps/cleanup) | Ambil data di `ngOnInit`, bukan constructor |
| RxJS `Observable` + `async` pipe | Promise + `useState` | `async` pipe auto-unsubscribe |
| Router (`RouterModule.forRoot`, guards, lazy `loadChildren`) | React Router | Guard fungsional `CanActivateFn` tersedia |
| Reactive Forms (`FormGroup`, `Validators`) | React Hook Form / Formik | Lebih disukai di enterprise dibanding template-driven |
| Change detection (Zone.js, `OnPush`) | Re-render oleh state | `OnPush` = optimasi |
| Signals (`signal`, `computed`, `effect`) — **developer preview di v16** | `useState` / `useMemo` | Cukup kenal; RxJS tetap utama |

**RxJS wajib:** `Observable` vs `Promise`, `Subject`/`BehaviorSubject`, operator `map`, `filter`, `switchMap` (search/cancel request sebelumnya), `catchError`, `tap`, `debounceTime`, `takeUntil`/`async` pipe untuk unsubscribe (memory leak).

**Bangun:**
```
src/app/
├── core/               # singleton: interceptor, guard, auth service
├── shared/             # komponen/pipe reusable
├── products/
│   ├── product-list/   # tabel produk, async pipe
│   ├── product-form/   # Reactive Form create/edit + validasi
│   ├── product.service.ts
│   └── product.model.ts
└── app-routing.module.ts
```
```ts
// products/product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
  create(req: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, req);
  }
}
```
```html
<!-- product-list.component.html -->
<ul *ngIf="products$ | async as products; else loading">
  <li *ngFor="let p of products; trackBy: trackById">{{ p.name }} — {{ p.price | currency:'IDR' }}</li>
</ul>
<ng-template #loading>Loading...</ng-template>
```

**Testing Angular (Jasmine + Karma, dasar):**
```ts
describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll calls GET /products', () => {
    service.getAll().subscribe(res => expect(res.length).toBe(1));
    const req = http.expectOne(r => r.url.endsWith('/products'));
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Mouse', price: 100, stock: 1, categoryId: 1 }]);
  });
});
```
Plus satu component test: render `ProductListComponent` dengan `ProductService` yang di-mock (`jasmine.createSpyObj`), cek item tampil. Jalankan `ng test`.

### Sesi 2 (2 jam) — JWT, HTTP Interceptor, Global Error Handling

**Backend — global exception handler (.NET 8):**
```csharp
// Middleware/GlobalExceptionHandler.cs
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
    {
        var (status, title) = ex switch
        {
            ValidationException => (StatusCodes.Status400BadRequest, "Validation failed"),
            NotFoundException   => (StatusCodes.Status404NotFound, "Not found"),
            _                   => (StatusCodes.Status500InternalServerError, "Server error")
        };
        if (status == 500) logger.LogError(ex, "Unhandled exception");

        ctx.Response.StatusCode = status;
        await ctx.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = status, Title = title, Detail = status == 500 ? null : ex.Message
        }, ct);
        return true;
    }
}
// Program.cs
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
app.UseExceptionHandler();
```
→ Jalankan lagi integration test Hari 2: sekarang harus 🟢.

**Backend — JWT:**
- `dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.*`
- `Config/JwtSettings.cs` (Issuer, Audience, Key) di-bind via Options pattern; key disimpan di User Secrets, bukan di repo.
- `AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)`, `[Authorize]` di endpoint POST/PUT/DELETE, endpoint `POST /api/auth/login` sederhana (user hardcoded cukup) yang mengembalikan token.
- Pahami: struktur JWT (header.payload.signature), claims, expiry, refresh token (konsep), **authentication vs authorization**, role/policy-based authorization.

**Frontend — interceptor (class-based, cocok untuk NgModule):**
```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token;
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }
}
// app.module.ts → providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
```
Plus `CanActivateFn` guard untuk route form produk.

### Sesi 3 (2 jam) — Behavioral (STAR) + Mock Interview

**STAR:** **S**ituation → **T**ask → **A**ction (fokus pada "saya", bukan "kami") → **R**esult (angka bila bisa).

Siapkan 4 cerita dari pengalaman Node/React:
1. Bug/insiden produksi tersulit yang Anda selesaikan.
2. Refactor yang meningkatkan kualitas/maintainability (kaitkan ke SOLID/testing).
3. Konflik/beda pendapat teknis dengan rekan dan cara menyelesaikannya.
4. Mempelajari teknologi baru dengan cepat (→ **jembatan**: "persis seperti saya mempelajari .NET & Angular untuk posisi ini — ini mini project-nya").

**Siapkan juga:** "Kenapa pindah dari Node/React ke .NET/Angular?" → tekankan transfer skill (TypeScript → Angular natural; konsep layered/DI/testing sama), ditambah bukti mini project.

**Mock interview (60 menit, minta teman atau AI):**
- 20 menit: konsep acak dari daftar pertanyaan Hari 1–3.
- 25 menit: live coding — tambah endpoint `GET /api/products?categoryId=&minPrice=` dengan TDD **dan** filter di Angular list.
- 15 menit: 2 cerita STAR.

### Latihan menjawab Hari 3
1. Bedanya Observable dan Promise? Kapan pakai `switchMap` vs `mergeMap`?
2. Bagaimana mencegah memory leak subscription di Angular?
3. Apa itu change detection & `OnPush`?
4. NgModule vs standalone component?
5. Reactive Forms vs Template-driven Forms?
6. Bagaimana Angular DI berbeda dari React Context?
7. Di mana menyimpan JWT di frontend? (localStorage — rentan XSS; httpOnly cookie — perlu proteksi CSRF; jelaskan trade-off)
8. Apa itu CORS dan kenapa perlu dikonfigurasi di API?
9. Middleware vs filter di ASP.NET Core?

---

## Hari 4 (setengah hari): Database

> Lesson 0019–0024, ±30 menit per lesson (±15 menit konsep + kuis, ±15 menit hands-on). Total ±3 jam, sisanya untuk mengulang latihan tulis query.

### Setup lab `ProductCatalogLab` (sekali sebelum 0019, ulangi kapan saja untuk reset)
Container `sql2022` dari Hari 0 harus jalan (`docker start sql2022`). Database lab terpisah dari `ProductCatalog` milik EF Core. Skrip `dotnet/lab/00-setup-product-catalog-lab.sql` membuat database bila belum ada, membuat ulang tabel Category dan Product, lalu men-seed 6 Category dan 100.000 Product. Pilih salah satu cara:

- **sqlcmd** (dari root repo):
  ```bash
  sqlcmd -S localhost,1433 -U sa -P 'Dev_Passw0rd!' -C -i dotnet/lab/00-setup-product-catalog-lab.sql
  ```
  Tanpa `sqlcmd` di Mac, pakai yang ada di dalam container:
  ```bash
  docker cp dotnet/lab/00-setup-product-catalog-lab.sql sql2022:/tmp/setup.sql
  docker exec sql2022 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'Dev_Passw0rd!' -C -i /tmp/setup.sql
  ```
- **Azure Data Studio**: koneksi baru `localhost,1433`, user `sa`, password `Dev_Passw0rd!`, centang *Trust server certificate*; buka file `.sql`, lalu **Run**.
- **VS Code + ekstensi mssql**: tambah koneksi dengan data yang sama, buka file `.sql`, lalu **Execute Query** (Cmd+Shift+E).

Hasil akhir yang benar: `CategoryCount = 6`, `ProductCount = 100000`, dan Category "Elektronik" berisi 90.000 Product (sengaja tidak merata, untuk demo parameter sniffing di 0023).

### Urutan lesson
| # | Lesson |
|---|---|
| 0019 | SQL dasar: JOIN, GROUP BY/HAVING, subquery vs CTE, `ROW_NUMBER`, normalisasi, constraint, view |
| 0020 | Stored Procedure: parameter, `OUTPUT`, `TRY/CATCH`, SP vs function, memanggil SP dari EF Core dan Dapper |
| 0021 | Transaction, isolation level, locking, deadlock |
| 0022 | Index: clustered vs non-clustered, composite, covering (`INCLUDE`), kapan index merugikan |
| 0023 | Optimasi query: execution plan, SARGable, parameter sniffing, pagination, SQL dari EF Core |
| 0024 | Review campuran database (seam) |

Setiap lesson menampilkan skripnya (file di `lab/`) dengan tombol copy, plus 1–2 latihan tulis query dengan jawaban tersembunyi.

---

## Checklist Final (malam Hari 3)

- [ ] Mini project jalan end-to-end: Angular → API (JWT) → SQL Server
- [ ] `dotnet test` hijau (unit + integration), `ng test` hijau
- [ ] Bisa menjelaskan folder Controllers/Models/DTOs/Services/Repositories/Data/Config dan alasannya
- [ ] Bisa demo 1 siklus red-green-refactor secara live dalam < 10 menit
- [ ] Bisa memberi contoh 5 prinsip SOLID dari kode sendiri
- [ ] Bisa menggambar Clean Architecture dan menjelaskan trade-off-nya vs layered
- [ ] 4 cerita STAR siap
- [ ] Push mini project ke GitHub dengan README singkat → bisa ditunjukkan saat interview
