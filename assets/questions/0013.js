// Soal lesson 0013: Angular dasar (NgModule, binding, structural directive, Lifecycle Hook). Lihat assets/README.md.
QuestionBank.labelTopics({
  "ng-module": "NgModule & standalone component",
  "ng-binding": "Data binding & structural directive",
  "ng-lifecycle": "Lifecycle Hook",
});

// Urutan registrasi sengaja diselang-seling antar topik (interleaving) dan posisi jawaban bervariasi.
QuestionBank.register([
  {
    id: "0013-01", lesson: "0013", topic: "ng-module", type: "mc",
    prompt: "Anda membuat <code>ProductListComponent</code> baru di aplikasi berbasis <code>AppModule</code>. Di array mana component itu didaftarkan?",
    options: { a: "<code>declarations</code>", b: "<code>imports</code>", c: "<code>providers</code>", d: "<code>bootstrap</code>" },
    answer: "a",
    explain: "<code>declarations</code> berisi component, directive, dan pipe <em>milik</em> module ini. <code>imports</code> untuk module lain, <code>providers</code> untuk service, <code>bootstrap</code> untuk root component (<code>AppComponent</code>).",
  },
  {
    id: "0013-02", lesson: "0013", topic: "ng-binding", type: "mc",
    prompt: "Mana yang merupakan <strong>property binding</strong> (nilai mengalir dari component ke elemen)?",
    options: {
      a: "<code>(click)=\"save()\"</code>",
      b: "<code>[(ngModel)]=\"name\"</code>",
      c: "<code>[disabled]=\"isSaving\"</code>",
      d: "<code>(input)=\"onType()\"</code>",
    },
    answer: "c",
    explain: "Kurung siku <code>[ ]</code> = property binding (component → elemen), seperti <code>disabled={isSaving}</code> di JSX. Kurung biasa <code>( )</code> = event binding. <code>[( )]</code> = two-way binding.",
  },
  {
    id: "0013-03", lesson: "0013", topic: "ng-lifecycle", type: "mc",
    prompt: "Di mana sebaiknya component mengambil data awal dari API?",
    options: {
      a: "Di dalam <code>constructor</code> component",
      b: "Di dalam method <code>ngOnDestroy</code>",
      c: "Di dalam method <code>ngDoCheck</code>",
      d: "Di dalam method <code>ngOnInit</code>",
    },
    answer: "d",
    explain: "Dokumentasi Angular: constructor harus murah dan aman, jangan fetch data di sana. <code>ngOnInit</code> dipanggil sekali setelah input pertama di-set, jadi tempat yang tepat untuk data awal (mirip <code>useEffect(..., [])</code>).",
  },
  {
    id: "0013-04", lesson: "0013", topic: "ng-module", type: "mc",
    prompt: "Template di <code>AppModule</code> memakai <code>[(ngModel)]</code> lalu muncul error <em>\"Can't bind to 'ngModel'\"</em>. Apa perbaikannya?",
    options: {
      a: "Tambahkan <code>FormsModule</code> ke array <code>providers</code>",
      b: "Tambahkan <code>NgModel</code> ke array <code>declarations</code>",
      c: "Tambahkan <code>FormsModule</code> ke array <code>bootstrap</code>",
      d: "Tambahkan <code>FormsModule</code> ke array <code>imports</code>",
    },
    answer: "d",
    explain: "<code>NgModel</code> adalah directive milik <code>FormsModule</code>. Module lain dipakai lewat <code>imports</code>. <code>declarations</code> hanya untuk class buatan module itu sendiri.",
  },
  {
    id: "0013-05", lesson: "0013", topic: "ng-binding", type: "mc",
    prompt: "Child <code>ProductCardComponent</code> perlu memberi tahu parent bahwa tombol Hapus diklik. Cara Angular yang benar?",
    options: {
      a: "Emit event lewat <code>@Output()</code> dan <code>EventEmitter</code>",
      b: "Ubah nilai <code>@Input()</code> langsung dari child",
      c: "Panggil method parent lewat <code>ngOnInit</code> child",
      d: "Simpan nilai ke <code>ngModel</code> di parent",
    },
    answer: "a",
    explain: "<code>@Input()</code>: parent → child (seperti props). <code>@Output()</code> + <code>EventEmitter</code>: child → parent, didengar parent dengan <code>(deleted)=\"onDelete($event)\"</code>. Di React ini sama dengan memanggil callback prop <code>onDelete</code>.",
  },
  {
    id: "0013-06", lesson: "0013", topic: "ng-lifecycle", type: "mc",
    prompt: "<code>@Input() productId</code> berubah setiap kali user memilih Product lain. Hook mana yang dipanggil setiap kali nilai itu berubah?",
    options: { a: "<code>ngOnInit</code>", b: "<code>ngOnChanges</code>", c: "<code>ngOnDestroy</code>", d: "<code>constructor</code>" },
    answer: "b",
    explain: "<code>ngOnChanges(changes: SimpleChanges)</code> dipanggil sebelum <code>ngOnInit</code> dan setiap kali input berubah. <code>ngOnInit</code> hanya sekali. Padanan React: <code>useEffect(..., [productId])</code>.",
  },
  {
    id: "0013-07", lesson: "0013", topic: "ng-binding", type: "mc",
    prompt: "Di Angular <strong>16</strong>, bagaimana cara menampilkan daftar Product di template?",
    options: {
      a: "Blok <code>@for</code> dengan ekspresi <code>track</code>",
      b: "Memanggil <code>products.map</code> di dalam template",
      c: "Directive <code>*ngFor</code> di elemen <code>li</code>",
      d: "Directive <code>*ngRepeat</code> di elemen <code>li</code>",
    },
    answer: "c",
    explain: "<code>&lt;li *ngFor=\"let p of products; trackBy: trackById\"&gt;</code>. Blok <code>@for</code> baru ada di Angular 17. <code>ng-repeat</code> adalah AngularJS (1.x). <code>.map</code> adalah cara JSX.",
  },
  {
    id: "0013-08", lesson: "0013", topic: "ng-module", type: "mc",
    prompt: "Apa ciri <strong>standalone component</strong> di Angular 16?",
    options: {
      a: "Harus dideklarasikan di <code>declarations</code> milik <code>AppModule</code>",
      b: "Hanya bisa dipakai lewat lazy loading",
      c: "Ditandai <code>standalone: true</code>, mengisi <code>imports</code> sendiri",
      d: "Tidak bisa memakai dependency injection Angular",
    },
    answer: "c",
    explain: "Standalone component menyebut dependensinya sendiri di <code>imports</code> pada <code>@Component</code>, tanpa NgModule. Ia justru <em>tidak boleh</em> masuk <code>declarations</code>, dan DI tetap berjalan normal.",
  },
  {
    id: "0013-09", lesson: "0013", topic: "ng-lifecycle", type: "mc",
    prompt: "Apa padanan React yang paling dekat untuk <code>ngOnDestroy</code>?",
    options: {
      a: "Initializer function milik hook <code>useState</code>",
      b: "Fungsi cleanup yang di-return <code>useEffect</code>",
      c: "Body <code>useEffect</code> dengan dependency kosong",
      d: "Callback yang diberikan ke <code>useMemo</code>",
    },
    answer: "b",
    explain: "<code>ngOnDestroy</code> dipanggil tepat sebelum component dihancurkan: tempat unsubscribe Observable dan melepas event handler, seperti fungsi cleanup <code>useEffect</code>. Body <code>useEffect(..., [])</code> lebih mirip <code>ngOnInit</code>.",
  },
  {
    id: "0013-oral-1", lesson: "0013", topic: "ng-module", type: "oral",
    prompt: "\"Anda dari React. Jelaskan bagaimana component Angular 16 disusun dan hidup: NgModule, binding, dan Lifecycle Hook.\" (60 detik)",
    sample: "Di Angular 16 component adalah class TypeScript dengan decorator <code>@Component</code> yang berisi selector, template, dan style. Component itu dideklarasikan di sebuah <strong>NgModule</strong>: <code>declarations</code> untuk component milik module, <code>imports</code> untuk module lain seperti <code>FormsModule</code>, <code>providers</code> untuk service. Di v16 juga ada <strong>standalone component</strong> yang mengisi <code>imports</code> sendiri, lebih mirip function component React. Template terhubung ke class lewat binding: <code>{{ }}</code> interpolation, <code>[prop]</code> property binding, <code>(event)</code> event binding, dan <code>[(ngModel)]</code> two-way. Parent ke child lewat <code>@Input()</code> seperti props, child ke parent lewat <code>@Output()</code> dan <code>EventEmitter</code> seperti callback prop. Untuk kondisi dan list saya pakai <code>*ngIf</code> dan <code>*ngFor</code> dengan <code>trackBy</code>. Lifecycle-nya: constructor hanya untuk inject dependency, <code>ngOnInit</code> untuk ambil data awal, <code>ngOnChanges</code> saat input berubah, dan <code>ngOnDestroy</code> untuk unsubscribe, mirip mount, dependency, dan cleanup di <code>useEffect</code>.",
    checklist: [
      "isi @Component (selector, template, style) dan perannya sebagai class",
      "declarations / imports / providers di NgModule",
      "standalone component sebagai alternatif dan padanannya di React",
      "empat bentuk binding dan arah datanya",
      "@Input/@Output serta *ngIf/*ngFor (sintaks v16)",
      "constructor vs ngOnInit / ngOnChanges / ngOnDestroy dengan padanan useEffect",
    ],
  },
]);
