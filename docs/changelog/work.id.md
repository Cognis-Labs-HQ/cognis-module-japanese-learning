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

Setiap bacaan kanji merupakan entri kosakata tersendiri dengan referensi `kana-spelling` berurutan yang mengelompokkan karakter hiragana persisnya. Kanji menautkan entri bacaan tersebut menurut urutan pelafalan, sehingga bacaan multikana tetap terpisah satu sama lain. Karakter katakana mempertahankan ID dan tautan tersendiri serta tetap tersedia bagi konten yang benar-benar ditulis dalam katakana.

## Kontrak aktivasi Pustaka terkini

Filter lencana sistem tulisan dan JLPT kini mendeklarasikan grup filter bernama yang saling eksklusif dan didukung oleh Library 2.6. Modul sengaja tidak mengaktifkan `allowBootstrapFailure`: ingest konten dan publikasi `study:language:ja` adalah pekerjaan runtime utamanya, sehingga mempertahankan modul aktif tanpa keduanya hanya menghasilkan modul yang tidak berfungsi. Cognis PR #216 kini memperbarui entri, aset, dan referensi yang sudah ada saat paket konten diimpor ulang, sehingga kegagalan referensi duplikat yang dilaporkan ditangani pada batas persistensi.

## Varian kana bertingkat

Varian kana tetap berada dalam sistem tulisannya dan mencakup dakuten, handakuten, kana kecil, kontraksi yōon standar, serta geminasi sokuon umum. Setiap bentuk kontraksi menaut langsung ke kana yang menyediakan bunyi utamanya: `きゃ`, `きゅ`, dan `きょ` semuanya menaut ke `き`, sedangkan `じゃ`, `じゅ`, dan `じょ` semuanya menaut ke `じ`. Induk bersuara tetap menaut ke bentuk tak bersuaranya sehingga tingkatan bermakna `し` → `じ` → `じゃ` dipertahankan.

## Kontrak penyajian Pustaka terbaru

Relasi varian tidak memiliki peran resolver atau arah tetap. Pustaka secara dinamis memilih posisi kiri, atas, atau kanan dan membuka anak bertingkat secara rekursif, sedangkan bacaan Kanji dan ejaan kata tetap memakai peran resolver untuk unsur yang dapat dinavigasi.

## Komposisi dan definisi

Peran resolver kini hanya dipakai untuk komposisi sejati: bacaan kanji, ejaan kata, serta kata atau partikel kalimat yang berurutan. Hubungan ke lapisan definisi semantik tidak lagi mendeklarasikan resolver, sehingga tautan definisi utama dan alternatif dirender sebagai makna, bukan grup komposisi. Filter wajib sistem tulisan dan tingkat kemahiran juga mendeklarasikan tag bawaan yang disengaja untuk kontrak filter Pustaka terbaru.

## Tabel kana lengkap

Selain seluruh 46 entri gojūon dasar dan 25 bentuk dakuten atau handakuten per aksara, paket memuat kana kecil, seluruh rangkaian yōon standar, serta geminasi sokuon umum. Contohnya mencakup `ひゃ`, `しゅ`, `じゃ`, dan `って`, beserta padanan katakananya.

## Penempatan varian dinamis

Setiap relasi induk karakter hanya mendeklarasikan `variant: true`; tidak ada yang meminta `variantDirection`. Pustaka dapat memilih posisi kosong saat runtime dan menampilkan rantai bertingkat tanpa benturan slot yang ditentukan modul.

## Kisi kana standar

Lapisan karakter meminta baris lima kartu dan membatasi setiap aksara tepat sepuluh baris. Baris terakhir menempatkan `を`/`ヲ` di tengah dan `ん`/`ン` di akhir. Bentuk lanjutan tetap di luar kisi dan dibuka melalui rantai induk karakternya.

## Kartu berbasis definisi

Diselaraskan dengan kontrak tampilan Pustaka terbaru: kata, partikel, dan kalimat kini meminta teks kartu terlokalisasi yang berbasis definisi, dan setiap entri tersebut memiliki referensi definisi wajib.

