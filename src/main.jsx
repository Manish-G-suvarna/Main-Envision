import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Lazy load pages for better initial load performance
const App = lazy(() => import('./App.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>
    Loading...
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
