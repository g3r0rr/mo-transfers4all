import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const en = {
  code: '404', title: 'Page Not Found',
  desc: 'The page you\'re looking for doesn\'t exist or has moved.',
  cta: 'Back to Home',
}
const gr = {
  code: '404', title: 'Η Σελίδα Δεν Βρέθηκε',
  desc: 'Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί.',
  cta: 'Επιστροφή στην Αρχική',
}

export default function NotFound() {
  const [lang, setLang] = useState(() => localStorage.getItem('mo-lang') || 'en')
  const t = lang === 'gr' ? gr : en

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <section style={{
        minHeight: '70vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '4rem 1.5rem', background: 'var(--off-white)'
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: '5rem', color: 'var(--blue-pale)', lineHeight: 1
        }}>{t.code}</div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 600,
          fontSize: '1.8rem', color: 'var(--blue-deep)', marginTop: '0.5rem'
        }}>{t.title}</h1>
        <p style={{ color: 'var(--text-mid)', marginTop: '0.75rem', maxWidth: '360px' }}>{t.desc}</p>
        <Link to="/" style={{
          marginTop: '2rem', background: 'var(--blue-deep)', color: '#fff',
          padding: '0.8rem 1.8rem', borderRadius: '6px', textDecoration: 'none',
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>{t.cta}</Link>
      </section>
      <Footer lang={lang} />
    </>
  )
}
