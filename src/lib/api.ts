import { isMockId, MOCK_LEAGUES } from './mock'

/** The free test key `123` is the default. A premium key (VITE_SPORTSDB_KEY) lifts the free tier's caps. */
export const API_KEY: string = import.meta.env.VITE_SPORTSDB_KEY || '123'

const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`

export interface League {
  id: string
  name: string
  sport: string
}

export interface SeasonBadge {
  season: string
  badge: string
}

interface RawLeague {
  idLeague: string
  strLeague: string
  strSport: string
}

interface RawSeason {
  strSeason: string
  strBadge: string | null
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { signal })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json() as Promise<T>
}

export async function fetchLeagues(demo: boolean, signal?: AbortSignal): Promise<League[]> {
  const data = await getJson<{ leagues: RawLeague[] | null }>('all_leagues.php', signal)
  const raw = demo ? [...(data.leagues ?? []), ...MOCK_LEAGUES] : (data.leagues ?? [])
  return raw.map((l) => ({
    id: l.idLeague,
    name: l.strLeague,
    sport: l.strSport,
  }))
}

/** Seasons that actually have a badge image, oldest first. The API returns `null` for unknown ids or missing badges. */
export async function fetchSeasonBadges(id: string, signal?: AbortSignal): Promise<SeasonBadge[]> {
  if (isMockId(id)) return [] // demo leagues have no real badge: don't spend rate-limited requests on them
  const data = await getJson<{ seasons: RawSeason[] | null }>(
    `search_all_seasons.php?badge=1&id=${encodeURIComponent(id)}`,
    signal,
  )
  return (data.seasons ?? []).flatMap((s) => (s.strBadge ? [{ season: s.strSeason, badge: s.strBadge }] : []))
}
