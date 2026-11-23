import { m } from 'motion/react'
import { useStuck } from '@/hooks/useStuck'
import { PAGE_WIDTH, TOOLBAR_HEIGHT } from '@/lib/layout'
import { ease } from '@/lib/motion'
import type { SportOption } from '@/lib/filter'
import { cn } from '@/lib/utils'
import { Filters } from './Filters'

/** Full-width bar that is transparent in the page flow and gains its background only once docked at the top. */
export function Toolbar({ sports, total }: { sports: SportOption[]; total: number }) {
  const [sentinel, stuck] = useStuck()

  return (
    <>
      <div ref={sentinel} aria-hidden className="-mb-px h-px" />
      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.12 }}
        className={cn(
          'sticky top-0 z-30 border-y border-transparent transition-colors duration-300',
          stuck && 'border-white/8 bg-background/75 backdrop-blur-xl',
        )}
        style={{ height: TOOLBAR_HEIGHT }}
      >
        <div className={cn(PAGE_WIDTH, 'flex h-full items-center')}>
          <Filters sports={sports} total={total} />
        </div>
      </m.div>
    </>
  )
}
