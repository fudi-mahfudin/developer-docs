// Soal lesson 0026 (track FHIR, modul PDP): teknik redaksi (allowlist, HMAC, pino redact) dan
// audit trail (AuditEvent) vs log operasional.
// Dipecah dari bank lama 0007 (lihat .scratch/restruktur-fhir/). Lihat assets/README.md di root.
// Sumber: UU 27/2022, UU 17/2023, Permenkes 24/2022 (PDF peraturan.bpk.go.id), FHIR R4 security/secpriv,
// OpenTelemetry, Sentry, pino, Prometheus. Riset lengkap: .scratch/materi-fhir/research-pdp.md (diakses 2026-10-27).
QuestionBank.labelTopics({
  "pdp-teknik": "PDP: teknik redaksi (allowlist, HMAC, pino redact)",
  "pdp-audit": "PDP: audit trail (AuditEvent) vs log operasional",
  "pdp-field": "PDP: field FHIR yang di-drop, di-HMAC, atau aman", // jawaban lisan penutup modul (0026-oral-2)
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0026-01", lesson: "0026", topic: "pdp-teknik", type: "mc",
    prompt: "Anda perlu mengkorelasikan semua log milik satu pasien tanpa menyimpan nomor IHS-nya. Teknik mana yang tepat?",
    options: {
      a: "SHA-256 polos dari nomor IHS pasien",
      b: "HMAC dengan secret yang disimpan terpisah",
      c: "Base64 nomor IHS supaya tidak terbaca",
      d: "Simpan nomor IHS, batasi retensi log",
    },
    answer: "b",
    explain: "Dokumentasi OpenTelemetry memperingatkan hash ID \"reversible in practice if the input space is small and predictable\": penyerang cukup meng-hash semua kemungkinan nomor. HMAC dengan secret di secret manager mencegah itu selama secret aman. Base64 hanya encoding. Hasil HMAC tetap bisa dihubungkan kembali oleh pemegang secret, jadi log tetap diperlakukan sebagai data pribadi (tafsiran Pasal 1 angka 1 UU PDP).",
  },
  {
    id: "0026-02", lesson: "0026", topic: "pdp-audit", type: "mc",
    prompt: "Auditor bertanya: siapa yang membuka rekam medis pasien X minggu lalu? Dari mana jawabannya?",
    options: {
      a: "<code>AuditEvent</code> di store terbatas yang tidak bisa diubah",
      b: "Log aplikasi biasa yang mencatat body setiap response",
      c: "Dashboard APM dengan label metrik berisi ID pasien",
      d: "Breadcrumb Sentry dari sesi user yang membuka pasien",
    },
    answer: "a",
    explain: "FHIR R4: <code>AuditEvent</code> untuk \"maintenance of security audit log information\"; server umumnya tidak menerima update/delete atasnya, dan aksesnya terbatas untuk keamanan, privasi, atau administrasi. UU PDP Pasal 31 juga mewajibkan perekaman seluruh kegiatan pemrosesan. Audit memang berisi identitas, karena itu disimpan terpisah dari log operasional.",
  },
  {
    id: "0026-03", lesson: "0026", topic: "pdp-teknik", type: "mc",
    prompt: "Kenapa redaksi sebaiknya memakai <strong>allowlist</strong>, bukan denylist?",
    options: {
      a: "Allowlist membuat ukuran log jauh lebih besar",
      b: "Field baru otomatis tertahan sampai sengaja diizinkan",
      c: "Denylist tidak didukung oleh pino maupun OpenTelemetry",
      d: "UU PDP menyebut kata allowlist secara eksplisit",
    },
    answer: "b",
    explain: "Resource FHIR bisa bertambah field kapan saja: extension baru, profil SATUSEHAT yang berubah. Denylist bocor diam-diam untuk field yang belum pernah Anda pikirkan; allowlist gagal secara aman. Redaction processor OTel Collector bekerja persis begitu: menghapus atribut \"that don't match a list of allowed attributes\". UU PDP tidak menyebut teknik apa pun.",
  },
  {
    id: "0026-04", lesson: "0026", topic: "pdp-audit", type: "mc",
    prompt: "Mana pembagian yang benar antara audit trail dan log operasional?",
    options: {
      a: "Log operasional menyimpan identitas, audit cukup hitungan request",
      b: "Keduanya digabung supaya satu query bisa menjawab semuanya",
      c: "Audit menyimpan identitas akses, log operasional tanpa identitas",
      d: "Audit tidak perlu karena log operasional sudah cukup",
    },
    answer: "c",
    explain: "Dua tujuan, dua jalur. Audit menjawab \"siapa mengakses pasien mana\", jadi wajib berisi identitas, append-only, akses terbatas. Log operasional menjawab \"kenapa sistem lambat atau error\", jadi tidak butuh identitas, cukup ID korelasi ber-HMAC, dan retensinya pendek.",
  },
  {
    id: "0026-05", lesson: "0026", topic: "pdp-teknik", type: "mc",
    prompt: "pino dikonfigurasi <code>redact: ['patient.name', 'patient.identifier']</code>. Kasus mana yang tetap bocor?",
    options: {
      a: "Field <code>durationMs</code> berisi latensi request handler",
      b: "Field <code>patient.name</code> di objek log bersarang",
      c: "Array <code>patient.identifier</code> berisi NIK dan KK",
      d: "Nama pasien disisipkan ke string pesan",
    },
    answer: "d",
    explain: "pino <code>redact</code> bekerja pada <em>path kunci objek</em> (case-sensitive), bukan isi string. <code>logger.info(`create ${patient.name[0].text}`)</code> lolos utuh. Aturannya: data selalu sebagai field terstruktur, jangan diinterpolasi ke pesan.",
  },
  {
    id: "0026-oral-1", lesson: "0026", topic: "pdp-audit", type: "oral",
    prompt: "\"Kalau log tidak boleh berisi identitas pasien, bagaimana Anda tahu siapa yang mengakses data pasien X?\" (60 detik)",
    sample: "Itu dua kebutuhan berbeda, jadi dua jalur. Log operasional untuk debugging dan performa: tanpa identitas, ID pasien hanya dalam bentuk HMAC, retensi pendek, aksesnya tim engineering. Audit trail untuk akuntabilitas: setiap akses ke data pasien dicatat sebagai <code>AuditEvent</code>, yaitu siapa, pasien mana, aksi apa, kapan, dari mana. Store-nya append-only, tidak bisa di-update atau di-delete, dan hanya bisa dibaca tim keamanan atau privasi. UU PDP Pasal 31 memang mewajibkan perekaman seluruh kegiatan pemrosesan, dan UU Kesehatan Pasal 347 menyebut audit berkala. Jadi audit justru berisi identitas, tapi dilindungi seketat rekam medisnya. Kalau saya perlu menelusuri error untuk pasien X, saya hitung HMAC dari ID-nya lalu cari di log operasional.",
    checklist: [
      "dua kebutuhan berbeda: operasional vs akuntabilitas",
      "log operasional: tanpa identitas, HMAC, retensi pendek",
      "audit: AuditEvent berisi siapa, pasien mana, aksi, kapan",
      "audit append-only (tidak bisa update/delete), akses terbatas",
      "dasar: UU PDP Pasal 31 (rekam kegiatan pemrosesan)",
      "menelusuri pasien di log lewat HMAC dari ID-nya",
    ],
  },
  {
    id: "0026-oral-2", lesson: "0026", topic: "pdp-field", type: "oral",
    prompt: "\"Data apa saja yang tidak boleh muncul di log atau monitoring sistem yang terhubung ke SATUSEHAT?\" (90 detik)",
    sample: "Kenapa dulu: data kesehatan adalah data pribadi <em>spesifik</em> menurut UU PDP Pasal 4, isi rekam medis wajib dirahasiakan menurut Permenkes 24/2022, bahkan setelah pasien meninggal, dan kalau bocor kami wajib memberi tahu pasien dan lembaga dalam 3×24 jam. Yang saya drop ada tiga kelompok. Satu, identitas: NIK, KK, paspor, nomor rekam medis, nama, telepon, alamat, tanggal lahir lengkap. Dua, isi klinis: diagnosis ICD-10 di <code>Condition</code>, hasil lab di <code>Observation.value</code>, obat KFA, catatan, dan narrative <code>text.div</code>. Tiga, kredensial: <code>client_secret</code> dan bearer token SATUSEHAT. Logical id dan nomor IHS boleh masuk sebagai HMAC untuk korelasi. Yang aman: <code>resourceType</code>, interaksi, status, latensi, <code>issue.code</code>. Bocornya sering bukan dari body, tapi dari query search di URL, <code>OperationOutcome.diagnostics</code>, atribut trace, dan Sentry. Caranya: allowlist di sumber, bukan denylist; dan siapa-mengakses-siapa dicatat di audit trail terpisah, bukan di log biasa.",
    checklist: [
      "kenapa: data kesehatan = data spesifik (UU PDP Pasal 4) + rahasia rekam medis (Permenkes 24/2022)",
      "identitas: NIK/KK/paspor, No. RM, nama, telecom, alamat, tanggal lahir",
      "isi klinis: diagnosis, hasil lab, obat, narrative text.div",
      "kredensial: client_secret dan bearer token",
      "di mana bocor: query search, diagnostics, trace/Sentry",
      "bagaimana: allowlist + HMAC untuk ID korelasi, audit trail terpisah",
    ],
  },
]);
