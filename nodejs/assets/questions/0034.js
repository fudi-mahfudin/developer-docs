// Soal lesson 0034 (track Node.js, modul Testing & produksi) · Background job dengan @nestjs/bullmq, retry + backoff, idempotency. Format: assets/README.md.
// Sumber: docs.nestjs.com/techniques/queues, docs.bullmq.io/guide/retrying-failing-jobs, docs.bullmq.io/guide/jobs/job-ids.
QuestionBank.labelTopics({
  "prod-bullmq": "Testing & produksi: @nestjs/bullmq, producer dan processor",
  "prod-retry-idempotency": "Testing & produksi: retry, backoff, dan idempotency job",
});

QuestionBank.register([
  {
    id: "0034-01", lesson: "0034", topic: "prod-bullmq", type: "mc",
    prompt: "Endpoint <code>POST /reports</code> membuat PDF selama 40 detik. Kenapa pekerjaan itu dipindah ke queue?",
    options: {
      a: "Supaya PDF dibuat lebih cepat karena BullMQ memakai GPU",
      b: "Karena NestJS membatasi setiap handler maksimum 30 detik saja",
      c: "Supaya PDF tidak perlu disimpan di storage mana pun",
      d: "Request dijawab cepat; worker mengerjakannya terpisah dan bisa di-retry",
    },
    answer: "d",
    explain: "Request yang menunggu 40 detik menahan koneksi, rawan timeout di proxy, dan hilang kalau proses restart. Dengan queue, handler hanya menambah job (mis. menjawab 202 dengan id job), worker mengerjakannya di luar siklus request, dan job yang gagal bisa diulang.",
  },
  {
    id: "0034-02", lesson: "0034", topic: "prod-retry-idempotency", type: "mc",
    prompt: "Job ditambahkan dengan <code>{ attempts: 4, backoff: { type: 'exponential', delay: 1000 } }</code> dan selalu gagal. Berapa jeda sebelum setiap percobaan ulang?",
    options: {
      a: "1, 2, 4 detik",
      b: "1, 1, 1 detik",
      c: "1, 3, 9 detik",
      d: "4, 4, 4 detik",
    },
    answer: "a",
    explain: "attempts adalah total percobaan (4 = 1 awal + 3 ulang). Backoff exponential BullMQ: 2^(attempts-1) × delay, jadi 1000, 2000, 4000 ms. Setelah percobaan habis, job pindah ke status failed. Tanpa attempts > 1, job yang gagal tidak diulang.",
  },
  {
    id: "0034-03", lesson: "0034", topic: "prod-bullmq", type: "mc",
    prompt: "Bagaimana consumer job ditulis di <code>@nestjs/bullmq</code>?",
    options: {
      a: "Controller dengan @Get('queue') yang di-polling oleh client setiap detik",
      b: "Sebuah class @Processor('email') extends WorkerHost dengan method async process(job)",
      c: "Method service biasa yang diberi decorator @Cron setiap menit",
      d: "Middleware yang membaca Redis di setiap request yang masuk",
    },
    answer: "b",
    explain: "Consumer adalah class bertanda @Processor('nama-queue') yang extends WorkerHost dan mengimplementasikan process(job). Producer meng-inject queue dengan @InjectQueue('nama-queue') lalu memanggil queue.add(nama, data, opts). Queue didaftarkan dengan BullModule.registerQueue({ name }).",
  },
  {
    id: "0034-04", lesson: "0034", topic: "prod-retry-idempotency", type: "mc",
    prompt: "Client mengirim ulang <code>POST /orders/42/invoice</code> karena timeout. Producer memakai <code>jobId: 'invoice-42'</code>. Apa yang terjadi pada <code>queue.add</code> kedua?",
    options: {
      a: "Job kedua menimpa job pertama dan dijalankan ulang",
      b: "BullMQ melempar error karena id job sudah dipakai",
      c: "Job kedua diabaikan selama id itu masih ada",
      d: "Kedua job dijalankan paralel oleh dua worker berbeda",
    },
    answer: "c",
    explain: "Dokumentasi BullMQ: job dengan id yang sudah ada diabaikan dan tidak ditambahkan. Ini cara menghindari job duplikat. Catatan: job yang sudah dihapus tidak dihitung, dan id custom tidak boleh mengandung ':' atau hanya berupa angka, jadi pakai prefix seperti 'invoice-42'.",
  },
  {
    id: "0034-05", lesson: "0034", topic: "prod-retry-idempotency", type: "mc",
    prompt: "Job \"kirim email + tandai terkirim\" gagal setelah email terkirim tapi sebelum status disimpan, lalu di-retry. Apa yang harus dimiliki handler-nya?",
    options: {
      a: "Concurrency worker yang lebih tinggi supaya retry lebih cepat",
      b: "attempts yang lebih besar supaya peluang berhasil semakin bertambah",
      c: "Backoff fixed, bukan exponential, supaya jedanya selalu lebih pendek",
      d: "Idempotency: cek dulu apakah sudah terkirim sebelum mengirim lagi",
    },
    answer: "d",
    explain: "Retry berarti handler bisa berjalan lebih dari sekali untuk job yang sama. Idempotent artinya menjalankannya dua kali berefek sama dengan sekali: simpan penanda (mis. kolom sentAt atau idempotency key unik) dan periksa sebelum melakukan efek samping.",
  },
  {
    id: "0034-oral-1", lesson: "0034", topic: "prod-bullmq", type: "oral",
    prompt: "Tulis kode: setelah user mendaftar, <code>UsersService</code> menambah job <code>welcome</code> ke queue <code>email</code> dengan retry 5 kali dan backoff exponential, dan processor-nya mengirim email. Tulis registrasi queue, producer, dan processor. (5 menit)",
    sample: "<pre><code>// users.module.ts\n@Module({ imports: [BullModule.registerQueue({ name: 'email' })], providers: [UsersService, EmailProcessor] })\nexport class UsersModule {}\n\n// users.service.ts\nconstructor(@InjectQueue('email') private emailQueue: Queue, private prisma: PrismaService) {}\n\nasync register(dto: RegisterDto) {\n  const user = await this.prisma.user.create({ data: dto });\n  await this.emailQueue.add('welcome', { userId: user.id }, {\n    jobId: `welcome-${user.id}`,\n    attempts: 5,\n    backoff: { type: 'exponential', delay: 1000 },\n  });\n  return user;\n}\n\n// email.processor.ts\n@Processor('email')\nexport class EmailProcessor extends WorkerHost {\n  async process(job: Job&lt;{ userId: number }&gt;) {\n    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: job.data.userId } });\n    if (user.welcomeSentAt) return;           // idempoten\n    await this.mailer.send(user.email, 'Selamat datang');\n    await this.prisma.user.update({ where: { id: user.id }, data: { welcomeSentAt: new Date() } });\n  }\n}</code></pre>",
    checklist: [
      "BullModule.registerQueue({ name: 'email' }) (dan BullModule.forRoot dengan koneksi Redis)",
      "producer meng-inject @InjectQueue('email') dan memanggil queue.add(nama, data, opts)",
      "data job kecil (userId), bukan seluruh objek user",
      "opts: attempts: 5 dan backoff { type: 'exponential', delay }",
      "@Processor('email') class extends WorkerHost dengan async process(job)",
      "handler idempoten (cek welcomeSentAt atau jobId unik) karena retry bisa mengulang",
    ],
  },
]);
