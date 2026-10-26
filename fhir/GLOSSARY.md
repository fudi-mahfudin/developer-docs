# FHIR untuk Developer JavaScript — Glossary

Kosakata bersama untuk persiapan interview fullstack (Node/React) di perusahaan health-tech yang memakai HL7 FHIR R4. Padanan dunia JavaScript ditulis bila membantu.

Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per bagian di bawah.

## Fondasi

## Resource dan datatype

## REST API

## Bulk Data dan JSON skala besar

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
