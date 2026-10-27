// Soal lesson 0025 (track FHIR, modul PDP): empat jebakan (query search, diagnostics, narrative) dan
// enam saluran bocor (log, URL, trace, metrik, Sentry, frontend).
// Dipecah dari bank lama 0007 (lihat .scratch/restruktur-fhir/). Lihat assets/README.md di root.
// Sumber: UU 27/2022, UU 17/2023, Permenkes 24/2022 (PDF peraturan.bpk.go.id), FHIR R4 security/secpriv,
// OpenTelemetry, Sentry, pino, Prometheus. Riset lengkap: .scratch/materi-fhir/research-pdp.md (diakses 2026-10-27).
QuestionBank.labelTopics({
  "pdp-jebakan": "PDP: jebakan (query search, diagnostics, narrative)",
  "pdp-saluran": "PDP: saluran bocor (log, URL, trace, metrik, Sentry, frontend)",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0025-01", lesson: "0025", topic: "pdp-jebakan", type: "mc",
    prompt: "Access log Anda hanya menyimpan URL, tanpa body. Kenapa log ini tetap berisi data pribadi?",
    options: {
      a: "Query search seperti <code>identifier=…|NIK</code> sudah memuat identitas pasien",
      b: "URL dienkripsi TLS sehingga log ini sebenarnya aman",
      c: "Server FHIR selalu menyalin body resource ke URL",
      d: "Access log otomatis menyimpan token Bearer setiap request",
    },
    answer: "a",
    explain: "FHIR R4 Security: \"HTTP logs, including those that only contain the URL itself, should be regarded as being as sensitive as the resources themselves.\" Search memakai query string: <code>Patient?identifier=https://fhir.kemkes.go.id/id/nik|…</code> atau <code>?name=…&amp;birthdate=…</code>. TLS hanya melindungi di jalan; server mencatat URL setelah didekripsi.",
  },
  {
    id: "0025-02", lesson: "0025", topic: "pdp-saluran", type: "mc",
    prompt: "Tim memasang instrumentasi HTTP OpenTelemetry dengan setelan default. Apakah <code>birthdate=1990-01-01</code> di query otomatis disensor?",
    options: {
      a: "Ya, semua parameter query disensor secara default",
      b: "Ya, karena OTel mengenali field data kesehatan",
      c: "Tidak, default hanya menyensor kunci tanda tangan",
      d: "Tidak, karena OTel tidak pernah merekam URL",
    },
    answer: "c",
    explain: "Daftar redaksi default <code>url.query</code> di semantic conventions OTel hanya kunci tanda tangan cloud seperti <code>X-Amz-Signature</code>, <code>sig</code>, <code>X-Goog-Signature</code>. OTel sendiri bilang ia \"can't determine what data is sensitive in your specific context\": parameter FHIR harus Anda tambahkan sendiri.",
  },
  {
    id: "0025-03", lesson: "0025", topic: "pdp-jebakan", type: "mc",
    prompt: "SATUSEHAT mengembalikan <code>OperationOutcome</code> dengan status 400. Bagian mana yang <em>tidak</em> aman dicatat mentah?",
    options: {
      a: "<code>issue.diagnostics</code>, karena bisa memuat ulang nilai input",
      b: "<code>issue.severity</code>, karena levelnya bisa error atau fatal",
      c: "<code>issue.code</code>, karena isinya kode dari value set",
      d: "Status HTTP 400, karena menandakan request gagal",
    },
    answer: "a",
    explain: "FHIR R4: <code>diagnostics</code> adalah teks bebas, \"a description of how a value is erroneous\" atau bahkan \"a stack dump\". Validator bisa mengutip nilai yang salah, misalnya NIK atau tanggal lahir. <code>severity</code> dan <code>code</code> adalah kode tetap, jadi 🟢 aman untuk metrik dan alert.",
  },
  {
    id: "0025-04", lesson: "0025", topic: "pdp-saluran", type: "mc",
    prompt: "Sentry JS SDK dengan default <code>dataCollection</code> (opsi baru sejak 10.57.0). Apa risikonya untuk backend yang memanggil FHIR?",
    options: {
      a: "Tidak ada, Sentry tidak pernah mengirim data request",
      b: "Hanya stack trace terkirim, body dan URL dibuang",
      c: "Token Bearer selalu dikirim karena tidak ada denylist",
      d: "Body request/response ikut terkirim; field medis tidak disensor",
    },
    answer: "d",
    explain: "Dokumentasi Sentry: default-nya mengumpulkan \"request/response bodies\" dan hanya menyensor kunci yang cocok dengan denylist bawaan (<code>auth</code>, <code>token</code>, <code>secret</code>, <code>password</code>, …). Kunci seperti <code>nik</code>, <code>birthDate</code>, atau <code>name</code> tidak termasuk. Matikan body (<code>httpBodies: []</code>) dan bersihkan di <code>beforeSend</code>.",
  },
  {
    id: "0025-05", lesson: "0025", topic: "pdp-jebakan", type: "mc",
    prompt: "Anda sudah menyensor <code>name</code>, <code>identifier</code>, dan <code>birthDate</code> di body Patient. Apa yang masih bisa membocorkan identitas?",
    options: {
      a: "<code>resourceType</code> yang selalu bernilai <code>Patient</code>",
      b: "<code>text.div</code>, narasi HTML ringkasan resource",
      c: "<code>meta.versionId</code> yang bertambah setiap update",
      d: "<code>meta.lastUpdated</code> yang mencatat waktu perubahan",
    },
    answer: "b",
    explain: "<code>text.div</code> adalah \"human-readable narrative that contains a summary of the resource\": nama, tanggal lahir, dan diagnosis bisa tertulis lagi di sana sebagai HTML. Modul privasi FHIR R4: \"Narrative and Attachment elements present particularly difficult challenges.\" Contoh kenapa allowlist lebih aman daripada menyensor field satu per satu.",
  },
  {
    id: "0025-06", lesson: "0025", topic: "pdp-saluran", type: "mc",
    prompt: "Kenapa <code>patient_id</code> tidak boleh dijadikan label metrik Prometheus?",
    options: {
      a: "Prometheus menolak label yang berisi angka sama sekali",
      b: "Label metrik otomatis dienkripsi sehingga tidak bisa dibaca",
      c: "Label tersebar ke dashboard dan menciptakan ledakan cardinality",
      d: "Metrik hanya boleh memakai label dari value set",
    },
    answer: "c",
    explain: "Dokumentasi Prometheus: setiap kombinasi label adalah time series baru; \"Do not use labels to store dimensions with high cardinality … such as user IDs\". Untuk data pasien ada masalah kedua: label ikut ke setiap dashboard, alert, dan ekspor yang aksesnya jauh lebih longgar daripada rekam medis.",
  },
  {
    id: "0025-oral-1", lesson: "0025", topic: "pdp-saluran", type: "oral",
    prompt: "\"Anda baru masuk tim dan sistemnya sudah jalan. Bagaimana memeriksa apakah monitoring kami membocorkan data pasien?\" (60 detik)",
    sample: "Saya telusuri satu request FHIR dari ujung ke ujung, misalnya search pasien by NIK, lalu cari jejaknya di setiap saluran. Access log dan proxy: apakah query string tercatat utuh? Trace OpenTelemetry: <code>url.full</code>, <code>url.query</code>, atribut custom. Metrik: ada label berisi ID pasien? Sentry: body request terkirim, breadcrumbs, nama transaksi dengan ID mentah? Log aplikasi: body resource, <code>OperationOutcome.diagnostics</code>, string pesan yang menyisipkan nama. Frontend: console log, analytics, session replay. Untuk temuan, perbaikannya di sumber: allowlist field, HMAC untuk ID, matikan body di Sentry, tambahkan parameter FHIR ke redaksi query. Lalu saya tambahkan tes yang gagal kalau NIK contoh muncul di output log.",
    checklist: [
      "telusuri satu request nyata (mis. search by NIK) di semua saluran",
      "access log/proxy: query string",
      "trace OTel (url.query) dan label metrik",
      "Sentry: body, breadcrumbs, nama transaksi",
      "log aplikasi dan frontend (console, analytics, replay)",
      "perbaiki di sumber (allowlist, HMAC) + tes regresi",
    ],
  },
]);
