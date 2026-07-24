import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { trackBookingSubmitted } from '../lib/analytics'
import { useGoogleAutocomplete } from '../lib/useGooglePlaces'
import { COUNTRIES } from '../lib/countries'

const translations = {
  en: {
    tag: 'Reservations', title: 'Book Your', titleEm: 'Ride',
    asideSub: 'Enter your route below and we\'ll confirm your ride promptly — fixed prices, no hidden fees, no surprises.',
    perks: [
      { icon: '✈️', label: 'Flight Monitoring', desc: 'We track your flight and adapt to any delays automatically.' },
      { icon: '💳', label: 'Flexible Payment', desc: 'Pay by card, IRIS or cash directly to the driver.' },
      { icon: '🔒', label: 'Data Privacy', desc: 'Your data is used only for this booking and deleted after your ride.' },
    ],
    name: 'Full Name', phone: 'Phone / WhatsApp', email: 'Email',
    route: 'Your Route', pickup: 'Pickup Location', dropoff: 'Drop-off Location',
    date: 'Date', time: 'Time', vehicle: 'Vehicle', luggage: 'Luggage',
    notes: 'Flight Number / Notes',
    taxiSeg: 'Taxi · 1–4', vanSeg: 'Van · 5–9',
    luggageSelect: '— Select —',
    luggageOpts: [
      { v: '0', l: 'No luggage' },
      { v: '1-2', l: '1–2 bags' },
      { v: '3-4', l: '3–4 bags' },
      { v: '5+', l: '5+ bags' },
    ],
    privacy: '🔒 Your personal data is used exclusively for this booking and permanently deleted after your transfer.',
    privacyLink: 'Privacy Policy',
    submit: 'Send Booking Request', sending: 'Sending...',
    success: '✅ Booking sent! We will contact you shortly.',
    error: '❌ An error occurred. Please call us directly.',
    needVehicle: 'Please choose a vehicle.',
    countryLabel: 'Country code',
  },
  gr: {
    tag: 'Κρατήσεις', title: 'Κλείστε', titleEm: 'Θέση',
    asideSub: 'Συμπληρώστε τη διαδρομή σας και θα επιβεβαιώσουμε τη διαδρομή σας άμεσα — σταθερές τιμές, χωρίς κρυφές χρεώσεις.',
    perks: [
      { icon: '✈️', label: 'Παρακολούθηση Πτήσης', desc: 'Παρακολουθούμε την πτήση σας και προσαρμοζόμαστε αυτόματα σε καθυστερήσεις.' },
      { icon: '💳', label: 'Ευέλικτη Πληρωμή', desc: 'Πληρωμή με κάρτα, IRIS ή μετρητά απευθείας στον οδηγό.' },
      { icon: '🔒', label: 'Απόρρητο Δεδομένων', desc: 'Τα δεδομένα σας χρησιμοποιούνται μόνο για αυτή την κράτηση και διαγράφονται μετά.' },
    ],
    name: 'Ονοματεπώνυμο', phone: 'Τηλ. / WhatsApp', email: 'Email',
    route: 'Η Διαδρομή σας', pickup: 'Σημείο Παραλαβής', dropoff: 'Προορισμός',
    date: 'Ημερομηνία', time: 'Ώρα', vehicle: 'Όχημα', luggage: 'Αποσκευές',
    notes: 'Αριθμός Πτήσης / Σημειώσεις',
    taxiSeg: 'Ταξί · 1–4', vanSeg: 'Van · 5–9',
    luggageSelect: '— Επιλογή —',
    luggageOpts: [
      { v: '0', l: 'Χωρίς αποσκευές' },
      { v: '1-2', l: '1–2 βαλίτσες' },
      { v: '3-4', l: '3–4 βαλίτσες' },
      { v: '5+', l: '5+ βαλίτσες' },
    ],
    privacy: '🔒 Τα προσωπικά σας δεδομένα χρησιμοποιούνται αποκλειστικά για αυτή την κράτηση και διαγράφονται μετά τη μεταφορά.',
    privacyLink: 'Πολιτική Απορρήτου',
    submit: 'Αποστολή Αιτήματος', sending: 'Αποστολή...',
    success: '✅ Η κράτηση στάλθηκε! Θα επικοινωνήσουμε σύντομα.',
    error: '❌ Παρουσιάστηκε σφάλμα. Παρακαλώ καλέστε μας.',
    needVehicle: 'Παρακαλώ επιλέξτε όχημα.',
    countryLabel: 'Κωδικός χώρας',
  }
}

