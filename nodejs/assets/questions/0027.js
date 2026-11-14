// Soal lesson 0027 (track Node.js, modul Data & auth) · Autentikasi: hashing password, JWT, Passport. Format: assets/README.md.
// Sumber: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html · https://www.rfc-editor.org/rfc/rfc7519
// https://www.rfc-editor.org/rfc/rfc6749#section-1.5 · https://docs.nestjs.com/recipes/passport
QuestionBank.labelTopics({
  "data-hash-password": "Data & auth: hashing password (argon2id, bcrypt)",
  "data-jwt-passport": "Data & auth: JWT access/refresh token, @nestjs/jwt, Passport",
});

QuestionBank.register([
  {
    id: "0027-01", lesson: "0027", topic: "data-hash-password", type: "mc",
    prompt: "SHA-256 adalah fungsi satu arah. Kenapa tetap tidak dipakai untuk menyimpan password?",
    options: {
      a: "SHA-256 bisa didekripsi dengan kunci rahasia server",
      b: "SHA-256 menghasilkan hash terlalu panjang untuk disimpan",
      c: "SHA-256 tidak tersedia di modul crypto Node",
      d: "Terlalu cepat, penyerang bisa menebak miliaran kali",
    },
    answer: "d",
    explain: "OWASP: \"Fast hashing algorithms such as SHA-256 are not suitable for password storage.\" Kalau database bocor, hash cepat bisa ditebak secara massal. Algoritma password (Argon2id, scrypt, bcrypt) sengaja lambat dan bisa diatur biayanya.",
  },
  {
    id: "0027-02", lesson: "0027", topic: "data-hash-password", type: "mc",
    prompt: "Menurut OWASP Password Storage Cheat Sheet, algoritma mana pilihan pertama untuk menyimpan password di proyek baru?",
    options: {
      a: "bcrypt dengan work factor 4",
      b: "Argon2id, minimal 19 MiB memori",
      c: "SHA-512 dengan salt per user",
      d: "AES-256 dengan kunci di env",
    },
    answer: "b",
    explain: "OWASP: \"Use Argon2id with a minimum configuration of 19 MiB of memory, an iteration count of 2, and 1 degree of parallelism.\" bcrypt untuk sistem lama dengan work factor 10 atau lebih; SHA-512 terlalu cepat; AES adalah enkripsi (bisa dibalik), bukan hashing.",
  },
  {
    id: "0027-03", lesson: "0027", topic: "data-jwt-passport", type: "mc",
    prompt: "Access token JWT (bentuk JWS, ditandatangani) berisi <code>{ sub, email, role }</code>. Pernyataan mana yang benar tentang payload-nya?",
    options: {
      a: "Payload terenkripsi, hanya server yang bisa membacanya",
      b: "Payload bisa diubah klien tanpa terdeteksi server",
      c: "Terbaca siapa pun; perubahan merusak tanda tangan",
      d: "Payload hanya berlaku sampai server di-restart ulang",
    },
    answer: "c",
    explain: "RFC 7519: claim JWT adalah objek JSON yang menjadi payload JWS (ditandatangani) atau JWE (dienkripsi). JWS hanya di-encode base64url, jadi siapa pun bisa membacanya; tanda tangan mencegah perubahan. Karena itu jangan taruh data rahasia di payload.",
  },
  {
    id: "0027-04", lesson: "0027", topic: "data-jwt-passport", type: "mc",
    prompt: "Kenapa access token dibuat berumur pendek (menit) dan dipasangkan dengan refresh token?",
    options: {
      a: "JWT tidak bisa ditarik sebelum exp; refresh bisa dicabut",
      b: "Supaya payload JWT cukup kecil untuk muat di cookie",
      c: "Refresh token mempercepat verifikasi tanda tangan setiap request masuk",
      d: "RFC 7519 mewajibkan exp maksimal lima belas menit saja",
    },
    answer: "a",
    explain: "Server memverifikasi JWT tanpa lookup, jadi token yang bocor tetap berlaku sampai <code>exp</code>. Umur pendek membatasi kerusakan. Refresh token (RFC 6749 §1.5: kredensial untuk mendapatkan access token baru) disimpan server-side sehingga bisa dicabut saat logout. RFC 7519 tidak menetapkan durasi.",
  },
  {
    id: "0027-05", lesson: "0027", topic: "data-jwt-passport", type: "mc",
    prompt: "Di <code>@nestjs/passport</code>, apa yang terjadi dengan nilai yang dikembalikan <code>validate()</code> milik strategy (mis. <code>JwtStrategy</code>)?",
    options: {
      a: "Dikirim ke klien sebagai body response login",
      b: "Dipasang ke req.user untuk dibaca handler berikutnya",
      c: "Disimpan ke database sebagai sesi user aktif",
      d: "Dipakai sebagai secret untuk menandatangani token baru",
    },
    answer: "b",
    explain: "Passport memasang nilai kembalian <code>validate()</code> ke <code>req.user</code>. Untuk <code>JwtStrategy</code>, signature dan <code>exp</code> sudah diverifikasi sebelum <code>validate(payload)</code> dipanggil, jadi Anda cukup memetakan payload, mis. <code>{ userId: payload.sub }</code>.",
  },
  {
    id: "0027-oral-1", lesson: "0027", topic: "data-jwt-passport", type: "oral",
    prompt: "Tulis kode (di kertas, 5 menit): <code>AuthService.signIn(email, password)</code>: cari user lewat Prisma, verifikasi password dengan argon2, lalu kembalikan access token JWT. Kalau gagal, respons harus sama untuk email salah maupun password salah.",
    sample: "<pre><code>@Injectable()\nexport class AuthService {\n  constructor(private prisma: PrismaService, private jwt: JwtService) {}\n\n  async signIn(email: string, password: string) {\n    const user = await this.prisma.user.findUnique({ where: { email } });\n    if (!user || !(await argon2.verify(user.passwordHash, password))) {\n      throw new UnauthorizedException('Email atau password salah');\n    }\n    return { access_token: await this.jwt.signAsync({ sub: user.id }) };\n  }\n}</code></pre><p>Email dan password salah memberi 401 dengan pesan sama; payload hanya <code>sub</code>; umur token pendek lewat <code>expiresIn</code>.</p>",
    checklist: [
      "PrismaService dan JwtService di-inject lewat constructor",
      "verifikasi dengan argon2.verify (atau bcrypt.compare), bukan membandingkan string atau hash cepat",
      "UnauthorizedException (401) dengan pesan yang sama untuk email dan password salah",
      "claim sub untuk ID user di payload",
      "tidak ada data rahasia (password, hash) di payload JWT",
      "access token berumur pendek (expiresIn) dan secret dari env var",
    ],
  },
]);
