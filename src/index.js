const WebCrawler = require('./core/crawler');
const ContentParser = require('./core/parser');
const AIContentAnalyzer = require('./analyzers/ai-analyzer');
const PerformanceMonitor = require('./monitors/performance');
const SimilarityAnalyzer = require('./analyzers/similarity');
const PatternMatcher = require('./utils/pattern-matcher');
const QualityScorer = require('./analyzers/quality-scorer');
const SmartContentExtractor = require('./extractors/smart-extractor');

/**
 * 🍢 Sate.js - Skewer web data perfectly
 * Smart Indonesian web crawler library
 */
class SateJS extends WebCrawler {
  constructor(options = {}) {
    super(options);
    this.performanceMonitor = new PerformanceMonitor();
    this.contentDatabase = [];
    this.brand = '🍢 Sate.js';
    
    console.log(`${this.brand} initialized - Ready to skewer some data!`);
  }

  /**
   * 🍢 Tusuk data dari URL (Skewer data from URL)
   * Main method untuk extract semua data
   */
  async tusuk(url, options = {}) {
    const requestInfo = this.performanceMonitor.startRequest(url);
    
    try {
      const result = await this.crawl(url, options);
      const { $ } = result;

      const tusukan = {
        ...result,
        // Basic data
        metadata: ContentParser.extractMetadata($),
        links: ContentParser.extractLinks($, url),
        images: ContentParser.extractImages($, url),
        text: ContentParser.extractText($, options.textOptions),
        schema: ContentParser.extractSchema($),
        forms: ContentParser.extractForms($),
        
        // AI-powered analysis
        sentiment: AIContentAnalyzer.analyzeSentiment(result.$('body').text()),
        keywords: AIContentAnalyzer.extractKeywords(result.$('body').text()),
        language: AIContentAnalyzer.detectLanguage(result.$('body').text()),
        readability: AIContentAnalyzer.analyzeReadability(result.$('body').text()),
        
        // Smart content extraction
        contacts: SmartContentExtractor.extractContactInfo($, url),
        prices: SmartContentExtractor.extractPrices($),
        dates: SmartContentExtractor.extractDates($),
        breadcrumbs: SmartContentExtractor.extractBreadcrumbs($),
        reviews: SmartContentExtractor.extractReviews($),
        
        // Quality scoring
        quality: QualityScorer.scoreContent({
          metadata: ContentParser.extractMetadata($),
          text: ContentParser.extractText($),
          images: ContentParser.extractImages($, url),
          schema: ContentParser.extractSchema($),
          forms: ContentParser.extractForms($),
          html: result.html,
          size: result.size,
          statusCode: result.statusCode,
          url: result.url
        }),

        // Sate.js branding
        poweredBy: this.brand,
        timestamp: new Date().toISOString()
      };

      // Remove jQuery object
      delete tusukan.$;
      
      // Store for similarity analysis
      if (options.trackSimilarity) {
        this.contentDatabase.push({
          url: tusukan.url,
          text: tusukan.text.fullText,
          timestamp: tusukan.timestamp
        });
      }
      
      this.performanceMonitor.endRequest(requestInfo, result);
      return tusukan;
      
    } catch (error) {
      this.performanceMonitor.endRequest(requestInfo, null, error);
      throw new Error(`🍢 Sate.js gagal menusuk ${url}: ${error.message}`);
    }
  }

