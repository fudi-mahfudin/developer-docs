# 0003 · Konvensi untuk materi (track) baru

Status: diterima (2026-10-31)

## Konteks

ADR 0002 menetapkan format lesson ±20 menit, self-paced, dan review tertunda, tapi hanya untuk track FHIR. Formatnya terbukti lebih mudah dicicil daripada format per hari/jam yang dipakai track dotnet. Track baru (mulai dari system design) butuh aturan yang sama tanpa harus mengulang perdebatannya setiap kali.

## Keputusan

Berlaku untuk setiap track **baru** yang dibuat setelah ADR ini.

- **Struktur:** satu folder `<track>/` dengan susunan ADR 0001, ditambah `tests/<track>/`, satu baris di `GLOSSARY-MAP.md`, dan satu tautan di root `index.html`.
- **Self-paced:** tidak ada pembagian hari, jam, deadline, atau "malam sebelum interview". Interview boleh jadi tujuan di MISSION, tapi tanpa tanggal.
- **Lesson ±20 menit** (rentang 10–25), dikelompokkan per **modul tematik**, dinomori berurutan `0001`, `0002`, dan seterusnya. Pengecualian durasi boleh, asalkan ditandai di kicker lesson dan di ROADMAP (mis. "opsional, tidak dihitung dalam durasi").
- **Review tertunda satu modul**: setiap review menguji modul yang selesai sebelum modul terakhir, sehingga ada jeda sebelum diuji ulang. Tidak ada review kumulatif terpisah. Review terakhir juga memuat topik lemah dari review sebelumnya (`data-topics`).
- **Bank soal per lesson** (`<track>/assets/questions/NNNN.js`). **Slug topik** adalah identitas penguasaan (learning record, `data-topics`). ID soal dan nomor lesson hanya alamat. Setiap bank berisi ≥ 4 soal `mc` (posisi jawaban bervariasi) dan ≥ 1 soal `oral` dengan checklist.
- **Mandiri:** track bisa dibaca dari nol tanpa merujuk track lain. Istilah di luar topik track (mis. OAuth, JWT) dijelaskan singkat (1–2 kalimat) di tempat istilah itu muncul.
- **Sumber primer:** klaim angka atau perilaku diberi `<sup class="cite">` ke dokumentasi resmi, spesifikasi/RFC, atau paper asli. Buku dan kursus hanya dicantumkan di `RESOURCES.md` sebagai bacaan.
- **Diagram:** alur linear memakai `.flow` (`.box` + `.arrow`). Diagram bercabang memakai **inline SVG** dengan kelas CSS bersama `.diagram` di `assets/style.css`, tanpa library eksternal, supaya tetap jalan dari `file://` dan bisa dicetak.
- **Bahasa:** Bahasa Indonesia, istilah teknis tetap bahasa Inggris. Contoh kode pendek untuk dibaca.
- **Alur kerja:** spec dan issue di `.scratch/<feature>/`. Issue pertama adalah prefactor (dokumen track, index, CSS/komponen bersama, `tests/<track>/track.test.js`), lalu satu issue per modul.

## Konsekuensi

- Track dotnet (format hari/jam) dan FHIR (ADR 0002) tidak wajib disesuaikan. ADR ini tidak berlaku retroaktif.
- Hal yang khusus untuk satu track (mis. lesson mock interview 45 menit di system design) dicatat di spec dan MISSION track itu, bukan di ADR.
- `track.test.js` setiap track baru bisa memeriksa aturan yang sama: daftar lesson dari index, ≥ 4 mc dan ≥ 1 oral per bank, dan nomor review.
