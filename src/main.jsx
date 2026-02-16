import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/layout/Layout.jsx'
import ErrorBoundary from './components/utils/ErrorBoundary.jsx'


// Lazy load pages for better initial load performance
const App = lazy(() => import('./App.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))

const PageLoader = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
    {/* Simple loader or blank screen while chunk loads */}
  </div>
)

// Import Admin component (lazy load)
const Admin = lazy(() => import('./MyAdmin/admin.jsx'))
const Login = lazy(() => import('./components/Login/Login.jsx'))
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<App />} />
              <Route path="/events" element={
                <ErrorBoundary>
                  <Events />
                </ErrorBoundary>
              } />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
