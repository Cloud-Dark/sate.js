const SateJS = require('../src/index');

/**
 * 🍢 Contoh Penggunaan Cepat Sate.js
 * 
 * Script ini menunjukkan cara paling dasar untuk menggunakan Sate.js:
 * 1. Inisialisasi library.
 * 2. Memanggil metode `tusuk()` pada sebuah URL.
 * 3. Menampilkan beberapa hasil analisis kunci.
 */
async function runQuickStart() {
  console.log('🍢 Sate.js Quick Start Example\n');

  // Inisialisasi sate dengan beberapa opsi dasar
  const sate = new SateJS({
    userAgent: 'Sate.js Quick Start Bot 🍢',
    timeout: 30000,
    respectRobots: false // Diabaikan untuk contoh sederhana ini
  });

  try {
    // Tusuk data dari website target
    const hasil = await sate.tusuk('https://example.com');

    console.log('✅ URL:', hasil.url);
    console.log('✅ Quality Score:', `${hasil.quality.overall}/100`);
    console.log('✅ Sentiment:', hasil.sentiment.sentiment);
    console.log('✅ Language:', hasil.language.fullName);
    console.log('✅ Top 5 Keywords:', hasil.keywords.slice(0, 5).map(k => k.word).join(', ') || 'N/A');
    
    console.log('\n✨ Quick Start finished successfully!');

  } catch (error) {
    console.error('❌ Error during Quick Start example:', error.message);
  }
}

// Jalankan contoh jika file ini dieksekusi langsung
if (require.main === module) {
  runQuickStart();
}

module.exports = runQuickStart;