# Filter JLPT Opsional

**Feature Branch:** feature-replace-library-with-new-implementation

## Sertakan rekaman pelafalan awal

Kartu awal yang diucapkan menyertakan MP3 yang dibuat offline dan dideduplikasi, beserta atribusi suara. Kalimat tetap memutar unsur penyusunnya secara berurutan.

## Daftarkan pengambilan audio terkelola

Kedua modul Study memakai kontrak penyedia audio yang sama dan dapat dilepas, serta mengambil rekaman bawaan dengan pembacaan lokal terbatas. Host memiliki otorisasi, kebijakan cache, dan pemutaran komposit.

## Target paket dan panduan pengembang

Rilis 2.2.107 — Validasi paket memastikan titik masuk, ikon, banner, dan tangkapan layar berupa file reguler di dalam checkout, termasuk setelah resolusi jalur. Dokumentasi menjelaskan kontrak publik dan merujuk manifes untuk metadata rilis; changelog mempertahankan asal-usul rilis.

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

Aset goresan KanjiVG menggunakan cache modul terpisah dan terbatas: maksimal 512 label, respons berhasil selama 24 jam, dan aset hilang selama lima menit. Permintaan bersamaan berbagi pengambilan; kegagalan dibuang. Cache aset ini tidak mengatur pencarian kamus atau navigasi aplikasi. Jisho dan KanjiVG memakai pemuat konten deterministik `api/reuse/content.js`; penyedia goresan memakai `api/reuse/lookup-cache.js`. Versi modul dan paket konten 2.2.96 mempertahankan revisi skema 88. Jisho mendaftar melalui kapabilitas host `study:library:provider` dengan `searchable: true` dan kapabilitas `dictionary`. Kana, Kanji, dan Kosakata didukung; kalimat dan pembuatan partikel milik penyedia dikecualikan.

## Entri kamus umum

Untuk kecocokan yang sama persis, entri Jisho bertanda is_common didahulukan daripada entri yang tidak umum. Kecocokan persis tetap mengungguli kecocokan terkait. Jisho tidak memberi frekuensi setiap makna: definisi mempertahankan urutan asli, termasuk room sebagai makna pertama 室, bukan dibalik oleh penyusun.

## Transformasi kamus

Kartu transformasi menyelaraskan judul, bacaan, dan definisi dalam satu kolom. Tindakan bentuk dasar memakai gaya tombol netral. Saat menyeret, penanda sisipan vertikal tampil sebelum atau sesudah penempatan tujuan. Impor Jisho menyimpan tag keluarga konjugasi yang didukung pada kartu kosakata; kata kerja yang baru dibuat membuka pemilih transformasi sebelum ditambahkan ke komposisi induk. Kata keterangan mempertahankan kelasnya; skema Jepang saat ini tidak mendefinisikan transformasi kata keterangan.

Penyedia kamus dapat mengembalikan prerequisites berupa daftar { key, layer, label }. Setelah hasil dipilih dalam penyusun, Cognis menyelesaikan kartu tulisan gabungan yang sudah ada dalam cakupan tujuan atau mengambil dan membuat kartu yang belum ada beserta definisi dan graf bacaannya. Karakter atomik dan partikel tidak dapat dibuat melalui jalur ini. Kunci alias diganti dengan ID kanonis pada kartu utama dan referensi bacaan tersembunyi. Masukan kosakata tetap utuh; referensi tulisan impor hanya digunakan selama masukan masih sesuai dengan pencarian. Menelusuri hasil pencarian tidak membuat kartu prasyarat.

Kolom wajib yang belum ada dilengkapi melalui penyedia pencarian tambahan yang terdaftar sebelum penyimpanan; pola goresan Kanji berasal dari KanjiVG. Setiap Kanji, definisi, dan bacaan tersembunyinya disimpan sebagai satu graf tervalidasi dalam cakupan yang ditentukan.

