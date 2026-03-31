/**
 * build.js - Static Site Generator for KBF
 * Injects shared header and footer into all HTML files.
 * Usage: node build.js
 */
const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'templates');
const header = fs.readFileSync(path.join(templatesDir, 'header.html'), 'utf8').trim();
const footer = fs.readFileSync(path.join(templatesDir, 'footer.html'), 'utf8').trim();

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && !f.includes('shared-'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8').replace(/\n+$/, '');
    
    // Replace existing shared comments and header/footer blocks
    // This removes any existing <!-- shared-header.html --> outside the tag and the header itself.
    content = content.replace(/(?:<!-- shared-header.html -->\s*)*<header[^>]*>([\s\S]*?)<\/header>/gi, header);
    
    // Replace existing shared comments and footer blocks
    content = content.replace(/(?:<!-- shared-footer.html -->\s*)*<footer[^>]*>([\s\S]*?)<\/footer>/gi, footer);
    
    fs.writeFileSync(path.join(__dirname, file), content);
    console.log(`✓ Processed ${file}`);
});

console.log('Build complete: All headers and footers standardized.');
