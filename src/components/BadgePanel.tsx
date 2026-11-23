import { AlertCircle, ImageOff, Maximize2, RotateCw, Search } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { League } from '@/lib/api'
import { ease } from '@/lib/motion'
import { useBadges } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { runViewTransition } from '@/lib/viewTransition'
import { BadgeViewer } from './BadgeViewer'
import { SportIcon } from './SportIcon'

/** Leagues with more seasons than this get a season filter (the free API key returns only 5). */
const SEASON_SEARCH_MIN = 12

export function BadgePanel({ league }: { league: League }) {
  const { data: seasons, isPending, isError, refetch, isFetching } = useBadges(league.id)
  const [picked, setPicked] = useState<string | null>(null)
  const [seasonQuery, setSeasonQuery] = useState('')
  const active = seasons?.find((s) => s.season === picked) ?? seasons?.at(-1)
  const shown = [...(seasons ?? [])].reverse().filter((s) => s.season.includes(seasonQuery.trim()))

  const [viewerOpen, setViewerOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const thumbRef = useRef<HTMLImageElement | null>(null)

  // Shared-element morph: the thumbnail is named `badge` for the "old" snapshot, then the modal image takes the name.
  const openViewer = (thumb: HTMLImageElement) => {
    thumbRef.current = thumb
    thumb.style.viewTransitionName = 'badge'
    void runViewTransition(() => {
      thumb.style.viewTransitionName = ''
      flushSync(() => setViewerOpen(true))
      dialogRef.current?.showModal()
    })
  }
  const closeViewer = () => {
    const thumb = thumbRef.current
    void runViewTransition(() => {
      dialogRef.current?.close()
      flushSync(() => setViewerOpen(false))
      if (thumb) thumb.style.viewTransitionName = 'badge'
    }).then(() => {
      if (thumb) thumb.style.viewTransitionName = ''
    })
  }

  return (
    <m.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25">
          <SportIcon sport={league.sport} className="size-6" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg leading-tight font-semibold tracking-tight">{league.name}</h2>
          <p className="text-sm text-muted-foreground">{league.sport}</p>
        </div>
      </div>

      <div className="relative isolate grid aspect-square place-items-center overflow-hidden rounded-3xl border border-white/8 bg-[radial-gradient(circle_at_50%_40%,oklch(0.84_0.2_150/0.2),transparent_65%),linear-gradient(to_bottom,oklch(0.22_0.02_255),oklch(0.17_0.014_255))]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.04)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(circle,black_30%,transparent_75%)]"
        />

        {isPending && <Skeleton className="size-40 rounded-full" />}

        {isError && (
          <div role="alert" className="flex flex-col items-center gap-3 p-6 text-center">
            <AlertCircle className="size-8 text-destructive" aria-hidden />
            <p className="text-sm text-muted-foreground">Couldn't load badges.</p>
            <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RotateCw /> Retry
            </Button>
          </div>
        )}

        {seasons && !active && (
          <div className="flex flex-col items-center gap-2 p-6 text-center text-muted-foreground">
            <ImageOff className="size-8" aria-hidden />
            <p className="text-sm">No badge available for this league.</p>
          </div>
        )}

        <AnimatePresence>
          {active && (
            <BadgeImage
              key={active.badge}
              src={active.badge}
              alt={`${league.name} badge, season ${active.season}`}
              onOpen={openViewer}
            />
          )}
        </AnimatePresence>

        {active && (
          <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Maximize2 className="size-3" aria-hidden /> View
          </span>
        )}

        {active && (
          <span className="absolute right-3 bottom-3 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-xs font-medium tabular-nums backdrop-blur">
            Season {active.season}
          </span>
        )}
      </div>

      {seasons && seasons.length > 1 && active && (
        <div>
          <p className="mb-2.5 text-sm font-medium text-muted-foreground">
            Seasons <span className="tabular-nums">({seasons.length})</span>
          </p>
          {seasons.length > SEASON_SEARCH_MIN && (
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-foreground/70" aria-hidden />
              <Input
                type="search"
                value={seasonQuery}
                onChange={(e) => setSeasonQuery(e.target.value)}
                placeholder="Filter by year…"
                aria-label="Filter seasons by year"
                className="h-10 rounded-xl border-white/10 bg-card/70 pl-9 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Season">
            {shown.map(({ season }) => {
              const on = season === active.season
              return (
                <button
                  key={season}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(season)}
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
        </div>
      )}
      {active && (
        <BadgeViewer
          dialogRef={dialogRef}
          open={viewerOpen}
          onClose={closeViewer}
          league={league}
          season={active.season}
          src={active.badge}
          alt={`${league.name} badge, season ${active.season}`}
        />
      )}
    </m.div>
  )
}

/** Blurs in once the image has actually loaded, fades out when replaced. */
function BadgeImage({ src, alt, onOpen }: { src: string; alt: string; onOpen: (img: HTMLImageElement) => void }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <m.div
      className="absolute inset-0 grid place-items-center"
      initial={{ opacity: 0, filter: 'blur(18px)', scale: 0.9 }}
      animate={loaded ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : { opacity: 0, filter: 'blur(18px)', scale: 0.9 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.7, ease }}
    >
      <button
        type="button"
        aria-label="View full badge"
        onClick={(e) => {
          const img = e.currentTarget.querySelector('img')
          if (img) onOpen(img)
        }}
        className="absolute inset-0 grid cursor-zoom-in place-items-center outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-inset"
      >
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className="max-h-[62%] max-w-[62%] animate-float object-contain drop-shadow-[0_20px_30px_rgb(0_0_0/0.45)]"
        />
      </button>
    </m.div>
  )
}
