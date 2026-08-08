/**
 * build.js - Static Site Generator for KBF
 * Injects shared header and footer into all HTML files, and standardizes the Google Tag.
 * Usage: node build.js
 */
const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'templates');
const header = fs.readFileSync(path.join(templatesDir, 'header.html'), 'utf8').trim();
const footer = fs.readFileSync(path.join(templatesDir, 'footer.html'), 'utf8').trim();

const googleTag = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FBBQQLDESS"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-FBBQQLDESS');
  </script>`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && !f.includes('shared-'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8').replace(/\n+$/, '');
    
    // Replace existing shared comments and header/footer blocks
    // This removes any existing <!-- shared-header.html --> outside the tag and the header itself.
    content = content.replace(/(?:<!-- shared-header.html -->\s*)*<header[^>]*>([\s\S]*?)<\/header>/gi, header);
    
    // Replace existing shared comments and footer blocks
    content = content.replace(/(?:<!-- shared-footer.html -->\s*)*<footer[^>]*>([\s\S]*?)<\/footer>/gi, footer);
    
    // Ensure the Google Tag is present in <head> and not duplicated
    const googleTagPattern = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config',\s*'G-FBBQQLDESS'\);\s*<\/script>/gi;
    if (googleTagPattern.test(content)) {
        content = content.replace(googleTagPattern, '');
    }

    // Insert the Google Tag right after the <head> tag opening
    content = content.replace(/<head\b([^>]*)>/gi, `<head$1>\n${googleTag}`);

    fs.writeFileSync(path.join(__dirname, file), content);
    console.log(`✓ Processed ${file}`);
});

console.log('Build complete: All headers, footers, and Google tags standardized.');
