# Notes

- Workspace ini adalah track terpisah dari track .NET + Angular di root repo (satu mission per workspace). Komponen bersama (`style.css`, `quiz.js`, `bank.js`, `bank-quiz.js`, `review.js`, `order.js`, `timer.js`) dipakai dari `../../assets/`; bank soal track ini ada di `fhir/assets/questions/NNNN.js`. Format soal sama dengan `assets/README.md` di root.
- User paling kuat di ekosistem JavaScript (TypeScript, Node.js, React). Semua contoh kode memakai TS/Node/React, bukan .NET. Jembatani ke pengalaman REST/JSON/OAuth yang sudah dikenal.
- Fokus **konsep untuk interview**, tanpa implementasi: tidak ada lab, tidak ada server. Potongan JSON dan TS hanya untuk dibaca dan dijelaskan.
- Profil posisi: fullstack (backend Node + frontend React), mid-level. FHIR R4.
- Bahasa Indonesia, istilah teknis bahasa Inggris.
- Agent yang membuat lesson wajib mengikuti skill `/teach` (baca `~/.claude/skills/teach/SKILL.md` langsung kalau skill tidak bisa dipanggil) dan mengambil fakta dari sumber primer (hl7.org/fhir/R4, SMART App Launch IG, Bulk Data Access IG, dokumentasi SATUSEHAT), bukan dari ingatan model. Detail SATUSEHAT yang tidak bisa diverifikasi publik ditandai "belum terverifikasi".
- Hanya hasil review campuran 0006 yang dicatat sebagai bukti penguasaan. Kuis di lesson 0001–0005 adalah feedback cepat.
- Cerita STAR tidak dibuat baru: 4 cerita di `../star/draf-star.md` di-reframe ke konteks health-tech di lesson 0006.
- Lesson 0002 (anatomi resource JSON) memakai JSON yang diadaptasi dari contoh resmi R4 (Patient example, Encounter f001, Observation berat badan dan glukosa f001); kuis per bagian berprefiks `res-`, cheat sheet di `reference/anatomi-resource.html`. Jebakan R4 vs R5 yang disebut: `Encounter.class` Coding (R4) vs CodeableConcept (R5).