## Label lapisan khusus bahasa Jepang

Tab Pustaka yang dihasilkan kini memakai label bidang milik modul: Kana untuk karakter atomik, Kanji untuk unit tulisan gabungan, dan Kosakata untuk kata. Bacaan kanji menargetkan entri kosakata yang dikelompokkan, bukan rangkaian referensi karakter yang diratakan.

## Celah bagan kana yang terlihat

Setiap aksara memiliki empat sel `{ "blank": true }` eksplisit: dua pada baris `y` dan dua pada baris gabungan `w`/`n`. Hiragana tidak lagi memiliki baris kosong di belakang, dan Katakana dimulai tepat pada batas baris berikutnya tanpa celah awal warisan.

## Kartu Kana ringkas

Hanya lapisan karakter Kana yang menetapkan `minimal: true`, sehingga bagan menampilkan kartu ringkas berisi label kana utama. Kanji, Kosakata, dan Kalimat tetap mempertahankan tampilan pelafalan, definisi, metadata, dan komposisi lengkap.

## Entri gabungan yang terselesaikan sepenuhnya

Gabungan berurutan kini selaras dengan pembatasan prapemeriksaan Pustaka terbaru. Setiap karakter kalimat dicakup oleh referensi kata atau partikel yang berurutan tanpa celah; `日本語が好き` kini menyertakan entri kosakata `好き` yang sebelumnya hilang. Relasi resolver juga menyatakan apakah relasi tersebut menyajikan komposisi atau pelafalan lengkap.

## Bentuk tsu kecil tersembunyi

Setiap entri mandiri atau gabungan yang mengandung `っ` atau `ッ` kini menetapkan `hidden: true`. Rekamannya tetap berada dalam paket dengan referensi induk yang ada untuk resolusi dan detail, tetapi entri serta turunannya tidak lagi dapat muncul di akhir bagan Kana yang dijelajahi langsung.

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

- [f6ace9e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f6ace9e86c0c27634edeba5ffb98e429bfd2be4f)

- [64682aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64682aa25ecd32bf106613dec2b8a26812e1fba5)

- [06f4b09](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/06f4b09449d44ca464c31f11464fd474bddf4fcd)

- [0912c79](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0912c79cff5ba0fce67cd2c9ec6e10da11331a64)

- [a8e559e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a8e559e3bfad5bbf1c1778dd4a9505c83bc04f8d)

- [7f8cc35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7f8cc35b43f92480c77dba4807bf4f237e4ebd8d)

- [e5eae65](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5eae656076a0bcb31c74e7f388c06b4ed790815)

- [6677a4f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6677a4f80b97c2d3f056b189002e2c0f30f88e22)

- [b314603](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b314603e775c02a12ee16c3c718618a4077125bc)

## Celah Kana yang mengikuti filter

Empat celah bagan eksplisit digunakan bersama oleh posisi kisi Hiragana dan Katakana yang berpasangan. Penyelang-selingan setiap entri aksara yang sesuai memungkinkan filter Pustaka menghapus aksara yang tidak aktif tanpa meninggalkan celahnya di awal atau akhir bagan terpilih.

- [eaae470](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eaae470ad48226b0f1c3e931748511eae7178bb1)

## Graf penghapusan Kana yang lengkap

Rekaman kosakata `好き` kini mendeklarasikan ejaan Kana `す` dan `き` secara berurutan. Dengan demikian, rekaman ini mengikuti graf dependensi referensi yang sama seperti semua entri kosakata lain dan disertakan saat Cognis mempratinjau atau menjalankan penghapusan berantai bagan Kana.

- [408a5c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/408a5c957033a9200286e9fed7e9a6d0fbfa3873)

## Identitas varian Kana yang stabil

Paket diterbitkan ulang untuk perlindungan identitas Pustaka terbaru. Setiap rekaman Kana memiliki identitas konten yang berbeda dan setiap referensi varian menunjuk ke rekaman induk yang berbeda, sehingga impor ulang dapat membangun kembali edge lama tanpa merender induk sebagai anaknya sendiri.

- [01606c4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/01606c49ade781db72f6652ca779517732eed7a6)

