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

## Wisdom (Communities)

- [r/dotnet](https://www.reddit.com/r/dotnet/) dan [r/csharp](https://www.reddit.com/r/csharp/)
  Komunitas besar & aktif. Use for: menanyakan pengalaman interview .NET, review kode.
- [r/Angular2](https://www.reddit.com/r/Angular2/)
  Subreddit utama Angular. Use for: pertanyaan Angular praktis.
- [Stack Overflow — tag c#, asp.net-core, angular](https://stackoverflow.com/questions/tagged/asp.net-core)
  Use for: error spesifik saat praktik.

## Gaps
- Belum ada sumber bank-soal interview .NET/Angular yang benar-benar high-trust; pertanyaan latihan disusun dari dokumentasi resmi.
