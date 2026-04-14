// KBF Website - Modern Redesign JavaScript

// Configuration
const EVENTS_JSON_URL = 'events.json';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeForms();
  initializeScrollAnimations();
  loadEvents();
  initializeMobileMenuToggle();
  highlightCurrentPage();
});

/**
 * Highlight Current Page in Navigation
 * Sets 'active' class and 'aria-current="page"' on the current nav link.
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Handle home page specifically
    const isHome = currentPath === '/' || currentPath === '/index.html' || currentPath === '';
    const linkIsHome = href === 'index.html' || href === '/';

    if (isHome && linkIsHome) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else if (href !== 'index.html' && href !== '/' && currentPath.includes(href)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Navigation - Smooth Scrolling
function initializeNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
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

// Mobile Menu Toggle
function initializeMobileMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking nav link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}


// Forms
function initializeForms() {
  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');
  const newsletterError = document.getElementById('newsletter-error');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[name="email"]');
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Reset state
      if (newsletterError) newsletterError.style.display = 'none';

      // Loading state
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.value })
        });

        if (response.ok) {
          // Show success message
          if (newsletterSuccess) {
            newsletterForm.style.display = 'none';
            newsletterSuccess.style.display = 'block';
          } else {
            alert('Thank you! You\'ve been successfully subscribed to our newsletter.');
            this.reset();
          }
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        console.error('Newsletter error:', error);
        // Show error message
        if (newsletterError) {
          newsletterError.style.display = 'block';
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
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

  // Contact Form Pre-fill
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const inquiry = urlParams.get('inquiry');
    const business = urlParams.get('business');
    const subjectSelect = contactForm.querySelector('#subject');
    const messageTextarea = contactForm.querySelector('#message');

    if (inquiry === 'directory' && business) {
      if (subjectSelect) subjectSelect.value = 'directory';
      if (messageTextarea) {
        messageTextarea.value = `I am requesting contact details for the following business: ${business}\n\n[Please add any additional questions here]`;
      }
    } else if (inquiry === 'complimentary') {
      if (subjectSelect) subjectSelect.value = 'complimentary';
      if (messageTextarea) {
        messageTextarea.value = `I am interested in applying for complimentary membership for our organization.\n\nOrganization Name: \nType (NGO/School/Church): \n\n[Please add any additional information here]`;
      }
    } else if (inquiry === 'events') {
      if (subjectSelect) subjectSelect.value = 'events';
      if (messageTextarea) {
        messageTextarea.value = `I am interested in more information about an upcoming event.\n\nEvent Name: \n\n[Please add your specific questions here]`;
      }
    }
  }
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

// Load and display events from events.json
async function loadEvents() {
  try {
    const response = await fetch(EVENTS_JSON_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const events = data.events;
    
    if (events && events.length > 0) {
      displayEvents(events);
    }
  } catch (error) {
    console.log('Using demo events:', error.message);
    displayDemoEvents();
  }
}

// Display real events from events.json
function displayEvents(events) {
  const container = document.getElementById('events-container');
  if (!container) return;

  // Clear existing content to prevent duplicates
  container.innerHTML = '';
  
  // Display the first 3 events
  const featuredEvents = events.slice(0, 3);
  
  featuredEvents.forEach((event, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'card';
    eventCard.style.animationDelay = `${index * 100}ms`;
    eventCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h3 style="margin: 0;">${event.title}</h3>
        <span style="background: var(--accent-gradient); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">${event.day} ${event.month}</span>
      </div>
      <p style="color: var(--text-muted);">${event.description.length > 120 ? event.description.substring(0, 120) + '...' : event.description}</p>
      <a href="${event.link}" target="_blank" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 0.9rem;">More Info</a>
    `;
    container.appendChild(eventCard);
  });
}

// Display demo events
function displayDemoEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;

  // Clear existing content to prevent duplicates with hardcoded fallbacks
  container.innerHTML = '';
  
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
      <a href="contact.html?inquiry=events" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 0.9rem;">${event.cta}</a>
    `;
    container.appendChild(eventCard);
  });
}

// Utility: Console logging for debugging
if (typeof console !== 'undefined') {
  console.log('KBF Website initialized');
  console.log('Events URL:', EVENTS_JSON_URL);
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
