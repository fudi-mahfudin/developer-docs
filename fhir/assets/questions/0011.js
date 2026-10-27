// Soal lesson 0011 (track FHIR, modul REST) · OperationOutcome dan CapabilityStatement. Dipecah dari lesson lama 0003 (FHIR REST API).
// Format: assets/README.md (root). Sumber: hl7.org/fhir/R4 (http.html, operationoutcome.html, capabilitystatement.html). 0011-03, 0011-04, 0011-oral-1 ditambahkan 2026-10-27 (http.html, operationoutcome.html).
QuestionBank.labelTopics({
  "rest-error": "OperationOutcome dan CapabilityStatement",
});

QuestionBank.register([
  {
    id: "0011-01", lesson: "0011", topic: "rest-error", type: "mc",
    prompt: "Server menolak create karena Observation melanggar profil yang berlaku (mis. elemen wajib hilang). Respons mana yang sesuai spesifikasi?",
    options: {
      a: "<code>422</code> dengan body <code>OperationOutcome</code> berisi issue dan lokasinya",
      b: "<code>500</code> dengan stack trace server di body teks",
      c: "<code>200 OK</code> dengan field <code>error</code> di dalam resource",
      d: "<code>404</code> karena referensi subject tidak bisa ditemukan server",
    },
    answer: "a",
    explain: "422 = \"the proposed resource violated applicable FHIR profiles or server business rules\"; 400 = tidak bisa di-parse atau gagal validasi dasar. \"In case of failure, servers SHOULD always return a body that contains an OperationOutcome resource\" dengan <code>issue.severity</code>, <code>issue.code</code>, <code>issue.diagnostics</code>, dan <code>issue.expression</code> (lokasi elemen).",
  },
  {
    id: "0011-02", lesson: "0011", topic: "rest-error", type: "mc",
    prompt: "Sebelum integrasi, Anda ingin tahu resource, interaksi, dan search parameter apa saja yang didukung server FHIR. Request apa yang Anda kirim?",
    options: {
      a: "<code>GET [base]/swagger.json</code>",
      b: "<code>GET [base]/metadata</code>",
      c: "<code>OPTIONS [base]/Patient</code>",
      d: "<code>GET [base]/Patient?_summary=count</code>",
    },
    answer: "b",
    explain: "Interaksi capabilities: <code>GET [base]/metadata</code> mengembalikan <strong>CapabilityStatement</strong> \"that specifies which resource types and interactions are supported\" (per resource: <code>interaction</code>, <code>searchParam</code>, plus <code>fhirVersion</code>, <code>format</code>, <code>rest.security</code>). <code>_summary=count</code> hanya menghitung hasil search.",
  },
  {
    id: "0011-03", lesson: "0011", topic: "rest-error", type: "mc",
    prompt: "Form React Anda mengirim Observation dan server membalas <code>OperationOutcome</code>. Elemen <code>issue</code> mana yang dipakai untuk menandai <em>field</em> form yang salah?",
    options: {
      a: "<code>issue.severity</code>, tingkat keparahan mulai dari fatal sampai information",
      b: "<code>issue.code</code>, kode jenis masalah dari value set IssueType",
      c: "<code>issue.expression</code>, path FHIRPath sederhana ke elemen yang bermasalah",
      d: "<code>issue.diagnostics</code>, teks bebas yang isinya berbeda per server",
    },
    answer: "c",
    explain: "<code>issue.expression</code>: \"A simple subset of FHIRPath ... that identifies one of the elements in the resource that caused this issue to be raised\", mis. <code>Observation.status</code>, jadi bisa dipetakan ke field form. <code>severity</code> (fatal | error | warning | information) menyatakan tingkat, <code>code</code> jenis masalah, dan <code>diagnostics</code> hanya \"Additional diagnostic information\" yang bentuknya bebas.",
  },
  {
    id: "0011-04", lesson: "0011", topic: "rest-error", type: "mc",
    prompt: "Client mengirim <code>POST [base]/Patient</code> dengan body yang bukan JSON valid (kurung kurawal penutup hilang). Status apa yang sesuai spesifikasi?",
    options: {
      a: "<code>422</code>, karena body melanggar profil yang berlaku",
      b: "<code>412</code>, karena prasyarat header request tidak terpenuhi",
      c: "<code>409</code>, karena terjadi konflik versi di server",
      d: "<code>400</code>, karena resource tidak bisa di-parse server",
    },
    answer: "d",
    explain: "400 = \"resource could not be parsed or failed basic FHIR validation rules\". 422 baru dipakai kalau resource bisa dibaca tapi \"violated applicable FHIR profiles or server business rules\". 409/412 untuk konflik versi (<code>If-Match</code> tidak cocok) atau conditional create/update yang cocok lebih dari satu.",
  },
  {
    id: "0011-oral-1", lesson: "0011", topic: "rest-error", type: "oral",
    prompt: "\"Server FHIR menolak request dari aplikasi Anda. Bagaimana Anda membaca error-nya, dan bagaimana Anda tahu lebih dulu apa yang didukung server itu?\" (60–90 detik)",
    sample: "\"Kalau gagal, server SHOULD mengembalikan body <code>OperationOutcome</code>. Saya baca setiap <code>issue</code>: <code>severity</code> (fatal, error, warning, information), <code>code</code> dari value set IssueType seperti <code>required</code> atau <code>conflict</code>, <code>diagnostics</code> sebagai teks tambahan, dan <code>expression</code>, path FHIRPath sederhana ke elemen yang salah, yang saya petakan ke field form di React. Status HTTP-nya juga saya bedakan: 400 berarti body tidak bisa di-parse atau gagal validasi dasar, 422 melanggar profil atau aturan bisnis, 404 tidak dikenal, 410 sudah dihapus, 409/412 konflik versi. Supaya tidak menebak, sebelum integrasi saya panggil <code>GET [base]/metadata</code>: server mengembalikan CapabilityStatement berisi <code>fhirVersion</code>, <code>format</code>, <code>rest.security</code>, dan per resource <code>interaction</code> serta <code>searchParam</code> yang didukung. Padanannya dokumen OpenAPI, tapi baku di setiap server FHIR.\"",
    checklist: [
      "body error = <code>OperationOutcome</code> (server SHOULD mengirimnya saat gagal)?",
      "<code>issue.severity</code> dan <code>issue.code</code> (value set IssueType)?",
      "<code>issue.expression</code> menunjuk elemen yang salah, dipetakan ke field form; <code>diagnostics</code> teks bebas?",
      "400 (tidak bisa di-parse / validasi dasar) vs 422 (profil / aturan bisnis)?",
      "status lain: 404 vs 410, 409/412 untuk konflik versi?",
      "<code>GET [base]/metadata</code> → CapabilityStatement: <code>fhirVersion</code>, <code>format</code>, <code>rest.security</code>, <code>interaction</code>, <code>searchParam</code>?",
    ],
  },
]);
