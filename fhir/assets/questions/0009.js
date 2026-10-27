// Soal lesson 0009 (track FHIR, modul REST) · chaining, _include/_revinclude, paging dan Bundle searchset. Dipecah dari lesson lama 0003 (FHIR REST API).
// Format: assets/README.md (root). Sumber: hl7.org/fhir/R4 (search.html, http.html, bundle.html).
QuestionBank.labelTopics({
  "rest-include": "Chaining, _include, dan _revinclude",
  "rest-paging": "Paging dan Bundle searchset",
});

QuestionBank.register([
  {
    id: "0009-01", lesson: "0009", topic: "rest-include", type: "mc",
    prompt: "Dalam <strong>satu</strong> request, Anda ingin semua Observation milik Patient/123 <em>beserta</em> resource Patient-nya. Mana yang benar?",
    options: {
      a: "<code>Observation?patient=123&amp;_revinclude=Observation:patient</code>",
      b: "<code>Observation?patient=123&amp;_include=Observation:patient</code>",
      c: "<code>Patient?_id=123&amp;_include=Observation:patient</code>",
      d: "<code>Observation?patient.name=123&amp;_include=Patient</code>",
    },
    answer: "b",
    explain: "<code>_include</code> menyertakan resource yang <em>dirujuk</em> oleh hasil (Observation → Patient), formatnya <code>[sumber]:[search param]</code>. Arah sebaliknya juga bisa: <code>Patient?_id=123&amp;_revinclude=Observation:patient</code> (resource yang <em>merujuk</em> ke hasil). Opsi c salah karena sumber <code>_include</code> harus tipe yang dicari.",
  },
  {
    id: "0009-02", lesson: "0009", topic: "rest-include", type: "mc",
    prompt: "Apa arti <code>GET [base]/DiagnosticReport?subject:Patient.name=peter</code>?",
    options: {
      a: "DiagnosticReport dan Patient bernama peter dalam satu Bundle",
      b: "Patient bernama peter yang punya minimal satu DiagnosticReport",
      c: "DiagnosticReport yang judulnya berisi teks peter, tanpa Patient",
      d: "DiagnosticReport yang subject-nya Patient dengan nama mengandung peter",
    },
    answer: "d",
    explain: "Ini <strong>chaining</strong>: filter lewat referensi. Spesifikasi: \"This request returns all the lab reports that have a subject which is a patient, whose name includes \"peter\".\" <code>:Patient</code> membatasi tipe target. Hasilnya tetap DiagnosticReport saja; Patient tidak ikut kecuali Anda menambah <code>_include</code>.",
  },
  {
    id: "0009-03", lesson: "0009", topic: "rest-paging", type: "mc",
    prompt: "Search punya 5.000 hasil, dan server mengembalikan Bundle berisi 50 entry. Bagaimana client mengambil halaman berikutnya?",
    options: {
      a: "Tambah <code>&amp;page=2</code> sendiri ke URL search semula",
      b: "Naikkan <code>_count</code> sampai semua match muat sekaligus",
      c: "Ikuti URL di <code>Bundle.link</code> dengan relation <code>next</code>",
      d: "Kirim ulang search dengan header <code>Range</code> berikutnya",
    },
    answer: "c",
    explain: "Link paging \"are opaque to the client, have no dictated structure, and only the server understands them\"; \"The client must use the server supplied links in order to traverse the pages.\" <code>_count</code> hanya permintaan ukuran halaman; server boleh membatasinya.",
  },
  {
    id: "0009-04", lesson: "0009", topic: "rest-paging", type: "mc",
    prompt: "Di Bundle <code>searchset</code> hasil <code>Observation?patient=123&amp;_include=Observation:patient</code>, bagaimana client membedakan Observation (hasil) dari Patient (ikut karena include)?",
    options: {
      a: "Lewat <code>entry.search.mode</code>: <code>match</code> atau <code>include</code>",
      b: "Patient selalu di entry terakhir",
      c: "Lewat <code>Bundle.total</code> yang menghitung entry",
      d: "Tidak bisa; harus request terpisah",
    },
    answer: "a",
    explain: "Server \"SHALL populate the entry.search.mode element ... so that the client can pick apart matches and includes\". Nilainya <code>match | include | outcome</code>. <code>Bundle.total</code> hanya menghitung entry <code>match</code> di semua halaman, bukan include. Urutan entry tidak dijamin.",
  },
  {
    id: "0009-oral-1", lesson: "0009", topic: "rest-include", type: "oral",
    prompt: "\"Bagaimana Anda mengambil semua Observation berat badan milik satu pasien, beserta Patient-nya, dalam satu request? Bagaimana kalau hasilnya ribuan?\" (90 detik)",
    sample: "\"Saya search Observation: <code>GET [base]/Observation?patient=123&amp;code=http://loinc.org|29463-7&amp;_include=Observation:patient&amp;_count=50</code>. <code>code</code> itu token, jadi saya tulis <code>system|code</code> supaya tidak tertukar dengan sistem kode lain; kalau perlu rentang waktu, tambah <code>date=ge2024-01-01&amp;date=le2024-12-31</code>, parameter yang diulang berarti AND. <code>_include</code> membuat server ikut mengirim Patient yang dirujuk, dan di Bundle <code>searchset</code> saya bedakan lewat <code>entry.search.mode</code>: <code>match</code> untuk Observation, <code>include</code> untuk Patient. Alternatifnya dari sisi Patient: <code>Patient?_id=123&amp;_revinclude=Observation:patient</code>. Kalau ribuan, server mem-page hasilnya; saya ikuti <code>Bundle.link</code> dengan relation <code>next</code> sampai habis, tidak menyusun URL halaman sendiri karena link itu opaque. Jumlah total ada di <code>Bundle.total</code>, yang hanya menghitung match. Di Prisma, padanannya <code>findMany</code> dengan <code>include</code> plus cursor pagination.\"",
    checklist: [
      "search Observation dengan <code>patient=123</code> (atau <code>subject=Patient/123</code>)?",
      "<code>code</code> sebagai token <code>http://loinc.org|29463-7</code> (system|code)?",
      "<code>_include=Observation:patient</code>, atau <code>_revinclude</code> dari sisi Patient?",
      "hasil Bundle <code>searchset</code>; <code>entry.search.mode</code> membedakan match dan include?",
      "paging: <code>_count</code> dan mengikuti link <code>next</code> yang opaque, bukan menyusun URL sendiri?",
      "filter tanggal dengan prefix <code>ge</code>/<code>le</code>, parameter diulang = AND, koma = OR?",
    ],
  },
]);
