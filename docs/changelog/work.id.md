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

Pelafalan kanji dan tautan unsurnya memakai data hiragana secara konsisten, termasuk untuk on-yomi, sehingga definisi seperti `日` tidak menampilkan unsur katakana yang tidak terkait. Setiap bacaan bawaan diuraikan menjadi referensi berurutan ke karakter hiragana yang tepat. Karakter katakana mempertahankan ID dan tautan tersendiri serta tetap tersedia bagi konten yang benar-benar ditulis dalam katakana.

## Kontrak aktivasi Pustaka terkini

Filter lencana sistem tulisan dan JLPT kini mendeklarasikan grup filter bernama yang saling eksklusif dan didukung oleh Library 2.6. Modul sengaja tidak mengaktifkan `allowBootstrapFailure`: ingest konten dan publikasi `study:language:ja` adalah pekerjaan runtime utamanya, sehingga mempertahankan modul aktif tanpa keduanya hanya menghasilkan modul yang tidak berfungsi. Cognis PR #216 kini memperbarui entri, aset, dan referensi yang sudah ada saat paket konten diimpor ulang, sehingga kegagalan referensi duplikat yang dilaporkan ditangani pada batas persistensi.

## Varian tenten berarah

Hanya bentuk dakuten (tenten) yang memakai hubungan induk/turunan berarah. Data bawaan `じ`/`ご` dan `ジ`/`ゴ` masing-masing merujuk `し`/`こ` dan `シ`/`コ` di dalam tabel karakternya sendiri. Pasangan hiragana dan katakana tetap berupa data mandiri dan tidak dimodelkan sebagai induk dan turunan.

## Kontrak penyajian Pustaka terbaru

Tautan tenten berarah tidak lagi mendeklarasikan peran resolver, sehingga Pustaka hanya memakainya untuk membuka kartu turunan dan tidak menduplikasi induk sebagai kotak unsur. Hubungan bacaan kanji dan ejaan kata tetap memiliki peran resolver untuk unsur yang dapat dinavigasi. Pustaka terkini menempatkan pelafalan unit tulisan di samping label pada kartu dan judul detail, serta memulihkan konten modul yang hilang saat pengaktifan berikutnya kecuali hash kontennya diblokir secara eksplisit oleh pengguna.

## Komposisi dan definisi

Peran resolver kini hanya dipakai untuk komposisi sejati: bacaan kanji, ejaan kata, serta kata atau partikel kalimat yang berurutan. Hubungan ke lapisan definisi semantik tidak lagi mendeklarasikan resolver, sehingga tautan definisi utama dan alternatif dirender sebagai makna, bukan grup komposisi. Filter wajib sistem tulisan dan tingkat kemahiran juga mendeklarasikan tag bawaan yang disengaja untuk kontrak filter Pustaka terbaru.

## Tabel kana lengkap

Paket konten kini memuat seluruh 46 entri gojūon dasar dalam hiragana dan katakana, beserta semua bentuk dakuten dan handakuten standar. Masing-masing dari 25 turunan bersuara atau setengah bersuara per aksara merujuk induk tanpa tandanya dalam tabel karakter yang sama, termasuk `が` → `か`, `じ` → `し`, `ぱ` → `は`, dan padanan katakananya.

## Penempatan diakritik terpisah

Kedua relasi secara eksplisit mendeklarasikan `variant: true`, sebagaimana diwajibkan ketika `variantDirection` ada. Anak dakuten menggunakan relasi `dakuten-of` dan dibuka di sebelah kanan induk tanpa tandanya. Anak handakuten menggunakan `handakuten-of` dan dibuka di sebelah kirinya, sehingga induk seperti `は` dan `ハ` tetap menampilkan kedua varian tanpa menumpuknya pada satu posisi.

## Kisi kana standar

Lapisan karakter meminta baris berisi lima kartu dan mencantumkan kedua sistem tulisan dalam urutan gojūon standar. Sel kosong eksplisit mempertahankan celah pada baris `y` dan `w`, sedangkan dakuten dan handakuten tetap menjadi anak berarah di sekitar induk tanpa tanda alih-alih menempati sel bagan duplikat.

## Kartu berbasis definisi dan celah kisi eksplisit

Diselaraskan dengan kontrak tampilan Pustaka terbaru: kata, partikel, dan kalimat kini meminta teks kartu terlokalisasi yang berbasis definisi, dan setiap entri tersebut memiliki referensi definisi wajib. Celah bagan kana memakai penanda eksplisit `{ "blank": true }`, bukan nilai null lama.

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
- [e9ae382](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e9ae382be9ed7fd23b4a323f081904ad9137410f)
- [92032ec](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/92032ecd30c7bee0dbcb76007108ef12e6a892e8)
- [b9f3e6e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b9f3e6eb6813d99d5ee76902729bc478fe36afd1)
- [90bac12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/90bac12fb8d4c90451b6a0ae2e9c0572be99cbd0)
- [4a0b288](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4a0b28830b5a1d6fcea2df490e74e99108d1e4dd)
- [32b43de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32b43dec923a4fc7a62401bb21b5b01259cb311e)
- [c7a745f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c7a745f39078cb5cb4d4206ce20a855aed195a22)

- [5ab8006](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5ab80067e1e3151a86f648cedf7660167a1f6f15)

- [32ac841](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32ac8416bbf3676b3cecdde536e645e24941f81a)

- [ed1fd35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ed1fd35e5235f79773ba91bd1d28377365509e2b)

- [e5c86a4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5c86a4cf17408e92c5021015ff4404c2e5802b6)

- [2a56248](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2a562481c79002aa62a1ab51de91b7543c1acd18)
