# Cognis Bahasa Jepang

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Cognis Bahasa Jepang adalah paket konten bahasa Jepang deklaratif untuk Pustaka Study Cognis. Paket ini menyediakan skema berversi serta data karakter, definisi, kata, partikel, dan kalimat tervalidasi tanpa memiliki rute API, persistensi, atau antarmuka peramban.

## Persyaratan

- Cognis dengan gateway Study dan adaptor Pustaka yang aktif.
- Kapabilitas host `study:library:provider`.

Modul eksternal mendeklarasikan gateway Study sebagai dependensi komponennya. Modul menemukan adaptor Pustaka melalui kapabilitas wajib `study:library:provider`, bukan memperlakukan UUID adaptor sebagai komponen yang dapat dipasang secara mandiri.

## Pengembangan

```sh
npm install
npm test
npm run check:manifest
```

Saat bootstrap, modul memperoleh `study:library:provider` melalui `ctx` dan memanggil `ingestContentPack` untuk `data/library`. Cognis menangani keamanan jalur, validasi graf, ID internal stabil, transaksi, idempotensi, persistensi, rute API, dan antarmuka Study yang dibuat dari skema.

Karena deskripsi bahasa tidak mendeklarasikan halaman turunan yang dapat dijalankan, Cognis Study menyediakan tujuan Pustaka yang dihasilkan di `/study/library?language=ja`. Parameter bahasa tervalidasi dipertahankan pada tautan Pustaka, navigasi detail, pemuatan langsung, dan riwayat peramban; pelajar terautentikasi dapat membaca sementara aturan cakupan Pustaka tetap melindungi penulisan dan penerbitan.

Manifest paket konten mencatat penerbit, versi paket yang tidak dapat diubah, revisi konten, jalur skema dan konten, serta lisensi. `schema.json` mendeklarasikan lapisan khusus bahasa Jepang, kolom bertipe, hubungan, kardinalitas, urutan, dan resolver. Berkas konten menggunakan ID lokal paket yang stabil dan referensi eksplisit.

ID data lokal paket hanya menggunakan huruf kecil dan angka ASCII portabel, pemisah, serta titik dua; glif bahasa Jepang ditempatkan di `label`, bukan di `id`. Aturan ini menjaga kompatibilitas ingest dengan kontrak pengenal data Pustaka.

Skema dan paket berbagi namespace `ja`, dan setiap ID data diawali `ja:`. Metadata skema, lapisan, kolom, dan hubungan menyediakan label terlokalisasi dalam bahasa Jerman, Inggris, Indonesia, dan Jepang. Peran semantik, nilai bertipe, petunjuk detail, kompatibilitas aktivitas, jalur minat, target wajib, posisi berurutan, perilaku penghapusan, dan peran resolver memungkinkan Cognis menghasilkan antarmuka netral serta menegakkan kontrak lengkap.

Manifest modul eksternal menerbitkan `/static/modules/study-language-ja/languages` agar Cognis dapat menerjemahkan metadata marketplace sebelum bootstrap modul.

Deskriptor bahasa yang diterbitkan menyediakan nilai `code` kanonis `ja` sekaligus nilai `languageCode` yang kompatibel. Cognis PR #215 menggunakan kode tersebut untuk menandai tombol bahasa aktif dan mempertahankan bahasa terpilih dalam riwayat router saat tujuan subnavigasi Study dibuka.

Lapisan kamus `definitions` mendeklarasikan lokalisasi definisi milik modul dengan kunci string stabil `japanese:definitions:*` dan bidang `localizedText` bertipe. Setiap definisi bawaan memuat teks bahasa Jerman, Inggris, Indonesia, dan Jepang agar konsumen dapat menyelesaikan string tampilan tanpa bergantung pada data bahasa di inti Cognis.

## Audio unit tulisan dan partikel

Unit tulisan atomik dan gabungan menyediakan daftar pelafalan wajib serta kolom unggah audio opsional. Paket tidak lagi menerbitkan URL placeholder eksternal; Library hanya menerima audio yang dibundel sebagai aset paket terautentikasi. Lapisan partikel khusus menyimpan metadata fungsi tata bahasa, dan catatan kalimat dapat mempertahankan referensi kata dan partikel yang berurutan.

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

## Graf penghapusan Kana yang lengkap

Rekaman kosakata `好き` kini mendeklarasikan ejaan Kana `す` dan `き` secara berurutan. Dengan demikian, rekaman ini mengikuti graf dependensi referensi yang sama seperti semua entri kosakata lain dan disertakan saat Cognis mempratinjau atau menjalankan penghapusan berantai bagan Kana.

