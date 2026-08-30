# Cognis Bahasa Jepang

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Cognis Bahasa Jepang adalah modul eksternal berisi materi pembelajaran bahasa Jepang untuk gateway Study Cognis. Modul ini menyediakan deskripsi bahasa Jepang, aktivitas hiragana, peramban pustaka bercakupan, halaman kelas, serta kumpulan data pembelajaran bahasa Jepang.

## Templat untuk Konsumen

Konsumen memperoleh pustaka melalui kapabilitas `study:library` dan memanggil `cloneTemplate` dengan lapisan yang benar-benar diperlukan. Salinan mempertahankan urutan baku dan metadata hubungan lapisan, membuang tautan menuju lapisan yang dihilangkan, serta menandai dependensi wajib. Pembuatan kata dan kalimat dapat menyimpulkan tautan dari karakter yang dinormalisasi dan kata yang dipisahkan spasi; referensi eksplisit tetap menjadi acuan.

## Persyaratan

- Cognis dengan gateway Study yang diaktifkan.
- Kapabilitas host `auth:requireAuth`.
- Akun administrator atau pemilik untuk mengubah catatan pustaka.

## Pengembangan

```sh
npm install
npm test
npm run check:manifest
```

Modul ini mendaftarkan `/study/hiragana`, `/study/library`, dan `/study/ja-classroom`. API pustaka berlapis yang memerlukan autentikasi tersedia di bawah `/api/v1/modules/study-language-ja/study/library`; API ini mendukung cakupan global, kelas, dan pengguna, pelacakan dependensi, pertukaran JSON dan Anki, serta permintaan push yang ditinjau.

Manifest memublikasikan `/static/modules/study-language-ja/languages` sebagai bundel bahasa milik modul agar Cognis dapat menerjemahkan metadata marketplace sebelum memuat UI.

Repositori ini diekstrak dari modul bahasa Jepang pada branch Cognis `feature-remove-modules-from-administration-page`, mengikuti pengemasan modul eksternal yang dibuat oleh [Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) dan [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1).

## Lisensi

AGPL-3.0-or-later. Lihat [LICENSE](LICENSE).
