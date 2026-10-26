# FHIR (R4) Interview Resources

## Knowledge

- [HL7 FHIR R4 (4.0.1) specification](https://hl7.org/fhir/R4/)
  Spesifikasi resmi versi R4. Use for: semua klaim tentang Resource, datatype, REST API, search, Bundle. Kutip halaman spesifik, bukan halaman depan.
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
