import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import DestinationPage from './pages/DestinationPage.jsx'
import Login from './pages/Login.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Lazy-loaded: these dashboards are only ever visited by you and hotel
// partners, never by regular site visitors, but at full size they were the
// biggest single contributor to the main JS bundle. Splitting them into
// their own chunks means the public-facing pages (home, destination pages)
// no longer have to download this code at all.
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))
const HotelDashboard = lazy(() => import('./pages/HotelDashboard.jsx'))

function DashboardFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-mid)', fontSize: '0.85rem' }}>
      Loading…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gr" element={<Home />} />
        <Route path="/destinations/:slug" element={<DestinationPage />} />
        <Route path="/gr/destinations/:slug" element={<DestinationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Suspense fallback={<DashboardFallback />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }/>
        <Route path="/hotel" element={
          <ProtectedRoute requiredRole="hotel">
            <Suspense fallback={<DashboardFallback />}>
              <HotelDashboard />
            </Suspense>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