## Aksara pelafalan Kanji

Pencarian Kanji mengubah bacaan On Katakana dari Jisho menjadi Hiragana untuk pelafalan kartu dan tautan bacaan. 僕 menyertakan ぼく bersama しもべ. Pelafalan Kun dan On yang sama disatukan setelah konversi; notasi asli seperti ボク tetap tersimpan dalam metadata kamus tersembunyi. Ejaan Katakana kosakata dan penyaringan bacaan pencarian duplikat tetap berfungsi seperti sebelumnya.

Bacaan utama mengikuti kecocokan kata persis yang umum dari Jisho: 僕 menampilkan ぼく terlebih dahulu, lalu しもべ. Kata terkait dan bacaan Kanji yang tidak tercantum tidak mengubah urutan. Jika pencarian kata gagal, hasil Kanji tetap dapat digunakan dan kegagalan dicatat dengan aman.

## Navigasi Jelajahi

Revisi skema 89 menetapkan jalur Jelajahi `kana`, `kanji`, `vocabulary`, dan `sentences` di bawah `/study/explore/ja/`. Versi modul dan paket konten adalah 2.2.99. Cognis mengelola impor, batas, pembagian dek, dan navigasi; modul menyediakan nama lapisan deklaratif dan konten kamus.

## Dek Kartu Belajar Awal

Penyedia Jepang menyediakan tiga dek awal dalam `data/starter-decks.json`: Dasar Hiragana, Kanji Sehari-hari, dan Kata Jepang Pertama. Setiap dek memiliki kunci stabil, nama lokal, ID skema, dan ID rekaman sumber. Deskriptor bahasa menampilkan data deklaratif sebagai `starterDecks`. Cognis menyelesaikan ID menjadi ID Library, menyembunyikan dek yang tidak lengkap dan penyedia nonaktif, serta mengelola penelusuran, favorit, berbagi, dan kemajuan belajar. Modul tidak membuat dek atau mengakses basis data host.

## Perbaikan tinjauan

Modul Jepang 2.2.100 langsung mewajibkan `study:library:provider` dan menghapus pendaftaran penyedia saat impor, publikasi kapabilitas, atau pendaftaran alur gagal. Skema 89 dan paket konten 2.2.99 dipertahankan; rilis ini mengubah integrasi dan keterbacaan, bukan data bahasa.

## Dek Awal Diperluas

Bahasa Jepang menyediakan enam dek awal: hiragana dan katakana lengkap masing-masing 46 kartu, sepuluh kanji, sembilan kata, delapan verba dan dua belas kalimat. Kunci tetap stabil dan seluruh anggota adalah rekaman penyedia yang terlihat.

## Perbaikan Konten dan Kontrak

Pertanyaan lokasi sopan diakhiri か dengan partikel kanonis dan empat terjemahan. Identitas kalimat tetap. Kegagalan aktivasi melepas penyedia dan mencatat metadata aman. Instruksi menetapkan ctx sebagai tulang punggung aplikasi serta mempertahankan pelafalan kalimat yang diturunkan oleh host.

## Jamak kelompok Jepang yang dipilih secara eksplisit

Skema 90 dan paket konten 2.2.102 mendeklarasikan enam keluarga nomina bernyawa dan pronomina melalui kontrak transformasi opsional Cognis (`optInTag: plural`). Akhiran `たち` menunjukkan kelompok atau orang terkait, bukan akhiran jumlah universal seperti dalam bahasa Inggris. Label, bacaan, dan definisi terlokalisasi berubah bersama, sementara referensi kalimat mempertahankan kartu dasar. Dataset tidak menggandakan kartu jamak turunan. Versi modul: 2.2.102.

## Standar kontributor templat

Selaraskan AGENTS.md dengan templat modul eksternal sambil mempertahankan aturan domain. Gunakan lokasi catatan rilis kanonis dan pertahankan konten historis serta identitas modul permanen.

