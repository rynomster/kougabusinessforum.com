const axios = require('axios');
const fs = require('fs');
const path = require('path');

const RSS_URL = 'https://9ty9.co.za/event/feed/';
const IMAGES_DIR = 'images/events';

async function syncEvents() {
  console.log('Starting RSS sync...');

  // Create images directory
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Load templates
  const templatesDir = path.join(__dirname, '..', 'templates');
  let header = '';
  let footer = '';
  try {
    header = fs.readFileSync(path.join(templatesDir, 'header.html'), 'utf8');
    footer = fs.readFileSync(path.join(templatesDir, 'footer.html'), 'utf8');
  } catch (err) {
    console.warn('Warning: Could not read header/footer templates. Using empty placeholders.', err.message);
  }

  try {
    const response = await axios.get(RSS_URL, {
      headers: { 'User-Agent': 'KBF-Website-Sync/1.0' },
      timeout: 15000
    });

    const xml = response.data;
    const items = [];
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    // Filter out events older than 1 month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    console.log(`Found ${itemMatches.length} items in feed.`);

    for (const itemXml of itemMatches) {
      const title = (itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/))?.[1] || 'Untitled';
      const link = (itemXml.match(/<link>(.*?)<\/link>/))?.[1] || '';
      const guid = (itemXml.match(/<guid>(.*?)<\/guid>/))?.[1] || link;
      const pubDate = (itemXml.match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || '';
      const description = (itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/s) || itemXml.match(/<description>([\s\S]*?)<\/description>/s))?.[1] || '';

      // Improved image extraction regex
      const imgMatch = description.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
      const imageUrl = imgMatch ? imgMatch[1] : null;

      const cleanDesc = description.replace(/<[^>]+>/g, '').trim();
      const date = new Date(pubDate);

      // Skip events older than 1 month
      if (date < oneMonthAgo) {
        continue;
      }

      // Download image locally
      let localImage = null;
      if (imageUrl) {
        const filename = imageUrl.split('/').pop().split('?')[0]; // Remove query params
        const localPath = `${IMAGES_DIR}/${filename}`;

        if (!fs.existsSync(localPath)) {
          try {
            const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 10000 });
            fs.writeFileSync(localPath, Buffer.from(imgResponse.data));
            console.log(`Downloaded: ${filename}`);
            localImage = localPath;
          } catch (err) {
            console.log(`Failed to download: ${imageUrl} - ${err.message}`);
            localImage = imageUrl; // fallback to original
          }
        } else {
          localImage = localPath;
        }
      }

      items.push({
        title: title.trim(),
        link,
        guid,
        pubDate,
        dateStr: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-ZA', { day: '2-digit' }),
        month: date.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase(),
        description: cleanDesc.substring(0, 200),
        image: localImage
      });
    }

    console.log(`✓ Total events kept: ${items.length}`);

    // Save events.json
    fs.writeFileSync('events.json', JSON.stringify({
      lastUpdated: new Date().toISOString(),
      source: RSS_URL,
      count: items.length,
      events: items.slice(0, 50)
    }, null, 2));

    // Generate events.html
    const eventsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Events | Kouga Business Forum</title>
  <meta name="description" content="Discover events in Jeffreys Bay, St Francis Bay & the Kouga Region. Community events, markets, sports, music, and more.">
  <link rel="canonical" href="/events.html">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/events.css">
</head>
<body>
  ${header || '<header></header>'}

  <section class="page-hero">
    <h1>Community Events</h1>
    <p>Discover what's happening in Jeffreys Bay, St Francis Bay & the Kouga Region</p>
  </section>

  <section class="section">
    <div class="container">
      <p class="last-updated">Last updated: ${new Date().toLocaleString('en-ZA')}</p>
      <div class="events-grid">
${items.slice(0, 50).map((event, i) => {
  const imgSrc = event.image ? (event.image.startsWith('http') ? event.image : `${event.image}`) : '';
  const imgAlt = event.title.replace(/"/g, '&quot;');
  return `        <div class="event-card">
          ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}" loading="lazy">` : ''}
          <div class="event-info">
            <span class="event-date-badge">${event.day}<br>${event.month}</span>
            <h3>${event.title}</h3>
            <p>${event.description}...</p>
            <a href="${event.link}" class="btn btn-primary" target="_blank">More Info</a>
          </div>
        </div>`;
}).join('\n')}
      </div>
    </div>
  </section>

  ${footer || '<footer></footer>'}
</body>
</html>`;

    fs.writeFileSync('events.html', eventsHtml);
    console.log(`✓ Generated events.html`);

  } catch (err) {
    console.error('Error during sync:', err.message);
    process.exit(1);
  }
}

syncEvents();
