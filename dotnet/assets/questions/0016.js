// Soal lesson 0016: Reactive Forms, HttpClient, dan HTTP Interceptor. Lihat assets/README.md.
QuestionBank.labelTopics({
  "ng-forms": "Reactive vs template-driven forms",
  "ng-http": "HttpClient & Observable",
  "ng-interceptor": "HTTP Interceptor",
});

// Urutan registrasi diselang-seling antar topik (interleaving) dan posisi jawaban bervariasi.
// Lesson merender ng-forms di Latihan 1, ng-http + ng-interceptor di Latihan 2.
QuestionBank.register([
  {
    id: "0016-01", lesson: "0016", topic: "ng-forms", type: "mc",
    prompt: "Di Reactive Forms, di mana form model (<code>FormGroup</code> / <code>FormControl</code>) dibuat?",
    options: {
      a: "Implisit oleh directive ngModel di template",
      b: "Otomatis oleh HttpClient dari response API",
      c: "Eksplisit di class component oleh developer",
      d: "Di NgModule lewat array providers module",
    },
    answer: "c",
    explain: "Reactive Forms: \"Explicit, created in component class\". Template-driven: \"Implicit, created by directives\" (<code>NgModel</code> membuat <code>FormControl</code> di balik layar). Padanan React: controlled input dengan state yang Anda pegang sendiri.",
  },
  {
    id: "0016-02", lesson: "0016", topic: "ng-http", type: "mc",
    prompt: "<code>this.http.get&lt;Product[]&gt;('/api/products')</code> mengembalikan apa?",
    options: {
      a: "Observable yang baru request saat subscribe",
      b: "Promise yang langsung mengirim request HTTP",
      c: "Array Product yang sudah diparsing sinkron",
      d: "Subject yang menyimpan response terakhir otomatis",
    },
    answer: "a",
    explain: "\"The <code>HttpClient</code> service makes use of observables for all transactions\", dan request baru dimulai saat <code>subscribe()</code> dipanggil (lesson 0015). Beda dengan <code>fetch</code>/Axios yang mengembalikan Promise dan langsung jalan.",
  },
  {
    id: "0016-03", lesson: "0016", topic: "ng-interceptor", type: "mc",
    prompt: "Kenapa interceptor memakai <code>req.clone({ setHeaders: { Authorization: token } })</code>, bukan mengubah <code>req</code> langsung?",
    options: {
      a: "Clone membuat request terkirim jauh lebih cepat",
      b: "HttpRequest immutable; retry harus memakai request asli",
      c: "Header hanya boleh diubah oleh HttpBackend saja",
      d: "Tanpa clone, interceptor berikutnya tidak akan dipanggil",
    },
    answer: "b",
    explain: "Property <code>HttpRequest</code> itu <code>readonly</code>. Alasannya: request bisa di-retry, dan \"Immutability ensures that interceptors see the same request for each try.\" Jadi clone dulu, ubah clone-nya, lalu kirim ke <code>next.handle()</code>.",
  },
  {
    id: "0016-04", lesson: "0016", topic: "ng-forms", type: "mc",
    prompt: "Bagaimana alur data (data flow) antara view dan form model di kedua pendekatan?",
    options: {
      a: "Reactive sinkron, template-driven asinkron",
      b: "Reactive asinkron, template-driven sinkron",
      c: "Keduanya sinkron tanpa perbedaan",
      d: "Keduanya asinkron tanpa perbedaan",
    },
    answer: "a",
    explain: "Tabel resmi: Reactive = \"Synchronous\", template-driven = \"Asynchronous\". Di template-driven, <code>NgModel</code> mengantre update <code>FormControl</code> ke tick berikutnya, sehingga test-nya butuh <code>fixture.detectChanges()</code> dan <code>tick()</code>.",
  },
  {
    id: "0016-05", lesson: "0016", topic: "ng-http", type: "mc",
    prompt: "Apa arti <code>&lt;Product[]&gt;</code> pada <code>http.get&lt;Product[]&gt;(url)</code>?",
    options: {
      a: "Angular memvalidasi bentuk response saat runtime",
      b: "Server dipaksa mengirim JSON berbentuk Product",
      c: "Response otomatis diubah menjadi instance class",
      d: "Hanya type assertion TypeScript saat compile",
    },
    answer: "d",
    explain: "\"This is a build-time check and doesn't guarantee that the server actually responds with an object of this type.\" Karena itu pakai <code>interface</code>, bukan class: response hanyalah plain object hasil parsing JSON.",
  },
  {
    id: "0016-06", lesson: "0016", topic: "ng-interceptor", type: "mc",
    prompt: "Provider didaftarkan berurutan: <code>AuthInterceptor</code> lalu <code>LoggingInterceptor</code>. Bagaimana urutan request dan response?",
    options: {
      a: "Request maupun response: selalu Auth dulu lalu Logging",
      b: "Request Logging lalu Auth; response Auth lalu Logging",
      c: "Acak, karena Angular menjalankan semua interceptor secara paralel",
      d: "Request Auth lalu Logging; response Logging lalu Auth",
    },
    answer: "d",
    explain: "\"Angular applies interceptors in the order that you provide them.\" Request mengalir Auth → Logging → <code>HttpBackend</code>, response kembali ke arah sebaliknya. Sama seperti middleware Express yang membungkus satu sama lain.",
  },
  {
    id: "0016-07", lesson: "0016", topic: "ng-forms", type: "mc",
    prompt: "Form edit Product punya banyak field, validasi harga &gt; 0, field dinamis, dan harus mudah di-unit test. Pendekatan apa dan kenapa?",
    options: {
      a: "Template-driven, karena setup awalnya paling sederhana",
      b: "Template-driven, karena change detection lebih efisien",
      c: "Reactive, karena validasinya ditulis sebagai directive",
      d: "Reactive, karena modelnya eksplisit dan testable",
    },
    answer: "d",
    explain: "Reactive Forms \"are more scalable, reusable, and testable\" dan bisa diuji \"without rendering the UI\". Validator Reactive berupa <em>fungsi</em>, bukan directive (directive itu cara template-driven). Template-driven cocok untuk form sederhana seperti signup email.",
  },
  {
    id: "0016-08", lesson: "0016", topic: "ng-http", type: "mc",
    prompt: "Server membalas 500, atau jaringan putus. Apa yang diterima handler error dari <code>HttpClient</code>?",
    options: {
      a: "Response sukses dengan body berisi null",
      b: "Exception sinkron yang harus dibungkus try/catch",
      c: "HttpErrorResponse; error jaringan punya status 0",
      d: "Promise yang ditolak dengan pesan string",
    },
    answer: "c",
    explain: "\"<code>HttpClient</code> captures both kinds of errors in its <code>HttpErrorResponse</code>.\" Error dari server punya status seperti 404/500; error sisi klien (jaringan) \"have <code>status</code> set to <code>0</code>\". Tangani dengan <code>catchError</code> di <code>pipe</code>.",
  },
  {
    id: "0016-09", lesson: "0016", topic: "ng-interceptor", type: "mc",
    prompt: "Di aplikasi NgModule Angular 16, bagaimana class interceptor didaftarkan?",
    options: {
      a: "Provider HTTP_INTERCEPTORS dengan multi: true di AppModule",
      b: "Menambahkan class interceptor ke array declarations module",
      c: "Memanggil app.use(interceptor) di dalam file main.ts aplikasi",
      d: "Memasang directive interceptor di setiap template component",
    },
    answer: "a",
    explain: "<code>{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }</code>. <code>multi: true</code> membuat token itu \"a <em>multiprovider</em> that injects an array of values\". Daftarkan di injector yang sama dengan <code>HttpClientModule</code> (biasanya <code>AppModule</code>).",
  },
  {
    id: "0016-10", lesson: "0016", topic: "ng-forms", type: "mc",
    prompt: "Bagaimana validator custom ditulis di Reactive Forms?",
    options: {
      a: "Sebagai directive yang dipasang di template",
      b: "Sebagai fungsi yang menerima sebuah control",
      c: "Sebagai interceptor yang memeriksa setiap request",
      d: "Sebagai lifecycle hook ngOnChanges di component",
    },
    answer: "b",
    explain: "Reactive: \"Define custom validators as <strong>functions</strong> that receive a control to validate\". Template-driven harus membungkus fungsi itu dalam directive. Validator mengembalikan object error atau <code>null</code>.",
  },
  {
    id: "0016-11", lesson: "0016", topic: "ng-interceptor", type: "mc",
    prompt: "Setiap response 401 dari API harus mengarahkan user ke halaman login. Di mana logika ini paling tepat ditaruh?",
    options: {
      a: "Di setiap method service yang memanggil HttpClient",
      b: "Di interceptor, memakai catchError pada hasil next.handle()",
      c: "Di ngOnInit setiap component yang menampilkan data",
      d: "Di Validators custom pada FormGroup halaman login",
    },
    answer: "b",
    explain: "Interceptor menjalankan tugas <em>implicit</em> \"for every HTTP request/response\"; tanpa interceptor tugas itu harus ditulis \"explicitly for each <code>HttpClient</code> method call\". <code>next.handle(req)</code> mengembalikan Observable, jadi <code>pipe(catchError(...))</code> menangkap 401 di satu tempat. Padanan: response interceptor Axios.",
  },
  {
    id: "0016-oral-1", lesson: "0016", topic: "ng-interceptor", type: "oral",
    prompt: "Kapan Anda memilih Reactive Forms dibanding template-driven, apa yang dikembalikan <code>HttpClient</code>, dan apa yang Anda taruh di HTTP Interceptor? Jawab dalam 60 detik.",
    sample: "\"Reactive Forms membuat form model secara eksplisit di class component dengan <code>FormGroup</code> dan <code>FormControl</code>; template-driven membuatnya implisit lewat <code>ngModel</code>. Untuk form besar dengan validasi dan field dinamis saya pilih Reactive: alurnya sinkron, validatornya fungsi, dan bisa di-unit test tanpa render. Template-driven cukup untuk form kecil. <code>HttpClient</code> mengembalikan Observable yang baru mengirim request saat di-subscribe; generic <code>get&lt;Product[]&gt;</code> hanya type assertion saat compile. Error datang sebagai <code>HttpErrorResponse</code> dan saya tangani dengan <code>catchError</code>. Interceptor adalah class yang mengimplementasikan <code>HttpInterceptor</code>: karena request immutable, saya <code>clone</code> lalu <code>setHeaders</code> Authorization, kemudian <code>next.handle</code>. Saya daftarkan dengan <code>HTTP_INTERCEPTORS</code> dan <code>multi: true</code>; urutannya mengikuti urutan provider. Di sana juga saya tangani 401 secara global. Padanannya interceptor Axios, atau middleware Express di sisi backend.\"",
    checklist: [
      "Reactive: model eksplisit di class (FormGroup/FormControl); template-driven: implisit lewat ngModel",
      "Alasan memilih: Reactive scalable, sinkron, validator berupa fungsi, mudah diuji; template-driven untuk form sederhana",
      "HttpClient mengembalikan Observable yang baru request saat subscribe",
      "Generic get<T> hanya type assertion compile-time; error = HttpErrorResponse, ditangani catchError",
      "Interceptor: clone request (immutable) + setHeaders Authorization, lalu next.handle",
      "Didaftarkan lewat HTTP_INTERCEPTORS multi: true, urutan = urutan provider; dipakai untuk error global (401), padanan interceptor Axios",
    ],
  },
]);
