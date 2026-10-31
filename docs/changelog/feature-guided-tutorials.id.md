# Tutorial terpandu

**Feature Branch:** feature-guided-tutorials

## Spesifikasi Teknis

Rute Explore dan Flashcards diselesaikan melalui kapabilitas publik Study `study:tutorialTargets`. Modul bahasa hanya menyumbangkan data bahasa dan alur; Cognis tetap mengelola rute, pendaftaran bahasa, cache dan antarmuka belajar. Bahasa Inggris dan Jepang memakai implementasi penyedia yang sama. Konten dalam cache dapat dijelaskan saat offline. Target yang hilang setelah navigasi mengikuti kebijakan host.

Modul mendaftarkan alur dan teks terjemahannya melalui ctx. Host mengelola katalog, petunjuk, panah, sorotan, kendali papan ketik dan penunjuk, navigasi SPA dengan pemeriksaan akses, serta aksesibilitas. Menutup tutorial, berpindah halaman di luar alur, kehilangan akses atau menonaktifkan modul mengakhiri sesi. Kegagalan pemasangan penyedia membatalkan pendaftarannya.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

## Komit

- [9eb04a5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9eb04a52924608bec3a943121d169c9b09e5a59d)
