// Soal lesson 0032 (track System Design, modul Studi kasus) · News feed (B): fan-out. Format: assets/README.md.
// Sumber: https://redis.io/docs/latest/develop/data-types/lists/ ·
// https://kafka.apache.org/44/getting-started/introduction/#main-concepts-and-terminology
QuestionBank.labelTopics({
  "kasus-feed-fanout": "Studi kasus news feed: fan-out on write vs on read, feed cache dengan LTRIM, queue fan-out",
  "kasus-feed-hybrid": "Studi kasus news feed: hybrid untuk akun besar, user tidak aktif",
});

QuestionBank.register([
  {
    id: "0032-01", lesson: "0032", topic: "kasus-feed-fanout", type: "mc",
    prompt: "Apa yang terjadi saat post dibuat dalam desain <strong>fan-out on write</strong>?",
    options: {
      a: "Post disimpan saja; feed dirakit saat follower membukanya nanti",
      b: "Post dikirim ke penulis lewat push notification di ponsel",
      c: "ID post ditambahkan ke feed cache setiap follower penulisnya",
      d: "Post disalin ke semua user, termasuk yang tidak follow",
    },
    answer: "c",
    explain: "Fan-out on write memindahkan pekerjaan dari baca ke tulis: worker menambahkan ID post ke feed cache setiap follower (mis. LPUSH ke list Redis), sehingga membaca feed tinggal mengambil satu key. Opsi a adalah fan-out on read (v1).",
  },
  {
    id: "0032-02", lesson: "0032", topic: "kasus-feed-fanout", type: "mc",
    prompt: "±100 post per detik, rata-rata 200 follower per penulis. Berapa penulisan feed cache per detik dengan fan-out on write?",
    options: {
      a: "±20.000 penulisan per detik, dengan puncak sekitar 60.000",
      b: "±100 penulisan per detik, sama dengan jumlah post",
      c: "±200 penulisan per detik, satu per follower saja",
      d: "±3.000 penulisan per detik, sama dengan QPS baca",
    },
    answer: "a",
    explain: "100 × 200 = 20.000 penulisan per detik rata-rata (puncak 3× ≈ 60.000). Sebagai gantinya, satu pembukaan feed hanya membaca satu key, bukan 200 rentang index: ±3.000 baca per detik pada puncak, bukan ±600.000.",
  },
  {
    id: "0032-03", lesson: "0032", topic: "kasus-feed-fanout", type: "mc",
    prompt: "Feed cache setiap user adalah list Redis. Kenapa worker menjalankan <code>LTRIM feed:42 0 799</code> setelah <code>LPUSH</code>?",
    options: {
      a: "Supaya urutan post di feed diacak secara adil",
      b: "Supaya post lama terhapus juga dari tabel posts",
      c: "Supaya follower baru otomatis menerima semua post lama",
      d: "Supaya list terbatas 800 ID dan memorinya terhitung",
    },
    answer: "d",
    explain: "Dokumentasi Redis menyebut list bisa dipakai sebagai capped collection yang hanya mengingat N item terbaru dengan LTRIM. 800 ID × 8 byte × 10 juta user ≈ 64 GB, angka yang bisa direncanakan; post lama tetap ada di database untuk fan-out on read.",
  },
  {
    id: "0032-04", lesson: "0032", topic: "kasus-feed-hybrid", type: "mc",
    prompt: "Akun dengan 10 juta follower mem-posting. Dengan fan-out on write murni, apa masalahnya dan apa perbaikannya?",
    options: {
      a: "Tidak ada masalah; Redis menulis 10 juta key dalam satu perintah",
      b: "10 juta penulisan per post; ambil post akun besar saat dibaca",
      c: "Post akun besar hilang; simpan post itu di dua database sekaligus",
      d: "Follower terlalu banyak; batasi setiap akun hanya boleh seribu follower saja",
    },
    answer: "b",
    explain: "Satu post menjadi 10 juta penulisan, menahan antrean fan-out post lain. Hybrid: akun di atas ambang (mis. 10.000 follower, ditentukan dengan mengukur) tidak di-fan-out; post terbarunya diambil dan digabung saat follower membuka feed.",
  },
  {
    id: "0032-05", lesson: "0032", topic: "kasus-feed-hybrid", type: "mc",
    prompt: "Sepertiga follower sudah 6 bulan tidak login. Apa yang sebaiknya dilakukan terhadap feed cache mereka?",
    options: {
      a: "Tetap di-fan-out supaya feed mereka selalu lengkap terus",
      b: "Hapus akun mereka supaya biaya fan-out bisa turun",
      c: "Lewati fan-out; rakit feed dengan fan-out on read",
      d: "Kirim email berisi semua post yang mereka lewatkan",
    },
    answer: "c",
    explain: "Fan-out ke user yang tidak membaca membuang penulisan dan memori. Batasi fan-out on write ke user aktif (mis. login 30 hari terakhir); saat user lama kembali, feed-nya dirakit sekali dengan fan-out on read, lalu cache diisi lagi.",
  },
  {
    id: "0032-oral-1", lesson: "0032", topic: "kasus-feed-hybrid", type: "oral",
    prompt: "\"Desain v1 news feed Anda fan-out on read. Di 10 juta DAU, dengan akun terbesar 10 juta follower, bagaimana Anda mengembangkannya?\" (90 detik)",
    sample: "\"Di v1, satu pembukaan feed menyentuh 200 penulis, jadi pada puncak 3.000 feed per detik itu sekitar 600.000 pencarian index per detik. Evolusi pertama: fan-out on write. Post disimpan, lalu event-nya masuk queue; worker menambahkan ID post ke feed cache setiap follower di Redis, dengan LTRIM supaya hanya 800 ID terakhir, sekitar 64 GB untuk 10 juta user. Membaca feed tinggal satu key. Biayanya 100 post kali 200 follower, sekitar 20.000 penulisan per detik, dan post muncul beberapa detik kemudian, yang diizinkan requirement. Masalahnya akun besar: satu post jadi 10 juta penulisan. Jadi saya pakai hybrid: akun di atas ambang, misalnya 10.000 follower, tidak di-fan-out; post terbarunya diambil saat feed dibaca dan digabung dengan feed cache. Saya juga hanya fan-out ke user yang aktif 30 hari terakhir; user lama dirakit dengan fan-out on read saat kembali.\"",
    checklist: [
      "titik awal: biaya v1 ±600.000 pencarian index/detik pada puncak?",
      "fan-out on write: queue + worker menulis ID post ke feed cache setiap follower?",
      "feed cache terbatas (LTRIM, mis. 800 ID) dengan estimasi memori?",
      "biaya fan-out on write: ±20.000 penulisan/detik dan keterlambatan beberapa detik yang diizinkan?",
      "hybrid: akun besar di atas ambang diambil saat baca; user tidak aktif tidak di-fan-out?",
      "membenarkan komponen dengan angka (cache karena 600.000/detik; hybrid karena 10 juta penulisan per post)?",
    ],
  },
]);
