# 🤖 AGENTS.md - Team & Collaboration

## Overview

This file documents the team structure, roles, and collaboration protocols for the KBF website project.

---

## Team Structure

### Main Agent (Lead Orchestrator)

| Role | Responsibilities | Contact |
|------|------------------|---------|
| **Project Lead** | Overall coordination, task assignment | Main session |
| **Architect** | Technical decisions, system design | `office@kougabusinessforum.com` |
| **Lead Designer** | Visual direction, UX decisions | See above |
| **Primary Reviewer** | Quality assurance, final approval | See above |

**Current Main Agent:** SureThing (AI Assistant — Project Agent)

---

## Current Project Status

### Phase Progress

| Phase | Status | Completion | Focus |
|-------|--------|------------|-------|
| Phase 1: Build & Launch | ✅ Complete | 100% | Site structure, pages, SEO, GitHub deploy |
| Phase 2: Integrations & Automation | ✅ Complete | 100% | Sheets sync, RSS, calendar, Worker code |
| Phase 3: Content & Backend | 🔄 In Progress | ~85% | WordPress migration ✅, Worker deploy ❌ blocked |
| Phase 4: Payments & Members | ⏳ Pending | 0% | PayFast, member management |
| Phase 5: Polish & Growth | ⏳ Pending | 0% | SEO audit, Analytics, performance |

**Overall Project:** ~90% Complete (36 of ~40 tasks done)

### Current Blocker
🔴 **Cloudflare Worker deploy failing** — `CLOUDFLARE_ACCOUNT_ID` GitHub secret is invalid (error 7003).
**Fix:** Go to [Cloudflare dashboard](https://dash.cloudflare.com) → Account overview → copy Account ID from right sidebar → GitHub repo Settings → Secrets → Actions → `CLOUDFLARE_ACCOUNT_ID`.

---

## Active Automated Bots

### 🌱 SteadyGrow
Handles SEO, content quality, accessibility, and conversion improvements. Raises PRs automatically on `main`.

### ⭐ NorthStar
Handles strategic content improvements — advocacy, positioning, impact sections.

### 🤖 Codex
Handles technical fixes — worker config, route corrections, bug fixes.

---

## GitHub Secrets Status

| Secret | Status | Purpose |
|--------|--------|--------|
| `CLOUDFLARE_API_TOKEN` | ✅ Set | Worker deployment auth |
| `CLOUDFLARE_ACCOUNT_ID` | ⚠️ Invalid | Worker deployment — needs correct value from Cloudflare dashboard |
| `GOOGLE_SHEET_ID` | ⏳ Pending | Directory auto-sync |

---

## Collaboration Workflow

```
1. Check LOCK.md — is the task free?
2. Check TODO.md — task details and dependencies
3. Claim the task in LOCK.md
4. Do the work, commit, raise PR
5. Update TODO.md and LOCK.md on completion
```

---

## Onboarding New Agents

1. ✅ Read AGENTS.md
2. ✅ Read LOCK.md
3. ✅ Review TODO.md
4. ✅ Identify your role
5. ✅ Claim first available task in LOCK.md
6. ✅ Update status on completion

---

## Last Updated

**2026-04-23** — Updated to reflect Phase 1–2 complete, Phase 3 in progress (~90%); Worker deploy blocked by invalid Account ID secret; 74 PRs merged total; SteadyGrow, NorthStar, Codex bots active.

**Maintained by:** SureThing (Project Agent)

---

**Current Phase:** Phase 3 — Content Migration & Backend 🔄
**Next Milestone:** Deploy Cloudflare Worker (fix Account ID secret)
