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

**Logical id**:
Elemen `id` sebuah resource: string opaque (maks. 64 karakter) yang ditetapkan server penyimpan, unik per tipe resource di server itu, tidak pernah berubah, dan membentuk URL-nya (`[base]/Patient/123`). Bisa berbeda di server lain (lesson 0004–0007).
Padanan JS: surrogate primary key.
_Avoid_: ID pasien, resource ID (ambigu dengan Identifier)

**Identifier (business identifier)**:
Datatype untuk identitas dunia nyata (nomor rekam medis, NIK): pasangan `system` (URI namespace yang menjamin keunikan) + `value`, di elemen `identifier` (biasanya 0..*). Dua resource dengan Identifier sama menggambarkan entitas yang sama.
Padanan JS: natural key.
_Avoid_: id, MRN saja (MRN hanya salah satu jenis Identifier)

**Reference**:
Datatype untuk menunjuk resource lain: `reference` (literal reference: URL relatif `Patient/123`, absolut, atau `#id` ke contained), `identifier` (logical reference), dan/atau `display` (teks untuk UI).
Padanan JS: foreign key yang ditulis sebagai path REST.
_Avoid_: link, relasi

**Logical reference**:
Reference yang hanya berisi `Reference.identifier` karena URL target tidak diketahui; chaining dan `_include` tidak bisa dipakai padanya.
_Avoid_: reference by NIK

**Coding**:
Datatype satu kode dari satu code system: `system` + `code` (+ `version`, `display`, `userSelected`). Kode hanya bermakna bersama `system`-nya.
_Avoid_: kode (tanpa system)

**CodeableConcept**:
Datatype konsep berkode: daftar Coding (0..*) plus `text`. Beberapa Coding adalah translasi konsep yang sama ke code system berbeda; urutannya tidak bermakna.
_Avoid_: enum, lookup value

**Code system**:
Sistem yang mendefinisikan kode dan maknanya, diidentifikasi dengan URI di `Coding.system`: LOINC (`http://loinc.org`), SNOMED CT (`http://snomed.info/sct`), ICD-10 (`http://hl7.org/fhir/sid/icd-10`), UCUM (`http://unitsofmeasure.org`), atau kode lokal.
_Avoid_: vocabulary, kamus kode

**LOINC**:
Code system untuk nama observasi dan tes lab; pilihan utama untuk `Observation.code` (mis. `15074-8` glukosa darah).

**SNOMED CT**:
Terminologi klinis luas untuk temuan, prosedur, alasan kunjungan, dan nilai berkode (mis. `valueCodeableConcept` "Negative").

**ICD-10**:
Klasifikasi penyakit dari WHO untuk statistik, pelaporan, dan klaim; kodenya ditulis bertitik (`J21.8`). ICD-9 dan ICD-10 adalah code system terpisah.

**Binding strength**:
Seberapa ketat elemen berkode terikat ke ValueSet: required, extensible, preferred, atau example.

**Cardinality**:
Batas bawah dan atas kemunculan elemen (`0..1`, `1..1`, `0..*`, `1..*`). Batas atas > 1 berarti selalu array di JSON, walau isinya satu.
Padanan TS: `x?: T`, `x: T`, `x?: T[]`, `x: [T, ...T[]]`.

**Choice type (`[x]`)**:
Elemen yang tipenya dipilih dari daftar, ditulis `value[x]`; di JSON `[x]` diganti nama tipe (`valueQuantity`, `effectiveDateTime`). Maks. kardinalitas 1, hanya satu varian yang boleh ada.
Padanan TS: discriminated union dengan nama property sebagai diskriminator.
_Avoid_: polymorphic field, field `value` generik

**Meta**:
Elemen `meta` berisi metadata teknis yang dikelola server: `versionId` (berubah setiap konten berubah), `lastUpdated`, `profile` (klaim mematuhi StructureDefinition), `security`, `tag`.

**Contained resource**:
Resource tanpa identitas sendiri yang disisipkan di `contained` resource lain dan dirujuk dengan `#id`; hanya untuk data yang tidak bisa diidentifikasi, tidak bersarang, tidak bisa di-resolve dari luar induknya.
Padanan JS: subdokumen embedded tanpa `_id` sendiri.
_Avoid_: nested resource, inline resource

**Extension**:
Elemen tambahan di luar definisi inti: `url` wajib (canonical URL StructureDefinition yang mendefinisikannya) plus `value[x]` atau sub-extension. Extension pada nilai primitif ditaruh di property `_nama` (mis. `_birthDate`).
_Avoid_: custom field, property tambahan

**Modifier extension**:
Extension di `modifierExtension` untuk data yang mengubah makna resource sehingga tidak aman diabaikan; aplikasi yang tidak mengenalnya tidak boleh memproses data seolah-olah extension itu tidak ada.

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

