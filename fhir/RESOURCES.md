# FHIR (R4) Interview Resources

## Knowledge

- [HL7 FHIR R4 (4.0.1) specification](https://hl7.org/fhir/R4/)
  Spesifikasi resmi versi R4. Use for: semua klaim tentang Resource, datatype, REST API, search, Bundle. Kutip halaman spesifik, bukan halaman depan.
- [SMART App Launch IG v2.2.0 (STU 2.2)](https://hl7.org/fhir/smart-app-launch/)
  Spesifikasi resmi SMART on FHIR, versi terbit saat ini, berbasis R4. Use for: semua klaim SMART. Halaman inti: [App Launch](https://hl7.org/fhir/smart-app-launch/app-launch.html) (alur EHR/standalone, PKCE, state, aud, token response, keamanan app), [Scopes and Launch Context](https://hl7.org/fhir/smart-app-launch/scopes-and-launch-context.html) (patient/user/system, v1 vs v2, openid fhirUser, offline_access, launch context), [Conformance](https://hl7.org/fhir/smart-app-launch/conformance.html) (`.well-known/smart-configuration`, capabilities), [Backend Services](https://hl7.org/fhir/smart-app-launch/backend-services.html) + [Client Authentication: Asymmetric](https://hl7.org/fhir/smart-app-launch/client-confidential-asymmetric.html) (client credentials + JWT), [Best Practices](https://hl7.org/fhir/smart-app-launch/best-practices.html) (public vs confidential, refresh token).
- [RFC 7636: Proof Key for Code Exchange (PKCE)](https://www.rfc-editor.org/rfc/rfc7636)
  Standar IETF PKCE. Use for: masalah authorization code interception, `code_verifier` 43–128 karakter, rumus `S256`.
- [fhirclient (SMART JS client library) docs](https://docs.smarthealthit.org/client-js/)
  Dokumentasi resmi library `fhirclient` (npm, v3.x). Use for: `authorize()`/`ready()` di [SMART API](https://docs.smarthealthit.org/client-js/api.html), `client.patient.request`, `flat`, `pageLimit`, refresh otomatis di [Client API](https://docs.smarthealthit.org/client-js/client.html). Penyimpanan state di browser (`sessionStorage`) dilihat dari [source BrowserStorage.ts](https://github.com/smart-on-fhir/client-js/blob/master/src/storage/BrowserStorage.ts).
- [FHIR R4 Security](https://hl7.org/fhir/R4/security.html) dan [AuditEvent](https://hl7.org/fhir/R4/auditevent.html)
  Use for: rekomendasi OAuth/SMART di FHIR inti, risiko log PHI, audit logging dengan `AuditEvent`.
- [FHIR R4: FHIR Overview – Developers](https://hl7.org/fhir/R4/overview-dev.html)
  Pengantar resmi untuk developer: framework, contoh resource, URL dan identitas, interaksi, variabilitas. Use for: bacaan utama lesson 0001.
- [FHIR R4: Comparison with HL7 v2](https://hl7.org/fhir/R4/comparison-v2.html)
  Perbandingan resmi v2 vs FHIR (segment, variasi implementasi, Z-segment vs extension, snapshot). Use for: pertanyaan "apa beda FHIR dan HL7 v2".
- [FHIR R4: Managing Multiple FHIR Versions](https://hl7.org/fhir/R4/versions.html) dan [R4 Version History](https://hl7.org/fhir/R4/history.html)
  Penomoran versi, arti Normative dan Trial Use, FMM 0–5, kompatibilitas antarversi; R4 = "First Normative content". Use for: R4 vs R5, label maturity.
- [FHIR R5 Version History](https://hl7.org/fhir/R5/history.html)
  Tanggal rilis R5 (26 Mar 2023), status trial use, daftar perubahan utama. Use for: "kenapa belum R5".
- [FHIR R4: Resource](https://hl7.org/fhir/R4/resource.html), [Resource Index](https://hl7.org/fhir/R4/resourcelist.html), [Data Types](https://hl7.org/fhir/R4/datatypes.html)
  Definisi Resource (identitas URL, tipe, versi, `meta`), lima level kategori resource dengan tanda N/FMM, dan datatype primitif/kompleks. Use for: definisi dan kategori Resource, resource vs datatype.
- [FHIR R4: Profiling](https://hl7.org/fhir/R4/profiling.html) dan [Extensibility](https://hl7.org/fhir/R4/extensibility.html)
  Kenapa spesifikasi dasar perlu diadaptasi, apa yang bisa dilakukan profile, definisi IG, struktur extension (`url` + `value[x]`), `modifierExtension`. Use for: Profile/Extension/IG.
- [FHIR R4: Conformance Rules](https://hl7.org/fhir/R4/conformance-rules.html)
  Arti SHALL/SHOULD/MAY dan must support. Use for: membaca profile dan IG.
- [US Core Implementation Guide](https://hl7.org/fhir/us/core/)
  Contoh IG nasional terbesar, dibangun di atas R4 (mis. US Core Patient mewajibkan `identifier` dan `name`). Use for: contoh konkret profile dan IG.
- [HAPI FHIR](https://hapifhir.io/) dan [Medplum Docs](https://www.medplum.com/docs)
  Server FHIR open source: HAPI (Java, Apache 2.0), Medplum (headless EHR, TypeScript SDK, komponen React). Use for: mengenali nama server di interview; tidak dijalankan di track ini.
- [Bulk Data Access IG v2.0.0 (STU 2): Export](https://hl7.org/fhir/uv/bulkdata/STU2/export.html)
  Spesifikasi resmi `$export` berbasis R4: level Patient/Group/system, kick-off, polling (202, `Retry-After`, 429), manifest, parameter `_type`/`_since`. Versi 3.0.0 sudah menggantikannya; lesson 0004 memakai STU 2. Use for: semua klaim Bulk Data.
- [FHIR R4: ND-JSON](https://hl7.org/fhir/R4/nd-json.html) dan [FHIR R4: JSON (bagian primitive, catatan JavaScript)](https://hl7.org/fhir/R4/json.html)
  Format NDJSON (`application/fhir+ndjson`, satu tipe per dokumen) dan peringatan resmi bahwa `JSON.parse` di JavaScript menghilangkan presisi `decimal`. Use for: NDJSON, decimal di JS.
- [FHIR R4: Data Types, decimal](https://hl7.org/fhir/R4/datatypes.html#decimal)
  Aturan presisi `decimal` (`0.010` ≠ `0.01`, SHALL dipertahankan untuk presentasi). Use for: jebakan angka.
- [Node.js API: Stream](https://nodejs.org/api/stream.html) dan [Node.js API: Readline](https://nodejs.org/api/readline.html)
  Dokumentasi resmi: buffering dan `highWaterMark`, `write()`/`drain`, `pipeline` (`node:stream/promises`), async iterator, contoh "Read file stream line-by-line". Use for: streaming dan backpressure.
- [Node.js Learn: Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams) dan [Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
  Panduan resmi Node: definisi backpressure; bagian "JSON DOS" tentang biaya `JSON.parse` di event loop. Use for: menjelaskan kenapa tidak parse file besar sekaligus.
- [stream-json README (GitHub uhop/stream-json)](https://github.com/uhop/stream-json)
  Library parsing JSON besar sebagai stream (`parser`, `pick`, `streamArray`, dibangun di atas `stream-chain`). Use for: JSON besar yang bukan NDJSON.
- [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
  Reviver dengan `context.source` (teks asli nilai primitif) dan peringatan kehilangan presisi angka. Use for: mempertahankan `decimal`.
- [HL7 FHIR R4: Data Types](https://hl7.org/fhir/R4/datatypes.html)
  Definisi resmi Identifier, Coding, CodeableConcept (termasuk "Additional Codes"), Quantity (UCUM), HumanName. Use for: lesson 0002, cara membaca dan menampilkan nilai berkode.
- [HL7 FHIR R4: Resource](https://hl7.org/fhir/R4/resource.html) dan [DomainResource](https://hl7.org/fhir/R4/domainresource.html)
  Logical id vs business identifier ("Consistent Resource Identification"), `meta` (versionId, lastUpdated, profile), `text`/`contained`/`extension`. Use for: lesson 0002, identitas resource.
- [HL7 FHIR R4: Resource References](https://hl7.org/fhir/R4/references.html)
  Literal (relatif/absolut/versi), logical (`Reference.identifier`), `display`, dan contained resources dengan contoh JSON resmi. Use for: lesson 0002, relasi antar resource.
- [HL7 FHIR R4: Using Codes in Resources](https://hl7.org/fhir/R4/terminologies.html), [LOINC](https://hl7.org/fhir/R4/loinc.html), [SNOMED CT](https://hl7.org/fhir/R4/snomedct.html), [ICD](https://hl7.org/fhir/R4/icd.html)
  Pasangan system + code, binding strength, URI resmi setiap code system. Use for: lesson 0002 dan mapping terminologi di 0006.
- [HL7 FHIR R4: Extensibility](https://hl7.org/fhir/R4/extensibility.html)
  Struktur Extension (url + value[x]), aturan modifierExtension. Use for: lesson 0002, menjawab "data kami tidak ada di FHIR".
- [HL7 FHIR R4: Resource Formats](https://hl7.org/fhir/R4/formats.html) dan [JSON Representation](https://hl7.org/fhir/R4/json.html)
  Cara membaca tabel definisi (cardinality, flag ?! dan Σ, choice type [x]) dan aturan JSON (array, tanpa null, `_primitive`, presisi decimal). Use for: lesson 0002 dan 0004.
- [HL7 FHIR R4: Patient](https://hl7.org/fhir/R4/patient.html), [Encounter](https://hl7.org/fhir/R4/encounter.html), [Observation](https://hl7.org/fhir/R4/observation.html), beserta contoh resminya ([Patient](https://hl7.org/fhir/R4/patient-example.html), [Encounter f001](https://hl7.org/fhir/R4/encounter-example-f001-heart.html), [Observation berat badan](https://hl7.org/fhir/R4/observation-example.html), [Observation glukosa f001](https://hl7.org/fhir/R4/observation-example-f001-glucose.html))
  Definisi dan JSON resmi tiga resource inti. Use for: lesson 0002, latihan membaca JSON.
- [WHO: International Classification of Diseases](https://www.who.int/standards/classifications/classification-of-diseases)
  Halaman resmi WHO tentang tujuan ICD (statistik morbiditas/mortalitas, pembayaran). Use for: menjelaskan peran ICD-10 dibanding SNOMED CT.
- [FHIR R4 RESTful API (http.html)](https://hl7.org/fhir/R4/http.html)
  Definisi resmi setiap interaction, status HTTP, ETag/`If-Match`, conditional create/update, transaction vs batch, paging. Use for: lesson 0003, semua klaim REST.
- [FHIR R4 Search (search.html)](https://hl7.org/fhir/R4/search.html)
  Tipe search parameter, modifier, prefix, chaining, `_include`/`_revinclude`, `_count`, `entry.search.mode`. Use for: menyusun dan menjelaskan query search.
- [FHIR R4 Bundle](https://hl7.org/fhir/R4/bundle.html), [Bundle detailed definitions](https://hl7.org/fhir/R4/bundle-definitions.html), dan [CodeSystem BundleType](https://hl7.org/fhir/R4/codesystem-bundle-type.html)
  Elemen Bundle (`total`, `link`, `entry.fullUrl`, `entry.request`, `entry.search.mode`) dan definisi setiap `Bundle.type`. Use for: searchset, transaction, batch.
- [FHIR R4 OperationOutcome](https://hl7.org/fhir/R4/operationoutcome.html) dan [ValueSet IssueType](https://hl7.org/fhir/R4/valueset-issue-type.html)
  Struktur error FHIR (`issue.severity`, `code`, `diagnostics`, `expression`) dan daftar kode issue. Use for: error handling.
- [FHIR R4 CapabilityStatement](https://hl7.org/fhir/R4/capabilitystatement.html)
  Isi dokumen kemampuan server yang dikembalikan `GET [base]/metadata`. Use for: discovery sebelum integrasi.

- [UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDF, BPK)](https://peraturan.bpk.go.id/Download/224884/UU%20Nomor%2027%20Tahun%202022.pdf)
  Teks resmi beserta Penjelasan (hasil pindaian; beberapa kata hilang di lapisan OCR). Use for: data spesifik (Pasal 4), pengendali/prosesor (Pasal 1, 51–52), keamanan (35–39), perekaman pemrosesan (31), notifikasi 3×24 jam (46), sanksi (57, 67–70). Riset lengkap: `.scratch/materi-fhir/research-pdp.md`.
- [UU No. 17 Tahun 2023 tentang Kesehatan (PDF, BPK)](https://peraturan.bpk.go.id/Download/314883/UU%20Nomor%2017%20Tahun%202023.pdf) dan [Permenkes No. 24 Tahun 2022 tentang Rekam Medis (PDF, BPK)](https://peraturan.bpk.go.id/Download/301563/Permenkes%20Nomor%2024%20Tahun%202022.pdf)
  Use for: hak kerahasiaan dan kewajiban Sistem Informasi Kesehatan (UU 17/2023 Pasal 4, 347, 351); kerahasiaan rekam medis walau pasien meninggal (Permenkes Pasal 32), retensi 25 tahun (Pasal 39), wajib terhubung ke platform Kemenkes (Pasal 21).
- [FHIR R4 Security and Privacy Module](https://hl7.org/fhir/R4/secpriv-module.html) dan [Security Labels](https://hl7.org/fhir/R4/security-labels.html)
  De-identification ("a process, not an algorithm"), direct/indirect identifier per elemen, kode kerahasiaan `meta.security`. Use for: field mana yang mengidentifikasi.
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
  Daftar "Data to exclude" dari log (token, secret, data kesehatan, identifier pemerintah). Use for: argumen umum apa yang tidak di-log.
- [OpenTelemetry: Handling sensitive data](https://opentelemetry.io/docs/security/handling-sensitive-data/) dan [semantic conventions `url.*`](https://opentelemetry.io/docs/specs/semconv/registry/attributes/url/)
  Minimisasi, processor Collector (attribute/filter/redaction/transform), peringatan hash bisa dibalik; redaksi default `url.query` hanya kunci tanda tangan. Use for: trace dan telemetri.
- [Sentry JS: options](https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/) dan [scrubbing sensitive data](https://docs.sentry.io/platforms/javascript/guides/node/data-management/sensitive-data/)
  `dataCollection` (sejak 10.57.0, menggantikan `sendDefaultPii`), denylist bawaan, `beforeSend*`. Use for: error tracking.
- [pino: redaction](https://github.com/pinojs/pino/blob/main/docs/redaction.md) dan [Prometheus: metric and label naming](https://prometheus.io/docs/practices/naming/#labels)
  `redact` berbasis path kunci (case-sensitive); larangan label berkardinalitas tinggi seperti user ID. Use for: log aplikasi Node dan metrik.

- [FHIR R4 Home](https://hl7.org/fhir/R4/index.html), [Summary](https://hl7.org/fhir/R4/summary.html), dan [Overview](https://hl7.org/fhir/R4/overview.html)
  Halaman depan R4 (versi 4.0.1, koreksi teknis Okt 2019), ringkasan "next generation standards framework", dan overview umum. Use for: lesson 0001 (definisi FHIR, Resource).
- [FHIR R4 ImplementationGuide](https://hl7.org/fhir/R4/implementationguide.html), [extension patient-birthPlace](https://hl7.org/fhir/R4/extension-patient-birthplace.html), dan [US Core Patient](https://hl7.org/fhir/us/core/StructureDefinition-us-core-patient.html)
  Resource ImplementationGuide (Trial Use, FMM 1), contoh extension resmi (tempat lahir, tipe Address), dan contoh profile yang mempersempit `Patient.name` menjadi 1..*. Use for: lesson 0001 (Profile/Extension/IG).
- [FHIR R4 Observation example (JSON)](https://hl7.org/fhir/R4/observation-example.json.html) dan [Vital Signs profile](https://hl7.org/fhir/R4/observation-vitalsigns.html)
  Contoh resmi Observation berat badan (LOINC 29463-7) dan profil vital signs (mis. LOINC 8310-5 body temperature). Use for: contoh query di lesson 0003 dan contoh decimal di lesson 0004.
- [FHIR R5 Encounter](https://hl7.org/fhir/R5/encounter.html)
  Use for: satu-satunya perbandingan R4 vs R5 di lesson 0002 (`Encounter.class` menjadi CodeableConcept 0..*).
- [Node.js API: Buffer (`buffer.constants.MAX_STRING_LENGTH`)](https://nodejs.org/api/buffer.html)
  Batas panjang string tunggal di Node ("may depend on the JS engine"). Use for: lesson 0004, kenapa `JSON.parse` satu file besar gagal.
- [FHIR R4: Validating Resources](https://hl7.org/fhir/R4/validation.html) dan [Operation `$validate`](https://hl7.org/fhir/R4/resource-operation-validate.html)
  Aspek validasi (structure, cardinality, value domains, bindings, invariants, profiles, business rules), trade-off validasi di production, Postel's law; `$validate` mengembalikan OperationOutcome dan 200 OK baik valid maupun tidak. Use for: lesson 0006 (validasi terhadap profile). Halaman [Profiling](https://hl7.org/fhir/R4/profiling.html) (sudah di atas) juga menyebut ConceptMap untuk "Map between local and standard terminologies".
- [FHIR R4: ConceptMap](https://hl7.org/fhir/R4/conceptmap.html), [`$translate`](https://hl7.org/fhir/R4/conceptmap-operation-translate.html), [ConceptMapEquivalence](https://hl7.org/fhir/R4/valueset-concept-map-equivalence.html), dan [contoh ConceptMap JSON](https://hl7.org/fhir/R4/conceptmap-example.json.html)
  Mapping satu arah dan terikat konteks, equivalence per target, beda dengan StructureMap, operasi `$translate`, struktur `group`/`element`/`target`. Use for: lesson 0006 (mapping kode lokal ke terminologi standar).
- [SATUSEHAT Platform docs (Kemenkes)](https://satusehat.kemkes.go.id/platform/docs/id/playbook/)
  Dokumentasi resmi, situs statis yang bisa dibaca tanpa login (portal SSP untuk kode akses butuh login). Sering direvisi; lesson 0006 mengaksesnya 2026-10-26. Halaman yang dikutip:
  [Pendahuluan](https://satusehat.kemkes.go.id/platform/docs/id/playbook/introduction/) (HIE, tujuan),
  [Endpoint Information](https://satusehat.kemkes.go.id/platform/docs/id/postman-workshop/endpoint-information/) (base URL sandbox/production, `fhir-r4/v1`),
  [Akses Token](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/authentication/apis/token/) (`client_credentials`, `client_id`/`client_secret`, rate limit),
  [Kode Akses API (Sandbox)](https://satusehat.kemkes.go.id/platform/docs/id/api-code/access-sandbox/),
  [FHIR di SATUSEHAT](https://satusehat.kemkes.go.id/platform/docs/id/fhir/),
  [Prerequisites](https://satusehat.kemkes.go.id/platform/docs/id/fhir/prerequisites/) (Organization → Location → Practitioner → Patient),
  resource [Patient](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/patient/), [Encounter](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/encounter/), [Condition](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/condition/), [Observation](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/observation/), [Medication](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/medication/) (identifier system, UTC +00, ICD-10, LOINC, KFA),
  [MPI: Pasien dengan NIK](https://satusehat.kemkes.go.id/platform/docs/id/master-data/master-patient-index/pasien-nik/) (nomor IHS, verifikasi DUKCAPIL),
  [Terminologi](https://satusehat.kemkes.go.id/platform/docs/id/terminology/) dan [Standar Terminologi](https://satusehat.kemkes.go.id/platform/docs/id/terminology/standar-terminologi/) (riwayat revisi bulanan),
  [Validasi Interoperabilitas](https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/validasi/) (OperationOutcome 4xx),
  [Panduan Interoperabilitas](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/) dan [modul IGD](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/igd/) (Medication + MedicationDispense dikirim dalam bundle).
  Use for: semua klaim SATUSEHAT. Yang tidak ditemukan di halaman publik (ketersediaan `$validate`, pemeriksaan `meta.profile`, tipe Bundle, pembatasan resource per tipe kode akses) ditandai "belum terverifikasi" di lesson.
- [SATUSEHAT FHIR R4 Implementation Guide (Simplifier)](https://simplifier.net/guide/SATUSEHAT-FHIR-R4-Implementation-Guide/Home/FHIRProfiles/Patient.page.md?version=current)
  IG resmi yang ditautkan dari dokumentasi SATUSEHAT: profile (canonical `https://fhir.kemkes.go.id/r4/StructureDefinition/…`) dan extension Indonesia (AdministrativeCode, dll.). Use for: bukti SATUSEHAT berbasis R4, contoh IG nasional.
- [MIT CAPD: The STAR method for behavioral interviews](https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/)
  Porsi S/T/A/R, "saya" bukan "kami", Result terukur. Use for: lesson 0006 bagian 4 (sama dengan sumber lesson 0018 track root).

## Wisdom (Communities)

- [chat.fhir.org (Zulip)](https://chat.fhir.org/)
  Forum resmi komunitas FHIR, dijawab langsung oleh penulis spesifikasi. Use for: pertanyaan implementasi dan interpretasi spesifikasi.
- [FAQ SATUSEHAT Platform (Kemenkes)](https://faq.kemkes.go.id/category/satusehat-platform)
  Kanal FAQ resmi yang ditautkan dari dokumentasi SATUSEHAT; dokumentasi juga punya bagian kanal pengaduan (`/complaint-channel/`). Use for: pertanyaan implementasi SATUSEHAT yang tidak terjawab dokumentasi.

## Gaps

- Detail SATUSEHAT yang tidak ada di halaman publik (diakses 2026-10-26): apakah partner bisa memanggil `$validate`, apakah `meta.profile` divalidasi penuh, tipe Bundle dan perilaku atomiknya, dan dokumen "Hak Akses Resource sesuai Tipe Kode Akses API" (unduhan). Cek di Postman Collection resmi atau tanyakan lewat FAQ.
- Tidak ditemukan sumber primer publik untuk regulasi yang mewajibkan integrasi SATUSEHAT; jangan menyebut nomor peraturan di interview kecuali sudah dibaca sendiri.
