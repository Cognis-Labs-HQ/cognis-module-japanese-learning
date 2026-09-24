# Standar paket konten bahasa Jepang

Modul Cognis Bahasa Jepang memasang data pembelajaran bahasa Jepang deklaratif ke Pustaka Study milik host sambil tetap terisolasi dari internal Pustaka, basis data, API, dan kode peramban.

## Penggunaan

Aktifkan gateway Study dan adaptor Pustaka, lalu aktifkan modul ini. Bootstrap menyelesaikan `study:library` dari `ctx` dan mengingesti `data/library`. Administrator dan pelajar menggunakan antarmuka Study yang dihasilkan adaptor Pustaka, bukan rute milik modul.

Karena deskripsi bahasa tidak mendeklarasikan halaman turunan yang dapat dijalankan, Cognis Study menyediakan tujuan Pustaka yang dihasilkan di `/study/library?language=ja`. Parameter bahasa tervalidasi dipertahankan pada tautan Pustaka, navigasi detail, pemuatan langsung, dan riwayat peramban; pelajar terautentikasi dapat membaca sementara aturan cakupan Pustaka tetap melindungi penulisan dan penerbitan.

Modul eksternal mendeklarasikan gateway Study sebagai dependensi komponennya. Modul menemukan adaptor Pustaka melalui kapabilitas wajib `study:library`, bukan memperlakukan UUID adaptor sebagai komponen yang dapat dipasang secara mandiri.

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

Pelafalan kata majemuk yang ditentukan harus menggunakan `pronunciation-readings` untuk merujuk segmen bacaan terbesar yang telah ditulis sesuai urutan tampilan. Sebagai contoh, `日本語` menautkan `にほん` ke rekaman bacaan tersembunyi untuk `日本` dan `ご` ke rekaman bacaan tersembunyi untuk `語`. Kata majemuk yang terlihat tidak boleh menduplikasi segmen tersebut sebagai referensi Kana atomik langsung.

## Definisi Bacaan Kontekstual

Berikan definisi terlokalkan kepada setiap rekaman Kosakata bacaan dalam paket ketika penggunaannya lebih sempit daripada unit tulisan yang merujuknya. Definisi Kosakata bersifat otoritatif. Definisi hanya boleh tidak ada jika maknanya benar-benar sama dengan sumber dan rekaman dibuka melalui kartu entri terkait; tautan komposisi judul serta kontrol sebelumnya/berikutnya sengaja menghapus konteks cadangan tersebut.

## Polisemi, Homofon, dan Kepemilikan Data

Gunakan beberapa referensi definisi hanya ketika satu rekaman leksikal benar-benar memiliki beberapa makna yang berhubungan erat. Buat rekaman Kosakata terpisah untuk homofon dengan makna berbeda meskipun label Kana-nya sama. Semua karakter, kosakata, partikel, kalimat, dan makna terlokalkan bahasa Jepang harus berada dalam JSON deklaratif di `data/library/content/`; kode runtime tidak boleh menyematkan data bahasa.

## Traversal lengkap dari kalimat ke Kana

Setiap bentuk leksikal konvensional dalam inti menggunakan Kanji. Kalimat hanya menaut ke Kosakata terlihat dan partikel; Kosakata terlihat tersusun melalui Kanji dan Kosakata bacaan tersembunyi; setiap bacaan tersembunyi dibentuk kembali dari Kana atomik. Pengujian harus menolak jalur apa pun yang melewati Kosakata, Kanji, Kosakata bacaan, atau Kana.

## Kontrol rekaman yang dinormalisasi host

Penuhi kontrak Library yang terpasang sebelum menerbitkan: rekaman definisi selalu tersembunyi dan memakai `class: "definition"`; urutan leksikal teratur memakai `class: "composite"`; partikel memakai `class: "particle"` dan `editable: false`. Pengujian harus memverifikasi nilai persis ini agar hash penyedia dan rekaman terpasang tetap sama setelah normalisasi host.

## Komposisi bacaan infleksional

Gunakan `word-spelling` untuk segmen bacaan multi-Kana yang bermakna dan `reading-kana` untuk setiap Kana tunggal yang tersisa sebagai akhiran infleksional, dengan posisi berurutan tanpa celah. `reading-kana` adalah relasi komposisi; jangan pernah memakai `kana-spelling` parsial karena peran tersebut mewakili ejaan alternatif lengkap dan akan menampilkan akhiran secara menyesatkan sebagai pelafalan tersendiri.

