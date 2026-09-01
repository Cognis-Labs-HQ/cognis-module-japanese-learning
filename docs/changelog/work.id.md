# Pustaka Study Bercakupan

**Feature Branch:** work

## Pustaka Berlapis

Pustaka berbasis berkas paket diganti dengan pustaka Study berbasis basis data dari Cognis PR #196, termasuk sembilan lapisan tervalidasi, pelacakan referensi, akses bercakupan, pertukaran JSON dan Anki, serta permintaan push yang ditinjau.

## Peramban Pustaka

Halaman pustaka terlokalisasi diperbarui agar dapat menelusuri lapisan global yang berisi materi melalui penyusun halaman host.

## Templat yang Dapat Dipilih Konsumen

Konsumen dapat menyalin hanya lapisan templat pustaka baku yang diperlukan. Metadata hubungan mempertahankan tautan yang sah dan dependensi wajib, sementara pembuatan kata dan kalimat dapat menyimpulkan tautan yang sesuai.

## Rute API Milik Modul

Semua endpoint pustaka dipindahkan ke namespace API milik modul agar Cognis dapat mengaktifkan modul tanpa menolak rute gateway Study yang dilindungi.

## Navigasi Study Terlokalisasi

Subnavigasi Study bahasa Jepang dipulihkan pada halaman pustaka, ketiga label halaman turunannya dilokalkan dari bundel modul, dan klik diteruskan melalui router host Cognis pada setiap halaman Study bahasa Jepang.

## Komit

- [8dc42b2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8dc42b26ee4c0fdf71e3b6e3961d2d5c22e60583)
- [9c0119a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9c0119a1f9b9cd4df94c4b941786698ca37a04c1)
