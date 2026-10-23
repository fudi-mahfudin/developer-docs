Status: resolved

# Spec: Susun ulang urutan lesson — persiapan interview .NET 8 + Angular 16 (3 hari)

## Problem Statement

Saya (developer TypeScript/Node.js/React) punya 3 hari untuk bersiap menghadapi interview Fullstack Developer .NET + Angular level mid. Rencana lesson awal di workspace belajar punya beberapa celah:

- Konsep dasar C# tidak ada sama sekali, padahal saya belum pernah menulis C#. Pertanyaan seperti value vs reference type atau `IEnumerable` vs `IQueryable` hampir pasti muncul.
- Tidak ada titik untuk memeriksa apakah materi hari sebelumnya benar-benar masih saya ingat. Kuis per lesson hanya mengukur ingatan sesaat (fluency), bukan ingatan jangka panjang (storage).
- Beberapa lesson terlalu padat untuk dikerjakan dalam 10–15 menit, misalnya "TDD & jenis test" dan "forms + interceptor + JWT".
- Cerita STAR baru disiapkan di akhir Hari 3, sehingga tidak ada waktu untuk mengulangnya.

## Solution

Urutan baru berisi 18 lesson pendek (10–15 menit), mengikuti pembagian hari di ROADMAP:

- **Hari 1:** backend dan fondasi C#
- **Hari 2:** desain dan testing
- **Hari 3:** Angular, topik fullstack, dan mock interview

Hari 2 dan Hari 3 dibuka dengan **lesson review campuran** yang mengacak soal dari hari sebelumnya. Hari 3 ditutup dengan **mock interview final** yang mengacak semua topik. Cerita STAR mulai dicicil sebagai pekerjaan malam Hari 1, lalu dipoles dan diulang di Hari 3.

| Hari | # | Lesson | Jenis |
|---|---|---|---|
| 1 | 0001 | Layer & alur request (Controller → Service → Repository → DbContext) | dibangun ulang |
| 1 | 0002 | C# untuk developer TS: class/record/struct, value vs reference, nullable reference types, interface vs abstract class | baru |
| 1 | 0003 | `async`/`Task` + LINQ: `IEnumerable` vs `IQueryable`, deferred execution | baru |
| 1 | 0004 | Service Lifetime (Transient/Scoped/Singleton) + captive dependency | — |
| 1 | 0005 | Middleware pipeline & urutannya + Options Pattern | — |
| 1 | 0006 | Konsep EF Core: DbContext, change tracking, Migration, N+1, `AsNoTracking` | — |
| 2 | 0007 | Review campuran Hari 1 | seam |
| 2 | 0008 | SOLID: SRP & DIP dibahas mendalam, OCP/LSP/ISP lewat contoh Product Catalog | — |
| 2 | 0009 | Red-Green-Refactor: siklusnya, Arrange-Act-Assert, penamaan test | — |
| 2 | 0010 | Jenis test: Unit Test vs Integration Test, Mock/stub/fake, `WebApplicationFactory` | — |
| 2 | 0011 | Clean Architecture secara lisan + debat perlu-tidaknya Repository di atas EF Core | — |
| 3 | 0012 | Review campuran Hari 2 | seam |
| 3 | 0013 | Angular: NgModule, component, binding, Lifecycle Hook (padanan React) | — |
| 3 | 0014 | Angular Service & DI + routing/guard | — |
| 3 | 0015 | RxJS: Observable vs Promise, `switchMap`, unsubscribe | — |
| 3 | 0016 | Reactive Forms + HttpClient + HTTP Interceptor | — |
| 3 | 0017 | Topik fullstack: JWT, authentication vs authorization, CORS, global error handling | — |
| 3 | 0018 | STAR + mock interview final, semua topik diacak | seam |

## User Stories

