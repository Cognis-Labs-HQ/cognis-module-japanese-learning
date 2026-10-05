# Standar paket konten bahasa Jepang

Modul Cognis Bahasa Jepang memasang data pembelajaran bahasa Jepang deklaratif ke Pustaka Study milik host sambil tetap terisolasi dari internal Pustaka, basis data, API, dan kode peramban.

## Penggunaan

Aktifkan gateway Study dan adaptor Pustaka, lalu aktifkan modul ini. Bootstrap menyelesaikan `study:library:provider` dari `ctx` dan mengingesti `data/library`. Administrator dan pelajar menggunakan antarmuka Study yang dihasilkan adaptor Pustaka, bukan rute milik modul.

Karena deskripsi bahasa tidak mendeklarasikan halaman turunan yang dapat dijalankan, Cognis Study menyediakan tujuan Pustaka yang dihasilkan di `/study/library?language=ja`. Parameter bahasa tervalidasi dipertahankan pada tautan Pustaka, navigasi detail, pemuatan langsung, dan riwayat peramban; pelajar terautentikasi dapat membaca sementara aturan cakupan Pustaka tetap melindungi penulisan dan penerbitan.

Modul eksternal mendeklarasikan gateway Study sebagai dependensi komponennya. Modul menemukan adaptor Pustaka melalui kapabilitas wajib `study:library:provider`, bukan memperlakukan UUID adaptor sebagai komponen yang dapat dipasang secara mandiri.

## Spesifikasi teknis

### Tata letak paket

`data/library/manifest.json` mengidentifikasi paket, versi paket yang tidak dapat diubah, revisi konten, skema, akar konten, penerbit, dan lisensi. Setiap direktori konten langsung cocok dengan lapisan di `schema.json`; berkas JSON berisi larik data stabil.

### Skema dan graf

Skema dan manifest memiliki namespace `ja` yang sama, dan setiap ID data diawali `ja:`. Skema mendefinisikan `characters`, `alt-characters`, `definitions`, `words`, `particles`, dan `sentences` dengan metadata terlokalisasi dalam bahasa Jerman, Inggris, Indonesia, dan Jepang. Peran semantik mengarahkan antarmuka netral yang dihasilkan. Kolom memakai nilai bertipe dan petunjuk render detail; lapisan menerbitkan kompatibilitas aktivitas serta jalur minat. Hubungan terarah mendeklarasikan metadata terlokalisasi, lapisan tujuan, kardinalitas, target wajib, urutan, perilaku penghapusan wajib, dan peran resolver opsional. Referensi berurutan memiliki posisi unik nonnegatif, dan setiap target tersedia dalam paket yang sama.

ID data lokal paket hanya menggunakan huruf kecil dan angka ASCII portabel, pemisah, serta titik dua; glif bahasa Jepang ditempatkan di `label`, bukan di `id`. Aturan ini menjaga kompatibilitas ingest dengan kontrak pengenal data Pustaka.

### Siklus hidup dan kepemilikan

`bootstrap.js` hanya memperoleh kapabilitas publik melalui `ctx`, meminta Pustaka mengingesti paket, menerbitkan deskripsi bahasa Jepang, dan mencatat tanda terima. Pustaka host memiliki validasi, ID bernamespace, transaksi, idempotensi, persistensi, rute, dan UI yang dihasilkan. Modul ini tidak mendaftarkan rute API atau halaman serta tidak mengakses basis data host.

### Pembaruan dan lisensi

Perubahan skema memerlukan peningkatan versi skema. Perubahan konten memerlukan versi paket atau revisi konten baru. Semua data yang dibundel menggunakan lisensi dan atribusi yang dinyatakan manifest paket.

Lapisan kamus `definitions` mendeklarasikan lokalisasi definisi milik modul dengan kunci string stabil `japanese:definitions:*` dan bidang `localizedText` bertipe. Setiap definisi bawaan memuat teks bahasa Jerman, Inggris, Indonesia, dan Jepang agar konsumen dapat menyelesaikan string tampilan tanpa bergantung pada data bahasa di inti Cognis.

## Audio unit tulisan dan partikel

Unit tulisan atomik dan gabungan menyediakan daftar pelafalan wajib serta kolom unggah audio opsional. Audio yang dirujuk harus dibundel sebagai aset paket terautentikasi; URL audio eksternal tidak valid. Lapisan partikel khusus menyimpan metadata fungsi tata bahasa, dan catatan kalimat dapat mempertahankan referensi kata dan partikel yang berurutan.

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

