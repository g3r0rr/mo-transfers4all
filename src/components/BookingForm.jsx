import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { trackBookingSubmitted } from '../lib/analytics'
import { useGoogleAutocomplete } from '../lib/useGooglePlaces'
const translations = {
  en: {
    tag: 'Reservations', title: 'Book Your', titleEm: 'Ride',
    asideTitle: 'Simple, honest booking.',
    asideSub: 'Enter your route below and we\'ll confirm your ride promptly. Fixed prices, no hidden fees, no surprises.',
    perks: [
      { icon: '✈️', label: 'Flight Monitoring', desc: 'We track your flight and adapt to any delays automatically.' },
      { icon: '💳', label: 'Flexible Payment', desc: 'Pay by card, IRIS or cash directly to the driver.' },
      { icon: '🔒', label: 'Data Privacy', desc: 'Your data is used only for this booking and deleted after your ride.' },
    ],
    name: 'Full Name *', phone: 'Phone / WhatsApp *', email: 'Email *',
    pickup: 'Pickup Location *', dropoff: 'Drop-off Location *',
    date: 'Date *', time: 'Time *', vehicle: 'Vehicle *',
    notes: 'Flight Number / Notes',
    taxi: 'Taxi — 1 to 4 Passengers', van: 'Van — 5 to 9 Passengers',
    select: '— Select vehicle —',
    privacy: '🔒 Your personal data is used exclusively for this booking and permanently deleted after your transfer.',
    privacyLink: 'Privacy Policy',
    submit: 'Send Booking Request', sending: 'Sending...',
    success: '✅ Booking sent! We will contact you shortly.',
    error: '❌ An error occurred. Please call us directly.',
    pickupPh: 'Airport / Hotel / Address',
    dropoffPh: 'Your destination',
    namePh: 'John Smith',
    phonePh: '+30 6xx xxx xxxx',
    notesPh: 'e.g. A3 601, large luggage...',
  },
  gr: {
    tag: 'Κρατήσεις', title: 'Κλείστε', titleEm: 'Θέση',
    asideTitle: 'Απλή, διαφανής κράτηση.',
    asideSub: 'Συμπληρώστε τη διαδρομή σας και θα επιβεβαιώσουμε τη διαδρομή σας άμεσα. Σταθερές τιμές, χωρίς κρυφές χρεώσεις.',
    perks: [
      { icon: '✈️', label: 'Παρακολούθηση Πτήσης', desc: 'Παρακολουθούμε την πτήση σας και προσαρμοζόμαστε αυτόματα σε καθυστερήσεις.' },
      { icon: '💳', label: 'Ευέλικτη Πληρωμή', desc: 'Πληρωμή με κάρτα, IRIS ή μετρητά απευθείας στον οδηγό.' },
      { icon: '🔒', label: 'Απόρρητο Δεδομένων', desc: 'Τα δεδομένα σας χρησιμοποιούνται μόνο για αυτή την κράτηση και διαγράφονται μετά.' },
    ],
    name: 'Ονοματεπώνυμο *', phone: 'Τηλέφωνο / WhatsApp *', email: 'Email *',
    pickup: 'Σημείο Παραλαβής *', dropoff: 'Προορισμός *',
    date: 'Ημερομηνία *', time: 'Ώρα *', vehicle: 'Όχημα *',
    notes: 'Αριθμός Πτήσης / Σημειώσεις',
    taxi: 'Ταξί — 1 έως 4 Επιβάτες', van: 'Van — 5 έως 9 Επιβάτες',
    select: '— Επιλογή οχήματος —',
    privacy: '🔒 Τα προσωπικά σας δεδομένα χρησιμοποιούνται αποκλειστικά για αυτή την κράτηση και διαγράφονται μετά τη μεταφορά.',
    privacyLink: 'Πολιτική Απορρήτου',
    submit: 'Αποστολή Αιτήματος', sending: 'Αποστολή...',
    success: '✅ Η κράτηση στάλθηκε! Θα επικοινωνήσουμε σύντομα.',
    error: '❌ Παρουσιάστηκε σφάλμα. Παρακαλώ καλέστε μας.',
    pickupPh: 'Αεροδρόμιο / Ξενοδοχείο / Διεύθυνση',
    dropoffPh: 'Ο προορισμός σας',
    namePh: 'Γιάννης Παπαδόπουλος',
    phonePh: '+30 6xx xxx xxxx',
    notesPh: 'π.χ. A3 601, μεγάλες αποσκευές...',
  }
}

