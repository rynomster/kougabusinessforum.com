# 🗺️ KBF Website - Roadmap

**Last Updated:** 2026-04-23
**Current Phase:** Phase 3 — Content Migration & Backend

> **How to use this file:** ROADMAP.md shows the big picture — what's been done across each phase and what's coming next. For day-to-day task tracking, see [TODO.md](TODO.md). For detailed project state, see [PROGRESS.md](PROGRESS.md). For task coordination, see [LOCK.md](LOCK.md).

---

## ✅ Phase 1 — Build & Launch (Complete)
*March 2026*

- [x] Homepage with hero, features, committee, gallery
- [x] Business Directory with search, filters, badge system
- [x] About Us, Contact, Membership, Events pages
- [x] CSS architecture, responsive design, favicon
- [x] SEO (sitemap, robots.txt, meta tags, Open Graph)
- [x] GitHub repo, branch protection, GitHub Pages deployment
- [x] Privacy Policy (POPIA compliant)

---

## ✅ Phase 2 — Integrations & Automation (Complete)
*March–April 2026*

- [x] Google Sheets → Directory auto-sync (GitHub Actions)
- [x] RSS feed sync for community events (6-hour interval)
- [x] Calendar sync for KBF events (6-hour interval)
- [x] Cloudflare Worker for form handling (code complete, wrangler.toml fixed)
- [x] Directory paid-member badge system (🔵/⚪)
- [x] Team collaboration protocol (AGENTS.md, LOCK.md)

---

## 🔄 Phase 3 — Content Migration & Backend (Current)
*April 2026*

- [x] WordPress backup downloaded and extracted (1 GB)
- [x] Documents page — AGM minutes, financial statements, notices, correspondence
- [x] Archives page — Newsletters (Nuusbrief 2019/2020), reports
- [x] 16 PDFs organized with clean naming conventions
- [x] Navigation updated across all 11 pages
- [x] Content polish, local SEO, advocacy section (PRs #65–#68, #70, #72, #73)
- [ ] **Deploy Cloudflare Worker** — blocked by invalid `CLOUDFLARE_ACCOUNT_ID` secret (fix: update secret in GitHub)
- [ ] **Deploy RSS worker proxy** — blocked until Worker deploy is fixed
- [ ] **Locate 2021–2022 AGM minutes** — 5-year legal requirement (have 2023 & 2024 only)

---

## 📅 Phase 4 — Payments & Member Management
*Target: Q2 2026*

- [ ] PayFast integration — online membership payments
- [ ] Payment status sync with directory badges
- [ ] Member payment tracking for 2026
- [ ] Confirm real social media URLs (FB, LinkedIn, Twitter, Instagram)
- [ ] GOOGLE_SHEET_ID secret → activate directory auto-sync

---

## 📅 Phase 5 — Polish & Growth
*Target: Q3 2026*

- [ ] SEO & accessibility audit (WCAG compliance)
- [ ] SEO & accessibility audit (WCAG compliance)
- [ ] Google Analytics setup
- [ ] Custom domain SSL optimization (Cloudflare + GitHub Pages)
- [ ] Event registration integration
- [ ] Performance optimization (image compression, lazy loading)

---

## 🔮 Future Considerations

- Newsletter email automation (Mailchimp / Cloudflare Worker)
- Afrikaans / bilingual support
- Admin dashboard for committee (member management, event CRUD)
- Mobile app or PWA
- Sponsor/advertising section
- Member-only content section

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Pages live | 11 |
| PDFs hosted | 16 |
| Committee members | 10 |
| Directory listings | Synced from Google Sheets |
| Community events | 50 (auto-synced) |
| PRs merged | 74 |
| Overall completion | ~90% |

---

*See also: [TODO.md](TODO.md) · [PROGRESS.md](PROGRESS.md) · [LOCK.md](LOCK.md)*
