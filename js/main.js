// KBF Website - Modern Redesign JavaScript

// Configuration
const EVENTS_JSON_URL = 'kbevents.json';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeForms();
  initializeScrollAnimations();
  loadEvents();
  initializeMobileMenuToggle();
  highlightCurrentPage();
  initializeMembershipProrata();
  initializeIcons();
  handleInitialHash();
});

/**
 * Handle initial URL hash for deep links
 */
function handleInitialHash() {
  if (window.location.hash) {
    // Small delay to allow browser native scroll to settle and for dynamic content
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}

/**
 * Initialize Lucide Icons
 */
function initializeIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    // If using CDN, it might not be ready yet
    window.addEventListener('load', () => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }
}

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
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
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
      const eventName = urlParams.get('event');
      if (subjectSelect) subjectSelect.value = 'events';
      if (messageTextarea) {
        if (eventName) {
          messageTextarea.value = `I would like to RSVP or request more information for the following event: ${eventName}\n\n[Please add your specific questions or number of attendees here]`;
        } else {
          messageTextarea.value = `I am interested in more information about an upcoming event.\n\nEvent Name: \n\n[Please add your specific questions here]`;
        }
      }
    }

    contactForm.addEventListener('submit', function() {
      // Small delay to allow the mailto: action to trigger before showing feedback
      setTimeout(() => {
        alert('Thank you! Your email client should now open with your message. If not, please email us directly at office@kougabusinessforum.com');
      }, 500);
    });
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

// Display real events from kbevents.json
function displayEvents(events) {
  const container = document.getElementById('events-container');
  if (!container) return;

  // Clear existing content to prevent duplicates
  container.innerHTML = '';
  
  // Filter events to only show upcoming ones (today or later)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start || event.date);
    return eventDate >= now;
  });

  // Display the first 3 upcoming events
  const featuredEvents = upcomingEvents.slice(0, 3);
  
  featuredEvents.forEach((event, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'card';
    eventCard.style.animationDelay = `${index * 100}ms`;

    // Support both kbevents.json and events.json data structures for robustness
    const title = event.summary || event.title || 'Untitled Event';
    const day = event.day || '';
    const month = event.monthAbbr || event.month || '';
    const description = event.descriptionClean || event.description || '';
    const link = event.link || '#';

    eventCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
        <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="calendar" width="18" height="18" style="color: var(--accent-teal);"></i>
          ${title}
        </h3>
        <span style="background: var(--primary-dark); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">${day} ${month}</span>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${description.length > 120 ? description.substring(0, 120) + '...' : description}</p>
      <div style="display: flex; gap: 0.75rem; margin-top: auto; flex-wrap: wrap;">
        <a href="contact.html?inquiry=events&event=${encodeURIComponent(title)}#contact-form" class="btn btn-primary" style="padding: 0.75rem 1.25rem; font-size: 0.85rem; flex: 1; text-align: center; white-space: nowrap;">RSVP Now</a>
        <a href="${link}" target="_blank" class="btn btn-outline" style="padding: 0.75rem 1.25rem; font-size: 0.85rem; flex: 1; text-align: center; white-space: nowrap;">Add to Cal</a>
      </div>
    `;
    container.appendChild(eventCard);
  });

  // Re-initialize icons for dynamic content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
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
      date: 'MAY 15',
      description: 'Join us for a networking session with local business leaders. Light breakfast provided.',
      cta: 'RSVP Now'
    },
    {
      title: '📚 Business Workshop: Growth',
      date: 'MAY 22',
      description: 'Learn how to leverage new tools to grow your business in the modern economy.',
      cta: 'Register'
    },
    {
      title: '🤝 Annual General Meeting',
      date: 'JUN 08',
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
        <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="calendar" width="18" height="18" style="color: var(--accent-teal);"></i>
          ${event.title}
        </h3>
        <span style="background: var(--primary-dark); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">${event.date}</span>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${event.description}</p>
      <div style="display: flex; gap: 0.75rem; margin-top: auto; flex-wrap: wrap;">
        <a href="contact.html?inquiry=events&event=${encodeURIComponent(event.title)}#contact-form" class="btn btn-primary" style="padding: 0.75rem 1.25rem; font-size: 0.85rem; flex: 1; text-align: center; white-space: nowrap;">${event.cta}</a>
        <a href="kbevents.html" class="btn btn-outline" style="padding: 0.75rem 1.25rem; font-size: 0.85rem; flex: 1; text-align: center; white-space: nowrap;">View Calendar</a>
      </div>
    `;
    container.appendChild(eventCard);
  });

  // Re-initialize icons for dynamic content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Utility: Console logging for debugging
if (typeof console !== 'undefined') {
  console.log('KBF Website initialized');
  console.log('Events URL:', EVENTS_JSON_URL);
  console.log('Modern redesign loaded successfully');
}

/**
 * Membership Prorata Logic
 * Calculates the remaining months in the year and updates the membership price.
 * Formula: R100 per month remaining (including current month if before the 20th).
 */
function initializeMembershipProrata() {
  const priceDisplay = document.getElementById('prorated-price-display');
  const amountInput = document.getElementById('new-member-amount');
  const itemNameInput = document.getElementById('new-member-item-name');
  const itemDescInput = document.getElementById('new-member-item-description');
  const prorataInfo = document.getElementById('prorata-info');

  if (!priceDisplay || !amountInput) return;

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentDay = now.getDate();

  // If we are not in 2026, this logic might need adjustment,
  // but the site is specifically for "Membership 2026".
  // For the purpose of this task, we assume we are calculating for 2026.

  let monthsRemaining = 12 - currentMonth;
  if (currentDay >= 20) {
    monthsRemaining -= 1;
  }

  // Ensure at least 1 month is charged if it's late in the year
  if (monthsRemaining <= 0) {
    monthsRemaining = 1;
  }

  const proratedAmount = monthsRemaining * 100;

  // Update DOM
  priceDisplay.textContent = `R${proratedAmount.toLocaleString()}`;
  amountInput.value = proratedAmount;

  if (prorataInfo) {
    prorataInfo.textContent = `Prorated for ${monthsRemaining} month${monthsRemaining > 1 ? 's' : ''} remaining in 2026`;
  }

  if (itemNameInput) {
    itemNameInput.value = `KBF - Annual Membership 2026 (New Member - ${monthsRemaining} Months)`;
  }

  if (itemDescInput) {
    itemDescInput.value = `Access for the remainder of the 2026 calendar year (${monthsRemaining} month${monthsRemaining > 1 ? 's' : ''}).`;
  }
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
