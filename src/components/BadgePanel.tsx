import { AlertCircle, ImageOff, Maximize2, RotateCw } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { League } from '@/lib/api'
import { ease } from '@/lib/motion'
import { useBadges } from '@/lib/queries'
import { runViewTransition } from '@/lib/viewTransition'
import { BadgeViewer } from './BadgeViewer'
import { SeasonPicker } from './SeasonPicker'
import { SportIcon } from './SportIcon'

export function BadgePanel({ league }: { league: League }) {
  const { data: seasons, isPending, isError, refetch, isFetching } = useBadges(league.id)
  const [picked, setPicked] = useState<string | null>(null)
  const active = seasons?.find((s) => s.season === picked) ?? seasons?.at(-1)
  const alt = active ? `${league.name} badge, season ${active.season}` : ''

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

      <div className="relative isolate grid aspect-square place-items-center overflow-hidden rounded-3xl border border-white/8 badge-stage">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 badge-stage-grid"
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
              alt={alt}
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
        <SeasonPicker seasons={seasons.map((x) => x.season)} active={active.season} onPick={setPicked} />
      )}

      {active && (
        <BadgeViewer
          dialogRef={dialogRef}
          open={viewerOpen}
          onClose={closeViewer}
          league={league}
          season={active.season}
          src={active.badge}
          alt={alt}
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
