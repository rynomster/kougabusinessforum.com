// KBF Website - Main JavaScript

// Configuration
const RSS_FEED_URL = 'https://9ty9.co.za/event/feed/';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeForms();
  loadEvents();
  loadNews();
});

// Navigation - Smooth Scrolling
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"], .hero a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Forms
function initializeForms() {
  // Join Form
  const joinForm = document.querySelector('.join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Gather form data
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Simulate submission
      alert(`Thank you for your interest in joining KBF!\n\nYour application has been submitted. We will contact you at ${data.email} shortly.`);
      
      // Reset form
      this.reset();
    });
  }
}

// Load and display events from RSS feed
async function loadEvents() {
  try {
    const response = await fetch(RSS_FEED_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const feedData = await response.text();
    const events = parseAtomFeed(feedData);
    
    if (events && events.length > 0) {
      displayEvents(events);
    } else {
      displayPlaceholder('events-container', 'No events found. Check back later or add some demo events.');
    }
  } catch (error) {
    console.log('Using demo events:', error.message);
    displayPlaceholder('events-container', 'Events sync temporarily unavailable. Using demo events.');
    
    // Show demo events
    displayDemoEvents();
  }
}

// Load and display news from RSS feed
async function loadNews() {
  try {
    const response = await fetch(RSS_FEED_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const feedData = await response.text();
    const articles = parseAtomFeed(feedData);
    
    if (articles && articles.length > 0) {
      displayNews(articles);
    } else {
      displayPlaceholder('news-container', 'No news found. Check back later.');
    }
  } catch (error) {
    console.log('Using demo news:', error.message);
    displayPlaceholder('news-container', 'News sync temporarily unavailable. Using demo content.');
    
    // Show demo news
    displayDemoNews();
  }
}

// Parse Atom feed format
function parseAtomFeed(feedData) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(feedData, 'text/xml');
  
  const items = doc.querySelectorAll('entry');
  const results = [];
  
  items.forEach(item => {
    results.push({
      title: item.querySelector('title')?.textContent || 'Untitled',
      link: item.querySelector('link')?.getAttribute('href') || '#',
      pubDate: item.querySelector('published')?.textContent || item.querySelector('updated')?.textContent || '',
      content: item.querySelector('content')?.textContent || item.querySelector('summary')?.textContent || ''
    });
  });
  
  return results;
}

// Display events
function displayEvents(events) {
  const container = document.getElementById('events-container');
  if (!container) return;
  
  // Remove placeholder if exists
  container.querySelectorAll('.placeholder').forEach(el => el.remove());
  
  events.slice(0, 6).forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-item';
    eventCard.innerHTML = `
      <div class="event-details">
        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${event.title}</h4>
        <p style="color: var(--text-secondary); font-size: var(--font-size-small);">${event.content?.substring(0, 120) || 'Upcoming event'}...</p>
      </div>
      <div class="event-date">
        <div class="day">??</div>
        <div class="month">??</div>
      </div>
    `;
    container.appendChild(eventCard);
  });
}

// Display news
function displayNews(articles) {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  // Remove placeholder if exists
  container.querySelectorAll('.placeholder').forEach(el => el.remove());
  
  articles.slice(0, 6).forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-item';
    newsCard.innerHTML = `
      <div class="news-content">
        <h4 style="color: var(--primary-blue); margin-bottom: 0.75rem;">${article.title}</h4>
        <p style="color: var(--text-secondary); font-size: var(--font-size-small); margin-bottom: 1rem; line-height: 1.6;">${article.content?.substring(0, 150) || 'Recent update'}...</p>
        <a href="${article.link}" class="news-link" target="_blank" rel="noopener">Read More →</a>
      </div>
    `;
    container.appendChild(newsCard);
  });
}

// Display placeholder with message
function displayPlaceholder(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="directory-placeholder" style="text-align: center; padding: 3rem 2rem;">
      <p style="color: var(--text-light); font-size: var(--font-size-body);">${message}</p>
    </div>
  `;
}

// Demo events (fallback)
function displayDemoEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;
  
  const demoEvents = [
    {
      title: '🤝 Monthly Networking Breakfast',
      date: '15 MAR',
      description: 'Join us for a networking session with local business leaders. Light breakfast provided.'
    },
    {
      title: '📚 Business Workshop: Digital Transformation',
      date: '22 MAR',
      description: 'Learn how to leverage digital tools to grow your business in the modern economy.'
    },
    {
      title: '🌊 Coastal Clean-Up Day',
      date: '05 APR',
      description: 'Community event - Help keep our beautiful coastlines clean and beautiful.'
    }
  ];
  
  demoEvents.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-item';
    eventCard.innerHTML = `
      <div class="event-details">
        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${event.title}</h4>
        <p style="color: var(--text-secondary); font-size: var(--font-size-small);">${event.description}</p>
      </div>
      <div class="event-date">
        <div class="day">??</div>
        <div class="month">??</div>
      </div>
    `;
    container.appendChild(eventCard);
  });
}

// Demo news (fallback)
function displayDemoNews() {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  const demoNews = [
    {
      title: '📋 AGM 2026 Minutes Available',
      description: 'The Annual General Meeting minutes from our 2026 AGM are now available for download.'
    },
    {
      title: '🎉 PACA Report Released',
      description: 'Our latest PACA report is now available, detailing our financial performance for the past year.'
    },
    {
      title: '🤝 New Partnership Announced',
      description: 'Exciting news! KBF has announced a strategic partnership to bring more business development resources.'
    }
  ];
  
  demoNews.forEach(news => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-item';
    newsCard.innerHTML = `
      <div class="news-content">
        <h4 style="color: var(--primary-blue); margin-bottom: 0.75rem;">${news.title}</h4>
        <p style="color: var(--text-secondary); font-size: var(--font-size-small); margin-bottom: 1rem; line-height: 1.6;">${news.description}</p>
        <a href="#" class="news-link">Read More →</a>
      </div>
    `;
    container.appendChild(newsCard);
  });
}

// Utility: Console logging for debugging
if (typeof console !== 'undefined') {
  console.log('KBF Website initialized');
  console.log('RSS Feed URL:', RSS_FEED_URL);
}