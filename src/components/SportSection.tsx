import { AnimatePresence, m } from 'motion/react'
import { useStuck } from '@/hooks/useStuck'
import type { League } from '@/lib/api'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { LeagueCard } from './LeagueCard'
import { SportIcon } from './SportIcon'

interface Props {
  sport: string
  leagues: League[]
  selectedId: string
}

/** Height of the sticky toolbar above (px): section headers dock right under it. */
export const TOOLBAR_HEIGHT = 70

export function SportSection({ sport, leagues, selectedId }: Props) {
  const [sentinel, stuck] = useStuck(TOOLBAR_HEIGHT)
  const headingId = `sport-${sport.replace(/\W+/g, '-')}`

  return (
    <section aria-labelledby={headingId}>
      <div ref={sentinel} aria-hidden className="-mb-px h-px" />
      {/* Docks under the toolbar on phones and tablets only: on desktop the side panel makes it unnecessary. */}
      <div
        className={cn(
          'max-lg:sticky max-lg:top-[70px] max-lg:z-20 max-lg:-mx-4 max-lg:border-b max-lg:border-transparent max-lg:px-4 max-lg:transition-colors max-lg:duration-300 sm:max-lg:-mx-6 sm:max-lg:px-6',
          'pt-3',
          stuck && 'max-lg:border-white/8 max-lg:bg-background/92 max-lg:backdrop-blur-xl',
        )}
      >
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <SportIcon sport={sport} className="size-6 text-primary sm:size-7" />
            <h2 id={headingId} className="text-lg font-semibold tracking-tight sm:text-xl">
              {sport}
            </h2>
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {leagues.length} {leagues.length === 1 ? 'league' : 'leagues'}
            </span>
          </div>
          <hr className={cn('mt-3 border-white/10 transition-opacity duration-300', stuck && 'max-lg:opacity-0')} />
        </m.div>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {leagues.map((l, i) => (
            <LeagueCard key={l.id} league={l} index={i} selected={l.id === selectedId} />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  )
}