**Bulk Data `$export`**:
Operasi FHIR asinkron dari Bulk Data Access IG (lesson 0013–0016 memakai v2.0.0, STU 2) untuk mengekspor banyak resource sekaligus ke file NDJSON, di tiga level: Patient (`[base]/Patient/$export`), Group (`[base]/Group/[id]/$export`), dan system (`[base]/$export`).
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

Istilah dari lesson 0022–0023. Fakta SATUSEHAT dari dokumentasi resmi Kemenkes, diakses 2026-10-26; dokumentasinya sering direvisi.

**SATUSEHAT**:
Ekosistem pertukaran data kesehatan nasional (HIE, *Health Information Exchange*) dari Kemenkes yang menghubungkan fasyankes, regulator, penjamin, dan penyedia layanan digital, dengan HL7 FHIR (R4, path `fhir-r4`) lewat HTTPS REST API. Fasyankes tetap memakai SIMRS/RME sendiri dan mengirim data ke SATUSEHAT.
_Avoid_: SIMRS nasional, "server FHIR Kemenkes" saja

**SATUSEHAT Platform (SSP)**:
Portal untuk partner interoperabilitas: registrasi, melihat Organization ID / Client ID / Client Secret per environment, dan monitoring transaksi FHIR.
_Avoid_: dashboard SATUSEHAT

**Sandbox / Production (SATUSEHAT)**:
Dua environment. Sandbox (Staging, `api-satusehat-stg.dto.kemkes.go.id`) untuk uji coba dengan data pasien dummy, bisa dipakai sebelum terverifikasi; Production (`api-satusehat.kemkes.go.id`) setelah fasyankes terdaftar.
_Avoid_: dev, test server

**Access token SATUSEHAT**:
Token Bearer dari `POST {oauth-base}/accesstoken?grant_type=client_credentials` dengan `client_id` + `client_secret` (form-urlencoded). Server-to-server, jadi hanya dipanggil dari backend; cache sampai mendekati `expires_in` karena ada rate limit setelah gagal autentikasi. Beda dengan SMART Backend Services: secret, bukan JWT assertion.
_Avoid_: login SATUSEHAT, API key

**Fasyankes**:
Fasilitas pelayanan kesehatan (rumah sakit, puskesmas, klinik, dll.), pengirim utama data ke SATUSEHAT; didaftarkan sebagai Organization dengan struktur Location di bawahnya.
_Avoid_: faskes (boleh, tapi dokumentasi memakai "fasyankes")

**NIK**:
Nomor Induk Kependudukan; di FHIR dipakai sebagai business identifier Patient dengan `system` `https://fhir.kemkes.go.id/id/nik`. Bukan logical id.
_Avoid_: ID pasien

**Nomor IHS (`{patient-ihs-number}`, `{practitioner-ihs-number}`)**:
ID yang diberikan SATUSEHAT untuk Patient (dari Master Patient Index, dibuat setelah verifikasi data NIK ke DUKCAPIL) atau tenaga kesehatan. Dipakai sebagai logical id di reference, mis. `"Patient/{patient-ihs-number}"`, dan boleh disimpan di sistem internal.
Padanan JS: id dari server eksternal yang disimpan di kolom mapping.
_Avoid_: nomor rekam medis, NIK

**Master Patient Index (MPI)**:
Master data pasien nasional Kemenkes (demografi, identitas resmi). Alur pasien ber-NIK: cari berdasarkan nomor IHS atau NIK; bila tidak ada, POST Patient yang diverifikasi ke DUKCAPIL. Pasien tanpa NIK dan bayi punya alur sendiri.
_Avoid_: database pasien SATUSEHAT

**Master Sarana Index (MSI)**:
Master data sarana (fasyankes); asal `{organization-ihs-number}` yang dipakai, mis., di `system` identifier Encounter `http://sys-ids.kemkes.go.id/encounter/{organization-ihs-number}`.
_Avoid_: daftar rumah sakit

**KFA (Kamus Farmasi dan Alat Kesehatan)**:
Terminologi nasional Kemenkes untuk obat dan alat kesehatan; dipakai di `Medication.code` dengan `system` `http://sys-ids.kemkes.go.id/kfa`.
_Avoid_: kode obat lokal, katalog apotek

**Panduan Interoperabilitas (modul pelayanan / use case)**:
Panduan SATUSEHAT per alur layanan (rawat jalan, IGD, rawat inap, kefarmasian) dan per use case (ANC, imunisasi, tuberkulosis, dll.) yang menentukan resource, elemen wajib, dan terminologi yang dikirim.
_Avoid_: IG (IG-nya adalah SATUSEHAT FHIR R4 Implementation Guide di Simplifier)

