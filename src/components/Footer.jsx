import { Link } from 'react-router-dom'
import { trackPhoneCall, trackEmailContact, trackWhatsAppContact } from '../lib/analytics'

const translations = {
  en: {
    desc: 'A licensed taxi serving Athens and Attica. Honest prices, real punctuality, no fuss.',
    payment: 'POS · IRIS · Cash',
    nav: 'Navigate', contact: 'Contact', legal: 'Legal',
    links: [
      { label: 'Destinations', href: '#destinations' },
      { label: 'Book a Transfer', href: '#booking' },
      { label: 'The Vehicles', href: '#fleet' },
      { label: 'Rates', href: '#prices' },
      { label: 'Services', href: '#services' },
    ],
    rights: 'All rights reserved.',
    partnerPortal: 'Partner Portal',
  },
  gr: {
    desc: 'Αδειούχο ταξί στην Αθήνα και Αττική. Τίμιες τιμές, πραγματική ακρίβεια.',
    payment: 'POS · IRIS · Μετρητά',
    nav: 'Πλοήγηση', contact: 'Επικοινωνία', legal: 'Νομικά',
    links: [
      { label: 'Προορισμοί', href: '#destinations' },
      { label: 'Κράτηση', href: '#booking' },
      { label: 'Οχήματα', href: '#fleet' },
      { label: 'Τιμές', href: '#prices' },
      { label: 'Υπηρεσίες', href: '#services' },
    ],
    rights: 'Με επιφύλαξη παντός δικαιώματος.',
    partnerPortal: 'Πύλη Συνεργατών',
  }
}

export default function Footer({ lang }) {
  const t = translations[lang]
  const year = new Date().getFullYear()

  const headingStyle = {
    display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
    fontWeight: 600, marginBottom: '1rem'
  }

  const linkStyle = {
    display: 'block', color: 'rgba(255,255,255,0.52)',
    textDecoration: 'none', fontSize: '0.78rem',
    marginBottom: '0.6rem', transition: 'color 0.2s'
  }

  const iconBtnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
    color: '#fff', transition: 'background 0.2s, border-color 0.2s'
  }

  return (
    <footer style={{ background: 'var(--blue-deep)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 1.5rem 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '2rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/logo.jpg" alt="MO" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.2)' }}/>
              <div>
                <span style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 600, color: '#fff' }}>MO Transfers4all</span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Athens</span>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>{t.desc}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.75rem' }}>{t.payment}</p>

            {/* Social / contact icons */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.15rem' }}>
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61591744370335" target="_blank" rel="noopener noreferrer"
                aria-label="Facebook" style={iconBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = '#7ab3d9'; e.currentTarget.style.borderColor = '#7ab3d9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.91c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94Z"/></svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/mo.transfers4all?igsh=N3p4enhmaHNieG13" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram" style={iconBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = '#7ab3d9'; e.currentTarget.style.borderColor = '#7ab3d9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.46.66.25 1.21.6 1.76 1.15.5.5.84 1 1.15 1.76.24.64.41 1.37.46 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.46 2.43a4.9 4.9 0 0 1-1.15 1.76c-.5.5-1 .84-1.76 1.15-.64.24-1.37.41-2.43.46-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.46a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.24-.64-.41-1.37-.46-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.46-2.43.25-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.43 2.54c.64-.24 1.37-.41 2.43-.46C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.9.04-1.5.18-1.97.36-.5.19-.85.43-1.23.8-.37.38-.61.73-.8 1.23-.18.47-.32 1.07-.36 1.97C3.55 9.27 3.54 9.59 3.54 12s.01 2.73.06 3.78c.04.9.18 1.5.36 1.97.19.5.43.85.8 1.23.38.37.73.61 1.23.8.47.18 1.07.32 1.97.36 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.9-.04 1.5-.18 1.97-.36.5-.19.85-.43 1.23-.8.37-.38.61-.73.8-1.23.18-.47.32-1.07.36-1.97.05-1.05.06-1.37.06-3.78s-.01-2.73-.06-3.78c-.04-.9-.18-1.5-.36-1.97a3.1 3.1 0 0 0-.8-1.23 3.1 3.1 0 0 0-1.23-.8c-.47-.18-1.07-.32-1.97-.36C14.99 3.81 14.67 3.8 12 3.8Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-3.26a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>
              </a>

              {/* Email */}
              <a href="mailto:mo.transfers4all@gmail.com"
                aria-label="Email" style={iconBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = '#7ab3d9'; e.currentTarget.style.borderColor = '#7ab3d9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>

              {/* Map — placeholder pin location until a specific link is provided */}
              <a href="https://maps.google.com/?q=Athens,Greece" target="_blank" rel="noopener noreferrer"
                aria-label="Map" style={iconBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = '#7ab3d9'; e.currentTarget.style.borderColor = '#7ab3d9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <span style={headingStyle}>{t.nav}</span>
            {t.links.map((l, i) => (
              <a key={i} href={l.href} style={linkStyle}
                onMouseEnter={e => e.target.style.color = '#7ab3d9'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
              >{l.label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <span style={headingStyle}>{t.contact}</span>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.52)', lineHeight: 2.2 }}>
              <div style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 500, marginBottom: '0.2rem' }}>Marjus Oruci</div>
              <div>ΑΦΜ: 122559412</div>
              <a href="tel:+306936475451" style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', display: 'block' }} onClick={() => trackPhoneCall('Marjus', 'footer')}>+30 693 647 5451</a>
              <a href="tel:+306993605070" style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', display: 'block' }} onClick={() => trackPhoneCall('Martin', 'footer')}>+30 699 360 5070</a>
              <a href="tel:+306979638475" style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', display: 'block' }} onClick={() => trackPhoneCall('Roland', 'footer')}>+30 697 963 8475</a>
              <a href="mailto:mo.transfers4all@gmail.com" style={{ color: '#7ab3d9', textDecoration: 'none' }} onClick={() => trackEmailContact('footer')}>mo.transfers4all@gmail.com</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <span style={headingStyle}>{t.legal}</span>
            <Link to="/privacy" style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#7ab3d9'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
            >{lang === 'en' ? 'Privacy Policy' : 'Πολιτική Απορρήτου'}</Link>
            <Link to="/terms" style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#7ab3d9'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
            >{lang === 'en' ? 'Terms of Service' : 'Όροι Υπηρεσίας'}</Link>
            <Link to="/login" style={{ ...linkStyle, color: '#7ab3d9' }}>{t.partnerPortal}</Link>
          </div>

        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexWrap: 'wrap', gap: '1rem',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
            © {year} Marjus Oruci · MO Transfers4all Athens. {t.rights}
          </p>
          <a href="https://wa.me/306936475451" target="_blank" rel="noopener noreferrer"
            style={{ color: '#7ab3d9', fontSize: '0.72rem', textDecoration: 'none' }}
            onClick={() => trackWhatsAppContact(undefined, 'footer')}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}