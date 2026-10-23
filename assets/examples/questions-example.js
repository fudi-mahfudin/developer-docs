// Contoh file soal. File asli: assets/questions/NNNN.js (satu file per lesson). Lihat assets/README.md.
QuestionBank.labelTopics({
  "contoh-http": "Contoh: status HTTP",
  "contoh-di": "Contoh: DI",
});

QuestionBank.register([
  {
    id: "ex-01", lesson: "9001", topic: "contoh-http", type: "mc",
    prompt: "Endpoint menemukan data yang diminta. Status apa yang dikembalikan?",
    options: { a: "200 OK", b: "404 Not Found", c: "500 Server Error" },
    answer: "a",
    explain: "Data ditemukan, jadi 200.",
  },
  {
    id: "ex-02", lesson: "9001", topic: "contoh-http", type: "mc",
    prompt: "Data yang diminta tidak ada. Status apa yang dikembalikan?",
    options: { a: "200 OK", b: "404 Not Found", c: "500 Server Error" },
    answer: "b",
    explain: "Resource tidak ditemukan, jadi 404.",
  },
  {
    id: "ex-03", lesson: "9002", topic: "contoh-di", type: "mc",
    prompt: "Di mana interface dihubungkan ke implementasinya?",
    options: { a: "Di constructor Controller", b: "Di file appsettings.json", c: "Di Program.cs" },
    answer: "c",
    explain: "Program.cs adalah composition root.",
  },
  {
    id: "ex-04", lesson: "9002", topic: "contoh-di", type: "oral",
    prompt: "Jelaskan dalam 60 detik kenapa Service bergantung pada interface.",
    sample: "Supaya Service bisa di-unit-test dengan mock dan implementasinya bisa diganti tanpa mengubah Service.",
    checklist: ["menyebut interface", "menyebut DI", "menyebut composition root", "menyebut mock/testing", "menyebut ganti implementasi", "memberi contoh konkret"],
  },
]);
