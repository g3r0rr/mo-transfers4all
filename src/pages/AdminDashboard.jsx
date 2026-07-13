import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'

function usePWAInstall() {
  const [prompt, setPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(e => console.error('SW registration failed:', e))
    }
  }, [])

  useEffect(() => {
    // Inject the admin-specific manifest so PWA start_url = /admin
    const existing = document.querySelector('link[rel="manifest"]')
    const link = existing || document.createElement('link')
    link.rel = 'manifest'
    link.href = '/admin-manifest.json'
    if (!existing) document.head.appendChild(link)
    // Restore on unmount
    return () => { if (!existing) link.remove(); else link.href = '/manifest.webmanifest' }
  }, [])
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }
  return { canInstall: !!prompt && !installed, install, installed }
}

const DRIVERS = [
  { value: 'marjus', label: 'Marjus', phone: '+30 693 647 5451' },
  { value: 'martin', label: 'Martin', phone: '+30 699 360 5070' },
  { value: 'roland', label: 'Roland', phone: '+30 697 963 8475' },
]

const STATUS = {
  pending:   { bg: '#fef9ec', color: '#b45309', border: '#fde68a' },
  assigned:  { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  completed: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
}

const SOURCE = {
  website: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  hotel:   { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
}

const playNotification = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4)
  } catch(e) {}
}

const showBrowserNotification = (booking) => {
  if (!('Notification' in window)) return
  const send = () => new Notification('🚖 New Booking!', {
    body: `${booking.passenger_name} · ${booking.pickup} → ${booking.dropoff}`,
    icon: '/logo.jpg'
  })
  if (Notification.permission === 'granted') send()
  else if (Notification.permission !== 'denied') Notification.requestPermission().then(p => { if (p === 'granted') send() })
}

// --- Push notifications (work even when the PWA is fully closed) ---
const VAPID_PUBLIC_KEY = 'BEB_u5S-uAo0vy_e5fTIUSGue8FNQzJ2293An3y2myKNhjkh0PXAEkiqPHBgQ0l11sNmYoRRcnZ8276pD1hzMcM'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

const subscribeToPush = async (userId) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Push notifications are not supported in this browser.')
    return false
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return false

  try {
    const registration = await navigator.serviceWorker.ready

    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })
    }

    const subJson = subscription.toJSON()

    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      endpoint: subJson.endpoint,
      p256dh: subJson.keys.p256dh,
      auth: subJson.keys.auth
    }, { onConflict: 'endpoint' })

    if (error) { console.error('Failed to save push subscription:', error); return false }
    return true
  } catch (e) {
    console.error('Push subscription failed:', e)
    return false
  }
}

