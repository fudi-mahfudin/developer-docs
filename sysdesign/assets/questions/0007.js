// Soal lesson 0007 (track System Design, modul Skalabilitas) · Reverse proxy, API gateway singkat, CDN (push vs pull, cache di edge). Format: assets/README.md.
// Sumber: RFC 9110 §3.7, RFC 9111 §1, nginx proxy module, Azure Architecture Center (API gateways, Gateway Offloading, CDN guidance), Amazon CloudFront docs, KeyCDN Push Zone.
QuestionBank.labelTopics({
  "skala-reverse-proxy": "Skalabilitas: reverse proxy dan API gateway",
  "skala-cdn": "Skalabilitas: CDN, push vs pull, cache di edge",
});

// Urutan registrasi diselang-seling antar topik; posisi jawaban d b a c d.
QuestionBank.register([
  {
    id: "0007-01", lesson: "0007", topic: "skala-reverse-proxy", type: "mc",
    prompt: "Menurut RFC 9110, apa itu <strong>reverse proxy</strong> (gateway)?",
    options: {
      a: "Proxy di sisi client yang menyembunyikan identitas user dari server",
      b: "Server DNS yang memilih alamat IP terdekat untuk setiap client",
      c: "Cache di browser yang menyimpan respons untuk satu user saja",
      d: "Perantara yang tampil sebagai origin server lalu meneruskan request masuk",
    },
    answer: "d",
    explain: "RFC 9110 §3.7: gateway (a.k.a. reverse proxy) \"acts as an origin server for the outbound connection but translates received requests and forwards them inbound to another server or servers\". Dipakai untuk caching dan load balancing. Proxy di sisi client adalah forward proxy.",
  },
  {
    id: "0007-02", lesson: "0007", topic: "skala-cdn", type: "mc",
    prompt: "Pull CDN. User di Tokyo meminta <code>logo.png</code> yang belum ada di edge Tokyo. Apa yang terjadi?",
    options: {
      a: "Edge mengembalikan error 404 sampai file diunggah secara manual",
      b: "Edge mengambil dari origin, meneruskan ke user, lalu menyimpannya",
      c: "Request dialihkan ke edge lain yang paling sering diakses",
      d: "Origin mengirim file itu ke semua edge di dunia",
    },
    answer: "b",
    explain: "CloudFront (How CloudFront delivers content): kalau objek tidak ada di cache, edge meneruskan request ke origin, mulai mengirim ke user saat byte pertama tiba, dan menambahkan objek ke cache \"for the next time someone requests it\". Itu cache miss di pull CDN.",
  },
  {
    id: "0007-03", lesson: "0007", topic: "skala-reverse-proxy", type: "mc",
    prompt: "Aplikasi Anda adalah satu monolith di belakang load balancer L7. Tim mengusulkan menambah API gateway. Tanggapan terbaik?",
    options: {
      a: "Belum perlu; gateway hanya menambah hop dan komponen redundan",
      b: "Perlu; setiap aplikasi web wajib punya API gateway sendiri",
      c: "Perlu; gateway membuat query database monolith menjadi lebih cepat",
      d: "Belum perlu; API gateway hanya bisa dipakai untuk gRPC",
    },
    answer: "a",
    explain: "API gateway berguna sebagai pintu masuk tunggal ke banyak service dan tempat urusan bersama (auth, rate limiting). Monolith sudah menjadi pintu masuk tunggal. Azure (Gateway Offloading): gateway menambah hop, bisa menjadi bottleneck, dan harus dijalankan beberapa instance.",
  },
  {
    id: "0007-04", lesson: "0007", topic: "skala-cdn", type: "mc",
    prompt: "Anda mendistribusikan installer 500 MB yang jarang berubah lewat KeyCDN. Zone jenis apa yang dibutuhkan?",
    options: {
      a: "Pull Zone, karena origin selalu jauh lebih cepat dari storage milik CDN",
      b: "Pull Zone, karena file besar paling cocok diambil saat cache miss pertama",
      c: "Push Zone, karena Pull Zone tidak menyimpan file di atas 100 MB",
      d: "Push Zone, karena hanya Push Zone yang mendukung header Cache-Control dari origin",
    },
    answer: "c",
    explain: "KeyCDN: Push Zone (unggah ke storage cluster mereka) disarankan untuk file > 10 MB dan wajib untuk file > 100 MB, karena Pull Zone tidak menyimpan apa pun yang lebih besar dari 100 MB.",
  },
  {
    id: "0007-05", lesson: "0007", topic: "skala-cdn", type: "mc",
    prompt: "Anda men-deploy CSS baru, tapi CDN masih menyajikan versi lama sampai TTL habis. Cara paling umum untuk aset statis supaya tidak terulang?",
    options: {
      a: "Menurunkan TTL semua file ke nol detik di CDN",
      b: "Mematikan CDN sementara setiap kali ada deploy versi baru",
      c: "Meminta setiap user membersihkan sendiri cache browser mereka masing-masing",
      d: "Memakai nama file berversi sehingga file baru beralamat baru",
    },
    answer: "d",
    explain: "CloudFront (Invalidation): untuk mengganti file sebelum kedaluwarsa, pakai invalidation atau file versioning dengan nama berbeda. Nama berversi (mis. app.3f9a.js) membuat TTL boleh panjang tanpa risiko versi lama; TTL nol menghilangkan manfaat CDN.",
  },
  {
    id: "0007-oral-1", lesson: "0007", topic: "skala-cdn", type: "oral",
    prompt: "\"Situs e-commerce Anda punya banyak gambar produk dan user di seluruh Asia. Apakah Anda memakai CDN? Jelaskan cara kerjanya dan cara memperbarui gambar.\" (60 detik)",
    sample: "Ya, dan ini alasannya dengan angka: user tersebar di Asia sementara origin di satu region, jadi RTT ke origin bisa ratusan milidetik, dan gambar produk adalah bagian terbesar bandwidth. CDN menyimpan salinan di edge dekat user. Saya pakai pull CDN: request pertama di setiap edge adalah cache miss, edge mengambil dari origin dan menyimpannya; request berikutnya cache hit dan tidak menyentuh origin, jadi beban origin juga turun. Push CDN saya pakai hanya untuk file besar yang jarang berubah, misalnya video. TTL saya atur dengan Cache-Control max-age yang panjang, dan untuk memperbarui gambar saya pakai nama file berversi, bukan invalidation setiap deploy. Data per user seperti keranjang tidak lewat cache CDN. Kalau user-nya hanya di satu kota, saya cukup pakai Cache-Control di browser dulu.",
    checklist: [
      "CDN menyimpan salinan konten statis di edge dekat user",
      "alur cache hit dilayani edge dan cache miss diambil dari origin lalu disimpan",
      "pull sebagai default dan push untuk file besar yang jarang berubah",
      "TTL lewat Cache-Control dan pembaruan lewat nama berversi atau invalidation",
      "konten per user atau dinamis tidak di-cache di CDN",
      "membenarkan CDN dengan angka (jarak/RTT user, bandwidth gambar, beban origin)",
    ],
  },
]);
