import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { SeasonBadge } from '@/lib/api'
import { cn } from '@/lib/utils'
import { SportIcon } from './SportIcon'

interface Props {
  sport: string
  newest: SeasonBadge | undefined
  settled: boolean
}

/** Newest season badge, with a skeleton while loading and the sport icon when there is none. */
export function LeagueThumb({ sport, newest, settled }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className="relative grid size-10 shrink-0 place-items-center sm:size-11">
      {newest ? (
        <>
          {!loaded && <Skeleton className="absolute size-8 rounded-full" />}
          <img
            ref={(el) => {
              if (el?.complete) setLoaded(true)
            }}
            src={newest.badge}
            alt=""
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              'size-full object-contain drop-shadow-md transition duration-500',
              loaded ? 'scale-100 opacity-100 blur-0' : 'scale-90 opacity-0 blur-md',
            )}
          />
        </>
      ) : settled ? (
        <SportIcon sport={sport} className="size-7 text-muted-foreground/70" />
      ) : (
        <Skeleton className="size-8 rounded-full" />
      )}
    </span>
  )
}