## Struktur standar dan integrasi milik modul

Sinkronkan panduan templat, jalur rute domain, dokumentasi integrasi terjemahan, pemeriksaan struktur, dan hash paket akhir. Pertahankan URL publik dan identitas modul. Kontribusi browser mengikuti kontrak siklus hidup host masing-masing.

## Merek belajar dan ilustrasi

Namai ulang modul menjadi Belajar Bahasa Jepang dan sediakan ikon serta banner PNG yang serasi, dengan ilustrasi penting di area tengah yang aman dari pemotongan Marketplace. Perbarui nama terjemahan dan dokumentasi integrasi sambil mempertahankan UUID modul, kode bahasa, nama paket dan identitas konten.

## Deskripsi Marketplace yang konsisten

Gunakan ringkasan tindakan singkat dan deskripsi fitur konkret pada metadata Marketplace dengan makna terjemahan yang selaras.

## Satukan tampilan pelafalan Study

Study menyediakan klasifikasi dan gaya pelafalan publik yang digunakan kembali oleh pratinjau Library, judul detail, varian, jawaban kartu, pilihan membaca, dan area gambar. IPA mempertahankan notasi aslinya; bacaan biasa mempertahankan tipografi aplikasi pilihan pengguna. Skema kalimat Jepang dan Inggris memerlukan sedikitnya dua referensi kata.

## Wajibkan kunci bahasa tanpa teks pengganti literal

Instruksi AI melarang teks bahasa Inggris yang ditanam langsung untuk pengguna dalam setiap alur. Nilai yang tidak tersedia dalam bahasa pilihan dapat menggunakan kunci yang sama dari sumber daya XML bahasa Inggris. Nilai pengganti bahasa Inggris yang hilang atau kosong harus menimbulkan kegagalan eksplisit, bukan menampilkan teks Inggris literal, kunci mentah, atau teks kosong. Kesalahan terjemahan yang hilang tidak boleh disembunyikan.

## Kembalikan graf kamus lengkap

Kandidat Jisho tanpa rekonstruksi Kana lengkap ditolak. Anak bacaan Kanji menautkan definisi dalam graf impor yang sama; Kanji dan kosakata tanpa pemetaan mendapat kelas semantik.

## Pertahankan bagian bacaan Kanji

Notasi Kun bertitik mempertahankan bagian Kanji saja: `おし.える` menjadi `おし`, sementara notasi asli tetap dalam metadata tersembunyi.

## Sampel kurva kuadratik halus

Perintah SVG kuadratik halus mencerminkan titik kontrol kuadratik sebelumnya; riwayat kurva kubik dan kuadratik tetap terpisah.

## Batasi permintaan goresan jarak jauh

Pencarian goresan menerima paling banyak enam belas unit tulisan, berbagi satu tenggat lima belas detik untuk seluruh permintaan glif, dan membatalkan respons yang melebihi satu juta byte.

## Struktur modul Study

Paket konten berada di `data/library/`: manifes, skema, dan berkas kontennya membentuk satu batas impor dan penghapusan. Dek awal tetap di `data/starter-decks.json`. Penyedia runtime berada di `api/dictionary/` dan `api/strokes/`; pemuatan deterministik serta dekode respons dengan batas byte berada di `api/reuse/`. Pengujian konten dan siklus hidup lintas lapisan berada di `tests/`, sedangkan pengujian penyedia, transportasi, dan API berada di `api/tests/`. Manifes mendeklarasikan `api/routes/config/index.js` sebagai `disabledApi`; titik masuk itu hanya mendaftarkan rute DELETE konfigurasi khusus administrator tanpa mengimpor konten atau mengaktifkan penyedia. Pengenal alur yang telah dipublikasikan tetap stabil.

## Komposisi dengan jeda dan penggantian manual

