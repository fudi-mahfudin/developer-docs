// Soal lesson FHIR 0005 · Reference (lewat Encounter) dan Observation: CodeableConcept vs Coding.
// Dipecah dari bank lama 0002 (slug topik tidak berubah). Format: assets/README.md (root). Sumber: hl7.org/fhir/R4.
QuestionBank.labelTopics({
  "res-reference": "Reference: relatif, logical, display",
  "res-codeable": "CodeableConcept vs Coding",
});

QuestionBank.register([
  // ---------- res-reference ----------
  {
    id: "0005-01", lesson: "0005", topic: "res-reference", type: "mc",
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
    id: "0005-02", lesson: "0005", topic: "res-reference", type: "mc",
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
    id: "0005-03", lesson: "0005", topic: "res-codeable", type: "mc",
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
    id: "0005-04", lesson: "0005", topic: "res-codeable", type: "mc",
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
    id: "0005-05", lesson: "0005", topic: "res-codeable", type: "mc",
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

  // ---------- oral ----------
  {
    id: "0005-oral-1", lesson: "0005", topic: "res-codeable", type: "oral",
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
]);
