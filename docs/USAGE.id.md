# Penggunaan

Pelajari Kana, Kanji, kosakata, dan kalimat bahasa Jepang di Cognis Study.

## Prasyarat

Aktifkan paket bahasa Jepang dan daftarkan melalui Study. Pencarian kamus dan suara buatan opsional memerlukan layanan terkonfigurasi; konten bawaan tetap terpisah.

## Contoh

Pilih bahasa Jepang di Study lalu pilih lapisan Explore. Buka kartu untuk mengikuti bacaan serta entri terkait yang ditulis penyedia, atau buka Flashcards untuk berlatih dek.

### Penggunaan

Aktifkan gateway Study dan adaptor Pustaka, lalu aktifkan modul ini. Bootstrap menyelesaikan `study:library:provider` dari `ctx` dan mengingesti `data/library`. Administrator dan pelajar menggunakan antarmuka Study yang dihasilkan adaptor Pustaka, bukan rute milik modul.

Lapisan belajar berada pada menu samping Jelajahi di `/study/<bahasa ISO>/<navigationSlug>`. Modul dapat menetapkan `navigationSlug` unik per lapisan; jika tidak diberikan, ID lapisan digunakan. Rute Pustaka dan Permintaan tetap sama. Hanya pratinjau kalimat yang memotong judul dan definisi panjang.

Modul eksternal mendeklarasikan gateway Study sebagai dependensi komponennya. Modul menemukan adaptor Pustaka melalui kapabilitas wajib `study:library:provider`, bukan memperlakukan UUID adaptor sebagai komponen yang dapat dipasang secara mandiri.

### Dependensi Penggunaan Kanji-ke-Kana

Kanji tidak boleh mereferensikan Kana atomik secara langsung. Kanji mencapai Kana hanya melalui catatan bacaan lengkapnya, sehingga navigasi Digunakan Oleh terbalik menampilkan bacaan langsung terlebih dahulu (`あ` → `あめ` → `雨`), bukan secara keliru mencantumkan setiap Kanji yang memuat Kana tersebut.

### Penggunaan

Ikuti bahasa melalui pengaturan Study. Kunjungi Explore untuk panduan pertama atau pilih panduan bahasa dari ? di ringkasan. Pilihan sadar tersebut membuka konten bahasa. Memulai dari Explore mempertahankan lapisan aktif. Panduan yang selesai hanya diulang melalui ?.

Buka kartu yang disorot untuk melihat detail dan pilih Gambar jika tersedia. Berikutnya melewati cabang yang belum dibuka. Cabang pembuatan membuka pemilih jenis dan editor, serta dapat berpindah ke lapisan yang mendukung kartu baru. Kartu tidak dikirim otomatis. Kembali, Mulai Ulang, dan selesai menutup tampilan dengan konfirmasi pembuangan perubahan biasa.

## Hasil yang Diharapkan

Kartu mempertahankan makna dan tautan bacaan lengkap yang ditulis penyedia. Gambar serta audio sesuai konten; transformasi yang dihasilkan diresolusikan oleh Cognis.

## Pemecahan Masalah

Periksa pendaftaran bahasa dan aktivasi modul jika bahasa Jepang tidak tampil. Bacaan atau rekaman yang hilang tidak boleh diganti dengan kartu tak terkait atau rekaman bentuk dasar.
