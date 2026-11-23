import { X } from 'lucide-react'
import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import type { League } from '@/lib/api'
import { SportIcon } from './SportIcon'

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>
  open: boolean
  onClose: () => void
  league: League
  season: string
  src: string
  alt: string
}

/** Native <dialog>: focus trap, Esc and inert background for free. The image carries the shared view-transition name. */
export function BadgeViewer({ dialogRef, open, onClose, league, season, src, alt }: Props) {
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="badge-viewer-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(92vw,42rem)] max-w-none overflow-visible bg-transparent p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-md open:flex"
    >
      {open && (
        <div className="relative isolate flex w-full flex-col items-center gap-6 overflow-hidden rounded-3xl border border-white/10 badge-stage px-6 pt-14 pb-10 shadow-2xl shadow-black/60 sm:px-12">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 badge-stage-grid"
          />
          <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={onClose} aria-label="Close">
            <X />
          </Button>

          <img
            src={src}
            alt={alt}
            style={{ viewTransitionName: 'badge' }}
            className="max-h-[50svh] w-auto max-w-full object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]"
          />

          <div className="flex flex-col items-center gap-2 text-center">
            <h2 id="badge-viewer-title" className="text-2xl font-bold tracking-tight sm:text-4xl">
              {league.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-primary">
                <SportIcon sport={league.sport} className="size-4" /> {league.sport}
              </span>
              <span className="tabular-nums">Season {season}</span>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
