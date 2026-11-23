import { dehydrate, hydrate, type QueryClient } from '@tanstack/react-query'
import { API_KEY } from './api'

const KEY = `sports-leagues:query-cache:v1:${API_KEY}`
const MAX_AGE = 24 * 60 * 60 * 1000

/** Restores the query cache from localStorage and keeps it saved, so reloads don't re-hit the rate-limited API. */
export function persistQueryCache(client: QueryClient) {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw) as { savedAt: number; state: Parameters<typeof hydrate>[1] }
      if (Date.now() - saved.savedAt < MAX_AGE) hydrate(client, saved.state)
    }
  } catch {
    localStorage.removeItem(KEY)
  }

  let timer: ReturnType<typeof setTimeout>
  client.getQueryCache().subscribe(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), state: dehydrate(client) }))
      } catch {
        // storage full or unavailable: caching in memory is still fine
      }
    }, 500)
  })
}
