# Perilisan

Proses perilisan menjaga metadata modul eksternal, inventaris integritas, dan hasil verifikasi tetap sinkron untuk publikasi.

## Contoh Penggunaan

Jalankan `npm install`, `npm test`, `npm run lint`, `npm run manifest:hashes`, `npm run check:manifest`, dan `git diff --check` sebelum melakukan commit rilis.

## Spesifikasi Teknis

### Versi

Jaga versi dalam `package.json`, `package-lock.json`, dan `manifest.json` tetap sinkron. Pertahankan UUID modul secara permanen.

### Inventaris Integritas

Buat ulang `manifest.files` setelah perubahan berkas terakhir dan commit inventaris SHA-256 yang diperbarui bersama setiap berkas yang berubah. Manifest tidak boleh memasukkan dirinya sendiri ke inventaris.
