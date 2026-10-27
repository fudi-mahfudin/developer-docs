## Agent skills

### Issue tracker

Issue dan spec disimpan sebagai file markdown lokal di `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Lima label bawaan (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), ditulis sebagai baris `Status:` di file issue. See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context: `GLOSSARY-MAP.md` di root menunjuk `dotnet/GLOSSARY.md` (track .NET + Angular + SQL) dan `fhir/GLOSSARY.md` (track FHIR). `docs/adr/` di root. Struktur: satu folder per track (`dotnet/`, `fhir/`); komponen bersama di `assets/`, test di `tests/{shared,dotnet,fhir}/`, draf STAR lintas track di `star/`. See `docs/adr/0001-struktur-folder-per-track.md`. See `docs/agents/domain.md`.
