// Soal lesson 0007 (track Node.js, modul Async & error) · EventEmitter dan AbortController. Format: assets/README.md.
// Sumber: Node.js v24 docs (Events, Globals: AbortController/AbortSignal/fetch, Errors, Timers), WHATWG DOM Standard (AbortSignal).
QuestionBank.labelTopics({
  "async-eventemitter": "Async: EventEmitter, once, peringatan listener leak",
  "async-abort": "Async: AbortController, AbortSignal.timeout, membatalkan fetch",
});

QuestionBank.register([
  {
    id: "0007-01", lesson: "0007", topic: "async-eventemitter", type: "mc",
    prompt: "<code>emitter.on(\"x\", () =&gt; console.log(\"A\")); emitter.emit(\"x\"); console.log(\"B\");</code>. Urutan output?",
    options: {
      a: "B lalu A, karena listener dijadwalkan sebagai microtask",
      b: "B lalu A, karena listener menunggu fase poll",
      c: "A lalu B, karena emit memanggil listener sinkron",
      d: "Tidak deterministik, karena bergantung pada beban event loop",
    },
    answer: "c",
    explain: "EventEmitter \"calls all listeners synchronously in the order in which they were registered\" (Node.js v24 docs, Events). Listener yang lambat memblokir pemanggil emit(); kalau perlu asinkron, listener sendiri yang memakai setImmediate() atau process.nextTick().",
  },
  {
    id: "0007-02", lesson: "0007", topic: "async-eventemitter", type: "mc",
    prompt: "Log produksi berisi <code>MaxListenersExceededWarning</code> untuk event <code>update</code> setelah server berjalan beberapa jam. Tindakan paling tepat?",
    options: {
      a: "Cari kode yang menambah listener per request tanpa melepasnya",
      b: "Naikkan setMaxListeners ke Infinity supaya warning itu tidak muncul",
      c: "Abaikan saja, karena Node menolak listener di atas batas",
      d: "Ganti semua on() dengan emit() supaya listener tidak menumpuk",
    },
    answer: "a",
    explain: "Batas default 10 listener per event \"is not a hard limit\": listener tetap ditambahkan dan Node memperingatkan \"possible EventEmitter memory leak\" (Node.js v24 docs, events.defaultMaxListeners). Jumlah yang terus naik berarti ada listener yang tidak dilepas; perbaiki dengan off()/removeListener, bukan membungkam warning.",
  },
  {
    id: "0007-03", lesson: "0007", topic: "async-eventemitter", type: "mc",
    prompt: "Anda menulis <code>await once(socket, \"connect\")</code> (dari <code>node:events</code>), tetapi socket memancarkan <code>'error'</code> lebih dulu. Apa yang terjadi?",
    options: {
      a: "Promise tetap menunggu event connect untuk selamanya",
      b: "Promise resolve dengan objek error sebagai nilai",
      c: "Proses langsung keluar karena error tidak ditangani",
      d: "Promise reject dengan error yang dipancarkan socket",
    },
    answer: "d",
    explain: "events.once() mengembalikan Promise yang \"is rejected if the EventEmitter emits 'error' while waiting\" (Node.js v24 docs, Events). Jadi try/catch di sekitar await menangkapnya. Opsi signal juga bisa dipakai untuk berhenti menunggu.",
  },
  {
    id: "0007-04", lesson: "0007", topic: "async-abort", type: "mc",
    prompt: "<code>await fetch(url, { signal: AbortSignal.timeout(2000) })</code> dan server tujuan tidak menjawab dalam 2 detik. Apa yang terjadi?",
    options: {
      a: "fetch resolve dengan status 408 dari Node",
      b: "Request dibatalkan, lalu fetch reject dengan TimeoutError",
      c: "Tetap menunggu; signal hanya untuk abort manual",
      d: "Node mengulang request satu kali secara otomatis",
    },
    answer: "b",
    explain: "AbortSignal.timeout(ms) (Node ≥ 17.3) abort otomatis setelah ms milidetik, dengan reason DOMException bernama TimeoutError (WHATWG DOM Standard). fetch membatalkan request dan reject dengan alasan itu, sehingga err.name === \"TimeoutError\".",
  },
  {
    id: "0007-05", lesson: "0007", topic: "async-abort", type: "mc",
    prompt: "Kenapa <code>AbortSignal</code> lebih baik daripada <code>Promise.race([fetch(url), timeout(2000)])</code> untuk memberi batas waktu?",
    options: {
      a: "Promise.race tidak bisa dipakai bersama fetch di Node",
      b: "AbortSignal membuat request selesai lebih cepat di server",
      c: "Promise.race membuat proses Node keluar dengan code 1",
      d: "race berhenti menunggu; request di bawahnya tetap berjalan",
    },
    answer: "d",
    explain: "Promise tidak bisa dibatalkan: race selesai saat timer menang, tetapi fetch di bawahnya tetap berjalan dan memakai koneksi. Dengan signal, abort menghentikan request itu sendiri dan Promise-nya reject dengan AbortError atau TimeoutError.",
  },
  {
    id: "0007-06", lesson: "0007", topic: "async-abort", type: "mc",
    prompt: "Panggilan keluar harus berhenti kalau client sudah memutus koneksi <em>atau</em> lewat 2 detik. Cara paling ringkas di Node 24?",
    options: {
      a: "Gabungkan kedua signal itu dengan <code>AbortSignal.any([clientSignal, AbortSignal.timeout(2000)])</code>",
      b: "Dua fetch terpisah, lalu ambil hasil pertama",
      c: "<code>setMaxListeners(2)</code> pada signal client supaya timeout ikut",
      d: "Bungkus fetch dengan try/catch, lalu periksa jam",
    },
    answer: "a",
    explain: "AbortSignal.any (Node ≥ 20.3) membuat signal yang abort begitu salah satu signal input abort, dan reason-nya diambil dari signal yang memicu (Node.js v24 docs, Globals). Dengan begitu err.name membedakan TimeoutError dan AbortError.",
  },
  {
    id: "0007-oral-1", lesson: "0007", topic: "async-abort", type: "oral",
    prompt: "\"Tulis fungsi <code>fetchJson(url, ms)</code> yang memanggil <code>fetch</code> dengan batas waktu <code>ms</code>, melempar error yang jelas kalau timeout, dan tetap meneruskan error lain. Jelaskan apa yang terjadi pada request-nya saat timeout.\" (5 menit)",
    sample: "<pre><code>async function fetchJson(url, ms) {\n  try {\n    const res = await fetch(url, { signal: AbortSignal.timeout(ms) });\n    if (!res.ok) throw new Error(`HTTP ${res.status} dari ${url}`);\n    return await res.json();\n  } catch (err) {\n    if (err.name === \"TimeoutError\") {\n      throw new Error(`timeout ${ms} ms ke ${url}`, { cause: err });\n    }\n    throw err;\n  }\n}</code></pre>\"Saya memberi <code>fetch</code> signal dari <code>AbortSignal.timeout</code>. Saat waktunya habis, signal abort, <code>fetch</code> reject dengan <code>TimeoutError</code>, dan request HTTP di bawahnya benar-benar dibatalkan, bukan hanya diabaikan seperti kalau saya memakai <code>Promise.race</code>. Error timeout saya bungkus dengan <code>cause</code>; error lain, termasuk status non-2xx, saya teruskan. Kalau fungsi ini dipanggil dari handler request, saya gabungkan dengan signal client memakai <code>AbortSignal.any</code>.\"",
    checklist: [
      "Meneruskan signal ke fetch (lewat AbortSignal.timeout atau AbortController + timer)",
      "Membedakan timeout lewat err.name (TimeoutError, atau AbortError untuk controller manual)",
      "Error lain tetap diteruskan, tidak ditelan",
      "Memeriksa res.ok, karena fetch tidak reject untuk status 4xx/5xx",
      "Menjelaskan bahwa abort benar-benar membatalkan request, beda dengan Promise.race",
      "Menyebut Error.cause, AbortSignal.any, atau versi Node (fetch stabil ≥ 21)",
    ],
  },
]);
