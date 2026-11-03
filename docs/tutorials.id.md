# Tutorial terpandu

Modul ini mengikat panduan pengantarnya pada halamannya melalui `ui:tutorials`. Kunjungan pertama yang diizinkan memulainya otomatis; SVG tanda tanya di samping judul halaman memutar ulang panduan. Host harus menyediakan kontrak tutorial terikat halaman versi satu.

## Contoh Penggunaan

Rute Explore dan Flashcards diselesaikan melalui kapabilitas publik Study `study:tutorialTargets`. Modul bahasa hanya menyumbangkan data bahasa dan alur; Cognis tetap mengelola rute, pendaftaran bahasa, cache dan antarmuka belajar. Bahasa Inggris dan Jepang memakai implementasi penyedia yang sama. Konten dalam cache dapat dijelaskan saat offline. Target yang hilang setelah navigasi mengikuti kebijakan host.

## Spesifikasi Teknis

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

Panduan hanya memberi informasi dan tidak menjalankan aksi berizin khusus. Target yang hilang dapat dilewati dengan Berikutnya pada sesi pertama, atau dicoba lagi maupun dibatalkan saat pemutaran ulang.
