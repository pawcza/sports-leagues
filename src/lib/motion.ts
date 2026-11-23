export const ease = [0.22, 1, 0.36, 1] as const

/** Blur + rise entrance used for page sections. `custom` is the delay in seconds. */
export const rise = {
  hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay, ease },
  }),
}
