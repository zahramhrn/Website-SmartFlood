# SMART-FLOOD 🌊

**Pemetaan Wilayah Terdampak Banjir & Optimasi Jalur Kendaraan — Jabodetabek**

SMART-FLOOD adalah website Sistem Informasi Geografis (SIG) berbasis web yang membantu masyarakat dan petugas darurat memantau wilayah terdampak banjir serta menemukan jalur kendaraan yang aman dan optimal di kawasan Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi).

## ✨ Fitur

- 🗺️ **Peta interaktif** zona banjir dengan 4 tingkat status: Normal, Waspada, Siaga, Awas
- 🛟 **Posko pengungsian** se-Jabodetabek lengkap dengan status & wilayah
- ⚠️ **Titik genangan** jalan beserta estimasi ketinggian air
- 🚗 **Optimasi jalur kendaraan** — sistem menghitung beberapa alternatif rute dan merekomendasikan rute dengan risiko banjir terendah (menghindari zona terdampak)
- 📊 **Dashboard statistik** ringkas (wilayah terdampak, jumlah pengungsi, posko aktif, TMA sungai)
- 📰 Ticker peringatan dini berjalan
- 📱 Responsif untuk mobile & desktop

## 🛠️ Teknologi

- HTML5, CSS, JavaScript (vanilla, tanpa framework/build step)
- [Leaflet.js](https://leafletjs.com/) — peta interaktif
- [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) + [OSRM](http://project-osrm.org/) — perhitungan rute
- Basemap [CARTO](https://carto.com/) (OpenStreetMap)

## 🚀 Menjalankan secara lokal

Tidak perlu instalasi atau build tool — cukup buka `index.html` langsung di browser, atau jalankan local server (disarankan, agar beberapa fitur browser bekerja optimal):

```bash
# Python
python3 -m http.server 8000

# atau Node (http-server)
npx http-server .
```

Lalu buka `http://localhost:8000`.

## 📂 Struktur Proyek

```
smart-flood/
├── index.html      # struktur halaman (markup)
├── css/
│   └── style.css   # seluruh gaya/tampilan
├── js/
│   └── app.js      # data, peta, & logika optimasi rute
└── README.md
```

## 🌐 Deploy ke GitHub Pages

1. Push repo ini ke GitHub.
2. Buka **Settings → Pages**.
3. Pilih branch `main` dan folder `/ (root)`.
4. Simpan — situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.

## 📝 Catatan Data

Data zona banjir, titik genangan, dan posko pengungsian pada repo ini bersifat **simulasi/contoh** untuk keperluan demo. Untuk penggunaan produksi, sambungkan ke sumber data resmi (misalnya API BPBD, BMKG, atau data spasial OpenStreetMap terkini).

## 📄 Lisensi

Bebas digunakan dan dimodifikasi untuk keperluan edukasi, riset, maupun pengembangan lanjutan.
