// Soal lesson 0028 (track Node.js, modul Data & auth) · Otorisasi role: RolesGuard, @Public, 401 vs 403. Format: assets/README.md.
// Sumber: https://docs.nestjs.com/fundamentals/execution-context · https://docs.nestjs.com/guards
// https://docs.nestjs.com/recipes/passport · https://www.rfc-editor.org/rfc/rfc9110#section-15.5.2
QuestionBank.labelTopics({
  "data-rbac": "Data & auth: @Roles + RolesGuard + Reflector, guard global + @Public",
  "data-401-403": "Data & auth: 401 vs 403, cek kepemilikan resource",
});

QuestionBank.register([
  {
    id: "0028-01", lesson: "0028", topic: "data-rbac", type: "mc",
    prompt: "<code>@Roles(['admin'])</code> dipasang di controller dan <code>@Roles(['user'])</code> di salah satu method. <code>RolesGuard</code> membaca <code>getAllAndOverride(Roles, [context.getHandler(), context.getClass()])</code>. Role apa yang dibutuhkan method itu?",
    options: {
      a: "admin dan user, keduanya digabung",
      b: "admin, karena controller selalu menang",
      c: "user, handler dicek lebih dulu",
      d: "Tidak ada, metadata saling membatalkan",
    },
    answer: "c",
    explain: "<code>getAllAndOverride</code> mengembalikan nilai pertama yang terdefinisi sesuai urutan target; handler disebut lebih dulu, jadi <code>['user']</code> menang. Kalau ingin digabung, pakai <code>getAllAndMerge</code>.",
  },
  {
    id: "0028-02", lesson: "0028", topic: "data-rbac", type: "mc",
    prompt: "<code>RolesGuard</code> mengembalikan <code>false</code> untuk user yang sudah login tapi bukan admin. Respons apa yang diterima klien secara default?",
    options: {
      a: "403 Forbidden lewat ForbiddenException otomatis",
      b: "401 Unauthorized lewat UnauthorizedException otomatis",
      c: "404 Not Found, resource disembunyikan",
      d: "500 karena guard dianggap gagal",
    },
    answer: "a",
    explain: "Dokumentasi Nest: saat guard mengembalikan <code>false</code>, framework melempar <code>ForbiddenException</code> dengan body <code>{\"statusCode\": 403, \"message\": \"Forbidden resource\", \"error\": \"Forbidden\"}</code>. Untuk status lain, lempar exception sendiri dari guard.",
  },
  {
    id: "0028-03", lesson: "0028", topic: "data-rbac", type: "mc",
    prompt: "Kenapa guard autentikasi global didaftarkan sebagai provider <code>{ provide: APP_GUARD, useClass: JwtAuthGuard }</code>, bukan <code>app.useGlobalGuards(new JwtAuthGuard())</code> di <code>main.ts</code>?",
    options: {
      a: "useGlobalGuards hanya berlaku untuk platform Fastify",
      b: "APP_GUARD menjalankan guard sesudah semua pipe",
      c: "useGlobalGuards membuat guard berjalan dua kali",
      d: "Guard bisa meng-inject Reflector untuk @Public",
    },
    answer: "d",
    explain: "Guard yang didaftarkan lewat <code>useGlobalGuards()</code> \"cannot inject dependencies, because the registration happens outside the context of any module\". Dengan <code>APP_GUARD</code>, guard dibuat oleh DI container sehingga bisa menerima <code>Reflector</code> untuk membaca metadata <code>@Public()</code>.",
  },
  {
    id: "0028-04", lesson: "0028", topic: "data-401-403", type: "mc",
    prompt: "Request ke <code>GET /orders</code> datang tanpa header <code>Authorization</code> sama sekali. Status yang tepat menurut RFC 9110?",
    options: {
      a: "403, karena request ditolak oleh server",
      b: "401, kredensial autentikasi valid belum ada",
      c: "400, karena header wajib tidak dikirim",
      d: "404, karena route butuh login dulu",
    },
    answer: "b",
    explain: "RFC 9110 §15.5.2: 401 berarti request \"lacks valid authentication credentials for the target resource\", dan respons 401 wajib membawa header <code>WWW-Authenticate</code>. 403 untuk klien yang sudah dikenal tapi tidak berhak.",
  },
  {
    id: "0028-05", lesson: "0028", topic: "data-401-403", type: "mc",
    prompt: "User A (role <code>user</code>, token valid) memanggil <code>PATCH /posts/7</code>, padahal post 7 milik user B. Apa yang benar?",
    options: {
      a: "RolesGuard sudah cukup, role user boleh edit post",
      b: "Kembalikan 401 supaya user A login ulang dulu",
      c: "Cek authorId di service; tolak 403 atau 404",
      d: "Izinkan, karena token user A sudah terverifikasi valid",
    },
    answer: "c",
    explain: "Role tidak tahu pemilik data; kepemilikan dicek di service setelah post dibaca (bug IDOR kalau terlupa). User A sudah terautentikasi, jadi bukan 401. RFC 9110 §15.5.4: 403 untuk kredensial yang tidak cukup, dan server boleh menjawab 404 untuk menyembunyikan keberadaan resource.",
  },
  {
    id: "0028-oral-1", lesson: "0028", topic: "data-rbac", type: "oral",
    prompt: "Tulis kode (di kertas, 5 menit): decorator <code>@Roles</code> dan <code>RolesGuard</code> supaya <code>DELETE /posts/:id</code> hanya bisa dipanggil admin. Role boleh dipasang di controller atau method; yang di method menang. Route tanpa <code>@Roles</code> tetap terbuka bagi user yang sudah login.",
    sample: "<pre><code>export const Roles = Reflector.createDecorator&lt;string[]&gt;();\n\n@Injectable()\nexport class RolesGuard implements CanActivate {\n  constructor(private reflector: Reflector) {}\n\n  canActivate(context: ExecutionContext): boolean {\n    const required = this.reflector.getAllAndOverride(Roles, [\n      context.getHandler(), context.getClass(),\n    ]);\n    if (!required) return true;\n    const { user } = context.switchToHttp().getRequest();\n    return required.some((r) =&gt; user?.roles?.includes(r));\n  }\n}\n\n@UseGuards(JwtAuthGuard, RolesGuard)\n@Roles(['admin'])\n@Delete(':id')\nremove(@Param('id', ParseIntPipe) id: number) { return this.posts.remove(id); }</code></pre><p>Guard autentikasi jalan dulu supaya <code>req.user</code> terisi; <code>false</code> menghasilkan 403.</p>",
    checklist: [
      "decorator @Roles (Reflector.createDecorator atau SetMetadata)",
      "RolesGuard implements CanActivate yang meng-inject Reflector",
      "metadata dibaca dari handler dan class dengan getAllAndOverride (method menang)",
      "route tanpa @Roles diizinkan (return true)",
      "membandingkan dengan request.user.roles; guard autentikasi jalan lebih dulu",
      "false menghasilkan 403, bukan 401",
    ],
  },
]);
