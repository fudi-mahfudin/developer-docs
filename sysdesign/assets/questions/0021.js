// Soal lesson 0021 (track System Design, modul Reliabilitas & API) · Algoritma rate limiting dan HTTP 429. Format: assets/README.md.
// Sumber: AWS API Gateway request throttling (token bucket), nginx ngx_http_limit_req_module (leaky bucket), Redis INCR pattern rate limiter, RFC 6585 §4, RFC 9110 §10.2.3.
QuestionBank.labelTopics({
  "rel-ratelimit-algoritma": "Reliabilitas & API: token bucket, leaky bucket, fixed/sliding window",
  "rel-ratelimit-http": "Reliabilitas & API: HTTP 429 dan Retry-After",
});

QuestionBank.register([
  {
    id: "0021-01", lesson: "0021", topic: "rel-ratelimit-algoritma", type: "mc",
    prompt: "Token bucket berkapasitas 10 dengan isi ulang 2 token per detik. Bucket sedang penuh, lalu 15 request datang bersamaan. Berapa yang lolos saat itu?",
    options: {
      a: "Dua request lolos, sisanya ditolak",
      b: "Lima belas request lolos semuanya",
      c: "Sepuluh request lolos, lima ditolak",
      d: "Semua ditolak sampai detik berikutnya",
    },
    answer: "c",
    explain: "Kapasitas bucket adalah ukuran burst: 10 token tersedia, jadi 10 request lolos dan 5 ditolak. Setelah itu laju rata-rata dibatasi refill, 2 request per detik. AWS API Gateway memakai model yang sama: rate = token yang ditambahkan per detik, burst = kapasitas bucket.",
  },
  {
    id: "0021-02", lesson: "0021", topic: "rel-ratelimit-http", type: "mc",
    prompt: "Request ditolak karena melewati rate limit. Status code dan header mana yang dikirim, menurut RFC 6585?",
    options: {
      a: "429 Too Many Requests, boleh dengan Retry-After",
      b: "503 Service Unavailable, wajib dengan header Location",
      c: "403 Forbidden, wajib disertai dengan header WWW-Authenticate",
      d: "400 Bad Request, boleh dengan header Cache-Control",
    },
    answer: "a",
    explain: "RFC 6585 §4: 429 berarti user mengirim terlalu banyak request dalam rentang waktu tertentu (\"rate limiting\"), dan response MAY menyertakan Retry-After yang menyatakan berapa lama menunggu. nginx limit_req secara default membalas 503, tapi bisa diubah dengan limit_req_status.",
  },
  {
    id: "0021-03", lesson: "0021", topic: "rel-ratelimit-algoritma", type: "mc",
    prompt: "Fixed window 100 request per menit. Client mengirim 100 request di detik ke-59 dan 100 lagi di detik ke-61. Apa yang terjadi?",
    options: {
      a: "Hanya 100 yang lolos karena window menghitung dua menit",
      b: "Semua ditolak karena counter tidak pernah di-reset secara otomatis",
      c: "Request kedua tertunda di antrean sampai menit berikutnya tiba",
      d: "Semua 200 lolos dalam dua detik karena beda window",
    },
    answer: "d",
    explain: "Detik 59 masuk window menit pertama, detik 61 masuk window menit kedua, dan masing-masing counter baru 100. Jadi 200 request lolos dalam ±2 detik, dua kali limit. Inilah kelemahan fixed window di batas window; sliding window menutupnya dengan ikut menimbang window sebelumnya.",
  },
  {
    id: "0021-04", lesson: "0021", topic: "rel-ratelimit-http", type: "mc",
    prompt: "Server membalas 429 dengan <code>Retry-After: 30</code>. Bagaimana client yang baik bereaksi?",
    options: {
      a: "Mengulang langsung dengan lima koneksi paralel sekaligus",
      b: "Menunggu 30 detik sebelum mengirim request berikutnya",
      c: "Menganggap resource sudah dihapus permanen dari server",
      d: "Mengganti method POST menjadi GET lalu mengulang",
    },
    answer: "b",
    explain: "RFC 9110 §10.2.3: Retry-After menyatakan berapa lama user agent sebaiknya menunggu sebelum request berikutnya; nilainya HTTP-date atau jumlah detik (delay-seconds). Mengulang langsung justru menambah beban yang membuat request ditolak.",
  },
  {
    id: "0021-05", lesson: "0021", topic: "rel-ratelimit-algoritma", type: "mc",
    prompt: "Anda ingin limit yang membolehkan burst singkat tapi laju rata-rata tetap terkendali. Algoritma mana yang dirancang untuk itu?",
    options: {
      a: "Fixed window dengan counter per menit di Redis",
      b: "Leaky bucket dengan antrean yang dikuras laju tetap",
      c: "Token bucket: kapasitas untuk burst, refill untuk rata-rata",
      d: "Sliding window log yang menyimpan semua timestamp request",
    },
    answer: "c",
    explain: "Token bucket punya dua parameter terpisah: kapasitas (burst yang boleh lewat sekaligus) dan refill rate (rata-rata jangka panjang). Leaky bucket meratakan keluaran ke laju tetap, jadi burst ditunda atau ditolak; fixed window tidak membatasi burst di dalam window.",
  },
  {
    id: "0021-oral-1", lesson: "0021", topic: "rel-ratelimit-algoritma", type: "oral",
    prompt: "\"API publik kita perlu rate limiting 100 request per menit per API key. Algoritma apa yang Anda pilih, apa trade-off-nya, dan apa yang diterima client saat ditolak?\" (60 detik)",
    sample: "\"Saya pilih token bucket: kapasitas, misalnya 20, menentukan burst yang boleh lewat sekaligus, dan refill 100 token per menit menentukan rata-rata. Burst singkat dari aplikasi yang wajar tetap lolos. Alternatifnya fixed window counter: paling sederhana, cukup INCR dan EXPIRE di Redis, tapi di batas window client bisa lolos dua kali limit. Sliding window counter menutup celah itu dengan menimbang window sebelumnya, dengan biaya satu counter tambahan. Leaky bucket meratakan ke laju tetap, cocok untuk melindungi backend yang rapuh, seperti limit_req di nginx. Saat ditolak, server membalas 429 Too Many Requests dengan header Retry-After, dan client menunggu sebanyak itu. Sebagai v1 saya pakai fitur rate limit di gateway atau nginx yang sudah ada; desain layanan terdistribusinya baru dibahas kalau satu node tidak cukup.\"",
    checklist: [
      "token bucket: kapasitas = burst, refill = laju rata-rata",
      "fixed window sederhana tapi bisa lolos dua kali limit di batas window",
      "sliding window atau leaky bucket sebagai pembanding dengan trade-off-nya",
      "429 Too Many Requests sebagai response saat ditolak",
      "header Retry-After memberi tahu client berapa lama menunggu",
      "v1 memakai fitur gateway/nginx yang sudah ada sebelum membangun layanan sendiri",
    ],
  },
]);