Rekaman awal memakai model neural multibahasa Kokoro secara offline dengan suara Inggris `bf_emma` dan Jepang `jf_alpha`. Klip memakai 128 kbps, jeda awal 200 ms, jeda akhir 180 ms, normalisasi puncak terbatas, dan ucapan lebih lambat. Atribusi model dan lisensi Apache disimpan di `data/audio/VOICE-LICENSE.txt`; inventaris mencatat suara dan pengolahannya.

Kartu kalimat memiliki bidang audio opsional. Pada pemutaran pertama, Cognis mengotorisasi setiap unsur, memilih hanya kelompok pelafalan pertama, menerapkan transformasi yang dipilih, dan membuat satu WAV berkelanjutan dengan jeda awal serta jeda kata, koma, dan akhir kalimat. Rekaman disimpan secara privat; byte unsur, perubahan bacaan, transformasi, dan jeda menentukan identitasnya. Mekanisme ini berlaku sesuai kebutuhan untuk kartu baru maupun yang sudah ada. Mengunggah audio di penyusun biasa langsung menggantikan pemutaran hasil komposisi. Menghapus berkas eksplisit mengaktifkan komposisi otomatis lagi. Penyedia memasok klip kata; Cognis mengelola komposisi dan kebijakan cache.

## Cakupan inventaris referensi

Katalog referensi Jepang memuat seluruh 13.108 karakter dari salinan resmi KANJIDIC2 yang dipaketkan. Katalog Inggris memuat seluruh 135.969 entri leksikal Open English WordNet dengan 127.311 kunci ternormalisasi. Keduanya adalah penyedia kamus terpisah yang dimuat sesuai kebutuhan, bukan 149.077 kartu awal yang langsung diimpor. Pilih Kamus Referensi dalam pencarian Study untuk mengimpor entri yang didukung melalui validasi graf biasa. Rekaman tanpa makna atau bacaan yang dapat digunakan tetap tidak diketahui; pelafalan, terjemahan, dan diagram goresan tidak dibuat-buat. Inventaris ini bukan seluruh Han Unicode dan bukan daftar semua kemungkinan kata bahasa Inggris.

Bacaan Kanji diurutkan berdasarkan bukti umum JMdict dan penanda frekuensi yang tersedia, termasuk bentuk okurigana; tautan kelompok dan audio awal mengikuti urutan yang sama. Audio Kanji selalu memakai pelafalan pertama yang ditulis. Kartu kata Inggris yang ada memiliki satu IPA; entri referensi mempertahankan urutan sumber dalam ragam Britania pilihan sebelum ragam lain. Frekuensi pelafalan bergantung pada konteks dan sumber tidak menyediakan peringkat universal untuk setiap bacaan.

## Rekaman bacaan utuh untuk referensi

Bahasa Jepang juga menyertakan 2.913 klip neural bacaan utuh dalam bank berkas terbatas di `data/audio/reference/`. Bersama rekaman awal, klip ini mencakup bacaan utama seluruh 12.356 karakter sumber yang memiliki bacaan; 752 karakter lainnya tidak diberi audio yang dibuat-buat. Indeks memilih bacaan pertama yang ditulis serta memeriksa batas berkas dan pembatalan. Buat rencana dengan `python3 scripts/reference-audio.py plan --work <directory>`, proses inventarisnya dengan skrip sintesis, lalu gunakan `pack` untuk menulis bank terbatas.

Alat pemeringkat Jepang menerima `--dictionary <JMdict.gz> --kanji-dictionary <KANJIDIC2.xml.gz> --output <priorities.json>` serta opsi `--content-root data/library/content`. Alat mengutamakan bacaan leksikal mandiri yang umum, mengurutkan bacaan lain dari penyelarasan kata terverifikasi berbobot frekuensi, dan mempertahankan pilihan kartu tunggal yang ditinjau dalam `data/audio/primary-readings.json`. Penyuarakan dan geminasi dipetakan kembali ke bacaan sumber kanonis. Bacaan kun, on, dan nama tetap tersedia; hanya bacaan pertama yang dipilih menentukan pemutaran dan identitas cache. Penanda frekuensi membantu pengurutan dan bukan ukuran frekuensi pelafalan universal.

