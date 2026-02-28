# Kalkulator HPP Cireng Pro (Penghitung Cireng Bossku)

Aplikasi Web Progressive (PWA) super bersih dan mudah digunakan untuk menghitung Harga Pokok Penjualan (HPP) Cireng, menentukan harga jual, serta menyimulasikan keuntungan (cuan) usaha Anda.

## 🌟 Fitur Utama

- **Kalkulasi Biaya Bahan Baku**: Masukkan rincian bahan, harga beli, dan takaran yang dipakai untuk menghitung total modal bahan secara otomatis.
- **Biaya Operasional**: Tambahkan biaya operasional seperti gas, kemasan, dan lainnya untuk akurasi perhitungan modal produksi.
- **Perhitungan HPP (Harga Pokok)**: Otomatis menghitung HPP per Pcs maupun per Pack/Kemasan.
- **Simulasi Keuntungan (Cuan)**: Atur isi per pack dan harga jual untuk mensimulasikan margin profit, *Break-even Point*, estimasi total cuan, dan untung per pack.
- **Saran Harga Jual**: Dapatkan rekomendasi harga jual berdasarkan target keuntungan.
- **Installable / PWA (Progressive Web App)**: Bisa diinstal ke *Home Screen* smartphone selayaknya aplikasi 𝘈𝘯𝘥𝘳𝘰𝘪𝘥/iOS biasa berbantuan *Service Worker* dan file manifest.

## 🚀 Cara Menjalankan Aplikasi

1. Karena aplikasi ini berbasis teknologi Frontend murni (HTML, CSS, JavaScript), Anda tidak memerlukan instalasi backend apapun.
2. Cukup buka file `index.html` menggunakan browser modern pilihan Anda (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, dll).
3. **PWA / Instalasi App**: Jika Anda membuka aplikasi ini menggunakan *local server* (seperti Live Server di VS Code) atau menghostingnya ke web server (HTTPS), fitur PWA akan aktif dan tombol **Install App** akan muncul agar dapat diinstal ke perangkat Anda.

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Sebagai struktur kerangka aplikasi.
- **CSS3 (Vanilla)**: Desain antarmuka (UI) yang modern, cantik, premium, dan tentunya responsif.
- **Vanilla JavaScript (DOM Manipulation)**: Seluruh logika kalkulator penghitung otomatis secara *Real-Time*.
- **Service Worker (`sw.js`) & `manifest.json`**: Menjadikan web layaknya *Native App*.
- **Google Fonts & Remix Icons**: Tipografi modern (*Outfit* & *Plus Jakarta Sans*) beserta desain ikon vektor premium.

## 📂 Struktur direktori

- `index.html` : Struktur utama UI aplikasi.
- `style.css` : Memuat stylesheet untuk estetika dari UI aplikasi.
- `script.js` : Pusat kendali (otak) logika aplikasi hitung HPP dan manipulasi event.
- `manifest.json` : File konfigurasi *Web App Manifest* (nama, icon, warna tema PWA).
- `sw.js` : Skrip *Service Worker* agar aplikasi bisa di-cache supaya lebih cepat dan bisa offline.
- Ikon Aplikasi (Seperti `icon-192.png`, dsb.)
