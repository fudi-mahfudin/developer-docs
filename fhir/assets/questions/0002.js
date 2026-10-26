// Soal lesson FHIR 0002 · Anatomi resource JSON: Patient, Encounter, Observation, id vs Identifier, Reference,
// CodeableConcept/Coding, LOINC/SNOMED CT/ICD-10, choice type value[x], cardinality, meta, contained, extension.
// Format: assets/README.md (root). Sumber: hl7.org/fhir/R4.
QuestionBank.labelTopics({
  "res-json": "Aturan JSON FHIR dan cardinality",
  "res-identifier": "id (logical id) vs Identifier",
  "res-reference": "Reference: relatif, logical, display",
  "res-codeable": "CodeableConcept vs Coding",
  "res-terminologi": "LOINC, SNOMED CT, ICD-10",
  "res-choice": "Choice type value[x]",
  "res-meta": "meta: versionId, lastUpdated, profile",
  "res-contained": "Contained resource",
  "res-extension": "Extension dan modifierExtension",
  "res-baca": "Membaca JSON Patient, Encounter, Observation",
});

QuestionBank.register([
  // ---------- res-json ----------
  {
    id: "0002-01", lesson: "0002", topic: "res-json", type: "mc",
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
    id: "0002-02", lesson: "0002", topic: "res-json", type: "mc",
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
    id: "0002-03", lesson: "0002", topic: "res-identifier", type: "mc",
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
    id: "0002-04", lesson: "0002", topic: "res-identifier", type: "mc",
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

  // ---------- res-reference ----------
  {
    id: "0002-05", lesson: "0002", topic: "res-reference", type: "mc",
    prompt: "Observation berisi <code>\"subject\": { \"reference\": \"Patient/f001\", \"display\": \"P. van de Heuvel\" }</code>. Apa arti dua property itu?",
    options: {
      a: "URL relatif ke Patient, plus teks untuk ditampilkan",
      b: "Patient lengkap disisipkan, plus nama sebagai kunci utama",
      c: "Query search Patient, plus nama sebagai filter pencarian",
      d: "Identifier rumah sakit, plus nama yang wajib cocok",
    },
    answer: "a",
    explain: "<code>reference</code> adalah literal reference: URL relatif terhadap service base URL (<code>[base]/Patient/f001</code>). <code>display</code> adalah \"Text alternative for the resource\", hanya untuk ditampilkan, bukan kunci. Mirip foreign key <code>patientId</code> plus nama yang di-denormalisasi untuk UI.",
  },
  {
    id: "0002-06", lesson: "0002", topic: "res-reference", type: "mc",
    prompt: "Sistem Anda hanya tahu NIK pasien, tidak tahu URL Patient-nya di server FHIR. Bagaimana mengisi <code>Observation.subject</code>?",
    options: {
      a: "Tulis NIK di reference, misalnya Patient/NIK saja",
      b: "Kosongkan subject sampai URL Patient diketahui nanti",
      c: "Pakai Reference.identifier berisi system dan value NIK",
      d: "Buat Patient contained baru berisi NIK saja",
    },
    answer: "c",
    explain: "Itu <em>logical reference</em>: \"the source application may provide the identifier as a logical reference\" (contoh resmi memakai SSN). Konsekuensinya chaining dan <code>_include</code> tidak bisa dipakai. NIK bukan logical id, jadi <code>Patient/NIK</code> salah; contained hanya untuk data yang tidak bisa diidentifikasi.",
  },

  // ---------- res-codeable ----------
  {
    id: "0002-07", lesson: "0002", topic: "res-codeable", type: "mc",
    prompt: "Contoh resmi Observation berat badan berisi empat <code>coding</code> di <code>code</code>: dua LOINC, satu SNOMED CT, satu kode lokal. Kenapa?",
    options: {
      a: "Server mewajibkan minimal empat coding per code",
      b: "Konsep sama dikodekan di beberapa sistem: translasi",
      c: "Setiap coding adalah hasil pengukuran berat berbeda",
      d: "Urutan coding menentukan sistem mana yang benar",
    },
    answer: "b",
    explain: "\"The concept may be coded multiple times in different code systems\"; setiap coding adalah translasi. \"There is no meaning associated with the ordering of coding within a CodeableConcept.\" Pola umum: kirim kode lokal plus translasi ke LOINC/SNOMED CT.",
  },
  {
    id: "0002-08", lesson: "0002", topic: "res-codeable", type: "mc",
    prompt: "Apa beda <code>Coding</code> dan <code>CodeableConcept</code>?",
    options: {
      a: "Sama saja, hanya beda nama di versi R4",
      b: "Coding untuk teks bebas, CodeableConcept untuk angka saja",
      c: "CodeableConcept satu kode, Coding berisi daftar banyak kode",
      d: "Coding satu kode, CodeableConcept berisi Coding plus text",
    },
    answer: "d",
    explain: "\"Coding: a simple direct reference to a code defined by a code system. CodeableConcept: a text description and/or a list of Codings.\" Di TS: <code>{ coding?: Coding[]; text?: string }</code>.",
  },
  {
    id: "0002-09", lesson: "0002", topic: "res-codeable", type: "mc",
    prompt: "Encounter R4 resmi berisi <code>\"class\": { \"system\": \"…/v3-ActCode\", \"code\": \"AMB\" }</code>, tanpa <code>coding: [ … ]</code>. Kenapa?",
    options: {
      a: "Encounter.class bertipe Coding, bukan CodeableConcept, di R4",
      b: "Server memangkas array coding karena hanya satu",
      c: "Itu kesalahan; semua elemen kode harus CodeableConcept",
      d: "Bentuk singkat CodeableConcept yang boleh dipakai bebas",
    },
    answer: "a",
    explain: "Di R4, <code>Encounter.class</code> adalah <code>Coding</code> 1..1. Di R5 elemen yang sama berubah menjadi <code>CodeableConcept</code> 0..*. Jadi bentuk JSON ditentukan tipe elemen di definisi resource, bukan pilihan server.",
  },

  // ---------- res-terminologi ----------
  {
    id: "0002-10", lesson: "0002", topic: "res-terminologi", type: "mc",
    prompt: "Pasangkan berurutan: (1) kode jenis tes lab di <code>Observation.code</code>, (2) terminologi klinis untuk temuan, prosedur, dan nilai kode, (3) klasifikasi penyakit untuk statistik dan klaim.",
    options: {
      a: "SNOMED CT, LOINC, ICD-10",
      b: "ICD-10, SNOMED CT, LOINC",
      c: "LOINC, SNOMED CT, ICD-10",
      d: "LOINC, ICD-10, SNOMED CT",
    },
    answer: "c",
    explain: "Spesifikasi: \"The Observation.code is preferably a LOINC concept code\" dan untuk nilai non-numerik \"preferably a SNOMED CT concept code\". WHO: data ICD adalah dasar statistik penyakit dan \"support payment systems\".",
  },
  {
    id: "0002-11", lesson: "0002", topic: "res-terminologi", type: "mc",
    prompt: "Mana <code>system</code> yang benar untuk kode LOINC <code>15074-8</code>?",
    options: {
      a: "<code>\"system\": \"LOINC\"</code>",
      b: "<code>\"system\": \"urn:loinc\"</code>",
      c: "<code>\"system\": \"http://snomed.info/sct\"</code>",
      d: "<code>\"system\": \"http://loinc.org\"</code>",
    },
    answer: "d",
    explain: "\"The URI http://loinc.org identifies LOINC codes.\" SNOMED CT memakai <code>http://snomed.info/sct</code>, ICD-10 (WHO) <code>http://hl7.org/fhir/sid/icd-10</code>. Kode selalu dibaca berpasangan dengan system: kode tanpa system tidak bisa diproses dengan aman.",
  },

  // ---------- res-choice ----------
  {
    id: "0002-12", lesson: "0002", topic: "res-choice", type: "mc",
    prompt: "Definisi Observation menulis <code>value[x]</code> dengan tipe Quantity | CodeableConcept | string | … Bagaimana hasil gula darah 6.3 mmol/L ditulis di JSON?",
    options: {
      a: "Property value berisi objek dengan field type",
      b: "Property valueQuantity berisi value, unit, system, code",
      c: "Property value[x] berisi angka dan satuan string",
      d: "Dua property: valueQuantity dan valueString sekaligus diisi",
    },
    answer: "b",
    explain: "\"[x] is replaced with the title-cased name of the type that is actually used\": <code>valueQuantity</code>, <code>valueString</code>, <code>valueCodeableConcept</code>. Hanya satu yang boleh ada. Di TS mirip discriminated union, tapi diskriminatornya nama property.",
  },
  {
    id: "0002-13", lesson: "0002", topic: "res-choice", type: "mc",
    prompt: "Kenapa <code>effective[x]</code> tidak pernah muncul sebagai array, walau tipenya bisa dateTime atau Period?",
    options: {
      a: "Elemen choice type maksimal berkardinalitas 1 menurut spesifikasi",
      b: "JSON tidak bisa menyimpan array berisi tipe tanggal",
      c: "Server selalu menggabungkan beberapa nilai menjadi satu Period",
      d: "Hanya Observation final yang boleh punya banyak effective",
    },
    answer: "a",
    explain: "\"Elements that have a choice of data type cannot repeat - they must have a maximum cardinality of 1.\" Jadi <code>effectiveDateTime</code> atau <code>effectivePeriod</code>, satu saja, bukan array.",
  },

  // ---------- res-meta ----------
  {
    id: "0002-14", lesson: "0002", topic: "res-meta", type: "mc",
    prompt: "Server mengembalikan <code>meta.versionId: \"3\"</code> dan <code>meta.lastUpdated</code>. Siapa yang mengisi, dan kapan nilainya berubah?",
    options: {
      a: "Klien mengisi saat create; nilainya tidak pernah berubah",
      b: "Profile mengisi otomatis; berubah saat profile itu diperbarui",
      c: "Server mengisi; keduanya berubah setiap konten resource berubah",
      d: "Terminology server mengisi; berubah saat kode LOINC diperbarui",
    },
    answer: "c",
    explain: "versionId \"Changes each time the content of the resource changes\"; pada write, server \"SHALL update this item\". lastUpdated diisi server dengan waktu server. versionId adalah dasar ETag/<code>If-Match</code> (lesson 0003).",
  },
  {
    id: "0002-15", lesson: "0002", topic: "res-meta", type: "mc",
    prompt: "Apa arti <code>\"meta\": { \"profile\": [\"http://…/StructureDefinition/…\"] }</code> di sebuah Patient?",
    options: {
      a: "URL halaman profil pasien di portal rumah sakit",
      b: "Klaim bahwa resource ini mematuhi profile StructureDefinition tersebut",
      c: "Daftar pengguna yang boleh membaca resource Patient ini",
      d: "Versi FHIR server yang terakhir mengubah resource ini",
    },
    answer: "b",
    explain: "meta.profile: \"Profiles this resource claims to conform to\", yaitu \"An assertion that the content conforms to a resource profile (a StructureDefinition)\". Klaim, bukan jaminan: server boleh menghapus klaim yang tidak valid.",
  },

  // ---------- res-contained ----------
  {
    id: "0002-16", lesson: "0002", topic: "res-contained", type: "mc",
    prompt: "Interface engine membuat Condition dari pesan HL7 v2, dan hanya tahu nama dokter (tanpa ID apa pun). Pola mana yang dicontohkan spesifikasi?",
    options: {
      a: "Buat Practitioner baru di server dengan nama itu",
      b: "Tulis nama dokter sebagai value di Reference.identifier saja",
      c: "Abaikan dokternya karena Reference selalu wajib berisi URL",
      d: "Practitioner ditaruh di contained, lalu dirujuk lewat #p1",
    },
    answer: "d",
    explain: "Contoh resmi: <code>contained: [{ resourceType: \"Practitioner\", id: \"p1\", … }]</code> dan <code>asserter: { reference: \"#p1\" }</code>. Hanya untuk data yang tidak bisa diidentifikasi: \"This SHOULD NOT be done when the content can be identified properly\". Contained tidak punya identitas sendiri dan tidak bisa di-read terpisah.",
  },

  // ---------- res-extension ----------
  {
    id: "0002-17", lesson: "0002", topic: "res-extension", type: "mc",
    prompt: "Rumah sakit butuh field suku pasien yang tidak ada di Patient R4. Bagaimana cara FHIR menambahkannya?",
    options: {
      a: "Elemen extension dengan url definisi dan satu value[x]",
      b: "Tambah property baru sukuPasien langsung di root JSON",
      c: "Simpan di Patient.text, karena narrative boleh diisi bebas",
      d: "Ajukan resource baru ke HL7 sebelum boleh dipakai",
    },
    answer: "a",
    explain: "\"Every element in a resource can have extension child elements\". Extension wajib punya <code>url</code> (canonical URL StructureDefinition-nya) dan value[x] <em>atau</em> sub-extension, bukan keduanya. Property baru di root membuat JSON tidak valid FHIR.",
  },
  {
    id: "0002-18", lesson: "0002", topic: "res-extension", type: "mc",
    prompt: "Kapan memakai <code>modifierExtension</code> alih-alih <code>extension</code>?",
    options: {
      a: "Saat extension berisi data sensitif seperti diagnosis pasien",
      b: "Saat extension dipakai lebih dari satu rumah sakit",
      c: "Saat mengabaikannya tidak aman karena mengubah makna data",
      d: "Saat value[x] extension bertipe CodeableConcept, bukan tipe string",
    },
    answer: "c",
    explain: "\"If it is not safe for an application processing the content of the resource to ignore the extension it SHALL be represented using a Modifier Extension\". Extension biasa boleh diabaikan; aplikasi yang memproses elemen ber-modifierExtension wajib, antara lain, memahaminya, menolak resource, atau meminta manusia mengecek.",
  },

  // ---------- res-baca ----------
  {
    id: "0002-19", lesson: "0002", topic: "res-baca", type: "mc",
    prompt: "Patient contoh resmi berisi <code>\"birthDate\": \"1974-12-25\"</code> dan <code>\"_birthDate\": { \"extension\": [ … patient-birthTime … ] }</code>. Apa fungsi <code>_birthDate</code>?",
    options: {
      a: "Salinan lama birthDate sebelum resource itu terakhir di-update",
      b: "Tempat extension untuk nilai primitif birthDate, yaitu jam",
      c: "Field privat server yang tidak boleh dibaca klien",
      d: "Tanggal lahir versi lain yang dipilih oleh pasien",
    },
    answer: "b",
    explain: "Nilai primitif JSON (string, angka) tidak bisa punya property, jadi id/extension-nya ditaruh di property bernama sama berawalan <code>_</code>. Di contoh resmi, extension <code>patient-birthTime</code> menambahkan jam lahir.",
  },
  {
    id: "0002-20", lesson: "0002", topic: "res-baca", type: "mc",
    prompt: "Observation glukosa resmi: <code>valueQuantity.value</code> 6.3 mmol/L, <code>referenceRange</code> 3.1–6.2 mmol/L, <code>interpretation</code> kode <code>H</code>. Kesimpulan yang tepat?",
    options: {
      a: "Status Observation belum final karena nilainya masih abnormal",
      b: "Satuan salah, karena mmol/L bukan kode UCUM sah",
      c: "referenceRange adalah batas nilai yang boleh disimpan server",
      d: "Nilai di atas rentang rujukan, ditandai tinggi (High)",
    },
    answer: "d",
    explain: "referenceRange adalah panduan interpretasi (\"Provides guide for interpretation\"), dan interpretation <code>H</code> = High. Status contoh itu <code>final</code>; status tidak bergantung pada normal/abnormal. <code>mmol/L</code> adalah kode UCUM (<code>system: http://unitsofmeasure.org</code>).",
  },

  // ---------- oral ----------
  {
    id: "0002-oral-1", lesson: "0002", topic: "res-codeable", type: "oral",
    prompt: "Interviewer menunjukkan JSON Observation berat badan (empat <code>coding</code> di <code>code</code>, <code>valueQuantity</code>, <code>subject</code>). \"Jelaskan JSON ini. Apa itu CodeableConcept, dan kenapa ada beberapa Coding?\" (90 detik)",
    sample: "\"Ini Observation, satu pengukuran: <code>status</code> final, <code>subject</code> merujuk <code>Patient/example</code> dengan reference relatif, dan hasilnya di <code>valueQuantity</code>: 185 dengan unit UCUM. <code>value[x]</code> adalah choice type, jadi nama property-nya ikut tipe. Apa yang diukur ada di <code>code</code>, bertipe CodeableConcept: daftar Coding plus <code>text</code> opsional. Setiap Coding adalah pasangan <code>system</code> + <code>code</code> (+ <code>display</code>), dan code hanya bermakna bersama system-nya. Ada empat Coding karena konsep yang sama dikodekan di beberapa sistem: dua LOINC, satu SNOMED CT, dan satu kode lokal. Itu translasi, urutannya tidak bermakna. Kode lokal berguna untuk debugging, kode standar untuk interoperabilitas. Di kode saya, saya cari Coding dengan system yang saya butuhkan, misalnya <code>http://loinc.org</code>, bukan mengambil <code>coding[0]</code>.\"",
    checklist: [
      "resource Observation: status, subject (Reference ke Patient), dan nilai di valueQuantity",
      "CodeableConcept = daftar Coding plus text; Coding = system + code (+ display)",
      "beberapa Coding = konsep sama di beberapa code system (translasi), urutan tidak bermakna",
      "menyebut LOINC untuk Observation.code dan SNOMED CT / kode lokal sebagai translasi",
      "code selalu dibaca bersama system; di kode klien cari berdasarkan system, bukan coding[0]",
      "value[x] adalah choice type: nama property ikut tipe (valueQuantity, unit UCUM)",
    ],
  },
  {
    id: "0002-oral-2", lesson: "0002", topic: "res-identifier", type: "oral",
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
  {
    id: "0002-oral-3", lesson: "0002", topic: "res-extension", type: "oral",
    prompt: "\"Rumah sakit kami butuh data yang tidak ada di resource FHIR standar. Apa yang Anda lakukan? Jelaskan juga <code>meta.profile</code> dan <code>contained</code>.\" (60 detik)",
    sample: "\"FHIR sengaja menaruh kebutuhan di luar inti ke extension: setiap elemen boleh punya <code>extension</code>, yang wajib punya <code>url</code> ke StructureDefinition yang mendefinisikannya, plus satu <code>value[x]</code> atau sub-extension. Aplikasi tidak boleh menolak resource hanya karena ada extension. Kalau data itu mengubah makna resource sehingga tidak aman diabaikan, wajib pakai <code>modifierExtension</code>. Extension biasanya didefinisikan dalam profile, dan resource bisa mengklaim mematuhi profile lewat <code>meta.profile</code>; <code>meta</code> juga berisi <code>versionId</code> dan <code>lastUpdated</code> yang diisi server. <code>contained</code> beda lagi: resource kecil yang disisipkan di dalam resource lain karena tidak bisa diidentifikasi sendiri, dirujuk dengan <code>#id</code>; jangan dipakai kalau datanya bisa punya identitas sendiri.\"",
    checklist: [
      "kebutuhan di luar inti memakai extension, bukan property JSON baru",
      "extension wajib punya url (StructureDefinition) dan value[x] atau sub-extension",
      "modifierExtension untuk data yang mengubah makna dan tidak aman diabaikan",
      "meta.profile = klaim resource mematuhi profile (StructureDefinition)",
      "meta.versionId dan meta.lastUpdated diisi server dan berubah setiap konten berubah",
      "contained = resource tanpa identitas sendiri di dalam resource lain, dirujuk dengan #id",
    ],
  },
]);
