import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Home from './pages/Home.jsx'
import DestinationPage from './pages/DestinationPage.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Lazy-loaded: these are all visited far less often than the homepage
// (Login/Privacy/Terms rarely, Admin/Hotel only by you and hotel
// partners), but at full size were still shipped in the main JS bundle
// on every homepage visit — PageSpeed Insights flags this as "unused
// JavaScript" since none of this code runs on the page it's testing.
// Splitting them into their own chunks means public-site visitors no
// longer download code they'll almost never execute.
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))
const HotelDashboard = lazy(() => import('./pages/HotelDashboard.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))

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
        <Route path="/login" element={<Suspense fallback={<DashboardFallback />}><Login /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<DashboardFallback />}><Privacy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<DashboardFallback />}><Terms /></Suspense>} />
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
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  )
}

export default App
