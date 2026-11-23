import { useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'
import { m, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { League } from '@/lib/api'
import { ease } from '@/lib/motion'
import { badgesQuery, useBadges } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui'
import { LeagueThumb } from './LeagueThumb'

interface Props {
  league: League
  selected: boolean
  index: number
}

export function LeagueCard({ league, selected, index }: Props) {
  const select = useUiStore((s) => s.select)
  const qc = useQueryClient()
  const ref = useRef<HTMLLIElement>(null)
  // Only league cards that have scrolled near the viewport fetch their badge: the free API is rate-limited.
  const inView = useInView(ref, { once: true, margin: '200px' })
  const { data: seasons, isError } = useBadges(league.id, inView)
  // Warm the badge cache on hover/focus intent (not on every card the cursor crosses): the free API is rate-limited.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prefetch = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => void qc.prefetchQuery(badgesQuery(league.id)), 250)
  }
  const cancel = () => clearTimeout(timer.current)
  useEffect(() => cancel, [])

  return (
    <m.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97, filter: 'blur(8px)' }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease, delay: 0.3 + Math.min(index, 14) * 0.05 },
      }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
    >
      <button
        type="button"
        onClick={() => select(league)}
        onPointerEnter={prefetch}
        onPointerLeave={cancel}
        onFocus={prefetch}
        onBlur={cancel}
        aria-pressed={selected}
        className={cn(
          'group flex w-full items-center gap-2.5 rounded-2xl border border-white/8 bg-card/70 px-3 py-2.5 text-left sm:gap-3 sm:px-4 outline-none backdrop-blur transition-all duration-300',
          'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px] hover:shadow-primary/30',
          'focus-visible:ring-3 focus-visible:ring-ring/60',
          selected && 'border-primary/70 bg-primary/8 shadow-[0_12px_40px_-12px] shadow-primary/40',
        )}
      >
        <LeagueThumb sport={league.sport} newest={seasons?.at(-1)} settled={isError || !!seasons} />
        <span className="line-clamp-2 min-w-0 flex-1 text-sm leading-snug font-medium tracking-tight sm:text-[0.95rem]">{league.name}</span>
        <ArrowUpRight
          className="hidden size-4 shrink-0 text-muted-foreground opacity-0 sm:block transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-aria-pressed:text-primary group-aria-pressed:opacity-100"
          aria-hidden
        />
      </button>
    </m.li>
  )
}
