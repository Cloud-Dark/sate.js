class ContentParser {
  static extractMetadata($) {
    const metadata = {
      title: $('title').first().text().trim(),
      description: $('meta[name="description"], meta[property="og:description"]').first().attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
      robots: $('meta[name="robots"]').attr('content') || '',
      viewport: $('meta[name="viewport"]').attr('content') || '',
      language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || ''
    };

    // Open Graph
    metadata.og = {
      title: $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[property="og:description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      url: $('meta[property="og:url"]').attr('content') || '',
      type: $('meta[property="og:type"]').attr('content') || '',
      siteName: $('meta[property="og:site_name"]').attr('content') || ''
    };

    // Twitter Cards
    metadata.twitter = {
      card: $('meta[name="twitter:card"]').attr('content') || '',
      site: $('meta[name="twitter:site"]').attr('content') || '',
      creator: $('meta[name="twitter:creator"]').attr('content') || '',
      title: $('meta[name="twitter:title"]').attr('content') || '',
      description: $('meta[name="twitter:description"]').attr('content') || '',
      image: $('meta[name="twitter:image"]').attr('content') || ''
    };

    return metadata;
  }

  static extractLinks($, baseUrl) {
    const links = [];
    const URL = require('url-parse');
    const base = new URL(baseUrl);

    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      const title = $(elem).attr('title') || '';
      
      try {
        const absoluteUrl = new URL(href, base).toString();
        links.push({
          url: absoluteUrl,
          text,
          title,
          rel: $(elem).attr('rel') || '',
          target: $(elem).attr('target') || ''
        });
      } catch (e) {
        // Skip invalid URLs
      }
    });

    return links;
  }

  static extractImages($, baseUrl) {
    const images = [];
    const URL = require('url-parse');
    const base = new URL(baseUrl);

    $('img[src]').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      const title = $(elem).attr('title') || '';
      
      try {
        const absoluteUrl = new URL(src, base).toString();
        images.push({
          url: absoluteUrl,
          alt,
          title,
          width: $(elem).attr('width') || '',
          height: $(elem).attr('height') || ''
        });
      } catch (e) {
        // Skip invalid URLs
      }
    });

    return images;
  }

  static extractText($, options = {}) {
    const excludeSelectors = options.exclude || ['script', 'style', 'nav', 'footer', 'header'];
    
    // Remove unwanted elements
    excludeSelectors.forEach(selector => {
      $(selector).remove();
    });

    const textContent = $('body').text()
      .replace(/\s+/g, ' ')
      .trim();

    // Extract headings
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
      headings.push({
        level: elem.tagName.toLowerCase(),
        text: $(elem).text().trim()
      });
    });

    return {
      fullText: textContent,
      headings,
      wordCount: textContent.split(/\s+/).length,
      paragraphs: $('p').map((i, elem) => $(elem).text().trim()).get().filter(p => p.length > 0)
    };
  }

  static extractSchema($) {
    const schemas = [];
    
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonData = JSON.parse($(elem).html());
        schemas.push(jsonData);
      } catch (e) {
        // Skip invalid JSON-LD
      }
    });

    return schemas;
  }

  static extractForms($) {
    const forms = [];
    
    $('form').each((i, elem) => {
      const form = {
        action: $(elem).attr('action') || '',
        method: $(elem).attr('method') || 'GET',
        enctype: $(elem).attr('enctype') || '',
        fields: []
      };

      $(elem).find('input, textarea, select').each((j, field) => {
        const $field = $(field);
        form.fields.push({
          name: $field.attr('name') || '',
          type: $field.attr('type') || field.tagName.toLowerCase(),
          value: $field.attr('value') || '',
          placeholder: $field.attr('placeholder') || '',
          required: $field.attr('required') !== undefined
        });
      });

      forms.push(form);
    });

    return forms;
  }
}

module.exports = ContentParser;