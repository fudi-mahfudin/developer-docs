# 0001 · Struktur folder per track

Status: diterima (2026-10-27)

## Konteks

Track .NET + Angular + SQL dulu tinggal di root repo, sedangkan track FHIR ada di `fhir/`. Root jadi campuran antara materi satu track dan hal yang dipakai bersama, dan tidak simetris dengan `fhir/`.

## Keputusan

- Satu folder per track, susunannya sama: `dotnet/` dan `fhir/`, masing-masing berisi `index.html`, `MISSION/ROADMAP/NOTES/RESOURCES/GLOSSARY.md`, `lessons/`, `reference/`, `learning-records/`, `assets/questions/` (`dotnet/` juga punya `lab/`).
- Lesson 0001–0024 (.NET, Angular, SQL) tetap **satu** track `dotnet/` dan tidak dipecah per teknologi. Penomoran, ROADMAP, GLOSSARY, dan review campuran (0007, 0012, 0018, 0024) melintasi ketiganya.
- Yang dipakai bersama tetap di root:
  - `assets/`: komponen JS dan CSS. Lesson memuatnya dari `../../assets/`, sedangkan bank soal dari `../assets/questions/` di track sendiri.
  - `tests/`: dibagi ke `shared/`, `dotnet/`, `fhir/`, dengan `helpers.js` bersama. Loader default `helpers.js` memakai track `dotnet`, dan `forTrack("fhir")` untuk FHIR.
  - `star/`: draf STAR, dirujuk dari kedua track.
  - `.scratch/`, `docs/`.
- Root `index.html` hanya halaman pembuka yang menautkan indeks tiap track.
- Path yang ditulis relatif ke root repo (`data-file` blok skrip, penyebutan `dotnet/lab/...`) memakai prefix track.
- File issue lama di `.scratch/` tidak ditulis ulang. Path di sana mengikuti struktur saat issue dibuat.

## Konsekuensi

Track baru cukup menambah folder `<track>/` dengan susunan yang sama, ditambah `tests/<track>/` dan satu baris di `GLOSSARY-MAP.md` dan root `index.html`.
