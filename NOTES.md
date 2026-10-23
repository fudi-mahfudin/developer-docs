# Notes

- User minta fokus **konsep untuk interview** (bukan tutorial coding panjang).
- Bahasa Indonesia, istilah teknis bahasa Inggris. Selalu beri padanan Node/Express/React.
- Waktu terbatas (3 hari) → lesson pendek, 10–15 menit, langsung ke latihan menjawab.
- `GLOSSARY.md` sudah dibuat di sesi perencanaan (sebelum /teach) sebagai kosakata acuan yang disetujui user; pakai istilahnya secara konsisten. Belum semua istilah terbukti dipahami — lihat learning-records untuk bukti pemahaman.
- Urutan lesson (18 lesson, termasuk review campuran 0007/0012 dan mock interview 0018 sebagai seam penguasaan): lihat `.scratch/urutan-lesson/spec.md`.
- Agent yang membuat atau membangun ulang lesson wajib memanggil skill `/teach` lebih dulu.
- Tugas STAR mulai dicicil di akhir lesson 0006 (malam Hari 1).
- Lesson 0001 dibangun ulang mengikuti spec (soal di `assets/questions/0001.js`). Hasil pengerjaan versi lama tidak dihitung sebagai bukti penguasaan; bukti untuk topik 0001 baru datang dari review 0007.
- Lesson 0003 (async/Task + LINQ) dibangun dengan soal di `assets/questions/0003.js` (topik `csharp-async`, `linq-deferred`, `linq-queryable`) dan reference `reference/async-dan-linq.html`.
- Lesson 0004 (Service Lifetime) dibangun: soal di `assets/questions/0004.js` (topik `di-lifetime`, `di-dbcontext`, `di-captive`), reference `reference/service-lifetime.html`. Istilah baru di GLOSSARY: Captive Dependency, Scope Validation.
- v16.angular.io adalah SPA (kosong saat di-fetch agent). Ambil kutipan dari markdown sumbernya di repo angular/angular branch `16.2.x`, folder `aio/content/guide/`, lalu tautkan ke halaman v16.angular.io yang sesuai.
- Lesson 0005 (Middleware + Options Pattern) dibangun: soal di `assets/questions/0005.js` (topik `mw-pipeline`, `mw-order`, `mw-scoped`, `config-layers`, `options-pattern`), reference `reference/middleware-dan-options.html`. Komponen baru `assets/order.js` untuk latihan susun urutan (dipakai juga untuk prioritas konfigurasi). Istilah baru di GLOSSARY: Short-circuit, User Secrets.
- Lesson 0006 (EF Core + tugas STAR) dibangun: soal di `assets/questions/0006.js` (topik `ef-tracking`, `ef-migration`, `ef-n-plus-1`, `ef-no-tracking`), reference `reference/ef-core.html`. Istilah baru di GLOSSARY: Change Tracker, N+1 Problem, Eager Loading, No-Tracking Query.
- Draf STAR disimpan di `star/draf-star.md` (template 4 tema ROADMAP + bonus "kenapa pindah stack"). Lesson 0018 membaca dan memoles file ini.
- rxjs.dev juga SPA (kosong saat di-fetch). Kutip dari markdown `docs_app/content/guide/` dan JSDoc `src/internal/` di repo ReactiveX/rxjs branch `7.x`, lalu tautkan ke rxjs.dev.
- Lesson 0009 (Red-Green-Refactor) dibangun: soal di `assets/questions/0009.js` (topik `tdd-siklus`, `tdd-red`, `tdd-aaa`, `tdd-naming`), reference `reference/red-green-refactor.html`. Komponen baru `assets/order.js` untuk latihan mengurutkan langkah (dipakai ulang mis. untuk urutan middleware 0005). Istilah baru di GLOSSARY: Arrange-Act-Assert, Test List.
- Lesson 0016 (Reactive Forms + HttpClient + HTTP Interceptor) dibangun: soal di `assets/questions/0016.js` (topik `ng-forms`, `ng-http`, `ng-interceptor`), reference `reference/forms-http-interceptor.html`. Istilah baru di GLOSSARY: Reactive Forms, Template-driven Forms. Interceptor diajarkan dalam bentuk class + `HTTP_INTERCEPTORS` (NgModule); `HttpInterceptorFn` hanya disebut sebagai alternatif standalone. JWT/CORS sengaja ditunda ke 0017.
