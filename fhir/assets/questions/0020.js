// Soal lesson 0020 (track FHIR, modul SMART): fhirclient di React, menampilkan CodeableConcept, keamanan token dan PHI.
// Dipecah dari bank lama 0005 (lihat .scratch/restruktur-fhir/). Lihat assets/README.md di root.
// Sumber: SMART App Launch IG v2.2.0 (STU 2.2), docs fhirclient, FHIR R4 datatypes/security.
QuestionBank.labelTopics({
  "smart-fhirclient": "SMART: fhirclient di React (authorize/ready)",
  "smart-codeable": "Menampilkan CodeableConcept di UI",
  "smart-security": "Keamanan: penyimpanan token, PHI, audit",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0020-01", lesson: "0020", topic: "smart-codeable", type: "mc",
    prompt: "Komponen React menampilkan <code>Observation.code</code> (CodeableConcept). Urutan sumber label yang paling tepat?",
    options: {
      a: "<code>coding[0].code</code>, lalu <code>text</code>, lalu <code>system</code>",
      b: "<code>system</code>, lalu <code>coding[0].code</code>, lalu <code>text</code>",
      c: "<code>text</code>, lalu <code>coding.display</code>, lalu <code>code</code>",
      d: "<code>id</code>, lalu <code>coding[0].system</code>, lalu <code>text</code>",
    },
    answer: "c",
    explain: "<code>text</code> adalah \"the representation of the concept as entered or chosen by the user\"; tanpa Coding yang <code>userSelected</code>, text adalah sumber makna yang diutamakan. Kalau tidak ada, pakai <code>display</code> dari Coding (utamakan <code>userSelected</code>), terakhir <code>code</code> mentah.",
  },
  {
    id: "0020-02", lesson: "0020", topic: "smart-fhirclient", type: "mc",
    prompt: "Dalam <code>fhirclient</code> di browser, apa peran <code>authorize()</code> dan <code>ready()</code>?",
    options: {
      a: "<code>authorize()</code> di launch page, <code>ready()</code> di halaman <code>redirect_uri</code>",
      b: "<code>authorize()</code> mengambil Patient, <code>ready()</code> menyimpan token ke cookie",
      c: "Keduanya dipanggil berurutan di satu <code>useEffect</code> yang sama",
      d: "<code>authorize()</code> di server Node, <code>ready()</code> di service worker",
    },
    answer: "a",
    explain: "Docs fhirclient: biasanya ada dua halaman, launch page (<code>launch_uri</code>) yang memanggil <code>authorize()</code> lalu redirect ke authorization server, dan index page (<code>redirect_uri</code>) yang memanggil <code>ready()</code> dan menerima <code>Client</code>. Kode setelah <code>authorize()</code> mungkin tidak pernah jalan karena redirect.",
  },
  {
    id: "0020-03", lesson: "0020", topic: "smart-security", type: "mc",
    prompt: "Scope app mengizinkan <code>patient/Observation.rs</code>, tetapi search mengembalikan 200 dengan sebagian hasil hilang. Kenapa mungkin?",
    options: {
      a: "Server pasti salah konfigurasi; scope selalu menjamin semua data",
      b: "Paging rusak karena <code>_count</code> tidak dikirim oleh app React",
      c: "Token kedaluwarsa sehingga server memotong hasil secara acak saja",
      d: "Scope hanya mendelegasikan; izin dasar user tetap membatasi hasil",
    },
    answer: "d",
    explain: "Scope SMART mendelegasikan sebagian izin; hak akses dasar user/policy tetap berlaku dan tidak dimodelkan oleh SMART. IG menyebut client bisa menerima 200 dengan hasil yang dihilangkan dari Bundle, atau 403 untuk write yang tampak diizinkan scope.",
  },
  {
    id: "0020-04", lesson: "0020", topic: "smart-security", type: "mc",
    prompt: "Observation dari server A berisi <code>reference</code> ke resource di server B. Apa yang sebaiknya dilakukan app?",
    options: {
      a: "Ikuti reference dan kirim access token yang sama",
      b: "Abaikan, atau minta otorisasi baru khusus server B",
      c: "Salin access token ke query string request berikutnya",
      d: "Kirim token server A lewat cookie tanpa HTTPS",
    },
    answer: "b",
    explain: "IG: app \"SHOULD NOT blindly follow such references and send along its access_token, as the token may be subject to potential theft\". Abaikan reference itu atau mulai request akses baru. Ini juga alasan parameter <code>aud</code> wajib di authorize request.",
  },
  {
    id: "0020-05", lesson: "0020", topic: "smart-fhirclient", type: "mc",
    prompt: "Setelah <code>ready()</code>, cara paling ringkas mengambil semua Observation pasien yang sedang dalam konteks?",
    options: {
      a: "<code>fetch(\"/Observation\")</code> tanpa header apa pun",
      b: "<code>client.request(\"Observation?_count=1000000\")</code> lalu filter manual sendiri",
      c: "<code>localStorage.getItem(\"patient\")</code> lalu baca dari cache",
      d: "Memanggil <code>client.patient.request(\"Observation\")</code> pada objek Client",
    },
    answer: "d",
    explain: "<code>client.patient.request(\"Observation\")</code> otomatis menambah filter pasien (<code>/Observation?patient=patient-id</code>) dan memakai access token yang tersimpan. Untuk banyak halaman ada opsi <code>pageLimit</code>/<code>onPage</code>/<code>flat</code>.",
  },
  {
    id: "0020-oral-1", lesson: "0020", topic: "smart-security", type: "oral",
    prompt: "\"Di React app yang menampilkan data pasien, di mana Anda menyimpan token, dan apa yang Anda lakukan supaya PHI aman?\" (60 detik)",
    sample: "Token kami anggap sama sensitifnya dengan datanya. SMART meminta token disimpan di storage khusus app, bukan lokasi yang bisa ditemukan sistem, dan tidak di cookie yang dikirim tanpa enkripsi. <code>fhirclient</code> di browser menyimpan state-nya di <code>sessionStorage</code>, jadi hilang saat tab ditutup, tapi tetap terbaca kalau ada XSS, sehingga CSP dan sanitasi input penting. Access token sebaiknya berumur maksimal satu jam; kalau butuh akses panjang atau refresh token yang kuat, saya pindahkan pertukaran token ke backend sebagai confidential client atau pola backend-for-frontend. Untuk PHI: minta scope seminimal mungkin, tidak pernah menulis isi resource atau query string ke log biasa atau analytics, tidak mengikuti reference ke server lain dengan token yang sama, dan aktivitas akses dicatat di audit log, misalnya resource <code>AuditEvent</code>.",
    checklist: [
      "storage khusus app; jangan cookie cleartext; fhirclient memakai sessionStorage",
      "XSS tetap bisa membaca storage: CSP, sanitasi",
      "token pendek (≤ 1 jam); refresh/akses panjang lebih aman lewat backend (confidential/BFF)",
      "scope seminimal mungkin (least privilege)",
      "jangan log PHI atau query string ke log tak terlindungi",
      "audit akses (AuditEvent), jangan kirim token ke server lain",
    ],
  },
]);
