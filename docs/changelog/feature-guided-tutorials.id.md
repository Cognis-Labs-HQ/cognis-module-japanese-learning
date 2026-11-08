# Tutorial terpandu

**Feature Branch:** feature-guided-tutorials

## Spesifikasi Teknis

Rute Explore dan Flashcards diselesaikan melalui kapabilitas publik Study `study:tutorialTargets`. Modul bahasa hanya menyumbangkan data bahasa dan alur; Cognis tetap mengelola rute, pendaftaran bahasa, cache dan antarmuka belajar. Bahasa Inggris dan Jepang memakai implementasi penyedia yang sama. Konten dalam cache dapat dijelaskan saat offline. Target yang hilang setelah navigasi mengikuti kebijakan host.

Modul mendaftarkan alur dan teks terjemahannya melalui ctx. Host mengelola katalog, petunjuk, panah, sorotan, kendali papan ketik dan penunjuk, navigasi SPA dengan pemeriksaan akses, serta aksesibilitas. Menutup tutorial, berpindah halaman di luar alur, kehilangan akses atau menonaktifkan modul mengakhiri sesi. Kegagalan pemasangan penyedia membatalkan pendaftarannya.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

## Kunjungan Awal Terikat Halaman

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

## Kunci Terjemahan Modul

Kunci terjemahan tutorial memakai ID modul manifes lengkap beserta tanda hubungnya sebagai satu segmen ruang nama.

## Petunjuk Yang Berguna

Langkah tutorial berfokus pada kontrol dan tugas yang tersedia, tanpa pernyataan yang tidak relevan tentang izin atau tindakan yang tidak dilakukan panduan.

## Tentukan isyarat Berikutnya per langkah

Setiap langkah tutorial kini menetapkan `highlightNext` secara eksplisit: penjelasan yang memerlukan Berikutnya atau Selesai mengaktifkannya, sedangkan latihan berbasis interaksi atau penantian menonaktifkannya. Pengurangan gerakan mempertahankan garis tepi statis.

Setiap komponen antarmuka wajib dicakup tutorial. Panduan kontribusi mengharuskan alur tugas yang berfokus pada pengguna dan peninjauan tutorial setiap kali fitur atau perilaku antarmuka berubah.

## Wilayah tutorial yang terlihat

Wilayah tutorial dan isyarat Berikutnya ditetapkan secara eksplisit.

## Antrean menu mengambang bersama

Menu mengikuti antrean host bersama dan masa hidup komponen.

## Kontrol pemulihan yang didokumentasikan

Tampilan target hilang menyediakan Berikutnya dan Mulai Ulang Tutorial; pemutaran ulang juga menyediakan Batal.

## Panduan tutorial terarah

Tutorial menjelaskan kontrol terlihat yang berbeda sesuai urutan UI. Petunjuk bersama mencakup penemuan tampilan aktif, contoh stabil, keadaan kosong, cabang bersyarat, dan pembersihan siklus hidup. Kontrol pemutaran ulang serta dokumentasi pengurangan gerakan sesuai host bersama.

## Panduan Terarah

Panduan bahasa hanya tersedia setelah pendaftaran eksplisit di pengaturan Belajar. Pengantar pendaftaran yang berulang dihapus; panduan dimulai dengan Jelajahi lalu alat latihan.

## Komit

- [9eb04a5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9eb04a52924608bec3a943121d169c9b09e5a59d)
- [6429024](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64290246cd5ef8567402e71e22921a3e28f36d76)
- [e6768d1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e6768d18e5e9e78eb456e25ce2c8d935214683b8)
- [8696a30](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8696a3069f18388c39b7c13bd2ea59f569c25a85)
- [8946fb9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8946fb98097d13ebd923e1c2354d13ef1e0545c3)
- [0c2bcf9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0c2bcf9e65dc2bf8c27b533d77b9456d73985070)
- [646a16c12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/646a16c12d8bfa98ca71b09a074fa70d505851e5)
- [028167419](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/028167419f103c6d3b2bb9df4ff25a47f3e06080)
- [3aa7d0981](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3aa7d0981544552f9cbb1fbf153328b5ff064ede)