## Identitas varian Kana yang stabil

Paket diterbitkan ulang untuk perlindungan identitas Pustaka terbaru. Setiap rekaman Kana memiliki identitas konten yang berbeda dan setiap referensi varian menunjuk ke rekaman induk yang berbeda, sehingga impor ulang dapat membangun kembali edge lama tanpa merender induk sebagai anaknya sendiri.

## Hierarki anak Kana eksplisit

Relasi induk Kana kini selaras dengan kontrak Pustaka terbaru dengan ditandai sebagai varian sekaligus anak spasial. Karena bagian relasi duplikat disembunyikan, bidang eksplisit `usage_note` tidak lagi diperlukan dan telah dihapus bersama empat nilai rekamannya.

## Kosakata bacaan Kanji kanonis

Rekaman leksikal `人` yang duplikat telah dihapus. Entri Kanji kini hanya menunjuk ke bacaan Kosakata `じん`, `にん`, dan `ひと` yang berbeda; setiap bacaan tersusun dari rekaman Hiragana yang sesuai dan memiliki referensi definisi langsungnya sendiri.

## Kontrak kepemilikan modul PR 220

Modul kini secara eksplisit meminta hak istimewa tepercaya karena menerbitkan kapabilitas standar `study:language:ja` di luar namespace milik modul. Provenans repositori Cognis Labs memungkinkan host memverifikasi permintaan tersebut, sementara akses Pustaka tetap berbasis kapabilitas dan semua registrasi tetap dimiliki siklus hidup.

## Relasi Pustaka terdekat yang dideklarasikan

Komposisi kini memakai rekaman terdekat yang tersedia: `日本語` menaut ke kata `日本` dan Kanji `語`, sedangkan `日本` menaut ke Kanji `日` dan `本`. Ejaan alternatif Kana berurutan menyediakan tautan langsung untuk pelafalan, dan setiap bidang mendeklarasikan kontrol editor milik penyedia beserta opsi terlokalisasi.

## Kosakata Bacaan Kanji yang Disembunyikan

Bacaan pada kartu Kanji tertaut ke rekaman Kosakata khusus, lalu setiap rekaman bacaan tertaut ke karakter Hiragana yang menyusunnya. Rekaman khusus bacaan tetap dapat dibuka melalui tautan untuk definisi, tetapi disembunyikan dari penjelajah Kosakata; kosakata biasa tetap terlihat.

Pelafalan kata majemuk yang ditentukan menggunakan segmen bacaan tersembunyi terbesar yang tersedia, bukan menautkan setiap Kana secara langsung. Misalnya, `日本語` menyelesaikan `にほんご` melalui bacaan tersembunyi `にほん` untuk `日本` dan `ご` untuk `語`; hanya rekaman bacaan tersebut yang kemudian menaut ke Kana individual.

## Definisi Bacaan Kontekstual

Rekaman Kosakata bacaan tersembunyi memiliki definisi sendiri dalam empat bahasa ketika suatu bacaan mempunyai penggunaan tata bahasa atau leksikal yang lebih sempit daripada Kanji sumbernya, misalnya `にん` sebagai penghitung orang atau `じん` sebagai akhiran kebangsaan. Cognis hanya boleh mewarisi definisi terlokalkan kartu sumber saat tautan entri terkait membuka Kosakata tanpa definisinya sendiri; definisi yang ditulis selalu diutamakan, sedangkan tautan komposisi judul serta navigasi sebelumnya/berikutnya tidak membawa konteks cadangan.

## Set Data Inti yang Diperluas

Paket kini memuat lebih dari tiga puluh rekaman Kosakata sehari-hari tambahan, sepuluh partikel tambahan, dan delapan kalimat contoh yang tersusun penuh, semuanya disimpan sebagai JSON deklaratif di `data/library/content/`. Polisemi sejati dapat memakai beberapa referensi definisi terlokalkan pada satu rekaman (`なおす`: memperbaiki/mengoreksi), sedangkan homofon seperti `はし` (jembatan/sumpit), `あめ` (hujan/permen), `かみ` (kertas/rambut/dewa), dan `はな` (bunga/hidung) tetap menjadi rekaman Kosakata terpisah dengan definisi berbeda.

## Graf inti yang mengutamakan Kanji

