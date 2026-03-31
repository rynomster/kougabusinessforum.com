# KBF Website

A modern, fast, and fully responsive website for the Kouga Business Forum (KBF), built with pure HTML5, CSS3, and Vanilla JavaScript.

## 🌐 Live Site

**https://new.kougabusinessforum.com/**

**GitHub:** https://github.com/rynomster/kbf-web-2026

## 📁 Project Structure

```
kbf-web-2026/
├── index.html              # Homepage
├── directory.html          # Business Directory with searchable listings
├── directory.json          # Directory data store (auto-synced from Google Sheets)
├── about.html             # About Us + Committee (10 members)
├── contact.html           # Contact Form (Formspree ready)
├── membership.html        # 2026 Membership Pricing
├── kbevents.html          # KBF Official Events (placeholder)
├── events.html            # Community Events (auto-synced from RSS)
├── privacy-policy.html    # POPIA compliant Privacy Policy
├── 404.html              # Custom Error Page
├── sitemap.xml           # SEO Sitemap
├── robots.txt            # Crawler Config
├── favicon.svg           # Site Icon
├── css/
│   └── style.css        # Centralized Styles with variables
├── js/
│   ├── main.js          # Interactive Functionality
│   ├── directory.js     # Directory search & filter logic
│   └── rss-sync.js      # Community Events RSS Sync
├── images/
│   ├── committee/       # 10 member photos
│   ├── events/          # 43 event images
│   └── [category images]
├── templates/
│   ├── header.html      # Reusable Header
│   └── footer.html      # Reusable Footer
├── .github/
│   └── workflows/
│       ├── rss-sync.yml  # Auto-sync Community Events (every 6 hours)
│       └── sync-directory.yml  # Auto-sync Directory from Google Sheets
├── DIRECTORY_GUIDE.md    # How to manage directory listings
├── build.js             # Header/Footer standardization script
├── AGENTS.md            # Team collaboration protocol
├── TODO.md              # Current sprint tasks
├── PROGRESS.md          # Overall project progress
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Dark:** `#1a1a2e` (Header/Footer)
- **Accent Cyan:** `#06c8ff` (Primary accent)
- **Accent Teal:** `#0e7996` (Secondary accent)
- **Background:** `#f8f9fa`

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 400-800

## 📱 Pages

| Page | Description | Status |
|------|-------------|--------|
| Home | Hero, features, committee, gallery, directory preview, join form | ✅ Live |
| Directory | Business listings with search & category/location filters | ✅ Live |
| About | Committee members with photos | ✅ Live |
| Contact | Contact form & information | ✅ Live |
| Membership | 2026 pricing (R200 + R100/mo or R1200 annual) | ✅ Live |
| KBF Events | Official KBF events | ✅ Placeholder |
| Community Events | Auto-synced from RSS | ✅ Auto-synced |
| Privacy Policy | POPIA compliant | ✅ Live |
| 404 | Custom error page | ✅ Live |

## 🔧 Features

- ✅ Fully Responsive (mobile-first)
- ✅ Fast Loading (no dependencies, vanilla JS)
- ✅ Auto-synced Community Events (every 6 hours via GitHub Actions)
- ✅ **Directory with Search & Filter functionality (with badge system)**
- ✅ **Directory data sync from Google Sheets**
- ✅ SEO Optimized (sitemap, robots.txt, meta tags)
- ✅ Accessibility Friendly
- ✅ Modern CSS Design System with Variables
- ✅ **Header/Footer Build System for consistency**
- ✅ **GitHub Actions CI/CD workflows**
- ✅ **Team collaboration protocol (AGENTS.md)**

## 💰 Membership Pricing (2026)

### Monthly Option
- **R200 one-time registration fee** (one-time only)
- **R100 per month** (ongoing subscription)
- **Total per year:** R1,400
- **Savings vs Annual:** R200/year

### Annual Option
- **R1,200 one-time** (existing members, full year access)

### New Members / Remaining Months
- **R100 per month** for remaining months of the year
- *Example:* Joining in April = 9 months × R100 = **R900**

### Complimentary
- **Free** for NGOs, schools, churches

## 🔐 Directory Membership System

```bash
🔵 KBF Verified Member = Paid 2026 membership (full details visible)
⚪ Basic Listing = Free/guest listing (limited details)
```

## 📅 Events

- **Community Events:** Auto-synced from https://9ty9.co.za/event/feed/
- **KBF Events:** Placeholder - add when finalized

## 🚀 Development

### Push to GitHub
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Local RSS Sync
```bash
node js/rss-sync.js
```

### Local Directory Sync
```bash
# Requires Google Sheet ID as secret
# Configured in .github/workflows/sync-directory.yml
```

## 📞 Contact

**Kouga Business Forum**
- Email: office@kougabusinessforum.com
- Phone: 063 902 1597 (mobile)
- Location: Jeffreys Bay, Kouga Region

**Regions:** Jeffreys Bay, Humansdorp, St. Francis Bay, Hankey, Patensie, Loerie, Thornhill

---

Built with ❤️ for the Kouga Business Community

Last Updated: 2026-03-31