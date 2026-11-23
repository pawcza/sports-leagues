import { QueryClient } from '@tanstack/react-query'
import { API_KEY } from './api'
import { persistQueryCache } from './persist'

describe('persistQueryCache', () => {
  afterEach(() => localStorage.clear())

  it('restores cached queries into a fresh client', async () => {
    vi.useFakeTimers()
    const first = new QueryClient()
    persistQueryCache(first)
    first.setQueryData(['leagues'], [{ id: '1' }])
    await vi.advanceTimersByTimeAsync(600)
    vi.useRealTimers()

    const second = new QueryClient()
    persistQueryCache(second)
    expect(second.getQueryData(['leagues'])).toEqual([{ id: '1' }])
  })

  it('ignores corrupt storage', () => {
    localStorage.setItem(`sports-leagues:query-cache:v1:${API_KEY}`, '{nope')
    expect(() => persistQueryCache(new QueryClient())).not.toThrow()
  })
})
