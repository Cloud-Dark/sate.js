const SateJS = require('../src/index');

async function demonstrateFeatures() {
  console.log('🍢 Sate.js Demo - Skewer web data perfectly!\n');

  // Initialize Sate.js
  const sate = new SateJS({
    timeout: 30000,
    userAgent: 'Sate.js Demo Bot 🍢',
    cache: true,
    delay: 1000,
    respectRobots: true
  });

  try {
    console.log('='.repeat(50));
    console.log('🍢 1. Basic Data Skewering (Tusuk Data Basic)');
    console.log('='.repeat(50));
    
    const result = await sate.tusuk('https://example.com');
    console.log('✅ URL:', result.url);
    console.log('✅ Status:', result.statusCode);
    console.log('✅ Title:', result.metadata.title);
    console.log('✅ Quality Score:', result.quality.overall + '/100');
    console.log('✅ Sentiment:', result.sentiment.sentiment);
    console.log('✅ Language:', result.language.fullName);
    console.log('✅ Reading Level:', result.readability.readingLevel);
    console.log('✅ Word Count:', result.text.wordCount);
    console.log('✅ Links Found:', result.links.length);
    console.log('✅ Images Found:', result.images.length);

    console.log('\n' + '='.repeat(50));
    console.log('🍢 2. Quick Methods (Metode Cepat)');
    console.log('='.repeat(50));
    
    const title = await sate.ambilJudul('https://github.com');
    console.log('✅ GitHub Title:', title);
    
    const insight = await sate.ambilInsight('https://github.com');
    console.log('✅ GitHub Insight:');
    console.log('   - Quality:', insight.kualitas + '/100');
    console.log('   - Word Count:', insight.jumlahKata);
    console.log('   - Has Mobile Support:', insight.mobile ? 'Yes' : 'No');
    console.log('   - Sentiment:', insight.sentimen);

    console.log('\n' + '='.repeat(50));
    console.log('🍢 3. Technology Detection (Deteksi Teknologi)');
    console.log('='.repeat(50));
    
    const tech = await sate.deteksiTeknologi('https://github.com');
    console.log('✅ Technology Stack:');
    console.log('   - CMS:', tech.teknologi.cms);
    console.log('   - Frameworks:', tech.teknologi.frameworks.join(', ') || 'None detected');
    console.log('   - Analytics:', tech.teknologi.analytics.join(', ') || 'None detected');
    console.log('   - Server:', tech.teknologi.server);
    console.log('   - CDN:', tech.teknologi.cdn);
    console.log('   - Confidence:', tech.confidence + '%');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 4. Multiple URL Processing (Tusuk Massal)');
    console.log('='.repeat(50));
    
    const urls = [
      'https://github.com',
      'https://stackoverflow.com',
      'https://dev.to'
    ];
    
    const massResults = await sate.tusukMassal(urls, { concurrent: 2 });
    console.log('✅ Mass Processing Results:');
    massResults.forEach((result, index) => {
      if (result.error) {
        console.log(`   ${index + 1}. ${result.url} - ERROR: ${result.error}`);
      } else {
        console.log(`   ${index + 1}. ${result.url} - Quality: ${result.quality?.overall || 0}/100`);
      }
    });

    console.log('\n' + '='.repeat(50));
    console.log('🍢 5. Performance Statistics (Statistik Performa)');
    console.log('='.repeat(50));
    
    const stats = sate.getStatistikPerforma();
    console.log('✅ Performance Stats:');
    console.log('   - Total Requests:', stats.requests);
    console.log('   - Success Rate:', stats.successRate + '%');
    console.log('   - Average Response Time:', Math.round(stats.avgResponseTime) + 'ms');
    console.log('   - Fastest Request:', stats.fastestRequest?.duration ? Math.round(stats.fastestRequest.duration) + 'ms' : 'N/A');
    console.log('   - Slowest Request:', stats.slowestRequest?.duration ? Math.round(stats.slowestRequest.duration) + 'ms' : 'N/A');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 6. Site Discovery (Jelajahi Situs)');
    console.log('='.repeat(50));
    
    console.log('🔍 Discovering site structure...');
    const discovery = await sate.jelajahiSitus('https://example.com', {
      maxDepth: 2,
      maxUrls: 10
    });
    
    console.log('✅ Site Discovery Results:');
    console.log('   - URLs Discovered:', discovery.statistik.totalUrl);
    console.log('   - URLs Crawled:', discovery.statistik.urlTertusuk);
    console.log('   - Failed URLs:', discovery.statistik.urlGagal);
    console.log('   - Sample URLs:', discovery.ditemukan.slice(0, 3).join(', '));

    console.log('\n' + '='.repeat(50));
    console.log('🍢 Demo Completed Successfully!');
    console.log('='.repeat(50));
    console.log('✨ Sate.js has perfectly skewered your web data!');
    console.log('🇮🇩 Made with ❤️ from Indonesia');

  } catch (error) {
    console.error('❌ Demo Error:', error.message);
  }
}

// Jalankan demo jika file ini dieksekusi langsung
if (require.main === module) {
  demonstrateFeatures();
}

module.exports = demonstrateFeatures;