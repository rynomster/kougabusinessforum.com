const fs = require('fs');
const path = require('path');

const CSV_FILE = process.env.CSV_FILE || path.join(__dirname, '..', 'directory_raw.csv');
const OUTPUT_FILE = path.join(__dirname, '..', 'directory.json');

/**
 * Parses a CSV string into a 2D array of strings.
 * Properly handles quoted fields, escaped double quotes (""), commas inside quotes,
 * and different line ending styles (\r\n vs \n).
 */
function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next escaped double quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in \r\n
      }
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some(field => field.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(field => field.trim() !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Main conversion function to turn raw CSV into directory.json
 */
function syncDirectory() {
  console.log('Starting directory sync from CSV...');

  if (!fs.existsSync(CSV_FILE)) {
    console.error(`Error: CSV file not found at ${CSV_FILE}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
  const rows = parseCsv(csvContent);

  if (rows.length < 1) {
    console.error('Error: CSV file is empty');
    process.exit(1);
  }

  const rawHeaders = rows[0];
  const headers = rawHeaders.map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      let val = (row[i] || '').trim().replace(/^"|"$/g, '');

      if (val.toUpperCase() === 'TRUE') {
        val = true;
      } else if (val.toUpperCase() === 'FALSE') {
        val = false;
      }

      // Data normalization for filtering compatibility
      if (header === 'category') {
        val = val.toLowerCase();
      } else if (header === 'location') {
        val = val.toLowerCase().replace(/[\s.]+/g, '-').replace(/-+/g, '-');
      }

      obj[header] = val;
    });
    return obj;
  });

  const outputData = { listings: data };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2) + '\n');
  console.log(`✓ Directory sync successful. ${data.length} listings saved to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  syncDirectory();
}

module.exports = { parseCsv, syncDirectory };
