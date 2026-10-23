// Soal lesson 0001 · Layer & alur request. Format: assets/README.md
QuestionBank.labelTopics({
  "layer": "Layer & alur request",
  "dto": "DTO",
  "composition-root": "Interface & composition root",
});

const LAYERS_0001 = { a: "Controller", b: "Service", c: "Repository", d: "Program.cs" };

QuestionBank.register([
  // ---- Latihan 1: kode ini milik layer mana? ----
  {
    id: "0001-01", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>return product is null ? NotFound() : Ok(product);</code>",
    options: LAYERS_0001, answer: "a",
    explain: "Memilih status HTTP (404/200) adalah urusan HTTP, jadi tempatnya di Controller.",
  },
  {
    id: "0001-02", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>if (request.Price &lt;= 0) throw new ValidationException(\"Price must be greater than 0.\");</code>",
    options: LAYERS_0001, answer: "b",
    explain: "\"Harga harus &gt; 0\" adalah aturan bisnis. Aturan ini tetap berlaku walaupun pemanggilnya bukan HTTP (misalnya background job), jadi tempatnya di Service.",
  },
  {
    id: "0001-03", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>return await _db.Products.AnyAsync(p =&gt; p.Name == name);</code>",
    options: LAYERS_0001, answer: "c",
    explain: "Query langsung ke <code>DbContext</code> adalah akses data. Service cukup memanggil <code>repo.ExistsByNameAsync(name)</code>.",
  },
  {
    id: "0001-04", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>builder.Services.AddScoped&lt;IProductService, ProductService&gt;();</code>",
    options: LAYERS_0001, answer: "d",
    explain: "Menghubungkan interface ke implementasi adalah tugas composition root. Bisa dipindah ke extension method <code>AddXxx()</code>, tapi tetap dipanggil dari Program.cs.",
  },
  {
    id: "0001-05", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>[HttpPost] public async Task&lt;ActionResult&lt;ProductResponse&gt;&gt; Create(CreateProductRequest req)</code>",
    options: LAYERS_0001, answer: "a",
    explain: "Attribute <code>[HttpPost]</code> dan <code>ActionResult</code> adalah konsep HTTP. Ini action method di Controller.",
  },
  {
    id: "0001-06", lesson: "0001", topic: "layer", type: "mc",
    prompt: "\"Kalau jumlah yang diminta melebihi Stock, tolak dengan pesan error.\"",
    options: LAYERS_0001, answer: "b",
    explain: "Ini aturan bisnis tentang Stock, jadi tempatnya di Service. Repository hanya mengambil dan menyimpan angkanya.",
  },
  {
    id: "0001-07", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>builder.Services.Configure&lt;JwtSettings&gt;(builder.Configuration.GetSection(\"Jwt\"));</code>",
    options: LAYERS_0001, answer: "d",
    explain: "Ini Options Pattern: bagian <code>Jwt</code> dari appsettings di-bind ke kelas <code>JwtSettings</code> (yang tinggal di <code>Config/</code>). Registrasinya dilakukan di composition root.",
  },
  {
    id: "0001-08", lesson: "0001", topic: "layer", type: "mc",
    prompt: "<code>_db.Products.Add(product); await _db.SaveChangesAsync();</code>",
    options: LAYERS_0001, answer: "c",
    explain: "Menyimpan lewat <code>DbContext</code> adalah akses data, jadi tempatnya di Repository.",
  },
  {
    id: "0001-09", lesson: "0001", topic: "layer", type: "mc",
    prompt: "Request <code>POST /api/products</code> masuk. Urutan yang benar sampai ke database?",
    options: {
      a: "Middleware → Service → Controller → Repository → DbContext",
      b: "Middleware → Controller → Service → Repository → DbContext",
      c: "Controller → Middleware → Repository → Service → DbContext",
      d: "Middleware → Controller → Repository → Service → DbContext",
    },
    answer: "b",
    explain: "Middleware dijalankan dulu, lalu Controller (HTTP) memanggil Service (aturan bisnis), Service memanggil Repository, dan Repository memakai DbContext.",
  },

  // ---- Latihan 2: alasannya ----
  {
    id: "0001-10", lesson: "0001", topic: "layer", type: "mc",
    prompt: "Sebuah Controller langsung memakai <code>_db.Products</code> untuk menyimpan Product baru. Apa masalah utamanya?",
    options: {
      a: "Performa query EF Core jadi lambat",
      b: "Controller melewati Service, aturan bisnis terlewati",
      c: "DbContext tidak bisa dipakai di Controller",
      d: "Swagger tidak dapat membaca endpoint tersebut",
    },
    answer: "b",
    explain: "Secara teknis kode ini bisa jalan (jadi C salah). Masalahnya, validasi harga dan cek nama duplikat di Service ikut terlewati, dan Controller jadi sulit di-unit-test.",
  },
  {
    id: "0001-11", lesson: "0001", topic: "composition-root", type: "mc",
    prompt: "Di N-layer klasik tanpa interface, kenapa business logic sulit di-unit-test?",
    options: {
      a: "xUnit hanya bisa menguji method yang static",
      b: "C# tidak mendukung mocking untuk class konkret",
      c: "Controller selalu harus dijalankan lewat browser sungguhan",
      d: "Service bergantung langsung pada implementasi data access",
    },
    answer: "d",
    explain: "Dependensi compile-time mengalir dari atas ke bawah, sehingga test Service ikut menyeret database. Interface dan DI memutus rantai itu.",
  },
  {
    id: "0001-12", lesson: "0001", topic: "composition-root", type: "mc",
    prompt: "Di mana <code>IProductRepository</code> dihubungkan ke <code>ProductRepository</code>?",
    options: {
      a: "Di Program.cs, yaitu composition root aplikasi",
      b: "Di constructor Controller lewat keyword new",
      c: "Di file appsettings.json bagian ConnectionStrings utama",
      d: "Di DbContext melalui method OnModelCreating otomatis",
    },
    answer: "a",
    explain: "Composition root. Memakai <code>new</code> di constructor justru bertentangan dengan DI. <code>OnModelCreating</code> mengatur pemetaan tabel, bukan DI.",
  },
  {
    id: "0001-13", lesson: "0001", topic: "composition-root", type: "mc",
    prompt: "Constructor <code>ProductService</code> berisi <code>_repo = new ProductRepository(new AppDbContext());</code>. Apa akibat utamanya?",
    options: {
      a: "Kode gagal compile karena constructor salah",
      b: "Query database dijalankan dua kali berturut-turut",
      c: "Service sulit di-unit-test tanpa database sungguhan",
      d: "Repository otomatis menjadi Singleton di aplikasi",
    },
    answer: "c",
    explain: "Kode ini bisa di-compile. Masalahnya, Service membuat dependensinya sendiri, jadi tidak bisa diganti dengan Mock saat test. Minta <code>IProductRepository</code> lewat constructor, lalu daftarkan di Program.cs.",
  },
  {
    id: "0001-14", lesson: "0001", topic: "dto", type: "mc",
    prompt: "Kenapa API mengembalikan DTO, bukan Entity secara langsung?",
    options: {
      a: "Entity tidak bisa diserialisasi menjadi JSON",
      b: "DTO membuat query database lebih cepat",
      c: "Kontrak API terlepas dari skema database",
      d: "ASP.NET Core mewajibkan DTO di Controller",
    },
    answer: "c",
    explain: "Dengan DTO, kolom baru di tabel tidak otomatis bocor ke API, dan property yang tidak boleh dilihat client bisa disembunyikan. Entity sebenarnya bisa diserialisasi, tapi berisiko circular reference.",
  },
  {
    id: "0001-15", lesson: "0001", topic: "dto", type: "mc",
    prompt: "Client mengirim JSON berisi <code>Id</code> dan <code>IsAdmin</code>, padahal keduanya tidak boleh diisi client. Apa yang mencegah over-posting ini?",
    options: {
      a: "DTO request yang hanya berisi field boleh",
      b: "Entity dengan atribut Required pada semua property",
      c: "Repository yang memvalidasi setiap kolom sebelum disimpan",
      d: "Middleware yang menghapus semua body request POST",
    },
    answer: "a",
    explain: "Kalau action menerima <code>CreateProductRequest</code> yang tidak punya <code>Id</code>/<code>IsAdmin</code>, field itu tidak pernah ter-bind. Microsoft menyebut \"Prevent over-posting\" sebagai salah satu alasan memakai DTO.",
  },

  // ---- Latihan 3: lisan 60 detik ----
  {
    id: "0001-oral-1", lesson: "0001", topic: "layer", type: "oral",
    prompt: "Dalam 60 detik: \"Bagaimana Anda menstruktur project ASP.NET Core Web API, dan kenapa?\"",
    sample:
      "\"Untuk API kecil sampai menengah saya pakai layered architecture dalam satu project. " +
      "<strong>Controller</strong> hanya mengurus HTTP: binding request, memanggil Service, dan memilih status code. " +
      "<strong>Service</strong> berisi aturan bisnis. <strong>Repository</strong> membungkus akses data lewat EF Core <code>DbContext</code>. " +
      "Data keluar-masuk API lewat <strong>DTO</strong>, jadi skema database tidak bocor dan over-posting tercegah. " +
      "Setiap layer bergantung pada <strong>interface</strong>, dan semuanya didaftarkan di <code>Program.cs</code> sebagai composition root, " +
      "sehingga Service bisa di-unit-test dengan Mock repository. Konfigurasi dibaca dari <code>appsettings.json</code> lewat Options Pattern. " +
      "Kalau domainnya makin kompleks, saya pecah menjadi Clean Architecture dengan beberapa project.\"",
    checklist: [
      "Tanggung jawab Controller, Service, dan Repository masing-masing",
      "DTO beserta alasannya (skema DB tidak bocor / over-posting)",
      "Interface + DI + composition root (Program.cs)",
      "Manfaatnya untuk testing (Service di-unit-test dengan Mock)",
      "Konfigurasi lewat Options Pattern",
      "Trade-off: kapan memilih struktur lain (mis. Clean Architecture)",
    ],
  },
]);
