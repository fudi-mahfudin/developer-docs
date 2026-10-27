// Soal lesson 0003 (track FHIR, Modul Fondasi) · Profile, Extension, Implementation Guide; server yang sering disebut.
// Dipecah dari bank lama 0001 (slug topik tetap); 0003-04 ditambahkan saat restruktur (≥ 4 kuis per bank). Format: assets/README.md di root. Dimuat dari fhir/lessons/ sebagai ../assets/questions/0003.js.
QuestionBank.labelTopics({
  "dasar-profil": "Profile, Extension, dan Implementation Guide",
});

QuestionBank.register([
  {
    id: "0003-01", lesson: "0003", topic: "dasar-profil", type: "mc",
    prompt: "Apa yang <strong>bisa</strong> dilakukan sebuah profile (StructureDefinition) terhadap resource dasar?",
    options: {
      a: "Mengganti nama-nama elemen resource agar sesuai dengan sistem lama",
      b: "Menambahkan properti JSON baru tanpa extension di root resource",
      c: "Membatasi kardinalitas, mengikat value set, dan mendefinisikan extension baru",
      d: "Mengonversi format JSON resource menjadi pesan berdelimiter HL7 v2",
    },
    answer: "c",
    explain: "Profile adalah \"A set of constraints on a resource represented as a structure definition\". Contoh kemampuannya: \"change the cardinality of an element\", max 0 untuk melarang elemen, \"Specifying a binding to a different terminology value set\", dan mendefinisikan extension. Profile tidak mengganti nama elemen atau format; data lokal tetap lewat extension.",
  },
  {
    id: "0003-02", lesson: "0003", topic: "dasar-profil", type: "mc",
    prompt: "Server Node Anda menerima <code>Patient</code> yang berisi <code>modifierExtension</code> dengan <code>url</code> yang tidak dikenal. Apa yang benar?",
    options: {
      a: "Abaikan saja, sama seperti extension biasa yang tidak dikenal",
      b: "Jangan diam-diam diabaikan: tolak, tangani khusus, atau beri peringatan",
      c: "Pindahkan isinya ke field <code>extension</code> lalu simpan seperti biasa",
      d: "Hapus seluruh resource itu dari database tanpa memberi tahu",
    },
    answer: "b",
    explain: "Modifier extension dipakai \"If it is not safe for an application processing the content of the resource to ignore the extension\". Aplikasi yang tidak mengenalnya harus menolak, menanganinya dengan cara yang ditentukan, atau memberi peringatan. Extension biasa yang tidak dikenal boleh diabaikan dengan aman.",
  },
  {
    id: "0003-03", lesson: "0003", topic: "dasar-profil", type: "mc",
    prompt: "Apa itu <strong>Implementation Guide</strong> (IG), misalnya US Core?",
    options: {
      a: "Server FHIR referensi yang wajib dijalankan setiap rumah sakit",
      b: "Versi terbaru FHIR yang menggantikan R4 untuk satu negara",
      c: "Library JavaScript resmi untuk memvalidasi resource FHIR di browser",
      d: "Kumpulan profile, extension, terminologi yang diterbitkan sebagai satu unit",
    },
    answer: "d",
    explain: "IG: \"A coherent and bounded set of adaptations that are published as a single unit.\" US Core \"defines the minimum constraints on the FHIR resources to create the US Core Profiles\" dan dibangun di atas R4. IG tidak mengganti versi FHIR; ia menyesuaikan FHIR dasar ke konteks tertentu (negara, organisasi, use case).",
  },
  {
    id: "0003-04", lesson: "0003", topic: "dasar-profil", type: "mc",
    prompt: "Sebuah extension di <code>Patient</code> yang Anda terima memuat <code>valueString</code> <em>dan</em> sub-extension sekaligus. Apa yang benar menurut spesifikasi R4?",
    options: {
      a: "Tidak sah: extension berisi <code>value[x]</code> atau sub-extension, bukan keduanya",
      b: "Sah, asalkan sub-extension ditulis sebelum <code>value[x]</code> di dalam objek",
      c: "Sah, parser FHIR selalu menggabungkan keduanya menjadi satu nilai",
      d: "Tidak sah, kecuali extension itu dijadikan <code>modifierExtension</code> terlebih dahulu",
    },
    answer: "a",
    explain: "\"An extension SHALL have either a value (i.e. a value[x] element) or sub-extensions, but not both.\" Urutan penulisan tidak mengubah aturan ini, dan <code>modifierExtension</code> hanya menandai extension yang tidak aman diabaikan; aturan isinya tetap sama.",
  },

  {
    id: "0003-oral-1", lesson: "0003", topic: "dasar-profil", type: "oral",
    prompt: "\"Kenapa FHIR 'dasar' tidak langsung cukup untuk sebuah negara atau organisasi? Jelaskan Profile, Extension, dan Implementation Guide.\" Jawab dalam 90 detik.",
    sample: "Spesifikasi dasar FHIR sengaja menjadi platform bersama: resource-nya hanya memuat elemen yang akan didukung kebanyakan sistem, jadi spesifikasi menyatakan bahwa ia biasanya perlu diadaptasi ke konteks pemakaian. Adaptasi itu ditulis sebagai <strong>profile</strong>, yaitu StructureDefinition berisi constraint: misalnya <code>identifier</code> pasien wajib (kardinalitas 1..*), elemen tertentu dilarang (max 0), kode harus dari value set tertentu, atau elemen ditandai must support. Kebutuhan yang tidak ada di core ditambahkan sebagai <strong>extension</strong>: objek dengan <code>url</code> ke definisinya plus <code>value[x]</code>; kalau extension itu mengubah makna data, ia harus menjadi <code>modifierExtension</code> yang tidak boleh diabaikan. Sekumpulan profile, extension, dan terminologi untuk satu konteks diterbitkan sebagai <strong>Implementation Guide</strong>, misalnya US Core di Amerika yang dibangun di atas R4. Resource bisa menyatakan kesesuaiannya lewat <code>meta.profile</code>. Analogi TypeScript: resource dasar adalah type yang longgar, profile adalah type yang lebih ketat plus aturan validasi, dan IG adalah package berisi kumpulan type itu.",
    checklist: [
      "Spesifikasi dasar = platform bersama dengan core kecil, biasanya perlu diadaptasi ke konteks",
      "Profile = StructureDefinition berisi constraint (kardinalitas, max 0, binding terminologi, must support)",
      "Extension = url ke definisi + value[x]; menambah data yang tidak ada di core",
      "modifierExtension mengubah makna, tidak boleh diabaikan diam-diam",
      "Implementation Guide = kumpulan adaptasi yang diterbitkan sebagai satu unit (contoh US Core di atas R4)",
      "meta.profile untuk menyatakan kesesuaian; analogi TS: type lebih ketat / package type",
    ],
  },
]);
