import { expect, test, type Page } from '@playwright/test'

const league = (id: string, name: string, sport: string) => ({ idLeague: id, strLeague: name, strSport: sport })
const LEAGUES = [
  ...['English Premier League', 'German Bundesliga', 'Italian Serie A', 'Spanish La Liga', 'French Ligue 1', 'Dutch Eredivisie', 'Belgian Pro League', 'Scottish Premier League'].map((n, i) => league(`10${i}`, n, 'Soccer')),
  league('200', 'NBA', 'Basketball'),
  league('201', 'EuroLeague', 'Basketball'),
  league('202', 'NBL Australia', 'Basketball'),
  league('300', 'NHL', 'Ice Hockey'),
  league('301', 'KHL', 'Ice Hockey'),
  league('400', 'Formula 1', 'Motorsport'),
  league('401', 'MotoGP', 'Motorsport'),
]

const BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#4ade80"/><text x="50" y="60" font-size="30" text-anchor="middle" fill="#052e16">B</text></svg>`

async function mockApi(page: Page) {
  await page.route('**/all_leagues.php', (r) => r.fulfill({ json: { leagues: LEAGUES } }))
  await page.route('**/search_all_seasons.php*', (r) =>
    r.fulfill({
      json: {
        seasons: [
          { strSeason: '2022-2023', strBadge: 'https://img.test/a.svg' },
          { strSeason: '2023-2024', strBadge: 'https://img.test/b.svg' },
          { strSeason: '2024-2025', strBadge: 'https://img.test/c.svg' },
        ],
      },
    }),
  )
  await page.route('https://img.test/**', (r) => r.fulfill({ body: BADGE_SVG, contentType: 'image/svg+xml' }))
}

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'NBA' })).toBeVisible()
})

test('groups leagues by sport and offers the sport filter', async ({ page }, info) => {
  await expect(page.getByRole('heading', { level: 2, name: /Soccer|Basketball|Ice Hockey|Motorsport/ })).toHaveCount(4)
  await expect(page.getByLabel('Filter by sport')).toBeVisible()
  await page.screenshot({ path: info.outputPath('01-home.png') })
  await page.getByLabel('Filter by sport').click()
  await expect(page.getByRole('option', { name: /Basketball/ })).toBeVisible()
  await page.waitForTimeout(400)
  await page.screenshot({ path: info.outputPath('05-sport-dropdown.png') })
  await page.keyboard.press('Escape')
})

test('grid is 1 column on phones and 3 on wide screens', async ({ page }, info) => {
  const cards = page.locator('section', { has: page.getByRole('heading', { name: 'Soccer' }) }).locator('li button')
  const top = async (i: number) => (await cards.nth(i).boundingBox())!.y
  // Cards animate in with a vertical offset, so wait for the layout to settle before comparing positions.
  if (info.project.name === 'mobile') {
    await expect.poll(async () => (await top(1)) - (await top(0))).toBeGreaterThan(20)
  } else {
    await expect.poll(async () => Math.abs((await top(0)) - (await top(1)))).toBeLessThan(2)
    await expect.poll(async () => Math.abs((await top(0)) - (await top(2)))).toBeLessThan(2)
  }
})

test('toolbar and category header dock while scrolling', async ({ page }, info) => {
  const bar = page.getByRole('search').or(page.locator('div.sticky').first())
  await page.mouse.wheel(0, 700)
  await page.waitForTimeout(500)
  const top = await page.locator('div.sticky').first().boundingBox()
  expect(top!.y).toBeLessThanOrEqual(1)
  const heading = page.getByRole('heading', { level: 2 }).filter({ hasText: /Soccer|Basketball|Ice Hockey|Motorsport/ })
  const ys = await heading.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().y))
  // Phones/tablets: a category header is docked under the 70px toolbar. Desktop: headers just scroll.
  if (info.project.name === 'mobile') expect(ys.some((y) => y > 60 && y < 110)).toBe(true)
  else expect(ys.every((y) => y < 60 || y > 110)).toBe(true)
  await page.screenshot({ path: info.outputPath('02-docked.png') })
  void bar
})

test('search, sort and reset', async ({ page }) => {
  await page.getByLabel('Search leagues by name').fill('league')
  await expect(page.getByRole('button', { name: 'NBA' })).toHaveCount(0)
  await page.getByLabel('Sort leagues').click()
  await page.getByRole('option', { name: /Z–A/ }).click()
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.getByRole('button', { name: 'NBA' })).toBeVisible()
  await expect(page.getByLabel('Search leagues by name')).toHaveValue('')
})

test('opens a league and the full badge view', async ({ page }, info) => {
  await page.getByRole('button', { name: 'NBA' }).click()
  const view = page.getByRole('button', { name: 'View full badge' })
  await expect(view).toBeVisible()
  await page.screenshot({ path: info.outputPath('03-selected.png') })
  await view.click()
  const dialog = page.locator('dialog[open]') // the native full-badge view (the mobile sheet is also a role=dialog)
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Season 2024-2025')
  await page.waitForTimeout(900) // let the view transition settle before the screenshot
  await page.screenshot({ path: info.outputPath('04-modal.png') })
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
