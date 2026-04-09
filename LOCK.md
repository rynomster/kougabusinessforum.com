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
| T1-T8 | Main Agent | 2026-03-30 15:30 UTC | Sprint 3 complete - Homepage redesign, committee section, CSS logo |
| T2 | Main Agent | 2026-03-30 14:00 UTC | Component mapping from mockup |
| T3 | Main Agent | 2026-03-30 13:00 UTC | New CSS architecture |
| T4-T6 | Main Agent | 2026-03-30 11:00 UTC | Homepage redesign |

---

## Locking Protocol

### How to Claim a Task

1. **Check Active Locks** - Review this file for active tasks
2. **Read Current Status** - Check TODO.md for context
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

## Sub-Agent Guidelines

### Before Starting

1. ✅ Check if task is already locked
2. ✅ Review TODO.md for context and dependencies
3. ✅ Confirm task is appropriate for your role
4. ✅ Check if prerequisites are pending

### While Working

1. 🔄 Update lock status as work progresses
2. 📝 Add notes if you hit blockers
3. 🤝 Notify main agent if you need assistance

### When Done

1. ✅ Update lock to "Complete" with summary
2. ✅ Commit code with relevant task ID
3. ✅ Update TODO.md to reflect completion
4. ✅ Notify main agent

---

## Quick Reference

**Available Tasks:**

| Task | Description | Priority |
|------|-------------|----------|
| P1 | RSS Feed Sync Testing | Medium |
| P2 | Form Backend Integration | High |
| P3 | Business Directory Page | High |
| P4 | About Us Page | Medium |
| P5 | Contact Page | Medium |
| P6 | Image Optimization | Low |

---

## Emergency Override

In case of emergencies (server down, critical bug):

1. Mark task as `🔴 Emergency` in Active Locks
2. Add emergency context in Notes
3. Notify all team members immediately
4. Revert lock after resolution

---

## Last Updated

**2026-03-30 15:35 UTC** - All locks cleared, Sprint 3 complete

**Maintained by:** Jock (Main Agent)
