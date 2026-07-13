import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// When a new service worker takes control (after a deploy), the page
// is still running the old JS bundle in memory until it reloads. This
// reloads automatically, once, the moment that handover happens — so
// visitors always end up on the current version instead of a stale one
// that can otherwise persist for days on mobile.
if ('serviceWorker' in navigator) {
  let refreshed = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshed) return
    refreshed = true
    window.location.reload()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)