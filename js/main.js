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
});

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
          newsletterForm.style.display = 'none';
          if (newsletterSuccess) {
            newsletterSuccess.style.display = 'block';
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
      <a href="#contact" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 0.9rem;">${event.cta}</a>
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
