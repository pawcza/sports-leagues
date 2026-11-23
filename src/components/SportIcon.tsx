import type { Icon } from '@phosphor-icons/react'
import { Barbell } from '@phosphor-icons/react/dist/csr/Barbell'
import { Baseball } from '@phosphor-icons/react/dist/csr/Baseball'
import { Basketball } from '@phosphor-icons/react/dist/csr/Basketball'
import { BowlingBall } from '@phosphor-icons/react/dist/csr/BowlingBall'
import { BoxingGlove } from '@phosphor-icons/react/dist/csr/BoxingGlove'
import { Cricket } from '@phosphor-icons/react/dist/csr/Cricket'
import { FlagCheckered } from '@phosphor-icons/react/dist/csr/FlagCheckered'
import { Football } from '@phosphor-icons/react/dist/csr/Football'
import { FootballHelmet } from '@phosphor-icons/react/dist/csr/FootballHelmet'
import { GameController } from '@phosphor-icons/react/dist/csr/GameController'
import { Golf } from '@phosphor-icons/react/dist/csr/Golf'
import { Hockey } from '@phosphor-icons/react/dist/csr/Hockey'
import { Horse } from '@phosphor-icons/react/dist/csr/Horse'
import { PersonSimpleBike } from '@phosphor-icons/react/dist/csr/PersonSimpleBike'
import { PersonSimpleRun } from '@phosphor-icons/react/dist/csr/PersonSimpleRun'
import { PersonSimpleSwim } from '@phosphor-icons/react/dist/csr/PersonSimpleSwim'
import { Racquet } from '@phosphor-icons/react/dist/csr/Racquet'
import { SoccerBall } from '@phosphor-icons/react/dist/csr/SoccerBall'
import { Target } from '@phosphor-icons/react/dist/csr/Target'
import { TennisBall } from '@phosphor-icons/react/dist/csr/TennisBall'
import { Trophy } from '@phosphor-icons/react/dist/csr/Trophy'
import { Volleyball } from '@phosphor-icons/react/dist/csr/Volleyball'

const ICONS: Record<string, Icon> = {
  Soccer: SoccerBall,
  Basketball: Basketball,
  'American Football': FootballHelmet,
  Rugby: Football,
  Baseball: Baseball,
  'Ice Hockey': Hockey,
  'Field Hockey': Hockey,
  Tennis: TennisBall,
  'Table Tennis': TennisBall,
  Badminton: Racquet,
  Volleyball: Volleyball,
  Cricket: Cricket,
  Golf: Golf,
  Motorsport: FlagCheckered,
  Cycling: PersonSimpleBike,
  Fighting: BoxingGlove,
  Darts: Target,
  Bowls: BowlingBall,
  Esports: GameController,
  Athletics: PersonSimpleRun,
  Swimming: PersonSimpleSwim,
  Weightlifting: Barbell,
  Equestrian: Horse,
}

export function SportIcon({ sport, className }: { sport: string; className?: string }) {
  const Component = ICONS[sport] ?? Trophy
  return <Component weight="duotone" className={className} aria-hidden />
}
