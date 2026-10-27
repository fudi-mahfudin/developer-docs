// Soal lesson 0008 (track FHIR, modul REST) · Interaksi REST + status HTTP, search (tipe parameter, modifier, prefix). Dipecah dari lesson lama 0003 (FHIR REST API).
// Format: assets/README.md (root). Sumber: hl7.org/fhir/R4 (http.html, search.html). 0008-oral-1 ditambahkan 2026-10-27 (http.html).
QuestionBank.labelTopics({
  "rest-crud": "Interaksi REST FHIR dan status HTTP",
  "rest-search": "Search parameter, modifier, dan prefix",
});

QuestionBank.register([
  {
    id: "0008-01", lesson: "0008", topic: "rest-crud", type: "mc",
    prompt: "Client memanggil <code>GET [base]/Patient/123</code>, padahal Patient itu sudah di-<code>DELETE</code> sebelumnya. Status apa yang diharapkan spesifikasi R4?",
    options: {
      a: "<code>410 Gone</code>: resource pernah ada lalu dihapus",
      b: "<code>404 Not Found</code>: server tidak pernah menyimpannya",
      c: "<code>200 OK</code> dengan body resource versi terakhir",
      d: "<code>204 No Content</code> tanpa body sama sekali",
    },
    answer: "a",
    explain: "\"a GET for a deleted resource returns a 410 status code, whereas a GET for an unknown resource returns 404.\" Delete berarti read non-versi berikutnya mengembalikan 410. Versi lama tetap bisa dibaca lewat vread kalau server menyimpan history.",
  },
  {
    id: "0008-02", lesson: "0008", topic: "rest-crud", type: "mc",
    prompt: "Anda <code>POST [base]/Patient</code> dengan body Patient baru dan berhasil. Apa yang dikembalikan server?",
    options: {
      a: "<code>200 OK</code> dan id ditulis di body saja",
      b: "<code>202 Accepted</code> lalu client harus polling status job",
      c: "<code>201 Created</code> plus <code>Location</code> berisi id dan versi",
      d: "<code>204 No Content</code> karena client sudah punya resource",
    },
    answer: "c",
    explain: "Create: \"The server returns a 201 Created HTTP status code, and SHALL also return a Location header which contains the new Logical Id and Version Id\", formatnya <code>[base]/[type]/[id]/_history/[vid]</code>. <code>id</code> di body create diabaikan; server yang menentukan id. 202 + polling adalah pola Bulk Data (lesson 0004).",
  },
  {
    id: "0008-03", lesson: "0008", topic: "rest-search", type: "mc",
    prompt: "Query mana yang mencari Patient yang lahir <em>antara 1 Januari dan 31 Desember 2010</em> (inklusif)?",
    options: {
      a: "<code>Patient?birthdate=2010-01-01&amp;birthdate=2010-12-31</code>",
      b: "<code>Patient?birthdate=ge2010-01-01&amp;birthdate=le2010-12-31</code>",
      c: "<code>Patient?birthdate=ge2010-01-01,le2010-12-31</code>",
      d: "<code>Patient?birthdate=gt2010-01-01&amp;birthdate=gt2010-12-31</code>",
    },
    answer: "b",
    explain: "Parameter yang diulang = AND, nilai dipisah koma = OR. Prefix <code>ge</code> = lebih besar atau sama, <code>le</code> = lebih kecil atau sama; tanpa prefix berarti <code>eq</code>. Opsi a meminta tanggal yang sama dengan dua hari sekaligus, opsi c adalah OR (hampir semua Patient cocok), opsi d mengecualikan seluruh 2010.",
  },
  {
    id: "0008-04", lesson: "0008", topic: "rest-search", type: "mc",
    prompt: "Secara default, <code>GET [base]/Patient?family=sant</code> cocok dengan family name yang mana?",
    options: {
      a: "Hanya yang persis <code>sant</code>, huruf besar-kecil dibedakan",
      b: "Yang memuat <code>sant</code> di posisi mana saja",
      c: "Tidak ada, string wajib memakai modifier <code>:exact</code>",
      d: "<code>Santoso</code>, <code>SANTI</code>, dan sejenisnya: cocok awalan, case-insensitive",
    },
    answer: "d",
    explain: "Search string default: \"case-insensitive and accent-insensitive. May match just the start of a string.\" Untuk persis (termasuk huruf besar-kecil) pakai <code>:exact</code>; untuk di posisi mana saja pakai <code>:contains</code>.",
  },
  {
    id: "0008-05", lesson: "0008", topic: "rest-search", type: "mc",
    prompt: "Anda mencari Observation berat badan dengan kode LOINC <code>29463-7</code>, dan kodenya harus berasal dari sistem LOINC. Parameter mana yang benar?",
    options: {
      a: "<code>code=http://loinc.org|29463-7</code>",
      b: "<code>code:exact=29463-7</code>",
      c: "<code>code=29463-7@http://loinc.org</code>",
      d: "<code>code.system=loinc&amp;code.value=29463-7</code>",
    },
    answer: "a",
    explain: "<code>code</code> di Observation bertipe <strong>token</strong>, sintaksnya <code>[system]|[code]</code>; system dicocokkan dengan <code>Coding.system</code>. Contoh resmi: <code>Observation?code=http://loinc.org|1234-5</code>. <code>:exact</code> adalah modifier untuk tipe string.",
  },
  {
    id: "0008-06", lesson: "0008", topic: "rest-search", type: "mc",
    prompt: "Query mana yang mengembalikan Patient yang <em>tidak</em> punya nilai <code>gender</code> sama sekali?",
    options: {
      a: "<code>Patient?gender=null</code>",
      b: "<code>Patient?gender:exact=</code>",
      c: "<code>Patient?gender:missing=true</code>",
      d: "<code>Patient?gender:missing=false</code>",
    },
    answer: "c",
    explain: "\"Searching for gender:missing=true will return all the resources that don't have a value for the gender parameter\"; <code>:missing=false</code> sebaliknya, yang punya nilai. FHIR tidak punya literal <code>null</code> di search.",
  },
  {
    id: "0008-oral-1", lesson: "0008", topic: "rest-crud", type: "oral",
    prompt: "\"Jelaskan siklus hidup satu Patient lewat REST API FHIR: request apa yang Anda kirim untuk create, read, update, delete, dan search, dan status apa yang Anda harapkan?\" (60–90 detik)",
    sample: "\"Create: <code>POST [base]/Patient</code> tanpa id; server mengisi <code>id</code>, <code>meta.versionId</code>, dan <code>meta.lastUpdated</code>, lalu membalas <code>201</code> dengan header <code>Location: [base]/Patient/[id]/_history/[vid]</code>. Kalau saya mengirim id di body, server mengabaikannya. Read: <code>GET [base]/Patient/123</code> → 200; kalau tidak dikenal 404, kalau sudah dihapus 410. Update: <code>PUT [base]/Patient/123</code> → 200; PUT ke id yang belum ada hanya membuat resource (201) kalau server mengumumkan <code>updateCreate</code> di CapabilityStatement. Perubahan sebagian bisa lewat <code>PATCH</code>, mis. JSON Patch. Delete: <code>DELETE [base]/Patient/123</code> → 200 dengan body atau 204 tanpa body. Search: <code>GET [base]/Patient?name=peter</code>, atau <code>POST [base]/Patient/_search</code> dengan semantik sama, hasilnya 200 + Bundle <code>searchset</code>. Semua dengan <code>application/fhir+json</code>.\"",
    checklist: [
      "create = <code>POST [base]/Patient</code> → <code>201</code> + header <code>Location</code> berisi id dan versi?",
      "server yang menentukan <code>id</code>; id di body create diabaikan?",
      "read: 200, tidak dikenal <code>404</code>, sudah dihapus <code>410</code>?",
      "update <code>PUT</code> → 200; update-as-create (201) hanya kalau server mendukung <code>updateCreate</code>?",
      "delete → 200 (ada body) atau 204 (tanpa body); <code>PATCH</code> untuk perubahan sebagian?",
      "search lewat <code>GET</code> atau <code>POST _search</code>, hasil Bundle <code>searchset</code>?",
    ],
  },
]);
