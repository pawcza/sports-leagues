import type { Icon } from '@phosphor-icons/react'
import { lazy, Suspense, type LazyExoticComponent } from 'react'

// Every Phosphor icon module carries all six weights, so icons are loaded per sport on demand:
// with the free API key (Soccer only) a single icon is ever downloaded.
const LOADERS: Record<string, () => Promise<{ default: Icon }>> = {
  Barbell: () => import('@phosphor-icons/react/dist/csr/Barbell').then((m) => ({ default: m.Barbell })),
  Baseball: () => import('@phosphor-icons/react/dist/csr/Baseball').then((m) => ({ default: m.Baseball })),
  Basketball: () => import('@phosphor-icons/react/dist/csr/Basketball').then((m) => ({ default: m.Basketball })),
  BowlingBall: () => import('@phosphor-icons/react/dist/csr/BowlingBall').then((m) => ({ default: m.BowlingBall })),
  BoxingGlove: () => import('@phosphor-icons/react/dist/csr/BoxingGlove').then((m) => ({ default: m.BoxingGlove })),
  Cricket: () => import('@phosphor-icons/react/dist/csr/Cricket').then((m) => ({ default: m.Cricket })),
  FlagCheckered: () => import('@phosphor-icons/react/dist/csr/FlagCheckered').then((m) => ({ default: m.FlagCheckered })),
  Football: () => import('@phosphor-icons/react/dist/csr/Football').then((m) => ({ default: m.Football })),
  FootballHelmet: () => import('@phosphor-icons/react/dist/csr/FootballHelmet').then((m) => ({ default: m.FootballHelmet })),
  GameController: () => import('@phosphor-icons/react/dist/csr/GameController').then((m) => ({ default: m.GameController })),
  Golf: () => import('@phosphor-icons/react/dist/csr/Golf').then((m) => ({ default: m.Golf })),
  Hockey: () => import('@phosphor-icons/react/dist/csr/Hockey').then((m) => ({ default: m.Hockey })),
  Horse: () => import('@phosphor-icons/react/dist/csr/Horse').then((m) => ({ default: m.Horse })),
  PersonSimpleBike: () => import('@phosphor-icons/react/dist/csr/PersonSimpleBike').then((m) => ({ default: m.PersonSimpleBike })),
  PersonSimpleRun: () => import('@phosphor-icons/react/dist/csr/PersonSimpleRun').then((m) => ({ default: m.PersonSimpleRun })),
  PersonSimpleSwim: () => import('@phosphor-icons/react/dist/csr/PersonSimpleSwim').then((m) => ({ default: m.PersonSimpleSwim })),
  Racquet: () => import('@phosphor-icons/react/dist/csr/Racquet').then((m) => ({ default: m.Racquet })),
  SoccerBall: () => import('@phosphor-icons/react/dist/csr/SoccerBall').then((m) => ({ default: m.SoccerBall })),
  Target: () => import('@phosphor-icons/react/dist/csr/Target').then((m) => ({ default: m.Target })),
  TennisBall: () => import('@phosphor-icons/react/dist/csr/TennisBall').then((m) => ({ default: m.TennisBall })),
  Trophy: () => import('@phosphor-icons/react/dist/csr/Trophy').then((m) => ({ default: m.Trophy })),
  Volleyball: () => import('@phosphor-icons/react/dist/csr/Volleyball').then((m) => ({ default: m.Volleyball })),
}

const SPORT_ICON: Record<string, string> = {
  'Soccer': 'SoccerBall',
  'Basketball': 'Basketball',
  'American Football': 'FootballHelmet',
  'Rugby': 'Football',
  'Baseball': 'Baseball',
  'Ice Hockey': 'Hockey',
  'Field Hockey': 'Hockey',
  'Tennis': 'TennisBall',
  'Table Tennis': 'TennisBall',
  'Badminton': 'Racquet',
  'Volleyball': 'Volleyball',
  'Cricket': 'Cricket',
  'Golf': 'Golf',
  'Motorsport': 'FlagCheckered',
  'Cycling': 'PersonSimpleBike',
  'Fighting': 'BoxingGlove',
  'Darts': 'Target',
  'Bowls': 'BowlingBall',
  'Esports': 'GameController',
  'Athletics': 'PersonSimpleRun',
  'Swimming': 'PersonSimpleSwim',
  'Weightlifting': 'Barbell',
  'Equestrian': 'Horse',
}

const cache = new Map<string, LazyExoticComponent<Icon>>()

function iconFor(sport: string) {
  const name = SPORT_ICON[sport] ?? 'Trophy'
  let component = cache.get(name)
  if (!component) {
    component = lazy(LOADERS[name])
    cache.set(name, component)
  }
  return component
}

export function SportIcon({ sport, className }: { sport: string; className?: string }) {
  const Component = iconFor(sport)
  return (
    <Suspense fallback={<span className={className} />}>
      <Component weight="duotone" className={className} aria-hidden />
    </Suspense>
  )
}
