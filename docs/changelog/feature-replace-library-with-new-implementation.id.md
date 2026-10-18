# Pembaruan Belajar Bahasa Jepang

**Cabang Fitur:** feature-replace-library-with-new-implementation

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

- [57eb9bc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/57eb9bc1edf7d0375e8ca77bb145ef81527dedf4)

## Pelafalan Kanji Milik Kosakata

Tautan pelafalan Kanji kini mengutamakan kosakata terlihat yang memakai bacaan tersebut. Hanya kosakata itu yang memiliki pembungkus pelafalan lengkap, yang memakai ulang rentang bacaan Kanji bermakna dan mengarahkan sufiks Kana tunggal yang tersisa langsung ke Kana atomik. Contohnya, `好` tertaut ke `好き`, sedangkan bacaan lengkap `すき` memakai rentang Kanji `す` dan `き` atomik tanpa membuat kartu pelafalan `き` tersendiri.

- [eb10612](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eb1061260347ca154c9bff6fc18c970931e4616e)

## Tautan Pelafalan Kalimat Lengkap

Metadata pelafalan kalimat kini mendeklarasikan hubungan kata dan partikel sebagai sumber tautan mendalam. Dengan demikian `がっこうにいく` diuraikan menjadi kosakata `学校` yang terlihat, partikel `に`, dan kosakata `行く` yang terlihat, sambil mempertahankan graf milik kalimat tanpa rekaman bacaan lengkap sintetis.

- [a2ae8ba](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a2ae8ba29d2325ad624de8b798573a6429586981)

## Kartu Menulis Berpanduan Goresan

Kartu Kana dan Kanji diselaraskan dengan kontrak menggambar terbaru Cognis PR #226 melalui metadata `strokePattern` ternormalisasi yang wajib, sampel waktu berurutan, dan toleransi latihan. Pola turunan KanjiVG mempertahankan atribusi CC BY-SA 3.0, dan serpihan konten dibagi untuk mematuhi batas ukuran berkas repositori.

- [ff5bf74](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ff5bf7464b2d8e5b58925b68f167c52b720ecba8)

## Tautan Kana Kosakata Dipulihkan

Setiap lapisan yang memiliki pelafalan kini menerbitkan larik `input.linkRelationships` terkini yang digunakan Cognis PR #226. Kosakata seperti `猫` mengekspos target `pronunciation-readings` melalui kontrak tersebut sehingga `ねこ` yang ditampilkan membuka entri pelafalan yang dibuat; bacaan Kanji dan tautan Kana partikel memakai bentuk metadata terkini yang sama.

- [d81fda7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d81fda7fa3efaa127a5a3f21633afef600c9ea8a)

## Tautan Pelafalan Hanya dengan Kontrak Terkini

Metadata tunggal `linkRelationship` yang usang dihapus alih-alih mempertahankan jalur kompatibilitas dalam skema konten beta. Bidang pelafalan kini hanya menerbitkan larik `linkRelationships` terkini yang digunakan Cognis, dan cakupan regresi menolak pengenalan kembali properti lama tersebut.

- [9376566](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/937656620115c72eeea3f7f8273a8aff3a30c160)

## Penyedia Pola Goresan Runtime

Kontrak penyedia pencarian Cognis Library terkini diterapkan untuk unit tulisan Jepang. Label Kana dan Kanji yang cocok tepat kini mengembalikan `stroke_pattern` tervalidasi dari paket dengan asal KanjiVG stabil dan keyakinan `1`; label yang tidak dikenal tidak ditebak. Penyedia bekerja sepenuhnya secara lokal—tanpa layanan jaringan atau OCR—dan pendaftarannya dilepas saat dinonaktifkan atau segera setelah ingest gagal.

- [9c6ba69](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9c6ba6910450efd81f08e7982c67d69fe89ab0f6)

## Pencarian Pola Goresan Kana dan Kanji Lengkap

Penyedia pencarian diperluas melampaui kurikulum bawaan. Pola bawaan tetap tersedia seketika dan luring; Kana atau Kanji Jepang lainnya diselesaikan melalui titik kode Unicode terhadap data SVG KanjiVG kanonis, diubah menjadi sampel goresan ternormalisasi yang dibatasi, disimpan dalam tembolok, lalu dikembalikan dengan asal-usul tepat dan keyakinan `1`. Karakter yang tidak didukung atau tidak tersedia tidak menghasilkan tebakan, dan OCR sengaja tidak diperlukan untuk masukan teks yang tepat.

- [326145f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/326145f3eb05ed9d4df521f92728067d87f19d9d)

## Pencarian Kartu Jisho yang Mendahulukan Data Asli

Penyedia komposer Jisho yang dilokalkan untuk kartu Kana, Kanji, dan Kosakata ditambahkan dengan kontrak pencarian Cognis terbaru. Rekaman bawaan yang cocok tepat mengembalikan seluruh bidang dan hubungan yang telah ditinjau tanpa permintaan jaringan. Kegagalan pencarian asli menggunakan tembolok permintaan terbatas sebelum meminta Jisho, lalu mengisi label kanonis, pelafalan, tingkat JLPT, serta hanya tautan Kanji, bacaan, Kana, atau definisi yang sudah ada dalam graf penyedia. Penyedia pola goresan kini juga menerbitkan metadata lokal yang diwajibkan komposer saat ini.

- [7e6ef74](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7e6ef7480eabb9fb4724bb51532523cfd32f89fd)

## Pendaftaran melalui Penyedia Library Generik

Jisho kini menyediakan adaptor pendaftaran khusus yang menerima kapabilitas generik `study:library:provider` dan mendelegasikan langsung ke `registerLookupProvider`. Bootstrap menggunakan adaptor tersebut, menyimpan fungsi penghapus yang dikembalikan, dan membatalkan penyedia yang telah terdaftar dalam urutan terbalik jika pendaftaran berikutnya atau penyerapan konten gagal. Integrasi ini tidak lagi bergantung pada kapabilitas host khusus Jisho.

- [bfea956](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bfea956d632cc40a088b4296d2d02eb2535ef79b)

## Titik Masuk Pendaftaran Terpaket

Digest manifes untuk titik masuk pendaftaran Jisho generik dan cakupan regresinya telah diperbarui.

- [bfea956](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bfea956d632cc40a088b4296d2d02eb2535ef79b)

## Runtime Goresan Mandiri

Dependensi produksi `svg-path-properties` yang tidak diterapkan dan mencegah Cognis mengimpor modul saat validasi pengaktifan telah dihapus. Modul kini menyertakan tokenizer jalur SVG, pengambil sampel kurva, dan pengambil sampel ulang berbasis jarak miliknya sendiri untuk goresan KanjiVG. Cakupan regresi menjalankan pengujian bootstrap, pencarian goresan, dan penghapusan instalasi dari salinan pohon modul tanpa `node_modules`, sesuai dengan lingkungan instalasi modul eksternal.

- [4af0efc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4af0efc58f962bcf07a087d0066ce2d7b54bf253)

## Resolusi Kapabilitas Library Invers

Bootstrap kini memperoleh permukaan pendaftaran Library wajib melalui `ctx.capabilities.require("study:library:provider")`, mengikuti pola penyedia invers yang digunakan modul autentikasi SSO. Pengambil kemudahan yang mengembalikan `undefined` untuk kapabilitas wajib ini tidak lagi digunakan, sementara validasi bentuk penyedia dan pembersihan siklus hidup tetap dipertahankan.

- [c1c8a23](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c1c8a2304c9550d158842311194e3a5ec5e6db99)

## Jembatan Visibilitas Penyedia Library

Bootstrap kini mendahulukan kapabilitas publik `study:library:provider` yang diinjeksi, tetapi ketika Cognis PR #226 hanya mengeksposnya untuk validasi pengaktifan, bootstrap menggunakan layanan `study:library` yang diinjeksi sebagai pembawa antarmuka generik `registerLookupProvider` dan `ingestContentPack` yang sama persis. Perubahan ini memperbaiki aktivasi tanpa membuat protokol penyedia kedua, dan pengujian mencakup kedua bentuk visibilitas host.

- [a9d1c15](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a9d1c155470fca1b8bc65bcdb6d7bced1a03d828)

## Tautan Kalimat dan Kanji yang Sepenuhnya Dapat Diselesaikan

Tautan detail judul diaudit dengan algoritme komposisi alias host yang persis. Setiap pelafalan kalimat kini membuktikan bahwa rentang Kana terurutnya membuka rekaman Kosakata dan Partikel yang dimaksud. Setiap Kanji mengekspos satu bacaan utama lengkap yang cocok dengan satu target Kosakata terdekat, sedangkan bacaan tambahan memakai hubungan nonjudul terpisah dan mempertahankan seluruh dependensi Kana atomik untuk navigasi invers.

- [9d7abe8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9d7abe8203769376d0249bda7b790ac84b4266cf)

## Penyelarasan Kontrak Audio Paket

URL audio placeholder eksternal yang ditolak dengan benar sebagai `invalid_asset_reference` oleh validator paket konten Library terbaru telah dihapus. Pelafalan unit tulisan tetap wajib, sedangkan audio kini menjadi kolom unggah opsional hingga berkas audio autentik dibundel dalam paket.

- [ac71f82](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ac71f82fa6bfd798e9ea05be7c882e523a8f7da5)

## Relasi Penggunaan Kana Langsung

Relasi dependensi buatan dari Kanji ke Kana telah dihapus. Kartu Kana kini hanya menampilkan catatan bacaan langsung pada Digunakan Oleh, sehingga navigasi `あ` → `あめ` → `雨` tetap benar dan kata atau Kanji yang tidak berkaitan tidak ditampilkan sebagai induk langsung.

- [98c2e49](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/98c2e4954513cd03eb4f8a76b1e57b011a3daca5)

## Batas Pelafalan Khusus Kanji