const T = {
  en: {
    title: 'Admin Dashboard', total: 'Total', pending: 'Pending',
    assigned: 'Assigned', completed: 'Completed', list: 'List',
    calendar: 'Calendar', allStatus: 'All Statuses', allDrivers: 'All Drivers',
    refresh: 'Refresh', noBookings: 'No bookings found.',
    source: 'Source', date: 'Date', time: 'Time', passenger: 'Passenger',
    phone: 'Phone', pickup: 'Pickup', dropoff: 'Drop-off', vehicle: 'Vehicle',
    driver: 'Driver', status: 'Status', actions: 'Actions', view: 'View',
    unassigned: 'Unassigned', signOut: 'Sign Out', enableAlerts: 'Enable Alerts',
    details: 'Booking Details', assignDriver: 'Assign Driver',
    email: 'Email', flight: 'Flight / Ship', notes: 'Notes',
    share: 'Share via WhatsApp', back: '← Website', loading: 'Loading bookings…',
    bookings: 'bookings',
    installLead: 'Install the app',
    installPrompt: 'add this to your home screen for instant access and booking notifications.',
    installNow: 'Install Now',
  },
  gr: {
    title: 'Πίνακας Ελέγχου', total: 'Σύνολο', pending: 'Εκκρεμεί',
    assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε', list: 'Λίστα',
    calendar: 'Ημερολόγιο', allStatus: 'Όλες', allDrivers: 'Όλοι',
    refresh: 'Ανανέωση', noBookings: 'Δεν βρέθηκαν κρατήσεις.',
    source: 'Πηγή', date: 'Ημερομηνία', time: 'Ώρα', passenger: 'Επιβάτης',
    phone: 'Τηλέφωνο', pickup: 'Παραλαβή', dropoff: 'Προορισμός', vehicle: 'Όχημα',
    driver: 'Οδηγός', status: 'Κατάσταση', actions: 'Ενέργειες', view: 'Προβολή',
    unassigned: 'Αναθεώρηση', signOut: 'Έξοδος', enableAlerts: 'Ειδοποιήσεις',
    details: 'Λεπτομέρειες Κράτησης', assignDriver: 'Ανάθεση Οδηγού',
    email: 'Email', flight: 'Πτήση / Πλοίο', notes: 'Σημειώσεις',
    share: 'Κοινοποίηση WhatsApp', back: '← Ιστοσελίδα', loading: 'Φόρτωση κρατήσεων…',
    bookings: 'κρατήσεις',
    installLead: 'Εγκαταστήστε την εφαρμογή',
    installPrompt: 'προσθέστε την στην αρχική οθόνη για άμεση πρόσβαση και ειδοποιήσεις κρατήσεων.',
    installNow: 'Εγκατάσταση',
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDriver, setFilterDriver] = useState('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay]   = useState(null)
  const [lang, setLang]                 = useState(localStorage.getItem('mo-lang') || 'en')
  const [currentUserId, setCurrentUserId] = useState(null)
  const [pushEnabled, setPushEnabled]   = useState(false)

  const t = T[lang]

  useEffect(() => {
    let bookingChannel, refreshInterval

    const init = async (session) => {
      if (!session) { navigate("/login"); return }

      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", session.user.id).single()

      if (!profile || profile.role !== "admin") { navigate("/login"); return }

      setCurrentUserId(session.user.id)

      const { data, error } = await supabase
        .from("bookings").select("*").order("date", { ascending: true })
      if (!error) setBookings(data || [])
      setLoading(false)

      bookingChannel = supabase
        .channel("bookings-realtime")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "bookings" }, (payload) => {
          setBookings(prev => [...prev, payload.new])
          playNotification()
          showBrowserNotification(payload.new)
        })
        .subscribe()

      refreshInterval = setInterval(async () => {
        const { data } = await supabase.from("bookings").select("*").order("date", { ascending: true })
        if (data) setBookings(data)
      }, 60000)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      init(session)
    })

    return () => {
      subscription.unsubscribe()
      if (bookingChannel) supabase.removeChannel(bookingChannel)
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [])

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('date', { ascending: true })
    if (data) setBookings(data)
  }

  const updateBooking = async (id, updates) => {
    const { error } = await supabase.from('bookings').update(updates).eq('id', id)
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
      if (selectedBooking?.id === id) setSelectedBooking(prev => ({ ...prev, ...updates }))
    }
  }

  const shareBooking = (b) => {
    const driver = DRIVERS.find(d => d.value === b.assigned_to)
    const dateObj = new Date(b.date)
    const dayName = dateObj.toLocaleDateString('el-GR', { weekday: 'long' })
    const dayNum = dateObj.getDate()
    const monthName = dateObj.toLocaleDateString('el-GR', { month: 'long' })
    const text =
      `${b.pickup} → ${b.dropoff}\n` +
      `${b.passenger_name}\n` +
      (b.flight_number ? `Πτήση ${b.flight_number}\n` : '') +
      `${dayName} ${dayNum} ${monthName} ${b.time}\n` +
      `${b.vehicle}\n` +
      (b.notes ? `${b.notes}\n` : '') +
      `${b.passenger_phone}` +
      (driver ? `\n\nΟδηγός: ${driver.label} ${driver.phone}` : '')
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const filtered = bookings.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    if (filterDriver !== 'all' && b.assigned_to !== filterDriver) return false
    return true
  })

  const { firstDay, daysInMonth } = (() => {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth()
    return { firstDay: new Date(y, m, 1).getDay(), daysInMonth: new Date(y, m + 1, 0).getDate() }
  })()

  const getBookingsForDay = (day) => {
    const y = currentMonth.getFullYear()
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return filtered.filter(b => b.date === `${y}-${m}-${d}`)
  }

  const monthName = currentMonth.toLocaleString(lang === 'gr' ? 'el-GR' : 'en', { month: 'long', year: 'numeric' })
  const dayHeaders = lang === 'gr'
    ? ['Κυρ','Δευ','Τρί','Τετ','Πέμ','Παρ','Σάβ']
    : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const { canInstall, install } = usePWAInstall()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#eef5fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #cfe0f0', borderTopColor: '#0f3460', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0f3460' }}>{t.loading}</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500;600&family=Outfit:wght@600;700&display=swap');

        * { box-sizing: border-box; }

        .adm-page {
          min-height: 100vh;
          background: #f4f8fc;
          font-family: 'Inter', sans-serif;
          color: #0d2236;
        }

        /* ── Header ── */
        .adm-header {
          background: #fff;
          border-bottom: 1px solid #cfe0f0;
          padding: 0.75rem 1.5rem;
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 6px rgba(15,52,96,0.06);
        }

        @media (max-width: 640px) {
          .adm-header {
            justify-content: center;
            text-align: center;
          }
          .adm-header-actions {
            width: 100%;
            justify-content: center;
          }
        }

        .adm-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .adm-brand img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #2980b9;
        }

        .adm-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f3460;
          line-height: 1.2;
        }

        .adm-brand-sub {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2980b9;
          font-weight: 600;
        }

        .adm-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .adm-lang-toggle {
          display: flex;
          border: 1px solid #cfe0f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .adm-lang-btn {
          background: transparent;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 0.3rem 0.6rem;
          cursor: pointer;
          color: #7a99b5;
          transition: background 0.15s, color 0.15s;
        }

        .adm-lang-btn.active {
          background: #0f3460;
          color: #fff;
        }

        .adm-btn {
          background: transparent;
          border: 1px solid #cfe0f0;
          border-radius: 6px;
          color: #3a5a78;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          padding: 0.38rem 0.9rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }

        .adm-btn:hover {
          background: #eef5fb;
          border-color: #2980b9;
          color: #0f3460;
        }

        .adm-btn.primary {
          background: #0f3460;
          color: #fff;
          border-color: #0f3460;
        }

        .adm-btn.primary:hover {
          background: #1a5276;
          border-color: #1a5276;
        }

        .adm-btn-link {
          font-size: 0.7rem;
          color: #7a99b5;
          text-decoration: none;
          transition: color 0.15s;
          padding: 0.38rem 0;
        }

        .adm-btn-link:hover { color: #0f3460; }

        /* ── Main content ── */
        .adm-main {
          max-width: 1260px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* ── Stats grid ── */
        .adm-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .adm-stat {
          background: #fff;
          border: 1px solid #cfe0f0;
          border-radius: 10px;
          padding: 1.2rem 1rem;
          text-align: center;
          box-shadow: 0 1px 4px rgba(15,52,96,0.05);
        }

        .adm-stat-value {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 2.3rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
          color: #0f3460;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .adm-stat-label {
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7a99b5;
          font-weight: 600;
        }

        /* ── Controls bar ── */
        .adm-controls {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .adm-select {
          background: #fff;
          border: 1px solid #cfe0f0;
          border-radius: 6px;
          color: #0d2236;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          padding: 0.42rem 0.85rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .adm-select:focus { border-color: #2980b9; }

        .adm-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
        }

        /* ── Calendar ── */
        .adm-cal-card {
          background: #fff;
          border: 1px solid #cfe0f0;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 1px 4px rgba(15,52,96,0.05);
        }

        .adm-cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .adm-cal-arrow {
          background: transparent;
          border: 1px solid #cfe0f0;
          border-radius: 6px;
          color: #3a5a78;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.15s;
        }

        .adm-cal-arrow:hover { background: #eef5fb; }

        .adm-cal-month {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #0f3460;
          text-transform: capitalize;
        }

        .adm-cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .adm-cal-day-header {
          text-align: center;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: #3a5a78;
          font-weight: 700;
          padding: 0.5rem 0 0.75rem;
          text-transform: uppercase;
        }

        .adm-cal-cell {
          height: 78px;
          padding: 0.45rem;
          border-radius: 6px;
          transition: background 0.12s;
          background: #f8fafc;
          border: 1px solid transparent;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .adm-cal-cell.empty { background: transparent; border-color: transparent; }

        .adm-cal-cell.has-bookings {
          cursor: pointer;
        }

        .adm-cal-cell.has-bookings:hover {
          background: #eef5fb;
          border-color: #cfe0f0;
        }

        .adm-cal-cell.today {
          border-color: #2980b9;
          background: #eef5fb;
        }

        .adm-cal-date {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          color: #7a99b5;
          margin-bottom: 0.3rem;
          flex-shrink: 0;
        }

        .adm-cal-cell.today .adm-cal-date {
          color: #0f3460;
          font-weight: 700;
        }

        .adm-cal-dots {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
          flex: 1;
        }

        .adm-cal-dot {
          width: 100%;
          height: 5px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .adm-cal-count {
          font-size: 0.58rem;
          color: #7a99b5;
          margin-top: auto;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .adm-cal-card { padding: 1rem 0.6rem; }
          .adm-cal-cell { height: 62px; padding: 0.3rem; }
          .adm-cal-date { font-size: 0.7rem; margin-bottom: 0.15rem; }
          .adm-cal-count { font-size: 0.5rem; }
          .adm-cal-day-header { font-size: 0.52rem; padding: 0.4rem 0 0.5rem; }
        }

        .adm-cal-legend {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.25rem;
        }

        .adm-legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: #7a99b5;
        }

        .adm-legend-dot {
          width: 14px;
          height: 6px;
          border-radius: 3px;
        }

        /* ── Modal overlay ── */
        .adm-overlay {
          position: fixed;
          inset: 0;
          z-index: 9000;
          background: rgba(13,34,54,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .adm-modal {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(15,52,96,0.18);
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid #cfe0f0;
        }

        .adm-modal-header {
          padding: 1.5rem 1.75rem 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .adm-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f3460;
        }

        .adm-modal-close {
          background: transparent;
          border: none;
          color: #7a99b5;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.15s;
        }

        .adm-modal-close:hover { color: #0f3460; }

        .adm-modal-body {
          padding: 1.25rem 1.75rem 1.75rem;
        }

        .adm-detail-row {
          display: flex;
          gap: 1rem;
          padding: 0.65rem 0;
          border-bottom: 1px solid #eef5fb;
        }

        .adm-detail-row:last-of-type { border-bottom: none; }

        .adm-detail-label {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3a5a78;
          font-weight: 700;
          min-width: 90px;
          padding-top: 0.1rem;
          flex-shrink: 0;
        }

        .adm-detail-value {
          font-size: 0.85rem;
          color: #0d2236;
          flex: 1;
        }

        .adm-section-label {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3a5a78;
          font-weight: 700;
          margin-bottom: 0.65rem;
          margin-top: 1.5rem;
        }

        .adm-driver-btns {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .adm-driver-btn {
          background: #f4f8fc;
          border: 1.5px solid #cfe0f0;
          border-radius: 7px;
          padding: 0.6rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #3a5a78;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          min-width: 100px;
        }

        .adm-driver-btn:hover {
          border-color: #2980b9;
          background: #eef5fb;
          color: #0f3460;
        }

        .adm-driver-btn.active {
          background: #0f3460;
          border-color: #0f3460;
          color: #fff;
        }

        .adm-driver-phone {
          display: block;
          font-size: 0.6rem;
          font-weight: 400;
          opacity: 0.75;
          margin-top: 2px;
        }

        .adm-status-btns {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .adm-status-btn {
          border-radius: 6px;
          padding: 0.42rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.15s;
          background: #f4f8fc;
          color: #7a99b5;
          border-color: #cfe0f0;
        }

        .adm-status-btn:hover { background: #eef5fb; }

        .adm-whatsapp-btn {
          width: 100%;
          margin-top: 1.25rem;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: 7px;
          color: #166534;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 0.85rem;
          cursor: pointer;
          transition: background 0.15s;
          text-transform: uppercase;
        }

        .adm-whatsapp-btn:hover { background: #dcfce7; }

        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div className="adm-page">

        {/* Header */}
        <header className="adm-header">
          <div className="adm-brand">
            <img src="/logo.jpg" alt="MO" />
            <div>
              <div className="adm-brand-name">{t.title}</div>
              <div className="adm-brand-sub">MO Transfers4all · Athens</div>
            </div>
          </div>

          <div className="adm-header-actions">
            <div className="adm-lang-toggle">
              {['en','gr'].map(l => (
                <button
                  key={l}
                  className={`adm-lang-btn${lang === l ? ' active' : ''}`}
                  onClick={() => { setLang(l); localStorage.setItem('mo-lang', l) }}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <button
              className="adm-btn"
              onClick={async () => {
                const ok = await subscribeToPush(currentUserId)
                setPushEnabled(ok)
                if (ok) alert(lang === 'gr' ? '✅ Οι ειδοποιήσεις ενεργοποιήθηκαν!' : '✅ Push notifications enabled!')
                else alert(lang === 'gr' ? 'Αποτυχία ενεργοποίησης ειδοποιήσεων.' : 'Failed to enable push notifications.')
              }}
            >
              🔔 {pushEnabled ? (lang === 'gr' ? 'Ενεργές Ειδοποιήσεις ✓' : 'Alerts Enabled ✓') : t.enableAlerts}
            </button>
            <a href="/" className="adm-btn-link">{t.back}</a>
            <button className="adm-btn primary" onClick={async () => { await signOut(); navigate('/login') }}>{t.signOut}</button>
          </div>
        </header>

        {/* PWA install banner */}
        {canInstall && (
          <div style={{ background: 'var(--blue-deep)', color: '#fff', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.82rem' }}>📲 <strong>{t.installLead}</strong> — {t.installPrompt}</div>
            <button onClick={install} style={{ background: '#fff', color: 'var(--blue-deep)', border: 'none', borderRadius: '6px', padding: '0.45rem 1.1rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.installNow}</button>
          </div>
        )}

        <main className="adm-main">

          {/* Stats */}
          <div className="adm-stats">
            {[
              { label: t.total,     value: bookings.length,                                      accent: '#0f3460' },
              { label: t.pending,   value: bookings.filter(b => b.status === 'pending').length,  accent: '#b45309' },
              { label: t.assigned,  value: bookings.filter(b => b.status === 'assigned').length, accent: '#166534' },
              { label: t.completed, value: bookings.filter(b => b.status === 'completed').length,accent: '#475569' },
            ].map(s => (
              <div className="adm-stat" key={s.label}>
                <div className="adm-stat-value" style={{ color: s.accent }}>{s.value}</div>
                <div className="adm-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="adm-controls">
            <select className="adm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">{t.allStatus}</option>
              <option value="pending">{t.pending}</option>
              <option value="assigned">{t.assigned}</option>
              <option value="completed">{t.completed}</option>
            </select>
            <select className="adm-select" value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
              <option value="all">{t.allDrivers}</option>
              {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <button className="adm-btn" onClick={fetchBookings}>↻ {t.refresh}</button>
          </div>

          {/* CALENDAR VIEW */}
          {(
            <div className="adm-cal-card">
              <div className="adm-cal-nav">
                <button className="adm-cal-arrow" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>←</button>
                <div className="adm-cal-month">{monthName}</div>
                <button className="adm-cal-arrow" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>→</button>
              </div>

              <div className="adm-cal-grid" style={{ marginBottom: '2px' }}>
                {dayHeaders.map(d => (
                  <div key={d} className="adm-cal-day-header">{d}</div>
                ))}
              </div>

              <div className="adm-cal-grid">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e-${i}`} className="adm-cal-cell empty" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dayBookings = getBookingsForDay(day)
                  const today = new Date()
                  const isToday = today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear()
                  return (
                    <div
                      key={day}
                      className={`adm-cal-cell${isToday ? ' today' : ''}${dayBookings.length > 0 ? ' has-bookings' : ''}`}
                      onClick={() => { if (dayBookings.length > 0) setSelectedDay({ day, bookings: dayBookings }) }}
                    >
                      <div className="adm-cal-date">{day}</div>
                      {dayBookings.length > 0 && (
                        <>
                          <div className="adm-cal-dots">
                            {dayBookings.slice(0, 2).map(b => (
                              <div key={b.id} className="adm-cal-dot" style={{ background: b.source === 'website' ? '#2980b9' : '#c2410c', opacity: 0.75 }} />
                            ))}
                          </div>
                          <div className="adm-cal-count">{dayBookings.length} {t.bookings}</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="adm-cal-legend">
                <div className="adm-legend-item">
                  <div className="adm-legend-dot" style={{ background: '#2980b9' }} />
                  {lang === 'gr' ? 'Ιστοσελίδα' : 'Website'}
                </div>
                <div className="adm-legend-item">
                  <div className="adm-legend-dot" style={{ background: '#c2410c' }} />
                  {lang === 'gr' ? 'Ξενοδοχείο' : 'Hotel'}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Day modal */}
        {selectedDay && (
          <div className="adm-overlay" onClick={() => setSelectedDay(null)}>
            <div className="adm-modal" onClick={e => e.stopPropagation()}>
              <div className="adm-modal-header">
                <div className="adm-modal-title">
                  {selectedDay.day} {currentMonth.toLocaleString(lang === 'gr' ? 'el-GR' : 'en', { month: 'long' })}
                </div>
                <button className="adm-modal-close" onClick={() => setSelectedDay(null)}>✕</button>
              </div>
              <div className="adm-modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedDay.bookings.map(b => {
                    const sc = SOURCE[b.source] || SOURCE.website
                    const st = STATUS[b.status] || STATUS.pending
                    return (
                      <div
                        key={b.id}
                        onClick={() => { setSelectedBooking(b); setSelectedDay(null) }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cfe0f0',
                          borderLeft: `4px solid ${sc.color}`,
                          borderRadius: '8px',
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'background 0.12s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#eef5fb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 600, color: '#0d2236', fontSize: '0.88rem' }}>{b.passenger_name}</span>
                          <span style={{ color: '#2980b9', fontWeight: 600, fontSize: '0.82rem' }}>{b.time}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7a99b5' }}>{b.pickup} → {b.dropoff}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                          <span className="adm-tag" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{b.source}</span>
                          <span className="adm-tag" style={{ background: st.bg, color: st.color, borderColor: st.border }}>{b.status}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking detail modal */}
        {selectedBooking && (() => {
          const sc = SOURCE[selectedBooking.source] || SOURCE.website
          const st = STATUS[selectedBooking.status] || STATUS.pending
          const GR_STATUS = { pending: 'Εκκρεμεί', assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε' }
          return (
            <div className="adm-overlay" onClick={() => setSelectedBooking(null)}>
              <div className="adm-modal" onClick={e => e.stopPropagation()}>
                <div className="adm-modal-header">
                  <div>
                    <div className="adm-modal-title">{t.details}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <span className="adm-tag" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{selectedBooking.source}</span>
                      <span className="adm-tag" style={{ background: st.bg, color: st.color, borderColor: st.border }}>{selectedBooking.status}</span>
                    </div>
                  </div>
                  <button className="adm-modal-close" onClick={() => setSelectedBooking(null)}>✕</button>
                </div>

                <div className="adm-modal-body">
                  {[
                    [t.passenger, selectedBooking.passenger_name],
                    [t.phone,     selectedBooking.passenger_phone],
                    [t.email,     selectedBooking.passenger_email || '—'],
                    [t.date,      selectedBooking.date],
                    [t.time,      selectedBooking.time],
                    [t.pickup,    selectedBooking.pickup],
                    [t.dropoff,   selectedBooking.dropoff],
                    [t.vehicle,   selectedBooking.vehicle],
                    [t.flight,    selectedBooking.flight_number || '—'],
                    [t.notes,     selectedBooking.notes || '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="adm-detail-row">
                      <div className="adm-detail-label">{label}</div>
                      <div className="adm-detail-value">{value}</div>
                    </div>
                  ))}

                  <div className="adm-section-label">{t.assignDriver}</div>
                  <div className="adm-driver-btns">
                    {DRIVERS.map(d => (
                      <button
                        key={d.value}
                        className={`adm-driver-btn${selectedBooking.assigned_to === d.value ? ' active' : ''}`}
                        onClick={() => updateBooking(selectedBooking.id, { assigned_to: d.value, status: 'assigned' })}
                      >
                        {d.label}
                        <span className="adm-driver-phone">{d.phone}</span>
                      </button>
                    ))}
                  </div>

                  <div className="adm-section-label" style={{ marginTop: '1.25rem' }}>{t.status}</div>
                  <div className="adm-status-btns">
                    {['pending','assigned','completed'].map(s => {
                      const c = STATUS[s]
                      const isActive = selectedBooking.status === s
                      return (
                        <button
                          key={s}
                          className="adm-status-btn"
                          onClick={() => updateBooking(selectedBooking.id, { status: s })}
                          style={isActive ? { background: c.bg, color: c.color, borderColor: c.border } : {}}
                        >
                          {lang === 'gr' ? GR_STATUS[s] : s}
                        </button>
                      )
                    })}
                  </div>

                  <button className="adm-whatsapp-btn" onClick={() => shareBooking(selectedBooking)}>
                    📤 {t.share}
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </>
  )
}
