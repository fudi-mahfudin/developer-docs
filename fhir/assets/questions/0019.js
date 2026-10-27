// Soal lesson 0019 (track FHIR, modul SMART): scopes (patient/user/system, v1 vs v2, openid, offline_access), backend services.
// Dipecah dari bank lama 0005 (lihat .scratch/restruktur-fhir/). Lihat assets/README.md di root.
// Sumber: SMART App Launch IG v2.2.0 (STU 2.2).
QuestionBank.labelTopics({
  "smart-scopes": "SMART: scopes (patient/user/system, v1 vs v2, openid, offline_access)",
  "smart-backend": "SMART: backend services (client credentials + JWT)",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0019-01", lesson: "0019", topic: "smart-scopes", type: "mc",
    prompt: "Scope SMART v2 mana yang setara dengan scope v1 <code>patient/Observation.read</code>?",
    options: {
      a: "<code>patient/Observation.rs</code>",
      b: "<code>patient/Observation.r</code>",
      c: "<code>user/Observation.cruds</code>",
      d: "<code>system/Observation.rs</code>",
    },
    answer: "a",
    explain: "Aturan kompatibilitas di IG: v1 <code>.read</code> ⇒ v2 <code>.rs</code> (read + search), v1 <code>.write</code> ⇒ <code>.cud</code>, v1 <code>.*</code> ⇒ <code>.cruds</code>. <code>.r</code> saja tidak mencakup search.",
  },
  {
    id: "0019-02", lesson: "0019", topic: "smart-backend", type: "mc",
    prompt: "Job Node malam hari menjalankan Bulk <code>$export</code> tanpa user. Alur SMART mana yang dipakai?",
    options: {
      a: "Standalone launch dengan scope <code>launch/patient</code> untuk memilih pasien",
      b: "EHR launch dengan scope <code>offline_access</code> untuk refresh token",
      c: "Authorization code + PKCE dengan scope <code>openid fhirUser</code>",
      d: "Backend Services: <code>client_credentials</code> + JWT ber-tanda-tangan, scope <code>system/</code>",
    },
    answer: "d",
    explain: "Backend Services dipakai saat tidak ada user yang mengotorisasi di runtime, dan \"is designed to work with FHIR Bulk Data Access\". Client mengirim <code>grant_type=client_credentials</code> + <code>client_assertion</code> (JWT ditandatangani private key) dan meminta scope <code>system/</code>, mis. <code>system/*.rs</code>.",
  },
  {
    id: "0019-03", lesson: "0019", topic: "smart-scopes", type: "mc",
    prompt: "App meminta <code>patient/*.cruds</code>, tetapi token response berisi <code>scope: \"patient/*.rs\"</code>. Apa artinya?",
    options: {
      a: "Server error; app harus mengulang authorize sampai cocok",
      b: "Scope yang diberikan boleh berbeda; app harus menyesuaikan",
      c: "App tetap boleh menulis karena sudah meminta <code>.cruds</code>",
      d: "Token tidak sah karena scope tidak sama persis",
    },
    answer: "b",
    explain: "Token response: <code>scope</code> = \"Scope of access authorized. Note that this can be different from the scopes requested by the app.\" Best practice: periksa scope yang diberikan, misalnya sembunyikan tombol simpan kalau tidak ada <code>.c</code>/<code>.u</code>.",
  },
  {
    id: "0019-04", lesson: "0019", topic: "smart-backend", type: "mc",
    prompt: "Pernyataan mana yang benar tentang token dari SMART Backend Services?",
    options: {
      a: "Berumur pendek, sekitar lima menit, dan tanpa refresh token",
      b: "Berumur panjang dan selalu disertai <code>refresh_token</code> untuk job malam",
      c: "Diterbitkan setelah user menyetujui consent screen di browser admin",
      d: "Ditukar dari authorization code yang diterima di <code>redirect_uri</code> app",
    },
    answer: "a",
    explain: "Backend Services: token \"SHALL be short-lived; the expires_in value SHOULD NOT exceed 300\" (5 menit) dan \"Refresh tokens SHOULD NOT be issued\". Untuk akses lebih lama, buat JWT assertion baru dan minta token baru.",
  },
  {
    id: "0019-05", lesson: "0019", topic: "smart-scopes", type: "mc",
    prompt: "App butuh identitas user yang login sebagai resource FHIR (mis. <code>Practitioner/123</code>). Scope apa?",
    options: {
      a: "<code>user/Practitioner.cruds</code> dan <code>launch</code>",
      b: "<code>offline_access</code> dan <code>online_access</code>",
      c: "<code>openid</code> dan <code>fhirUser</code>",
      d: "<code>system/*.rs</code> dan <code>launch/encounter</code>",
    },
    answer: "c",
    explain: "<code>openid fhirUser</code> menghasilkan <code>id_token</code> (OpenID Connect) di samping access token; klaim <code>fhirUser</code> berisi URL resource user, bertipe Patient, Practitioner, PractitionerRole, RelatedPerson, atau Person.",
  },
  {
    id: "0019-oral-1", lesson: "0019", topic: "smart-backend", type: "oral",
    prompt: "\"Service Node kami perlu menarik data populasi tiap malam lewat Bulk Data <code>$export</code>. Bagaimana autentikasinya?\" (60 detik)",
    sample: "Itu kasus SMART Backend Services, karena tidak ada user di runtime. Satu kali di awal kami mendaftarkan client ke authorization server dengan public key, berupa JWKS atau URL JWKS; private key tetap di server kami, misalnya di secret manager. Setiap kali butuh token, service membuat JWT sekali pakai berisi <code>iss</code> dan <code>sub</code> = client_id, <code>aud</code> = token URL, <code>exp</code> maksimal 5 menit ke depan, dan <code>jti</code> unik, ditandatangani RS384 atau ES384. Lalu POST ke token endpoint dengan <code>grant_type=client_credentials</code>, <code>client_assertion_type</code> jwt-bearer, <code>client_assertion</code>, dan scope <code>system/</code>, misalnya <code>system/Patient.rs system/Observation.rs</code>, sesempit mungkin. Token-nya berumur pendek, sekitar 5 menit, tanpa refresh token, jadi untuk polling <code>$export</code> yang lama kami minta token baru saat kedaluwarsa.",
    checklist: [
      "Backend Services karena tidak ada user yang mengotorisasi",
      "registrasi public key (JWKS), private key tetap di server",
      "JWT assertion: iss/sub = client_id, aud = token URL, exp ≤ 5 menit, jti unik",
      "ditandatangani RS384 atau ES384",
      "grant_type=client_credentials + client_assertion, scope system/ seminimal mungkin",
      "token pendek (≤ 300 detik), tanpa refresh token: minta token baru saat perlu",
    ],
  },
]);
