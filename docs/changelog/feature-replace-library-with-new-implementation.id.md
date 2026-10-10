# Filter JLPT Opsional

**Feature Branch:** feature-replace-library-with-new-implementation

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

Aset goresan KanjiVG menggunakan cache modul terpisah dan terbatas: maksimal 512 label, respons berhasil selama 24 jam, dan aset hilang selama lima menit. Permintaan bersamaan berbagi pengambilan; kegagalan dibuang. Cache aset ini tidak mengatur pencarian kamus atau navigasi aplikasi. Jisho dan KanjiVG memakai pemuat konten deterministik `reuse/content.js`; penyedia goresan memakai `reuse/lookup-cache.js`. Versi modul dan paket konten 2.2.95 mempertahankan revisi skema 88. Jisho mendaftar melalui kapabilitas host `study:library:provider` dengan `searchable: true` dan kapabilitas `dictionary`. Kana, Kanji, dan Kosakata didukung; kalimat dan pembuatan partikel milik penyedia dikecualikan.

## Entri kamus umum

Untuk kecocokan yang sama persis, entri Jisho bertanda is_common didahulukan daripada entri yang tidak umum. Kecocokan persis tetap mengungguli kecocokan terkait. Jisho tidak memberi frekuensi setiap makna: definisi mempertahankan urutan asli, termasuk room sebagai makna pertama 室, bukan dibalik oleh penyusun.

## Transformasi kamus

Kartu transformasi menyelaraskan judul, bacaan, dan definisi dalam satu kolom. Tindakan bentuk dasar memakai gaya tombol netral. Saat menyeret, penanda sisipan vertikal tampil sebelum atau sesudah penempatan tujuan. Impor Jisho menyimpan tag keluarga konjugasi yang didukung pada kartu kosakata; kata kerja yang baru dibuat membuka pemilih transformasi sebelum ditambahkan ke komposisi induk. Kata keterangan mempertahankan kelasnya; skema Jepang saat ini tidak mendefinisikan transformasi kata keterangan.

Penyedia kamus dapat mengembalikan prerequisites berupa daftar { key, layer, label }. Setelah hasil dipilih dalam penyusun, Cognis menyelesaikan kartu tulisan gabungan yang sudah ada dalam cakupan tujuan atau mengambil dan membuat kartu yang belum ada beserta definisi dan graf bacaannya. Karakter atomik dan partikel tidak dapat dibuat melalui jalur ini. Kunci alias diganti dengan ID kanonis pada kartu utama dan referensi bacaan tersembunyi. Masukan kosakata tetap utuh; referensi tulisan impor hanya digunakan selama masukan masih sesuai dengan pencarian. Menelusuri hasil pencarian tidak membuat kartu prasyarat.

Kolom wajib yang belum ada dilengkapi melalui penyedia pencarian tambahan yang terdaftar sebelum penyimpanan; pola goresan Kanji berasal dari KanjiVG. Setiap Kanji, definisi, dan bacaan tersembunyinya disimpan sebagai satu graf tervalidasi dalam cakupan yang ditentukan.

## Komit

- [f910563](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9105630f0ee87cad60fc67c99f46a311bcdb68b)
- [785fb21](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/785fb21beeb8addd3160e4dc46e0052f69a5efa1)
- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fc1f65d25aa2e4d52bef4dc5290eb127a7033a68
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/618b1c901ac826fd81a584d5ff9baa98c8033d91
