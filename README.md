# Kouga Business Forum Website

A modern, fast, and fully responsive website built with pure HTML5, CSS3, and Vanilla JavaScript for the Kouga Business Forum (KBF).

## 🌐 Live Site

**https://new.kougabusinessforum.com/**

## 📁 Project Structure

```
kbf-web-2026/
├── index.html              # Homepage
├── directory.html         # Business Directory (with membership badges)
├── about.html            # About Us + Committee
├── contact.html          # Contact Form
├── membership.html       # Membership Pricing (2026)
├── kbevents.html        # KBF Official Events
├── events.html          # Community Events (auto-synced)
├── privacy-policy.html    # Privacy Policy (POPIA)
├── 404.html             # Error Page
├── sitemap.xml          # SEO Sitemap
├── robots.txt          # Crawler Config
├── favicon.svg         # Site Icon
├── css/
│   └── style.css      # Centralized Styles
├── js/
│   └── main.js         # Interactive Functionality
├── images/
│   ├── [committee photos]
│   ├── events/        # Event Images (auto-synced)
│   └── [category images]
├── .github/
│   └── workflows/
│       └── rss-sync.yml  # Auto-sync Community Events
└── README.md
```

## 🎨 Design System

### Color Palette
- Primary Dark: `#1a1a2e` (Header/Footer)
- Accent Cyan: `#06c8ff` (Primary accent)
- Accent Teal: `#0e7996` (Secondary accent)
- Background: `#f8f9fa`

### Typography
- Font: Inter (Google Fonts)
- Weights: 400-800

## 📱 Pages

| Page | Description |
|------|-------------|
| Home | Hero, features, committee, gallery, join form |
| Directory | Business listings with search & filters |
| About | Committee members with photos |
| Contact | Contact form & information |
| Membership | 2026 pricing (R1,200/year or R100/month) |
| KBF Events | Official KBF events (placeholder) |
| Community Events | Auto-synced from 9ty9.co.za |
| Privacy Policy | POPIA compliant |

## 🔧 Features

- ✅ Fully Responsive (mobile-first)
- ✅ Fast Loading (no dependencies)
- ✅ Auto-synced Community Events (every 6 hours)
- ✅ SEO Optimized (sitemap, meta tags)
- ✅ Accessibility Friendly
- ✅ Modern CSS Design System
- ✅ Membership Directory Ready
- ✅ Form Backend Ready (Formspree)

## 💰 Membership Pricing (2026)

- **Annual:** R1,200/year
- **Monthly:** R200 + R100/month (via PayFast)
- **Complimentary:** Free for NGOs, schools, churches

## 🔐 Directory Membership System

```
🔵 KBF Verified Member = Paid 2026 membership (full details)
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
npm install
node sync-events.js
```

## 📞 Contact

**Kouga Business Forum**
- Email: office@kougabusinessforum.com
- Phone: 063 902 1597
- Location: Jeffreys Bay, Kouga Region

**Regions:** Jeffreys Bay, Humansdorp, St. Francis Bay, Hankey, Patensie, Loerie, Thornhill

---

Built with ❤️ for the Kouga Business Community
