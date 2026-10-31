// Soal lesson 0002 (track System Design, modul Fondasi): perjalanan request (DNS, TCP, TLS, HTTP), HTTP stateless.
// Sumber: RFC 9110 §3.3, RFC 1034 §2.4/§3.6, RFC 9293 §3.5, RFC 8446 §2.3, RFC 9112 §9.3, Jeff Dean LADIS 2009. Lihat assets/README.md di root.
QuestionBank.labelTopics({
  "dasar-perjalanan-request": "Fondasi: perjalanan request dan round trip",
  "dasar-http-stateless": "Fondasi: client-server dan HTTP stateless",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban bervariasi dan tidak berulang berturut-turut.
QuestionBank.register([
  {
    id: "0002-01", lesson: "0002", topic: "dasar-perjalanan-request", type: "mc",
    prompt: "Request HTTPS <strong>pertama</strong> ke server (DNS sudah di cache, TLS 1.3). Berapa round trip sebelum response tiba?",
    options: {
      a: "Satu round trip",
      b: "Dua round trip",
      c: "Tiga round trip",
      d: "Lima round trip",
    },
    answer: "c",
    explain: "TCP three-way handshake (1 RTT, RFC 9293 §3.5) + TLS 1.3 handshake (\"1-RTT handshake\", RFC 8446) + HTTP request/response (1 RTT) = 3 RTT. Request berikutnya di koneksi persistent hanya 1 RTT.",
  },
  {
    id: "0002-02", lesson: "0002", topic: "dasar-http-stateless", type: "mc",
    prompt: "Menurut RFC 9110, apa arti HTTP <strong>stateless</strong>?",
    options: {
      a: "Makna setiap request bisa dipahami tanpa melihat request sebelumnya",
      b: "Server dilarang menyimpan data apa pun ke dalam database",
      c: "Setiap request wajib membuka koneksi TCP yang baru lagi",
      d: "Client tidak boleh menyimpan cookie atau token apa pun",
    },
    answer: "a",
    explain: "RFC 9110 §3.3: \"each request message's semantics can be understood in isolation\". Server tetap boleh punya database, dan koneksi tetap bisa dipakai ulang (persistent). Akibatnya request bisa \"dynamically load balance[d] across multiple servers\".",
  },
  {
    id: "0002-03", lesson: "0002", topic: "dasar-perjalanan-request", type: "mc",
    prompt: "Apa fungsi <strong>TTL</strong> pada jawaban DNS?",
    options: {
      a: "Batas waktu koneksi TCP sebelum ditutup secara otomatis",
      b: "Lama jawaban boleh disimpan di cache sebelum dibuang",
      c: "Jumlah server DNS yang dilewati oleh sebuah pertanyaan",
      d: "Waktu maksimum bagi server memproses satu HTTP request",
    },
    answer: "b",
    explain: "RFC 1034 §3.6: TTL (dalam detik) \"is primarily used by resolvers when they cache RRs\" dan menentukan berapa lama record boleh di-cache sebelum dibuang. TTL panjang = lebih sedikit lookup, tapi perubahan IP lambat menyebar.",
  },
  {
    id: "0002-04", lesson: "0002", topic: "dasar-http-stateless", type: "mc",
    prompt: "Kenapa sifat stateless HTTP penting untuk skalabilitas?",
    options: {
      a: "Setiap response otomatis tersimpan di dalam cache browser milik user",
      b: "Database tidak lagi perlu memakai index untuk query apa pun",
      c: "Koneksi TCP tidak lagi perlu handshake di awal setiap kali",
      d: "Request bisa dibagi ke server mana pun lewat load balancer",
    },
    answer: "d",
    explain: "Karena setiap request bisa dipahami sendiri, server mana pun bisa melayaninya. RFC 9110 §3.3 menyebut banyak implementasi bergantung pada sifat ini untuk \"dynamically load balance requests across multiple servers\". Ini fondasi horizontal scaling (lesson 0005).",
  },
  {
    id: "0002-05", lesson: "0002", topic: "dasar-perjalanan-request", type: "mc",
    prompt: "User di benua lain (RTT ±150 ms) mengeluh halaman lambat. Perubahan <strong>paling murah</strong> mana yang dicoba dulu?",
    options: {
      a: "Pastikan koneksi dipakai ulang, bukan dibuka per request",
      b: "Pecah backend menjadi microservices supaya terasa lebih cepat",
      c: "Ganti database relasional dengan database NoSQL yang baru",
      d: "Tambah sepuluh app server di datacenter yang sama",
    },
    answer: "a",
    explain: "Membuka koneksi baru membayar TCP + TLS (2 RTT ≈ 300 ms) sebelum HTTP. Koneksi persistent (default HTTP/1.1, RFC 9112 §9.3) memangkasnya tanpa menambah server. Menambah server di datacenter yang sama tidak mengurangi jarak; langkah berikutnya adalah CDN (lesson 0007).",
  },
  {
    id: "0002-oral-1", lesson: "0002", topic: "dasar-perjalanan-request", type: "oral",
    prompt: "\"Apa yang terjadi sejak user mengetik URL dan menekan Enter sampai server menerima request? Fokus ke hal yang memengaruhi latency.\" (90 detik)",
    sample: "Pertama browser butuh IP dari nama domain lewat DNS. Biasanya jawabannya sudah di cache, karena setiap jawaban DNS punya TTL yang menentukan berapa lama boleh disimpan. Lalu browser membuka koneksi TCP dengan three-way handshake, SYN, SYN-ACK, ACK, itu satu round trip. Di atasnya TLS handshake untuk enkripsi dan verifikasi sertifikat server; di TLS 1.3 itu satu round trip lagi. Baru HTTP request dikirim, satu round trip plus waktu server bekerja. Jadi request pertama sekitar 3 RTT. Kalau user di benua lain dengan RTT 150 ms, itu sudah sekitar 450 ms sebelum server berbuat apa-apa. Request berikutnya memakai koneksi persistent, jadi cukup 1 RTT. Dua cara murah menurunkan latency: pakai ulang koneksi, dan dekatkan konten ke user dengan CDN.",
    checklist: [
      "DNS mengubah nama menjadi IP, dan jawabannya di-cache sesuai TTL",
      "TCP three-way handshake (SYN, SYN-ACK, ACK) = 1 RTT",
      "TLS handshake untuk enkripsi dan sertifikat, 1 RTT di TLS 1.3",
      "request pertama ±3 RTT sebelum response, termasuk HTTP request itu sendiri",
      "contoh angka: RTT antarbenua ±150 ms membuat request pertama ±450 ms",
      "koneksi persistent (pakai ulang koneksi) atau CDN sebagai cara murah mengurangi latency",
    ],
  },
]);
