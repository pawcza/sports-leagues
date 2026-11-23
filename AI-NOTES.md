# AI tools used

## How I worked

I built this with **Claude Code** (Anthropic's CLI, Claude Sonnet 5.5) as a pair-programming partner: I acted as product owner and tech lead, Claude as the implementer.

**What I decided and drove**

- **Stack and tooling:** React, and shadcn/ui, motion and a proper icon library for the UI (after rejecting AI-drawn SVG icons). The rest of the stack (Vite, TanStack Query for the required caching, Tailwind, Vitest/MSW/Playwright) was proposed by Claude and agreed with me.
- **Product and UX:** the list grouped into sport categories with docked headers, a single sticky icon-only toolbar (search, sport dropdown, sort, reset) designed mobile-first, the full-screen badge view using View Transitions, the season filter, one column of cards on phones, newest badge on each card, the Demo data toggle.
- **Quality bar:** I reviewed the running app on desktop and phone after every change and sent screenshots with precise feedback over many rounds, so most details (spacing, centring, dropdown polish, animation behaviour, where the reset button lives) are the result of that loop. Several first attempts were rejected and redone.
- **Scope and delivery:** I questioned the API behaviour when something looked off (that is how the 5-season cap was found), asked for the bundle size and request count to be investigated, and set the review order.

**What Claude Code did**

- Probed both API endpoints live, which surfaced the free-key limits (10 leagues, all Soccer; only the 5 oldest seasons per league; per-IP rate limit; `null` badges).
- Scaffolded the project and wrote the implementation, the unit/component tests (Vitest, MSW) and the Playwright smoke tests, using screenshots at phone and desktop widths to check layouts.
- Measured the cold-load requests and the bundle, and drafted the README.

**Other tools:** the shadcn/ui CLI generated the base components (Button, Input, Select, Sheet, Skeleton). Phosphor and lucide are icon libraries, not AI output.
