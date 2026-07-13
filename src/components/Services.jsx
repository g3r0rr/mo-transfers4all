const translations = {
  en: {
    tag: 'What We Offer', title: 'How We Can', titleEm: 'Help',
    items: [
      { icon: '✈️', name: 'Airport Pickups', desc: 'We track your flight, meet you at arrivals, and wait if you\'re held up at customs.' },
      { icon: '🚢', name: 'Port & Ferries', desc: 'Piraeus rides for cruise passengers, island ferry connections and luggage pickups.' },
      { icon: '🏛️', name: 'Sightseeing', desc: 'Acropolis, Plaka, Cape Sounio — see the city at your own pace, we know our way around.' },
      { icon: '💼', name: 'Business Trips', desc: 'On time and no fuss — good for meetings, conferences or anything where punctuality matters.' },
      { icon: '🌊', name: 'Coastal Routes', desc: 'The Attic Riviera from Glyfada to Sounio — beaches, resorts and waterside restaurants.' },
      { icon: '🕐', name: 'Any Hour', desc: '5am departures, midnight arrivals. Just call ahead and we\'ll be there.' },
    ]
  },
  gr: {
    tag: 'Τι Προσφέρουμε', title: 'Πώς Μπορούμε', titleEm: 'να Βοηθήσουμε',
    items: [
      { icon: '✈️', name: 'Παραλαβή Αεροδρομίου', desc: 'Παρακολουθούμε την πτήση σας, σας παραλαμβάνουμε και περιμένουμε αν καθυστερήσετε.' },
      { icon: '🚢', name: 'Λιμάνι & Ferry', desc: 'Διαδρομές Πειραιά για κρουαζιερόπλοια, σύνδεση με ferry προς τα νησιά και αποσκευές.' },
      { icon: '🏛️', name: 'Αξιοθέατα', desc: 'Ακρόπολη, Πλάκα, Σούνιο — γνωρίστε την πόλη με τον δικό σας ρυθμό, ξέρουμε τους δρόμους.' },
      { icon: '💼', name: 'Επαγγελματικές Μετακινήσεις', desc: 'Στην ώρα μας, χωρίς καθυστερήσεις — για συναντήσεις ή όπου η ακρίβεια έχει σημασία.' },
      { icon: '🌊', name: 'Παράκτιες Διαδρομές', desc: 'Αττική Ριβιέρα από Γλυφάδα ως Σούνιο — παραλίες, θέρετρα, εστιατόρια.' },
      { icon: '🕐', name: 'Οποιαδήποτε Ώρα', desc: 'Αναχωρήσεις στις 5 πρωί, αφίξεις τα μεσάνυχτα. Καλέστε μας και θα είμαστε εκεί.' },
    ]
  }
}

export default function Services({ lang }) {
  const t = translations[lang]

  return (
    <section id="services" style={{ padding: '88px 1.5rem', background: 'var(--blue-deep)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag" style={{ color: '#7ab3d9' }}>{t.tag}</span>
          <h2 className="section-title" style={{ color: '#fff' }}>{t.title} <em style={{ color: '#7ab3d9' }}>{t.titleEm}</em></h2>
          <div className="blue-line" style={{ background: 'linear-gradient(90deg,#7ab3d9,rgba(122,179,217,0.2))' }}/>
        </div>
        <div className="reveal" style={{
          display: 'grid', gap: '1px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {t.items.map((item, i) => (
            <div key={i} style={{
              padding: '2rem 1.5rem', textAlign: 'center',
              background: 'var(--blue-deep)', transition: 'background 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--blue-deep)'}
            >
              <div style={{
                width: '84px', height: '84px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(122,179,217,0.18), rgba(122,179,217,0.05))',
                border: '1.5px solid rgba(122,179,217,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.6rem', margin: '0 auto 1.2rem',
                transition: 'transform 0.3s, border-color 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = '#7ab3d9' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(122,179,217,0.35)' }}
              >{item.icon}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{item.name}</div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}