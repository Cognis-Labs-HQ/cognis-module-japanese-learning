# Belajar Offline

**Cabang Fitur:** feature-offline-study

## Mode Offline

Study menyimpan snapshot JSON ringan dengan batas ukuran di tab saat ini: skema, data karakter/kartu yang diizinkan, lokasi, ID yang telah dilihat, favorit, dan dek yang pernah dibuka. Skema bahasa mengaktifkannya melalui `metadata.offline: { cache: "lightweight" }`. Cache Library menampung paling banyak 16 MB dan 100 pembacaan; cache baca lain paling banyak 4 MB dan 100 pembacaan. Byte audio, respons kamus, kredensial, dan dokumen terautentikasi tidak disimpan secara permanen.

Pratinjau Explore menyelesaikan hubungan dari baris tersimpan yang telah diotorisasi. Menggambar bekerja secara lokal dengan panduan baru; latihan kartu dapat dilanjutkan secara lokal. Audio serta permintaan kamus/ElevenLabs dihentikan. Latihan offline tidak menyimpan progres, XP, hadiah, favorit, atau suntingan. Hanya konten yang pernah dimuat dan muat di cache yang tersedia; dependensi yang hilang tetap tidak tersedia.

Study privat memerlukan sesi akun yang sama, pernah diverifikasi, dan belum kedaluwarsa di tab yang sama. Muat ulang dan kunjungan pertama tetap mengikuti kontrak offline khusus halaman publik. Perubahan akun/sesi, preferensi, siklus hidup modul, dan pelepasan penyedia membatalkan snapshot privat. Pencabutan akses server tidak dapat diketahui saat terputus. Pemulihan memakai penjaga perubahan yang belum disimpan lalu memuat ulang otorisasi server.

## Komit

- [917330e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/917330ee4b13a580b92fbea30f0f56afeda7c65f)
