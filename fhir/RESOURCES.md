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

## Wisdom (Communities)

- [chat.fhir.org (Zulip)](https://chat.fhir.org/)
  Forum resmi komunitas FHIR, dijawab langsung oleh penulis spesifikasi. Use for: pertanyaan implementasi dan interpretasi spesifikasi.

## Gaps
