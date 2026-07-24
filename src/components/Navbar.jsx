import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const translations = {
  en: { book: 'Book Now', fleet: 'Fleet', services: 'Services', prices: 'Rates', destinations: 'Destinations', home: 'Home', portal: 'Portal', menu: 'Menu' },
  gr: { book: 'Κράτηση', fleet: 'Στόλος', services: 'Υπηρεσίες', prices: 'Τιμές', destinations: 'Προορισμοί', home: 'Αρχική', portal: 'Πύλη', menu: 'Μενού' }
}

export default function Navbar({ lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = translations[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(255,255,255,0.97)',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(14px)',
    boxShadow: scrolled ? '0 2px 18px rgba(15,52,96,0.1)' : '0 2px 18px rgba(15,52,96,0.07)',
    padding: '0 1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '68px', transition: 'box-shadow 0.3s'
  }

  const linkStyle = {
    color: 'var(--text-mid)', fontSize: '0.73rem', letterSpacing: '0.08em',
    textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.2s'
  }

  return (
    <>
      <style>{`
        .nav-desktop-links { display: flex; }
        .nav-book-btn { display: inline-flex; }
        .nav-burger { display: none; }

        @media (max-width: 767px) {
          .nav-desktop-links { display: none; }
          .nav-book-btn { display: none; }
          .nav-burger { display: block; }
        }

        /* Burger icon that morphs into an X when the menu opens. The three
           bars are absolutely positioned so the top/bottom can rotate about
           the middle to form the cross while the middle bar fades out. */
        .nav-burger {
          position: relative;
          width: 26px; height: 20px;
          background: none; border: none; cursor: pointer; padding: 0;
        }
        .nav-burger span {
          position: absolute; left: 2px;
          display: block; width: 22px; height: 2px; border-radius: 2px;
          background: var(--blue-deep);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease;
        }
        .nav-burger span:nth-child(1) { top: 3px; }
        .nav-burger span:nth-child(2) { top: 9px; }
        .nav-burger span:nth-child(3) { top: 15px; }
        .nav-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0.3); }
        .nav-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Mobile menu: stays mounted so it can animate both open AND closed
           (a conditionally-rendered element can only animate in). It slides
           down + fades, and the links stagger in behind it. visibility
           toggles so a closed menu isn't focusable/tabbable. */
        .nav-menu {
          position: fixed; top: 68px; left: 0; right: 0;
          background: #fff; border-bottom: 1px solid var(--border);
          z-index: 999; box-shadow: 0 8px 32px rgba(15,52,96,0.12);
          transform: translateY(-14px); opacity: 0; visibility: hidden;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.24s ease, visibility 0.3s;
        }
        .nav-menu.open { transform: translateY(0); opacity: 1; visibility: visible; }
        .nav-menu > a {
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .nav-menu.open > a { opacity: 1; transform: translateX(0); }
        .nav-menu.open > a:nth-child(1) { transition-delay: 0.05s; }
        .nav-menu.open > a:nth-child(2) { transition-delay: 0.09s; }
        .nav-menu.open > a:nth-child(3) { transition-delay: 0.13s; }
        .nav-menu.open > a:nth-child(4) { transition-delay: 0.17s; }
        .nav-menu.open > a:nth-child(5) { transition-delay: 0.21s; }
        .nav-menu.open > a:nth-child(6) { transition-delay: 0.25s; }
        .nav-menu.open > a:nth-child(7) { transition-delay: 0.29s; }
      `}</style>

      <nav style={navStyle}>
        {/* Logo */}
        <a href={lang === 'gr' ? '/gr' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpg" alt="MO Transfers4all" style={{
            width: '46px', height: '46px', borderRadius: '50%',
            objectFit: 'cover', border: '2px solid var(--blue-bright)', flexShrink: 0
          }}/>
          <div>
            <span style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '0.98rem', fontWeight: 600, color: 'var(--blue-deep)', letterSpacing: '0.04em' }}>MO Transfers4all</span>
            <span style={{ display: 'block', fontSize: '0.56rem', color: 'var(--blue-bright)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>Athens · Greece</span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="nav-desktop-links" style={{ listStyle: 'none', gap: '2rem' }}>
          {[['#destinations', t.destinations], ['#booking', t.book], ['#fleet', t.fleet], ['#prices', t.prices], ['#services', t.services]].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={linkStyle}
                onMouseEnter={e => e.target.style.color = 'var(--blue-deep)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-mid)'}
              >{label}</a>
            </li>
          ))}
          <li><Link to="/login" style={{ ...linkStyle, color: 'var(--blue-bright)' }}>{t.portal}</Link></li>
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            {['en', 'gr'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: lang === l ? 'var(--blue-deep)' : 'transparent',
                color: lang === l ? '#fff' : 'var(--text-mid)',
                border: 'none', fontFamily: 'Inter, sans-serif',
                fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.08em',
                padding: '0.28rem 0.62rem', cursor: 'pointer', textTransform: 'uppercase'
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <a href="#booking" className="nav-book-btn btn-tap" style={{
            alignItems: 'center', background: 'var(--blue-deep)', color: '#fff',
            padding: '0.48rem 1.1rem', borderRadius: '4px',
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>{t.book}</a>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`nav-burger${menuOpen ? ' open' : ''}`}
            aria-label={t.menu}
            aria-expanded={menuOpen}
          >
            {[0,1,2].map(i => <span key={i}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu — always mounted, animated via the .open class so it
          can slide/fade on close as well as open. */}
      <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
          {[
            { href: lang === 'gr' ? '/gr' : '/', label: t.home, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
            { href: '#destinations', label: t.destinations, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> },
            { href: '#booking', label: t.book, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { href: '#fleet', label: t.fleet, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
            { href: '#prices', label: t.prices, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
            { href: '#services', label: t.services, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
          ].map(({ href, label, icon }, i, arr) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              padding: '0.95rem 1.5rem',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              color: (href === '/' || href === '/gr') ? 'var(--blue-deep)' : 'var(--text-dark)',
              fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase',
              fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mist)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'var(--blue-bright)', flexShrink: 0 }}>{icon}</span>
              {label}
            </a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            padding: '0.95rem 1.5rem',
            color: 'var(--blue-bright)', fontSize: '0.82rem',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            fontWeight: 600, textDecoration: 'none',
            background: 'var(--blue-mist)', borderTop: '2px solid var(--blue-bright)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {t.portal}
          </Link>
      </div>
    </>
  )
}
