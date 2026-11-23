/**
 * Runs a DOM update inside a same-document View Transition when the browser supports it
 * (and the user hasn't asked for reduced motion); otherwise just runs it.
 * Resolves once the animation has finished.
 */
export function runViewTransition(update: () => void): Promise<void> {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) {
    update()
    return Promise.resolve()
  }
  return document.startViewTransition(update).finished.catch(() => {})
}
