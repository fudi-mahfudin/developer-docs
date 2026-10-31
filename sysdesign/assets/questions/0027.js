// Soal lesson 0027 (track System Design, modul Studi kasus) · Kerangka 5 langkah menjawab soal desain. Format: assets/README.md.
// Sumber: https://sre.google/sre-book/service-level-objectives/ · https://sre.google/sre-book/availability-table/ · https://sre.google/sre-book/simplicity/
QuestionBank.labelTopics({
  "kasus-kerangka-langkah": "Studi kasus: urutan kerangka 5 langkah dan desain v1",
  "kasus-kerangka-waktu": "Studi kasus: pertanyaan klarifikasi dan alokasi 45 menit",
});

QuestionBank.register([
  {
    id: "0027-01", lesson: "0027", topic: "kasus-kerangka-waktu", type: "mc",
    prompt: "Di langkah 1 Anda bertanya berapa user aktif harian, dan interviewer menjawab \"terserah Anda\". Apa langkah terbaik?",
    options: {
      a: "Lewati estimasi lalu langsung menggambar diagram akhir",
      b: "Ajukan asumsi angka lalu minta persetujuan interviewer",
      c: "Pakai skala terbesar supaya desain pasti aman",
      d: "Tanyakan terus sampai interviewer memberi angka pasti",
    },
    answer: "b",
    explain: "Angka tetap dibutuhkan untuk memilih desain, jadi Anda yang mengajukan asumsi (mis. 10 juta DAU, baca:tulis 100:1) dan meminta persetujuan. Melewati estimasi atau memilih skala terbesar sama-sama membuka jalan ke over-engineering.",
  },
  {
    id: "0027-02", lesson: "0027", topic: "kasus-kerangka-waktu", type: "mc",
    prompt: "Dalam alokasi 45 menit track ini (5, 5, 7, 13, 15), langkah mana yang mendapat waktu paling banyak?",
    options: {
      a: "Klarifikasi requirement, sekitar 15 menit",
      b: "Estimasi kapasitas, sekitar 15 menit",
      c: "Desain API, sekitar 15 menit",
      d: "Deep dive, sekitar 15 menit",
    },
    answer: "d",
    explain: "Requirement ±5, estimasi ±5, API + data model ±7, high-level ±13, deep dive ±15 menit. Deep dive paling lama karena di sanalah bottleneck dan trade-off dibahas dan dinilai.",
  },
  {
    id: "0027-03", lesson: "0027", topic: "kasus-kerangka-langkah", type: "mc",
    prompt: "Apa yang digambar pertama kali di langkah 4 (high-level design)?",
    options: {
      a: "Desain v1 paling sederhana yang memenuhi angka estimasi",
      b: "Desain akhir lengkap yang siap untuk skala global",
      c: "Daftar semua teknologi favorit yang pernah Anda pakai",
      d: "Diagram microservices dengan queue untuk setiap service baru",
    },
    answer: "a",
    explain: "Langkah 4 selalu dimulai dari v1 paling sederhana yang memenuhi angka langkah 2. Komponen tambahan baru muncul di langkah 5, masing-masing dengan alasan berupa angka atau bottleneck.",
  },
  {
    id: "0027-04", lesson: "0027", topic: "kasus-kerangka-langkah", type: "mc",
    prompt: "Di langkah 5 Anda ingin menambah cache. Kalimat mana yang paling kuat di interview?",
    options: {
      a: "Cache selalu bagus, jadi saya tambahkan sejak awal saja",
      b: "Semua sistem besar memakai cache, jadi saya ikut juga",
      c: "Kalau p99 baca melewati 50 ms, saya tambah cache",
      d: "Saya tambah cache supaya desainnya terlihat lebih lengkap nanti",
    },
    answer: "c",
    explain: "Pola kalimatnya: \"untuk skala ini cukup X; kalau metrik Y melewati Z, langkah berikutnya W\". Komponen dibenarkan dengan angka, bukan dengan kebiasaan atau kesan lengkap.",
  },
  {
    id: "0027-oral-1", lesson: "0027", topic: "kasus-kerangka-langkah", type: "oral",
    prompt: "\"Interviewer berkata: 'Rancang sebuah sistem; Anda punya 45 menit.' Jelaskan bagaimana Anda akan memakai waktunya.\" (60 detik)",
    sample: "\"Saya pakai lima langkah. Lima menit pertama untuk klarifikasi: fitur inti, lalu non-functional dalam angka, yaitu DAU, rasio baca:tulis, target p99, availability, dan consistency. Lima menit berikutnya estimasi: QPS rata-rata dan puncak, storage beberapa tahun. Sekitar tujuh menit untuk API dan data model. Lalu tiga belas menit high-level design, dan saya mulai dari v1 paling sederhana yang memenuhi angka tadi, biasanya app server dan satu database, dan saya telusuri satu request baca dan tulis. Lima belas menit terakhir deep dive: saya cari bottleneck dari angka, menambah komponen hanya kalau angkanya menuntut, dan menyebut trade-off-nya, misalnya cache menambah risiko stale data.\"",
    checklist: [
      "lima langkah dalam urutan yang benar?",
      "non-functional requirement ditanyakan dalam angka (DAU, p99, availability)?",
      "estimasi QPS puncak dan storage sebelum menggambar?",
      "langkah 4 dimulai dari desain v1 paling sederhana?",
      "alokasi waktu kira-kira 5, 5, 7, 13, 15 menit?",
      "membenarkan komponen dengan angka di langkah 5, beserta trade-off-nya?",
    ],
  },
]);
