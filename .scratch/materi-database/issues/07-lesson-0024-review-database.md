# 07: Lesson 0024: Review campuran database (seam)

**What to build:** Pengguna menjalani review acak berisi soal pilihan ganda dan lisan dari lesson 0019–0023, ditambah topik performa EF Core dari 0006 (N+1, `AsNoTracking`), tanpa materi baru. Hanya hasil review ini yang boleh menghasilkan learning record "sudah dikuasai" untuk topik database.

**Blocked by:** 04, 06

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai (atau membaca dan mengikuti `SKILL.md`-nya langsung), lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Memakai komponen review bersama yang sama dengan 0007/0012; sumber soal lesson 0019–0023 dan topik N+1/`AsNoTracking` dari 0006 lewat atribut topik
- [x] Hanya retrieval practice yang diacak (interleaving), tanpa materi baru
- [x] Kriteria lulus per topik sama dengan seam yang ada: soal acak dijawab benar, dan jawaban lisan memenuhi minimal 4 dari 6 poin checklist; halaman menjelaskan cara mencatat hasil ke learning records
- [ ] Test review dibuat mengikuti pola `review-0012.test.js`: sumber lesson 0019–0023, topik 0006 yang disertakan, urutan pemuatan script sebelum `review.js`, dan file soal 0006 + 0019–0023 bisa dimuat bersama sebagai browser script tanpa bentrok nama
- [ ] `order.test.js` mencakup 0024, lesson 0023 menautkan 0024, dan halaman index mencantumkan 0024
- [x] Reference ulang-sebelum-interview diperbarui dengan ringkasan database
- [x] RESOURCES dicek lengkap untuk semua sumber yang dipakai 0019–0023
- [x] `node --test` hijau
- [x] Seam ini menunggu hasil pengerjaan user: ticket ditandai resolved untuk bagian agent, dengan catatan bahwa learning record "sudah dikuasai" baru ditulis setelah user menjalani review

## Comments

**Implementer (agent):** Selesai untuk bagian agent. Seam ini **menunggu user**: learning record "sudah dikuasai" untuk topik database baru ditulis setelah user menjalani review 0024 dan menempelkan ringkasannya (langkah pencatatan ada di halaman dan di NOTES). Tidak ada learning record yang ditulis sekarang.

Checkbox yang sengaja dibiarkan terbuka (atas arahan user: fokus ke materi interview, tanpa test/JS baru):
- **Test review** (`tests/review-0024.test.js`) tidak dibuat. Sebagai gantinya dicek sekali dari command line dengan `tests/helpers.js`: file soal 0006 + 0019–0023 dimuat bersama lewat `runAsBrowserScripts` tanpa bentrok nama; urutan `<script>` (bank.js → soal → review.js) benar; jumlah topik kuis pool = 29 = `data-mc`; `draw()` menarik satu kuis per topik dan 6 lisan untuk seed 1–20.
- **`order.test.js`** tidak menguji navigasi lesson (itu test komponen `assets/order.js`, lihat Comments ticket 02), jadi tidak diubah. Bagian lain checkbox itu terpenuhi: 0023 sudah menautkan `0024-review-database.html`, dan baris 0024 di `index.html` kini `tersedia seam` dengan tautan.

Ringkasan:
- `/teach` dibaca dan diikuti langsung dari `SKILL.md` (disable-model-invocation). Dibaca: MISSION, NOTES, learning records, RESOURCES, GLOSSARY, assets (`review.js`, `bank.js`, bank soal).
- `lessons/0024-review-database.html`: komponen `review.js` apa adanya, `data-lessons="0019,0020,0021,0022,0023"`, `data-topics="ef-n-plus-1,ef-no-tracking"`, `data-mc="29"`, `data-oral="6"`. Tanpa materi baru; aturan main, kriteria lulus "minimal 4 dari 6 poin checklist" sama dengan 0007/0012, cara melapor hasil ke agent, bacaan untuk topik lemah. Navigasi: ← 0023, → daftar lesson (`index.html`), karena 0024 menutup urutan.
- `reference/ulang-sebelum-interview.html`: bagian 2b (placeholder topik lemah 0024) dan 3b "Ringkasan database: kerangka jawaban 30 detik" (13 pertanyaan: index, plan, SARGable, parameter sniffing, pagination, query lambat EF Core, N+1/AsNoTracking, isolation level, deadlock, transaction, SP, top-N/HAVING); langkah pagi hari diperbarui.
- RESOURCES dicek dengan membandingkan semua URL eksternal di lesson dan reference 0019–0023: dua yang belum tercatat ditambahkan (Scalar UDF inlining untuk 0020, `RelationalDatabaseFacadeExtensions.BeginTransaction` untuk 0021). Entri duplikat "Troubleshoot high-CPU-usage" dihapus.
- Tiga sumber 0021 yang sebelumnya dari pengetahuan umum kini dibaca dari Microsoft Learn dan diberi kutipan verbatim di `lessons/0021-transaction-locking.html`: Connection resiliency (pesan "does not support user-initiated transactions" dan solusi execution strategy), Handling concurrency conflicts ("takes no locks", SQL UPDATE dengan `[Version]`, zero rows → `DbUpdateConcurrencyException`, rowversion), SET LOCK_TIMEOUT (default -1 "wait forever"). Error 1222 ternyata tidak disebut di halaman SET LOCK_TIMEOUT, jadi ditambahkan sumber [15] MSSQLSERVER_1222 ("Lock request time out period exceeded.") di lesson, reference `transaction-locking.html` [13], dan RESOURCES.
- NOTES: satu baris lesson 0024 dengan langkah pencatatan hasil.
- `node --test`: 108 pass, 0 fail.
