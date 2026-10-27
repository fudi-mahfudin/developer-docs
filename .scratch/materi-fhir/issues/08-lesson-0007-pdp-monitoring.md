# 08: Lesson 0007: PDP dan data yang disembunyikan di monitoring (konteks SATUSEHAT)

**What to build:** `fhir/lessons/0007-pdp-data-di-monitoring.html` + `fhir/assets/questions/0007.js` + cheat sheet `fhir/reference/pdp-monitoring.html`. Target interview: *"Data apa saja yang tidak boleh muncul di log/monitoring sistem yang terhubung ke SATUSEHAT?"* dijawab ±90 detik dengan kerangka **kenapa → apa → di mana bocor → bagaimana**. Lesson setelah seam 0006, slot malam sebelum interview, ±50 menit.

Isi (hasil grilling 2026-10-27):

- **Hukum (±8 menit)**, hanya hukum Indonesia yang mengikat sistem yang terhubung ke SATUSEHAT: UU 27/2022 PDP (data kesehatan = data spesifik, kewajiban keamanan pengendali dan prosesor, notifikasi 3×24 jam), UU 17/2023 Kesehatan (hak kerahasiaan, SIK wajib melindungi data), Permenkes 24/2022 (kerahasiaan rekam medis, identitas pasien tidak dibuka, terhubung ke platform Kemenkes). Sanksi cukup satu kalimat. HIPAA tidak dipakai. Data pseudonim tetap dianggap data pribadi ditulis sebagai **tafsiran**, bukan isi pasal.
- **Taksonomi field SATUSEHAT (±20 menit, inti)**: 🔴 drop (identitas, isi klinis, kredensial) / 🟡 pseudonymize HMAC (logical id, nomor IHS, user id untuk korelasi) / 🟢 aman (resourceType, interaksi, status, latensi, jumlah entry, `issue.code`). Jebakan: query search, `OperationOutcome.diagnostics`, `text.div`, kode diagnosis sensitif.
- **Enam saluran (±8 menit)**: app log, URL/access log, trace, label metrik, error tracking (Sentry), frontend.
- **Teknik**: allowlist + drop, HMAC untuk korelasi, redaksi di sumber; satu cuplikan pino.
- **Audit vs log (±4 menit)**: `AuditEvent` di store terproteksi, terpisah dari log operasional.
- **Jawab lisan (±10 menit)**.
- Kepmenkes HK.01.07/Menkes/721/2026 dan PP 33/2026: satu kotak "belum terverifikasi", tidak dijadikan kuis.

Sumber: `.scratch/materi-fhir/research-pdp.md` (diakses 2026-10-27).

**Blocked by:** 07

**Status:** resolved

- [x] Mengikuti `/teach` dan membaca workspace `fhir/` + `assets/README.md`
- [x] Fakta hukum dari PDF resmi peraturan.bpk.go.id dengan nomor pasal; klaim tanpa sumber primer ditandai "belum terverifikasi"
- [x] Bank soal: >= 8 kuis + >= 2 lisan, topik berprefiks `pdp-`, semua berlabel
- [x] `tests/fhir/questions-0007.test.js`; `tests/fhir/track.test.js` jadi 7 lesson, seam tetap 0006; `node --test` hijau
- [x] Cheat sheet `fhir/reference/pdp-monitoring.html`
- [x] `fhir/index.html`, ROADMAP, MISSION (satu kriteria sukses), GLOSSARY (bagian PDP), RESOURCES, NOTES
- [x] Nav 0006 → 0007

## Comments
