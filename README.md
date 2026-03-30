# Kouga Business Forum Website

A lightweight, fast, and fully responsive website built with pure HTML5, CSS3, and Vanilla JavaScript for the Kouga Business Forum (KBF).

## 🚀 Features

- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Fast & Lightweight** - No external dependencies, zero bloat
- **Modern Design** - CSS-based logo with gradient, cyan accent colors
- **Committee Section** - All 10 committee members with photos
- **Interactive** - Smooth scrolling, filterable directory, responsive forms
- **RSS Integration** - Events synced from 9ty9.co.za feed
- **GitHub Actions** - Automated RSS sync and deployments

## 🌐 Live Site

**https://rynomster.particl.io/kbf-web-2026/**

## 📁 Project Structure

```
kouga-business-forum/
├── index.html              # Main homepage
├── css/
│   ├── style.css          # Main styles
│   └── logo.css           # CSS-based logo styles
├── js/
│   └── main.js           # Interactive functionality
├── directory.html        # Business Directory page
├── images/               # All images and photos
│   ├── KBF-LOGO.png
│   ├── Vice-chair-Lieb-Swiegers.jpg
│   ├── Johannes-Barnard.jpg
│   └── ... (10 committee member photos)
├── events.json           # Events data (auto-synced)
├── news.json             # News articles (auto-synced)
├── README.md             # This file
├── TODO.md               # Task tracking
├── LOCK.md               # Task locking
├── AGENTS.md             # Team collaboration
├── CNAME                 # Custom domain config
├── .github/
│   └── workflows/
│       └── rss-sync.yml  # RSS feed sync workflow
└── .gitignore
```

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#1a1a2e` | Header, footer |
| Primary | `#16213e` | Backgrounds |
| Accent Cyan | `#06c8ff` | Buttons, links, logo |
| Accent Teal | `#0e7996` | Secondary accents |
| White | `#ffffff` | Text on dark |
| Light Gray | `#f8f9fa` | Section backgrounds |

### Typography

- **Font Family:** Inter (Google Fonts)
- **Headings:** 700-800 weight, -0.02em letter-spacing
- **Body:** 400-500 weight, 1.6-1.7 line-height

### Components

- **Cards** - White background, shadow, hover lift effect
- **Buttons** - Gradient backgrounds, rounded-full, shadow
- **Navigation** - Fixed header, smooth hover transitions
- **Forms** - Clean inputs with focus states

## 🔄 RSS Feed Integration

The RSS feed sync is handled by GitHub Actions (`.github/workflows/rss-sync.yml`):
1. Fetches events from `https://9ty9.co.za/event/feed/`
2. Parses Atom feed format
3. Generates static `events.json` file
4. Commits the files to repository

**To enable automatic sync:**
1. The workflow can be triggered manually via GitHub Actions
2. Or uncomment the schedule line in `rss-sync.yml` for daily runs

## 👥 Committee Members

1. **Lieb Swiegers** - Chairman
2. **Johannes Barnard** - Vice-Chair & Treasurer
3. **Dries du Preez** - Executive Committee Member
4. **Gerhard Wilsnacht** - Committee Member
5. **Waldo van Niekerk** - Committee Member
6. **Frank Harpur** - Committee Member
7. **Susan Lottering** - Committee Member
8. **Ryno Matthee** - Committee Member
9. **Jaco Bothma** - Committee Member
10. **Fred Kemp** - Committee Member

## 📱 Sections

- **Hero** - Gradient background, headline, CTA buttons
- **Directory** - Business listing with search & category filters
- **Quick Access** - 4-icon grid navigation
- **Features** - 6 benefit cards with numbered indicators
- **Committee** - Photo grid with roles
- **Gallery** - 6-image grid with overlays
- **Directory** - 6 category cards
- **Events** - 3 event cards with date badges
- **Join** - Membership form
- **Footer** - 4-column layout with regions

## 🛠️ Development

### Local Development

1. Clone the repository
2. Open `index.html` in browser
3. No build process or server required!

### Push to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

## 🌐 Hosting

### GitHub Pages

Site deployed at: `https://rynomster.particl.io/kbf-web-2026/`

### Custom Domain

CNAME file contains: `kbf-web-2026`

## 📞 Contact

**Kouga Business Forum**
- Email: office@kougabusinessforum.com
- Phone: 084 681 3702
- Mobile: 063 902 1597
- Location: Jeffreys Bay, Kouga Region

**Regions Served:**
- Jeffreys Bay
- Humansdorp
- St. Francis Bay
- Hankey
- Patensie
- Loerie
- Thornhill

## 📄 License

Open source - MIT License

---

Built with ❤️ for the Kouga Business Community

**Last Updated:** 2026-03-30

## 📂 Business Directory Page

The **Business Directory** page (`directory.html`) allows users to browse and filter member businesses by:

- **Search**: Real-time filtering by business name, description, or keyword
- **Categories**: Construction, Retail, Tourism, Agriculture, Services, Professional
- **Locations**: Jeffreys Bay, Humansdorp, St. Francis Bay, Hankey, Patensie, Loerie, Thornhill

Features:
- 12 sample businesses across all categories and locations
- Responsive grid layout matching existing design system
- Empty state when no results match
- Pure HTML/CSS/JavaScript - no dependencies

---