Kolom pelafalan Kanji harus tertaut ke satu rekaman Kosakata khusus untuk setiap bacaan lengkap. Setiap rekaman khusus bacaan harus memiliki `hidden: true` dan menyusun dirinya dari Kana atomik melalui `kana-spelling`; rekaman Kosakata biasa harus tetap terlihat.

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Definisi Bacaan Kontekstual

Berikan definisi terlokalkan kepada setiap rekaman Kosakata bacaan dalam paket ketika penggunaannya lebih sempit daripada unit tulisan yang merujuknya. Definisi Kosakata bersifat otoritatif. Definisi hanya boleh tidak ada jika maknanya benar-benar sama dengan sumber dan rekaman dibuka melalui kartu entri terkait; tautan komposisi judul serta kontrol sebelumnya/berikutnya sengaja menghapus konteks cadangan tersebut.

## Polisemi, Homofon, dan Kepemilikan Data

Gunakan beberapa referensi definisi hanya ketika satu rekaman leksikal benar-benar memiliki beberapa makna yang berhubungan erat. Buat rekaman Kosakata terpisah untuk homofon dengan makna berbeda meskipun label Kana-nya sama. Semua karakter, kosakata, partikel, kalimat, dan makna terlokalkan bahasa Jepang harus berada dalam JSON deklaratif di `data/library/content/`; kode runtime tidak boleh menyematkan data bahasa.

## Traversal lengkap dari kalimat ke Kana

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Kontrol rekaman yang dinormalisasi host

Penuhi kontrak Library yang terpasang sebelum menerbitkan: rekaman definisi selalu tersembunyi dan memakai `class: "definition"`; urutan leksikal teratur memakai `class: "composite"`; partikel memakai `class: "particle"` dan `editable: false`. Pengujian harus memverifikasi nilai persis ini agar hash penyedia dan rekaman terpasang tetap sama setelah normalisasi host.

## Komposisi bacaan infleksional

Gunakan `word-spelling` untuk segmen bacaan multi-Kana yang bermakna dan `reading-kana` untuk setiap Kana tunggal yang tersisa sebagai akhiran infleksional, dengan posisi berurutan tanpa celah. `reading-kana` adalah relasi komposisi; jangan pernah memakai `kana-spelling` parsial karena peran tersebut mewakili ejaan alternatif lengkap dan akan menampilkan akhiran secara menyesatkan sebagai pelafalan tersendiri.

## Induk Digunakan Oleh yang unik

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Graf pelafalan kalimat

Bidang pelafalan kalimat menaut melalui `words` dan `particles` ke setiap kartu konstituen terlihat yang berurutan. Host mencocokkan pelafalan lengkap setiap konstituen sebagai alias, sehingga setiap segmen bacaan membuka kartu Kosakata atau Partikelnya, bukan satu kartu tersembunyi untuk seluruh kalimat. Rekaman Kosakata bacaan lengkap tingkat kalimat dan grup `pronunciation-readings` pada kalimat dilarang.

## Penelusuran tanpa siklus dan bacaan leksikal

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Komposisi Kana Langsung untuk Judul Bacaan

Setiap data pelafalan tersembunyi menyusun judul lengkapnya langsung dari Kana atomik yang terurut melalui relasi khusus komposisi `reading-kana`. Untuk data bacaan, relasi ini memiliki peran presentasi `composition`: jangan arahkan judul bacaan melalui `word-spelling` atau relasi ejaan alternatif, karena hal itu menghasilkan navigasi kartu yang rekursif atau menyesatkan.

## Graf Bacaan Kanonis

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Dependensi Penggunaan Kanji-ke-Kana

Kanji tidak boleh mereferensikan Kana atomik secara langsung. Kanji mencapai Kana hanya melalui catatan bacaan lengkapnya, sehingga navigasi Digunakan Oleh terbalik menampilkan bacaan langsung terlebih dahulu (`あ` → `あめ` → `雨`), bukan secara keliru mencantumkan setiap Kanji yang memuat Kana tersebut.

## Pelafalan Komposit Milik Induk

Hanya kalimat terlihat yang memiliki relasi di antara anak leksikal dan partikelnya. Setiap kata Kanji terlihat menaut melalui `pronunciation-readings` ke tepat satu pelafalan Kana lengkap tersembunyi yang direkonstruksi melalui `reading-kana` terurut. Data kalimat tidak boleh mereferensikan data pelafalan lengkap paralel, dan anak pelafalan tidak boleh mereferensikan pelafalan saudara hanya karena kata-katanya berada dalam kalimat yang sama.

