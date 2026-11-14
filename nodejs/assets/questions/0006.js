// Soal lesson 0006 (track Node.js, modul Async & error) · Error handling async. Format: assets/README.md.
// Sumber: Node.js v24 docs (Errors, Process: unhandledRejection/uncaughtException, CLI --unhandled-rejections, Events: error events),
// ECMAScript Language Specification (InstallErrorCause).
QuestionBank.labelTopics({
  "async-unhandled": "Async: try/catch async, unhandled rejection, uncaughtException",
  "async-error-design": "Async: event 'error', Error.cause, operational vs programmer error",
});

QuestionBank.register([
  {
    id: "0006-01", lesson: "0006", topic: "async-unhandled", type: "mc",
    prompt: "Di Node 24 tanpa flag apa pun dan tanpa listener <code>unhandledRejection</code>, sebuah Promise reject dan tidak pernah ditangkap. Apa yang terjadi?",
    options: {
      a: "Hanya warning di stderr, lalu proses tetap berjalan normal",
      b: "Rejection diabaikan diam-diam tanpa pesan apa pun di log",
      c: "Menjadi uncaught exception, lalu proses keluar dengan code 1",
      d: "Node otomatis mengulang Promise itu sampai akhirnya benar-benar berhasil",
    },
    answer: "c",
    explain: "Sejak Node 15, default --unhandled-rejections adalah throw: kalau tidak ada listener unhandledRejection, rejection dilempar sebagai uncaught exception (Node.js v24 docs, CLI). Secara default uncaught exception mencetak stack trace dan keluar dengan code 1 (docs Process).",
  },
  {
    id: "0006-02", lesson: "0006", topic: "async-unhandled", type: "mc",
    prompt: "<code>async function f() { try { return load(); } catch { return null; } }</code>. <code>load()</code> mengembalikan Promise yang reject. Apa hasil <code>await f()</code>?",
    options: {
      a: "Reject: Promise dari load tidak di-await di dalam blok try",
      b: "Mengembalikan null, karena catch selalu menangkap semua error di try",
      c: "Mengembalikan undefined, karena return di dalam try diabaikan oleh async",
      d: "Syntax error, karena catch tanpa parameter tidak diizinkan di JavaScript",
    },
    answer: "a",
    explain: "Tanpa await, fungsi keluar dari blok try sebelum Promise reject, jadi catch tidak pernah dijalankan dan reject diteruskan ke pemanggil. Tulis return await load() kalau ingin menangkapnya di situ. catch tanpa parameter sah sejak ES2019.",
  },
  {
    id: "0006-03", lesson: "0006", topic: "async-unhandled", type: "mc",
    prompt: "Seorang rekan memasang <code>process.on('uncaughtException', err =&gt; log(err))</code> supaya server \"tidak pernah mati\". Apa masalahnya?",
    options: {
      a: "Tidak ada; ini memang praktik yang dianjurkan dokumentasi Node",
      b: "Proses lanjut dengan state tidak jelas; seharusnya log, exit",
      c: "Handler tidak pernah dipanggil untuk error dari kode async",
      d: "Node melarang lebih dari satu handler uncaughtException per proses",
    },
    answer: "b",
    explain: "Dokumentasi Node: uncaughtException adalah \"a crude mechanism ... intended to be used only as a last resort\" dan \"It is not safe to resume normal operation after 'uncaughtException'.\" Pakai untuk cleanup sinkron dan log, lalu exit; process manager yang me-restart.",
  },
  {
    id: "0006-04", lesson: "0006", topic: "async-error-design", type: "mc",
    prompt: "Anda membuat <code>net.Socket</code> sendiri dan tidak memasang listener <code>'error'</code>. Koneksi putus dan socket memancarkan <code>'error'</code>. Akibatnya?",
    options: {
      a: "Error dilempar dan proses Node berhenti",
      b: "Error diabaikan karena tidak ada listener",
      c: "Socket otomatis mencoba menyambung ulang sendiri",
      d: "Error menjadi reject di Promise terdekat",
    },
    answer: "a",
    explain: "Kalau EventEmitter memancarkan 'error' tanpa listener, \"the error is thrown, a stack trace is printed, and the Node.js process exits\" (Node.js v24 docs, Events: Error events). Pasang .on('error', ...) di setiap stream atau socket yang Anda kelola.",
  },
  {
    id: "0006-05", lesson: "0006", topic: "async-error-design", type: "mc",
    prompt: "Mana yang termasuk <strong>programmer error</strong>, bukan operational error?",
    options: {
      a: "Timeout saat memanggil API pembayaran pihak ketiga",
      b: "Koneksi database terputus di tengah sebuah transaksi",
      c: "User mengirim email dengan format tidak valid",
      d: "Memanggil method pada <code>undefined</code> karena lupa <code>await</code>",
    },
    answer: "d",
    explain: "Operational error adalah kegagalan yang wajar terjadi di dunia nyata (timeout, koneksi putus, input tidak valid) dan ditangani: retry, 4xx/503, fallback. Programmer error adalah bug; state aplikasi tidak bisa dipercaya, jadi log, crash, restart, lalu perbaiki kodenya.",
  },
  {
    id: "0006-06", lesson: "0006", topic: "async-error-design", type: "mc",
    prompt: "Anda menangkap error driver database lalu melempar error baru yang lebih bermakna. Bagaimana agar error asli tidak hilang?",
    options: {
      a: "Gabungkan pesan keduanya menjadi satu string panjang",
      b: "Abaikan error asli karena pesannya terlalu teknis",
      c: "Lempar <code>new Error(msg, { cause: err })</code>",
      d: "Tulis error asli ke console, lempar null",
    },
    answer: "c",
    explain: "Opsi cause (ECMAScript 2022, Node ≥ 16.9) menyimpan error asli di properti error.cause, \"used when catching an error and throwing a new one with a different message or code in order to still have access to the original error\" (Node.js v24 docs, Errors).",
  },
  {
    id: "0006-oral-1", lesson: "0006", topic: "async-unhandled", type: "oral",
    prompt: "\"Service Node kami di Node 24 sesekali mati dengan exit code 1, padahal log request tidak menunjukkan error. Apa dugaan Anda, dan bagaimana Anda mencegahnya?\" (90 detik)",
    sample: "\"Dugaan pertama saya unhandled rejection: ada Promise yang reject tanpa await atau catch, misalnya fire-and-forget atau forEach dengan callback async. Sejak Node 15 default --unhandled-rejections adalah throw, jadi rejection itu menjadi uncaught exception dan proses keluar dengan code 1. Dugaan kedua, EventEmitter seperti stream atau socket memancarkan 'error' tanpa listener, yang juga mematikan proses. Untuk mencegahnya: setiap Promise di-await atau diberi catch, setiap stream diberi handler error, dan saya pasang lint seperti no-floating-promises. Saya tetap memasang handler uncaughtException hanya untuk log dan exit, bukan untuk melanjutkan, karena state-nya tidak bisa dipercaya; process manager yang me-restart. Error yang diharapkan, seperti timeout ke service lain, saya tangani sebagai operational error dan saya bungkus dengan Error cause supaya penyebab aslinya tetap tercatat.\"",
    checklist: [
      "Unhandled rejection sebagai dugaan utama, dengan contoh penyebabnya (Promise tanpa await/catch)",
      "Default --unhandled-rejections=throw sejak Node 15, sehingga proses keluar dengan code 1",
      "Event 'error' tanpa listener di EventEmitter/stream juga mematikan proses",
      "uncaughtException hanya untuk log + exit, tidak melanjutkan; restart oleh process manager",
      "Pencegahan konkret: await/catch setiap Promise, handler error di stream, lint",
      "Beda operational error (ditangani) dan programmer error (crash + perbaiki), atau Error.cause untuk menjaga error asli",
    ],
  },
]);
