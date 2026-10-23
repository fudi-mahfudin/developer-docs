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

## Wisdom (Communities)

- [r/dotnet](https://www.reddit.com/r/dotnet/) dan [r/csharp](https://www.reddit.com/r/csharp/)
  Komunitas besar & aktif. Use for: menanyakan pengalaman interview .NET, review kode.
- [r/Angular2](https://www.reddit.com/r/Angular2/)
  Subreddit utama Angular. Use for: pertanyaan Angular praktis.
- [Stack Overflow — tag c#, asp.net-core, angular](https://stackoverflow.com/questions/tagged/asp.net-core)
  Use for: error spesifik saat praktik.

## Gaps
- Belum ada sumber bank-soal interview .NET/Angular yang benar-benar high-trust; pertanyaan latihan disusun dari dokumentasi resmi.
