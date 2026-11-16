# Fullstack Web Developer — Glossary

Kosakata bersama untuk persiapan interview Fullstack Web Developer aplikasi internal (Next.js + Express + PostgreSQL). Istilah ditambahkan per lesson oleh agent yang membuat lesson tersebut, dikelompokkan per kelompok lesson di bawah. Track ini baca-saja, jadi tidak ada slug topik bank soal.

## Contoh berjalan

**Inventaris aset kantor**:
Aplikasi internal contoh di seluruh track: mencatat aset (laptop, printer, proyektor), kategorinya, karyawan, dan peminjaman aset oleh karyawan.
_Avoid_: "aplikasi inventory" (campur bahasa untuk hal yang sama)

**Aset**:
Barang milik kantor yang dicatat di aplikasi, dengan kode unik, kategori, dan status (tersedia, dipinjam, rusak).

**Peminjaman**:
Catatan bahwa seorang karyawan memakai satu aset dari tanggal pinjam sampai tanggal kembali. Tabel penghubung antara karyawan dan aset.

## Teknis · web, API, dan database

**Server Component / Client Component** (0001):
Komponen Next.js App Router yang dirender di server (default) vs komponen bertanda `'use client'` yang berjalan di browser untuk state dan event.

**Server Action** (0001, 0005):
Fungsi async bertanda `'use server'` yang dipanggil dari form lewat POST. Endpoint publik: tetap validasi input dan cek auth. Di track ini meneruskan ke API Express.

**Cache Components** (0001):
Model caching Next.js ≥ 16: hanya yang diberi `'use cache'` yang di-cache; data per request di-stream lewat `<Suspense>`.

**Error handler terpusat** (0002):
Middleware Express empat argumen `(err, req, res, next)` yang didaftarkan paling akhir. Di Express 5, error dari handler async otomatis sampai ke sini.

**Layering route → service → Prisma** (0002):
Route mengurus HTTP, service berisi aturan bisnis, Prisma mengakses database.

**Normalisasi (1NF–3NF)** (0003):
Memecah tabel supaya setiap fakta disimpan sekali: nilai atomik, tanpa partial dependency, tanpa transitive dependency.

**Window function** (0003):
Fungsi `... OVER (PARTITION BY ... ORDER BY ...)` yang menghitung atas kelompok baris tanpa meleburnya, mis. `ROW_NUMBER()` untuk top-N per kategori.

**Composite index** (0004):
Index beberapa kolom; paling efisien bila kolom paling kiri ikut difilter.

**N+1** (0004):
Satu query daftar lalu satu query per baris. Diperbaiki dengan JOIN, `IN (...)`, atau `include` di Prisma.

**Keyset pagination** (0004):
Pagination "lanjut setelah kunci terakhir" (`WHERE id > ?`), lawan dari `OFFSET`. Di Prisma disebut cursor-based pagination (`cursor` + `skip: 1` + `take`).

**Soft delete** (0005):
Menandai baris terhapus (`deleted_at`) alih-alih menghapusnya, supaya riwayat peminjaman tetap utuh.

**RBAC** (0005):
Role-based access control: izin berdasarkan role (`STAF`, `ADMIN`), dicek di server untuk setiap request.

## Peran · sole developer dan IT

(Diisi oleh lesson 0006–0007.)

## Coding dan simulasi

(Diisi oleh lesson 0008–0010.)
