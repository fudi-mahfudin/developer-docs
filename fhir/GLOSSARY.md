# FHIR untuk Developer JavaScript — Glossary

Kosakata bersama untuk persiapan interview fullstack (Node/React) di perusahaan health-tech yang memakai HL7 FHIR R4. Padanan dunia JavaScript ditulis bila membantu.

Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per bagian di bawah.

## Fondasi

## Resource dan datatype

## REST API

- **Interaction**: operasi REST dasar FHIR pada resource: read, vread, update, patch, delete, create, search, history, capabilities, batch/transaction. Padanan JS: route handler CRUD di Express.
- **vread**: membaca satu versi tertentu, `GET [base]/[type]/[id]/_history/[vid]`. Beda dengan **history** (`.../_history` tanpa vid) yang mengembalikan Bundle `history` berisi semua versi.
- **Search parameter**: nama filter yang didefinisikan per resource (mis. Observation `code`, `patient`, `date`), masing-masing bertipe: **string** (default awalan, case-insensitive), **token** (`[system]|[code]`, untuk Coding/Identifier), **reference** (menunjuk resource lain), **date** (memakai prefix), dan lain-lain.
- **Modifier**: akhiran `:` pada nama parameter yang mengubah cara cocok: `:exact`, `:contains` (string), `:not`, `:text` (token), `:missing=true|false` (ada/tidaknya nilai).
- **Prefix**: awalan nilai date/number/quantity: `eq` (default), `ne`, `gt`, `lt`, `ge`, `le`, `sa`, `eb`, `ap`. Parameter diulang = AND, nilai dipisah koma = OR.
- **Chaining**: filter lewat referensi, mis. `DiagnosticReport?subject:Patient.name=peter`. Memfilter hasil, tidak menambah resource lain. _Avoid_: menyamakan dengan `_include`.
- **`_include` / `_revinclude`**: menyertakan resource lain di Bundle hasil search. `_include` = yang dirujuk hasil (Observation → Patient); `_revinclude` = yang merujuk ke hasil (Patient ← Observation). Padanan JS: `include` di Prisma, tapi hasilnya entry terpisah, tidak bersarang.
- **Paging**: hasil search dibagi halaman; ukuran diminta dengan `_count`, halaman berikutnya diambil dari `Bundle.link` relation `next` yang opaque (jangan menyusun URL sendiri).
- **Bundle**: resource wadah berisi `entry[]`. `type` menentukan perannya: `searchset` (hasil search; `total`, `entry.search.mode` = `match`/`include`/`outcome`), `transaction`, `batch`, `history`, `collection`, `document`, `message`.
- **Transaction vs batch**: keduanya `POST [base]` berisi Bundle dengan `entry.request` (method + url). **Transaction** atomik (semua sukses atau semua gagal) dan boleh saling merujuk lewat `fullUrl` `urn:uuid:`; **batch** sekumpulan aksi independen, hasil per entry, tanpa ketergantungan antar-entry. Padanan JS: `prisma.$transaction` vs `Promise.allSettled`.
- **Conditional create**: `POST` dengan `If-None-Exist: [search parameters]` (atau `entry.request.ifNoneExist`): 0 cocok → create, 1 cocok → diabaikan (200), >1 → 412. Dipakai untuk import idempoten. **Conditional update**: `PUT [base]/[type]?[search parameters]`.
- **ETag / `If-Match`**: `meta.versionId` dikirim sebagai weak ETag (`W/"3"`); update dengan `If-Match` ditolak `412 Precondition Failed` bila versi sudah berubah. Mencegah lost update (optimistic locking). _Avoid_: mengunci resource selama form dibuka.
- **OperationOutcome**: resource berisi pesan error/warning/information dari server, dikirim sebagai body respons gagal. `issue[]` berisi `severity`, `code` (IssueType), `diagnostics`, `expression` (lokasi elemen). 400 = gagal parse/validasi dasar, 422 = melanggar profil atau aturan bisnis.
- **CapabilityStatement**: resource yang mendeskripsikan kemampuan server (versi FHIR, format, keamanan, resource, interaksi, search parameter); diambil dengan `GET [base]/metadata`. Padanan JS: dokumen OpenAPI, tapi baku.

## Bulk Data dan JSON skala besar

## Keamanan dan SMART on FHIR

## Indonesia (SATUSEHAT)