## Detail judul kalimat yang tertaut ke kosakata

Tetapkan `input.linkRelationships` bidang pelafalan kalimat ke `["words", "particles"]`. Host harus mencocokkan pelafalan lengkap setiap kata sebagai alias sambil mempertahankan entri kosakata yang terlihat sebagai target tautan. Jangan menambahkan anak pelafalan tingkat kalimat atau tautan antarbaca kata yang bersaudara; setiap entri kosakata memiliki jalur bacaannya sendiri menuju Kana atomik secara mandiri.

## Batas pelafalan milik kosakata

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Tautan pelafalan kalimat lengkap

Input pelafalan kalimat harus mendeklarasikan setiap hubungan unsur yang dapat menyediakan segmen bacaan yang ditampilkan. Deklarasikan `linkRelationships: ["words", "particles"]` untuk resolusi lengkap; host terkini membaca kontrak larik saat membangun tautan detail judul. Host harus menggabungkan referensi berurutan tersebut dan mencocokkan alias pelafalan setiap target agar kata membuka kosakata dan partikel membuka rekaman partikel.

## Metadata pola goresan

Setiap kartu unit tulisan buatan penyedia wajib menyertakan `strokePattern` yang wajib dan tidak dapat diubah. Gunakan `coordinateSystem: "normalized"`; pertahankan seluruh koordinat titik dalam rentang 0–1, waktu titik monotonik di dalam setiap goresan berurutan, tekanan opsional dalam rentang 0–1, dan toleransi dalam rentang 0–100. Pertahankan atribusi setiap sumber goresan eksternal dalam metadata manifes konten. Buat pola paket dari jalur KanjiVG bernama Unicode dengan subdivisi kurva kubik dan kuadratik yang cukup untuk mempertahankan setiap belokan dan lingkaran; pendekatan jarang yang hanya memakai titik akhir tidak valid.

## Pencarian goresan runtime

Daftarkan satu penyedia pencarian Pustaka yang dapat dilepas melalui `study:library:provider`. Dukung hanya lapisan unit tulisan skema Jepang yang mendeklarasikan bidang `strokePattern`. Selesaikan label ternormalisasi yang cocok tepat dari konten paket terlebih dahulu. Untuk Kana atau Kanji Jepang valid lainnya, ambil SVG bernama Unicode dari sumber KanjiVG kanonis, batasi respons, sampel jalur berurutannya menjadi titik ternormalisasi dengan waktu, simpan hasilnya dalam cache, lalu kembalikan di `fields.stroke_pattern` dengan asal sumber tepat dan keyakinan `1`. Jangan berikan saran untuk glif yang tidak tersedia atau input non-Jepang, dan jangan pernah menyimpulkan urutan goresan dengan OCR.

## Pengayaan komposer Jisho

Jisho hanya boleh didaftarkan melalui kontrak generik `study:library:provider.registerLookupProvider` dan harus mengembalikan fungsi penghapus untuk pembersihan siklus hidup. Pencarian kartu harus selalu mendahulukan data asli. Rekaman Kana, Kanji, dan Kosakata bawaan yang cocok tepat mengembalikan bidang dan hubungan yang telah ditinjau tanpa akses jaringan. Jisho hanya diminta setelah data asli tidak ditemukan, dan tembolok promise terbatas menggabungkan permintaan bersamaan serta menggunakan ulang respons berhasil. Saran eksternal hanya boleh menghasilkan bidang yang dikenali skema dan referensi ke rekaman penyedia yang sudah ada; definisi atau tautan yang tidak tersedia harus dibiarkan kosong, bukan direka.

Titik masuk penyedia runtime tidak boleh mengimpor paket npm yang tidak diterapkan; pengambil sampel jalur SVG KanjiVG dimiliki modul dan disertakan dalam manifes.

Bootstrap runtime harus menyelesaikan penyedia Library invers dengan `ctx.capabilities.require`, lalu mendaftarkan penyedia pencarian melalui kapabilitas yang dikembalikan. Jangan gunakan `ctx.getCapability` untuk penyedia wajib ini.

