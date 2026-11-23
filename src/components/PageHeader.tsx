import { m } from 'motion/react'
import { PAGE_WIDTH } from '@/lib/layout'
import { rise } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui'
import { DemoToggle } from './DemoToggle'

export function PageHeader() {
  const demo = useUiStore((s) => s.demo)
  const setDemo = useUiStore((s) => s.setDemo)

  return (
    <div className={cn(PAGE_WIDTH, 'pt-8 pb-6 sm:pt-12 sm:pb-8')}>
      <m.header variants={rise} initial="hidden" animate="show" custom={0} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Live data · TheSportsDB
          </div>
          <DemoToggle on={demo} onChange={setDemo} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-6xl">
          Find your{' '}
          <span className="bg-linear-to-r from-primary via-emerald-300 to-sky-400 bg-clip-text text-transparent">league</span>
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-lg">
          Browse leagues from around the world and flip through their badges, season by season.
        </p>
      </m.header>
    </div>
  )
}
