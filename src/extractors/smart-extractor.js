class SmartContentExtractor {
  static extractContactInfo($, url) {
    const contacts = {
      emails: [],
      phones: [],
      addresses: [],
      socialMedia: {}
    };
    
    // Extract emails
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const bodyText = $('body').text();
    const emailMatches = bodyText.match(emailRegex) || [];
    contacts.emails = [...new Set(emailMatches)];
    
    // Extract phone numbers
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const phoneMatches = bodyText.match(phoneRegex) || [];
    contacts.phones = [...new Set(phoneMatches.filter(phone => phone.replace(/\D/g, '').length >= 7))];
    
    // Extract social media
    const socialLinks = {
      facebook: $('a[href*="facebook.com"]').attr('href'),
      twitter: $('a[href*="twitter.com"], a[href*="x.com"]').attr('href'),
      instagram: $('a[href*="instagram.com"]').attr('href'),
      linkedin: $('a[href*="linkedin.com"]').attr('href'),
      youtube: $('a[href*="youtube.com"]').attr('href'),
      tiktok: $('a[href*="tiktok.com"]').attr('href')
    };
    
    Object.keys(socialLinks).forEach(platform => {
      if (socialLinks[platform]) {
        contacts.socialMedia[platform] = socialLinks[platform];
      }
    });
    
    return contacts;
  }

  static extractPrices($) {
    const prices = [];
    const priceRegex = /\$\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:USD|EUR|GBP|IDR)/gi;
    
    $('*').each((i, element) => {
      const text = $(element).text();
      const matches = text.match(priceRegex);
      if (matches) {
        matches.forEach(price => {
          prices.push({
            price: price.trim(),
            context: text.trim().substring(0, 100),
            element: element.tagName
          });
        });
      }
    });
    
    return [...new Set(prices.map(p => JSON.stringify(p)))].map(p => JSON.parse(p));
  }

  static extractDates($) {
    const dates = [];
    const dateRegex = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b/g;
    
    $('time, .date, .published, [datetime]').each((i, element) => {
      const $elem = $(element);
      const datetime = $elem.attr('datetime') || $elem.text();
      if (datetime) {
        dates.push({
          date: datetime,
          type: 'structured',
          element: element.tagName
        });
      }
    });
    
    const bodyText = $('body').text();
    const dateMatches = bodyText.match(dateRegex) || [];
    dateMatches.forEach(date => {
      dates.push({
        date: date,
        type: 'extracted',
        element: 'text'
      });
    });
    
    return dates;
  }

  static extractBreadcrumbs($) {
    const breadcrumbs = [];
    
    // Common breadcrumb selectors
    const selectors = [
      '.breadcrumb, .breadcrumbs',
      '[class*="breadcrumb"]',
      'nav ol, nav ul',
      '.navigation ol, .navigation ul'
    ];
    
    selectors.forEach(selector => {
      $(selector).each((i, element) => {
        const $elem = $(element);
        const items = [];
        
        $elem.find('a, span, li').each((j, item) => {
          const $item = $(item);
          const text = $item.text().trim();
          const href = $item.attr('href');
          
          if (text && text !== '>' && text !== '»') {
            items.push({
              text,
              url: href || null
            });
          }
        });
        
        if (items.length > 1) {
          breadcrumbs.push(items);
        }
      });
    });
    
    return breadcrumbs;
  }

  static extractReviews($) {
    const reviews = [];
    
    // Look for review containers
    $('[class*="review"], [class*="rating"], [class*="testimonial"]').each((i, element) => {
      const $elem = $(element);
      const text = $elem.text().trim();
      
      if (text.length > 20) {
        const rating = this.extractRating($elem);
        const author = this.extractAuthor($elem);
        const date = this.extractDate($elem);
        
        reviews.push({
          text: text.substring(0, 500),
          rating,
          author,
          date,
          element: element.tagName
        });
      }
    });
    
    return reviews;
  }

  static extractRating($elem) {
    // Look for star ratings, numbers, etc.
    const ratingText = $elem.find('[class*="star"], [class*="rating"]').text();
    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
    return ratingMatch ? parseFloat(ratingMatch[1]) : null;
  }

  static extractAuthor($elem) {
    const authorSelectors = ['.author', '.name', '.user', '.reviewer'];
    for (const selector of authorSelectors) {
      const author = $elem.find(selector).first().text().trim();
      if (author) return author;
    }
    return null;
  }

  static extractDate($elem) {
    const dateSelectors = ['time', '.date', '.published', '[datetime]'];
    for (const selector of dateSelectors) {
      const date = $elem.find(selector).first().attr('datetime') || $elem.find(selector).first().text();
      if (date) return date;
    }
    return null;
  }
}

module.exports = SmartContentExtractor;