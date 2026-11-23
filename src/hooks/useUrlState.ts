import { useCallback, useState } from 'react'

type Params = Record<string, string>

function read(keys: string[]): Params {
  const sp = new URLSearchParams(window.location.search)
  return Object.fromEntries(keys.map((k) => [k, sp.get(k) ?? '']))
}

/** Tiny URL-synced state so filters and the selected league survive a reload and can be shared. */
export function useUrlState<K extends string>(keys: readonly K[]) {
  const [state, setState] = useState(() => read([...keys]))

  const set = useCallback((patch: Partial<Record<K, string>>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      // Only touch our own keys: other params (e.g. the dev-only `?mock`) must survive.
      const sp = new URLSearchParams(window.location.search)
      for (const k of keys) {
        if (next[k]) sp.set(k, next[k])
        else sp.delete(k)
      }
      const qs = sp.toString()
      window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
      return next
    })
  }, [keys])

  return [state as Record<K, string>, set] as const
}
