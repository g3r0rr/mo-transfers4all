import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { destinations } from '../data/destinations'

const copy = {
  en: {
    tag: 'Where We Go',
    title: 'Popular',
    titleEm: 'Destinations',
    sub: 'From Athens airport to the most breathtaking corners of Greece — we take you there safely and comfortably.',
    from: 'from',
    book: 'Explore →',
    anywhere: 'Don\'t see your destination? We go anywhere in Greece — use the booking form below.',
  },
  gr: {
    tag: 'Προορισμοί',
    title: 'Δημοφιλείς',
    titleEm: 'Προορισμοί',
    sub: 'Από το αεροδρόμιο της Αθήνας μέχρι τις πιο εντυπωσιακές γωνιές της Ελλάδας — σας πάμε εκεί με ασφάλεια και άνεση.',
    from: 'από',
    book: 'Δείτε περισσότερα →',
    anywhere: 'Δεν βλέπετε τον προορισμό σας; Πηγαίνουμε παντού στην Ελλάδα — χρησιμοποιήστε τη φόρμα κράτησης.',
  }
}

export default function Destinations({ lang }) {
  const t = copy[lang]
  const list = destinations[lang]

  const wide = list.find(d => d.wide)
  const rest = list.filter(d => !d.wide)

  const Card = ({ dest, isWide }) => {
    const [photoIndex, setPhotoIndex] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setPhotoIndex(prev => (prev + 1) % dest.photos.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [dest.photos.length])

    // Each card is a real, crawlable link to the destination's own page
    // (src/pages/DestinationPage.jsx) rather than a same-page scroll —
    // that dedicated page is what search engines can actually index and
    // rank for destination-specific searches.
    const href = `${lang === 'gr' ? '/gr' : ''}/destinations/${dest.id}`

    return (
      <Link
        to={href}
        style={{
          position: 'relative', borderRadius: '10px', overflow: 'hidden',
          cursor: 'pointer', gridColumn: isWide ? 'span 2' : 'span 1',
          aspectRatio: isWide ? 'unset' : '3/4',
          minHeight: isWide ? '280px' : 'unset',
          display: 'block', textDecoration: 'none'
        }}
      >
        {dest.photos.map((photo, i) => (
          <img
            key={photo}
            src={photo}
            alt={dest.alt}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: i === photoIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,37,64,0.82) 0%, rgba(10,37,64,0.2) 55%, transparent 100%)'
        }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.4rem' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isWide ? '1.55rem' : '1.2rem',
            fontWeight: 600, color: '#fff', lineHeight: 1.2, marginBottom: '0.3rem'
          }}>{dest.name}</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: '0.8rem' }}>{dest.cardDesc}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#7ab3d9', fontWeight: 600,
              background: 'rgba(10,37,64,0.65)', padding: '0.28rem 0.7rem',
              borderRadius: '20px', backdropFilter: 'blur(4px)'
            }}>{t.from} {dest.price}</span>
            <span style={{
              fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#fff', opacity: 0.85
            }}>{t.book}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <section id="destinations" style={{ padding: '88px 1.5rem', background: 'var(--blue-deep)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag" style={{ color: '#7ab3d9' }}>{t.tag}</span>
          <h2 className="section-title" style={{ color: '#fff' }}>
            {t.title} <em style={{ color: '#7ab3d9' }}>{t.titleEm}</em>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem' }}>{t.sub}</p>
          <div className="blue-line" style={{ background: 'linear-gradient(90deg,#7ab3d9,rgba(122,179,217,0.2))' }}/>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .dest-grid { grid-template-columns: 1fr !important; }
            .dest-grid > a[style*="span 2"] { grid-column: span 1 !important; aspect-ratio: 16/9 !important; min-height: unset !important; }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .dest-grid { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>

        <div className="reveal dest-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem' }}>
          <Card dest={wide} isWide={true}/>
          {rest.map(d => <Card key={d.id} dest={d} isWide={false}/>)}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
          {t.anywhere}
        </p>
      </div>
    </section>
  )
}
