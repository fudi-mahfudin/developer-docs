// Soal lesson 0014 (track FHIR, modul Bulk Data) · Manifest, NDJSON, _type/_since; batas JSON.parse di Node. Format: assets/README.md.
// Dipecah dari bank lama 0004 (lihat .scratch/restruktur-fhir/); slug topik tidak berubah.
// Fakta Bulk Data dari Bulk Data Access IG v2.0.0 (STU 2): https://hl7.org/fhir/uv/bulkdata/STU2/export.html
QuestionBank.labelTopics({
  "bulk-manifest": "Bulk Data: manifest, NDJSON, _type dan _since",
  "bulk-jsonparse": "Batas JSON.parse untuk file besar",
});

QuestionBank.register([
  {
    id: "0014-01", lesson: "0014", topic: "bulk-manifest", type: "mc",
    prompt: "Polling URL status akhirnya menghasilkan <code>200 OK</code>. Apa isi body-nya?",
    options: {
      a: "Satu Bundle searchset berisi semua resource yang diekspor",
      b: "Manifest JSON berisi transactionTime dan daftar URL file",
      c: "Satu file NDJSON besar berisi semua tipe resource",
      d: "OperationOutcome berisi ringkasan jumlah resource yang berhasil diekspor",
    },
    answer: "b",
    explain: "Complete status: \"A body containing a JSON object providing metadata, and links to the generated Bulk Data files.\" Field wajib: <code>transactionTime</code>, <code>request</code>, <code>requiresAccessToken</code>, <code>output</code> (array <code>{type, url, count?}</code>), dan <code>error</code> (file NDJSON berisi OperationOutcome). <code>deleted</code> opsional. Server SHOULD mengirim header <code>Expires</code>.",
  },
  {
    id: "0014-02", lesson: "0014", topic: "bulk-manifest", type: "mc",
    prompt: "Pernyataan mana yang benar tentang file di array <code>output</code> manifest Bulk Data?",
    options: {
      a: "Satu file boleh mencampur Patient dan Observation sekaligus",
      b: "Setiap file adalah array JSON yang dibungkus kurung",
      c: "Setiap tipe resource selalu tepat satu file saja",
      d: "Satu file satu tipe; satu baris satu resource",
    },
    answer: "d",
    explain: "IG: \"Each file SHALL contain resources of only one type, but a server MAY create more than one file for each resource type returned.\" Formatnya NDJSON: resource diserialisasi tanpa whitespace dan dipisahkan newline (FHIR R4 nd-json), bukan array JSON. Jadi satu tipe bisa punya beberapa file, dan setiap baris bisa di-<code>JSON.parse</code> sendiri.",
  },
  {
    id: "0014-03", lesson: "0014", topic: "bulk-manifest", type: "mc",
    prompt: "Job harian hanya ingin resource yang berubah sejak export kemarin, dengan <code>[base]/$export?_type=Patient,Observation&amp;_since=…</code>. Nilai apa yang paling aman untuk <code>_since</code>?",
    options: {
      a: "Waktu jam lokal client saat kick-off kemarin dikirim",
      b: "Header Expires dari respons manifest pada export kemarin",
      c: "Nilai transactionTime yang tercatat di manifest export kemarin",
      d: "Nilai meta.lastUpdated dari Patient pertama di file kemarin",
    },
    answer: "c",
    explain: "<code>transactionTime</code> \"Indicates the server's time when the query is run\": export SHALL memuat semua resource yang berubah sampai dan termasuk instant itu. Memakai nilai ini (jam server, bukan jam client) sebagai <code>_since</code> berikutnya menutup celah; pola Group di IG juga menyuruh client \"retains the transactionTime value from the response\". <code>_type</code> membatasi tipe resource; <code>Expires</code> hanya batas waktu unduh file.",
  },
  {
    id: "0014-04", lesson: "0014", topic: "bulk-jsonparse", type: "mc",
    prompt: "Kenapa <code>JSON.parse(await readFile('Observation.ndjson', 'utf8'))</code> salah untuk file 3 GB hasil <code>$export</code>?",
    options: {
      a: "String melebihi batas, dan NDJSON bukan satu dokumen",
      b: "JSON.parse hanya menerima file dengan ekstensi .json saja",
      c: "readFile selalu membaca file secara asinkron per baris",
      d: "Node otomatis memotong string menjadi beberapa potongan kecil",
    },
    answer: "a",
    explain: "Dua masalah. (1) Seluruh file harus jadi satu string dulu; <code>buffer.constants.MAX_STRING_LENGTH</code> adalah \"The largest length allowed for a single string instance\" (di Node 24.21.0: 536.870.888 UTF-16 code unit), dan hasil parse ikut menempati heap. (2) NDJSON adalah banyak dokumen JSON yang dipisah newline, jadi <code>JSON.parse</code> pada seluruh isi file melempar SyntaxError. Parse per baris.",
  },
  {
    id: "0014-05", lesson: "0014", topic: "bulk-jsonparse", type: "mc",
    prompt: "Endpoint Express Anda memanggil <code>JSON.parse</code> pada payload 50 MB. Apa efeknya terhadap request lain yang datang bersamaan?",
    options: {
      a: "Tidak ada, karena JSON.parse berjalan di thread pool",
      b: "Request lain dilayani worker baru yang dibuat otomatis",
      c: "Request lain mendapat 503 dari Node secara otomatis",
      d: "Semua request menunggu, karena parse memblok event loop",
    },
    answer: "d",
    explain: "Panduan Node \"Don't Block the Event Loop\": <code>JSON.parse</code> dan <code>JSON.stringify</code> \"are O(n) in the length of the input, for large n they can take surprisingly long\"; contoh mereka mem-parse string 50 MB dalam 1,3 detik. Parse itu sinkron di event loop, jadi selama itu tidak ada request lain yang dilayani.",
  },
  {
    id: "0014-oral-1", lesson: "0014", topic: "bulk-manifest", type: "oral",
    prompt: "\"Export Anda selesai dengan <code>200 OK</code>. Jelaskan isi manifest-nya dan bagaimana Anda memakainya untuk export harian yang inkremental.\" (60 detik)",
    sample: "\"Body 200 adalah manifest JSON. <code>transactionTime</code> adalah jam server saat query dijalankan; export memuat semua resource yang cocok sampai instant itu. <code>output</code> berisi satu item <code>{type, url, count?}</code> per file: satu file hanya satu tipe resource, tapi satu tipe bisa dipecah ke beberapa file. <code>error</code> berisi file NDJSON OperationOutcome; export yang sebagian gagal tetap 200. <code>requiresAccessToken: true</code> berarti unduhan file butuh token yang sama. Setiap file NDJSON, satu baris satu resource, dengan MIME type <code>application/fhir+ndjson</code>, dan harus diunduh sebelum header <code>Expires</code>. Untuk export harian, saya simpan <code>transactionTime</code> dan memakainya sebagai <code>_since</code> berikutnya, bukan jam client; <code>_type</code> membatasi tipe resource, dan dengan <code>_since</code> array <code>deleted</code> bisa berisi resource yang dihapus.\"",
    checklist: [
      "<code>transactionTime</code>: jam server saat query dijalankan, export memuat sampai instant itu",
      "<code>output</code>: <code>{type, url, count?}</code> per file; satu file satu tipe, satu tipe bisa beberapa file",
      "<code>error</code>: file NDJSON berisi OperationOutcome; sukses sebagian tetap 200",
      "<code>requiresAccessToken: true</code>: unduhan file memakai token yang sama",
      "NDJSON satu baris satu resource (<code>application/fhir+ndjson</code>), diunduh sebelum <code>Expires</code>",
      "<code>_since</code> = <code>transactionTime</code> sebelumnya (bukan jam client), <code>_type</code> membatasi tipe, <code>deleted</code> untuk yang dihapus",
    ],
  },
]);
