import { useState } from 'react'

const translations = {
  en: {
    tag: 'Our Vehicles', title: 'Choose Your', titleEm: 'Ride',
    taxiName: 'Taxi', taxiCap: '1 – 4 Passengers',
    taxiDesc: 'A licensed taxi for individuals and small groups — airport runs, business trips or just getting around the city. Air conditioning and bottled water included.',
    vanName: 'Van', vanCap: '5 – 9 Passengers',
    vanDesc: 'A roomier van for families and bigger groups. Plenty of luggage space, comfortable seating, and room to relax on longer trips.',
    features1: ['Air conditioning', 'Free Wi-Fi', 'Meet on arrival', 'Bottled water'],
    features2: ['Extra luggage space', 'Child seat available', 'USB charging', 'Panoramic windows'],
  },
  gr: {
    tag: 'Τα Οχήματά Μας', title: 'Επιλέξτε το', titleEm: 'Όχημά σας',
    taxiName: 'Ταξί', taxiCap: '1 – 4 Επιβάτες',
    taxiDesc: 'Αδειούχο ταξί για άτομα και μικρές ομάδες — αεροδρόμιο, επαγγελματικές μετακινήσεις ή απλά για μετακινήσεις στην πόλη. Κλιματισμός και εμφιαλωμένο νερό.',
    vanName: 'Van', vanCap: '5 – 9 Επιβάτες',
    vanDesc: 'Ευρύχωρο van για οικογένειες και μεγαλύτερες παρέες. Άπλετος χώρος για αποσκευές, άνετα καθίσματα και χώρος να χαλαρώσετε σε μεγαλύτερες διαδρομές.',
    features1: ['Κλιματισμός', 'Δωρεάν Wi-Fi', 'Υποδοχή στην άφιξη', 'Εμφιαλωμένο νερό'],
    features2: ['Επιπλέον χώρος αποσκευών', 'Παιδικό κάθισμα', 'Φόρτιση USB', 'Πανοραμικά παράθυρα'],
  }
}

function FleetCard({ name, cap, desc, features, photo, icon }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const showPhoto = photo && !photoFailed

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: '10px', overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,52,96,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Photo */}
      <div style={{
        height: '220px', position: 'relative', overflow: 'hidden',
        background: showPhoto ? '#000' : 'linear-gradient(135deg, var(--blue-deep), var(--blue-mid))',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {photo && (
          <img
            src={photo}
            alt={name}
            onError={() => setPhotoFailed(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              display: photoFailed ? 'none' : 'block'
            }}
          />
        )}
        {!showPhoto && <span style={{ fontSize: '5rem', opacity: 0.2 }}>{icon}</span>}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,52,96,0.6) 0%, transparent 60%)'
        }}/>
        <div style={{
          position: 'absolute', bottom: '1rem', left: '1.5rem',
          fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)', fontWeight: 600,
          background: 'rgba(15,52,96,0.6)', padding: '0.25rem 0.7rem',
          borderRadius: '20px', backdropFilter: 'blur(4px)'
        }}>{cap}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.8rem' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '0.75rem' }}>{name}</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '1.2rem' }}>{desc}</p>
        <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          {features.map((f, i) => (
            <li key={i} style={{ fontSize: '0.75rem', color: 'var(--text-mid)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue-bright)', flexShrink: 0 }}/>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Fleet({ lang }) {
  const t = translations[lang]

  return (
    <section id="fleet" style={{ padding: '88px 1.5rem', background: 'var(--off-white)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="blue-line"/>
        </div>
        <div className="reveal" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <FleetCard icon="🚖" name={t.taxiName} cap={t.taxiCap} desc={t.taxiDesc} features={t.features1} photo="/taxi-photo.jpg"/>
          <FleetCard icon="🚐" name={t.vanName} cap={t.vanCap} desc={t.vanDesc} features={t.features2} photo="/van-photo.jpg"/>
        </div>
      </div>
    </section>
  )
}