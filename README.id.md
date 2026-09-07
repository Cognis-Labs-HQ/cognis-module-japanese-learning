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

Pelafalan kanji dan tautan unsurnya memakai data hiragana secara konsisten, termasuk untuk on-yomi, sehingga definisi seperti `日` tidak menampilkan unsur katakana yang tidak terkait. Setiap bacaan bawaan diuraikan menjadi referensi berurutan ke karakter hiragana yang tepat. Karakter katakana mempertahankan ID dan tautan tersendiri serta tetap tersedia bagi konten yang benar-benar ditulis dalam katakana.

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
