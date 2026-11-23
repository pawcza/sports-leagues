import { m } from 'motion/react'
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { League } from '@/lib/api'
import { rise } from '@/lib/motion'

// Not needed for the first paint: loaded as its own chunk.
const BadgePanel = lazy(() => import('./BadgePanel').then((m) => ({ default: m.BadgePanel })))

/** Desktop presentation of the badge panel: a sticky side panel. */
export function BadgeAside({ league }: { league: League | null }) {
  return (
    <m.aside
      variants={rise}
      initial="hidden"
      animate="show"
      custom={0.25}
      aria-label="Season badge"
      className="sticky top-24 rounded-3xl border border-white/8 bg-card/60 p-5 shadow-2xl shadow-black/30 backdrop-blur"
    >
      {league ? (
        <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
          <BadgePanel key={league.id} league={league} />
        </Suspense>
      ) : (
        <div className="grid min-h-64 place-items-center text-center text-sm text-muted-foreground">
          Select a league to see its badge.
        </div>
      )}
    </m.aside>
  )
}
