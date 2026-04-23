/**
 * Robust validation script for Cloudflare Worker deployment.
 * Checks for 31-character truncation errors in environment variables and wrangler.toml.
 */

const fs = require('fs');
const path = require('path');

const accountIdEnv = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.WRANGLER_ACCOUNT_ID;
let accountIdToml = null;

console.log('🔍 Validating Cloudflare configuration...');

// Try to read from wrangler.toml
try {
  const tomlPath = path.join(__dirname, 'wrangler.toml');
  if (fs.existsSync(tomlPath)) {
    const tomlContent = fs.readFileSync(tomlPath, 'utf8');
    const match = tomlContent.match(/^account_id\s*=\s*["']([^"']+)["']/m);
    if (match) {
      accountIdToml = match[1];
      console.log('Found account_id in wrangler.toml');
    }
  }
} catch (err) {
  console.warn('⚠️ Warning: Could not read wrangler.toml for validation.');
}

const idToValidate = accountIdEnv || accountIdToml;

if (!idToValidate) {
  console.log('ℹ️ No Account ID found in environment or wrangler.toml. Assuming authentication via wrangler login.');
  process.exit(0);
}

function validateId(id, source) {
  // Cloudflare Account IDs are 32-character hexadecimal strings.
  if (id.length !== 32) {
    console.error(`❌ Error: Cloudflare Account ID from ${source} is invalid.`);
    console.error(`   Found ${id.length} characters: "${id}"`);
    if (id.length === 31) {
      console.error(`   👉 This is a 31-character ID. It was likely truncated during copy-paste (missing the first or last character).`);
    }
    console.error(`   Cloudflare Account IDs must be exactly 32-character hexadecimal strings.`);
    return false;
  }

  if (!/^[a-f0-9]{32}$/i.test(id)) {
    console.error(`❌ Error: Cloudflare Account ID from ${source} is not a valid hexadecimal string.`);
    return false;
  }

  return true;
}

let valid = true;
if (accountIdEnv && !validateId(accountIdEnv, 'environment variable')) {
  valid = false;
}
if (accountIdToml && !validateId(accountIdToml, 'wrangler.toml')) {
  valid = false;
}

if (!valid) {
  process.exit(1);
}

console.log('✅ Account ID format is valid.');
