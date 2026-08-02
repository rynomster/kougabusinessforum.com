const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RSS_URL = 'https://kougabusinessforum.com/rss';
const IMAGES_DIR = 'images/events';

// Prune events that ended more than this many days ago
const PRUNE_PAST_DAYS = 30;

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

  const MAX_PAGES = 5;
  let hasMorePages = true;
  let totalNewEventsAdded = 0;
  let totalNewEventsSkipped = 0;

  try {
    // Attempt RSS fetch and parsing with pagination
    for (let page = 1; page <= MAX_PAGES && hasMorePages; page++) {
      try {
        // Use curl instead of axios - Cloudflare trusts curl more than Node.js
        const rssSecret = process.env.RSS_PROXY_SECRET || '';
        const authHeader = rssSecret ? `-H "x-rss-secret: ${rssSecret}"` : '';
        const targetUrl = page === 1 ? RSS_URL : `${RSS_URL}?paged=${page}`;

        console.log(`[Page ${page}/${MAX_PAGES}] Fetching ${targetUrl}...`);

        const curlCmd = `curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" ${authHeader} -H "Accept: application/rss+xml, application/xml, text/xml, */*" -H "Referer: https://9ty9.co.za/" -w "\\n%{http_code}" "${targetUrl}"`;
        const curlOutput = execSync(curlCmd, { timeout: 15000, encoding: 'utf8' });
        const lines = curlOutput.trim().split('\n');
        const httpCode = lines.pop();
        const xml = lines.join('\n');

        console.log(`[Page ${page}] RSS fetch HTTP status: ${httpCode}, content length: ${xml.length}`);

        if (httpCode !== '200') {
          console.warn(`[Page ${page}] Non-200 HTTP response. Stopping pagination.`);
          hasMorePages = false;
          break;
        }

        if (!xml || !xml.includes('<item>')) {
          console.log(`[Page ${page}] No items found in feed. Stopping pagination.`);
          hasMorePages = false;
          break;
        }

        const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
        console.log(`[Page ${page}] Found ${itemMatches.length} items in feed.`);

        let pageEventsAdded = 0;
        let pageEventsSkipped = 0;

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
            console.log(`[Page ${page}] Skipping event without valid date: ${title}`);
            continue;
          }

          // Check for duplicate by GUID
          if (guid && eventsByGuid.has(guid)) {
            pageEventsSkipped++;
            totalNewEventsSkipped++;
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
                console.log(`[Page ${page}] Downloaded: ${filename}`);
                localImage = localPath;
              } catch (err) {
                console.log(`[Page ${page}] Failed to download: ${imageUrl} - ${err.message}`);
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
          pageEventsAdded++;
          totalNewEventsAdded++;
        }
        console.log(`[Page ${page}] ✓ Events added on page: ${pageEventsAdded}, duplicates skipped: ${pageEventsSkipped}`);
      } catch (pageErr) {
        console.warn(`[Page ${page}] Warning: Error during page fetch: ${pageErr.message}`);
        hasMorePages = false;
      }
    }
    console.log(`✓ Sync complete: total new events added: ${totalNewEventsAdded}, total duplicates skipped: ${totalNewEventsSkipped}`);

    // ALWAYS prune old events
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

    // Sort by date ascending (oldest first for display)
    existingEvents.sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));

    console.log(`✓ Total events after sync: ${existingEvents.length}`);

    if (existingEvents.length === 0) {
      console.warn('Warning: No events remaining. Still saving to reflect state.');
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
  <meta name="description" content="Discover events in Jeffreys Bay, St. Francis Bay & the Kouga Region. Community events, markets, sports, music, and more.">
  <link rel="canonical" href="https://kougabusinessforum.com/events.html">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://kougabusinessforum.com/events.html">
  <meta property="og:title" content="Community Events | Kouga Business Forum">
  <meta property="og:description" content="Discover local events, markets, and gatherings across the Kouga region. See what's happening near you.">
  <meta property="og:image" content="https://kougabusinessforum.com/images/jbay-coastal-hero.jpg">
  <meta property="og:site_name" content="Kouga Business Forum">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://kougabusinessforum.com/events.html">
  <meta name="twitter:title" content="Community Events | Kouga Business Forum">
  <meta name="twitter:description" content="Discover local events, markets, and gatherings across the Kouga region. See what's happening near you.">
  <meta name="twitter:image" content="https://kougabusinessforum.com/images/jbay-coastal-hero.jpg">

  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/events.css">
</head>
<body>
  ${header || '<header></header>'}

  <section class="page-hero">
    <h1>Community Events</h1>
    <p>Discover what's happening in Jeffreys Bay, St. Francis Bay & the Kouga Region</p>
  </section>

  <section class="section">
    <div class="container">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h3>Looking for official KBF events?</h3>
        <p>View our official calendar for forum meetings, workshops, and networking functions.</p>
        <a href="kbevents.html" class="btn btn-secondary">View KBF Events Calendar</a>
      </div>

      <div class="events-interactive-layout" style="display: grid; grid-template-columns: 350px 1fr; gap: 2.5rem; margin-top: 2rem;">
        <!-- Left Sidebar: Calendar & Filters -->
        <aside class="events-sidebar" style="display: flex; flex-direction: column; gap: 2rem;">
          <!-- Calendar Widget Card -->
          <div class="card calendar-widget-card" style="padding: 1.5rem;">
            <div class="calendar-widget-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <button id="cal-prev" class="btn btn-sm" style="padding: 0.25rem 0.5rem; background: var(--primary-light); color: white; min-width: auto; min-height: auto;">&lt;</button>
              <h4 id="cal-month-year" style="margin: 0; font-size: 1.1rem; color: var(--primary-dark);"></h4>
              <button id="cal-next" class="btn btn-sm" style="padding: 0.25rem 0.5rem; background: var(--primary-light); color: white; min-width: auto; min-height: auto;">&gt;</button>
            </div>
            <div class="calendar-widget-days-header" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 600; font-size: 0.8rem; margin-bottom: 0.5rem; color: var(--text-muted);">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div id="calendar-widget-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center;"></div>
          </div>

          <!-- Filters Card -->
          <div class="card filters-card" style="padding: 1.5rem;">
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--primary-dark);">Filter Events</h3>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="eventSearch" style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; display: block;">Search Keyword</label>
              <input type="text" id="eventSearch" placeholder="Type to search..." style="padding: 0.75rem; font-size: 0.9rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); width: 100%;">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="eventLocation" style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; display: block;">Location</label>
              <select id="eventLocation" style="padding: 0.75rem; font-size: 0.9rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); width: 100%; background: white;">
                <option value="all">All Locations</option>
                <option value="jeffreys-bay">Jeffreys Bay</option>
                <option value="st-francis-bay">St. Francis Bay</option>
                <option value="humansdorp">Humansdorp</option>
                <option value="other">Other Areas</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="eventDateRange" style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; display: block;">Timeframe</label>
              <select id="eventDateRange" style="padding: 0.75rem; font-size: 0.9rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); width: 100%; background: white;">
                <option value="all">Any Date</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom" id="custom-date-option" style="display: none;">Selected Date</option>
              </select>
            </div>

            <button id="resetFilters" class="btn btn-outline btn-sm" style="width: 100%; justify-content: center; margin-top: 0.5rem;">Clear Filters</button>
          </div>
        </aside>

        <!-- Right Content: Events Grid & Pagination -->
        <main class="events-main" style="display: flex; flex-direction: column; gap: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p class="last-updated" style="margin: 0; text-align: left;">Last updated: ${new Date().toLocaleString('en-ZA')}</p>
            <div id="results-meta" style="font-size: 0.95rem; color: var(--text-muted); font-weight: 500;">Loading events...</div>
          </div>

          <div class="events-grid" id="community-events-container">
            <!-- SEO Fallback - First 3 upcoming events rendered server-side -->
            ${existingEvents.slice(0, 3).map((event) => {
              const imgSrc = event.image ? (event.image.startsWith('http') ? event.image : `${event.image}`) : '';
              const imgAlt = event.title.replace(/"/g, '&quot;');
              return `            <div class="event-card">
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

          <!-- Pagination -->
          <div class="pagination-container" style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem;">
            <button id="btn-prev-page" class="btn btn-outline btn-sm" disabled>&larr; Previous</button>
            <span id="page-indicator" style="font-weight: 600; font-size: 0.95rem;">Page 1 of 1</span>
            <button id="btn-next-page" class="btn btn-outline btn-sm" disabled>Next &rarr;</button>
          </div>
        </main>
      </div>
    </div>
  </section>

  ${footer || '<footer></footer>'}

  <script src="js/main.js"></script>
  <script src="js/events.js"></script>
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
