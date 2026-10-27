// Soal lesson 0001 (track FHIR, Modul Fondasi) · Dari HL7 v2 ke FHIR, dan kenapa REST + JSON.
// Dipecah dari bank lama 0001 (slug topik tetap). Format: assets/README.md di root. Dimuat dari fhir/lessons/ sebagai ../assets/questions/0001.js.
QuestionBank.labelTopics({
  "dasar-v2-vs-fhir": "HL7 v2 vs FHIR",
  "dasar-rest-json": "FHIR di atas REST + JSON",
});

QuestionBank.register([
  {
    id: "0001-01", lesson: "0001", topic: "dasar-v2-vs-fhir", type: "mc",
    prompt: "Menurut halaman perbandingan v2 di spesifikasi R4, apa tantangan terbesar interoperabilitas HL7 v2?",
    options: {
      a: "Implementasi tiap sistem bervariasi, elemen yang didukung pun berbeda",
      b: "Formatnya JSON sehingga terlalu besar untuk jaringan rumah sakit",
      c: "Setiap pesan wajib dikirim lewat REST API dengan OAuth",
      d: "Tidak ada cara sama sekali untuk mengirim data pasien",
    },
    answer: "a",
    explain: "\"One of the biggest challenges with HL7 v2 interoperability is the variation of implementation\" dan \"the data elements supported can vary\". v2 adalah pesan berbasis segment (bukan JSON, bukan REST); justru variasi inilah yang ingin dikurangi FHIR dengan core yang kecil plus profile.",
  },
  {
    id: "0001-02", lesson: "0001", topic: "dasar-v2-vs-fhir", type: "mc",
    prompt: "Data lokal di HL7 v2 dikirim lewat Z-segment. Apa padanannya di FHIR, dan apa bedanya?",
    options: {
      a: "Z-segment juga, tetapi ditulis dalam format JSON, bukan pipe",
      b: "Field bebas di root JSON, tanpa definisi apa pun",
      c: "Extension ber-url ke definisinya, boleh di elemen mana pun",
      d: "Tidak ada; data lokal harus dikirim lewat sistem lain",
    },
    answer: "c",
    explain: "Makna Z-segment \"is opaque without prior manual explanation by the sender\". Extension FHIR wajib punya <code>url</code> yang \"identifies a retrievable extension definition\" dan \"can appear at any level (including within data types)\". Menambah properti sembarang ke JSON resource tidak sah: parser memakai definisi resource.",
  },
  {
    id: "0001-03", lesson: "0001", topic: "dasar-rest-json", type: "mc",
    prompt: "Klien Node Anda meminta JSON dari server FHIR R4. MIME type resmi apa yang dipakai di header <code>Accept</code>?",
    options: {
      a: "<code>application/json+fhir</code>",
      b: "<code>application/fhir+json</code>",
      c: "<code>text/fhir-json</code>",
      d: "<code>application/hl7-v2+json</code>",
    },
    answer: "b",
    explain: "\"The MIME-type for this format is <code>application/fhir+json</code>.\" (halaman JSON R4, berstatus Normative). Pola URL REST-nya <code>VERB [base]/[type]/[id]</code>, misalnya <code>GET [base]/Patient/123</code>.",
  },
  {
    id: "0001-04", lesson: "0001", topic: "dasar-rest-json", type: "mc",
    prompt: "Anda menerima objek JSON dari server FHIR dan perlu tahu jenis resource-nya sebelum diproses. Properti apa yang dibaca?",
    options: {
      a: "<code>type</code>",
      b: "<code>meta.profile</code>",
      c: "<code>kind</code>",
      d: "<code>resourceType</code>",
    },
    answer: "d",
    explain: "\"A resource is a JSON object with a property <code>resourceType</code> which informs the parser which resource type this is\". Di TypeScript, <code>resourceType</code> berperan sebagai discriminant dari union type. <code>meta.profile</code> hanya klaim kesesuaian terhadap profile, bukan jenis resource.",
  },

  {
    id: "0001-oral-1", lesson: "0001", topic: "dasar-v2-vs-fhir", type: "oral",
    prompt: "\"Apa itu FHIR, dan apa bedanya dengan HL7 v2?\" Jawab dalam 60 detik.",
    sample: "FHIR, Fast Healthcare Interoperability Resources, adalah standar HL7 untuk pertukaran data kesehatan yang dibangun dari komponen modular bernama <em>Resource</em>, misalnya Patient, Encounter, Observation. Setiap resource punya identitas URL, versi, dan bisa dibaca atau diubah sendiri lewat REST API, dengan format JSON (<code>application/fhir+json</code>) atau XML, di atas standar web yang sudah kita kenal: HTTP, JSON, OAuth. HL7 v2 adalah standar pesan yang lebih tua: pesan terdiri dari segment teks berdelimiter, segment tidak bisa dimanipulasi sendiri, dan implementasinya sangat bervariasi antar sistem; data lokal masuk Z-segment yang maknanya harus dijelaskan manual. Di FHIR, data lokal masuk extension yang punya URL ke definisinya, dan variasi dikelola lewat profile dan Implementation Guide. Keduanya bisa hidup berdampingan; banyak integrasi memetakan v2 ke FHIR.",
    checklist: [
      "FHIR = standar HL7, dibangun dari Resource modular (contoh: Patient, Observation)",
      "Resource punya identitas URL dan versi, bisa dibaca/diubah sendiri",
      "REST API + JSON/XML di atas standar web (HTTP, OAuth)",
      "HL7 v2 = pesan dari segment, segment tidak bisa dimanipulasi sendiri",
      "Masalah v2: variasi implementasi tinggi; Z-segment maknanya tidak jelas tanpa penjelasan manual",
      "Padanan di FHIR: extension ber-URL + profile/IG; v2 dan FHIR bisa berdampingan",
    ],
  },
]);
