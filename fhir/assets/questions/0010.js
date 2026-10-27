// Soal lesson 0010 (track FHIR, modul REST) · Bundle transaction vs batch, conditional create, versioning (vread, ETag, If-Match). Dipecah dari lesson lama 0003 (FHIR REST API).
// Format: assets/README.md (root). Sumber: hl7.org/fhir/R4 (http.html, bundle.html, codesystem-bundle-type.html). 0010-05 ditambahkan 2026-10-27 (http.html, bundle.html).
QuestionBank.labelTopics({
  "rest-bundle": "Bundle transaction vs batch, conditional create",
  "rest-versioning": "Versioning: vread, ETag, If-Match",
});

QuestionBank.register([
  {
    id: "0010-01", lesson: "0010", topic: "rest-bundle", type: "mc",
    prompt: "Apa beda Bundle <code>transaction</code> dan <code>batch</code> ketika salah satu entry gagal validasi?",
    options: {
      a: "Keduanya membatalkan semua entry lain dan mengembalikan error",
      b: "Keduanya tetap menyimpan entry lain, melaporkan per entry",
      c: "Transaction tetap menyimpan entry lain; batch membatalkan semuanya",
      d: "Transaction gagal seluruhnya; batch memproses entry lain independen",
    },
    answer: "d",
    explain: "Transaction: \"all interactions or operations either succeed or fail together\"; gagal → satu OperationOutcome dengan status 4xx/5xx. Batch: \"a group of independent actions\"; respons <code>batch-response</code> bisa berisi sebagian sukses sebagian gagal, dan HTTP-nya tetap 200 bila batch-nya sendiri diproses.",
  },
  {
    id: "0010-02", lesson: "0010", topic: "rest-bundle", type: "mc",
    prompt: "Integrasi dari SIMRS lama mengirim Patient yang mungkin sudah ada. Anda memakai <code>POST [base]/Patient</code> dengan header <code>If-None-Exist: identifier=http://rs.example.org/mrn|12345</code>, dan tepat <strong>satu</strong> Patient cocok. Apa yang terjadi?",
    options: {
      a: "Server membuat Patient duplikat dengan id baru, <code>201</code>",
      b: "Server mengabaikan POST itu dan mengembalikan <code>200 OK</code>",
      c: "Server menimpa Patient lama dengan body baru, <code>200</code>",
      d: "Server menolak dengan <code>412 Precondition Failed</code> karena duplikat",
    },
    answer: "b",
    explain: "Conditional create: tidak ada yang cocok → create biasa (201); satu cocok → \"The server ignores the post and returns 200 OK\"; lebih dari satu cocok → 412 karena kriteria \"not selective enough\". Ini cara membuat import idempoten tanpa membuat Patient ganda.",
  },
  {
    id: "0010-03", lesson: "0010", topic: "rest-versioning", type: "mc",
    prompt: "Dua petugas membuka Patient yang sama (<code>meta.versionId</code> = 3) lalu sama-sama menyimpan. Bagaimana mencegah simpanan kedua diam-diam menimpa yang pertama?",
    options: {
      a: "Kunci baris di database selama form masih dibuka",
      b: "Bandingkan <code>meta.lastUpdated</code> di frontend sebelum menekan tombol simpan",
      c: "<code>PUT</code> dengan <code>If-Match: W/\"3\"</code>, ditolak <code>412</code> bila beda",
      d: "Pakai <code>PATCH</code> karena PATCH tidak pernah bisa bentrok",
    },
    answer: "c",
    explain: "\"Lost Updates ... can be prevented using a combination of the ETag and If-Match header.\" ETag = versionId (weak, <code>W/\"3\"</code>). \"If the version id given in the If-Match header does not match, the server returns a 412 Precondition Failed\". Cek di frontend rawan race; mengunci baris selama form terbuka tidak cocok untuk HTTP stateless.",
  },
  {
    id: "0010-04", lesson: "0010", topic: "rest-versioning", type: "mc",
    prompt: "Apa yang dikembalikan <code>GET [base]/Patient/123/_history/2</code>?",
    options: {
      a: "Bundle berisi semua versi Patient 123",
      b: "Versi terbaru, angka 2 diabaikan server",
      c: "Diff antara versi 1 dan 2",
      d: "Patient 123 persis pada versi 2",
    },
    answer: "d",
    explain: "Ini <strong>vread</strong>: <code>GET [base]/[type]/[id]/_history/[vid]</code> membaca satu versi tertentu. Semua versi (Bundle <code>type: history</code>) didapat dari <code>GET [base]/Patient/123/_history</code> tanpa vid.",
  },
  {
    id: "0010-05", lesson: "0010", topic: "rest-bundle", type: "mc",
    prompt: "Dalam satu Bundle <code>transaction</code>, Observation harus merujuk Patient yang baru dibuat di entry lain, jadi id Patient belum ada. Bagaimana menuliskannya?",
    options: {
      a: "Patient diberi <code>fullUrl</code> <code>urn:uuid</code> sementara; Observation lalu merujuk URN itu",
      b: "Kirim dua request terpisah; Bundle tidak bisa memuat referensi internal",
      c: "Isi <code>Patient.id</code> sendiri, karena server selalu memakai id dari client",
      d: "Pakai Bundle <code>batch</code>, karena batch mengizinkan antar-entry saling bergantung sepenuhnya",
    },
    answer: "a",
    explain: "Di transaction, <code>fullUrl</code> boleh berisi id sementara \"for reference in the bundle\"; server membuat id baru dan \"SHALL also update any references to that resource in the same bundle\". Batch justru melarangnya: \"there SHALL be no interdependencies between the different entries\". Id di body create diabaikan: \"If an id is provided, the server SHALL ignore it.\"",
  },
  {
    id: "0010-oral-1", lesson: "0010", topic: "rest-bundle", type: "oral",
    prompt: "\"Apa beda Bundle <code>transaction</code> dan <code>batch</code>? Kapan Anda memakai masing-masing?\" (60–90 detik)",
    sample: "\"Keduanya di-POST ke base URL, <code>POST [base]</code>, berisi Bundle dengan <code>type</code> transaction atau batch; setiap entry punya <code>request.method</code> dan <code>request.url</code>, jadi satu Bundle bisa berisi create, update, delete, dan read. Transaction itu atomik: semua sukses atau semua gagal. Kalau satu entry gagal, server menolak semuanya dengan 4xx/5xx dan satu OperationOutcome; kalau sukses, saya dapat <code>transaction-response</code>. Di dalam transaction, entry boleh saling merujuk lewat <code>fullUrl</code> <code>urn:uuid:...</code>, dan server mengganti referensi itu dengan id asli. Batch adalah sekumpulan aksi independen: tidak boleh ada ketergantungan antar-entry, dan <code>batch-response</code> berisi status per entry, sebagian bisa gagal. Saya pakai transaction untuk data yang harus konsisten, misalnya Encounter beserta Observation-nya; batch untuk banyak aksi yang tidak saling terkait, misalnya beberapa read sekaligus. Padanan JS: transaction seperti <code>prisma.$transaction</code>, batch seperti <code>Promise.allSettled</code>. Untuk import yang idempoten saya tambahkan conditional create (<code>ifNoneExist</code>) per entry.\"",
    checklist: [
      "<code>POST [base]</code> dengan <code>Bundle.type</code> transaction/batch, entry berisi <code>request.method</code> + <code>url</code>?",
      "transaction atomik: semua sukses atau semua gagal (4xx/5xx + OperationOutcome)?",
      "batch: aksi independen, respons per entry, sebagian boleh gagal?",
      "referensi antar-entry lewat <code>fullUrl</code> <code>urn:uuid</code> hanya di transaction; batch tanpa ketergantungan?",
      "contoh kapan memakai masing-masing (data saling terkait vs aksi lepas)?",
      "padanan JS (<code>$transaction</code> vs <code>allSettled</code>) atau conditional create untuk idempoten?",
    ],
  },
  {
    id: "0010-oral-2", lesson: "0010", topic: "rest-versioning", type: "oral",
    prompt: "\"Dua user mengedit Patient yang sama di React app Anda. Bagaimana mencegah lost update, dan bagaimana error-nya sampai ke UI?\" (90 detik)",
    sample: "\"Setiap resource FHIR punya <code>meta.versionId</code>, dan server mengirimnya sebagai ETag, misalnya <code>W/&quot;3&quot;</code>. Saat read saya simpan ETag itu; saat update saya kirim <code>PUT [base]/Patient/123</code> dengan <code>If-Match: W/&quot;3&quot;</code>. Kalau sementara itu user lain sudah menyimpan versi 4, server menolak dengan <code>412 Precondition Failed</code>, bukan menimpa diam-diam. Ini optimistic locking, sama seperti kolom version di ORM. Di UI saya tangkap 412, ambil versi terbaru, lalu minta user meninjau atau menggabungkan perubahan. Versi lama bisa dilihat dengan vread <code>_history/3</code> atau seluruh history. Untuk error lain, server mengembalikan <code>OperationOutcome</code>: setiap <code>issue</code> punya <code>severity</code>, <code>code</code> seperti <code>required</code> atau <code>conflict</code>, <code>diagnostics</code>, dan <code>expression</code> yang menunjuk elemen yang salah, jadi saya bisa menandai field di form. 400 artinya body tidak valid secara dasar, 422 melanggar profil atau aturan bisnis.\"",
    checklist: [
      "<code>meta.versionId</code> = ETag (weak, <code>W/\"n\"</code>)?",
      "update dengan <code>If-Match</code> berisi ETag terakhir yang dibaca?",
      "versi tidak cocok → <code>412 Precondition Failed</code>, lalu reload/merge di UI?",
      "menyebut optimistic locking / lost update, dan vread atau <code>_history</code>?",
      "error dalam <code>OperationOutcome</code>: <code>severity</code>, <code>code</code>, <code>diagnostics</code>, <code>expression</code>?",
      "membedakan 400 (tidak valid dasar) dan 422 (profil/aturan bisnis)?",
    ],
  },
]);
