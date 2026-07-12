import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'
import { lockZoom } from './lib/lockZoom'

// Disable the browser's native scroll restoration before render, so a page
// reload always starts at the top instead of jumping to the previous position.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

lockZoom()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
