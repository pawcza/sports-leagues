import { ArrowDownAZ, ArrowUpZA, FilterX, LayoutGrid, ListOrdered, Search } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL_SPORTS, type SortKey, type SportOption } from '@/lib/filter'
import { cn } from '@/lib/utils'
import { SportIcon } from './SportIcon'

interface Props {
  query: string
  onQueryChange: (q: string) => void
  sport: string
  sports: SportOption[]
  total: number
  onSportChange: (s: string) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  onReset: () => void
}

const SORTS = [
  { key: 'default', label: 'Default order', short: 'Default', Icon: ListOrdered },
  { key: 'az', label: 'Name A–Z', short: 'A–Z', Icon: ArrowDownAZ },
  { key: 'za', label: 'Name Z–A', short: 'Z–A', Icon: ArrowUpZA },
] as const

const control = 'h-11! rounded-xl border-white/10 bg-card/70 backdrop-blur sm:h-12!'
const active = 'border-primary/50 bg-primary/10 text-primary'
// Icon-only below `sm`: no chevron, no padding, centred.
const iconOnly = 'max-sm:w-11 max-sm:justify-center max-sm:px-0 max-sm:[&>svg:last-child]:hidden'

function SportLabel({ sport, count, compact }: { sport: string; count: number; compact?: boolean }) {
  return (
    <>
      {sport === ALL_SPORTS ? <LayoutGrid className="size-4 text-primary" /> : <SportIcon sport={sport} className="size-5 text-primary" />}
      <span className={cn(compact && 'max-sm:hidden')}>{sport === ALL_SPORTS ? 'All sports' : sport}</span>
      <span className={cn('ml-auto pl-3 text-xs text-muted-foreground tabular-nums', compact && 'max-sm:hidden')}>{count}</span>
    </>
  )
}

export function Filters({ query, onQueryChange, sport, sports, total, onSportChange, sort, onSortChange, onReset }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  // Per the brief: only offer the sport filter when the response contains several sports.
  const showSport = sports.length > 1
  const dirty = !!query || sport !== ALL_SPORTS || sort !== 'default'
  const countFor = (s: string) => (s === ALL_SPORTS ? total : (sports.find((o) => o.sport === s)?.count ?? 0))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-foreground/70" aria-hidden />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search leagues…"
          aria-label="Search leagues by name"
          className={cn(control, 'pr-11 pl-10 text-base [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none')}
        />
        {/* One absolutely positioned slot: the "/" hint, or the reset button when anything is active. */}
        <AnimatePresence mode="wait" initial={false}>
          {dirty ? (
            <m.button
              key="reset"
              type="button"
              onClick={onReset}
              aria-label="Reset filters"
              title="Reset filters"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 460, damping: 28 }}
              className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-lg border border-destructive/40 bg-destructive/15 text-destructive outline-none hover:bg-destructive/25 focus-visible:ring-3 focus-visible:ring-destructive/40"
            >
              <FilterX className="size-4" />
            </m.button>
          ) : (
            <m.kbd
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-white/10 px-1.5 text-xs text-muted-foreground sm:block"
            >
              /
            </m.kbd>
          )}
        </AnimatePresence>
      </div>

      {showSport && (
        <Select
          value={sport}
          onValueChange={(v) => onSportChange(v ?? ALL_SPORTS)}
          items={[{ value: ALL_SPORTS, label: 'All sports' }, ...sports.map((o) => ({ value: o.sport, label: o.sport }))]}
        >
          <SelectTrigger
            className={cn(control, iconOnly, 'px-3.5 sm:w-52', sport !== ALL_SPORTS && active)}
            aria-label="Filter by sport"
            title="Filter by sport"
          >
            <SelectValue className="max-sm:justify-center">{(v: string) => <SportLabel sport={v} count={countFor(v)} compact />}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end" className="min-w-56">
            {[ALL_SPORTS, ...sports.map((o) => o.sport)].map((s) => (
              <SelectItem key={s} value={s}>
                <SportLabel sport={s} count={countFor(s)} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={sort}
        onValueChange={(v) => onSortChange((v ?? 'default') as SortKey)}
        items={SORTS.map((s) => ({ value: s.key, label: s.label }))}
      >
        <SelectTrigger className={cn(control, iconOnly, 'px-3.5 sm:w-36', sort !== 'default' && active)} aria-label="Sort leagues" title="Sort leagues">
          <SelectValue className="max-sm:justify-center">
            {(v: SortKey) => {
              const { Icon, short } = SORTS.find((s) => s.key === v) ?? SORTS[0]
              return (
                <>
                  <Icon className="size-4 text-primary" />
                  <span className="max-sm:hidden">{short}</span>
                </>
              )
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="min-w-56">
          {SORTS.map(({ key, label, Icon }) => (
            <SelectItem key={key} value={key}>
              <Icon className="text-primary" /> {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  )
}
