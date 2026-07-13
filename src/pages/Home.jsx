import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import BookingForm from '../components/BookingForm.jsx'
import Fleet from '../components/Fleet.jsx'
import Prices from '../components/Prices.jsx'
import Services from '../components/Services.jsx'
import Destinations from '../components/Destinations.jsx'
import Footer from '../components/Footer.jsx'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import CookieConsent from '../components/CookieConsent.jsx'

// Per-language SEO metadata. The language now lives in the URL (/ vs /gr)
// so each version is a distinct, crawlable, indexable page for Google —
// not just a client-side toggle. This keeps <title>, description, canonical,
// og:*, twitter:*, and <html lang> in sync with whichever path is active.
const SEO = {
  en: {
    title: 'MO Transfers4all Athens | Licensed Taxi',
    description: 'A licensed taxi driver serving Athens and Attica. Airport pickups, long trips, day tours — punctual, fixed prices, no surprises.',
    url: 'https://mo-transfers4all.gr/',
    htmlLang: 'en'
  },
  gr: {
    title: 'MO Transfers4all Αθήνα | Αδειούχο Ταξί',
    description: 'Αδειούχο ταξί που εξυπηρετεί την Αθήνα και την Αττική. Μεταφορές αεροδρομίου, μεγάλες διαδρομές, ημερήσιες εκδρομές — με ακρίβεια, σταθερές τιμές, χωρίς εκπλήξεις.',
    url: 'https://mo-transfers4all.gr/gr',
    htmlLang: 'el'
  }
}

function setMetaContent(selector, attr, value) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const lang = location.pathname.startsWith('/gr') ? 'gr' : 'en'

  // Language switcher now navigates to a real, separate URL instead of
  // just flipping local state — this is what makes each language a page
  // search engines can crawl and rank independently.
  const setLang = (l) => navigate(l === 'gr' ? '/gr' : '/')

  useEffect(() => {
    const seo = SEO[lang]
    document.documentElement.lang = seo.htmlLang
    document.title = seo.title
    setMetaContent('meta[name="description"]', 'content', seo.description)
    setMetaContent('meta[property="og:title"]', 'content', seo.title)
    setMetaContent('meta[property="og:description"]', 'content', seo.description)
    setMetaContent('meta[property="og:url"]', 'content', seo.url)
    setMetaContent('meta[name="twitter:title"]', 'content', seo.title)
    setMetaContent('meta[name="twitter:description"]', 'content', seo.description)
    setMetaContent('link[rel="canonical"]', 'href', seo.url)
  }, [lang])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar lang={lang} setLang={setLang}/>
      <Hero lang={lang}/>
      <Services lang={lang}/>
      <Destinations lang={lang}/>
      <BookingForm lang={lang}/>
      <Fleet lang={lang}/>
      <Prices lang={lang}/>
      <Footer lang={lang}/>
      <WhatsAppButton lang={lang}/>
      <CookieConsent lang={lang}/>
    </>
  )
}
