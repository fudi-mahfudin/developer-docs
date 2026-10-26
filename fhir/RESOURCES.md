# FHIR (R4) Interview Resources

## Knowledge

- [HL7 FHIR R4 (4.0.1) specification](https://hl7.org/fhir/R4/)
  Spesifikasi resmi versi R4. Use for: semua klaim tentang Resource, datatype, REST API, search, Bundle. Kutip halaman spesifik, bukan halaman depan.
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

## Wisdom (Communities)

- [chat.fhir.org (Zulip)](https://chat.fhir.org/)
  Forum resmi komunitas FHIR, dijawab langsung oleh penulis spesifikasi. Use for: pertanyaan implementasi dan interpretasi spesifikasi.

## Gaps
