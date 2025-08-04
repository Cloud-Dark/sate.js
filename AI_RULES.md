# AI Rules for Sate.js Development

This document outlines the technical stack and specific library usage rules for developing and maintaining Sate.js. Adhering to these guidelines ensures consistency, performance, and maintainability of the codebase.

## 🚀 Tech Stack Overview

*   **Language**: JavaScript (Node.js)
*   **Core HTTP Client**: `axios` for making HTTP requests.
*   **HTML Parsing**: `cheerio` for server-side DOM manipulation and parsing HTML.
*   **URL Parsing**: `url-parse` for robust URL manipulation and validation.
*   **Robots.txt Parsing**: `robots-parser` for respecting website crawl rules.
*   **Character Encoding**: `iconv-lite` for handling various character encodings.
*   **Caching**: `node-cache` for in-memory caching of crawl results and robots.txt files.
*   **Testing**: `jest` for unit and integration testing.
*   **Utility**: `mime-types` for MIME type detection.

## 📚 Library Usage Rules

1.  **HTTP Requests (`axios`)**:
    *   Always use `axios` for all external HTTP requests within the `WebCrawler` class.
    *   Configure `axios` with appropriate timeouts, user agents, and redirect handling as defined in the crawler options.
    *   Handle `responseType: 'arraybuffer'` when dealing with `iconv-lite` for proper encoding detection.

2.  **HTML Parsing (`cheerio`)**:
    *   `cheerio` is the sole library for parsing HTML and traversing the DOM.
    *   All content extraction (metadata, links, images, text, forms, schema) must utilize `cheerio` selectors and methods.
    *   Avoid direct string manipulation for HTML content where `cheerio` can be used.

3.  **URL Handling (`url-parse`)**:
    *   Use `url-parse` for all URL construction, parsing, and validation operations (e.g., resolving relative URLs to absolute, extracting hostnames, query parameters).
    *   The `validateUrl` utility should leverage `url-parse` for robust URL format checking.

4.  **Robots Exclusion Protocol (`robots-parser`)**:
    *   Implement `robots-parser` to check `robots.txt` rules before crawling any URL, respecting the `respectRobots` option.
    *   Cache `robots.txt` content using `node-cache` to minimize redundant requests.

5.  **Character Encoding (`iconv-lite`)**:
    *   `iconv-lite` must be used to decode `axios` response buffers into strings, especially when dealing with non-UTF8 encodings.
    *   Prioritize charset detection from HTTP headers and HTML meta tags.

6.  **Caching (`node-cache`)**:
    *   Utilize `node-cache` for caching crawled page results and `robots.txt` parsed objects to improve performance and reduce redundant network requests.
    *   Ensure cache invalidation or appropriate TTL (Time To Live) is set for cached items.

7.  **Testing (`jest`)**:
    *   All new features and bug fixes must be accompanied by relevant unit and integration tests written with `jest`.
    *   Tests should cover core functionalities, edge cases, and error handling.

8.  **Utility Libraries**:
    *   `mime-types`: Use this for any operations requiring MIME type lookups or validation.
    *   Avoid introducing new utility libraries if the functionality can be achieved with existing ones or simple native JavaScript.

## 🚫 Prohibited Libraries/Practices

*   **Headless Browsers**: Do NOT introduce or use headless browser solutions (e.g., Puppeteer, Playwright) for crawling. Sate.js is designed to be lightweight and fast, operating purely on HTTP requests and HTML parsing.
*   **Manual HTML Parsing**: Avoid parsing HTML using regular expressions or manual string splitting. Always use `cheerio`.
*   **Direct File System Access**: Limit direct file system access to only what is absolutely necessary (e.g., for logging or configuration). Do not use it for caching web content.
*   **Global State**: Minimize the use of global state. Pass necessary configurations and data through function arguments or class constructors.