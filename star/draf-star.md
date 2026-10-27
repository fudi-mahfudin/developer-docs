# Draf cerita STAR

Ditulis malam Hari 1 (tugas dari lesson 0006), dipoles dan diulang di lesson 0018.
Format: **S**ituation (1–2 kalimat) → **T**ask (1 kalimat) → **A**ction ("saya", bukan "kami"; 3–5 kalimat) → **R**esult (angka bila bisa).
Cukup poin-poin. Setiap cerita butuh S, T, A, R dan minimal satu angka di Result.

## 1. Bug/insiden produksi tersulit yang saya selesaikan

- **S:**
- **T:**
- **A:**
- **R:**

## 2. Refactor yang meningkatkan kualitas/maintainability (kaitkan ke SOLID/testing)

- **S:**
- **T:**
- **A:**
- **R:**

## 3. Konflik/beda pendapat teknis dengan rekan dan cara menyelesaikannya

- **S:**
- **T:**
- **A:**
- **R:**

## 4. Mempelajari teknologi baru dengan cepat

Jembatan: "persis seperti saya mempelajari .NET & Angular untuk posisi ini, ini mini project-nya."

- **S:**
- **T:**
- **A:**
- **R:**

## Skenario teknis: SATUSEHAT (hipotetis, bukan STAR)

Bukan cerita pengalaman. Dipakai untuk pertanyaan "bagaimana Anda menangani…", dijawab dengan "pendekatan saya…", **bukan** "dulu saya…".
Fakta SATUSEHAT dari `fhir/lessons/0022-satusehat-platform-dan-identitas.html` dan `0023-satusehat-validasi-dan-mapping.html` (dokumentasi resmi, diakses 2026-10-26).

**Pertanyaan:** "Jam ramai loket pendaftaran, pencarian pasien by NIK ke SATUSEHAT mulai gagal: 401, lalu timeout. Antrean menumpuk. Apa yang Anda lakukan?"

**Pembuka jujur:** "SIMRS tempat saya bekerja (Node + Next.js) memang terintegrasi SATUSEHAT. Saya tidak pernah menangani insiden seperti ini, jadi ini pendekatan saya:"

1. **Lepaskan loket dari SATUSEHAT (mitigasi dulu).** Pendaftaran lokal tetap jalan dengan nomor RM dan nomor kunjungan lokal; IHS number tidak boleh jadi syarat pasien dilayani. Pasien yang IHS number-nya belum ada ditandai `pending` dan di-resolve async lewat antrean/job.
2. **Diagnosis 401: token.** Token didapat lewat OAuth2 `client_credentials` (`POST /oauth2/v1/accesstoken`, `client_id` + `client_secret`) dari backend Node, bukan dari browser. 401 di jam ramai biasanya berarti token kedaluwarsa (`expires_in` ±3599 detik) atau tiap request minta token baru. Perbaikan: satu token di-cache per proses/instance, di-refresh sebelum `expires_in` habis (misalnya sisa 5 menit), dan ada lock supaya request yang bersamaan tidak berebut minta token baru. Ini penting karena dokumentasi menyebut rate limit "1 request per minute after a failed attempt" dan memperingatkan generate token terlalu sering.
3. **Timeout: lindungi request loket.** Timeout per panggilan (mis. 3–5 detik via `AbortController`), retry hanya untuk error transien (timeout/5xx) dengan exponential backoff + jitter dan batas percobaan; 4xx tidak di-retry. Kalau gagal beruntun, circuit breaker sementara langsung jatuh ke jalur `pending`.
4. **Cari dulu, jangan buat ulang.** Alurnya `GET /Patient?identifier=https://fhir.kemkes.go.id/id/nik|<NIK>`; kalau tidak ketemu, baru `POST Patient` (diverifikasi ke DUKCAPIL). IHS number yang didapat disimpan di tabel pasien kita supaya kunjungan berikutnya tidak memanggil SATUSEHAT lagi. Ini sekaligus mengurangi beban di jam ramai.
5. **Observability.** Log status, durasi, dan isi `OperationOutcome` (`issue.code`, `details.text`, `expression`) per request; metrik rasio gagal dan jumlah `pending`; alert kalau melewati ambang.
6. **UI Next.js.** Form tidak memblokir: tampilkan status "IHS number sedang diproses" dan tombol coba lagi. Petugas loket tidak perlu tahu soal token.

**Penutup (satu kalimat):** "Prinsipnya: SATUSEHAT adalah dependency eksternal, jadi pelayanan pasien tidak boleh ikut berhenti saat ia gagal; data disusulkan, bukan dibuang."

**Versi lisan ±60 detik (±140 kata):**

> "SIMRS tempat saya bekerja, Node dan Next.js, terintegrasi SATUSEHAT. Saya belum pernah menangani insiden ini, jadi ini pendekatan saya.
>
> Pertama, mitigasi: loket tidak boleh menunggu SATUSEHAT. Pendaftaran lokal tetap jalan, pasien tanpa IHS number ditandai pending dan diproses async lewat antrean.
>
> Kedua, 401 hampir pasti soal token. Token client credentials saya cache di backend, refresh sebelum expires_in habis, dengan lock supaya tidak minta token berulang, karena SATUSEHAT membatasi request token setelah gagal.
>
> Ketiga, timeout: batas waktu per panggilan, retry dengan backoff dan jitter hanya untuk error transien, dan circuit breaker kalau gagal beruntun.
>
> Keempat, cari pasien by NIK dulu sebelum membuat Patient baru, lalu simpan IHS number di database kita supaya kunjungan berikutnya tidak memanggil SATUSEHAT lagi.
>
> Terakhir, log OperationOutcome dan alert. Prinsipnya: SATUSEHAT dependency eksternal; pelayanan pasien jalan terus, datanya disusulkan."

Latihan: ucapkan dengan timer. Lebih dari 70 detik → pangkas langkah ketiga jadi satu kalimat ("timeout dan retry dengan backoff").

**Pertanyaan lanjutan yang mungkin muncul:**
- *"Token di-cache di mana kalau Node jalan multi-instance?"* → Per instance boleh (tiap instance satu token); kalau instance banyak dan kena rate limit token, pindahkan ke Redis dengan lock bersama.
- *"Bagaimana mencegah pasien dobel saat retry `POST Patient`?"* → Selalu search by NIK sebelum POST; job async idempoten per pasien lokal.
- *"Kenapa tidak panggil SATUSEHAT langsung dari browser?"* → `client_secret` tidak boleh sampai ke client; selalu lewat API route/backend.

**Belum terverifikasi (diakses 2026-10-26), jangan diucapkan sebagai fakta:** apakah SATUSEHAT mengembalikan 429 untuk endpoint FHIR, dan batas rate limit selain di endpoint token. Ucapkan "sesuai dokumentasi terakhir yang saya baca" bila ditanya detail.

## Bonus: "Kenapa pindah dari Node/React ke .NET/Angular?"

Tekankan transfer skill (TypeScript → Angular natural; konsep layered/DI/testing sama) dan bukti mini project.

-
