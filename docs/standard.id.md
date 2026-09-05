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

Skema mendefinisikan `characters`, `alt-characters`, `definitions`, `words`, dan `sentences`. Kolom bertipe dan hubungan terarah menentukan lapisan tujuan, kardinalitas wajib, urutan, dan resolusi grafem atau kecocokan terpanjang opsional. Setiap referensi menunjuk data lain dalam paket yang sama.

ID data lokal paket hanya menggunakan huruf dan angka ASCII portabel, pemisah, serta titik dua; glif bahasa Jepang ditempatkan di `label`, bukan di `id`. Aturan ini menjaga kompatibilitas ingest dengan kontrak pengenal data Pustaka.

### Siklus hidup dan kepemilikan

`bootstrap.js` hanya memperoleh kapabilitas publik melalui `ctx`, meminta Pustaka mengingesti paket, menerbitkan deskripsi bahasa Jepang, dan mencatat tanda terima. Pustaka host memiliki validasi, ID bernamespace, transaksi, idempotensi, persistensi, rute, dan UI yang dihasilkan. Modul ini tidak mendaftarkan rute API atau halaman serta tidak mengakses basis data host.

### Pembaruan dan lisensi

Perubahan skema memerlukan peningkatan versi skema. Perubahan konten memerlukan versi paket atau revisi konten baru. Semua data yang dibundel menggunakan lisensi dan atribusi yang dinyatakan manifest paket.
