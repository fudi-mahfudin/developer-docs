# 0002 · Track FHIR: lesson ±20 menit, self-paced, review tertunda

Status: diterima (2026-10-27)

Konvensi umumnya diangkat menjadi [ADR 0003](./0003-konvensi-materi-baru.md) untuk track baru.

## Konteks

Track FHIR dirancang untuk deadline "1 hari (6–8 jam)": 7 lesson besar ±50–100 menit dengan slot jam (08.00–17.30), satu seam di akhir hari (0006), dan satu lesson "malam sebelum interview" (0007). Deadline itu sudah tidak berlaku, dan lesson sebesar itu sulit dicicil.

## Keputusan

- Track FHIR **self-paced**: tidak ada pembagian hari, jam, atau "malam sebelum interview". Interview tetap jadi tujuan, tapi tanpa tanggal.
- Lesson rata-rata **±20 menit** (rentang 10–25), dikelompokkan per **modul tematik**: Fondasi, Resource, REST, Bulk Data, SMART, SATUSEHAT, PDP, Penutup. Hasilnya 29 lesson `0001`–`0029`, dinomori ulang berurutan.
- Lesson lama dipecah di batas `<h2>`. Isinya **dipindahkan, tidak ditulis ulang**, karena fakta sudah diverifikasi ke sumber primer.
- Bank soal ikut dipecah per lesson. **Slug topik tetap**, karena slug adalah identitas penguasaan (learning record, `data-topics`). ID soal dan nomor lesson hanya alamat.
- Seam diganti **tiga review tertunda satu modul**: 0012 (Fondasi + Resource, setelah REST), 0021 (REST + Bulk, setelah SMART), 0027 (SMART + SATUSEHAT + PDP + topik lemah). Tidak ada review kumulatif terpisah, karena 52 topik tidak muat dalam 20 menit.
- PDP menjadi modul biasa dan ikut di-review.

## Konsekuensi

- Nomor lesson FHIR lama (0001–0007) tidak lagi berlaku. Rujukan di file issue lama `.scratch/materi-fhir/` tidak ditulis ulang.
- Syarat test "≥ 8 kuis per bank" dilonggarkan, karena lesson kecil hanya memuat 1–3 topik.
- Bukti penguasaan dicatat dari ketiga review. Satu review tidak lagi menguji semua lesson sebelumnya sekaligus.
