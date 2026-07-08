// Locks the page at 100% scale.
//
// Mobile pinch-zoom is already disabled via the <meta name="viewport"> tag.
// Here we block the desktop paths the meta tag can't reach:
//   • Ctrl + mouse wheel / trackpad pinch (wheel events arrive with ctrlKey=true)
//   • Ctrl/⌘ + "+" / "-" / "0" / "=" keyboard shortcuts
//
// Note: a page cannot override zoom set from the browser menu or the OS —
// browsers reserve that for accessibility. This covers the in-page gestures.
export function lockZoom() {
  if (typeof window === 'undefined') return

  // Capture phase + passive:false so we run before Lenis' own wheel handler.
  const onWheel = (event) => {
    if (event.ctrlKey) event.preventDefault()
  }
  window.addEventListener('wheel', onWheel, { passive: false, capture: true })

  const onKeyDown = (event) => {
    if (!(event.ctrlKey || event.metaKey)) return
    if (['+', '-', '=', '0'].includes(event.key)) event.preventDefault()
  }
  window.addEventListener('keydown', onKeyDown, { capture: true })
}
