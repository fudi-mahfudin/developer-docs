// Soal lesson 0023 (track System Design, modul Reliabilitas & API) · Observability (metrics, logs, traces) dan SLI/SLO/SLA, error budget. Format: assets/README.md.
// Sumber: OpenTelemetry docs (Signals, Traces), Google SRE Book ch. 3 Embracing Risk, ch. 4 Service Level Objectives, ch. 6 Monitoring Distributed Systems, Appendix Availability Table.
QuestionBank.labelTopics({
  "rel-observability": "Reliabilitas & API: metrics, logs, traces, four golden signals",
  "rel-slo": "Reliabilitas & API: SLI, SLO, SLA, error budget",
});

QuestionBank.register([
  {
    id: "0023-01", lesson: "0023", topic: "rel-observability", type: "mc",
    prompt: "Checkout lambat, dan request melewati gateway, order service, payment service, lalu database. Signal mana yang paling cepat menunjukkan hop yang lambat?",
    options: {
      a: "Metrics CPU rata-rata dari seluruh server produksi",
      b: "Log error gateway selama satu jam terakhir",
      c: "Jumlah user aktif harian dari dashboard bisnis",
      d: "Trace: span per hop dengan durasinya masing-masing",
    },
    answer: "d",
    explain: "OpenTelemetry: trace adalah \"the path of a request through your application\", tersusun dari span, satu per unit kerja dengan waktu mulai dan selesai. Dalam satu trace terlihat hop mana yang memakan waktu. Metrics memberi tahu bahwa ada masalah; trace memberi tahu di mana.",
  },
  {
    id: "0023-02", lesson: "0023", topic: "rel-slo", type: "mc",
    prompt: "Mana yang merupakan <strong>SLO</strong>, menurut SRE Book?",
    options: {
      a: "Latency request diukur di load balancer setiap menit",
      b: "99% request di bawah 300 ms per bulan",
      c: "Refund 10% kalau availability bulanan di bawah target",
      d: "Dashboard berisi empat golden signals untuk tim on-call",
    },
    answer: "b",
    explain: "SRE Book ch. 4: SLI adalah ukuran kuantitatif (latency yang diukur = opsi a), SLO adalah target nilai untuk SLI itu (99% di bawah 300 ms), dan SLA adalah kontrak dengan user yang punya konsekuensi kalau SLO meleset (refund = opsi c).",
  },
  {
    id: "0023-03", lesson: "0023", topic: "rel-observability", type: "mc",
    prompt: "Empat <em>golden signals</em> menurut SRE Book adalah…",
    options: {
      a: "Latency, traffic, errors, dan saturation",
      b: "CPU, memory, disk, dan network",
      c: "Metrics, logs, traces, dan baggage",
      d: "Uptime, deploy, incident, dan rollback",
    },
    answer: "a",
    explain: "SRE Book ch. 6: \"The four golden signals of monitoring are latency, traffic, errors, and saturation. If you can only measure four metrics of your user-facing system, focus on these four.\" Metrics, logs, traces, baggage adalah jenis signal OpenTelemetry, bukan golden signals.",
  },
  {
    id: "0023-04", lesson: "0023", topic: "rel-slo", type: "mc",
    prompt: "SLO availability 99,9% per 30 hari. Berapa error budget-nya kalau dinyatakan sebagai waktu downtime?",
    options: {
      a: "Sekitar 8,76 jam",
      b: "Sekitar 4,32 menit",
      c: "Sekitar 43,2 menit",
      d: "Sekitar 7,2 jam",
    },
    answer: "c",
    explain: "0,1% × 30 hari × 1.440 menit = 43,2 menit (SRE Book, Availability Table). 8,76 jam adalah budget 99,9% per tahun, 4,32 menit adalah 99,99% per bulan, dan 7,2 jam adalah 99% per bulan.",
  },
  {
    id: "0023-05", lesson: "0023", topic: "rel-slo", type: "mc",
    prompt: "Error budget kuartal ini sudah habis. Apa yang dilakukan menurut SRE Book?",
    options: {
      a: "Menaikkan SLO supaya tim bekerja lebih keras lagi",
      b: "Menghapus SLO sampai kuartal berikutnya mulai berjalan lagi",
      c: "Mempercepat rilis fitur supaya user tidak sempat sadar",
      d: "Rilis ditahan; fokus pindah ke keandalan dan pengujian",
    },
    answer: "d",
    explain: "SRE Book ch. 3: selama SLO terpenuhi (budget masih ada), rilis boleh jalan; kalau pelanggaran SLO menghabiskan budget, rilis ditahan sementara dan sumber daya dialihkan ke testing dan keandalan. Error budget mengubah perdebatan \"rilis atau stabil\" menjadi angka.",
  },
  {
    id: "0023-oral-1", lesson: "0023", topic: "rel-slo", type: "oral",
    prompt: "\"Definisikan SLI dan SLO untuk API checkout kita, lalu jelaskan bagaimana error budget dipakai.\" (60 detik)",
    sample: "\"SLI adalah ukuran yang kita ambil, misalnya persentase request checkout yang sukses dan persentase yang dijawab di bawah 500 ms, diukur di load balancer. SLO adalah targetnya: 99,9% request sukses dan 99% di bawah 500 ms per 30 hari. SLA berbeda: kontrak dengan pelanggan yang punya konsekuensi seperti refund, dan biasanya lebih longgar dari SLO internal. Error budget adalah sisa dari SLO: 99,9% per 30 hari berarti sekitar 43 menit kegagalan boleh terjadi. Selama budget masih ada, tim boleh rilis cepat; kalau habis, rilis ditahan dan fokus ke keandalan. Saya tidak memilih 99,99% tanpa alasan, karena setiap sembilan tambahan jauh lebih mahal dan user sering tidak bisa membedakannya. Untuk mengukurnya cukup empat golden signals dulu: latency, traffic, errors, saturation.\"",
    checklist: [
      "SLI = ukuran kuantitatif (success rate, latency percentile)",
      "SLO = target untuk SLI dalam periode tertentu",
      "SLA = kontrak dengan konsekuensi, beda dari SLO",
      "error budget = 1 − SLO, dengan contoh angka (±43 menit per 30 hari untuk 99,9%)",
      "budget habis → rilis ditahan, fokus ke keandalan",
      "memilih jumlah sembilan dari kebutuhan user, bukan setinggi mungkin",
    ],
  },
]);