// Exact strings stored in bookings.vehicle — always Greek, from both the EN
// and GR forms, because existing rows and downstream logic depend on them
// (see CLAUDE.md). Do not change without a data migration.
const VEHICLE_TAXI = 'Taxi (1-4 Επιβάτες)'
const VEHICLE_VAN = 'Van (5-9 Επιβάτες)'

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
    <div className={`bk-country${open ? ' open' : ''}`} ref={ref}>
      <button type="button" className="bk-country-btn"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
        aria-label={label} aria-expanded={open}>
        <span className="bk-cflag">{current.f}</span>
        <span className="bk-cdial">{current.d}</span>
        <span className="bk-caret">▾</span>
      </button>
      {open && (
        <div className="bk-country-menu" role="listbox">
          {COUNTRIES.map(c => (
            <div key={c.n} className="bk-country-item" role="option" aria-selected={c.d === dial}
              onClick={() => { onChange(c.d); setOpen(false) }}>
              <span className="bk-cflag">{c.f}</span>
              <span className="bk-cname">{c.n}</span>
              <span className="bk-cdial">{c.d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AutocompleteInput({ id, label, value, onChange }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
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
    <div className="bk-fl" style={{ position: 'relative' }}>
      <input
        id={id}
        type="text" value={value} placeholder=" " autoComplete="off" required
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      <label htmlFor={id}>{label}</label>
      {open && results.length > 0 && (
        <div className="bk-ac-menu">
          {results.map((f, i) => {
            const main = f.structured_formatting.main_text
            const sub = f.structured_formatting.secondary_text
            return (
              <div key={i} className="bk-ac-item" onMouseDown={() => { onChange(f.description); setOpen(false) }}>
                <div className="bk-ac-main">📍 {main}</div>
                <div className="bk-ac-sub">{sub}</div>
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
    date: '', time: '', vehicle: '', luggage: '', notes: ''
  })
  const [dial, setDial] = useState('+30')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  // Anti-spam. Neither of these is a hard security boundary (a script
  // hitting the Supabase REST endpoint directly bypasses both) — they
  // just cheaply block the naive form-filling bots that make up the bulk
  // of real-world spam, without a captcha's friction. If sophisticated
  // direct-API abuse ever appears, the next step is Cloudflare Turnstile
  // verified server-side. The DB dedup trigger (migration
  // 20260719000000_booking_antispam) is the server-side backstop.
  const honeypotRef = useRef('')      // hidden field; only bots fill it
  const mountedAt = useRef(Date.now()) // real users take a few seconds to fill the form

  useEffect(() => {
    if (prefillPickup || prefillDropoff) {
      setForm(f => ({ ...f, pickup: prefillPickup || f.pickup, dropoff: prefillDropoff || f.dropoff }))
    }
  }, [prefillPickup, prefillDropoff])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Spam checks: honeypot filled, or submitted implausibly fast (< 3s
    // after mount). Show the normal success message rather than an error
    // so a bot can't tell it was rejected and adapt.
    if (honeypotRef.current || (Date.now() - mountedAt.current) < 3000) {
      setMsg({ type: 'success', text: t.success })
      setForm({ name: '', phone: '', email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', luggage: '', notes: '' })
      return
    }

    // Vehicle is a segmented control, not a native <select required>, so
    // validate it ourselves before hitting the network.
    if (!form.vehicle) {
      setMsg({ type: 'error', text: t.needVehicle })
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const { error } = await supabase.from('bookings').insert([{
        source: 'website',
        passenger_name: form.name,
        // Prepend the selected country dial code so the stored number is
        // dialable as-is (e.g. "+30 6936475451").
        passenger_phone: `${dial} ${form.phone}`.trim(),
        passenger_email: form.email,
        pickup: form.pickup,
        dropoff: form.dropoff,
        date: form.date,
        time: form.time,
        vehicle: form.vehicle,
        luggage: form.luggage || null,
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
      setForm({ name: '', phone: '', email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', luggage: '', notes: '' })
    } catch (err) {
      setMsg({ type: 'error', text: err.message || t.error })
    }
    setLoading(false)
  }

  return (
    <section id="booking" style={{ padding: '88px 1.5rem', background: 'linear-gradient(165deg,#123c6e 0%,#0b2547 100%)' }}>
      <style>{`
        /* Booking form — white card floating on the deep-blue section, with
           Google-style outlined floating labels (label notches into the top
           border on focus/fill), a connected pickup→drop-off route, a
           segmented vehicle control and a country-code phone picker. All
           scoped with a bk- prefix so nothing leaks into the rest of the
           public site. */
        .bk-card { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 34px 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.34); }
        .bk-sub { color: var(--text-mid); font-size: 0.86rem; margin: 0 0 1.6rem; }
        .bk-stack { display: flex; flex-direction: column; gap: 15px; }
        .bk-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .bk-fl { position: relative; }
        .bk-fl > input, .bk-fl > select, .bk-country-btn {
          width: 100%; font-family: 'Inter', sans-serif; font-size: 0.92rem;
          color: var(--text-dark); background: #fff;
          border: 1.5px solid var(--border); border-radius: 12px;
          padding: 15px 14px; min-height: 54px; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s; -webkit-appearance: none;
        }
        .bk-fl > select { cursor: pointer; }
        .bk-fl > label {
          position: absolute; left: 12px; top: 15px; color: var(--text-mid);
          background: #fff; padding: 0 6px; font-size: 0.92rem; pointer-events: none;
          transition: top 0.16s, font-size 0.16s, color 0.16s;
          /* Never let a long label (e.g. the phone field, narrowed by the
             country picker) wrap to two lines and overlap the input; clip
             with an ellipsis instead. */
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: calc(100% - 18px);
        }
        .bk-fl > input:focus ~ label,
        .bk-fl > input:not(:placeholder-shown) ~ label,
        .bk-fl.bk-always > label {
          top: -8px; font-size: 0.7rem; font-weight: 700; color: var(--blue-bright);
        }
        .bk-fl > input:focus, .bk-fl > select:focus {
          border-color: var(--blue-bright); box-shadow: 0 0 0 3px rgba(41,128,185,0.12);
        }

        /* Country-code picker */
        .bk-phone { display: flex; gap: 10px; }
        .bk-country { position: relative; flex: 0 0 auto; }
        .bk-country-btn { width: auto; display: flex; align-items: center; gap: 7px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .bk-country .bk-cdial { font-weight: 700; color: var(--text-dark); font-variant-numeric: tabular-nums; }
        .bk-caret { font-size: 0.6rem; opacity: 0.6; transition: transform 0.2s; }
        .bk-country.open .bk-caret { transform: rotate(180deg); }
        .bk-country.open .bk-country-btn { border-color: var(--blue-bright); box-shadow: 0 0 0 3px rgba(41,128,185,0.12); }
        .bk-country-menu {
          position: absolute; z-index: 40; top: calc(100% + 6px); left: 0;
          width: 250px; max-height: 260px; overflow-y: auto; background: #fff;
          border: 1px solid var(--border); border-radius: 14px;
          box-shadow: 0 20px 46px rgba(15,52,96,0.24); padding: 6px;
          animation: bk-pop 0.16s ease both;
        }
        @keyframes bk-pop { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: none; } }
        .bk-country-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 9px; cursor: pointer; font-size: 0.86rem; color: var(--text-dark); }
        .bk-country-item:hover { background: var(--blue-mist); }
        .bk-cflag { font-size: 1.15rem; }
        .bk-country-item .bk-cname { flex: 1; color: var(--text-mid); }

        /* Connected route */
        .bk-caplabel { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-mid); margin: 2px 0 9px; }
        .bk-route { position: relative; padding-left: 28px; }
        .bk-route:before { content: ""; position: absolute; left: 7px; top: 27px; bottom: 27px; width: 2px; background: linear-gradient(var(--blue-bright), #7ec8f0); }
        .bk-pin { position: absolute; left: 0; width: 16px; height: 16px; border-radius: 50%; border: 3px solid var(--blue-bright); background: #fff; z-index: 1; }
        .bk-pin.p1 { top: 19px; }
        .bk-pin.p2 { bottom: 19px; border-color: #7ec8f0; background: #7ec8f0; }
        .bk-route .bk-fl + .bk-fl { margin-top: 13px; }

        /* Address autocomplete dropdown */
        .bk-ac-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 5000; background: #fff; border: 1px solid var(--border); border-radius: 10px; max-height: 220px; overflow-y: auto; box-shadow: 0 12px 30px rgba(15,52,96,0.16); }
        .bk-ac-item { padding: 0.7rem 1rem; cursor: pointer; border-bottom: 1px solid var(--border); font-size: 0.78rem; }
        .bk-ac-item:last-child { border-bottom: none; }
        .bk-ac-item:hover { background: var(--blue-mist); }
        .bk-ac-main { font-weight: 500; color: var(--text-dark); }
        .bk-ac-sub { font-size: 0.68rem; color: var(--text-light); }

        /* Segmented vehicle control */
        .bk-seg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .bk-seg-opt { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.84rem; border-radius: 11px; padding: 13px 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; background: var(--blue-mist); border: 1.5px solid #dbe7f3; color: var(--blue-mid); transition: background 0.16s, border-color 0.16s, color 0.16s, box-shadow 0.16s; }
        .bk-seg-opt.active { background: var(--blue-bright); border-color: var(--blue-bright); color: #fff; box-shadow: 0 6px 16px rgba(41,128,185,0.28); }

        .bk-fine { font-size: 0.72rem; line-height: 1.55; color: var(--text-mid); display: flex; gap: 8px; align-items: flex-start; }
        .bk-fine a { color: var(--blue-bright); font-weight: 600; }
        .bk-submit { width: 100%; border: none; border-radius: 13px; padding: 16px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; cursor: pointer; background: linear-gradient(135deg,#2f8fd0,#1a5276); box-shadow: 0 12px 26px rgba(0,0,0,0.3); transition: filter 0.2s; }
        .bk-submit:hover:not(:disabled) { filter: brightness(1.06); }
        .bk-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .bk-msg { margin-top: 2px; padding: 0.75rem; text-align: center; font-size: 0.8rem; border-radius: 8px; }

        .booking-perks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-top: 2.5rem; }
        @media (max-width: 700px) { .booking-perks { grid-template-columns: 1fr; gap: 0.85rem; } }
        @media (max-width: 520px) { .bk-grid2 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="container" style={{ maxWidth: '680px' }}>

        {/* Header */}
        <div className="section-header reveal" style={{ marginBottom: '1.6rem' }}>
          <span className="section-tag" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.tag}</span>
          <h2 className="section-title" style={{ color: '#fff' }}>{t.title} <em style={{ color: '#7ec8f0' }}>{t.titleEm}</em></h2>
          <div className="blue-line" style={{ background: 'linear-gradient(90deg,#7ec8f0,rgba(126,200,240,0.2))' }}/>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, maxWidth: '520px', margin: '1rem auto 0' }}>{t.asideSub}</p>
        </div>

        {/* Form card */}
        <div className="reveal">
          <form className="bk-card" onSubmit={handleSubmit}>
            {/* Honeypot: hidden from real users (and from assistive tech via
                aria-hidden), so anything that fills it is a bot. Kept out of
                the layout with off-screen positioning rather than
                display:none, since some bots skip display:none fields.
                Deliberately NOT named "website"/"url"/"phone" or anything
                else in the browser address-autofill vocabulary — Chrome
                ignores autocomplete="off" for address data, and an
                autofilled honeypot would silently swallow a real
                customer's booking (they'd see success, but no booking
                would exist). Naive bots fill every text input regardless
                of its name, so a neutral name loses nothing. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
              <label htmlFor="booking-extra-check">Leave this field empty</label>
              <input
                id="booking-extra-check"
                name="booking_extra_check"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                onChange={e => { honeypotRef.current = e.target.value }}
              />
            </div>

            <div className="bk-stack">

              <div className="bk-fl">
                <input id="booking-name" required placeholder=" " value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}/>
                <label htmlFor="booking-name">{t.name}</label>
              </div>

              <div className="bk-phone">
                <CountrySelect dial={dial} onChange={setDial} label={t.countryLabel}/>
                <div className="bk-fl" style={{ flex: 1 }}>
                  <input id="booking-phone" required type="tel" inputMode="tel" placeholder=" " value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}/>
                  <label htmlFor="booking-phone">{t.phone}</label>
                </div>
              </div>

              <div className="bk-fl">
                <input id="booking-email" required type="email" placeholder=" " value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}/>
                <label htmlFor="booking-email">{t.email}</label>
              </div>

              <div>
                <div className="bk-caplabel">{t.route}</div>
                <div className="bk-route">
                  <span className="bk-pin p1"/><span className="bk-pin p2"/>
                  <AutocompleteInput id="booking-pickup" label={t.pickup} value={form.pickup} onChange={val => setForm({ ...form, pickup: val })}/>
                  <AutocompleteInput id="booking-dropoff" label={t.dropoff} value={form.dropoff} onChange={val => setForm({ ...form, dropoff: val })}/>
                </div>
              </div>

              <div className="bk-grid2">
                <div className="bk-fl bk-always">
                  <input id="booking-date" required type="date" placeholder=" " value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}/>
                  <label htmlFor="booking-date">{t.date}</label>
                </div>
                <div className="bk-fl bk-always">
                  <input id="booking-time" required type="time" placeholder=" " value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}/>
                  <label htmlFor="booking-time">{t.time}</label>
                </div>
              </div>

              <div>
                <div className="bk-caplabel">{t.vehicle}</div>
                <div className="bk-seg" role="group" aria-label={t.vehicle}>
                  <button type="button" className={`bk-seg-opt${form.vehicle === VEHICLE_TAXI ? ' active' : ''}`}
                    aria-pressed={form.vehicle === VEHICLE_TAXI}
                    onClick={() => setForm({ ...form, vehicle: VEHICLE_TAXI })}>🚕 {t.taxiSeg}</button>
                  <button type="button" className={`bk-seg-opt${form.vehicle === VEHICLE_VAN ? ' active' : ''}`}
                    aria-pressed={form.vehicle === VEHICLE_VAN}
                    onClick={() => setForm({ ...form, vehicle: VEHICLE_VAN })}>🚐 {t.vanSeg}</button>
                </div>
              </div>

              <div className="bk-fl bk-always">
                <select id="booking-luggage" value={form.luggage}
                  onChange={e => setForm({ ...form, luggage: e.target.value })}>
                  <option value="">{t.luggageSelect}</option>
                  {t.luggageOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
                <label htmlFor="booking-luggage">{t.luggage}</label>
              </div>

              <div className="bk-fl">
                <input id="booking-notes" placeholder=" " value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}/>
                <label htmlFor="booking-notes">{t.notes}</label>
              </div>

              <div className="bk-fine">{t.privacy} <a href="/privacy">{t.privacyLink}</a></div>

              <button type="submit" className="bk-submit" disabled={loading}>
                {loading ? t.sending : t.submit}
              </button>

              {msg && (
                <div className="bk-msg" style={{
                  color: msg.type === 'success' ? '#166534' : '#b91c1c',
                  background: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
                  border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>{msg.text}</div>
              )}
            </div>
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
