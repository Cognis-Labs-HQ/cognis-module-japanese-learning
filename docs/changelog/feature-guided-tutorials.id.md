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

## Komit

- [9eb04a5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9eb04a52924608bec3a943121d169c9b09e5a59d)
- [6429024](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64290246cd5ef8567402e71e22921a3e28f36d76)
