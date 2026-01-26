
const https = require('https');

const urls = [
  'https://jeenimilletmix.in/',
  'https://jeenimilletmix.in/product-category/jeeni-adult/',
  'https://jeenimilletmix.in/product-category/jeeni-kids/',
  'https://jeenimilletmix.in/product-category/jeeni-slim/',
  'https://jeenimilletmix.in/product-category/cookies/',
  'https://jeenimilletmix.in/product-category/ready-to-cook/'
];

urls.forEach(url => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      // Simple regex to find jpg/png images
      const regex = /src=["'](https?:\/\/[^"']+\.(?:jpg|png|jpeg))["']/gi;
      let match;
      const found = new Set();
      while ((match = regex.exec(data)) !== null) {
        if (match[1].includes('jeenimilletmix.in') && !found.has(match[1])) {
           console.log(`FOUND_IMAGE [${url}]: ${match[1]}`);
           found.add(match[1]);
        }
      }
    });
  }).on('error', (err) => {
    console.error(`Error fetching ${url}: ${err.message}`);
  });
});
