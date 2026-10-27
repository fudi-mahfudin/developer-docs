// Soal lesson 0018 (track FHIR, modul SMART): authorization code + PKCE untuk SPA, state.
// Dipecah dari bank lama 0005 (lihat .scratch/restruktur-fhir/), ditambah 2 soal kuis dan 1 soal lisan baru. Lihat assets/README.md di root.
// Sumber: SMART App Launch IG v2.2.0 (STU 2.2), RFC 7636.
QuestionBank.labelTopics({
  "smart-pkce": "SMART: authorization code + PKCE untuk SPA",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0018-01", lesson: "0018", topic: "smart-pkce", type: "mc",
    prompt: "Kenapa React SPA (public client) wajib memakai PKCE, bukan <code>client_secret</code>?",
    options: {
      a: "PKCE membuat access token berlaku lebih lama di browser",
      b: "PKCE menggantikan TLS sehingga HTTPS tidak lagi diperlukan app",
      c: "PKCE mengenkripsi seluruh data pasien di dalam respons server",
      d: "Secret di bundle JS terbaca, dan code bisa dicegat",
    },
    answer: "d",
    explain: "SPA adalah public client: secret yang ditanam di app \"can potentially be extracted\". PKCE (RFC 7636) melawan authorization code interception: penyerang yang mencegat <code>code</code> tidak punya <code>code_verifier</code>, jadi tidak bisa menukarnya. SMART: \"All SMART apps SHALL support PKCE\".",
  },
  {
    id: "0018-02", lesson: "0018", topic: "smart-pkce", type: "mc",
    prompt: "Kapan app mengirim <code>code_verifier</code> aslinya ke server?",
    options: {
      a: "Saat <code>POST</code> ke token endpoint, menukar authorization code",
      b: "Saat redirect ke authorize, bersama <code>code_challenge</code> dan <code>state</code>",
      c: "Di header <code>Authorization</code> pada setiap request FHIR berikutnya",
      d: "Saat registrasi app, cukup sekali saja, bersama <code>redirect_uri</code>",
    },
    answer: "a",
    explain: "Di authorize request hanya <code>code_challenge</code> (hash dari verifier) yang dikirim. Verifier aslinya wajib di token request: \"used to verify against the code_challenge parameter previously provided in the authorize request\". Server menghitung ulang <code>BASE64URL(SHA256(code_verifier))</code> dan membandingkannya (RFC 7636 §4.6).",
  },
  {
    id: "0018-03", lesson: "0018", topic: "smart-pkce", type: "mc",
    prompt: "Bagaimana <code>code_challenge</code> dibuat dengan metode <code>S256</code>?",
    options: {
      a: "Mengenkripsi <code>client_id</code> dengan public key milik server",
      b: "Base64url dari SHA-256 atas <code>code_verifier</code> yang acak",
      c: "Menandatangani <code>state</code> memakai private key milik app",
      d: "Mengirim <code>code_verifier</code> mentah tanpa transformasi apa pun",
    },
    answer: "b",
    explain: "RFC 7636: <code>code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))</code>. <code>code_verifier</code> adalah string acak 43–128 karakter. Mengirim verifier apa adanya adalah metode <code>plain</code>, yang SHALL NOT didukung server SMART.",
  },
  {
    id: "0018-04", lesson: "0018", topic: "smart-pkce", type: "mc",
    prompt: "Token request membawa <code>code_verifier</code> yang hash-nya tidak cocok dengan <code>code_challenge</code>. Apa yang terjadi?",
    options: {
      a: "Server tetap menerbitkan token, tapi tanpa refresh token",
      b: "Server meminta user login ulang di halaman authorize",
      c: "Server menurunkan metode ke <code>plain</code> lalu mencoba lagi",
      d: "Ditolak dengan error <code>invalid_grant</code>; access token tidak terbit",
    },
    answer: "d",
    explain: "RFC 7636 §4.6: server menghitung challenge dari <code>code_verifier</code> yang diterima dan membandingkannya dengan <code>code_challenge</code> yang disimpan bersama code; kalau tidak sama, server mengembalikan error <code>invalid_grant</code>. Jadi penyerang yang mencegat code tanpa verifier tidak mendapat token. Turun ke <code>plain</code> juga tidak mungkin: server SMART SHALL NOT mendukungnya.",
  },
  {
    id: "0018-05", lesson: "0018", topic: "smart-pkce", type: "mc",
    prompt: "Apa fungsi parameter <code>state</code> di authorize request SMART?",
    options: {
      a: "Menyimpan ID pasien yang dipilih user",
      b: "Menentukan versi FHIR yang dipakai server",
      c: "Mencegah CSRF; app memvalidasinya di <code>redirect_uri</code>",
      d: "Menggantikan <code>code_verifier</code> saat menukar access token",
    },
    answer: "c",
    explain: "<code>state</code> wajib, tidak bisa ditebak (minimal 122 bit entropi, mis. UUID acak), dipakai mencegah CSRF/session fixation, dan app SHALL memvalidasinya saat kembali ke <code>redirect_uri</code>. PKCE dan <code>state</code> saling melengkapi, bukan saling menggantikan.",
  },
  {
    id: "0018-oral-1", lesson: "0018", topic: "smart-pkce", type: "oral",
    prompt: "\"React SPA kami tidak punya client secret. Bagaimana PKCE tetap melindungi authorization code?\" (60 detik)",
    sample: "SPA adalah public client: secret apa pun di bundle JS bisa diekstrak, jadi tidak ada client authentication. Risikonya authorization code interception: siapa pun yang mencegat <code>code</code> bisa menukarnya menjadi token. Dengan PKCE, app membuat <code>code_verifier</code> acak 43–128 karakter dan menyimpannya sementara, lalu mengirim <code>code_challenge</code> = BASE64URL(SHA256(verifier)) dengan <code>code_challenge_method=S256</code> di authorize request; SMART mewajibkan S256 dan melarang <code>plain</code>. Server menyimpan challenge itu bersama code. Saat menukar code di token endpoint, app mengirim verifier aslinya; server menghitung ulang hash-nya dan membandingkan, kalau beda dijawab <code>invalid_grant</code>. Penyerang yang hanya punya code tidak punya verifier. PKCE tidak menggantikan <code>state</code>: <code>state</code> acak tetap dikirim dan divalidasi di <code>redirect_uri</code> untuk mencegah CSRF, dan <code>aud</code> diisi FHIR base URL.",
    checklist: [
      "SPA = public client: secret di bundle JS bisa diekstrak, tanpa client authentication",
      "ancaman: authorization code interception (code dicegat lalu ditukar penyerang)",
      "code_verifier acak 43–128 karakter, disimpan sementara di app",
      "code_challenge = BASE64URL(SHA256(verifier)), method S256 di authorize; plain tidak didukung",
      "verifier dikirim di token request; server hitung ulang dan bandingkan, beda = invalid_grant",
      "state tetap dipakai melawan CSRF dan divalidasi di redirect_uri",
    ],
  },
]);
