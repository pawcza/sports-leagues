import { QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion, MotionConfig } from 'motion/react'
import { lazy, Suspense, useDeferredValue, useMemo } from 'react'
import { BadgeAside } from '@/components/BadgeAside'
import { Footer } from '@/components/Footer'
import { LeagueList } from '@/components/LeagueList'
import { PageHeader } from '@/components/PageHeader'
import { Toolbar } from '@/components/Toolbar'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { filterLeagues, groupBySport, sortLeagues, sportOptions } from '@/lib/filter'
import { PAGE_WIDTH } from '@/lib/layout'
import { queryClient, useLeagues } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui'

// Not needed for the first paint: loaded as its own chunk.
const BadgeSheet = lazy(() => import('@/components/BadgeSheet').then((m) => ({ default: m.BadgeSheet })))

/** Derives what to show from the two sources of state (server data + UI state) and composes the page. */
function Leagues() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const select = useUiStore((s) => s.select)

  // Server data -> filtered, sorted, grouped.
  const leagues = useLeagues(useUiStore((s) => s.demo))
  const query = useDeferredValue(useUiStore((s) => s.query))
  const sport = useUiStore((s) => s.sport)
  const sort = useUiStore((s) => s.sort)
  const sports = useMemo(() => sportOptions(leagues.data ?? []), [leagues.data])
  const groups = useMemo(
    () => groupBySport(sortLeagues(filterLeagues(leagues.data ?? [], query, sport), sort)),
    [leagues.data, query, sport, sort],
  )

  // The user's pick, or on desktop the first visible league until they have picked (or lost) a selection.
  const picked = useUiStore((s) => s.selected)
  const autoPick = useUiStore((s) => s.autoPick)
  const selected = picked ?? (autoPick && isDesktop ? (groups[0]?.leagues[0] ?? null) : null)

  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader />
      <Toolbar sports={sports} total={leagues.data?.length ?? 0} />

      <div className={cn(PAGE_WIDTH, 'flex flex-1 flex-col gap-8 pt-6 pb-8 sm:pt-8')}>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <LeagueList leagues={leagues} groups={groups} selectedId={selected?.id ?? ''} />
          {isDesktop && <BadgeAside league={selected} />}
        </div>

        {!isDesktop && (
          <Suspense fallback={null}>
            <BadgeSheet league={selected} onClose={() => select(null)} />
          </Suspense>
        )}

        <Footer />
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
