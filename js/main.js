// KBF Website - Modern Redesign JavaScript

// Configuration
const RSS_FEED_URL = 'https://kougabusinessforum.com/feed/';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeForms();
  initializeScrollAnimations();
  loadEvents();
  loadNews();
  initializeMobileMenu();
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
        const headerOffset = 100;
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

// Mobile Menu
function initializeMobileMenu() {
  const nav = document.querySelector('.nav');
  const menuBtn = document.createElement('button');
  
  menuBtn.innerHTML = `
    <span class="hamburger-icon"></span>
    <span class="hamburger-icon"></span>
    <span class="hamburger-icon"></span>
  `;
  
  menuBtn.style.cssText = `
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm);
    z-index: 1001;
  `;
  
  const menu = document.createElement('div');
  menu.innerHTML = `
    <a href="#features">Features</a>
    <a href="#gallery">Gallery</a>
    <a href="#events">Events</a>
    <a href="#about">About</a>
    <a href="#contact" class="btn btn-primary">Join Now</a>
  `;
  menu.style.cssText = `
    display: none;
    position: fixed;
    top: 72px;
    right: var(--spacing-md);
    background: var(--primary-dark);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    flex-direction: column;
    gap: var(--spacing-xs);
    box-shadow: var(--shadow-xl);
  `;
  
  menu.style.marginRight = 'var(--spacing-sm)';
  
  menuBtn.addEventListener('click', function() {
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
  
  nav.appendChild(menuBtn);
  nav.appendChild(menu);

  // Show menu button on mobile
  if (window.innerWidth <= 768) {
    menuBtn.style.display = 'flex';
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  // Close menu on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'flex';
    }
  });
}


// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking nav link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}


// Forms
function initializeForms() {
  // Join Form
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Gather form data
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Simulate submission with animation
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert(`Thank you for your interest in joining KBF!\n\nYour application has been submitted. We will contact you at ${data.email} shortly.`);
        
        // Reset form
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Contact form links
  const contactLinks = document.querySelectorAll('footer .footer-links a[href^="mailto:"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const mailto = this.href;
      window.location.href = mailto;
    });
  });
}

// Scroll Animations
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.card, .feature-card, .gallery-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        if (animatedElements.length > 1) {
          setTimeout(() => {
            entry.target.style.transitionDelay = `${index * 50}ms`;
          }, 0);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
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
    }
  } catch (error) {
    console.log('Using demo events:', error.message);
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
    }
  } catch (error) {
    console.log('Using demo news:', error.message);
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

// Display demo events
function displayDemoEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;
  
  const demoEvents = [
    {
      title: '🤝 Monthly Networking Breakfast',
      date: 'MAR 15',
      description: 'Join us for a networking session with local business leaders. Light breakfast provided.',
      cta: 'RSVP Now'
    },
    {
      title: '📚 Business Workshop: Digital Transformation',
      date: 'MAR 22',
      description: 'Learn how to leverage digital tools to grow your business in the modern economy.',
      cta: 'Register'
    },
    {
      title: '🌊 Coastal Clean-Up Day',
      date: 'APR 05',
      description: 'Community event - Help keep our beautiful coastlines clean and beautiful.',
      cta: 'Sign Up'
    },
    {
      title: '💼 Women in Business Breakfast',
      date: 'APR 12',
      description: 'Exclusive networking for women entrepreneurs in the Kouga region.',
      cta: 'Learn More'
    },
    {
      title: '🎓 Young Entrepreneurs Summit',
      date: 'APR 20',
      description: 'A day dedicated to mentoring and supporting young business leaders.',
      cta: 'Register Now'
    },
    {
      title: '🤝 Annual General Meeting',
      date: 'MAY 08',
      description: 'Join us for the annual AGM and hear about our achievements and future plans.',
      cta: 'Get Details'
    }
  ];
  
  demoEvents.forEach((event, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'card';
    eventCard.style.animationDelay = `${index * 100}ms`;
    eventCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h3 style="margin: 0;">${event.title}</h3>
        <span style="background: var(--accent); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">${event.date}</span>
      </div>
      <p style="color: var(--text-muted);">${event.description}</p>
      <a href="#contact" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 0.9rem;">${event.cta}</a>
    `;
    container.appendChild(eventCard);
  });
}

// Utility: Console logging for debugging
if (typeof console !== 'undefined') {
  console.log('KBF Website initialized');
  console.log('RSS Feed URL:', RSS_FEED_URL);
  console.log('Modern redesign loaded successfully');
}

// Performance: Lazy load images
if (typeof IntersectionObserver !== 'undefined') {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}