Tautan pelafalan Kanji kini menargetkan catatan bacaan khusus yang hanya berisi Kana, bukan kata terlihat lengkap. Karena itu `好` menampilkan dan menautkan `す`, sedangkan pembungkus pelafalan `好き` yang terpisah menyusun `す` dengan sufiks `き`; kata Kanji mandiri memakai batas dua tingkat yang sama tanpa induk berlabel ganda.

- [0900421](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/090042170e97a4f9d76d0433e2057e360ee973f9)

## Pola Goresan Kana yang Mempertahankan Kurva

Semua pola goresan Kana dan Kanji dalam paket dibuat ulang dari jalur SVG KanjiVG bernama Unicode yang dipatok. Pengambil sampel milik modul kini membagi kurva kubik dan kuadratik sebelum pengambilan sampel berdasarkan jarak, sehingga belokan dan lingkaran seperti goresan kedua `え` tetap dipertahankan dan tidak disederhanakan menjadi segmen lurus yang menyesatkan.

- [76cf76e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/76cf76e300dbc6e2443d10710bd5e33c160c815e)
- [76cf76e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/76cf76e300dbc6e2443d10710bd5e33c160c815e)

## Pelafalan Rekursif yang Diturunkan dari Kana

Seluruh 84 pembungkus pelafalan Kosakata tersembunyi yang hanya berisi karakter telah dihapus. Kana atomik kini menjadi satu-satunya daun pelafalan: Kanji dan 37 kartu Kosakata nyata menaut langsung ke Kana terurut, sedangkan kalimat hanya menaut ke Kosakata nyata dan partikel. Nilai pelafalan Kosakata dan kalimat dimaterialkan dari graf tersebut untuk tampilan dan ditandai sebagai relasi pelafalan, sehingga kalimat tertulis tidak lagi diulang di bawah judulnya.

- [b2a396a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2a396aaafe01405abb35efb4418202f3bc46cff)

## Validasi Kalimat Terurut

Relasi kalimat diselaraskan dengan pemeriksaan awal ingest terbaru pada Cognis PR #226. `words` dan `particles` terurut kembali menjadi relasi komposisi sehingga host dapat merekonstruksi dan memvalidasi setiap label kalimat, sementara pelafalan tetap diturunkan secara rekursif dari unsur-unsur tersebut.

- [fec3fb5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fec3fb5b593194ec64c1e2ad32032e7567debf4d)

## Pelafalan Kana Terlihat

Pelafalan berhuruf Latin pada kartu Kana ringkas dipulihkan tanpa merusak bacaan Jepang rekursif. Setiap Kana kini mempertahankan bentuk aslinya sebagai nilai pertama untuk derivasi pelafalan dan menyediakan romanisasi gaya Hepburn sebagai nilai tampilan berbeda yang dipertahankan oleh renderer Library terbaru.

- [29b678e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/29b678eac314782f4dc693bbd3855a1ae3c61184)

## Bunyi Kana untuk Pelajar

Pelafalan Kana dikoreksi agar hanya berisi romanisasi gaya Hepburn. Pelajar kini melihat `a` sebagai pelafalan `あ` atau `ア`, bukan simbol yang sama sebagai pelafalannya sendiri; ejaan Jepang pada lapisan lebih tinggi tetap memakai label Kana terurut.

- [93532bd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/93532bd4c8ed8c3e653b34332df1623f23f784c9)

## Referensi Pelafalan Kana Berkelompok

Bacaan alternatif Kanji dipulihkan dan setiap pelafalan Kanji serta Kosakata direpresentasikan sebagai urutan bertingkat tersendiri dari referensi Kana terurut. Skema menandai bidang ini sebagai `multi_value` dan relasinya sebagai berkelompok, sedangkan saran Jisho mempertahankan struktur yang sama untuk dukungan Cognis core mendatang.

- [ea6c997](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ea6c99745df322094aaa4ba26b1b7e6e8de9558a)

## Perantara Pelafalan Kosakata Tersembunyi

Rekaman pelafalan tersembunyi dipulihkan hanya ketika makna Kosakata berbeda dari definisi Kanji tertulisnya. Setiap perantara membawa definisi leksikal, menautkan ejaan Kanji terkait, dan berlanjut melalui referensi Kana berkelompok; kata dengan definisi sama mempertahankan jalur Kana langsung, dan saran lookup mengecualikan rekaman tersembunyi.

- [da85016](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/da8501693bbc2e105df9e95cd0333559c79dc46b)

## Tautan Pelafalan Kanji yang Lengkap

Setiap pelafalan Kanji kini ditautkan melalui rekaman bacaan lengkap tersembunyi tersendiri sebelum diteruskan ke Kana atomik yang berurutan. Keenam bacaan `来` (`く`, `きた`, `き`, `こ`, `らい`, dan `たい`) sekarang memiliki tautan mendalam yang berfungsi, dan invarian yang sama diberlakukan untuk setiap Kanji dalam paket.

- [286d3ee](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/286d3ee07376843bc4f5992ea00cf1e7db01e05f)

## Jalur Pelafalan Kata dan Kalimat yang Lengkap

Setiap kata beraksara Kanji kini terhubung ke rekaman tulisannya dan satu rekaman pelafalan lengkap yang tersembunyi, sambil mempertahankan segmen bacaan Kanji yang telah ditulis sebelum Kana atomik. Pelafalan kalimat kini menelusuri rekaman lengkap tersembunyi yang tersusun dari bacaan kata dan Kana partikel. Saran Jisho juga memvalidasi aksara khusus tiap lapisan, mempertahankan tautan ejaan Kanji yang tersedia, dan menghilangkan grup Kana yang tidak lengkap.

- [4e549a9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4e549a90346e73f19bed8e21edd6ae78f95d5074)

## Kartu Pelafalan Bersama untuk Homofon

Kartu pelafalan tersembunyi yang berulang untuk `はな`, `はし`, `あめ`, dan `かみ` diganti dengan satu kartu bersama untuk setiap bacaan Kana lengkap. Setiap kartu bersama menggabungkan definisi leksikal terkait dan digunakan oleh kata Kanji terlihat yang berbeda. Dengan demikian, kartu berlabel sama tidak lagi saling menautkan, sementara setiap homofon tetap dipertahankan sebagai kata belajar tersendiri.

- [abd8c3b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/abd8c3b545fe155d4c7c2439cadb337707c408c2)

## Navigasi Bacaan Antarlapisan yang Stabil

Hubungan yang ditulis kini menjadi satu-satunya sumber penelusuran kartu bacaan. Jalur bacaan Kosakata tidak lagi dapat menargetkan kartu Kosakata berlabel identik: pelafalan lengkap satu Kanji kini langsung diuraikan menjadi Kana berurutan, sedangkan kata majemuk hanya mempertahankan segmen bacaan yang benar-benar lebih kecil. Bacaan struktural tersembunyi tidak lagi menyalin definisi semantik. Kosakata terlihat hanya mempertahankan definisi terlokalisasi jika maknanya berbeda dari Kanjinya; makna identik diwarisi melalui induk ejaan, dan definisi yang identik dengan label utama tetap disembunyikan oleh Cognis.

- [5bed22f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5bed22f956d41cdbbbf97749acae0400dbe01275)

## Bacaan Kanji Terverifikasi dan Konten Pemula

Cakupan pelafalan kini dikunci pada inventaris bacaan on dan kun KANJIDIC yang telah ditinjau, dengan normalisasi deterministik, satu rekaman bacaan tersembunyi untuk setiap hasil, dan pengecualian kontekstual eksplisit untuk `達` sebagai `だち`. Ditambahkan definisi terlokalisasi untuk kartu leksikal yang maknanya berbeda serta batch tinjauan berisi sembilan kata tentang lokasi, keberadaan, deskripsi, cara, dan kopula dengan delapan kalimat contoh alami dan jalur pelafalan lengkap.

- [ddfb838](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddfb83889f2172985b1b8290e0737832f9187ac8)

## Kepemilikan Area Hapus Kartu Tahap

Telah dikonfirmasi bahwa penghapusan kartu tahap diimplementasikan dan ditata oleh composer Study Library Cognis, bukan oleh modul konten bahasa Jepang eksternal ini. Selektor host yang tepat, perbaikan ukuran yang diperlukan, dan pengujian regresi browser dicatat dalam `TODO.md`; modul tidak menyuntikkan penimpaan CSS yang tidak aman ke editor milik host.

- [8e9f064](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8e9f0646527535a2ef05cfd53a96b3f7438e28bd)

## Resolusi Romanisasi Khusus Kana

Dipastikan bahwa paket bahasa Jepang telah membatasi romanisasi Hepburn pada Kana atomik, sedangkan bacaan lapisan yang lebih tinggi ditulis sebagai label Kana Jepang. Koreksi tepat yang diperlukan pada composer Cognis dicatat agar penurunan pelafalan rekursif tidak meneruskan romanisasi Kana ke bacaan Kosakata dan kalimat; modul eksternal tidak menimpa perilaku penurunan milik host.

- [35975db](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/35975dbcb8e4de5c6da0721e67adf96070d9ae9f)

## Pembersihan Penghapusan Instalasi Destruktif yang Eksplisit

Endpoint administratif untuk menghapus konfigurasi modul yang diharapkan Cognis telah ditambahkan sebagai rute kompatibilitas `204` yang aman bagi konten. Rekaman bahasa Jepang bawaan paket kini hanya dihapus melalui penyedia Study Library ketika permintaan penghapusan instalasi secara eksplisit membawa `deleteContent: true`; penonaktifan, penghapusan instalasi biasa, dukungan pembersihan yang tidak tersedia, dan kegagalan pembersihan tidak dapat diam-diam menghapus atau menelantarkan data pembelajaran yang sudah mapan.

- [5c36f40](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5c36f401cf0066600d44e0863ce86cb58da5c58f)

## Definisi Kartu Kosakata Dipulihkan

