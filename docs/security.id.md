# Keamanan

Modul pembelajaran bahasa Jepang melindungi permukaan pustakanya dengan autentikasi host, otorisasi berbasis peran, validasi batas, dan pelaporan kesalahan yang aman.

## Contoh Penggunaan

- Autentikasi setiap permintaan pustaka melalui capability `auth:requireAuth` yang disediakan host.
- Wajibkan peran administrator atau pemilik sebelum menerima perubahan pustaka.
- Kembalikan kode kesalahan klien yang stabil, bukan pesan pengecualian.

## Spesifikasi Teknis

### Otorisasi

Semua pembacaan pustaka memerlukan pengguna terautentikasi. Perubahan pustaka memerlukan administrator atau pemilik, dan otorisasi dilakukan sebelum membaca permintaan atau menjalankan operasi penyimpanan.

### Validasi dan Kesalahan

Ukuran badan permintaan dibatasi dan divalidasi pada batas API. Kegagalan tak terduga dicatat dengan metadata terstruktur yang tidak sensitif, sedangkan klien menerima kode kesalahan stabil tanpa detail pengecualian internal.
