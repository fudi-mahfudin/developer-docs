// Soal lesson 0029 (track System Design, modul Studi kasus) · Rate limiter terdistribusi. Format: assets/README.md.
// Sumber: https://redis.io/docs/latest/commands/incr/#pattern-rate-limiter · https://redis.io/docs/latest/develop/programmability/eval-intro/ ·
// https://www.rfc-editor.org/rfc/rfc6585.html#section-4 · https://www.rfc-editor.org/rfc/rfc9110.html#field.retry-after ·
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html · https://nginx.org/en/docs/http/ngx_http_limit_req_module.html
QuestionBank.labelTopics({
  "kasus-rl-posisi": "Studi kasus rate limiter: posisi limiter, fixed window vs token bucket, respons 429",
  "kasus-rl-counter": "Studi kasus rate limiter: counter bersama di Redis dan race condition",
});

QuestionBank.register([
  {
    id: "0029-01", lesson: "0029", topic: "kasus-rl-posisi", type: "mc",
    prompt: "Limit 100 request per menit per API key; API berjalan di 10 server di belakang load balancer round robin. Kenapa counter in-memory per server tidak cukup?",
    options: {
      a: "Memori server tidak cukup untuk menyimpan semua counter",
      b: "Load balancer menolak request yang melewati batas limit",
      c: "Counter in-memory selalu lebih lambat daripada Redis jaringan",
      d: "Tiap server melihat sebagian, limit efektif jadi 10×",
    },
    answer: "d",
    explain: "Round robin membagi request satu API key ke 10 server, jadi setiap server hanya melihat ±1/10 dan limit efektifnya ±1.000 per menit. Angka \"10 server\" inilah yang membenarkan counter bersama (Redis). Dengan satu server, counter in-memory sudah cukup.",
  },
  {
    id: "0029-02", lesson: "0029", topic: "kasus-rl-counter", type: "mc",
    prompt: "Middleware menjalankan <code>v = GET(key); if v &lt; 100 then INCR(key)</code> secara paralel di 10 server. Apa masalahnya?",
    options: {
      a: "GET di Redis tidak mengembalikan nilai counter terbaru",
      b: "Race condition: dua server membaca 99, keduanya lolos",
      c: "INCR tidak atomic sehingga nilai counter bisa hilang",
      d: "Key tidak bisa diberi TTL selama masih dipakai",
    },
    answer: "b",
    explain: "Ini check-then-act: baca dan tulis terpisah, jadi dua server bisa sama-sama membaca 99 dan lolos. INCR sendiri atomic dan mengembalikan nilai baru, jadi bandingkan hasil INCR dengan batas, tanpa GET dulu.",
  },
  {
    id: "0029-03", lesson: "0029", topic: "kasus-rl-counter", type: "mc",
    prompt: "Redis docs: kalau client menjalankan <code>INCR</code> lalu crash sebelum <code>EXPIRE</code>, key bocor tanpa TTL. Perbaikan yang disarankan?",
    options: {
      a: "Tambah server Redis kedua sebagai cadangan semua counter",
      b: "Jalankan EXPIRE dulu baru INCR di request berikutnya",
      c: "Gabungkan INCR dan EXPIRE dalam Lua script atomic",
      d: "Simpan counter di PostgreSQL supaya transaksi lebih aman",
    },
    answer: "c",
    explain: "Redis docs menyarankan menjadikan INCR + EXPIRE satu Lua script yang dikirim dengan EVAL; Redis menjamin script dieksekusi secara atomic. Varian fixed window per detik/menit memakai MULTI/EXEC untuk tujuan yang sama.",
  },
  {
    id: "0029-04", lesson: "0029", topic: "kasus-rl-posisi", type: "mc",
    prompt: "Limit 100 per menit dengan fixed window. Klien mengirim 100 request pukul 10:00:59 dan 100 lagi pukul 10:01:00. Apa yang terjadi?",
    options: {
      a: "Keduanya lolos: 200 request dalam dua detik",
      b: "Batch kedua ditolak karena window masih sama",
      c: "Batch pertama ditolak karena melebihi rata-rata detik",
      d: "Redis menggabungkan kedua window menjadi satu counter",
    },
    answer: "a",
    explain: "Dua batch jatuh di window menit yang berbeda, jadi masing-masing counter hanya 100. Kalau burst ini tidak boleh, evolusi ke sliding window counter atau token bucket; kalau requirement mengizinkan sedikit longgar, fixed window cukup.",
  },
  {
    id: "0029-05", lesson: "0029", topic: "kasus-rl-posisi", type: "mc",
    prompt: "Request ditolak oleh rate limiter. Respons HTTP mana yang sesuai RFC?",
    options: {
      a: "503 Service Unavailable tanpa header tambahan apa pun",
      b: "429 Too Many Requests, opsional dengan header Retry-After",
      c: "401 Unauthorized supaya client meminta token yang baru",
      d: "302 Found yang mengarahkan client ke halaman antrean",
    },
    answer: "b",
    explain: "RFC 6585: 429 berarti user mengirim terlalu banyak request dalam waktu tertentu (\"rate limiting\"), dan respons MAY menyertakan Retry-After. Catatan: nginx limit_req default menolak dengan 503, jadi set limit_req_status 429.",
  },
  {
    id: "0029-oral-1", lesson: "0029", topic: "kasus-rl-counter", type: "oral",
    prompt: "\"Rancang rate limiter: 100 request per menit per API key, untuk API yang berjalan di 10 server.\" (90 detik)",
    sample: "\"Limiter saya pasang di server, sebagai middleware atau di API gateway, bukan di client karena client tidak bisa dipercaya. Karena ada 10 server di belakang round robin, counter per server membuat limit efektif sekitar 1.000 per menit, jadi counter harus bersama: satu Redis. Estimasinya sekitar 15.000 operasi per detik dan 100 MB untuk 1 juta key, masih muat di satu node. v1-nya fixed window: key berisi API key dan menit, INCR lalu EXPIRE 60 detik, dan saya bandingkan nilai hasil INCR, bukan GET dulu, supaya tidak ada race check-then-act. INCR dan EXPIRE saya gabung dalam Lua script supaya atomic dan key tidak bocor tanpa TTL. Request yang ditolak mendapat 429 dengan Retry-After. Fixed window membolehkan burst dua kali lipat di batas menit; kalau itu tidak boleh, saya ganti sliding window atau token bucket. Kalau Redis down, limiter fail-open dengan timeout pendek.\"",
    checklist: [
      "posisi di server (middleware atau gateway), bukan client, beserta alasannya?",
      "counter bersama di Redis karena counter per server membuat limit efektif 10×?",
      "race condition: bandingkan hasil <code>INCR</code>, dan <code>INCR</code> + <code>EXPIRE</code> atomic lewat <code>MULTI</code> atau Lua script?",
      "respons <code>429</code> dengan <code>Retry-After</code>?",
      "trade-off fixed window (burst di batas window) vs sliding window atau token bucket?",
      "membenarkan komponen dengan angka (Redis karena 10 server; ±15.000 operasi/detik dan ±100 MB muat di satu node; sharding belum perlu)?",
    ],
  },
]);
