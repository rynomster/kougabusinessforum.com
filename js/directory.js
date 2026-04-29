/**
 * KBF Business Directory Logic
 * Handles fetching, filtering, and rendering of business listings.
 */

// Configuration
const DIRECTORY_JSON_URL = 'directory.json';

// State
let allBusinesses = [];
let categoryFilter = 'all';
let locationFilter = 'all';

const categoryNames = {
    'construction': 'Construction & Building',
    'retail': 'Retail & Shopping',
    'tourism': 'Tourism & Hospitality',
    'agriculture': 'Agriculture & Farming',
    'services': 'Services & Trade',
    'professional': 'Professional Services',
    'automotive': 'Automotive',
    'health': 'Health & Wellness',
    'education': 'Education & Training',
    'finance': 'Finance & Insurance',
    'other': 'Other'
};

/**
 * Initialize Directory
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    categoryFilter = urlParams.get('category') || 'all';
    locationFilter = urlParams.get('location') || 'all';

    initializeFilters();
    loadDirectoryData();
});

/**
 * Fetch directory data from JSON
 */
async function loadDirectoryData() {
    try {
        const response = await fetch(DIRECTORY_JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allBusinesses = data.listings || [];

        updateFilterButtonStates();
        renderDirectory();
    } catch (error) {
        console.error('Error loading directory data:', error);
        const countEl = document.getElementById('resultCount');
        if (countEl) {
            countEl.textContent = 'Unable to load directory listings. Please try again later.';
        }
    }
}

/**
 * Initialize Filter Event Listeners
 */
function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderDirectory();
        });
    }

    // Category filters
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            categoryFilter = this.dataset.filter;
            renderDirectory();
        });
    });

    // Location filters
    document.querySelectorAll('[data-location]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-location]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            locationFilter = this.dataset.location;
            renderDirectory();
        });
    });
}

/**
 * Update active states of filter buttons based on current filters
 */
function updateFilterButtonStates() {
    if (categoryFilter !== 'all') {
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === categoryFilter);
        });
    }
    if (locationFilter !== 'all') {
        document.querySelectorAll('[data-location]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.location === locationFilter);
        });
    }
}

/**
 * Get display name for locations
 */
function getDisplayName(loc) {
    const names = {
        'jeffreys-bay': 'Jeffreys Bay',
        'humansdorp': 'Humansdorp',
        'st-francis-bay': 'St. Francis Bay',
        'hankey': 'Hankey',
        'patensie': 'Patensie',
        'loerie': 'Loerie',
        'thornhill': 'Thornhill'
    };
    return names[loc] || loc;
}

/**
 * Filter businesses based on search query and active filters
 */
function getFilteredBusinesses() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    return allBusinesses.filter(b => {
        const locationName = getDisplayName(b.location || '').toLowerCase();
        const categoryName = (categoryNames[b.category] || b.category || '').toLowerCase();
        const matchQuery = query === '' ||
                           (b.name || '').toLowerCase().includes(query) ||
                           (b.description || '').toLowerCase().includes(query) ||
                           (b.location || '').toLowerCase().includes(query) ||
                           locationName.includes(query) ||
                           categoryName.includes(query);
        const matchCategory = categoryFilter === 'all' || b.category === categoryFilter;
        const matchLocation = locationFilter === 'all' || b.location === locationFilter;
        return matchQuery && matchCategory && matchLocation;
    });
}

/**
 * Render the filtered directory listings
 */
function renderDirectory() {
    const container = document.querySelector('#resultsContainer .grid');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('resultCount');

    if (!container) return;

    const filtered = getFilteredBusinesses();

    if (filtered.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (countEl) countEl.textContent = 'No businesses found';
        return;
    }

    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    if (countEl) {
        countEl.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'business' : 'businesses'}`;
    }

    container.innerHTML = ''; // Clear only the grid container

    filtered.forEach(b => {
        const article = document.createElement('article');
        article.className = b.verified ? 'business-card verified' : 'business-card';

        // Header
        const header = document.createElement('div');
        header.className = 'business-header';

        const icon = document.createElement('div');
        icon.className = 'business-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = b.icon || '🏢';

        const nameContainer = document.createElement('div');
        nameContainer.className = 'business-name';

        const h3 = document.createElement('h3');
        h3.textContent = b.name;

        const badge = document.createElement('span');
        badge.className = `badge ${b.verified ? 'badge-verified' : 'badge-basic'}`;
        badge.textContent = b.verified ? '🔵 KBF Verified' : '⚪ Basic';

        const category = document.createElement('span');
        category.className = 'business-category';
        category.textContent = categoryNames[b.category] || b.category;

        nameContainer.appendChild(h3);
        nameContainer.appendChild(badge);
        nameContainer.appendChild(category);

        header.appendChild(icon);
        header.appendChild(nameContainer);

        // Location
        const location = document.createElement('div');
        location.className = 'business-location';
        location.innerHTML = `<span aria-hidden="true">📍</span> `;
        const locText = document.createTextNode(getDisplayName(b.location));
        location.appendChild(locText);

        // Description
        const description = document.createElement('p');
        description.className = 'business-description';
        description.textContent = b.description;

        // Contact
        const contact = document.createElement('div');
        contact.className = 'business-contact';
        renderContactInfoInto(contact, b);

        article.appendChild(header);
        article.appendChild(location);
        article.appendChild(description);
        article.appendChild(contact);

        container.appendChild(article);
    });
}

/**
 * Render contact info based on verification status
 * Verified members get full details, basic listings get a "Request Details" CTA
 */
function renderContactInfoInto(container, business) {
    if (business.verified) {
        if (business.contact) {
            const tel = document.createElement('a');
            tel.href = `tel:${business.contact}`;
            tel.className = 'contact-item';
            tel.textContent = `📞 ${formatPhoneNumber(business.contact)}`;
            container.appendChild(tel);
        }
        if (business.email) {
            const mail = document.createElement('a');
            mail.href = `mailto:${business.email}`;
            mail.className = 'contact-item';
            mail.textContent = `✉️ ${business.email}`;
            container.appendChild(mail);
        }
        if (business.website) {
            const web = document.createElement('a');
            web.href = business.website;
            web.target = '_blank';
            web.className = 'contact-item';
            web.textContent = '🌐 Website';
            container.appendChild(web);
        }
        if (container.children.length === 0) {
            const muted = document.createElement('span');
            muted.className = 'contact-muted';
            muted.textContent = 'Contact details private';
            container.appendChild(muted);
        }
    } else {
        const requestBtn = document.createElement('a');
        requestBtn.href = `contact.html?inquiry=directory&business=${encodeURIComponent(business.name)}#contact-form`;
        requestBtn.className = 'btn btn-secondary btn-sm';
        requestBtn.style.fontSize = '0.8rem';
        requestBtn.style.padding = '0.5rem 1rem';
        requestBtn.textContent = 'Request Contact Details';

        const upsell = document.createElement('a');
        upsell.href = 'membership.html';
        upsell.className = 'contact-item';
        upsell.style.fontSize = '0.75rem';
        upsell.style.color = 'var(--text-muted)';
        upsell.textContent = 'Unlock with Membership →';

        container.appendChild(requestBtn);
        container.appendChild(upsell);
    }
}

/**
 * Helper to format phone numbers (assuming South African 10-digit)
 */
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
}

/**
 * Reset all filters
 */
window.resetFilters = function() {
    categoryFilter = 'all';
    locationFilter = 'all';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all' || btn.dataset.location === 'all');
    });

    renderDirectory();
};