## Integrasi ucapan opsional

ElevenLabs dinyatakan sebagai dependensi modul opsional. Instalasi dapat menawarkannya untuk sintesis ucapan, tetapi Study serta audio manual dan komposit tetap tersedia tanpanya.

## Terbitkan ucapan tanpa hak istimewa

Terbitkan `elevenlabs-tts:synthesis` di namespace milik modul dan hapus penanda hak istimewa. Study Inggris dan Jepang menemukan kapabilitas ini melalui ctx dengan dependensi modul opsional yang ada. Jembatan Study menerima pengambil kapabilitas langsung dari pemanggil sehingga penonaktifan, pengaktifan kembali, dan suara yang diatur tetap berfungsi.

## Pertahankan ucapan opsional

Kapabilitas yang diterbitkan melaporkan kesiapan langsung melalui `configured`. Study mengaktifkan ucapan otomatis hanya setelah kunci API dan suara bawaan disimpan. Jika ElevenLabs tidak terpasang, dinonaktifkan, atau belum diatur, pendaftaran bahasa tetap berhasil dan audio unggahan serta komposisi cadangan tetap tersedia tanpa meminta sintesis.

## Perbaiki instalasi tanpa media bawaan

Hapus deklarasi direktori aset yang tidak digunakan dari paket konten khusus data dan tingkatkan versinya. Validasi jalur paket melalui instalasi sementara yang hanya berisi berkas terkemas agar aktivasi tidak bergantung pada direktori lokal kosong.

## Kirim rekaman suara yang konsisten

Rekaman dengan suara khusus bahasa disertakan untuk semua kartu terkurasi yang bersuara serta varian jamak atau verba/adverbia yang dapat dicapai. WAV kalimat memakai PCM penyusun yang sama persis sesuai urutan dan transformasi terpilih. Asal suara, model, permintaan, checksum, dan pemeriksaan keheningan dicatat tanpa menyertakan kredensial.

## Kontrol Belajar Tersimpan

Rekaman kata Jepang dengan kana kecil, termasuk 学校, dibuat ulang dengan ejaan kanji jika tersedia menggunakan suara Jepang yang ditetapkan dan pengaturan stabil. Kalimat bawaan disusun ulang dari klip yang sama persis. Transformasi adjektiva I dan Na mencakup bentuk adverbial, negatif, serta lampau, dengan rekaman khusus untuk bentuk bawaan. Rekaman jamak bahasa Inggris tetap berupa aset khusus dan diputar saat bentuk tersebut dipilih.

## Gambar Referensi

Menambahkan kolom daftar gambar opsional, unggahan privat, dan galeri detail. Kedua modul bahasa menyertakan foto referensi berlisensi dan menyediakan kolom yang sama pada setiap lapisan.

## Rekaman Kalimat Langsung

Kalimat bawaan memakai rekaman kalimat utuh yang dibuat langsung sebelum audio komposit. Kalimat baru atau yang belum direkam memakai komposisi host dengan PCM penyusun berurutan dan transformasi terpilih; varian yang hilang tidak diganti bentuk dasarnya. Rekaman mencakup paket terkurasi, bukan seluruh entri kamus atau semua kemungkinan kalimat buatan pengguna. Menyertakan 34 rekaman kalimat baru dengan suara `xya0RvcJtofTcFTOdX4E`. Bahasa Jepang membuat ulang 124 klip kana dan mengirim kana/kanji, bukan romaji. Permintaan menyimpan model stabil, kecepatan, kemiripan, seed, serta asal suara yang terdokumentasi.

## Foto Referensi Kosakata

