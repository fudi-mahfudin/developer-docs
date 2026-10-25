# 06: Lesson 0023: Optimasi query

**What to build:** Pengguna bisa menjawab "query ini lambat, bagaimana menganalisisnya?": membaca execution plan sederhana (scan vs seek, key lookup, perkiraan vs aktual), mengenali query yang tidak SARGable, menjelaskan parameter sniffing dan cara menanganinya, membandingkan pagination OFFSET/FETCH dan keyset, serta melihat SQL yang dihasilkan EF Core (logging, `ToQueryString`). N+1 dan `AsNoTracking` dirujuk ke 0006 tanpa diulang.

**Blocked by:** 05

**Status:** ready-for-agent

- [ ] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung kalau skill tidak bisa dipanggil), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [ ] Materi diambil dari sumber terpercaya (Microsoft Learn untuk SQL Server/T-SQL dan EF Core, dokumentasi Dapper), sumber baru ditambahkan ke RESOURCES, dan setiap klaim penting diberi kutipan
- [ ] Lesson punya satu target berupa pertanyaan interview: ±15 menit konsep + kuis, lalu ±15 menit hands-on
- [ ] Kuis didaftarkan ke bank soal bersama (minimal 8 pilihan ganda + minimal 1 lisan, id berawalan nomor lesson, topik berlabel); setiap pilihan jawaban punya jumlah kata yang sama dan posisi jawaban benar bervariasi
- [ ] Latihan lisan punya jawaban contoh dan checklist 6 poin
- [ ] Bagian hands-on menampilkan skrip lesson lewat komponen blok skrip bersama (tombol copy); file `.sql` adalah sumber kebenaran dan isinya identik dengan yang tampil di HTML
- [ ] Ada 1–2 latihan "tulis query sendiri" dengan jawaban tersembunyi (komponen bersama, tidak dinilai otomatis)
- [ ] Semua skrip dan jawaban latihan dijalankan di `sql2022` pada `ProductCatalogLab` setelah setup; kalau container tidak tersedia, ticket dicatat "belum diverifikasi di SQL Server" di Comments
- [ ] Test bank soal lesson dibuat mengikuti pola `questions-0006.test.js`, termasuk cek kesamaan skrip HTML ↔ `.sql` dan cakupan topik inti; `node --test` hijau
- [ ] Reference doc topik ini dibuat dan di-link dari lesson
- [ ] Istilah baru ditambahkan ke bagian "Database (SQL Server)" di GLOSSARY, dengan padanan Node bila relevan
- [ ] Navigasi dari lesson sebelumnya, ke lesson berikutnya, dan entri di halaman index diperbarui; `order.test.js` mencakup lesson ini
- [ ] Topik inti: execution plan, SARGable, parameter sniffing (memakai distribusi data tidak merata dari setup), OFFSET vs keyset pagination, logging SQL EF Core dan `ToQueryString`
- [ ] Ada rujukan eksplisit ke lesson 0006 untuk N+1 dan `AsNoTracking`
- [ ] Parameter sniffing boleh ringkas (lihat Further Notes di spec), tapi demo dengan data tidak merata tetap ada
