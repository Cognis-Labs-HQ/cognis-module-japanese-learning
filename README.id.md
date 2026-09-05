# Cognis Bahasa Jepang

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Cognis Bahasa Jepang adalah paket konten bahasa Jepang deklaratif untuk Pustaka Study Cognis. Paket ini menyediakan skema berversi serta data karakter, definisi, kata, dan kalimat tervalidasi tanpa memiliki rute API, persistensi, atau antarmuka peramban.

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