Inti ringkas kini menggunakan ejaan Kanji konvensional secara menyeluruh. Kalimat menaut ke Kosakata terlihat, Kosakata terlihat menaut ke Kanji dan segmen pelafalan tersembunyi, dan setiap segmen tersembunyi dibentuk kembali dari Kana atomik. Contohnya, `私は学生` diselesaikan melalui `私` → `わたし` → `わ`・`た`・`し` dan `学生` → `がく`・`せい` → Kana atomik.

## Kontrol rekaman terbaru PR 226

Data penyedia kini sesuai dengan kontrak normalisasi Study Library terbaru: definisi merupakan rekaman `definition` tersembunyi, kalimat merupakan rekaman `composite`, dan partikel merupakan rekaman `particle` yang tidak dapat diubah dengan `editable: false`. Kelas leksikal dan bacaan tetap netral terhadap penyedia dan ber-namespace.

## Komposisi Kana infleksional

Bacaan lengkap tersembunyi kini membedakan segmen bacaan bermakna dari akhiran Kana nonleksikal. `なおす` menyusun `なお` melalui Kosakata bacaan `直` tersembunyi dan menautkan `す` langsung ke Kana atomik melalui relasi khusus komposisi `reading-kana`, sehingga akhiran parsial tidak tampil sebagai pelafalan alternatif kartu.

## Induk bacaan tanpa duplikasi

Kosakata satu Kanji kini memakai pembungkus pelafalan lengkap tersembunyi sebelum mencapai rekaman bacaan Kanji. Untuk `猫`, kartu leksikal terlihat menaut ke `ねこ` tersembunyi yang tersusun melalui bacaan Kanji; Kanji juga menaut ke bacaan tersebut. Daftar Digunakan Oleh pada bacaan kini memuat induk `猫` dan `ねこ` yang berbeda, bukan dua kartu `猫` yang tidak dapat dibedakan.

## Bacaan kalimat tertaut dan kumpulan latihan tinjauan

Setiap pelafalan kalimat kini membuka rekaman bacaan lengkap tersembunyi yang segmennya diselesaikan melalui kosakata tersembunyi yang ada dan Kana partikel atomik; teks pelafalan tanpa tautan bukan lagi perilaku bawaan. Delapan kalimat yang ditinjau menambah latihan beragam tentang minum air, belajar bahasa Jepang, perjalanan, hewan, ukuran, dan berjalan, beserta kosakata `学ぶ` dan `歩く` yang tertaut penuh.

## Judul Bacaan dengan Tautan Kana Langsung

Data pelafalan tersembunyi kini menyusun judulnya langsung dari Kana atomik melalui relasi khusus komposisi `reading-kana`. Membuka pelafalan Kanji karena itu menuju ke setiap Kana yang tertaut, bukan kembali melalui kartu bacaan atau Kanji lain, dan judul tidak lagi menampilkan detail ejaan alternatif.

## Graf Kartu Kanonis

Paket konten hanya memuat graf kanonis aktif. Setiap pelafalan Kanji menargetkan catatan bacaan khusus yang hanya berisi Kana; pelafalan lengkap kosakata tetap terpisah dan dapat menambahkan Kana infleksional. Contohnya, `好` diselesaikan sebagai `す`, sedangkan kata `好き` menambahkan `き` pada bacaan tersebut.

## Navigasi Penggunaan Kana Langsung

Daftar Digunakan Oleh pada Kana hanya memuat catatan bacaan langsung. Kanji tidak pernah menunjuk langsung ke Kana atomik: pelajar mengikuti `あ` → `あめ` → `雨`, sehingga kata dan Kanji lain yang sekadar memuat `あ` tidak muncul sebagai induk langsung.

## Pelafalan Komposit Milik Induk

Hanya kartu kalimat yang memiliki komposisi kata dan partikelnya. Kalimat seperti `猫が好き` mereferensikan `猫`, `が`, dan `好き` yang terlihat; setiap kata Kanji terlihat mereferensikan satu pelafalan Kana lengkapnya (`ねこ` atau `すき`) yang kemudian diselesaikan ke Kana atomik. Bacaan Kana lengkap tidak pernah membentuk rantai kalimat paralel.

## Bacaan kalimat yang tertaut ke kosakata

Pelafalan kalimat menggunakan hubungan `words` berurutan yang sudah ada untuk tautan mendalam pada detail judul. Setiap rentang Kana lengkap membuka entri kosakata yang terlihat untuk kata tersebut, sedangkan partikel tetap menjadi unsur milik kalimat; kosakata kemudian hanya mengarah melalui bacaan lengkapnya sendiri ke Kana atomik dan tidak pernah ke anak kalimat yang bersebelahan.