function AutocompleteInput({ placeholder, value, onChange }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const timer = useRef(null)
  const { getPredictions } = useGoogleAutocomplete()

  const handleInput = (e) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(timer.current)
    if (val.length < 2) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(() => {
      getPredictions(val, (predictions) => {
        setResults(predictions)
        setOpen(predictions.length > 0)
      })
    }, 300)
  }

  const inputStyle = {
    width: '100%', padding: '0.72rem 1rem',
    border: `1px solid ${focused ? 'var(--blue-bright)' : 'var(--border)'}`,
    borderRadius: '6px', fontFamily: 'Inter, sans-serif',
    fontSize: '0.84rem', color: 'var(--text-dark)', background: '#fff',
    outline: 'none', boxShadow: focused ? '0 0 0 3px rgba(41,128,185,0.1)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text" value={value} placeholder={placeholder}
        onChange={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 200) }}
        style={inputStyle}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
          background: '#fff', border: '1px solid var(--border)', borderTop: 'none',
          borderRadius: '0 0 6px 6px', maxHeight: '220px', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(15,52,96,0.1)'
        }}>
          {results.map((f, i) => {
            const main = f.structured_formatting.main_text
            const sub = f.structured_formatting.secondary_text
            return (
              <div key={i} onMouseDown={() => { onChange(f.description); setOpen(false) }}
                style={{ padding: '0.7rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '0.78rem' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mist)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ fontWeight: 500, color: 'var(--text-dark)' }}>📍 {main}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>{sub}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BookingForm({ lang, prefillPickup, prefillDropoff }) {
  const t = translations[lang]
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    pickup: prefillPickup || '', dropoff: prefillDropoff || '',
    date: '', time: '', vehicle: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [focused, setFocused] = useState({})

  useEffect(() => {
    if (prefillPickup || prefillDropoff) {
      setForm(f => ({ ...f, pickup: prefillPickup || f.pickup, dropoff: prefillDropoff || f.dropoff }))
    }
  }, [prefillPickup, prefillDropoff])

  const inputStyle = (field) => ({
    width: '100%', padding: '0.72rem 1rem',
    border: `1px solid ${focused[field] ? 'var(--blue-bright)' : 'var(--border)'}`,
    borderRadius: '6px', fontFamily: 'Inter, sans-serif',
    fontSize: '0.84rem', color: 'var(--text-dark)', background: '#fff',
    outline: 'none', boxShadow: focused[field] ? '0 0 0 3px rgba(41,128,185,0.1)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', WebkitAppearance: 'none'
  })

  const labelStyle = {
    fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)',
    fontWeight: 600, letterSpacing: '0.04em', display: 'block', marginBottom: '0.38rem'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const { error } = await supabase.from('bookings').insert([{
        source: 'website',
        passenger_name: form.name,
        passenger_phone: form.phone,
        passenger_email: form.email,
        pickup: form.pickup,
        dropoff: form.dropoff,
        date: form.date,
        time: form.time,
        vehicle: form.vehicle,
        notes: form.notes,
        status: 'pending',
        lang: lang
      }])

      if (error) throw new Error('Booking error: ' + error.message)

      trackBookingSubmitted(form.vehicle, 'website')

      // WhatsApp notification is now sent server-side by the
      // send-booking-push Edge Function (triggered by the bookings
      // INSERT webhook), since browsers can't reliably call CallMeBot
      // directly — its API doesn't return CORS headers, so the fetch()
      // that used to be here was silently failing.

      setMsg({ type: 'success', text: t.success })
      setForm({ name: '', phone: '', email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', notes: '' })
    } catch (err) {
      setMsg({ type: 'error', text: err.message || t.error })
    }
    setLoading(false)
  }

  return (
    <section id="booking" style={{ padding: '88px 1.5rem', background: 'var(--blue-deep)' }}>
      <style>{`
        .booking-form-grid input,
        .booking-form-grid select,
        .booking-form-grid textarea {
          color: #0f3460 !important;
          background: #fff !important;
        }
        .booking-form-grid input::placeholder { color: #94aec4; }
        .booking-perks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-top: 2.5rem; }
        @media (max-width: 700px) {
          .booking-perks { grid-template-columns: 1fr; gap: 0.85rem; }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '680px' }}>

        {/* Header */}
        <div className="section-header reveal" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>{t.tag}</span>
          <h2 className="section-title" style={{ color: '#fff' }}>{t.title} <em style={{ color: '#7ec8f0' }}>{t.titleEm}</em></h2>
          <div className="blue-line" style={{ background: 'linear-gradient(90deg,#7ec8f0,rgba(126,200,240,0.2))' }}/>
        </div>

        {/* Description */}
        <div className="reveal" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem' }}>{t.asideTitle}</h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8 }}>{t.asideSub}</p>
        </div>

        {/* Form card */}
        <div className="reveal booking-form-grid" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '14px', padding: '2rem 1.75rem', backdropFilter: 'blur(8px)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '1.1rem', marginBottom: '1.1rem', alignItems: 'start' }}>

              <div style={{ gridRow: 1, gridColumn: 1 }}>
                <label style={labelStyle}>{t.name}</label>
              </div>
              <div style={{ gridRow: 1, gridColumn: 2 }}>
                <label style={labelStyle}>{t.phone}</label>
              </div>

              <div style={{ gridRow: 2, gridColumn: 1 }}>
                <input required style={inputStyle('name')} value={form.name} placeholder={t.namePh}
                  onChange={e => setForm({...form, name: e.target.value})}
                  onFocus={() => setFocused({...focused, name: true})}
                  onBlur={() => setFocused({...focused, name: false})}/>
              </div>
              <div style={{ gridRow: 2, gridColumn: 2 }}>
                <input required style={inputStyle('phone')} type="tel" value={form.phone} placeholder={t.phonePh}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  onFocus={() => setFocused({...focused, phone: true})}
                  onBlur={() => setFocused({...focused, phone: false})}/>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem', marginBottom: '1.1rem' }}>
              <div>
                <label style={labelStyle}>{t.email}</label>
                <input required style={inputStyle('email')} type="email" value={form.email} placeholder="your@email.com"
                  onChange={e => setForm({...form, email: e.target.value})}
                  onFocus={() => setFocused({...focused, email: true})}
                  onBlur={() => setFocused({...focused, email: false})}/>
              </div>

              <div>
                <label style={labelStyle}>{t.vehicle}</label>
                <select required style={inputStyle('vehicle')} value={form.vehicle}
                  onChange={e => setForm({...form, vehicle: e.target.value})}
                  onFocus={() => setFocused({...focused, vehicle: true})}
                  onBlur={() => setFocused({...focused, vehicle: false})}>
                  <option value="">{t.select}</option>
                  <option value="Taxi (1-4 Επιβάτες)">{t.taxi}</option>
                  <option value="Van (5-9 Επιβάτες)">{t.van}</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{t.pickup}</label>
                <AutocompleteInput placeholder={t.pickupPh} value={form.pickup} onChange={val => setForm({...form, pickup: val})}/>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{t.dropoff}</label>
                <AutocompleteInput placeholder={t.dropoffPh} value={form.dropoff} onChange={val => setForm({...form, dropoff: val})}/>
              </div>

              <div>
                <label style={labelStyle}>{t.date}</label>
                <input required style={inputStyle('date')} type="date" value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                  onFocus={() => setFocused({...focused, date: true})}
                  onBlur={() => setFocused({...focused, date: false})}/>
              </div>

              <div>
                <label style={labelStyle}>{t.time}</label>
                <input required style={inputStyle('time')} type="time" value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})}
                  onFocus={() => setFocused({...focused, time: true})}
                  onBlur={() => setFocused({...focused, time: false})}/>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{t.notes}</label>
                <input style={inputStyle('notes')} value={form.notes} placeholder={t.notesPh}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  onFocus={() => setFocused({...focused, notes: true})}
                  onBlur={() => setFocused({...focused, notes: false})}/>
              </div>

            </div>

            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, borderLeft: '2px solid rgba(126,200,240,0.5)', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0 6px 6px 0', marginBottom: '1.2rem' }}>
              {t.privacy} <a href="/privacy" style={{ color: '#7ec8f0' }}>{t.privacyLink}</a>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'linear-gradient(135deg,#2980b9,#1a5276)',
              color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px',
              fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
              fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 18px rgba(0,0,0,0.3)', transition: 'all 0.2s'
            }}>{loading ? t.sending : t.submit}</button>

            {msg && (
              <div style={{
                marginTop: '1rem', padding: '0.75rem', textAlign: 'center',
                fontSize: '0.8rem', borderRadius: '6px',
                color: msg.type === 'success' ? '#86efac' : '#fca5a5',
                background: msg.type === 'success' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)',
                border: `1px solid ${msg.type === 'success' ? 'rgba(134,239,172,0.3)' : 'rgba(252,165,165,0.3)'}`
              }}>{msg.text}</div>
            )}
          </form>
        </div>

        {/* Perks below */}
        <div className="booking-perks reveal">
          {t.perks.map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '1.1rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(126,200,240,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{p.icon}</div>
              <div>
                <span style={{ fontWeight: 600, color: '#7ec8f0', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem', letterSpacing: '0.02em' }}>{p.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>{p.desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}