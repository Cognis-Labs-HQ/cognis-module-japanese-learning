# Cognis Bahasa Jepang

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Cognis Bahasa Jepang adalah modul eksternal berisi materi pembelajaran bahasa Jepang untuk gateway Study Cognis. Modul ini menyediakan deskripsi bahasa Jepang, aktivitas hiragana, halaman administrasi pustaka, halaman kelas, serta kumpulan data karakter, definisi, kata, dan kalimat.

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

Modul ini mendaftarkan `/study/hiragana`, `/study/library`, dan `/study/ja-classroom`. API pustakanya yang memerlukan autentikasi tersedia di bawah `/api/v1/study/languages/ja/library`.

Manifest memublikasikan `/static/modules/study-language-ja/languages` sebagai bundel bahasa milik modul agar Cognis dapat menerjemahkan metadata marketplace sebelum memuat UI.

Repositori ini diekstrak dari modul bahasa Jepang pada branch Cognis `feature-remove-modules-from-administration-page`, mengikuti pengemasan modul eksternal yang dibuat oleh [Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) dan [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1).

## Lisensi

AGPL-3.0-or-later. Lihat [LICENSE](LICENSE).
