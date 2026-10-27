// Soal lesson 0016 (track FHIR, modul Bulk Data) · Jebakan decimal FHIR di JavaScript. Format: assets/README.md.
// Dipecah dari bank lama 0004 (lihat .scratch/restruktur-fhir/); slug topik tidak berubah.
// Fakta Bulk Data dari Bulk Data Access IG v2.0.0 (STU 2): https://hl7.org/fhir/uv/bulkdata/STU2/export.html
QuestionBank.labelTopics({
  "bulk-decimal": "Presisi decimal FHIR di JavaScript",
});

QuestionBank.register([
  {
    id: "0016-01", lesson: "0016", topic: "bulk-decimal", type: "mc",
    prompt: "Satu baris NDJSON berisi Observation dengan <code>\"valueQuantity\": { \"value\": 2.00, \"unit\": \"mmol/L\" }</code>. Apa yang terjadi pada <code>value</code> setelah <code>JSON.parse</code> di JavaScript?",
    options: {
      a: "Nilai tetap 2.00 karena JSON menyimpan presisi aslinya",
      b: "Parse gagal karena angka desimal harus berupa string",
      c: "Menjadi 2; nol di belakang dan presisinya hilang",
      d: "Menjadi string '2.00' karena FHIR mewajibkan tipe string",
    },
    answer: "c",
    explain: "FHIR R4 JSON: decimal ditulis sebagai JSON number, dan \"JavaScript natively supports only one numeric datatype ... trailing 0s after a decimal point will be lost e.g. 2.00 will be converted to 2.\" Padahal di datatypes R4, \"0.010 is regarded as different to 0.01, and the original precision should be preserved\".",
  },
  {
    id: "0016-02", lesson: "0016", topic: "bulk-decimal", type: "mc",
    prompt: "Bagaimana mempertahankan presisi <code>decimal</code> FHIR (mis. <code>0.010</code>) saat membaca JSON di Node?",
    options: {
      a: "Bulatkan semua nilai ke dua digit setelah koma",
      b: "Ambil teks asli angka lalu simpan sebagai decimal",
      c: "Kalikan seratus lalu simpan sebagai integer di database",
      d: "Pakai parseFloat ulang setelah JSON.parse untuk mengoreksi nilainya",
    },
    answer: "b",
    explain: "Spesifikasi menyarankan \"a custom parser and big number library\". Di Node 24, reviver <code>JSON.parse</code> menerima <code>context.source</code> (teks asli nilai primitif), jadi <code>'2.00'</code> bisa disimpan sebagai string atau tipe decimal (mis. kolom <code>NUMERIC</code> di database). <code>parseFloat</code> dan pembulatan tidak mengembalikan presisi yang sudah hilang.",
  },
  {
    id: "0016-03", lesson: "0016", topic: "bulk-decimal", type: "mc",
    prompt: "Anda menyimpan <code>valueQuantity.value</code> sebagai string <code>\"36.50\"</code> dari reviver, lalu mengirim resource kembali ke server FHIR dengan <code>JSON.stringify</code> biasa. Apa masalahnya?",
    options: {
      a: "Tidak ada masalah, server FHIR menerima string sebagai decimal",
      b: "<code>JSON.stringify</code> otomatis mengubah string angka kembali menjadi JSON number",
      c: "Nol di belakang koma hilang lagi saat stringify dijalankan",
      d: "Hasilnya JSON string, padahal decimal FHIR wajib JSON number",
    },
    answer: "d",
    explain: "Di FHIR R4, representasi JSON untuk <code>decimal</code> adalah \"A JSON number\". <code>JSON.stringify({ value: \"36.50\" })</code> menghasilkan <code>{\"value\":\"36.50\"}</code> (dicek di Node 24.21.0): nolnya utuh, tapi tipenya JSON string. <code>JSON.stringify</code> tidak pernah mengubah string menjadi number.",
  },
  {
    id: "0016-04", lesson: "0016", topic: "bulk-decimal", type: "mc",
    prompt: "Bagaimana menulis <code>36.50</code> kembali ke JSON sebagai JSON number tanpa kehilangan nol di belakang koma?",
    options: {
      a: "<code>JSON.rawJSON(\"36.50\")</code> di dalam objek sebelum <code>JSON.stringify</code> dipanggil",
      b: "<code>Number(\"36.50\")</code> lalu kirim hasilnya ke <code>JSON.stringify</code> biasa",
      c: "<code>parseFloat(\"36.50\").toFixed(2)</code> lalu simpan hasilnya sebagai string baru",
      d: "Kalikan seratus, simpan integer, bagi saat stringify",
    },
    answer: "a",
    explain: "MDN: <code>JSON.rawJSON()</code> \"creates a 'raw JSON' object containing a piece of JSON text. When serialized to JSON, the raw JSON object is treated as if it is already a piece of JSON.\" Di Node 24.21.0, <code>JSON.stringify({ value: JSON.rawJSON(\"36.50\") })</code> menghasilkan <code>{\"value\":36.50}</code>. <code>Number(\"36.50\")</code> menjadi 36.5 lagi, dan <code>toFixed</code> mengembalikan string sehingga hasilnya JSON string.",
  },
  {
    id: "0016-oral-1", lesson: "0016", topic: "bulk-decimal", type: "oral",
    prompt: "\"Observation dari server FHIR berisi <code>valueQuantity.value</code> 36.50. Bagaimana Anda menjaga presisinya dari parse, simpan ke database, sampai dikirim kembali?\" (60 detik)",
    sample: "\"Di FHIR presisi decimal adalah bagian dari data: 0.010 berbeda dengan 0.01, dan implementasi SHALL mempertahankannya. Masalahnya, <code>JSON.parse</code> mengubah angka JSON jadi Number JavaScript, jadi 36.50 menjadi 36.5 dan 2.00 menjadi 2. Di Node 24 saya pakai reviver dengan <code>context.source</code> untuk mengambil teks asli angkanya, lalu menyimpannya sebagai string atau kolom <code>NUMERIC</code>, bukan float. Saat mengirim kembali, decimal FHIR harus JSON number, jadi saya tidak mengirim string <code>\"36.50\"</code>; saya bungkus dengan <code>JSON.rawJSON</code> supaya <code>JSON.stringify</code> menulis 36.50 apa adanya. Untuk perhitungan, FHIR tidak mewajibkan aritmetika khusus; yang wajib dijaga adalah nilai yang disimpan dan ditampilkan.\"",
    checklist: [
      "presisi decimal FHIR bermakna (0.010 ≠ 0.01) dan SHALL dipertahankan",
      "<code>JSON.parse</code> mengubah ke Number: 36.50 jadi 36.5, 2.00 jadi 2",
      "reviver <code>context.source</code> (Node 24) untuk mengambil teks asli angka",
      "simpan sebagai string atau <code>NUMERIC</code>, bukan <code>float</code>",
      "kirim kembali sebagai JSON number dengan <code>JSON.rawJSON</code>, bukan JSON string",
      "perhitungan boleh memakai Number; yang wajib utuh adalah nilai tersimpan/tampil",
    ],
  },
]);
