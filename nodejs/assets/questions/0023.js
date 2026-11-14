// Soal lesson 0023 (track Node.js, modul Pipeline request) · Guard vs middleware; latihan tulis guard. Format: assets/README.md.
// Sumber: NestJS docs (Middleware, Guards, Execution context).
QuestionBank.labelTopics({
  "pipeline-middleware": "Pipeline: middleware Nest, configure/forRoutes, kenapa otorisasi bukan di middleware",
  "pipeline-guard": "Pipeline: guard, CanActivate, ExecutionContext, Reflector + custom decorator",
});

QuestionBank.register([
  {
    id: "0023-01", lesson: "0023", topic: "pipeline-middleware", type: "mc",
    prompt: "Kenapa otorisasi berbasis role (\"hanya admin boleh memanggil method ini\") sebaiknya ditaruh di guard, bukan di middleware?",
    options: {
      a: "Middleware tidak boleh membaca header Authorization dari request",
      b: "Middleware selalu jalan setelah guard, jadi sudah terlambat",
      c: "Guard lebih cepat karena dikompilasi ke kode native",
      d: "Middleware tidak tahu handler mana yang akan dipanggil",
    },
    answer: "d",
    explain: "Middleware bersifat context-blind: ia tidak tahu handler mana yang akan dijalankan setelah next(). Guard menerima ExecutionContext sehingga bisa membaca metadata (mis. @Roles) di handler yang akan dipanggil (NestJS docs, Guards). Middleware justru jalan sebelum guard.",
  },
  {
    id: "0023-02", lesson: "0023", topic: "pipeline-middleware", type: "mc",
    prompt: "Middleware class <code>CorrelationIdMiddleware</code> perlu dipasang ke semua route. Di mana Anda mendaftarkannya?",
    options: {
      a: "Di array <code>providers</code> dekorator <code>@Module()</code> sebagai provider biasa",
      b: "Di method <code>configure(consumer)</code> milik AppModule, memakai <code>consumer.apply(...).forRoutes('*splat')</code> sekali",
      c: "Di atas setiap class controller dengan decorator <code>@UseGuards(CorrelationIdMiddleware)</code>",
      d: "Di array <code>middlewares</code> milik dekorator <code>@Module()</code> pada AppModule",
    },
    answer: "b",
    explain: "Middleware tidak didaftarkan di @Module(); module mengimplementasikan NestModule dan memasangnya di configure() dengan MiddlewareConsumer (NestJS docs, Middleware). @Module() tidak punya properti middlewares.",
  },
  {
    id: "0023-03", lesson: "0023", topic: "pipeline-guard", type: "mc",
    prompt: "<code>canActivate</code> sebuah guard mengembalikan <code>false</code>. Apa yang diterima client secara default?",
    options: {
      a: "200 dengan body kosong karena handler dilewati",
      b: "401 Unauthorized dengan header WWW-Authenticate yang otomatis",
      c: "403 dengan pesan <code>Forbidden resource</code> dari ForbiddenException",
      d: "500 karena guard tidak boleh mengembalikan false",
    },
    answer: "c",
    explain: "Saat guard mengembalikan false, Nest melempar ForbiddenException: statusCode 403, message \"Forbidden resource\". Untuk status lain, misalnya 401, lempar exception sendiri seperti UnauthorizedException (NestJS docs, Guards).",
  },
  {
    id: "0023-04", lesson: "0023", topic: "pipeline-guard", type: "mc",
    prompt: "Di dalam <code>RolesGuard</code>, bagaimana guard mengetahui role yang diwajibkan oleh <code>@Roles(['admin'])</code> pada method yang akan dipanggil?",
    options: {
      a: "Lewat Reflector: <code>this.reflector.get(Roles, context.getHandler())</code>",
      b: "Lewat objek response: <code>context.switchToHttp().getResponse().roles</code>",
      c: "Lewat variabel environment: <code>process.env.ROLES</code>",
      d: "Lewat objek Express: <code>req.route.roles</code>",
    },
    answer: "a",
    explain: "Decorator dari Reflector.createDecorator() menempelkan metadata ke handler; guard membacanya dengan Reflector.get(decorator, context.getHandler()). getHandler() mengembalikan referensi ke handler yang akan dipanggil (NestJS docs, Guards dan Execution context).",
  },
  {
    id: "0023-oral-1", lesson: "0023", topic: "pipeline-guard", type: "oral",
    prompt: "Tulis kode (5 menit, di kertas): guard yang hanya mengizinkan request kalau header <code>x-api-key</code> sama dengan nilai dari <code>ConfigService</code>, kecuali route ditandai decorator <code>@Public()</code>. Tunjukkan decorator-nya dan cara memasang guard secara global.",
    sample: "<pre><code>export const Public = Reflector.createDecorator&lt;boolean&gt;();\n\n@Injectable()\nexport class ApiKeyGuard implements CanActivate {\n  constructor(private reflector: Reflector, private config: ConfigService) {}\n\n  canActivate(context: ExecutionContext): boolean {\n    const isPublic = this.reflector.getAllAndOverride(Public, [context.getHandler(), context.getClass()]);\n    if (isPublic) return true;\n    const req = context.switchToHttp().getRequest();\n    if (req.headers['x-api-key'] !== this.config.get('API_KEY')) {\n      throw new UnauthorizedException('API key tidak valid');\n    }\n    return true;\n  }\n}\n\n// app.module.ts\nproviders: [{ provide: APP_GUARD, useClass: ApiKeyGuard }]\n\n// pemakaian\n@Public() @Get('health') health() { return 'ok'; }</code></pre>",
    checklist: [
      "Class @Injectable() yang mengimplementasikan CanActivate",
      "Request diambil lewat context.switchToHttp().getRequest()",
      "Decorator dibuat dengan Reflector.createDecorator() (atau SetMetadata) dan dibaca dengan Reflector",
      "Metadata dibaca dari handler (dan idealnya class) lewat context.getHandler()/getClass()",
      "Melempar UnauthorizedException (401) alih-alih mengembalikan false (403) untuk kredensial yang salah",
      "Guard global lewat APP_GUARD agar DI (Reflector, ConfigService) berjalan",
    ],
  },
]);
