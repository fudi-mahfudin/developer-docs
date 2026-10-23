// Soal lesson 0015: RxJS untuk interview (Observable vs Promise, Subject, operator, unsubscribe). Lihat assets/README.md.
QuestionBank.labelTopics({
  "rx-observable": "Observable vs Promise",
  "rx-subject": "Subject & BehaviorSubject",
  "rx-operator": "Memilih operator RxJS",
  "rx-unsubscribe": "Unsubscribe & memory leak",
});

// Urutan registrasi sengaja diselang-seling antar topik (interleaving) dan posisi jawaban bervariasi.
// Soal topik rx-operator dirender terpisah di lesson sebagai latihan memilih operator.
QuestionBank.register([
  {
    id: "0015-01", lesson: "0015", topic: "rx-observable", type: "mc",
    prompt: "Di <code>ngOnInit</code> tertulis <code>this.http.get('/api/products');</code> tanpa <code>.subscribe()</code>. Apa yang terjadi?",
    options: {
      a: "Request terkirim tetapi hasilnya dibuang",
      b: "Tidak ada request yang terkirim",
      c: "Request terkirim dua kali berturut-turut",
      d: "Angular melempar error saat compile",
    },
    answer: "b",
    explain: "Observable dari <code>HttpClient</code> itu <em>cold</em>: request baru dimulai saat <code>subscribe()</code> dipanggil. Bandingkan dengan <code>fetch()</code> yang langsung jalan begitu Promise dibuat.",
  },
  {
    id: "0015-02", lesson: "0015", topic: "rx-subject", type: "mc",
    prompt: "<code>AuthService</code> menyimpan user yang sedang login. Component yang subscribe belakangan harus <strong>langsung</strong> menerima nilai saat ini. Pakai apa?",
    options: { a: "<code>Promise</code>", b: "<code>Subject</code>", c: "<code>EventEmitter</code>", d: "<code>BehaviorSubject</code>" },
    answer: "d",
    explain: "<code>BehaviorSubject</code> punya \"current value\" dan langsung mengirimkannya ke subscriber baru. <code>Subject</code> biasa hanya meneruskan nilai yang dipancarkan <em>setelah</em> subscribe. Padanan React: state di Context Provider.",
  },
  {
    id: "0015-03", lesson: "0015", topic: "rx-operator", type: "mc",
    prompt: "<strong>Search box Product.</strong> Setiap kata kunci baru memicu request. Hasil kata kunci lama tidak boleh menimpa hasil kata kunci terbaru. Operator flattening apa?",
    options: { a: "<code>switchMap</code>", b: "<code>mergeMap</code>", c: "<code>concatMap</code>", d: "<code>exhaustMap</code>" },
    answer: "a",
    explain: "<code>switchMap</code> berhenti mendengarkan inner Observable lama (request lama dibatalkan) begitu ada nilai baru. <code>mergeMap</code> membiarkan semuanya jalan, jadi respons lama yang datang terlambat bisa menimpa hasil baru (race condition).",
  },
  {
    id: "0015-04", lesson: "0015", topic: "rx-unsubscribe", type: "mc",
    prompt: "Component melakukan <code>interval(1000).subscribe(...)</code> di <code>ngOnInit</code> dan tidak pernah unsubscribe. Apa yang terjadi setelah user pindah halaman?",
    options: {
      a: "Subscription otomatis berhenti bersama component",
      b: "Angular melempar error saat navigasi",
      c: "Subscription tetap jalan, memori bocor",
      d: "Interval berhenti setelah satu menit",
    },
    answer: "c",
    explain: "Angular tidak membatalkan subscription manual. <code>interval</code> tidak pernah complete, jadi callback terus jalan dan menahan component di memori (memory leak). Bersihkan di <code>ngOnDestroy</code>, pakai <code>takeUntil</code>, atau pakai <code>async</code> pipe.",
  },
  {
    id: "0015-05", lesson: "0015", topic: "rx-observable", type: "mc",
    prompt: "Pernyataan mana yang <strong>benar</strong> tentang Observable dan Promise?",
    options: {
      a: "Promise lazy, Observable langsung jalan",
      b: "Promise bisa mengirim banyak nilai",
      c: "Observable hanya mengirim satu nilai",
      d: "Observable bisa dibatalkan, Promise tidak",
    },
    answer: "d",
    explain: "Dokumentasi Angular: \"Observable subscriptions are cancellable\" dan \"Promises are not cancellable\". Selain itu Observable lazy dan bisa mengirim banyak nilai; Promise langsung jalan dan hanya satu nilai.",
  },
  {
    id: "0015-06", lesson: "0015", topic: "rx-operator", type: "mc",
    prompt: "<strong>Dashboard.</strong> Butuh data Product dan Category dari dua endpoint, dipanggil paralel, lalu render sekali setelah <em>keduanya</em> selesai. Operator apa?",
    options: { a: "<code>switchMap</code>", b: "<code>debounceTime</code>", c: "<code>forkJoin</code>", d: "<code>exhaustMap</code>" },
    answer: "c",
    explain: "<code>forkJoin</code> menunggu semua Observable complete lalu memancarkan nilai terakhir masing-masing, seperti <code>Promise.all</code>. Cocok untuk request HTTP yang sekali jalan. Kalau salah satu error, <code>forkJoin</code> ikut error.",
  },
  {
    id: "0015-07", lesson: "0015", topic: "rx-unsubscribe", type: "mc",
    prompt: "Cara paling ringkas menampilkan <code>products$</code> di template <strong>tanpa</strong> menulis kode unsubscribe sama sekali?",
    options: {
      a: "Pakai async pipe di template",
      b: "Subscribe ulang di setiap ngDoCheck",
      c: "Panggil toPromise di dalam constructor",
      d: "Simpan Subscription di variabel global",
    },
    answer: "a",
    explain: "<code>*ngFor=\"let p of products$ | async\"</code>. <code>async</code> pipe subscribe untuk Anda, menandai component untuk change detection saat ada nilai baru, dan unsubscribe otomatis saat component dihancurkan.",
  },
  {
    id: "0015-08", lesson: "0015", topic: "rx-operator", type: "mc",
    prompt: "<strong>Tombol Simpan</strong> diklik berkali-kali dengan cepat. Klik berikutnya harus <em>diabaikan</em> selama request pertama belum selesai. Operator apa?",
    options: { a: "<code>switchMap</code>", b: "<code>mergeMap</code>", c: "<code>concatMap</code>", d: "<code>exhaustMap</code>" },
    answer: "d",
    explain: "<code>exhaustMap</code> mengabaikan nilai baru selama inner Observable sebelumnya belum complete. <code>switchMap</code> justru membatalkan request yang sedang jalan, <code>concatMap</code> mengantre semua klik (tetap menyimpan dua kali).",
  },
  {
    id: "0015-09", lesson: "0015", topic: "rx-subject", type: "mc",
    prompt: "Apa beda <code>Subject</code> dan <code>BehaviorSubject</code>?",
    options: {
      a: "Subject menyimpan nilai terakhir, BehaviorSubject tidak",
      b: "BehaviorSubject menyimpan nilai terakhir, Subject tidak",
      c: "Subject hanya bisa punya satu subscriber",
      d: "BehaviorSubject tidak bisa menerima nilai baru",
    },
    answer: "b",
    explain: "Keduanya multicast (banyak subscriber) dan keduanya Observer (punya <code>next()</code>). <code>BehaviorSubject</code> butuh nilai awal, menyimpan nilai terakhir, dan langsung mengirimkannya ke subscriber baru.",
  },
  {
    id: "0015-10", lesson: "0015", topic: "rx-operator", type: "mc",
    prompt: "<strong>Error handling.</strong> <code>getProducts()</code> gagal (500). Anda ingin menampilkan daftar kosong, bukan membiarkan error sampai ke <code>subscribe</code>. Operator apa?",
    options: { a: "<code>catchError</code>", b: "<code>debounceTime</code>", c: "<code>takeUntil</code>", d: "<code>map</code>" },
    answer: "a",
    explain: "<code>catchError(() =&gt; of([]))</code> menangkap error dan menggantinya dengan Observable baru. Bisa juga melempar ulang error. Mirip <code>.catch()</code> pada Promise, tapi ditulis di dalam <code>pipe()</code>.",
  },
  {
    id: "0015-11", lesson: "0015", topic: "rx-unsubscribe", type: "mc",
    prompt: "Kenapa pola <code>.pipe(takeUntil(this.destroy$))</code> plus <code>this.destroy$.next()</code> di <code>ngOnDestroy</code> mencegah memory leak?",
    options: {
      a: "Angular memanggil unsubscribe di setiap ngOnChanges",
      b: "Operator ini membatalkan request setelah timeout",
      c: "Stream selesai saat destroy$ memancarkan nilai",
      d: "HttpClient otomatis membaca properti destroy$ component",
    },
    answer: "c",
    explain: "<code>takeUntil</code> meneruskan nilai sampai Observable <em>notifier</em> memancarkan nilai, lalu complete. Jadi satu <code>next()</code> di <code>ngOnDestroy</code> menutup semua stream component. Taruh <code>takeUntil</code> di akhir <code>pipe</code>.",
  },
  {
    id: "0015-12", lesson: "0015", topic: "rx-operator", type: "mc",
    prompt: "<strong>Search box, lagi.</strong> Request jangan dikirim di setiap ketikan. Tunggu sampai user berhenti mengetik 300 ms. Operator apa?",
    options: { a: "<code>filter</code>", b: "<code>debounceTime</code>", c: "<code>distinctUntilChanged</code>", d: "<code>switchMap</code>" },
    answer: "b",
    explain: "<code>debounceTime(300)</code> hanya meneruskan nilai terakhir setelah 300 ms tanpa ketikan baru. Pipeline search box lengkap: <code>debounceTime</code> → <code>distinctUntilChanged</code> → <code>switchMap</code>.",
  },
  {
    id: "0015-13", lesson: "0015", topic: "rx-operator", type: "mc",
    prompt: "<strong>Hapus massal.</strong> Setiap Product yang dipilih dihapus dengan satu request DELETE. Semua request boleh jalan bersamaan dan <em>tidak boleh ada yang dibatalkan</em>. Operator apa?",
    options: { a: "<code>switchMap</code>", b: "<code>exhaustMap</code>", c: "<code>mergeMap</code>", d: "<code>debounceTime</code>" },
    answer: "c",
    explain: "<code>mergeMap</code> menjalankan semua inner Observable bersamaan dan tidak membatalkan apa pun (bisa dibatasi dengan parameter <code>concurrent</code>). <code>switchMap</code> akan membatalkan DELETE yang masih jalan, <code>exhaustMap</code> akan mengabaikan sebagian.",
  },
  {
    id: "0015-oral-1", lesson: "0015", topic: "rx-observable", type: "oral",
    prompt: "Apa beda Observable dan Promise, kapan Anda memakai <code>switchMap</code>, dan bagaimana Anda mencegah memory leak di Angular?",
    sample: "Promise langsung jalan saat dibuat, hanya menghasilkan satu nilai, dan tidak bisa dibatalkan. Observable lazy (baru jalan saat <code>subscribe</code>), bisa memancarkan banyak nilai, dan bisa dibatalkan dengan <code>unsubscribe</code>. <code>HttpClient</code> mengembalikan Observable. Untuk state bersama saya pakai <code>BehaviorSubject</code> di service karena subscriber baru langsung dapat nilai terakhir. Operator saya rangkai di <code>pipe</code>: <code>map</code> untuk transformasi, <code>catchError</code> untuk error. Di search box saya pakai <code>debounceTime</code> lalu <code>switchMap</code>, karena <code>switchMap</code> membatalkan request lama sehingga hasil lama tidak menimpa yang baru; kalau semua request harus jalan paralel saya pakai <code>mergeMap</code>, dan <code>forkJoin</code> untuk menunggu beberapa request sekaligus. Untuk mencegah memory leak saya utamakan <code>async</code> pipe yang unsubscribe otomatis; kalau harus subscribe manual, saya pakai <code>takeUntil(destroy$)</code> yang di-<code>next()</code> di <code>ngOnDestroy</code>.",
    checklist: [
      "Observable lazy dan bisa banyak nilai; Promise eager dan satu nilai",
      "Observable bisa dibatalkan (unsubscribe); Promise tidak",
      "BehaviorSubject untuk state bersama: menyimpan nilai terakhir",
      "switchMap membatalkan request lama (search box), dengan debounceTime",
      "Beda switchMap dengan mergeMap (paralel) atau forkJoin (tunggu semua)",
      "async pipe atau takeUntil + ngOnDestroy untuk mencegah memory leak",
    ],
  },
]);
