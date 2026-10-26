# FHIR untuk Developer JavaScript — Glossary

Kosakata bersama untuk persiapan interview fullstack (Node/React) di perusahaan health-tech yang memakai HL7 FHIR R4. Padanan dunia JavaScript ditulis bila membantu.

Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per bagian di bawah.

## Fondasi

## Resource dan datatype

**Logical id**:
Elemen `id` sebuah resource: string opaque (maks. 64 karakter) yang ditetapkan server penyimpan, unik per tipe resource di server itu, tidak pernah berubah, dan membentuk URL-nya (`[base]/Patient/123`). Bisa berbeda di server lain (lesson 0002).
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

## Bulk Data dan JSON skala besar

## Keamanan dan SMART on FHIR

## Indonesia (SATUSEHAT)
