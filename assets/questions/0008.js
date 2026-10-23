// Soal lesson 0008 · Prinsip SOLID. Format: assets/README.md.
QuestionBank.labelTopics({
  "solid-srp": "SOLID: Single Responsibility (SRP)",
  "solid-dip": "SOLID: Dependency Inversion (DIP)",
  "solid-ocp": "SOLID: Open/Closed (OCP)",
  "solid-lsp": "SOLID: Liskov Substitution (LSP)",
  "solid-isp": "SOLID: Interface Segregation (ISP)",
  "solid-violation": "SOLID: mengenali pelanggaran di kode",
  "solid-lima": "SOLID: lima contoh dari Product Catalog",
});

// Opsi tetap untuk latihan mengenali pelanggaran (satu kata, urutan S-O-L-I-D).
const SOLID_OPTS_0008 = { a: "SRP", b: "OCP", c: "LSP", d: "ISP", e: "DIP" };

QuestionBank.register([
  // ---------- Konsep: SRP ----------
  {
    id: "0008-01", lesson: "0008", topic: "solid-srp", type: "mc",
    prompt: "Robert C. Martin: \"each software module should have one and only one reason to change.\" Menurut dia, \"alasan untuk berubah\" itu pada akhirnya adalah…",
    options: {
      a: "jumlah method yang ada di class",
      b: "orang atau peran yang meminta perubahan",
      c: "jumlah baris kode di satu file",
      d: "jumlah dependency di constructor class itu",
    },
    answer: "b",
    explain: "\"This principle is about people.\" Rumusan ulangnya: \"Gather together the things that change for the same reasons. Separate those things that change for different reasons.\" Aturan harga diminta tim bisnis, format CSV diminta tim laporan: dua alasan, jadi dua class.",
  },
  {
    id: "0008-02", lesson: "0008", topic: "solid-srp", type: "mc",
    prompt: "Constructor <code>ProductService</code> menerima 9 dependency (repository, email, PDF, cache, logger, …). Menurut dokumentasi DI ASP.NET Core, ini tanda apa?",
    options: {
      a: "Lifetime service harus diubah menjadi Singleton saja",
      b: "DI container perlu diganti dengan library lain",
      c: "Constructor perlu diganti dengan pola service locator",
      d: "Class memegang terlalu banyak tanggung jawab sekaligus",
    },
    answer: "d",
    explain: "Microsoft: \"If a class has many injected dependencies, it might be a sign that the class has too many responsibilities and violates the Single Responsibility Principle (SRP).\" Solusinya memecah tanggung jawab ke class baru, bukan menyembunyikan dependency lewat service locator (yang justru anti-pattern).",
  },
  // ---------- Konsep: DIP ----------
  {
    id: "0008-03", lesson: "0008", topic: "solid-dip", type: "mc",
    prompt: "<code>ProductService</code> dulu memanggil <code>ProductRepository</code> langsung. Setelah DIP, ia memanggil <code>IProductRepository</code>. Apa yang <em>berubah</em>?",
    options: {
      a: "Arah dependency compile-time terbalik, alur runtime tetap sama",
      b: "Alur runtime terbalik, kini repository yang memanggil service",
      c: "Query SQL kini dijalankan oleh Service, bukan Repository",
      d: "Tidak ada yang berubah, hanya nama tipe saja",
    },
    answer: "a",
    explain: "Microsoft: dengan DIP, A memanggil abstraksi yang diimplementasikan B, sehingga B \"depend[s] on an interface controlled by A at compile time\". \"At run time, the flow of program execution remains unchanged.\" Service tetap memanggil repository; yang terbalik adalah siapa bergantung pada siapa saat compile.",
  },
  {
    id: "0008-04", lesson: "0008", topic: "solid-dip", type: "mc",
    prompt: "Pewawancara: \"Apa beda Dependency Inversion dan Dependency Injection?\" Jawaban paling tepat:",
    options: {
      a: "Keduanya sama persis, hanya berbeda pada nama saja",
      b: "Injection adalah prinsip, Inversion adalah fitur DI container",
      c: "Inversion adalah prinsip arah, Injection teknik yang dimungkinkannya",
      d: "Inversion khusus Angular, sedangkan Injection khusus untuk .NET",
    },
    answer: "c",
    explain: "DIP adalah prinsip desain: bergantung ke arah abstraksi. Microsoft: \"The practice of dependency injection is made possible by following the dependency inversion principle.\" DI (constructor injection + container di <code>Program.cs</code>) adalah cara memasok implementasinya.",
  },
  {
    id: "0008-05", lesson: "0008", topic: "solid-dip", type: "mc",
    prompt: "Kenapa DIP membuat <code>ProductService</code> mudah di-unit-test?",
    options: {
      a: "Karena DI container otomatis membuatkan test untuk setiap service",
      b: "Karena test bisa langsung memasukkan mock <code>IProductRepository</code> lewat constructor",
      c: "Karena Service tidak lagi butuh aturan bisnis sama sekali",
      d: "Karena database SQL Server berjalan lebih cepat saat testing",
    },
    answer: "b",
    explain: "Microsoft: class yang membuat dependency-nya sendiri \"is difficult to unit test\". Kalau Service hanya mengenal interface, test cukup <code>new ProductService(mockRepo.Object)</code> (Moq), seperti <code>jest.fn()</code> di Node. Inilah alasan SRP + DIP adalah jawaban terkuat untuk \"prinsip mana yang paling sering Anda terapkan\".",
  },
  // ---------- Konsep: OCP / LSP / ISP ----------
  {
    id: "0008-06", lesson: "0008", topic: "solid-ocp", type: "mc",
    prompt: "<code>PriceCalculator</code> menerima <code>IDiscountStrategy</code>. Bisnis minta diskon baru <code>SeasonalDiscount</code>. Dengan OCP, apa yang Anda ubah?",
    options: {
      a: "Tambah <code>case</code> baru di dalam method <code>PriceCalculator</code>",
      b: "Ubah interface <code>IDiscountStrategy</code> dengan menambah method baru",
      c: "Salin <code>PriceCalculator</code> menjadi class kedua yang mirip",
      d: "Tambah class strategi baru, <code>PriceCalculator</code> tidak disentuh",
    },
    answer: "d",
    explain: "OCP: \"You should be able to extend the behavior of a system without having to modify that system.\" Strategi baru adalah ekstensi (class baru + registrasi di <code>Program.cs</code>); <code>PriceCalculator</code> tertutup untuk modifikasi.",
  },
  {
    id: "0008-07", lesson: "0008", topic: "solid-lsp", type: "mc",
    prompt: "Rumusan LSP paling praktis untuk <code>IProductRepository</code> (implementasi SQL Server dan in-memory):",
    options: {
      a: "Pemakai interface tidak boleh dikejutkan oleh implementasi mana pun",
      b: "Setiap implementasi wajib mewarisi abstract class yang sama persis",
      c: "Implementasi in-memory boleh melempar exception untuk method yang sulit",
      d: "Interface hanya boleh punya satu implementasi di seluruh aplikasi",
    },
    answer: "a",
    explain: "Robert C. Martin: \"A program that uses an interface must not be confused by an implementation of that interface.\" Kalau versi SQL mengembalikan <code>null</code> untuk id yang tidak ada, versi in-memory juga harus begitu, bukan melempar exception.",
  },
  {
    id: "0008-08", lesson: "0008", topic: "solid-isp", type: "mc",
    prompt: "<code>IProductRepository</code> punya 15 method. <code>ProductReportService</code> hanya membaca data. Perbaikan sesuai ISP:",
    options: {
      a: "Biarkan saja, mock semua method di setiap test",
      b: "Gabungkan semua repository menjadi satu interface yang besar",
      c: "Pisah menjadi <code>IProductReader</code> dan <code>IProductWriter</code>, lalu injeksi seperlunya",
      d: "Ganti interface dengan class konkret agar lebih sederhana",
    },
    answer: "c",
    explain: "ISP: \"Keep interfaces small so that users don't end up depending on things they don't need.\" Konsumen read-only cukup bergantung pada <code>IProductReader</code>; class <code>ProductRepository</code> boleh mengimplementasikan keduanya. Padanan TS: prop komponen bertipe <code>Pick&lt;Store, \"products\"&gt;</code>, bukan seluruh store.",
  },
  // ---------- Latihan mengenali pelanggaran ----------
  {
    id: "0008-09", lesson: "0008", topic: "solid-violation", type: "mc",
    prompt: "Prinsip mana yang dilanggar?<pre><code>public class ProductService(IProductRepository repo)\n{\n    public Task CreateAsync(CreateProductRequest r) { /* aturan harga &amp; stok */ }\n    public string ExportToCsv(IEnumerable&lt;Product&gt; ps) { /* format kolom laporan */ }\n    public void SendLowStockEmail(Product p) { /* template HTML + SMTP */ }\n}</code></pre>",
    options: SOLID_OPTS_0008,
    answer: "a",
    explain: "SRP. Tiga alasan berubah dari tiga pihak berbeda: aturan bisnis (tim produk), format CSV (tim laporan), dan template email (tim marketing). Pecah jadi <code>ProductService</code>, <code>ProductCsvExporter</code>, dan <code>StockAlertNotifier</code>. Padanan Express: route handler gemuk yang memvalidasi, membuat CSV, dan mengirim email sekaligus.",
  },
  {
    id: "0008-10", lesson: "0008", topic: "solid-violation", type: "mc",
    prompt: "Prinsip mana yang dilanggar?<pre><code>public decimal Final(decimal price, string customerType) =&gt; customerType switch\n{\n    \"Regular\" =&gt; price,\n    \"Member\"  =&gt; price * 0.9m,\n    \"Seasonal\" =&gt; price * 0.8m,   // ditambah lagi tiap ada promo baru\n    _ =&gt; price\n};</code></pre>",
    options: SOLID_OPTS_0008,
    answer: "b",
    explain: "OCP. Setiap jenis diskon baru memaksa Anda membuka dan mengubah method yang sama. Ganti dengan <code>IDiscountStrategy</code> (Regular, Member, Seasonal) sehingga promo baru cukup berupa class baru. Padanan JS: object map <code>{ member: p =&gt; p * 0.9 }</code> yang bisa ditambah tanpa mengubah fungsi pemanggilnya.",
  },
  {
    id: "0008-11", lesson: "0008", topic: "solid-violation", type: "mc",
    prompt: "Prinsip mana yang dilanggar?<pre><code>public class ReadOnlyProductRepository : IProductRepository\n{\n    public Task&lt;Product?&gt; GetByIdAsync(int id) =&gt; /* … */;\n    public Task AddAsync(Product p) =&gt; throw new NotImplementedException();\n    public Task SaveChangesAsync()  =&gt; throw new NotImplementedException();\n}</code></pre>",
    options: SOLID_OPTS_0008,
    answer: "c",
    explain: "LSP. <code>ProductService</code> yang memakai <code>IProductRepository</code> akan \"dikejutkan\" oleh implementasi ini saat memanggil <code>AddAsync</code>. Implementasi tidak bisa menggantikan kontraknya. (Akar masalahnya sering ISP: kontraknya terlalu besar; pisahkan <code>IProductReader</code>.)",
  },
  {
    id: "0008-12", lesson: "0008", topic: "solid-violation", type: "mc",
    prompt: "Prinsip mana yang dilanggar?<pre><code>public class ProductService\n{\n    private readonly ProductRepository _repo =\n        new ProductRepository(new AppDbContext(/* connection string */));\n    // …\n}</code></pre>",
    options: SOLID_OPTS_0008,
    answer: "e",
    explain: "DIP. Service (level tinggi) bergantung langsung pada detail konkret dan membuatnya sendiri dengan <code>new</code>, jadi tidak bisa diganti mock saat unit test. Perbaikan: constructor <code>ProductService(IProductRepository repo)</code> + <code>AddScoped&lt;IProductRepository, ProductRepository&gt;()</code> di composition root.",
  },
  {
    id: "0008-13", lesson: "0008", topic: "solid-violation", type: "mc",
    prompt: "Prinsip mana yang dilanggar?<pre><code>// StockAlertJob hanya butuh GetLowStockAsync()\npublic class StockAlertJob(IProductRepository repo) { /* … */ }\n\npublic interface IProductRepository\n{\n    // 15 method: CRUD, ExportToExcel, BulkImport, RebuildIndex, …\n}</code></pre>",
    options: SOLID_OPTS_0008,
    answer: "d",
    explain: "ISP. <code>StockAlertJob</code> dipaksa bergantung pada 14 method yang tidak dipakainya; test-nya harus memahami mock untuk interface gemuk, dan setiap perubahan interface ikut menyentuhnya. Pecah menjadi interface kecil sesuai kebutuhan konsumen.",
  },
  {
    id: "0008-14", lesson: "0008", topic: "solid-violation", type: "mc",
    prompt: "Prinsip mana yang dilanggar? Kontrak <code>IProductRepository.GetByIdAsync</code>: kembalikan <code>null</code> bila id tidak ada (versi SQL Server mengikutinya).<pre><code>public class InMemoryProductRepository : IProductRepository\n{\n    public Task&lt;Product?&gt; GetByIdAsync(int id) =&gt;\n        Task.FromResult&lt;Product?&gt;(_items[id]);   // KeyNotFoundException bila id tidak ada\n}</code></pre>",
    options: SOLID_OPTS_0008,
    answer: "c",
    explain: "LSP. Signature-nya cocok, tapi perilakunya tidak: Service yang memeriksa <code>null</code> untuk mengembalikan 404 akan crash kalau memakai implementasi ini. Substitusi berarti perilaku sama terhadap kontrak, bukan sekadar compile. Perbaiki dengan <code>_items.GetValueOrDefault(id)</code>.",
  },
  // ---------- Lisan ----------
  {
    id: "0008-oral-1", lesson: "0008", topic: "solid-dip", type: "oral",
    prompt: "\"Prinsip SOLID mana yang paling sering Anda terapkan?\" Jawab dengan SRP dan DIP plus contoh dari Product Catalog, dalam 60 detik.",
    sample: "\"Paling sering SRP dan DIP, karena keduanya yang membuat kode saya bisa di-unit-test. SRP: satu class, satu alasan untuk berubah. Di Product Catalog, Controller hanya mengurus HTTP, <code>ProductService</code> memegang aturan bisnis seperti harga harus lebih dari nol, dan Repository mengurus akses data lewat EF Core. Kalau ada permintaan export CSV, saya buat class baru, bukan menambah method di Service. DIP: <code>ProductService</code> bergantung pada <code>IProductRepository</code>, bukan pada <code>AppDbContext</code> atau <code>new ProductRepository()</code>. Implementasinya didaftarkan di <code>Program.cs</code> lewat <code>AddScoped</code>, dan DI container menyuntikkannya lewat constructor. Hasilnya, di unit test saya cukup memberi mock <code>IProductRepository</code> dengan Moq, mirip <code>jest.fn()</code> di Node. Tandanya SRP mulai dilanggar biasanya constructor dengan terlalu banyak dependency.\"",
    checklist: [
      "Menyebut SRP dan DIP serta alasannya: keduanya membuat kode bisa di-unit-test",
      "SRP = satu alasan untuk berubah, dengan pembagian Controller / Service / Repository",
      "Contoh SRP konkret (mis. export CSV atau email jadi class terpisah)",
      "DIP = Service bergantung pada IProductRepository, bukan class konkret atau new",
      "Implementasi didaftarkan di Program.cs (composition root) dan diinjeksi lewat constructor",
      "Unit test memakai mock (Moq), dengan padanan jest.fn() atau gejala constructor gemuk",
    ],
  },
  {
    id: "0008-oral-2", lesson: "0008", topic: "solid-lima", type: "oral",
    prompt: "Sebutkan kelima prinsip SOLID, masing-masing dengan satu contoh dari Product Catalog, dalam 90 detik.",
    sample: "\"S, Single Responsibility: Controller hanya HTTP, Service aturan bisnis, Repository akses data. O, Open/Closed: <code>PriceCalculator</code> menerima <code>IDiscountStrategy</code>, jadi diskon baru cukup class baru tanpa mengubah calculator. L, Liskov Substitution: implementasi SQL Server dan in-memory dari <code>IProductRepository</code> harus berperilaku sama, misalnya sama-sama mengembalikan null kalau id tidak ada, bukan melempar <code>NotImplementedException</code>. I, Interface Segregation: konsumen read-only bergantung pada <code>IProductReader</code>, bukan interface gemuk berisi 15 method. D, Dependency Inversion: <code>ProductService</code> bergantung pada <code>IProductRepository</code> yang disuntikkan DI container dari <code>Program.cs</code>.\"",
    checklist: [
      "SRP dengan pembagian Controller / Service / Repository",
      "OCP dengan strategi diskon (IDiscountStrategy) tanpa mengubah PriceCalculator",
      "LSP: implementasi repository bisa saling menggantikan tanpa perilaku mengejutkan",
      "ISP: interface kecil seperti IProductReader / IProductWriter",
      "DIP: Service bergantung pada abstraksi yang diinjeksi lewat DI",
      "Kelimanya urut dan selesai dalam 90 detik tanpa melihat catatan",
    ],
  },
]);
