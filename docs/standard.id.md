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

Pelafalan kanji menampilkan on-yomi dalam katakana dan kun-yomi dalam hiragana, dan setiap bacaan bawaan kini diuraikan menjadi referensi berurutan ke data karakter kana yang sebenarnya. Metadata kelas karakter membedakan variasi hiragana dan katakana, sementara perender Pustaka dapat menampilkan kana yang direferensikan sebagai kotak komponen yang dapat dinavigasi.
