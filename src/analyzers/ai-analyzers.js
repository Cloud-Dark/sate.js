class AIContentAnalyzer {
  static analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'perfect', 'awesome', 'bagus', 'hebat', 'luar biasa', 'mantap', 'keren'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disgusting', 'pathetic', 'useless', 'disappointing', 'buruk', 'jelek', 'parah', 'mengecewakan'];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const positive = words.filter(word => positiveWords.includes(word)).length;
    const negative = words.filter(word => negativeWords.includes(word)).length;
    
    const score = (positive - negative) / words.length;
    
    return {
      score: Math.max(-1, Math.min(1, score * 10)), // Scale up for better sensitivity
      sentiment: score > 0.01 ? 'positive' : score < -0.01 ? 'negative' : 'neutral',
      positive,
      negative,
      total: words.length
    };
  }

  static extractKeywords(text, limit = 10) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'yang', 'dan', 'atau', 'dengan', 'untuk', 'dari', 'ke', 'di', 'pada', 'oleh', 'sebagai', 'akan', 'adalah', 'ada', 'tidak', 'juga', 'sudah', 'telah']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
    
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }

  static detectLanguage(text) {
    const languages = {
      en: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'],
      id: ['dan', 'yang', 'ini', 'itu', 'dari', 'untuk', 'pada', 'dengan', 'dalam', 'atau', 'akan', 'juga', 'ada', 'adalah', 'oleh', 'telah', 'sudah', 'dapat', 'harus', 'bisa', 'tidak', 'karena', 'saat', 'waktu', 'tahun', 'bulan', 'hari', 'jam', 'menit', 'sebagai', 'seperti', 'sama', 'lain', 'banyak', 'semua'],
      es: ['que', 'de', 'no', 'a', 'la', 'el', 'es', 'y', 'en', 'lo', 'un', 'por', 'qué', 'me', 'una', 'te', 'los', 'se', 'con', 'para', 'mi', 'está', 'si', 'bien', 'pero', 'yo', 'eso', 'las', 'sí', 'su', 'tu', 'aquí']
    };
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const scores = {};
    
    Object.keys(languages).forEach(lang => {
      scores[lang] = words.filter(word => languages[lang].includes(word)).length;
    });
    
    const detected = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const maxScore = Math.max(...Object.values(scores));
    return { 
      language: detected, 
      confidence: maxScore / words.length,
      fullName: detected === 'id' ? 'Indonesian' : detected === 'en' ? 'English' : detected === 'es' ? 'Spanish' : detected
    };
  }

  static analyzeReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.match(/\b\w+\b/g) || [];
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);
    
    if (sentences.length === 0 || words.length === 0) {
      return {
        fleschScore: 0,
        readingLevel: 'No content',
        sentences: 0,
        words: 0,
        avgWordsPerSentence: 0,
        avgSyllablesPerWord: 0
      };
    }
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    let readingLevel;
    if (fleschScore >= 90) readingLevel = 'Very Easy';
    else if (fleschScore >= 80) readingLevel = 'Easy';
    else if (fleschScore >= 70) readingLevel = 'Fairly Easy';
    else if (fleschScore >= 60) readingLevel = 'Standard';
    else if (fleschScore >= 50) readingLevel = 'Fairly Difficult';
    else if (fleschScore >= 30) readingLevel = 'Difficult';
    else readingLevel = 'Very Difficult';
    
    return {
      fleschScore: Math.max(0, Math.round(fleschScore)),
      readingLevel,
      sentences: sentences.length,
      words: words.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10
    };
  }

  static countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
}

module.exports = AIContentAnalyzer;