# Hasil Jisho lengkap

Penyedia Jisho kini mengembalikan semua pelafalan dengan kelompok Kana berurutan, definisi yang dapat diimpor untuk tiap makna, klasifikasi leksikal, tag JLPT/kata umum, dan URL sumber. Kapabilitas kamus dideklarasikan melalui pendaftaran `study:library:provider`. Rekaman sumber lengkap, termasuk bentuk alternatif, kelas kata, catatan makna, batasan, dialek, istilah terkait, dan atribusi, disimpan sebagai JSON dalam bidang skema opsional tersembunyi `dictionary_data`.

## Penggunaan

Cognis PR #226 menyediakan pratinjau hasil umum, impor definisi, dan tindakan untuk terjemahan yang belum tersedia. Penyedia memberikan terjemahan sumber asli; Cognis meminta bahasa Jerman, Inggris, Indonesia, dan Jepang melalui kapabilitas lokalisasi opsionalnya. Modul tidak membuat terjemahan palsu atau menyalin bahasa Inggris ke bahasa lain. Pencarian konten lokal tetap mendahului jaringan dan kini mempertahankan klasifikasi serta tag.

## Spesifikasi teknis

Revisi skema 88 dan versi modul/paket konten 2.2.84 menerbitkan bidang data sumber. Impor semua makna melalui pratinjau host, atau pilih sebagian sesuai batas definisi host. Hasil asli lengkap tetap disimpan terlepas dari makna yang ditautkan.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)

## Pencarian Kanji khusus

Kanji di luar konten bawaan kini menggunakan halaman Kanji khusus Jisho, bukan API kata leksikal. Penyedia mengimpor bacaan Kun/On, makna, jumlah goresan, tingkat sekolah, tingkat JLPT, dan frekuensi. Pemisah bacaan dihapus dari pelafalan, sementara notasi sumber disimpan dalam dictionary_data. Kegagalan penyedia dilaporkan sebagai kesalahan pencarian, bukan hasil kosong. Penyedia KanjiVG secara eksplisit mendeklarasikan kapabilitas dan bidang pola goresannya. Versi modul/paket konten 2.2.85 tetap memakai revisi skema 88.

## Identitas permintaan Jisho

Permintaan Kanji dan kata ke Jisho kini mengirim User-Agent Cognis yang deskriptif. Ini mengatasi respons HTTP 403 yang ditemukan saat memakai identitas permintaan bawaan Node, termasuk pencarian 教. Log kegagalan mencatat kode kesalahan yang aman dan status HTTP jika tersedia, membedakan penolakan penyedia, format respons tidak valid, dan kegagalan transportasi tanpa merekam isi respons. Versi modul/paket konten 2.2.86 tetap memakai revisi skema 88.

## Asal kamus tersembunyi

Saran Jisho kini menyimpan URL sumber yang tepat di bidang dictionary_data tersembunyi bersama catatan sumber lengkap. Cognis mengimpor metadata ini secara langsung tanpa tautan sumber yang terlihat atau popup hasil. Versi modul/paket konten 2.2.87 tetap memakai revisi skema 88.

## Makna kamus terpisah

Hasil kata Jisho kini menghasilkan setiap makna bahasa Inggris sebagai definisi terpisah, bukan gabungan dengan titik koma. Titik koma dalam makna yang dikembalikan juga dipisahkan. Setiap definisi memiliki identitas sumber tersendiri, sementara rekaman sumber tersembunyi mempertahankan semua makna dan bidang penyedia. Versi modul dan paket konten 2.2.88 mempertahankan revisi skema 88.

## Tautan pelafalan kamus

