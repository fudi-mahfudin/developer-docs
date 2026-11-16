## Agent skills

### Issue tracker

Issue dan spec disimpan sebagai file markdown lokal di `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Lima label bawaan (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), ditulis sebagai baris `Status:` di file issue. See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context: `GLOSSARY-MAP.md` di root menunjuk `dotnet/GLOSSARY.md` (track .NET + Angular + SQL), `fhir/GLOSSARY.md` (track FHIR), `sysdesign/GLOSSARY.md` (track system design), `nodejs/GLOSSARY.md` (track Node.js + NestJS), dan `fullstack/GLOSSARY.md` (track fullstack, baca-saja). `docs/adr/` di root. Struktur: satu folder per track (`dotnet/`, `fhir/`, `sysdesign/`, `nodejs/`, `fullstack/`); komponen bersama di `assets/`, test di `tests/{shared,dotnet,fhir,sysdesign,nodejs,fullstack}/`, draf STAR lintas track di `star/`. See `docs/adr/0001-struktur-folder-per-track.md`. Track baru mengikuti `docs/adr/0003-konvensi-materi-baru.md`. See `docs/agents/domain.md`.
