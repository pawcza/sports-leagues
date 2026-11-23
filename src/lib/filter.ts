import type { League } from './api'

export const ALL_SPORTS = 'all'

export function filterLeagues(leagues: League[], query: string, sport: string): League[] {
  const q = query.trim().toLowerCase()
  return leagues.filter(
    (l) => (sport === ALL_SPORTS || l.sport === sport) && (!q || l.name.toLowerCase().includes(q)),
  )
}

export interface SportOption {
  sport: string
  count: number
}

/** Every sport present, with its league count, alphabetical. */
export function sportOptions(leagues: League[]): SportOption[] {
  const counts = new Map<string, number>()
  for (const l of leagues) counts.set(l.sport, (counts.get(l.sport) ?? 0) + 1)
  return [...counts].map(([sport, count]) => ({ sport, count })).sort((a, b) => a.sport.localeCompare(b.sport))
}

export type SortKey = 'default' | 'az' | 'za'

export function sortLeagues(leagues: League[], sort: SortKey): League[] {
  if (sort === 'default') return leagues
  const dir = sort === 'az' ? 1 : -1
  return [...leagues].sort((a, b) => dir * a.name.localeCompare(b.name))
}

export interface SportGroup {
  sport: string
  leagues: League[]
}

/** Groups leagues by sport: biggest group first, then alphabetical. */
export function groupBySport(leagues: League[]): SportGroup[] {
  const map = new Map<string, League[]>()
  for (const l of leagues) map.set(l.sport, [...(map.get(l.sport) ?? []), l])
  return [...map]
    .map(([sport, items]) => ({ sport, leagues: items }))
    .sort((a, b) => b.leagues.length - a.leagues.length || a.sport.localeCompare(b.sport))
}
