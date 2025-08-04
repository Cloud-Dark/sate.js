const SateJS = require('../src/index');

async function demonstrateAllFeatures() {
  console.log('🍢 Sate.js All Features Demo - Skewer web data perfectly!\n');

  // Initialize Sate.js
  const sate = new SateJS({
    timeout: 30000,
    userAgent: 'Sate.js All Features Demo Bot 🍢',
    cache: true,
    delay: 500, // Small delay for demo purposes
    respectRobots: false // Disable for testing diverse URLs
  });

  const targetUrl = 'https://example.com';
  const anotherUrl = 'https://httpbin.org/html';
  const thirdUrl = 'https://httpbin.org/json';

  try {
    console.log('='.repeat(50));
    console.log('🍢 1. tusuk(url, options) - Main Data Skewering');
    console.log('='.repeat(50));
    const result = await sate.tusuk(targetUrl, { trackSimilarity: true });
    console.log('✅ URL:', result.url);
    console.log('✅ Status Code:', result.statusCode);
    console.log('✅ Metadata (Title):', result.metadata.title);
    console.log('✅ Links Found:', result.links.length);
    console.log('✅ Images Found:', result.images.length);
    console.log('✅ Text Word Count:', result.text.wordCount);
    console.log('✅ Schema Found:', result.schema.length > 0);
    console.log('✅ Forms Found:', result.forms.length);
    console.log('✅ Sentiment:', result.sentiment.sentiment);
    console.log('✅ Keywords (Top 3):', result.keywords.slice(0, 3).map(k => k.word).join(', '));
    console.log('✅ Language:', result.language.fullName);
    console.log('✅ Readability Level:', result.readability.readingLevel);
    console.log('✅ Contacts (Emails):', result.contacts.emails.join(', ') || 'None');
    console.log('✅ Prices Found:', result.prices.length > 0 ? result.prices[0].price : 'None');
    console.log('✅ Dates Found:', result.dates.length > 0 ? result.dates[0].date : 'None');
    console.log('✅ Breadcrumbs Found:', result.breadcrumbs.length > 0);
    console.log('✅ Reviews Found:', result.reviews.length > 0);
    console.log('✅ Quality Score:', result.quality.overall + '/100');
    console.log('✅ Quality Recommendations:', result.quality.recommendations.slice(0, 1).join(', ') || 'None');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 2. Quick Methods (Metode Cepat)');
    console.log('='.repeat(50));
    console.log('✅ ambilJudul:', await sate.ambilJudul(targetUrl));
    console.log('✅ ambilMetadata (Description):', (await sate.ambilMetadata(targetUrl)).description);
    console.log('✅ ambilLink (First Link Text):', (await sate.ambilLink(targetUrl))[0]?.text || 'N/A');
    console.log('✅ ambilTeks (First Paragraph):', (await sate.ambilTeks(targetUrl)).paragraphs[0]?.substring(0, 50) + '...' || 'N/A');
    const insight = await sate.ambilInsight(targetUrl);
    console.log('✅ ambilInsight (Quality):', insight.kualitas);

    console.log('\n' + '='.repeat(50));
    console.log('🍢 3. tusukMassal(urls, options) - Mass Skewering');
    console.log('='.repeat(50));
    const massUrls = [targetUrl, anotherUrl, thirdUrl];
    const massResults = await sate.tusukMassal(massUrls, { concurrent: 2 });
    console.log('✅ Mass Results Count:', massResults.length);
    massResults.forEach(r => console.log(`   - ${r.url}: ${r.statusCode || r.error}`));

    console.log('\n' + '='.repeat(50));
    console.log('🍢 4. analisisWarung(urls, options) - Competitor Analysis');
    console.log('='.repeat(50));
    const competitorUrls = [targetUrl, anotherUrl];
    const competitorAnalysis = await sate.analisisWarung(competitorUrls);
    console.log('✅ Average Quality:', competitorAnalysis.analisis.kualitasRataRata);
    console.log('✅ Common Keywords (Top 3):', competitorAnalysis.analisis.katakunciPopuler.slice(0, 3).map(k => k.word).join(', '));
    console.log('✅ Duplicate Content Detected:', competitorAnalysis.analisis.kontenDuplikat.length);
    console.log('✅ Performance Stats (Requests):', competitorAnalysis.analisis.performa.requests);

    console.log('\n' + '='.repeat(50));
    console.log('🍢 5. pantauPerubahan(url, interval, callback) - Monitor Changes (Short Demo)');
    console.log('='.repeat(50));
    console.log('Starting a short 5-second monitor for example.com...');
    const monitor = sate.pantauPerubahan(targetUrl, 5000, (change) => {
      console.log('✅ Change Detected:', change.berubah ? 'YES' : 'NO');
      console.log('   - Similarity:', change.similarity);
      console.log('   - Title Changed:', change.judulBerubah);
      // Stop after first check for demo
      monitor.running = false;
      console.log('Monitor stopped.');
    });
    await sate.sleep(6000); // Wait for one check cycle

    console.log('\n' + '='.repeat(50));
    console.log('🍢 6. jelajahiSitus(seedUrl, options) - Site Discovery');
    console.log('='.repeat(50));
    const discovery = await sate.jelajahiSitus(targetUrl, { maxDepth: 1, maxUrls: 5 });
    console.log('✅ Discovered URLs Count:', discovery.ditemukan.length);
    console.log('✅ Sample Discovered URL:', discovery.ditemukan[0] || 'N/A');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 7. buatPetaSitus(baseUrl, options) - Generate Sitemap');
    console.log('='.repeat(50));
    const sitemapResult = await sate.buatPetaSitus(targetUrl, { maxDepth: 1, maxUrls: 3 });
    console.log('✅ Sitemap Entries Count:', sitemapResult.petaSitus.length);
    console.log('✅ Sample Sitemap XML (first 200 chars):\n', sitemapResult.xml.substring(0, 200) + '...');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 8. deteksiTeknologi(url) - Technology Detection');
    console.log('='.repeat(50));
    const techResult = await sate.deteksiTeknologi(targetUrl);
    console.log('✅ CMS:', techResult.teknologi.cms);
    console.log('✅ Frameworks:', techResult.teknologi.frameworks.join(', ') || 'None');
    console.log('✅ Analytics:', techResult.teknologi.analytics.join(', ') || 'None');
    console.log('✅ CDN:', techResult.teknologi.cdn);
    console.log('✅ Security (HSTS):', techResult.teknologi.security.hsts);
    console.log('✅ Confidence:', techResult.confidence + '%');
    console.log('✅ Recommendations (Top 1):', techResult.rekomendasi[0] || 'None');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 9. bandingkanHalaman(urls, metrics) - Compare Pages');
    console.log('='.repeat(50));
    const compareUrls = [targetUrl, anotherUrl];
    const comparison = await sate.bandingkanHalaman(compareUrls, ['quality', 'performance']);
    console.log('✅ Comparison Results (Quality):', comparison.perbandingan.quality);
    console.log('✅ Winner (Quality):', comparison.pemenang.quality);
    console.log('✅ Comparison Recommendations (Top 1):', comparison.rekomendasi[0] || 'None');

    console.log('\n' + '='.repeat(50));
    console.log('🍢 10. Performance Statistics & Export');
    console.log('='.repeat(50));
    const currentStats = sate.getStatistikPerforma();
    console.log('✅ Total Requests:', currentStats.requests);
    console.log('✅ Average Response Time:', Math.round(currentStats.avgResponseTime) + 'ms');
    console.log('✅ Success Rate:', currentStats.successRate + '%');
    
    console.log('\nExporting data to JSON...');
    const jsonData = sate.eksporData('json');
    console.log('✅ JSON Export (first 200 chars):\n', jsonData.substring(0, 200) + '...');

    console.log('\nExporting data to CSV...');
    const csvData = sate.eksporData('csv');
    console.log('✅ CSV Export (first 200 chars):\n', csvData.substring(0, 200) + '...');

    console.log('\nExporting data to XML...');
    const xmlData = sate.eksporData('xml');
    console.log('✅ XML Export (first 200 chars):\n', xmlData.substring(0, 200) + '...');

    sate.resetStatistikPerforma();
    console.log('✅ Performance Stats Reset. New Requests:', sate.getStatistikPerforma().requests);

    console.log('\n' + '='.repeat(50));
    console.log('🍢 All Sate.js Features Demo Completed Successfully!');
    console.log('='.repeat(50));
    console.log('✨ Sate.js has perfectly skewered your web data!');
    console.log('🇮🇩 Made with ❤️ from Indonesia');

  } catch (error) {
    console.error('❌ Demo Error:', error.message);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  demonstrateAllFeatures();
}