# Kouga Business Forum Website

A lightweight, fast, and fully responsive website built with pure HTML5, CSS3, and Vanilla JavaScript for the Kouga Business Forum.

## 🚀 Features

- **Fully Responsive:** Works seamlessly on desktop, tablet, and mobile devices
- **Fast & Lightweight:** No external dependencies, zero bloat
- **Accessible:** Semantic HTML5 structure
- **SEO-Ready:** Meta tags, proper headings, and semantic markup
- **Interactive:** Smooth scrolling, filterable directory, responsive forms

## 📁 Project Structure

```
kouga-business-forum/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Interactive functionality
├── events.json         # Events data (auto-synced via GitHub Actions)
├── news.json           # News articles (auto-synced via GitHub Actions)
├── README.md           # This file
├── .github/
│   └── workflows/
│       └── rss-sync.yml # RSS feed sync workflow
├── .gitignore
└── package.json        # Node.js dependencies (for GitHub Actions)
```

## 🔄 RSS Feed Integration

The RSS feed sync is handled by a GitHub Actions workflow located in `.github/workflows/rss-sync.yml` that:
1. Fetches the KBF RSS feed
2. Parses the events and news articles
3. Generates static `events.json` and `news.json` files
4. Commits the files to the repository

**To enable automatic sync:**

1. Set the RSS secret key in your repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Create a new secret named `RSS_SECRET_KEY`
   - Paste your secret key

2. Uncomment the schedule line in `rss-sync.yml`:
   ```yaml
   schedule:
     - cron: '0 0 * * *'  # Daily at midnight UTC
   ```

The workflow can also be triggered manually via the GitHub Actions dropdown menu.

## 🎨 Design

The design features the KBF coastal color palette:
- Primary Blue: `#1a5f7a`
- Secondary Blue: `#2c7893`
- Sand Beige: `#f4e4c1`
- Sand Light: `#fff8f0`
- Green: `#5c8d6a`

## 📦 Getting Started

### Local Development

1. Simply open `index.html` in your browser
2. No build process or server required!

### Build for Production

```bash
# No build needed - just deploy the files as-is
```

## 🌐 Hosting

### GitHub Pages (Recommended)

1. Create a repository on GitHub
2. Push the folder contents
3. Enable GitHub Pages in Settings → Pages
4. Your site will be live at: `https://<username>.github.io/kouga-business-forum/`

### Cloudflare Pages

1. Sign in to Cloudflare Dashboard
2. Create a new Pages project
3. Connect your GitHub repository
4. Deploy!

## 📝 Adding Members

Edit `js/main.js` and modify the `sampleMembers` array:

```javascript
const sampleMembers = [
  {
    name: "Your Business",
    category: "construction",
    location: "jeffreys-bay",
    logo: "🏗️"
  },
  // ... more members
];
```

Categories:
- `construction`
- `retail`
- `tourism`
- `services`
- `agriculture`

Locations:
- `jeffreys-bay`
- `humansdorp`
- `st-francis`
- `hankey`
- `patensie`
- `loerie`

## 🔄 RSS Feed Integration

The RSS feed sync is handled by a GitHub Actions workflow that:
1. Fetches the KBF RSS feed
2. Parses the events
3. Generates a static `events.json` file
4. Commits the file to the repository

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 🛠️ Development

All JavaScript is contained in `js/main.js` with:
- Directory filtering
- Form handling
- Smooth scrolling
- Responsive event listeners

## 📞 Contact

Kouga Business Forum
- Email: office@kougabusinessforum.com
- Phone: 084 681 3702
- Address: Jeffreys Bay, South Africa

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ for the Kouga Community
