import { Search } from 'lucide-react'
import { m } from 'motion/react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** Leagues with more seasons than this get a season filter (the free API key returns only 5). */
const SEASON_SEARCH_MIN = 12

interface Props {
  /** Season names, oldest first (as the API returns them). */
  seasons: string[]
  active: string
  onPick: (season: string) => void
}

export function SeasonPicker({ seasons, active, onPick }: Props) {
  const [filter, setFilter] = useState('')
  const shown = [...seasons].reverse().filter((s) => s.includes(filter.trim()))

  return (
    <div>
      <p className="mb-2.5 text-sm font-medium text-muted-foreground">
        Seasons <span className="tabular-nums">({seasons.length})</span>
      </p>
      {seasons.length > SEASON_SEARCH_MIN && (
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-foreground/70" aria-hidden />
          <Input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by year…"
            aria-label="Filter seasons by year"
            className="h-10 rounded-xl border-white/10 bg-card/70 pl-9 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Season">
        {shown.map((season) => {
          const on = season === active
          return (
            <button
              key={season}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(season)}
              className={cn(
                'relative rounded-full border border-white/10 px-3 py-1 text-xs tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/60',
                on ? 'border-transparent text-primary-foreground' : 'hover:bg-white/8',
              )}
            >
              {on && (
                <m.span
                  layoutId="season-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-[0_0_20px_-2px] shadow-primary/60"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{season}</span>
            </button>
          )
        })}
      </div>
      {shown.length === 0 && <p className="mt-1 text-sm text-muted-foreground">No seasons match “{filter}”.</p>}
    </div>
  )
}
