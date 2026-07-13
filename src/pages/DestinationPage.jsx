import { useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BookingForm from '../components/BookingForm.jsx'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import CookieConsent from '../components/CookieConsent.jsx'
import NotFound from './NotFound.jsx'
import { destinations, getDestination } from '../data/destinations.js'

const copy = {
  en: {
    home: 'Home', destinationsCrumb: 'Destinations',
    faqTitle: 'Frequently Asked', faqTitleEm: 'Questions',
    bookThis: 'Book This', bookThisEm: 'Transfer',
    otherTitle: 'Other', otherTitleEm: 'Destinations',
    from: 'From', duration: 'Duration',
  },
  gr: {
    home: 'Αρχική', destinationsCrumb: 'Προορισμοί',
    faqTitle: 'Συχνές', faqTitleEm: 'Ερωτήσεις',
    bookThis: 'Κλείστε Αυτή τη', bookThisEm: 'Διαδρομή',
    otherTitle: 'Άλλοι', otherTitleEm: 'Προορισμοί',
    from: 'Από', duration: 'Διάρκεια',
  }
}

function setMetaContent(selector, attr, value) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

function upsertJsonLd(id, data) {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function removeJsonLd(id) {
  const script = document.getElementById(id)
  if (script) script.remove()
}

export default function DestinationPage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const lang = location.pathname.startsWith('/gr') ? 'gr' : 'en'
  const dest = getDestination(lang, slug)
  const t = copy[lang]

  const setLang = (l) => navigate(`${l === 'gr' ? '/gr' : ''}/destinations/${slug}`)

  const enUrl = `https://mo-transfers4all.gr/destinations/${slug}`
  const grUrl = `https://mo-transfers4all.gr/gr/destinations/${slug}`
  const canonicalUrl = lang === 'gr' ? grUrl : enUrl

  const pageTitle = dest
    ? (lang === 'gr'
        ? `Ταξί προς ${dest.name} από Αθήνα | MO Transfers4all`
        : `${dest.name} Taxi Transfer from Athens | MO Transfers4all`)
    : ''

  const pageDescription = dest
    ? `${dest.cardDesc} ${t.from} ${dest.price} · ${dest.duration}.`
    : ''

  useEffect(() => {
    if (!dest) return

    document.documentElement.lang = lang === 'gr' ? 'el' : 'en'
    document.title = pageTitle
    setMetaContent('meta[name="description"]', 'content', pageDescription)
    setMetaContent('meta[property="og:title"]', 'content', pageTitle)
    setMetaContent('meta[property="og:description"]', 'content', pageDescription)
    setMetaContent('meta[property="og:url"]', 'content', canonicalUrl)
    setMetaContent('meta[name="twitter:title"]', 'content', pageTitle)
    setMetaContent('meta[name="twitter:description"]', 'content', pageDescription)
    setMetaContent('link[rel="canonical"]', 'href', canonicalUrl)

    // hreflang alternates are static in index.html for the homepage; for
    // these nested detail pages we manage them per-mount instead so each
    // slug's EN/GR pair is correctly cross-referenced for Google.
    document.querySelectorAll('link[data-dest-hreflang]').forEach(el => el.remove())
    const addAlt = (hreflang, href) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = hreflang
      link.href = href
      link.setAttribute('data-dest-hreflang', 'true')
      document.head.appendChild(link)
    }
    addAlt('en', enUrl)
    addAlt('el', grUrl)
    addAlt('x-default', enUrl)

    upsertJsonLd('dest-breadcrumb-schema', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.home, item: lang === 'gr' ? 'https://mo-transfers4all.gr/gr' : 'https://mo-transfers4all.gr/' },
        { '@type': 'ListItem', position: 2, name: t.destinationsCrumb, item: `${lang === 'gr' ? 'https://mo-transfers4all.gr/gr' : 'https://mo-transfers4all.gr'}/#destinations` },
        { '@type': 'ListItem', position: 3, name: dest.name, item: canonicalUrl }
      ]
    })

    upsertJsonLd('dest-service-schema', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Taxi transfer',
      name: pageTitle,
      description: dest.intro,
      url: canonicalUrl,
      provider: { '@type': 'LocalBusiness', name: 'MO Transfers4all Athens', telephone: '+30 693 647 5451' },
      areaServed: { '@type': 'City', name: 'Athens' },
      offers: {
        '@type': 'Offer',
        price: dest.price.replace(/[^0-9.]/g, ''),
        priceCurrency: 'EUR'
      }
    })

    upsertJsonLd('dest-faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: dest.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    })

    return () => {
      removeJsonLd('dest-breadcrumb-schema')
      removeJsonLd('dest-service-schema')
      removeJsonLd('dest-faq-schema')
      document.querySelectorAll('link[data-dest-hreflang]').forEach(el => el.remove())
    }
  }, [dest, lang, slug, pageTitle, pageDescription, canonicalUrl, enUrl, grUrl, t])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [dest])

  if (!dest) return <NotFound />

  const others = destinations[lang].filter(d => d.id !== slug)
  const basePath = lang === 'gr' ? '/gr' : ''

  return (
    <>
      <Navbar lang={lang} setLang={setLang}/>

      {/* Hero banner */}
      <section style={{ position: 'relative', minHeight: '58vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img src={dest.photos[0]} alt={dest.alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="eager"/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,37,64,0.92) 10%, rgba(10,37,64,0.45) 60%, rgba(10,37,64,0.25) 100%)' }}/>
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '120px', paddingBottom: '2.5rem' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
            <Link to={basePath || '/'} style={{ color: 'rgba(255,255,255,0.7)' }}>{t.home}</Link>
            <span style={{ margin: '0 0.4rem' }}>/</span>
            <Link to={`${basePath || '/'}#destinations`} style={{ color: 'rgba(255,255,255,0.7)' }}>{t.destinationsCrumb}</Link>
            <span style={{ margin: '0 0.4rem' }}>/</span>
            <span style={{ color: '#fff' }}>{dest.name}</span>
          </nav>

          <span style={{
            display: 'inline-block', fontSize: '0.63rem', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#7ec8f0', fontWeight: 600, marginBottom: '0.9rem'
          }}>{dest.tag}</span>

          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff',
            fontSize: 'clamp(2rem,5vw,3.3rem)', lineHeight: 1.15, marginBottom: '1.1rem', maxWidth: '760px'
          }}>{dest.name}</h1>

          <div style={{ display: 'flex', gap: '1.4rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '8px', padding: '0.6rem 1.1rem' }}>
              <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>{t.from}</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>{dest.price}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '8px', padding: '0.6rem 1.1rem' }}>
              <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>{t.duration}</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>{dest.duration}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + highlights */}
      <section style={{ padding: '72px 1.5rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <p className="reveal" style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.9, marginBottom: '2.5rem' }}>
            {dest.intro}
          </p>

          <div className="reveal" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'
          }}>
            <style>{`@media (max-width: 600px) { .dest-highlight-grid { grid-template-columns: 1fr !important; } }`}</style>
            {dest.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', background: 'var(--blue-mist)', borderRadius: '10px', padding: '1.1rem' }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{h.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--blue-deep)', marginBottom: '0.2rem' }}>{h.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '72px 1.5rem', background: 'var(--off-white)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="section-header reveal" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span className="section-tag">{t.faqTitle}</span>
            <h2 className="section-title">{t.faqTitle} <em>{t.faqTitleEm}</em></h2>
            <div className="blue-line" style={{ margin: '1.1rem 0 0' }}/>
          </div>
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dest.faq.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.2rem 1.4rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--blue-deep)', marginBottom: '0.5rem' }}>{f.q}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-mid)', lineHeight: 1.75 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA, prefilled with this route */}
      <BookingForm lang={lang} prefillPickup={dest.pickup} prefillDropoff={dest.dropoff}/>

      {/* Other destinations */}
      <section style={{ padding: '72px 1.5rem', background: '#fff' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">{t.otherTitle}</span>
            <h2 className="section-title">{t.otherTitle} <em>{t.otherTitleEm}</em></h2>
            <div className="blue-line"/>
          </div>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.9rem' }}>
            {others.map(o => (
              <Link key={o.id} to={`${basePath}/destinations/${o.id}`} style={{
                display: 'block', textAlign: 'center', padding: '1rem 0.75rem',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-deep)',
                transition: 'border-color 0.2s, background 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-bright)'; e.currentTarget.style.background = 'var(--blue-mist)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
              >{o.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang}/>
      <WhatsAppButton lang={lang}/>
      <CookieConsent lang={lang}/>
    </>
  )
}
