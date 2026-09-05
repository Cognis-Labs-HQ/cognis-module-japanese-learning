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

## Dependensi Pustaka Berbasis Kapabilitas

UUID adaptor Pustaka dihapus dari dependensi komponen karena adaptor Study bukan komponen yang dapat dipasang secara mandiri. Modul kini bergantung pada komponen gateway Study dan menemukan Pustaka hanya melalui kapabilitas wajib `study:library`.

## Pengenal Konten Portabel

Glif kanji dalam ID data diganti dengan pengenal ASCII yang stabil sementara glif tetap dipertahankan sebagai label. Versi paket konten dan revisinya kemudian dinaikkan agar byte yang diperbaiki dapat diingesti dengan aman.

## Navigasi Buatan Bercakupan Bahasa

Deskripsi bahasa Jepang deklaratif diselaraskan dengan PR Cognis #196 dan #213 dengan mendeklarasikan secara eksplisit bahwa tidak ada halaman turunan yang dapat dijalankan. Study kini menyediakan tujuan Pustaka yang dihasilkan dan terlihat oleh pelajar serta mempertahankan konteks bahasa `ja` tervalidasi selama penelusuran dan navigasi riwayat.

## Komit

- [7bbb383](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7bbb3839f238ccdb5a3eba48448405f561f3d328)
- [83ad282](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/83ad282d4289f885518a26b13776fcdd9f3a0f98)