## Hierarki anak Kana eksplisit

Relasi induk Kana kini selaras dengan kontrak Pustaka terbaru dengan ditandai sebagai varian sekaligus anak spasial. Karena bagian relasi duplikat disembunyikan, bidang eksplisit `usage_note` tidak lagi diperlukan dan telah dihapus bersama empat nilai rekamannya.

- [6734506](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/67345060175f87f4a73e1f07598efcb2df814edb)

## Kosakata bacaan Kanji kanonis

Rekaman leksikal `人` yang duplikat telah dihapus. Entri Kanji kini hanya menunjuk ke bacaan Kosakata `じん`, `にん`, dan `ひと` yang berbeda; setiap bacaan tersusun dari rekaman Hiragana yang sesuai dan memiliki referensi definisi langsungnya sendiri.

- [986261f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/986261f57188d939eb014e4f07eb2d90ed85059d)

## Kontrak kepemilikan modul PR 220

Modul kini secara eksplisit meminta hak istimewa tepercaya karena menerbitkan kapabilitas standar `study:language:ja` di luar namespace milik modul. Provenans repositori Cognis Labs memungkinkan host memverifikasi permintaan tersebut, sementara akses Pustaka tetap berbasis kapabilitas dan semua registrasi tetap dimiliki siklus hidup.

- [d1efe4b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d1efe4b52184c4cdc77843441c2dfa7948339afe)

## Relasi Pustaka terdekat yang dideklarasikan

Komposisi kini memakai rekaman terdekat yang tersedia: `日本語` menaut ke kata `日本` dan Kanji `語`, sedangkan `日本` menaut ke Kanji `日` dan `本`. Ejaan alternatif Kana berurutan menyediakan tautan langsung untuk pelafalan, dan setiap bidang mendeklarasikan kontrol editor milik penyedia beserta opsi terlokalisasi.

- [8e8323e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8e8323e9d435685a54cbdd0ae87b56391d637ff2)

## Tautan Kana Langsung untuk Pelafalan Kanji

Kartu Kanji dengan beberapa bacaan kini menyelesaikan setiap pelafalan yang ditampilkan langsung ke rekaman Hiragana penyusunnya. Rekaman bacaan Kosakata tetap tersedia untuk definisi dan pembelajaran tanpa menghasilkan tautan pelafalan rekursif.

- [f3faf6c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3faf6ccbd41bd5709996a9b7d6fb31174a2c437)

## Kosakata Bacaan Kanji yang Disembunyikan

Pelafalan Kanji kini tertaut ke satu rekaman bacaan Kosakata lengkap untuk setiap bacaan, lalu setiap bacaan tertaut ke ejaan Kana atomiknya yang berurutan. Rekaman khusus bacaan disembunyikan dari penjelajah tetapi tetap dapat dibuka melalui tautan; semua rekaman Kosakata biasa tetap terlihat.

- [cb5c46a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cb5c46a541006afea645504178fd86f788b4565f)

## Segmen Pelafalan Kata Majemuk yang Ditulis

Pelafalan kata majemuk yang ditentukan kini tertaut melalui rekaman bacaan tersembunyi terbesar yang telah ditulis, bukan langsung melalui Kana atomik. `日本語` menyelesaikan `にほんご` sebagai bacaan tersembunyi `にほん` yang terkait dengan `日本`, diikuti bacaan `ご` yang terkait dengan `語`; rekaman tersebut kemudian menyelesaikan ke Kana berurutan.

- [eff02dd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eff02dd26396e0198e63e51b24758701f05d00d2)

## Definisi Kosakata Kontekstual

Kosakata bacaan Kanji tersembunyi kini memiliki definisi empat bahasa untuk penggunaan yang lebih sempit, seperti penghitung orang `にん` dan akhiran kebangsaan `じん`, alih-alih memakai ulang makna Kanji yang luas. Standar penulisan membatasi fallback definisi sumber Cognis hanya untuk makna yang benar-benar sama dan dibuka melalui navigasi entri terkait, karena komposisi judul serta navigasi sebelumnya/berikutnya sengaja menghapus konteks tersebut.

