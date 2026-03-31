# 📋 TODO.md - Task Tracking

## Current Sprint: Sprint 5 - Directory Membership System

### Completed ✅

| Task | Description | Status | Notes |
|------|-------------|--------|-------|
| T1 | Website Structure | ✅ Complete | All pages created |
| T2 | Design System | ✅ Complete | CSS centralized |
| T3 | Committee Section | ✅ Complete | 10 members with photos |
| T4 | Community Events | ✅ Complete | 50 events, auto-sync |
| T5 | Membership Page | ✅ Complete | R1,200/year, R100/month |
| T6 | SEO Basics | ✅ Complete | sitemap, robots, meta |
| T7 | Mobile Responsive | ✅ Complete | Hamburger menu |
| T8 | Login Removal | ✅ Complete | No backend needed |
| T9 | Privacy Policy | ✅ Complete | POPIA compliant |

### In Progress 🔄

| Task | Description | Status | Notes |
|------|-------------|--------|-------|
| T10 | Directory Badges | 🔄 In Progress | Add paid member badges (🔵/⚪) |
| T11 | Business Submission Form | 🔄 In Progress | Add new businesses |
| T12 | PayFast Integration | 🔄 In Progress | Add Payment/Subscribe buttons |
| T13 | Directory Backend | 🔄 In Progress | Define listing storage (JSON/Database) |

### Pending ⏳

| Task | Description | Priority | Notes |
|------|-------------|----------|-------|
| P1 | Formspree Setup | High | User to sign up |
| P2 | Member Payment Status | High | Who's paid for 2026 |
| P3 | WordPress Migration | Medium | Meeting minutes, newsletters |
| P4 | PayFast Integration | Medium | Sync with directory |
| P5 | KBF Events Content | Medium | 2026 events calendar |
| P6 | Accessibility Audit | Low | WCAG compliance |

---

## Directory Membership System (Current Focus)

### Current Listing Mechanism
- **Storage:** Currently static in `directory.html` / `directory.json`
- **Submission:** Form present but needs backend (Formspree/API)
- **Badges:** 🔵 (Verified/Paid) vs ⚪ (Basic) logic to be finalized

### Badge System
```
🔵 KBF Verified Member = Paid 2026 membership
⚪ Basic Listing = Free/guest listing
```

### Implementation Tasks
1. Add badge field to business data
2. Show badge on directory cards
3. Show/hide contact details based on status
4. Add "Request Details" button for non-members
5. **Add PayFast Payment/Subscribe buttons**

---

## Completed Sprints

### Sprint 1: Foundation ✅
- [x] Initial site structure
- [x] Base CSS styling
- [x] JavaScript interactivity
- [x] GitHub Actions workflow

### Sprint 2: Visual Overhaul ✅
- [x] Modern CSS design
- [x] Color palette (Cyan/Teal)
- [x] Navigation with mobile menu
- [x] Footer design

### Sprint 3: Content & Polish ✅
- [x] Committee with photos
- [x] CSS logo
- [x] Hero section
- [x] All pages connected

### Sprint 4: Events & Pages ✅
- [x] Community events (RSS sync)
- [x] KBF events placeholder
- [x] Membership page
- [x] Privacy policy

### Sprint 5: Directory Membership 🔄
- [x] Remove login
- [x] Standardize Header/Footer Build System
- [ ] Badge system
- [ ] Submission form
- [ ] Contact details visibility
- [ ] PayFast Subscribe/Pay buttons

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Tasks | 17 |
| Completed | 10 |
| In Progress | 4 |
| Pending | 6 |
| Completion % | 58% |

---

## Last Updated

**2026-03-31 16:30 UTC** - Added PayFast and Directory Backend tasks

**Maintained by:** Jock (Main Agent)
