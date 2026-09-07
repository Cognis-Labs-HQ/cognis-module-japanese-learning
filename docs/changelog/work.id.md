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

## Kontrak Skema Netral Berversi

Penyelarasan dengan PR Cognis #214 menambahkan kepemilikan namespace, metadata skema terlokalisasi, peran semantik lapisan, tipe kolom yang diperluas, petunjuk detail, tag penemuan aktivitas dan minat, target hubungan wajib, perilaku penghapusan eksplisit, peran resolver, serta referensi berurutan dengan posisi ketat. Deskripsi bahasa kini menerbitkan identitas paket yang tidak dapat diubah.

## ID Konten Huruf Kecil yang Ketat

ID data katakana kini hanya menggunakan ASCII huruf kecil agar host menerima setiap data dan tidak lagi membatalkan aktivasi dengan `invalid_content_record`. Versi paket dan revisi konten dinaikkan supaya Cognis mengingest data yang telah diperbaiki.

## Diterbitkan Ulang dengan Validasi Awal Ketat

Paket yang telah diperbaiki diterbitkan ulang sebagai versi `2.1.2` dengan revisi konten `2026-09-05.4` agar instalasi tidak menggunakan kembali byte paket tidak valid yang tersimpan di cache. Pengujian mandiri kini mencerminkan prasyarat host untuk ID string, awalan `ja:`, karakter portabel huruf kecil, dan label string yang tidak kosong.

## Kode Bahasa untuk Subnavigasi Study

Deskriptor bahasa kini menerbitkan `code: "ja"` kanonis bersama `languageCode` yang kompatibel. Dengan demikian Cognis PR #215 dapat menandai tombol bahasa aktif yang dibuat dengan kode bahasa Jepang dan membawa pilihan tersebut melalui riwayat router ke tujuan Study berikutnya tanpa parameter kueri URL.

## Definisi Kamus Terlokalisasi yang Dapat Diselesaikan

Lapisan `definitions` kini mengikuti kontrak kamus dari PR Cognis #196. Lapisan ini mendeklarasikan `definitionLocalization`, kunci string stabil milik modul, dan bidang teks terlokalisasi bertipe. Setiap definisi bawaan berisi string bahasa Jerman, Inggris, Indonesia, dan Jepang; versi skema dan paket dinaikkan menjadi `3` dan `2.2.0` untuk perubahan struktur yang tidak dapat diubah.

## Audio unit tulisan dan partikel

Unit tulisan atomik dan gabungan kini menyediakan daftar pelafalan wajib serta referensi audio HTTPS tanpa menyertakan media biner. Lapisan partikel khusus menyimpan metadata fungsi tata bahasa, dan catatan kalimat dapat mempertahankan referensi kata dan partikel yang berurutan.

## Makna asli Pustaka

Kolom duplikat `romanization`, `reading`, `readings`, `meaning`, `function`, dan bahasa definisi telah dihapus. Pelafalan kini memakai kolom `pronunciation` yang dikenali Pustaka secara konsisten, sedangkan kanji, kata, dan partikel menyatakan makna melalui hubungan ke data definisi terlokalisasi.

## Bacaan kanji berbasis kana

Pelafalan kanji menampilkan on-yomi dalam katakana dan kun-yomi dalam hiragana, dan setiap bacaan bawaan kini diuraikan menjadi referensi berurutan ke data karakter kana yang sebenarnya. Metadata kelas karakter membedakan variasi hiragana dan katakana, sementara perender Pustaka dapat menampilkan kana yang direferensikan sebagai kotak komponen yang dapat dinavigasi.

## Komit

- [a6fa75d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a6fa75d15c478b1d8ef1930dcc3c5c29e3938b97)
- [33cf20c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/33cf20c040c55a177efe83fa6d14674491da2254)
- [ddd8464](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddd84646f1930ea660f469e4b1776219558e1e5b)
- [7048e41](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7048e4155bb52132741016c35371f0e0c215d67e)
- [131afdf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/131afdf5125a3eebae584a2c4729bd0a1b144654)
- [db6df0a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/db6df0a0d71e75892cac726991ab0d5fa9edf172)
- [530fdfd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/530fdfdb7cb55b05d316d404ab8e64c33ba0b04c)
- [549322e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/549322e5e597f186c36ada77d330921e7b335a4d)
- [1740b0b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1740b0b0da93d15c450ca82c452bb1fe8698b7e9)
- [4639371](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4639371d8fe55c71477aa70087cc4e8a18100438)
