# 04: Pengaturan GitHub Pages: mode Actions dan Enforce HTTPS

Status: ready-for-human

**What to do:** Pengaturan di GitHub (repo `developer-docs`) yang tidak bisa dilakukan lewat commit. Agent boleh mengerjakannya lewat `gh api` bila pemilik repo mengizinkan secara eksplisit.

- Ubah sumber Pages dari branch `materi-fullstack` (legacy) ke **GitHub Actions** (`build_type: workflow`).
- Nyalakan **Enforce HTTPS**.
- Push ke `main` atau jalankan workflow secara manual, lalu verifikasi `https://docs.mahfudin.com` tayang, SW terpasang, dan situs bisa di-install.

Konsekuensi yang sudah disetujui: track fullstack (hanya ada di `materi-fullstack`) tidak tayang sampai di-merge ke `main`. Merge itu tidak termasuk issue ini.

Blocked by: 03

- [ ] Mode Pages = GitHub Actions
- [ ] Enforce HTTPS aktif
- [ ] Deploy pertama sukses dan terverifikasi di HP/desktop (offline + install)
