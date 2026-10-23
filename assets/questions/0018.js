// Lesson 0018: mock interview final. Hanya soal lisan: live coding (penilaian diri) dan cerita STAR.
// Bagian konsep 0018 menarik soal dari questions/0001–0017.js, bukan dari file ini.
QuestionBank.labelTopics({
  "mock-live-coding": "Live coding: filter produk dengan TDD + Angular",
  "star-insiden": "STAR: bug/insiden produksi tersulit",
  "star-refactor": "STAR: refactor untuk maintainability",
  "star-konflik": "STAR: beda pendapat teknis dengan rekan",
  "star-belajar": "STAR: belajar teknologi baru dengan cepat",
  "star-pindah-stack": "Kenapa pindah ke .NET/Angular",
});

(function () { // IIFE: helper di bawah tidak boleh bocor ke global scope yang dipakai bersama file soal lain
// Poin STAR yang sama untuk keempat cerita. Porsi S/T/A/R mengikuti MIT CAPD
// (https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/): S 20%, T 10%, A 60%, R 10%,
// pakai "saya" (bukan "kami"), dan hasil yang terukur.
const starPoints = themePoint => [
  "<strong>S</strong>: konteks singkat (1–2 kalimat), tanpa detail yang tidak perlu",
  "<strong>T</strong>: jelas apa tanggung jawab <em>saya</em> atau target yang dikejar",
  "<strong>A</strong>: porsi terbesar jawaban, berisi langkah yang <em>saya</em> lakukan (bukan \"kami\")",
  "<strong>R</strong>: hasil dengan minimal satu angka (waktu, persen, jumlah bug, durasi)",
  themePoint,
  "Selesai dalam ±2 menit tanpa membaca catatan",
];

const starSample =
  "Struktur: S (±20%) → T (±10%) → A (±60%) → R (±10%). Isi ceritanya dari <code>star/draf-star.md</code> milik Anda sendiri. " +
  "Kalau draf masih kosong, isi dulu sebelum mock dimulai.";

QuestionBank.register([
  // ---------- Live coding (ROADMAP Hari 3, Sesi 3) ----------
  {
    id: "0018-oral-live", lesson: "0018", topic: "mock-live-coding", type: "oral",
    prompt: "Live coding (25 menit): tambah endpoint <code>GET /api/products?categoryId=&amp;minPrice=</code> dengan TDD, lalu tambahkan filter yang sama di Angular product list. Ceritakan langkah Anda dengan suara keras sambil mengetik.",
    sample: "Urutan yang aman: test list → satu test Service yang gagal → kode minimal sampai hijau → test berikutnya (<code>minPrice</code>) → Controller → Angular (<code>HttpParams</code>) → <code>dotnet test</code> hijau.",
    checklist: [
      "Test Service ditulis dan terlihat <strong>gagal dulu</strong> (red) sebelum kode produksi, karena alasan yang benar",
      "Test memakai Arrange-Act-Assert dan namanya menyebut perilaku, mis. <code>GetProducts_WithMinPrice_ExcludesCheaperProducts</code>",
      "Filter berjalan di database: <code>Where</code> pada <code>IQueryable</code> sebelum <code>ToListAsync</code>, bukan memfilter list di memori",
      "Controller tetap tipis: <code>[FromQuery] int? categoryId, decimal? minPrice</code> diteruskan ke Service, respons berupa DTO",
      "Angular: parameter dikirim lewat <code>HttpParams</code> di <code>ProductService</code>, list memakai <code>async</code> pipe (tanpa subscription bocor)",
      "Semua test hijau di akhir (<code>dotnet test</code>), dan langkahnya dijelaskan sambil mengetik",
    ],
  },

  // ---------- STAR: 4 tema ROADMAP ----------
  {
    id: "0018-oral-star-1", lesson: "0018", topic: "star-insiden", type: "oral",
    prompt: "\"Ceritakan bug atau insiden produksi tersulit yang pernah Anda selesaikan.\"",
    sample: starSample,
    checklist: starPoints("Menjelaskan <em>cara</em> menemukan akar masalah (log, reproduksi, hipotesis) dan apa yang dicegah agar tidak terulang"),
  },
  {
    id: "0018-oral-star-2", lesson: "0018", topic: "star-refactor", type: "oral",
    prompt: "\"Ceritakan refactor yang Anda lakukan untuk meningkatkan kualitas atau maintainability kode.\"",
    sample: starSample,
    checklist: starPoints("Mengaitkan refactor ke prinsip yang bisa disebut namanya (mis. SRP/DIP) atau ke test yang menjaga perilaku tetap sama"),
  },
  {
    id: "0018-oral-star-3", lesson: "0018", topic: "star-konflik", type: "oral",
    prompt: "\"Ceritakan saat Anda berbeda pendapat secara teknis dengan rekan. Bagaimana Anda menyelesaikannya?\"",
    sample: starSample,
    checklist: starPoints("Menunjukkan sikap menghargai rekan dan keputusan berbasis trade-off atau data, bukan siapa yang menang"),
  },
  {
    id: "0018-oral-star-4", lesson: "0018", topic: "star-belajar", type: "oral",
    prompt: "\"Ceritakan saat Anda harus mempelajari teknologi baru dengan cepat.\"",
    sample: starSample + " Tutup dengan jembatan: \"persis seperti saya mempelajari .NET dan Angular untuk posisi ini, ini mini project-nya.\"",
    checklist: starPoints("Ditutup dengan jembatan ke .NET/Angular dan mini project Product Catalog"),
  },

  // ---------- Kenapa pindah stack ----------
  {
    id: "0018-oral-pindah", lesson: "0018", topic: "star-pindah-stack", type: "oral",
    prompt: "\"Anda berpengalaman di Node.js dan React. Kenapa pindah ke .NET dan Angular?\" (60–90 detik)",
    sample: "Kerangka: (1) alasan menuju sesuatu, mis. tertarik pada ekosistem yang terstruktur dan banyak dipakai di produk enterprise; " +
      "(2) transfer skill: Angular ditulis dengan TypeScript, dan DI/decorator-nya mirip NestJS; di backend, Controller → Service → Repository, DI, middleware, dan testing adalah konsep yang sudah saya pakai di Express; " +
      "(3) bukti: mini project Product Catalog (.NET 8 + SQL Server + Angular 16, dengan unit test dan integration test) di GitHub; " +
      "(4) jujur soal yang masih saya perdalam, lalu kaitkan ke posisi ini. Ganti contoh (1) dengan alasan Anda yang sebenarnya.",
    checklist: [
      "Alasan positif (menuju sesuatu), tidak menjelekkan Node.js/React atau tempat kerja lama",
      "Transfer skill frontend: TypeScript → Angular, pola DI/decorator yang mirip NestJS",
      "Transfer skill backend: layered (Controller/Service/Repository), DI, middleware, dan testing yang sama secara konsep",
      "Bukti konkret: mini project Product Catalog yang bisa ditunjukkan (GitHub, test hijau)",
      "Jujur menyebut satu hal yang masih diperdalam dan cara mempelajarinya",
      "Dikaitkan ke posisi/perusahaan ini dan selesai dalam 60–90 detik",
    ],
  },
]);
})();
