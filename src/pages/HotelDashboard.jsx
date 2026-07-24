import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'
import { useGoogleAutocomplete } from '../lib/useGooglePlaces'
import { COUNTRIES } from '../lib/countries'

function CountrySelect({ dial, onChange, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const current = COUNTRIES.find(c => c.d === dial) || COUNTRIES[0]

  return (
    <div className={`htl-country${open ? ' open' : ''}`} ref={ref}>
      <button type="button" className="htl-country-btn"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
        aria-label={label} aria-expanded={open}>
        <span className="htl-cflag">{current.f}</span>
        <span className="htl-cdial">{current.d}</span>
        <span className="htl-caret">▾</span>
      </button>
      {open && (
        <div className="htl-country-menu" role="listbox">
          {COUNTRIES.map(c => (
            <div key={c.n} className="htl-country-item" role="option" aria-selected={c.d === dial}
              onClick={() => { onChange(c.d); setOpen(false) }}>
              <span className="htl-cflag">{c.f}</span>
              <span className="htl-cname">{c.n}</span>
              <span className="htl-cdial">{c.d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AutocompleteInput({ id, label, value, onChange }) {
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
    <div className="htl-fl" style={{ position: 'relative' }}>
      <input
        id={id}
        type="text"
        value={value}
        placeholder=" "
        autoComplete="off"
        required
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      <label htmlFor={id}>{label}</label>
      {open && results.length > 0 && (
        <div className="htl-ac-menu">
          {results.map((f, i) => {
            const main = f.structured_formatting.main_text
            const sub  = f.structured_formatting.secondary_text
            return (
              <div key={i} className="htl-ac-item" onMouseDown={() => { onChange(f.description); setOpen(false) }}>
                <div className="htl-ac-main">📍 {main}</div>
                <div className="htl-ac-sub">{sub}</div>
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
    taxiSeg: 'Taxi · 1–4', vanSeg: 'Van · 5–9',
    route: 'Route', needVehicle: 'Please choose a vehicle.', countryLabel: 'Country code',
    luggage: 'Luggage', luggageSelect: '— Select —',
    luggageOpts: [ { v: '0', l: 'No luggage' }, { v: '1-2', l: '1–2 bags' }, { v: '3-4', l: '3–4 bags' }, { v: '5+', l: '5+ bags' } ],
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
    phone: 'Τηλ. / WhatsApp *', phonePh: '+30 6xx xxx xxxx',
    email: 'Email', emailPh: 'epibatis@email.com',
    vehicle: 'Όχημα *', selectVehicle: '— Επιλέξτε όχημα —',
    taxi: 'Ταξί — 1 έως 4 Επιβάτες', van: 'Van — 5 έως 9 Επιβάτες',
    taxiSeg: 'Ταξί · 1–4', vanSeg: 'Van · 5–9',
    route: 'Διαδρομή', needVehicle: 'Παρακαλώ επιλέξτε όχημα.', countryLabel: 'Κωδικός χώρας',
    luggage: 'Αποσκευές', luggageSelect: '— Επιλογή —',
    luggageOpts: [ { v: '0', l: 'Χωρίς αποσκευές' }, { v: '1-2', l: '1–2 βαλίτσες' }, { v: '3-4', l: '3–4 βαλίτσες' }, { v: '5+', l: '5+ βαλίτσες' } ],
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
    vehicle: '', luggage: '', notes: '', flight_number: ''
  })
  const [dial, setDial] = useState('+30')
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

    // Vehicle is a segmented control, not a native <select required>, so
    // validate it ourselves before hitting the network.
    if (!form.vehicle) {
      setMsg({ type: 'error', text: t.needVehicle })
      return
    }

    setSubmitting(true)
    setMsg(null)
    // Fetched fresh here (rather than relying on the `user` state, which
    // is set by a separate fire-and-forget effect on mount) so a booking
    // submitted quickly after page load still gets tagged with the right
    // owner — created_by is what the "View bookings by role" RLS policy
    // uses to keep each hotel partner's bookings private from others.
    const { data: { session } } = await supabase.auth.getSession()
    const { error } = await supabase.from('bookings').insert([{
      ...form,
      // Prepend the selected country dial code so the stored number is
      // dialable as-is (e.g. "+30 6936475451").
      passenger_phone: `${dial} ${form.passenger_phone}`.trim(),
      luggage: form.luggage || null,
      source: 'hotel', status: 'pending', lang, created_by: session?.user?.id
    }])
    if (error) {
      setMsg({ type: 'error', text: 'Error: ' + error.message })
    } else {
      // WhatsApp notification is now sent server-side by the
      // send-booking-push Edge Function (triggered by the bookings
      // INSERT webhook). The old client-side CallMeBot fetch() call
      // was removed from here because browsers can't read CallMeBot's
      // response due to CORS, and it also hardcoded the API key.
      setMsg({ type: 'success', text: '✅ Booking submitted successfully.' })
      setForm({ passenger_name: '', passenger_phone: '', passenger_email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', luggage: '', notes: '', flight_number: '' })
      setDial('+30')
      fetchBookings()
    }
    setSubmitting(false)
  }

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) })

  return (
    <>
      <style>{`
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
          transition: background 0.15s, color 0.15s, transform 0.12s ease;
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

        /* ── Floating-label fields (match the public booking form) ── */
        .htl-fl { position: relative; }
        .htl-fl > input, .htl-fl > select, .htl-country-btn {
          width: 100%; background: #f4f8fc; border: 1.5px solid #cfe0f0; border-radius: 9px;
          color: #0d2236; font-family: 'Inter', sans-serif; font-size: 0.88rem;
          padding: 1.3rem 1rem 0.5rem; min-height: 54px; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .htl-fl > select {
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%237a99b5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem;
        }
        .htl-fl > label {
          position: absolute; left: 1rem; top: 1rem; color: #7a99b5; font-size: 0.88rem;
          pointer-events: none; transition: top 0.16s, font-size 0.16s, color 0.16s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: calc(100% - 1.4rem);
        }
        .htl-fl > input:focus ~ label,
        .htl-fl > input:not(:placeholder-shown) ~ label,
        .htl-fl.htl-always > label {
          top: 0.4rem; font-size: 0.66rem; font-weight: 700; color: #2980b9;
        }
        .htl-fl > input:focus, .htl-fl > select:focus {
          border-color: #2980b9; background: #fff; box-shadow: 0 0 0 3px rgba(41,128,185,0.12);
        }

        /* Country-code picker */
        .htl-phone { display: flex; gap: 10px; }
        .htl-country { position: relative; flex: 0 0 auto; }
        .htl-country-btn { width: auto; display: flex; align-items: center; gap: 7px; font-weight: 600; cursor: pointer; white-space: nowrap; padding: 1rem; }
        .htl-country .htl-cdial { font-weight: 700; color: #0d2236; font-variant-numeric: tabular-nums; }
        .htl-caret { font-size: 0.6rem; opacity: 0.6; transition: transform 0.2s; }
        .htl-country.open .htl-caret { transform: rotate(180deg); }
        .htl-country.open .htl-country-btn { border-color: #2980b9; background: #fff; box-shadow: 0 0 0 3px rgba(41,128,185,0.12); }
        .htl-country-menu {
          position: absolute; z-index: 40; top: calc(100% + 6px); left: 0; width: 250px; max-height: 260px;
          overflow-y: auto; background: #fff; border: 1px solid #cfe0f0; border-radius: 14px;
          box-shadow: 0 20px 46px rgba(15,52,96,0.24); padding: 6px;
        }
        .htl-country-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 9px; cursor: pointer; font-size: 0.86rem; color: #0d2236; }
        .htl-country-item:hover { background: #eef5fb; }
        .htl-cflag { font-size: 1.15rem; }
        .htl-country-item .htl-cname { flex: 1; color: #3a5a78; }

        /* Address autocomplete dropdown */
        .htl-ac-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 5000; background: #fff; border: 1px solid #cfe0f0; border-radius: 10px; max-height: 210px; overflow-y: auto; box-shadow: 0 12px 30px rgba(15,52,96,0.16); }
        .htl-ac-item { padding: 0.7rem 1rem; cursor: pointer; border-bottom: 1px solid #eef5fb; }
        .htl-ac-item:last-child { border-bottom: none; }
        .htl-ac-item:hover { background: #eef5fb; }
        .htl-ac-main { font-weight: 500; font-size: 0.82rem; color: #0d2236; }
        .htl-ac-sub { font-size: 0.7rem; color: #7a99b5; margin-top: 1px; }

        /* Connected route + segmented vehicle */
        .htl-caplabel { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #3a5a78; margin: 0 0 9px; }
        .htl-route { position: relative; padding-left: 28px; }
        .htl-route:before { content: ""; position: absolute; left: 7px; top: 27px; bottom: 27px; width: 2px; background: linear-gradient(#2980b9, #7ec8f0); }
        .htl-pin { position: absolute; left: 0; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #2980b9; background: #fff; z-index: 1; }
        .htl-pin.p1 { top: 19px; }
        .htl-pin.p2 { bottom: 19px; border-color: #7ec8f0; background: #7ec8f0; }
        .htl-route .htl-fl + .htl-fl { margin-top: 13px; }
        .htl-seg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .htl-seg-opt { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.84rem; border-radius: 11px; padding: 13px 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; background: #eef5fb; border: 1.5px solid #dbe7f3; color: #1a5276; transition: background 0.16s, border-color 0.16s, color 0.16s, box-shadow 0.16s; }
        .htl-seg-opt.active { background: #2980b9; border-color: #2980b9; color: #fff; box-shadow: 0 6px 16px rgba(41,128,185,0.28); }

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

                  <div className="htl-fl">
                    <input id="htl-name" required placeholder=" " {...f('passenger_name')} />
                    <label htmlFor="htl-name">{t.passengerName}</label>
                  </div>

                  <div className="htl-phone">
                    <CountrySelect dial={dial} onChange={setDial} label={t.countryLabel} />
                    <div className="htl-fl" style={{ flex: 1 }}>
                      <input id="htl-phone" required type="tel" inputMode="tel" placeholder=" " {...f('passenger_phone')} />
                      <label htmlFor="htl-phone">{t.phone}</label>
                    </div>
                  </div>

                  <div className="htl-fl">
                    <input id="htl-email" type="email" placeholder=" " {...f('passenger_email')} />
                    <label htmlFor="htl-email">{t.email}</label>
                  </div>

                  <div className="htl-full">
                    <div className="htl-caplabel">{t.route}</div>
                    <div className="htl-route">
                      <span className="htl-pin p1" /><span className="htl-pin p2" />
                      <AutocompleteInput id="htl-pickup" label={t.pickup} value={form.pickup} onChange={val => setForm({...form, pickup: val})} />
                      <AutocompleteInput id="htl-dropoff" label={t.dropoff} value={form.dropoff} onChange={val => setForm({...form, dropoff: val})} />
                    </div>
                  </div>

                  <div className="htl-fl htl-always">
                    <input id="htl-date" required type="date" placeholder=" " {...f('date')} />
                    <label htmlFor="htl-date">{t.date}</label>
                  </div>

                  <div className="htl-fl htl-always">
                    <input id="htl-time" required type="time" placeholder=" " {...f('time')} />
                    <label htmlFor="htl-time">{t.time}</label>
                  </div>

                  <div className="htl-full">
                    <div className="htl-caplabel">{t.vehicle}</div>
                    <div className="htl-seg" role="group" aria-label={t.vehicle}>
                      <button type="button" className={`htl-seg-opt${form.vehicle === 'Taxi (1-4 Επιβάτες)' ? ' active' : ''}`}
                        aria-pressed={form.vehicle === 'Taxi (1-4 Επιβάτες)'}
                        onClick={() => setForm({ ...form, vehicle: 'Taxi (1-4 Επιβάτες)' })}>🚕 {t.taxiSeg}</button>
                      <button type="button" className={`htl-seg-opt${form.vehicle === 'Van (5-9 Επιβάτες)' ? ' active' : ''}`}
                        aria-pressed={form.vehicle === 'Van (5-9 Επιβάτες)'}
                        onClick={() => setForm({ ...form, vehicle: 'Van (5-9 Επιβάτες)' })}>🚐 {t.vanSeg}</button>
                    </div>
                  </div>

                  <div className="htl-fl htl-always">
                    <select id="htl-luggage" value={form.luggage} onChange={e => setForm({ ...form, luggage: e.target.value })}>
                      <option value="">{t.luggageSelect}</option>
                      {t.luggageOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                    <label htmlFor="htl-luggage">{t.luggage}</label>
                  </div>

                  <div className="htl-fl">
                    <input id="htl-flight" placeholder=" " {...f('flight_number')} />
                    <label htmlFor="htl-flight">{t.flight}</label>
                  </div>

                  <div className="htl-fl">
                    <input id="htl-notes" placeholder=" " {...f('notes')} />
                    <label htmlFor="htl-notes">{t.notes}</label>
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
