// Kouga Business Forum - Main JavaScript

// Sample directory data (will be loaded from JSON file)
const sampleMembers = [
  { name: "Jeffreys Bay Builders", category: "construction", location: "jeffreys-bay", logo: "🏗️" },
  { name: "Coastal Retail Solutions", category: "retail", location: "jeffreys-bay", logo: "🛒" },
  { name: "Ocean View Tourism", category: "tourism", location: "jeffreys-bay", logo: "🏖️" },
  { name: "Humansdorp Services", category: "services", location: "humansdorp", logo: "💼" },
  { name: "Patensie Agriculture Ltd", category: "agriculture", location: "patensie", logo: "🌾" },
  { name: "St. Francis Hospitality", category: "tourism", location: "st-francis", logo: "🍽️" },
  { name: "Hankey Construction", category: "construction", location: "hankey", logo: "🏠" },
  { name: "Loerie Retail Co", category: "retail", location: "loerie", logo: "🎁" }
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initializeDirectory();
  initializeSmoothScroll();
  initializeForm();
  loadEvents();
  loadNews();
});

// Directory functionality
function initializeDirectory() {
  const grid = document.getElementById('directory-grid');
  if (!grid) return;

  // Load sample data
  loadMembers(sampleMembers);

  // Add filter event listeners
  document.getElementById('category-filter').addEventListener('change', filterMembers);
  document.getElementById('location-filter').addEventListener('change', filterMembers);
}

function loadMembers(members) {
  grid.innerHTML = '';
  members.forEach(member => {
    const card = createMemberCard(member);
    grid.appendChild(card);
  });
}

function createMemberCard(member) {
  const card = document.createElement('div');
  card.className = 'directory-item';
  card.innerHTML = `
    <div style="padding: 1.5rem; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">${member.logo}</div>
      <h3 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${member.name}</h3>
      <div style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">
        <span style="background: var(--sand-light); padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem;">${member.category}</span>
        <span style="margin-left: 0.5rem; background: var(--sand-light); padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem;">${member.location}</span>
      </div>
      <button class="btn-primary" style="width: 100%; cursor: pointer;">View Details</button>
    </div>
  `;
  return card;
}

function filterMembers() {
  const category = document.getElementById('category-filter').value;
  const location = document.getElementById('location-filter').value;
  
  let filtered = sampleMembers;
  
  if (category) {
    filtered = filtered.filter(m => m.category === category);
  }
  if (location) {
    filtered = filtered.filter(m => m.location === location);
  }
  
  loadMembers(filtered);
}

// Smooth scroll
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Form handling
function initializeForm() {
  const form = document.querySelector('.join-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Gather form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Simulate submission
      alert(`Thank you for your interest in joining KBF!\n\nYour application has been submitted. We will contact you at ${data.email} shortly.`);
      
      // Reset form
      form.reset();
    });
  }
}

// Load and display events from JSON
function loadEvents() {
  fetch('events.json')
    .then(response => response.json())
    .then(data => {
      if (data.events && data.events.length > 0) {
        displayEvents(data.events);
      }
    })
    .catch(error => {
      console.log('Using demo events:', error.message);
      // Use demo content
    });
}

// Load and display news from JSON
function loadNews() {
  fetch('news.json')
    .then(response => response.json())
    .then(data => {
      if (data.articles && data.articles.length > 0) {
        displayNews(data.articles);
      }
    })
    .catch(error => {
      console.log('Using demo news:', error.message);
      // Use demo content
    });
}

function displayEvents(events) {
  const grid = document.getElementById('directory-grid');
  if (!grid) return;
  
  // Check if we have actual events or just placeholders
  const demoEvent = grid.querySelector('.demo-event');
  if (demoEvent) {
    demoEvent.remove();
  }
  
  events.slice(0, 6).forEach(event => { // Show max 6 events
    const eventCard = document.createElement('div');
    eventCard.className = 'directory-item';
    eventCard.innerHTML = `
      <div style="padding: 1.5rem;">
        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${event.title || 'New Event'}</h4>
        <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">${event.description?.substring(0, 100) || 'Upcoming event'}...</p>
        <a href="${event.link}" target="_blank" style="display: inline-block; background: var(--primary-blue); color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; font-size: 0.9rem;">View Details</a>
      </div>
    `;
    grid.appendChild(eventCard);
  });
}

function displayNews(articles) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;
  
  articles.slice(0, 6).forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'directory-item';
    newsCard.innerHTML = `
      <div style="padding: 1.5rem;">
        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${article.title || 'Latest News'}</h4>
        <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">${article.content?.substring(0, 120) || 'Recent update from KBF'}...</p>
        <a href="${article.link}" target="_blank" style="display: inline-block; background: var(--secondary-blue); color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; font-size: 0.9rem;">Read More</a>
      </div>
    `;
    grid.appendChild(newsCard);
  });
}

// Future enhancements:
// - Load members from external JSON file
// - Add member detail modal
// - Implement RSS feed parsing
// - Add member search functionality
// - Enable member profile management
