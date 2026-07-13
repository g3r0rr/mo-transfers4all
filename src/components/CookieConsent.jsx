import { useState, useEffect } from 'react'
import { trackEvent } from '../lib/analytics'

const COOKIE_KEY = 'mo-cookie-consent'

const translations = {
  en: {
    title: 'We use cookies',
    bodyPre: 'We use cookies to improve your experience, remember your preferences, and analyse how our site is used. By accepting, you agree to our',
    privacyLink: 'Privacy Policy',
    bodyMid: 'and',
    termsLink: 'Terms',
    accept: 'Accept all cookies',
    decline: 'Decline',
    aria: 'Cookie consent',
  },
  gr: {
    title: 'Χρησιμοποιούμε cookies',
    bodyPre: 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας, να θυμόμαστε τις προτιμήσεις σας και να αναλύουμε τη χρήση του ιστότοπου. Αποδεχόμενοι, συμφωνείτε με την',
    privacyLink: 'Πολιτική Απορρήτου',
    bodyMid: 'και τους',
    termsLink: 'Όρους',
    accept: 'Αποδοχή όλων των cookies',
    decline: 'Απόρριψη',
    aria: 'Συναίνεση cookies',
  }
}

export default function CookieConsent({ lang }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const t = translations[lang] || translations.en

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY)
    if (!stored) {
      const tmr = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(tmr)
    }
    // Returning visitor who already chose "accepted" — restore consent
    // so analytics resumes on this page load too.
    if (stored === 'accepted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
  }, [])

  const dismiss = (choice) => {
    setLeaving(true)
    setTimeout(() => {
      localStorage.setItem(COOKIE_KEY, choice)
      setVisible(false)
      setLeaving(false)

      if (choice === 'accepted' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { analytics_storage: 'granted' })
        // Send the pageview now that tracking is permitted, since the
        // initial config() call earlier was sent while consent was denied.
        trackEvent('page_view')
      }
    }, 380)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes cookie-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cookie-slide-down {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(24px); }
        }
        .cookie-banner {
          position: fixed;
          bottom: 28px;
          left: 28px;
          z-index: 7999;
          max-width: 420px;
          width: calc(100vw - 120px);
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(41,128,185,0.15);
          border-bottom: 3px solid var(--blue-bright, #2980b9);
          border-radius: 16px;
          box-shadow:
            0 8px 40px rgba(15,52,96,0.13),
            0 2px 8px rgba(0,0,0,0.06),
            0 0 0 1px rgba(255,255,255,0.8) inset;
          padding: 1.25rem 1.35rem 1.1rem;
          backdrop-filter: blur(12px);
          animation: cookie-slide-up 0.4s cubic-bezier(0.34,1.4,0.64,1) both;
        }
        .cookie-banner.leaving {
          animation: cookie-slide-down 0.38s ease both;
        }
        .cookie-icon-wrap {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #eef5fb 0%, #d6e8f7 100%);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(41,128,185,0.15);
        }
        .cookie-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.02rem;
          font-weight: 600;
          color: #0f3460;
          line-height: 1.2;
        }
        .cookie-body {
          font-size: 0.78rem;
          color: #3a5a78;
          line-height: 1.6;
          margin-top: 0.65rem;
        }
        .cookie-body a {
          color: #2980b9;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .cookie-body a:hover { color: #1a5276; }
        .cookie-btn-accept {
          flex: 1;
          background: linear-gradient(135deg, #2980b9 0%, #1a5276 100%);
          color: white;
          border: none;
          border-radius: 9px;
          padding: 0.58rem 0.9rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 2px 10px rgba(41,128,185,0.3);
          letter-spacing: 0.02em;
        }
        .cookie-btn-accept:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(41,128,185,0.42);
        }
        .cookie-btn-accept:active { transform: translateY(0); }
        .cookie-btn-decline {
          flex: 0 0 auto;
          background: transparent;
          color: #7a99b5;
          border: 1px solid #cfe0f0;
          border-radius: 9px;
          padding: 0.58rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .cookie-btn-decline:hover {
          background: #eef5fb;
          color: #3a5a78;
          border-color: #2980b9;
        }
        .cookie-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #25d366;
          display: inline-block;
          margin-right: 0.4rem;
          box-shadow: 0 0 0 2px rgba(37,211,102,0.2);
        }
        @media (max-width: 480px) {
          .cookie-banner { left: 12px; right: 96px; width: auto; max-width: none; bottom: 16px; }
        }
      `}</style>

      <div className={`cookie-banner${leaving ? ' leaving' : ''}`} role="dialog" aria-label={t.aria}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.7rem' }}>
          <div className="cookie-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#2980b9"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="cookie-title">
              <span className="cookie-dot" />
              {t.title}
            </div>
          </div>
        </div>

        <p className="cookie-body">
          {t.bodyPre}{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">{t.privacyLink}</a>
          {' '}{t.bodyMid}{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">{t.termsLink}</a>.
        </p>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', alignItems: 'center' }}>
          <button className="cookie-btn-accept" onClick={() => dismiss('accepted')}>
            {t.accept}
          </button>
          <button className="cookie-btn-decline" onClick={() => dismiss('declined')}>
            {t.decline}
          </button>
        </div>
      </div>
    </>
  )
}
