class QualityScorer {
  static scoreContent(data) {
    const scores = {
      seo: this.scoreSEO(data),
      accessibility: this.scoreAccessibility(data),
      performance: this.scorePerformance(data),
      content: this.scoreContentQuality(data),
      technical: this.scoreTechnical(data)
    };
    
    const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
    
    return {
      overall: Math.round(overall),
      breakdown: scores,
      grade: this.getGrade(overall),
      recommendations: this.getRecommendations(scores)
    };
  }

  static scoreSEO(data) {
    let score = 0;
    const checks = {
      hasTitle: data.metadata.title ? 20 : 0,
      titleLength: data.metadata.title && data.metadata.title.length >= 30 && data.metadata.title.length <= 60 ? 15 : 0,
      hasDescription: data.metadata.description ? 15 : 0,
      descriptionLength: data.metadata.description && data.metadata.description.length >= 120 && data.metadata.description.length <= 160 ? 10 : 0,
      hasH1: data.text.headings.some(h => h.level === 'h1') ? 10 : 0,
      hasCanonical: data.metadata.canonical ? 10 : 0,
      hasOpenGraph: data.metadata.og.title ? 10 : 0,
      hasStructuredData: data.schema.length > 0 ? 10 : 0
    };
    
    return Object.values(checks).reduce((sum, val) => sum + val, 0);
  }

  static scoreAccessibility(data) {
    let score = 0;
    const checks = {
      hasLang: data.metadata.language ? 25 : 0,
      imagesWithAlt: data.images.filter(img => img.alt).length / Math.max(data.images.length, 1) * 25,
      hasHeadingStructure: data.text.headings.length > 0 ? 25 : 0,
      formLabels: data.forms.every(form => 
        form.fields.every(field => field.name || field.placeholder)
      ) ? 25 : 0
    };
    
    return Object.values(checks).reduce((sum, val) => sum + val, 0);
  }

  static scorePerformance(data) {
    let score = 100;
    
    // Penalize large page size
    if (data.size > 1000000) score -= 20; // > 1MB
    else if (data.size > 500000) score -= 10; // > 500KB
    
    // Penalize too many images without optimization info
    if (data.images.length > 20) score -= 15;
    
    // Check for common performance issues
    if (data.html.includes('document.write')) score -= 10;
    if ((data.html.match(/<script/g) || []).length > 10) score -= 10;
    
    return Math.max(0, score);
  }

  static scoreContentQuality(data) {
    const readability = require('./ai-analyzer').analyzeReadability(data.text.fullText);
    let score = 0;
    
    // Word count
    if (data.text.wordCount >= 300) score += 25;
    else if (data.text.wordCount >= 150) score += 15;
    
    // Readability
    if (readability.fleschScore >= 60) score += 25;
    else if (readability.fleschScore >= 30) score += 15;
    
    // Content structure
    if (data.text.headings.length >= 3) score += 25;
    if (data.text.paragraphs.length >= 3) score += 25;
    
    return score;
  }

  static scoreTechnical(data) {
    let score = 0;
    const checks = {
      validStatus: data.statusCode >= 200 && data.statusCode < 300 ? 20 : 0,
      hasViewport: data.metadata.viewport ? 20 : 0,
      hasCharset: data.encoding ? 20 : 0,
      httpsSecure: data.url.startsWith('https://') ? 20 : 0,
      noMixedContent: !data.html.includes('http://') || data.url.startsWith('http://') ? 20 : 0
    };
    
    return Object.values(checks).reduce((sum, val) => sum + val, 0);
  }

  static getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  static getRecommendations(scores) {
    const recommendations = [];
    
    if (scores.seo < 70) {
      recommendations.push('Improve SEO by adding proper title, meta description, and structured data');
    }
    if (scores.accessibility < 70) {
      recommendations.push('Enhance accessibility with alt texts, proper headings, and language attributes');
    }
    if (scores.performance < 70) {
      recommendations.push('Optimize page performance by reducing file sizes and script count');
    }
    if (scores.content < 70) {
      recommendations.push('Improve content quality with better structure and readability');
    }
    if (scores.technical < 70) {
      recommendations.push('Fix technical issues like HTTPS, viewport, and status codes');
    }
    
    return recommendations;
  }
}

module.exports = QualityScorer;