33 kartu kosakata terkurasi kini memiliki foto referensi bawaan (32 berkas gambar). Cakupan meliputi semua nomina konkret serta tindakan dan sifat yang jelas secara visual; tata bahasa, pronomina, dan konsep abstrak tidak diberi gambar pengisi yang menyesatkan. Homofon Jepang seperti 花/鼻, 橋/箸, 雨/飴, dan 紙/髪/神 memakai referensi berbeda. Gambar dimuat secara lokal melalui galeri detail kartu dan pratinjau gambar penuh yang sudah ada. Judul sumber, pembuat, lisensi Creative Commons/domain publik per gambar, serta checksum dicatat dalam [katalog gambar](../../data/library/assets/images/catalog.json) dan [kredit foto](../../data/library/assets/images/LICENSE.md). Gambar kartu khusus pengguna tetap dilindungi host saat penyedia dimuat ulang.

## Ilustrasi Kosakata

Setiap kartu kosakata bawaan kini memiliki ilustrasi tersendiri yang dihasilkan dengan gaya anime (70 kartu). Benda konkret, tindakan, dan adegan kontekstual untuk konsep abstrak ditampilkan melalui galeri detail kartu dan popup gambar yang sudah ada. Foto sumber lama telah diganti. [Katalog gambar](../../data/library/assets/images/catalog.json) mencatat sumber pembuatan, gaya, asal potongan, checksum, dan pemetaan kartu; [lisensi gambar](../../data/library/assets/images/LICENSE.md) menjelaskan karya bawaan. Gambar dimuat secara lokal, dan host mempertahankan gambar khusus pengguna saat penyedia dimuat ulang.

## Kosakata Rumah Tangga

Lima belas nomina sehari-hari mencakup furnitur, pakaian, benda, dan makanan, dilengkapi makna dalam empat bahasa, tautan pelafalan, rekaman khusus, serta dek Benda Sehari-hari. Nomina bahasa Inggris yang dapat dihitung menyertakan transformasi jamak dengan rekaman, termasuk fish yang tidak berubah; rice tetap nomina tak terhitung. Ejaan Jepang untuk pemula menautkan bacaan lengkap ke kana atomik, termasuk tanda vokal panjang ー dalam テーブル dan コート.

## Kosakata Makanan dan Tubuh

Tambahkan 32 nomina berilustrasi: enam belas makanan dan enam belas istilah tubuh, dengan makna dalam empat bahasa serta dek Makanan dan Tubuh terpisah. Bahasa Inggris menyertakan 25 transformasi jumlah dengan rekaman, termasuk feet, teeth, potatoes, dan mouths dengan konsonan bersuara; makna nomina tak terhitung seperti daging ayam, daging sapi, mentega, dan kulit tidak memiliki keluarga jamak. Bahasa Jepang mempertahankan jalur lengkap ke kana atomik, memisahkan makna kaki dan tungkai dari あし menjadi definisi tersendiri, serta memakai kembali rekaman asli jika masukan pelafalannya identik. Empat kalimat contoh yang ditulis secara individual per bahasa memiliki rekaman neural langsung yang diprioritaskan di atas rekaman gabungan dari klip unsur yang persis sama. Semua ilustrasi disertakan secara lokal dengan gaya seni yang telah ditetapkan untuk masing-masing bahasa.

## Perbaikan tinjauan dan inventaris rekaman

Metadata rekaman memakai manifes ringkas dan inventaris dengan checksum untuk karakter, kosakata, transformasi, kalimat, dan cadangan kalimat. Audio, asal suara/permintaan, dan prioritas pencarian tetap sama. Impor referensi membaca bahasa paket; pembersihan mencoba seluruh registrasi meskipun ada kegagalan. Kegagalan kamus membatalkan isi respons dan pemuatan referensi dapat dicoba lagi. Dokumentasi menjelaskan konfigurasi dan gambar yang dihasilkan.