Relasi definisi langsung ditambahkan ke setiap rekaman Kosakata terlihat bertuliskan Kanji yang sebelumnya bergantung pada induk ejaannya. Hal ini sesuai dengan perender kartu Cognis, yang hanya menampilkan definisi yang dirujuk secara langsung, dan memulihkan makna untuk kartu termasuk `川`, `空`, `花`, `鼻`, `橋`, `箸`, `雨`, `飴`, `水`, `犬`, `猫`, `山`, `紙`, dan `髪`.

- [7dd6179](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7dd61791b5af32e0fe27f5db9a9298f2b4fc9a74)

## Pencarian Kosakata Jisho yang Berfungsi

Alur composer Jisho diperbaiki agar pencarian Kosakata menerima istilah bahasa Inggris dan aksara Latin lain yang dibatasi, alih-alih langsung mengembalikan tanpa hasil sebelum membuat permintaan. Entri Jepang paket yang persis cocok tetap diprioritaskan secara lokal; kueri Jepang jarak jauh mengutamakan bentuk tepat, sedangkan pencarian makna memakai hasil Jisho berperingkat tertinggi. Lapisan Kana dan Kanji tetap membutuhkan satu karakter Jepang yang valid, dan masukan tidak aman atau terlalu panjang ditolak sebelum akses jaringan.

- [3ae4cbe](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3ae4cbe0874933fa718765636bfe69279367db63)

## Tampilan Transformasi Verba dan Adverbia Dasar

Paket bahasa Jepang diselaraskan dengan kontrak transformasi Cognis terbaru. Kosakata kini memisahkan verba dasar dan adverbia yang tidak berubah ke tampilan khusus; verba membedakan ichidan, akhiran godan reguler, pengecualian `行く` dan `ある`, serta `来る` tak beraturan. Aturan deklaratif penyedia menurunkan bentuk sopan, negatif, lampau, dan te yang telah ditinjau saat penyajian, sedangkan paket hanya menyimpan dua belas rekaman dasar verba/adverbia kanonis tanpa duplikat hasil transformasi.

- [1c251e5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1c251e56e591b36b4aefd8144ce6213075d3b30f)

## Tautan Pelafalan Kalimat Tersegmentasi

Detail pelafalan kalimat kini menautkan setiap segmen bacaan berurutan langsung ke kartu Kosakata atau Partikel yang terlihat. Sebanyak 25 pembungkus Kosakata kalimat lengkap tersembunyi dan relasi tingkat kalimat `pronunciation-readings` telah dihapus, sehingga `はなはとてもきれいです` membuka `花`, `は`, `とても`, `きれい`, dan `です` secara terpisah, bukan menampilkan satu kartu Kosakata untuk seluruh kalimat.

- [03377a7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/03377a7816980bf5230ee83739b70af4dad33182)

## Perlindungan Pelafalan Jepang Lengkap

Setiap pelafalan lapisan atas dalam paket telah diaudit dan dikunci sebagai teks Jepang lengkap, termasuk rekonstruksi kalimat penuh. Romanisasi campuran dan segmen akhir yang hilang berasal dari Cognis PR #226: penurunan rekursif membaca bidang Hepburn kartu Kana sebelum label atomiknya, dan popup host harus mempertahankan rentang bacaan berkelompok secara lengkap. Kasus dasar upstream dan regresi pembungkusan yang tepat telah dicatat tanpa menambahkan penimpaan antarmuka host yang tidak aman ke paket eksternal ini.

- [cd764a7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cd764a7611976f5b58152b97ebadb073cc96ce1b)

## Navigasi Judul Bacaan ke Kana Atomik

Komposisi judul Kana atomik berurutan yang eksplisit ditambahkan ke setiap rekaman bacaan Kanji tersembunyi. Bacaan multi-Kana seperti `さん` kini membuka `さ` dan `ん` secara langsung, sehingga host tidak dapat menggantikannya dengan kartu Kosakata bacaan Kanji `さ` tersembunyi terpisah yang digunakan oleh `小`. Relasi `kana-spelling` lengkap tetap dipertahankan untuk semantik pelafalan, sedangkan navigasi judul menjadi deterministik dan berakhir pada Kana.

- [612e4cb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/612e4cb4df57a5afb62cd4dcf4291c7516d2e91e)

## Navigasi Kana Gabungan dan Geometri Bentuk Kecil

Komposisi judul Kana atomik yang eksplisit ditambahkan ke setiap kartu Kana bersimbol banyak, sehingga Kana gabungan seperti `きょ` tidak lagi menaut dalam ke bacaan Kosakata tersembunyi dengan teks yang sama. Tata letak guratan gabungan dibangun ulang dengan ruang yang peka ukuran agar bentuk kecil seperti `ょ` mempertahankan proporsi yang terlihat lebih kecil di samping Kana berukuran penuh.

- [305e774](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/305e7743a0ab48ca335cac9add23cb1c670def20)

## Tautan Kalimat Tanpa Kosakata Penyamar Kalimat

Tautan pelafalan kalimat ke unsur Kosakata dan Partikel berurutan yang terlihat telah dipulihkan. Cakupan regresi struktural diperkuat agar bacaan kalimat lengkap, komposit kalimat, kelas partikel, referensi partikel, dan unsur kalimat tersembunyi ditolak dari lapisan Kosakata tanpa menghapus tautan kalimat yang sah.

- [ad97003](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ad97003b391165fcd5411e708bf771fdac729d13)

## Bacaan Kanji Langsung Tanpa Kosakata Duplikat Kana

Seluruh 140 rekaman Kosakata `reading:kanji` tersembunyi telah dihapus, termasuk sisa Kana tunggal seperti `む`. Grup pelafalan Kanji dan saran Kanji Jisho jarak jauh kini menaut langsung ke Kana atomik berurutan, sedangkan pembungkus pelafalan leksikal lengkap dipertahankan hanya jika tidak menduplikasi label unit tulisan Kana.

- [bbfe7ae](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bbfe7aed644efc97e0d619b5ccc2d684c12880d2)

## Transformasi Verba Bercabang Mendalam

Paket Jepang diselaraskan dengan kontrak pohon transformasi tersusun Cognis. Semua keluarga verba kini bercabang melalui jalur sopan, negatif, lampau, penghubung, kausatif, pasif, potensial, dan volisional, termasuk rantai keinginan kausatif empat tahap. Bentuk tulisan dan pelafalan ditransformasi secara mandiri, penggantian definisi terlokalisasi menjelaskan cabang semantik, adverbia tetap berupa kartu dasar yang tidak berubah, dan bentuk hasil hanya untuk penyajian.

- [6d3e6bf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6d3e6bf546acdcccd860b4c9a7ac75649c1a5dff)

## Perantara Bacaan Kanji Selektif

Satu kartu Kosakata bacaan tersembunyi per pelafalan dipulihkan hanya untuk Kanji yang memiliki beberapa bacaan; satu-satunya Kanji dengan satu bacaan tetap menaut langsung ke Kana atomik. Setiap perantara menautkan judulnya ke tepat satu Kanji sumber, merekonstruksi pelafalannya dari Kana atomik, dan dapat memiliki definisi tersendiri bila maknanya lebih sempit. Pembungkus Kana kata lengkap seperti `せんせい` dihapus; bacaan `先生` kini tersusun dari perantara `せん` dan `せい` yang terpisah.

- [0f16eda](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0f16edaecc01c74449dcd9a28ebccca898f5ffd5)

## Definisi Bacaan yang Mandiri

Tautan definisi langsung ditambahkan ke setiap rekaman Kosakata bacaan Kanji tersembunyi agar pembukaan bacaan dari tautan dalam pelafalan menampilkan makna yang sama dengan pembukaan melalui bagian Digunakan Oleh pada kartu Kanji. Bacaan menggunakan kembali definisi Kanji sumber bila maknanya sama dan tetap dapat memiliki definisi khusus bila maknanya lebih sempit.

- [935f6c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/935f6c9d0ee0ff5cb3b0284a839a76d74221e30b)

## Penanda transformasi terlokalisasi

Cabang keinginan kausatif kini menerbitkan metadata `marker` terlokalisasi dalam bahasa Jerman, Inggris, Indonesia, dan Jepang. Cognis dapat menyisipkan frasa tersebut ke templat definisi sambil tetap memprioritaskan definisi khusus transformasi yang eksplisit.

## Pemilihan varian di dalam Kosakata

Kontrak yang didokumentasikan mempertahankan verba dan adverbia kanonis pada lapisan Kosakata serta menampilkan pohon transformasi mendalam melalui pemilih varian host tanpa menyimpan bentuk hasil transformasi sebagai entri belajar.

## Sinkronisasi versi

Modul dinaikkan ke `2.2.72`, revisi konten `2026-09-30.10`, dan revisi skema bahasa Jepang `77`, disertai hash paket yang dibuat ulang.

## Anotasi Definisi untuk Setiap Transformasi

Setiap transformasi verba yang disediakan kini memiliki metadata penanda terlokalisasi. Cabang keinginan langsung menghasilkan bentuk seperti `見たい`, sedangkan cabang negatif, lampau, sopan, penghubung, pasif, potensial, volisional, kausatif, dan cabang mendalam masing-masing menyediakan anotasi semantiknya sendiri.

## Definisi Polisemi yang Mandiri

`見る` kini merujuk rekaman definisi “to see” dan “to watch” secara terpisah. Cakupan regresi menerapkan penanda keinginan pada setiap definisi secara mandiri; setiap definisi verba terlokalisasi kini memuat slot `{{ marker }}` yang diwajibkan.

## Tindak Lanjut Cognis Terstruktur

Paket mengikuti kontrak penanda Cognis secara langsung dengan menempatkan tepat satu slot `{{ marker }}` pada setiap definisi verba terlokalisasi dan mempertahankan rekaman definisi terpisah selama presentasi transformasi.

## Slot Penanda Ditambahkan ke Definisi Verba

Setiap definisi terlokalisasi yang dirujuk verba kini memuat tepat satu slot `{{ marker }}` pada posisi tata bahasa yang benar. Cognis dapat mengubah dua definisi `見る` menjadi `to (want to) see` dan `to (want to) watch` tanpa menebak posisi anotasi transformasi.