Impor kamus menyelesaikan pelafalan lengkap ke Kana terpasang melalui kecocokan lengkap terpanjang, termasuk karakter gabungan seperti きょ dan っく serta posisi berulang. ID entri kanonis disimpan dalam kelompok bacaan berurutan; bacaan dengan karakter yang hilang tidak ditautkan sebagian. Definisi menggunakan kembali kartu yang cocok atau membuat kartu melalui alur editor biasa. Karusel tetap menjadi cara utama membuat kartu turunannya. Karakter dan partikel tetap menjadi lapisan hanya-baca yang dikelola penyedia. Editor kalimat tidak menawarkan pencarian kamus.

## Semua kandidat kamus

Penyedia Jisho kini mengembalikan setiap hasil kata yang dapat digunakan dengan label kanonis, bacaan, definisi, kelas, tag, hubungan, dan rekaman sumber tersembunyinya sendiri. Cognis menampilkan beberapa kecocokan untuk dipilih dan dikonfirmasi sebelum diimpor. Kecocokan lokal tetap mendahului pencarian jaringan; pencarian Kanji tetap berupa permintaan khusus satu karakter. Versi modul dan paket konten 2.2.89 mempertahankan revisi skema 88.

## Pencarian kamus dan cache

Penyedia kamus mengaktifkan pencarian navigasi melalui `searchable: true` dan kapabilitas `dictionary`. Pencarian hanya memakai lapisan yang didukung dan mengizinkan kamus; kalimat tetap dikecualikan. Halaman Hasil Pencarian menampilkan pratinjau kartu dan semua definisi, menyembunyikan metadata sumber, serta membuka penyusun kartu biasa untuk impor yang disengaja. Cognis menyimpan hasil berdasarkan penyedia, revisi skema, dan kueri yang dinormalisasi selama 24 jam, menggabungkan kueri bersamaan, dan mempertahankan cache setelah mulai ulang. Muat ulang secara eksplisit mengambil data penyedia lagi. Kartu lokal dan tautan pelafalan diselesaikan berdasarkan Library yang saat ini dapat diakses. Jisho tidak memiliki umpan perubahan inkremental; entri baru ditemukan melalui penyegaran atau kedaluwarsa.

## Persyaratan impor kalimat

API kata Jisho (`/api/v1/search/words`) memberikan bentuk leksikal, bacaan, makna, tag, dan kelas kata. Kueri kalimat dapat menghasilkan kecocokan kata penyusun, tetapi JSON tidak memuat terjemahan kalimat, posisi token, penyelarasan perubahan bentuk, atau keterikatan partikel. Pencarian contoh kalimat adalah pencarian korpus, bukan penerjemahan sembarang masukan. Impor satu klik yang andal membutuhkan penganalisis morfologi Jepang dengan posisi permukaan, lema, kelas kata, dan bacaan kontekstual; penyedia terjemahan kalimat; serta perencana graf milik modul yang memetakan perubahan bentuk ke descriptor transformasi Cognis. Graf harus merekonstruksi kalimat asli beserta tanda baca, menyelesaikan pelafalan ke Kana yang tersedia, mengutamakan kartu kosakata, partikel, dan karakter yang ada, dan hanya membuat kosakata atau Kanji yang dapat diedit serta definisinya. Karakter dan partikel tetap dimiliki penyedia. Host memvalidasi graf, cakupan, ACL, ambiguitas, duplikat, dan pembatalan atomik. Jisho memperkaya simpul kata dan Kanji, tetapi tidak menyediakan seluruh proses ini. Kapabilitas impor kalimat tidak diumumkan sebelum proses tersebut tersedia.

## Pencarian dan Penyegaran Resmi

Pencarian kosakata dan Kanji mengambil data Jisho lengkap meskipun konten bawaan sudah cocok. Resolusi Kana tetap lokal dan dikelola penyedia. Pencarian konten bawaan tersedia jika pengambilan melalui jaringan secara eksplisit tidak tersedia. Permintaan kosakata dan Kanji memakai utilitas cache terbatas dengan masa berlaku; kegagalan permintaan lama tidak dapat menghapus hasil penyegaran yang lebih baru.
