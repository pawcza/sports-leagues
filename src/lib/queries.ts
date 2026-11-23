import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import { fetchLeagues, fetchSeasonBadges } from './api'
import { persistQueryCache } from './persist'

const HOUR = 60 * 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

persistQueryCache(queryClient)

export const leaguesQuery = (demo: boolean) =>
  queryOptions({
    queryKey: ['leagues', demo],
    queryFn: ({ signal }) => fetchLeagues(demo, signal),
    staleTime: 4 * HOUR, // mirrors the API's own cache-control: max-age=14400
  })

// Historic badges never change, so a league is fetched at most once per session.
export const badgesQuery = (id: string) =>
  queryOptions({
    queryKey: ['badges', id],
    queryFn: ({ signal }) => fetchSeasonBadges(id, signal),
    staleTime: Infinity,
    gcTime: Infinity,
  })

export const useLeagues = (demo: boolean) => useQuery(leaguesQuery(demo))
export const useBadges = (id: string, enabled = true) => useQuery({ ...badgesQuery(id), enabled })