Selesaikan kapabilitas publik `study:library:provider` yang diinjeksi terlebih dahulu. Jika host hanya mengekspos kapabilitas publik itu untuk validasi pengaktifan dan bukan ke ctx modul, gunakan layanan `study:library` yang diinjeksi semata-mata sebagai pembawa antarmuka `registerLookupProvider` dan `ingestContentPack` yang sama. Jangan memperkenalkan protokol penyedia kedua.

## Detail judul yang dapat diselesaikan

Untuk setiap kalimat dan Kanji yang memiliki pelafalan, ulangi algoritme komposisi alias host dalam pengujian. Semua target tertaut, sesuai urutan posisi hubungan, harus bergabung tepat menjadi pelafalan yang ditampilkan. Judul Kanji mengekspos satu bacaan utama khusus yang hanya berisi Kana; simpan bacaan tambahan di luar bidang pelafalan dan jalur `input.linkRelationships` agar bacaan tersebut tidak membuat semua tautan judul gagal sebagai satu rantai gabungan.

## Kontrak pelafalan rekursif saat ini

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Jalur pelafalan lengkap

Setiap kosakata beraksara Kanji menautkan ejaannya ke Kanji yang disertakan dan mengarahkan pelafalannya melalui satu rekaman pelafalan lengkap yang tersembunyi. Rekaman tersebut mempertahankan segmen bacaan Kanji terdekat yang tersedia dan hanya memakai Kana atomik untuk infleksi atau bagian tanpa bacaan Kanji yang telah ditulis. Pelafalan kalimat juga diarahkan melalui satu rekaman lengkap tersembunyi yang tersusun dari pelafalan kata dan Kana partikel. Saran Jisho saat runtime memvalidasi aksara khusus tiap lapisan, tidak pernah menghasilkan grup Kana parsial, dan menambahkan tautan ejaan Kanji yang tersedia.

### Kartu pelafalan bersama untuk homofon

Jika beberapa rekaman kosakata Kanji yang berbeda memiliki pelafalan Kana lengkap yang persis sama, semuanya dapat memakai satu kartu pelafalan struktural tersembunyi. Kartu bersama tersebut menyusun kembali bacaan langsung dari Kana atomik dan tidak membawa definisi. Setiap kosakata terlihat hanya mempertahankan definisi jika maknanya berbeda dari induk Kanjinya; jika sama, definisi diwarisi melalui hubungan ejaan.

## Penelusuran kartu antarlapisan yang stabil

Hubungan, bukan pencarian label yang sama, menentukan penelusuran kartu. Sebuah bacaan Kosakata hanya boleh menaut ke rekaman Kosakata lain jika target tersebut mewakili segmen bacaan yang benar-benar lebih kecil; tautan antarkosakata dengan label identik dilarang. Karena itu, pembungkus pelafalan lengkap untuk satu Kanji menyusun kembali bacaannya langsung dari Kana atomik berurutan, sedangkan kata majemuk mempertahankan tautan ke segmen bacaan Kanji yang lebih kecil dan Kana infleksional. Rekaman bacaan dan pelafalan tersembunyi bersifat struktural dan tidak membawa definisi. Kosakata terlihat hanya menyimpan definisi ketika makna leksikalnya berbeda dari Kanji yang dirujuk; jika sama, hubungan ejaan menyediakan definisi induk. Host menyembunyikan satu-satunya definisi jika teks ternormalisasinya persis sama dengan label utama kartu Kosakata.

## Cakupan pelafalan Kanji

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Batch lokasi dan cara yang ditinjau

Batch pemula yang ditinjau menambahkan `ここ`, `そこ`, `どこ`, `いる`, `ある`, `きれい`, `とても`, `ゆっくり`, dan `です`, serta delapan kalimat bervariasi tentang lokasi, keberadaan, pertanyaan, penampilan, dan cara. Setiap kata baru memiliki definisi terlokalisasi dan ejaan Kana berurutan; setiap kalimat memiliki makna terlokalisasi yang tepat, komposisi leksikal berurutan, dan jalur pelafalan tersembunyi yang lengkap.

## Pembersihan Penghapusan Instalasi yang Destruktif

Menonaktifkan modul dan penghapusan instalasi biasa mempertahankan semua rekaman bahasa Jepang yang telah diimpor. Hanya opsi eksplisit `deleteContent: true` pada hook penghapusan instalasi host yang boleh memanggil operasi `deleteContentPack` milik penyedia Study Library; penyedia tersebut memiliki tanggung jawab atas penghapusan relasi berantai secara transaksional dan harus melaporkan kegagalan sebelum Cognis menghapus modul. Rute kompatibilitas administratif `DELETE /api/v1/modules/study-language-ja/config` hanya membersihkan konfigurasi lokal modul (modul ini tidak memilikinya), sehingga mengembalikan `204` tanpa menyentuh konten pembelajaran.

