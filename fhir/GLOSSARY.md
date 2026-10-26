# FHIR untuk Developer JavaScript — Glossary

Kosakata bersama untuk persiapan interview fullstack (Node/React) di perusahaan health-tech yang memakai HL7 FHIR R4. Padanan dunia JavaScript ditulis bila membantu.

Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per bagian di bawah.

## Fondasi

## Resource dan datatype

## REST API

## Bulk Data dan JSON skala besar

**Bulk Data `$export`**:
Operasi FHIR asinkron dari Bulk Data Access IG (lesson 0004 memakai v2.0.0, STU 2) untuk mengekspor banyak resource sekaligus ke file NDJSON, di tiga level: Patient (`[base]/Patient/$export`), Group (`[base]/Group/[id]/$export`), dan system (`[base]/$export`).
Padanan Node: job ekspor di antrean (mis. BullMQ) yang hasilnya diambil lewat URL status.
_Avoid_: Bulk API, dump (judul IG juga memakai alias "Flat FHIR")

**Kick-off request**:
Request pertama yang memulai `$export`, dengan header `Prefer: respond-async`; jika diterima, server membalas `202 Accepted` + header `Content-Location` berisi URL status.
_Avoid_: Start request, trigger

**Polling (status request)**:
`GET` berulang ke URL status `Content-Location`: `202` selama export berjalan (opsional `X-Progress`, `Retry-After`), `429 Too Many Requests` bila terlalu sering, `200` + manifest bila selesai. Client mengikuti `Retry-After` atau exponential backoff.
_Avoid_: Long polling (itu teknik lain)

**Manifest (complete status)**:
Body JSON `200` di akhir polling: `transactionTime`, `request`, `requiresAccessToken`, array `output` (`{type, url, count?}` per file), array `error` (file OperationOutcome), dan opsional `deleted`.
_Avoid_: Response file, export result

**`transactionTime`**:
Instant waktu server saat query export dijalankan; export memuat semua perubahan sampai dan termasuk instant ini, sehingga nilainya dipakai sebagai `_since` pada export inkremental berikutnya.
_Avoid_: Waktu kick-off client, `Expires`

**`_type` / `_since`**:
Parameter kick-off `$export`: `_type` membatasi tipe resource (daftar dipisah koma); `_since` hanya mengembalikan resource yang berubah setelah instant itu (mis. `meta.lastUpdated` lebih baru).
_Avoid_: Filter, `_lastUpdated` (itu parameter search biasa)

**NDJSON**:
Newline delimited JSON: satu resource per baris tanpa whitespace, MIME type `application/fhir+ndjson`; di Bulk Data setiap file berisi satu tipe resource saja.
Padanan Node: JSON Lines (`.jsonl`), format log terstruktur.
_Avoid_: JSON array, nd-json stream

**Backpressure**:
Mekanisme stream Node yang menahan produsen saat konsumen lebih lambat: buffer berhenti diisi setelah mencapai `highWaterMark`, dan `write()` mengembalikan `false` sampai event `drain`.
_Avoid_: Throttling, rate limiting

**`highWaterMark`**:
Ambang buffer internal sebuah stream (byte, atau jumlah objek dalam object mode) yang memicu backpressure; ambang, bukan batas memori keras.
_Avoid_: Buffer size limit

**`pipeline`**:
Fungsi Node (`node:stream/promises`) yang merangkai stream, async generator, dan fungsi tujuan, meneruskan error dan membersihkan semua stream; versi promise-nya bisa di-`await`. Pengganti yang lebih aman untuk rantai `.pipe()`.
_Avoid_: Pipe chain

**`stream-json`**:
Library npm untuk mem-parse dokumen JSON yang lebih besar dari memori sebagai stream token, mis. `parser()` → `pick({filter: 'entry'})` → `streamArray()` untuk array `entry` Bundle raksasa. Untuk NDJSON cukup pemisahan per baris.
_Avoid_: JSONStream (library lain)

**Presisi `decimal`**:
Aturan FHIR bahwa jumlah digit sebuah `decimal` adalah bagian dari datanya (`0.010` ≠ `0.01`, `2.00` ≠ `2`) dan SHALL dipertahankan untuk presentasi. `JSON.parse` di JavaScript menghilangkannya karena semua angka menjadi float; simpan teks aslinya (mis. lewat `context.source` di reviver) sebagai string atau tipe decimal.
_Avoid_: Float FHIR, angka desimal biasa

## Keamanan dan SMART on FHIR

## Indonesia (SATUSEHAT)
