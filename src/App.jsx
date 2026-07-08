import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SmoothScroll from './components/layout/SmoothScroll'
import ScrollToTop from './components/layout/ScrollToTop'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Grain from './components/ui/Grain'
import Home from './pages/Home'

// Route-level code splitting keeps the initial bundle lean.
const Menu = lazy(() => import('./pages/Menu'))
const Dessert = lazy(() => import('./pages/Dessert'))
const Masterclasses = lazy(() => import('./pages/Masterclasses'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <span className="animate-pulse font-display text-3xl italic text-blood-400">
        VelvetCake
      </span>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <SmoothScroll>
      {/* Opaque cover for the top safe-area — content never shows under the
          system status bar / Dynamic Island in Safari or Telegram WebView. */}
      <div className="safe-area-cover" aria-hidden="true" />
      {!isAdmin && <ScrollToTop />}
      {!isAdmin && <Grain />}
      {!isAdmin && (
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-blood focus:px-5 focus:py-2 focus:text-sm focus:text-cream"
        >
          Перейти до вмісту
        </a>
      )}
      {!isAdmin && <Navbar />}
      <main id="main">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:slug" element={<Dessert />} />
            <Route path="/masterclasses" element={<Masterclasses />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </SmoothScroll>
  )
}
