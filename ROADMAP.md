# 🗺️ KBF Website - Roadmap

**Last Updated:** 2026-04-16
**Current Phase:** Post-Launch Maintenance (Phase 3)

---

## ✅ Phase 1 — Build & Launch (Complete)
*March 2026*

- [x] Homepage with hero, features, committee, gallery
- [x] Business Directory with search, filters, badge system
- [x] About Us page with 10 committee members
- [x] Contact page with form
- [x] Events page (community events from 9ty9.co.za)
- [x] KBF Events page
- [x] Membership page with 2026 pricing
- [x] CSS architecture, responsive design, favicon
- [x] SEO setup (sitemap, robots.txt, meta tags, Open Graph)
- [x] GitHub repo, branch protection, GitHub Pages
- [x] Privacy Policy (POPIA compliant)

---

## ✅ Phase 2 — Integrations & Automation (Complete)
*March–April 2026*

- [x] Google Sheets → Directory auto-sync (GitHub Actions)
- [x] RSS feed sync for community events (every 6 hours)
- [x] Cloudflare Worker for form handling (membership, directory, newsletter) — code ready
- [x] Directory paid-member badge system (🔵/⚪)
- [x] Social media links in footer
- [x] Team collaboration protocol (AGENTS.md, LOCK.md)

---

## 🔄 Phase 3 — Content Migration & Backend (Current)
*April 2026*

- [x] WordPress backup downloaded and extracted
- [x] Documents page (`documents.html`) — AGM minutes, financial statements, notices, correspondence
- [x] Archives page (`archives.html`) — Newsletters (Nuusbrief 2019/2020), reports
- [x] 16 PDFs organized with clean naming conventions
- [x] Navigation updated across all pages to include Documents
- [ ] **Deploy Cloudflare Worker** — `wrangler deploy` (code ready)
- [ ] **Deploy RSS worker proxy** — bypass Cloudflare 403 for event sync
- [ ] **Locate 2021–2022 AGM minutes** — 5-year legal requirement (have 2023 & 2024 only)

---

## 📅 Phase 4 — Payments & Member Management (Next)
*Target: Q2 2026*

- [ ] PayFast integration — online membership payments
- [ ] Payment status sync with directory badges
- [ ] Member payment tracking for 2026
- [ ] Confirm real social media URLs (FB, LinkedIn, Twitter, Instagram)

---

## 📅 Phase 5 — Polish & Growth
*Target: Q3 2026*

- [ ] SEO & accessibility audit (WCAG compliance)
- [ ] Google Analytics setup
- [ ] Custom domain SSL optimization (Cloudflare + GitHub Pages)
- [ ] Event registration integration
- [ ] Member-only content section (if needed)
- [ ] Performance optimization (image compression, lazy loading)

---

## 🔮 Future Considerations

- Newsletter email automation (Mailchimp / Cloudflare Worker)
- Afrikaans / bilingual support
- Admin dashboard for committee (member management, event CRUD)
- Mobile app or PWA
- Sponsor/advertising section

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Pages live | 11 |
| PDFs hosted | 16 |
| Committee members | 10 |
| Directory listings | Synced from Google Sheets |
| Community events | 50 (auto-synced) |
| Overall completion | ~87% |

---

*Maintained by: Project Agent (SureThing)*
