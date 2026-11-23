import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import App from './App'
import { queryClient } from './lib/queries'

const SOCCER = [
  { idLeague: '4328', strLeague: 'English Premier League', strSport: 'Soccer' },
  { idLeague: '4331', strLeague: 'German Bundesliga', strSport: 'Soccer' },
]
const MIXED = [...SOCCER, { idLeague: '4387', strLeague: 'NBA', strSport: 'Basketball' }]

let leaguesPayload: { leagues: typeof MIXED } = { leagues: SOCCER }
let badgeCalls: string[] = []

const server = setupServer(
  http.get('*/all_leagues.php', () => HttpResponse.json(leaguesPayload)),
  http.get('*/search_all_seasons.php', ({ request }) => {
    const id = new URL(request.url).searchParams.get('id')!
    badgeCalls.push(id)
    if (id === '4331') return HttpResponse.json({ seasons: null })
    return HttpResponse.json({
      seasons: [
        { strSeason: '1992-1993', strBadge: 'https://img.test/old.png' },
        { strSeason: '1993-1994', strBadge: null },
        { strSeason: '2024-2025', strBadge: 'https://img.test/new.png' },
      ],
    })
  }),
)

beforeAll(() => {
  server.listen()
  window.matchMedia = ((q: string) => ({
    matches: q.includes('min-width'),
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
})
afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
  badgeCalls = []
  leaguesPayload = { leagues: SOCCER }
  window.history.replaceState(null, '', '/')
})
afterAll(() => server.close())


describe('App', () => {
  it('lists leagues and filters by name', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByRole('button', { name: /english premier league/i })).toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: /search leagues/i }), 'bundes')
    await waitFor(() => expect(screen.queryByRole('button', { name: /english premier league/i })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /german bundesliga/i })).toBeInTheDocument()
  })

  it('sorts the list Z-A and resets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('button', { name: /english premier league/i })
    const names = () => screen.getAllByRole('button', { name: /premier league|bundesliga/i, pressed: undefined }).filter((b) => b.hasAttribute('aria-pressed')).map((b) => b.textContent)
    expect(names()).toEqual(['English Premier League', 'German Bundesliga'])
    await user.click(screen.getByRole('combobox', { name: /sort leagues/i }))
    await user.click(await screen.findByRole('option', { name: /z–a/i }))
    expect(names()).toEqual(['German Bundesliga', 'English Premier League'])
    await user.click(await screen.findByRole('button', { name: /reset/i }))
    expect(names()).toEqual(['English Premier League', 'German Bundesliga'])
  })

  it('hides the sport dropdown when only one sport is present', async () => {
    render(<App />)
    await screen.findByRole('button', { name: /english premier league/i })
    expect(screen.queryByLabelText('Filter by sport')).not.toBeInTheDocument()
  })

  it('shows the sport dropdown when several sports are present', async () => {
    leaguesPayload = { leagues: MIXED }
    render(<App />)
    await screen.findByRole('button', { name: /nba/i })
    expect(screen.getByLabelText('Filter by sport')).toBeInTheDocument()
  })

  it('shows the latest available badge on click and caches the lookup', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = await screen.findByRole('button', { name: /english premier league/i })
    await user.click(card)
    const img = await screen.findByRole('img', { name: /season 2024-2025/i })
    expect(img).toHaveAttribute('src', 'https://img.test/new.png')
    expect(screen.queryByText('1993-1994')).not.toBeInTheDocument() // null badge skipped

    await user.click(screen.getByRole('button', { name: /german bundesliga/i }))
    await user.click(screen.getByRole('button', { name: /english premier league/i }))
    await screen.findByRole('img', { name: /season 2024-2025/i })
    expect(badgeCalls.filter((id) => id === '4328')).toHaveLength(1)
  })

  it('opens the badge in a full view with a title and closes it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /english premier league/i }))
    await user.click(await screen.findByRole('button', { name: /view full badge/i }))
    const dialog = await screen.findByRole('dialog', { name: /english premier league/i })
    expect(dialog).toHaveTextContent('Season 2024-2025')
    await user.click(screen.getByRole('button', { name: /^close$/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('clears the selection when filters hide the selected league', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /german bundesliga/i }))
    expect(await screen.findByRole('heading', { name: /german bundesliga/i })).toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: /search leagues/i }), 'premier')
    expect(await screen.findByText(/select a league to see its badge/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /german bundesliga/i })).not.toBeInTheDocument()
  })

  it('shows each leagues’ newest badge on its card', async () => {
    const { container } = render(<App />)
    await screen.findByRole('button', { name: /english premier league/i })
    await waitFor(() => expect(container.querySelector('li img[src="https://img.test/new.png"]')).not.toBeNull())
  })

  it('filters a long season list by year', async () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      strSeason: `${1990 + i}-${1991 + i}`,
      strBadge: `https://img.test/${i}.png`,
    }))
    server.use(http.get('*/search_all_seasons.php', () => HttpResponse.json({ seasons: many })))
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /english premier league/i }))
    const chips = () => screen.getAllByRole('button', { pressed: undefined }).filter((b) => /^\d{4}-\d{4}$/.test(b.textContent ?? ''))
    await waitFor(() => expect(chips()).toHaveLength(30))
    await user.type(await screen.findByRole('searchbox', { name: /filter seasons/i }), '2005')
    expect(chips().map((b) => b.textContent)).toEqual(['2005-2006', '2004-2005'])
  })

  it('handles leagues without badges', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /german bundesliga/i }))
    expect(await screen.findByText(/no badge available/i)).toBeInTheDocument()
  })

  it('offers a retry when leagues fail to load', async () => {
    server.use(http.get('*/all_leagues.php', () => new HttpResponse(null, { status: 500 })))
    render(<App />)
    expect(await screen.findByRole('alert', {}, { timeout: 5000 })).toHaveTextContent(/couldn't load leagues/i)
  })
})
