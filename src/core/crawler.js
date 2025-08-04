const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const robotsParser = require('robots-parser');
const URL = require('url-parse');
const { generateHeaders } = require('../utils/headers');
const { validateUrl } = require('./validator');
const NodeCache = require('node-cache');

class WebCrawler {
 constructor(options = {}) {
   this.options = {
     timeout: options.timeout || 30000,
     maxRedirects: options.maxRedirects || 5,
     userAgent: options.userAgent || 'Sate.js/1.0 🍢',
     respectRobots: options.respectRobots !== false,
     delay: options.delay || 0,
     retries: options.retries || 3,
     encoding: options.encoding || 'utf8',
     followRedirects: options.followRedirects !== false,
     cache: options.cache || false,
     ...options
   };
   
   this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
   this.robotsCache = new Map();
 }

 async crawl(url, options = {}) {
   const config = { ...this.options, ...options };
   
   try {
     // Validate URL
     if (!validateUrl(url)) {
       throw new Error('Invalid URL provided');
     }

     // Check cache
     if (config.cache) {
       const cached = this.cache.get(url);
       if (cached) return cached;
     }

     // Check robots.txt
     if (config.respectRobots && !(await this.isAllowedByRobots(url, config.userAgent))) {
       throw new Error('Blocked by robots.txt');
     }

     // Add delay
     if (config.delay > 0) {
       await this.sleep(config.delay);
     }

     const response = await this.makeRequest(url, config);
     const result = await this.processResponse(response, url, config);

     // Cache result
     if (config.cache) {
       this.cache.set(url, result);
     }

     return result;
   } catch (error) {
     throw new Error(`Crawling failed for ${url}: ${error.message}`);
   }
 }

 async makeRequest(url, config, attempt = 1) {
   try {
     const headers = generateHeaders(config.userAgent, url);
     
     const axiosConfig = {
       url,
       method: 'GET',
       timeout: config.timeout,
       maxRedirects: config.maxRedirects,
       headers,
       responseType: 'arraybuffer',
       validateStatus: (status) => status < 500
     };

     if (config.proxy) {
       axiosConfig.proxy = config.proxy;
     }

     const response = await axios(axiosConfig);
     return response;
   } catch (error) {
     if (attempt < config.retries) {
       await this.sleep(1000 * attempt); // Exponential backoff
       return this.makeRequest(url, config, attempt + 1);
     }
     throw error;
   }
 }

  async checkLinkStatus(url, config) {
    try {
      const headers = generateHeaders(config.userAgent, url);
      const axiosConfig = {
        url,
        method: 'HEAD', // Use HEAD request for efficiency
        timeout: config.timeout,
        maxRedirects: config.maxRedirects,
        headers,
        validateStatus: (status) => status >= 200 && status < 500 // Accept 2xx, 3xx, 4xx
      };

      if (config.proxy) {
        axiosConfig.proxy = config.proxy;
      }

      const response = await axios(axiosConfig);
      return {
        url,
        statusCode: response.status,
        statusText: response.statusText,
        contentType: response.headers['content-type'] || '',
        size: response.headers['content-length'] ? parseInt(response.headers['content-length'], 10) : 0
      };
    } catch (error) {
      // If request fails (e.g., network error, DNS error), treat as broken
      return {
        url,
        statusCode: error.response ? error.response.status : 0, // 0 for network errors
        statusText: error.message,
        error: true
      };
    }
  }

 async processResponse(response, url, config) {
   const contentType = response.headers['content-type'] || '';
   const statusCode = response.status;
   
   // Detect encoding
   let encoding = config.encoding;
   const charset = this.detectCharset(response.headers, response.data);
   if (charset) encoding = charset;

   // Convert buffer to string
   let html = '';
   try {
     html = iconv.decode(response.data, encoding);
   } catch (e) {
     html = response.data.toString('utf8');
   }

   // Parse with Cheerio
   const $ = cheerio.load(html);

   return {
     url,
     statusCode,
     headers: response.headers,
     contentType,
     encoding,
     html,
     $,
     size: response.data.length,
     timestamp: new Date().toISOString()
   };
 }

 detectCharset(headers, data) {
   // From Content-Type header
   const contentType = headers['content-type'];
   if (contentType) {
     const match = contentType.match(/charset=([^;]+)/i);
     if (match) return match[1].trim();
   }

   // From HTML meta tag
   const htmlStart = data.toString('ascii', 0, 1024);
   const metaMatch = htmlStart.match(/<meta[^>]+charset=["']?([^"'>\s]+)/i);
   if (metaMatch) return metaMatch[1];

   return null;
 }

 async isAllowedByRobots(url, userAgent) {
   try {
     const parsedUrl = new URL(url);
     const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
     
     if (this.robotsCache.has(robotsUrl)) {
       const robots = this.robotsCache.get(robotsUrl);
       return robots.isAllowed(url, userAgent);
     }

     const response = await axios.get(robotsUrl, { timeout: 5000 });
     const robots = robotsParser(robotsUrl, response.data);
     this.robotsCache.set(robotsUrl, robots);
     
     return robots.isAllowed(url, userAgent);
   } catch (error) {
     return true; // Allow if robots.txt is not accessible
   }
 }

 sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }
}

module.exports = WebCrawler;