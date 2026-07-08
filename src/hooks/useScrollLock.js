import { useEffect, useRef } from 'react'

/**
 * iOS-safe body scroll lock.
 *
 * On iOS Safari / Chrome / Telegram WebView, `overflow: hidden` alone does NOT
 * stop the page from scrolling behind an overlay — momentum/touch scroll still
 * bleeds through. The reliable technique is to pin `<body>` with
 * `position: fixed` at a negative top offset, then restore the exact scroll
 * position on release so the page never jumps.
 *
 * Reference-counted so several overlays (burger menu + modal) can be open at
 * once without fighting over the body styles.
 */
let lockCount = 0
let savedScrollY = 0
let savedStyles = null

function applyLock() {
  savedScrollY = window.scrollY
  const { style } = document.body
  savedStyles = {
    position: style.position,
    top: style.top,
    left: style.left,
    right: style.right,
    width: style.width,
    overflow: style.overflow,
  }

  style.position = 'fixed'
  style.top = `-${savedScrollY}px`
  style.left = '0'
  style.right = '0'
  style.width = '100%'
  style.overflow = 'hidden'
}

function releaseLock({ restoreScroll = true } = {}) {
  const { style } = document.body
  if (savedStyles) {
    style.position = savedStyles.position
    style.top = savedStyles.top
    style.left = savedStyles.left
    style.right = savedStyles.right
    style.width = savedStyles.width
    style.overflow = savedStyles.overflow
    savedStyles = null
  }
  // Restore the pre-lock scroll position without smooth animation.
  if (restoreScroll) {
    window.scrollTo({ top: savedScrollY, left: 0, behavior: 'auto' })
  }
}

const getDefaultRestoreKey = () =>
  typeof window === 'undefined' ? '' : window.location.pathname

export function useScrollLock(active, lenis, { restoreKey } = {}) {
  const activeRestoreKey = useRef(getDefaultRestoreKey())
  activeRestoreKey.current = restoreKey ?? getDefaultRestoreKey()

  useEffect(() => {
    if (!active) return undefined

    const initialRestoreKey = activeRestoreKey.current

    lenis?.stop()
    if (lockCount === 0) applyLock()
    lockCount += 1

    return () => {
      const routeChanged = activeRestoreKey.current !== initialRestoreKey

      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) releaseLock({ restoreScroll: !routeChanged })
      lenis?.start()

      if (routeChanged) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
          lenis?.scrollTo(0, { immediate: true, force: true })
        })
      }
    }
  }, [active, lenis])
}