## Induk Digunakan Oleh yang unik

Bacaan tersembunyi tidak boleh memiliki beberapa rekaman masuk dengan label tampilan yang sama. Untuk kata terlihat yang terdiri dari satu Kanji, buat pembungkus pelafalan lengkap tersembunyi milik kata leksikal dan susun pembungkus tersebut dari rekaman bacaan Kanji. Kartu bacaan Kanji kemudian memiliki satu induk Kanji dan satu induk bacaan berlabel berbeda, sedangkan pembungkus hanya memiliki induk leksikal terlihat.

## Graf pelafalan kalimat

Bidang pelafalan kalimat menaut ke tepat satu rekaman Kosakata bacaan lengkap tersembunyi melalui `pronunciation-readings`. Rekaman tersebut membentuk kembali seluruh pelafalan secara berurutan dengan referensi `word-spelling` ke bacaan leksikal tersembunyi terdekat dan referensi `reading-kana` ke Kana partikel atau nonleksikal atomik. Pengujian harus gagal jika ada substring hilang, target kosakata yang tidak tersembunyi, pintasan langsung kalimat-ke-karakter, atau bacaan tanpa tautan.

## Penelusuran tanpa siklus dan bacaan leksikal

Tautan pembelajaran yang ditulis membentuk graf berarah tanpa siklus, dan karakter Kana mengakhiri penelusuran. Kanji dapat menyelesaikan pelafalannya melalui Kosakata bacaan tersembunyi ke Kana terurut, tetapi bacaan tersebut tidak pernah menaut kembali ke Kanji atau pengguna leksikalnya. Bacaan yang mempunyai makna leksikal mandiri, seperti penghitung hari `か`, merupakan Kosakata terlihat dengan kelas semantik, bukan `reading:kanji`.

## Komposisi Kana Langsung untuk Judul Bacaan

Setiap data pelafalan tersembunyi menyusun judul lengkapnya langsung dari Kana atomik yang terurut melalui relasi khusus komposisi `reading-kana`. Untuk data bacaan, relasi ini memiliki peran presentasi `composition`: jangan arahkan judul bacaan melalui `word-spelling` atau relasi ejaan alternatif, karena hal itu menghasilkan navigasi kartu yang rekursif atau menyesatkan.

## Graf Bacaan Kanonis

Paket hanya memuat data yang berpartisipasi dalam graf aktif. Hapus bacaan tersembunyi yang digantikan alih-alih mempertahankan data kompatibilitas yang dilepas. Kosakata Kanji terlihat harus menaut langsung ke Kana atomik terurut, dan Kanji dapat menargetkan data leksikal terlihat yang cocok.

## Dependensi Penggunaan Kanji-ke-Kana

Setiap Kanji harus menambahkan satu referensi `reading-kana-dependency` yang terdeduplikasi untuk setiap Kana atomik yang muncul dalam daftar pelafalannya. Relasi ini tidak memiliki peran presentasi atau resolver; relasi hanya membuat navigasi Digunakan Oleh terbalik tetap simetris setelah pelajar mengikuti bacaan leksikal menuju Kana atomik. Relasi `readings` biasa tetap menjadi sumber tautan dalam bidang pelafalan.

## Pelafalan Komposit Milik Induk

Hanya kalimat terlihat yang memiliki relasi di antara anak leksikal dan partikelnya. Setiap kata Kanji terlihat menaut melalui `pronunciation-readings` ke tepat satu pelafalan Kana lengkap tersembunyi yang direkonstruksi melalui `reading-kana` terurut. Data kalimat tidak boleh mereferensikan data pelafalan lengkap paralel, dan anak pelafalan tidak boleh mereferensikan pelafalan saudara hanya karena kata-katanya berada dalam kalimat yang sama.

## Detail judul kalimat yang tertaut ke kosakata

Tetapkan `input.linkRelationship` bidang pelafalan kalimat ke `words`. Host harus mencocokkan pelafalan lengkap setiap kata sebagai alias sambil mempertahankan entri kosakata yang terlihat sebagai target tautan. Jangan menambahkan anak pelafalan tingkat kalimat atau tautan antarbaca kata yang bersaudara; setiap entri kosakata memiliki jalur bacaannya sendiri menuju Kana atomik secara mandiri.
