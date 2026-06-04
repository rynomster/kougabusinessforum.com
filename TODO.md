# 📋 TODO.md - Task Tracking

**Last Updated:** 2026-06-04
**Current Phase:** Phase 3 — Content Migration & Backend

> **How to use this file:** TODO.md tracks individual tasks with completion status. Check here for what's done and what's next. For the big picture, see [ROADMAP.md](ROADMAP.md). For current progress and project state, see [PROGRESS.md](PROGRESS.md).

---

## 🔄 Active Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| P1a | Update `CLOUDFLARE_ACCOUNT_ID` | 🔴 High | ⏳ Waiting on client | Fix error 7003 by providing correct Account ID |
| P1b | Verify Worker Deployment | 🟡 Medium | ⏳ Pending | Run deploy workflow after P1a is resolved |
| P2a | Contact client for 2021-2022 AGM minutes | 🔴 High | ⏳ Waiting on client | Essential for 5-year legal compliance |
| P2b | Upload & link 2021-2022 AGM minutes | 🟢 Low | ⏳ Pending | Depends on P2a |
| P3a | Request 2026 Member Payment List | 🔴 High | ⏳ Waiting on client | Necessary to update directory badges (🔵/⚪) |
| P3b | Update `directory.json` with 2026 status | 🟡 Medium | ⏳ Pending | Depends on P3a |
| P4 | Deploy RSS worker proxy | 🟡 Medium | 🔧 Code ready | Bypass 403 for event sync; depends on P1b |
| P5a | Research PayFast API for member sync | 🟡 Medium | ⏳ Pending | For automated badge updates |
| P5b | Implement PayFast webhook/sync | 🟡 Medium | ⏳ Pending | Depends on P5a |
| P6 | Confirm real social media URLs | 🟢 Low | ⏳ Waiting on client | Replace placeholders in footer |
| P10 | Configure `GOOGLE_SHEET_ID` secret | 🟡 Medium | ⏳ Waiting on client | Activate directory auto-sync workflow |

---

## ✅ Completed Tasks

### Sprint 8: Documentation Refactor (June 2026)
| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| T37 | Refactor AGENTS.md | 2026-06-04 | Optimized for token efficiency (Jules) |
| T38 | Remove LOCK.md | 2026-06-04 | Streamlined single-agent workflow |
| T39 | Update Project Tracking | 2026-06-04 | Synced TODO, PROGRESS, and ROADMAP |

### Sprint 7: Automated Improvements & Worker Debug (April 2026)
| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| T27 | Membership page upgrade | 2026-04-23 | Lucide icons, improved contrast, professional layout |
| T28 | Wrangler log capture on failure | 2026-04-23 | Debug tooling for worker deploy |
| T29 | KBF Events SEO & accessibility | 2026-04-22 | Improved branding, meta, ARIA |
| T30 | Fix worker route/zone config | 2026-04-22 | Correct Cloudflare route and zone |
| T31 | Worker config modernize | 2026-04-22 | Wrangler.toml fixed |
| T32 | Homepage events accuracy | 2026-04-22 | Updated events data, ARIA improvements |
| T33 | CTA deep-link optimization | 2026-04-22 | Homepage conversion path deep-linking |

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| Total completed | 39 |
| Active/pending | 11 |
| Waiting on client | 6 |
| Blocked/failing | 1 (P1a) |
| Overall | ~92% complete |

---

*See also: [ROADMAP.md](ROADMAP.md) · [PROGRESS.md](PROGRESS.md)*
