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

## Paket Konten Bahasa Jepang Deklaratif

Modul diselaraskan dengan kontrak Cognis Library 2.1 yang direvisi. Data bahasa Jepang kini dikirim sebagai skema berversi dan graf konten deklaratif yang diingesti melalui `study:library`; host memiliki validasi, persistensi, rute, dan UI yang dihasilkan, sehingga layanan Pustaka, basis data, API, dan halaman duplikat milik modul telah dihapus.

## Komit

- [bc9d634](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bc9d6340c32cf5bcc867b1ea4e7d58307a04e77f)
- [dc40e68](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/dc40e68bbfbd1927aecb5c27b14087a4d384b6ba)