## Definisi Polisemi Tetap Mandiri

Makna gabungan `学ぶ` dipisahkan menjadi rekaman definisi “to learn” dan “to study”, mengikuti pemisahan yang sudah ada untuk `見る`. Pengujian mewajibkan tepat satu slot penanda pada setiap definisi verba yang terlihat dan setiap bahasa.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.74`, revisi konten `2026-10-01.2`, dan revisi skema bahasa Jepang `79`, disertai hash paket yang dibuat ulang.

## Transformasi Definisi yang Dapat Disusun

Metadata `marker` tetap dan slot `{{ marker }}` tersimpan diganti dengan struktur `definitionTransform` Cognis 2.24. Setiap aturan kini mendeklarasikan batas terlokalisasi yang dapat dilepas dan templat dengan `{{ definition }}`, `{{ stem }}`, `{{ prefix }}`, serta `{{ suffix }}`; templat disusun berurutan sepanjang jalur transformasi mendalam.

## Definisi Bersih dan Cakupan Jalur Mendalam

Definisi verba kembali menjadi teks terlokalisasi biasa, sementara batas infinitif yang konsisten memungkinkan templat mengubah setiap definisi polisemi secara mandiri. Pengujian mencakup bentuk keinginan `見る` dan jalur keinginan kausatif empat tahap tanpa meratakan makna.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.75`, revisi konten `2026-10-01.3`, dan revisi skema bahasa Jepang `80`, disertai hash paket yang dibuat ulang.

## Penggantian Definisi Kontekstual

Transformasi definisi kini memakai `replacements` terlokalisasi dan berurutan dari Cognis 2.24.1 sebelum templat cadangan. Cabang lampau dan negatif dapat menulis ulang semantik keinginan, kausatif, sopan, dan kondisional sebelumnya, sedangkan cabang penghubung menambahkan makna ke definisi hasil transformasi lengkap melalui `{{ definition }}`.

## Cakupan Rantai Kontekstual

Pengujian memverifikasi bahwa `to (want to) see` menjadi `to (have wanted to) see`, bentuk keinginan penghubung menjadi `to (want to) see (and then)`, dan jalur keinginan kausatif terdalam mempertahankan makna kontekstual lengkapnya.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.76`, revisi konten `2026-10-01.4`, dan revisi skema bahasa Jepang `81`, disertai hash paket yang dibuat ulang.

## Pola Gambar dengan Rasio Aspek yang Benar

Setiap pola goresan dalam paket kini mendeklarasikan jumlah kolom logisnya. Latihan Menggambar Cognis dapat menyesuaikan pola satu atau beberapa karakter ke viewport yang mempertahankan rasio aspek, alih-alih meregangkan kanvas atau menyebarkan karakter ke sel berukuran salah.

## Pengujian Goresan yang Memahami Karakter

Pola goresan kini menerbitkan panjang kelompok berurutan untuk setiap karakter; pola multikarakter yang diambil dari sumber jarak jauh mempertahankan metadata yang sama. Panduan goresan berikutnya dan pengujian panduan tersembunyi dapat mempertahankan batas karakter. Tindak lanjut host mencatat bahwa pola majemuk harus mempertahankan kelompok yang ditulis dan komposisi kosakata harus memakai jarak optis berbasis batas.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.77`, revisi konten `2026-10-01.5`, dan revisi skema bahasa Jepang `82`, disertai hash paket yang dibuat ulang.

## Identitas Kanji Berdasarkan Label

Pencarian Kanji kini menormalisasi dan membandingkan langsung label karakter yang dimasukkan, bukan memakai pelafalan yang sama sebagai identitas. Cakupan regresi membuktikan bahwa `券` tetap berbeda dari Kanji paket seperti `犬` walaupun keduanya dapat memakai `けん`, sedangkan konflik label yang benar-benar sama dapat diselesaikan melalui entri konflik yang diberikan Cognis Library 2.24.3.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.78` dan revisi konten `2026-10-01.6`, dengan hash paket yang dibuat ulang.

## Komposisi Struktur Kalimat

Konstruktor kalimat Jepang kini mengikuti Cognis Library 2.24.9 dengan input kata dan partikel terpisah, carousel Struktur Kalimat milik penyedia, serta tanda baca Jepang yang dapat diulang. Kopula terlihat `です` diberi tag `sentence-structure`, sehingga tetap menjadi Kosakata bermakna dan dapat dipilih, diurutkan, dihapus, serta dipulihkan secara langsung saat menyusun kalimat.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.79`, revisi konten `2026-10-02.1`, dan revisi skema Jepang `83`, dengan hash paket yang dibuat ulang.

## Perluasan Penghubung Kalimat

Carousel Struktur Kalimat kini mencakup `それでも`, `ですが`, `だけど`, `しかし`, `そして`, `それから`, `だから`, `なので`, dan bentuk biasa `だ`. Setiap kartu leksikal terlihat yang baru memiliki makna terlokalisasi, jalur bacaan Kana atomik yang tepat, tingkat kemahiran yang sesuai, dan kalimat tersusun yang telah ditinjau.

## Pohon Transformasi Kopula

Kosakata kini menerbitkan tampilan transformasi Kopula khusus. Satu-satunya bentuk dasar biasa yang disimpan, `だ`, menurunkan `だった`, `ではない`, `ではなかった`, dan bentuk penghubung `で`; bentuk sopan `です` tetap menjadi kata struktur kalimat yang ditulis tersendiri, bukan kartu hasil yang diduplikasi.

## Sinkronisasi Versi

Modul dinaikkan ke `2.2.80`, revisi konten `2026-10-02.2`, dan revisi skema Jepang `84`, dengan hash paket yang dibuat ulang.

## Metadata Transformasi Kopula yang Valid

Aturan kopula kini menghilangkan batas pencocokan definisi opsional yang tidak digunakan alih-alih menerbitkan label terlacakalisasi kosong. Templat terlacakalisasinya tetap dipertahankan sehingga validasi Study Library yang ketat dapat mengaktifkan dan mengimpor paket. Modul naik ke `2.2.81`, revisi konten `2026-10-02.3`, dan revisi skema `85`.

## Pelafalan Kosakata yang Dapat Diklik

Bidang pelafalan kosakata kini menggunakan kontrak tunggal host `pronunciation-readings`. Setiap kartu kosakata yang terlihat menautkan satu rekaman pelafalan lengkap tersembunyi yang mempertahankan jalur bacaan Kanji dan Kana atomik secara berurutan; karena itu, pelafalan seperti `ちいさい` dapat dibuka dari kartu `小さい`. Modul naik ke `2.2.82`, revisi konten `2026-10-04.1`, dan revisi skema `86`.

## Pilihan Komposisi Persis

Versi modul 2.2.97 mempertahankan versi paket konten 2.2.93 dan revisi skema 88. Cognis menggabungkan hasil kamus dengan komposisi tulisan identik menjadi bacaan dan makna alternatif. Mengeklik ejaan berbeda langsung menerapkannya serta menyelesaikan atau membuat Kanji pendukung. Lanjutkan atau menutup pemilih mempertahankan komposisi persis dan mengabaikan hasil diperluas. Kartu bacaan mempertahankan jalur ke Kana individual. Pemilihan, pembuatan kartu, pemeriksaan cakupan, cache, dan notifikasi tetap menjadi tanggung jawab host.

## Sertakan rekaman pelafalan awal

Kartu awal yang diucapkan menyertakan MP3 yang dibuat offline dan dideduplikasi, beserta atribusi suara. Kalimat tetap memutar unsur penyusunnya secara berurutan.

## Daftarkan pengambilan audio terkelola

Kedua modul Study memakai kontrak penyedia audio yang sama dan dapat dilepas, serta mengambil rekaman bawaan dengan pembacaan lokal terbatas. Host memiliki otorisasi, kebijakan cache, dan pemutaran komposit.

## Target paket dan panduan pengembang

Rilis 2.2.107 — Validasi paket memastikan titik masuk, ikon, banner, dan tangkapan layar berupa file reguler di dalam checkout, termasuk setelah resolusi jalur. Dokumentasi menjelaskan kontrak publik dan merujuk manifes untuk metadata rilis; changelog mempertahankan asal-usul rilis.

## Pilih Tingkat JLPT Secara Bebas

Filter JLPT kini dimulai tanpa tingkat yang dipilih dan mengizinkan beberapa pilihan seperti filter jenis verba opsional. Menghapus semua pilihan menampilkan setiap kartu kosakata, termasuk kartu tanpa tingkat JLPT.

## Revisi Paket

Revisi skema 87 serta versi modul dan paket konten 2.2.83 menerbitkan kebijakan pilihan yang diperbarui melalui kontrak Study Library yang sudah ada.

## Hasil Jisho lengkap

Penyedia Jisho kini mengembalikan semua pelafalan dengan kelompok Kana berurutan, definisi yang dapat diimpor untuk tiap makna, klasifikasi leksikal, tag JLPT/kata umum, dan URL sumber. Kapabilitas kamus dideklarasikan melalui pendaftaran `study:library:provider`. Rekaman sumber lengkap, termasuk bentuk alternatif, kelas kata, catatan makna, batasan, dialek, istilah terkait, dan atribusi, disimpan sebagai JSON dalam bidang skema opsional tersembunyi `dictionary_data`.

Satu hasil langsung mengisi editor terbuka; beberapa hasil memakai daftar pratinjau horizontal dengan pemilihan dan konfirmasi. Pencarian kosakata mempertahankan teks serta token komposisi pengguna. Pelafalan dan definisi langsung dikomit. Setiap arti, termasuk yang dipisahkan titik koma, menjadi definisi tersendiri. Cognis menyediakan penerjemahan bahasa UI yang belum tersedia melalui kapabilitas lokalisasi opsional; modul tidak mengarang terjemahan atau menyalin bahasa Inggris ke bahasa lain. URL sumber dan rekaman asli lengkap hanya disimpan sebagai metadata tersembunyi `dictionary_data`.