- [d52fcb2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d52fcb2578d7854a9e36361a5077dc2276e05115)

## Set Data Deklaratif yang Diperluas Secara Dramatis

Lebih dari tiga puluh rekaman Kosakata sehari-hari, sepuluh partikel, dan delapan kalimat tersusun penuh dengan definisi empat bahasa ditambahkan sepenuhnya sebagai JSON data. Polisemi sejati memakai beberapa definisi pada satu rekaman (`なおす`), sedangkan homofon seperti jembatan/sumpit `はし`, hujan/permen `あめ`, serta kertas/rambut/dewa `かみ` tetap menjadi rekaman Kosakata terpisah dengan makna mandiri.

- [a538833](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a538833e990505cad9b817cb9995b1cf2b8bab5e)

## Inti Tinjauan dan Tautan Kana Dipulihkan

Perluasan partikel komprehensif, Kanji hasil generasi, kalimat, dan bacaan yang belum ditinjau telah dihapus sehingga paket kembali ke inventaris ringkas yang telah ditinjau. Setiap rekaman yang dipertahankan kini memiliki kelas kontraknya dan lulus pemeriksaan tautan berdasarkan lapisan. Kartu utama Kana tetap berupa Kana: `せんせい` menaut langsung ke `せ`, `ん`, `せ`, dan `い`, tanpa menampilkan kartu bacaan guru yang terputus.

- [70b6951](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/70b6951274722f1506bb75dfd9db0bc808f70651)

## Traversal Lengkap dari Kanji ke Kana

Setiap rekaman Kosakata inti yang terlihat kini menggunakan bentuk Kanji konvensional dan terhubung melalui graf tertulis yang lengkap. Kalimat hanya menaut ke Kosakata terlihat dan partikel; Kosakata menaut ke Kanji dan segmen bacaan tersembunyi; bacaan tersembunyi dibentuk kembali dari Kana atomik berurutan. `私は学生` kini mengikuti `私` → `わたし` → `わ`・`た`・`し`, `は`, dan `学生` → `がく`・`せい` → `が`・`く`・`せ`・`い`. Pengujian regresi menolak setiap lapisan yang dilewati.

- [65ff45a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/65ff45affebb7a647d7ee3012eb9e8999e4de7b0)

## Kontrol Rekaman Terbaru PR 226

Rekaman penyedia telah diselaraskan dengan kontrak paket eksternal Study Library terbaru. Definisi secara eksplisit disembunyikan dengan kelas khusus host `definition`, kalimat memakai kelas `composite`, dan partikel memakai kelas `particle` dengan `editable: false`. Pengujian kontrak memverifikasi nilai yang dinormalisasi ini sebelum pemasukan agar rekaman terpasang dan hash penyedia tetap konsisten.

- [e74c036](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e74c0362e8a1fb9e15bdc58b80c2e1c7eb0d07f3)

## Komposisi Bacaan Infleksional yang Benar

Bacaan lengkap tersembunyi kini menggunakan relasi khusus komposisi `reading-kana` untuk akhiran Kana nonleksikal, bukan menyalahgunakan `kana-spelling` parsial sebagai pelafalan alternatif. Bacaan `なおす` menyusun `なお` yang bermakna melalui Kosakata bacaan `直` tersembunyi dan menautkan akhiran tunggal `す` langsung ke Kana atomik, sehingga kartu tidak lagi menampilkan hanya bagian akhir sebagai pelafalan.

- [1bb8457](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1bb84576d96472bba37b33163a9fbc3b292954ab)

## Induk Bacaan Tanpa Duplikasi

Rekaman leksikal satu Kanji kini menaut ke pembungkus pelafalan lengkap tersembunyi khusus yang tersusun dari Kosakata bacaan Kanji dasarnya. Bacaan seperti `ねこ` dengan demikian digunakan oleh Kanji `猫` dan pembungkus tersembunyi `ねこ` yang berlabel berbeda, bukan oleh dua kartu `猫` yang tampak sama. Pengujian regresi seluruh graf menolak induk berlabel duplikat untuk setiap bacaan tersembunyi.

