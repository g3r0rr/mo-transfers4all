import { useState, useEffect } from 'react'
import { trackWhatsAppContact } from '../lib/analytics'

const CONTACTS = [
  { name: 'Marjus', phone: '306936475451' },
  { name: 'Martin', phone: '306993605070' },
  { name: 'Roland', phone: '306979638475' },
]

const translations = {
  en: {
    headerPill: 'Chat with us on WhatsApp',
    hint: 'Tap to open WhatsApp',
    contact: (name) => `Contact ${name}`,
    open: 'Contact us on WhatsApp',
    close: 'Close WhatsApp menu',
  },
  gr: {
    headerPill: 'Συνομιλήστε μαζί μας στο WhatsApp',
    hint: 'Πατήστε για άνοιγμα WhatsApp',
    contact: (name) => `Επικοινωνία με ${name}`,
    open: 'Επικοινωνία μέσω WhatsApp',
    close: 'Κλείσιμο μενού WhatsApp',
  }
}

export default function WhatsAppButton({ lang }) {
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(true)
  const t = translations[lang] || translations.en

  useEffect(() => {
    const tmr = setTimeout(() => setPulse(false), 4000)
    return () => clearTimeout(tmr)
  }, [])

  return (
    <>
      <style>{`
        @keyframes wa-entry {
          0%   { opacity: 0; transform: scale(0) rotate(-180deg); }
          60%  { transform: scale(1.12) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes wa-pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes bubble-in {
          0%   { opacity: 0; transform: translateY(14px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes label-slide {
          0%   { opacity: 0; transform: translateX(8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .wa-contact-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(37,211,102,0.18);
          border-left: 3px solid #25d366;
          border-radius: 14px;
          padding: 0.7rem 1.1rem 0.7rem 0.85rem;
          text-decoration: none;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(37,211,102,0.08);
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          backdrop-filter: blur(8px);
          animation: bubble-in 0.22s ease both;
          white-space: nowrap;
        }
        .wa-contact-card:hover {
          transform: translateY(-2px) translateX(-3px);
          box-shadow: 0 8px 32px rgba(37,211,102,0.22), 0 2px 8px rgba(0,0,0,0.08);
          border-left-color: #1ebe5d;
        }
        .wa-contact-card:nth-child(1) { animation-delay: 0.05s; }
        .wa-contact-card:nth-child(2) { animation-delay: 0.12s; }
        .wa-contact-card:nth-child(3) { animation-delay: 0.19s; }
        .wa-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #25d366 0%, #128c50 100%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37,211,102,0.3);
        }
        .wa-name { font-size: 0.82rem; font-weight: 700; color: #0d2236; letter-spacing: 0.01em; }
        .wa-hint { font-size: 0.67rem; color: #7a99b5; margin-top: 1px; }
        .wa-arrow { color: #25d366; margin-left: 0.25rem; font-size: 0.8rem; opacity: 0.7; }
        .wa-header-pill {
          background: rgba(255,255,255,0.97);
          border-radius: 10px;
          padding: 0.45rem 0.9rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: #3a5a78;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          box-shadow: 0 2px 12px rgba(0,0,0,0.09);
          border: 1px solid rgba(37,211,102,0.15);
          animation: label-slide 0.2s ease both;
          margin-bottom: 0.25rem;
          align-self: flex-end;
        }
        .wa-main-btn {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #25d366 0%, #1aaf57 100%);
          border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 22px rgba(37,211,102,0.48), 0 1px 4px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: wa-entry 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.2s both;
          position: relative;
          outline: none;
        }
        .wa-main-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 30px rgba(37,211,102,0.6), 0 2px 8px rgba(0,0,0,0.12);
        }
        .wa-main-btn:active { transform: scale(0.96); }
        .wa-pulse-ring {
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(37,211,102,0.5);
          animation: wa-pulse-ring 1.8s ease-out infinite;
          pointer-events: none;
        }
      `}</style>

      <div style={{
        position: 'fixed', bottom: '28px', right: '28px',
        zIndex: 8000, display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: '0.6rem'
      }}>

        {/* Contact list */}
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div className="wa-header-pill">{t.headerPill}</div>
            {CONTACTS.map((c, i) => (
              <a
                key={c.phone}
                href={`https://wa.me/${c.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-contact-card"
                aria-label={t.contact(c.name)}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => trackWhatsAppContact(c.name, 'whatsapp_widget')}
              >
                <div className="wa-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                <div>
                  <div className="wa-name">{c.name}</div>
                  <div className="wa-hint">{t.hint}</div>
                </div>
                <span className="wa-arrow">→</span>
              </a>
            ))}
          </div>
        )}

        {/* Main button */}
        <button
          onClick={() => { setOpen(!open); setPulse(false) }}
          className="wa-main-btn"
          aria-label={open ? t.close : t.open}
          aria-expanded={open}
        >
          {pulse && !open && <span className="wa-pulse-ring" />}
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