**Validasi (resource)**:
Pemeriksaan resource terhadap structure, cardinality, value domain, binding kode, invariant, profile, dan (di luar spesifikasi) business rule. Di SATUSEHAT, request yang gagal dijawab 4xx berisi OperationOutcome (`issue.code` mis. `duplicate`, `format`, `value`).
_Avoid_: schema check (hanya sebagian kecil validasi)

**`$validate`**:
Operation FHIR `[base]/[Resource]/$validate` (opsional `profile`, `mode`) yang mengembalikan OperationOutcome; 200 OK baik resource valid maupun tidak, tidak menyimpan apa pun. Ketersediaannya di SATUSEHAT belum terverifikasi.
_Avoid_: dry-run create

**Mapping data legacy**:
Mengubah data sistem lama ke FHIR di dua lapis: struktur (tabel/kolom → resource/elemen) dan kode (kode lokal → terminologi standar: ICD-10 diagnosis, ICD-9 CM prosedur, LOINC lab, SNOMED CT istilah klinis, KFA obat), plus normalisasi format (mis. waktu ke UTC +00).
_Avoid_: konversi, migrasi (migrasi memindahkan sistem, mapping menerjemahkan data)

**ConceptMap**:
Resource FHIR yang menyatakan mapping kode dari code system/value set sumber ke target: satu arah, terikat konteks bisnis, dan setiap target punya `equivalence`. Dipakai lewat `$translate` di terminology server. Untuk transformasi struktur instance dipakai StructureMap.
Padanan JS: tabel lookup `Map<kodeLokal, Coding>` yang diberi metadata dan bisa dipertukarkan.
_Avoid_: mapping table (tanpa arah/konteks), StructureMap

**Equivalence (ConceptMap)**:
Tingkat kecocokan satu mapping di R4: `equivalent`, `equal`, `wider`, `subsumes`, `narrower`, `specializes`, `inexact`, `relatedto`, `unmatched`, `disjoint`. Untuk `narrower` dan `inexact`, alasannya SHALL ditulis di `comment`.
_Avoid_: confidence score

## Pelindungan data pribadi (PDP)

Istilah dari lesson 0024–0026. Pasal dibaca dari PDF resmi peraturan.bpk.go.id, diakses 2026-10-27.

**UU PDP (UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi)**:
Undang-undang pelindungan data pribadi Indonesia; masa penyesuaian 2 tahun sejak diundangkan 17 Oktober 2022 (Pasal 74). Nama resminya "Pelindungan", bukan "Perlindungan".
_Avoid_: GDPR Indonesia, UU Perlindungan Data

**Data pribadi spesifik**:
Kategori data pribadi yang dampaknya lebih besar bila bocor; meliputi data dan informasi kesehatan, biometrik, genetika, catatan kejahatan, data anak, dan keuangan pribadi (UU PDP Pasal 4 ayat (2)). Lawannya: data pribadi umum (nama lengkap, jenis kelamin, agama, …).
_Avoid_: data sensitif (tidak dipakai UU), PHI (istilah AS)

**Pengendali / Prosesor Data Pribadi**:
Pengendali menentukan tujuan dan mengendalikan pemrosesan (mis. rumah sakit); prosesor memproses atas nama pengendali (mis. vendor SIMRS). Kewajiban keamanan dan kerahasiaan berlaku juga untuk prosesor (Pasal 52).
_Avoid_: data owner, data processor (boleh sebagai padanan, tapi pakai istilah UU)

**Kegagalan Pelindungan Data Pribadi**:
Istilah UU PDP untuk insiden kebocoran; wajib diberitahukan tertulis paling lambat 3×24 jam kepada subjek data dan lembaga (Pasal 46).
_Avoid_: data breach (boleh sebagai padanan)

**Redaksi (redaction)**:
Membuang atau menyensor data dari log/telemetri sebelum disimpan. Di track ini: allowlist di sumber (hanya field yang diizinkan yang keluar), bukan denylist.
_Avoid_: masking (masking = mengganti sebagian nilai)

**Pseudonimisasi (HMAC)**:
Mengganti ID dengan nilai turunan yang konsisten supaya log bisa dikorelasikan tanpa ID asli. Pakai HMAC dengan secret, bukan hash polos (bisa dibalik kalau ruang nilainya kecil). Hasilnya tetap diperlakukan sebagai data pribadi (tafsiran; UU PDP tidak memakai istilah pseudonim).
_Avoid_: anonimisasi, enkripsi

**Log operasional vs audit trail**:
Log operasional menjawab "kenapa lambat/error", tanpa identitas. Audit trail (mis. `AuditEvent`) menjawab "siapa mengakses pasien mana", berisi identitas, append-only, akses terbatas.
_Avoid_: menyebut keduanya "log" tanpa pembeda