- [d5c257d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d5c257df1f91978090c7e9ea9f85ded883847c06)

## Pelafalan Kalimat yang Tertaut Sepenuhnya

Setiap pelafalan kalimat kini diselesaikan melalui rekaman pelafalan lengkap tersembunyi. Rentang leksikal menggunakan bacaan kata tersembunyi terdekat, sedangkan partikel dan Kana tunggal nonleksikal lainnya ditautkan langsung melalui `reading-kana`; pengujian menolak teks yang tidak dapat direkonstruksi. Delapan kalimat latihan yang beragam dan telah ditinjau beserta kosakata `学ぶ` dan `歩く` yang tertaut sepenuhnya memperluas kurikulum tanpa isian buatan templat.

- [d90876c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d90876c607bf4a34f628d27429e38264943f1c2d)

## Semantik Bacaan Tanpa Siklus

Penghitung hari leksikal `か` kini merupakan Kosakata `lexical:counter` yang terlihat, bukan rekaman implementasi bacaan Kanji yang tersembunyi. Pemeriksaan seluruh graf yang baru menolak siklus komposisi maju dan mewajibkan Kana mengakhiri penelusuran tautan pembelajaran. Masalah navigasi balik berlabel sama yang tersisa dicatat sebagai tindak lanjut host Study Library karena modul harus mempertahankan relasi ejaan kata-ke-Kanji yang diwajibkan.

- [07f7a0c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/07f7a0c2e298debdc71965f63a380f5f84fc8c37)

## Navigasi Bacaan Kana Langsung

Judul pelafalan tersembunyi kini disusun langsung dari tautan Kana atomik masing-masing. Membuka bacaan Kanji tidak lagi mengarah melalui kartu bacaan turunan Kanji lain atau menampilkan ejaan alternatif pada detail judul kartu.

- [631e76b6c2471aff02f37e982ece772fe7ad266c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/631e76b6c2471aff02f37e982ece772fe7ad266c)

## Komposisi Bacaan yang Aman Diaktifkan

Judul bacaan kini memakai relasi komposisi khusus `reading-kana`, sedangkan `kana-spelling` mempertahankan peran ejaan alternatif yang didukung. Navigasi judul langsung ke Kana tetap tersedia tanpa membuat validasi paket konten menolak pengaktifan modul.

- [2187c82db49d331797cbb015e4665ad7ccb5264b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2187c82db49d331797cbb015e4665ad7ccb5264b)

## Kartu Kosakata dan Kana Kanonis

Pembungkus Kosakata pelafalan yang berlebihan telah dihapus. Kosakata Kanji terlihat kini menaut langsung ke Kanji dan Kana atomik, bacaan Kanji mengutamakan entri leksikal terlihat yang cocok seperti `猫`, dan bacaan tersembunyi yang tersisa memakai kelas pelafalan alih-alih tampil sebagai Kanji. Kartu Kana kini memiliki satu lencana sistem tulisan tanpa tag kelas ganda.

- [697459a2379a0d11ce7fcc1ad947dacbe7d556a3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/697459a2379a0d11ce7fcc1ad947dacbe7d556a3)

## Berkas Konten yang Dapat Diimpor

Dua berkas JSON Kosakata kosong yang tersisa setelah normalisasi bacaan telah dihapus. Setiap berkas konten yang ditemukan kini berisi sedikitnya satu data sehingga pengimpor Study Library tidak mencoba memeriksa data yang tidak terdefinisi saat modul diaktifkan.

- [423a3250facb90f3435fc28faee469aa63bacceb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/423a3250facb90f3435fc28faee469aa63bacceb)

## Graf Bacaan yang Dapat Diimpor Dipulihkan

Perombakan luas graf leksikal yang menyebabkan pengaktifan Study Library gagal di dalam transaksi basis data telah dibatalkan. Paket kembali memakai struktur bacaan berlapis yang sebelumnya dapat diimpor sambil mempertahankan koreksi komposisi `reading-kana` yang didukung, serta menggunakan revisi konten baru agar host mencoba pengimporan kembali.

