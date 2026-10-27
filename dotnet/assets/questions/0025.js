// Soal lesson 0025 · LINQ untuk live coding. Format: assets/README.md.
QuestionBank.labelTopics({
  "linq-operator": "Operator LINQ inti (Where/Select/SelectMany/OrderBy)",
  "linq-single": "First vs Single vs …OrDefault",
  "linq-groupby": "GroupBy, Join, top-N per grup",
  "linq-ef-translate": "LINQ yang bisa/tidak bisa diterjemahkan EF Core",
  "linq-multiple-enum": "Multiple enumeration",
});

QuestionBank.register([
  {
    id: "0025-01", lesson: "0025", topic: "linq-operator", type: "mc",
    prompt: "Setiap <code>Category</code> punya <code>List&lt;Product&gt; Products</code>. Anda butuh <em>satu</em> daftar datar berisi semua Product dari semua Category. Operator mana?",
    options: {
      a: "<code>Select</code>, hasilnya list berisi list",
      b: "<code>SelectMany</code>, padanan <code>flatMap</code> di TS",
      c: "<code>GroupBy</code>, dikelompokkan per Category lagi",
      d: "<code>Join</code>, menggabungkan dua tabel berbeda",
    },
    answer: "b",
    explain: "<code>Select</code> menghasilkan satu nilai per elemen, jadi <code>categories.Select(c =&gt; c.Products)</code> bertipe <code>IEnumerable&lt;List&lt;Product&gt;&gt;</code>. <code>SelectMany</code> memproyeksikan sequence per elemen lalu \"flattens them into one sequence\", persis <code>flatMap</code> di TS.",
  },
  {
    id: "0025-02", lesson: "0025", topic: "linq-operator", type: "mc",
    prompt: "Urutkan Product berdasarkan <code>CategoryId</code>, lalu di dalam tiap Category dari <code>Price</code> termahal. Rantai operator mana?",
    options: {
      a: "<code>OrderBy</code> dua kali berturut-turut",
      b: "<code>OrderByDescending</code> lalu <code>OrderBy</code> saja",
      c: "<code>GroupBy</code> lalu <code>Max</code> saja",
      d: "<code>OrderBy</code> lalu <code>ThenByDescending</code> berantai",
    },
    answer: "d",
    explain: "Kunci kedua ditulis dengan <code>ThenBy</code>/<code>ThenByDescending</code>: <code>.OrderBy(p =&gt; p.CategoryId).ThenByDescending(p =&gt; p.Price)</code>. <code>OrderBy</code> kedua mengurutkan ulang seluruh sequence, sehingga kunci utamanya berganti menjadi kunci kedua itu.",
  },
  {
    id: "0025-03", lesson: "0025", topic: "linq-single", type: "mc",
    prompt: "Endpoint <code>GET /products/{id}</code>. <code>Id</code> adalah primary key; kalau tidak ditemukan, Controller mengembalikan 404. Pilihan paling tepat?",
    options: {
      a: "<code>SingleOrDefault</code>, lalu cek <code>null</code>",
      b: "<code>Single</code>, lalu tangkap exception-nya",
      c: "<code>First</code>, lalu cek <code>null</code>",
      d: "<code>Where</code>, lalu ambil <code>[0]</code>",
    },
    answer: "a",
    explain: "<code>SingleOrDefault</code> mengembalikan <code>default</code> (null untuk reference type) kalau tidak ada, dan melempar exception kalau ternyata lebih dari satu, cocok untuk primary key. <code>First</code> tidak pernah mengembalikan null: ia melempar exception kalau kosong. Memakai exception untuk alur 404 biasa (<code>Single</code> + catch) juga tidak disarankan.",
  },
  {
    id: "0025-04", lesson: "0025", topic: "linq-single", type: "mc",
    prompt: "<code>products.First(p =&gt; p.Stock &gt; 1000)</code>, padahal tidak ada Product dengan Stock di atas 1000. Apa yang terjadi?",
    options: {
      a: "Mengembalikan <code>null</code> tanpa error apa pun",
      b: "Mengembalikan Product pertama di dalam list",
      c: "Melempar <code>InvalidOperationException</code> karena tidak ada elemen",
      d: "Mengembalikan Product baru dengan nilai default",
    },
    answer: "c",
    explain: "Dokumentasi <code>First</code>: <code>InvalidOperationException</code> kalau \"No element satisfies the condition in predicate\". Kalau kosong itu wajar, pakai <code>FirstOrDefault</code>, yang mengembalikan <code>default(TSource)</code> (null untuk reference type).",
  },
  {
    id: "0025-05", lesson: "0025", topic: "linq-groupby", type: "mc",
    prompt: "Setiap elemen hasil <code>products.GroupBy(p =&gt; p.CategoryId)</code> bertipe apa, dan bagaimana mengambil kunci grupnya?",
    options: {
      a: "<code>Dictionary</code>; kunci lewat <code>.Keys</code>",
      b: "<code>List&lt;Product&gt;</code>; kunci lewat <code>.Id</code>",
      c: "<code>ILookup</code>; kunci lewat <code>.Index</code>",
      d: "<code>IGrouping</code>; kunci lewat <code>.Key</code>",
    },
    answer: "d",
    explain: "Hasilnya <code>IEnumerable&lt;IGrouping&lt;int, Product&gt;&gt;</code>. Setiap <code>IGrouping</code> punya <code>.Key</code> (di sini <code>CategoryId</code>) dan sekaligus merupakan <code>IEnumerable&lt;Product&gt;</code>, jadi bisa langsung di-<code>OrderBy</code>, <code>Count</code>, atau <code>Sum</code>.",
  },
  {
    id: "0025-06", lesson: "0025", topic: "linq-groupby", type: "mc",
    prompt: "Top-3 Product termahal per Category: <code>products.GroupBy(p =&gt; p.CategoryId).Select(g =&gt; …)</code>. Isi <code>…</code> yang benar?",
    options: {
      a: "<code>g.OrderBy(p =&gt; p.Price).Take(3)</code>",
      b: "<code>g.OrderByDescending(p =&gt; p.Price).Take(3)</code>",
      c: "<code>g.Take(3).OrderByDescending(p =&gt; p.Price)</code>",
      d: "<code>g.MaxBy(p =&gt; p.Price).Take(3)</code>",
    },
    answer: "b",
    explain: "Urutkan dulu dari termahal, baru ambil 3. Opsi a mengambil 3 termurah. Opsi c mengambil 3 elemen pertama sesuai urutan asal, belum tentu yang termahal, lalu mengurutkannya. <code>MaxBy</code> mengembalikan satu elemen, bukan sequence, jadi opsi d tidak bisa dikompilasi.",
  },
  {
    id: "0025-07", lesson: "0025", topic: "linq-ef-translate", type: "mc",
    prompt: "<code>await _db.Products.Where(p =&gt; FormatNama(p.Name).Contains(\"pro\")).ToListAsync()</code>, dengan <code>FormatNama</code> method C# biasa milik Anda. Apa yang terjadi di EF Core 8?",
    options: {
      a: "Filter jalan di database seperti biasa",
      b: "Semua baris ditarik, lalu difilter memori",
      c: "Exception saat runtime: query tidak diterjemahkan",
      d: "Compiler menolak; kode tidak bisa di-build",
    },
    answer: "c",
    explain: "EF Core tidak tahu isi <code>FormatNama</code>, jadi tidak bisa menerjemahkannya ke SQL. Di luar top-level projection, EF Core \"throws a runtime exception\". Opsi b adalah perilaku sebelum EF Core 3.0. Sekarang Anda harus memilih client evaluation secara eksplisit (<code>AsEnumerable</code>/<code>ToList</code>), atau menulis ulang filter dengan operator yang bisa diterjemahkan.",
  },
  {
    id: "0025-08", lesson: "0025", topic: "linq-ef-translate", type: "mc",
    prompt: "Di bagian query EF Core mana Anda <em>boleh</em> memanggil method C# biasa (mis. <code>FormatNama</code>) dan query tetap jalan?",
    options: {
      a: "Di <code>Select</code> terakhir (top-level projection)",
      b: "Di <code>Where</code> sebelum <code>ToListAsync</code> dipanggil",
      c: "Di <code>OrderBy</code> untuk mengurutkan hasil",
      d: "Di kunci <code>GroupBy</code> sebelum agregat",
    },
    answer: "a",
    explain: "\"EF Core supports partial client evaluation in the top-level projection (essentially, the last call to Select())\". Data diambil dengan SQL, lalu method dijalankan di .NET untuk setiap baris hasil. Di <code>Where</code>, <code>OrderBy</code>, atau <code>GroupBy</code>, ekspresi yang tidak bisa diterjemahkan menyebabkan exception.",
  },
  {
    id: "0025-09", lesson: "0025", topic: "linq-multiple-enum", type: "mc",
    prompt: "<code>var mahal = _db.Products.Where(p =&gt; p.Price &gt; 1000000);</code> lalu <code>var n = mahal.Count();</code> lalu <code>foreach (var p in mahal) { … }</code>. Berapa kali query dikirim ke database?",
    options: {
      a: "Satu kali, hasil pertama di-cache",
      b: "Dua kali, satu per enumerasi",
      c: "Nol kali, karena belum di-await",
      d: "Satu kali, saat baris pertama",
    },
    answer: "b",
    explain: "<code>mahal</code> hanya definisi query (deferred execution). <code>Count()</code> mengeksekusinya sekali, <code>foreach</code> sekali lagi. Hasil enumerasi \"is not calculated once and cached\" (CA1851). Kalau sumbernya database, setiap enumerasi berarti satu round-trip.",
  },
  {
    id: "0025-10", lesson: "0025", topic: "linq-multiple-enum", type: "mc",
    prompt: "Query yang sama, <code>_db.Products.Where(p =&gt; p.Price &gt; 1000000)</code>, dipakai untuk <code>Count()</code> lalu <code>foreach</code>. Cara paling sederhana supaya database hanya dipanggil sekali?",
    options: {
      a: "Ganti <code>var</code> menjadi <code>IEnumerable</code>",
      b: "Panggil <code>AsEnumerable()</code> sebelum <code>Count</code>",
      c: "Tambahkan <code>AsNoTracking()</code> pada query",
      d: "Materialisasi sekali dengan <code>ToListAsync</code>",
    },
    answer: "d",
    explain: "Materialisasi sekali (<code>var list = await q.ToListAsync();</code>), lalu pakai <code>list.Count</code> dan <code>foreach (var p in list)</code>. EF Core: \"if you're enumerating multiple times, then storing results in a list helps more since there's only one query to the database\". <code>AsEnumerable</code> hanya melakukan streaming, jadi setiap enumerasi tetap mengirim query.",
  },
  {
    id: "0025-oral-1", lesson: "0025", topic: "linq-groupby", type: "oral",
    prompt: "Tulis LINQ untuk 3 Product termahal per Category (tampilkan nama Category), lalu jelaskan setiap bagiannya. (90 detik, tulis dulu di kertas)",
    sample: "<pre><code>var nama = categories.ToDictionary(c =&gt; c.Id, c =&gt; c.Name);\nvar top3 = products\n    .GroupBy(p =&gt; p.CategoryId)\n    .Select(g =&gt; new {\n        Category = nama[g.Key],\n        Top = g.OrderByDescending(p =&gt; p.Price).Take(3).ToList()\n    });</code></pre>" +
      "\"<code>GroupBy</code> membuat satu <code>IGrouping</code> per CategoryId; <code>Key</code>-nya CategoryId. Di dalam setiap grup saya urutkan dari Price termahal lalu <code>Take(3)</code>, jadi urutannya harus OrderByDescending dulu baru Take. " +
      "Nama Category saya ambil lewat dictionary sekali jalan, bukan query per Category di dalam loop. Di SQL ini setara <code>ROW_NUMBER() OVER (PARTITION BY CategoryId ORDER BY Price DESC)</code>. " +
      "Kalau sumbernya EF Core, query tetap <code>IQueryable</code> sampai <code>ToListAsync</code>, dan sejak EF Core 6 pola top-N per grup ini diterjemahkan ke SQL dengan ROW_NUMBER.\"",
    checklist: [
      "<code>GroupBy</code> per CategoryId, hasilnya <code>IGrouping</code> dengan <code>.Key</code>",
      "di dalam grup: <code>OrderByDescending(Price)</code> dulu, baru <code>Take(3)</code>",
      "nama Category lewat dictionary/Join/navigation, bukan query per Category di loop",
      "kode yang ditulis benar sintaksnya (lambda, <code>new { … }</code>, kurung)",
      "padanan SQL: <code>ROW_NUMBER() OVER (PARTITION BY … ORDER BY … DESC)</code>",
      "di EF Core: tetap <code>IQueryable</code> sampai <code>ToListAsync</code>; EF Core 6+ menerjemahkan top-N per grup",
    ],
  },
  {
    id: "0025-oral-2", lesson: "0025", topic: "linq-single", type: "oral",
    prompt: "Apa beda <code>First</code>, <code>FirstOrDefault</code>, <code>Single</code>, dan <code>SingleOrDefault</code>? Kapan Anda memakai masing-masing? (60 detik)",
    sample: "\"<code>First</code> mengambil elemen pertama yang cocok dan melempar <code>InvalidOperationException</code> kalau tidak ada. <code>FirstOrDefault</code> sama, tapi mengembalikan default, yaitu null untuk reference type; itu padanan <code>array.find</code>. " +
      "<code>Single</code> menegaskan harus tepat satu: exception kalau nol <em>atau</em> lebih dari satu. <code>SingleOrDefault</code> mengembalikan default kalau nol, tapi tetap exception kalau lebih dari satu. " +
      "Untuk cari berdasarkan primary key saya pakai <code>SingleOrDefault</code> lalu cek null untuk 404; untuk 'ambil satu dari banyak', misalnya Product termahal, <code>OrderByDescending</code> lalu <code>FirstOrDefault</code>. " +
      "Keempatnya mengeksekusi query saat itu juga, bukan deferred; di EF Core saya pakai versi async-nya seperti <code>FirstOrDefaultAsync</code>.\"",
    checklist: [
      "<code>First</code>: elemen pertama yang cocok; exception kalau tidak ada",
      "<code>FirstOrDefault</code>: default (null untuk reference type) kalau tidak ada; padanan <code>array.find</code>",
      "<code>Single</code>: harus tepat satu; exception kalau nol atau lebih dari satu",
      "<code>SingleOrDefault</code>: default kalau nol, tetap exception kalau lebih dari satu",
      "contoh kapan memakai: primary key → Single(OrDefault); satu dari banyak → OrderBy + First(OrDefault)",
      "mengeksekusi langsung (bukan deferred); di EF Core pakai versi async (<code>FirstOrDefaultAsync</code>)",
    ],
  },
]);
