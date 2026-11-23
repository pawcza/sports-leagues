# AI tools used

**Claude Code** (Anthropic's CLI; Claude Sonnet 5.5) was used throughout, working directly in the repo and terminal:

- **Brainstorming the stack and checking the APIs.** I asked it to verify both endpoints live. That is how the free-key limits (10 leagues, all Soccer, only the 5 oldest seasons per league), the `null` badge cases and the per-IP rate limit were found, and why the sport dropdown and demo mode exist.
- **Scaffolding and implementation**: Vite + React + TypeScript setup, the data/caching layer, components, styling and animations.
- **Tests**: Vitest/MSW unit and component tests, and a Playwright smoke test whose screenshots at phone and desktop widths were used to review the layout.
- **Iterating on the UI.** The design was directed by me reviewing the running app in the browser and sending screenshots with feedback ("these icons are ugly", "make the toolbar sticky", "group by sport"), which Claude then implemented. Several of its first attempts were rejected or reworked (hand-drawn SVG icons, per-league colours, a segmented sort control).
- **These notes**, drafted by Claude.

**shadcn/ui CLI** generated the base components (Button, Input, Select, Sheet, Skeleton). Icon sets (Phosphor, lucide) are libraries, not AI-generated.

Product decisions (React, TanStack Query for the required caching, URL-synced state, a conditional sport dropdown, demo mode) were agreed with the AI in conversation; the code was reviewed and run by me.
