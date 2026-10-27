// Soal lesson 0022 (track FHIR, modul SATUSEHAT): apa itu SATUSEHAT (FHIR R4, Sandbox vs Production),
// access token lewat client credentials, urutan prasyarat, dan identifier (NIK, nomor IHS, identifier lokal).
// Dipecah dari bank lama 0006 bagian 1; slug topik tidak berubah. Review 0027 menarik soal file ini lewat review.js.
// Sumber: dokumentasi SATUSEHAT Platform (satusehat.kemkes.go.id/platform/docs, diakses 2026-10-26),
// SATUSEHAT FHIR R4 Implementation Guide (Simplifier).
QuestionBank.labelTopics({
  "ss-platform": "SATUSEHAT: tujuan, FHIR R4, sandbox vs production",
  "ss-auth": "SATUSEHAT: access token (client credentials)",
  "ss-prasyarat": "SATUSEHAT: urutan onboarding (Organization, Location, Practitioner, Patient)",
  "ss-identifier": "SATUSEHAT: NIK, nomor IHS, identifier lokal",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0022-01", lesson: "0022", topic: "ss-platform", type: "mc",
    prompt: "Menurut dokumentasi resmi Kemenkes, SATUSEHAT itu apa?",
    options: {
      a: "SIMRS buatan Kemenkes yang wajib dipasang di setiap rumah sakit",
      b: "Ekosistem pertukaran data kesehatan (HIE) berbasis HL7 FHIR dan REST",
      c: "Server FHIR open source milik HL7 yang dipakai di Indonesia",
      d: "Database klaim BPJS Kesehatan yang dibuka sebagai API publik baru",
    },
    answer: "b",
    explain: "Playbook SATUSEHAT: \"ekosistem pertukaran data kesehatan (HIE: Health Information Exchange)\" yang menghubungkan fasyankes, regulator, penjamin, dan penyedia layanan digital, dengan spesifikasi HL7 FHIR dan HTTPS REST API. Fasyankes tetap memakai SIMRS/RME masing-masing dan mengirim data ke SATUSEHAT.",
  },
  {
    id: "0022-02", lesson: "0022", topic: "ss-auth", type: "mc",
    prompt: "Bagaimana service Node Anda mendapat access token SATUSEHAT?",
    options: {
      a: "Authorization code + PKCE lewat login petugas di browser",
      b: "JWT assertion yang ditandatangani private key, dengan scope <code>system/*.rs</code>",
      c: "API key statis di header <code>X-Api-Key</code> pada setiap request",
      d: "Kirim form <code>POST /accesstoken</code> dengan <code>grant_type=client_credentials</code>, <code>client_id</code>, dan <code>client_secret</code>",
    },
    answer: "d",
    explain: "Katalog API SATUSEHAT (Akses Token): <code>POST {oauth-base}/accesstoken</code> dengan query <code>grant_type=client_credentials</code> dan body form-urlencoded <code>client_id</code> + <code>client_secret</code>. Token dipakai sebagai <code>Authorization: Bearer &lt;access_token&gt;</code>. Bedanya dengan SMART Backend Services (lesson 0019): di sini secret, bukan JWT assertion.",
  },
  {
    id: "0022-03", lesson: "0022", topic: "ss-identifier", type: "mc",
    prompt: "Encounter yang dikirim ke SATUSEHAT menunjuk pasiennya dengan <code>subject.reference</code>. Nilainya apa?",
    options: {
      a: "<code>Patient/{patient-ihs-number}</code> dari Master Patient Index (MPI)",
      b: "<code>Patient/{nomor-rekam-medis}</code> dari SIMRS rumah sakit Anda",
      c: "<code>Patient/{nik}</code> langsung dari KTP elektronik pasien",
      d: "<code>Patient/{uuid}</code> yang dibuat ulang setiap kunjungan",
    },
    answer: "a",
    explain: "Dokumentasi resource Patient SATUSEHAT: data yang menyangkut Patient memerlukan <code>{patient-ihs-number}</code>, yang didapat dari Master Patient Index (MPI); nomor itu boleh disimpan di sistem internal. NIK adalah <em>identifier</em> (<code>https://fhir.kemkes.go.id/id/nik</code>), bukan logical id. Nomor rekam medis lokal juga bukan id di server SATUSEHAT.",
  },
  {
    id: "0022-04", lesson: "0022", topic: "ss-prasyarat", type: "mc",
    prompt: "Sebelum mengirim Encounter pertama ke SATUSEHAT, urutan persiapan yang benar adalah…",
    options: {
      a: "Kirim Encounter dulu, lalu daftarkan Organization dan Location belakangan",
      b: "Kirim Patient baru tanpa NIK, lalu langsung kirim Condition",
      c: "Minta token, lalu kirim Bundle berisi semua data historis",
      d: "Token, Organization, Location, nomor IHS Practitioner, nomor IHS Patient",
    },
    answer: "d",
    explain: "Halaman Prerequisites SATUSEHAT: sebelum data pendaftaran pasien dan diagnosis, lakukan autentikasi, registrasi struktur Organization, registrasi struktur Location, simpan nomor IHS tenaga kesehatan (Practitioner), dan dapatkan nomor IHS pasien. Encounter merujuk semuanya.",
  },
  {
    id: "0022-05", lesson: "0022", topic: "ss-identifier", type: "mc",
    prompt: "Nomor kunjungan lokal <code>REG-2026-0042</code> dimasukkan ke <code>Encounter.identifier</code>. <code>system</code>-nya apa?",
    options: {
      a: "<code>https://fhir.kemkes.go.id/id/nik</code>, karena kunjungan adalah milik pasien",
      b: "<code>http://sys-ids.kemkes.go.id/encounter/{organization-ihs-number}</code>, berbeda untuk setiap fasyankes pengirim",
      c: "<code>http://loinc.org</code>, karena kunjungan adalah sebuah observasi",
      d: "Kosong, karena nomor kunjungan pasti unik",
    },
    answer: "b",
    explain: "Dokumentasi Encounter SATUSEHAT: <code>Encounter.identifier.system</code> berformat <code>http://sys-ids.kemkes.go.id/encounter/{organization-ihs-number}</code> (ID organisasi induk dari Master Sarana Index), dan <code>value</code> berisi nomor kunjungan lokal. <code>system</code> per organisasi yang membuat pasangan system + value unik secara nasional.",
  },
  {
    id: "0022-06", lesson: "0022", topic: "ss-platform", type: "mc",
    prompt: "Developer menguji integrasi baru. Base URL FHIR mana yang dipakai dulu?",
    options: {
      a: "Production <code>api-satusehat.kemkes.go.id/fhir-r4/v1</code> langsung dengan data pasien yang asli",
      b: "Server HAPI publik <code>hapi.fhir.org</code> karena perilakunya pasti identik",
      c: "Sandbox <code>api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1</code> dengan data pasien dummy dari dokumentasi",
      d: "Production, tetapi pasien diberi nama samaran lebih dulu",
    },
    answer: "c",
    explain: "Endpoint Information SATUSEHAT: Sandbox (Staging) <code>https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1</code>, Production <code>https://api-satusehat.kemkes.go.id/fhir-r4/v1</code>. Kode akses Sandbox bisa dipakai sebelum terverifikasi, dan dokumentasi menyediakan data pasien dummy yang hanya berlaku di Sandbox. Perhatikan <code>fhir-r4</code> di path.",
  },
  {
    id: "0022-oral-1", lesson: "0022", topic: "ss-platform", type: "oral",
    prompt: "\"Pernah dengar SATUSEHAT? Bagaimana sistem kami terhubung ke sana?\" (60–90 detik)",
    sample: "SATUSEHAT adalah platform pertukaran data kesehatan nasional dari Kemenkes, sebuah Health Information Exchange yang memakai HL7 FHIR lewat HTTPS REST; IG-nya di Simplifier bernama SATUSEHAT FHIR R4 Implementation Guide dan base URL-nya memakai path <code>fhir-r4/v1</code>. Ada dua environment: Sandbox (staging) untuk uji coba dengan pasien dummy, dan Production setelah fasyankes terdaftar. Autentikasinya OAuth2 client credentials: service backend kami POST ke <code>/oauth2/v1/accesstoken</code> dengan <code>client_id</code> dan <code>client_secret</code>, lalu memakai <code>Authorization: Bearer</code>; token di-cache sampai hampir kedaluwarsa karena gagal autentikasi kena rate limit. Sebelum mengirim data klinis ada prasyarat: Organization dan Location fasyankes didaftarkan, nomor IHS Practitioner dan nomor IHS Patient diambil dari master data; Patient dicari berdasarkan NIK. Setelah itu baru Encounter, Condition dengan ICD-10, Observation dengan LOINC, dan seterusnya sesuai panduan use case. Error datang sebagai OperationOutcome yang kami simpan untuk diperbaiki.",
    checklist: [
      "SATUSEHAT = HIE nasional Kemenkes berbasis HL7 FHIR (R4) + HTTPS REST",
      "Sandbox (pasien dummy) vs Production (setelah terdaftar)",
      "OAuth2 client_credentials: client_id + client_secret → Bearer token, dari backend",
      "prasyarat: Organization, Location, nomor IHS Practitioner dan Patient (MPI, NIK)",
      "resource klinis (Encounter, Condition, Observation) dengan terminologi standar",
      "error 4xx berupa OperationOutcome yang disimpan dan ditindaklanjuti",
    ],
  },
]);
