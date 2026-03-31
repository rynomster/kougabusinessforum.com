# 🤖 AGENTS.md - Team & Collaboration

## Overview

This file documents the team structure, roles, and collaboration protocols for the KBF website redesign project.

---

## Team Structure

### Main Agent (Lead Orchestrator)

| Role | Responsibilities | Contact |
|------|------------------|---------|
| **Project Lead** | Overall coordination, task assignment | Main session |
| **Architect** | Technical decisions, system design | `office@kougabusinessforum.com` |
| **Lead Designer** | Visual direction, UX decisions | See above |
| **Primary Reviewer** | Quality assurance, final approval | See above |

**Current Main Agent:** Jock (AI Assistant)

---

## Current Project Status

### Sprint Progress

| Sprint | Status | Completion | Focus |
|--------|--------|------------|-------|
| Sprint 1: Foundation | ✅ Complete | 100% | Site structure, basic styling |
| Sprint 2: Visual Overhaul | ✅ Complete | 100% | Modern CSS design, color palette |
| Sprint 3: Content & Polish | ✅ Complete | 100% | Committee, hero, page connections |
| Sprint 4: Events & Pages | ✅ Complete | 100% | Community events, KBF events, membership |
| Sprint 5: Directory Membership | ✅ Complete | 100% | Directory system, badges, Google Sheets sync |

**Overall Project:** 82% Complete (14 of 17 tasks)

---

## Sub-Agent Roles

### 🧠 Coder

**Responsibilities:**
- HTML/CSS/JS implementation
- Responsive design patterns
- Performance optimization
- Accessibility compliance

**Skills Required:**
- Modern CSS (Grid, Flexbox, Variables)
- Vanilla JavaScript
- Semantic HTML5
- Performance best practices

**Access Level:** Full workspace access

---

### 🎨 Designer

**Responsibilities:**
- Visual design implementation
- Color palette refinement
- Typography system
- Component design system

**Skills Required:**
- Design-to-code translation
- Color theory
- Typography hierarchy
- UI/UX principles

**Access Level:** Design resources, reference materials

---

### 🔍 Researcher

**Responsibilities:**
- Reference site analysis
- Content gathering
- User feedback analysis
- Competitor analysis

**Skills Required:**
- Web analysis
- Content curation
- Pattern recognition
- Documentation

**Access Level:** Research tools, reference sites

---

### ✅ Reviewer

**Responsibilities:**
- Code quality assurance
- Cross-browser testing
- Accessibility audit
- Performance review

**Skills Required:**
- Testing methodologies
- Accessibility standards (WCAG)
- Performance metrics
- Code review best practices

**Access Level:** Testing environments, linters

---

### 🔄 Coordinator

**Responsibilities:**
- Task tracking and synchronization
- Lock management
- Progress reporting
- Communication hub

**Skills Required:**
- Project management
- Communication
- Organization
- Time tracking

**Access Level:** Full workspace, all tools

---

## Collaboration Workflow

### Daily Cycle

```
1. Morning Standup (9:00 UTC)
   └─ Review LOCK.md for active tasks
   └─ Check TODO.md for sprint progress
   └─ Identify blockers

2. Active Work (9:30 - 17:00 UTC)
   └─ Agents work on assigned tasks
   └─ Update LOCK.md status
   └─ Flag issues immediately

3. Afternoon Sync (15:00 UTC)
   └─ Quick status check
   └─ Reassign if needed
   └─ Address blockers

4. End of Day (17:00 UTC)
   └─ Commit completed work
   └─ Update TODO.md
   └─ Plan for next day
```

---

## Communication Protocol

| Situation | Channel | Protocol |
|-----------|---------|----------|
| **Urgent blocker** | Main session | Immediate notification |
| **Task reassignment** | LOCK.md + TODO.md | Document reason |
| **Design decisions** | Design doc + Main session | Reference commit |
| **Code changes** | PR + Comments | Link to task |
| **Status updates** | LOCK.md | Daily minimum |

### Response Expectations

- **Urgent issues:** Immediate (< 15 min)
- **Blockers:** Within 30 min
- **General questions:** Within 2 hours
- **Code reviews:** Within 4 hours

---

## Tool Usage

### LOCK.md
- **Check before starting:** ✅ Always
- **Update during work:** ✅ Every 2-4 hours
- **Release on completion:** ✅ Immediately

### TODO.md
- **Read before starting:** ✅ Always
- **Update on completion:** ✅ Immediately
- **Add new tasks:** ✅ As identified

### Main Session
- **For:** Urgent communication, major decisions
- **Check:** Daily morning and end of day
- **Use:** When LOCK.md/TODO.md insufficient

---

## Emergency Protocol

### Red Flags (Immediate Attention)

1. 🔴 **Server/Deployment issues**
   - Notify main agent immediately
   - Document in LOCK.md as `🔴 Emergency`
   - Escalate if unresolved in 30 min

2. 🔴 **Data loss or corruption**
   - Stop all work immediately
   - Notify main agent
   - Begin recovery procedure

3. 🔴 **Security concerns**
   - Lock all tasks
   - Notify main agent
   - Follow security incident protocol

### Yellow Flags (Prompt Attention)

1. 🟡 **Multiple blockers** (2+)
   - Flag in LOCK.md
   - Notify main agent within 1 hour
   - Consider task reassignment

2. 🟡 **Extended delays** (> 2x estimated time)
   - Update LOCK.md with new estimate
   - Notify main agent
   - Assess if task needs splitting

3. 🟡 **Scope creep**
   - Document in task notes
   - Request formal scope change
   - Update TODO.md if accepted

---

## Performance Guidelines

### Optimal Load

| Agent Type | Concurrent Tasks | Focus Time | Breaks |
|------------|------------------|------------|--------|
| Coder | 1-2 | 90 min | 15 min |
| Designer | 1 | 60 min | 30 min |
| Researcher | 1-2 | 45 min | 15 min |
| Reviewer | 2-3 | 60 min | 15 min |
| Coordinator | 5+ (monitoring) | Continuous | 30 min |

### Quality Standards

- **Code:** No console errors, passes accessibility audit
- **Design:** Matches design system, responsive on all breakpoints
- **Documentation:** All changes documented in TODO.md
- **Communication:** All blockers resolved within 4 hours

---

## Onboarding New Agents

### Quick Start

1. ✅ Read AGENTS.md
2. ✅ Read LOCK.md
3. ✅ Review TODO.md
4. ✅ Identify your role
5. ✅ Claim first available task
6. ✅ Update status in LOCK.md

### First Week Goals

- [ ] Complete 3 small tasks
- [ ] Request a code/design review
- [ ] Mentor a new agent
- [ ] Document one process improvement

---

## GitHub Integration

### PAT Access

- **Token:** Configured in git remote URL
- **Permissions:** Full repo, issues, PRs
- **Status:** ✅ Working

### Push Commands

```bash
# Already configured with PAT
git push origin main
```

---

## Last Updated

**2026-03-31 22:15 UTC** - Updated pricing: R200 reg + R100/mo or R1200 annual; new R100/mo remaining

**Maintained by:** Jock (Main Agent)

---

> "The goal isn't to work together. It's to work on the same thing, together." — Adapted from Eric Schmidt

---

**Current Sprint:** Sprint 5 - Directory Membership System ✅ Complete
**Next Phase:** Post-Launch Maintenance & Polish