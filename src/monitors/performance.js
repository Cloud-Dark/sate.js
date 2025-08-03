class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      failures: 0,
      totalTime: 0,
      avgResponseTime: 0,
      slowestRequest: null,
      fastestRequest: null,
      statusCodes: {},
      domains: {},
      startTime: Date.now()
    };
  }

  startRequest(url) {
    return {
      url,
      startTime: process.hrtime.bigint()
    };
  }

  endRequest(requestInfo, response, error = null) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - requestInfo.startTime) / 1000000; // Convert to milliseconds
    
    this.metrics.requests++;
    this.metrics.totalTime += duration;
    this.metrics.avgResponseTime = this.metrics.totalTime / this.metrics.requests;
    
    if (error) {
      this.metrics.failures++;
    } else {
      const statusCode = response.statusCode;
      this.metrics.statusCodes[statusCode] = (this.metrics.statusCodes[statusCode] || 0) + 1;
      
      const domain = new URL(requestInfo.url).hostname;
      this.metrics.domains[domain] = (this.metrics.domains[domain] || 0) + 1;
    }
    
    // Track fastest/slowest
    if (!this.metrics.fastestRequest || duration < this.metrics.fastestRequest.duration) {
      this.metrics.fastestRequest = { url: requestInfo.url, duration };
    }
    
    if (!this.metrics.slowestRequest || duration > this.metrics.slowestRequest.duration) {
      this.metrics.slowestRequest = { url: requestInfo.url, duration };
    }
  }

  getStats() {
    const uptime = Date.now() - this.metrics.startTime;
    return {
      ...this.metrics,
      uptime,
      successRate: ((this.metrics.requests - this.metrics.failures) / this.metrics.requests * 100).toFixed(2),
      requestsPerSecond: (this.metrics.requests / (uptime / 1000)).toFixed(2)
    };
  }

  reset() {
    this.metrics = {
      requests: 0,
      failures: 0,
      totalTime: 0,
      avgResponseTime: 0,
      slowestRequest: null,
      fastestRequest: null,
      statusCodes: {},
      domains: {},
      startTime: Date.now()
    };
  }
}

module.exports = PerformanceMonitor;