Revisi skema 88 dan versi modul/paket konten 2.2.84 menerbitkan bidang data sumber. Impor semua makna melalui pratinjau host, atau pilih sebagian sesuai batas definisi host. Hasil asli lengkap tetap disimpan terlepas dari makna yang ditautkan.

## Identitas permintaan Jisho

Permintaan Kanji dan kata ke Jisho kini mengirim User-Agent Cognis yang deskriptif. Ini mengatasi respons HTTP 403 yang ditemukan saat memakai identitas permintaan bawaan Node, termasuk pencarian 教. Log kegagalan mencatat kode kesalahan yang aman dan status HTTP jika tersedia, membedakan penolakan penyedia, format respons tidak valid, dan kegagalan transportasi tanpa merekam isi respons. Versi modul/paket konten 2.2.86 tetap memakai revisi skema 88.

## Asal kamus tersembunyi

Saran Jisho kini menyimpan URL sumber yang tepat di bidang dictionary_data tersembunyi bersama catatan sumber lengkap. Cognis mengimpor metadata ini secara langsung tanpa tautan sumber yang terlihat atau popup hasil. Versi modul/paket konten 2.2.87 tetap memakai revisi skema 88.

## Makna kamus terpisah

Hasil kata Jisho kini menghasilkan setiap makna bahasa Inggris sebagai definisi terpisah, bukan gabungan dengan titik koma. Titik koma dalam makna yang dikembalikan juga dipisahkan. Setiap definisi memiliki identitas sumber tersendiri, sementara rekaman sumber tersembunyi mempertahankan semua makna dan bidang penyedia. Versi modul dan paket konten 2.2.88 mempertahankan revisi skema 88.

## Tautan pelafalan kamus

Impor kamus menyelesaikan pelafalan lengkap ke Kana terpasang melalui kecocokan lengkap terpanjang, termasuk karakter gabungan seperti きょ dan っく serta posisi berulang. ID entri kanonis disimpan dalam kelompok bacaan berurutan; bacaan dengan karakter yang hilang tidak ditautkan sebagian. Definisi menggunakan kembali kartu yang cocok atau membuat kartu melalui alur editor biasa. Karusel tetap menjadi cara utama membuat kartu turunannya. Karakter dan partikel tetap menjadi lapisan hanya-baca yang dikelola penyedia. Editor kalimat tidak menawarkan pencarian kamus.

## Semua kandidat kamus

Satu hasil langsung mengisi editor terbuka; beberapa hasil memakai daftar pratinjau horizontal dengan pemilihan dan konfirmasi. Pencarian kosakata mempertahankan teks serta token komposisi pengguna. Pelafalan dan definisi langsung dikomit. Setiap arti, termasuk yang dipisahkan titik koma, menjadi definisi tersendiri. Cognis menyediakan penerjemahan bahasa UI yang belum tersedia melalui kapabilitas lokalisasi opsional; modul tidak mengarang terjemahan atau menyalin bahasa Inggris ke bahasa lain. URL sumber dan rekaman asli lengkap hanya disimpan sebagai metadata tersembunyi `dictionary_data`.

## Pencarian kamus dan cache

Cognis core memiliki cache kamus melalui `core:cache`. Kueri menjadi dingin setelah satu jam dan diperiksa saat dipakai lagi. Perubahan diterbitkan pada batas dua belas jam; konten yang tidak berubah dipertahankan. Permintaan bersamaan berbagi pemeriksaan, kegagalan mempertahankan data cache berhasil, dan cache persisten bertahan setelah restart. Modul tidak menjadwalkan kueri kamus atau menyimpan cache respons kamus. Jisho tidak memiliki umpan perubahan ringan, sehingga pemeriksaan memakai respons pencarian biasa. Tidak ada kontrol Refresh manual. Tautan lokal memakai kartu Library yang saat ini dapat diakses.

## Persyaratan impor kalimat

API kata Jisho (`/api/v1/search/words`) memberikan bentuk leksikal, bacaan, makna, tag, dan kelas kata. Kueri kalimat dapat menghasilkan kecocokan kata penyusun, tetapi JSON tidak memuat terjemahan kalimat, posisi token, penyelarasan perubahan bentuk, atau keterikatan partikel. Pencarian contoh kalimat adalah pencarian korpus, bukan penerjemahan sembarang masukan. Impor satu klik yang andal membutuhkan penganalisis morfologi Jepang dengan posisi permukaan, lema, kelas kata, dan bacaan kontekstual; penyedia terjemahan kalimat; serta perencana graf milik modul yang memetakan perubahan bentuk ke descriptor transformasi Cognis. Graf harus merekonstruksi kalimat asli beserta tanda baca, menyelesaikan pelafalan ke Kana yang tersedia, mengutamakan kartu kosakata, partikel, dan karakter yang ada, dan hanya membuat kosakata atau Kanji yang dapat diedit serta definisinya. Karakter dan partikel tetap dimiliki penyedia. Host memvalidasi graf, cakupan, ACL, ambiguitas, duplikat, dan pembatalan atomik. Jisho memperkaya simpul kata dan Kanji, tetapi tidak menyediakan seluruh proses ini. Kapabilitas impor kalimat tidak diumumkan sebelum proses tersebut tersedia.

## Pencarian Kanji khusus

Kanji di luar konten bawaan kini menggunakan halaman Kanji khusus Jisho, bukan API kata leksikal. Penyedia mengimpor bacaan Kun/On, makna, jumlah goresan, tingkat sekolah, tingkat JLPT, dan frekuensi. Pemisah bacaan dihapus dari pelafalan, sementara notasi sumber disimpan dalam dictionary_data. Kegagalan penyedia dilaporkan sebagai kesalahan pencarian, bukan hasil kosong. Penyedia KanjiVG secara eksplisit mendeklarasikan kapabilitas dan bidang pola goresannya. Versi modul/paket konten 2.2.85 tetap memakai revisi skema 88.

## Pencarian otoritatif

Permintaan kata dan Kanji mengambil data Jisho yang otoritatif meskipun konten bawaan cocok. Konten lokal hanya menjadi cadangan saat pengambilan jaringan dinyatakan tidak tersedia; resolusi Kana tetap lokal dan milik penyedia. Pencarian Kanji tunggal mengambil bacaan Kun/On, arti, jumlah goresan, tingkat sekolah, JLPT, dan frekuensi. Permintaan memakai User-Agent Cognis, batas waktu 15 detik, serta log kegagalan yang aman. Kegagalan transportasi menjadi kesalahan, bukan hasil kosong.

## Pencarian kamus yang stabil

Jisho mengambil data leksikal dan Kanji terbaru atas permintaan host. Kecocokan kata/bacaan tepat diutamakan atas kecocokan terkait, entri yang lazim ditulis dalam Kana mempertahankan bentuk tersebut, dan hasil judul khusus Wikipedia dikecualikan. Bacaan yang hilang tidak diganti dengan definisi atau pelafalan buatan. Definisi dan metadata sumber tetap terpisah; Cognis mengatur seluruh kebijakan cache.

Cognis core mengelola cache kamus melalui `core:cache`. Kueri tersimpan menjadi dingin setelah satu jam; penggunaan berikutnya memeriksa perubahan pada penyedia. Hasil yang berubah menunggu batas penerbitan dua belas jam, sementara isi yang tidak berubah tetap dipertahankan. Kueri bersamaan berbagi satu pemeriksaan; kegagalan pemeriksaan mempertahankan hasil terakhir yang berhasil. Status cache bertahan setelah mulai ulang. Modul mengambil data penyedia tanpa menjadwalkan kueri atau menyimpan cache respons sendiri. Jisho tidak menyediakan umpan perubahan ringan, sehingga pemeriksaan memerlukan respons pencarian biasa. Tidak ada kontrol Muat Ulang manual. Tautan pelafalan dan kartu selalu diselesaikan terhadap konten yang saat ini dapat diakses.

## Graf bacaan kamus

Data sumber kamus tetap menjadi metadata tersembunyi dalam penyusun kartu dan tampilan detail. Pelafalan impor memakai bacaan Kosakata tersembunyi dengan cakupan yang sama dengan kartu induknya. Kanji dengan beberapa bacaan memakai satu rekaman tersembunyi per bacaan, dengan tautan judul ke Kanji sumber dan tautan pelafalan Kana berurutan; Kanji dengan satu bacaan terhubung langsung ke Kana. Bacaan kata lengkap memakai segmen bacaan Kanji tersedia yang paling dekat dan Kana sisanya. Definisi ditautkan langsung ke bacaan tersembunyi. Cognis menyelesaikan identitas penyedia dan menyimpan graf secara atomik melalui validasi bidang, lapisan, dependensi, dan ACL biasa. Karakter dan partikel tetap dikelola penyedia. Gema Katakana berlebihan dari bacaan Hiragana setara disaring kecuali kamus menyatakan ejaan Katakana tersebut; bacaan on Kanji resmi dan bacaan kata serapan asli dipertahankan.

## Tahap operasi tervalidasi

Aset goresan KanjiVG menggunakan cache modul terpisah dan terbatas: maksimal 512 label, respons berhasil selama 24 jam, dan aset hilang selama lima menit. Permintaan bersamaan berbagi pengambilan; kegagalan dibuang. Cache aset ini tidak mengatur pencarian kamus atau navigasi aplikasi. Jisho dan KanjiVG memakai pemuat konten deterministik `api/reuse/content.js`; penyedia goresan memakai `api/reuse/lookup-cache.js`. Versi modul dan paket konten 2.2.96 mempertahankan revisi skema 88. Jisho mendaftar melalui kapabilitas host `study:library:provider` dengan `searchable: true` dan kapabilitas `dictionary`. Kana, Kanji, dan Kosakata didukung; kalimat dan pembuatan partikel milik penyedia dikecualikan.

## Entri kamus umum

