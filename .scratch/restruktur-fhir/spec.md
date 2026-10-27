Status: ready-for-agent

# Spec: Restruktur track FHIR jadi lesson ±20 menit, self-paced

Hasil grilling 2026-10-27. Keputusan dicatat di `docs/adr/0002-lesson-fhir-20-menit-self-paced.md`.

## Problem Statement

Track FHIR (`fhir/`) dirancang untuk "1 hari (6–8 jam)": 7 lesson besar ±50–100 menit dengan slot jam (08.00–17.30) dan satu lesson "malam sebelum interview". Lesson sebesar itu sulit dicicil, dan deadline 1 hari sudah tidak berlaku.

## Solution

29 lesson ±20 menit (rentang 10–25), self-paced, dikelompokkan per **modul tematik**, bukan per hari/jam.

- **Pecah, jangan tulis ulang.** Lesson dipecah di batas `<h2>` yang ada; isi dipindahkan apa adanya. Tambahan hanya: pembuka singkat ("sebelumnya…"), transisi, target (`<div class="win">`) per lesson baru, dan penomoran ulang sitasi.
- **Penomoran ulang berurutan** `0001`–`0029`, slug baru (tabel di bawah). Tidak ada redirect.
- **Bank soal ikut dipecah**: `fhir/assets/questions/NNNN.js` per lesson baru. ID soal dinomori ulang (`NNNN-01`, …) dan field `lesson` ikut nomor baru; **slug topik tidak berubah**. Tidak ada soal baru.
- **Latihan lisan ikut topiknya**: soal lisan bank dan blok model jawaban "Ucapkan dengan suara keras" dipindah ke lesson kecil yang memuat topiknya.
- **Bacaan utama** pindah ke lesson terakhir setiap modul, berlabel "Bacaan lanjutan (opsional, tidak dihitung dalam durasi)".
- **PDP** jadi modul biasa dan ikut review.
- **Tiga review tertunda** (class `seam` di index), masing-masing ±20–25 menit, `data-mc` = jumlah topik kuis di pool, `data-oral="3"`. Aturan lulus per topik tidak berubah (kuis benar dan lisan lulus; satu soal lisan lulus kalau ≥ 2/3 poin checklist dicentang, sesuai `assets/bank.js`). Setiap review berdiri sendiri: aturan main + instruksi lapor hasil ke agent (dari lama 0006 bagian 2).
- **Tidak disentuh**: `fhir/reference/*.html`, `GLOSSARY.md`, `RESOURCES.md`, `assets/*` di root, track .NET, kecuali tautan/nomor lesson dan teks "1 hari".
- **Test**: syarat "≥ 8 kuis per bank" jadi "≥ 4 kuis per bank"; daftar lesson dan `LAST` diturunkan dari `fhir/index.html`; seam = 0012, 0021, 0027. Test cakupan per lesson lama diganti test per modul (`tests/fhir/modul-<slug>.test.js`) yang mempertahankan pemeriksaan kata kunci dan sitasi lama atas gabungan file modul.

## Urutan baru

Sumber = file lama di `.scratch/restruktur-fhir/lama/lessons/`. Menit sebelum soal lisan; bertanda * = estimasi.

