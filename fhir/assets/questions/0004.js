// Soal lesson FHIR 0004 · Kerangka resource JSON (aturan JSON, cardinality) dan Patient: id vs Identifier.
// Dipecah dari bank lama 0002 (slug topik tidak berubah). Format: assets/README.md (root). Sumber: hl7.org/fhir/R4.
QuestionBank.labelTopics({
  "res-json": "Aturan JSON FHIR dan cardinality",
  "res-identifier": "id (logical id) vs Identifier",
});

QuestionBank.register([
  // ---------- res-json ----------
  {
    id: "0004-01", lesson: "0004", topic: "res-json", type: "mc",
    prompt: "Di definisi Patient, <code>name</code> berkardinalitas <code>0..*</code>. Pasien ini hanya punya satu nama. Bagaimana bentuknya di JSON?",
    options: {
      a: "Objek tunggal, karena hanya ada satu",
      b: "String biasa berisi nama lengkap pasien",
      c: "Array berisi satu objek HumanName saja",
      d: "Boleh objek atau array, terserah server",
    },
    answer: "c",
    explain: "Elemen dengan kardinalitas maksimum &gt; 1 selalu array: \"arrays are used when the item might repeat, even if it does not repeat in a specific instance\", supaya parsing selalu sama. Di TypeScript: <code>name?: HumanName[]</code>.",
  },
  {
    id: "0004-02", lesson: "0004", topic: "res-json", type: "mc",
    prompt: "Bagaimana JSON FHIR menyatakan elemen yang tidak punya nilai?",
    options: {
      a: "Property dihilangkan, tidak pernah null atau kosong",
      b: "Property ditulis dengan nilai null secara eksplisit",
      c: "Property diisi string kosong sebagai penanda kosong",
      d: "Property diisi array kosong untuk semua tipe",
    },
    answer: "a",
    explain: "\"JSON objects and arrays are never empty, and properties never have null values ... Omit a property if it is empty.\" Jadi di kode klien, cek <code>obs.valueQuantity === undefined</code>, jangan mengandalkan <code>null</code>.",
  },

  // ---------- res-identifier ----------
  {
    id: "0004-03", lesson: "0004", topic: "res-identifier", type: "mc",
    prompt: "Pasien yang sama ada di dua server: <code>Patient/23</code> dan <code>Patient/5860200e-…</code>. Keduanya punya <code>identifier</code> dengan <code>system</code> dan <code>value</code> yang sama. Apa kesimpulannya?",
    options: {
      a: "Dua pasien berbeda, karena logical id berbeda",
      b: "Data rusak, id seharusnya sama di server",
      c: "Server kedua wajib mengganti id menjadi 23",
      d: "Pasien sama, karena business identifier-nya sama persis",
    },
    answer: "d",
    explain: "Ini contoh resmi di halaman Resource: \"Given that the identifier is the same, the patient resources are understood to mean that they describe the same patient.\" Logical id boleh berbeda antar server; business identifier yang dipakai untuk mengenali entitas yang sama.",
  },
  {
    id: "0004-04", lesson: "0004", topic: "res-identifier", type: "mc",
    prompt: "Mana yang benar tentang <code>id</code> (logical id) sebuah resource?",
    options: {
      a: "Dipilih bebas oleh klien dan berlaku global",
      b: "Ditetapkan server, unik per tipe, tidak berubah",
      c: "Sama dengan nomor rekam medis rumah sakit",
      d: "Berubah setiap kali resource di-update oleh klien",
    },
    answer: "b",
    explain: "Logical id \"is unique within the space of all resources of the same type on the same server. Once assigned by the server, the id is never changed.\" Nomor rekam medis masuk <code>identifier</code>; yang berubah setiap update adalah <code>meta.versionId</code>.",
  },

  // ---------- oral ----------
  {
    id: "0004-oral-1", lesson: "0004", topic: "res-identifier", type: "oral",
    prompt: "\"Apa beda <code>id</code> dan <code>identifier</code> di resource FHIR? Bagaimana Observation menunjuk ke pasiennya?\" (60 detik)",
    sample: "\"<code>id</code> adalah logical id: ditetapkan server yang menyimpan resource, unik per tipe resource di server itu, tidak pernah berubah, dan membentuk URL-nya, misalnya <code>Patient/123</code>. Kalau resource disalin ke server lain, id-nya bisa berbeda. <code>identifier</code> adalah business identifier, seperti nomor rekam medis atau NIK: pasangan <code>system</code> (URI namespace) + <code>value</code>, dan bisa banyak. Dua resource dengan identifier sama dianggap entitas yang sama. Observation menunjuk pasien lewat Reference di <code>subject</code>: biasanya literal reference relatif <code>Patient/123</code>, opsional dengan <code>display</code> untuk UI. Kalau URL-nya tidak diketahui, bisa logical reference lewat <code>subject.identifier</code>, tapi chaining dan <code>_include</code> tidak jalan. Padanannya: id itu primary key database, identifier itu natural key, reference itu foreign key.\"",
    checklist: [
      "id = logical id dari server, unik per tipe di server itu, tidak berubah",
      "id membentuk URL resource ([base]/Patient/123) dan bisa berbeda antar server",
      "identifier = business identifier (system + value), mis. nomor rekam medis/NIK, boleh banyak",
      "identifier sama = entitas dunia nyata yang sama, dipakai untuk mencocokkan antar sistem",
      "Reference relatif Patient/123 di subject, display hanya teks untuk ditampilkan",
      "logical reference lewat Reference.identifier bila URL tidak diketahui (tanpa chaining/_include)",
    ],
  },
]);
