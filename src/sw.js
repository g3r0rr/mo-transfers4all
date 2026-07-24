import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Take over immediately on every deploy instead of waiting for every
// open tab to fully close first. Without this, a new service worker can
// sit "waiting" indefinitely on mobile (where tabs rarely get fully
// closed), so visitors keep seeing the old cached version of the site
// for days after a deploy, even though the new code is live on the
// server.
self.skipWaiting()
self.addEventListener('activate', () => self.clients.claim())

// Drop any precached files left over from a previous service worker
// version once the new one takes over.
cleanupOutdatedCaches()

// Injected at build time by vite-plugin-pwa (injectManifest strategy)
precacheAndRoute(self.__WB_MANIFEST)

// Cache only GET requests to Supabase (table reads). POST/PATCH/DELETE
// (inserts, updates, auth calls) must never be intercepted by a caching
// strategy — Workbox's cache.put() throws on non-GET requests, which
// surfaced to users as "TypeError: Failed to fetch" on every booking
// insert. NetworkFirst is only safe for idempotent reads.
registerRoute(
  ({ url, request }) => request.method === 'GET' && url.hostname.endsWith('.supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache-v2',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 300 })
    ]
  })
)

// --- Push notifications ---
// Fires even when the PWA is fully closed, as long as the OS has the
// service worker registered (Android Chrome + iOS 16.4+ home-screen PWAs).
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: 'Νέα Κράτηση', body: event.data ? event.data.text() : '' }
  }

  const title = data.title || '🚖 Νέα Κράτηση — MO Transfers4all'
  const options = {
    body: data.body || 'Έφτασε μια νέα κράτηση.',
    icon: '/logo.jpg',
    badge: '/favicon-32.png',
    data: { url: data.url || '/admin' },
    tag: data.tag || 'booking',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Browsers occasionally rotate or expire push subscriptions. Re-subscribe
// with the same key so the browser-side subscription stays alive; the new
// endpoint reaches the push_subscriptions table the next time the
// dashboard is opened (AdminDashboard re-upserts the current subscription
// on every load when permission is granted) — a service worker has no
// authenticated Supabase session, so it can't write the row itself.
// VAPID public key duplicated from AdminDashboard.jsx — keep in sync.
const VAPID_PUBLIC_KEY = 'BEB_u5S-uAo0vy_e5fTIUSGue8FNQzJ2293An3y2myKNhjkh0PXAEkiqPHBgQ0l11sNmYoRRcnZ8276pD1hzMcM'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    }).catch((e) => console.error('Re-subscribe after pushsubscriptionchange failed:', e))
  )
})

// Clicking the notification focuses an open admin tab, or opens a new one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/admin'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
