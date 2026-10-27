// Soal lesson 0002 (track FHIR, Modul Fondasi) · Resource vs datatype; R4 vs R5, Normative, maturity (FMM).
// Dipecah dari bank lama 0001 (slug topik tetap). Format: assets/README.md di root. Dimuat dari fhir/lessons/ sebagai ../assets/questions/0002.js.
QuestionBank.labelTopics({
  "dasar-resource": "Resource, kategori, dan datatype",
  "dasar-versi": "R4 vs R5, normative, dan maturity (FMM)",
});

QuestionBank.register([
  {
    id: "0002-01", lesson: "0002", topic: "dasar-resource", type: "mc",
    prompt: "Mana yang membedakan <strong>Resource</strong> dari datatype seperti <code>HumanName</code> atau <code>CodeableConcept</code>?",
    options: {
      a: "Resource punya identitas URL sendiri dan versi yang berubah",
      b: "Resource selalu lebih kecil dan hanya berisi nilai primitif",
      c: "Resource tidak boleh direferensikan oleh resource lain mana pun",
      d: "Resource hanya ada di XML, datatype hanya di JSON",
    },
    answer: "a",
    explain: "Resource \"has a known identity (a URL) by which it can be addressed\" dan \"has an identified version that changes if the contents of the resource change\". Datatype adalah \"re-usable clusters of elements\" yang dipakai <em>di dalam</em> resource, tanpa alamat sendiri. Resource saling merujuk lewat <code>Reference</code>.",
  },
  {
    id: "0002-02", lesson: "0002", topic: "dasar-resource", type: "mc",
    prompt: "Di indeks resource R4, <code>Observation</code> (hasil lab, tanda vital) berada di kategori mana?",
    options: {
      a: "Foundation",
      b: "Base",
      c: "Clinical",
      d: "Financial",
    },
    answer: "c",
    explain: "Indeks resource R4 punya lima level: Foundation (mis. <code>Bundle</code>, <code>StructureDefinition</code>), Base (mis. <code>Patient</code>, <code>Encounter</code>), Clinical (mis. <code>Observation</code>, <code>Condition</code>), Financial (mis. <code>Claim</code>), dan Specialized.",
  },
  {
    id: "0002-03", lesson: "0002", topic: "dasar-versi", type: "mc",
    prompt: "<code>Patient</code> dan <code>Observation</code> di R4 bertanda <strong>N</strong> (Normative). Apa artinya bagi tim Anda?",
    options: {
      a: "Resource itu masih draft dan bisa dihapus kapan saja",
      b: "Resource itu hanya boleh dipakai di Amerika Serikat saja",
      c: "Resource itu wajib dipakai bersama SMART on FHIR selalu",
      d: "Stabil, dikunci, dan tunduk pada aturan kompatibilitas antar versi",
    },
    answer: "d",
    explain: "Normative: \"The content is considered to be stable and has been 'locked', subjecting it to FHIR Inter-version Compatibility Rules.\" Konten Trial Use sebaliknya: \"Future versions of FHIR may make significant changes\". <code>Encounter</code> di R4 belum normative (FMM 2).",
  },
  {
    id: "0002-04", lesson: "0002", topic: "dasar-versi", type: "mc",
    prompt: "R5 terbit 26 Maret 2023, tetapi banyak sistem dan IG (mis. US Core) tetap di R4. Fakta mana dari spesifikasi yang paling menjelaskan ini?",
    options: {
      a: "R5 menghapus resource Patient dan Observation dari spesifikasi dasar",
      b: "R4 rilis normative pertama; R5 seluruhnya berstatus trial use",
      c: "R5 hanya mendukung XML sehingga tidak cocok untuk JavaScript",
      d: "R4 adalah versi terakhir yang boleh dipakai di produksi",
    },
    answer: "b",
    explain: "R4 (Des 2018) adalah \"First Normative content\". Untuk R5: \"None of the content in this specification is considered 'Normative'\" (konten yang sudah normative di R4 tetap berlabel Normative), dan \"HL7 plans to publish the next release as a normative specification\". US Core: \"based on FHIR Version R4\". Klaim \"R4 paling dominan di produksi\" adalah pengamatan industri, bukan kalimat spesifikasi.",
  },
  {
    id: "0002-05", lesson: "0002", topic: "dasar-versi", type: "mc",
    prompt: "Sebuah resource berstatus Trial Use dengan <strong>FMM 5</strong>. Apa arti FMM 5?",
    options: {
      a: "Dipakai minimal 5 sistem produksi independen di beberapa negara",
      b: "Baru diterbitkan di build, belum diuji oleh siapa pun",
      c: "Sudah dikunci, dijamin tidak akan berubah di rilis berikutnya",
      d: "Hanya diuji oleh tiga sistem buatan tim yang sama",
    },
    answer: "a",
    explain: "FMM 5: \"has been implemented in at least 5 independent production systems in more than one country\". FMM 0 = draft di build, FMM 2 = diuji interoperabilitasnya oleh minimal tiga sistem <em>independen</em>. Jaminan \"dikunci\" hanya milik status Normative, bukan FMM berapa pun.",
  },

  {
    id: "0002-oral-1", lesson: "0002", topic: "dasar-versi", type: "oral",
    prompt: "\"Kami memakai FHIR R4. Kenapa bukan R5? Dan apa arti label Normative dan FMM yang Anda lihat di spesifikasi?\" Jawab dalam 60 detik.",
    sample: "R4, versi 4.0.1, adalah rilis pertama yang memuat konten normative, terbit akhir 2018. Normative berarti konten itu stabil dan dikunci: tunduk pada aturan kompatibilitas antarversi, jadi data yang valid di R4 tetap valid di versi berikutnya. Bagian penting seperti REST API, format JSON, Patient, dan Observation sudah normative di R4. Konten lain berstatus Trial Use dengan Maturity Model FMM 0 sampai 5; FMM 5 berarti sudah dipakai di minimal lima sistem produksi independen di lebih dari satu negara, tapi masih bisa berubah. R5 terbit Maret 2023 sebagai rilis trial use: tidak ada konten baru yang normative, ada perubahan seperti rework Subscriptions. Karena itu ekosistem, termasuk IG besar seperti US Core, masih dibangun di atas R4, dan migrasi baru masuk akal saat rilis normative berikutnya.",
    checklist: [
      "R4 = 4.0.1, rilis pertama dengan konten normative (2018–2019)",
      "Normative = stabil, dikunci, tunduk aturan kompatibilitas antarversi",
      "Contoh normative di R4: REST API, JSON, Patient, Observation",
      "Trial Use + FMM 0–5; FMM 5 = minimal 5 sistem produksi independen, >1 negara",
      "R5 (Maret 2023) berstatus trial use; contoh perubahan: rework Subscriptions",
      "IG (mis. US Core) dan ekosistem masih di R4; HL7 berencana rilis berikutnya normative",
    ],
  },
]);