Untuk kecocokan yang sama persis, entri Jisho bertanda is_common didahulukan daripada entri yang tidak umum. Kecocokan persis tetap mengungguli kecocokan terkait. Jisho tidak memberi frekuensi setiap makna: definisi mempertahankan urutan asli, termasuk room sebagai makna pertama 室, bukan dibalik oleh penyusun.

## Transformasi kamus

Kartu transformasi menyelaraskan judul, bacaan, dan definisi dalam satu kolom. Tindakan bentuk dasar memakai gaya tombol netral. Saat menyeret, penanda sisipan vertikal tampil sebelum atau sesudah penempatan tujuan. Impor Jisho menyimpan tag keluarga konjugasi yang didukung pada kartu kosakata; kata kerja yang baru dibuat membuka pemilih transformasi sebelum ditambahkan ke komposisi induk. Kata keterangan mempertahankan kelasnya; skema Jepang saat ini tidak mendefinisikan transformasi kata keterangan.

Penyedia kamus dapat mengembalikan prerequisites berupa daftar { key, layer, label }. Setelah hasil dipilih dalam penyusun, Cognis menyelesaikan kartu tulisan gabungan yang sudah ada dalam cakupan tujuan atau mengambil dan membuat kartu yang belum ada beserta definisi dan graf bacaannya. Karakter atomik dan partikel tidak dapat dibuat melalui jalur ini. Kunci alias diganti dengan ID kanonis pada kartu utama dan referensi bacaan tersembunyi. Masukan kosakata tetap utuh; referensi tulisan impor hanya digunakan selama masukan masih sesuai dengan pencarian. Menelusuri hasil pencarian tidak membuat kartu prasyarat.

Kolom wajib yang belum ada dilengkapi melalui penyedia pencarian tambahan yang terdaftar sebelum penyimpanan; pola goresan Kanji berasal dari KanjiVG. Setiap Kanji, definisi, dan bacaan tersembunyinya disimpan sebagai satu graf tervalidasi dalam cakupan yang ditentukan.

## Aksara pelafalan Kanji

Pencarian Kanji mengubah bacaan On Katakana dari Jisho menjadi Hiragana untuk pelafalan kartu dan tautan bacaan. 僕 menyertakan ぼく bersama しもべ. Pelafalan Kun dan On yang sama disatukan setelah konversi; notasi asli seperti ボク tetap tersimpan dalam metadata kamus tersembunyi. Ejaan Katakana kosakata dan penyaringan bacaan pencarian duplikat tetap berfungsi seperti sebelumnya.

Bacaan utama mengikuti kecocokan kata persis yang umum dari Jisho: 僕 menampilkan ぼく terlebih dahulu, lalu しもべ. Kata terkait dan bacaan Kanji yang tidak tercantum tidak mengubah urutan. Jika pencarian kata gagal, hasil Kanji tetap dapat digunakan dan kegagalan dicatat dengan aman.

## Navigasi Jelajahi

Revisi skema 89 menetapkan jalur Jelajahi `kana`, `kanji`, `vocabulary`, dan `sentences` di bawah `/study/explore/ja/`. Versi modul dan paket konten adalah 2.2.99. Cognis mengelola impor, batas, pembagian dek, dan navigasi; modul menyediakan nama lapisan deklaratif dan konten kamus.

## Dek Kartu Belajar Awal

Penyedia Jepang menyediakan tiga dek awal dalam `data/starter-decks.json`: Dasar Hiragana, Kanji Sehari-hari, dan Kata Jepang Pertama. Setiap dek memiliki kunci stabil, nama lokal, ID skema, dan ID rekaman sumber. Deskriptor bahasa menampilkan data deklaratif sebagai `starterDecks`. Cognis menyelesaikan ID menjadi ID Library, menyembunyikan dek yang tidak lengkap dan penyedia nonaktif, serta mengelola penelusuran, favorit, berbagi, dan kemajuan belajar. Modul tidak membuat dek atau mengakses basis data host.

## Perbaikan tinjauan

Modul Jepang 2.2.100 langsung mewajibkan `study:library:provider` dan menghapus pendaftaran penyedia saat impor, publikasi kapabilitas, atau pendaftaran alur gagal. Skema 89 dan paket konten 2.2.99 dipertahankan; rilis ini mengubah integrasi dan keterbacaan, bukan data bahasa.

## Dek Awal Diperluas

Bahasa Jepang menyediakan enam dek awal: hiragana dan katakana lengkap masing-masing 46 kartu, sepuluh kanji, sembilan kata, delapan verba dan dua belas kalimat. Kunci tetap stabil dan seluruh anggota adalah rekaman penyedia yang terlihat.

## Perbaikan Konten dan Kontrak

Pertanyaan lokasi sopan diakhiri か dengan partikel kanonis dan empat terjemahan. Identitas kalimat tetap. Kegagalan aktivasi melepas penyedia dan mencatat metadata aman. Instruksi menetapkan ctx sebagai tulang punggung aplikasi serta mempertahankan pelafalan kalimat yang diturunkan oleh host.

## Jamak kelompok Jepang yang dipilih secara eksplisit

Skema 90 dan paket konten 2.2.102 mendeklarasikan enam keluarga nomina bernyawa dan pronomina melalui kontrak transformasi opsional Cognis (`optInTag: plural`). Akhiran `たち` menunjukkan kelompok atau orang terkait, bukan akhiran jumlah universal seperti dalam bahasa Inggris. Label, bacaan, dan definisi terlokalisasi berubah bersama, sementara referensi kalimat mempertahankan kartu dasar. Dataset tidak menggandakan kartu jamak turunan. Versi modul: 2.2.102.

## Standar kontributor templat

Selaraskan AGENTS.md dengan templat modul eksternal sambil mempertahankan aturan domain. Gunakan lokasi catatan rilis kanonis dan pertahankan konten historis serta identitas modul permanen.

## Struktur standar dan integrasi milik modul

Sinkronkan panduan templat, jalur rute domain, dokumentasi integrasi terjemahan, pemeriksaan struktur, dan hash paket akhir. Pertahankan URL publik dan identitas modul. Kontribusi browser mengikuti kontrak siklus hidup host masing-masing.

## Merek belajar dan ilustrasi

Namai ulang modul menjadi Belajar Bahasa Jepang dan sediakan ikon serta banner PNG yang serasi, dengan ilustrasi penting di area tengah yang aman dari pemotongan Marketplace. Perbarui nama terjemahan dan dokumentasi integrasi sambil mempertahankan UUID modul, kode bahasa, nama paket dan identitas konten.

## Deskripsi Marketplace yang konsisten

Gunakan ringkasan tindakan singkat dan deskripsi fitur konkret pada metadata Marketplace dengan makna terjemahan yang selaras.

## Satukan tampilan pelafalan Study

Study menyediakan klasifikasi dan gaya pelafalan publik yang digunakan kembali oleh pratinjau Library, judul detail, varian, jawaban kartu, pilihan membaca, dan area gambar. IPA mempertahankan notasi aslinya; bacaan biasa mempertahankan tipografi aplikasi pilihan pengguna. Skema kalimat Jepang dan Inggris memerlukan sedikitnya dua referensi kata.

## Wajibkan kunci bahasa tanpa teks pengganti literal

Instruksi AI melarang teks bahasa Inggris yang ditanam langsung untuk pengguna dalam setiap alur. Nilai yang tidak tersedia dalam bahasa pilihan dapat menggunakan kunci yang sama dari sumber daya XML bahasa Inggris. Nilai pengganti bahasa Inggris yang hilang atau kosong harus menimbulkan kegagalan eksplisit, bukan menampilkan teks Inggris literal, kunci mentah, atau teks kosong. Kesalahan terjemahan yang hilang tidak boleh disembunyikan.

## Kembalikan graf kamus lengkap

Kandidat Jisho tanpa rekonstruksi Kana lengkap ditolak. Anak bacaan Kanji menautkan definisi dalam graf impor yang sama; Kanji dan kosakata tanpa pemetaan mendapat kelas semantik.

## Pertahankan bagian bacaan Kanji

Notasi Kun bertitik mempertahankan bagian Kanji saja: `おし.える` menjadi `おし`, sementara notasi asli tetap dalam metadata tersembunyi.

## Sampel kurva kuadratik halus

Perintah SVG kuadratik halus mencerminkan titik kontrol kuadratik sebelumnya; riwayat kurva kubik dan kuadratik tetap terpisah.

## Batasi permintaan goresan jarak jauh

Pencarian goresan menerima paling banyak enam belas unit tulisan, berbagi satu tenggat lima belas detik untuk seluruh permintaan glif, dan membatalkan respons yang melebihi satu juta byte.

## Struktur modul Study

Paket konten berada di `data/library/`: manifes, skema, dan berkas kontennya membentuk satu batas impor dan penghapusan. Dek awal tetap di `data/starter-decks.json`. Penyedia runtime berada di `api/dictionary/` dan `api/strokes/`; pemuatan deterministik serta dekode respons dengan batas byte berada di `api/reuse/`. Pengujian konten dan siklus hidup lintas lapisan berada di `tests/`, sedangkan pengujian penyedia, transportasi, dan API berada di `api/tests/`. Manifes mendeklarasikan `api/routes/config/index.js` sebagai `disabledApi`; titik masuk itu hanya mendaftarkan rute DELETE konfigurasi khusus administrator tanpa mengimpor konten atau mengaktifkan penyedia. Pengenal alur yang telah dipublikasikan tetap stabil.

## Komposisi dengan jeda dan penggantian manual

Rekaman awal memakai model neural multibahasa Kokoro secara offline dengan suara Inggris `bf_emma` dan Jepang `jf_alpha`. Klip memakai 128 kbps, jeda awal 200 ms, jeda akhir 180 ms, normalisasi puncak terbatas, dan ucapan lebih lambat. Atribusi model dan lisensi Apache disimpan di `data/audio/VOICE-LICENSE.txt`; inventaris mencatat suara dan pengolahannya.

