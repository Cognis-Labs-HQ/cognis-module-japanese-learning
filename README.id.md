# Cognis Bahasa Jepang

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Cognis Bahasa Jepang adalah paket konten bahasa Jepang deklaratif untuk Pustaka Study Cognis. Paket ini menyediakan skema berversi serta data karakter, definisi, kata, partikel, dan kalimat tervalidasi tanpa memiliki rute API, persistensi, atau antarmuka peramban.

## Persyaratan

- Cognis dengan gateway Study dan adaptor Pustaka yang aktif.
- Kapabilitas host `study:library`.

Modul eksternal mendeklarasikan gateway Study sebagai dependensi komponennya. Modul menemukan adaptor Pustaka melalui kapabilitas wajib `study:library`, bukan memperlakukan UUID adaptor sebagai komponen yang dapat dipasang secara mandiri.

## Pengembangan

```sh
npm install
npm test
npm run check:manifest
```

Saat bootstrap, modul memperoleh `study:library` melalui `ctx` dan memanggil `ingestContentPack` untuk `data/library`. Cognis menangani keamanan jalur, validasi graf, ID internal stabil, transaksi, idempotensi, persistensi, rute API, dan antarmuka Study yang dibuat dari skema.

Karena deskripsi bahasa tidak mendeklarasikan halaman turunan yang dapat dijalankan, Cognis Study menyediakan tujuan Pustaka yang dihasilkan di `/study/library?language=ja`. Parameter bahasa tervalidasi dipertahankan pada tautan Pustaka, navigasi detail, pemuatan langsung, dan riwayat peramban; pelajar terautentikasi dapat membaca sementara aturan cakupan Pustaka tetap melindungi penulisan dan penerbitan.

Manifest paket konten mencatat penerbit, versi paket yang tidak dapat diubah, revisi konten, jalur skema dan konten, serta lisensi. `schema.json` mendeklarasikan lapisan khusus bahasa Jepang, kolom bertipe, hubungan, kardinalitas, urutan, dan resolver. Berkas konten menggunakan ID lokal paket yang stabil dan referensi eksplisit.

ID data lokal paket hanya menggunakan huruf kecil dan angka ASCII portabel, pemisah, serta titik dua; glif bahasa Jepang ditempatkan di `label`, bukan di `id`. Aturan ini menjaga kompatibilitas ingest dengan kontrak pengenal data Pustaka.

Skema dan paket berbagi namespace `ja`, dan setiap ID data diawali `ja:`. Metadata skema, lapisan, kolom, dan hubungan menyediakan label terlokalisasi dalam bahasa Jerman, Inggris, Indonesia, dan Jepang. Peran semantik, nilai bertipe, petunjuk detail, kompatibilitas aktivitas, jalur minat, target wajib, posisi berurutan, perilaku penghapusan, dan peran resolver memungkinkan Cognis menghasilkan antarmuka netral serta menegakkan kontrak lengkap.

Manifest modul eksternal menerbitkan `/static/modules/study-language-ja/languages` agar Cognis dapat menerjemahkan metadata marketplace sebelum bootstrap modul.

Deskriptor bahasa yang diterbitkan menyediakan nilai `code` kanonis `ja` sekaligus nilai `languageCode` yang kompatibel. Cognis PR #215 menggunakan kode tersebut untuk menandai tombol bahasa aktif dan mempertahankan bahasa terpilih dalam riwayat router saat tujuan subnavigasi Study dibuka.

Lapisan kamus `definitions` mendeklarasikan lokalisasi definisi milik modul dengan kunci string stabil `japanese:definitions:*` dan bidang `localizedText` bertipe. Setiap definisi bawaan memuat teks bahasa Jerman, Inggris, Indonesia, dan Jepang agar konsumen dapat menyelesaikan string tampilan tanpa bergantung pada data bahasa di inti Cognis.

## Audio unit tulisan dan partikel

Unit tulisan atomik dan gabungan kini menyediakan daftar pelafalan wajib serta referensi audio HTTPS tanpa menyertakan media biner. Lapisan partikel khusus menyimpan metadata fungsi tata bahasa, dan catatan kalimat dapat mempertahankan referensi kata dan partikel yang berurutan.

## Makna asli Pustaka

Kolom duplikat `romanization`, `reading`, `readings`, `meaning`, `function`, dan bahasa definisi telah dihapus. Pelafalan kini memakai kolom `pronunciation` yang dikenali Pustaka secara konsisten, sedangkan kanji, kata, dan partikel menyatakan makna melalui hubungan ke data definisi terlokalisasi.

## Bacaan kanji berbasis kana

Setiap bacaan kanji merupakan entri kosakata tersendiri dengan referensi `kana-spelling` berurutan yang mengelompokkan karakter hiragana persisnya. Kanji menautkan entri bacaan tersebut menurut urutan pelafalan, sehingga bacaan multikana tetap terpisah satu sama lain. Karakter katakana mempertahankan ID dan tautan tersendiri serta tetap tersedia bagi konten yang benar-benar ditulis dalam katakana.

