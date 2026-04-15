const ical = require('node-ical');
const fs = require('fs');
const path = require('path');

const CALENDAR_ID = 'c_5df543ddb26619d45f5117fd2ca637bfdcd9be306b9c0d319f94e91f2d823c6d@group.calendar.google.com';
const ICS_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
const OUTPUT_JSON = 'kbevents.json';
const OUTPUT_HTML = 'kbevents.html';

const TZ = 'Africa/Johannesburg';

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}

function formatDateForGoogle(date) {
  if (!date) return '';
  return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
}

async function syncCalendar() {
  console.log('Starting KBF Events calendar sync...');

  try {
    const events = await ical.fromURL(ICS_URL);
    const eventList = [];

    for (const k in events) {
      if (events.hasOwnProperty(k)) {
        const ev = events[k];
        if (ev.type === 'VEVENT') {
          const startDate = new Date(ev.start);

          // Use Intl.DateTimeFormat to get localized components for South Africa
          const day = new Intl.DateTimeFormat('en-ZA', { day: 'numeric', timeZone: TZ }).format(startDate);
          const monthAbbr = new Intl.DateTimeFormat('en-ZA', { month: 'short', timeZone: TZ }).format(startDate).toUpperCase();
          const monthFull = new Intl.DateTimeFormat('en-ZA', { month: 'long', timeZone: TZ }).format(startDate);
          const year = new Intl.DateTimeFormat('en-ZA', { year: 'numeric', timeZone: TZ }).format(startDate);

          const googleCalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.summary || '')}&dates=${formatDateForGoogle(ev.start)}/${formatDateForGoogle(ev.end)}&details=${encodeURIComponent(ev.description || '')}&location=${encodeURIComponent(ev.location || '')}`;

          eventList.push({
            summary: ev.summary || 'Untitled Event',
            description: ev.description || '',
            descriptionClean: (ev.description || '').replace(/<[^>]+>/g, '').trim(),
            location: ev.location || '',
            link: googleCalLink,
            start: ev.start,
            end: ev.end,
            dateStr: startDate.toISOString().split('T')[0],
            day,
            monthAbbr,
            monthFull,
            year
          });
        }
      }
    }

    // Prune past events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const originalCount = eventList.length;
    const filteredEvents = eventList.filter(ev => {
      const eventEnd = new Date(ev.end);
      return eventEnd >= today;
    });
    console.log(`✓ Pruned ${originalCount - filteredEvents.length} past events`);

    // Sort by date ascending
    filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

    // Save JSON for potential future dynamic use
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify({
      lastUpdated: new Date().toISOString(),
      count: filteredEvents.length,
      events: filteredEvents
    }, null, 2));
    console.log(`✓ Saved ${filteredEvents.length} events to ${OUTPUT_JSON}`);

    // Generate HTML
    generateHTML(filteredEvents);

  } catch (err) {
    console.error('Error syncing calendar:', err.message);
    process.exit(1);
  }
}

function generateHTML(eventList) {
  const templatesDir = path.join(__dirname, '..', 'templates');
  let header = '';
  let footer = '';
  try {
    header = fs.readFileSync(path.join(templatesDir, 'header.html'), 'utf8');
    footer = fs.readFileSync(path.join(templatesDir, 'footer.html'), 'utf8');
  } catch (err) {
    console.warn('Warning: Could not read header/footer templates. Using empty placeholders.', err.message);
  }

  // Group by month
  const grouped = {};
  eventList.forEach(ev => {
    const key = `${ev.monthFull} ${ev.year}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  const calendarGridHtml = Object.keys(grouped).map(monthYear => {
    const monthEvents = grouped[monthYear];
    const monthName = monthYear.split(' ')[0];
    return `
        <div class="card month-card">
          <h3>${monthName}</h3>
          <ul class="event-list">
            ${monthEvents.map(ev => {
              return `            <li>
              <strong>${ev.day} ${ev.monthAbbr}</strong> ${escapeHTML(ev.summary)}
              <a href="${ev.link}" target="_blank" class="add-to-cal" title="Add to Google Calendar">+</a>
            </li>`;
            }).join('\n')}
          </ul>
        </div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KBF Events | Kouga Business Forum</title>
  <meta name="description" content="Official KBF events including AGM meetings, networking sessions, and member workshops.">
  <link rel="canonical" href="https://new.kougabusinessforum.com/kbevents.html">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://new.kougabusinessforum.com/kbevents.html">
  <meta property="og:title" content="KBF Events | Kouga Business Forum">
  <meta property="og:description" content="Official KBF events, meetings, and workshops for Kouga business leaders.">
  <meta property="og:image" content="https://new.kougabusinessforum.com/images/kouga-tourism-hero.jpg">
  <meta property="og:site_name" content="Kouga Business Forum">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://new.kougabusinessforum.com/kbevents.html">
  <meta name="twitter:title" content="KBF Events | Kouga Business Forum">
  <meta name="twitter:description" content="Official KBF events, meetings, and workshops for Kouga business leaders.">
  <meta name="twitter:image" content="https://new.kougabusinessforum.com/images/kouga-tourism-hero.jpg">

  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/events.css">
</head>
<body>
  ${header || '<header></header>'}

  <section class="page-hero" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
    <h1>KBF Events</h1>
    <p>Official Kouga Business Forum events, AGM meetings, and member workshops</p>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header">
        <h2>2026 Events Calendar</h2>
        <p>Official forum meetings, midday sessions, and networking functions.</p>
      </div>

      <div class="calendar-actions">
        <a href="webcal://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics" class="btn btn-outline">
          📅 Subscribe to Calendar
        </a>
      </div>

      <div class="calendar-grid">
        ${calendarGridHtml || '<p style="text-align:center; grid-column: 1/-1;">No events scheduled yet. Please check back soon.</p>'}
      </div>

      <div class="card" style="margin-top: 3rem; text-align: center;">
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          <strong>For inquiries:</strong>
          <a href="mailto:office@kougabusinessforum.com" style="color: var(--accent-cyan);">
            office@kougabusinessforum.com
          </a>
        </p>
        <div style="padding-top: 2rem; border-top: 1px solid #eee;">
          <h3>Looking for local community events?</h3>
          <p style="margin-bottom: 1.5rem;">Discover markets, festivals, and gatherings across the Kouga region.</p>
          <a href="events.html" class="btn btn-secondary" style="margin-right: 1rem;">
            Explore Community Calendar
          </a>
          <a href="index.html" class="btn btn-outline">
            Return Home
          </a>
        </div>
      </div>
    </div>
  </section>

  ${footer || '<footer></footer>'}

  <script src="js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML, html);
  console.log(`✓ Generated ${OUTPUT_HTML}`);
}

syncCalendar();
