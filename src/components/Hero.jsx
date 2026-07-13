import { useState, useEffect } from 'react'
import { trackEvent } from '../lib/analytics'

// One destination = one set of 3 local photos that cycle every few
// seconds while that destination is showing. Drop your photos into
// public/destinations/ using these exact filenames and they'll appear
// automatically — no other code changes needed.
const SLIDES = [
  { label: 'Athens Airport', photos: ['/destinations/airport-1.jpg', '/destinations/airport-2.jpg', '/destinations/airport-3.jpg'] },
  { label: 'Meteora', photos: ['/destinations/meteora-1.jpg', '/destinations/meteora-2.jpg', '/destinations/meteora-3.jpg'] },
  { label: 'Cape Sounio', photos: ['/destinations/sounio-1.jpg', '/destinations/sounio-2.jpg', '/destinations/sounio-3.jpg'] },
  { label: 'Kalamata', photos: ['/destinations/kalamata-1.jpg', '/destinations/kalamata-2.jpg', '/destinations/kalamata-3.jpg'] },
  { label: 'Patra', photos: ['/destinations/patra-1.jpg', '/destinations/patra-2.jpg', '/destinations/patra-3.jpg'] },
  { label: 'Piraeus Port', photos: ['/destinations/piraeus-1.jpg', '/destinations/piraeus-2.jpg', '/destinations/piraeus-3.jpg'] },
]

// Flatten into one continuous list of photos for the hero carousel to
// cycle through, in order, looping back to the start.
const ALL_PHOTOS = SLIDES.flatMap(s => s.photos)

const translations = {
  en: {
    eyebrow: 'Licensed Taxi · Athens & Attica',
    title1: 'Your Ride,',
    title2: 'Done',
    titleEm: 'Right.',
    sub: 'A licensed Athens taxi driver, ready when you need a ride. Airport pickups, long trips, day tours — punctual, careful, and upfront about the price before you get in.',
    cta: 'Book a Ride',
    call: '+30 693 647 5451',
    trust: ['Licensed Driver', 'Available 24/7', 'Fixed Prices', 'Flight Monitoring'],
    stat1: '24/7', stat1label: 'Available',
    stat2: '100%', stat2label: 'Fixed price · No surprises',
  },
  gr: {
    eyebrow: 'Αδειούχο Ταξί · Αθήνα & Αττική',
    title1: 'Η Διαδρομή σας,',
    title2: 'Με',
    titleEm: 'Σιγουριά.',
    sub: 'Αδειούχος οδηγός ταξί στην Αθήνα, έτοιμος όταν τον χρειαστείτε. Αεροδρόμιο, μακρινές διαδρομές, εκδρομές — στην ώρα μας, με προσοχή, και με ξεκάθαρη τιμή πριν μπείτε στο αυτοκίνητο.',
    cta: 'Κλείστε Ταξί',
    call: '+30 693 647 5451',
    trust: ['Αδειούχος Οδηγός', 'Διαθέσιμοι 24/7', 'Σταθερές Τιμές', 'Παρακολούθηση Πτήσης'],
    stat1: '24/7', stat1label: 'Διαθέσιμοι',
    stat2: '100%', stat2label: 'Σταθερή τιμή · Χωρίς εκπλήξεις',
  }
}

export default function Hero({ lang }) {
  const t = translations[lang]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % ALL_PHOTOS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .hero-photo-panel { position: absolute; right: 0; top: 0; bottom: 0; width: calc(100% - 500px); min-width: 280px; overflow: hidden; }
        .hero-text-panel { position: relative; z-index: 2; width: 100%; max-width: 520px; background: #fff; padding: clamp(88px,11vw,126px) clamp(1.5rem,5.5vw,4.5rem) clamp(60px,7vw,88px); display: flex; flex-direction: column; justify-content: center; min-height: 100vh; }
        @media (max-width: 767px) {
          .hero-photo-panel { width: 100%; min-width: unset; }
          .hero-text-panel { background: rgba(255,255,255,0.55); backdrop-filter: blur(2px); max-width: 100%; }
        }
      `}</style>

      {/* Left white panel */}
      <div className="hero-text-panel">
        <div style={{
          fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--blue-bright)', fontWeight: 600, marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.7rem'
        }}>
          <span style={{ display: 'block', width: '26px', height: '2px', background: 'var(--blue-bright)', borderRadius: '1px', flexShrink: 0 }}/>
          {t.eyebrow}
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.1rem,4.8vw,3.5rem)',
          fontWeight: 700, color: 'var(--blue-deep)',
          lineHeight: 1.13, marginBottom: '1.4rem'
        }}>
          {t.title1}<br/>{t.title2} <em style={{ fontStyle: 'italic', color: 'var(--blue-bright)', fontWeight: 400 }}>{t.titleEm}</em>
        </h1>

        <p style={{
          fontSize: '0.88rem', color: 'var(--text-mid)',
          lineHeight: 1.82, marginBottom: '2.4rem', maxWidth: '400px'
        }}>{t.sub}</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.4rem' }}>
          <a href="#booking" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--blue-deep)', color: '#fff',
            padding: '0.88rem 1.9rem', borderRadius: '4px',
            fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            boxShadow: '0 4px 18px rgba(15,52,96,0.24)', transition: 'all 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-mid)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-deep)'; e.currentTarget.style.transform = 'translateY(0)' }}
            onClick={() => trackEvent('cta_click', { cta: 'hero_book_now' })}
          >
            {t.cta} →
          </a>
          <a href={`tel:${t.call.replace(/\s/g,'')}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            border: '1.5px solid var(--border)', color: 'var(--blue-deep)',
            padding: '0.88rem 1.4rem', borderRadius: '4px',
            fontSize: '0.73rem', fontWeight: 500, transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-bright)'; e.currentTarget.style.color = 'var(--blue-bright)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--blue-deep)' }}
            onClick={() => trackEvent('contact_phone_call', { method: 'hero_call_button' })}
          >
            📞 {t.call}
          </a>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem' }}>
          {t.trust.map(item => (
            <div key={item} style={{ fontSize: '0.7rem', color: 'var(--text-mid)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue-bright)', flexShrink: 0 }}/>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right photo panel */}
      <div className="hero-photo-panel">
        {ALL_PHOTOS.map((url, i) => (
          <div key={url} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${url}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease'
          }}/>
        ))}
      </div>
    </section>
  )
}