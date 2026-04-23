# 📋 TODO.md - Task Tracking

**Last Updated:** 2026-04-23
**Current Phase:** Post-Launch Maintenance (Phase 3)

> **How to use this file:** TODO.md tracks individual tasks with completion status. Check here for what's done and what's next. For the big picture, see [ROADMAP.md](ROADMAP.md). For current progress and project state, see [PROGRESS.md](PROGRESS.md). For task coordination, see [LOCK.md](LOCK.md).

---

## 🔄 Active Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| P1 | Deploy Cloudflare Worker (forms) | 🔴 High | ❌ Failing | Error 7003 — `CLOUDFLARE_ACCOUNT_ID` GitHub secret is invalid; fix by updating secret with correct ID from Cloudflare dashboard |
| P2 | Locate 2021–2022 AGM minutes | 🔴 High | ⏳ Waiting on client | 5-year legal requirement; have 2023 & 2024 only |
| P3 | Member payment status (2026) | 🔴 High | ⏳ Waiting on client | Need paid member list to update directory badges |
| P4 | Deploy RSS worker proxy | 🟡 Medium | 🔧 Code ready | Bypass Cloudflare 403 for event sync; code in `workers/src/index.js`; depends on P1 being fixed |
| P5 | PayFast payment sync | 🟡 Medium | ⏳ Pending | Sync online payments with directory badges |
| P6 | Confirm social media URLs | 🟡 Medium | ⏳ Waiting on client | Footer has placeholders — need real FB/LinkedIn/Twitter/Instagram |
| P7 | SEO & Accessibility audit | 🟢 Low | ⏳ Pending | WCAG compliance review |
| P8 | Google Analytics setup | 🟢 Low | ⏳ Pending | Not yet configured |
| P9 | Custom domain SSL | 🟢 Low | ⏳ Pending | Cloudflare + GitHub Pages optimization |
| P10 | GOOGLE_SHEET_ID GitHub secret | 🟡 Medium | ⏳ Waiting on client | Needed for directory auto-sync workflow |

---

## ✅ Completed Tasks

### Sprint 7: Automated Improvements & Worker Debug (April 2026)
| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| T27 | Membership page upgrade | 2026-04-23 | Lucide icons, improved contrast, professional layout (PR #73) |
| T28 | Wrangler log capture on failure | 2026-04-23 | Debug tooling for worker deploy (PR #74) |
| T29 | KBF Events SEO & accessibility | 2026-04-22 | Improved branding, meta, ARIA (PR #72) |
| T30 | Fix worker route/zone config | 2026-04-22 | Correct Cloudflare route and zone (PR #69) |
| T31 | Worker config modernize + error 7003 attempt | 2026-04-22 | Wrangler.toml fixed; root cause is invalid Account ID secret (PR #71) |
| T32 | Homepage events accuracy & accessibility | 2026-04-22 | Updated events data, ARIA improvements (PR #70) |
| T33 | CTA deep-link optimization | 2026-04-22 | Homepage conversion path deep-linking (PR #68) |
| T34 | Advocacy & impact section | 2026-04-22 | NorthStar improvement (PR #67) |
| T35 | Local credibility & towns | 2026-04-22 | SEO locality signals (PR #66) |
| T36 | Content polish | 2026-04-22 | SteadyGrow copy & layout improvements (PR #65) |

### Sprint 6: WordPress Content Migration ✅ (April 2026)
| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| T18 | Download WordPress backup | 2026-04-15 | 1 GB .wpress via Google Drive |
| T19 | Extract & inventory content | 2026-04-15 | 2,150 files, 127 MB DB |
| T20 | Build Documents page | 2026-04-15 | AGM minutes, financial statements, notices, correspondence |
| T21 | Build Archives page | 2026-04-15 | Newsletters (Nuusbrief 2019/2020), reports |
| T22 | Organize & rename 16 PDFs | 2026-04-15 | Clean naming: `agm-minutes-YYYY-MM-DD.pdf` etc. |
| T23 | Merge 2020 Nuusbrief pages | 2026-04-15 | 20 individual pages → single PDF |
| T24 | Update nav/footer/sitemap | 2026-04-15 | "Documents" link added across all 11 pages |
| T25 | Push to GitHub (PR #60) | 2026-04-15 | 33 files, merged to main |
| T26 | Update LOCK.md & PROGRESS.md | 2026-04-16 | PR #62 — project tracking updated |

### Sprint 5: Directory Membership System ✅
| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| T10 | Directory badge system | ✅ | Paid member badges (🔵/⚪) |
| T11 | Business submission form | ✅ | Form ready for backend |
| T12 | PayFast buttons | ✅ | Payment buttons on membership page |
| T13 | Google Sheets integration | ✅ | Auto-sync directory from Sheets |
| T14 | Header standardization (build.js) | ✅ | Consistent headers across all pages |
| T15 | Homepage dynamic events | ✅ | Dynamic loading from events.json |
| T16 | Homepage layout refactor | ✅ | Aligned with target structure |
| T17 | Landing page event switch | ✅ | KBF events shown instead of community events |

### Sprint 1–4: Foundation → Events ✅
| ID | Task | Notes |
|----|------|-------|
| T1 | Website structure | All pages created |
| T2 | Design system | CSS centralized with variables |
| T3 | Committee section | 10 members with photos |
| T4 | Community events | 50 events, auto-sync from 9ty9.co.za |
| T5 | Membership page | R200+R100/mo or R1200 annual; Lucide icons upgraded |
| T6 | SEO basics | Sitemap, robots.txt, meta tags, Open Graph |
| T7 | Mobile responsive | Hamburger menu |
| T8 | Login removal | No backend needed |
| T9 | Privacy policy | POPIA compliant |

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| Total completed | 36 |
| Active/pending | 10 |
| Waiting on client | 4 (P2, P3, P6, P10) |
| Blocked/failing | 1 (P1 — account ID fix needed) |
| Ready to deploy | 1 (P4 — after P1 fixed) |
| Overall | ~90% complete |

---

*See also: [ROADMAP.md](ROADMAP.md) · [PROGRESS.md](PROGRESS.md) · [LOCK.md](LOCK.md)*