## Kontrak aktivasi Pustaka terkini

Filter lencana sistem tulisan dan JLPT kini mendeklarasikan grup filter bernama yang saling eksklusif dan didukung oleh Library 2.6. Modul sengaja tidak mengaktifkan `allowBootstrapFailure`: ingest konten dan publikasi `study:language:ja` adalah pekerjaan runtime utamanya, sehingga mempertahankan modul aktif tanpa keduanya hanya menghasilkan modul yang tidak berfungsi. Cognis PR #216 kini memperbarui entri, aset, dan referensi yang sudah ada saat paket konten diimpor ulang, sehingga kegagalan referensi duplikat yang dilaporkan ditangani pada batas persistensi.

## Varian kana bertingkat

Varian kana tetap berada dalam sistem tulisannya sendiri dan kini mencakup dakuten, handakuten, kana kecil, seluruh kontraksi yōon standar, serta geminasi sokuon umum. Rantai induk mempertahankan struktur bahasa, termasuk `し` → `じ` → `じゃ`, sedangkan hiragana dan katakana tetap terpisah.

## Kontrak penyajian Pustaka terbaru

Relasi varian tidak memiliki peran resolver atau arah tetap. Pustaka secara dinamis memilih posisi kiri, atas, atau kanan dan membuka anak bertingkat secara rekursif, sedangkan bacaan Kanji dan ejaan kata tetap memakai peran resolver untuk unsur yang dapat dinavigasi.

## Komposisi dan definisi

Peran resolver kini hanya dipakai untuk komposisi sejati: bacaan kanji, ejaan kata, serta kata atau partikel kalimat yang berurutan. Hubungan ke lapisan definisi semantik tidak lagi mendeklarasikan resolver, sehingga tautan definisi utama dan alternatif dirender sebagai makna, bukan grup komposisi. Filter wajib sistem tulisan dan tingkat kemahiran juga mendeklarasikan tag bawaan yang disengaja untuk kontrak filter Pustaka terbaru.

## Tabel kana lengkap

Selain seluruh 46 entri gojūon dasar dan 25 bentuk dakuten atau handakuten per aksara, paket memuat kana kecil, seluruh rangkaian yōon standar, serta geminasi sokuon umum. Contohnya mencakup `ひゃ`, `しゅ`, `じゃ`, dan `って`, beserta padanan katakananya.

## Penempatan varian dinamis

Setiap relasi induk karakter hanya mendeklarasikan `variant: true`; tidak ada yang meminta `variantDirection`. Pustaka dapat memilih posisi kosong saat runtime dan menampilkan rantai bertingkat tanpa benturan slot yang ditentukan modul.

## Kisi kana standar

Lapisan karakter meminta baris lima kartu dan mencantumkan kedua aksara dalam urutan gojūon standar. Kisi hanya berisi kana dasar; seluruh bentuk kecil, bersuara, gabungan, dan rangkap dibuka sebagai turunan varian dari karakter utamanya.

## Kartu berbasis definisi

Diselaraskan dengan kontrak tampilan Pustaka terbaru: kata, partikel, dan kalimat kini meminta teks kartu terlokalisasi yang berbasis definisi, dan setiap entri tersebut memiliki referensi definisi wajib.

## Label lapisan khusus bahasa Jepang

Tab Pustaka yang dihasilkan kini memakai label bidang milik modul: Kana untuk karakter atomik, Kanji untuk unit tulisan gabungan, dan Kosakata untuk kata. Bacaan kanji menargetkan entri kosakata yang dikelompokkan, bukan rangkaian referensi karakter yang diratakan.

## Urutan kana yang aman untuk filter

Penanda kosong tanpa syarat di antara urutan hiragana dan katakana telah dihapus. Saat filter sistem tulisan menyembunyikan salah satu aksara, tabel yang dipilih kini dimulai dari sel kisi pertama tanpa mewarisi sel kosong dari tabel tersembunyi.

## Kartu Kana ringkas

Hanya lapisan karakter Kana yang menetapkan `minimal: true`, sehingga bagan menampilkan kartu ringkas berisi label kana utama. Kanji, Kosakata, dan Kalimat tetap mempertahankan tampilan pelafalan, definisi, metadata, dan komposisi lengkap.

## Entri gabungan yang terselesaikan sepenuhnya

Gabungan berurutan kini selaras dengan pembatasan prapemeriksaan Pustaka terbaru. Setiap karakter kalimat dicakup oleh referensi kata atau partikel yang berurutan tanpa celah; `日本語が好き` kini menyertakan entri kosakata `好き` yang sebelumnya hilang. Relasi resolver juga menyatakan apakah relasi tersebut menyajikan komposisi atau pelafalan lengkap.
