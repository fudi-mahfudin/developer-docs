// Soal lesson 0018 (track Node.js, modul NestJS inti) · Scope provider dan dynamic module. Format: assets/README.md.
// Sumber: docs.nestjs.com (Injection scopes, Lifecycle events, Modules, Dynamic modules).
QuestionBank.labelTopics({
  "nest-scope": "NestJS inti: scope DEFAULT/REQUEST/TRANSIENT dan bubbling",
  "nest-dynamic-module": "NestJS inti: dynamic module forRoot/forFeature/register",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban d b a c d.
QuestionBank.register([
  {
    id: "0018-01", lesson: "0018", topic: "nest-scope", type: "mc",
    prompt: "Rantai injeksi: <code>CatsController &lt;- CatsService &lt;- CatsRepository</code>. Hanya <code>CatsService</code> yang diberi <code>Scope.REQUEST</code>. Mana yang dibuat ulang setiap request?",
    options: {
      a: "Hanya CatsService; controller dan repository tetap menjadi singleton",
      b: "Ketiganya, karena scope REQUEST merambat ke seluruh rantai",
      c: "Hanya CatsRepository, karena ia berada di paling bawah",
      d: "CatsService dan CatsController; sedangkan CatsRepository tetap menjadi singleton",
    },
    answer: "d",
    explain: "docs.nestjs.com (Injection scopes): request scope merambat ke atas ke pemakainya. Controller yang bergantung pada CatsService ikut request-scoped; CatsRepository tidak bergantung pada CatsService, jadi tetap singleton.",
  },
  {
    id: "0018-02", lesson: "0018", topic: "nest-dynamic-module", type: "mc",
    prompt: "Menurut konvensi Nest, apa arti <code>forFeature()</code>?",
    options: {
      a: "Konfigurasi khusus module pemanggil, terpisah dari semua module lain",
      b: "Memakai konfigurasi dari forRoot, lalu menyesuaikan sebagian untuk feature",
      c: "Mendaftarkan module sebagai global supaya tidak perlu di-import lagi",
      d: "Versi async dari forRoot yang menerima useFactory dan inject",
    },
    answer: "b",
    explain: "docs.nestjs.com (Dynamic modules): \"forFeature() uses the configuration set up by forRoot(), but modifies some of it\", mis. TypeOrmModule.forFeature([User]) memilih entity untuk satu feature module.",
  },
  {
    id: "0018-03", lesson: "0018", topic: "nest-scope", type: "mc",
    prompt: "Kenapa singleton direkomendasikan sebagai scope default di Nest?",
    options: {
      a: "Instance dibuat sekali saat start lalu dipakai ulang semua request",
      b: "Singleton otomatis aman dari race condition antar request yang paralel",
      c: "Singleton satu-satunya scope yang mendukung injeksi lewat constructor di Nest",
      d: "Request scope tidak didukung lagi di NestJS 12 dan sesudahnya",
    },
    answer: "a",
    explain: "docs.nestjs.com (Injection scopes): \"Singleton scope is recommended for most use cases\"; instance di-cache dan diinisialisasi sekali saat start. Request scope membuat ulang rantai per request (dokumentasi: ~5% latency pada aplikasi yang dirancang baik).",
  },
  {
    id: "0018-04", lesson: "0018", topic: "nest-dynamic-module", type: "mc",
    prompt: "Koneksi database butuh <code>DATABASE_URL</code> dari <code>ConfigService</code>. Bentuk mana yang tepat?",
    options: {
      a: "forRoot dengan process.env dibaca langsung di dalam decorator module",
      b: "forFeature tanpa opsi dan biarkan module membaca env sendiri",
      c: "forRootAsync dengan imports, inject berisi ConfigService, dan juga useFactory",
      d: "register dengan useValue berisi string koneksi yang ditulis langsung",
    },
    answer: "c",
    explain: "docs.nestjs.com (Dynamic modules): setiap method biasanya punya pasangan async (forRootAsync) untuk opsi yang bergantung pada provider lain; bentuknya useFactory + inject.",
  },
  {
    id: "0018-05", lesson: "0018", topic: "nest-scope", type: "mc",
    prompt: "Sebuah service request-scoped mengimplementasikan <code>onModuleInit()</code>. Apa yang terjadi?",
    options: {
      a: "Hook dipanggil sekali saat start seperti provider singleton biasa",
      b: "Hook dipanggil di awal setiap request sebelum handler controller",
      c: "Nest menolak start karena hook dilarang di provider request-scoped",
      d: "Hook tidak pernah dipanggil untuk class yang bersifat request-scoped",
    },
    answer: "d",
    explain: "docs.nestjs.com (Lifecycle events): \"The lifecycle hooks listed above are not triggered for request-scoped classes\"; umurnya terikat pada request, bukan pada lifecycle aplikasi.",
  },
  {
    id: "0018-oral-1", lesson: "0018", topic: "nest-scope", type: "oral",
    prompt: "\"Rekan Anda ingin membuat semua service request-scoped supaya bisa membaca user dari request. Apa tanggapan Anda?\" (60 detik)",
    sample: "Nest punya tiga scope: DEFAULT atau singleton, REQUEST yang dibuat ulang per request, dan TRANSIENT yang memberi instance sendiri ke setiap pemakai. Singleton direkomendasikan karena dibuat sekali saat start. Request scope merambat ke atas: controller atau service yang meng-inject provider request-scoped ikut dibuat ulang setiap request, jadi kalau semuanya request-scoped, seluruh graf dibuat per request. Dokumentasi menyebut aplikasi yang dirancang baik sekitar 5% latency tambahan, tapi itu kalau dipakai hemat. Lifecycle hook seperti onModuleInit juga tidak jalan untuk class request-scoped. Untuk membaca user, saya ambil dari request di controller lewat parameter decorator lalu oper sebagai argumen, atau simpan di AsyncLocalStorage. Kalau memang butuh satu provider per request, cukup provider kecil itu, bukan semuanya.",
    checklist: [
      "tiga scope: DEFAULT, REQUEST, TRANSIENT",
      "singleton sebagai rekomendasi default",
      "request scope merambat ke atas ke pemakainya (bubbling)",
      "biaya: graf dibuat ulang per request, latency bertambah",
      "lifecycle hook tidak dipanggil untuk class request-scoped",
      "alternatif: oper data sebagai argumen, AsyncLocalStorage, atau batasi ke satu provider kecil",
    ],
  },
  {
    id: "0018-oral-2", lesson: "0018", topic: "nest-dynamic-module", type: "oral",
    prompt: "Tulis kode: dynamic module <code>StorageModule</code> dengan <code>static forRoot(options: { bucket: string })</code>. Opsi disimpan dengan token <code>STORAGE_OPTIONS</code>, <code>StorageService</code> meng-inject opsi itu, dan module bisa dijadikan global lewat opsi <code>isGlobal</code>. (5 menit, di kertas)",
    sample: "<pre><code>export const STORAGE_OPTIONS = Symbol('STORAGE_OPTIONS');\n\n@Injectable()\nexport class StorageService {\n  constructor(@Inject(STORAGE_OPTIONS) private readonly opts: { bucket: string }) {}\n}\n\n@Module({})\nexport class StorageModule {\n  static forRoot(options: { bucket: string; isGlobal?: boolean }): DynamicModule {\n    return {\n      module: StorageModule,\n      global: options.isGlobal ?? false,\n      providers: [{ provide: STORAGE_OPTIONS, useValue: options }, StorageService],\n      exports: [StorageService],\n    };\n  }\n}</code></pre>",
    checklist: [
      "memakai method static yang mengembalikan DynamicModule",
      "mengisi properti module dengan class module itu sendiri",
      "menyimpan opsi sebagai provider useValue dengan token sendiri",
      "meng-inject opsi di service dengan @Inject(TOKEN)",
      "meng-export StorageService supaya bisa dipakai pemanggil",
      "memetakan isGlobal ke properti global",
    ],
  },
]);
