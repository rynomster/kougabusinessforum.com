/**
 * Community Events Calendar & Dynamic Filter Widget
 * Loads and displays community events with calendar date picking, search, category, location filtering and pagination.
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeCommunityEvents();
});

function initializeCommunityEvents() {
  const JSON_URL = 'events.json';
  const PAGE_SIZE = 9;

  // DOM Elements
  const container = document.getElementById('community-events-container');
  const resultsMeta = document.getElementById('results-meta');
  const searchInput = document.getElementById('eventSearch');
  const locationSelect = document.getElementById('eventLocation');
  const dateRangeSelect = document.getElementById('eventDateRange');
  const customDateOption = document.getElementById('custom-date-option');
  const resetBtn = document.getElementById('resetFilters');

  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  const pageIndicator = document.getElementById('page-indicator');

  const calMonthYear = document.getElementById('cal-month-year');
  const calGrid = document.getElementById('calendar-widget-grid');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');

  if (!container) return;

  // State
  let allEvents = [];
  let filteredEvents = [];
  let currentPage = 1;
  let selectedDateStr = null; // format: 'YYYY-MM-DD'
  let currentCalDate = new Date(); // Month currently viewable in the mini-calendar

  // Fetch Events Data
  fetch(JSON_URL)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load events data.');
      return res.json();
    })
    .then(data => {
      allEvents = data.events || [];
      // Parse dates explicitly and sort ascending
      allEvents.forEach(ev => {
        ev.parsedDate = new Date(ev.dateStr || ev.pubDate);
      });
      allEvents.sort((a, b) => a.parsedDate - b.parsedDate);

      applyFilters();
      renderMiniCalendar();
    })
    .catch(err => {
      console.error('Error fetching community events:', err);
      resultsMeta.textContent = 'Failed to load community events.';
    });

  // Filter Logic
  function applyFilters() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const locVal = locationSelect ? locationSelect.value : 'all';
    const dateRangeVal = dateRangeSelect ? dateRangeSelect.value : 'all';

    filteredEvents = allEvents.filter(ev => {
      // 1. Keyword search (title, description, raw details)
      const matchKeyword = !keyword ||
        ev.title.toLowerCase().includes(keyword) ||
        (ev.description && ev.description.toLowerCase().includes(keyword));

      // 2. Location filter
      // Infer location by matching substring or common tokens
      let matchLocation = true;
      if (locVal !== 'all') {
        const fullText = (ev.title + ' ' + (ev.description || '')).toLowerCase();
        if (locVal === 'jeffreys-bay') {
          matchLocation = fullText.includes('jeffreys bay') || fullText.includes('j-bay') || fullText.includes('jbay') || fullText.includes('kabeljous');
        } else if (locVal === 'st-francis-bay') {
          matchLocation = fullText.includes('st francis') || fullText.includes('st. francis');
        } else if (locVal === 'humansdorp') {
          matchLocation = fullText.includes('humansdorp');
        } else if (locVal === 'other') {
          // Does not match the above explicitly
          matchLocation = !fullText.includes('jeffreys bay') && !fullText.includes('j-bay') && !fullText.includes('jbay') && !fullText.includes('kabeljous') &&
                          !fullText.includes('st francis') && !fullText.includes('st. francis') &&
                          !fullText.includes('humansdorp');
        }
      }

      // 3. Date / Timeframe filter
      let matchDate = true;
      const todayStr = getLocalDateStr(new Date());

      if (dateRangeVal === 'today') {
        matchDate = ev.dateStr === todayStr;
      } else if (dateRangeVal === 'week') {
        const evDate = new Date(ev.dateStr);
        const diffTime = evDate - new Date(todayStr);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchDate = diffDays >= 0 && diffDays <= 7;
      } else if (dateRangeVal === 'month') {
        const evDate = new Date(ev.dateStr);
        const now = new Date();
        matchDate = evDate.getFullYear() === now.getFullYear() && evDate.getMonth() === now.getMonth();
      } else if (dateRangeVal === 'custom' && selectedDateStr) {
        matchDate = ev.dateStr === selectedDateStr;
      }

      return matchKeyword && matchLocation && matchDate;
    });

    currentPage = 1;
    renderEventsList();
    highlightEventDaysInCalendar();
  }

  // Render events grid with pagination
  function renderEventsList() {
    container.innerHTML = '';
    const totalCount = filteredEvents.length;

    if (totalCount === 0) {
      resultsMeta.textContent = 'No events match your current criteria.';
      container.style.display = 'none';
      pageIndicator.textContent = 'Page 1 of 1';
      btnPrevPage.disabled = true;
      btnNextPage.disabled = true;
      return;
    }

    container.style.display = 'grid';
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Bounds check current page
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Get current page slice
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalCount);
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    resultsMeta.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalCount} community events`;
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

    btnPrevPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages;

    paginatedEvents.forEach((ev, index) => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.style.animationDelay = `${index * 50}ms`;

      const imgSrc = ev.image ? (ev.image.startsWith('http') ? ev.image : `${ev.image}`) : '';
      const imgAlt = ev.title.replace(/"/g, '&quot;');

      card.innerHTML = `
        ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}" loading="lazy">` : ''}
        <div class="event-info">
          <span class="event-date-badge">${ev.day}<br>${ev.month}</span>
          <h3>${ev.title}</h3>
          <p>${ev.description || ''}...</p>
          <a href="${ev.link}" class="btn btn-primary" target="_blank">More Info</a>
        </div>
      `;
      container.appendChild(card);
    });

    // Handle any dynamic icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Mini-Calendar render engine
  function renderMiniCalendar() {
    if (!calMonthYear || !calGrid) return;

    calGrid.innerHTML = '';
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    // Set month / year title
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    calMonthYear.textContent = monthFormatter.format(currentCalDate);

    // Get first day of month index and total days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill blank cells before the first day
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.style.padding = '8px 0';
      calGrid.appendChild(emptyCell);
    }

    // Populate calendar day cells
    for (let day = 1; day <= totalDays; day++) {
      const dayCell = document.createElement('button');
      dayCell.className = 'calendar-day-btn';
      dayCell.textContent = day;
      dayCell.style.border = 'none';
      dayCell.style.background = 'transparent';
      dayCell.style.padding = '8px 0';
      dayCell.style.borderRadius = 'var(--radius-sm)';
      dayCell.style.cursor = 'pointer';
      dayCell.style.fontSize = '0.9rem';
      dayCell.style.fontWeight = '500';
      dayCell.style.color = 'var(--text-dark)';
      dayCell.style.transition = 'all var(--transition-fast)';

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dayCell.dataset.date = dateStr;

      // Click callback to filter by specific date
      dayCell.addEventListener('click', () => {
        // Toggle selected date
        if (selectedDateStr === dateStr) {
          selectedDateStr = null;
          if (dateRangeSelect) dateRangeSelect.value = 'all';
          if (customDateOption) customDateOption.style.display = 'none';
        } else {
          selectedDateStr = dateStr;
          if (customDateOption && dateRangeSelect) {
            customDateOption.style.display = 'block';
            dateRangeSelect.value = 'custom';
          }
        }
        applyFilters();
      });

      calGrid.appendChild(dayCell);
    }

    highlightEventDaysInCalendar();
  }

  // Highlight days with events, active filter days, and selected days
  function highlightEventDaysInCalendar() {
    const dayCells = calGrid ? calGrid.querySelectorAll('.calendar-day-btn') : [];
    const todayStr = getLocalDateStr(new Date());

    dayCells.forEach(cell => {
      const cellDateStr = cell.dataset.date;

      // Reset inline styling classes/attributes (using JS variables as styles)
      cell.style.background = 'transparent';
      cell.style.color = 'var(--text-dark)';
      cell.style.fontWeight = '500';
      cell.style.boxShadow = 'none';

      // Highlight today
      if (cellDateStr === todayStr) {
        cell.style.border = '2px solid var(--accent-teal)';
      } else {
        cell.style.border = 'none';
      }

      // Check if this date has any scheduled community events
      const hasEvents = allEvents.some(ev => ev.dateStr === cellDateStr);
      if (hasEvents) {
        cell.classList.add('has-events');
        cell.style.fontWeight = '700';
        cell.style.color = 'var(--accent-teal)';

        // Add indicator dot styled inline
        let dot = cell.querySelector('.cal-dot');
        if (!dot) {
          dot = document.createElement('div');
          dot.className = 'cal-dot';
          dot.style.width = '4px';
          dot.style.height = '4px';
          dot.style.background = 'var(--accent-teal)';
          dot.style.borderRadius = '50%';
          dot.style.margin = '2px auto 0';
          cell.appendChild(dot);
        }
      } else {
        cell.classList.remove('has-events');
        const dot = cell.querySelector('.cal-dot');
        if (dot) dot.remove();
      }

      // Highlight selected date
      if (selectedDateStr && cellDateStr === selectedDateStr) {
        cell.style.background = 'var(--accent-teal)';
        cell.style.color = 'white';
        const dot = cell.querySelector('.cal-dot');
        if (dot) dot.style.background = 'white';
      }
    });
  }

  // Event Listeners for Filters
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (locationSelect) {
    locationSelect.addEventListener('change', applyFilters);
  }
  if (dateRangeSelect) {
    dateRangeSelect.addEventListener('change', () => {
      if (dateRangeSelect.value !== 'custom') {
        selectedDateStr = null;
        if (customDateOption) customDateOption.style.display = 'none';
      }
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (locationSelect) locationSelect.value = 'all';
      if (dateRangeSelect) dateRangeSelect.value = 'all';
      selectedDateStr = null;
      if (customDateOption) customDateOption.style.display = 'none';
      applyFilters();
    });
  }

  // Pagination Listeners
  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderEventsList();
        scrollToCommunityHeader();
      }
    });
  }

  if (btnNextPage) {
    btnNextPage.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
      if (currentPage < totalPages) {
        currentPage++;
        renderEventsList();
        scrollToCommunityHeader();
      }
    });
  }

  // Mini-Calendar Month Navigation
  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      renderMiniCalendar();
    });
  }

  if (calNextBtn) {
    calNextBtn.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      renderMiniCalendar();
    });
  }

  // Helper: scroll window to events grid on pagination
  function scrollToCommunityHeader() {
    const headerEl = document.getElementById('community-events-container');
    if (headerEl) {
      const offset = headerEl.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  // Helper: get standard date string YYYY-MM-DD
  function getLocalDateStr(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  }
}
