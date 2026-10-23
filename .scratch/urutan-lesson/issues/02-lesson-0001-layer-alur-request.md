# 02: Bangun ulang lesson 0001: Layer & alur request

**What to build:** Pengguna bisa menjawab "Bagaimana Anda menstruktur project ASP.NET Core Web API, dan kenapa?" dalam 60 detik, dan bisa menentukan layer yang tepat (Controller, Service, Repository, composition root) untuk potongan kode. Lesson versi lama diganti sepenuhnya, dan hasil pengerjaan versi lama tidak dihitung sebagai bukti penguasaan.

**Blocked by:** 01

**Status:** resolved

- [x] Agent memanggil skill `/teach` sebelum mulai, lalu membaca MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets
- [x] Materi diambil dari sumber terpercaya di RESOURCES (tambahkan sumber baru ke RESOURCES bila perlu), dan setiap klaim penting diberi kutipan
- [x] Lesson bisa diselesaikan dalam 10–15 menit dan punya satu target berupa pertanyaan interview yang bisa dijawab
- [x] Ada kuis dengan feedback langsung: setiap pilihan jawaban punya jumlah kata yang sama, dan posisi jawaban benar bervariasi
- [x] Ada latihan lisan (jawab dengan suara keras) dengan jawaban contoh dan checklist 6 poin
- [x] Soal kuis didaftarkan ke bank soal bersama dengan tag topik dan nomor lesson, supaya bisa dipakai di review campuran
- [x] Reference doc yang bisa dicetak dibuat atau diperbarui dan di-link dari lesson
- [x] Istilah konsisten dengan GLOSSARY, dan setiap konsep diberi padanan Node/Express/React
- [x] Ada satu sumber resmi utama yang direkomendasikan, plus pengingat untuk bertanya ke agent
- [x] Link navigasi dari lesson sebelumnya dan entri di halaman indeks lesson sudah diperbarui
- [x] Memakai stylesheet dan komponen bersama; kode yang bisa dipakai ulang ditaruh di assets, bukan ditulis langsung di lesson
- [x] Topik tetap sama: alur Controller → Service → Repository → DbContext, DTO, interface, composition root, dan Options Pattern secara singkat
- [x] Pola latihan yang sudah terbukti di versi lama dipertahankan: kuis klasifikasi layer, kuis "kenapa", dan latihan lisan 60 detik

## Comments

**Implementer (agent):** Selesai. Skill `/teach` tidak bisa dipanggil lewat model, jadi `SKILL.md` dan file `*-FORMAT.md`-nya dibaca dan diikuti langsung, bersama MISSION, NOTES, learning records, RESOURCES, GLOSSARY, dan assets.

- `lessons/0001-layer-dan-alur-request.html` dibangun ulang: target interview, catatan "kuis = feedback cepat, bukti dari review 0007", 5 bagian materi pendek (tabel padanan Express, alur request, DTO, interface + composition root, Options Pattern sekilas) dengan kutipan dari 5 halaman Microsoft Learn (semua dicek ulang ke halaman aslinya), 3 latihan (klasifikasi layer, "kenapa", lisan 60 detik + checklist 6 poin), bacaan utama, pengingat bertanya ke agent, nav ke indeks untuk 0002.
- `assets/questions/0001.js`: 15 soal kuis + 1 soal lisan, topik `layer`, `composition-root`, `dto`. Kuis di lesson dirender dari bank lewat `bank-quiz.js`, jadi soalnya siap ditarik oleh review 0007.
- `tests/questions-0001.test.js`: memuat file soal ke bank baru dan memeriksa registrasi, jumlah kata opsi yang sama, posisi jawaban yang memakai a–d, checklist lisan 6 poin, dan label topik.
- `reference/layered-architecture.html`: kutipan ditambahkan di setiap aturan, pertanyaan lanjutan diperbarui (DTO, `new`, Options Pattern, rujukan ke lesson 0005/0011).
- RESOURCES: 3 sumber baru (controllers, tutorial web API/over-posting, Options pattern). GLOSSARY: istilah **Composition root** ditambahkan karena dipakai di lesson. NOTES: catatan bahwa hasil versi lama tidak dihitung.

Yang masih terbuka: link "berikutnya" di lesson ini sementara mengarah ke indeks; ticket 03 (lesson 0002) sebaiknya menggantinya dengan link ke file 0002. Baris indeks 0001 sudah `tersedia` dengan link yang benar, jadi tidak diubah. Istilah Composition root ditambahkan ke GLOSSARY sebelum ada bukti pemahaman (aturan GLOSSARY-FORMAT), mengikuti NOTES yang menyebut GLOSSARY sebagai kosakata acuan.
