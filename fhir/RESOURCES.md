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

## Wisdom (Communities)

- [chat.fhir.org (Zulip)](https://chat.fhir.org/)
  Forum resmi komunitas FHIR, dijawab langsung oleh penulis spesifikasi. Use for: pertanyaan implementasi dan interpretasi spesifikasi.

## Gaps
