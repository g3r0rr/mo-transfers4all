import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'
import { useGoogleAutocomplete } from '../lib/useGooglePlaces'

function AutocompleteInput({ placeholder, value, onChange }) {
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
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

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="htl-input"
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
          background: '#fff', border: '1.5px solid #cfe0f0', borderTop: 'none',
          borderRadius: '0 0 8px 8px', maxHeight: '210px', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(15,52,96,0.12)'
        }}>
          {results.map((f, i) => {
            const main = f.structured_formatting.main_text
            const sub  = f.structured_formatting.secondary_text
            return (
              <div
                key={i}
                onMouseDown={() => { onChange(f.description); setOpen(false) }}
                style={{ padding: '0.7rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eef5fb', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#eef5fb'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ fontWeight: 500, fontSize: '0.82rem', color: '#0d2236' }}>📍 {main}</div>
                <div style={{ fontSize: '0.7rem', color: '#7a99b5', marginTop: '1px' }}>{sub}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const STATUS = {
  pending:   { bg: '#fef9ec', color: '#b45309', border: '#fde68a' },
  assigned:  { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  completed: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
}

const T = {
  en: {
    portal: 'Hotel Portal', signOut: 'Sign Out',
    newBooking: 'New Transfer Booking',
    newBookingSub: 'Fill in the passenger details and transfer information below.',
    passengerName: 'Passenger Name *', passengerNamePh: 'John Smith',
    phone: 'Phone / WhatsApp *', phonePh: '+30 6xx xxx xxxx',
    email: 'Email', emailPh: 'passenger@email.com',
    vehicle: 'Vehicle *', selectVehicle: '— Select vehicle —',
    taxi: 'Taxi — 1 to 4 Passengers', van: 'Van — 5 to 9 Passengers',
    pickup: 'Pickup Location *', pickupPh: 'Airport / Hotel / Address',
    dropoff: 'Drop-off Location *', dropoffPh: 'Destination',
    date: 'Date *', time: 'Time *',
    flight: 'Flight / Ship Number', flightPh: 'e.g. A3 601',
    notes: 'Notes', notesPh: 'Special requests…',
    submit: 'Submit Booking', submitting: 'Submitting…',
    success: 'Booking submitted successfully.',
    submittedTitle: 'Submitted Bookings',
    submittedSub: 'All transfers submitted through this portal.',
    loading: 'Loading bookings…', noBookings: 'No bookings submitted yet.',
    colDate: 'Date', colTime: 'Time', colPassenger: 'Passenger', colPhone: 'Phone',
    colPickup: 'Pickup', colDropoff: 'Drop-off', colVehicle: 'Vehicle', colStatus: 'Status',
    pending: 'Pending', assigned: 'Assigned', completed: 'Completed',
  },
  gr: {
    portal: 'Πύλη Ξενοδοχείου', signOut: 'Έξοδος',
    newBooking: 'Νέα Κράτηση Μεταφοράς',
    newBookingSub: 'Συμπληρώστε τα στοιχεία επιβάτη και τις πληροφορίες μεταφοράς παρακάτω.',
    passengerName: 'Όνομα Επιβάτη *', passengerNamePh: 'Γιάννης Παπαδόπουλος',
    phone: 'Τηλέφωνο / WhatsApp *', phonePh: '+30 6xx xxx xxxx',
    email: 'Email', emailPh: 'epibatis@email.com',
    vehicle: 'Όχημα *', selectVehicle: '— Επιλέξτε όχημα —',
    taxi: 'Ταξί — 1 έως 4 Επιβάτες', van: 'Van — 5 έως 9 Επιβάτες',
    pickup: 'Σημείο Παραλαβής *', pickupPh: 'Αεροδρόμιο / Ξενοδοχείο / Διεύθυνση',
    dropoff: 'Σημείο Προορισμού *', dropoffPh: 'Προορισμός',
    date: 'Ημερομηνία *', time: 'Ώρα *',
    flight: 'Αριθμός Πτήσης / Πλοίου', flightPh: 'π.χ. A3 601',
    notes: 'Σημειώσεις', notesPh: 'Ειδικά αιτήματα…',
    submit: 'Υποβολή Κράτησης', submitting: 'Υποβολή…',
    success: 'Η κράτηση υποβλήθηκε με επιτυχία.',
    submittedTitle: 'Υποβληθείσες Κρατήσεις',
    submittedSub: 'Όλες οι μεταφορές που υποβλήθηκαν μέσω αυτής της πύλης.',
    loading: 'Φόρτωση κρατήσεων…', noBookings: 'Δεν έχουν υποβληθεί κρατήσεις ακόμη.',
    colDate: 'Ημερομηνία', colTime: 'Ώρα', colPassenger: 'Επιβάτης', colPhone: 'Τηλέφωνο',
    colPickup: 'Παραλαβή', colDropoff: 'Προορισμός', colVehicle: 'Όχημα', colStatus: 'Κατάσταση',
    pending: 'Εκκρεμεί', assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε',
  }
}

export default function HotelDashboard() {
  const navigate = useNavigate()
  const [user, setUser]           = useState(null)
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg]             = useState(null)
  const [form, setForm] = useState({
    passenger_name: '', passenger_phone: '', passenger_email: '',
    pickup: '', dropoff: '', date: '', time: '',
    vehicle: '', notes: '', flight_number: ''
  })
  const [lang, setLang] = useState(localStorage.getItem('mo-lang') || 'en')

  const t = T[lang]

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      fetchBookings()
    })
  }, [])

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings').select('*').eq('source', 'hotel').order('date', { ascending: true })
    setBookings(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    const { error } = await supabase.from('bookings').insert([{ ...form, source: 'hotel', status: 'pending', lang }])
    if (error) {
      setMsg({ type: 'error', text: 'Error: ' + error.message })
    } else {
      // WhatsApp notification is now sent server-side by the
      // send-booking-push Edge Function (triggered by the bookings
      // INSERT webhook). The old client-side CallMeBot fetch() call
      // was removed from here because browsers can't read CallMeBot's
      // response due to CORS, and it also hardcoded the API key.
      setMsg({ type: 'success', text: '✅ Booking submitted successfully.' })
      setForm({ passenger_name: '', passenger_phone: '', passenger_email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', notes: '', flight_number: '' })
      fetchBookings()
    }
    setSubmitting(false)
  }

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .htl-page {
          min-height: 100vh;
          background: #f4f8fc;
          font-family: 'Inter', sans-serif;
          color: #0d2236;
        }

        /* ── Header ── */
        .htl-header {
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
          .htl-header {
            justify-content: center;
            text-align: center;
          }
          .htl-header-actions {
            width: 100%;
            justify-content: center;
          }
        }

        .htl-header-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .htl-lang-toggle {
          display: flex;
          border: 1px solid #cfe0f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .htl-lang-btn {
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

        .htl-lang-btn.active {
          background: #0f3460;
          color: #fff;
        }

        .htl-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .htl-brand img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #2980b9;
        }

        .htl-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f3460;
          line-height: 1.2;
        }

        .htl-brand-sub {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2980b9;
          font-weight: 600;
        }

        .htl-signout {
          background: transparent;
          border: 1px solid #cfe0f0;
          border-radius: 6px;
          color: #3a5a78;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .htl-signout:hover {
          background: #eef5fb;
          border-color: #2980b9;
          color: #0f3460;
        }

        /* ── Main ── */
        .htl-main {
          max-width: 1060px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* ── Card ── */
        .htl-card {
          background: #fff;
          border: 1px solid #cfe0f0;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(15,52,96,0.05);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .htl-card-accent {
          height: 4px;
          background: linear-gradient(90deg, #0f3460, #2980b9);
        }

        .htl-card-body {
          padding: 2rem;
        }

        .htl-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem;
          font-weight: 600;
          color: #0f3460;
          margin-bottom: 0.3rem;
        }

        .htl-card-subtitle {
          font-size: 0.8rem;
          color: #7a99b5;
          margin-bottom: 2rem;
        }

        /* ── Form grid ── */
        .htl-form-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .htl-field { display: flex; flex-direction: column; }

        .htl-label {
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a5a78;
          font-weight: 700;
          margin-bottom: 0.45rem;
        }

        .htl-input {
          width: 100%;
          background: #f4f8fc;
          border: 1.5px solid #cfe0f0;
          border-radius: 7px;
          color: #0d2236;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          padding: 0.78rem 1rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .htl-input:focus {
          border-color: #2980b9;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(41,128,185,0.12);
        }

        .htl-input::placeholder { color: #7a99b5; }

        .htl-select {
          width: 100%;
          background: #f4f8fc;
          border: 1.5px solid #cfe0f0;
          border-radius: 7px;
          color: #0d2236;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          padding: 0.78rem 1rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%237a99b5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .htl-select:focus {
          border-color: #2980b9;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(41,128,185,0.12);
        }

        .htl-full { grid-column: 1 / -1; }

        .htl-submit-btn {
          width: 100%;
          background: #0f3460;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 0.9rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(15,52,96,0.18);
        }

        .htl-submit-btn:hover:not(:disabled) {
          background: #1a5276;
          box-shadow: 0 4px 18px rgba(15,52,96,0.26);
          transform: translateY(-1px);
        }

        .htl-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .htl-msg {
          margin-top: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 7px;
          font-size: 0.82rem;
          border-width: 1px;
          border-style: solid;
        }

        .htl-msg.success {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        }

        .htl-msg.error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* ── Table ── */
        .htl-table-wrap { overflow-x: auto; }

        .htl-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .htl-table thead tr {
          border-bottom: 1px solid #cfe0f0;
          background: #f8fafc;
        }

        .htl-table th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #3a5a78;
          font-weight: 700;
          white-space: nowrap;
        }

        .htl-table tbody tr {
          border-bottom: 1px solid #eef5fb;
          transition: background 0.12s;
        }

        .htl-table tbody tr:last-child { border-bottom: none; }
        .htl-table tbody tr:hover { background: #f4f8fc; }

        .htl-table td {
          padding: 0.72rem 1rem;
          color: #3a5a78;
          white-space: nowrap;
        }

        .htl-table td.primary {
          color: #0d2236;
          font-weight: 500;
        }

        .htl-table td.truncate {
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .htl-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
        }

        .htl-empty {
          padding: 3rem;
          text-align: center;
          color: #7a99b5;
          font-size: 0.85rem;
        }
      `}</style>

      <div className="htl-page">

        {/* Header */}
        <header className="htl-header">
          <div className="htl-brand">
            <img src="/logo.jpg" alt="MO" />
            <div>
              <div className="htl-brand-name">{t.portal}</div>
              <div className="htl-brand-sub">MO Transfers4all · Athens</div>
            </div>
          </div>
          <div className="htl-header-actions">
            <div className="htl-lang-toggle">
              {['en','gr'].map(l => (
                <button
                  key={l}
                  className={`htl-lang-btn${lang === l ? ' active' : ''}`}
                  onClick={() => { setLang(l); localStorage.setItem('mo-lang', l) }}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <button className="htl-signout" onClick={async () => { await signOut(); navigate('/login') }}>{t.signOut}</button>
          </div>
        </header>

        <main className="htl-main">

          {/* Submit Booking Card */}
          <div className="htl-card">
            <div className="htl-card-accent" />
            <div className="htl-card-body">
              <h2 className="htl-card-title">{t.newBooking}</h2>
              <p className="htl-card-subtitle">{t.newBookingSub}</p>

              <form onSubmit={handleSubmit}>
                <div className="htl-form-grid">

                  <div className="htl-field">
                    <label className="htl-label">{t.passengerName}</label>
                    <input className="htl-input" required placeholder={t.passengerNamePh} {...f('passenger_name')} />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.phone}</label>
                    <input className="htl-input" required type="tel" placeholder={t.phonePh} {...f('passenger_phone')} />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.email}</label>
                    <input className="htl-input" type="email" placeholder={t.emailPh} {...f('passenger_email')} />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.vehicle}</label>
                    <select className="htl-select" required value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})}>
                      <option value="">{t.selectVehicle}</option>
                      <option value="Taxi (1-4 Επιβάτες)">{t.taxi}</option>
                      <option value="Van (5-9 Επιβάτες)">{t.van}</option>
                    </select>
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.pickup}</label>
                    <AutocompleteInput
                      placeholder={t.pickupPh}
                      value={form.pickup}
                      onChange={val => setForm({...form, pickup: val})}
                    />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.dropoff}</label>
                    <AutocompleteInput
                      placeholder={t.dropoffPh}
                      value={form.dropoff}
                      onChange={val => setForm({...form, dropoff: val})}
                    />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.date}</label>
                    <input className="htl-input" required type="date" {...f('date')} />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.time}</label>
                    <input className="htl-input" required type="time" {...f('time')} />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.flight}</label>
                    <input className="htl-input" placeholder={t.flightPh} {...f('flight_number')} />
                  </div>

                  <div className="htl-field">
                    <label className="htl-label">{t.notes}</label>
                    <input className="htl-input" placeholder={t.notesPh} {...f('notes')} />
                  </div>

                  <div className="htl-full">
                    <button type="submit" className="htl-submit-btn" disabled={submitting}>
                      {submitting ? t.submitting : t.submit}
                    </button>
                  </div>

                </div>
              </form>

              {msg && (
                <div className={`htl-msg ${msg.type}`}>
                  {msg.type === 'success' ? '✓ ' : '✕ '}{msg.text}
                </div>
              )}
            </div>
          </div>

          {/* Bookings Table Card */}
          <div className="htl-card">
            <div className="htl-card-accent" />
            <div className="htl-card-body" style={{ paddingBottom: '0' }}>
              <h2 className="htl-card-title">{t.submittedTitle}</h2>
              <p className="htl-card-subtitle">{t.submittedSub}</p>
            </div>

            {loading ? (
              <div className="htl-empty">{t.loading}</div>
            ) : bookings.length === 0 ? (
              <div className="htl-empty">{t.noBookings}</div>
            ) : (
              <div className="htl-table-wrap">
                <table className="htl-table">
                  <thead>
                    <tr>
                      {[t.colDate, t.colTime, t.colPassenger, t.colPhone, t.colPickup, t.colDropoff, t.colVehicle, t.colStatus].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const st = STATUS[b.status] || STATUS.pending
                      return (
                        <tr key={b.id}>
                          <td className="primary">{b.date}</td>
                          <td className="primary">{b.time}</td>
                          <td className="primary">{b.passenger_name}</td>
                          <td><a href={`tel:${b.passenger_phone}`} style={{ color: '#2980b9', textDecoration: 'none' }}>{b.passenger_phone}</a></td>
                          <td className="truncate">{b.pickup}</td>
                          <td className="truncate">{b.dropoff}</td>
                          <td>{b.vehicle}</td>
                          <td>
                            <span className="htl-tag" style={{ background: st.bg, color: st.color, borderColor: st.border }}>{t[b.status] || b.status}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  )
}
