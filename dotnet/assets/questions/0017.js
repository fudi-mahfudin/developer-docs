// Soal lesson 0017: JWT, authentication vs authorization, CORS, error handling (ProblemDetails). Lihat assets/README.md.
QuestionBank.labelTopics({
  "fs-jwt": "JWT (struktur & validasi)",
  "fs-authn-authz": "Authentication vs authorization (401/403)",
  "fs-cors": "CORS & preflight",
  "fs-problem-details": "Global error handling & ProblemDetails",
  "fs-token-storage": "Menyimpan JWT: localStorage vs httpOnly cookie",
});

// Urutan registrasi diselang-seling antar topik (interleaving) dan posisi jawaban bervariasi.
// Lesson merender fs-jwt + fs-authn-authz di Latihan 2, fs-cors + fs-problem-details + fs-token-storage di Latihan 3.
QuestionBank.register([
  {
    id: "0017-01", lesson: "0017", topic: "fs-authn-authz", type: "mc",
    prompt: "Apa beda authentication dan authorization di ASP.NET Core?",
    options: {
      a: "Authentication memeriksa izin, authorization memeriksa identitas user",
      b: "Authentication menentukan identitas, authorization menentukan akses resource",
      c: "Keduanya identik, hanya berbeda nama method middleware-nya",
      d: "Authentication dikerjakan Angular, authorization dikerjakan oleh database",
    },
    answer: "b",
    explain: "\"Authentication is the process of determining a user's identity. Authorization is the process of determining whether a user has access to a resource.\" Authorization bergantung pada authentication, karena itu <code>UseAuthentication</code> dipanggil sebelum <code>UseAuthorization</code> (lesson 0005).",
  },
  {
    id: "0017-02", lesson: "0017", topic: "fs-jwt", type: "mc",
    prompt: "Isi payload JWT yang ditandatangani (JWS) bisa dibaca oleh siapa?",
    options: {
      a: "Hanya server yang memegang signing key",
      b: "Hanya browser yang menerima token tersebut",
      c: "Tidak ada, karena payload selalu dienkripsi",
      d: "Siapa saja, karena hanya base64url encoded",
    },
    answer: "d",
    explain: "OWASP: \"The payload is only base64url encoded, not encrypted, so anyone who obtains the token can read every claim.\" Signature hanya menjamin token tidak diubah. Jangan taruh data sensitif (password, NIK) di claims.",
  },
  {
    id: "0017-03", lesson: "0017", topic: "fs-cors", type: "mc",
    prompt: "Angular di <code>http://localhost:4200</code> memanggil API di <code>https://localhost:7001</code>. Siapa yang memblokir response kalau CORS belum dikonfigurasi?",
    options: {
      a: "Browser, karena origin berbeda (same-origin policy)",
      b: "API, karena UseAuthorization menolak request anonim",
      c: "Angular, karena HttpClient memeriksa origin dulu",
      d: "Firewall, karena port 4200 tidak dibuka",
    },
    answer: "a",
    explain: "Same-origin policy ditegakkan oleh browser: \"Browser security prevents a web page from making requests to a different domain than the one that served the web page.\" Beda port saja sudah beda origin. API mengirim header CORS untuk melonggarkannya; Postman/curl tidak terkena CORS karena bukan browser.",
  },
  {
    id: "0017-04", lesson: "0017", topic: "fs-problem-details", type: "mc",
    prompt: "Di .NET 8, apa fungsi <code>IExceptionHandler</code> yang didaftarkan dengan <code>AddExceptionHandler&lt;T&gt;()</code>?",
    options: {
      a: "Mengganti try/catch di setiap Service secara otomatis",
      b: "Menulis log ke file tanpa mengubah response",
      c: "Callback terpusat untuk memetakan exception ke response",
      d: "Validasi DTO sebelum request sampai ke Controller",
    },
    answer: "c",
    explain: "<code>IExceptionHandler</code> \"gives the developer a callback for handling known exceptions in a central location\". Return <code>true</code> dari <code>TryHandleAsync</code> = sudah ditangani. Lifetime-nya Singleton. Dijalankan oleh middleware <code>UseExceptionHandler()</code>, yang ditaruh paling awal di pipeline.",
  },
  {
    id: "0017-05", lesson: "0017", topic: "fs-token-storage", type: "mc",
    prompt: "Risiko utama menyimpan JWT di <code>localStorage</code> adalah…",
    options: {
      a: "Token hilang setiap kali tab browser ditutup",
      b: "Script hasil XSS bisa membaca dan mencurinya",
      c: "Token otomatis terkirim ke semua domain lain",
      d: "Browser menolak menyimpan string yang terlalu panjang",
    },
    answer: "b",
    explain: "OWASP: \"Do not store session identifiers in local storage as the data is always accessible by JavaScript.\" Satu celah XSS = token dicuri. \"Cookies can mitigate this risk using the <code>httpOnly</code> flag.\" (Yang hilang saat tab ditutup itu <code>sessionStorage</code>.)",
  },
  {
    id: "0017-06", lesson: "0017", topic: "fs-authn-authz", type: "mc",
    prompt: "User sudah login dengan JWT valid, tapi memanggil endpoint <code>[Authorize(Roles = \"Admin\")]</code> tanpa role Admin. Response JWT bearer-nya?",
    options: {
      a: "401 Unauthorized dengan header WWW-Authenticate: Bearer challenge",
      b: "500 Internal Server Error dari exception handler",
      c: "400 Bad Request dengan ValidationProblemDetails dari ApiController",
      d: "403 Forbidden karena identitas valid tanpa izin",
    },
    answer: "d",
    explain: "Challenge (belum terautentikasi): \"A JWT bearer scheme returning a 401 result with a <code>www-authenticate: bearer</code> header.\" Forbid (terautentikasi tapi tidak berhak): \"A JWT bearer scheme returning a 403 result.\" Hafalkan: 401 = siapa kamu?, 403 = aku tahu kamu, tapi tidak boleh.",
  },
  {
    id: "0017-07", lesson: "0017", topic: "fs-jwt", type: "mc",
    prompt: "Apa saja yang wajib divalidasi API saat menerima JWT bearer token?",
    options: {
      a: "Signature, issuer, audience, dan masa berlaku token",
      b: "Hanya format tiga bagian yang dipisah titik",
      c: "Username dan password yang ada di payload",
      d: "Origin request dan header CORS dari browser",
    },
    answer: "a",
    explain: "Microsoft Learn: validasi \"Signature, for trust and integrity\", \"Issuer claim\", \"Audience claim\", dan \"Token expiration\". Kalau salah satu gagal, \"the API should return a 401 response.\" Di .NET diatur lewat <code>TokenValidationParameters</code> pada <code>AddJwtBearer</code>.",
  },
  {
    id: "0017-08", lesson: "0017", topic: "fs-cors", type: "mc",
    prompt: "Kenapa <code>POST /api/products</code> dengan header <code>Authorization: Bearer …</code> dari Angular memicu request <code>OPTIONS</code> lebih dulu?",
    options: {
      a: "Karena Angular selalu mengirim OPTIONS sebelum setiap POST",
      b: "Karena ASP.NET Core meminta konfirmasi sebelum menulis data",
      c: "Karena header Authorization bukan header aman, jadi preflight",
      d: "Karena JWT harus divalidasi dulu lewat endpoint terpisah",
    },
    answer: "c",
    explain: "Browser boleh melewati preflight hanya jika header yang di-set terbatas pada <code>Accept</code>, <code>Accept-Language</code>, <code>Content-Language</code>, <code>Content-Type</code>, <code>Last-Event-ID</code> (dan Content-Type tertentu). <code>Authorization</code> dan <code>application/json</code> tidak termasuk, jadi browser mengirim preflight <code>OPTIONS</code>. Policy CORS harus mengizinkan header itu (<code>WithHeaders</code>/<code>AllowAnyHeader</code>).",
  },
  {
    id: "0017-09", lesson: "0017", topic: "fs-problem-details", type: "mc",
    prompt: "Apa yang terjadi setelah <code>builder.Services.AddProblemDetails()</code> dan <code>app.UseExceptionHandler()</code>?",
    options: {
      a: "Exception tak tertangani menjadi response ProblemDetails berformat JSON",
      b: "Semua exception diabaikan dan response selalu 200 OK",
      c: "Stack trace lengkap dikirim ke client di production",
      d: "Angular otomatis menampilkan dialog error tanpa kode tambahan",
    },
    answer: "a",
    explain: "Dengan <code>AddProblemDetails</code>, <code>ExceptionHandlerMiddleware</code> \"Generates a problem details response when a custom handler is not defined\". ProblemDetails (RFC 9457, pengganti RFC 7807) membawa \"machine-readable details of errors\": <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>. Jangan bocorkan detail exception di production.",
  },
  {
    id: "0017-10", lesson: "0017", topic: "fs-token-storage", type: "mc",
    prompt: "Kalau JWT disimpan di cookie <code>HttpOnly</code>, risiko baru apa yang harus Anda tangani?",
    options: {
      a: "XSS langsung bisa membaca isi cookie tersebut",
      b: "Token tidak bisa dikirim ke API lagi",
      c: "Payload JWT otomatis terenkripsi oleh browser modern",
      d: "CSRF, karena browser otomatis melampirkan cookie itu",
    },
    answer: "d",
    explain: "OWASP CSRF: \"browser requests automatically include all cookies including session cookies\". Mitigasi: atribut <code>SameSite</code> dan token anti-CSRF. Angular <code>HttpClient</code> sudah mengurus sisi client: membaca cookie <code>XSRF-TOKEN</code> dan mengirim header <code>X-XSRF-TOKEN</code>, tapi \"supports only the client half\" — server tetap harus memverifikasi.",
  },
  {
    id: "0017-11", lesson: "0017", topic: "fs-cors", type: "mc",
    prompt: "Konfigurasi CORS mana yang dianggap tidak aman oleh dokumentasi ASP.NET Core?",
    options: {
      a: "Hanya WithOrigins localhost:4200 dengan AllowAnyHeader dan AllowAnyMethod",
      b: "AllowAnyOrigin digabung dengan AllowCredentials pada policy sama",
      c: "UseCors dipanggil sesudah UseRouting dan sebelum UseAuthorization",
      d: "Policy bernama diterapkan lewat atribut [EnableCors] saja",
    },
    answer: "b",
    explain: "\"Specifying <code>AllowAnyOrigin</code> and <code>AllowCredentials</code> is an insecure configuration and can result in cross-site request forgery.\" Sebutkan origin secara eksplisit, tanpa garis miring di akhir URL. Ingat juga: \"CORS is <strong>not</strong> a security feature, CORS relaxes security.\"",
  },
  {
    id: "0017-12", lesson: "0017", topic: "fs-jwt", type: "mc",
    prompt: "Bagaimana API tahu siapa user-nya setelah <code>JwtBearerHandler</code> memvalidasi token?",
    options: {
      a: "Dari tabel session database yang dicari setiap request",
      b: "Dari cookie session buatan Angular setelah login berhasil",
      c: "Dari claims token, diisi ke HttpContext.User sebagai ClaimsPrincipal",
      d: "Dari header Origin yang dikirim browser bersama request",
    },
    answer: "c",
    explain: "\"The <code>JwtBearerHandler</code> validates the token and extracts the user's identity from its claims.\" Authentication menghasilkan <code>ClaimsPrincipal</code> di <code>HttpContext.User</code> \"for authorization to make permission decisions against\". JWT itu self-contained: tidak perlu lookup session (padanan Express: <code>req.user</code> dari passport-jwt).",
  },
  {
    id: "0017-oral-1", lesson: "0017", topic: "fs-authn-authz", type: "oral",
    prompt: "Jelaskan alur login aplikasi Anda, dari form Angular sampai API, termasuk apa yang terjadi saat token tidak valid atau terjadi error.",
    sample: "\"User mengisi form login Reactive Forms; <code>AuthService</code> mengirim <code>POST /api/auth/login</code> lewat <code>HttpClient</code>. Karena Angular di port 4200 dan API di port lain, browser menerapkan same-origin policy, jadi API mengaktifkan CORS untuk origin Angular saja. API memeriksa kredensial dan menerbitkan JWT: header.payload.signature, berisi claims seperti <code>sub</code>, role, <code>exp</code>, ditandatangani key yang disimpan di User Secrets. Di Angular, <code>AuthInterceptor</code> meng-<code>clone</code> setiap request dan menambahkan <code>Authorization: Bearer</code>. Di API, <code>UseAuthentication</code> memvalidasi signature, issuer, audience, dan expiry lalu mengisi <code>HttpContext.User</code>; <code>UseAuthorization</code> memeriksa <code>[Authorize]</code> atau <code>[Authorize(Roles = \"Admin\")]</code>. Token tidak valid atau kedaluwarsa = 401, interceptor mengarahkan ke /login; login tapi tidak berhak = 403. Exception lain ditangkap <code>IExceptionHandler</code> dan dikembalikan sebagai ProblemDetails, misalnya <code>ValidationException</code> jadi 400 dan <code>NotFoundException</code> jadi 404, tanpa stack trace di production.\"",
    checklist: [
      "Frontend: form login → AuthService → HttpClient POST /api/auth/login",
      "API menerbitkan JWT (header.payload.signature, claims + exp), key di User Secrets",
      "Interceptor Angular: clone request + header Authorization: Bearer",
      "Backend: UseAuthentication memvalidasi token (signature, issuer, audience, expiry) → HttpContext.User; UseAuthorization + [Authorize]/Roles",
      "401 (token tidak valid, interceptor → /login) vs 403 (login tapi tidak berhak)",
      "Error global: IExceptionHandler + AddProblemDetails → ProblemDetails (400/404/500), CORS hanya untuk origin Angular",
    ],
  },
  {
    id: "0017-oral-2", lesson: "0017", topic: "fs-token-storage", type: "oral",
    prompt: "Apa itu CORS, kenapa API Anda perlu mengonfigurasinya, dan di mana Anda menyimpan JWT di frontend?",
    sample: "\"Browser menerapkan same-origin policy: halaman dari <code>localhost:4200</code> tidak boleh membaca response dari origin lain. CORS adalah cara server melonggarkannya dengan header seperti <code>Access-Control-Allow-Origin</code>; untuk request dengan header <code>Authorization</code> atau JSON, browser mengirim preflight <code>OPTIONS</code> dulu. Jadi CORS bukan fitur keamanan, justru melonggarkan keamanan; di .NET saya pakai <code>WithOrigins</code> untuk origin Angular saja, <code>UseCors</code> sesudah <code>UseRouting</code> dan sebelum auth, dan tidak pernah <code>AllowAnyOrigin</code> + <code>AllowCredentials</code>. Padanan Express-nya package <code>cors</code>. Untuk JWT: <code>localStorage</code> mudah dan cocok dengan interceptor, tapi bisa dibaca script hasil XSS. Cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite</code> tidak bisa dibaca JavaScript, tapi otomatis terkirim sehingga perlu proteksi CSRF; Angular membantu lewat <code>XSRF-TOKEN</code>. Microsoft menyarankan pola backend-for-frontend dengan cookie HttpOnly untuk aplikasi production; di mini project saya pakai localStorage + token berumur pendek dan sadar trade-off-nya.\"",
    checklist: [
      "Same-origin policy ditegakkan browser; beda port = beda origin; Postman tidak terkena",
      "CORS = server melonggarkan lewat header Access-Control-*; bukan fitur keamanan",
      "Preflight OPTIONS untuk header Authorization / JSON; policy harus mengizinkan header itu",
      "Konfigurasi .NET: WithOrigins spesifik, UseCors sesudah UseRouting sebelum auth, jangan AllowAnyOrigin + AllowCredentials",
      "localStorage: mudah + cocok interceptor, tapi terbaca oleh XSS",
      "httpOnly cookie: aman dari pembacaan JS, tapi perlu proteksi CSRF (SameSite, XSRF-TOKEN); sebut pilihan Anda + alasannya",
    ],
  },
]);
