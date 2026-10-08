# Filter JLPT Opsional

**Feature Branch:** feature-replace-library-with-new-implementation

## Pilih Tingkat JLPT Secara Bebas

Filter JLPT kini dimulai tanpa tingkat yang dipilih dan mengizinkan beberapa pilihan seperti filter jenis verba opsional. Menghapus semua pilihan menampilkan setiap kartu kosakata, termasuk kartu tanpa tingkat JLPT.

## Revisi Paket

Revisi skema 87 serta versi modul dan paket konten 2.2.83 menerbitkan kebijakan pilihan yang diperbarui melalui kontrak Study Library yang sudah ada.

## Hasil Jisho lengkap

Penyedia Jisho kini mengembalikan semua pelafalan dengan kelompok Kana berurutan, definisi yang dapat diimpor untuk tiap makna, klasifikasi leksikal, tag JLPT/kata umum, dan URL sumber. Kapabilitas kamus dideklarasikan melalui pendaftaran `study:library:provider`. Rekaman sumber lengkap, termasuk bentuk alternatif, kelas kata, catatan makna, batasan, dialek, istilah terkait, dan atribusi, disimpan sebagai JSON dalam bidang skema opsional tersembunyi `dictionary_data`.

Cognis PR #226 menyediakan pratinjau hasil umum, impor definisi, dan tindakan untuk terjemahan yang belum tersedia. Penyedia memberikan terjemahan sumber asli; Cognis meminta bahasa Jerman, Inggris, Indonesia, dan Jepang melalui kapabilitas lokalisasi opsionalnya. Modul tidak membuat terjemahan palsu atau menyalin bahasa Inggris ke bahasa lain. Pencarian konten lokal tetap mendahului jaringan dan kini mempertahankan klasifikasi serta tag.

Revisi skema 88 dan versi modul/paket konten 2.2.84 menerbitkan bidang data sumber. Impor semua makna melalui pratinjau host, atau pilih sebagian sesuai batas definisi host. Hasil asli lengkap tetap disimpan terlepas dari makna yang ditautkan.

## Identitas permintaan Jisho

Permintaan Kanji dan kata ke Jisho kini mengirim User-Agent Cognis yang deskriptif. Ini mengatasi respons HTTP 403 yang ditemukan saat memakai identitas permintaan bawaan Node, termasuk pencarian 教. Log kegagalan mencatat kode kesalahan yang aman dan status HTTP jika tersedia, membedakan penolakan penyedia, format respons tidak valid, dan kegagalan transportasi tanpa merekam isi respons. Versi modul/paket konten 2.2.86 tetap memakai revisi skema 88.

## Komit

- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594

## Pencarian Kanji khusus

Kanji di luar konten bawaan kini menggunakan halaman Kanji khusus Jisho, bukan API kata leksikal. Penyedia mengimpor bacaan Kun/On, makna, jumlah goresan, tingkat sekolah, tingkat JLPT, dan frekuensi. Pemisah bacaan dihapus dari pelafalan, sementara notasi sumber disimpan dalam dictionary_data. Kegagalan penyedia dilaporkan sebagai kesalahan pencarian, bukan hasil kosong. Penyedia KanjiVG secara eksplisit mendeklarasikan kapabilitas dan bidang pola goresannya. Versi modul/paket konten 2.2.85 tetap memakai revisi skema 88.

- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b
