import type { Icon } from '@phosphor-icons/react'
import { lazy, Suspense, type LazyExoticComponent } from 'react'

type LazyIcon = LazyExoticComponent<Icon>

// Every Phosphor icon module carries all six weights, so each icon is its own chunk, downloaded only when a
// sport that uses it is rendered: with the free API key (Soccer only) a single icon is ever fetched.
// `lazy` at module level creates the component once; nothing is downloaded until it first renders.
const icon = (load: () => Promise<{ default: Icon }>): LazyIcon => lazy(load)

const Barbell = icon(() => import('@phosphor-icons/react/dist/csr/Barbell').then((m) => ({ default: m.Barbell })))
const Baseball = icon(() => import('@phosphor-icons/react/dist/csr/Baseball').then((m) => ({ default: m.Baseball })))
const Basketball = icon(() => import('@phosphor-icons/react/dist/csr/Basketball').then((m) => ({ default: m.Basketball })))
const BowlingBall = icon(() => import('@phosphor-icons/react/dist/csr/BowlingBall').then((m) => ({ default: m.BowlingBall })))
const BoxingGlove = icon(() => import('@phosphor-icons/react/dist/csr/BoxingGlove').then((m) => ({ default: m.BoxingGlove })))
const Cricket = icon(() => import('@phosphor-icons/react/dist/csr/Cricket').then((m) => ({ default: m.Cricket })))
const FlagCheckered = icon(() => import('@phosphor-icons/react/dist/csr/FlagCheckered').then((m) => ({ default: m.FlagCheckered })))
const Football = icon(() => import('@phosphor-icons/react/dist/csr/Football').then((m) => ({ default: m.Football })))
const FootballHelmet = icon(() => import('@phosphor-icons/react/dist/csr/FootballHelmet').then((m) => ({ default: m.FootballHelmet })))
const GameController = icon(() => import('@phosphor-icons/react/dist/csr/GameController').then((m) => ({ default: m.GameController })))
const Golf = icon(() => import('@phosphor-icons/react/dist/csr/Golf').then((m) => ({ default: m.Golf })))
const Hockey = icon(() => import('@phosphor-icons/react/dist/csr/Hockey').then((m) => ({ default: m.Hockey })))
const Horse = icon(() => import('@phosphor-icons/react/dist/csr/Horse').then((m) => ({ default: m.Horse })))
const PersonSimpleBike = icon(() => import('@phosphor-icons/react/dist/csr/PersonSimpleBike').then((m) => ({ default: m.PersonSimpleBike })))
const PersonSimpleRun = icon(() => import('@phosphor-icons/react/dist/csr/PersonSimpleRun').then((m) => ({ default: m.PersonSimpleRun })))
const PersonSimpleSwim = icon(() => import('@phosphor-icons/react/dist/csr/PersonSimpleSwim').then((m) => ({ default: m.PersonSimpleSwim })))
const Racquet = icon(() => import('@phosphor-icons/react/dist/csr/Racquet').then((m) => ({ default: m.Racquet })))
const SoccerBall = icon(() => import('@phosphor-icons/react/dist/csr/SoccerBall').then((m) => ({ default: m.SoccerBall })))
const Target = icon(() => import('@phosphor-icons/react/dist/csr/Target').then((m) => ({ default: m.Target })))
const TennisBall = icon(() => import('@phosphor-icons/react/dist/csr/TennisBall').then((m) => ({ default: m.TennisBall })))
const Trophy = icon(() => import('@phosphor-icons/react/dist/csr/Trophy').then((m) => ({ default: m.Trophy })))
const Volleyball = icon(() => import('@phosphor-icons/react/dist/csr/Volleyball').then((m) => ({ default: m.Volleyball })))

/** To support a new sport, add one line: the compiler checks the icon exists. Unlisted sports get the trophy. */
const BY_SPORT: Record<string, LazyIcon> = {
  'Soccer': SoccerBall,
  'Basketball': Basketball,
  'American Football': FootballHelmet,
  'Rugby': Football,
  'Baseball': Baseball,
  'Ice Hockey': Hockey,
  'Field Hockey': Hockey,
  'Tennis': TennisBall,
  'Table Tennis': TennisBall,
  'Badminton': Racquet,
  'Volleyball': Volleyball,
  'Cricket': Cricket,
  'Golf': Golf,
  'Motorsport': FlagCheckered,
  'Cycling': PersonSimpleBike,
  'Fighting': BoxingGlove,
  'Darts': Target,
  'Bowls': BowlingBall,
  'Esports': GameController,
  'Athletics': PersonSimpleRun,
  'Swimming': PersonSimpleSwim,
  'Weightlifting': Barbell,
  'Equestrian': Horse,
}

export function SportIcon({ sport, className }: { sport: string; className?: string }) {
  const Component = BY_SPORT[sport] ?? Trophy
  return (
    <Suspense fallback={<span className={className} />}>
      <Component weight="duotone" className={className} aria-hidden />
    </Suspense>
  )
}
