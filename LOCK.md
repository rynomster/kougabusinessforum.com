# 🔒 LOCK.md - Task Locking & Coordination

## Purpose

This file prevents concurrent work on the same tasks by multiple agents or sub-agents. When a task is claimed, it's locked until completion or explicit release.

---

## Active Locks

| Task ID | Lock Holder | Started | Est. Duration | Status | Notes |
|---------|-------------|---------|---------------|--------|-------|
| - | None | - | - | - | All tasks currently available |

---

## Recent Completions

| Task ID | Holder | Completed | Summary |
|---------|--------|-----------|---------|
| WP-MIG | SureThing Bot | 2026-04-15 | WordPress content migration — Documents & Archives pages, 16 PDFs organized, nav/footer/sitemap updated |
| T1-T8 | Main Agent | 2026-03-30 15:30 UTC | Sprint 3 complete - Homepage redesign, committee section, CSS logo |
| T2 | Main Agent | 2026-03-30 14:00 UTC | Component mapping from mockup |
| T3 | Main Agent | 2026-03-30 13:00 UTC | New CSS architecture |
| T4-T6 | Main Agent | 2026-03-30 11:00 UTC | Homepage redesign |

---

## Locking Protocol

### How to Claim a Task

1. **Check Active Locks** - Review this file for active tasks
2. **Read Current Status** - Check PROGRESS.md for context
3. **Claim the Task** - Add your lock entry above
4. **Start Working** - Begin implementation
5. **Update Progress** - Keep the lock file updated as you work

### How to Release a Lock

**Complete the task:**
```
| T# | Agent | YYYY-MM-DD HH:MM UTC | ~Xh | ✅ Complete | [Summary]
```

**Release early (before completion):**
```
| T# | Agent | YYYY-MM-DD HH:MM UTC | ~Xh | 🔄 Released | [Reason]
```

---

## Conflict Resolution

| Scenario | Resolution |
|----------|------------|
| **Double-lock** | Later agent must wait or choose different task |
| **Lost lock** | Re-acquire task before starting, document loss reason |
| **Task blocked** | Mark as blocked, document blocker, notify team |

---

## Quick Reference

**Available Tasks:**

| Task | Description | Priority |
|------|-------------|----------|
| P1 | RSS Feed Sync — Deploy worker proxy to bypass Cloudflare 403 | Medium |
| P2 | Form Backend — Deploy Cloudflare Worker (code ready, needs wrangler deploy) | High |
| P3 | PayFast Payment Integration | Medium |
| P4 | SEO & Accessibility Audit | Low |
| P5 | Custom Domain SSL (Cloudflare + GitHub Pages) | Low |
| P6 | Meeting Minutes Compliance — Locate 2021–2022 AGM minutes (5-year legal req) | High |

---

## Last Updated

**2026-04-16 00:27 SAST** - WP-MIG completed, available tasks updated

**Maintained by:** Project Agent (SureThing)
