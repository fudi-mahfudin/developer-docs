// Soal lesson 0011 · Clean Architecture + debat Repository di atas EF Core. Format: assets/README.md.
QuestionBank.labelTopics({
  "ca-dependency-rule": "Clean Architecture: dependency rule",
  "ca-placement": "Clean Architecture: posisi interface dan implementasi",
  "ca-vs-layered": "Clean Architecture vs layered",
  "repo-ef-core": "Repository di atas EF Core: pro, kontra, kapan tidak perlu",
});

QuestionBank.register([
  // ---------- Dependency rule ----------
  {
    id: "0011-01", lesson: "0011", topic: "ca-dependency-rule", type: "mc",
    prompt: "Dependency rule dari Clean Architecture (Robert C. Martin) berbunyi…",
    options: {
      a: "Lapisan luar tidak boleh memanggil lapisan dalam sama sekali",
      b: "Dependency source code hanya boleh mengarah ke lingkaran dalam",
      c: "Setiap lapisan hanya boleh bergantung pada satu lapisan bawah",
      d: "Database berada di pusat dan semua lapisan bergantung padanya",
    },
    answer: "b",
    explain: "Martin: \"source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle.\" Lapisan luar justru memanggil ke dalam; yang dilarang adalah lingkaran dalam mengenal lingkaran luar. Database ada di lingkaran terluar (Frameworks and Drivers), bukan di pusat.",
  },
  {
    id: "0011-02", lesson: "0011", topic: "ca-dependency-rule", type: "mc",
    prompt: "Saat runtime, alurnya keluar: Controller → use case → repository → database. Bagaimana dependency <em>source code</em> tetap mengarah ke dalam?",
    options: {
      a: "Use case memanggil class repository konkret dari Infrastructure",
      b: "Infrastructure menyalin kode use case ke dalam project-nya",
      c: "Controller langsung memakai DbContext tanpa melewati use case",
      d: "Lewat DIP: interface di dalam, implementasi di luar",
    },
    answer: "d",
    explain: "Martin: \"We usually resolve this apparent contradiction by using the Dependency Inversion Principle.\" Use case memanggil <code>IProductRepository</code> yang didefinisikan di dalam; <code>ProductRepository</code> di luar yang mengimplementasikannya. Ini DIP dari lesson 0008, dalam skala project.",
  },
  // ---------- Posisi interface dan implementasi ----------
  {
    id: "0011-03", lesson: "0011", topic: "ca-placement", type: "mc",
    prompt: "Di solusi Clean Architecture ASP.NET Core, di project mana <em>interface</em> <code>IProductRepository</code> didefinisikan?",
    options: {
      a: "Application Core, bersama entity dan domain service",
      b: "Infrastructure, bersama DbContext dan Migration EF Core",
      c: "UI (Web API), bersama Controller dan Program.cs",
      d: "Project terpisah khusus interface untuk semua lapisan",
    },
    answer: "a",
    explain: "Microsoft: abstraksi \"are defined in the Application Core, which are then implemented by types defined in the Infrastructure layer.\" Application Core berisi entity, interface, dan domain service, dan \"has no dependencies on other application layers.\"",
  },
  {
    id: "0011-04", lesson: "0011", topic: "ca-placement", type: "mc",
    prompt: "<code>ProductRepository</code> (implementasi EF Core) dan <code>AppDbContext</code> ditaruh di…",
    options: {
      a: "Application Core, supaya use case bisa memakai langsung",
      b: "Domain, karena repository bagian dari aturan bisnis inti",
      c: "Infrastructure, yang mereferensikan project Application Core untuk interface",
      d: "UI, karena Controller yang pertama kali membutuhkan data",
    },
    answer: "c",
    explain: "Microsoft: Infrastructure berisi \"EF Core types (DbContext, Migration)\" dan \"Data access implementation types (Repositories)\". Implementasinya mengimplementasikan interface dari Application Core, \"and so Infrastructure should have a reference to the Application Core project.\" Panahnya: Infrastructure → Core, bukan sebaliknya.",
  },
  {
    id: "0011-05", lesson: "0011", topic: "ca-placement", type: "mc",
    prompt: "Project UI (Web API) mereferensikan project Infrastructure supaya DI bisa disambungkan. Menurut Microsoft, ini boleh asalkan…",
    options: {
      a: "Controller membuat ProductRepository sendiri dengan keyword new langsung",
      b: "Tipe Infrastructure hanya dipakai di composition root (Program.cs)",
      c: "Infrastructure juga mereferensikan UI supaya hubungan dua arah",
      d: "Semua Controller dipindah ke project Infrastructure yang sama",
    },
    answer: "b",
    explain: "Microsoft: \"the simplest approach is to allow the UI project to reference the Infrastructure project (but developers should limit actual references to types in the Infrastructure project to the app's composition root).\" Controller tetap hanya mengenal interface dari Application Core.",
  },
  // ---------- Clean vs layered ----------
  {
    id: "0011-06", lesson: "0011", topic: "ca-vs-layered", type: "mc",
    prompt: "Menurut Microsoft, kelemahan utama N-Layer tradisional (UI → BLL → DAL) adalah…",
    options: {
      a: "Business logic bergantung pada detail akses data dan database",
      b: "Terlalu banyak project sehingga build menjadi sangat lambat sekali",
      c: "Controller tidak bisa memanggil service tanpa memakai MediatR dulu",
      d: "Tidak bisa dideploy sebagai satu unit aplikasi web saja",
    },
    answer: "a",
    explain: "Microsoft: \"compile-time dependencies run from the top to the bottom… the BLL, which usually holds the most important logic in the application, is dependent on data access implementation details (and often on the existence of a database). Testing business logic in such an architecture is often difficult, requiring a test database.\"",
  },
  {
    id: "0011-07", lesson: "0011", topic: "ca-vs-layered", type: "mc",
    prompt: "Pewawancara: \"Layered kami sudah memakai <code>IProductRepository</code> yang diinjeksi. Lalu apa bedanya dengan Clean Architecture?\" Jawaban paling tepat:",
    options: {
      a: "Tidak ada bedanya, Clean Architecture hanya nama lain layered",
      b: "Clean Architecture selalu mewajibkan CQRS dan MediatR sejak awal",
      c: "Clean menegakkan arah ke dalam lewat referensi antar project",
      d: "Layered tidak bisa di-unit-test sama sekali tanpa database asli",
    },
    answer: "c",
    explain: "Layered + DIP dalam satu project sudah dekat dengan Clean, tapi arahnya hanya dijaga disiplin: di single project \"there's no clear indication of which classes in which folders should depend on which others.\" Clean menaruh Application Core di pusat dan memisahkan project, sehingga Core yang tidak mereferensikan Infrastructure memang tidak bisa memakai EF Core. CQRS/MediatR opsional.",
  },
  {
    id: "0011-08", lesson: "0011", topic: "ca-vs-layered", type: "mc",
    prompt: "Kapan Clean Architecture multi-project paling masuk akal dibanding layered satu project?",
    options: {
      a: "API CRUD kecil dengan satu Entity dan satu developer",
      b: "Prototipe sekali pakai yang dibuang setelah demo minggu depan",
      c: "Script migrasi data yang hanya dijalankan satu kali saja",
      d: "Domain kompleks berumur panjang dengan banyak aturan bisnis penting",
    },
    answer: "d",
    explain: "Microsoft menyebut Clean Architecture \"the most appropriate way to structure non-trivial monolithic applications\". Biayanya lebih banyak project dan boilerplate, jadi untuk CRUD kecil (seperti mini project Product Catalog) layered satu project dengan folder sudah cukup.",
  },
  // ---------- Debat Repository di atas EF Core ----------
  {
    id: "0011-09", lesson: "0011", topic: "repo-ef-core", type: "mc",
    prompt: "Argumen paling kuat untuk <em>tidak</em> menulis Repository sendiri di atas EF Core:",
    options: {
      a: "EF Core tidak mendukung dependency injection di ASP.NET Core",
      b: "DbContext sudah gabungan pola Unit of Work dan Repository",
      c: "Repository membuat query SQL selalu lebih lambat dua kali",
      d: "Microsoft melarang Repository di semua aplikasi .NET 8 baru",
    },
    answer: "b",
    explain: "Dokumentasi API EF Core: \"DbContext is a combination of the Unit Of Work and Repository patterns.\" <code>DbSet&lt;Product&gt;</code> sudah berperan seperti repository dan <code>SaveChanges</code> sudah unit of work. Microsoft juga menulis repository \"isn't an essential pattern\" dan mengutip Jimmy Bogard yang tidak menyukainya karena \"they hide the important details of the underlying persistence mechanism.\"",
  },
  {
    id: "0011-10", lesson: "0011", topic: "repo-ef-core", type: "mc",
    prompt: "Dokumentasi testing EF Core: kalau Anda <em>memang</em> memakai test double (tidak test ke database asli), pendekatan yang direkomendasikan adalah…",
    options: {
      a: "Mock DbSet dengan Moq untuk semua query LINQ",
      b: "EF Core in-memory provider sebagai pengganti database asli",
      c: "Lapisan Repository di atas EF Core, lalu di-mock",
      d: "Menghapus semua test yang menyentuh data dari proyek",
    },
    answer: "c",
    explain: "EF Core: \"If you've decided to use a test double, we recommend implementing the repository pattern\". Mock DbSet untuk query sebaiknya dihindari, dan in-memory provider \"highly discouraged\". Ini argumen pro terkuat: unit test service cukup memberi mock <code>IProductRepository</code>, seperti <code>jest.fn()</code>.",
  },
  {
    id: "0011-11", lesson: "0011", topic: "repo-ef-core", type: "mc",
    prompt: "<code>IProductRepository</code> punya method <code>IQueryable&lt;Product&gt; Query()</code>. Kenapa ini merusak tujuan Repository?",
    options: {
      a: "Query masih disusun di luar, jadi EF Core tetap terlibat",
      b: "IQueryable tidak bisa dipakai bersama async dan await di C#",
      c: "IQueryable selalu memuat seluruh isi tabel ke memori lebih dulu",
      d: "Compiler C# menolak interface yang mengembalikan tipe IQueryable apa pun",
    },
    answer: "a",
    explain: "EF Core: mengembalikan <code>IQueryable</code> \"would mean that query operators can still be composed over the result, requiring that EF Core still be involved in translating the query; this would defeat the purpose of having a repository in the first place.\" Kembalikan <code>IEnumerable</code>/<code>IAsyncEnumerable</code> atau hasil jadi. Ingat lesson 0003: IQueryable = expression tree untuk provider.",
  },
  {
    id: "0011-12", lesson: "0011", topic: "repo-ef-core", type: "mc",
    prompt: "Dalam situasi mana Repository di atas EF Core paling <em>tidak</em> perlu?",
    options: {
      a: "Tim perlu mendukung dua database dengan query berbeda",
      b: "Unit test service harus jalan tanpa koneksi database",
      c: "Banyak aturan bisnis yang harus di-unit-test dengan mock",
      d: "CRUD kecil yang diuji integration test database nyata",
    },
    answer: "d",
    explain: "EF Core merekomendasikan test ke database produksi lebih dulu (\"it's a good idea to start there\"), dan repository \"can incur significant cost to implement and maintain\". Kalau tim sudah memakai integration test dengan DB nyata (Testcontainers/SQLite), manfaat mock repository mengecil. Tiga opsi lain justru alasan memakai repository.",
  },
  // ---------- Lisan ----------
  {
    id: "0011-oral-1", lesson: "0011", topic: "ca-vs-layered", type: "oral",
    prompt: "Gambarkan Clean Architecture dan jelaskan bedanya dengan layered architecture, dalam 60 detik.",
    sample: "\"Clean Architecture menaruh aturan bisnis di pusat: Application Core berisi entity, interface seperti <code>IProductRepository</code>, dan domain service. Di luarnya ada Infrastructure, yang berisi <code>DbContext</code>, Migration, dan implementasi repository, serta UI yang berisi Controller dan <code>Program.cs</code>. Dependency rule-nya: dependency source code hanya mengarah ke dalam, jadi Core tidak tahu EF Core. Caranya lewat DIP: interface di Core, implementasi di Infrastructure, dan disambungkan di composition root. Bedanya dengan layered tradisional: di sana UI bergantung ke BLL dan BLL ke DAL, sehingga logika bisnis bergantung pada akses data dan sulit dites tanpa database. Trade-off-nya, Clean menambah project dan boilerplate, jadi saya pakai untuk domain kompleks yang berumur panjang. Untuk CRUD kecil, layered satu project dengan interface sudah cukup. Di Node, ini mirip hexagonal atau ports and adapters di NestJS, dengan Prisma sebagai adapter.\"",
    checklist: [
      "Application Core di pusat berisi entity dan interface (mis. IProductRepository)",
      "Infrastructure berisi DbContext dan implementasi repository; UI berisi Controller",
      "dependency rule: dependency source code hanya mengarah ke dalam",
      "DIP sebagai caranya, disambungkan di composition root (Program.cs)",
      "beda dengan layered: BLL bergantung pada DAL dan database",
      "trade-off: boilerplate vs domain kompleks, plus padanan Node (hexagonal/ports and adapters)",
    ],
  },
  {
    id: "0011-oral-2", lesson: "0011", topic: "repo-ef-core", type: "oral",
    prompt: "\"Repository di atas EF Core, perlu atau tidak?\" Jawab dalam 60 detik dengan pro, kontra, dan kapan tidak perlu.",
    sample: "\"Tergantung. Pro-nya: dokumentasi EF Core sendiri merekomendasikan repository kalau kita mau test double, karena unit test Service cukup me-mock <code>IProductRepository</code>, bukan me-mock <code>DbSet</code> atau memakai in-memory provider yang tidak setia pada database asli. Semua query juga terkumpul di satu tempat, dan ini contoh nyata DIP. Kontra-nya: <code>DbContext</code> sudah gabungan Unit of Work dan Repository, jadi repository generik sering cuma membungkus ulang dan menambah boilerplate. Kalau repository mengembalikan <code>IQueryable</code>, abstraksinya bocor dan EF Core tetap terlibat. Kapan tidak perlu: aplikasi CRUD kecil, atau tim yang memilih integration test ke database nyata, misalnya Testcontainers atau SQLite. Di mini project saya tetap pakai repository spesifik per Entity, dengan method yang mengembalikan hasil jadi. Padanannya di Node: membungkus Prisma client di data-access layer, padahal Prisma client sendiri sudah mirip repository.\"",
    checklist: [
      "pro: mudah di-mock untuk unit test Service (rekomendasi dokumentasi EF Core)",
      "pro: query terkumpul di satu tempat / contoh DIP",
      "kontra: DbContext sudah Unit of Work + Repository, sehingga ada boilerplate",
      "kontra: repository yang mengembalikan IQueryable membocorkan abstraksi",
      "kapan tidak perlu: CRUD kecil atau integration test dengan database nyata",
      "posisi sendiri yang jelas, plus padanan Node (membungkus Prisma client)",
    ],
  },
]);