Kartu kalimat memiliki bidang audio opsional. Pada pemutaran pertama, Cognis mengotorisasi setiap unsur, memilih hanya kelompok pelafalan pertama, menerapkan transformasi yang dipilih, dan membuat satu WAV berkelanjutan dengan jeda awal serta jeda kata, koma, dan akhir kalimat. Rekaman disimpan secara privat; byte unsur, perubahan bacaan, transformasi, dan jeda menentukan identitasnya. Mekanisme ini berlaku sesuai kebutuhan untuk kartu baru maupun yang sudah ada. Mengunggah audio di penyusun biasa langsung menggantikan pemutaran hasil komposisi. Menghapus berkas eksplisit mengaktifkan komposisi otomatis lagi. Penyedia memasok klip kata; Cognis mengelola komposisi dan kebijakan cache.

## Cakupan inventaris referensi

Katalog referensi Jepang memuat seluruh 13.108 karakter dari salinan resmi KANJIDIC2 yang dipaketkan. Katalog Inggris memuat seluruh 135.969 entri leksikal Open English WordNet dengan 127.311 kunci ternormalisasi. Keduanya adalah penyedia kamus terpisah yang dimuat sesuai kebutuhan, bukan 149.077 kartu awal yang langsung diimpor. Pilih Kamus Referensi dalam pencarian Study untuk mengimpor entri yang didukung melalui validasi graf biasa. Rekaman tanpa makna atau bacaan yang dapat digunakan tetap tidak diketahui; pelafalan, terjemahan, dan diagram goresan tidak dibuat-buat. Inventaris ini bukan seluruh Han Unicode dan bukan daftar semua kemungkinan kata bahasa Inggris.

Bacaan Kanji diurutkan berdasarkan bukti umum JMdict dan penanda frekuensi yang tersedia, termasuk bentuk okurigana; tautan kelompok dan audio awal mengikuti urutan yang sama. Audio Kanji selalu memakai pelafalan pertama yang ditulis. Kartu kata Inggris yang ada memiliki satu IPA; entri referensi mempertahankan urutan sumber dalam ragam Britania pilihan sebelum ragam lain. Frekuensi pelafalan bergantung pada konteks dan sumber tidak menyediakan peringkat universal untuk setiap bacaan.

## Rekaman bacaan utuh untuk referensi

Bahasa Jepang juga menyertakan 2.913 klip neural bacaan utuh dalam bank berkas terbatas di `data/audio/reference/`. Bersama rekaman awal, klip ini mencakup bacaan utama seluruh 12.356 karakter sumber yang memiliki bacaan; 752 karakter lainnya tidak diberi audio yang dibuat-buat. Indeks memilih bacaan pertama yang ditulis serta memeriksa batas berkas dan pembatalan. Buat rencana dengan `python3 scripts/reference-audio.py plan --work <directory>`, proses inventarisnya dengan skrip sintesis, lalu gunakan `pack` untuk menulis bank terbatas.

Alat pemeringkat Jepang menerima `--dictionary <JMdict.gz> --kanji-dictionary <KANJIDIC2.xml.gz> --output <priorities.json>` serta opsi `--content-root data/library/content`. Alat mengutamakan bacaan leksikal mandiri yang umum, mengurutkan bacaan lain dari penyelarasan kata terverifikasi berbobot frekuensi, dan mempertahankan pilihan kartu tunggal yang ditinjau dalam `data/audio/primary-readings.json`. Penyuarakan dan geminasi dipetakan kembali ke bacaan sumber kanonis. Bacaan kun, on, dan nama tetap tersedia; hanya bacaan pertama yang dipilih menentukan pemutaran dan identitas cache. Penanda frekuensi membantu pengurutan dan bukan ukuran frekuensi pelafalan universal.

## Integrasi ucapan opsional

ElevenLabs dinyatakan sebagai dependensi modul opsional. Instalasi dapat menawarkannya untuk sintesis ucapan, tetapi Study serta audio manual dan komposit tetap tersedia tanpanya.

## Terbitkan ucapan tanpa hak istimewa

Terbitkan `elevenlabs-tts:synthesis` di namespace milik modul dan hapus penanda hak istimewa. Study Inggris dan Jepang menemukan kapabilitas ini melalui ctx dengan dependensi modul opsional yang ada. Jembatan Study menerima pengambil kapabilitas langsung dari pemanggil sehingga penonaktifan, pengaktifan kembali, dan suara yang diatur tetap berfungsi.

## Pertahankan ucapan opsional

Kapabilitas yang diterbitkan melaporkan kesiapan langsung melalui `configured`. Study mengaktifkan ucapan otomatis hanya setelah kunci API dan suara bawaan disimpan. Jika ElevenLabs tidak terpasang, dinonaktifkan, atau belum diatur, pendaftaran bahasa tetap berhasil dan audio unggahan serta komposisi cadangan tetap tersedia tanpa meminta sintesis.

## Perbaiki instalasi tanpa media bawaan

Hapus deklarasi direktori aset yang tidak digunakan dari paket konten khusus data dan tingkatkan versinya. Validasi jalur paket melalui instalasi sementara yang hanya berisi berkas terkemas agar aktivasi tidak bergantung pada direktori lokal kosong.

## Kirim rekaman suara yang konsisten

Rekaman dengan suara khusus bahasa disertakan untuk semua kartu terkurasi yang bersuara serta varian jamak atau verba/adverbia yang dapat dicapai. WAV kalimat memakai PCM penyusun yang sama persis sesuai urutan dan transformasi terpilih. Asal suara, model, permintaan, checksum, dan pemeriksaan keheningan dicatat tanpa menyertakan kredensial.

## Kontrol Belajar Tersimpan

Rekaman kata Jepang dengan kana kecil, termasuk 学校, dibuat ulang dengan ejaan kanji jika tersedia menggunakan suara Jepang yang ditetapkan dan pengaturan stabil. Kalimat bawaan disusun ulang dari klip yang sama persis. Transformasi adjektiva I dan Na mencakup bentuk adverbial, negatif, serta lampau, dengan rekaman khusus untuk bentuk bawaan. Rekaman jamak bahasa Inggris tetap berupa aset khusus dan diputar saat bentuk tersebut dipilih.

## Gambar Referensi

Menambahkan kolom daftar gambar opsional, unggahan privat, dan galeri detail. Kedua modul bahasa menyertakan foto referensi berlisensi dan menyediakan kolom yang sama pada setiap lapisan.

## Rekaman Kalimat Langsung

Kalimat bawaan memakai rekaman kalimat utuh yang dibuat langsung sebelum audio komposit. Kalimat baru atau yang belum direkam memakai komposisi host dengan PCM penyusun berurutan dan transformasi terpilih; varian yang hilang tidak diganti bentuk dasarnya. Rekaman mencakup paket terkurasi, bukan seluruh entri kamus atau semua kemungkinan kalimat buatan pengguna. Menyertakan 34 rekaman kalimat baru dengan suara `xya0RvcJtofTcFTOdX4E`. Bahasa Jepang membuat ulang 124 klip kana dan mengirim kana/kanji, bukan romaji. Permintaan menyimpan model stabil, kecepatan, kemiripan, seed, serta asal suara yang terdokumentasi.

## Foto Referensi Kosakata

33 kartu kosakata terkurasi kini memiliki foto referensi bawaan (32 berkas gambar). Cakupan meliputi semua nomina konkret serta tindakan dan sifat yang jelas secara visual; tata bahasa, pronomina, dan konsep abstrak tidak diberi gambar pengisi yang menyesatkan. Homofon Jepang seperti 花/鼻, 橋/箸, 雨/飴, dan 紙/髪/神 memakai referensi berbeda. Gambar dimuat secara lokal melalui galeri detail kartu dan pratinjau gambar penuh yang sudah ada. Judul sumber, pembuat, lisensi Creative Commons/domain publik per gambar, serta checksum dicatat dalam [katalog gambar](../../data/library/assets/images/catalog.json) dan [kredit foto](../../data/library/assets/images/LICENSE.md). Gambar kartu khusus pengguna tetap dilindungi host saat penyedia dimuat ulang.

## Ilustrasi Kosakata

Setiap kartu kosakata bawaan kini memiliki ilustrasi tersendiri yang dihasilkan dengan gaya anime (70 kartu). Benda konkret, tindakan, dan adegan kontekstual untuk konsep abstrak ditampilkan melalui galeri detail kartu dan popup gambar yang sudah ada. Foto sumber lama telah diganti. [Katalog gambar](../../data/library/assets/images/catalog.json) mencatat sumber pembuatan, gaya, asal potongan, checksum, dan pemetaan kartu; [lisensi gambar](../../data/library/assets/images/LICENSE.md) menjelaskan karya bawaan. Gambar dimuat secara lokal, dan host mempertahankan gambar khusus pengguna saat penyedia dimuat ulang.

## Kosakata Rumah Tangga

Lima belas nomina sehari-hari mencakup furnitur, pakaian, benda, dan makanan, dilengkapi makna dalam empat bahasa, tautan pelafalan, rekaman khusus, serta dek Benda Sehari-hari. Nomina bahasa Inggris yang dapat dihitung menyertakan transformasi jamak dengan rekaman, termasuk fish yang tidak berubah; rice tetap nomina tak terhitung. Ejaan Jepang untuk pemula menautkan bacaan lengkap ke kana atomik, termasuk tanda vokal panjang ー dalam テーブル dan コート.

## Kosakata Makanan dan Tubuh

Tambahkan 32 nomina berilustrasi: enam belas makanan dan enam belas istilah tubuh, dengan makna dalam empat bahasa serta dek Makanan dan Tubuh terpisah. Bahasa Inggris menyertakan 25 transformasi jumlah dengan rekaman, termasuk feet, teeth, potatoes, dan mouths dengan konsonan bersuara; makna nomina tak terhitung seperti daging ayam, daging sapi, mentega, dan kulit tidak memiliki keluarga jamak. Bahasa Jepang mempertahankan jalur lengkap ke kana atomik, memisahkan makna kaki dan tungkai dari あし menjadi definisi tersendiri, serta memakai kembali rekaman asli jika masukan pelafalannya identik. Empat kalimat contoh yang ditulis secara individual per bahasa memiliki rekaman neural langsung yang diprioritaskan di atas rekaman gabungan dari klip unsur yang persis sama. Semua ilustrasi disertakan secara lokal dengan gaya seni yang telah ditetapkan untuk masing-masing bahasa.

