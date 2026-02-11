import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

import cloudBg from './assets/Loading/loading_cloud_bg.png'
import cloudFg from './assets/Loading/cloud.png'

// Lazy load pages for better initial load performance
const App = lazy(() => import('./App.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

const PageLoader = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
    <img
      src={cloudBg}
      alt=""
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
    />
    <img
      src={cloudFg}
      alt="Loading..."
      style={{ position: 'relative', zIndex: 2, width: '350px', top: '15%', height: 'auto', objectFit: 'contain', animation: 'moveAndPulse 3s linear infinite' }}
    />
    <style>{`
      @keyframes moveAndPulse {
        0% { transform: translateX(-120vw) scale(1); opacity: 0.8; }
        35% { transform: translateX(0) scale(1); opacity: 1; }
        45% { transform: translateX(0) scale(1.15); opacity: 1; }
        55% { transform: translateX(0) scale(1); opacity: 1; }
        100% { transform: translateX(0) scale(1); opacity: 1; }
      }
    `}</style>
  </div>
)

// Import Admin component (eager load or lazy load)
import Admin from './MyAdmin/admin.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/events" element={
              <ErrorBoundary>
                <Events />
              </ErrorBoundary>
            } />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