| # | File | Modul | Isi (bagian lama) | ±menit |
|---|---|---|---|---|
| 0001 | `0001-v2-ke-fhir-rest-json.html` | Fondasi | 0001 §1, §2 | 20* |
| 0002 | `0002-resource-dan-versi.html` | Fondasi | 0001 §3, §4 | 20* |
| 0003 | `0003-profile-extension-ig.html` | Fondasi | 0001 §5, §6 | 20* |
| 0004 | `0004-kerangka-json-dan-identifier.html` | Resource | 0002 §1, §2 | 18 |
| 0005 | `0005-reference-dan-codeableconcept.html` | Resource | 0002 §3, §4 | 22 |
| 0006 | `0006-terminologi-dan-value-x.html` | Resource | 0002 §5, §6 | 15 |
| 0007 | `0007-meta-contained-extension.html` | Resource | 0002 §7, §8 | 17 |
| 0008 | `0008-crud-dan-search.html` | REST | 0003 §1, §2 | 20* |
| 0009 | `0009-include-dan-paging.html` | REST | 0003 §3, §4 | 20* |
| 0010 | `0010-bundle-dan-versioning.html` | REST | 0003 §5, §6 | 20* |
| 0011 | `0011-operationoutcome-dan-capability.html` | REST | 0003 §7 | 15* |
| 0012 | `0012-review-fondasi-resource.html` | Review 1 | pool 0001–0007 | 20 |
| 0013 | `0013-export-dan-alur-async.html` | Bulk Data | 0004 §1, §2 | 20* |
| 0014 | `0014-manifest-ndjson-dan-json-parse.html` | Bulk Data | 0004 §3, §4 | 18* |
| 0015 | `0015-streaming-dan-backpressure.html` | Bulk Data | 0004 §5, §6 | 22* |
| 0016 | `0016-decimal-di-javascript.html` | Bulk Data | 0004 §7 | 12* |
| 0017 | `0017-smart-peta-dan-launch.html` | SMART | 0005 §1, §2 | 20* |
| 0018 | `0018-pkce.html` | SMART | 0005 §3 (termasuk latihan susun alur) | 20* |
| 0019 | `0019-scopes-dan-backend-services.html` | SMART | 0005 §4, §5 | 18* |
| 0020 | `0020-fhirclient-dan-keamanan-token.html` | SMART | 0005 §6, §7 | 20* |
| 0021 | `0021-review-rest-bulk.html` | Review 2 | pool 0008–0011, 0013–0016 | 20 |
| 0022 | `0022-satusehat-platform-dan-identitas.html` | SATUSEHAT | 0006 1a, 1b | 15 |
| 0023 | `0023-satusehat-validasi-dan-mapping.html` | SATUSEHAT | 0006 1c, 1d | 15 |
| 0024 | `0024-pdp-hukum-dan-tiga-warna.html` | PDP | 0007 §1, §2 tanpa "Empat jebakan" | 22 |
| 0025 | `0025-pdp-jebakan-dan-saluran.html` | PDP | 0007 §2 "Empat jebakan", §3 | 15 |
| 0026 | `0026-pdp-hmac-dan-audit.html` | PDP | 0007 §4, §5 | 10 |
| 0027 | `0027-review-smart-satusehat-pdp.html` | Review 3 | pool 0017–0020, 0022–0026 + topik lemah Review 1–2 (`data-topics`) | 25 |
| 0028 | `0028-tanya-jawab-campuran.html` | Penutup | 0006 bagian 3 | 20 |
| 0029 | `0029-star-health-tech.html` | Penutup | 0006 bagian 4 | 10 |

## Format lesson baru

- Kicker: `Lesson NNNN · FHIR · Modul <nama> · ±N menit` (tanpa jam, tanpa "tanpa lab" boleh tetap di subtitle/note).
- Satu `<div class="win">` per lesson, target sempit sesuai isinya.
- Sitasi `<sup class="cite">` dinomori ulang per lesson; daftar "Sumber" hanya memuat yang dipakai.
- Rujukan silang ("lesson 0002", `href="0003-fhir-rest-api.html"`) memakai nomor/file baru. Tautan ke track .NET tetap.
- `<nav class="lesson-nav">` ke lesson sebelum/sesudah berdasarkan nomor (0001 dan 0029 juga menautkan `../index.html`).
- Script: `../../assets/bank.js`, `../assets/questions/NNNN.js` (bank sendiri), lalu komponen yang memang dipakai (`bank-quiz.js`, `quiz.js`, `order.js`, …).

## Out of scope

Menulis ulang materi, soal baru, verifikasi ulang fakta, perubahan komponen `assets/`, track .NET.

## Catatan pelaksanaan (2026-10-27)

- Pemecahan meninggalkan beberapa bank di bawah aturan teach (≥ 4 kuis, ≥ 1 lisan, posisi jawaban a–d terpakai). User memutuskan **memperkaya**, bukan melonggarkan: soal baru di 0003, 0006, 0008, 0010, 0011, 0014, 0016, 0017, 0018, 0024 (fakta dari sumber primer yang diambil 2026-10-27 atau yang sudah diajarkan di lesson itu), dan materi baru di 0016 (`JSON.rawJSON`, MDN + proposal TC39, dicek di Node 24.21.0) dan 0018 (sisi server PKCE, RFC 7636 §4.4/§4.6).
- Di beberapa bank, urutan opsi soal lama ditukar (teks tetap) supaya posisi jawaban bervariasi.
- Review 3: topik `pdp-` ada 6, jadi `data-mc="21"`.
- Durasi akhir 10–30 menit, rata-rata ±21. 0010 ±30 (dua latihan lisan).
