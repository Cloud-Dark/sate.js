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
- 🔧 **Feature Rich** - 25+ fitur canggih untuk web crawling
- 📊 **Smart Analytics** - Quality scoring & performance monitoring
- 🌍 **Universal** - Mendukung semua jenis website
- 💡 **Easy to Use** - API yang intuitif dan dokumentasi lengkap

## 🚀 Quick Start

### Installation

```bash
npm install sate.js
```

### Basic Usage

```javascript
const SateJS = require('sate.js');

// Inisialisasi sate 🍢
const sate = new SateJS({
  userAgent: 'Sate.js Bot 🍢',
  timeout: 30000,
  delay: 1000
});

// Tusuk data dari website
const hasil = await sate.tusuk('https://example.com');

console.log('Quality Score:', hasil.quality.overall);
console.log('Sentiment:', hasil.sentiment.sentiment);
console.log('Keywords:', hasil.keywords.slice(0, 5));
console.log('Language:', hasil.language.fullName);
```

## 🍢 Core Features

### 1. Basic Data Skewering

```javascript
// Tusuk data lengkap dari URL
const data = await sate.tusuk('https://example.com', {
  cache: true,
  trackSimilarity: true
});

// Quick methods
const title = await sate.ambilJudul('https://example.com');
const links = await sate.ambilLink('https://example.com');
const metadata = await sate.ambilMetadata('https://example.com');
const insight = await sate.ambilInsight('https://example.com');
```

### 2. Mass Data Processing

```javascript
// Tusuk banyak URL sekaligus
const urls = [
  'https://site1.com',
  'https://site2.com',
  'https://site3.com'
];

const results = await sate.tusukMassal(urls, {
  concurrent: 3,
  delay: 1000
});
```

### 3. Competitor Analysis

```javascript
// Analisis kompetitor
const competitors = await sate.analisisWarung([
  'https://competitor1.com',
  'https://competitor2.com',
  'https://competitor3.com'
]);

console.log('Average Quality:', competitors.analisis.kualitasRataRata);
console.log('Popular Keywords:', competitors.