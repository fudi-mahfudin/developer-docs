// Soal lesson 0010 · Jenis test dan test double. Format: assets/README.md.
QuestionBank.labelTopics({
  "test-jenis": "Testing: Unit vs Integration vs E2E (testing pyramid)",
  "test-double": "Testing: Mock, stub, dan fake",
  "test-waf": "Testing: WebApplicationFactory",
  "test-mock-apa": "Testing: apa yang di-mock dan apa yang tidak",
});

QuestionBank.register([
  // ---------- Jenis test ----------
  {
    id: "0010-01", lesson: "0010", topic: "test-jenis", type: "mc",
    prompt: "Menurut Microsoft, apa yang membedakan <strong>Integration Test</strong> dari <strong>Unit Test</strong>?",
    options: {
      a: "Integration test selalu dijalankan dari browser sungguhan",
      b: "Memastikan dua komponen atau lebih bekerja sama",
      c: "Integration test tidak pernah memakai pola Arrange-Act-Assert",
      d: "Integration test hanya dijalankan di server CI",
    },
    answer: "b",
    explain: "\"Unit tests are used to test isolated software components, such as individual class methods. Integration tests confirm that two or more app components work together to produce an expected result.\" Yang dari browser sampai database adalah E2E, bukan integration test.",
  },
  {
    id: "0010-02", lesson: "0010", topic: "test-jenis", type: "mc",
    prompt: "Dalam testing pyramid, jenis test mana yang jumlahnya <strong>paling sedikit</strong>?",
    options: {
      a: "Unit test untuk setiap method di Service",
      b: "Integration test untuk setiap endpoint API Product",
      c: "Unit test untuk setiap aturan validasi Product",
      d: "End-to-end test dari browser Angular sampai database",
    },
    answer: "d",
    explain: "Ham Vocke (The Practical Test Pyramid, martinfowler.com): \"Write tests with different granularity\" dan \"The more high-level you get the fewer tests you should have.\" E2E paling atas karena \"notoriously flaky\" dan \"run pretty slowly\".",
  },
  {
    id: "0010-03", lesson: "0010", topic: "test-jenis", type: "mc",
    prompt: "Aturan \"harga harus lebih dari 0\" bisa diuji lewat unit test <em>atau</em> integration test. Saran Microsoft?",
    options: {
      a: "Pilih unit test, integration test untuk infrastruktur",
      b: "Pilih integration test karena memakai komponen asli",
      c: "Tulis keduanya untuk setiap kombinasi data input",
      d: "Pilih E2E test supaya alurnya paling lengkap",
    },
    answer: "a",
    explain: "\"If a behavior can be tested using either a unit test or an integration test, choose the unit test.\" Integration test \"Take longer to run\", jadi batasi pada \"the most important infrastructure scenarios\" dan \"Don't write integration tests for every permutation\".",
  },
  // ---------- Mock, stub, fake ----------
  {
    id: "0010-04", lesson: "0010", topic: "test-double", type: "mc",
    prompt: "<code>_repo.Setup(r =&gt; r.ExistsByNameAsync(\"Keyboard\")).ReturnsAsync(true);</code> lalu test hanya meng-assert <code>ValidationException</code>. Dalam istilah Fowler, <code>_repo</code> di sini berperan sebagai…",
    options: {
      a: "fake, karena punya implementasi database ringan",
      b: "mock, karena dibuat dengan library Moq",
      c: "stub, karena hanya memberi jawaban siap",
      d: "dummy, karena tidak pernah dipanggil test",
    },
    answer: "c",
    explain: "Fowler: \"Stubs provide canned answers to calls made during the test.\" Nama library tidak menentukan perannya: objek <code>Mock&lt;T&gt;</code> yang tidak di-<code>Verify</code> dan tidak masuk Assert berperan sebagai stub. Microsoft: \"You run <code>Assert</code> operations against a mock object, but not against a stub.\"",
  },
  {
    id: "0010-05", lesson: "0010", topic: "test-double", type: "mc",
    prompt: "Kapan test double disebut <strong>mock</strong> (bukan stub)?",
    options: {
      a: "Saat ia mengembalikan nilai yang sudah diprogram",
      b: "Saat test memverifikasi panggilan yang ia terima",
      c: "Saat ia punya implementasi kerja yang disederhanakan",
      d: "Saat ia hanya mengisi parameter constructor saja",
    },
    answer: "b",
    explain: "Fowler: mocks \"are checked during verification to ensure they got all the calls they were expecting\" dan \"only mocks insist upon behavior verification.\" Di Moq: <code>_repo.Verify(r =&gt; r.AddAsync(It.IsAny&lt;Product&gt;()), Times.Never)</code>. Opsi lain berturut-turut: stub, fake, dummy.",
  },
  {
    id: "0010-06", lesson: "0010", topic: "test-double", type: "mc",
    prompt: "Database SQLite in-memory yang menggantikan SQL Server saat test adalah contoh…",
    options: {
      a: "fake: implementasi kerja dengan jalan pintas",
      b: "stub: hanya memberi jawaban yang diprogram",
      c: "mock: memverifikasi panggilan yang ia terima",
      d: "spy: mencatat berapa kali ia dipanggil",
    },
    answer: "a",
    explain: "Fowler: \"Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an InMemoryTestDatabase is a good example).\" Tabel EF Core juga menyebut SQLite in-memory sebagai \"Fake\".",
  },
  // ---------- WebApplicationFactory ----------
  {
    id: "0010-07", lesson: "0010", topic: "test-waf", type: "mc",
    prompt: "Apa yang dilakukan <code>WebApplicationFactory&lt;Program&gt;</code> dalam integration test?",
    options: {
      a: "Men-deploy API ke server staging sebelum test",
      b: "Membuat mock untuk semua Controller di aplikasi",
      c: "Membuat database SQL Server baru untuk test",
      d: "Menjalankan aplikasi di TestServer in-memory, tanpa deploy",
    },
    answer: "d",
    explain: "\"WebApplicationFactory&lt;TEntryPoint&gt; is used to create a TestServer for the integration tests.\" ASP.NET Core \"supports integration tests using a unit test framework with a test web host and an in-memory test server.\" <code>CreateClient()</code> memberi <code>HttpClient</code> ke server itu. Padanan Node: Supertest dengan <code>request(app)</code>.",
  },
  {
    id: "0010-08", lesson: "0010", topic: "test-waf", type: "mc",
    prompt: "Kenapa ROADMAP menambahkan <code>public partial class Program { }</code> di akhir <code>Program.cs</code>?",
    options: {
      a: "Supaya Program bisa di-inject ke dalam Controller",
      b: "Supaya Program.cs bisa dipecah ke banyak file",
      c: "Supaya project test memakai Program sebagai TEntryPoint",
      d: "Supaya middleware dijalankan sesuai urutan yang benar",
    },
    answer: "c",
    explain: "Dengan top-level statements, class <code>Program</code> dibuat implisit dan tidak public. Microsoft: \"Expose the implicitly defined <code>Program</code> class to the test project\", lewat <code>InternalsVisibleTo</code> atau partial class public. <code>TEntryPoint</code> adalah \"the entry point class of the SUT, usually <code>Program.cs</code>.\"",
  },
  {
    id: "0010-09", lesson: "0010", topic: "test-waf", type: "mc",
    prompt: "Di <code>ApiFactory</code>, <code>builder.ConfigureServices</code> menghapus <code>DbContextOptions&lt;AppDbContext&gt;</code> lalu mendaftarkan SQLite. Kenapa ini berhasil?",
    options: {
      a: "Callback test dijalankan setelah kode Program.cs selesai",
      b: "Callback test dijalankan sebelum kode Program.cs dibaca",
      c: "SQLite otomatis dipilih saat environment bernama Testing",
      d: "WebApplicationFactory selalu mengabaikan semua registrasi dari Program.cs",
    },
    answer: "a",
    explain: "\"The test app's <code>builder.ConfigureServices</code> callback is executed <em>after</em> the app's <code>Program.cs</code> code is executed. To use a different database for the tests than the app's database, the app's database context must be replaced in <code>builder.ConfigureServices</code>.\" Untuk mengganti service per test: <code>WithWebHostBuilder</code> + <code>ConfigureTestServices</code>.",
  },
  // ---------- Apa yang di-mock ----------
  {
    id: "0010-10", lesson: "0010", topic: "test-mock-apa", type: "mc",
    prompt: "Di unit test <code>ProductService</code>, apa yang sebaiknya diganti dengan test double?",
    options: {
      a: "Entity Product dan DTO CreateProductRequest yang dikirim",
      b: "IProductRepository, batas ke database lewat EF Core",
      c: "ProductService itu sendiri, supaya test lebih cepat",
      d: "Method private ValidateAsync yang ada di ProductService",
    },
    answer: "b",
    explain: "Unit test harus \"Isolated\": \"no dependencies on any outside factors, such as a file system or database.\" Ganti batas I/O (repository), bukan objek data (Entity/DTO), bukan SUT itu sendiri, dan bukan method private (\"Validate private methods with public methods\").",
  },
  {
    id: "0010-11", lesson: "0010", topic: "test-mock-apa", type: "mc",
    prompt: "Rekan Anda me-mock <code>DbSet&lt;Product&gt;</code> untuk menguji query <code>Where(p =&gt; p.Price &gt; 100)</code>. Menurut dokumentasi EF Core?",
    options: {
      a: "Bagus, karena DbSet memang dirancang untuk di-mock",
      b: "Bagus, asalkan memakai Moq dan bukan NSubstitute",
      c: "Hindari, kecuali query-nya juga memakai AsNoTracking sekalian",
      d: "Hindari, operator LINQ adalah extension method statis",
    },
    answer: "d",
    explain: "\"properly mocking <code>DbSet</code> query functionality is not possible, since queries are expressed via LINQ operators, which are static extension method calls over <code>IQueryable</code>.\" Ringkasan EF Core: \"Avoid mocking <code>DbSet</code> for querying purposes.\" Mock <code>DbContext</code> masih wajar untuk memverifikasi <code>Add</code>/<code>SaveChanges</code>.",
  },
  {
    id: "0010-12", lesson: "0010", topic: "test-mock-apa", type: "mc",
    prompt: "Untuk integration test API, pilihan database mana yang <strong>paling tidak</strong> disarankan dokumentasi EF Core?",
    options: {
      a: "SQL Server asli lewat Testcontainers atau Docker",
      b: "SQLite in-memory sebagai fake yang mudah disiapkan",
      c: "Provider EF Core in-memory sebagai fake database",
      d: "SQL Server LocalDB di mesin developer sendiri",
    },
    answer: "c",
    explain: "EF Core: memakai provider in-memory sebagai fake \"is <strong>highly discouraged</strong>\"; \"Avoid the in-memory provider for testing purposes.\" Urutan saran: database produksi asli (mis. Testcontainers), lalu repository pattern, lalu SQLite in-memory. ROADMAP memakai SQLite demi kecepatan setup; sebutkan trade-off dialek SQL-nya saat interview.",
  },
  // ---------- Lisan ----------
  {
    id: "0010-oral-1", lesson: "0010", topic: "test-jenis", type: "oral",
    prompt: "Apa beda Unit Test, Integration Test, dan E2E? Bagaimana Anda menguji API Product Catalog tanpa deploy? (60 detik)",
    sample: "\"Unit test menguji satu komponen terisolasi, misalnya <code>ProductService</code> dengan <code>IProductRepository</code> di-mock pakai Moq; cepat, dalam milidetik, tanpa database. Integration test memastikan beberapa komponen bekerja sama: pipeline HTTP, Controller, Service, sampai database. E2E menguji dari browser Angular sampai database, paling lambat dan paling rapuh. Itulah testing pyramid: banyak unit test, lebih sedikit integration test, sedikit sekali E2E. Microsoft juga bilang kalau satu perilaku bisa diuji dua cara, pilih unit test. Untuk API saya pakai <code>WebApplicationFactory&lt;Program&gt;</code>: ia menjalankan aplikasi di TestServer in-memory, <code>CreateClient()</code> memberi <code>HttpClient</code>, jadi tanpa deploy. Di <code>ConfigureWebHost</code> saya ganti DbContext ke SQLite in-memory; idealnya SQL Server asli lewat Testcontainers karena dialeknya beda. Di Node padanannya Supertest dengan <code>request(app)</code>.\"",
    checklist: [
      "Unit test: satu komponen terisolasi, dependensi I/O diganti test double, cepat",
      "Integration test: dua komponen atau lebih bekerja sama, termasuk database/pipeline HTTP",
      "E2E: dari UI sampai database, paling lambat dan rapuh",
      "Testing pyramid: makin tinggi levelnya makin sedikit jumlahnya; kalau bisa dua-duanya, pilih unit test",
      "WebApplicationFactory: TestServer in-memory + CreateClient(), tanpa deploy",
      "Mengganti DbContext di ConfigureWebHost (SQLite/Testcontainers) dan menyebut trade-off-nya",
    ],
  },
  {
    id: "0010-oral-2", lesson: "0010", topic: "test-mock-apa", type: "oral",
    prompt: "Apa beda mock, stub, dan fake? Apa yang Anda mock dan apa yang tidak? (60 detik)",
    sample: "\"Ketiganya test double, pengganti objek produksi saat test. Stub memberi jawaban siap, misalnya <code>Setup(r =&gt; r.ExistsByNameAsync(\"Keyboard\")).ReturnsAsync(true)</code>, dan saya tidak meng-assert apa pun terhadapnya. Mock diverifikasi: test gagal kalau panggilan yang diharapkan tidak terjadi, misalnya <code>Verify(r =&gt; r.AddAsync(It.IsAny&lt;Product&gt;()), Times.Never)</code>. Jadi bedanya di Assert, bukan di library; objek <code>Mock&lt;T&gt;</code> Moq bisa berperan sebagai stub. Fake punya implementasi kerja dengan jalan pintas, contohnya SQLite in-memory menggantikan SQL Server. Yang saya mock adalah batas I/O: repository, HTTP client ke layanan lain, jam sistem. Yang tidak: Entity dan DTO, SUT-nya sendiri, method private, dan <code>DbSet</code> untuk query karena LINQ adalah extension method statis. Di Jest padanannya <code>jest.fn().mockReturnValue(...)</code> untuk stub dan <code>expect(fn).toHaveBeenCalled()</code> untuk mock.\"",
    checklist: [
      "Test double sebagai istilah umum pengganti objek produksi",
      "Stub: jawaban siap (Setup/Returns), tidak di-assert",
      "Mock: diverifikasi panggilannya (Verify/Times), bedanya di Assert bukan di library",
      "Fake: implementasi kerja dengan jalan pintas (SQLite in-memory)",
      "Yang di-mock: batas I/O seperti repository, HTTP client, jam sistem",
      "Yang tidak di-mock: Entity/DTO, SUT, method private, DbSet untuk query",
    ],
  },
]);
