import { cn } from '@/lib/utils'

/** On/off switch for demo mode (extra sports for a list with several categories). */
export function DemoToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      title="Add leagues from other sports (the free API only returns Soccer)"
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/60',
        on ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' : 'border-white/10 text-muted-foreground hover:text-foreground',
      )}
    >
      <span className={cn('relative h-4 w-7 rounded-full transition-colors', on ? 'bg-amber-400' : 'bg-white/20')}>
        <span className={cn('absolute top-0.5 left-0.5 size-3 rounded-full bg-background transition-transform', on && 'translate-x-3')} />
      </span>
      Demo data
    </button>
  )
}
