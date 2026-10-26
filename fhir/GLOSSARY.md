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

## Keamanan dan SMART on FHIR

## Indonesia (SATUSEHAT)
