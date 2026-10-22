# Lengkapi Bentuk Verba Godan

**Cabang Fitur:** fix-dictionary-godan-forms

## Kenali Bentuk Verba Reguler

Verba Godan Jepang reguler berakhiran ru, u, tsu, dan nu kini memiliki aturan transformasi milik penyedia serta pemetaan kelas kamus yang tepat. Misalnya, 帰る menawarkan 帰ります, 帰らない, 帰った, dan 帰って. Pola khusus ある tetap terpisah. Revisi konten memperbarui skema Pustaka saat modul diaktifkan.

## Gunakan Flag Transformasi Eksplisit

Kartu dasar bahasa Jepang dan hasil kamus mendeklarasikan flag transformasi eksplisit. Jamak kelompok menggunakan satu keluarga produktif opsional; 私 menghasilkan 私たち tanpa kartu terpisah. Jalur aturan yang ada mempertahankan rekaman bawaan dan pola karakter turunannya.

## Pertahankan Rekaman dan Latihan Menulis

Rekaman berjalur yang ada mempertahankan suara Jepang yang ditentukan dan audio tepat setiap penyusun. Pengujian cakupan mewajibkan rekaman yang sesuai untuk setiap sumber dan aturan aktif, termasuk kartu baru dengan flag. Host menyelesaikan pola goresan dari ejaan turunan.

Aturan Godan-gu dan Suru reguler mencakup verba kamus baru. Suru memakai alternatif akhiran berurutan untuk mendukung 勉強する maupun pangkal nominal 勉強 tanpa membuat kartu dasar terpisah. Ejaan dan pelafalan diperiksa untuk bentuk sopan, negatif, lampau, te, potensial, dan kausatif berantai.

## Pastikan kosakata kalimat tetap dapat ditemukan

Carousel struktur kalimat secara eksplisit mendeklarasikan `excludeFromBrowse: false` agar kata leksikalnya juga muncul dalam Kosakata. Carousel khusus tanda baca tetap dikecualikan. Pengujian mencakup semua referensi kosakata kalimat, alias pelafalan tersembunyi, dan cakupan filter opsional, termasuk kata tanpa tingkat seperti ノート dalam bahasa Jepang.

## Pil bermakna dan filter JLPT

Pil pembelajaran menampilkan kelas tata bahasa terlokalisasi, penggunaan umum, dan tingkat JLPT; tag bentuk serta transformasi teknis tetap internal. Tingkat 225 kartu kosakata dan 190 Kanji telah diperiksa terhadap sumber. Entri yang tidak tercantum atau ambigu tetap tidak terklasifikasi. Inventaris mencatat bukti Jisho, mencocokkan bacaan dan makna, serta memilih tingkat pembelajaran paling awal bila beberapa daftar berlaku.

Kanji dan Kalimat menyediakan filter N5–N1 yang ringkas seperti Kosakata, tanpa pilihan awal otomatis. Perkiraan tingkat kalimat memakai kosakata, partikel dasar, atau transformasi terpilih yang paling sulit; nilai yang ditulis dapat menetapkan tingkat tata bahasa minimum. Kalimat harus memuat tingkat tersebut tanpa persyaratan yang lebih sulit. Tingkat konstituen yang tidak diketahui membuatnya tidak terklasifikasi dan tetap terlihat pada tampilan tanpa filter. Perkiraan tata bahasa merupakan sasaran belajar penyedia, bukan sertifikasi JLPT resmi.

## Komit

- [5b21f1d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5b21f1d569cac8d037c0c62503c96839d2e5056f)
- [4233c508](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4233c508ff1357283bcb523b810adf076308a3ed)
- [4cd4b1cb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4cd4b1cb4c630b41ed6c577dfb159a4d6caa2566)
- [31035eeb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/31035eeb63b25a5f20bf3f507cd6d37c3a5adcfb)
