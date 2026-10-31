// Soal lesson 0011 (track System Design, modul Data) · CAP, PACELC, dan consistency model. Format: assets/README.md.
// Sumber: https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer6.pdf · https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf
// https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf
QuestionBank.labelTopics({
  "data-cap-pacelc": "Data: CAP saat partition, PACELC saat normal",
  "data-konsistensi": "Data: strong vs eventual, read-your-writes, quorum",
});

QuestionBank.register([
  {
    id: "0011-01", lesson: "0011", topic: "data-cap-pacelc", type: "mc",
    prompt: "Kandidat berkata: \"CAP artinya saya bebas memilih dua dari tiga, jadi saya pilih CA.\" Koreksi yang paling tepat untuk sistem yang direplikasi lewat jaringan?",
    options: {
      a: "Partition pasti terjadi; pilihannya CP atau AP saat partition",
      b: "CA justru pilihan terbaik karena partition tidak pernah terjadi",
      c: "CAP hanya berlaku untuk database relasional, tidak untuk NoSQL",
      d: "Pilih ketiganya sekaligus dengan menambah lebih banyak node replica",
    },
    answer: "a",
    explain: "Gilbert dan Lynch membuktikan bahwa di jaringan asinkron yang bisa kehilangan pesan, availability dan atomic consistency tidak bisa dijamin bersamaan. Karena partition pasti terjadi di sistem terdistribusi, keputusannya adalah apa yang dikorbankan saat partition: C (jadi AP) atau A (jadi CP). Abadi juga menekankan CAP hanya membatasi sistem saat ada partition.",
  },
  {
    id: "0011-02", lesson: "0011", topic: "data-cap-pacelc", type: "mc",
    prompt: "Menurut Abadi (2012), Dynamo, Cassandra, dan Riak dengan konfigurasi default termasuk kelas PACELC apa, dan apa artinya?",
    options: {
      a: "PC/EC: menolak melepas consistency, membayar mahal availability dan latency",
      b: "PA/EC: melepas consistency saat partition, tetap konsisten saat normal",
      c: "PA/EL: melepas consistency saat partition dan demi latency rendah",
      d: "PC/EL: tetap konsisten saat partition, melepasnya saat normal saja",
    },
    answer: "c",
    explain: "\"The default versions of Dynamo, Cassandra, and Riak are PA/EL systems: if a partition occurs, they give up consistency for availability, and under normal operation they give up consistency for lower latency.\" BigTable dan HBase disebut PC/EC. Bagian ELC hanya relevan untuk sistem yang mereplikasi data.",
  },
  {
    id: "0011-03", lesson: "0011", topic: "data-konsistensi", type: "mc",
    prompt: "Fitur mana yang paling aman memakai eventual consistency?",
    options: {
      a: "Pengurangan saldo dompet digital saat user membayar",
      b: "Pengecekan username unik saat user baru mendaftar",
      c: "Pengurangan stok barang terakhir saat checkout berlangsung",
      d: "Jumlah like di postingan yang dilihat pembaca",
    },
    answer: "d",
    explain: "Eventual consistency: replika boleh sempat berbeda, tapi akhirnya sama (Dynamo: \"all updates reach all replicas eventually\"). Jumlah like yang terlambat beberapa detik tidak merugikan siapa pun. Saldo, username unik, dan stok terakhir butuh strong consistency: membaca nilai lama di sana berarti uang hilang, username dobel, atau barang terjual dua kali.",
  },
  {
    id: "0011-04", lesson: "0011", topic: "data-konsistensi", type: "mc",
    prompt: "Datastore leaderless menyalin setiap key ke N=3 node. Konfigurasi R (read) dan W (write) mana yang membentuk quorum menurut paper Dynamo?",
    options: {
      a: "R=1, W=1: read dan write paling cepat",
      b: "R=2, W=2: R + W &gt; N",
      c: "R=1, W=2: karena W lebih dari setengah",
      d: "R=0, W=3: semua node menulis, tanpa read",
    },
    answer: "b",
    explain: "\"Setting R and W such that R + W &gt; N yields a quorum-like system\", dan (N, R, W) = (3, 2, 2) adalah konfigurasi yang umum di Amazon. Dengan 2 + 2 &gt; 3, node yang dibaca dan yang ditulis pasti beririsan. Biayanya: latency ditentukan replika paling lambat dari R (atau W). R=1, W=2 memberi 3, tidak lebih dari N.",
  },
  {
    id: "0011-oral-1", lesson: "0011", topic: "data-cap-pacelc", type: "oral",
    prompt: "\"Jelaskan CAP dan PACELC. Untuk sistem e-commerce, bagian mana yang Anda buat strong consistent dan mana yang eventual?\" (60 detik)",
    sample: "\"CAP bilang saat terjadi network partition, sistem yang direplikasi harus memilih: tetap konsisten dengan menolak sebagian request, atau tetap available dengan risiko data lama. Partition tidak bisa dihindari, jadi pilihannya CP atau AP, dan itu hanya berlaku saat partition. PACELC melengkapinya: saat normal pun ada trade-off latency vs consistency, misalnya replikasi sinkron vs asinkron. Dynamo dan Cassandra default-nya PA/EL, BigTable dan HBase PC/EC. Di e-commerce, saldo, pembayaran, dan stok saat checkout harus strong consistent; lebih baik menolak sementara daripada menjual barang yang tidak ada. Jumlah review, rekomendasi, dan feed cukup eventual. Untuk edit profil saya pakai read-your-writes: user membaca dari leader setelah menulis. Kalau memakai datastore leaderless, quorum R + W &gt; N, misalnya 3, 2, 2, membuat read biasanya melihat write terbaru dengan biaya latency. Pada skala kecil, satu database leader sudah memberi strong consistency tanpa diskusi CAP.\"",
    checklist: [
      "CAP: saat partition, pilih consistency atau availability (CP vs AP), bukan \"pilih 2 dari 3\" bebas",
      "PACELC: saat normal ada trade-off latency vs consistency (sync vs async replication)",
      "contoh fitur yang butuh strong consistency (saldo, stok, pembayaran)",
      "contoh fitur yang cukup eventual consistency (like, feed, rekomendasi)",
      "read-your-writes atau quorum <code>R + W &gt; N</code> sebagai jalan tengah, dengan biaya latency",
      "membenarkan datastore terdistribusi dengan angka atau kebutuhan (satu leader cukup untuk skala kecil)",
    ],
  },
]);
