import { ALL_SPORTS, filterLeagues, groupBySport, sortLeagues, sportOptions } from './filter'

const leagues = [
  { id: '1', name: 'English Premier League', sport: 'Soccer' },
  { id: '2', name: 'NBA', sport: 'Basketball' },
  { id: '3', name: 'Formula 1', sport: 'Motorsport' },
]

describe('filterLeagues', () => {
  it('matches names case-insensitively', () => {
    expect(filterLeagues(leagues, ' premier ', ALL_SPORTS).map((l) => l.id)).toEqual(['1'])
  })
  it('filters by sport and combines with search', () => {
    expect(filterLeagues(leagues, '', 'Basketball').map((l) => l.id)).toEqual(['2'])
    expect(filterLeagues(leagues, 'nba', 'Soccer')).toEqual([])
  })
  it('returns everything with no filters', () => {
    expect(filterLeagues(leagues, '', ALL_SPORTS)).toHaveLength(3)
  })
})

describe('sportOptions', () => {
  it('counts and sorts alphabetically', () => {
    expect(sportOptions([...leagues, leagues[0]])).toEqual([
      { sport: 'Basketball', count: 1 },
      { sport: 'Motorsport', count: 1 },
      { sport: 'Soccer', count: 2 },
    ])
  })
})

describe('sortLeagues', () => {
  it('sorts A-Z and Z-A without mutating, and keeps API order by default', () => {
    expect(sortLeagues(leagues, 'az').map((l) => l.id)).toEqual(['1', '3', '2'])
    expect(sortLeagues(leagues, 'za').map((l) => l.id)).toEqual(['2', '3', '1'])
    expect(sortLeagues(leagues, 'default')).toBe(leagues)
    expect(leagues.map((l) => l.id)).toEqual(['1', '2', '3'])
  })
})

describe('groupBySport', () => {
  it('puts the biggest group first, then alphabetical, keeping league order', () => {
    const more = [...leagues, { id: '4', name: 'La Liga', sport: 'Soccer' }]
    const groups = groupBySport(more)
    expect(groups.map((g) => g.sport)).toEqual(['Soccer', 'Basketball', 'Motorsport'])
    expect(groups[0].leagues.map((l) => l.id)).toEqual(['1', '4'])
  })
})
