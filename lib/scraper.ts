import * as cheerio from 'cheerio';

export async function scrapeSite(url: string): Promise<string> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported');
  }

  // Fetch main page with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let html: string;
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    html = await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Website took too long to respond');
    }
    throw new Error('Failed to access the website');
  } finally {
    clearTimeout(timeout);
  }

  const $ = cheerio.load(html);

  // Remove noise elements
  $('script, style, nav, footer, iframe, noscript, header, .cookie-banner, .popup').remove();

  // Extract structured data
  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const headings = $('h1, h2')
    .map((_, el) => $(el).text().trim())
    .get()
    .join('. ');
  const bodyText = $('main, article, [role="main"], .content, #content, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  // Attempt to fetch /about page
  let aboutText = '';
  try {
    const aboutUrl = new URL('/about', url).href;
    const aboutController = new AbortController();
    const aboutTimeout = setTimeout(() => aboutController.abort(), 5000);
    const aboutResponse = await fetch(aboutUrl, {
      signal: aboutController.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(aboutTimeout);
    const aboutHtml = await aboutResponse.text();
    const $about = cheerio.load(aboutHtml);
    $about('script, style, nav, footer').remove();
    aboutText = $about('main, article, body')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000);
  } catch {
    // Silently ignore - about page is optional
  }

  return `Website: ${url}
Title: ${title}
Description: ${metaDesc}
Headlines: ${headings}
Main Content: ${bodyText}
About Page: ${aboutText}`.trim();
}
