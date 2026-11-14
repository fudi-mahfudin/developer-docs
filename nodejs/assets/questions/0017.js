// Soal lesson 0017 (track Node.js, modul NestJS inti) · Provider dan dependency injection. Format: assets/README.md.
// Sumber: docs.nestjs.com (Providers, Custom providers, Circular dependency).
QuestionBank.labelTopics({
  "nest-di": "NestJS inti: provider, token, DI container",
  "nest-custom-provider": "NestJS inti: useClass/useValue/useFactory/useExisting, forwardRef",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban c a d b c.
QuestionBank.register([
  {
    id: "0017-01", lesson: "0017", topic: "nest-di", type: "mc",
    prompt: "Kenapa <code>constructor(private repo: UserRepository)</code> gagal di-resolve kalau <code>UserRepository</code> adalah <strong>interface</strong> TypeScript?",
    options: {
      a: "Interface hanya bisa di-inject kalau provider-nya bersifat request-scoped saja",
      b: "Container Nest hanya menerima token berupa string atau Symbol",
      c: "Interface hilang saat kompilasi, jadi tidak ada token runtime",
      d: "Interface harus diberi @Injectable dulu sebelum bisa dipakai container",
    },
    answer: "c",
    explain: "docs.nestjs.com (Custom providers): \"TypeScript types and interfaces are erased during compilation, so Nest can't reference them at runtime.\" Pakai class abstrak, atau token string/Symbol dengan @Inject(TOKEN).",
  },
  {
    id: "0017-02", lesson: "0017", topic: "nest-custom-provider", type: "mc",
    prompt: "Di test, Anda ingin token <code>PrismaService</code> diselesaikan ke object mock yang sudah jadi. Bentuk provider mana?",
    options: {
      a: "<code>useValue</code>, karena nilainya sudah jadi untuk dipakai",
      b: "<code>useExisting</code>, karena mock adalah alias provider lain",
      c: "<code>useFactory</code>, karena mock selalu harus dibuat async",
      d: "<code>forwardRef</code>, karena mock belum didefinisikan saat start",
    },
    answer: "a",
    explain: "docs.nestjs.com (Custom providers): useValue berguna untuk menyuntikkan konstanta atau \"replacing a real implementation with a mock object\".",
  },
  {
    id: "0017-03", lesson: "0017", topic: "nest-di", type: "mc",
    prompt: "Dengan scope default, <code>OrdersService</code> dan <code>BillingService</code> sama-sama meng-inject <code>PrismaService</code>. Berapa instance <code>PrismaService</code> yang dibuat?",
    options: {
      a: "Satu instance baru untuk setiap request HTTP yang masuk",
      b: "Dua instance terpisah, masing-masing satu untuk setiap class pemakai",
      c: "Nol, karena PrismaService baru dibuat saat method pertama dipanggil",
      d: "Satu instance yang dibagi ke semua class yang memerlukannya",
    },
    answer: "d",
    explain: "docs.nestjs.com (Providers): \"With the default (singleton) scope, Nest creates the instance once and shares it with every class that depends on it.\"",
  },
  {
    id: "0017-04", lesson: "0017", topic: "nest-custom-provider", type: "mc",
    prompt: "Provider client HTTP butuh <code>ConfigService</code> untuk membaca base URL sebelum dibuat. Bentuk provider yang tepat?",
    options: {
      a: "useValue dengan object client yang ditulis langsung di module",
      b: "useFactory dengan inject berisi ConfigService sebagai argumen fungsi factory",
      c: "useExisting yang menunjuk ke token ConfigService secara langsung saja",
      d: "useClass berisi class client tanpa daftar inject apa pun",
    },
    answer: "b",
    explain: "docs.nestjs.com (Custom providers): useFactory menerima array inject berisi provider yang \"Nest resolves and passes as arguments to the factory function\"; factory boleh async.",
  },
  {
    id: "0017-05", lesson: "0017", topic: "nest-custom-provider", type: "mc",
    prompt: "<code>UsersService</code> dan <code>AuthService</code> saling meng-inject. Mana pernyataan yang benar?",
    options: {
      a: "Nest otomatis menyelesaikannya tanpa perlu perubahan pada kode sama sekali",
      b: "Cukup tambahkan forwardRef di salah satu sisi, sisi lain tetap",
      c: "Pakai forwardRef di kedua sisi; urutan instansiasinya tidak dapat ditentukan",
      d: "Ubah salah satu service menjadi useValue supaya siklusnya hilang sendiri",
    },
    answer: "c",
    explain: "docs.nestjs.com (Circular dependency): kedua sisi memakai @Inject() + forwardRef(); \"The order of instantiation is indeterminate\". Lebih baik lagi: pindahkan logika bersama ke service ketiga.",
  },
  {
    id: "0017-oral-1", lesson: "0017", topic: "nest-di", type: "oral",
    prompt: "\"Jelaskan bagaimana dependency injection di NestJS bekerja, dan kapan Anda memakai custom provider.\" (60 detik)",
    sample: "Setiap provider didaftarkan di module dengan sebuah token, biasanya class-nya sendiri. Saat container membuat class, ia membaca parameter constructor, mencari provider dengan token yang sama, membuatnya dulu kalau perlu, lalu menyuntikkannya. Default-nya singleton: satu instance dibagi ke semua pemakai. Interface tidak bisa jadi token karena hilang saat kompilasi, jadi untuk hal non-class saya pakai string atau Symbol dengan @Inject. Custom provider: useValue untuk konstanta atau mock di test, useClass untuk memilih implementasi, useFactory kalau nilainya perlu dihitung dari provider lain lewat inject, misalnya client Redis dari ConfigService, dan useExisting untuk alias. Circular dependency bisa diakali forwardRef di kedua sisi, tapi saya lebih suka memecahnya dengan service ketiga.",
    checklist: [
      "token sebagai kunci pencarian dan container yang membaca constructor",
      "singleton sebagai default (satu instance dibagi)",
      "interface tidak bisa jadi token; pakai string/Symbol + @Inject",
      "useValue dan useClass beserta contoh pemakaiannya",
      "useFactory dengan inject, dan useExisting sebagai alias",
      "forwardRef untuk circular dependency, dan lebih baik dipecah dengan service ketiga",
    ],
  },
  {
    id: "0017-oral-2", lesson: "0017", topic: "nest-custom-provider", type: "oral",
    prompt: "Tulis kode: provider dengan token <code>MAILER</code> memakai <code>useFactory</code> yang membaca <code>SMTP_URL</code> dari <code>ConfigService</code> dan mengembalikan <code>new Mailer(url)</code>. Export provider itu, lalu tulis constructor service yang meng-inject-nya. (5 menit, di kertas)",
    sample: "<pre><code>export const MAILER = 'MAILER';\n\n@Module({\n  imports: [ConfigModule],\n  providers: [{\n    provide: MAILER,\n    useFactory: (config: ConfigService) =&gt; new Mailer(config.getOrThrow('SMTP_URL')),\n    inject: [ConfigService],\n  }],\n  exports: [MAILER],\n})\nexport class MailModule {}\n\n@Injectable()\nexport class NotifyService {\n  constructor(@Inject(MAILER) private readonly mailer: Mailer) {}\n}</code></pre>",
    checklist: [
      "memakai token non-class (string atau Symbol) yang diekspor sebagai konstanta",
      "menulis provide + useFactory yang mengembalikan instance",
      "mencantumkan inject: [ConfigService] sesuai urutan argumen factory",
      "meng-import module yang menyediakan ConfigService",
      "meng-export provider lewat token-nya",
      "meng-inject dengan @Inject(MAILER), bukan mengandalkan tipe saja",
    ],
  },
]);