## Hasil pencarian bahasa Jepang lengkap

Respons JSON Jisho dan HTML Kanji memakai pembaca bersama dengan batas byte. Semua makna sumber dipertahankan, termasuk empat belas makna 節. Pola goresan kana kecil jarak jauh memakai proporsi yang sama dengan panduan paket. Tautan asal historis memakai hash implementasi lengkap dan tetap dari riwayat repositori yang tersedia.

## Komit

- [7d529da8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d529da851a5301f3dd04ee4b1d71e17053248f9)
- [5f901fc4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5f901fc476e5b4e4e61f18ab612bbd8a3eb9c860)
- [f9105630](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9105630f0ee87cad60fc67c99f46a311bcdb68b)
- [785fb21b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/785fb21beeb8addd3160e4dc46e0052f69a5efa1)
- [26eeb3e8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b43](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- [fdf23190](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594)
- [48b4d1aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4)
- [253824ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b)
- [8f7dc3d4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e)
- [1cebe546](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3)
- [89e41b48](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6)
- [edef816c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae)
- [fc1f65d2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fc1f65d25aa2e4d52bef4dc5290eb127a7033a68)
- [618b1c90](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/618b1c901ac826fd81a584d5ff9baa98c8033d91)
- [84e49de4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/84e49de45b43f6f0b0cdb8087eeb03cc40f6389c)
- [94e57eb2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/94e57eb29bdebb3e64e057e082608a25e72b33d0)
- [315dded4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/315dded455234476da36402728c09b9e64b3fd5d)
- [4db2d6f7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4db2d6f76a6328592520ef23528958b42d95e166)
- [fd7b3fa2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fd7b3fa218e80d8ce2657666adb544680d925fd5)
- [c0020778](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c00207784c18bfafe9548cf449176f74768f0a14)
- [f3d77c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3d77c941a7e44982c1cf60f04cfdbb8e26d2e36)
- [7d637de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d637de2c5429fb58d95f2ad542540fbc7e458b7)
- [1e8c8df](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1e8c8dfcd5c7321519c0ea38d8a8fd788335441e)
- [25322ff](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/25322ff741a62e990f6c4664f0b6083415c649ea)
- [2476657](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2476657ff36854d1a0688680cb9097f2585dad16)
- [5df0f61](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5df0f611c9161f100508565013ea6d43edb2e897)
- [4d7712d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4d7712d1eacf7bbfecf6a48bf6bffc3133afc046)
- [0d7a90cf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0d7a90cf679be17bfc39d430ca7552e2a679c74b)
- [6a0ed76b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6a0ed76b5c9afa7d7ab1352cd002630b0b334f90)
- [4b2be811](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4b2be81112494881d4e87e56d19bf94bc1ea801d)
- [293ce22](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/293ce2259636c1c527f4e8b477782f6fc2153198)
- [c6fa056](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c6fa05621ba5a97c218d2aafab91e10e6a2d305c)
- [35759eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/35759eb887310f2bec217c4e4335b0a07323c2f6)
- [13244eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/13244eb79d34f999d74def0e47fe67700fbfb42e)
- [4f906f3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4f906f37c3a33d8b38352f917fd771413c4e98e5)
- [b2de30f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2de30f212b0b9ae28a67008c0393c1116b2fca0)
- [b0b657d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b0b657d09fdc6d8c8ce9ac1388907f25a89304a3)
- [f729231](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f72923181dd412aa76c7501056b19318367524e4)
- [97b6e4d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/97b6e4d20c01a036f30309663731342f7941ad10)
- [5e5849b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5e5849bf9218b5441070a81ac661b7498b684c59)
- [e4c848b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e4c848bcb8d331facdd92f4696b1009de4f1f1d9)
- [544892a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/544892a8987304d982b2953676f5ddc39eb9c728)
- [63629ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/63629ced95d53d31a2621d2bca5d0bbf55a1dceb)
