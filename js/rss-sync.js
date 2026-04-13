const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RSS_URL = 'https://9ty9.co.za/event/feed';
const IMAGES_DIR = 'images/events';

// Prune events that ended more than this many days ago
const PRUNE_PAST_DAYS = 0;

async function syncEvents() {
  console.log('Starting RSS sync...');
  console.log(`Pruning events older than ${PRUNE_PAST_DAYS} days past their date`);

  // Create images directory
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Load existing events FIRST - don't delete before fetching
  let existingEvents = [];
  const eventsJsonPath = 'events.json';
  if (fs.existsSync(eventsJsonPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(eventsJsonPath, 'utf8'));
      existingEvents = existing.events || [];
      console.log(`Loaded ${existingEvents.length} existing events`);
    } catch (err) {
      console.warn('Could not parse existing events.json, starting fresh:', err.message);
    }
  }

  // Build lookup map by GUID to detect duplicates
  const eventsByGuid = new Map();
  for (const event of existingEvents) {
    if (event.guid) {
      eventsByGuid.set(event.guid, event);
    }
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
    // Use curl instead of axios - Cloudflare trusts curl more than Node.js
    const curlCmd = `curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept: application/rss+xml, application/xml, text/xml, */*" -H "Referer: https://9ty9.co.za/" -w "\\n%{http_code}" "${RSS_URL}"`;
    const curlOutput = execSync(curlCmd, { timeout: 15000, encoding: 'utf8' });
    const lines = curlOutput.trim().split('\n');
    const httpCode = lines.pop();
    const xml = lines.join('\n');

    console.log(`RSS fetch HTTP status: ${httpCode}, content length: ${xml.length}`);

    // Fail on HTTP errors
    if (httpCode === '403' || httpCode === '429') {
      console.error(`ERROR: Cloudflare blocked request (HTTP ${httpCode}). Keeping existing events.`);
      process.exit(1);
    }

    if (httpCode !== '200') {
      throw new Error(`RSS feed returned HTTP ${httpCode}`);
    }

    if (!xml || xml.trim() === '') {
      throw new Error(`Empty response from RSS feed (HTTP ${httpCode})`);
    }

    if (!xml.includes('<item>')) {
      console.log('Response does not contain <item> tags. Keeping existing events.');
      console.log('First 500 chars:', xml.substring(0, 500));
      // Don't exit with error - keep what we have
    }

    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    console.log(`Found ${itemMatches.length} items in feed.`);

    let newEventsAdded = 0;
    let newEventsSkipped = 0;

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

      // Skip if no valid date
      if (isNaN(date.getTime())) {
        console.log(`Skipping event without valid date: ${title}`);
        continue;
      }

      // Check for duplicate by GUID
      if (guid && eventsByGuid.has(guid)) {
        newEventsSkipped++;
        continue; // Already have this event, skip
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

      const event = {
        title: title.trim(),
        link,
        guid,
        pubDate,
        dateStr: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-ZA', { day: '2-digit' }),
        month: date.toLocaleDateString('en-ZA', { month: 'short' }).toUpperCase(),
        description: cleanDesc.substring(0, 200),
        image: localImage
      };

      // Add to map and array
      eventsByGuid.set(guid, event);
      existingEvents.push(event);
      newEventsAdded++;
    }

    console.log(`✓ New events added: ${newEventsAdded}, duplicates skipped: ${newEventsSkipped}`);

    // NOW prune old events - after successful fetch, only if we got new data
    if (newEventsAdded > 0 || newEventsSkipped > 0) {
      const pruneThreshold = new Date();
      pruneThreshold.setHours(0, 0, 0, 0); // Start of today
      pruneThreshold.setDate(pruneThreshold.getDate() - PRUNE_PAST_DAYS);
      console.log(`Pruning events with dates before: ${pruneThreshold.toISOString().split('T')[0]}`);

      const originalCount = existingEvents.length;
      existingEvents = existingEvents.filter(event => {
        if (!event.dateStr) return true; // Keep events without dates
        const eventDate = new Date(event.dateStr);
        return eventDate >= pruneThreshold;
      });

      const prunedCount = originalCount - existingEvents.length;
      console.log(`Pruned ${prunedCount} old events (${PRUNE_PAST_DAYS}+ days past)`);
    } else {
      console.log('No new events from feed, skipping prune to preserve existing data');
    }

    // Sort by date ascending (oldest first for display)
    existingEvents.sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));

    console.log(`✓ Total events after sync: ${existingEvents.length}`);

    if (existingEvents.length === 0) {
      console.error('ERROR: No events remaining. Aborting to avoid data loss.');
      process.exit(1);
    }

    // Save events.json
    fs.writeFileSync(eventsJsonPath, JSON.stringify({
      lastUpdated: new Date().toISOString(),
      source: RSS_URL,
      count: existingEvents.length,
      events: existingEvents
    }, null, 2));
    console.log(`✓ Saved events.json (${existingEvents.length} events)`);

    // Generate events.html
    const eventsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Events | Kouga Business Forum</title>
  <meta name="description" content="Discover events in Jeffreys Bay, St Francis Bay & the Kouga Region. Community events, markets, sports, music, and more.">
  <link rel="canonical" href="https://new.kougabusinessforum.com/events.html">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://new.kougabusinessforum.com/events.html">
  <meta property="og:title" content="Community Events | Kouga Business Forum">
  <meta property="og:description" content="Discover local events, markets, and gatherings across the Kouga region. See what's happening near you.">
  <meta property="og:image" content="https://new.kougabusinessforum.com/images/kouga-tourism-hero.jpg">
  <meta property="og:site_name" content="Kouga Business Forum">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://new.kougabusinessforum.com/events.html">
  <meta name="twitter:title" content="Community Events | Kouga Business Forum">
  <meta name="twitter:description" content="Discover local events, markets, and gatherings across the Kouga region. See what's happening near you.">
  <meta name="twitter:image" content="https://new.kougabusinessforum.com/images/kouga-tourism-hero.jpg">

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
${existingEvents.map((event, i) => {
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
    // Don't delete existing events on error - exit gracefully
    if (existingEvents.length > 0) {
      console.log(`Keeping ${existingEvents.length} existing events due to error.`);
    }
    process.exit(1);
  }
}

syncEvents();
