class PatternMatcher {
  static matchPatterns(urls, patterns) {
    const results = {};
    
    patterns.forEach(pattern => {
      const regex = this.patternToRegex(pattern);
      results[pattern] = urls.filter(url => regex.test(url));
    });
    
    return results;
  }

  static patternToRegex(pattern) {
    // Convert glob-like patterns to regex
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special chars
      .replace(/\*/g, '.*') // * matches anything
      .replace(/\?/g, '.'); // ? matches single char
    
    return new RegExp(`^${escaped}$`, 'i');
  }

  static categorizeUrls(urls) {
    const categories = {
      images: /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i,
      documents: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i,
      videos: /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i,
      audio: /\.(mp3|wav|flac|aac|ogg|wma)$/i,
      archives: /\.(zip|rar|tar|gz|7z|bz2)$/i,
      social: /\b(facebook|twitter|instagram|linkedin|youtube|tiktok|pinterest)\./i,
      ecommerce: /\b(shop|store|buy|cart|checkout|product)\b/i,
      blog: /\b(blog|post|article|news)\b/i
    };
    
    const results = {};
    Object.keys(categories).forEach(category => {
      results[category] = urls.filter(url => categories[category].test(url));
    });
    
    results.uncategorized = urls.filter(url => 
      !Object.values(categories).some(regex => regex.test(url))
    );
    
    return results;
  }

  static extractUrlParameters(url) {
    try {
      const urlObj = new URL(url);
      const params = {};
      
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      return {
        base: `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`,
        parameters: params,
        fragment: urlObj.hash,
        query: urlObj.search
      };
    } catch (e) {
      return null;
    }
  }
}

module.exports = PatternMatcher;