1. Sebagai kandidat yang belum pernah menulis C#, saya ingin lesson konsep dasar C# yang dijembatani dari TypeScript, supaya tidak kaku saat ditanya soal sistem tipe C#.
2. Sebagai kandidat, saya ingin memahami perbedaan `class`, `record`, dan `struct`, supaya bisa menjelaskan kenapa DTO cocok ditulis sebagai `record`.
3. Sebagai kandidat, saya ingin bisa menjelaskan value type vs reference type, supaya bisa menjawab pertanyaan dasar yang sering dipakai untuk menyaring kandidat.
4. Sebagai kandidat, saya ingin tahu nullable reference types dan padanannya dengan `string | null` di TS, supaya bisa membaca template .NET 8 tanpa bingung.
5. Sebagai kandidat, saya ingin bisa membandingkan interface dan abstract class, supaya bisa menjawab pertanyaan OOP klasik.
6. Sebagai kandidat, saya ingin memahami `Task` dan `async`/`await` di C# dengan padanannya di `Promise`, supaya bisa menjelaskan kenapa `.Result` dan `async void` berbahaya.
7. Sebagai kandidat, saya ingin memahami `IEnumerable` vs `IQueryable` dan deferred execution, supaya bisa menjelaskan kapan query EF Core benar-benar dieksekusi.
8. Sebagai kandidat, saya ingin lesson Service Lifetime yang membahas jebakan captive dependency, supaya bisa menjawab pertanyaan DI yang paling sering ditanyakan.
9. Sebagai kandidat, saya ingin tahu kenapa DbContext didaftarkan sebagai Scoped, supaya jawaban lifetime saya punya contoh nyata.
10. Sebagai kandidat, saya ingin memahami middleware pipeline dan kenapa urutannya penting, supaya bisa menjelaskan request lifecycle dari awal sampai akhir.
11. Sebagai kandidat, saya ingin memahami Options Pattern dan konfigurasi berlapis (appsettings, environment, User Secrets), supaya bisa menjawab di mana secret disimpan.
12. Sebagai kandidat, saya ingin memahami change tracking, Migration, N+1, dan `AsNoTracking`, supaya bisa menjawab pertanyaan performa EF Core.
13. Sebagai kandidat, saya ingin review campuran di awal Hari 2 yang mengacak soal Hari 1, supaya tahu topik mana yang benar-benar menempel setelah tidur semalam.
14. Sebagai kandidat, saya ingin hasil review campuran menentukan apakah sebuah topik dicatat sebagai sudah dikuasai, supaya lesson berikutnya tidak mengulang yang sudah saya kuasai atau melewatkan yang belum.
15. Sebagai kandidat, saya ingin topik yang gagal di review dimasukkan lagi ke review berikutnya, supaya ada pengulangan berjarak.
16. Sebagai kandidat, saya ingin SRP dan DIP dibahas paling dalam, supaya punya jawaban kuat untuk "prinsip SOLID mana yang paling sering Anda terapkan".
17. Sebagai kandidat, saya ingin contoh OCP, LSP, dan ISP dari Product Catalog, supaya bisa memberi kelima contoh dari kode yang sama.
18. Sebagai kandidat, saya ingin lesson red-green-refactor yang terpisah dari pembahasan jenis test, supaya siklusnya bisa saya demokan dalam waktu kurang dari 10 menit.
19. Sebagai kandidat, saya ingin tahu kenapa test harus terlihat gagal dulu, supaya bisa menjawab "kenapa harus red dulu?".
20. Sebagai kandidat, saya ingin bisa membedakan Unit Test, Integration Test, dan E2E, supaya bisa menjelaskan testing pyramid.
21. Sebagai kandidat, saya ingin bisa membedakan Mock, stub, dan fake, supaya memakai istilah yang tepat di depan pewawancara.
22. Sebagai kandidat, saya ingin memahami `WebApplicationFactory` secara konsep, supaya bisa menjelaskan cara menguji API tanpa deploy.
23. Sebagai kandidat, saya ingin bisa menggambar Clean Architecture dan menjelaskan dependency rule-nya, supaya punya jawaban saat diminta membandingkannya dengan layered.
24. Sebagai kandidat, saya ingin argumen pro dan kontra Repository di atas EF Core, supaya bisa menghadapi pertanyaan yang memancing perdebatan.
25. Sebagai kandidat, saya ingin review campuran di awal Hari 3 yang mengacak soal Hari 2 dan topik Hari 1 yang masih lemah, supaya pengulangannya berjarak dan bercampur.
26. Sebagai developer React, saya ingin konsep Angular dijelaskan lewat padanan React, supaya cepat paham NgModule, binding, dan Lifecycle Hook.
27. Sebagai kandidat, saya ingin materi Angular memakai sintaks v16 (`*ngIf`/`*ngFor`, NgModule), supaya jawaban saya sesuai versi yang dipakai perusahaan.
28. Sebagai kandidat, saya ingin memahami DI hierarkis Angular dibandingkan React Context, supaya bisa menjawab di mana state bersama disimpan.
29. Sebagai kandidat, saya ingin memahami routing, lazy loading, dan guard, supaya bisa menjelaskan cara melindungi halaman.
30. Sebagai kandidat, saya ingin lesson RxJS yang khusus membahas Observable vs Promise, `switchMap`, dan unsubscribe, supaya tidak gugup saat masuk ke pertanyaan RxJS.
31. Sebagai kandidat, saya ingin memahami Reactive Forms vs template-driven forms, supaya bisa memberi alasan memilih salah satunya.
32. Sebagai kandidat, saya ingin HTTP Interceptor diajarkan bersama HttpClient, supaya lesson auth bisa fokus ke alur fullstack.
33. Sebagai kandidat fullstack, saya ingin JWT, authentication vs authorization, CORS, dan global error handling dijelaskan sebagai satu cerita dari Angular sampai API, supaya bisa menjawab "jelaskan alur login aplikasi Anda".
34. Sebagai kandidat, saya ingin tahu trade-off menyimpan JWT di localStorage vs httpOnly cookie, supaya bisa menjawab pertanyaan keamanan.
35. Sebagai kandidat, saya ingin mulai mencicil 4 cerita STAR sejak malam Hari 1, supaya punya waktu memolesnya sebelum mock interview.
36. Sebagai kandidat yang pindah stack, saya ingin jawaban siap pakai untuk "kenapa pindah ke .NET/Angular", supaya pindah stack terdengar sebagai kekuatan.
37. Sebagai kandidat, saya ingin mock interview final yang mengacak semua topik dan dibatasi waktu, supaya mirip dengan interview sungguhan.
38. Sebagai kandidat, saya ingin hasil mock interview dicatat sebagai bukti penguasaan, supaya tahu topik mana yang perlu diulang tepat sebelum interview.
39. Sebagai kandidat, saya ingin setiap lesson selesai dalam 10–15 menit, supaya sisa waktu harian bisa dipakai untuk praktik di ROADMAP.
40. Sebagai kandidat, saya ingin urutan lesson setiap hari mendahului sesi praktik ROADMAP di hari yang sama, supaya konsepnya sudah paham sebelum mulai coding.
41. Sebagai kandidat, saya ingin setiap lesson punya satu target konkret berupa pertanyaan interview yang bisa dijawab, supaya kemajuan saya terasa jelas.
42. Sebagai kandidat, saya ingin setiap lesson punya latihan menjawab dengan suara keras, supaya terbiasa merangkai jawaban, bukan cuma mengenali jawaban yang benar.
43. Sebagai kandidat, saya ingin setiap lesson punya ringkasan reference yang bisa dicetak, supaya bisa dibaca cepat di pagi hari interview.
44. Sebagai kandidat, saya ingin istilah di semua lesson konsisten dengan GLOSSARY, supaya tidak bingung karena satu konsep punya beberapa nama.
45. Sebagai kandidat, saya ingin setiap lesson menunjuk ke satu sumber resmi utama, supaya bisa memeriksa ulang klaim yang meragukan.
46. Sebagai kandidat, saya ingin tetap bisa bertanya ke agent di setiap lesson, supaya hal yang belum jelas langsung terjawab.