  /**
   * 🍢 Tusuk Massal (Mass Skewering) - Multiple URLs
   */
  async tusukMassal(urls, options = {}) {
    console.log(`🍢 Memulai tusuk massal untuk ${urls.length} URL...`);
    
    const results = [];
    const concurrent = options.concurrent || 1;
    
    for (let i = 0; i < urls.length; i += concurrent) {
      const batch = urls.slice(i, i + concurrent);
      console.log(`🍢 Batch ${Math.floor(i/concurrent) + 1}: Menusuk ${batch.length} URL...`);
      
      const batchPromises = batch.map(url => 
        this.tusuk(url, options).catch(error => ({ 
          url, 
          error: error.message,
          poweredBy: this.brand
        }))
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      if (options.delay && i + concurrent < urls.length) {
        await this.sleep(options.delay);
      }
    }
    
    console.log(`🍢 Tusuk massal selesai! Total: ${results.length} URL`);
    return results;
  }

  /**
   * 🍢 Analisis Warung (Competitor Analysis)
   */
  async analisisWarung(urls, options = {}) {
    console.log(`🍢 Menganalisis ${urls.length} warung kompetitor...`);
    
    const results = await this.tusukMassal(urls, { ...options, trackSimilarity: true });
    
    return {
      warung: results,
      analisis: {
        kualitasRataRata: results.reduce((sum, r) => sum + (r.quality?.overall || 0), 0) / results.length,
        katakunciPopuler: this.findCommonKeywords(results),
        kontenDuplikat: SimilarityAnalyzer.detectDuplicates(this.contentDatabase),
        performa: this.performanceMonitor.getStats(),
        pola: this.analyzeUrlPatterns(results),
        sentimen: this.compareSentiment(results),
        keterbacaan: this.compareReadability(results)
      },
      poweredBy: this.brand,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🍢 Pantau Perubahan (Monitor Changes)
   */
  async pantauPerubahan(url, interval = 3600000, callback) {
    console.log(`🍢 Mulai memantau perubahan di ${url} setiap ${interval/1000} detik...`);
    
    const monitor = {
      url,
      interval,
      callback,
      running: true,
      previous: null,
      brand: this.brand
    };

    const check = async () => {
      if (!monitor.running) return;

      try {
        const current = await this.tusuk(url, { cache: false });
        
        if (monitor.previous) {
          const similarity = SimilarityAnalyzer.calculateCosineSimilarity(
            monitor.previous.text.fullText,
            current.text.fullText
          );

          const perubahan = {
            similarity,
            berubah: similarity < 0.95,
            judulBerubah: monitor.previous.metadata.title !== current.metadata.title,
            linkBerubah: monitor.previous.links.length !== current.links.length,
            ukuranBerubah: Math.abs(monitor.previous.size - current.size) > 1000,
            timestamp: new Date().toISOString(),
            previous: monitor.previous,
            current,
            poweredBy: this.brand
          };

          callback(perubahan);
        }

        monitor.previous = current;
        setTimeout(check, monitor.interval);
      } catch (error) {
        callback({ 
          error: error.message, 
          timestamp: new Date().toISOString(),
          poweredBy: this.brand
        });
        setTimeout(check, monitor.interval);
      }
    };

    check();
    return monitor;
  }

  /**
   * 🍢 Jelajahi Situs (Site Discovery)
   */
  async jelajahiSitus(seedUrl, options = {}) {
    console.log(`🍢 Menjelajahi situs mulai dari ${seedUrl}...`);
    
    const discovered = new Set();
    const visited = new Set();
    const queue = [seedUrl];
    const maxDepth = options.maxDepth || 2;
    const maxUrls = options.maxUrls || 100;
    const pattern = options.pattern;
    
    const results = [];

    while (queue.length > 0 && discovered.size < maxUrls) {
      const url = queue.shift();
      if (visited.has(url)) continue;
      
      visited.add(url);
      
      try {
        const result = await this.tusuk(url, { ...options, trackSimilarity: false });
        results.push(result);

        if (visited.size < maxDepth) {
          result.links.forEach(link => {
            if (!visited.has(link.url) && !discovered.has(link.url)) {
              if (!pattern || PatternMatcher.patternToRegex(pattern).test(link.url)) {
                discovered.add(link.url);
                queue.push(link.url);
              }
            }
          });
        }
      } catch (error) {
        console.warn(`🍢 Gagal menusuk ${url}: ${error.message}`);
      }
    }

    console.log(`🍢 Penjelajahan selesai! Ditemukan ${discovered.size} URL.`);

    return {
      ditemukan: Array.from(discovered),
      hasil: results,
      statistik: {
        totalUrl: discovered.size,
        urlTertusuk: visited.size,
        urlGagal: visited.size - results.length
      },
      poweredBy: this.brand,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🍢 Buat Peta Situs (Generate Sitemap)
   */
  async buatPetaSitus(baseUrl, options = {}) {
    console.log(`🍢 Membuat peta situs untuk ${baseUrl}...`);
    
    const discovery = await this.jelajahiSitus(baseUrl, {
      maxDepth: options.maxDepth || 3,
      maxUrls: options.maxUrls || 1000,
      pattern: options.pattern
    });

    const sitemap = discovery.hasil.map(result => ({
      url: result.url,
      lastModified: result.timestamp,
      changeFreq: this.estimateChangeFrequency(result),
      priority: this.calculatePriority(result, baseUrl),
      status: result.statusCode,
      title: result.metadata.title,
      description: result.metadata.description
    }));

    return {
      petaSitus: sitemap,
      xml: this.generateXmlSitemap(sitemap),
      statistik: discovery.statistik,
      poweredBy: this.brand,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🍢 Deteksi Teknologi (Technology Detection)
   */
  async deteksiTeknologi(url) {
    console.log(`🍢 Mendeteksi teknologi di ${url}...`);
    
    const result = await this.tusuk(url);
    const { html, headers } = result;
    
    const teknologi = {
      cms: this.detectCMS(html, headers),
      frameworks: this.detectFrameworks(html),
      analytics: this.detectAnalytics(html),
      ecommerce: this.detectEcommerce(html),
      cdn: this.detectCDN(headers),
      server: headers.server || 'Unknown',
      security: this.detectSecurity(headers)
    };

    return {
      url,
      teknologi,
      confidence: this.calculateTechConfidence(teknologi),
      rekomendasi: this.getTechRecommendations(teknologi),
      poweredBy: this.brand,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🍢 Bandingkan Halaman (Compare Pages)
   */
  async bandingkanHalaman(urls, metrics = ['quality', 'performance', 'seo']) {
    console.log(`🍢 Membandingkan ${urls.length} halaman...`);
    
    const results = await this.tusukMassal(urls);
    const perbandingan = {};

    metrics.forEach(metric => {
      perbandingan[metric] = {};
      results.forEach(result => {
        switch (metric) {
          case 'quality':
            perbandingan[metric][result.url] = result.quality?.overall || 0;
            break;
          case 'performance':
            perbandingan[metric][result.url] = this.calculatePerformanceScore(result);
            break;
          case 'seo':
            perbandingan[metric][result.url] = result.quality?.breakdown?.seo || 0;
            break;
        }
      });
    });

    return {
      perbandingan,
      pemenang: this.findBestPerformer(perbandingan),
      rekomendasi: this.getComparisonRecommendations(results),
      poweredBy: this.brand,
      timestamp: new Date().toISOString()
    };
  }

  // Quick methods dengan nama Indonesia
  async ambilJudul(url) {
    const result = await this.crawl(url);
    return result.$('title').first().text().trim();
  }

  async ambilMetadata(url) {
    const result = await this.crawl(url);
    return ContentParser.extractMetadata(result.$);
  }

  async ambilLink(url) {
    const result = await this.crawl(url);
    return ContentParser.extractLinks(result.$, url);
  }

  async ambilTeks(url, options = {}) {
    const result = await this.crawl(url);
    return ContentParser.extractText(result.$, options);
  }

  async ambilInsight(url) {
    const result = await this.tusuk(url);
    
    return {
      url: result.url,
      statusCode: result.statusCode,
      waktuMuat: result.timestamp,
      ukuran: result.size,
      judul: result.metadata.title,
      deskripsi: result.metadata.description,
      jumlahKata: result.text.wordCount,
      jumlahLink: result.links.length,
      jumlahGambar: result.images.length,
      adaSchema: result.schema.length > 0,
      mobile: result.metadata.viewport.includes('width=device-width'),
      adaOpenGraph: !!result.metadata.og.title,
      adaTwitterCard: !!result.metadata.twitter.card,
      kualitas: result.quality.overall,
      sentimen: result.sentiment.sentiment,
      poweredBy: this.brand
    };
  }

  // Performance monitoring methods
  getStatistikPerforma() {
    return {
      ...this.performanceMonitor.getStats(),
      poweredBy: this.brand
    };
  }

  resetStatistikPerforma() {
    this.performanceMonitor.reset();
    console.log('🍢 Statistik performa telah direset!');
  }

  // Export methods
  eksporData(format = 'json') {
    const data = {
      contentDatabase: this.contentDatabase,
      performance: this.performanceMonitor.getStats(),
      poweredBy: this.brand,
      timestamp: new Date().toISOString()
    };

    switch (format) {
      case 'csv':
        return this.convertToCSV(data);
      case 'xml':
        return this.convertToXML(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  // Helper methods (same as before but with Indonesian console logs)
  findCommonKeywords(results) {
    const allKeywords = results.flatMap(r => r.keywords || []);
    const frequency = {};
    
    allKeywords.forEach(kw => {
      frequency[kw.word] = (frequency[kw.word] || 0) + kw.count;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }

  analyzeUrlPatterns(results) {
    const urls = results.map(r => r.url);
    return PatternMatcher.categorizeUrls(urls);
  }

  compareSentiment(results) {
    const sentiments = results.map(r => r.sentiment).filter(s => s);
    return {
      average: sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length,
      distribution: {
        positive: sentiments.filter(s => s.sentiment === 'positive').length,
        neutral: sentiments.filter(s => s.sentiment === 'neutral').length,
        negative: sentiments.filter(s => s.sentiment === 'negative').length
      }
    };
  }

  compareReadability(results) {
    const readabilities = results.map(r => r.readability).filter(r => r);
    return {
      averageScore: readabilities.reduce((sum, r) => sum + r.fleschScore, 0) / readabilities.length,
      levels: readabilities.map(r => r.readingLevel),
      averageWordsPerSentence: readabilities.reduce((sum, r) => sum + r.avgWordsPerSentence, 0) / readabilities.length
    };
  }

  // Technology detection methods (same implementation as before)
  detectCMS(html, headers) {
    const patterns = {
      'WordPress': [/wp-content/i, /wp-includes/i, /<meta name="generator" content="WordPress/i],
      'Drupal': [/sites\/default\/files/i, /misc\/drupal/i, /<meta name="generator" content="Drupal/i],
      'Joomla': [/media\/system/i, /templates\/.*\/css/i, /<meta name="generator" content="Joomla/i],
      'Shopify': [/cdn\.shopify\.com/i, /shopify-analytics/i],
      'Magento': [/skin\/frontend/i, /js\/mage/i],
      'Wix': [/static\.wixstatic\.com/i, /wix\.com/i]
    };

    for (const [cms, regexes] of Object.entries(patterns)) {
      if (regexes.some(regex => regex.test(html))) {
        return cms;
      }
    }

    return 'Unknown';
  }

  detectFrameworks(html) {
    const frameworks = [];
    const patterns = {
      'React': [/react/i, /__REACT/i],
      'Vue.js': [/vue\.js/i, /__VUE/i],
      'Angular': [/angular/i, /ng-/i],
      'jQuery': [/jquery/i, /\$\(/i],
      'Bootstrap': [/bootstrap/i, /\.bootstrap/i],
      'Tailwind': [/tailwind/i]
    };

    for (const [framework, regexes] of Object.entries(patterns)) {
      if (regexes.some(regex => regex.test(html))) {
        frameworks.push(framework);
      }
    }

    return frameworks;
  }

  detectAnalytics(html) {
    const analytics = [];
    const patterns = {
      'Google Analytics': [/google-analytics\.com/i, /gtag\(/i, /ga\(/i],
      'Facebook Pixel': [/fbevents\.js/i, /facebook\.net/i],
      'Hotjar': [/hotjar\.com/i],
      'Mixpanel': [/mixpanel/i],
      'Adobe Analytics': [/omniture/i, /adobe\.com.*analytics/i]
    };

    for (const [tool, regexes] of Object.entries(patterns)) {
      if (regexes.some(regex => regex.test(html))) {
        analytics.push(tool);
      }
    }

    return analytics;
  }

  detectEcommerce(html) {
    const platforms = [];
    const patterns = {
      'WooCommerce': [/woocommerce/i, /wc-/i],
      'Shopify': [/shopify/i, /shop\.js/i],
      'Magento': [/magento/i, /mage\//i],
      'PrestaShop': [/prestashop/i],
      'BigCommerce': [/bigcommerce/i]
    };

    for (const [platform, regexes] of Object.entries(patterns)) {
      if (regexes.some(regex => regex.test(html))) {
        platforms.push(platform);
      }
    }

    return platforms;
  }

  detectCDN(headers) {
    const cdnHeaders = {
      'Cloudflare': ['cf-ray', 'cf-cache-status'],
      'Amazon CloudFront': ['x-amz-cf-id'],
      'MaxCDN': ['x-cache'],
      'KeyCDN': ['x-edge-location'],
      'Fastly': ['fastly-debug-digest']
    };

    for (const [cdn, headerKeys] of Object.entries(cdnHeaders)) {
      if (headerKeys.some(key => headers[key])) {
        return cdn;
      }
    }

    return 'None detected';
  }

  detectSecurity(headers) {
    return {
      hsts: !!headers['strict-transport-security'],
      csp: !!headers['content-security-policy'],
      xframe: !!headers['x-frame-options'],
      xss: !!headers['x-xss-protection'],
      contentType: !!headers['x-content-type-options']
    };
  }

  calculatePerformanceScore(result) {
    let score = 100;
    
    if (result.size > 1000000) score -= 30;
    else if (result.size > 500000) score -= 15;
    
    const imageCount = result.images?.length || 0;
    if (imageCount > 50) score -= 20;
    else if (imageCount > 20) score -= 10;
    
    return Math.max(0, score);
  }

  findBestPerformer(comparison) {
    const winners = {};
    
    Object.keys(comparison).forEach(metric => {
      const scores = comparison[metric];
      const bestUrl = Object.keys(scores).reduce((best, url) => 
        scores[url] > scores[best] ? url : best
      );
      winners[metric] = bestUrl;
    });
    
    return winners;
  }

  generateXmlSitemap(sitemap) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<!-- Generated by Sate.js 🍢 -->\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    sitemap.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastModified}</lastmod>\n`;
      xml += `    <changefreq>${entry.changeFreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  }

  estimateChangeFrequency(result) {
    const patterns = {
      'daily': [/news|blog|article/i],
      'weekly': [/product|shop|store/i],
      'monthly': [/about|contact|service/i],
      'yearly': [/privacy|terms|legal/i]
    };

    for (const [freq, regexes] of Object.entries(patterns)) {
      if (regexes.some(regex => regex.test(result.url))) {
        return freq;
      }
    }

    return 'monthly';
  }

  calculatePriority(result, baseUrl) {
    const url = result.url;
    const depth = (url.split('/').length - 3);
    
    if (url === baseUrl) return '1.0';
    if (depth <= 1) return '0.8';
    if (depth <= 2) return '0.6';
    if (depth <= 3) return '0.4';
    return '0.2';
  }

  calculateTechConfidence(technologies) {
    let confidence = 0;
    if (technologies.cms !== 'Unknown') confidence += 20;
    if (technologies.frameworks.length > 0) confidence += 20;
    if (technologies.analytics.length > 0) confidence += 20;
    if (technologies.server !== 'Unknown') confidence += 20;
    if (technologies.cdn !== 'None detected') confidence += 20;
    return confidence;
  }

  getTechRecommendations(technologies) {
    const recommendations = [];
    
    if (technologies.cms === 'Unknown') {
      recommendations.push('Consider using a popular CMS for better maintainability');
    }
    if (technologies.analytics.length === 0) {
      recommendations.push('Add analytics tools to track user behavior');
    }
    if (!technologies.security.hsts) {
      recommendations.push('Enable HSTS for better security');
    }
    if (technologies.cdn === 'None detected') {
      recommendations.push('Consider using a CDN for better performance');
    }
    
    return recommendations;
  }

  getComparisonRecommendations(results) {
    const recommendations = [];
    const avgQuality = results.reduce((sum, r) => sum + (r.quality?.overall || 0), 0) / results.length;
    
    if (avgQuality < 70) {
      recommendations.push('Overall quality needs improvement across all pages');
    }
    
    const lowPerformers = results.filter(r => (r.quality?.overall || 0) < 60);
    if (lowPerformers.length > 0) {
      recommendations.push(`${lowPerformers.length} pages need significant quality improvements`);
    }
    
    return recommendations;
  }

  convertToCSV(data) {
    if (!data.contentDatabase.length) return '';
    
    const headers = Object.keys(data.contentDatabase[0]).join(',');
    const rows = data.contentDatabase.map(item => 
      Object.values(item).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }

  convertToXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<!-- Generated by Sate.js 🍢 -->\n';
    xml += '<sateData>\n';
    
    data.contentDatabase.forEach(item => {
      xml += '  <page>\n';
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${this.escapeXML(String(value))}</${key}>\n`;
      });
      xml += '  </page>\n';
    });
    
    xml += '</sateData>';
    return xml;
  }

  escapeXML(str) {
    return str.replace(/[<>&'"]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return char;
      }
    });
  }
}

module.exports = SateJS;