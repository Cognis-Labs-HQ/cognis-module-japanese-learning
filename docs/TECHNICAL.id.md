# Referensi Teknis

Paket bahasa Jepang menyediakan konten bahasa, pengayaan kamus, pola tulisan, dan rekaman melalui penyedia Study publik.

## Antarmuka

`bootstrapModule(ctx)` memerlukan `study:library:provider` dengan `transformationModel: "generated"`, `ingestContentPack`, `registerLookupProvider`, dan `deleteContentPack`, serta `study:audio:provider`. Bootstrap mendaftarkan pencarian konten/media, mengingesti `data/library/`, dan menerbitkan `study:language:ja`. Deskripsi bahasa memuat paket serta dek awal; Cognis memiliki navigasi, otorisasi, dan antarmuka belajar.

Rute khusus administrator `GET`, `PUT`, dan `DELETE /api/v1/modules/study-language-ja/config` menjalankan alur baca, simpan, dan hapus modul. PUT menerima string `voiceId`: kosong menghapus penggantian suara; nilai tidak kosong berisi 1–128 huruf, angka, garis bawah, atau tanda hubung. Badan permintaan dibatasi 2048 byte. Modul tidak mendeklarasikan titik masuk API saat nonaktif.

## Konfigurasi

`voiceId` opsional memilih suara yang dihasilkan tanpa mengubah asal rekaman bawaan. Konfigurasi disimpan melalui `db:executor` dalam tabel milik modul `module_study_language_ja_config`, bertahan saat nonaktif/dimulai ulang, dan dibersihkan saat pencopotan. Skema Pustaka, manifes konten, dek awal, serta inventaris referensi berada di `data/`; ketersediaan berasal dari inventaris tersebut, bukan jumlah tetap dalam manual.

## Perilaku

### Konten dan hubungan

`data/library/schema.json` mendeklarasikan `characters`, `alt-characters`, `definitions`, `words`, `particles`, `sentences`. Rekaman memakai ID lokal paket yang stabil dan makna empat bahasa. Referensi berurutan menunjuk rekaman nyata dan mempertahankan urutan komposisi. Study memiliki resolusi UUID, validasi skema, ACL, impor, penulisan, dan antarmuka yang dihasilkan. Kode bahasa, UUID modul tetap, serta ID penyelesaian tutorial bukan kunci terjemahan.

Bentuk yang dihasilkan memerlukan flag kartu dasar yang sesuai dan diresolusikan melalui model transformasi host. Bentuk tersebut adalah tampilan berdasarkan identitas dasar dan jalur transformasi, bukan kartu terpisah dalam paket. Transformasi tidak dikenal atau tidak berlaku ditolak, bukan diganti diam-diam dengan bentuk dasar.

### Rekaman dan tulisan

`data/audio/recordings.json` mendeklarasikan format inventaris 2. Indeks tujuan dalam `data/audio/indexes/` menunjuk shard ber-checksum di `data/audio/inventories/`; pemuat memverifikasi digest serta jumlah sebelum menyediakan audio. `data/audio/unavailable.json` mencatat audio bawaan yang tidak tersedia. Pencocokan memakai bacaan dan jalur transformasi yang ditulis; audio transformasi yang tidak tersedia tidak diganti rekaman bentuk dasar. Komposisi kalimat memakai audio unsur penyusun. `elevenlabs-tts:synthesis` opsional dipakai hanya jika dikonfigurasi; otorisasi Study tetap tanggung jawab pemanggil.

Pola tulisan mempertahankan urutan goresan serta kelompok per karakter. Media bawaan dilayani melalui aset paket berizin milik host. Penonaktifan melepaskan penyedia pencarian/audio dan kontribusi statis; kegagalan bootstrap membatalkan pendaftaran parsial. Pencopotan mempertahankan konten belajar kecuali `deleteContent` bernilai benar, lalu memanggil kontrak Pustaka `deleteContentPack`.

### Kamus dan data referensi

Jisho memperkaya kata dan Kanji Jepang melalui validasi permintaan milik modul. Permintaan memiliki tenggat 15 detik dan badan respons yang ditolak dibatalkan. Shard KANJIDIC2 mempertahankan atribusi EDRDG serta bacaan/makna berlisensi. Bacaan Kana lengkap dan komposisi leksikal berurutan tetap menjadi acuan; nilai sumber yang tidak ada tidak direka. Cognis memiliki cache kueri dan publikasi.

### Siklus hidup tutorial

Panduan bahasa memerlukan pendaftaran belajar secara tegas dan memakai `study:libraryTutorials`. Host memiliki target serta siklus hidup editor. Penemuan tidak menavigasi; peluncuran eksplisit boleh membuka konten bahasa. Penyelesaian disimpan host per akun dan ID tutorial tetap; Back, Restart, serta pelepasan penyedia menutup permukaan milik panduan tanpa mengirim kartu.

## Keamanan

Izin Pustaka tetap berlaku meskipun paket memiliki hak istimewa. Kueri dan media harus berada dalam lingkup penyedia yang dideklarasikan. Atribusi kamus serta lisensi sumber melekat pada hasil; bacaan atau makna tak lengkap tetap tidak diketahui, bukan direka. Log memuat metadata aman, bukan kredensial, muatan lengkap, atau konten belajar pribadi.

## Referensi

Sumber implementasi dan data berikut mendefinisikan kontrak runtime yang didukung. Manual host menjelaskan batas rendering dan persistensi bersama.

- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/bootstrap.js)
- [api/routes/config/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/routes/config/index.js)
- [api/dictionary/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/dictionary/index.js)
- [data/library/schema.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/library/schema.json)
- [data/audio/recordings.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/audio/recordings.json)
- [data/reference/manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/reference/manifest.json)

### Validasi nama

`npm test` memeriksa nama binding dengan detektor pohon sintaks lokal, termasuk bootstrap, skrip, pengujian, dan fixture. Kesalahan penguraian menggagalkan validasi. Fixture regresi mencakup deklarasi, parameter, anggota privat, penegasan tipe TypeScript, dan nama khusus tipe yang sah. Lihat [standar penamaan host](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.id.md#nama-binding) untuk kebijakan bersama. Istilah lazim seperti `args`, `db`, dan LDAP `dn` diperbolehkan sebagai nama mandiri. Nama gabungan, termasuk tipe dan metode upstream, memakai kata lengkap seperti `DatabaseExecutor`, `createDatabaseExecutor`, dan `baseDistinguishedName`; API milik komponen memakai satu nama kanonis pada deklarasi, ekspor, dan pemanggil. Alias ekspor yang hanya mengganti nama menggagalkan validasi.
