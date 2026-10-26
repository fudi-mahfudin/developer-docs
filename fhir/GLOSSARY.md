# FHIR untuk Developer JavaScript — Glossary

Kosakata bersama untuk persiapan interview fullstack (Node/React) di perusahaan health-tech yang memakai HL7 FHIR R4. Padanan dunia JavaScript ditulis bila membantu.

Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per bagian di bawah.

## Fondasi

**FHIR (Fast Healthcare Interoperability Resources)**:
Standar HL7 untuk pertukaran data kesehatan yang dibangun dari Resource modular, dipertukarkan lewat REST API dengan JSON atau XML. Di workspace ini selalu berarti R4 (4.0.1) kecuali disebut lain.
_Avoid_: HL7 FHIR API, "HL7" saja

**HL7 v2**:
Standar pesan HL7 yang lebih tua: pesan teks berdelimiter (`|`, `^`) yang terdiri dari segment, dengan variasi implementasi tinggi dan data lokal di Z-segment.
_Avoid_: HL7 (tanpa versi), "pipe format"

**Resource**:
Unit pertukaran data di FHIR yang punya identitas URL, `resourceType`, dan versi yang berubah setiap isinya berubah (mis. `Patient`, `Observation`). Padanan JS: entity dengan endpoint sendiri.
_Avoid_: dokumen, record, objek FHIR

**Datatype**:
Tipe elemen di dalam Resource, primitif (`string`, `dateTime`, `decimal`) atau kompleks (`Identifier`, `CodeableConcept`), tanpa identitas URL sendiri. Padanan JS: value object.
_Avoid_: sub-resource, nested resource

**Logical id**:
Nilai `id` sebuah Resource, bagian terakhir URL-nya (`[base]/Patient/123`); berbeda dari `identifier` (nomor bisnis seperti nomor rekam medis).
_Avoid_: primary key, MRN

**Normative**:
Status konten FHIR yang stabil dan dikunci, tunduk pada aturan kompatibilitas antarversi (tanda N). R4 adalah rilis pertama yang memuatnya.
_Avoid_: final, stable release

**Trial Use**:
Status konten FHIR yang siap produksi menurut penulisnya tetapi masih boleh berubah signifikan di versi berikutnya. Seluruh rilis R5 berstatus ini (kecuali konten yang sudah Normative di R4).
_Avoid_: beta, draft, STU (boleh, tapi pakai "Trial Use")

**FMM (FHIR Maturity Model)**:
Skala kematangan 0–5 untuk konten Trial Use; FMM 5 berarti dipakai di minimal 5 sistem produksi independen di lebih dari satu negara. Bukan jaminan stabil seperti Normative.
_Avoid_: maturity score, versi

**Profile**:
StructureDefinition berisi constraint terhadap Resource (kardinalitas, elemen dilarang, binding terminologi, must support) untuk satu konteks pemakaian; Resource menyatakan kesesuaiannya di `meta.profile`. Padanan TS: type yang lebih ketat plus validasi.
_Avoid_: schema FHIR, template, subclass

**Extension**:
Elemen tambahan berisi `url` ke definisinya (StructureDefinition) dan `value[x]` atau sub-extension, untuk data yang tidak ada di core.
_Avoid_: custom field, Z-segment

**Modifier extension**:
Extension di `modifierExtension` yang mengubah makna data sehingga aplikasi tidak boleh diam-diam mengabaikannya bila tidak mengenalnya.
_Avoid_: required extension

**Must support**:
Tanda di Profile bahwa implementasi SHALL mendukung elemen itu "in some meaningful way".
_Avoid_: required, wajib (kardinalitas min 1 adalah hal lain)

**Implementation Guide (IG)**:
Kumpulan adaptasi (Profile, Extension, terminologi, contoh) yang diterbitkan sebagai satu unit untuk satu negara, organisasi, atau use case, mis. US Core di atas R4. Padanan JS: package npm berisi type dan schema.
_Avoid_: spec lokal, guideline

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

**SMART App Launch (SMART on FHIR)**:
Profile OAuth 2.0 (plus OpenID Connect) dari HL7 untuk app yang mengakses data FHIR, termasuk launch dari dalam EHR dan launch context. Workspace ini memakai IG v2.2.0. Padanan JS: "Login with Google" + PKCE di SPA, ditambah scopes per resource FHIR.
_Avoid_: SMART auth, FHIR OAuth

