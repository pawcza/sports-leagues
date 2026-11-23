import type { UseQueryResult } from '@tanstack/react-query'
import { AlertCircle, RotateCw, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { League } from '@/lib/api'
import type { SportGroup } from '@/lib/filter'
import { LEAGUE_GRID } from '@/lib/layout'
import { SportSection } from './SportSection'

interface Props {
  leagues: UseQueryResult<League[]>
  groups: SportGroup[]
  selectedId: string
}

/** The grouped league list and its loading, error and empty states. */
export function LeagueList({ leagues: { data, isPending, isError, isFetching, refetch }, groups, selectedId }: Props) {
  const count = groups.reduce((n, g) => n + g.leagues.length, 0)

  return (
    <section aria-label="Leagues" className="min-w-0">
      {isPending && (
        <div className={LEAGUE_GRID} aria-busy="true" aria-label="Loading leagues">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-[3.75rem] rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
          <AlertCircle className="size-8 text-destructive" aria-hidden />
          <p className="max-w-sm text-muted-foreground">
            Couldn't load leagues. The free API is rate-limited per IP, so if you've been reloading a lot, wait a minute and retry.
          </p>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCw /> Try again
          </Button>
        </div>
      )}

      {data && (
        <>
          <p className="sr-only" aria-live="polite">
            {count} {count === 1 ? 'league' : 'leagues'}
          </p>
          {count === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              <SearchX className="size-8" aria-hidden />
              No leagues match your filters.
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {groups.map((g) => (
                <SportSection key={g.sport} sport={g.sport} leagues={g.leagues} selectedId={selectedId} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
