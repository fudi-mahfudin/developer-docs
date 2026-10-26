# FHIR (R4) Interview Resources

## Knowledge

- [HL7 FHIR R4 (4.0.1) specification](https://hl7.org/fhir/R4/)
  Spesifikasi resmi versi R4. Use for: semua klaim tentang Resource, datatype, REST API, search, Bundle. Kutip halaman spesifik, bukan halaman depan.
- [Bulk Data Access IG v2.0.0 (STU 2): Export](https://hl7.org/fhir/uv/bulkdata/STU2/export.html)
  Spesifikasi resmi `$export` berbasis R4: level Patient/Group/system, kick-off, polling (202, `Retry-After`, 429), manifest, parameter `_type`/`_since`. Versi 3.0.0 sudah menggantikannya; lesson 0004 memakai STU 2. Use for: semua klaim Bulk Data.
- [FHIR R4: ND-JSON](https://hl7.org/fhir/R4/nd-json.html) dan [FHIR R4: JSON (bagian primitive, catatan JavaScript)](https://hl7.org/fhir/R4/json.html)
  Format NDJSON (`application/fhir+ndjson`, satu tipe per dokumen) dan peringatan resmi bahwa `JSON.parse` di JavaScript menghilangkan presisi `decimal`. Use for: NDJSON, decimal di JS.
- [FHIR R4: Data Types, decimal](https://hl7.org/fhir/R4/datatypes.html#decimal)
  Aturan presisi `decimal` (`0.010` ≠ `0.01`, SHALL dipertahankan untuk presentasi). Use for: jebakan angka.
- [Node.js API: Stream](https://nodejs.org/api/stream.html) dan [Node.js API: Readline](https://nodejs.org/api/readline.html)
  Dokumentasi resmi: buffering dan `highWaterMark`, `write()`/`drain`, `pipeline` (`node:stream/promises`), async iterator, contoh "Read file stream line-by-line". Use for: streaming dan backpressure.
- [Node.js Learn: Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams) dan [Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
  Panduan resmi Node: definisi backpressure; bagian "JSON DOS" tentang biaya `JSON.parse` di event loop. Use for: menjelaskan kenapa tidak parse file besar sekaligus.
- [stream-json README (GitHub uhop/stream-json)](https://github.com/uhop/stream-json)
  Library parsing JSON besar sebagai stream (`parser`, `pick`, `streamArray`, dibangun di atas `stream-chain`). Use for: JSON besar yang bukan NDJSON.
- [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
  Reviver dengan `context.source` (teks asli nilai primitif) dan peringatan kehilangan presisi angka. Use for: mempertahankan `decimal`.

## Wisdom (Communities)

- [chat.fhir.org (Zulip)](https://chat.fhir.org/)
  Forum resmi komunitas FHIR, dijawab langsung oleh penulis spesifikasi. Use for: pertanyaan implementasi dan interpretasi spesifikasi.

## Gaps
