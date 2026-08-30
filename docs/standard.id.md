# Modul Cognis Japanese

Modul Cognis Japanese menyediakan pengalaman belajar bahasa Jepang yang dapat dipasang untuk gateway Cognis Study, termasuk data kana dan kanji, pustaka pembelajaran, serta titik masuk kelas.

## Contoh Penggunaan

- Buka `/study/hiragana` untuk mempelajari alfabet hiragana.
- Buka `/study/library` sebagai administrator untuk meninjau dan menambah materi pembelajaran modul.
- Buka `/study/ja-classroom` untuk memulai sesi kelas bahasa Jepang melalui Study.
- Minta `/api/v1/study/library/entries?scope=global` dengan token akses Cognis yang valid untuk membaca entri pustaka global.
- Gunakan capability `study:language:ja` untuk mengintegrasikan deskriptor bahasa tanpa mengimpor internal modul.

## Spesifikasi Teknis

Modul ini merupakan ekstensi Cognis eksternal. UUID permanennya mengidentifikasi modul di seluruh rilis, sedangkan entri `requires` mendeklarasikan gateway Study berdasarkan UUID.

### Kontrak Integrasi

- `bootstrap.js` adalah satu-satunya entrypoint integrasi platform.
- `ctx` yang diberikan adalah satu-satunya bus lintas komponen untuk rute, registrasi UI, capability, dan hook flow.
- Impor runtime selalu relatif terhadap repositori dan tidak pernah mengakses internal Cognis atau komponen lain.
- Registrasi tercakup dapat dihapus saat modul dinonaktifkan atau dicopot.
- Hook penghapusan instalasi mencatat pembersihan siklus hidup yang diminta tanpa langsung menghapus berkas set data pembelajaran dalam paket; berkas tersebut tetap dimiliki paket modul dan dihapus bersama paketnya.

### Keamanan

- Endpoint pustaka mengautentikasi permintaan sebelum membaca atau mengubah data.
- Penulisan pustaka memerlukan administrator, memvalidasi objek rekaman pada batas API, dan membatasi nama lapisan dengan daftar izin.
- Respons API menggunakan kesalahan publik yang stabil tanpa mengungkapkan detail implementasi.
- Kegagalan dikirim ke logger host dengan metadata terstruktur yang aman.

### Proses Rilis

- Selaraskan versi dalam `manifest.json`, `package.json`, dan `package-lock.json`, serta jangan pernah mengubah UUID modul.
- Jalankan `npm install`, `npm test`, `npm run lint`, `npm run manifest:hashes`, `npm run check:manifest`, dan `git diff --check` sebelum melakukan commit rilis.
- Buat ulang `manifest.files` setelah perubahan terakhir pada berkas distribusi agar setiap jalur relatif repositori dan hash SHA-256 tetap dapat diverifikasi.
