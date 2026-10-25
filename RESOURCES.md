# .NET 8 + Angular 16 Interview Resources

## Knowledge

- [Microsoft Learn: Common web application architectures (eBook *Architect Modern Web Applications with ASP.NET Core and Azure*)](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
  Sumber resmi tentang single-project, N-layer (UI/BLL/DAL), dan Clean Architecture. Use for: directory structure, arah dependensi, composition root.
- [Microsoft Learn: Architectural principles (eBook yang sama)](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles)
  Separation of concerns, dependency inversion, SRP, explicit dependencies. Use for: SOLID dalam konteks ASP.NET Core.
- [Microsoft Learn: Dependency injection in ASP.NET Core (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-8.0)
  Registrasi service, lifetime, DbContext scoped, service locator anti-pattern. Use for: DI & lifetime.
- [Microsoft Learn: Service lifetimes](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes)
  Definisi Transient/Scoped/Singleton dan aturan scope validation. Use for: pertanyaan lifetime & captive dependency.
- [Microsoft Learn: ASP.NET Core middleware (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-8.0)
  Pipeline request/response, urutan middleware. Use for: request lifecycle.
- [Microsoft Learn: Unit testing best practices for .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)
  Penamaan test, Arrange-Act-Assert, stub vs mock. Use for: testing & TDD.
- [Microsoft Learn: Integration tests in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-8.0)
  `WebApplicationFactory`, mengganti service saat test. Use for: integration test.
- [Angular v16 documentation (arsip resmi)](https://v16.angular.io/docs)
  Dokumentasi persis untuk versi 16. Use for: NgModule, DI, lifecycle hooks, forms, HttpClient, testing.
- [Sumber markdown dokumentasi Angular v16 (repo angular/angular, branch 16.2.x, `aio/content/guide/`)](https://github.com/angular/angular/tree/16.2.x/aio/content/guide)
  Isi yang sama dengan v16.angular.io, tapi bisa dibaca agent (situsnya SPA dan kosong saat di-fetch). Use for: mengutip dokumentasi v16 secara verbatim.
- [Ninja Squad: What's new in Angular CLI 16.0?](https://blog.ninja-squad.com/2023/05/03/angular-cli-16.0)
  Ringkasan rilis CLI 16 dari tim yang menulis buku Angular. Use for: flag `ng new --standalone` dan perubahan tooling v16.
- [RxJS documentation](https://rxjs.dev/guide/overview)
  Observable, operator. Use for: pertanyaan RxJS.
- [Robert C. Martin: The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
  Artikel asli dependency rule. Use for: menjelaskan Clean Architecture secara lisan.
- [Microsoft Learn: The C# type system](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/)
  Value vs reference type dan panduan "Choose which kind of type" (class/struct/record/interface). Use for: fondasi C# (lesson 0002).
- [Microsoft Learn: C# record types](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/records) dan [Records (C# reference)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record)
  Kapan memakai record, value equality, `with`, immutability, dan kenapa record tidak cocok sebagai entity EF Core. Use for: DTO sebagai record.
- [Microsoft Learn: Nullable reference types](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/null-safety/nullable-reference-types)
  `string?`, null-state analysis, `<Nullable>enable</Nullable>`, operator `!`; sepenuhnya compile-time. Use for: membaca template .NET 8.
- [Microsoft Learn: Interfaces](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces) dan [abstract keyword](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/abstract)
  Bagian "Interfaces vs. abstract classes". Use for: pertanyaan OOP interface vs abstract class.
- [Microsoft Learn: Handle requests with controllers in ASP.NET Core MVC (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/actions?view=aspnetcore-8.0)
  Tanggung jawab Controller dan action, helper `Ok`/`NotFound`. Use for: kenapa Controller tipis dan tidak berisi data access/aturan bisnis.
- [Microsoft Learn: Tutorial: Create a controller-based web API, bagian "Prevent over-posting" (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0#prevent-over-posting)
  Definisi DTO dan alasannya (over-posting, sembunyikan property, payload, flatten). Use for: pertanyaan "kenapa DTO?".
- [Microsoft Learn: Options pattern in ASP.NET Core (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-8.0)
  `IOptions<T>`, `Configure<T>(GetSection(...))`, encapsulation & separation of concerns. Use for: Options Pattern dan konfigurasi.
- [Microsoft Learn: Asynchronous programming with async and await](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/) dan [Async return types](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/async-return-types)
  `Task`/`Task<T>`, `await` yang tidak memblokir, exception di task, `.Result` sebagai blocking property, `async void` hanya untuk event handler. Use for: Task vs Promise (lesson 0003).
- [Microsoft Learn: Task-based Asynchronous Pattern (TAP)](https://learn.microsoft.com/en-us/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap)
  Akhiran `Async`, task yang dikembalikan selalu "hot". Use for: kapan operasi async mulai berjalan.
- [Microsoft Learn: ASP.NET Core Best Practices (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices?view=aspnetcore-8.0)
  "Avoid blocking calls" (`.Result`/`.Wait()` → thread pool starvation), `async void` selalu buruk, filter di database. Use for: kenapa async di seluruh call stack.
- [Microsoft Learn: Introduction to LINQ Queries](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries)
  Deferred vs immediate execution, tabel klasifikasi operator. Use for: deferred execution.
- [Microsoft Learn: EF Core How Queries Work](https://learn.microsoft.com/en-us/ef/core/querying/how-query-works), [Client vs. Server Evaluation](https://learn.microsoft.com/en-us/ef/core/querying/client-eval), dan [Asynchronous Programming](https://learn.microsoft.com/en-us/ef/core/miscellaneous/async)
  Kapan query dikirim ke database, `AsEnumerable`/`ToList` sebagai client evaluation, tidak ada `WhereAsync`, tidak boleh operasi paralel di satu DbContext. Use for: IEnumerable vs IQueryable dan async EF Core.
- [.NET API: IQueryable&lt;T&gt;](https://learn.microsoft.com/en-us/dotnet/api/system.linq.iqueryable-1?view=net-8.0) dan [Expression Trees](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/expression-trees/)
  IQueryable mewarisi IEnumerable, query sebagai expression tree yang diterjemahkan provider. Use for: IEnumerable vs IQueryable.
- [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  Definisi Promise sebagai pembanding `Task`. Use for: padanan TS/JS.
- [Microsoft Learn: Dependency injection guidelines](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/guidelines)
  Bagian "Captive dependency" (definisi + pesan exception), "Thread safety", dan kapan memakai Singleton. Use for: captive dependency (lesson 0004).
- [Microsoft Learn: Dependency injection in .NET, bagian "Scope validation"](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview#scope-validation) dan [Configure scope validation](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/web-host?view=aspnetcore-8.0#configure-scope-validation)
  Apa yang diperiksa scope validation, default hanya di Development, `ValidateScopes`, `IServiceScopeFactory` untuk BackgroundService. Use for: mendeteksi captive dependency.
- [Microsoft Learn: DbContext Lifetime, Configuration, and Initialization (EF Core)](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/)
  DbContext = satu unit-of-work, `AddDbContext` Scoped, tidak thread-safe, `AddDbContextFactory`. Use for: kenapa DbContext Scoped (lesson 0004, 0006).
- [NestJS: Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
  DEFAULT/REQUEST/TRANSIENT dan "scope bubbles up". Use for: padanan Node untuk Service Lifetime.
- [Microsoft Learn: Write custom ASP.NET Core middleware (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/write?view=aspnetcore-8.0)
  Syarat middleware class (`RequestDelegate`, `InvokeAsync`), middleware dibuat sekali, service Scoped lewat parameter `InvokeAsync`. Use for: Scoped service di middleware (lesson 0005).
- [Microsoft Learn: Configuration in ASP.NET Core (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-8.0)
  Urutan default sumber konfigurasi (command-line > env var > User Secrets > appsettings.{Env}.json > appsettings.json), `__` untuk hierarki di env var. Use for: konfigurasi berlapis.
- [Microsoft Learn: Safe storage of app secrets in development (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-8.0)
  Secret Manager / `dotnet user-secrets`, lokasi file, tidak terenkripsi, hanya untuk development; production pakai env var / Key Vault. Use for: "di mana secret disimpan?".
- [Microsoft Learn: Enable CORS in ASP.NET Core (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-8.0)
  `UseCors` sesudah `UseRouting` dan sebelum `UseAuthorization`, sebelum `UseResponseCaching`, preflight. Use for: urutan middleware (0005) dan CORS (0017).
- [Express: Using middleware](https://expressjs.com/en/guide/using-middleware.html) dan [Error handling](https://expressjs.com/en/guide/error-handling.html)
  Definisi middleware `(req, res, next)`, error handler 4 argumen yang didefinisikan paling akhir. Use for: padanan Node untuk middleware pipeline.
- [Microsoft Learn: Change Tracking in EF Core](https://learn.microsoft.com/en-us/ef/core/change-tracking/)
  Kapan Entity dilacak, lima EntityState dan aksinya saat SaveChanges, tracking per property. Use for: change tracking (lesson 0006).
- [Microsoft Learn: Efficient Querying (EF Core)](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying)
  Projection `Select`, eager loading, "Beware of lazy loading" (N+1), biaya snapshot tracking vs no-tracking. Use for: pertanyaan performa EF Core (lesson 0006).
- [Microsoft Learn: Tracking vs. No-Tracking Queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking)
  `AsNoTracking` untuk read-only, identity resolution, projection tanpa Entity tidak dilacak. Use for: kapan memakai AsNoTracking.
- [Microsoft Learn: Loading Related Data](https://learn.microsoft.com/en-us/ef/core/querying/related-data/) dan [Lazy Loading](https://learn.microsoft.com/en-us/ef/core/querying/related-data/lazy)
  Definisi eager/explicit/lazy loading; lazy loading opt-in lewat Proxies. Use for: penyebab N+1.
- [Microsoft Learn: Managing Database Schemas](https://learn.microsoft.com/en-us/ef/core/managing-schemas/), [Migrations Overview](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/), dan [Applying Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying)
  Code-first (Migrations) vs reverse engineering, snapshot model, history table, SQL script untuk production. Use for: pertanyaan Migration.
- [Prisma: Query optimization (Solving the n+1 problem)](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
  Definisi n+1 dan solusi `include`. Use for: padanan Node untuk N+1.
- [Sumber markdown dokumentasi RxJS (repo ReactiveX/rxjs, branch 7.x, `docs_app/content/guide/`)](https://github.com/ReactiveX/rxjs/tree/7.x/docs_app/content/guide) dan [JSDoc operator di `src/internal/operators/`](https://github.com/ReactiveX/rxjs/tree/7.x/src/internal/operators)
  rxjs.dev adalah SPA (kosong saat di-fetch agent); isi panduan dan halaman API operator berasal dari sini. Use for: mengutip Observable, Subject, `switchMap`/`mergeMap`/`concatMap`/`exhaustMap`, `forkJoin`, `catchError`, `takeUntil` secara verbatim, lalu tautkan ke rxjs.dev.
- [Angular v16: Observables compared to other techniques](https://v16.angular.io/guide/comparing-observables) dan [AsyncPipe](https://v16.angular.io/api/common/AsyncPipe)
  Tabel Observable vs Promise versi Angular dan perilaku `async` pipe (unsubscribe otomatis). Use for: lesson 0015, pertanyaan Observable vs Promise dan memory leak.
- [Robert C. Martin: Solid Relevance](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)
  Rumusan ringkas kelima prinsip SOLID dari pencetusnya. Use for: definisi SRP/OCP/LSP/ISP/DIP satu kalimat (lesson 0008).
- [Robert C. Martin: The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html) dan [The Open Closed Principle](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)
  "Reason to change" = orang/peran; OCP lewat arsitektur plugin. Use for: menjelaskan SRP dan OCP lebih dalam.
- [Kent Beck: Canon TDD](https://newsletter.kentbeck.com/p/canon-tdd)
  Langkah TDD versi pencetusnya (test list → satu test → pass → refactor opsional → ulangi) beserta daftar kesalahan per langkah. Use for: siklus red-green-refactor dan jebakannya (lesson 0009).
- [Martin Fowler: Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html) dan [Self Testing Code](https://martinfowler.com/bliki/SelfTestingCode.html)
  Rangkuman "Red - Green - Refactor", kesalahan paling umum (melewatkan refactor), dan "write a test that exposes the bug" sebelum memperbaiki. Use for: menjelaskan siklus dan kenapa merah dulu.
- [Microsoft Learn: Unit testing C# with xUnit](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit)
  Tutorial resmi dengan pendekatan TDD ("write a test that's known to fail"), `[Fact]`, `[Theory]` + `[InlineData]`. Use for: contoh siklus di xUnit.
- [Jest: Globals API (`test`, `test.each`)](https://jestjs.io/docs/api#testeachtablename-fn-timeout)
  Use for: padanan Node untuk `[Fact]`/`[Theory]`.
- [Martin Fowler: TestDouble](https://martinfowler.com/bliki/TestDouble.html) dan [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
  Definisi Dummy/Fake/Stub/Spy/Mock (dari Meszaros), state vs behavior verification ("only mocks insist upon behavior verification"). Use for: mock vs stub vs fake (lesson 0010).
- [Ham Vocke (martinfowler.com): The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
  Dua aturan piramida, kelemahan E2E (flaky, lambat), solitary vs sociable unit test. Use for: testing pyramid.
- [Microsoft Learn: EF Core, Choosing a testing strategy](https://learn.microsoft.com/en-us/ef/core/testing/choosing-a-testing-strategy) dan [Testing without your production database system](https://learn.microsoft.com/en-us/ef/core/testing/testing-without-the-database)
  Test against DB produksi vs test double; SQLite in-memory sebagai fake dan perbedaannya; provider in-memory "highly discouraged"; jangan mock `DbSet` untuk query; repository pattern sebagai test double yang direkomendasikan, biayanya, jangan kembalikan `IQueryable`; mulai dari test ke database asli. Use for: database di integration test dan apa yang diganti test double (lesson 0010), debat Repository di atas EF Core (lesson 0011).
- [Moq Quickstart](https://github.com/devlooped/moq/wiki/Quickstart)
  `Mock<T>`, `Setup/Returns/ReturnsAsync`, `It.IsAny`, `Verify` + `Times`, `mock.Object`. Use for: sintaks stub/mock di xUnit.
- [Jest: Mock Functions](https://jestjs.io/docs/mock-functions) dan [SuperTest](https://github.com/ladjs/supertest)
  Use for: padanan Node untuk Moq dan `WebApplicationFactory`.
- [EF Core API: DbContext Class](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext?view=efcore-8.0)
  "DbContext is a combination of the Unit Of Work and Repository patterns." Use for: argumen kontra Repository.
- [Microsoft Learn: Designing the infrastructure persistence layer (eBook .NET Microservices)](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)
  Repository per aggregate root, Unit of Work = `SaveChanges`, bagian "Repositories shouldn't be mandatory" (kutipan Jimmy Bogard). Use for: sisi "tidak wajib" dalam debat Repository.
- [React docs: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) dan [`lazy`](https://react.dev/reference/react/lazy)
  Dokumentasi resmi React. Use for: padanan React untuk DI hierarkis Angular (Provider terdekat) dan lazy loading route (lesson 0014).
- [Sumber kode Angular v16 `packages/router/src/models.ts` (branch 16.2.x)](https://github.com/angular/angular/blob/16.2.x/packages/router/src/models.ts)
  JSDoc yang menjadi halaman API v16.angular.io/api/router/*, termasuk tanda `@deprecated` class-based guard. Use for: mengutip status deprecated `CanActivate` di v16.
- [Angular v16: Introduction to forms](https://v16.angular.io/guide/forms-overview) dan [Reactive forms](https://v16.angular.io/guide/reactive-forms)
  Tabel "Key differences" reactive vs template-driven (setup, data model, data flow, validasi, testing), `FormBuilder`, `valueChanges`. Use for: memilih pendekatan form (lesson 0016).
- [Angular v16: HTTP - Intercept requests and responses](https://v16.angular.io/guide/http-intercept-requests-and-responses) dan [Interceptor use-cases](https://v16.angular.io/guide/http-interceptor-use-cases)
  `HttpInterceptor`, `next.handle()`, `HTTP_INTERCEPTORS` + `multi: true`, urutan interceptor, immutability + `clone`/`setHeaders`. Use for: HTTP Interceptor (lesson 0016, 0017).
- [Angular v16: Handle request errors](https://v16.angular.io/guide/http-handle-request-errors) dan [Setup for server communication](https://v16.angular.io/guide/http-setup-server-communication)
  `HttpErrorResponse` (status 0 untuk error jaringan), `retry`, `HttpClientModule`. Use for: HttpClient dan error handling di Angular.
- [Sumber kode Angular v16 `packages/common/http/src/interceptor.ts` (branch 16.2.x)](https://github.com/angular/angular/blob/16.2.x/packages/common/http/src/interceptor.ts)
  JSDoc halaman API `HttpInterceptorFn` (interceptor fungsi, injection context). Use for: menyebut interceptor fungsi sebagai alternatif standalone di v16.
- [Axios: Interceptors](https://axios-http.com/docs/interceptors)
  Dokumentasi resmi request/response interceptor Axios. Use for: padanan React untuk HTTP Interceptor.
- [Microsoft Learn: Overview of ASP.NET Core Authentication (.NET 8)](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-8.0) dan [Introduction to authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/introduction?view=aspnetcore-8.0)
  Definisi authentication vs authorization, scheme/handler, challenge (401 + `www-authenticate: bearer`) vs forbid (403), `ClaimsPrincipal`. Use for: pertanyaan authn vs authz (lesson 0017).
- [Microsoft Learn: Configure JWT bearer authentication in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication?view=aspnetcore-8.0)
  `AddJwtBearer`, apa yang divalidasi (signature, issuer, audience, expiry), 401 vs 403, rekomendasi OIDC/OAuth dan cookie HttpOnly (BFF) alih-alih token di local storage. Use for: JWT di .NET dan pertanyaan penyimpanan token.
- [Microsoft Learn: Role-based authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/roles?view=aspnetcore-8.0)
  `[Authorize(Roles = "...")]`, role sebagai policy (`RequireRole`). Use for: role vs policy-based authorization.
- [Microsoft Learn: Handle errors in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-8.0) dan [Handle errors in ASP.NET Core APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-8.0)
  `IExceptionHandler` (Singleton, `TryHandleAsync` true = ditangani), `AddProblemDetails`, `UseExceptionHandler`, `ValidationProblemDetails` dari `[ApiController]`. Use for: global error handling (lesson 0017).
- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519) dan [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
  Standar primer: struktur JWT (bagian base64url dipisah titik) dan field ProblemDetails (`type`, `title`, `status`, `detail`, `instance`). Use for: definisi formal.
- [OWASP: JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html), [HTML5 Security Cheat Sheet (Local Storage)](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html), dan [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
  Payload JWT hanya base64url; jangan simpan session identifier di localStorage (XSS); cookie terkirim otomatis (CSRF), `SameSite`. Use for: trade-off localStorage vs httpOnly cookie.
- [Angular v16: HTTP - Security: XSRF protection](https://v16.angular.io/guide/http-security-xsrf-protection) (sumber: `aio/content/guide/http-security-xsrf-protection.md` di branch `16.2.x`)
  `HttpClient` membaca cookie `XSRF-TOKEN` dan mengirim header `X-XSRF-TOKEN`; "supports only the client half". Use for: proteksi CSRF bila JWT di cookie.
- [Express: cors middleware](https://expressjs.com/en/resources/middleware/cors.html)
  Package `cors` dan opsi `origin`. Use for: padanan Node untuk CORS di ASP.NET Core.
- [MIT CAPD: The STAR method for behavioral interviews](https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/)
  Porsi S 20% / T 10% / A 60% / R 10%, pakai "saya" bukan "kami", hasil terukur. Use for: memoles 4 cerita STAR (lesson 0018).
- [Microsoft Learn: FROM clause plus JOIN, APPLY, PIVOT (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql) dan [Joins (SQL Server)](https://learn.microsoft.com/en-us/sql/relational-databases/performance/joins)
  Definisi INNER/LEFT/RIGHT/FULL/CROSS JOIN, predikat ON vs WHERE di outer join, NULL tidak saling cocok, denormalisasi, physical join. Use for: pertanyaan JOIN (lesson 0019).
- [Microsoft Learn: SELECT - GROUP BY](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-group-by-transact-sql), [SELECT - HAVING](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-having-transact-sql), dan [SELECT: logical processing order](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql#logical-processing-order-of-the-select-statement)
  WHERE sebelum grouping, HAVING untuk grup, urutan FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Use for: WHERE vs HAVING dan alias (lesson 0019).
- [Microsoft Learn: Subqueries (SQL Server)](https://learn.microsoft.com/en-us/sql/relational-databases/performance/subqueries) dan [WITH common_table_expression](https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql)
  Performa subquery umumnya setara dengan versi tanpa subquery, correlated subquery, NOT IN vs NULL; CTE tidak di-materialize, aturan titik koma, CTE rekursif. Use for: subquery vs CTE (lesson 0019).
- [Microsoft Learn: ROW_NUMBER (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/functions/row-number-transact-sql)
  PARTITION BY, ORDER BY wajib, ROW_NUMBER vs RANK, nondeterministik bila ORDER BY tidak unik, contoh CTE + filter. Use for: top-N per grup (lesson 0019).
- [Microsoft Learn: Primary and foreign key constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints) dan [Unique constraints and check constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints)
  PK = unique index (clustered bila belum ada), FK tidak otomatis ber-index, cascading action, UNIQUE = index non-clustered, CHECK dan jebakan NULL. Use for: constraint dan kenapa aturan juga di database (lesson 0019, dasar lesson 0022).
- [Microsoft Learn (arsip): Description of the database normalization basics](https://learn.microsoft.com/en-us/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/access/database-normalization-description)
  1NF/2NF/3NF dengan bahasa sederhana; ditulis untuk Access tapi konsepnya umum. Use for: selipan normalisasi (lesson 0019).
- [Microsoft Learn: Views](https://learn.microsoft.com/en-us/sql/relational-databases/views/views) dan [CREATE VIEW](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql)
  View sebagai tabel virtual, indexed view, ORDER BY di view tidak menjamin urutan, SCHEMABINDING. Use for: selipan view (lesson 0019).
- [Microsoft Learn: Stored procedures (Database Engine)](https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine) dan [CREATE PROCEDURE](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-procedure-transact-sql)
  Manfaat SP (network, permission, injection, plan reuse dan risikonya), awalan `sp_`, parameter default dan `OUTPUT`, `CREATE OR ALTER`, best practices (`SET NOCOUNT ON`, schema, transaction pendek, TRY...CATCH, hindari scalar function di banyak baris). Use for: menulis SP dan SP vs query dari aplikasi (lesson 0020).
- [Microsoft Learn: TRY...CATCH](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/try-catch-transact-sql), [THROW](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/throw-transact-sql), dan [RAISERROR](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/raiserror-transact-sql)
  Error yang ditangkap CATCH tidak sampai ke aplikasi, fungsi `ERROR_*`, THROW tanpa parameter untuk rethrow, nomor ≥ 50000, tabel beda THROW vs RAISERROR, "New applications should use THROW". Use for: error handling di SP (lesson 0020).
- [Microsoft Learn: User-defined functions](https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/user-defined-functions) dan [Create user-defined functions (Limitations)](https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/create-user-defined-functions-database-engine)
  Scalar vs table-valued (inline), function tidak boleh mengubah data, tanpa TRY...CATCH, dynamic SQL, atau temp table. Use for: SP vs function (lesson 0020).
- [Microsoft Learn: SQL Queries (EF Core)](https://learn.microsoft.com/en-us/ef/core/querying/sql-queries)
  `FromSql` (EF Core 7+) vs `FromSqlRaw`, parameter dan SQL injection, SP tidak bisa di-compose, `SqlQuery<T>`, `ExecuteSql`. Use for: memanggil SP dari EF Core (lesson 0020), raw SQL di lesson 0023.
- [Microsoft Learn: SQL injection](https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-injection)
  Definisi, parameter memperlakukan input sebagai literal, SP pun rentan bila memakai input tanpa parameter. Use for: pertanyaan keamanan query (lesson 0020).
- [Dapper README (DapperLib/Dapper)](https://github.com/DapperLib/Dapper)
  `Query<T>`, `Execute`, parameter objek anonim dan `DynamicParameters`, SP dengan `CommandType.StoredProcedure`, parameter Output/ReturnValue, `DbString` (varchar vs nvarchar). Use for: memanggil SP dari Dapper (lesson 0020).
- [Microsoft Learn: Index architecture and design guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide) dan [Clustered and nonclustered indexes described](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described)
  Analogi buku, B+ tree, clustered vs non-clustered, heap, properti clustered key ideal, urutan kolom composite (leftmost prefix), covering index dan INCLUDE, biaya tulis, overindexing, selektivitas rendah, tabel kecil. Use for: semua pertanyaan index (lesson 0022).
- [Microsoft Learn: CREATE INDEX (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-index-transact-sql) dan [Showplan logical and physical operators reference](https://learn.microsoft.com/en-us/sql/relational-databases/showplan-logical-and-physical-operators-reference)
  Sintaks CLUSTERED/NONCLUSTERED, INCLUDE, DROP INDEX; operator Index Seek, Clustered Index Scan, Key Lookup, RID Lookup. Use for: membuat index dan membaca plan (lesson 0022, dasar lesson 0023).
- [Microsoft Learn: SET STATISTICS IO](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-io-transact-sql), [SET STATISTICS TIME](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-time-transact-sql), dan [Pages and extents architecture guide](https://learn.microsoft.com/en-us/sql/relational-databases/pages-and-extents-architecture-guide)
  Logical reads vs physical reads, scan count, waktu parse/compile/execute, ukuran page 8 KiB. Use for: mengukur sebelum/sesudah index (lesson 0022).
- [Microsoft Learn: Execution plans](https://learn.microsoft.com/en-us/sql/relational-databases/performance/execution-plans), [Display the estimated execution plan](https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-the-estimated-execution-plan), [SET SHOWPLAN_XML](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-showplan-xml-transact-sql), dan [SET STATISTICS XML](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-xml-transact-sql)
  Apa isi execution plan, estimated (tanpa eksekusi) vs actual (dengan runtime), cara mengambil plan lewat T-SQL. Use for: membaca execution plan (lesson 0023).
- [Microsoft Learn: Query processing architecture guide, "Parameter sensitivity"](https://learn.microsoft.com/en-us/sql/relational-databases/query-processing-architecture-guide#parameter-sensitivity) dan [Parameter Sensitive Plan optimization](https://learn.microsoft.com/en-us/sql/relational-databases/performance/parameter-sensitive-plan-optimization)
  Definisi parameter sniffing, kapan terjadi (SP, sp_executesql, prepared query), local variable memakai density; PSP optimization SQL Server 2022 (compat 160, equality saja, cara mematikan per database). Use for: parameter sniffing (lesson 0023).
- [Microsoft Learn: Troubleshoot high-CPU-usage issues in SQL Server](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/troubleshoot-high-cpu-usage-issues) dan [Query hints](https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-query)
  Step 5 (parameter sniffing: RECOMPILE, OPTIMIZE FOR, OPTIMIZE FOR UNKNOWN, DISABLE_PARAMETER_SNIFFING, FREEPROCCACHE terarah) dan Step 6 (SARGability, contoh tulis ulang, computed column). Use for: SARGable dan penanganan parameter sniffing (lesson 0023).
- [Microsoft Learn: ORDER BY clause, OFFSET/FETCH](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql) dan [EF Core Pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination)
  Sintaks OFFSET/FETCH, urutan harus unik, biaya baris yang dilewati, keyset/seek pagination (satu dan dua kunci), tidak ada random access, index yang cocok. Use for: pagination (lesson 0023).
- [Microsoft Learn: EF Core Simple logging](https://learn.microsoft.com/en-us/ef/core/logging-events-diagnostics/simple-logging), [Performance Diagnosis](https://learn.microsoft.com/en-us/ef/core/performance/performance-diagnosis), [ToQueryString](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.entityframeworkqueryableextensions.toquerystring), dan [EnableSensitiveDataLogging](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.enablesensitivedatalogging)
  `LogTo`, level Information, durasi per perintah, jangan dibiarkan di production, `TagWith`, alur log → SQL → plan, `ToQueryString` untuk debugging, nilai parameter tersembunyi secara default. Use for: melihat SQL dari EF Core (lesson 0023).
- [Dapper README](https://github.com/DapperLib/Dapper)
  Parameter, `DbString` dan pentingnya unicode vs ANSI di SQL Server (konversi implisit). Use for: catatan SARGable/implicit conversion (lesson 0023), memanggil SP dari Dapper (lesson 0020).

## Wisdom (Communities)

- [r/dotnet](https://www.reddit.com/r/dotnet/) dan [r/csharp](https://www.reddit.com/r/csharp/)
  Komunitas besar & aktif. Use for: menanyakan pengalaman interview .NET, review kode.
- [r/Angular2](https://www.reddit.com/r/Angular2/)
  Subreddit utama Angular. Use for: pertanyaan Angular praktis.
- [Stack Overflow — tag c#, asp.net-core, angular](https://stackoverflow.com/questions/tagged/asp.net-core)
  Use for: error spesifik saat praktik.

## Gaps

- Belum ada sumber bank-soal interview .NET/Angular yang benar-benar high-trust; pertanyaan latihan disusun dari dokumentasi resmi.
