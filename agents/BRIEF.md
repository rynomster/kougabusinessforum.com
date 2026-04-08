# KBF Sprint 6 — Shared Agent Brief

## Project
**KBF Website (kbf-web-2026)**
- Repo: `https://github.com/rynomster/kbf-web-2026/`
- Live: https://new.kougabusinessforum.com/
- Work dir: `/home/rynom/workspace/kouga-business-forum/`
- Branch: `develop` (work here) → PR to `main`

## Stack
- Vanilla HTML/CSS/JS (no framework)
- Centralized CSS: `css/style.css`
- Build script: `build.js` (standardized headers/footers)
- Directory data: `directory.json`

## Brand Guidelines
- **Primary accent:** Cyan `#06c8ff`
- **Secondary accent:** Teal `#0e7996`
- **Dark header/footer:** Navy `#1a1a2e`
- **Hero tagline (new):** "The Voice of Business in the Kouga Region"
- **Tone:** Professional, community-focused, authoritative but accessible
- **Audience:** Kouga region business owners and stakeholders

## Team Protocol
- **Agent A:** Frontend/UI — HTML, CSS, JS, layout, responsiveness
- **Agent B:** Content/UX — copy, messaging, UX flow, structure
- **Workflow:** Agent A builds → Agent B reviews → Agent A fixes → Agent B approves → commit/PR
- **Communication:** Report back to main session after each issue

## Sprint Backlog (in order)
1. **Fix Homepage Hero** — Update headline to "The Voice of Business in the Kouga Region"
2. **Homepage Layout Reorder** — Hero → Intro → Committee → Directory → Events → Gallery → News → Footer
3. **Remove Mission/Vision from Homepage** — Content lives on About page
4. **Slogan & Messaging Finalization** — Lock brand voice across site
5. **Quick Action Cards** — Clickable links: Events, Directory, News, Join
6. **Homepage CTA Clarity** — Standardize: "Join", "View Events", "Explore Directory"
7. **Events Preview Section** — Homepage preview linking to full events page
8. **Gallery Preview Section** — Homepage media showcase
9. **News & Updates Preview** — Chairman communications / news feed
10. **Membership Requirements UX** — Clarify join process, requirements, post-signup flow
11. **Advocacy & Impact Page** — New dedicated page for municipal engagement
12. **Afrikaans Language Strategy** — i18n approach for Afrikaans support

## Code Review Rules
- No console.log left behind
- No inline styles (use CSS classes)
- Mobile-responsive (test via DevTools)
- Semantic HTML (header, nav, main, section, footer)
- Accessibility: alt text on images, aria-labels where needed
- CSS variables from `style.css` — don't redefine colors
