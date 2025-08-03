class SimilarityAnalyzer {
  static calculateJaccardSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  static calculateCosineSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
    const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];
    
    const allWords = [...new Set([...words1, ...words2])];
    
    const vector1 = allWords.map(word => words1.filter(w => w === word).length);
    const vector2 = allWords.map(word => words2.filter(w => w === word).length);
    
    const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0));
    
    return dotProduct / (magnitude1 * magnitude2) || 0;
  }

  static generateFingerprint(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const shingles = [];
    
    // Generate 3-grams
    for (let i = 0; i < words.length - 2; i++) {
      shingles.push(words.slice(i, i + 3).join(' '));
    }
    
    // Simple hash function
    const hash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    return shingles.map(shingle => hash(shingle));
  }

  static detectDuplicates(contents, threshold = 0.8) {
    const results = [];
    
    for (let i = 0; i < contents.length; i++) {
      for (let j = i + 1; j < contents.length; j++) {
        const similarity = this.calculateCosineSimilarity(contents[i].text, contents[j].text);
        
        if (similarity >= threshold) {
          results.push({
            url1: contents[i].url,
            url2: contents[j].url,
            similarity: similarity.toFixed(3),
            type: similarity > 0.95 ? 'exact' : 'near-duplicate'
          });
        }
      }
    }
    
    return results;
  }
}

module.exports = SimilarityAnalyzer;