## Definisi Kartu Kosakata

Perender kartu Cognis Library hanya membaca definisi dari relasi definisi langsung suatu entri; definisi tidak diwarisi melalui relasi ejaan Kanji. Karena itu, setiap rekaman Kosakata terlihat yang ditulis dengan Kanji merujuk definisi secara langsung, bahkan ketika maknanya identik dengan rekaman tulisan Kanjinya. Rekaman pelafalan struktural tersembunyi tetap tanpa definisi.

## Validasi Kueri Jisho

Pencarian Kosakata menerima istilah pencarian bahasa Jepang atau Latin yang dibatasi, termasuk glosarium bahasa Inggris yang terdiri dari beberapa kata, dan memakai hasil berperingkat tertinggi dari Jisho jika tidak ada ejaan bahasa Jepang yang persis cocok dengan kueri. Lapisan Kana dan Kanji tetap dibatasi pada satu karakter valid karena sarannya harus mempertahankan lapisan unit tulisan yang dipilih. Tanda baca tidak valid, masukan kontrol, dan kueri yang terlalu panjang ditolak sebelum akses jaringan.

## Verba Dasar, Adverbia, dan Transformasi

Lapisan Kosakata memisahkan verba dan adverbia bentuk dasar bertag ke tampilan transformasi bernama penyedia. Setiap verba memiliki tag `verb` beserta tepat satu tag keluarga konjugasi; skema membedakan ichidan, akhiran godan reguler, pola khusus `行く` dan `ある`, serta `来る` tak beraturan. Aturan deterministik menurunkan bentuk sopan, negatif, lampau, dan te saat penyajian. Adverbia bahasa Jepang hanya memiliki `adverb` dan tidak berubah, sehingga tampilan transformasinya menunjukkan kartu dasar kanonis tanpa infleksi buatan. Paket konten tidak pernah menyimpan bentuk verba hasil transformasi atau kartu adverbia turunan.

## Perenderan Pelafalan Jepang yang Lengkap

Kana atomik mempertahankan romanisasi Hepburn untuk kartunya sendiri, tetapi penurunan pelafalan rekursif harus memakai label Kana. Setiap pelafalan Kanji, Kosakata, Partikel, dan Kalimat tetap berupa teks Jepang dari awal hingga akhir. Bacaan kalimat tersegmentasi harus mempertahankan dan menampilkan nilai gabungan lengkap; tata letak judul boleh membungkus atau mengecilkannya, tetapi tidak boleh memotong konstituen terakhir.

## Judul Bacaan dari Kana Atomik

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Judul Multi-Kana dan Geometri Bentuk Kecil

Setiap rekaman Kana dengan beberapa simbol mendeklarasikan komposisi `character-title` eksplisit menuju Kana atomiknya, sehingga pencocokan label generik tidak dapat menaut dalam ke bacaan Kosakata tersembunyi dengan label sama. Tata letak pola goresan gabungan memberikan ruang horizontal yang lebih sempit kepada Kana kecil seperti `ゃ`, `ゅ`, `ょ`, dan `っ`; komponen berukuran penuh mempertahankan ruang lebih besar agar pola latihan yōon dan geminasi menjaga ukuran relatif konvensionalnya.

## Tautan kalimat tanpa Kosakata penyamar kalimat

Pelafalan kalimat menautkan setiap segmen bacaan berurutan ke unsur Kosakata atau Partikel yang sudah ada dan terlihat melalui `linkRelationships: ["words", "particles"]`. Pelafalan kalimat lengkap tidak boleh disimpan sebagai rekaman Kosakata; Kosakata juga tidak boleh memuat struktur kalimat, komposit, atau partikel.

## Perantara bacaan Kanji selektif

Kanji dengan satu pelafalan menaut langsung ke Kana atomik berurutan. Kanji dengan beberapa pelafalan menggunakan tepat satu rekaman Kosakata `reading:kanji` tersembunyi untuk setiap bacaan; rekaman itu menautkan judulnya ke satu Kanji sumber melalui `spelling` dan merekonstruksi pelafalannya melalui `reading-kana` berurutan. Tautan definisi langsung membuat tautan dalam pelafalan mandiri: gunakan kembali definisi Kanji sumber bila maknanya sama, dan gunakan definisi khusus bacaan bila maknanya lebih sempit. Jangan membuat rekaman bacaan untuk pelafalan gabungan seperti `せんせい`; kata majemuk menggunakan kembali segmen terpisah seperti `せん` dan `せい`.