**EHR launch**:
Alur SMART saat EHR membuka launch URL app dengan parameter `iss` (FHIR base URL) dan `launch` (handle opaque) yang dikirim balik app saat authorize.
_Avoid_: embedded launch, launch dari portal

**Standalone launch**:
Alur SMART saat user membuka app dari luar EHR; app meminta konteks lewat scope seperti `launch/patient`.
_Avoid_: direct launch

**Launch context**:
Data konteks yang datang bersama access token di token response, misalnya `"patient": "123"`, `encounter`, `fhirContext`, `need_patient_banner`.
_Avoid_: session context

**SMART discovery (`.well-known/smart-configuration`)**:
Dokumen JSON di FHIR base URL + `/.well-known/smart-configuration` yang berisi `authorization_endpoint`, `token_endpoint`, `capabilities`, dan `code_challenge_methods_supported`.
_Avoid_: metadata OAuth (CapabilityStatement untuk ini sudah deprecated)

**PKCE (Proof Key for Code Exchange)**:
Ekstensi OAuth (RFC 7636): app mengirim `code_challenge` = BASE64URL(SHA256(`code_verifier`)) saat authorize lalu `code_verifier` saat menukar code, sehingga code yang dicegat tidak bisa ditukar. Wajib di SMART, metode `S256` saja.
_Avoid_: PKCE plain

**Public client / confidential client**:
Public client tidak bisa menyimpan secret (SPA, mobile app) dan tidak melakukan client authentication; confidential client bisa (backend server) dan melakukan autentikasi dengan secret atau JWT ber-tanda-tangan.
_Avoid_: frontend client / backend client

**SMART scope**:
String izin berbentuk `(patient|user|system)/(ResourceType|*).(cruds)`, mis. `patient/Observation.rs`. `patient/` = pasien dalam konteks, `user/` = yang bisa diakses user, `system/` = client tanpa user. Scope yang diberikan bisa berbeda dari yang diminta.
_Avoid_: permission, role

**Scopes v1 vs v2**:
v1 memakai `.read`/`.write`/`.*`; v2 memakai huruf `c r u d s` dan filter search parameter. Pemetaan: `.read` ⇒ `.rs`, `.write` ⇒ `.cud`, `.*` ⇒ `.cruds`.
_Avoid_: scope lama / scope baru

**`openid fhirUser`**:
Scope OpenID Connect yang menghasilkan `id_token` dengan klaim `fhirUser`, yaitu URL resource FHIR user yang login (Patient, Practitioner, PractitionerRole, RelatedPerson, atau Person).
_Avoid_: profile scope

**`offline_access` / `online_access`**:
Scope untuk meminta refresh token: `offline_access` tetap bisa dipakai walau user tidak online, `online_access` hanya selama user masih online.
_Avoid_: remember me

**Backend Services**:
Profile SMART untuk client tanpa user: `grant_type=client_credentials` dengan `client_assertion` berupa JWT sekali pakai yang ditandatangani private key (RS384/ES384), scope `system/`, token ≤ 300 detik tanpa refresh token. Dipakai untuk Bulk Data `$export`.
_Avoid_: machine-to-machine OAuth, service account (hanya sebagai analogi)

**`fhirclient`**:
Library JS resmi komunitas SMART (npm `fhirclient`): `authorize()` di launch page memulai alur, `ready()` di halaman `redirect_uri` mengembalikan `Client` yang sudah memegang token dan konteks pasien.
_Avoid_: fhir.js, client-js (nama repo)

**AuditEvent**:
Resource FHIR untuk mencatat event keamanan/privasi (siapa mengakses data apa, kapan), dipakai untuk audit reporting dan deteksi penyalahgunaan.
_Avoid_: access log biasa

**PHI (Protected Health Information)**:
Informasi kesehatan yang bisa dikaitkan ke individu; termasuk query string search FHIR (mis. `?name=…&birthdate=…`), jadi tidak boleh masuk log atau analytics yang tidak terlindungi.
_Avoid_: data medis (terlalu umum)

## Indonesia (SATUSEHAT)
