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

(Diisi oleh lesson 0001–0005.)

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

(Diisi oleh lesson 0008–0010.)
