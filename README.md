# 🍢 Sate.js

> **Skewer web data perfectly** - Smart Indonesian web crawler library

[![npm version](https://img.shields.io/npm/v/sate.js.svg)](https://www.npmjs.com/package/sate.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made in Indonesia](https://img.shields.io/badge/Made%20in-Indonesia-red.svg)](https://github.com/Cloud-Dark/sate.js)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)

Sate.js adalah library web crawler yang powerful, cepat, dan mudah digunakan, dibuat khusus untuk developer Indonesia. Seperti sate yang menusuk daging dengan sempurna, Sate.js menusuk data web dengan presisi tinggi.

## ✨ Mengapa Sate.js?

- 🍢 **Perfect Skewering** - Menusuk data web dengan presisi seperti sate
- 🚀 **Super Cepat** - Tanpa Chromium, pure Node.js
- 🤖 **AI-Powered** - Sentiment analysis, keyword extraction, language detection
- 🇮🇩 **Made in Indonesia** - Dokumentasi bahasa Indonesia & English
- 🔧 **Feature Rich** - 35+ fitur canggih untuk web crawling
- 📊 **Smart Analytics** - Quality scoring & performance monitoring
- 🌍 **Universal** - Mendukung semua jenis website
- 💡 **Easy to Use** - API yang intuitif dan dokumentasi lengkap

## 📦 Installation

```bash
npm install sate.js
```

## 🚀 Quick Start

```javascript
const SateJS = require('sate.js');

// Inisialisasi sate 🍢
const sate = new SateJS({
  userAgent: 'Sate.js Bot 🍢',
  timeout: 30000,
  delay: 1000
});

// Tusuk data dari website
async function runBasicExample() {
  try {
    const hasil = await sate.tusuk('https://example.com');

    console.log('Quality Score:', hasil.quality.overall);
    console.log('Sentiment:', hasil.sentiment.sentiment);
    console.log('Keywords:', hasil.keywords.slice(0, 5));
    console.log('Language:', hasil.language.fullName);
  } catch (error) {
    console.error('Error during basic usage:', error.message);
  }
}

runBasicExample();
```

## 🍢 Core Features

Sate.js menawarkan lebih dari 35 fitur canggih untuk kebutuhan web crawling dan analisis data Anda:

### Data Extraction & Parsing
1.  **`tusuk(url, options)`**: Metode utama untuk mengekstrak semua data dari URL.
2.  **Metadata Extraction**: Mengambil judul, deskripsi, kata kunci, canonical URL, Open Graph, dan Twitter Card.
3.  **Link Extraction**: Mengidentifikasi dan mengekstrak semua tautan internal dan eksternal.
4.  **Image Extraction**: Mengambil semua URL gambar beserta atribut `alt` dan `title`.
5.  **Text Extraction**: Mengekstrak teks lengkap, judul (H1-H6), jumlah kata, dan paragraf.
6.  **Schema Extraction**: Mendeteksi dan mengekstrak data terstruktur (JSON-LD).
7.  **Form Extraction**: Mengidentifikasi formulir HTML dan bidang inputnya.
8.  **Table Data Extraction**: Mengekstrak data dari tabel HTML menjadi format terstruktur.
9.  **Contact Info Extraction**: Mengekstrak alamat email, nomor telepon, dan tautan media sosial.
10. **Price Extraction**: Mendeteksi dan mengekstrak informasi harga dari halaman.
11. **Date Extraction**: Mengidentifikasi dan mengekstrak tanggal dari konten.
12. **Breadcrumbs Extraction**: Mengekstrak struktur breadcrumb navigasi.
13. **Reviews Extraction**: Mengidentifikasi dan mengekstrak ulasan atau testimoni.

### AI-Powered Analysis
14. **Sentiment Analysis**: Menganalisis sentimen (positif, negatif, netral) dari teks.
15. **Keyword Extraction**: Mengekstrak kata kunci paling relevan dari konten.
16. **Language Detection**: Mendeteksi bahasa utama konten.
17. **Readability Analysis**: Menganalisis tingkat keterbacaan teks (Flesch Reading Ease Score).

### Advanced Crawling & Monitoring
18. **`tusukMassal(urls, options)`**: Memproses banyak URL secara bersamaan dengan kontrol konkurensi dan penundaan.
19. **`pantauPerubahan(url, interval, callback)`**: Memantau perubahan konten pada URL tertentu secara berkala.
20. **`jelajahiSitus(seedUrl, options)`**: Menjelajahi struktur situs dari URL awal hingga kedalaman tertentu.
21. **`buatPetaSitus(baseUrl, options)`**: Membuat peta situs (sitemap) dalam format XML dari hasil penjelajahan.
22. **`periksaTautanRusak(url, options)`**: Memeriksa semua tautan di halaman dan melaporkan yang rusak.

### Analytics & Insights
23. **`analisisWarung(urls, options)`**: Melakukan analisis kompetitor dengan membandingkan kualitas, kata kunci, dan sentimen.
24. **`deteksiTeknologi(url)`**: Mendeteksi teknologi yang digunakan oleh sebuah situs web (CMS, framework, analytics, CDN, dll.).
25. **`bandingkanHalaman(urls, metrics)`**: Membandingkan beberapa halaman berdasarkan metrik kualitas, performa, dan SEO.
26. **Quality Scoring**: Memberikan skor kualitas keseluruhan dan perincian untuk SEO, aksesibilitas, performa, konten, dan teknis.
27. **Performance Monitoring**: Melacak statistik performa crawling seperti waktu respons rata-rata, tingkat keberhasilan, dan permintaan tercepat/terlambat.
28. **Duplicate Content Detection**: Mengidentifikasi konten yang duplikat atau hampir duplikat.
29. **URL Pattern Analysis**: Mengkategorikan URL berdasarkan pola (gambar, dokumen, video, e-commerce, blog, dll.).

### Utility & Quick Access
30. **`ambilJudul(url)`**: Mengambil judul halaman dengan cepat.
31. **`ambilMetadata(url)`**: Mengambil metadata halaman dengan cepat.
32. **`ambilLink(url)`**: Mengambil semua tautan dari halaman dengan cepat.
33. **`ambilTeks(url, options)`**: Mengambil teks lengkap dari halaman dengan cepat.
34. **`ambilInsight(url)`**: Memberikan ringkasan insight penting dari sebuah URL.
35. **`getStatistikPerforma()`**: Mendapatkan statistik performa crawling saat ini.
36. **`resetStatistikPerforma()`**: Mereset statistik performa.
37. **`eksporData(format)`**: Mengekspor data yang dikumpulkan dalam format JSON, CSV, atau XML.

## 📚 More Examples

### 1. Mass Data Processing

```javascript
// Tusuk banyak URL sekaligus
const urls = [
  'https://github.com',
  'https://stackoverflow.com',
  'https://dev.to'
];

const massResults = await sate.tusukMassal(urls, {
  concurrent: 2,
  delay: 1000
});

console.log('Mass Processing Results:');
massResults.forEach((result, index) => {
  if (result.error) {
    console.log(`   ${index + 1}. ${result.url} - ERROR: ${result.error}`);
  } else {
    console.log(`   ${index + 1}. ${result.url} - Quality: ${result.quality?.overall || 0}/100`);
  }
});
```

### 2. Competitor Analysis

```javascript
// Analisis kompetitor
const competitors = await sate.analisisWarung([
  'https://httpbin.org/html',
  'https://httpbin.org/json'
]);

console.log('Average Quality:', competitors.analisis.kualitasRataRata);
console.log('Popular Keywords:', competitors.analisis.katakunciPopuler.slice(0, 3));
console.log('Duplicate Content Detected:', competitors.analisis.kontenDuplikat.length);
```

### 3. Broken Link Check

```javascript
// Periksa tautan rusak di sebuah halaman
const brokenLinksResult = await sate.periksaTautanRusak('https://example.com');

console.log('Total Links Checked:', brokenLinksResult.totalLinksChecked);
console.log('Broken Links Found:', brokenLinksResult.brokenLinks.length);
if (brokenLinksResult.brokenLinks.length > 0) {
  console.log('First Broken Link:', brokenLinksResult.brokenLinks[0]);
}