## Implementation Decisions

- **Wajib memakai skill `/teach`.** Agent yang mengerjakan spec ini harus memanggil skill `/teach` sebelum membuat atau membangun ulang lesson mana pun, lalu mengikuti aturannya: membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets dulu; mengambil materi dari sumber terpercaya, bukan dari ingatan model; serta memperbarui reference doc dan learning record sesuai aturan skill tersebut.
- **Unit kerja** adalah lesson HTML mandiri dengan penomoran berurutan sesuai tabel di atas.
- **Lesson 0001 dibangun ulang** dengan topik dan nomor yang sama, mengikuti aturan spec ini: satu target pertanyaan interview, kuis per lesson sebagai feedback cepat (bukan bukti penguasaan), latihan lisan dengan checklist, reference doc, sumber resmi dari RESOURCES, istilah GLOSSARY, dan navigasi ke 0002. Soal-soalnya juga harus siap dipakai ulang di review campuran 0007. Hasil pengerjaan versi lama tidak dihitung sebagai bukti penguasaan.
- **Pembagian hari mengikuti ROADMAP** supaya setiap lesson konsep mendahului sesi praktik di hari yang sama. Urutan topik di dalam satu hari mengikuti ketergantungan: C# dasar sebelum LINQ, LINQ sebelum EF Core, Service Lifetime sebelum EF Core (karena DbContext Scoped), dan SOLID (DIP) sebelum testing dan Clean Architecture.
- **Lesson yang dipecah:** "TDD & jenis test" menjadi 0009 dan 0010, "Angular NgModule/component/DI" menjadi 0013 dan 0014, dan "forms + interceptor + JWT" menjadi 0016 dan 0017.
- **Lesson baru:** 0002 dan 0003 (fondasi C#), serta 0007 dan 0012 (review campuran).
- **Config/Options Pattern** digabung ke lesson middleware (0005), karena keduanya sama-sama diatur di composition root.
- **Topik fullstack (0017)** menggabungkan JWT, CORS, dan global error handling sebagai satu alur dari Angular sampai API.
- **Lesson review campuran** hanya berisi retrieval practice yang diacak (interleaving): kuis dan pertanyaan lisan bercampur, tanpa materi baru. Soalnya diambil dari lesson hari sebelumnya, ditambah topik yang tercatat lemah dari review sebelumnya.
- **STAR:** tugas mencicil cerita diberikan di akhir lesson terakhir Hari 1 (0006). Lesson 0018 dipakai untuk memoles dan mengulang, bukan menyusun dari nol.
- **Setiap lesson** memakai stylesheet dan komponen kuis bersama dari folder assets, membuat atau memperbarui satu reference doc, mengutip sumber dari RESOURCES, dan memakai istilah GLOSSARY.
- **NOTES** diperbarui: daftar urutan lama diganti dengan rujukan ke spec ini.

## Testing Decisions

- **Yang diuji adalah perilaku yang terlihat, yaitu kemampuan menjawab pertanyaan interview tanpa melihat catatan.** Paparan materi atau skor kuis langsung setelah membaca tidak dihitung. Ini padanan "uji perilaku eksternal, bukan detail implementasi".
- **Seam utama:** lesson review campuran 0007 dan 0012, ditambah mock interview final 0018. Hanya hasil dari ketiganya yang boleh menghasilkan learning record "sudah dikuasai".
- **Kuis per lesson** tetap ada sebagai feedback loop cepat, tapi bukan bukti penguasaan.
- **Kriteria lulus per topik di seam:** menjawab benar soal yang diacak, dan jawaban lisan memenuhi mayoritas poin checklist (minimal 4 dari 6 poin).
- **Contoh yang sudah ada:** lesson 0001 versi lama (akan dibangun ulang) sebagai acuan pola: kuis klasifikasi, kuis "kenapa", latihan lisan 60 detik dengan checklist, serta komponen kuis bersama yang punya skor dan tombol ulangi.

## Out of Scope

- Mengubah ROADMAP, MISSION, atau stack teknologi (.NET 8, Angular 16, SQL Server, xUnit/Moq, Jasmine/Karma).
- Konten detail setiap lesson. Spec ini hanya mengatur urutan, cakupan, dan seam.
- System design, microservices, CQRS penuh, dan Angular 17+.
- Tutorial coding langkah demi langkah, yang sudah tercakup di ROADMAP.

## Further Notes

- Total 18 lesson × 10–15 menit ≈ 3–4,5 jam, dibagi ke 3 hari (6 + 5 + 7 lesson). Sisa waktu harian dipakai untuk praktik di ROADMAP.
- Hari 3 paling padat. Kalau waktunya kurang, 0014 (routing/guard) bisa diringkas paling dulu, karena paling mudah dijembatani dari React Router.
- Spec ini ditulis dari draf yang sudah diajukan ke user sebelumnya. User memanggil ulang skill ini tanpa koreksi, dan itu dianggap sebagai persetujuan atas draf dan seam-nya.
