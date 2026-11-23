import { useUiStore } from './ui'

const epl = { id: '1', name: 'English Premier League', sport: 'Soccer' }
const nba = { id: '4387', name: 'NBA', sport: 'Basketball' } // a demo-only league

const state = () => useUiStore.getState()

describe('ui store', () => {
  afterEach(() => useUiStore.setState(useUiStore.getInitialState(), true))

  it('keeps a selection that the new filters still match', () => {
    state().select(epl)
    state().setQuery('premier')
    state().setSport('Soccer')
    expect(state().selected).toEqual(epl)
  })

  it('clears a selection the search hides, for good, and stops auto-picking', () => {
    state().select(epl)
    state().setQuery('bundesliga')
    expect(state().selected).toBeNull()
    expect(state().autoPick).toBe(false)
    state().setQuery('') // relaxing the filter does not bring it back
    expect(state().selected).toBeNull()
  })

  it('clears a selection the sport filter hides', () => {
    state().select(epl)
    state().setSport('Basketball')
    expect(state().selected).toBeNull()
  })

  it('reset clears search, sport and sort but keeps the selection', () => {
    state().select(epl)
    state().setSort('za')
    state().setQuery('prem')
    state().reset()
    expect(state()).toMatchObject({ query: '', sport: 'all', sort: 'default', selected: epl })
  })

  it('turning demo data off clears a selected demo league only', () => {
    state().setDemo(true)
    state().select(nba)
    state().setDemo(false)
    expect(state().selected).toBeNull()

    state().select(epl)
    state().setDemo(true)
    state().setDemo(false)
    expect(state().selected).toEqual(epl)
  })
})
