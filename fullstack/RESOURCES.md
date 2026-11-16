# Fullstack Web Developer Interview Resources

Sumber untuk `<sup class="cite">` harus primer (ADR 0003): dokumentasi resmi, RFC, spesifikasi, OWASP Cheat Sheet. Di track ini MDN termasuk sumber primer untuk HTML/CSS/JS/HTTP. Agent lesson menambahkan halaman spesifik (bukan halaman depan) beserta "Use for" saat fakta dipakai, dan memverifikasi URL saat itu. Buku, kursus, LeetCode, dan blog hanya dicantumkan di bagian "Bacaan" di bawah, tidak untuk `.cite`.

## Knowledge

### Frontend

- [Dokumentasi Next.js (App Router)](https://nextjs.org/docs/app)
  Use for: Server vs Client Component, data fetching, caching (`'use cache'`, Cache Components di Next.js ≥ 16), Server Actions, Route Handlers, `revalidatePath`/`revalidateTag`. Versi 16 diverifikasi di [Next.js 16.4](https://nextjs.org/blog/next-16-4).
- [Dokumentasi React](https://react.dev/reference/react)
  Use for: `useState`, `useActionState`, Suspense, `'use client'`/`'use server'`.
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web)
  Use for: semantic HTML, a11y dasar, box model, Flexbox vs Grid, media query, event bubbling/delegation, closure, `fetch`, CORS, cookie.

### Backend

- [Dokumentasi Express 5](https://expressjs.com/en/5x/api.html) dan [panduan error handling](https://expressjs.com/en/guide/error-handling.html)
  Use for: routing, middleware, error middleware 4 argumen, async error otomatis di Express 5. Migrasi dari 4: [Moving to Express 5](https://expressjs.com/en/guide/migrating-5.html).
- [Dokumentasi Zod](https://zod.dev/)
  Use for: schema validasi, `safeParse`, pesan error.
- [Dokumentasi Prisma ORM 7](https://www.prisma.io/docs/orm/v7)
  Use for: `schema.prisma`, migrasi (`migrate dev` vs `deploy`), `select`/`include`, `$transaction`, relation loading. Pakai URL `/v7`: docs default prisma.io sudah menampilkan Prisma 8 yang masih release candidate ([release status](https://www.prisma.io/docs/orm/release-status)).

### Database

- [Dokumentasi PostgreSQL 18](https://www.postgresql.org/docs/18/)
  Use for: DDL dan constraint, JOIN, CTE, window function, index, `EXPLAIN`, transaksi dan isolation level, `ON CONFLICT`. Versi di [versioning policy](https://www.postgresql.org/support/versioning/).
- [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/)
  Use for: kotak "Beda di MySQL" (`AUTO_INCREMENT`, `ON DUPLICATE KEY UPDATE`, isolation default InnoDB, window function/CTE sejak 8.0). Model rilis LTS/Innovation di [MySQL releases](https://dev.mysql.com/doc/refman/9.7/en/mysql-releases.html).

### Standar dan keamanan

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
  Use for: method, idempotensi, status code.
- [RFC 6265: HTTP State Management (cookie)](https://www.rfc-editor.org/rfc/rfc6265)
  Use for: atribut cookie `HttpOnly`, `Secure`, `Path`, `Domain`.
- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
  Use for: struktur JWT dan claim.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
  Use for: [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

## Bacaan

- [Use The Index, Luke](https://use-the-index-luke.com/) (Markus Winand)
  Untuk: index, urutan kolom composite index, pagination keyset.
- [SQLBolt](https://sqlbolt.com/) dan [PostgreSQL Exercises](https://pgexercises.com/)
  Untuk: latihan query JOIN, GROUP BY, dan window function.
- [Learn Next.js (kursus resmi)](https://nextjs.org/learn)
  Untuk: membangun dashboard App Router langkah demi langkah.

## Bacaan lanjutan (di luar cakupan)

- [LeetCode](https://leetcode.com/) dan [NeetCode roadmap](https://neetcode.io/roadmap)
  Untuk: latihan pola coding interview (hash map, two pointers, sliding window, binary search) setelah 0008–0009.
- DP (dynamic programming) dan graph (BFS/DFS): bagian "1-D Dynamic Programming" dan "Graphs" di [NeetCode roadmap](https://neetcode.io/roadmap). Tidak dibahas di track ini karena jarang muncul untuk level dan posisi ini.
- [Dokumentasi Docker](https://docs.docker.com/get-started/)
  Untuk: container dan `docker compose` bila deploy aplikasi internal memakainya.
- [CompTIA Network+ objectives](https://www.comptia.org/certifications/network)
  Untuk: pendalaman jaringan setelah 0007.
