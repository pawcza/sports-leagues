import { useEffect, useRef, useState } from 'react'

/**
 * True once the sticky element that follows the returned sentinel has scrolled up and docked.
 * `offset` is the sticky `top` in px.
 */
export function useStuck(offset = 0) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { rootMargin: `-${offset}px 0px 0px 0px` })
    io.observe(el)
    return () => io.disconnect()
  }, [offset])

  return [sentinel, stuck] as const
}
