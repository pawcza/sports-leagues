import type { League } from '@/lib/api'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { BadgePanel } from './BadgePanel'

/** Phone/tablet presentation of the badge panel: a bottom sheet. */
export function BadgeSheet({ league, onClose }: { league: League | undefined; onClose: () => void }) {
  return (
    <Sheet open={!!league} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[90svh] overflow-y-auto p-5">
        <SheetHeader className="sr-only">
          <SheetTitle>{league?.name}</SheetTitle>
          <SheetDescription>Season badge</SheetDescription>
        </SheetHeader>
        {league && <BadgePanel key={league.id} league={league} />}
      </SheetContent>
    </Sheet>
  )
}
