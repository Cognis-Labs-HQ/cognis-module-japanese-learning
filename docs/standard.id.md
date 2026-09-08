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

Lapisan karakter meminta baris berisi lima kartu dan mencantumkan kedua sistem tulisan dalam urutan gojūon standar. Kisi hanya memuat rekaman kana dasar, sedangkan dakuten dan handakuten tetap menjadi anak berarah di sekitar induk tanpa tanda.

## Kartu berbasis definisi

Diselaraskan dengan kontrak tampilan Pustaka terbaru: kata, partikel, dan kalimat kini meminta teks kartu terlokalisasi yang berbasis definisi, dan setiap entri tersebut memiliki referensi definisi wajib.

## Label lapisan khusus bahasa Jepang

Tab Pustaka yang dihasilkan kini memakai label bidang milik modul: Kana untuk karakter atomik, Kanji untuk unit tulisan gabungan, dan Kosakata untuk kata. Bacaan kanji menargetkan entri kosakata yang dikelompokkan, bukan rangkaian referensi karakter yang diratakan.

## Urutan kana yang aman untuk filter

Penanda kosong tanpa syarat di antara urutan hiragana dan katakana telah dihapus. Saat filter sistem tulisan menyembunyikan salah satu aksara, tabel yang dipilih kini dimulai dari sel kisi pertama tanpa mewarisi sel kosong dari tabel tersembunyi.
