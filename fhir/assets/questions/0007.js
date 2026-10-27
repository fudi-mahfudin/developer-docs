// Soal lesson FHIR 0007 · meta, contained, extension/modifierExtension, dan membaca resource utuh.
// Dipecah dari bank lama 0002 (slug topik tidak berubah). Format: assets/README.md (root). Sumber: hl7.org/fhir/R4.
QuestionBank.labelTopics({
  "res-meta": "meta: versionId, lastUpdated, profile",
  "res-contained": "Contained resource",
  "res-extension": "Extension dan modifierExtension",
  "res-baca": "Membaca JSON Patient, Encounter, Observation",
});

QuestionBank.register([
  // ---------- res-meta ----------
  {
    id: "0007-01", lesson: "0007", topic: "res-meta", type: "mc",
    prompt: "Server mengembalikan <code>meta.versionId: \"3\"</code> dan <code>meta.lastUpdated</code>. Siapa yang mengisi, dan kapan nilainya berubah?",
    options: {
      a: "Klien mengisi saat create; nilainya tidak pernah berubah",
      b: "Profile mengisi otomatis; berubah saat profile itu diperbarui",
      c: "Server mengisi; keduanya berubah setiap konten resource berubah",
      d: "Terminology server mengisi; berubah saat kode LOINC diperbarui",
    },
    answer: "c",
    explain: "versionId \"Changes each time the content of the resource changes\"; pada write, server \"SHALL update this item\". lastUpdated diisi server dengan waktu server. versionId adalah dasar ETag/<code>If-Match</code> (lesson 0010).",
  },
  {
    id: "0007-02", lesson: "0007", topic: "res-meta", type: "mc",
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
    id: "0007-03", lesson: "0007", topic: "res-contained", type: "mc",
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
    id: "0007-04", lesson: "0007", topic: "res-extension", type: "mc",
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
    id: "0007-05", lesson: "0007", topic: "res-extension", type: "mc",
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
    id: "0007-06", lesson: "0007", topic: "res-baca", type: "mc",
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
    id: "0007-07", lesson: "0007", topic: "res-baca", type: "mc",
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
    id: "0007-oral-1", lesson: "0007", topic: "res-extension", type: "oral",
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
