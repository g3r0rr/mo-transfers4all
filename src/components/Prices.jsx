const translations = {
  en: {
    tag: 'Transparent Pricing', title: 'Our', titleEm: 'Rates',
    taxi: 'Taxi', van: 'Van', notes: 'Notes',
    footnote: '🌙 Night rate applies between midnight and 05:00. All prices are fixed and include tolls. Payment: POS · IRIS · Cash.',
    airport: '✈️ Airport', coastal: '🌊 Coastal & Day Trips', port: '🚢 Port', local: '🏙️ Local',
    routes: {
      airport: [
        { route: 'Centre → Airport', taxi: '€50', van: '€95', note: '' },
        { route: 'Centre → Airport', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
        { route: 'Airport → Centre', taxi: '€50', van: '€95', note: '' },
        { route: 'Airport → Centre', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
      ],
      coastal: [
        { route: 'Centre → Sounio', taxi: '€95', van: 'On request', note: '+€25/hr wait' },
        { route: 'Centre → Lavrio', taxi: '€80', van: 'On request', note: '' },
        { route: 'Centre → Rafina', taxi: '€50', van: 'On request', note: '' },
        { route: 'Centre → Vouliagmeni', taxi: '€35', van: 'On request', note: '' },
        { route: 'Centre → Varkiza', taxi: '€40', van: 'On request', note: '' },
        { route: 'Centre → Glyfada', taxi: '€25', van: 'On request', note: '' },
        { route: 'Centre → Parnitha Cable Car', taxi: '€45', van: 'On request', note: '' },
      ],
      port: [
        { route: 'Centre → Piraeus', taxi: '€30', van: 'On request', note: '' },
        { route: 'Piraeus → Centre', taxi: '€35', van: 'On request', note: '' },
      ],
      local: []
    }
  },
  gr: {
    tag: 'Τιμοκατάλογος', title: 'Οι', titleEm: 'Τιμές Μας',
    taxi: 'Taxi', van: 'Van', notes: 'Σημειώσεις',
    footnote: '🌙 Νυχτερινή χρέωση μεταξύ μεσανύχτων και 05:00. Όλες οι τιμές είναι σταθερές και περιλαμβάνουν διόδια. Πληρωμή: POS · IRIS · Μετρητά.',
    airport: '✈️ Αεροδρόμιο', coastal: '🌊 Παράκτιες & Ημερήσιες', port: '🚢 Λιμάνι', local: '🏙️ Τοπικές',
    routes: {
      airport: [
        { route: 'Κέντρο → Αεροδρόμιο', taxi: '€50', van: '€95', note: '' },
        { route: 'Κέντρο → Αεροδρόμιο', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
        { route: 'Αεροδρόμιο → Κέντρο', taxi: '€50', van: '€95', note: '' },
        { route: 'Αεροδρόμιο → Κέντρο', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
      ],
      coastal: [
        { route: 'Κέντρο → Σούνιο', taxi: '€95', van: 'Κατόπιν συνεννόησης', note: '+€25/hr αναμονή' },
        { route: 'Κέντρο → Λαύριο', taxi: '€80', van: 'Κατόπιν συνεννόησης', note: '' },
        { route: 'Κέντρο → Ραφήνα', taxi: '€50', van: 'Κατόπιν συνεννόησης', note: '' },
        { route: 'Κέντρο → Βουλιαγμένη', taxi: '€35', van: 'Κατόπιν συνεννόησης', note: '' },
        { route: 'Κέντρο → Βάρκιζα', taxi: '€40', van: 'Κατόπιν συνεννόησης', note: '' },
        { route: 'Κέντρο → Γλυφάδα', taxi: '€25', van: 'Κατόπιν συνεννόησης', note: '' },
        { route: 'Κέντρο → Τελεφερίκ Παρνήθας', taxi: '€45', van: 'Κατόπιν συνεννόησης', note: '' },
      ],
      port: [
        { route: 'Κέντρο → Πειραιάς', taxi: '€30', van: 'Κατόπιν συνεννόησης', note: '' },
        { route: 'Πειραιάς → Κέντρο', taxi: '€35', van: 'Κατόπιν συνεννόησης', note: '' },
      ],
      local: []
    }
  }
}

function PriceRow({ row, t }) {
  const vanIsPrice = row.van.startsWith('€')
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.85rem 1rem',
      borderBottom: '1px solid var(--border)',
      borderLeft: row.night ? '3px solid var(--blue-bright)' : '3px solid transparent',
      background: row.night ? 'var(--blue-mist)' : '#fff',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mist)'}
      onMouseLeave={e => e.currentTarget.style.background = row.night ? 'var(--blue-mist)' : '#fff'}
    >
      {/* Route + note */}
      <div>
        <div style={{ fontSize: '0.83rem', color: 'var(--text-dark)', fontWeight: 400 }}>{row.route}</div>
        {row.note && <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>{row.note}</div>}
      </div>

      {/* Taxi price */}
      <div style={{ textAlign: 'right', minWidth: '64px' }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1px' }}>{t.taxi}</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--blue-deep)' }}>{row.taxi}</div>
      </div>

      {/* Van price */}
      <div style={{ textAlign: 'right', minWidth: '72px' }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1px' }}>{t.van}</div>
        {vanIsPrice
          ? <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--blue-deep)' }}>{row.van}</div>
          : <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontStyle: 'italic' }}>{row.van}</div>
        }
      </div>
    </div>
  )
}

function PriceGroup({ cat, rows, t }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{
        background: 'var(--blue-deep)', color: '#fff',
        padding: '0.65rem 1rem',
        fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700
      }}>{cat}</div>
      {rows.map((row, i) => <PriceRow key={i} row={row} t={t} />)}
    </div>
  )
}

export default function Prices({ lang }) {
  const t = translations[lang]

  const allGroups = [
    { cat: t.airport, rows: t.routes.airport },
    { cat: t.coastal, rows: t.routes.coastal },
    { cat: t.port, rows: t.routes.port },
  ]

  return (
    <section id="prices" style={{ padding: '88px 1.5rem', background: '#fff' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="blue-line"/>
        </div>

        <div className="reveal">
          {allGroups.map(g => <PriceGroup key={g.cat} cat={g.cat} rows={g.rows} t={t} />)}

          <div style={{
            fontSize: '0.72rem', color: 'var(--text-mid)',
            marginTop: '0.5rem', padding: '0.8rem 1rem',
            borderLeft: '3px solid var(--blue-bright)',
            background: 'var(--blue-mist)', borderRadius: '0 6px 6px 0', lineHeight: 1.7
          }}>{t.footnote}</div>
        </div>
      </div>
    </section>
  )
}
