# Arsitektur

Modul pembelajaran bahasa Jepang menyediakan konten belajar bahasa Jepang dan halaman Study yang dapat dipasang secara mandiri melalui kontrak modul eksternal Cognis.

## Contoh Penggunaan

- Selesaikan `study:language:ja` untuk membaca deskriptor bahasa Jepang yang tidak dapat diubah.
- Selesaikan `study:language:ja:library` untuk meminta kumpulan data pembelajaran bahasa Jepang yang disertakan.
- Pasang `/study/hiragana`, `/study/library`, atau `/study/ja-classroom` melalui router SPA host.

## Spesifikasi Teknis

### Siklus Hidup dan Integrasi

`bootstrap.js` adalah titik masuk siklus hidup modul. Berkas ini mendaftarkan permukaan API dan UI terautentikasi, menyediakan deskriptor yang tidak dapat diubah serta capability pustaka hanya-baca, dan menyumbangkan deskriptor ke flow bootstrap platform. `ctx` bootstrap adalah satu-satunya bus integrasi lintas komponen.

### Kepemilikan Data

API memiliki pemeriksaan batas dan mendelegasikan pemuatan konten bahasa Jepang, validasi graf, kueri, serta persistensi ke `api/store.js`. Kumpulan data sumber yang disertakan berada di bawah `data/`.

### Permukaan Browser

Ketiga titik masuk browser tetap berupa halaman Study yang dapat dipasang secara mandiri di bawah `ui/components/`. Semuanya menggunakan kontrak halaman yang disediakan host dan dipublikasikan hanya melalui registri direktori statis dan rute SPA host.
