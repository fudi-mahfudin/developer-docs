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

## Wisdom (Communities)

- [chat.fhir.org (Zulip)](https://chat.fhir.org/)
  Forum resmi komunitas FHIR, dijawab langsung oleh penulis spesifikasi. Use for: pertanyaan implementasi dan interpretasi spesifikasi.

## Gaps
