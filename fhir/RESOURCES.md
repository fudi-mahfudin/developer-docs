# FHIR (R4) Interview Resources

## Knowledge

- [HL7 FHIR R4 (4.0.1) specification](https://hl7.org/fhir/R4/)
  Spesifikasi resmi versi R4. Use for: semua klaim tentang Resource, datatype, REST API, search, Bundle. Kutip halaman spesifik, bukan halaman depan.
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