- [3ab7d2577f18d204465863ce3c820b8fe153d8be](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3ab7d2577f18d204465863ce3c820b8fe153d8be)

## Migrasi Kartu Kanonis Bertahap

Graf kartu yang disederhanakan diterapkan tanpa menghapus data penyedia yang mungkin sudah ada dalam instalasi. Kartu Kanji dan Kosakata aktif kini menaut langsung ke endpoint leksikal, Kanji, dan Kana yang tepat; bacaan tersembunyi yang digantikan dilepas tetapi dipertahankan untuk pembaruan basis data yang aman. Kartu khusus bacaan tidak lagi mengaku sebagai kelas Kanji dan kartu Kana tidak lagi mengulang tag sistem tulisannya.

- [997392f71fd178e43599bc8d27be786839b98b8b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/997392f71fd178e43599bc8d27be786839b98b8b)

## Solusi Instalasi melalui Peningkatan Skema

Skema konten bahasa Jepang dinaikkan ke revisi 46 agar Cognis menyisipkan skema yang telah dibersihkan, bukan menjalankan perintah pembaruan skema versi-sama yang rusak dari PR #226. Tindak lanjut host didokumentasikan secara tepat: perintah tersebut memberikan `values`, padahal gateway basis data terstruktur memerlukan `set`, sehingga PostgreSQL menghasilkan kegagalan `Object.entries(undefined)` yang dilaporkan.

- [bb20511152a80522055af67e6895ff28e5d9b8c8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bb20511152a80522055af67e6895ff28e5d9b8c8)

## Data Bacaan Usang Dihapus Sepenuhnya

Seluruh 48 data bacaan tersembunyi yang usang telah dihapus alih-alih mempertahankan data kompatibilitas yang dilepas. Paket kini hanya berisi graf kanonis aktif, mengurangi inventaris Kosakata dari 133 menjadi 85 data sambil mempertahankan navigasi langsung Kanji, leksikal, dan Kana atomik.

- [b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4)

## Penggunaan Kanji dan Kana Simetris

Dependensi nonpresentasional ditambahkan dari setiap Kanji ke seluruh Kana atomik yang digunakan bacaannya. Setelah mengikuti `日` melalui penghitung hari leksikal `か` menuju `か` atomik, kartu Kana kini mencantumkan `日` pada Digunakan Oleh; invariant yang sama diberlakukan pada seluruh inventaris Kanji.

- [0fcae71e11836dbce3361184c378e46a2ee0d430](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0fcae71e11836dbce3361184c378e46a2ee0d430)

## Tautan Pelafalan Komposit yang Logis

Tautan judul kalimat per karakter diganti dengan segmen leksikal dan partikel yang telah ditinjau. Pelafalan lengkap kini memakai kembali segmen bacaan kata tersembunyi kanonis dan partikel utuh; misalnya, `ちいさいねこがすき` tertaut sebagai `ちいさい`・`ねこ`・`が`・`すき`, lalu setiap kata diselesaikan ke Kana atomik.

- [973980b8e821218608836970f51a0eefc75bfb11](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/973980b8e821218608836970f51a0eefc75bfb11)

## Komposisi Kalimat Milik Induk

Rantai bacaan kalimat Kana lengkap paralel telah dihapus. Kalimat seperti `猫が好き` kini hanya memiliki tautan ke `猫`, `が`, dan `好き` yang terlihat; setiap kata Kanji memiliki tepat satu anak Kana lengkap (`ねこ` atau `すき`), dan anak tersebut hanya diselesaikan ke Kana atomik, bukan ke saudara dalam kalimat.

- [274238c377ebb0a5ce4759456a0d433df83810da](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/274238c377ebb0a5ce4759456a0d433df83810da)

## Bacaan Kalimat yang Tertaut ke Kosakata

Detail judul kalimat kini menggunakan hubungan `words` yang sudah ada, sehingga rentang Kana lengkap seperti `いぬ`, `やま`, dan `くる` menargetkan entri kosakata `犬`, `山`, dan `来る` yang terlihat. Setiap entri kosakata tetap hanya berlanjut melalui bacaan lengkapnya sendiri menuju Kana atomik; tidak ada rantai bacaan kalimat paralel maupun tautan antarbacaan saudara.

