// Soal lesson 0009 · Red-Green-Refactor. Format: assets/README.md.
QuestionBank.labelTopics({
  "tdd-siklus": "TDD: siklus Red-Green-Refactor",
  "tdd-red": "TDD: kenapa test harus gagal dulu",
  "tdd-aaa": "TDD: pola Arrange-Act-Assert",
  "tdd-naming": "TDD: penamaan test dan [Fact]/[Theory]",
});

QuestionBank.register([
  // ---------- Siklus ----------
  {
    id: "0009-01", lesson: "0009", topic: "tdd-siklus", type: "mc",
    prompt: "Martin Fowler: \"The most common way that I hear to screw up TDD is…\"",
    options: {
      a: "menulis test sebelum kode produksi ada",
      b: "melewatkan tahap refactor setelah test hijau",
      c: "memakai <code>[Theory]</code> untuk banyak input sekaligus",
      d: "menjalankan test terlalu sering saat coding",
    },
    answer: "b",
    explain: "\"…neglecting the third step.\" Langkah ketiga adalah refactor: \"Refactor both new and old code to make it well structured.\" Tanpa refactor, kode hasil green yang \"jelek\" menumpuk.",
  },
  {
    id: "0009-02", lesson: "0009", topic: "tdd-siklus", type: "mc",
    prompt: "Di tahap <strong>Green</strong>, kode produksi yang Anda tulis sebaiknya…",
    options: {
      a: "sudah rapi dan siap untuk production",
      b: "mencakup semua aturan validasi Product sekaligus",
      c: "diekstrak ke method private sejak awal",
      d: "paling sederhana yang membuat test lulus",
    },
    answer: "d",
    explain: "Tutorial xUnit Microsoft: \"write only enough code so this test passes.\" Merapikan (ekstrak method, ganti nama) adalah urusan tahap Refactor, setelah semua test hijau.",
  },
  {
    id: "0009-03", lesson: "0009", topic: "tdd-siklus", type: "mc",
    prompt: "Saat membuat test harga lulus, Anda sekaligus mengganti nama variabel dan mengekstrak <code>ValidateAsync</code>. Kent Beck menyebut ini kesalahan apa?",
    options: {
      a: "mencampur refactor ke dalam tahap green",
      b: "menulis test tanpa assertion sama sekali",
      c: "membuat test list terlalu panjang sekali",
      d: "memakai mock untuk dependency repository produk",
    },
    answer: "a",
    explain: "Beck (Canon TDD): \"Mistake: mixing refactoring into making the test pass.\" Satu topi per waktu: buat lulus dulu, baru rapikan dengan semua test tetap hijau.",
  },
  {
    id: "0009-04", lesson: "0009", topic: "tdd-siklus", type: "mc",
    prompt: "Anda menulis enam test (harga, stok, nama duplikat, …) sekaligus, baru kemudian mulai implementasi. Menurut Kent Beck?",
    options: {
      a: "Benar, karena semua perilaku sudah tercatat rapi",
      b: "Benar, asalkan semua test ditulis memakai <code>[Theory]</code>",
      c: "Salah, ubah satu item list per siklus",
      d: "Salah, test harus ditulis setelah implementasi selesai",
    },
    answer: "c",
    explain: "Beck: \"Turn exactly one item on the list into an actual, concrete, runnable test.\" Mengubah semua item jadi test dulu adalah kesalahan yang ia sebut sendiri: \"What happens when you get to test #6 &amp; you haven't seen anything pass yet?\" Daftar perilakunya (test list) boleh lengkap; test-nya ditulis satu per satu.",
  },
  // ---------- Kenapa red dulu ----------
  {
    id: "0009-05", lesson: "0009", topic: "tdd-red", type: "mc",
    prompt: "Pewawancara: \"Kenapa test harus terlihat gagal dulu sebelum Anda menulis kodenya?\"",
    options: {
      a: "Supaya laporan coverage naik lebih cepat dari biasanya",
      b: "Membuktikan test benar-benar bisa mendeteksi perilaku yang hilang",
      c: "Karena xUnit menolak test yang langsung lulus pertama",
      d: "Supaya pipeline CI tetap merah sampai fitur rampung",
    },
    answer: "b",
    explain: "Test yang belum pernah merah bisa saja selalu hijau (assertion hilang, method yang salah dipanggil). Microsoft: \"With TDD, you write a test that's known to fail. Then you update the target code to make the test pass.\" Merahnya membuktikan test itu peka terhadap perilaku yang sedang Anda tambahkan.",
  },
  {
    id: "0009-06", lesson: "0009", topic: "tdd-red", type: "mc",
    prompt: "Test harga yang baru Anda tulis langsung <strong>hijau</strong> pada run pertama, padahal validasi harga belum ditulis. Apa artinya?",
    options: {
      a: "Bagus, berarti tahap red boleh dilewati kali ini",
      b: "Kode produksi pasti sudah benar sejak awal ditulis",
      c: "xUnit sedang meng-cache hasil test dari run sebelumnya",
      d: "Test kemungkinan salah, misalnya assertion hilang atau keliru",
    },
    answer: "d",
    explain: "Perilakunya belum ada, jadi test yang benar seharusnya gagal. Kalau hijau, test-nya yang dicurigai. Beck menyebut contoh test palsu: \"write tests without assertions\" dan \"delete assertions so the test pretends to pass.\"",
  },
  {
    id: "0009-07", lesson: "0009", topic: "tdd-red", type: "mc",
    prompt: "Test harga Anda merah, tapi penyebabnya <code>NullReferenceException</code> di bagian Arrange, bukan karena <code>ValidationException</code> tidak dilempar. Langkah yang tepat?",
    options: {
      a: "Perbaiki test dulu sampai gagal karena alasan benar",
      b: "Lanjut ke green, yang penting test sudah merah",
      c: "Hapus assertion supaya test bisa cepat jadi hijau",
      d: "Tambahkan try-catch di test untuk menelan exception itu",
    },
    answer: "a",
    explain: "Merah karena setup rusak tidak membuktikan apa pun tentang aturan harga. Test harus gagal <em>karena perilaku yang belum ada</em> (pesan xUnit: tidak ada exception yang dilempar), baru Anda boleh pindah ke green.",
  },
  // ---------- Arrange-Act-Assert ----------
  {
    id: "0009-08", lesson: "0009", topic: "tdd-aaa", type: "mc",
    prompt: "Dalam pola Arrange-Act-Assert, bagian <strong>Act</strong> berisi…",
    options: {
      a: "pembuatan mock repository dan objek request",
      b: "pengecekan hasil dengan Assert dan Verify",
      c: "satu pemanggilan method yang sedang diuji",
      d: "pembersihan data setelah test selesai berjalan",
    },
    answer: "c",
    explain: "Microsoft: \"Arrange your objects, create, and configure them as necessary · Act on an object · Assert that something is as expected.\" Di contoh kita, Act = <code>_sut.CreateAsync(request)</code>; mock dan request ada di Arrange, <code>Assert</code>/<code>Verify</code> di Assert.",
  },
  {
    id: "0009-09", lesson: "0009", topic: "tdd-aaa", type: "mc",
    prompt: "Satu test memanggil <code>CreateAsync</code> dua kali (harga 0, lalu harga -10) dan meng-assert keduanya. Saran Microsoft?",
    options: {
      a: "Biarkan, dua Act dalam satu test lebih ringkas",
      b: "Pecah jadi <code>[Theory]</code> dengan satu Act per test",
      c: "Tambahkan loop for supaya input bisa lebih banyak",
      d: "Pindahkan kedua Act ke constructor class test itu",
    },
    answer: "b",
    explain: "\"Avoid multiple Act tasks\": dengan satu Act, \"You can easily discern which Act task is failing if the test fails.\" Caranya: test terpisah atau parameterized test (<code>[Theory]</code> + <code>[InlineData]</code>). Loop di dalam test juga dihindari: \"Avoid coding logic in unit tests.\"",
  },
  {
    id: "0009-10", lesson: "0009", topic: "tdd-aaa", type: "mc",
    prompt: "Apa keuntungan utama memisahkan Arrange, Act, dan Assert menurut Microsoft?",
    options: {
      a: "Test berjalan lebih cepat karena tiap bagian dikompilasi terpisah",
      b: "Coverage otomatis naik karena setiap baris kode pasti tersentuh",
      c: "xUnit mewajibkan komentar Arrange, Act, dan Assert di test",
      d: "Jelas apa yang diuji, terpisah dari persiapan dan pengecekan",
    },
    answer: "d",
    explain: "\"You can clearly separate what is being tested from the Arrange and Assert tasks.\" Dan: \"Readability is one of the most important aspects when writing a unit test.\" Komentar <code>// Arrange</code> tidak diwajibkan xUnit; itu konvensi keterbacaan.",
  },
  // ---------- Penamaan dan [Fact]/[Theory] ----------
  {
    id: "0009-11", lesson: "0009", topic: "tdd-naming", type: "mc",
    prompt: "Nama test mana yang mengikuti standar Microsoft (method, skenario, perilaku yang diharapkan)?",
    options: {
      a: "<code>CreateAsync_PriceNotPositive_ThrowsValidationException</code>",
      b: "<code>Test1</code>",
      c: "<code>ShouldWork_Create</code>",
      d: "<code>ProductServiceTest_Price</code>",
    },
    answer: "a",
    explain: "Tiga bagian: \"Name of the method being tested · Scenario under which the method is being tested · Expected behavior when the scenario is invoked.\" Jadi <code>CreateAsync</code> _ <code>PriceNotPositive</code> _ <code>ThrowsValidationException</code>.",
  },
  {
    id: "0009-12", lesson: "0009", topic: "tdd-naming", type: "mc",
    prompt: "Kenapa standar penamaan test penting, menurut Microsoft?",
    options: {
      a: "xUnit menjalankan test berurutan berdasarkan abjad dari nama method",
      b: "Nama panjang membuat coverage report terlihat lebih lengkap sekali",
      c: "Saat gagal, langsung terlihat skenario mana yang tidak terpenuhi",
      d: "Compiler C# menolak nama method test yang tanpa underscore",
    },
    answer: "c",
    explain: "\"Tests are more than just making sure your code works. They also provide documentation.\" Dan: \"when tests fail, you can see exactly which scenarios don't meet your expectations.\" Nama test tidak memengaruhi compiler maupun urutan eksekusi.",
  },
  {
    id: "0009-13", lesson: "0009", topic: "tdd-naming", type: "mc",
    prompt: "Padanan <code>[Theory]</code> + <code>[InlineData(0)]</code> + <code>[InlineData(-10)]</code> di Jest adalah…",
    options: {
      a: "<code>jest.fn()</code>",
      b: "<code>test.each</code>",
      c: "<code>beforeEach</code>",
      d: "<code>expect.assertions</code>",
    },
    answer: "b",
    explain: "Microsoft: \"<code>[Theory]</code> represents a suite of tests that execute the same code but have different input arguments\", dengan <code>[InlineData]</code> sebagai nilainya. Jest: \"<code>test.each</code> allows you to write the test once and pass data in.\" <code>[Fact]</code> = satu <code>test()</code> biasa.",
  },
  // ---------- Lisan ----------
  {
    id: "0009-oral-1", lesson: "0009", topic: "tdd-red", type: "oral",
    prompt: "Jelaskan red-green-refactor dalam 60 detik. Kenapa test harus terlihat gagal dulu?",
    sample: "\"Red-green-refactor adalah siklus TDD. Red: saya tulis satu test kecil untuk satu perilaku yang belum ada, misalnya <code>CreateAsync_PriceNotPositive_ThrowsValidationException</code>, lalu jalankan dan lihat test itu gagal. Green: saya tulis kode paling sederhana supaya test itu dan semua test lama lulus, misalnya satu <code>if (request.Price &lt;= 0) throw</code>. Refactor: saya rapikan kode, misalnya mengekstrak <code>ValidateAsync</code>, dengan test tetap hijau; tahap ini yang paling sering dilewati orang. Lalu ulangi untuk perilaku berikutnya. Test harus merah dulu karena itu bukti test-nya bisa mendeteksi perilaku yang hilang; test yang tidak pernah gagal bisa saja tidak menguji apa-apa, misalnya assertion-nya terlupa. Gagalnya juga harus karena alasan yang benar, bukan karena setup rusak. Di Node polanya sama dengan <code>jest --watch</code>: lihat merah, baru tulis kodenya.\"",
    checklist: [
      "Red: satu test kecil untuk perilaku yang belum ada, dijalankan dan gagal",
      "Green: kode paling sederhana sampai test ini dan test lama lulus",
      "Refactor: rapikan kode dengan semua test tetap hijau (dan jangan dilewati)",
      "Ulangi satu perilaku per siklus, dengan contoh konkret dari Product",
      "Gagal dulu membuktikan test bisa mendeteksi perilaku yang hilang (bukan selalu hijau)",
      "Gagal karena alasan yang benar, bukan setup rusak atau error compile",
    ],
  },
  {
    id: "0009-oral-2", lesson: "0009", topic: "tdd-siklus", type: "oral",
    prompt: "Demokan satu siklus TDD untuk aturan \"harga Product harus lebih dari 0\": nama test, isi Arrange-Act-Assert, kode green, dan apa yang di-refactor.",
    sample: "\"Nama test: <code>CreateAsync_PriceNotPositive_ThrowsValidationException</code>, sebuah <code>[Theory]</code> dengan <code>[InlineData(0)]</code> dan <code>[InlineData(-10)]</code>. Arrange: mock <code>IProductRepository</code> dengan Moq dan request dengan harga dari parameter. Act: panggil <code>CreateAsync(request)</code> sekali. Assert: <code>Assert.ThrowsAsync&lt;ValidationException&gt;</code>, lalu <code>Verify</code> bahwa <code>AddAsync</code> tidak pernah dipanggil. Saya jalankan <code>dotnet test</code>: merah karena tidak ada exception. Green: satu baris <code>if (request.Price &lt;= 0) throw new ValidationException(...)</code>. Setelah aturan Stock dan nama duplikat menyusul, saya refactor: ketiga <code>if</code> diekstrak ke <code>ValidateAsync</code>, lalu test dijalankan lagi dan tetap hijau.\"",
    checklist: [
      "nama test tiga bagian: Method_Scenario_ExpectedResult",
      "[Theory] + [InlineData] untuk 0 dan angka negatif",
      "Arrange (mock repository + request), Act (satu panggilan CreateAsync), Assert (ThrowsAsync)",
      "Verify bahwa AddAsync tidak dipanggil (Times.Never)",
      "menyebut test dijalankan dan merah sebelum menulis kode green",
      "refactor konkret (ekstrak ValidateAsync) dengan test tetap hijau",
    ],
  },
]);
