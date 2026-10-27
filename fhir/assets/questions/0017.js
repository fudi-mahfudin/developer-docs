// Soal lesson 0017 (track FHIR, modul SMART): SMART = OAuth 2.0 untuk FHIR, EHR launch vs standalone, discovery.
// Dipecah dari bank lama 0005 (lihat .scratch/restruktur-fhir/), ditambah 2 soal kuis baru. Lihat assets/README.md di root.
// Sumber: SMART App Launch IG v2.2.0 (STU 2.2).
QuestionBank.labelTopics({
  "smart-launch": "SMART: EHR launch vs standalone, launch context",
  "smart-discovery": "SMART: discovery .well-known/smart-configuration",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0017-01", lesson: "0017", topic: "smart-launch", type: "mc",
    prompt: "Pasien membuka app Anda dari home screen (standalone). Bagaimana app mendapat konteks pasien?",
    options: {
      a: "Membaca parameter <code>launch</code> dari URL yang dikirim EHR",
      b: "Mengambil <code>Patient</code> pertama dari hasil search tanpa filter",
      c: "Meminta scope <code>launch/patient</code>; ID datang di token response",
      d: "Menyimpan ID pasien manual di <code>localStorage</code> saat registrasi",
    },
    answer: "c",
    explain: "Standalone app tidak punya konteks EHR di awal, jadi meminta <code>launch/patient</code>; authorization server bisa menampilkan pemilih pasien, lalu token response membawa <code>\"patient\": \"123\"</code>. Parameter <code>launch</code> hanya ada di EHR launch.",
  },
  {
    id: "0017-02", lesson: "0017", topic: "smart-launch", type: "mc",
    prompt: "EHR membuka app Anda dengan <code>launch=xyz123</code>. Apa yang dilakukan app dengan nilai itu?",
    options: {
      a: "Mengirimnya balik di authorize request, bersama scope <code>launch</code>",
      b: "Membacanya sebagai ID pasien, lalu langsung memanggil <code>Patient/xyz123</code>",
      c: "Memakainya sebagai access token untuk setiap request FHIR",
      d: "Menukarnya langsung ke token endpoint sebagai pengganti <code>code_verifier</code>",
    },
    answer: "a",
    explain: "IG: <code>launch</code> adalah handle opaque yang \"must be communicated back to the EHR at authorization time\": app meminta scope <code>launch</code> dan menambahkan parameter <code>launch=xyz123</code> di authorize request. ID pasien baru datang di token response (<code>\"patient\"</code>), bukan dari nilai <code>launch</code>.",
  },
  {
    id: "0017-03", lesson: "0017", topic: "smart-discovery", type: "mc",
    prompt: "Dari mana app tahu <code>authorization_endpoint</code> dan <code>token_endpoint</code> sebuah server FHIR?",
    options: {
      a: "Di-hardcode dari dokumentasi vendor EHR",
      b: "Dari klaim <code>iss</code> di JWT",
      c: "Request <code>GET [base]/.well-known/smart-configuration</code> saat mulai",
      d: "Dari header <code>WWW-Authenticate</code> setiap respons",
    },
    answer: "c",
    explain: "Discovery URL = FHIR base URL + <code>/.well-known/smart-configuration</code>; responsnya JSON berisi <code>authorization_endpoint</code>, <code>token_endpoint</code>, <code>capabilities</code>, <code>code_challenge_methods_supported</code>, dll. Cara lama lewat CapabilityStatement sudah deprecated.",
  },
  {
    id: "0017-04", lesson: "0017", topic: "smart-discovery", type: "mc",
    prompt: "Dari respons discovery, bagaimana app tahu server mendukung EHR launch dan public client?",
    options: {
      a: "Dari klaim <code>fhirUser</code> di dalam <code>id_token</code> pertama",
      b: "Dari CapabilityStatement di <code>[base]/metadata</code>, satu-satunya sumber resmi",
      c: "Dari header <code>WWW-Authenticate</code> pada respons 401 pertama",
      d: "Dari array <code>capabilities</code>, berisi <code>launch-ehr</code> dan <code>client-public</code>",
    },
    answer: "d",
    explain: "<code>capabilities</code> adalah field wajib di <code>.well-known/smart-configuration</code>. <code>launch-ehr</code> = \"support for SMART's EHR Launch mode\"; <code>client-public</code> = \"support for SMART's public client profile (no client authentication)\". Info lewat CapabilityStatement adalah cara lama yang sudah deprecated.",
  },
  {
    id: "0017-05", lesson: "0017", topic: "smart-launch", type: "mc",
    prompt: "Dalam <strong>EHR launch</strong>, dua parameter apa yang dikirim EHR ke launch URL app?",
    options: {
      a: "<code>client_id</code> dan <code>redirect_uri</code> yang didaftarkan app ke EHR",
      b: "<code>iss</code> (FHIR base URL) dan <code>launch</code> (handle opaque)",
      c: "<code>access_token</code> dan <code>patient</code> dari pasien yang sedang dibuka",
      d: "<code>code</code> dan <code>state</code> yang diterbitkan oleh authorization server",
    },
    answer: "b",
    explain: "EHR membuka launch URL app dengan <code>iss</code> (FHIR endpoint EHR) dan <code>launch</code> (identifier opaque untuk launch ini). App lalu meminta scope <code>launch</code> dan mengirim balik <code>launch={launch id}</code> saat authorize. Token dan <code>patient</code> baru datang di token response.",
  },
  {
    id: "0017-oral-1", lesson: "0017", topic: "smart-launch", type: "oral",
    prompt: "\"Bagaimana React app Anda mendapat akses ke data pasien di EHR? Apa itu SMART on FHIR?\" (90 detik)",
    sample: "SMART App Launch adalah profile OAuth 2.0 (plus OpenID Connect) di atas FHIR. Ada dua cara mulai: EHR launch, EHR membuka launch URL kami dengan <code>iss</code> dan <code>launch</code>; standalone, user membuka app langsung dan kami meminta <code>launch/patient</code>. App mengambil <code>[iss]/.well-known/smart-configuration</code> untuk tahu authorize dan token endpoint, lalu redirect ke authorize dengan <code>response_type=code</code>, scopes seperti <code>launch patient/Observation.rs openid fhirUser</code>, <code>state</code>, <code>aud</code>, dan PKCE <code>code_challenge</code> S256. Karena React SPA adalah public client, tidak ada client secret; PKCE yang melindungi code. Setelah redirect balik, app memvalidasi <code>state</code>, menukar code + <code>code_verifier</code> di token endpoint, dan menerima access token, scope yang benar-benar diberikan, serta <code>patient</code> ID sebagai launch context. Lalu setiap request FHIR membawa <code>Authorization: Bearer</code>. Di React saya pakai <code>fhirclient</code>: <code>authorize()</code> di launch page, <code>ready()</code> di redirect page.",
    checklist: [
      "SMART = profile OAuth 2.0 (+ OIDC) untuk app FHIR",
      "EHR launch (iss + launch) vs standalone (launch/patient)",
      "discovery lewat .well-known/smart-configuration",
      "authorization code + PKCE S256, tanpa client secret di SPA",
      "state divalidasi dan aud = FHIR base URL",
      "token response: access token, scope yang diberikan, patient context; lalu Bearer",
    ],
  },
]);
