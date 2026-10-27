// Soal lesson FHIR 0006 · Terminologi (LOINC, SNOMED CT, ICD-10) dan choice type value[x].
// Dipecah dari bank lama 0002 (slug topik tidak berubah). Format: assets/README.md (root). Sumber: hl7.org/fhir/R4.
QuestionBank.labelTopics({
  "res-terminologi": "LOINC, SNOMED CT, ICD-10",
  "res-choice": "Choice type value[x]",
});

QuestionBank.register([
  // ---------- res-terminologi ----------
  {
    id: "0006-01", lesson: "0006", topic: "res-terminologi", type: "mc",
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
    id: "0006-02", lesson: "0006", topic: "res-terminologi", type: "mc",
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
    id: "0006-03", lesson: "0006", topic: "res-choice", type: "mc",
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
    id: "0006-04", lesson: "0006", topic: "res-choice", type: "mc",
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

  // ---------- oral ----------
  {
    id: "0006-oral-1", lesson: "0006", topic: "res-terminologi", type: "oral",
    prompt: "\"Sistem lab kami mengirim hasil glukosa darah dan diagnosis pasien ke server FHIR. Code system apa yang Anda pakai untuk masing-masing, dan bagaimana menuliskannya di JSON?\" (60 detik)",
    sample: "\"Apa yang diukur saya tulis di <code>Observation.code</code> dengan LOINC, <code>system</code> <code>http://loinc.org</code>, misalnya <code>15074-8</code> untuk glukosa darah; spesifikasi menyebut <code>Observation.code</code> preferably LOINC. Hasil angkanya di <code>valueQuantity</code> dengan satuan UCUM, <code>system</code> <code>http://unitsofmeasure.org</code>, kode <code>mmol/L</code>. Kalau hasilnya berkode, misalnya Negative, <code>value[x]</code> menjadi <code>valueCodeableConcept</code> dengan SNOMED CT, <code>http://snomed.info/sct</code>. Diagnosis untuk pelaporan dan klaim memakai ICD-10, <code>system</code> <code>http://hl7.org/fhir/sid/icd-10</code>, dan kodenya ditulis dengan titik, seperti <code>J21.8</code>; SNOMED CT menamai konsep klinisnya. Setiap kode selalu saya tulis berpasangan dengan <code>system</code>-nya. Di spesifikasi inti, binding <code>Observation.code</code> dan <code>Condition.code</code> hanya example, jadi profile nasional seperti SATUSEHAT biasanya memperketatnya; itu yang saya cek dulu.\"",
    checklist: [
      "Observation.code memakai LOINC (system http://loinc.org), mis. 15074-8 untuk glukosa darah",
      "hasil angka di valueQuantity dengan satuan UCUM (system http://unitsofmeasure.org)",
      "hasil berkode di valueCodeableConcept dengan SNOMED CT (system http://snomed.info/sct)",
      "diagnosis untuk pelaporan/klaim memakai ICD-10 (system http://hl7.org/fhir/sid/icd-10), kode ditulis dengan titik",
      "kode selalu ditulis berpasangan dengan system-nya",
      "binding Observation.code/Condition.code di spesifikasi inti hanya example; profile nasional (mis. SATUSEHAT) biasanya memperketatnya",
    ],
  },
]);
