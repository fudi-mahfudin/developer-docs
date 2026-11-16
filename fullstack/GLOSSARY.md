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

**MVP (minimum viable product)**:
Versi terkecil aplikasi yang sudah menyelesaikan masalah utama user dan dipakai sungguhan. Dipakai untuk menahan permintaan tambahan ke rilis berikutnya (0006).

**SOP sistem**:
Prosedur tertulis langkah demi langkah untuk kegiatan berulang (rilis, backup dan restore, membuat akun), cukup jelas untuk diikuti orang lain saat developer tidak ada (0006).

**Maintenance record**:
Log setiap kegiatan maintenance (tanggal, jenis preventive/corrective, temuan, tindakan, downtime, status) sebagai bukti dan bahan analisis masalah berulang (0006).
_Avoid_: "log" saja (tertukar dengan log aplikasi)

**Preventive maintenance**:
Pekerjaan perawatan terjadwal (uji restore, patch, cek disk, review akun) supaya masalah tidak muncul. Lawannya corrective maintenance, yaitu perbaikan setelah ada masalah (0006).

**STAR**:
Struktur cerita untuk pertanyaan perilaku: Situation, Task, Action, Result. Result sebaiknya berisi angka sebelum dan sesudah (0006).

**Aturan backup 3-2-1**:
3 salinan data (1 utama + 2 backup), di 2 jenis media berbeda, 1 salinan di luar lokasi (0006, 0007).

**DHCP**:
Protokol yang membagikan IP address, subnet mask, gateway, dan DNS server ke perangkat secara otomatis untuk jangka waktu tertentu (lease) (0007).

**DNS**:
Sistem yang menerjemahkan nama host menjadi IP address (0007).

**Default gateway**:
Router tujuan untuk semua lalu lintas ke luar subnet, termasuk internet (0007).

**Least privilege**:
Prinsip bahwa setiap user hanya diberi hak akses minimum yang dibutuhkan untuk tugasnya (0007).

## Coding dan simulasi

**Format tujuh langkah** (0008, 0009):
Urutan menjawab soal coding di track ini: soal → pertanyaan klarifikasi → ide → pseudocode → implementasi JavaScript → kompleksitas → edge case. Pseudocode adalah jawaban utama.

**Pseudocode**:
Langkah algoritma dalam bahasa campuran yang tidak terikat sintaks bahasa pemrograman; di track ini memakai `←` untuk assignment, `mod` dan `div` untuk sisa dan pembagian integer.

**Big-O (kompleksitas waktu/ruang)**:
Cara menyatakan bagaimana waktu atau memori tambahan tumbuh terhadap ukuran input n, mis. `O(1)`, `O(log n)`, `O(n)`, `O(n²)`.

**Edge case**:
Input di batas atau di luar kebiasaan (kosong, satu elemen, negatif, duplikat, overflow) yang harus disebut sebelum ditanya interviewer.

**Overflow**:
Hasil hitungan melewati batas tipe angka, mis. integer 32-bit bertanda [−2^31, 2^31 − 1]. Di JavaScript, integer `number` eksak sampai `Number.MAX_SAFE_INTEGER` (2^53 − 1).

**Membalik separuh angka** (0008):
Teknik palindrome integer tanpa string: balik digit dari belakang sampai angka terbalik ≥ sisa angka, lalu bandingkan kedua separuh. Tidak bisa overflow.

**Hash map** (0008, 0009):
Struktur key-value dengan akses rata-rata `O(1)`; di JavaScript `Map`. Dipakai untuk frequency count dan "sudah pernah dilihat?" (two sum).

**Stack**:
Struktur LIFO (last in, first out); di JavaScript array dengan `push`/`pop`. Dipakai untuk valid parentheses.

**Two pointers** (0009):
Dua index yang bergerak di array (biasanya terurut) untuk mengganti loop bersarang `O(n²)` menjadi `O(n)`.

**Sliding window** (0009):
Rentang `[kiri, kanan]` yang digeser maju untuk mencari substring/subarray terpanjang atau terpendek yang memenuhi syarat dalam `O(n)`.

**Binary search** (0009):
Pencarian di data terurut dengan membuang separuh ruang pencarian setiap perbandingan, `O(log n)`.
_Avoid_: "binary search" untuk data yang belum terurut

**Kadane** (reference soal coding tambahan):
Algoritma `O(n)` untuk jumlah subarray bersebelahan terbesar: pada setiap posisi, pilih mulai baru atau melanjutkan subarray sebelumnya.

**Simulasi interview tiga babak** (0010):
Latihan tanya-jawab yang dibaca langsung: Babak 1 Fundamental & SQL, Babak 2 CRUD & sole dev, Babak 3 Live coding. Setiap pertanyaan diberi label asal JD dan tautan ke lesson terkait.
