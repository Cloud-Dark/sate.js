const SateJS = require('../src/index');
const { validateUrl } = require('../src/core/validator');

describe('🍢 Sate.js Basic Tests', () => {
  let sate;

  beforeAll(() => {
    sate = new SateJS({
      userAgent: 'Sate.js Test Bot 🍢',
      timeout: 30000,
      cache: true,
      delay: 500,
      respectRobots: false // Disable for testing
    });
  });

  afterAll(() => {
    // Clean up any resources if needed
    if (sate && typeof sate.close === 'function') {
      sate.close();
    }
  });

  describe('🔧 Initialization Tests', () => {
    test('should initialize with default options', () => {
      const defaultSate = new SateJS();
      expect(defaultSate).toBeDefined();
      expect(defaultSate.options).toBeDefined();
    });

    test('should initialize with custom options', () => {
      const customSate = new SateJS({
        timeout: 15000,
        userAgent: 'Custom Bot',
        cache: false
      });
      
      expect(customSate.options.timeout).toBe(15000);
      expect(customSate.options.userAgent).toBe('Custom Bot');
      expect(customSate.options.cache).toBe(false);
    });
  });

  describe('🌐 URL Validation Tests', () => {
    test('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://sub.example.com/path')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl(null)).toBe(false);
    });
  });

  describe('🍢 Basic Tusuk (Skewer) Tests', () => {
    test('should tusuk basic website data', async () => {
      const result = await sate.tusuk('https://httpbin.org/html');
      
      expect(result).toBeDefined();
      expect(result.url).toBe('https://httpbin.org/html');
      expect(result.statusCode).toBe(200);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.title).toBeDefined();
      expect(result.html).toBeDefined();
      expect(result.timestamp).toBeDefined();
    }, 30000);

    test('should handle invalid URLs gracefully', async () => {
      await expect(sate.tusuk('not-a-valid-url')).rejects.toThrow();
    });

    test('should handle 404 errors gracefully', async () => {
      const result = await sate.tusuk('https://httpbin.org/status/404');
      expect(result.statusCode).toBe(404);
    }, 30000);

    test('should include quality analysis', async () => {
      const result = await sate.tusuk('https://httpbin.org/html');
      
      expect(result.quality).toBeDefined();
      expect(result.quality.overall).toBeGreaterThanOrEqual(0);
      expect(result.quality.overall).toBeLessThanOrEqual(100);
      expect(result.quality.content).toBeDefined();
      expect(result.quality.technical).toBeDefined();
    }, 30000);
  });

  describe('📊 AI Analysis Tests', () => {
    test('should analyze sentiment', async () => {
      const result = await sate.tusuk('https://httpbin.org/html');
      
      expect(result.sentiment).toBeDefined();
      expect(result.sentiment.sentiment).toMatch(/positive|negative|neutral/);
      expect(result.sentiment.score).toBeGreaterThanOrEqual(-1);
      expect(result.sentiment.score).toBeLessThanOrEqual(1);
    }, 30000);

    test('should extract keywords', async () => {
      const result = await sate.tusuk('https://httpbin.org/html');
      
      expect(result.keywords).toBeDefined();
      expect(Array.isArray(result.keywords)).toBe(true);
      if (result.keywords.length > 0) {
        expect(result.keywords[0]).toHaveProperty('word');
        expect(result.keywords[0]).toHaveProperty('count');
      }
    }, 30000);

    test('should detect language', async () => {
      const result = await sate.tusuk('https://httpbin.org/html');
      
      expect(result.language).toBeDefined();
      expect(result.language.language).toBeDefined();
      expect(result.language.confidence).toBeGreaterThanOrEqual(0);
      expect(result.language.fullName).toBeDefined();
    }, 30000);

    test('should analyze readability', async () => {
      const result = await sate.tusuk('https://httpbin.org/html');
      
      expect(result.readability).toBeDefined();
      expect(result.readability.fleschScore).toBeGreaterThanOrEqual(0);
      expect(result.readability.readingLevel).toBeDefined();
      expect(result.readability.words).toBeGreaterThan(0);
    }, 30000);
  });

  describe('🔍 Quick Methods Tests', () => {
    test('should ambil judul (get title)', async () => {
      const title = await sate.ambilJudul('https://httpbin.org/html');
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    }, 30000);

    test('should ambil metadata', async () => {
      const metadata = await sate.ambilMetadata('https://httpbin.org/html');
      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
    }, 30000);

    test('should ambil links', async () => {
      const links = await sate.ambilLink('https://httpbin.org/html');
      expect(Array.isArray(links)).toBe(true);
    }, 30000);

    test('should ambil insight', async () => {
      const insight = await sate.ambilInsight('https://httpbin.org/html');
      expect(insight).toBeDefined();
      expect(insight.kualitas).toBeGreaterThanOrEqual(0);
      expect(insight.kualitas).toBeLessThanOrEqual(100);
      expect(insight.jumlahKata).toBeGreaterThan(0);
      expect(typeof insight.mobile).toBe('boolean');
      expect(insight.sentimen).toMatch(/positive|negative|neutral/);
    }, 30000);
  });

  describe('🏗️ Technology Detection Tests', () => {
    test('should detect website technology', async () => {
      const tech = await sate.deteksiTeknologi('https://httpbin.org/html');
      
      expect(tech).toBeDefined();
      expect(tech.teknologi).toBeDefined();
      expect(tech.teknologi.cms).toBeDefined();
      expect(Array.isArray(tech.teknologi.frameworks)).toBe(true);
      expect(Array.isArray(tech.teknologi.analytics)).toBe(true);
      expect(tech.confidence).toBeGreaterThanOrEqual(0);
      expect(tech.confidence).toBeLessThanOrEqual(100);
    }, 30000);
  });

  describe('📈 Performance Statistics Tests', () => {
    test('should track performance statistics', async () => {
      // Make a few requests to generate stats
      await sate.tusuk('https://httpbin.org/html');
      await sate.ambilJudul('https://httpbin.org/html');
      
      const stats = sate.getStatistikPerforma();
      
      expect(stats).toBeDefined();
      expect(stats.requests).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThanOrEqual(0);
      expect(stats.successRate).toBeLessThanOrEqual(100);
      expect(stats.avgResponseTime).toBeGreaterThan(0);
    }, 30000);
  });

  describe('🔗 Mass Processing Tests', () => {
    test('should process multiple URLs', async () => {
      const urls = [
        'https://httpbin.org/html',
        'https://httpbin.org/json'
      ];
      
      const results = await sate.tusukMassal(urls, {
        concurrent: 2,
        delay: 1000
      });
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(urls.length);
      
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.url || result.error).toBeDefined();
      });
    }, 60000);

    test('should handle mixed success/failure in mass processing', async () => {
      const urls = [
        'https://httpbin.org/html',
        'https://invalid-url-that-does-not-exist.com',
        'https://httpbin.org/json'
      ];
      
      const results = await sate.tusukMassal(urls, { concurrent: 1 });
      
      expect(results.length).toBe(3);
      expect(results.some(r => r.error)).toBe(true);
      expect(results.some(r => !r.error)).toBe(true);
    }, 60000);
  });

  describe('🕷️ Site Discovery Tests', () => {
    test('should discover site structure', async () => {
      const discovery = await sate.jelajahiSitus('https://httpbin.org', {
        maxDepth: 1,
        maxUrls: 5
      });
      
      expect(discovery).toBeDefined();
      expect(discovery.statistik).toBeDefined();
      expect(discovery.statistik.totalUrl).toBeGreaterThanOrEqual(0);
      expect(discovery.statistik.urlTertusuk).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(discovery.ditemukan)).toBe(true);
    }, 60000);
  });

  describe('🆚 Competitor Analysis Tests', () => {
    test('should analyze competitors', async () => {
      const competitors = await sate.analisisWarung([
        'https://httpbin.org/html',
        'https://httpbin.org/json'
      ]);
      
      expect(competitors).toBeDefined();
      expect(competitors.analisis).toBeDefined();
      expect(competitors.analisis.kualitasRataRata).toBeGreaterThanOrEqual(0);
      expect(competitors.analisis.kualitasRataRata).toBeLessThanOrEqual(100);
      expect(Array.isArray(competitors.katakunciPopuler)).toBe(true);
      expect(Array.isArray(competitors.hasil)).toBe(true);
    }, 60000);
  });

  describe('💾 Caching Tests', () => {
    test('should cache results when enabled', async () => {
      const url = 'https://httpbin.org/html';
      
      // First request
      const start1 = Date.now();
      const result1 = await sate.tusuk(url);
      const time1 = Date.now() - start1;
      
      // Second request (should be faster due to cache)
      const start2 = Date.now();
      const result2 = await sate.tusuk(url);
      const time2 = Date.now() - start2;
      
      expect(result1.url).toBe(result2.url);
      expect(result1.statusCode).toBe(result2.statusCode);
      
      // Cache should make second request faster (with some tolerance)
      if (time1 > 1000) { // Only check if first request was slow enough
        expect(time2).toBeLessThan(time1 * 0.5);
      }
    }, 60000);
  });

  describe('🚨 Error Handling Tests', () => {
    test('should handle network timeouts', async () => {
      const shortTimeoutSate = new SateJS({
        timeout: 1, // Very short timeout
        respectRobots: false
      });
      
      await expect(
        shortTimeoutSate.tusuk('https://httpbin.org/delay/5')
      ).rejects.toThrow();
    }, 10000);

    test('should handle malformed URLs', async () => {
      await expect(sate.tusuk('not-a-url')).rejects.toThrow();
      await expect(sate.tusuk('')).rejects.toThrow();
      await expect(sate.tusuk(null)).rejects.toThrow();
    });
  });
});