- [3bc0779](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3bc0779)

## Pelafalan Kanji Milik Kosakata

Tautan pelafalan Kanji kini mengutamakan kosakata terlihat yang memakai bacaan tersebut. Hanya kosakata itu yang memiliki pembungkus pelafalan lengkap, yang memakai ulang rentang bacaan Kanji bermakna dan mengarahkan sufiks Kana tunggal yang tersisa langsung ke Kana atomik. Contohnya, `好` tertaut ke `好き`, sedangkan bacaan lengkap `すき` memakai rentang Kanji `す` dan `き` atomik tanpa membuat kartu pelafalan `き` tersendiri.

- [b20b4e3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b20b4e3)

## Tautan Pelafalan Kalimat Lengkap

Metadata pelafalan kalimat kini mendeklarasikan hubungan kata dan partikel sebagai sumber tautan mendalam. Dengan demikian `がっこうにいく` diuraikan menjadi kosakata `学校` yang terlihat, partikel `に`, dan kosakata `行く` yang terlihat, sambil mempertahankan graf milik kalimat tanpa rekaman bacaan lengkap sintetis.

- [860a01e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/860a01e)

## Kartu Menulis Berpanduan Goresan

Kartu Kana dan Kanji diselaraskan dengan kontrak menggambar terbaru Cognis PR #226 melalui metadata `strokePattern` ternormalisasi yang wajib, sampel waktu berurutan, dan toleransi latihan. Pola turunan KanjiVG mempertahankan atribusi CC BY-SA 3.0, dan serpihan konten dibagi untuk mematuhi batas ukuran berkas repositori.

- [ba7857b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ba7857b)

## Tautan Kana Kosakata Dipulihkan

Setiap lapisan yang memiliki pelafalan kini menerbitkan larik `input.linkRelationships` terkini yang digunakan Cognis PR #226. Kosakata seperti `猫` mengekspos target `pronunciation-readings` melalui kontrak tersebut sehingga `ねこ` yang ditampilkan membuka entri pelafalan yang dibuat; bacaan Kanji dan tautan Kana partikel memakai bentuk metadata terkini yang sama.

- [046b335](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/046b335)

## Tautan Pelafalan Hanya dengan Kontrak Terkini

Metadata tunggal `linkRelationship` yang usang dihapus alih-alih mempertahankan jalur kompatibilitas dalam skema konten beta. Bidang pelafalan kini hanya menerbitkan larik `linkRelationships` terkini yang digunakan Cognis, dan cakupan regresi menolak pengenalan kembali properti lama tersebut.

- [29d7b90](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/29d7b90)

## Penyedia Pola Goresan Runtime

Kontrak penyedia pencarian Cognis Library terkini diterapkan untuk unit tulisan Jepang. Label Kana dan Kanji yang cocok tepat kini mengembalikan `stroke_pattern` tervalidasi dari paket dengan asal KanjiVG stabil dan keyakinan `1`; label yang tidak dikenal tidak ditebak. Penyedia bekerja sepenuhnya secara lokal—tanpa layanan jaringan atau OCR—dan pendaftarannya dilepas saat dinonaktifkan atau segera setelah ingest gagal.

- [bbc6d84](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bbc6d84)

## Pencarian Pola Goresan Kana dan Kanji Lengkap

Penyedia pencarian diperluas melampaui kurikulum bawaan. Pola bawaan tetap tersedia seketika dan luring; Kana atau Kanji Jepang lainnya diselesaikan melalui titik kode Unicode terhadap data SVG KanjiVG kanonis, diubah menjadi sampel goresan ternormalisasi yang dibatasi, disimpan dalam tembolok, lalu dikembalikan dengan asal-usul tepat dan keyakinan `1`. Karakter yang tidak didukung atau tidak tersedia tidak menghasilkan tebakan, dan OCR sengaja tidak diperlukan untuk masukan teks yang tepat.

- [e040cf0](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e040cf0)