## Transformasi bercabang mendalam

Set transformasi verba kini membentuk jalur bercabang mendalam dari setiap kartu dasar kanonis. Cabangnya mencakup bentuk sopan negatif dan lampau, bentuk lampau negatif dan penghubung, kausatif, pasif, potensial, volisional, serta rantai keinginan kausatif bertahap. Setiap aturan mentransformasi bentuk tulisan dan pelafalan secara mandiri; penggantian definisi terlokalisasi menjelaskan cabang semantik. Adverbia tetap menjadi kartu dasar kanonis yang tidak berubah, dan tidak ada bentuk hasil yang disimpan sebagai entri Kosakata.

Transformasi verba menggunakan kontrak `definitionTransform` Cognis 2.24. Setiap aturan terlokalisasi mendeklarasikan batas definisi yang dapat dilepas dan templat dengan `{{ definition }}`, `{{ stem }}`, `{{ prefix }}`, atau `{{ suffix }}`; templat disusun sepanjang jalur mendalam. Definisi tersimpan tetap berupa teks biasa tanpa placeholder transformasi. Karena itu `見る` mempertahankan definisi “to see” dan “to watch” secara terpisah, sedangkan jalur keinginan mengubah keduanya secara tepat.

Cabang yang bergantung konteks memakai `replacements` terlokalisasi dan berurutan sebelum templat cadangan. Aturan berikutnya dapat menulis ulang anotasi sebelumnya, sedangkan aturan penghubung menambahkan makna ke definisi yang telah ditransformasi sepenuhnya melalui `{{ definition }}`.

Pola goresan kini menerbitkan kolom logis eksplisit dan kelompok goresan berurutan untuk setiap karakter. Viewport Menggambar Cognis yang mempertahankan rasio aspek dapat mengukur karakter majemuk tanpa distorsi, menjaga jarak yang disengaja, dan menguji goresan berikutnya pada batas karakter yang benar.

## Identitas dan Konflik Kanji

Normalisasikan label Kanji dengan NFKC untuk pencarian dan perbandingan identitas. Jangan sertakan pelafalan dalam identitas Kanji yang terlihat dan jangan menyimpulkan kesamaan dari bacaan yang sama. Karena itu, `content_conflict` saat membuat karakter alternatif berarti label Kanji ternormalisasi yang sama terlihat pada cakupan tujuan atau global; host harus menyediakan ID entri konflik agar kartu yang ada dapat dipilih meskipun disembunyikan oleh filter.

## Kosakata Struktur Kalimat

Deklarasikan komposisi kalimat secara eksplisit melalui `cardConstructor` lapisan kalimat. Pertahankan target kata dan partikel biasa dalam `input_carousels`, tempatkan kosakata struktural terlihat dalam entri `tag_carousels` dengan tag `sentence-structure` dan relasi `words`, serta terbitkan tanda baca Jepang melalui entri `literal_carousels` yang dapat diulang. Tandai hanya kata struktur leksikal seperti kopula `です`; partikel tetap berada di lapisan partikel dan predikat biasa tetap menjadi kosakata biasa.

## Cakupan Penghubung dan Kopula

Inventaris struktur kalimat harus mencakup penghubung koordinatif, kontras, dan konsekuensial yang telah ditinjau, bukan hanya satu kopula. Setiap penghubung bertag tetap menjadi Kosakata terlihat, menyelesaikan bacaan lengkapnya melalui Kana atomik, memiliki definisi terlokalisasi, dan dipakai oleh kalimat yang disusun. Simpan `だ` sebagai satu-satunya bentuk dasar kopula biasa dan turunkan cabang sopan, lampau, serta negatif melalui set transformasi `copula` terlokalisasi; jangan menyimpan `だった` atau cabang hasil lainnya sebagai rekaman Kosakata.

Batas transformasi opsional harus dihilangkan saat tidak digunakan; label batas terlacakalisasi yang kosong adalah metadata penyedia yang tidak valid.

Bidang pelafalan kosakata yang terlihat menautkan tepat satu rekaman pelafalan lengkap tersembunyi melalui `pronunciation-readings`; rekaman tersebut diselesaikan secara internal melalui bacaan Kanji terdekat dan Kana atomik.
