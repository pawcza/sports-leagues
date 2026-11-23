/**
 * Demo mode (`?mock=1`, or the toggle in the header): adds leagues from other sports. The free API key only
 * returns Soccer, so this is the only way to see the sport dropdown and a list with several categories.
 */
export const isMockId = (id: string) => id.startsWith('mock-')

const L = (idLeague: string, strLeague: string, strSport: string) => ({ idLeague, strLeague, strSport })

export const MOCK_LEAGUES = [
  L('4387', 'NBA', 'Basketball'),
  L('mock-bb-2', 'EuroLeague', 'Basketball'),
  L('mock-bb-3', 'NBL Australia', 'Basketball'),
  L('4391', 'NFL', 'American Football'),
  L('mock-af-2', 'NCAA Division I FBS', 'American Football'),
  L('4380', 'NHL', 'Ice Hockey'),
  L('mock-ih-2', 'KHL', 'Ice Hockey'),
  L('mock-ih-3', 'Swedish Hockey League', 'Ice Hockey'),
  L('mock-ih-4', 'American Hockey League', 'Ice Hockey'),
  L('4370', 'Formula 1', 'Motorsport'),
  L('mock-ms-2', 'MotoGP', 'Motorsport'),
]
