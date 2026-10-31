// Soal lesson 0031 (track System Design, modul Studi kasus) · News feed (A): langkah 1–4. Format: assets/README.md.
// Sumber: https://www.usenix.org/conference/atc13/technical-sessions/presentation/bronson ·
// https://www.postgresql.org/docs/current/indexes-multicolumn.html · https://www.postgresql.org/docs/current/queries-limit.html
QuestionBank.labelTopics({
  "kasus-feed-estimasi": "Studi kasus news feed: estimasi QPS baca/tulis, read-heavy, biaya fan-out on read",
  "kasus-feed-v1": "Studi kasus news feed: API, data model, cursor pagination, desain v1 fan-out on read",
});

QuestionBank.register([
  {
    id: "0031-01", lesson: "0031", topic: "kasus-feed-estimasi", type: "mc",
    prompt: "10 juta DAU, setiap user membuka feed rata-rata 10 kali per hari. Dengan ±10<sup>5</sup> detik per hari, berapa QPS baca feed rata-rata?",
    options: {
      a: "±100 QPS, karena hanya post yang dihitung",
      b: "±1.000 QPS, dengan puncak kira-kira 3.000 QPS",
      c: "±10.000 QPS, karena setiap feed dibaca ulang",
      d: "±100.000 QPS, setara jumlah DAU per detik",
    },
    answer: "b",
    explain: "10<sup>7</sup> × 10 = 10<sup>8</sup> pembukaan feed per hari; 10<sup>8</sup> ÷ 10<sup>5</sup> ≈ 1.000 QPS rata-rata. Dengan asumsi puncak 3× rata-rata, ±3.000 QPS.",
  },
  {
    id: "0031-02", lesson: "0031", topic: "kasus-feed-estimasi", type: "mc",
    prompt: "Feed dibaca ±1.000 QPS, post ditulis ±100 QPS. Apa artinya untuk deep dive?",
    options: {
      a: "Sistem write-heavy; fokuskan desain pada jalur tulis post",
      b: "Rasio tidak penting; yang penting hanya ukuran storage",
      c: "Baca dan tulis seimbang; skalakan keduanya secara sama",
      d: "Sistem read-heavy; fokuskan desain pada jalur baca feed",
    },
    answer: "d",
    explain: "Rasio baca:tulis 10:1 membuat news feed read-heavy, seperti graf sosial pada umumnya (TAO di Facebook melayani satu miliar baca dan jutaan tulis per detik). Deep dive diarahkan ke biaya membaca feed.",
  },
  {
    id: "0031-03", lesson: "0031", topic: "kasus-feed-estimasi", type: "mc",
    prompt: "Di v1 (fan-out on read), satu pembukaan feed membaca post terbaru dari setiap akun yang di-follow (rata-rata 200). Pada puncak ±3.000 QPS, berapa beban ke database?",
    options: {
      a: "±600.000 pencarian index per detik di jalur baca feed",
      b: "±3.000 query per detik, karena satu feed satu query",
      c: "±200 query per detik, sesuai jumlah akun yang di-follow",
      d: "Tidak ada beban, karena feed selalu dibaca dari cache",
    },
    answer: "a",
    explain: "Satu query feed tetap menyentuh 200 rentang index (satu per penulis), lalu menggabungkan dan mengurutkan hasilnya. 3.000 × 200 = 600.000 pencarian index per detik: angka inilah yang dibahas di langkah 5 (lesson 0032).",
  },
  {
    id: "0031-04", lesson: "0031", topic: "kasus-feed-v1", type: "mc",
    prompt: "Kenapa <code>GET /v1/feed</code> memakai cursor (<code>created_at</code> + <code>id</code> post terakhir) dan bukan <code>OFFSET</code>?",
    options: {
      a: "OFFSET tidak didukung database relasional modern mana pun",
      b: "Cursor membuat feed tersimpan permanen di sisi client",
      c: "OFFSET besar tetap dihitung server dan halaman bergeser",
      d: "Cursor mengenkripsi posisi supaya user tidak bisa melompat",
    },
    answer: "c",
    explain: "PostgreSQL: baris yang dilewati OFFSET tetap harus dihitung di server, jadi OFFSET besar bisa tidak efisien. Selain itu post baru di atas menggeser halaman sehingga item muncul dua kali. Cursor melanjutkan tepat dari post terakhir.",
  },
  {
    id: "0031-05", lesson: "0031", topic: "kasus-feed-v1", type: "mc",
    prompt: "Query v1 mencari post dengan <code>author_id IN (…akun yang di-follow…)</code> lalu <code>ORDER BY created_at DESC LIMIT 20</code>. Index mana yang paling membantu?",
    options: {
      a: "Index tunggal pada kolom text isi post",
      b: "Index multikolom (author_id, created_at) di tabel posts",
      c: "Index tunggal pada created_at di tabel follows",
      d: "Tanpa index, karena tabel posts masih kecil",
    },
    answer: "b",
    explain: "Index B-tree multikolom paling efisien bila ada kondisi pada kolom paling kiri (author_id); di dalam setiap author_id, baris sudah terurut menurut created_at sehingga 20 post terbaru per penulis bisa diambil langsung.",
  },
  {
    id: "0031-oral-1", lesson: "0031", topic: "kasus-feed-v1", type: "oral",
    prompt: "\"Rancang news feed: user mem-posting dan melihat post terbaru dari akun yang mereka follow. Mulai dari requirement sampai desain v1.\" (90 detik)",
    sample: "\"Saya klarifikasi dulu: feed kronologis terbalik dari akun yang di-follow, tanpa ranking; 10 juta DAU, rata-rata follow 200 akun, ada akun besar dengan jutaan follower. Estimasinya: sekitar 100 post per detik dan sekitar 1.000 pembukaan feed per detik, puncak 3.000, jadi read-heavy 10:1. API-nya POST /v1/posts, POST follow, dan GET /v1/feed dengan cursor, bukan OFFSET, karena OFFSET besar tetap dihitung server dan halaman bergeser saat ada post baru. Data model: posts dengan index (author_id, created_at) dan follows (follower_id, followee_id). Desain v1-nya fan-out on read: app server stateless di belakang load balancer, satu query mengambil post terbaru dari akun yang di-follow, dari satu PostgreSQL. Itu cukup saat peluncuran; di skala target, 3.000 × 200 = 600.000 pencarian index per detik, dan itu yang saya serang di deep dive.\"",
    checklist: [
      "requirement: feed kronologis dari akun yang di-follow, ranking di luar scope, akun besar disebut?",
      "estimasi: ±100 post/detik, ±1.000 feed/detik (puncak ±3.000), read-heavy 10:1?",
      "API: POST post, follow, GET feed dengan cursor, dan alasan tidak memakai OFFSET?",
      "data model: posts dengan index (author_id, created_at) dan tabel follows?",
      "v1 fan-out on read: app server stateless + satu database, satu query per pembukaan feed?",
      "membenarkan komponen dengan angka (v1 cukup di awal; 600.000 pencarian index/detik di skala target jadi alasan deep dive)?",
    ],
  },
]);