## Bacaan Kanji ke kosakata

Pelafalan Kanji tertaut ke kosakata terlihat terdekat yang menggunakannya. Hanya kosakata tersebut yang memiliki rekaman pelafalan lengkap: rentang bermakna yang berasal dari Kanji memakai ulang bacaan tersembunyi, sedangkan satu sufiks Kana yang tersisa tertaut langsung ke Kana atomik. Dengan demikian `好` membuka `好き`, yang bacaan `すき`-nya tersusun dari rentang Kanji `す` dan `き` atomik; tidak dibuat kartu pelafalan tersendiri untuk `き`.

## Pelafalan kalimat yang tertaut sepenuhnya

Detail pelafalan kalimat menggunakan kontrak `linkRelationships` terkini untuk mendeklarasikan `words` dan `particles` sebagai sumber tautan. Karena itu, bacaan `がっこうにいく` menautkan segmen lengkapnya ke `学校` yang terlihat, partikel `に`, dan `行く` yang terlihat tanpa memperkenalkan rekaman bacaan kalimat paralel.

## Latihan menulis berpanduan goresan

Setiap kartu Kana dan Kanji kini memiliki `strokePattern` wajib dengan koordinat ternormalisasi, sampel waktu monotonik berurutan, dan toleransi latihan yang kompatibel dengan kontrak menggambar Study Library terbaru dari Cognis PR #226. Pola tersebut diturunkan dari KanjiVG serta mempertahankan sumber dan atribusi CC BY-SA 3.0 dalam manifes konten.

## Penyedia pola goresan runtime

Modul mendaftarkan `study-language-ja:stroke-patterns` melalui kapabilitas Pustaka `study:library:provider`. Label Kana atau Kanji yang tersedia dalam paket segera mengembalikan `stroke_pattern` yang telah ditinjau. Kana atau Kanji Jepang lainnya diambil dari sumber SVG KanjiVG kanonis, dikonversi menjadi goresan ternormalisasi dengan waktu, disimpan dalam cache sesi, lalu dikembalikan dengan asal dan keyakinan penuh. Glif non-Jepang atau yang tidak tersedia tidak ditebak; OCR tidak pernah digunakan, dan penyedia dilepas dengan bersih saat modul dinonaktifkan.

## Pembuatan kartu dengan bantuan Jisho

Modul mendaftarkan penyedia komposer **Kamus Jisho** yang dilokalkan secara langsung melalui kontrak generik `study:library:provider.registerLookupProvider` untuk kartu Kana, Kanji, dan Kosakata. Kecocokan tepat diselesaikan dari set data bawaan terlebih dahulu, termasuk semua bidang dan hubungan yang ditulis. Hanya kegagalan tembolok yang meminta Jisho; respons berhasil yang sedang berjalan dan telah selesai digunakan bersama dari tembolok sesi terbatas. Hasil eksternal mengisi label kanonis, pelafalan, tingkat JLPT jika tersedia, serta tautan ke Kanji, bacaan lengkap, atau Kana atomik yang sudah ada tanpa menciptakan rekaman atau menebak tautan.

Pengambil sampel jalur SVG dimiliki modul, sehingga modul eksternal yang terpasang tidak bergantung pada `node_modules` milik host.

Bootstrap memperoleh penyedia invers melalui `ctx.capabilities.require("study:library:provider")`, mengikuti pola pendaftaran penyedia autentikasi; pengambil kemudahan lama tidak digunakan.

Selama peluncuran Cognis PR #226, bootstrap mendahulukan kapabilitas publik `study:library:provider` yang diinjeksi dan jika tidak tersedia menggunakan layanan `study:library` yang sudah diinjeksi, yang menerapkan permukaan generik `registerLookupProvider` dan `ingestContentPack` yang sama. Hal ini menghindari ketergantungan pada visibilitas system-ctx sambil mempertahankan satu kontrak penyedia.

## Tautan detail judul terverifikasi

Setiap pelafalan kalimat kini diuji terhadap resolver detail judul host sehingga setiap rentang Kana membuka rekaman Kosakata atau Partikel yang terurut. Setiap Kanji mengekspos satu bacaan utama lengkap yang tidak ambigu dan sama persis dengan target Kosakata terdekat; bacaan tambahan tetap tersedia melalui hubungan nonjudul terpisah, dan semua dependensi Kana tetap terlihat untuk navigasi invers.
