# AI tools and design decisions

## AI tools

- **Claude Code** (Anthropic's CLI, Claude Sonnet 5.5) worked in the repo and terminal as my implementation partner. It probed both API endpoints live, scaffolded the project, wrote the components, store, tests (Vitest + MSW, Playwright) and the first drafts of the docs, and took phone and desktop screenshots so layouts could be reviewed.
- **shadcn/ui CLI** generated the base components (Button, Input, Select, Sheet, Skeleton). Phosphor and lucide are icon libraries.

How I used them: I set the product and UX direction, reviewed the running app on desktop and phone after every change, and sent back precise feedback until it met the bar. That loop produced most of the details, and several first attempts were rejected and redone (hand-drawn SVG icons, per-league colours, a segmented sort control, a floating reset button).

## Design decisions

**Work with what the API really returns.** The free key gives 10 leagues (all Soccer), only the 5 oldest seasons per league, and rate-limits per IP, which browsers report as a CORS error because the 429 has no CORS headers. So the sport dropdown follows the brief and appears only when several sports exist; a **Demo data** switch in the header shows the multi-sport UI; `VITE_SPORTSDB_KEY` lets a premium key lift every cap; a season filter appears only for leagues with many seasons.

**Two kinds of state, two tools.**
- *Server state* (leagues, badges) is in **TanStack Query**: cached, de-duplicated and persisted to `localStorage` per API key, so a reload costs no requests. That covers "cache responses to avoid repeat calls" and keeps us inside the rate limit.
- *UI state* (search, sport, sort, selection, demo flag) is in one typed **Zustand** store, not in the URL and not persisted, so every load starts from the default view. Components subscribe to single slices, so typing in search does not re-render the badge panel.
- *Derived data* (filter → sort → group) is pure functions in `lib/filter.ts`, unit tested. The rule "a selection the filters hide is cleared" lives in the store's actions, not in an effect.

**Requests are spent deliberately.** A league's badge is fetched once: when its card scrolls into view (for the thumbnail), on hover/focus intent, or on click, whichever comes first. A click is usually a cache hit. A cold first load is 11 requests (1 list + 10 badges), a third of the per-minute limit; with a real key only visible cards fetch.

**The list is organised around the data.** Leagues are grouped by sport, so `strSport` is shown once per category (with its icon and count) rather than repeated on every card. Search, sport, sort and reset sit in one sticky toolbar that is icon-only on phones, and category headers dock under it on phones and tablets. Grid is 1 / 2 / 3 columns, with a side panel on desktop and a bottom sheet on mobile.

**The badge is the hero.** Each league shows its newest badge, the panel offers every season, and the badge opens in a full view that morphs out of the thumbnail using the native View Transitions API on a native `<dialog>` (focus trap and Esc for free; plain open/close where unsupported).

**Fast and robust by default.** Entry chunk is about 340 kB (110 kB gzipped): sport icons load per sport, and the badge panel, sheet and motion features are code-split. Null badges and unknown leagues are handled, there are loading, error and empty states, and `prefers-reduced-motion` is respected.

**Verified at two levels.** Unit and component tests cover filtering, sorting, grouping, the store rules, caching (one lookup per league) and persistence. Playwright smoke tests run against a mocked API at phone and desktop widths and check grouping, grid columns, sticky docking, search/sort/reset and the full-badge view.

## Trade-offs

State is not in the URL, so views are not shareable. See the README for how to run everything and for the API limits in detail.
