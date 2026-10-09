# Integrasi kamus

Versi modul dan paket konten 2.2.93 mempertahankan revisi skema 88. Jisho mendaftar melalui kapabilitas host `study:library:provider` dengan `searchable: true` dan kapabilitas `dictionary`. Kana, Kanji, dan Kosakata didukung; kalimat dan pembuatan partikel milik penyedia dikecualikan.

## Pencarian otoritatif

Permintaan kata dan Kanji mengambil data Jisho yang otoritatif meskipun konten bawaan cocok. Konten lokal hanya menjadi cadangan saat pengambilan jaringan dinyatakan tidak tersedia; resolusi Kana tetap lokal dan milik penyedia. Pencarian Kanji tunggal mengambil bacaan Kun/On, arti, jumlah goresan, tingkat sekolah, JLPT, dan frekuensi. Permintaan memakai User-Agent Cognis, batas waktu 15 detik, serta log kegagalan yang aman. Kegagalan transportasi menjadi kesalahan, bukan hasil kosong.

## Impor ke editor

Satu hasil langsung mengisi editor terbuka; beberapa hasil memakai daftar pratinjau horizontal dengan pemilihan dan konfirmasi. Pencarian kosakata mempertahankan teks serta token komposisi pengguna. Pelafalan dan definisi langsung dikomit. Setiap arti, termasuk yang dipisahkan titik koma, menjadi definisi tersendiri. Cognis menyediakan penerjemahan bahasa UI yang belum tersedia melalui kapabilitas lokalisasi opsional; modul tidak mengarang terjemahan atau menyalin bahasa Inggris ke bahasa lain. URL sumber dan rekaman asli lengkap hanya disimpan sebagai metadata tersembunyi `dictionary_data`.

## Graf bacaan

Kanji dengan beberapa bacaan memakai satu kartu Kosakata tersembunyi per bacaan, dengan tautan balik ke Kanji asal, tautan pelafalan Kana berurutan, dan definisi langsung. Kanji satu bacaan menaut langsung ke Kana. Pelafalan kata memilih segmen bacaan Kanji terdekat yang tersedia dan Kana sisanya. Cognis menyelesaikan identitas terpasang, memakai ulang kartu perantara yang cocok pada impor berulang, lalu memvalidasi kolom, cakupan, dan ACL sebelum mengomit graf secara atomik. Karakter dan partikel tetap milik penyedia. Gema Katakana yang sama dengan Hiragana disaring kecuali ejaan tersebut dinyatakan oleh kamus; bacaan On serta kata serapan asli tetap dipertahankan.

## Kepemilikan cache core

Cognis core memiliki cache kamus melalui `core:cache`. Kueri menjadi dingin setelah satu jam dan diperiksa saat dipakai lagi. Perubahan diterbitkan pada batas dua belas jam; konten yang tidak berubah dipertahankan. Permintaan bersamaan berbagi pemeriksaan, kegagalan mempertahankan data cache berhasil, dan cache persisten bertahan setelah restart. Modul tidak menjadwalkan kueri kamus atau menyimpan cache respons kamus. Jisho tidak memiliki umpan perubahan ringan, sehingga pemeriksaan memakai respons pencarian biasa. Tidak ada kontrol Refresh manual. Tautan lokal memakai kartu Library yang saat ini dapat diakses.

## Cache aset goresan

Aset goresan KanjiVG menggunakan cache modul terpisah dan terbatas: maksimal 512 label, respons berhasil selama 24 jam, dan aset hilang selama lima menit. Permintaan bersamaan berbagi pengambilan; kegagalan dibuang. Cache aset ini tidak mengatur pencarian kamus atau navigasi aplikasi. Jisho dan KanjiVG memakai pemuat konten deterministik `reuse/content.js`; penyedia goresan memakai `reuse/lookup-cache.js`.

## Batas impor kalimat

API kata Jisho menyediakan bentuk, bacaan, arti, dan kelas kata, tetapi tidak menerjemahkan kalimat sembarang atau menyediakan posisi token, penyelarasan infleksi, dan hubungan partikel. Impor kalimat sekali klik masih memerlukan penganalisis morfologi, penyedia terjemahan kalimat, serta perencana graf milik modul yang mempertahankan teks, tanda baca, dan bacaan tertransformasi. Jisho dapat memperkaya simpul leksikal tetapi tidak menyediakan seluruh alur. Kapabilitas impor kalimat belum ditawarkan.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)
