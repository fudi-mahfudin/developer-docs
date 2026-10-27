// Soal lesson 0024 (track FHIR, modul PDP): dasar hukum (UU 27/2022, UU 17/2023, Permenkes 24/2022) dan
// tiga warna untuk field FHIR (drop, HMAC, aman).
// Dipecah dari bank lama 0007 (lihat .scratch/restruktur-fhir/). Lihat assets/README.md di root.
// Sumber: UU 27/2022, UU 17/2023, Permenkes 24/2022 (PDF peraturan.bpk.go.id), FHIR R4 security/secpriv,
// OpenTelemetry, Sentry, pino, Prometheus. Riset lengkap: .scratch/materi-fhir/research-pdp.md (diakses 2026-10-27).
QuestionBank.labelTopics({
  "pdp-hukum": "PDP: dasar hukum (UU PDP, UU Kesehatan, Permenkes Rekam Medis)",
  "pdp-field": "PDP: field FHIR yang di-drop, di-HMAC, atau aman",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0024-01", lesson: "0024", topic: "pdp-hukum", type: "mc",
    prompt: "Menurut UU 27/2022 tentang Pelindungan Data Pribadi, data kesehatan pasien termasuk kategori apa?",
    options: {
      a: "Data pribadi umum, setara nama lengkap dan agama",
      b: "Data pribadi spesifik, sejajar biometrik dan data anak",
      c: "Bukan data pribadi selama NIK pasien tidak disertakan",
      d: "Data publik karena dikirim ke platform milik pemerintah",
    },
    answer: "b",
    explain: "Pasal 4 ayat (2) huruf a: data spesifik meliputi \"data dan informasi kesehatan\", sejajar dengan biometrik, genetika, catatan kejahatan, data anak, dan keuangan pribadi. Penjelasannya: \"catatan atau keterangan individu yang berkaitan dengan kesehatan fisik, kesehatan mental, dan/atau pelayanan kesehatan\". Nama lengkap dan agama justru contoh data <em>umum</em> (ayat (3)).",
  },
  {
    id: "0024-02", lesson: "0024", topic: "pdp-field", type: "mc",
    prompt: "Log operasional untuk request <code>POST /Patient</code> ke SATUSEHAT. Mana yang aman dicatat apa adanya?",
    options: {
      a: "<code>identifier</code> berisi NIK pasien",
      b: "<code>birthDate</code> lengkap dengan tanggal",
      c: "<code>name</code> dan <code>telecom</code> pasien",
      d: "<code>resourceType</code> dan status HTTP",
    },
    answer: "d",
    explain: "NIK, nama, telepon, dan tanggal lahir lengkap adalah identitas: kelompok 🔴 drop. Yang 🟢 aman adalah metadata operasional yang tidak menunjuk orang: <code>resourceType</code>, jenis interaksi, status HTTP, latensi, jumlah entry.",
  },
  {
    id: "0024-03", lesson: "0024", topic: "pdp-hukum", type: "mc",
    prompt: "Log berisi data pasien bocor ke publik. Menurut UU PDP Pasal 46, apa kewajiban pengendali data?",
    options: {
      a: "Cukup laporan internal, karena publik tidak perlu tahu",
      b: "Lapor ke kepolisian paling lambat dalam 30 hari",
      c: "Beri tahu subjek dan lembaga dalam 3×24 jam",
      d: "Hanya memberi tahu Kemenkes lewat dashboard SATUSEHAT Platform",
    },
    answer: "c",
    explain: "Pasal 46 ayat (1): pemberitahuan tertulis \"paling lambat 3 x 24 (tiga kali dua puluh empat) jam\" kepada subjek data <em>dan</em> lembaga PDP. Isi minimalnya: data yang terungkap, kapan dan bagaimana, serta upaya pemulihan (ayat (2)). Dalam hal tertentu, masyarakat juga wajib diberi tahu (ayat (3)).",
  },
  {
    id: "0024-04", lesson: "0024", topic: "pdp-field", type: "mc",
    prompt: "Nama pasien sudah dihapus dari log. Mana yang tetap termasuk 🔴 <strong>drop</strong>?",
    options: {
      a: "Latensi request dan status HTTP response",
      b: "Jumlah entry dalam Bundle hasil search",
      c: "<code>resourceType</code> dan jenis interaksi yang dipanggil",
      d: "Kode diagnosis ICD-10 dari <code>Condition.code</code> pasien",
    },
    answer: "d",
    explain: "Diagnosis adalah isi klinis, yaitu inti \"data dan informasi kesehatan\". Digabung dengan waktu, faskes, atau ID korelasi, ia tetap bisa menunjuk satu orang (UU PDP Pasal 1 angka 1: \"dikombinasi dengan informasi lainnya\"). Modul privasi FHIR R4 juga menggolongkan <code>code</code> dan <code>value[x]</code> Observation sebagai <em>indirect identifier</em>.",
  },
  {
    id: "0024-05", lesson: "0024", topic: "pdp-hukum", type: "mc",
    prompt: "Pasien sudah meninggal. Apakah isi rekam medisnya boleh muncul bebas di log debug?",
    options: {
      a: "Tidak, kerahasiaan tetap berlaku walaupun pasien meninggal",
      b: "Boleh, kewajiban kerahasiaan berakhir saat pasien meninggal",
      c: "Boleh, asal log hanya dibaca tim internal",
      d: "Tidak, log debug wajib disimpan 25 tahun",
    },
    answer: "a",
    explain: "Permenkes 24/2022 Pasal 32 ayat (1): isi rekam medis \"wajib dijaga kerahasiaannya … walaupun Pasien telah meninggal dunia\", dan ayat (2) huruf f memperluasnya ke \"pihak lain yang memiliki akses terhadap data dan informasi kesehatan Pasien\", termasuk vendor sistem (tafsiran). Retensi 25 tahun (Pasal 39) berlaku untuk rekam medis, bukan log debug.",
  },
  {
    id: "0024-06", lesson: "0024", topic: "pdp-field", type: "mc",
    prompt: "Request token SATUSEHAT (<code>client_credentials</code>) gagal. Untuk debugging, apa yang boleh dicatat?",
    options: {
      a: "Nilai <code>client_secret</code> untuk memastikan secret benar",
      b: "Header <code>Authorization: Bearer</code> lengkap dari request",
      c: "Status HTTP dan <code>expires_in</code> dari respons",
      d: "Seluruh body respons yang berisi <code>access_token</code>",
    },
    answer: "c",
    explain: "Kredensial adalah kelompok 🔴 ketiga, selain identitas dan isi klinis. OWASP Logging Cheat Sheet: access token, password, dan secret tidak dicatat langsung. Siapa pun yang memegang access token SATUSEHAT bisa membaca data pasien atas nama faskes Anda.",
  },
  {
    id: "0024-oral-1", lesson: "0024", topic: "pdp-hukum", type: "oral",
    prompt: "\"Kenapa data kesehatan di log itu masalah hukum, bukan sekadar best practice?\" (60 detik)",
    sample: "Karena ada aturan yang mengikat, bukan cuma saran. UU 27/2022 Pasal 4 ayat (2) menggolongkan data kesehatan sebagai data pribadi <em>spesifik</em>, sejajar biometrik dan data anak. UU 17/2023 Pasal 351 mewajibkan penyelenggara Sistem Informasi Kesehatan menjamin pelindungan data Kesehatan setiap individu, dan Permenkes 24/2022 Pasal 32 mewajibkan isi rekam medis dirahasiakan, bahkan setelah pasien meninggal, termasuk oleh pihak lain yang punya akses. Sebagai vendor, kami biasanya prosesor, dan UU PDP Pasal 52 memberlakukan kewajiban keamanan dan kerahasiaan juga ke prosesor. Definisinya luas: data yang bisa mengidentifikasi orang kalau dikombinasi dengan informasi lain, jadi membuang nama saja tidak cukup. Kalau log bocor, itu insiden: pemberitahuan tertulis ke subjek data dan lembaga PDP paling lambat 3×24 jam (Pasal 46), dengan sanksi mulai denda administratif sampai 2% pendapatan tahunan hingga pidana untuk pengungkapan yang disengaja.",
    checklist: [
      "UU 27/2022 Pasal 4: data kesehatan = data pribadi spesifik",
      "UU 17/2023 Pasal 351 atau Permenkes 24/2022 Pasal 32: wajib dirahasiakan, juga setelah pasien meninggal",
      "vendor = prosesor, ikut terikat kewajiban keamanan (UU PDP Pasal 52)",
      "definisi luas: teridentifikasi lewat kombinasi, membuang nama saja tidak cukup",
      "log bocor = insiden: beri tahu subjek dan lembaga dalam 3×24 jam (Pasal 46)",
      "sanksi: denda administratif sampai 2% pendapatan tahunan, pidana untuk pengungkapan disengaja",
    ],
  },
]);