## Perbaikan tinjauan dan inventaris rekaman

Metadata rekaman memakai manifes ringkas dan inventaris dengan checksum untuk karakter, kosakata, transformasi, kalimat, dan komposisi kalimat. Audio, asal suara/permintaan, dan prioritas pencarian tetap sama. Impor referensi membaca bahasa paket; pembersihan mencoba seluruh registrasi meskipun ada kegagalan. Kegagalan kamus membatalkan isi respons dan pemuatan referensi dapat dicoba lagi. Dokumentasi menjelaskan konfigurasi dan gambar yang dihasilkan.

## Hasil pencarian bahasa Jepang lengkap

Respons JSON Jisho dan HTML Kanji memakai pembaca bersama dengan batas byte. Semua makna sumber dipertahankan, termasuk empat belas makna 節. Pola goresan kana kecil jarak jauh memakai proporsi yang sama dengan panduan paket. Tautan asal historis memakai hash implementasi lengkap dan tetap dari riwayat repositori yang tersedia.

## Normalisasi katalog eksplisit dan inventaris komposisi kalimat

Pembaca katalog menerima kebijakan normalisasi dari penyedia bahasa: NFC untuk Inggris, NFKC untuk Jepang. Kode pencarian bersama tidak lagi bercabang menurut bahasa tertentu. Inventaris komposisi kalimat bernama `sentence-compositions`; setiap entri menjelaskan rekaman paket nyata yang disusun dari klip penyusunnya secara berurutan. Rekaman kalimat neural langsung tetap terpisah dan diutamakan saat diputar.

## Label ilustrasi terlokalisasi dan nama aset netral

Nama berkas dan ID ilustrasi memakai digest SHA-256, sedangkan pengenal lembar sumber memakai digest sumber. Metadata katalog menyediakan label Jerman, Inggris, Indonesia, dan Jepang dari makna kartu yang sudah ditulis. Label tampilan terpisah dari pengenal penyimpanan netral. Data gambar dan identitas kartu tetap sama; revisi konten memperbarui semua referensi gambar paket.

## Penggunaan

Pindahkan sintesis ElevenLabs ke modul terpisah yang dapat dikonfigurasi. Study memakai suara opsional per bahasa untuk kartu global tersimpan, sedangkan kartu pribadi dan kelas menerima unggahan terbatas dan rekaman mikrofon. Pertahankan komposisi kalimat berkelanjutan sebagai cadangan dari rekaman penyusun yang tersedia. Administrator dapat membuat ulang audio global saat mengedit.

## Perbaiki aktivasi Study

Naikkan versi paket konten Inggris dan Jepang saat menghapus rekaman bawaan. Selesaikan rekonsiliasi modul lain sebelum melaporkan aktivasi gagal agar rute persetujuan tetap memiliki alur terdaftar.

## Buat ulang seluruh rekaman

Seluruh 3273 rekaman dalam paket kini memakai suara ElevenLabs yang dikonfigurasi untuk bahasa ini. Bacaan yang ditulis, identitas kartu, jeda awal, dan komposisi kalimat berirama tetap dipertahankan. Alat pembuatan menggunakan kredensial lingkungan, cache respons API yang dapat dilanjutkan, dan penggantian berkas atomik; paket tidak berisi kredensial. Inventaris, atribusi, revisi konten, dan hash integritas mencerminkan rekaman baru.

## Tinjauan Akhir dan Akses Bahasa Nonaktif

Pencopotan menghapus konfigurasi suara tanpa bergantung pada retensi konten. Penonaktifan menghapus rute modul, UI statis, dan registrasi penyedia; konfigurasi bertahan saat dinonaktifkan atau dimulai ulang dan hanya dilayani ketika aktif. Cognis membatasi skema, kartu, dan media tersimpan menurut penyedia bahasa aktif serta memulihkan akses saat diaktifkan kembali. Hasil referensi menggabungkan identitas sumber setara sambil mempertahankan rekaman sumber, urutan bacaan, dan makna. Kalimat paket mengutamakan PCM komposisi persis dari klip penyusun, sebelum rekaman langsung yang disimpan terpisah. Permintaan suara memvalidasi teks bahasa ternormalisasi dengan batas panjang; KanjiVG membatalkan isi respons gagal dan menerima tanda vokal panjang.

## Komit

- [b41da01](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b41da011d6026d909c55369d3598e8334bbffe94) — Menyelaraskan penanda transformasi dengan Cognis.
- [ac2bc76](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ac2bc76bc15ec0898b023e7f170e106935f7a438) — Menganotasi setiap definisi transformasi verba.
- [cf02a4a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cf02a4ae4c296f4d67d86ff21c099ecb5bea8a8c) — Menempatkan penanda transformasi pada definisi verba.
- [5098a12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5098a123745e0ee72e3afad297d81a0505792aa0) — Mengadopsi transformasi definisi yang dapat disusun.
- [da436b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/da436b4e3c0f9b92a7ee895980129d572b633da7) — Menambahkan penggantian definisi kontekstual.
- [340b525](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/340b525fc838313d937498bc2fcc8f20c48c75e2) — Mempertahankan rasio gambar dan kelompok goresan.
- [dee7ab5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/dee7ab5e5f1cbc78a28eb526f0b07c421c151054) — Menghapus panduan identitas yang terduplikasi.
- [288aa01](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/288aa0165b63cc7810fcf50530df7d49fc1a70c5) — Menampilkan entri struktur kalimat pada composer.
- [0895472](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0895472e7c61aa0858fd6d8a1aa6d6f27852d0ce) — Memperluas penghubung kalimat dan bentuk kopula.
- [92992d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/92992d5f65831215de331f4af3da924a006fecb7) — Memperbaiki validasi metadata transformasi kopula.
- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6) — Memulihkan tautan mendalam pelafalan kosakata.
- [0b38fbd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0b38fbdfd4c7e9ffc8710b73df259f7d567a33fe)
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
- [7d529da](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d529da851a5301f3dd04ee4b1d71e17053248f9)
- [5f901fc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5f901fc476e5b4e4e61f18ab612bbd8a3eb9c860)
- [f910563](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9105630f0ee87cad60fc67c99f46a311bcdb68b)
- [785fb21](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/785fb21beeb8addd3160e4dc46e0052f69a5efa1)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- [fdf2319](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594)
- [48b4d1a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4)
- [253824c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b)
- [8f7dc3d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e)
- [1cebe54](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3)
- [89e41b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6)
- [edef816](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae)
- [fc1f65d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fc1f65d25aa2e4d52bef4dc5290eb127a7033a68)
- [618b1c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/618b1c901ac826fd81a584d5ff9baa98c8033d91)
- [84e49de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/84e49de45b43f6f0b0cdb8087eeb03cc40f6389c)
- [94e57eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/94e57eb29bdebb3e64e057e082608a25e72b33d0)
- [315dded](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/315dded455234476da36402728c09b9e64b3fd5d)
- [4db2d6f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4db2d6f76a6328592520ef23528958b42d95e166)
- [fd7b3fa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fd7b3fa218e80d8ce2657666adb544680d925fd5)
- [c002077](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c00207784c18bfafe9548cf449176f74768f0a14)
- [f3d77c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3d77c941a7e44982c1cf60f04cfdbb8e26d2e36)
- [7d637de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d637de2c5429fb58d95f2ad542540fbc7e458b7)
- [1e8c8df](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1e8c8dfcd5c7321519c0ea38d8a8fd788335441e)
- [25322ff](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/25322ff741a62e990f6c4664f0b6083415c649ea)
- [2476657](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2476657ff36854d1a0688680cb9097f2585dad16)
- [5df0f61](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5df0f611c9161f100508565013ea6d43edb2e897)
- [4d7712d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4d7712d1eacf7bbfecf6a48bf6bffc3133afc046)
- [0d7a90c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0d7a90cf679be17bfc39d430ca7552e2a679c74b)
- [6a0ed76](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6a0ed76b5c9afa7d7ab1352cd002630b0b334f90)
- [4b2be81](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4b2be81112494881d4e87e56d19bf94bc1ea801d)
- [293ce22](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/293ce2259636c1c527f4e8b477782f6fc2153198)
- [c6fa056](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c6fa05621ba5a97c218d2aafab91e10e6a2d305c)
- [35759eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/35759eb887310f2bec217c4e4335b0a07323c2f6)
- [13244eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/13244eb79d34f999d74def0e47fe67700fbfb42e)
- [4f906f3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4f906f37c3a33d8b38352f917fd771413c4e98e5)
- [b2de30f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2de30f212b0b9ae28a67008c0393c1116b2fca0)
- [b0b657d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b0b657d09fdc6d8c8ce9ac1388907f25a89304a3)
- [f729231](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f72923181dd412aa76c7501056b19318367524e4)
- [97b6e4d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/97b6e4d20c01a036f30309663731342f7941ad10)
- [5e5849b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5e5849bf9218b5441070a81ac661b7498b684c59)
- [e4c848b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e4c848bcb8d331facdd92f4696b1009de4f1f1d9)
- [544892a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/544892a8987304d982b2953676f5ddc39eb9c728)
- [63629ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/63629ced95d53d31a2621d2bca5d0bbf55a1dceb)
- [f622269](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f62226988d84c4f05100729795f8a15a6b4d828b)
- [b58c961](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b58c961f9d8a62d407ca65afcf89a5c4f1f41bb2)
- [a830ea7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a830ea741ea15dc65e946d0fdf5f235f0724b86b)
- [b5a876d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b5a876d083a52cbf39bc4f3e36b666bd9ec67bb2)
- [42d3707](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/42d3707a861c32064dcf912446092415104c3db6)
