import { QueryClientProvider } from '@tanstack/react-query'
import { AlertCircle, RotateCw, SearchX, X } from 'lucide-react'
import { LazyMotion, m, MotionConfig } from 'motion/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { BadgePanel } from '@/components/BadgePanel'
import { Filters } from '@/components/Filters'
import { SportSection } from '@/components/SportSection'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useStuck } from '@/hooks/useStuck'
import { useUrlState } from '@/hooks/useUrlState'
import { ALL_SPORTS, filterLeagues, groupBySport, sortLeagues, sportOptions, type SortKey } from '@/lib/filter'
import { MOCK_ENABLED } from '@/lib/mock'
import { ease, rise } from '@/lib/motion'
import { queryClient, useLeagues } from '@/lib/queries'
import { cn } from '@/lib/utils'

const URL_KEYS = ['q', 'sport', 'sort', 'league'] as const

function Leagues() {
  const { data: leagues, isPending, isError, refetch, isFetching } = useLeagues()
  const [url, setUrl] = useUrlState(URL_KEYS)
  const [sentinel, stuck] = useStuck()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const query = useDeferredValue(url.q)
  const sport = url.sport || ALL_SPORTS
  const sort: SortKey = url.sort === 'az' || url.sort === 'za' ? url.sort : 'default'
  const sports = useMemo(() => sportOptions(leagues ?? []), [leagues])
  const visible = useMemo(
    () => sortLeagues(filterLeagues(leagues ?? [], query, sport), sort),
    [leagues, query, sport, sort],
  )
  // On desktop the side panel always has something to show: the first league until one is picked.
  const groups = useMemo(() => groupBySport(visible), [visible])
  // Desktop starts with the first visible league open until the user has picked (or lost) a selection of their own.
  const [autoPick, setAutoPick] = useState(true)
  const candidate = url.league || (autoPick && isDesktop ? (groups[0]?.leagues[0]?.id ?? '') : '')
  const selectedId = visible.some((l) => l.id === candidate) ? candidate : ''

  // Changing the search or sport filter clears a selection that the new filter would hide.
  const applyFilter = (patch: { q?: string; sport?: string }) => {
    const q = patch.q ?? url.q
    const next = patch.sport ?? url.sport
    const hidesPick =
      !!url.league && !filterLeagues(leagues ?? [], q, next || ALL_SPORTS).some((l) => l.id === url.league)
    if (hidesPick) setAutoPick(false)
    setUrl({ ...patch, ...(hidesPick ? { league: '' } : {}) })
  }
  const selected = leagues?.find((l) => l.id === selectedId)

  return (
    <div className="flex min-h-svh flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12 sm:pb-8">
      <m.header variants={rise} initial="hidden" animate="show" custom={0} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Live data · TheSportsDB
          </div>
          {MOCK_ENABLED && (
            <a
              href={window.location.pathname}
              title="Leave demo mode"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300 outline-none hover:bg-amber-400/20 focus-visible:ring-3 focus-visible:ring-amber-400/40"
            >
              Demo data · extra sports added
              <X className="size-3" aria-hidden />
            </a>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-6xl">
          Find your{' '}
          <span className="bg-linear-to-r from-primary via-emerald-300 to-sky-400 bg-clip-text text-transparent">league</span>
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-lg">
          Browse leagues from around the world and flip through their badges, season by season.
        </p>
      </m.header>

      </div>

      <div ref={sentinel} aria-hidden className="-mb-px h-px" />
      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.12 }}
        className={cn(
          'sticky top-0 z-30 border-y border-transparent transition-colors duration-300',
          stuck && 'border-white/8 bg-background/75 backdrop-blur-xl',
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-2.5">
        <Filters
          query={url.q}
          onQueryChange={(q) => applyFilter({ q })}
          sport={sport}
          sports={sports}
          total={leagues?.length ?? 0}
          sort={sort}
          onSortChange={(s) => setUrl({ sort: s === 'default' ? '' : s })}
          onReset={() => setUrl({ q: '', sport: '', sort: '' })}
          onSportChange={(s) => applyFilter({ sport: s === ALL_SPORTS ? '' : s })}
        />
        </div>
      </m.div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pt-6 pb-8 sm:px-6 sm:pt-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <section aria-label="Leagues" className="min-w-0">
          {isPending && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3" aria-busy="true" aria-label="Loading leagues">
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

          {leagues && (
            <>
              <p className="sr-only" aria-live="polite">
                {visible.length} {visible.length === 1 ? 'league' : 'leagues'}
              </p>
              {visible.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                  <SearchX className="size-8" aria-hidden />
                  No leagues match your filters.
                </div>
              ) : (
                <div className="flex flex-col gap-12">
                  {groups.map((g) => (
                    <SportSection
                      key={g.sport}
                      sport={g.sport}
                      leagues={g.leagues}
                      selectedId={selectedId}
                      onSelect={(id) => setUrl({ league: id })}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {isDesktop && (
          <m.aside
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.25}
            aria-label="Season badge"
            className="sticky top-24 rounded-3xl border border-white/8 bg-card/60 p-5 shadow-2xl shadow-black/30 backdrop-blur"
          >
            {selected ? (
              <BadgePanel key={selected.id} league={selected} />
            ) : (
              <div className="grid min-h-64 place-items-center text-center text-sm text-muted-foreground">
                Select a league to see its badge.
              </div>
            )}
          </m.aside>
        )}
      </div>

      {!isDesktop && (
        <Sheet open={!!selected} onOpenChange={(open) => !open && setUrl({ league: '' })}>
          <SheetContent side="bottom" className="max-h-[90svh] overflow-y-auto p-5">
            <SheetHeader className="sr-only">
              <SheetTitle>{selected?.name}</SheetTitle>
              <SheetDescription>Season badge</SheetDescription>
            </SheetHeader>
            {selected && <BadgePanel key={selected.id} league={selected} />}
          </SheetContent>
        </Sheet>
      )}

      <footer className="mt-auto pt-8 text-xs text-muted-foreground">
        Data from{' '}
        <a className="underline underline-offset-2 hover:text-foreground" href="https://www.thesportsdb.com" target="_blank" rel="noreferrer">
          TheSportsDB
        </a>
        .
        {!MOCK_ENABLED && (
          <>
            {' '}
            The free API only returns Soccer:{' '}
            <a className="underline underline-offset-2 hover:text-foreground" href="?mock">
              try the demo with more sports
            </a>
            .
          </>
        )}
      </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={() => import('@/lib/motion-features').then((m) => m.default)} strict>
          <Leagues />
        </LazyMotion>
      </MotionConfig>
    </QueryClientProvider>
  )
}
