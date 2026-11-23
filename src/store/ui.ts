import { create } from 'zustand'
import type { League } from '@/lib/api'
import { ALL_SPORTS, filterLeagues, type SortKey } from '@/lib/filter'
import { isDemoLeagueId } from '@/lib/mock'

/**
 * UI state: what the user has asked for. Server data (the leagues, their badges) lives in TanStack Query;
 * this store holds only filters, sort, the selection and the demo flag, and nothing is persisted.
 */
interface UiState {
  query: string
  sport: string
  sort: SortKey
  /** The league the user picked. Invariant: it always matches the current filters (actions clear it otherwise). */
  selected: League | null
  /** Desktop opens the first visible league until the user has picked (or lost) a selection of their own. */
  autoPick: boolean
  demo: boolean

  setQuery: (query: string) => void
  setSport: (sport: string) => void
  setSort: (sort: SortKey) => void
  select: (league: League | null) => void
  setDemo: (demo: boolean) => void
  reset: () => void
}

type Filters = Pick<UiState, 'query' | 'sport'>

const matches = (league: League, { query, sport }: Filters) => filterLeagues([league], query, sport).length > 0

/** Applies a filter change, clearing a selection that the new filters would hide. */
function withFilters(state: UiState, patch: Partial<Filters>): Partial<UiState> {
  const next = { query: state.query, sport: state.sport, ...patch }
  const hidden = state.selected !== null && !matches(state.selected, next)
  return { ...patch, ...(hidden ? { selected: null, autoPick: false } : {}) }
}

export const useUiStore = create<UiState>()((set) => ({
  query: '',
  sport: ALL_SPORTS,
  sort: 'default',
  selected: null,
  autoPick: true,
  demo: false,

  setQuery: (query) => set((s) => withFilters(s, { query })),
  setSport: (sport) => set((s) => withFilters(s, { sport })),
  setSort: (sort) => set({ sort }),
  select: (selected) => set({ selected, autoPick: false }),
  setDemo: (demo) =>
    set((s) => (!demo && s.selected && isDemoLeagueId(s.selected.id) ? { demo, selected: null, autoPick: false } : { demo })),
  reset: () => set({ query: '', sport: ALL_SPORTS, sort: 'default' }),
}))
