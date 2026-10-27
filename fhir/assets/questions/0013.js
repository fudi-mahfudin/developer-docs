// Soal lesson 0013 (track FHIR, modul Bulk Data) · Tiga level $export; alur kick-off → 202 → polling → manifest. Format: assets/README.md.
// Dipecah dari bank lama 0004 (lihat .scratch/restruktur-fhir/); slug topik tidak berubah.
// Fakta Bulk Data dari Bulk Data Access IG v2.0.0 (STU 2): https://hl7.org/fhir/uv/bulkdata/STU2/export.html
QuestionBank.labelTopics({
  "bulk-export": "Bulk Data: level $export dan kick-off",
  "bulk-polling": "Bulk Data: 202, polling, Retry-After, 429",
});

QuestionBank.register([
  {
    id: "0013-01", lesson: "0013", topic: "bulk-export", type: "mc",
    prompt: "Tim analitik butuh semua data klinis untuk satu kohort pasien diabetes yang sudah didefinisikan sebagai resource <code>Group</code> di server. Endpoint <code>$export</code> mana yang paling tepat?",
    options: {
      a: "<code>[base]/Group/[id]/$export</code>, hanya data anggota grup itu",
      b: "<code>[base]/$export</code>, lalu saring pasien di client",
      c: "<code>[base]/Patient/$export</code>, lalu buang semua pasien non-diabetes",
      d: "<code>[base]/Observation?_count=1000</code>, lalu ikuti semua link next",
    },
    answer: "a",
    explain: "Bulk Data IG mendefinisikan tiga endpoint: <code>[fhir base]/Patient/$export</code> (semua pasien), <code>[fhir base]/Group/[id]/$export</code> (\"all members of a specified Group\"), dan <code>[fhir base]/$export</code> (system level, data apa pun termasuk yang tidak terkait pasien). Untuk kohort yang sudah didefinisikan, Group-level adalah pilihan yang tepat. Paging search biasa bekerja, tapi bukan alat untuk jutaan resource.",
  },
  {
    id: "0013-02", lesson: "0013", topic: "bulk-export", type: "mc",
    prompt: "Header mana yang menurut Bulk Data IG sebaiknya dikirim client pada request kick-off <code>$export</code> supaya server memprosesnya secara asinkron?",
    options: {
      a: "<code>Accept: application/fhir+ndjson</code> pada request kick-off",
      b: "<code>Cache-Control: no-store</code> pada request kick-off",
      c: "<code>Prefer: respond-async</code> pada request kick-off",
      d: "<code>Connection: keep-alive</code> pada request kick-off",
    },
    answer: "c",
    explain: "<code>Prefer</code> \"Specifies whether the response is immediate or asynchronous. Currently, only a value of respond-async is supported. A client SHOULD provide this header.\" <code>Accept</code> pada kick-off menentukan format OperationOutcome (<code>application/fhir+json</code>), bukan format file; format file diatur parameter <code>_outputFormat</code> yang default-nya <code>application/fhir+ndjson</code>.",
  },
  {
    id: "0013-03", lesson: "0013", topic: "bulk-polling", type: "mc",
    prompt: "Kick-off <code>GET [base]/Patient/$export</code> diterima server. Respons sukses apa yang diharapkan?",
    options: {
      a: "200 OK berisi semua resource dalam body",
      b: "202 Accepted dengan Content-Location menunjuk URL status",
      c: "201 Created dengan header Location menunjuk file",
      d: "303 See Other menuju URL file NDJSON",
    },
    answer: "b",
    explain: "Respons sukses kick-off: \"HTTP Status Code of 202 Accepted\" dan \"Content-Location header with the absolute URL of an endpoint for subsequent status requests (polling location)\". Export berjalan di belakang; datanya diambil nanti lewat URL di manifest.",
  },
  {
    id: "0013-04", lesson: "0013", topic: "bulk-polling", type: "mc",
    prompt: "Saat polling URL status, server membalas <code>202 Accepted</code> dengan <code>X-Progress: \"50% complete\"</code> dan <code>Retry-After: 120</code>. Apa yang sebaiknya dilakukan client?",
    options: {
      a: "Anggap export gagal lalu kirim kick-off baru",
      b: "Langsung polling ulang setiap detik sampai selesai",
      c: "Unduh file NDJSON yang sudah ada sekarang",
      d: "Tunggu sekitar 120 detik sebelum polling berikutnya",
    },
    answer: "d",
    explain: "202 di URL status berarti masih diproses. IG: \"Clients SHOULD follow an exponential backoff approach when polling for status\"; <code>Retry-After</code> berisi detik (mis. 120) atau http-date, dan \"clients SHOULD use this information to inform the timing of future polling requests.\" Belum ada manifest, jadi belum ada URL file.",
  },
  {
    id: "0013-05", lesson: "0013", topic: "bulk-polling", type: "mc",
    prompt: "Client Anda polling URL status terlalu sering. Respons apa yang disarankan Bulk Data IG untuk server?",
    options: {
      a: "<code>429 Too Many Requests</code> plus header <code>Retry-After</code>",
      b: "<code>500 Internal Server Error</code> lalu batalkan export",
      c: "<code>202 Accepted</code> tanpa header apa pun lagi",
      d: "<code>404 Not Found</code> sampai export selesai dibuat",
    },
    answer: "a",
    explain: "\"if a client is polling too frequently, the server SHOULD respond with a 429 Too Many Requests status code in addition to a Retry-After header\". Kalau terus berlanjut, server MAY mengakhiri sesi. 429 + <code>Retry-After</code> juga disarankan bila client memulai export baru saat export lain masih berjalan. 404 dipakai setelah export dibatalkan dengan <code>DELETE</code>.",
  },
  {
    id: "0013-oral-1", lesson: "0013", topic: "bulk-polling", type: "oral",
    prompt: "\"Bagaimana Anda mengekspor jutaan resource dari server FHIR?\" Jelaskan alur Bulk Data <code>$export</code> dari kick-off sampai file diunduh. (90 detik)",
    sample: "\"Saya tidak memakai paging search biasa, tapi Bulk Data <code>$export</code>. Ada tiga level: <code>Patient/$export</code> untuk semua pasien, <code>Group/[id]/$export</code> untuk satu kohort, dan <code>$export</code> di base untuk seluruh server. Client mendapat token lewat SMART Backend Services, lalu kick-off dengan <code>Prefer: respond-async</code>, opsional <code>_type</code> untuk membatasi tipe resource dan <code>_since</code> untuk export inkremental. Server membalas 202 Accepted dengan header <code>Content-Location</code>, yaitu URL status. Client polling URL itu: selama masih 202, ikuti <code>Retry-After</code> dan exponential backoff; kalau terlalu sering, server membalas 429. Setelah selesai, 200 dengan manifest JSON: <code>transactionTime</code>, <code>requiresAccessToken</code>, array <code>output</code> berisi URL file NDJSON per tipe resource, dan array <code>error</code> berisi OperationOutcome. File diunduh sebelum <code>Expires</code>, diproses secara streaming, dan <code>transactionTime</code> disimpan sebagai <code>_since</code> untuk export berikutnya.\"",
    checklist: [
      "tiga level: <code>Patient/$export</code>, <code>Group/[id]/$export</code>, system <code>$export</code>",
      "kick-off asinkron dengan <code>Prefer: respond-async</code>, autentikasi lewat SMART Backend Services",
      "202 Accepted + <code>Content-Location</code> sebagai URL status",
      "polling: 202 selama berjalan, hormati <code>Retry-After</code>/backoff, 429 kalau terlalu sering",
      "200 + manifest: <code>output</code> (URL file NDJSON per tipe), <code>error</code>, <code>transactionTime</code>",
      "<code>_type</code> untuk membatasi tipe dan <code>_since</code> = <code>transactionTime</code> sebelumnya untuk inkremental",
    ],
  },
]);
